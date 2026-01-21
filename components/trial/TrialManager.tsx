'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import db from '@/lib/instant'
import TrialBanner from './TrialBanner'
import ReadOnlyBanner from './ReadOnlyBanner'
import UpgradeModal from './UpgradeModal'
import EtsyWelcomeModal from '@/components/etsy/EtsyWelcomeModal'
import EtsyTrialExpiringModal from '@/components/etsy/EtsyTrialExpiringModal'
import EtsyTrialExpiredModal from '@/components/etsy/EtsyTrialExpiredModal'
import { 
  getUserTrialStatus, 
  isEtsyUser, 
  getTrialDayNumber,
  UserBillingData 
} from '@/lib/trial-helpers'
import { shouldShowReadOnlyMode } from '@/lib/billing-status'
import {
  hasModalBeenShown,
  hasModalBeenShownThisSession,
  markModalAsShown,
} from '@/lib/modal-manager'
import { useTour } from '@/components/providers/TourContext'

export default function TrialManager() {
  const router = useRouter()
  const { user } = db.useAuth()
  const { onboardingCompleted } = useTour()
  
  // Query user data with billing fields
  const { data } = db.useQuery(
    user?.id ? {
      $users: {
        $: {
          where: {
            id: user.id
          }
        }
      }
    } : null
  )
  
  const userData = data?.$users?.[0] as UserBillingData | undefined
  
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [etsyWelcomeOpen, setEtsyWelcomeOpen] = useState(false)
  const [etsyExpiringOpen, setEtsyExpiringOpen] = useState(false)
  const [etsyExpiredOpen, setEtsyExpiredOpen] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  // Check if we should show Etsy welcome modal - wait for onboarding to complete
  useEffect(() => {
    if (!userData) return

    // Show Etsy welcome if they're an Etsy user, on trial, and haven't seen it
    // Use database acq_source (permanent) instead of localStorage (temporary)
    if (isEtsyUser(userData) && 
        userData.billing_status === 'trial' && 
        !hasModalBeenShown('etsy_welcome_shown')) {
      
      // If onboarding not complete, wait for it
      if (!onboardingCompleted) {
        // Check again later
        const checkInterval = setInterval(() => {
          const completed = localStorage.getItem('onboardingCompleted') === 'true'
          if (completed) {
            clearInterval(checkInterval)
            // Small delay after onboarding finishes
            setTimeout(() => {
              setEtsyWelcomeOpen(true)
              markModalAsShown('etsy_welcome_shown', true) // Persistent
            }, 2000) // 2 seconds after onboarding closes
          }
        }, 1000)
        
        return () => clearInterval(checkInterval)
      } else {
        // Onboarding already complete, show after short delay
        const timer = setTimeout(() => {
          setEtsyWelcomeOpen(true)
          markModalAsShown('etsy_welcome_shown', true) // Persistent
        }, 2000)
        
        return () => clearTimeout(timer)
      }
    }
  }, [userData, onboardingCompleted])

  // Check trial status and show appropriate modals
  useEffect(() => {
    if (!userData) return

    const trialStatus = getUserTrialStatus(userData)
    const isEtsy = isEtsyUser(userData)
    const dayNumber = getTrialDayNumber(userData)

    // Trial expired - show appropriate modal
    if (trialStatus.isExpired && userData.billing_status === 'trial') {
      if (isEtsy) {
        // Show Etsy-specific expired modal
        if (!hasModalBeenShownThisSession('etsy_trial_expired_shown')) {
          setEtsyExpiredOpen(true)
          markModalAsShown('etsy_trial_expired_shown', false) // Session only
        }
      } else {
        // Show regular upgrade modal
        if (!hasModalBeenShownThisSession('upgrade_modal_shown')) {
          setUpgradeModalOpen(true)
          markModalAsShown('upgrade_modal_shown', false) // Session only
        }
      }
    }

    // Trial expiring soon (days 5-6 for Etsy users, show warning modal at day 5)
    if (isEtsy && trialStatus.isActive && dayNumber === 5) {
      if (!hasModalBeenShown('etsy_trial_expiring_shown')) {
        setEtsyExpiringOpen(true)
        markModalAsShown('etsy_trial_expiring_shown', true) // Only show once per trial
      }
    }
  }, [userData])

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    if (!user) return

    setCheckoutLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          userId: user.id,
          userEmail: user.email,
          allowPromoCode: false,
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error)
      alert(error.message || 'Failed to start checkout')
      setCheckoutLoading(false)
    }
  }

  const handleActivateCode = async () => {
    if (!user) return

    setCheckoutLoading(true)
    try {
      // Open checkout with promo code field enabled
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'monthly', // Default to monthly for Etsy 3-month promo
          userId: user.id,
          userEmail: user.email,
          allowPromoCode: true, // Enable promo code field
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error)
      alert(error.message || 'Failed to start checkout')
      setCheckoutLoading(false)
    }
  }

  const handleStartTrial = () => {
    // Already in trial, just close modal
    router.push('/dashboard')
  }

  if (!userData) return null

  const showReadOnly = shouldShowReadOnlyMode(userData)
  const trialStatus = getUserTrialStatus(userData)
  const isEtsy = isEtsyUser(userData)

  return (
    <>
      {/* Trial Warning Banner (days 5-7) */}
      {trialStatus.isActive && (
        <TrialBanner 
          user={userData} 
          onUpgradeClick={() => {
            if (isEtsy) {
              handleActivateCode()
            } else {
              setUpgradeModalOpen(true)
            }
          }}
        />
      )}

      {/* Read-Only Banner (after trial expires) */}
      {showReadOnly && (
        <ReadOnlyBanner 
          onUpgradeClick={() => {
            if (isEtsy) {
              handleActivateCode()
            } else {
              setUpgradeModalOpen(true)
            }
          }}
        />
      )}

      {/* Regular Upgrade Modal (for non-Etsy users) */}
      {!isEtsy && (
        <UpgradeModal
          isOpen={upgradeModalOpen}
          onClose={() => setUpgradeModalOpen(false)}
          onSelectPlan={handleUpgrade}
          loading={checkoutLoading}
          isTrialExpired={trialStatus.isExpired}
        />
      )}

      {/* Etsy Welcome Modal (first time from Etsy link) */}
      {isEtsy && (
        <EtsyWelcomeModal
          isOpen={etsyWelcomeOpen}
          onClose={() => setEtsyWelcomeOpen(false)}
          onStartTrial={handleStartTrial}
          onUpgrade={handleActivateCode}
        />
      )}

      {/* Etsy Trial Expiring Modal (2 days before end) */}
      {isEtsy && (
        <EtsyTrialExpiringModal
          isOpen={etsyExpiringOpen}
          onClose={() => setEtsyExpiringOpen(false)}
          onActivateCode={handleActivateCode}
          daysRemaining={trialStatus.daysRemaining}
        />
      )}

      {/* Etsy Trial Expired Modal (after trial ends) */}
      {isEtsy && (
        <EtsyTrialExpiredModal
          isOpen={etsyExpiredOpen}
          onClose={() => setEtsyExpiredOpen(false)}
          onActivateCode={handleActivateCode}
        />
      )}
    </>
  )
}
