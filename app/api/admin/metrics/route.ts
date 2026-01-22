import { NextRequest, NextResponse } from 'next/server';
import { init } from '@instantdb/admin';
import { isAdminEmail, checkRateLimit } from '@/lib/admin-helpers';

// Force this route to be dynamic (not statically rendered)
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// Initialize InstantDB Admin
const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  adminToken: process.env.INSTANT_ADMIN_SECRET!,
});

export async function GET(req: NextRequest) {
  try {
    // Get user email from auth (you'll need to implement based on your auth setup)
    const authHeader = req.headers.get('authorization');
    const userEmail = authHeader?.replace('Bearer ', ''); // Adjust based on your auth

    // Check if user is admin
    if (!isAdminEmail(userEmail)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Rate limiting - 10 requests per minute
    const identifier = req.ip || req.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(identifier, 10)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again in a minute.' },
        { status: 429 }
      );
    }

    // Query all users
    const queryResult = await db.query({
      $users: {},
    });

    console.log('Query result:', JSON.stringify(queryResult, null, 2));

    if (!queryResult || !queryResult.$users) {
      console.error('No data returned from query');
      return NextResponse.json({ error: 'No data available' }, { status: 500 });
    }

    const users = queryResult.$users || [];
    console.log(`Found ${users.length} users`);
    
    const now = new Date();

    // Calculate metrics
    const totalUsers = users.length;
    
    // Active trials
    const activeTrials = users.filter((user: any) => {
      if (user.billing_status !== 'trial' || !user.trial_start_date) return false;
      const trialStart = new Date(user.trial_start_date);
      const trialEnd = new Date(trialStart);
      trialEnd.setDate(trialStart.getDate() + 7);
      return now < trialEnd;
    });

    // Paid subscribers
    const paidUsers = users.filter((user: any) => user.billing_status === 'active');
    const monthlyUsers = paidUsers.filter((user: any) => user.subscription_plan === 'monthly');
    const yearlyUsers = paidUsers.filter((user: any) => user.subscription_plan === 'yearly');

    // Canceled subscriptions
    const canceledUsers = users.filter((user: any) => user.billing_status === 'canceled');

    // MRR calculation
    const monthlyMRR = monthlyUsers.length * 9.99;
    const yearlyMRR = yearlyUsers.length * (79.99 / 12);
    const totalMRR = monthlyMRR + yearlyMRR;

    // Churn rate
    const churnRate = paidUsers.length > 0
      ? ((canceledUsers.length / (paidUsers.length + canceledUsers.length)) * 100).toFixed(1)
      : '0.0';

    // Acquisition sources
    const etsyUsers = users.filter((user: any) => user.acq_source === 'etsy');
    const regularUsers = users.filter((user: any) => !user.acq_source || user.acq_source !== 'etsy');
    
    // Etsy conversion rate (users who activated)
    const etsyActivated = etsyUsers.filter((user: any) => user.billing_status === 'active');
    const etsyConversionRate = etsyUsers.length > 0
      ? ((etsyActivated.length / etsyUsers.length) * 100).toFixed(1)
      : '0.0';

    // Recent activity
    const oneDayAgo = new Date(now);
    oneDayAgo.setDate(now.getDate() - 1);
    
    const recentSignups = users
      .filter((user: any) => user.created_at && new Date(user.created_at) > oneDayAgo)
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    // Trials expiring soon
    const trialsExpiringSoon = activeTrials
      .filter((user: any) => {
        const trialStart = new Date(user.trial_start_date);
        const trialEnd = new Date(trialStart);
        trialEnd.setDate(trialStart.getDate() + 7);
        const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 2;
      })
      .slice(0, 10);

    // Recent upgrades
    const recentUpgrades = paidUsers
      .filter((user: any) => user.subscription_start_date)
      .sort((a: any, b: any) => {
        const aDate = new Date(a.subscription_start_date || 0);
        const bDate = new Date(b.subscription_start_date || 0);
        return bDate.getTime() - aDate.getTime();
      })
      .slice(0, 10);

    // Recent cancellations
    const recentCancellations = canceledUsers
      .filter((user: any) => user.subscription_canceled_at)
      .sort((a: any, b: any) => {
        const aDate = new Date(a.subscription_canceled_at || 0);
        const bDate = new Date(b.subscription_canceled_at || 0);
        return bDate.getTime() - aDate.getTime();
      })
      .slice(0, 10);

    return NextResponse.json({
      overview: {
        totalUsers,
        activeTrials: activeTrials.length,
        paidSubscribers: paidUsers.length,
        monthlySubscribers: monthlyUsers.length,
        yearlySubscribers: yearlyUsers.length,
        canceledSubscriptions: canceledUsers.length,
      },
      revenue: {
        mrr: totalMRR.toFixed(2),
        monthlyMRR: monthlyMRR.toFixed(2),
        yearlyMRR: yearlyMRR.toFixed(2),
        churnRate,
      },
      acquisition: {
        etsy: etsyUsers.length,
        regular: regularUsers.length,
        total: totalUsers,
        etsyConversionRate,
        etsyActivated: etsyActivated.length,
      },
      activity: {
        recentSignups: recentSignups.map((user: any) => ({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          createdAt: user.created_at,
          source: user.acq_source,
        })),
        trialsExpiringSoon: trialsExpiringSoon.map((user: any) => ({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          trialStartDate: user.trial_start_date,
        })),
        recentUpgrades: recentUpgrades.map((user: any) => ({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          plan: user.subscription_plan,
          upgradedAt: user.subscription_start_date,
        })),
        recentCancellations: recentCancellations.map((user: any) => ({
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          canceledAt: user.subscription_canceled_at,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching admin metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
