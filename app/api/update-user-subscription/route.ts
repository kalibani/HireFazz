import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';

export const preferredRegion = 'sin1';
export const maxDuration = 50;

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {
      characterCount,
      subscriptionType,
      maxFreeCount,
      isUserAgreedTermsOfService,
    } = body;

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prismadb.userAPILimit.findUnique({
      where: {
        userId: userId,
      },
    });

    if (user) {
      await prismadb.userAPILimit.update({
        where: { userId: userId },
        data: {
          characterCount: user.characterCount! + characterCount!,
          maxFreeCount: maxFreeCount,
          count: 0,
          subscriptionType: subscriptionType,
          isUserAgreedTermsOfService: isUserAgreedTermsOfService,
        },
      });
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.log('Code Error', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
