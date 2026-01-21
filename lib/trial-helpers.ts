/**
 * Trial and billing helper functions
 */

export interface TrialStatus {
  isActive: boolean
  daysRemaining: number
  startDate: Date | null
  endDate: Date | null
  isExpired: boolean
}

export interface UserBillingData {
  trial_start_date?: number | null
  billing_status?: 'trial' | 'active' | 'expired' | 'canceled' | null
  acq_source?: string | null
  acq_source_set_at?: number | null
  stripe_customer_id?: string | null
  stripe_subscription_id?: string | null
  subscription_plan?: 'monthly' | 'yearly' | null
}

const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000  // 7 days for production

/**
 * Get the current trial status for a user
 */
export function getUserTrialStatus(user: UserBillingData | null): TrialStatus {
  if (!user || !user.trial_start_date) {
    return {
      isActive: false,
      daysRemaining: 0,
      startDate: null,
      endDate: null,
      isExpired: false,
    }
  }

  const startDate = new Date(user.trial_start_date)
  const endDate = new Date(startDate.getTime() + TRIAL_DURATION_MS)

  const now = new Date()
  const msRemaining = endDate.getTime() - now.getTime()
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24))

  const isActive = user.billing_status === 'trial' && daysRemaining > 0
  const isExpired = daysRemaining <= 0 && user.billing_status === 'trial'

  return {
    isActive,
    daysRemaining: Math.max(0, daysRemaining),
    startDate,
    endDate,
    isExpired,
  }
}

/**
 * Check if user's trial has expired
 */
export function isTrialExpired(user: UserBillingData | null): boolean {
  const status = getUserTrialStatus(user)
  return status.isExpired
}

/**
 * Get user's acquisition source
 */
export function getUserAcqSource(user: UserBillingData | null): string | null {
  return user?.acq_source || null
}

/**
 * Check if user came from Etsy
 */
export function isEtsyUser(user: UserBillingData | null): boolean {
  return user?.acq_source === 'etsy'
}

/**
 * Get the trial day number (1-7)
 */
export function getTrialDayNumber(user: UserBillingData | null): number {
  const status = getUserTrialStatus(user)
  if (!status.isActive || !status.startDate) return 0
  
  const now = new Date()
  const daysPassed = Math.floor(
    (now.getTime() - status.startDate.getTime()) / (1000 * 60 * 60 * 24)
  )
  
  return daysPassed + 1 // Day 1-7
}

/**
 * Check if user should see trial warning (days 5-7)
 */
export function shouldShowTrialWarning(user: UserBillingData | null): boolean {
  const dayNumber = getTrialDayNumber(user)
  return dayNumber >= 5 && dayNumber <= 7
}
