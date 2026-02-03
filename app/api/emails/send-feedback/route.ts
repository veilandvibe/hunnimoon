import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/resend';
import FeedbackNotificationEmail from '@/lib/emails/feedback-notification';

export async function POST(req: NextRequest) {
  try {
    const { name, email, category, message, userId, weddingId } = await req.json();

    if (!name || !email || !category || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://hunnimoon.app';
    
    // Get category label for subject line
    const getCategoryLabel = (cat: string) => {
      const labels: Record<string, string> = {
        general: 'General Message',
        feedback: 'Feedback',
        feature: 'Feature Request',
        bug: 'Bug Report',
      };
      return labels[cat] || cat;
    };
    
    const result = await sendEmail({
      to: 'hunnimoon@veilandvibe.com',
      subject: `New Feedback from ${name} - ${getCategoryLabel(category)}`,
      react: FeedbackNotificationEmail({ 
        name, 
        email, 
        category, 
        message, 
        userId, 
        weddingId,
        baseUrl 
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
    console.error('Error in send-feedback:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
