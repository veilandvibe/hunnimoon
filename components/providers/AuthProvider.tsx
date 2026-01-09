'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import db from '@/lib/instant'
import LoadingSpinner from '../ui/LoadingSpinner'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isLoading, user, error } = db.useAuth()

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/rsvp']
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route))

  useEffect(() => {
    if (isLoading) return

    // If not authenticated and not on a public route, redirect to login
    if (!user && !isPublicRoute) {
      router.push('/login')
      return
    }

    // If authenticated and on login page, redirect to onboarding
    // (onboarding will handle checking if they already have a wedding)
    if (user && pathname === '/login') {
      router.push('/onboarding')
    }
  }, [isLoading, user, pathname, isPublicRoute, router])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show error if authentication failed
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to">
        <div className="bg-white rounded-4xl p-8 shadow-card max-w-md text-center">
          <p className="text-red-600 mb-4">Authentication Error</p>
          <p className="text-pink-primary/70 text-sm mb-4">{error.message}</p>
          <button
            onClick={() => router.push('/login')}
            className="text-pink-primary hover:underline"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  // If not authenticated and trying to access protected route, don't render
  if (!user && !isPublicRoute) {
    return null
  }

  return <>{children}</>
}
