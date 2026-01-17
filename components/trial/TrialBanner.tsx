'use client'

import { useState } from 'react'
import { X, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'
import { UserBillingData, shouldShowTrialWarning, getUserTrialStatus, isEtsyUser } from '@/lib/trial-helpers'
import { hasModalBeenShownThisSession, markModalAsShown } from '@/lib/modal-manager'

interface TrialBannerProps {
  user: UserBillingData
  onUpgradeClick: () => void
}

export default function TrialBanner({ user, onUpgradeClick }: TrialBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  
  const showWarning = shouldShowTrialWarning(user)
  const trialStatus = getUserTrialStatus(user)
  const isEtsy = isEtsyUser(user)

  if (!showWarning || isDismissed || !trialStatus.isActive) return null

  const handleDismiss = () => {
    setIsDismissed(true)
    markModalAsShown('upgrade_modal_shown', false) // Session only
  }

  return (
    <div className="bg-gradient-to-r from-pink-primary to-pink-primary/90 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Clock size={20} className="flex-shrink-0" />
          <div className="text-sm">
            {isEtsy ? (
              <p>
                <strong>💝 Your trial ends in {trialStatus.daysRemaining} {trialStatus.daysRemaining === 1 ? 'day' : 'days'}!</strong> Use your Etsy code to get 3 months free.
              </p>
            ) : (
              <p>
                <strong>{trialStatus.daysRemaining} {trialStatus.daysRemaining === 1 ? 'day' : 'days'} left in your trial.</strong> Upgrade to keep full access.
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={onUpgradeClick}
            variant="secondary"
            size="sm"
            className="whitespace-nowrap"
          >
            {isEtsy ? 'Apply Code' : 'Upgrade Now'}
          </Button>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            aria-label="Dismiss banner"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
