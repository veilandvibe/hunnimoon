'use client'

import { useState } from 'react'
import { CreditCard, ExternalLink, Tag } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import PlanSelector from '@/components/billing/PlanSelector'
import { getUserTrialStatus, UserBillingData } from '@/lib/trial-helpers'
import { getBillingStatusText } from '@/lib/billing-status'

interface BillingSectionProps {
  user: UserBillingData & {
    id: string
    email?: string
  }
}

export default function BillingSection({ user }: BillingSectionProps) {
  const [loading, setLoading] = useState(false)
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false)
  
  const trialStatus = getUserTrialStatus(user)
  const billingStatusText = getBillingStatusText(user)

  const handleManageSubscription = async () => {
    if (!user.stripe_customer_id) {
      alert('No subscription found')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: user.stripe_customer_id }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create portal session')
      }
    } catch (error: any) {
      console.error('Error opening portal:', error)
      alert(error.message || 'Failed to open billing portal')
      setLoading(false)
    }
  }

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          userId: user.id,
          userEmail: user.email,
          allowPromoCode: false, // Don't show promo field on regular upgrade
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error)
      alert(error.message || 'Failed to start checkout')
      setLoading(false)
    }
  }

  const handleApplyPromoCode = async () => {
    setLoading(true)
    try {
      // Default to yearly plan when applying promo code
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'yearly',
          userId: user.id,
          userEmail: user.email,
          allowPromoCode: true, // Enable promo code field
        }),
      })

      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error(data.error || 'Failed to create checkout session')
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error)
      alert(error.message || 'Failed to start checkout')
      setLoading(false)
    }
  }

  return (
    <Card className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard size={24} className="text-pink-primary" />
        <h2 className="text-xl font-black text-pink-primary">Billing & Subscription</h2>
      </div>

      {/* Current Plan Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-pink-light rounded-2xl">
          <div>
            <p className="text-sm text-pink-primary/70 mb-1">Current Plan</p>
            <p className="text-lg font-bold text-pink-primary">{billingStatusText}</p>
          </div>
          {user.billing_status === 'trial' && trialStatus.isActive && (
            <div className="text-right">
              <p className="text-sm text-pink-primary/70 mb-1">Trial Ends In</p>
              <p className="text-lg font-bold text-pink-primary">
                {trialStatus.daysRemaining} {trialStatus.daysRemaining === 1 ? 'day' : 'days'}
              </p>
            </div>
          )}
        </div>

        {/* Trial Status - Show upgrade button */}
        {user.billing_status === 'trial' && (
          <div className="space-y-3">
            <Button
              onClick={() => setUpgradeModalOpen(true)}
              fullWidth
              disabled={loading}
            >
              Upgrade to Pro
            </Button>
            <Button
              onClick={handleApplyPromoCode}
              variant="outline"
              fullWidth
              disabled={loading}
            >
              <Tag size={18} />
              Have a promo code? Apply it here
            </Button>
          </div>
        )}

        {/* Active Subscription - Show manage button */}
        {user.billing_status === 'active' && (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
              <p className="text-sm text-green-700">
                <strong>✓ Subscription Active</strong>
                <br />
                You have full access to all features.
              </p>
            </div>
            <Button
              onClick={handleManageSubscription}
              variant="outline"
              fullWidth
              disabled={loading}
            >
              <ExternalLink size={18} />
              {loading ? 'Loading...' : 'Manage Subscription'}
            </Button>
            <p className="text-xs text-pink-primary/60 text-center">
              Update payment method, view invoices, or cancel subscription
            </p>
          </div>
        )}

        {/* Expired/Canceled - Show reactivate button */}
        {(user.billing_status === 'expired' || user.billing_status === 'canceled') && (
          <div className="space-y-3">
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl">
              <p className="text-sm text-red-700">
                <strong>Subscription {user.billing_status === 'expired' ? 'Expired' : 'Canceled'}</strong>
                <br />
                Upgrade to regain full access.
              </p>
            </div>
            <Button
              onClick={() => setUpgradeModalOpen(true)}
              fullWidth
              disabled={loading}
            >
              Reactivate Subscription
            </Button>
            <Button
              onClick={handleApplyPromoCode}
              variant="outline"
              fullWidth
              disabled={loading}
            >
              <Tag size={18} />
              Have a promo code? Apply it here
            </Button>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      <Modal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        title="Upgrade to Hunnimoon Pro"
        size="lg"
      >
        <div className="space-y-6">
          <p className="text-pink-primary/70">
            Choose your plan and get full access to all features:
          </p>
          <PlanSelector
            onSelectPlan={handleUpgrade}
            loading={loading}
            showTrialCard={false}
          />
        </div>
      </Modal>
    </Card>
  )
}
