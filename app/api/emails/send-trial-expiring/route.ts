import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';
import { TrialExpiringEmail } from '@/lib/emails/trial-expiring';

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, daysLeft, isEtsyUser } = await req.json();

    if (!email || !firstName || daysLeft === undefined) {
      return NextResponse.json(
        { error: 'Email, firstName, and daysLeft are required' },
        { status: 400 }
      );
    }

    const subject = isEtsyUser
      ? `${daysLeft} days left - Don't forget your 3 months free!`
      : `${daysLeft} days left in your Hunnimoon trial`;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hunnimoon.app';

    const result = await sendEmail({
      to: email,
      subject,
      react: TrialExpiringEmail({
        firstName,
        daysLeft,
        isEtsyUser: isEtsyUser || false,
        baseUrl,
      }),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in send-trial-expiring:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
