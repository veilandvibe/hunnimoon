'use client'

import { useState } from 'react'
import Modal from '@/components/ui/Modal'
import PlanSelector from '@/components/billing/PlanSelector'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectPlan: (plan: 'monthly' | 'yearly') => void
  loading?: boolean
}

export default function UpgradeModal({ 
  isOpen, 
  onClose, 
  onSelectPlan,
  loading = false 
}: UpgradeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Your Trial Has Ended"
      size="lg"
    >
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-pink-primary/70 mb-4">
            Your 7-day trial has ended. Upgrade to Hunnimoon Pro to continue managing your wedding with full access to all features.
          </p>
          <p className="text-sm text-pink-primary/60">
            Don't worry – your data is safe! We never delete your information.
          </p>
        </div>

        <PlanSelector
          onSelectPlan={onSelectPlan}
          loading={loading}
          showTrialCard={false}
        />

        <p className="text-xs text-pink-primary/60 text-center">
          Have questions? Email us at <a href="mailto:support@hunnimoon.app" className="underline">support@hunnimoon.app</a>
        </p>
      </div>
    </Modal>
  )
}
