---
name: Production Deployment Plan
overview: Step-by-step checklist to deploy Hunnimoon to production on hunnimoon.app domain with live Stripe, proper email configuration, and all necessary production settings.
todos:
  - id: trial-duration
    content: Reset trial duration to 7 days in lib/trial-helpers.ts
    status: pending
  - id: stripe-live
    content: Switch Stripe to Live mode and create live products
    status: pending
  - id: stripe-webhook
    content: Configure Stripe webhook for production URL
    status: pending
    dependencies:
      - stripe-live
  - id: vercel-deploy
    content: Deploy to new Vercel account and configure domain
    status: pending
  - id: env-vars
    content: Set all environment variables in Vercel
    status: pending
    dependencies:
      - stripe-live
      - stripe-webhook
  - id: monitoring
    content: Set up error monitoring (Sentry, Highlight, or Vercel logs)
    status: pending
  - id: seo-setup
    content: Add robots.txt, sitemap.xml, and submit to Google Search Console
    status: pending
  - id: testing
    content: Complete end-to-end testing of all flows
    status: pending
    dependencies:
      - vercel-deploy
      - env-vars
---

# Production Deployment Plan for Hunnimoon

This plan will take Hunnimoon from development to production on hunnimoon.app, switching all services to live mode and ensuring proper configuration.

---

## Phase 1: Code Preparation

### 1.1 Reset Trial Duration

**File:** [`lib/trial-helpers.ts`](lib/trial-helpers.ts)

Change line 23 from testing (30 seconds) to production (7 days):

```typescript
const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000  // 7 days for production
```

### 1.2 (Optional) Remove Test Mode Overrides

**File:** [`lib/trial-helpers.ts`](lib/trial-helpers.ts)

Consider removing or commenting out localStorage test mode code:

- Lines 46-66 (trial status override)
- Lines 99-109 (Etsy user override)  
- Lines 118-131 (trial day override)

Or add environment check to only allow in development.

---

## Phase 2: Stripe Live Mode Configuration

### 2.1 Switch to Live Mode in Stripe Dashboard

- Toggle to "Live mode" in Stripe dashboard (top right switch)

### 2.2 Create Live Products

Create new products in Live mode (test products cannot be migrated):

- Monthly subscription product + recurring price
- Yearly subscription product + recurring price
- Copy the Live Price IDs (start with `price_`)

### 2.3 Configure Stripe Branding

- Upload Hunnimoon logo (Settings → Branding)
- Set brand color: `#E91E63` (pink)
- Add icon
- Configure email footer: `hunnimoon@veilandvibe.com`

---

## Phase 3: Vercel Deployment Setup

### 3.1 Create/Access New Vercel Account

- Log into the Vercel account you want to use for production
- Import project from Git repository
- Vercel should auto-detect Next.js configuration

### 3.2 Configure Domain

- Add custom domain `hunnimoon.app` in Vercel project settings
- Update DNS records as instructed by Vercel
- Wait for SSL certificate to provision
- Verify HTTPS is working

### 3.3 Set Environment Variables

Add all environment variables in Vercel → Project Settings → Environment Variables:

**InstantDB:**

```
NEXT_PUBLIC_INSTANT_APP_ID=your-app-id
INSTANT_ADMIN_SECRET=your-instant-admin-secret
```

**Stripe (LIVE KEYS):**

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (from step 3.4)
STRIPE_PRICE_ID_MONTHLY=price_... (from step 2.2)
STRIPE_PRICE_ID_YEARLY=price_... (from step 2.2)
```

**Resend:**

```
RESEND_API_KEY=re_...
```

**App Configuration:**

```
NEXT_PUBLIC_APP_URL=https://hunnimoon.app
ADMIN_EMAILS=your@email.com,partner@email.com
ADMIN_SLUG=dashboard-a8f3k2
CRON_SECRET=generate-secure-random-string-here
```

### 3.4 Configure Stripe Webhook for Production

- In Stripe Live mode, go to Developers → Webhooks
- Click "Add endpoint"
- URL: `https://hunnimoon.app/api/stripe/webhook`
- Select events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
- Copy webhook signing secret (starts with `whsec_`)
- Add to `STRIPE_WEBHOOK_SECRET` environment variable in Vercel

---

## Phase 4: Email Configuration

### 4.1 Verify Resend Domain

Domain `veilandvibe.com` is already verified in Resend. Email will be sent from `hunnimoon@veilandvibe.com`.

**File:** [`lib/resend.ts`](lib/resend.ts) - Line 22 already correctly configured:

```typescript
from: 'Hunnimoon <hunnimoon@veilandvibe.com>',
```

No changes needed.

### 4.2 Verify Email Link Configuration

All email templates already use `NEXT_PUBLIC_APP_URL` for links:

- [`app/api/emails/send-trial-started/route.ts`](app/api/emails/send-trial-started/route.ts)
- [`app/api/emails/send-trial-expiring/route.ts`](app/api/emails/send-trial-expiring/route.ts)
- [`app/api/emails/send-trial-expired/route.ts`](app/api/emails/send-trial-expired/route.ts)

Ensure `NEXT_PUBLIC_APP_URL=https://hunnimoon.app` is set in Vercel (covered in step 3.3).

---

## Phase 5: Monitoring & Analytics

### 5.1 Enable Vercel Analytics (Built-in, Free)

- Go to Vercel project → Analytics tab
- Enable Web Analytics (free tier included)
- Provides page views, performance metrics

### 5.2 Set Up Error Monitoring (Choose One - All Have Free Tiers)

**Option A: Sentry (Recommended)**

- Free tier: 5,000 errors/month
- Sign up at sentry.io
- Add `@sentry/nextjs` package
- Configure DSN in environment variables

**Option B: Highlight.io**

- Free tier: 1,000 sessions/month
- Includes session replay + error tracking
- Sign up at highlight.io
- Add package and configure

**Option C: Better Stack (Logtail)**

- Free tier: 1GB logs/month
- Sign up at betterstack.com
- Configure logging endpoint

**Option D: Vercel Log Drains**

- Built-in with Vercel
- Forward logs to external services
- Configure in Vercel project settings

---

## Phase 6: SEO Configuration

### 6.1 Verify Metadata

**File:** [`app/layout.tsx`](app/layout.tsx)

Current metadata (lines 7-10):

```typescript
export const metadata: Metadata = {
  title: 'Hunnimoon - Wedding Planning Made Simple',
  description: 'Plan your perfect wedding with guest management, RSVPs, budget tracking, and more.',
}
```

Consider adding:

- Open Graph tags for social sharing
- Twitter Card metadata
- Favicon configuration

### 6.2 Add robots.txt

Create `app/robots.txt` or `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /dashboard-a8f3k2
Disallow: /api/

Sitemap: https://hunnimoon.app/sitemap.xml
```

### 6.3 Add sitemap.xml

Create Next.js sitemap at `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://hunnimoon.app',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://hunnimoon.app/pricing',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://hunnimoon.app/tools',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Add other public pages
  ]
}
```

### 6.4 Submit to Google Search Console

- Go to search.google.com/search-console
- Add property: `hunnimoon.app`
- Verify ownership (DNS or HTML file)
- Submit sitemap: `https://hunnimoon.app/sitemap.xml`

---

## Phase 7: Testing & Verification

### 7.1 Deploy to Vercel

- Push code changes to Git
- Vercel will auto-deploy
- Monitor deployment logs
- Verify build succeeds

### 7.2 Verify Cron Job

- Check Vercel Dashboard → Cron Jobs
- Should show: `/api/cron/check-trials` at 9 AM UTC daily
- Test endpoint manually:
```bash
curl -X GET https://hunnimoon.app/api/cron/check-trials \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```


### 7.3 Test Authentication Flow

- New user signup
- Email verification (if applicable)
- Login existing user
- Logout

### 7.4 Test Trial Flow

- Create new account
- Verify 7-day trial starts
- Check welcome email received
- Verify email links point to hunnimoon.app
- Check trial banner displays correctly

### 7.5 Test Payment Flow

- Attempt to upgrade (monthly)
- Attempt to upgrade (yearly)
- Verify Stripe checkout works
- Complete test purchase (use Stripe test cards in live mode testing, or real small amount)
- Check webhook fires correctly
- Verify user status updates in database
- Test customer portal access

### 7.6 Test Core Features

- Guest management (add, edit, delete)
- Budget tracking
- Vendor organization
- RSVP management
- Settings page

### 7.7 Test Admin Dashboard

- Login with admin email
- Access admin dashboard: `https://hunnimoon.app/dashboard-a8f3k2`
- Verify metrics display correctly
- Check rate limiting works

---

## Phase 8: Post-Launch Monitoring

### 8.1 Monitor First 24 Hours

- Check Vercel deployment logs
- Monitor Stripe webhook delivery (Dashboard → Developers → Webhooks → Events)
- Monitor Resend email delivery (Dashboard → Logs)
- Watch error monitoring tool (if configured)

### 8.2 Monitor Cron Job Execution

- Check cron runs successfully at 9 AM UTC
- Verify no errors in logs
- Confirm emails are sent when appropriate

### 8.3 Performance Check

- Run Lighthouse audit on key pages
- Check mobile responsiveness
- Verify loading times are acceptable
- Test on different browsers

---

## Critical Files Modified

1. [`lib/trial-helpers.ts`](lib/trial-helpers.ts) - Reset trial duration to 7 days
2. [`app/robots.txt`](app/robots.txt) - Add robots.txt (new file)
3. [`app/sitemap.ts`](app/sitemap.ts) - Add sitemap (new file)
4. [`app/layout.tsx`](app/layout.tsx) - Enhanced metadata (optional)

---

## Rollback Plan

If issues arise:

1. Keep test/development environment running
2. Revert domain to previous state
3. Switch Stripe webhook back to test endpoint
4. All credentials and access documented

---

## Notes

- Email already configured correctly with `hunnimoon@veilandvibe.com`
- All email links use `NEXT_PUBLIC_APP_URL` environment variable
- Test products must be recreated in Stripe Live mode (cannot migrate)
- Admin slug should remain secret
- Consider separate InstantDB app for production data isolation