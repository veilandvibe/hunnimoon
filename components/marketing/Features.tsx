'use client'

import { useState } from 'react'
import Image from 'next/image'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'

export default function Features() {
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

  const features = [
    {
      image: "/Guests.png",
      title: "Guest List Management",
      description: "Keep track of every guest with ease. Organize by households, track RSVPs in real-time, and see who is coming at a glance. Import your list from a spreadsheet or add guests one by one."
    },
    {
      image: "/Rsvp.png",
      title: "RSVP Tracking",
      description: "Create custom RSVP forms that your guests can fill out online. Their responses automatically update your guest list. No more text messages or lost paper cards."
    },
    {
      image: "/Budget.png",
      title: "Budget Tracking",
      description: "Set your budget, break it down by category, and track what you actually spend. See where your money is going in real-time. Mark items as paid and stay on top of vendor payments."
    },
    {
      image: "/Vendors.png",
      title: "Vendor Organization",
      description: "Store all your vendor contacts in one place. Track who you hired, what they charge, and add notes about your conversations. No more digging through emails to find phone numbers."
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-pink-primary mb-4">
            Everything You Need in One Place
          </h2>
          <p className="text-lg text-pink-primary/70 max-w-2xl mx-auto">
            No more switching between tabs, apps, and spreadsheets. Hunnimoon keeps your entire wedding organized.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            return (
              <div 
                key={index}
                className="bg-pink-light border-2 border-pink-primary/10 rounded-2xl p-8 hover:border-pink-primary/30 hover:shadow-lg transition-all"
              >
                <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={1000}
                    height={800}
                    className="w-full h-auto"
                  />
                </div>
                <h3 className="text-2xl font-bold text-pink-primary mb-3">
                  {feature.title}
                </h3>
                <p className="text-pink-primary/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-12">
          <Button 
            onClick={() => setIsTrialModalOpen(true)}
            size="lg"
            className="shadow-xl hover:shadow-2xl"
          >
            Start Free Trial
          </Button>
        </div>
      </div>

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
    </section>
  )
}
