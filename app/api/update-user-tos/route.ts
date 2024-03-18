import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export const preferredRegion = 'sin1';
export const maxDuration = 50;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { isUserAgreedTermsOfService } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prismadb.userAPILimit.findUnique({
      where: {
        userId: userId,
      },
    });

    if (user) {
      const response = await prismadb.userAPILimit.update({
        where: { userId: userId },
        data: {
          isUserAgreedTermsOfService: isUserAgreedTermsOfService,
        },
      });
      return NextResponse.json(response);
    }
  } catch (error) {
    console.log('Code Error', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
