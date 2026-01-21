# ✅ Etsy User Flow - Production Ready

## 🎉 What Was Fixed

### 1. **Landing Page Modal Race Condition** (FIXED)
**Problem:** The Etsy welcome modal wasn't showing on the landing page at `https://hunnimoon.app?src=etsy`

**Root Cause:** Race condition between `SourceTracker` (setting localStorage) and the landing page component (reading localStorage)

**Solution:** 
- Created a dedicated `EtsyModalHandler` component that reads BOTH:
  - URL params directly (`?src=etsy`)
  - localStorage value (set by SourceTracker)
- Wrapped it in a Suspense boundary for proper SSR handling
- Now works regardless of which component loads first

### 2. **Testing Overrides Removed** (PRODUCTION SAFE)
Removed all testing localStorage overrides from `trial-helpers.ts`:
- ❌ Removed: `__test_etsy_user` override
- ❌ Removed: `__test_trial_day` override
- ❌ Removed: Debug console logs from landing page

**Why:** These could interfere with production if users somehow set these keys. Now the app relies solely on the database values.

---

## 🔄 Complete Etsy User Journey

### **Step 1: Landing Page** → `https://hunnimoon.app?src=etsy`

**What Happens:**
1. `SourceTracker` captures `?src=etsy` from URL
2. Stores `'etsy'` to `localStorage.acq_source`
3. Landing page checks BOTH URL params AND localStorage
4. **Modal appears after 2.5 seconds** (if not shown before)
5. Modal only shows once (tracked by `localStorage.etsy_landing_modal_shown`)

**File:** `app/(marketing)/page.tsx` (lines 14-46)

---

### **Step 2: Login/Signup** → User creates account

**What Happens:**
- User enters email and verifies magic code
- No interaction with `acq_source` here
- Redirected to `/onboarding` after successful login

**File:** `app/(auth)/login/page.tsx`

---

### **Step 3: Onboarding** → **CRITICAL HANDOFF POINT** 🔑

**What Happens:**
1. Reads `acq_source` from **localStorage**
2. Creates wedding record in database
3. **Permanently stores `acq_source` to user record in database**
4. Sets `trial_start_date` and `billing_status: 'trial'`
5. **CLEARS `acq_source` from localStorage** (prevents future overwrites)
6. Sends welcome email (Etsy-specific or standard)

**Code:**
```typescript
// Line 284-286: Read from localStorage
const acqSource = typeof window !== 'undefined' 
  ? localStorage.getItem('acq_source') 
  : null

// Lines 301-308: Store to database
db.tx.$users[user.id].update({
  trial_start_date: now,
  billing_status: 'trial',
  ...(acqSource && {
    acq_source: acqSource,           // ← PERMANENT storage
    acq_source_set_at: now,
  }),
})

// Lines 330-333: Clear localStorage
if (typeof window !== 'undefined' && acqSource) {
  localStorage.removeItem('acq_source')
}
```

**File:** `app/(auth)/onboarding/page.tsx`

---

### **Step 4: Trial Manager** → Handles all modals after onboarding

**What Happens:**
The `TrialManager` component runs on every authenticated page and manages:

#### **4a. Etsy Welcome Modal** (After Onboarding)
- **When:** After onboarding completes, wait 2 seconds
- **Check:** `isEtsyUser(userData)` → reads `user.acq_source` from **database**
- **Show Once:** Tracked by `localStorage.etsy_welcome_shown` (persistent)
- **Content:** Explains 3 months free promo code from Etsy PDF

**File:** `components/trial/TrialManager.tsx` (lines 52-88)

#### **4b. Trial Expiring Modal** (Day 5)
- **When:** Trial day === 5 (for Etsy users only)
- **Check:** `isEtsyUser(userData)` && `dayNumber === 5`
- **Show Once:** Tracked by `localStorage.etsy_trial_expiring_shown` (persistent)
- **Content:** Reminds them to get their code before trial ends

**File:** `components/trial/TrialManager.tsx` (lines 116-121)
**Component:** `components/etsy/EtsyTrialExpiringModal.tsx`

#### **4c. Trial Expired Modal** (Day 8+)
- **When:** Trial has expired (`billing_status === 'trial'` && days remaining <= 0)
- **Check:** `isEtsyUser(userData)` && `trialStatus.isExpired`
- **Show Once Per Session:** Tracked by `localStorage.etsy_trial_expired_shown` (session only)
- **Content:** Encourages them to activate their 3 months free

**File:** `components/trial/TrialManager.tsx` (lines 99-112)
**Component:** `components/etsy/EtsyTrialExpiredModal.tsx`

#### **4d. Trial Banner** (Days 5-7)
- **When:** Days 5, 6, or 7 of trial
- **For:** Both Etsy and regular users
- **Content:** Shows days remaining and upgrade button
- **Etsy Difference:** Button says "Activate Code" instead of "Upgrade"

**File:** `components/trial/TrialManager.tsx` (lines 198-210)
**Component:** `components/trial/TrialBanner.tsx`

#### **4e. Read-Only Banner** (After Expiration)
- **When:** Trial expired and still on `billing_status: 'trial'`
- **For:** Both Etsy and regular users
- **Content:** App is read-only, prompts to upgrade
- **Etsy Difference:** Button says "Activate Code"

**File:** `components/trial/TrialManager.tsx` (lines 213-223)
**Component:** `components/trial/ReadOnlyBanner.tsx`

---

## 🔍 How Etsy Detection Works (Production)

### Primary Detection (Database)
```typescript
// lib/trial-helpers.ts (lines 98-100)
export function isEtsyUser(user: UserBillingData | null): boolean {
  return user?.acq_source === 'etsy'
}
```

**Key Points:**
- ✅ Reads from **database** (`user.acq_source`)
- ✅ Set during onboarding (permanent)
- ✅ Survives browser clears, device changes, etc.
- ✅ Cannot be accidentally overridden
- ❌ Testing overrides removed for production

---

## 📋 Verification Checklist

### **Test 1: Landing Page Modal**
1. Clear localStorage: `localStorage.clear()`
2. Visit: `https://hunnimoon.app?src=etsy`
3. Wait 2.5 seconds
4. ✅ "Welcome from Etsy! 🎉" modal should appear
5. Close modal or click button
6. Reload page
7. ✅ Modal should NOT appear again (already shown)

### **Test 2: Complete Signup Flow**
1. Clear localStorage and start fresh
2. Visit: `https://hunnimoon.app?src=etsy`
3. Click "Start Free Trial" or "Get Started"
4. Complete signup with email + magic code
5. Complete onboarding (names, date, slug)
6. ✅ Should redirect to dashboard
7. Wait 2 seconds
8. ✅ "Welcome from Etsy! 🎉" modal should appear (different from landing modal)

### **Test 3: Trial Timeline (Requires Database Manipulation)**
Since testing overrides are removed, you'll need to manually adjust `trial_start_date` in the database:

#### Day 5 Modal:
1. Set `trial_start_date` to 4 days ago
2. Clear modal tracking: `localStorage.removeItem('etsy_trial_expiring_shown')`
3. Reload dashboard
4. ✅ "Your trial ends in 3 days" modal should appear (Etsy version)
5. ✅ Banner at top should show "3 days remaining"

#### Day 6-7 Banner:
1. Set `trial_start_date` to 5-6 days ago
2. ✅ Banner should show "2 days remaining" or "1 day remaining"
3. ✅ Button says "Activate 3 Months Free" (not "Upgrade")

#### Day 8+ Expired:
1. Set `trial_start_date` to 8+ days ago
2. Clear session tracking: `sessionStorage.clear()`
3. ✅ "Your trial has ended" modal (Etsy version)
4. ✅ Red banner at top: "Your trial has ended"
5. ✅ App is in read-only mode
6. ✅ Button says "Get 3 Months Free"

### **Test 4: Regular User (Non-Etsy)**
1. Visit: `https://hunnimoon.app` (NO ?src=etsy)
2. Complete signup and onboarding
3. ✅ Should NOT see Etsy welcome modal
4. ✅ Should see regular trial banner on days 5-7
5. ✅ Should see regular upgrade modal when expired
6. ✅ Buttons say "Upgrade" (not "Activate Code")

---

## 🎯 Key Differences: Etsy vs Regular Users

| Feature | Etsy User | Regular User |
|---------|-----------|--------------|
| **Landing Modal** | ✅ Yes (if from ?src=etsy) | ❌ No |
| **Welcome Modal (after onboarding)** | ✅ Yes (explains 3-month code) | ❌ No |
| **Day 5 Modal** | ✅ Yes ("Trial ends in X days") | ❌ No (just banner) |
| **Trial Expired Modal** | ✅ Yes (Etsy-specific copy) | ✅ Yes (generic copy) |
| **Banner Button Text** | "Activate 3 Months Free" | "Upgrade Now" |
| **Checkout Flow** | Opens with promo code field enabled | Standard checkout |
| **Detection Method** | `user.acq_source === 'etsy'` | `user.acq_source !== 'etsy'` |

---

## 🚀 Production Deployment Notes

### Environment Variables Required
Make sure these are set in production (see `ENV_VARIABLES_TO_ADD.md`):
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `INSTANT_APP_ID`
- `NEXT_PUBLIC_INSTANT_APP_ID`

### Files Modified for Production
- ✅ `app/(marketing)/page.tsx` - Fixed race condition, removed debug logs
- ✅ `lib/trial-helpers.ts` - Removed testing overrides
- ✅ `components/trial/TrialManager.tsx` - Uses database values only
- ✅ `app/(auth)/onboarding/page.tsx` - Properly transfers acq_source to DB

### Safe to Deploy
All changes are **backwards compatible** and **production-safe**:
- No breaking changes to existing users
- Testing panel still works but only with `?test=true` URL param (hidden by default)
- All Etsy-specific logic is isolated and won't affect regular users

---

## 🐛 Troubleshooting

### "Modal not appearing on landing page"
- Clear localStorage: `localStorage.clear()`
- Check URL has `?src=etsy`
- Check console for `[SourceTracker] Acquisition source captured: etsy`
- Wait full 2.5 seconds

### "Etsy modals appearing for regular users"
- Check database: query user record for `acq_source` field
- Should be `null` or empty for regular users
- If set to 'etsy', they came through the Etsy link at some point

### "Welcome modal appearing multiple times"
- Clear: `localStorage.removeItem('etsy_welcome_shown')`
- This is tracked per-browser, so clearing localStorage resets it

### "Trial day/expiring modals not showing"
- Verify `trial_start_date` in database is correct
- Check `billing_status` is `'trial'`
- Clear modal flags if testing:
  - `localStorage.removeItem('etsy_trial_expiring_shown')`
  - `sessionStorage.clear()` (for expired modal)

---

## 📊 Database Schema

### User Record (relevant fields)
```typescript
{
  id: string
  email: string
  trial_start_date: number | null        // Timestamp when trial started
  billing_status: 'trial' | 'active' | 'expired' | 'canceled' | null
  acq_source: string | null              // 'etsy' for Etsy users
  acq_source_set_at: number | null       // When acq_source was set
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_plan: 'monthly' | 'yearly' | null
}
```

---

## ✅ Summary

**All Etsy-specific functionality is now production-ready:**
- ✅ Landing page modal works (race condition fixed)
- ✅ Onboarding properly stores acq_source to database
- ✅ All trial modals use database values (not localStorage)
- ✅ Testing overrides removed for production safety
- ✅ Etsy detection is reliable and permanent
- ✅ No localStorage dependencies for core functionality
- ✅ Works across devices, browsers, and sessions

**The only localStorage used is for:**
- Modal "shown" flags (to prevent re-showing)
- Temporary acquisition source (cleared after onboarding)
- SourceTracker coordination (only on landing page)

All critical data lives in the database and will work reliably in production! 🎉
