import prismadb from '@/lib/prismadb';
import { currentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import z from 'zod';

const whiteListEmail = process.env.ADMIN_EMEIL || '';
const Payload = z.object({
  code: z.string(),
  email: z.string(),
  extraToken: z.number(),
});
const adminEmails = whiteListEmail.split(',');
export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (user?.email && adminEmails.includes(user.email)) {
      const body = await request.json();
      const payload = Payload.parse(body);
      const data = await prismadb.referral.create({
        data: payload,
      });
      return NextResponse.json(data);
    }
    throw new Error();
  } catch (error) {
    return NextResponse.json(
      { error: 'opps, something went wrong' },
      { status: 500 },
    );
  }
}
