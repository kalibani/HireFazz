import prismadb from '@/lib/prismadb';
import { TopupStatus } from '@prisma/client';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

// {
//   "transaction_time": "2023-11-15 18:45:13",
//   "transaction_status": "settlement",
//   "transaction_id": "513f1f01-c9da-474c-9fc9-d5c64364b709",
//   "status_message": "midtrans payment notification",
//   "status_code": "200",
//   "signature_key": "9f52cc1fcc0f269e2dcca659d2bff5969af52af400e5222d9438f182f537d08116f0302bacfd305f694cca06f38bb16a69167a0dc552fc554df8746c6511637f",
//   "settlement_time": "2023-11-15 22:45:13",
//   "payment_type": "gopay",
//   "order_id": "payment_notif_test_G256677178_6634fc7a-b0d8-4506-b913-bcc01499e34c",
//   "merchant_id": "G256677178",
//   "gross_amount": "105000.00",
//   "fraud_status": "accept",
//   "currency": "IDR"
// }

// const options = {
//   method: 'GET',
//   url: 'https://api.sandbox.midtrans.com/v2/ORDER-4b0dc619-0e25-48a9-9369-8ef2fd040abe/status',
//   headers: {
//     accept: 'application/json',
//     authorization: 'Basic U0ItTWlkLXNlcnZlci1ITTFCa2dsMTBLSnZzQlZjeWR4RElSSmc6',
//   },
// };

// axios
//   .request(options)
//   .then(function (response) {
//     console.log(response.data);
//   })
//   .catch(function (error) {
//     console.error(error);
//   });
// {
//   "status_code": "200",
//   "transaction_id": "a016f6da-0bbb-4aaf-aa9f-eb98c7b14aa5",
//   "gross_amount": "249000.00",
//   "currency": "IDR",
//   "order_id": "ORDER-4b0dc619-0e25-48a9-9369-8ef2fd040abe",
//   "payment_type": "cstore",
//   "signature_key": "c82abea33421ab77ec07278550621cf8262346686c6a83f5a87a811e9fd5dc32ef0035016fca12b542ef77e9feb30f350b9f4a455b01b1cb1515f200de41c396",
//   "transaction_status": "settlement",
//   "fraud_status": "accept",
//   "status_message": "Success, transaction is found",
//   "merchant_id": "G256677178",
//   "payment_code": "781518219781",
//   "store": "indomaret",
//   "transaction_time": "2024-05-27 19:57:37",
//   "settlement_time": "2024-05-27 19:57:52",
//   "expiry_time": "2024-05-28 19:57:37"
// }

const accessToken = btoa(`${process.env.MIDTRANS_SERVER_KEY}:`);
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const options = {
      method: 'GET',
      url: `https://api.sandbox.midtrans.com/v2/${body.order_id}/status`,
      headers: {
        accept: 'application/json',
        authorization: `Basic ${accessToken}`,
      },
    };
    const { data } = await axios.request(options);
    const topupDb = await prismadb.topup.findUniqueOrThrow({
      where: { orderId: data.order_id },
      select: {
        status: true,
        orgId: true,
        token: true,
        id: true,
        refferal: {
          select: {
            extraToken: true,
          },
        },
      },
    });
    let type: TopupStatus | null = null;
    const trxStatus = (data.transaction_status || '').toLowerCase();
    if (trxStatus === 'pending' && topupDb.status !== TopupStatus.PENDING) {
      type = TopupStatus.PENDING;
      await prismadb.topup.update({
        where: { orderId: data.order_id },
        data: {
          status: TopupStatus.PENDING,
        },
      });
    }
    if (trxStatus === 'expired' && topupDb.status !== TopupStatus.EXPIRED) {
      type = TopupStatus.EXPIRED;
      await prismadb.topup.update({
        where: { orderId: data.order_id },
        data: {
          status: TopupStatus.EXPIRED,
        },
      });
    }

    // settle status and update data
    if (
      trxStatus === 'settlement' &&
      topupDb.status !== TopupStatus.SETTLEMENT
    ) {
      type = TopupStatus.SETTLEMENT;
      await prismadb.topup.update({
        where: {
          orderId: data.order_id,
          status: { not: TopupStatus.SETTLEMENT },
        },
        data: {
          status: TopupStatus.SETTLEMENT,
        },
      });
      const addToken = topupDb.token + (topupDb.refferal?.extraToken || 0);
      await prismadb.organization.update({
        where: { id: topupDb.orgId },
        data: {
          limit: {
            increment: addToken,
          },
        },
      });
    }
    if (type) {
      await prismadb.topupHistory.create({
        data: {
          additionalData: data,
          topupId: topupDb.id,
          action: type,
        },
      });
    }
    return NextResponse.json({ message: 'oke' });
  } catch (error) {
    return NextResponse.json(
      { error: 'opps, something went wrong' },
      { status: 500 },
    );
  }
}
