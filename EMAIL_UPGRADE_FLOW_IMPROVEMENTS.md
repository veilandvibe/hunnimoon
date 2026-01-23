# Email Upgrade Flow Improvements

## Summary
Improved the email-to-upgrade user experience by automatically directing users to the correct upgrade flow after clicking email buttons.

## Changes Made

### 1. Email Template Updates
Updated all upgrade buttons in emails to link to `/settings` with action parameters:

#### **Trial Expiring Email** (`lib/emails/trial-expiring.tsx`)
- **Etsy users**: Button now links to `/settings?action=upgrade&promo=true`
- **Regular users**: Button now links to `/settings?action=upgrade`

#### **Trial Expired Email** (`lib/emails/trial-expired.tsx`)
- **Etsy users**: Button now links to `/settings?action=upgrade&promo=true`
- **Regular users**: Button now links to `/settings?action=upgrade`

#### **Trial Started Email** (`lib/emails/trial-started.tsx`)
- No changes needed (only has "Get Started" button to dashboard)

#### **Subscription Success Email** (`lib/emails/subscription-success.tsx`)
- No changes needed (only has "Go to Dashboard" button)

### 2. Settings Page Updates (`app/(main)/settings/page.tsx`)
- Added URL parameter detection for `?action=upgrade` and `?promo=true`
- Auto-opens appropriate upgrade flow based on parameters
- Cleans up URL after detecting parameters for cleaner browser history
- Passes flags to BillingSection component

### 3. BillingSection Component Updates (`components/settings/BillingSection.tsx`)
- Added `autoOpenUpgrade` and `autoOpenPromo` props
- Auto-opens upgrade modal when `autoOpenUpgrade` is true
- Auto-triggers promo code checkout when `autoOpenPromo` is true
- Modal title is clean: "Upgrade to Hunnimoon Pro" (no trial language)

## User Flow

### Regular Users
1. User receives trial expiring/expired email
2. Clicks "Upgrade to Pro" button
3. Redirected to `/settings?action=upgrade`
4. If not logged in, prompted to log in
5. After login, automatically opens upgrade modal
6. User selects monthly or yearly plan
7. Redirected to Stripe checkout (no promo code field)

### Etsy Users
1. User receives trial expiring/expired email with Etsy messaging
2. Clicks "Activate 3 Months Free" button
3. Redirected to `/settings?action=upgrade&promo=true`
4. If not logged in, prompted to log in
5. After login, automatically opens Stripe checkout with promo code field visible
6. User enters their Etsy promo code
7. Gets 3 months free

## Benefits
- ✅ Eliminates confusion from clicking email → pricing page → "Start Trial" flow
- ✅ Direct path from email to upgrade action
- ✅ Etsy users automatically get promo code field
- ✅ No manual navigation needed after login
- ✅ Clean, professional modal without trial-ending language
- ✅ Better conversion rates

## Testing

### Test Regular User Email Flow:
```bash
# 1. Send test email
curl -X POST http://localhost:3000/api/emails/send-trial-expiring \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "daysLeft": 2,
    "isEtsyUser": false
  }'

# 2. Click button in email (should go to /settings?action=upgrade)
# 3. Verify upgrade modal opens automatically
```

### Test Etsy User Email Flow:
```bash
# 1. Send test email
curl -X POST http://localhost:3000/api/emails/send-trial-expired \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "Jane",
    "isEtsyUser": true
  }'

# 2. Click button in email (should go to /settings?action=upgrade&promo=true)
# 3. Verify Stripe checkout opens with promo code field
```

## Technical Notes
- Promo code functionality was already implemented in `app/api/stripe/create-checkout/route.ts`
- The `allowPromoCode` parameter controls whether Stripe shows the promo field
- URL parameters are cleaned from the browser history after detection
- Component prevents duplicate triggers with loading state checks
