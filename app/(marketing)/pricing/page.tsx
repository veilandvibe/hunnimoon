'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, Loader2, Mail, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import PlanSelector from '@/components/billing/PlanSelector'
import db from '@/lib/instant'

export default function PricingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading: authLoading } = db.useAuth()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  
  // Read URL parameters
  const intent = searchParams.get('intent') // 'upgrade'
  const hasPromo = searchParams.get('promo') === 'true' // Etsy promo

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
      // Preserve intent and promo params through login
      const params = new URLSearchParams()
      if (intent) params.set('intent', intent)
      if (hasPromo) params.set('promo', 'true')
      const queryString = params.toString()
      const redirectUrl = queryString ? `/pricing?${queryString}` : '/pricing'
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
    }
  }

  const handleUpgrade = async (plan: 'monthly' | 'yearly') => {
    if (!user?.id || !user?.email) {
      // Not logged in - redirect to login with intent preserved
      const params = new URLSearchParams()
      if (intent) params.set('intent', intent)
      if (hasPromo) params.set('promo', 'true')
      const queryString = params.toString()
      const redirectUrl = queryString ? `/pricing?${queryString}` : '/pricing'
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
      return
    }

    // Track Meta Pixel InitiateCheckout event
    if (typeof window !== 'undefined' && window.fbq) {
      const value = plan === 'yearly' ? 119.99 : 14.99;
      window.fbq('track', 'InitiateCheckout', {
        currency: 'USD',
        value: value,
      });
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
          allowPromoCode: hasPromo, // Enable promo field for Etsy users
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
              {hasPromo ? 'Claim your 3 months free and continue planning your perfect wedding.' : 'Choose your plan and continue planning your perfect wedding.'}
            </p>
          </div>

          {/* Etsy Promo Banner */}
          {hasPromo && (
            <div className="bg-gradient-to-r from-pink-primary/10 to-pink-primary/5 border-2 border-pink-primary/20 rounded-3xl p-6 mb-8 max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-pink-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-pink-primary mb-2">
                    🎉 Etsy Customer Exclusive!
                  </h3>
                  <p className="text-pink-primary/80 mb-3">
                    You're eligible for <strong>3 months free</strong> as a Veil & Vibe customer! 
                    After selecting your plan, you'll be able to enter your promo code at checkout.
                  </p>
                  <p className="text-sm text-pink-primary/70">
                    💝 Find your code in the PDF from your Etsy purchase
                  </p>
                </div>
              </div>
            </div>
          )}

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
        {/* Upgrade Intent Banner (for logged-out users from email) */}
        {intent === 'upgrade' && !user && (
          <div className="bg-gradient-to-r from-pink-primary to-pink-primary/80 text-white rounded-3xl p-8 mb-12 max-w-4xl mx-auto shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-black mb-2">
                  {hasPromo ? '🎉 Ready to claim your 3 months free?' : 'Ready to upgrade to Hunnimoon Pro?'}
                </h2>
                <p className="text-white/90 text-lg mb-4">
                  {hasPromo 
                    ? 'Sign in to your account first, then select your plan to activate your Etsy promo code.'
                    : 'Sign in to your account first, then choose your plan below.'}
                </p>
                <Button 
                  onClick={handleStartTrial}
                  variant="outline"
                  size="lg"
                  className="bg-white text-pink-primary hover:bg-white/90"
                >
                  <Mail size={20} />
                  Sign In to Continue
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-pink-primary mb-4">
            {intent === 'upgrade' ? 'Upgrade to Hunnimoon Pro' : 'Simple, Transparent Pricing'}
          </h1>
          <p className="text-xl text-pink-primary/70 max-w-2xl mx-auto">
            {intent === 'upgrade' 
              ? (hasPromo ? 'Get 3 months free with your Etsy promo code.' : 'Choose your plan and unlock full access.')
              : 'Start with a 7-day free trial. No credit card required.'}
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
              {intent === 'upgrade' ? 'Sign In to Upgrade' : 'Start Free Trial'}
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
              {intent === 'upgrade' ? 'Sign In to Upgrade' : 'Start Free Trial'}
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
              {intent === 'upgrade' ? 'Sign In to Upgrade' : 'Start Free Trial'}
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
