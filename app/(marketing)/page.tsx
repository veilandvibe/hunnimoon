'use client'

import { useState, useEffect } from 'react'
import Hero from '@/components/marketing/Hero'
import BeforeAfter from '@/components/marketing/BeforeAfter'
import HowItWorks from '@/components/marketing/HowItWorks'
import Features from '@/components/marketing/Features'
import Testimonials from '@/components/marketing/Testimonials'
import LandingFAQs from '@/components/marketing/LandingFAQs'
import CTABlock from '@/components/marketing/CTABlock'
import EtsyWelcomeModal from '@/components/etsy/EtsyWelcomeModal'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const router = useRouter()
  const [showEtsyModal, setShowEtsyModal] = useState(false)

  useEffect(() => {
    // Check if user came from Etsy link
    const acqSource = localStorage.getItem('acq_source')
    const etsyModalShown = localStorage.getItem('etsy_landing_modal_shown')
    
    // Show modal after 2.5 seconds if from Etsy and haven't shown it before
    if (acqSource === 'etsy' && !etsyModalShown) {
      const timer = setTimeout(() => {
        setShowEtsyModal(true)
      }, 2500) // 2.5 second delay
      
      return () => clearTimeout(timer)
    }
  }, [])

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
      <EtsyWelcomeModal
        isOpen={showEtsyModal}
        onClose={handleCloseModal}
        onStartTrial={handleStartTrial}
      />
    </div>
  )
}
