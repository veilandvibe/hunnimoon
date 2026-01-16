'use client'

import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import db from '@/lib/instant'

export default function CTABlock() {
  const router = useRouter()
  const { user } = db.useAuth()

  const handleStartTrial = () => {
    if (user) {
      // User is logged in, go to dashboard
      router.push('/dashboard')
    } else {
      // User not logged in, redirect to signup
      router.push('/login')
    }
  }

  return (
    <div className="bg-pink-primary rounded-3xl p-8 md:p-12 text-center text-white my-16">
      <h2 className="text-3xl md:text-4xl font-black mb-4">
        Try Hunnimoon Free for 7 Days
      </h2>
      <p className="text-white/90 mb-6 max-w-2xl mx-auto">
        Keep your entire wedding organized in one place. Guest lists, budgets, vendors, RSVPs, and more.
      </p>
      <div className="flex justify-center">
        <Button 
          onClick={handleStartTrial}
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
  )
}
