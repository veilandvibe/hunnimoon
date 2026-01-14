import Hero from '@/components/marketing/Hero'
import BeforeAfter from '@/components/marketing/BeforeAfter'
import HowItWorks from '@/components/marketing/HowItWorks'
import Features from '@/components/marketing/Features'
import Testimonials from '@/components/marketing/Testimonials'
import LandingFAQs from '@/components/marketing/LandingFAQs'
import CTABlock from '@/components/marketing/CTABlock'

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
    </div>
  )
}
