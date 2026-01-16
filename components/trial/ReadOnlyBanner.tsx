'use client'

import { Lock } from 'lucide-react'
import Button from '@/components/ui/Button'

interface ReadOnlyBannerProps {
  onUpgradeClick: () => void
}

export default function ReadOnlyBanner({ onUpgradeClick }: ReadOnlyBannerProps) {
  return (
    <div className="bg-yellow-50 border-b-2 border-yellow-200 p-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Lock size={18} className="text-yellow-600 flex-shrink-0" />
          <p className="text-sm text-yellow-800">
            <strong>Read-only mode.</strong> Your trial has ended. Upgrade to make changes.
          </p>
        </div>
        
        <Button
          onClick={onUpgradeClick}
          size="sm"
          className="whitespace-nowrap"
        >
          Upgrade Now
        </Button>
      </div>
    </div>
  )
}
