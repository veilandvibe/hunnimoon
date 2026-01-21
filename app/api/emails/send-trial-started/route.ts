import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';
import TrialStartedEmail from '@/lib/emails/trial-started';

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, isEtsyUser } = await req.json();

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and firstName are required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hunnimoon.app';
    
    const result = await sendEmail({
      to: email,
      subject: 'Welcome to Hunnimoon! Your 7-day trial starts now 🎉',
      react: TrialStartedEmail({ firstName, isEtsyUser: isEtsyUser || false, baseUrl }),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in send-trial-started:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
