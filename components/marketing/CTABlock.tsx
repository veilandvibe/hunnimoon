'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function CTABlock() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div className="bg-pink-primary rounded-3xl p-8 md:p-12 text-center text-white my-16">
        <h2 className="text-3xl md:text-4xl font-black mb-4">
          Try Hunnimoon Free for 7 Days
        </h2>
        <p className="text-white/90 mb-6 max-w-2xl mx-auto">
          Keep your entire wedding organized in one place. Guest lists, budgets, vendors, RSVPs, and more.
        </p>
        <div className="flex justify-center">
          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="secondary"
            size="lg"
            className="font-bold shadow-lg hover:shadow-xl"
          >
            Start Free Trial
          </Button>
        </div>
        <p className="text-white/70 text-sm mt-4">
          No credit card required
        </p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-pink-primary/60 hover:text-pink-primary transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-black text-pink-primary mb-4">
              Start Your Free Trial
            </h2>
            <p className="text-pink-primary/70 mb-6">
              Sign up functionality will be implemented here. For now, you can sign in to access the app.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} fullWidth>
                Cancel
              </Button>
              <Link href="/dashboard" className="flex-1">
                <Button fullWidth>
                  Go to App
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
