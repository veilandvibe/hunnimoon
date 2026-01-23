'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import PlanSelector from '@/components/billing/PlanSelector'
import db from '@/lib/instant'

export default function PricingPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = db.useAuth()
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  // Query user billing data
  const { data, isLoading: dataLoading } = db.useQuery(
    user?.id ? {
      $users: {
        $: {
          where: {
            id: user.id
          }
        }
      }
    } : null
  )

  const userData = data?.$users?.[0]
  const isExistingUser = user && userData && (
    userData.billing_status === 'trial' || 
    userData.billing_status === 'expired' ||
    userData.billing_status === 'canceled'
  )

  // If user is active subscriber, redirect to dashboard
  if (user && userData?.billing_status === 'active') {
    router.push('/dashboard')
    return null
  }

  const handleStartTrial = () => {
    if (user) {
      router.push('/dashboard')
    } else {
      router.push('/login')
    }
  }

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    if (!user?.id || !user?.email) {
      router.push('/login')
      return
    }

    setCheckoutLoading(true)
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          userId: user.id,
          userEmail: user.email,
          allowPromoCode: false,
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
      setCheckoutLoading(false)
    }
  }

  const features = [
    'Unlimited guest list management',
    'Budget tracking & cost calculator',
    'Vendor contact organization',
    'Custom RSVP forms',
    'Guest self-service RSVPs',
    'Mobile & desktop access',
    'Data export (CSV)',
    'Priority email support',
  ]

  // Show loading state
  if (authLoading || (user && dataLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-primary" />
      </div>
    )
  }

  // Existing users see upgrade flow
  if (isExistingUser) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-pink-primary mb-4">
              Upgrade to Hunnimoon Pro
            </h1>
            <p className="text-xl text-pink-primary/70 max-w-2xl mx-auto">
              Choose your plan and continue planning your perfect wedding.
            </p>
          </div>

          {/* Plan Selector */}
          <PlanSelector
            onSelectPlan={handleUpgrade}
            loading={checkoutLoading}
            showTrialCard={false}
            showToggle={false}
          />

          {/* Feature List */}
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-pink-primary text-center mb-8">
              Everything you need to plan your wedding
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-card">
                  <Check size={20} className="text-pink-primary flex-shrink-0 mt-0.5" />
                  <span className="text-pink-primary/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // New users see marketing page with trial
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-pink-primary mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-pink-primary/70 max-w-2xl mx-auto">
            Start with a 7-day free trial. No credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Trial Card */}
          <div className="bg-white rounded-4xl p-8 shadow-card border-2 border-pink-primary/10">
            <div className="mb-6">
              <h3 className="text-2xl font-black text-pink-primary mb-2">Free Trial</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-pink-primary">$0</span>
                <span className="text-pink-primary/60">/ 7 days</span>
              </div>
              <p className="text-pink-primary/70 text-sm">Full access, no credit card</p>
            </div>

            <Button
              onClick={handleStartTrial}
              variant="outline"
              fullWidth
              size="lg"
            >
              Start Free Trial
            </Button>

            <div className="mt-8 space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check size={20} className="text-pink-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-pink-primary/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Card */}
          <div className="bg-white rounded-4xl p-8 shadow-card border-2 border-pink-primary/10">
            <div className="mb-6">
              <h3 className="text-2xl font-black text-pink-primary mb-2">Pro Monthly</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-pink-primary">$14.99</span>
                <span className="text-pink-primary/60">/ month</span>
              </div>
              <p className="text-pink-primary/70 text-sm">Billed monthly • Cancel anytime</p>
            </div>

            <Button
              onClick={handleStartTrial}
              variant="outline"
              fullWidth
              size="lg"
            >
              Start Free Trial
            </Button>

            <div className="mt-8 space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check size={20} className="text-pink-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-pink-primary/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Yearly Card */}
          <div className="bg-white rounded-4xl p-8 shadow-card border-2 border-pink-primary/10 relative overflow-hidden">
            {/* Corner Banner */}
            <div className="absolute top-0 right-0 bg-gradient-to-br from-pink-primary to-pink-primary/80 text-white text-xs font-bold flex items-center justify-center h-10 px-20 transform rotate-45 translate-x-[52px] translate-y-4 origin-center shadow-lg whitespace-nowrap">
              BEST VALUE
            </div>
            
            <div className="mb-6 mt-2">
              <h3 className="text-2xl font-black text-pink-primary mb-2">Pro Yearly</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-pink-primary">$119.99</span>
                <span className="text-pink-primary/60">/ year</span>
              </div>
              <p className="text-pink-primary/70 text-sm">
                <span className="line-through">$179.88</span> • <span className="font-bold text-pink-primary">Save 33%</span>
              </p>
            </div>

            <Button
              onClick={handleStartTrial}
              variant="primary"
              fullWidth
              size="lg"
            >
              Start Free Trial
            </Button>

            <div className="mt-8 space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check size={20} className="text-pink-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-pink-primary/80">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-pink-primary text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-bold text-pink-primary mb-2">What happens after my trial ends?</h3>
              <p className="text-pink-primary/70 text-sm">
                After 7 days, your account becomes read-only. You can still view your data, but you'll need to upgrade to make changes. We never delete your data.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-bold text-pink-primary mb-2">Do I need a credit card for the trial?</h3>
              <p className="text-pink-primary/70 text-sm">
                Nope! Start your 7-day trial without entering any payment information. We'll only ask for a credit card when you're ready to upgrade.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-bold text-pink-primary mb-2">Can I cancel anytime?</h3>
              <p className="text-pink-primary/70 text-sm">
                Yes! You can cancel your subscription at any time from your settings. Your data remains accessible until the end of your billing period.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-bold text-pink-primary mb-2">What payment methods do you accept?</h3>
              <p className="text-pink-primary/70 text-sm">
                We accept all major credit cards (Visa, Mastercard, American Express, Discover) and debit cards through our secure payment processor, Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-black text-pink-primary mb-4">
            Ready to plan your dream wedding?
          </h2>
          <p className="text-pink-primary/70 mb-8 max-w-2xl mx-auto">
            Join thousands of couples who trust Hunnimoon to organize their special day.
          </p>
          <div className="flex justify-center">
            <Button onClick={handleStartTrial} size="lg">
              Start Your Free Trial
            </Button>
          </div>
          <p className="text-sm text-pink-primary/60 mt-4">
            No credit card required • 7-day free trial
          </p>
        </div>
      </div>
    </div>
  )
}
