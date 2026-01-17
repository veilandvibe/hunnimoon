'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface EtsyTrialExpiringModalProps {
  isOpen: boolean
  onClose: () => void
  onActivateCode: () => void
  daysRemaining: number
}

export default function EtsyTrialExpiringModal({
  isOpen,
  onClose,
  onActivateCode,
  daysRemaining,
}: EtsyTrialExpiringModalProps) {
  const [showInstructions, setShowInstructions] = useState(false)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Your trial ends in ${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'}`}
      size="md"
    >
      <div className="space-y-6">
        <p className="text-pink-primary/80">
          Use your Etsy code to get 3 months completely free. Grab your code from your PDF provided from your Veil & Vibe purchase on Etsy.
        </p>

        {/* Instructions Toggle */}
        <div className="border border-pink-primary/20 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="w-full flex items-center justify-between p-4 bg-pink-light hover:bg-pink-light/80 transition-colors"
          >
            <span className="font-medium text-pink-primary">Where's my code?</span>
            {showInstructions ? (
              <ChevronUp size={20} className="text-pink-primary" />
            ) : (
              <ChevronDown size={20} className="text-pink-primary" />
            )}
          </button>
          
          {showInstructions && (
            <div className="p-4 bg-white space-y-2 text-sm text-pink-primary/80">
              <ol className="list-decimal list-inside space-y-2">
                <li>Go to your Etsy account</li>
                <li>Click "Purchases and Reviews"</li>
                <li>Locate your digital purchase from Veil & Vibe</li>
                <li>Click "Download Files"</li>
                <li>Open the PDF—your 3 months free code is located in it</li>
                <li>Need help? Email <a href="mailto:hunnimoon@veilandvibe.com" className="text-pink-primary underline">hunnimoon@veilandvibe.com</a></li>
              </ol>
            </div>
          )}
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
            Activate 3 Months Free
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
