'use client'

import Link from 'next/link'
import Image from 'next/image'
import Button from '@/components/ui/Button'

export default function Hero() {
  return (
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
                <Link href="/login">
                  <Button 
                    size="lg"
                    className="shadow-xl hover:shadow-2xl"
                  >
                    Start Free Trial
                  </Button>
                </Link>
              </div>
              <p className="text-pink-primary/60 text-sm mt-4">
                No credit card required · 7-day free trial
              </p>
            </div>

            {/* Right: Visual/Image */}
            <div className="relative">
              <Image
                src="/hero image.png"
                alt="Hunnimoon Dashboard Preview"
                width={1400}
                height={1000}
                className="rounded-3xl shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    )
}
