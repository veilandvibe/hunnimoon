---
name: Billing & Subscription System
overview: Complete implementation of 7-day free trial, Stripe subscription payments, Etsy acquisition funnel with lifetime access codes, trial expiry UX, email notifications, and admin analytics dashboard.
todos:
  - id: phase1-db-schema
    content: Update InstantDB schema with trial and Etsy fields
    status: completed
  - id: phase1-trial-helpers
    content: Create trial and billing helper functions
    status: completed
    dependencies:
      - phase1-db-schema
  - id: phase1-etsy-tracking
    content: Implement Etsy source tracking on landing page
    status: completed
    dependencies:
      - phase1-db-schema
  - id: phase2-pricing-page
    content: Build pricing page with 3 cards and toggle
    status: completed
  - id: phase3-stripe-setup
    content: Create Stripe product, prices, and promo code
    status: completed
  - id: phase3-checkout-api
    content: Build checkout session API route
    status: completed
    dependencies:
      - phase3-stripe-setup
  - id: phase3-success-pages
    content: Create checkout success and canceled pages
    status: completed
  - id: phase4-webhook-handler
    content: Build Stripe webhook handler API route
    status: completed
    dependencies:
      - phase3-stripe-setup
      - phase1-db-schema
  - id: phase4-test-webhooks
    content: Test webhook events with Stripe CLI
    status: completed
    dependencies:
      - phase4-webhook-handler
  - id: phase5-billing-section
    content: Create BillingSection component for settings
    status: completed
    dependencies:
      - phase1-trial-helpers
  - id: phase5-portal-api
    content: Build Stripe portal API route
    status: completed
    dependencies:
      - phase3-stripe-setup
  - id: phase5-promo-button
    content: Add generic promo code button to settings
    status: completed
    dependencies:
      - phase5-billing-section
  - id: phase6-trial-components
    content: Create trial banner, upgrade modal, and read-only banner
    status: completed
    dependencies:
      - phase1-trial-helpers
  - id: phase6-etsy-modals
    content: Create 3 Etsy-specific modals with instructions
    status: completed
    dependencies:
      - phase1-etsy-tracking
  - id: phase6-modal-manager
    content: Build modal display logic and localStorage tracking
    status: completed
    dependencies:
      - phase6-etsy-modals
  - id: phase7-resend-setup
    content: Set up Resend client and email templates
    status: pending
  - id: phase7-email-apis
    content: Create email sending API routes
    status: pending
    dependencies:
      - phase7-resend-setup
  - id: phase7-cron-job
    content: Build cron job for trial expiring emails
    status: pending
    dependencies:
      - phase7-email-apis
  - id: phase7-stripe-emails
    content: Configure Stripe email branding
    status: pending
    dependencies:
      - phase3-stripe-setup
  - id: phase8-admin-page
    content: Create admin dashboard page with metrics
    status: pending
    dependencies:
      - phase1-db-schema
  - id: phase8-metrics-api
    content: Build admin metrics API route
    status: pending
  - id: phase8-admin-nav
    content: Add admin link to sidebar for admin users
    status: pending
    dependencies:
      - phase8-admin-page
---

# Billing & Subscription System with Etsy Funnel

## Overview

Implement a complete subscription system with:

- 7-day free trial (no credit card required)
- Stripe integration for Pro plan (monthly $9.99, yearly $79.99)
- Etsy acquisition funnel with lifetime access via promo codes
- Trial expiry UX with read-only mode
- Email notifications (Resend + Stripe)
- Admin analytics dashboard

---

## Phase 1: Foundation & Database Schema

**Goal:** Set up database fields for trial tracking, billing status, and Etsy source tracking.

### Database Schema Updates (InstantDB)

Update the user schema in your InstantDB dashboard to include:

```typescript
// New fields to add to user entity
trial_start_date: timestamp | null
billing_status: "trial" | "active" | "expired" | "canceled"
stripe_customer_id: string | null
stripe_subscription_id: string | null
subscription_plan: "monthly" | "yearly" | null
acq_source: string | null  // "etsy" or null
acq_source_set_at: timestamp | null
```

### Files to Create/Modify

**Create [`lib/trial-helpers.ts`](lib/trial-helpers.ts)**

- `getUserTrialStatus()` - returns days remaining, is trial active, etc.
- `isTrialExpired()` - boolean check
- `getUserAcqSource()` - returns acquisition source
- `isEtsyUser()` - checks if user came from Etsy

**Create [`lib/billing-status.ts`](lib/billing-status.ts)**

- `canAccessApp()` - returns true if trial active OR billing_status = "active"
- `shouldShowReadOnlyMode()` - trial expired + not paid

**Modify [`components/providers/AuthProvider.tsx`](components/providers/AuthProvider.tsx)**

- On successful signup, set `trial_start_date` to now
- Set `billing_status` to "trial"
- Check localStorage for `acq_source` and save to DB if present

### Etsy Source Tracking

**Modify [`app/(marketing)/page.tsx`](app/\\\\(marketing)/page.tsx)**

- Add client-side effect to check for `?src=etsy` URL parameter
- Store in localStorage: `localStorage.setItem('acq_source', 'etsy')`
- Persist across signup

**Modify [`app/(marketing)/layout.tsx`](app/\\\\(marketing)/layout.tsx)**

- Add `useSearchParams()` to capture `?src=` on any marketing page
- Store source in localStorage if present

---

## Phase 2: Pricing Page

**Goal:** Build a beautiful pricing page with trial, monthly, and yearly options.

### Create [`app/(marketing)/pricing/page.tsx`](app/\\\\(marketing)/pricing/page.tsx)

**Layout:** 3 cards side-by-side (desktop), stacked (mobile)

1. **Trial Card**

   - "7-Day Free Trial"
   - "Full access, no credit card"
   - Button: "Start Free Trial" → goes to signup

2. **Pro Monthly Card**

   - "$9.99/month"
   - "Billed monthly"
   - "Cancel anytime"
   - Button: "Start Free Trial"

3. **Pro Yearly Card** (most popular badge)

   - "$79.99/year"
   - "Save $39.89" - make this a percentage instead*
   - Button: "Start Free Trial"

**Features:**

- Monthly/yearly toggle (stores preference in localStorage)
- Responsive grid layout
- Pink gradient background
- All CTAs lead to signup (trial always starts free)

### Additional Settings

**Create [`components/billing/PlanSelector.tsx`](components/billing/PlanSelector.tsx)**

- Reusable component for plan selection
- Used on pricing page and during upgrade flow

---

## Phase 3: Stripe Setup & Checkout

**Goal:** Integrate Stripe and create checkout session for upgrades. Note: explain in detail in the chat to the user how to set up manual stripe.*

### Stripe Configuration (Manual Setup Required)

**You'll need to provide:**

1. Stripe Publishable Key (`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`)
2. Stripe Secret Key (`STRIPE_SECRET_KEY`)
3. Stripe Webhook Secret (`STRIPE_WEBHOOK_SECRET`)

**In Stripe Dashboard, create:**

- Product: "Hunnimoon Pro"
- Price 1: $9.99 USD recurring monthly
- Price 2: $79.99 USD recurring yearly
- Promo Code: `ETSY2026HM` (100% off, recurring, max 500 redemptions)

### Files to Create

**Create [`app/api/stripe/create-checkout/route.ts`](app/api/stripe/create-checkout/route.ts)**

- Accepts: `{ priceId, userId }`
- Creates Stripe checkout session
- Returns: `{ sessionId, url }`
- Sets `success_url` and `cancel_url`
- Passes `client_reference_id` as user ID

**Create [`lib/stripe.ts`](lib/stripe.ts)**

- Initialize Stripe client
- Export price IDs as constants

**Create [`app/(marketing)/checkout/success/page.tsx`](app/\\\\(marketing)/checkout/success/page.tsx)**

- Thank you page after successful checkout
- Redirects to dashboard after 3 seconds

**Create [`app/(marketing)/checkout/canceled/page.tsx`](app/\\\\(marketing)/checkout/canceled/page.tsx)**

- Handles canceled checkout
- CTA to try again or contact support

### Modify Existing Files

**Modify [`components/marketing/CTABlock.tsx`](components/marketing/CTABlock.tsx)**

- Wire up "Start Free Trial" button
- If logged in + trial expired → open upgrade modal
- If logged out → redirect to signup

---

## Phase 4: Stripe Webhooks

**Goal:** Keep user billing status in sync with Stripe subscriptions.

### Create [`app/api/stripe/webhook/route.ts`](app/api/stripe/webhook/route.ts)

**Handle events:**

- `checkout.session.completed` → mark user as "active", save customer ID + subscription ID
- `customer.subscription.updated` → update subscription status
- `customer.subscription.deleted` → mark as "canceled"
- `invoice.payment_failed` → mark as "expired"

**Security:**

- Verify webhook signature using `STRIPE_WEBHOOK_SECRET`
- Update InstantDB user record based on `client_reference_id`

### Testing

Use Stripe CLI to test webhooks locally:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
stripe trigger checkout.session.completed
```

---

## Phase 5: Settings & Subscription Management

**Goal:** Let users view their plan and manage their subscription via Stripe portal.

### Create [`components/settings/BillingSection.tsx`](components/settings/BillingSection.tsx)

**Display:**

- Current plan status (Trial with X days left OR Pro Monthly/Yearly)
- Next billing date (if paid)
- "Manage Subscription" button

**"Manage Subscription" button:**

- Calls `/api/stripe/create-portal` to get portal session URL
- Opens Stripe Customer Portal (update payment, cancel, etc.)

### Files to Create

**Create [`app/api/stripe/create-portal/route.ts`](app/api/stripe/create-portal/route.ts)**

- Accepts: `{ customerId }`
- Creates Stripe billing portal session
- Returns: `{ url }`

**Modify [`app/(main)/settings/page.tsx`](app/\\\\(main)/settings/page.tsx)**

- Add `<BillingSection />` at the bottom
- Show trial countdown or active plan info

### Generic Promo Code Entry

Add a subtle button in `BillingSection.tsx`:

> "Have a promo code? Apply it here"

**On click:**

- Opens Stripe checkout with promo code field enabled
- Generic enough for any future promo codes
- Solves edge case: Etsy users who signed up without the link

---

## Phase 6: Trial Expiry UX & Etsy Modals

**Goal:** Show trial countdown, upgrade modals, and Etsy-specific messaging.

### For All Users

**Create [`components/trial/TrialBanner.tsx`](components/trial/TrialBanner.tsx)**

- Shows on days 5-7 of trial
- Dismissible per session
- "X days left in your trial. Upgrade to keep full access."
- CTA: "Upgrade Now"

**Create [`components/trial/UpgradeModal.tsx`](components/trial/UpgradeModal.tsx)**

- Shown when trial expires
- "Your trial has ended. Upgrade to continue."
- Show monthly/yearly options
- CTA: "Upgrade to Pro"
- Can be dismissed (once per session)

**Create [`components/trial/ReadOnlyBanner.tsx`](components/trial/ReadOnlyBanner.tsx)**

- Persistent banner shown on all pages when trial expired
- "You're in read-only mode. Upgrade to make changes."

### For Etsy Users Only

**Create [`components/etsy/EtsyWelcomeModal.tsx`](components/etsy/EtsyWelcomeModal.tsx)**

**Shown:** On first landing from `?src=etsy` link (before signup)

**Content:**

- Title: "Welcome from Etsy! 🎉"
- Body: "Purchased from Veil & Vibe on Etsy? Your lifetime access code is included in your Etsy files (the PDF download). When your 7-day trial ends, enter that code at checkout—you won't be charged a thing."
- Buttons:
  - "Start Free Trial" (primary)
  - "Where's my code?" (secondary, expands instructions)

**"Where's my code?" Instructions:**

```
1. Go to your Etsy account
2. Click "Purchases and Reviews"
3. Locate your digital purchase.
3. Click "Download Files"
4. Open the PDF—your lifetime code is located in it.
5. Need help? Email hunnimoon@veilandvibe.com
```

**Create [`components/etsy/EtsyTrialExpiringModal.tsx`](components/etsy/EtsyTrialExpiringModal.tsx)**

**Shown:** 2 days before trial ends (for Etsy users only)

**Content:**

- Title: "Your trial ends in 2 days"
- Body: "Use your Etsy lifetime code to keep access free forever. Grab your code from your PDF provided from your Veil & Vibe purchase on Etsy."
- Buttons:
  - "Activate Lifetime Access" (opens checkout with promo field)
  - "Where's my code?" (same instructions as above)

**Create [`components/etsy/EtsyTrialExpiredModal.tsx`](components/etsy/EtsyTrialExpiredModal.tsx)**

**Shown:** After trial ends (for Etsy users only)

**Content:**

- Title: "Your trial has ended"
- Body: "But you can keep going for free! You already have lifetime access from your Etsy purchase. Grab your code from your Etsy download PDF and enter it at checkout. You won't be charged."
- Buttons:
  - "Activate Lifetime Access" (primary, opens checkout)
  - "Need help?" (secondary, shows support email)

### Etsy-Specific Banner

**Modify [`components/trial/TrialBanner.tsx`](components/trial/TrialBanner.tsx)**

Add conditional messaging for Etsy users (days 5-7):

> "💝 Your trial ends soon! Use your Etsy lifetime code to continue free forever."

### Modal Logic & Display Rules

**Create [`lib/modal-manager.ts`](lib/modal-manager.ts)**

Track which modals have been shown using localStorage:

- `etsy_welcome_shown` - only once ever
- `etsy_trial_expiring_shown` - once per trial
- `etsy_trial_expired_shown` - once per session
- `upgrade_modal_shown` - once per session (for non-Etsy users)

**Display priority:**

1. Etsy Welcome (first visit from link, before signup)
2. Etsy Trial Expiring (2 days before, Etsy users only)
3. Etsy Trial Expired (after expiry, Etsy users only)
4. Regular Upgrade Modal (after expiry, non-Etsy users only)

---

## Phase 7: Email Notifications

**Goal:** Send automated emails for trial events, with Etsy-specific personalization.

### Resend Setup (Manual Setup Required)

**You'll need to provide:**

1. Resend API Key (`RESEND_API_KEY`)
2. Verified sending domain (or use `onboarding@resend.dev` for testing)

### Files to Create

**Create [`lib/resend.ts`](lib/resend.ts)**

- Initialize Resend client
- Export `sendEmail()` helper function

**Create [`lib/emails/trial-started.tsx`](lib/emails/trial-started.tsx)**

- React email template
- Subject: "Welcome to Hunnimoon! Your 7-day trial starts now"
- Content: Welcome message, trial details, CTA to get started
- **Conditional for Etsy users:** "PS: You have a lifetime access code in your Etsy PDF. You won't need to pay when your trial ends!"

**Create [`lib/emails/trial-expiring.tsx`](lib/emails/trial-expiring.tsx)**

- React email template
- Subject: "3 days left in your Hunnimoon trial"
- Content: Reminder, plan options, CTA to upgrade
- **Conditional for Etsy users:** "Don't forget: You have a lifetime code from your Etsy purchase. Check your Etsy download PDF and enter it at checkout to continue free."

### API Routes for Sending

**Create [`app/api/emails/send-trial-started/route.ts`](app/api/emails/send-trial-started/route.ts)**

- Triggered on signup
- Sends "Trial started" email via Resend

**Create [`app/api/emails/send-trial-expiring/route.ts`](app/api/emails/send-trial-expiring/route.ts)**

- Triggered by cron job (check users with 3 days left)
- Sends "Trial expiring" email via Resend

### Cron Job for Trial Expiring Email

**Create [`app/api/cron/check-trials/route.ts`](app/api/cron/check-trials/route.ts)**

- Query InstantDB for users with trial ending in 3 days
- Send email to each one
- Mark as "expiring_email_sent" to avoid duplicates

**Use Vercel Cron Jobs** (add to `vercel.json`):

```json
{
  "crons": [{
    "path": "/api/cron/check-trials",
    "schedule": "0 9 * * *"
  }]
}
```

### Stripe Email Configuration

**Stripe sends these emails automatically:**

- Payment successful
- Payment failed
- Subscription canceled
- Upcoming invoice

**Customize branding in Stripe Dashboard:**

- Settings → Branding → Add logo, colors
- Settings → Emails → Customize templates

---

## Phase 8: Admin Analytics Dashboard

**Goal:** Build a simple admin dashboard to track key metrics.

### Create [`app/(main)/admin/page.tsx`](app/\\\\(main)/admin/page.tsx)

**Protection:** Only accessible if user email is your admin email (hardcoded check for now)

**Metrics to Display:**

1. **User Overview**

   - Total users
   - Active trials (with days left)
   - Paid subscribers (monthly vs yearly)
   - Canceled subscriptions

2. **Revenue Metrics**

   - MRR (Monthly Recurring Revenue)
   - Churn rate (cancellations / total paid users)

3. **Acquisition Sources**

   - Etsy users vs regular users
   - Etsy conversion rate (Etsy users who activated code)
   - Chart: Source breakdown

4. **Recent Activity**

   - Recent signups (last 10)
   - Trials expiring today/tomorrow
   - Recent upgrades
   - Recent cancellations

### Files to Create

**Create [`app/api/admin/metrics/route.ts`](app/api/admin/metrics/route.ts)**

- Query InstantDB for all metrics
- Return aggregated data
- Protected by admin email check

**Create [`components/admin/MetricCard.tsx`](components/admin/MetricCard.tsx)**

- Reusable card component for displaying metrics

**Create [`components/admin/AcquisitionChart.tsx`](components/admin/AcquisitionChart.tsx)**

- Simple bar chart showing Etsy vs regular signups
- Use a lightweight chart library (e.g., Recharts)

### Admin Navigation

**Modify [`components/layout/Sidebar.tsx`](components/layout/Sidebar.tsx)**

- Add "Admin" link at the bottom (only visible to admin email)

---

## Environment Variables Summary

Add these to `.env.local`:

```bash
# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...

# Resend
RESEND_API_KEY=re_...

# Admin
ADMIN_EMAIL=your@email.com
```

---

## Testing Checklist

### Trial Flow

- [ ] User signs up → trial starts, 7 days countdown begins
- [ ] Trial countdown shows correctly in settings
- [ ] Trial banner appears on day 5
- [ ] Trial expired modal appears after day 7
- [ ] App becomes read-only after trial ends

### Etsy Flow

- [ ] Landing with `?src=etsy` → Etsy welcome modal shows
- [ ] Signup from Etsy link → `acq_source` saved as "etsy"
- [ ] Etsy trial expiring modal shows at day 5 (for Etsy users only)
- [ ] Etsy trial expired modal shows after day 7 (for Etsy users only)
- [ ] Etsy-specific email content sent correctly

### Stripe Integration

- [ ] Checkout session created successfully
- [ ] Payment completes → user marked as "active"
- [ ] Promo code `ETSY2026HM` applies 100% discount
- [ ] Subscription updates reflected in app
- [ ] Customer portal opens correctly
- [ ] Cancellation updates user status

### Emails

- [ ] "Trial started" email sent on signup
- [ ] "3 days left" email sent at day 4
- [ ] Stripe emails sent for payment events
- [ ] Etsy-specific email content shows for Etsy users

### Admin Dashboard

- [ ] Metrics display correctly
- [ ] Etsy acquisition tracking works
- [ ] Only admin email can access `/admin`

---

## Implementation Notes

- **Etsy source never expires** - once tagged as `acq_source = "etsy"`, always Etsy user
- **Security:** Promo code only in private Etsy PDF, not exposed in app
- **Generic promo entry:** Settings has neutral "Apply promo code" button for any codes
- **Placeholder email:** `support@hunnimoon.app` used in all modals
- **Modal instructions:** Simple written steps, no external links