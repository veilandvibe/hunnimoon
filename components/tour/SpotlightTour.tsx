'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTour } from '@/components/providers/TourContext'
import { getTourSteps } from '@/lib/tourSteps'
import TourStep from './TourStep'

// Device detection and performance settings
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

const isLowEndDevice = () => {
  if (typeof window === 'undefined') return false
  // Check hardware concurrency (CPU cores)
  return navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false
}

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Debounce utility
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export default function SpotlightTour() {
  const { currentTourPage, endPageTour } = useTour()
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // Detect device capabilities once
  const isMobile = useRef(isMobileDevice())
  const shouldReduceMotion = useRef(prefersReducedMotion() || (isMobile.current && isLowEndDevice()))
  
  // Flag to prevent scroll listener interference during step transitions
  const isScrolling = useRef(false)
  
  // Store scroll position for body lock
  const scrollPosition = useRef(0)

  const steps = currentTourPage ? getTourSteps(currentTourPage) : undefined
  const isActive = !!currentTourPage && !!steps && steps.length > 0

  // Prevent user scrolling on mobile when tour is active (touch shield approach)
  useEffect(() => {
    if (!isActive || !isMobile.current) return

    // Prevent touch scrolling but allow programmatic scrolling
    const preventScroll = (e: TouchEvent) => {
      // Allow interactions with tour buttons/close button
      const target = e.target as HTMLElement
      if (target.closest('button') || target.closest('[role="button"]')) {
        return
      }
      e.preventDefault()
    }

    // Add touch listener with passive: false to allow preventDefault
    document.addEventListener('touchmove', preventScroll, { passive: false })

    return () => {
      document.removeEventListener('touchmove', preventScroll)
    }
  }, [isActive])

  // Separate function to scroll to element
  const scrollToElement = useCallback((element: Element) => {
    const viewportHeight = window.innerHeight
    const rect = element.getBoundingClientRect()
    const elementHeight = rect.height
    
    // If element is very tall (> 50% of viewport), scroll to top
    // Otherwise scroll to center
    const scrollBlock = elementHeight > viewportHeight * 0.5 ? 'start' : 'center'
    
    // Use smooth scroll on both mobile and desktop
    // Now that user scrolling is locked, smooth scroll won't cause jank
    element.scrollIntoView({
      behavior: 'smooth',
      block: scrollBlock,
      inline: 'center',
    })
  }, [])

  // Update spotlight position without scrolling
  const updateSpotlightPosition = useCallback(() => {
    if (!steps || !isActive) return

    const currentStepData = steps[currentStep]
    
    // Skip highlighting for generic targets like 'body' - show tooltip only
    if (currentStepData.target === 'body') {
      setTargetRect(null)
      return
    }
    
    const element = document.querySelector(currentStepData.target)

    if (element) {
      const rect = element.getBoundingClientRect()
      setTargetRect(rect)
    } else {
      setTargetRect(null)
    }
  }, [steps, currentStep, isActive])
  
  // Combined function for step changes: scroll then update spotlight
  const scrollAndUpdateSpotlight = useCallback(() => {
    if (!steps || !isActive) return

    const currentStepData = steps[currentStep]
    
    if (currentStepData.target === 'body') {
      setTargetRect(null)
      return
    }
    
    const element = document.querySelector(currentStepData.target)
    
    if (element) {
      // Step 1: Scroll to element
      scrollToElement(element)
      
      // Step 2: Wait for scroll to complete, then update spotlight
      // Both mobile and desktop use smooth scroll now (user scroll is locked on mobile)
      const delay = 350
      
      setTimeout(() => {
        const rect = element.getBoundingClientRect()
        setTargetRect(rect)
      }, delay)
    } else {
      setTargetRect(null)
    }
  }, [steps, currentStep, isActive, scrollToElement])

  // Scroll to element and update spotlight on step change
  useEffect(() => {
    if (!isActive) return

    scrollAndUpdateSpotlight()
  }, [isActive, currentStep, scrollAndUpdateSpotlight])
  
  // Update spotlight position on window resize (no scrolling)
  useEffect(() => {
    if (!isActive) return
    
    const handleResize = debounce(updateSpotlightPosition, 100)
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [isActive, updateSpotlightPosition])

  // Reset step when tour page changes
  useEffect(() => {
    setCurrentStep(0)
  }, [currentTourPage])

  const handleNext = () => {
    if (!steps || isTransitioning) return

    setIsTransitioning(true)

    setTimeout(() => {
      if (currentStep === steps.length - 1) {
        // Finish tour
        endPageTour()
        setCurrentStep(0)
      } else {
        setCurrentStep((prev) => prev + 1)
      }
      setIsTransitioning(false)
    }, 150)
  }

  const handleBack = () => {
    if (currentStep > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1)
        setIsTransitioning(false)
      }, 150)
    }
  }

  const handleExit = () => {
    endPageTour()
    setCurrentStep(0)
  }

  if (!isActive || !steps) return null

  const currentStepData = steps[currentStep]

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Touch shield for mobile - prevents user scrolling */}
          {isMobile.current && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 45, // Below overlays but above content
                touchAction: 'none',
              }}
            />
          )}
          
          {targetRect ? (
            // Spotlight with box-shadow overlay - now smooth on mobile with scroll lock
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: shouldReduceMotion.current ? 0 : 0.3,
                ease: 'easeInOut'
              }}
              style={{
                position: 'fixed',
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
                zIndex: 46,
                pointerEvents: 'none',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)',
                willChange: 'transform, opacity',
              }}
              className="rounded-2xl ring-4 ring-pink-primary/50"
            />
          ) : (
            // Full-screen overlay for tips without a target
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: shouldReduceMotion.current ? 0 : 0.3,
                ease: 'easeInOut'
              }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 46,
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Tooltip */}
          <AnimatePresence mode="wait">
            <TourStep
              key={currentStep}
              step={currentStepData}
              currentStep={currentStep}
              totalSteps={steps.length}
              onNext={handleNext}
              onBack={handleBack}
              onExit={handleExit}
              targetRect={targetRect}
            />
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
