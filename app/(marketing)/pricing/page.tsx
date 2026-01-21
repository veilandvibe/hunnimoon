'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import Button from '@/components/ui/Button'
import db from '@/lib/instant'

export default function PricingPage() {
  const router = useRouter()
  const { user } = db.useAuth()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  const handleStartTrial = () => {
    // Store plan preference in localStorage
    localStorage.setItem('preferred_plan', billingCycle)
    
    if (user) {
      // Already logged in, go to dashboard
      router.push('/dashboard')
    } else {
      // Not logged in, go to signup
      router.push('/login')
    }
  }

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

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-lg font-medium ${billingCycle === 'monthly' ? 'text-pink-primary' : 'text-pink-primary/50'}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative w-16 h-8 bg-pink-primary/20 rounded-full transition-colors hover:bg-pink-primary/30"
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
          <div className={`bg-white rounded-4xl p-8 shadow-card border-2 ${
            billingCycle === 'monthly' ? 'border-pink-primary' : 'border-pink-primary/10'
          } ${billingCycle === 'monthly' ? 'scale-105' : ''} transition-all`}>
            {billingCycle === 'monthly' && (
              <div className="bg-pink-primary text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                POPULAR
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-2xl font-black text-pink-primary mb-2">Pro Monthly</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-pink-primary">$9.99</span>
                <span className="text-pink-primary/60">/ month</span>
              </div>
              <p className="text-pink-primary/70 text-sm">Billed monthly • Cancel anytime</p>
            </div>

            <Button
              onClick={handleStartTrial}
              variant={billingCycle === 'monthly' ? 'primary' : 'outline'}
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
          <div className={`bg-white rounded-4xl p-8 shadow-card border-2 ${
            billingCycle === 'yearly' ? 'border-pink-primary' : 'border-pink-primary/10'
          } ${billingCycle === 'yearly' ? 'scale-105' : ''} transition-all`}>
            {billingCycle === 'yearly' && (
              <div className="bg-pink-primary text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                POPULAR
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-2xl font-black text-pink-primary mb-2">Pro Yearly</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-black text-pink-primary">$79.99</span>
                <span className="text-pink-primary/60">/ year</span>
              </div>
              <p className="text-pink-primary/70 text-sm">
                <span className="line-through">$119.88</span> • Save 33%
              </p>
            </div>

            <Button
              onClick={handleStartTrial}
              variant={billingCycle === 'yearly' ? 'primary' : 'outline'}
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
          <Button onClick={handleStartTrial} size="lg">
            Start Your Free Trial
          </Button>
          <p className="text-sm text-pink-primary/60 mt-4">
            No credit card required • 7-day free trial
          </p>
        </div>
      </div>
    </div>
  )
}
