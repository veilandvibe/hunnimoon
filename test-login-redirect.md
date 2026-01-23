# Testing Login Redirect Flow

## How to Test the Email Upgrade Flow (Logged Out)

### Test 1: Regular User - Trial Expired Email
**Scenario:** User clicks "Upgrade to Pro" while logged out

1. **Sign out** from your account (if logged in)

2. **Send test email:**
```bash
curl -X POST http://localhost:3000/api/emails/send-trial-expired \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test@example.com","firstName":"John","isEtsyUser":false}'
```

3. **Click "Upgrade to Pro"** button in email

4. **Expected behavior:**
   - ✅ Redirected to `/login?redirect=%2Fsettings%3Faction%3Dupgrade`
   - ✅ See console log: `[Login] Redirect parameter detected: /settings?action=upgrade`

5. **Enter your email and verification code**

6. **After successful login:**
   - ✅ See console log: `[Login] Redirecting to: /settings?action=upgrade`
   - ✅ Redirected to Settings page
   - ✅ See console log: `[Settings] Detected upgrade action, promo: null`
   - ✅ See console log: `[Settings] Setting autoOpenUpgrade to true`
   - ✅ **Upgrade modal opens automatically**

7. **Select a plan** and verify Stripe checkout opens (no promo field)

---

### Test 2: Etsy User - Trial Expired Email
**Scenario:** Etsy user clicks "Activate 3 Months Free" while logged out

1. **Sign out** from your account (if logged in)

2. **Send test email:**
```bash
curl -X POST http://localhost:3000/api/emails/send-trial-expired \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test@example.com","firstName":"Jane","isEtsyUser":true}'
```

3. **Click "Activate 3 Months Free"** button in email

4. **Expected behavior:**
   - ✅ Redirected to `/login?redirect=%2Fsettings%3Faction%3Dupgrade%26promo%3Dtrue`
   - ✅ See console log: `[Login] Redirect parameter detected: /settings?action=upgrade&promo=true`

5. **Enter your email and verification code**

6. **After successful login:**
   - ✅ See console log: `[Login] Redirecting to: /settings?action=upgrade&promo=true`
   - ✅ Redirected to Settings page
   - ✅ See console log: `[Settings] Detected upgrade action, promo: true`
   - ✅ See console log: `[Settings] Setting autoOpenPromo to true`
   - ✅ See console log: `[BillingSection] Auto-triggering promo code checkout for Etsy user`
   - ✅ **Stripe checkout opens automatically with promo code field visible**

---

### Test 3: Regular Login (No Redirect)
**Scenario:** User goes directly to login page

1. **Sign out** from your account (if logged in)

2. **Navigate directly to:** `http://localhost:3000/login`

3. **Expected behavior:**
   - ✅ No redirect parameter in URL
   - ✅ No console log about redirect parameter

4. **Enter your email and verification code**

5. **After successful login:**
   - ✅ Redirected to `/dashboard` (if returning user) or `/onboarding` (if new user)
   - ✅ **Normal login flow unchanged**

---

### Test 4: Already Logged In
**Scenario:** User clicks email button while already logged in

1. **Make sure you're logged in**

2. **Send test email:**
```bash
curl -X POST http://localhost:3000/api/emails/send-trial-expiring \
  -H "Content-Type: application/json" \
  -d '{"email":"your-test@example.com","firstName":"Test","daysLeft":2,"isEtsyUser":true}'
```

3. **Click "Activate Your 3 Months Free"** button in email

4. **Expected behavior:**
   - ✅ Directly taken to `/settings?action=upgrade&promo=true`
   - ✅ **No login page** (already authenticated)
   - ✅ Stripe checkout opens immediately with promo field

---

## Console Logs to Watch For

Open your browser's Developer Console (F12) and watch for these logs:

### For Logged-Out Users:
```
[Login] Redirect parameter detected: /settings?action=upgrade&promo=true
[Login] Redirecting to: /settings?action=upgrade&promo=true
[Settings] Detected upgrade action, promo: true
[Settings] Setting autoOpenPromo to true
[BillingSection] Auto-triggering promo code checkout for Etsy user
[BillingSection] handleApplyPromoCode called with user: {id: "...", email: "..."}
[BillingSection] Redirecting to Stripe checkout with promo field enabled
```

### For Logged-In Users:
```
[Settings] Detected upgrade action, promo: true
[Settings] Setting autoOpenPromo to true
[BillingSection] Auto-triggering promo code checkout for Etsy user
[BillingSection] handleApplyPromoCode called with user: {id: "...", email: "..."}
[BillingSection] Redirecting to Stripe checkout with promo field enabled
```

---

## Troubleshooting

### Issue: Redirected to dashboard after login
**Cause:** Redirect parameter not captured or lost  
**Check:** Look at the login URL - does it have `?redirect=` in it?

### Issue: Modal doesn't auto-open after login
**Cause:** URL parameters lost during redirect  
**Check:** After login, does the URL show `/settings?action=upgrade`?

### Issue: Promo field not showing in Stripe
**Cause:** `promo=true` parameter missing  
**Check:** URL should be `/settings?action=upgrade&promo=true`

### Issue: Regular login broken
**Cause:** Should not happen - redirect param is optional  
**Check:** Go directly to `/login` and verify it works as before
