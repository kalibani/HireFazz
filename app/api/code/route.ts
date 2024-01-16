import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { openai } from "@/lib/openai";

export const preferredRegion = "sin1";
export const maxDuration = 50;

const instructionMessage = {
  role: "system",
  content:
    "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations.",
};

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai) {
      return new NextResponse("OpenAI APIKey not configured", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit(userId);

    if (!freeTrial) {
      return new NextResponse("Free Trial has expired", {
        status: 403,
      });
    }

    const response = await openai.chat.completions.create({
      messages: [instructionMessage, ...messages],
      model: "gpt-4",
    });

    await increaseApiLimit(userId);

    return NextResponse.json(response.choices);
  } catch (error) {
    console.log("Code Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
