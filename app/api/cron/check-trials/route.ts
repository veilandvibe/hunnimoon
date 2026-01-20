import { NextRequest, NextResponse } from 'next/server';
import { init } from '@instantdb/admin';

// Initialize InstantDB Admin
const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_SECRET!,
});

// Verify cron secret to prevent unauthorized access
function verifyCronSecret(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'your-secret-key';
  
  // Vercel Cron Jobs send authorization header
  if (authHeader === `Bearer ${cronSecret}`) {
    return true;
  }
  
  return false;
}

export async function GET(req: NextRequest) {
  // Verify this is a legitimate cron request
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const now = new Date();
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(now.getDate() + 3);
    
    const oneDayAfterExpiry = new Date(now);
    oneDayAfterExpiry.setDate(now.getDate() - 8); // 7 day trial + 1 day after

    // Query all users with trials
    const result = await db.query({
      users: {
        $: {
          where: {
            billing_status: 'trial',
          },
        },
      },
    });

    let expiringEmailsSent = 0;
    let expiredEmailsSent = 0;

    for (const user of result.users || []) {
      if (!user.trial_start_date || !user.email) continue;

      const trialStart = new Date(user.trial_start_date);
      const trialEnd = new Date(trialStart);
      trialEnd.setDate(trialStart.getDate() + 7);

      const daysUntilExpiry = Math.ceil(
        (trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Send "trial expiring" email at 3 days left
      if (daysUntilExpiry === 3 && !user.trial_expiring_email_sent) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/send-trial-expiring`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              firstName: user.first_name || 'there',
              daysLeft: 3,
              isEtsyUser: user.acq_source === 'etsy',
            }),
          });

          // Mark as sent
          await db.transact([
            db.tx.users[user.id].update({
              trial_expiring_email_sent: true,
            }),
          ]);

          expiringEmailsSent++;
        } catch (error) {
          console.error(`Failed to send expiring email to ${user.email}:`, error);
        }
      }

      // Send "trial expired" email 1 day after expiry
      if (daysUntilExpiry === -1 && !user.trial_expired_email_sent) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails/send-trial-expired`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              firstName: user.first_name || 'there',
              isEtsyUser: user.acq_source === 'etsy',
            }),
          });

          // Mark as sent and update billing status
          await db.transact([
            db.tx.users[user.id].update({
              trial_expired_email_sent: true,
              billing_status: 'expired',
            }),
          ]);

          expiredEmailsSent++;
        } catch (error) {
          console.error(`Failed to send expired email to ${user.email}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      expiringEmailsSent,
      expiredEmailsSent,
      checkedUsers: result.users?.length || 0,
    });
  } catch (error) {
    console.error('Error in check-trials cron:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
