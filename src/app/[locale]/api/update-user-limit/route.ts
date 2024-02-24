import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { increaseApiLimit } from "@/lib/api-limit";

export const preferredRegion = "sin1";
export const maxDuration = 50;

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await increaseApiLimit(userId);

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.log("Code Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
