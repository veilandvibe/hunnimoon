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
  let daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24))

  // 🧪 TESTING OVERRIDE - REMOVE BEFORE PRODUCTION!
  // If test mode is active, override the trial status based on test day
  if (typeof window !== 'undefined') {
    const testDay = localStorage.getItem('__test_trial_day')
    if (testDay) {
      const dayNum = parseInt(testDay, 10)
      // Calculate how many days remaining based on test day (7 day trial)
      daysRemaining = Math.max(0, 7 - dayNum + 1)
      
      const isActive = user.billing_status === 'trial' && dayNum <= 7
      const isExpired = dayNum > 7 && user.billing_status === 'trial'

      return {
        isActive,
        daysRemaining,
        startDate,
        endDate,
        isExpired,
      }
    }
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
  // 🧪 TESTING OVERRIDE - REMOVE BEFORE PRODUCTION!
  if (typeof window !== 'undefined') {
    const testEtsy = localStorage.getItem('__test_etsy_user')
    if (testEtsy === 'true') {
      console.log('🧪 TEST MODE: Simulating ETSY user')
      return true
    } else if (testEtsy === 'false') {
      console.log('🧪 TEST MODE: Simulating REGULAR user')
      return false
    }
  }
  
  return user?.acq_source === 'etsy'
}

/**
 * Get the trial day number (1-7)
 */
export function getTrialDayNumber(user: UserBillingData | null): number {
  // 🧪 TESTING OVERRIDE - REMOVE BEFORE PRODUCTION!
  // To test different trial days, run in browser console:
  // localStorage.setItem('__test_trial_day', '5')  // Test day 5 modal
  // localStorage.setItem('__test_trial_day', '6')  // Test day 6 banner
  // localStorage.setItem('__test_trial_day', '8')  // Test expired state
  // Then reload the page. Remove with: localStorage.removeItem('__test_trial_day')
  if (typeof window !== 'undefined') {
    const testDay = localStorage.getItem('__test_trial_day')
    if (testDay) {
      const dayNum = parseInt(testDay, 10)
      console.log('🧪 TEST MODE: Simulating trial day', dayNum)
      return dayNum
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
