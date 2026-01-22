'use client'

import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface LifetimeWelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  onStartTrial: () => void
  onUpgrade?: () => void
}

export default function LifetimeWelcomeModal({
  isOpen,
  onClose,
  onStartTrial,
  onUpgrade,
}: LifetimeWelcomeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome! 🎉"
      size="md"
    >
      <div className="space-y-6">
        <p className="text-pink-primary/80">
          You have lifetime access! When your 7-day trial ends, enter your promo code at checkout—you won't be charged.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              onUpgrade?.()
              onClose()
            }}
            variant="primary"
            fullWidth
            size="lg"
          >
            Activate Lifetime Access
          </Button>
          
          <Button
            onClick={() => {
              onStartTrial()
              onClose()
            }}
            variant="outline"
            fullWidth
            size="lg"
          >
            Continue to Free Trial
          </Button>
        </div>
      </div>
    </Modal>
  )
}
