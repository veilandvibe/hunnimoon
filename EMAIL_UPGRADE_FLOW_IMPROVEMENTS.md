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
4. If not logged in:
   - Redirected to `/login?redirect=%2Fsettings%3Faction%3Dupgrade`
   - Enters email and verification code
   - **After login, automatically redirected back to `/settings?action=upgrade`**
5. Upgrade modal automatically opens
6. User selects monthly or yearly plan
7. Redirected to Stripe checkout (no promo code field)

### Etsy Users
1. User receives trial expiring/expired email with Etsy messaging
2. Clicks "Activate 3 Months Free" button
3. Redirected to `/settings?action=upgrade&promo=true`
4. If not logged in:
   - Redirected to `/login?redirect=%2Fsettings%3Faction%3Dupgrade%26promo%3Dtrue`
   - Enters email and verification code
   - **After login, automatically redirected back to `/settings?action=upgrade&promo=true`**
5. Stripe checkout automatically opens with promo code field visible
6. User enters their Etsy promo code
7. Gets 3 months free

## Benefits
- ✅ Eliminates confusion from clicking email → pricing page → "Start Trial" flow
- ✅ Direct path from email to upgrade action
- ✅ Etsy users automatically get promo code field
- ✅ No manual navigation needed after login
- ✅ **URL parameters preserved through login flow**
- ✅ Clean, professional modal without trial-ending language
- ✅ Better conversion rates

## Authentication Flow Fix

### Problem Solved
Previously, when logged-out users clicked email upgrade buttons:
- They were redirected to `/login`
- URL parameters (`?action=upgrade&promo=true`) were lost
- After login, they went to dashboard/onboarding (not settings)
- They had to manually navigate to upgrade

### Solution Implemented
**Redirect Parameter Pattern:**
- AuthProvider captures original destination before redirecting to login
- Adds `?redirect=` parameter to login URL with encoded destination
- Login page preserves redirect parameter through the authentication flow
- After successful login, redirects to original destination with parameters intact

**Files Modified:**
- `components/providers/AuthProvider.tsx` - Captures and encodes destination URL
- `app/(auth)/login/page.tsx` - Checks for redirect param and uses it after auth

**Safety Features:**
- ✅ Optional parameter - doesn't affect regular login flow
- ✅ Backward compatible - existing behavior unchanged
- ✅ URL-safe encoding - parameters preserved exactly
- ✅ Console logging - easy debugging of redirect flow

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
