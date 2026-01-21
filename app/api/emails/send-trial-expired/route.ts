import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';
import { TrialExpiredEmail } from '@/lib/emails/trial-expired';

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, isEtsyUser } = await req.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and firstName are required' },
        { status: 400 }
      );
    }

    const subject = isEtsyUser
      ? 'Keep using Hunnimoon with your 3 months free!'
      : 'Your Hunnimoon trial has ended';

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hunnimoon.app';

    const result = await sendEmail({
      to: email,
      subject,
      react: TrialExpiredEmail({ firstName, isEtsyUser: isEtsyUser || false, baseUrl }),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in send-trial-expired:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
