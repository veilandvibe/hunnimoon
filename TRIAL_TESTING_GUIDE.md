# 🧪 Trial Nudge Testing Guide

## Quick Start

1. **Start your dev server** (if not already running)
2. **Add `?test=true` to any URL** in your app
   - Example: `http://localhost:3000/dashboard?test=true`
3. **Click the purple flask icon** in the bottom-right corner
4. **Click any "Day" button** to instantly simulate that trial day
5. **Refresh to see** banners/modals appear

## What To Test

### ✅ Day 1-4: No Nudges
- **What you should see:** Nothing special, app works normally
- **Test it:** Click "Day 1" or "Day 4" button

### ⚠️ Day 5: Modal Pops Up + Banner Starts
- **What you should see:**
  - Modal appears with "Your trial ends in X days"
  - Banner shows at top of app
  - For Etsy users: Special Etsy modal with code instructions
- **Test it:** Click "Day 5" button, refresh page
- **Note:** Modal only shows once per trial (stored in localStorage)

### ⚠️ Day 6-7: Banner Shows
- **What you should see:**
  - Banner at top: "X days left in your trial"
  - "Upgrade Now" button in banner
  - Can be dismissed (but comes back on refresh)
- **Test it:** Click "Day 6" or "Day 7" button

### 🚫 Day 8+: Trial Expired
- **What you should see:**
  - Red "Trial Expired" banner
  - Modal pops up saying trial expired
  - App becomes read-only (can view but not edit)
- **Test it:** Click "Day 8" button

## Testing Panel Controls

### Jump to Trial Day Buttons
- **Day 1** - Fresh start, no warnings
- **Day 4** - Still no warnings
- **Day 5** - 🔔 Modal pops up, banner starts showing
- **Day 6** - 🔔 Banner continues
- **Day 7** - 🔔 Last day, banner still showing
- **Day 8** - ❌ Trial expired, read-only mode

### Utility Buttons
- **Reset All Modals** - Clear all modal tracking so you can see them again
- **Disable Test Mode** - Return to real-time trial calculation

## Manual Console Testing (Alternative)

If you prefer using the browser console instead of the UI panel:

```javascript
// Set to specific day
localStorage.setItem('__test_trial_day', '5')
location.reload()

// Reset modals to see them again
localStorage.removeItem('etsy_trial_expiring_shown')
sessionStorage.clear()
location.reload()

// Disable test mode
localStorage.removeItem('__test_trial_day')
location.reload()

// Clear everything
localStorage.clear()
sessionStorage.clear()
location.reload()
```

## Expected Behavior by User Type

### Regular Users (Non-Etsy)
- **Day 5-7:** Generic banner "X days left in your trial"
- **Day 8+:** Generic upgrade modal
- **Button text:** "Upgrade Now"

### Etsy Users (acq_source = 'etsy')
- **Day 5:** Special Etsy modal with code instructions
- **Day 5-7:** Banner says "Use your Etsy lifetime code"
- **Day 8+:** Etsy-specific expired modal
- **Button text:** "Apply Code" / "Activate Lifetime Access"

## Modal Tracking Explained

Modals use localStorage/sessionStorage to prevent annoying users:

| Modal | Shows When | Tracking Type | Can See Again? |
|-------|-----------|---------------|----------------|
| Etsy Welcome | First visit from Etsy | Persistent | No (one time ever) |
| Etsy Trial Expiring | Day 5 | Persistent | No (one time per trial) |
| Trial Expired | Day 8+ | Session | Yes (each new session) |
| Regular Upgrade | Day 8+ | Session | Yes (each new session) |

**To reset for testing:** Use "Reset All Modals" button or clear localStorage

## Common Testing Scenarios

### Scenario 1: Test Full Trial Journey
```
1. Click "Day 1" → See no nudges
2. Click "Day 4" → Still no nudges
3. Click "Day 5" → Modal pops up, banner appears
4. Click "Day 6" → Banner still shows
5. Click "Day 7" → Last day warning
6. Click "Day 8" → Expired modal, read-only mode
```

### Scenario 2: Test Modal Only Shows Once
```
1. Click "Day 5" → Modal appears
2. Close modal
3. Refresh page → Modal doesn't show again
4. Click "Reset All Modals"
5. Refresh page → Modal shows again!
```

### Scenario 3: Test Banner Can Be Dismissed
```
1. Click "Day 6" → Banner shows
2. Click X on banner → Banner disappears
3. Refresh page → Banner comes back (session-based)
```

## Before Production Deployment

**CRITICAL:** Remove these testing features before deploying:

1. ❌ Delete `components/trial/TrialTestingPanel.tsx`
2. ❌ Remove import/usage from `components/layout/MainLayout.tsx`
3. ❌ Remove testing override code from `lib/trial-helpers.ts` (lines with 🧪)
4. ✅ Change trial duration back to 7 days in `lib/trial-helpers.ts`:
   ```typescript
   const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000  // 7 days
   ```
5. ❌ Delete this testing guide file (`TRIAL_TESTING_GUIDE.md`)

## Files Modified for Testing

- `lib/trial-helpers.ts` - Added test override in `getTrialDayNumber()`
- `components/trial/TrialTestingPanel.tsx` - NEW testing UI panel
- `components/layout/MainLayout.tsx` - Added testing panel import

## Troubleshooting

**Modal not showing?**
- Click "Reset All Modals" button
- Or clear localStorage/sessionStorage manually

**Banner not showing on Day 5-7?**
- Make sure you're in trial status (billing_status = 'trial')
- Check browser console for "🧪 TEST MODE" log

**Read-only mode not working on Day 8?**
- Check that billing_status is still 'trial' (not 'active')
- Expired trials with no payment = read-only mode

**Testing panel not visible?**
- Make sure URL has `?test=true` parameter
- Look for purple flask icon in bottom-right corner

---

**Questions?** Check the code comments in the modified files or ask for clarification!
