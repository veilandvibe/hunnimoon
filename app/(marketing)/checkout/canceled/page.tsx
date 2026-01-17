'use client'

import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function CheckoutCanceledPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-4xl p-8 shadow-card text-center">
        <div className="mb-6">
          <XCircle size={64} className="text-pink-primary/40 mx-auto mb-4" />
          <h1 className="text-3xl font-black text-pink-primary mb-2">
            Checkout Canceled
          </h1>
          <p className="text-pink-primary/70">
            No worries! You can upgrade to Pro anytime from your dashboard.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={() => router.push('/pricing')}
            fullWidth
            size="lg"
          >
            View Pricing Again
          </Button>
          
          <Button
            onClick={() => router.push('/dashboard')}
            variant="outline"
            fullWidth
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="mt-8 p-4 bg-pink-light rounded-2xl">
          <p className="text-sm text-pink-primary/70">
            <strong>Need help?</strong>
            <br />
            Contact us at <a href="mailto:hunnimoon@veilandvibe.com" className="text-pink-primary underline">hunnimoon@veilandvibe.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}
