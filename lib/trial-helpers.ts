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

  // 🧪 TEST MODE: Calculate days based on test day override
  let daysRemaining: number
  if (typeof window !== 'undefined') {
    const testDay = localStorage.getItem('__test_trial_day')
    if (testDay) {
      const currentDay = parseInt(testDay, 10)
      if (!isNaN(currentDay)) {
        // If we're on day X, there are (7 - X + 1) days remaining
        // Day 1 = 7 days remaining, Day 7 = 1 day remaining, Day 8 = 0 days remaining
        daysRemaining = Math.max(0, 7 - currentDay + 1)
      } else {
        const now = new Date()
        const msRemaining = endDate.getTime() - now.getTime()
        daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24))
      }
    } else {
      const now = new Date()
      const msRemaining = endDate.getTime() - now.getTime()
      daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24))
    }
  } else {
    const now = new Date()
    const msRemaining = endDate.getTime() - now.getTime()
    daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24))
  }

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
  // 🧪 TEST MODE: Check for test override
  if (typeof window !== 'undefined') {
    const testType = localStorage.getItem('__test_user_type')
    if (testType === 'etsy') return true
    if (testType === 'regular' || testType === 'lifetime') return false
  }
  
  return user?.acq_source === 'etsy'
}

/**
 * Check if user has lifetime access
 */
export function isLifetimeUser(user: UserBillingData | null): boolean {
  // 🧪 TEST MODE: Check for test override
  if (typeof window !== 'undefined') {
    const testType = localStorage.getItem('__test_user_type')
    if (testType === 'lifetime') return true
    if (testType === 'regular' || testType === 'etsy') return false
  }
  
  return user?.acq_source === 'lifetime'
}

/**
 * Get the trial day number (1-7)
 */
export function getTrialDayNumber(user: UserBillingData | null): number {
  // 🧪 TEST MODE: Check for manual day override
  if (typeof window !== 'undefined') {
    const testDay = localStorage.getItem('__test_trial_day')
    if (testDay) {
      const day = parseInt(testDay, 10)
      if (!isNaN(day)) return day
    }
  }
  
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
