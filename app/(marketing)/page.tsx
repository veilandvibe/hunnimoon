'use client'

import { Suspense, useState, useEffect } from 'react'
import Hero from '@/components/marketing/Hero'
import BeforeAfter from '@/components/marketing/BeforeAfter'
import HowItWorks from '@/components/marketing/HowItWorks'
import Features from '@/components/marketing/Features'
import Testimonials from '@/components/marketing/Testimonials'
import LandingFAQs from '@/components/marketing/LandingFAQs'
import CTABlock from '@/components/marketing/CTABlock'
import EtsyWelcomeModal from '@/components/etsy/EtsyWelcomeModal'
import LifetimeWelcomeModal from '@/components/lifetime/LifetimeWelcomeModal'
import { useRouter, useSearchParams } from 'next/navigation'

function EtsyModalHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showEtsyModal, setShowEtsyModal] = useState(false)

  useEffect(() => {
    // Check if user came from Etsy link - check both URL params and localStorage
    const urlSource = searchParams.get('src')
    const storageSource = localStorage.getItem('acq_source')
    const etsyModalShown = localStorage.getItem('etsy_landing_modal_shown')
    
    // Determine if this is an Etsy user (from URL or localStorage)
    const isEtsyUser = urlSource === 'etsy' || storageSource === 'etsy'
    
    // Show modal after 2.5 seconds if from Etsy and haven't shown it before
    if (isEtsyUser && !etsyModalShown) {
      const timer = setTimeout(() => {
        setShowEtsyModal(true)
      }, 2500) // 2.5 second delay
      
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const handleStartTrial = () => {
    // Mark modal as shown so it doesn't appear again
    localStorage.setItem('etsy_landing_modal_shown', 'true')
    setShowEtsyModal(false)
    // Redirect to signup
    router.push('/login')
  }

  const handleCloseModal = () => {
    // Mark as shown even if they just close it
    localStorage.setItem('etsy_landing_modal_shown', 'true')
    setShowEtsyModal(false)
  }

  return (
    <EtsyWelcomeModal
      isOpen={showEtsyModal}
      onClose={handleCloseModal}
      onStartTrial={handleStartTrial}
      onUpgrade={handleStartTrial}
    />
  )
}

function LifetimeModalHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showLifetimeModal, setShowLifetimeModal] = useState(false)

  useEffect(() => {
    // Check if user came from Lifetime link - check both URL params and localStorage
    const urlSource = searchParams.get('src')
    const storageSource = localStorage.getItem('acq_source')
    const lifetimeModalShown = localStorage.getItem('lifetime_landing_modal_shown')
    
    // Determine if this is a Lifetime user (from URL or localStorage)
    const isLifetimeUser = urlSource === 'lifetime' || storageSource === 'lifetime'
    
    // Show modal after 2.5 seconds if from Lifetime and haven't shown it before
    if (isLifetimeUser && !lifetimeModalShown) {
      const timer = setTimeout(() => {
        setShowLifetimeModal(true)
      }, 2500) // 2.5 second delay
      
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  const handleStartTrial = () => {
    // Mark modal as shown so it doesn't appear again
    localStorage.setItem('lifetime_landing_modal_shown', 'true')
    setShowLifetimeModal(false)
    // Redirect to signup
    router.push('/login')
  }

  const handleCloseModal = () => {
    // Mark as shown even if they just close it
    localStorage.setItem('lifetime_landing_modal_shown', 'true')
    setShowLifetimeModal(false)
  }

  return (
    <LifetimeWelcomeModal
      isOpen={showLifetimeModal}
      onClose={handleCloseModal}
      onStartTrial={handleStartTrial}
      onUpgrade={handleStartTrial}
    />
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Hero />
      <BeforeAfter />
      <HowItWorks />
      <Features />
      <Testimonials />
      <LandingFAQs />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CTABlock />
      </div>

      {/* Etsy Welcome Modal - shows after 2.5s for Etsy visitors */}
      <Suspense fallback={null}>
        <EtsyModalHandler />
      </Suspense>

      {/* Lifetime Welcome Modal - shows after 2.5s for Lifetime visitors */}
      <Suspense fallback={null}>
        <LifetimeModalHandler />
      </Suspense>
    </div>
  )
}
