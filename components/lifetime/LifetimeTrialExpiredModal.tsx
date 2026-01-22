'use client'

import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface LifetimeTrialExpiredModalProps {
  isOpen: boolean
  onClose: () => void
  onActivateCode: () => void
}

export default function LifetimeTrialExpiredModal({
  isOpen,
  onClose,
  onActivateCode,
}: LifetimeTrialExpiredModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Your trial has ended"
      size="md"
    >
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-pink-primary/80">
            But you can keep going! You have lifetime access.
          </p>
          <p className="text-pink-primary/80">
            Enter your promo code at checkout to activate. You won't be charged. Cancel anytime.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => {
              onActivateCode()
              onClose()
            }}
            fullWidth
            size="lg"
          >
            Activate Lifetime Access
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            fullWidth
          >
            I'll Do This Later
          </Button>
        </div>
      </div>
    </Modal>
  )
}
