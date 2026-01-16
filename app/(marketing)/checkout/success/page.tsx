'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [countdown, setCountdown] = useState(3)
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-pink-primary/70 mb-4">Invalid session</p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-4xl p-8 shadow-card text-center">
        <div className="mb-6">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-pink-primary mb-2">
            Welcome to Hunnimoon Pro! 🎉
          </h1>
          <p className="text-pink-primary/70">
            Your subscription is now active. You have full access to all features.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-pink-light rounded-2xl p-4">
            <p className="text-sm text-pink-primary/70">
              Redirecting to your dashboard in <span className="font-bold text-pink-primary">{countdown}</span> seconds...
            </p>
          </div>

          <Button
            onClick={() => router.push('/dashboard')}
            fullWidth
            size="lg"
          >
            Go to Dashboard Now
          </Button>
        </div>

        <p className="text-xs text-pink-primary/60 mt-6">
          You'll receive a confirmation email shortly with your receipt.
        </p>
      </div>
    </div>
  )
}
