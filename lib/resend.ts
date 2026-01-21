import { Resend } from 'resend';
import * as React from 'react';

// Initialize Resend with a dummy key if not set (for build time)
// The actual key check happens at runtime in the sendEmail function
const apiKey = process.env.RESEND_API_KEY || 'dummy-key-for-build';
export const resend = new Resend(apiKey);

// Helper function to send emails
export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string;
  subject: string;
  react: React.ReactElement;
}) {
  // Runtime check for API key
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'dummy-key-for-build') {
    console.error('RESEND_API_KEY is not set in environment variables');
    return { success: false, error: new Error('RESEND_API_KEY is not configured') };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Hunnimoon <hunnimoon@veilandvibe.com>',
      to,
      subject,
      react,
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
