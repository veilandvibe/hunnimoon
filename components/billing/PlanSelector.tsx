'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import Button from '@/components/ui/Button'

export interface PlanSelectorProps {
  onSelectPlan: (plan: 'monthly' | 'yearly') => void
  loading?: boolean
  showTrialCard?: boolean
  showToggle?: boolean
}

export default function PlanSelector({ 
  onSelectPlan, 
  loading = false,
  showTrialCard = false,
  showToggle = true
}: PlanSelectorProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  const features = [
    'Unlimited guest list management',
    'Budget tracking & cost calculator',
    'Vendor contact organization',
    'Custom RSVP forms',
    'Real-time collaboration',
    'Mobile & desktop access',
    'Data export (CSV)',
    'Priority email support',
  ]

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      {showToggle && (
        <div className="flex items-center justify-center gap-4">
          <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-pink-primary' : 'text-pink-primary/50'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-16 h-8 bg-pink-primary/20 rounded-full transition-colors hover:bg-pink-primary/30"
            disabled={loading}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-pink-primary rounded-full transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-8' : ''
              }`}
            />
          </button>
          <span className={`text-lg font-medium ${billingCycle === 'yearly' ? 'text-pink-primary' : 'text-pink-primary/50'}`}>
            Yearly
          </span>
          <span className="text-sm text-pink-primary bg-pink-light px-3 py-1 rounded-full font-medium">
            Save 33%
          </span>
        </div>
      )}

      {/* Plan Cards */}
      <div className={`grid ${showTrialCard ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
        {/* Trial Card (optional) */}
        {showTrialCard && (
          <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-pink-primary/10">
            <div className="mb-4">
              <h3 className="text-xl font-black text-pink-primary mb-2">Free Trial</h3>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black text-pink-primary">$0</span>
                <span className="text-pink-primary/60 text-sm">/ 7 days</span>
              </div>
              <p className="text-pink-primary/70 text-xs">Full access, no credit card</p>
            </div>

            <div className="space-y-2 text-sm">
              {features.slice(0, 4).map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check size={16} className="text-pink-primary flex-shrink-0 mt-0.5" />
                  <span className="text-pink-primary/80 text-xs">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monthly Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-pink-primary/10 transition-all">
          
          <div className="mb-4">
            <h3 className="text-xl font-black text-pink-primary mb-2">Pro Monthly</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-pink-primary">$9.99</span>
              <span className="text-pink-primary/60 text-sm">/ month</span>
            </div>
            <p className="text-pink-primary/70 text-xs">Billed monthly • Cancel anytime</p>
          </div>

          <Button
            onClick={() => onSelectPlan('monthly')}
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Select Monthly'}
          </Button>

          <div className="mt-4 space-y-2 text-sm">
            {features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check size={16} className="text-pink-primary flex-shrink-0 mt-0.5" />
                <span className="text-pink-primary/80 text-xs">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Yearly Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-pink-primary/10 transition-all">
          
          <div className="mb-4">
            <h3 className="text-xl font-black text-pink-primary mb-2">Pro Yearly</h3>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black text-pink-primary">$79.99</span>
              <span className="text-pink-primary/60 text-sm">/ year</span>
            </div>
            <p className="text-pink-primary/70 text-xs">
              <span className="line-through">$119.88</span> • <span className="text-pink-primary font-bold text-sm">Save 33%</span>
            </p>
          </div>

          <Button
            onClick={() => onSelectPlan('yearly')}
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Select Yearly'}
          </Button>

          <div className="mt-4 space-y-2 text-sm">
            {features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <Check size={16} className="text-pink-primary flex-shrink-0 mt-0.5" />
                <span className="text-pink-primary/80 text-xs">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
