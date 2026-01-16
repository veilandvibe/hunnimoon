'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Mail } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'

interface EtsyTrialExpiredModalProps {
  isOpen: boolean
  onClose: () => void
  onActivateCode: () => void
}

export default function EtsyTrialExpiredModal({
  isOpen,
  onClose,
  onActivateCode,
}: EtsyTrialExpiredModalProps) {
  const [showHelp, setShowHelp] = useState(false)

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
            But you can keep going for free! You already have lifetime access from your Etsy purchase.
          </p>
          <p className="text-pink-primary/80">
            Grab your code from your Etsy download PDF and enter it at checkout. You won't be charged.
          </p>
        </div>

        {/* Help Section Toggle */}
        <div className="border border-pink-primary/20 rounded-2xl overflow-hidden">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-full flex items-center justify-between p-4 bg-pink-light hover:bg-pink-light/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-pink-primary" />
              <span className="font-medium text-pink-primary">Need help?</span>
            </div>
            {showHelp ? (
              <ChevronUp size={20} className="text-pink-primary" />
            ) : (
              <ChevronDown size={20} className="text-pink-primary" />
            )}
          </button>
          
          {showHelp && (
            <div className="p-4 bg-white space-y-3 text-sm text-pink-primary/80">
              <p className="font-medium">Where to find your code:</p>
              <ol className="list-decimal list-inside space-y-2">
                <li>Go to your Etsy account</li>
                <li>Click "Purchases and Reviews"</li>
                <li>Locate your digital purchase from Veil & Vibe</li>
                <li>Click "Download Files"</li>
                <li>Open the PDF—your lifetime code is located in it</li>
              </ol>
              <div className="pt-3 border-t border-pink-primary/10">
                <p className="font-medium mb-1">Still need help?</p>
                <p>
                  Email us at <a href="mailto:hunnimoon@veilandvibe.com" className="text-pink-primary underline font-medium">hunnimoon@veilandvibe.com</a>
                </p>
              </div>
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
