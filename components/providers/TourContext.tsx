'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface TourContextType {
  onboardingCompleted: boolean
  currentTourPage: string | null
  showOnboarding: boolean
  startOnboarding: () => void
  completeOnboarding: () => void
  startPageTour: (pageName: string) => void
  endPageTour: () => void
}

const TourContext = createContext<TourContextType | undefined>(undefined)

export function TourProvider({ children }: { children: ReactNode }) {
  const [onboardingCompleted, setOnboardingCompleted] = useState(false) // Default to false, will check localStorage
  const [currentTourPage, setCurrentTourPage] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const completed = localStorage.getItem('onboardingCompleted')
    setOnboardingCompleted(completed === 'true')
  }, [])

  const startOnboarding = () => {
    setShowOnboarding(true)
  }

  const completeOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true')
    setOnboardingCompleted(true)
    setShowOnboarding(false)
  }

  const startPageTour = (pageName: string) => {
    setCurrentTourPage(pageName)
  }

  const endPageTour = () => {
    setCurrentTourPage(null)
  }

  return (
    <TourContext.Provider
      value={{
        onboardingCompleted,
        currentTourPage,
        showOnboarding,
        startOnboarding,
        completeOnboarding,
        startPageTour,
        endPageTour,
      }}
    >
      {children}
    </TourContext.Provider>
  )
}

export function useTour() {
  const context = useContext(TourContext)
  if (context === undefined) {
    throw new Error('useTour must be used within a TourProvider')
  }
  return context
}
