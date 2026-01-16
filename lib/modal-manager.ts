/**
 * Modal display tracking and management
 * Uses localStorage to track which modals have been shown
 */

export type ModalKey = 
  | 'etsy_welcome_shown'
  | 'etsy_trial_expiring_shown'
  | 'etsy_trial_expired_shown'
  | 'upgrade_modal_shown'

/**
 * Check if a modal has been shown in this session/ever
 */
export function hasModalBeenShown(key: ModalKey): boolean {
  if (typeof window === 'undefined') return true
  return localStorage.getItem(key) === 'true'
}

/**
 * Mark a modal as shown
 */
export function markModalAsShown(key: ModalKey, persistent: boolean = false): void {
  if (typeof window === 'undefined') return
  
  if (persistent) {
    // Store permanently (for modals that should only show once ever)
    localStorage.setItem(key, 'true')
  } else {
    // Store for this session only
    sessionStorage.setItem(key, 'true')
  }
}

/**
 * Check if modal was shown in current session only
 */
export function hasModalBeenShownThisSession(key: ModalKey): boolean {
  if (typeof window === 'undefined') return true
  return sessionStorage.getItem(key) === 'true'
}

/**
 * Reset modal tracking (useful for testing)
 */
export function resetModalTracking(key?: ModalKey): void {
  if (typeof window === 'undefined') return
  
  if (key) {
    localStorage.removeItem(key)
    sessionStorage.removeItem(key)
  } else {
    // Reset all modals
    const keys: ModalKey[] = [
      'etsy_welcome_shown',
      'etsy_trial_expiring_shown',
      'etsy_trial_expired_shown',
      'upgrade_modal_shown',
    ]
    keys.forEach(k => {
      localStorage.removeItem(k)
      sessionStorage.removeItem(k)
    })
  }
}

/**
 * Clear session-only modals (call on new session)
 */
export function clearSessionModals(): void {
  if (typeof window === 'undefined') return
  
  const sessionKeys: ModalKey[] = [
    'upgrade_modal_shown',
    'etsy_trial_expired_shown',
  ]
  
  sessionKeys.forEach(key => sessionStorage.removeItem(key))
}
