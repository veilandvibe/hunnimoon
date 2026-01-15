'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'

export default function Hero() {
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false)
  const [email, setEmail] = useState('')

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Start Free Trial with email:', email)
    // Stub: Actual logic will be implemented later
    setIsTrialModalOpen(false)
    setEmail('')
    // TODO: Redirect to signup/login flow
  }

  return (
    <>
      <section className="relative bg-gradient-to-br from-pink-light via-white to-pink-light/30 pt-20 pb-32 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-pink-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-primary/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-pink-primary mb-6 leading-tight">
                Plan Your Dream Wedding Without the Stress
              </h1>
              <p className="text-lg md:text-xl text-pink-primary/70 mb-8 max-w-2xl mx-auto lg:mx-0">
                Hunnimoon replaces messy spreadsheets and keeps your guest list, budget, vendors, and RSVPs organized in one place. No more juggling tabs or losing track of details.
              </p>
              <div className="flex justify-center lg:justify-start">
                <Button 
                  onClick={() => setIsTrialModalOpen(true)}
                  size="lg"
                  className="shadow-xl hover:shadow-2xl"
                >
                  Start Free Trial
                </Button>
              </div>
              <p className="text-pink-primary/60 text-sm mt-4">
                No credit card required · 7-day free trial
              </p>
            </div>

            {/* Right: Visual/Image */}
            <div className="relative">
              <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-pink-primary/10">
                {/* Placeholder dashboard preview */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-pink-primary/10">
                    <div>
                      <div className="h-3 w-32 bg-pink-primary/20 rounded mb-2" />
                      <div className="h-6 w-48 bg-pink-primary rounded" />
                    </div>
                    <div className="h-12 w-12 bg-pink-light rounded-full" />
                  </div>
                  
                  {/* Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-pink-light rounded-xl p-4">
                      <div className="h-3 w-16 bg-pink-primary/30 rounded mb-2" />
                      <div className="h-8 w-20 bg-pink-primary/50 rounded" />
                    </div>
                    <div className="bg-pink-light rounded-xl p-4">
                      <div className="h-3 w-16 bg-pink-primary/30 rounded mb-2" />
                      <div className="h-8 w-20 bg-pink-primary/50 rounded" />
                    </div>
                  </div>
                  
                  {/* List items */}
                  <div className="space-y-3">
                    <div className="bg-pink-light/50 rounded-lg p-3 flex items-center gap-3">
                      <div className="h-8 w-8 bg-pink-primary/20 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 w-3/4 bg-pink-primary/30 rounded" />
                        <div className="h-2 w-1/2 bg-pink-primary/20 rounded" />
                      </div>
                    </div>
                    <div className="bg-pink-light/50 rounded-lg p-3 flex items-center gap-3">
                      <div className="h-8 w-8 bg-pink-primary/20 rounded-full" />
                      <div className="flex-1 space-y-1">
                        <div className="h-3 w-2/3 bg-pink-primary/30 rounded" />
                        <div className="h-2 w-1/3 bg-pink-primary/20 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Free Trial Modal */}
      <Modal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
        title="Start Your Free 7-Day Trial"
      >
        <form onSubmit={handleStartTrial} className="space-y-4">
          <p className="text-pink-primary/70 text-sm">
            No credit card required. Get instant access to all Hunnimoon features and start planning your dream wedding today.
          </p>
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
          <Button type="submit" fullWidth>
            Start Free Trial
          </Button>
          <p className="text-pink-primary/60 text-xs text-center">
            By signing up, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </Modal>
    </>
  )
}
