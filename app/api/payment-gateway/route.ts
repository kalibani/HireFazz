import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// midtrans doesn't have typescript types
// @ts-ignore
import Midtrans from 'midtrans-client';
import { currentUser } from '@/lib/auth';
import prismadb from '@/lib/prismadb';
import { TopupStatus } from '@prisma/client';

const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    const {
      id,
      name,
      price,
      required,
      start_time,
      interval_unit,
      orgId,
      token: tokenParams,
      referralCode,
    } = await request.json();
    const orderId = 'TOPUP-' + uuidv4();
    const params = {
      item_details: {
        id,
        name,
        price,
        quantity: 1,
      },
      transaction_details: {
        order_id: orderId,
        gross_amount: price,
      },
      recurring: {
        required: required,
        start_time: start_time,
        interval_unit: interval_unit,
      },
    };

    const token = await snap.createTransactionToken(params);
    await prismadb.topup.create({
      data: {
        createdBy: user?.id || '',
        orderId: orderId,
        amount: price,
        orgId,
        token: tokenParams,
        referralCode: referralCode,
        histories: {
          create: {
            action: TopupStatus.CREATED,
            additionalData: {
              token: tokenParams,
              price,
              createdBy: user?.id || '',
            },
          },
        },
      },
    });
    return NextResponse.json({ token });
  } catch (error) {
    console.log(error, '<<<<');
    return NextResponse.json(
      { error: 'opps, something went wrong' },
      { status: 500 },
    );
  }
}
