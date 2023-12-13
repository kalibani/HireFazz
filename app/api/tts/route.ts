import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { SendMessageValidator } from "@/lib/validators/sendTextValidator";

// import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { openai } from "@/lib/openai";

export const preferredRegion = "sin1";
export const maxDuration = 50;

const speechFile = path.resolve(__dirname, "./speech.mp3");

async function streamToFile(stream: NodeJS.ReadableStream, path: fs.PathLike) {
  return new Promise((resolve, reject) => {
    const writeStream = fs
      .createWriteStream(path)
      .on("error", reject)
      .on("finish", resolve);

    stream.pipe(writeStream).on("error", (error) => {
      writeStream.close();
      reject(error);
    });
  });
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { text } = SendMessageValidator.parse(body);

    const headers = req.headers;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!openai) {
      return new NextResponse("OpenAI APIKey not configured", { status: 500 });
    }

    if (!text) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    // const freeTrial = await checkApiLimit();

    // if (!freeTrial) {
    //   return new NextResponse("Free Trial has expired", {
    //     status: 403,
    //   });
    // }

    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });
    // @ts-ignore
    // const response = await streamToFile(mp3.body, speechFile);

    // console.log(speechFile);
    const audioData = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, audioData);

    // await increaseApiLimit();

    return new Response(audioData, {
      headers: {
        "Content-Type": "audio/mpeg", // Adjust the content type based on the actual audio format
      },
    });
  } catch (error: any) {
    console.log("Conversation Error", error);
    return new NextResponse(error, { status: 500 });
  }
}
