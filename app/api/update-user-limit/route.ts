import { NextResponse } from 'next/server';

import { increaseApiLimit } from '@/lib/api-limit';
import { currentUser } from '@/lib/auth';

export const preferredRegion = 'sin1';
export const maxDuration = 50;

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await increaseApiLimit(user?.id);

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.log('Code Error', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
