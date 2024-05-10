import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, { params }: { params: Record<string, string> }) => {
    try {  
      if (!params.id) {
        return new NextResponse('Not Found', { status: 404 })
      }
  
      const cvAnalysis = await prismadb.cvAnalysis.delete({
        where: {
          id: params.id,
        },
      });
  
      return NextResponse.json(cvAnalysis, { status: 200 })
    } catch (error) {
      console.log('error api', error);
      return NextResponse.json('Internal Server Error', { status: 500 });
    }
  }
