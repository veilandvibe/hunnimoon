import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';
import SubscriptionSuccessEmail from '@/lib/emails/subscription-success';

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, planType, isEtsyUser } = await req.json();

    if (!email || !firstName || !planType) {
      return NextResponse.json(
        { error: 'Email, firstName, and planType are required' },
        { status: 400 }
      );
    }

    if (planType !== 'monthly' && planType !== 'yearly') {
      return NextResponse.json(
        { error: 'planType must be either "monthly" or "yearly"' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hunnimoon.app';

    const result = await sendEmail({
      to: email,
      subject: isEtsyUser
        ? '🎉 Your 3 months free is activated!'
        : '🎉 Welcome to Hunnimoon Pro!',
      react: SubscriptionSuccessEmail({
        firstName,
        planType,
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
    console.error('Error in send-subscription-success:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
