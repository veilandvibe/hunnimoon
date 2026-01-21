'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import Button from '@/components/ui/Button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-pink-100 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-pink-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-pink-600 mb-2">
              Something went wrong!
            </h2>
            <p className="text-gray-600 mb-6">
              We've been notified and are looking into it. Please try again.
            </p>
            <Button onClick={reset} className="w-full">
              Try again
            </Button>
            <a
              href="/"
              className="block mt-4 text-sm text-pink-600 hover:text-pink-700"
            >
              Return to home
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
