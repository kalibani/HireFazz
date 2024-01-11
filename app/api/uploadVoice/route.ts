import { UTApi } from "uploadthing/server";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const utapi = new UTApi();

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const formData = await req.formData();
    const files = formData.get("files");

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!files) {
      return new NextResponse("files are required", { status: 400 });
    }

    const response = await utapi.uploadFiles(files);

    return NextResponse.json(response);
  } catch (error) {
    console.log("Code Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
