'use client'

import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface LifetimeTrialExpiringModalProps {
  isOpen: boolean
  onClose: () => void
  onActivateCode: () => void
  daysRemaining: number
}

export default function LifetimeTrialExpiringModal({
  isOpen,
  onClose,
  onActivateCode,
  daysRemaining,
}: LifetimeTrialExpiringModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Your trial ends in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`}
      size="md"
    >
      <div className="space-y-6">
        <p className="text-pink-primary/80">
          Use your promo code to activate lifetime access. Enter your code at checkout to continue planning your wedding.
        </p>

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
            Remind Me Later
          </Button>
        </div>
      </div>
    </Modal>
  )
}
