'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface EtsyWelcomeModalProps {
  isOpen: boolean
  onClose: () => void
  onStartTrial: () => void
  onUpgrade?: () => void
}

export default function EtsyWelcomeModal({
  isOpen,
  onClose,
  onStartTrial,
  onUpgrade,
}: EtsyWelcomeModalProps) {
  const [showInstructions, setShowInstructions] = useState(false)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Welcome from Etsy! 🎉"
      size="md"
    >
      <div className="space-y-6">
        <p className="text-pink-primary/80">
          Purchased from Veil & Vibe on Etsy? Your 3 months free promo code is included in your Etsy files (the PDF download). When your 7-day trial ends, enter that code at checkout—you won't be charged a thing.
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
                <li>Open the PDF—your 3 months free promo code is located in it</li>
                <li>Need help? Email <a href="mailto:hunnimoon@veilandvibe.com" className="text-pink-primary underline">hunnimoon@veilandvibe.com</a></li>
              </ol>
            </div>
          )}
        </div>

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
            Get 3 Months Free
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
