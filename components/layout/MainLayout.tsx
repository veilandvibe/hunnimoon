'use client'

import { useEffect } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import MobileHeader from './MobileHeader'
import PageTransition from './PageTransition'
import SpotlightTour from '@/components/tour/SpotlightTour'
import OnboardingModal from '@/components/onboarding/OnboardingModal'
import { SidebarProvider, useSidebar } from './SidebarContext'
import { useTour } from '@/components/providers/TourContext'

function MainLayoutContent({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  const { isExpanded } = useSidebar()
  const { onboardingCompleted, showOnboarding, startOnboarding, completeOnboarding } = useTour()

  // Check if onboarding should be shown on first load
  useEffect(() => {
    // Only show onboarding if not completed and not already showing
    if (!onboardingCompleted && !showOnboarding) {
      // Small delay to let the dashboard load first
      const timer = setTimeout(() => {
        startOnboarding()
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [onboardingCompleted, showOnboarding, startOnboarding])

  return (
    <div className="min-h-screen">
      <Sidebar />
      <MobileHeader title={title} />
      
      <main 
        className={`pb-20 md:pb-8 transition-[margin] duration-300 ease-out ${
          isExpanded ? 'md:ml-[240px]' : 'md:ml-[69px]'
        }`}
      >
        <div className="min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-32px)] rounded-t-[24px] bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to p-4 md:p-8">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </main>

      <BottomNav />
      
      {/* Spotlight Tour - Always rendered, shown when active */}
      <SpotlightTour />

      {/* Onboarding Modal - Shows on first visit */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={completeOnboarding}
      />
    </div>
  )
}

export default function MainLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title?: string
}) {
  return (
    <SidebarProvider>
      <MainLayoutContent title={title}>
        {children}
      </MainLayoutContent>
    </SidebarProvider>
  )
}
