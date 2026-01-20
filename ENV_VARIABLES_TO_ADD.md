# Environment Variables To Add

Add these to your `.env.local` file:

```bash
# ==============================================
# NEW VARIABLES FOR PHASE 7 & 8
# ==============================================

# Admin Dashboard Access
# Comma-separated list of admin emails (your email(s))
ADMIN_EMAILS=your@email.com

# Admin dashboard URL slug (keep this secret!)
ADMIN_SLUG=dashboard-a8f3k2

# Cron Job Authentication
# Generate a random secret: openssl rand -base64 32
CRON_SECRET=your-random-secret-here

# App URL (already set, but verify it's correct)
NEXT_PUBLIC_APP_URL=http://localhost:3000
# For production deployment: NEXT_PUBLIC_APP_URL=https://hunnimoon.app

# ==============================================
# EXISTING VARIABLES (verify these are set)
# ==============================================

# InstantDB
NEXT_PUBLIC_INSTANT_APP_ID=your-app-id
INSTANT_ADMIN_SECRET=your-instant-admin-secret

# Resend (already set ✓)
RESEND_API_KEY=re_...

# Stripe (should already be set from Phase 3)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_MONTHLY=price_...
STRIPE_PRICE_ID_YEARLY=price_...
```

## How to Generate CRON_SECRET

Run this command in your terminal:
```bash
openssl rand -base64 32
```

Copy the output and paste it as your `CRON_SECRET` value.
