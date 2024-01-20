import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// midtrans doesn't have typescript types
// @ts-ignore
import Midtrans from "midtrans-client";

const snap = new Midtrans.Snap({
  isProduction: process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "TRUE",
  serverKey: process.env.NEXT_PUBLIC_MIDTRANS_SERVER_KEY,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
});

export async function POST(request: NextRequest) {
  const { id, name, price } = await request.json();

  const params = {
    item_details: {
      id,
      name,
      price,
      quantity: 1,
    },
    transaction_details: {
      order_id: "ORDER-" + uuidv4(),
      gross_amount: price,
    },
  };

  const token = await snap.createTransactionToken(params);

  return NextResponse.json({ token });
}
