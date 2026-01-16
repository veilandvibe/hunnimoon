/**
 * Billing and access control helper functions
 */

import { UserBillingData, isTrialExpired } from './trial-helpers'

/**
 * Check if user can access the app (write mode)
 */
export function canAccessApp(user: UserBillingData | null): boolean {
  if (!user) return false

  // Active subscription
  if (user.billing_status === 'active') return true

  // Active trial (not expired)
  if (user.billing_status === 'trial' && !isTrialExpired(user)) return true

  return false
}

/**
 * Check if user should see read-only mode
 */
export function shouldShowReadOnlyMode(user: UserBillingData | null): boolean {
  if (!user) return false

  // Trial expired and no active subscription
  const trialExpired = isTrialExpired(user)
  const notPaid = user.billing_status !== 'active'

  return trialExpired && notPaid
}

/**
 * Get user's billing status display text
 */
export function getBillingStatusText(user: UserBillingData | null): string {
  if (!user || !user.billing_status) return 'No Plan'

  switch (user.billing_status) {
    case 'trial':
      return 'Free Trial'
    case 'active':
      return user.subscription_plan === 'yearly' ? 'Pro (Yearly)' : 'Pro (Monthly)'
    case 'expired':
      return 'Trial Expired'
    case 'canceled':
      return 'Subscription Canceled'
    default:
      return 'Unknown'
  }
}
