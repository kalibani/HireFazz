import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { openai } from "@/lib/openai";

export const preferredRegion = "sin1";
export const maxDuration = 50;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt, amount = 1, resolution = "512x512" } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai) {
      return new NextResponse("OpenAI APIKey not configured", { status: 500 });
    }

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!amount) {
      return new NextResponse("Amount is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    if (!freeTrial) {
      return new NextResponse("Free Trial has expired", {
        status: 403,
      });
    }

    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    await increaseApiLimit();

    return NextResponse.json(response.data);
  } catch (error) {
    console.log("Image Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
