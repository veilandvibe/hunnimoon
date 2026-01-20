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

  const steps = currentTourPage ? getTourSteps(currentTourPage) : undefined
  const isActive = !!currentTourPage && !!steps && steps.length > 0

  // Get the target element and its position
  const updateTargetRect = useCallback(() => {
    if (!steps || !isActive) return

    const currentStepData = steps[currentStep]
    
    // Skip highlighting for generic targets like 'body' - show tooltip only
    if (currentStepData.target === 'body') {
      setTargetRect(null)
      return
    }
    
    const element = document.querySelector(currentStepData.target)

    if (element) {
      // Use requestAnimationFrame for smoother updates on mobile
      requestAnimationFrame(() => {
        const rect = element.getBoundingClientRect()
        setTargetRect(rect)

        // Smart scroll behavior based on element size
        const viewportHeight = window.innerHeight
        const elementHeight = rect.height
        
        // If element is very tall (> 50% of viewport), scroll to top
        // Otherwise scroll to center
        const scrollBlock = elementHeight > viewportHeight * 0.5 ? 'start' : 'center'
        
        // Adaptive scroll behavior: use instant scroll on mobile for better performance
        const scrollBehavior = isMobile.current ? 'auto' : 'smooth'
        
        element.scrollIntoView({
          behavior: scrollBehavior,
          block: scrollBlock,
          inline: 'center',
        })
      })
    } else {
      setTargetRect(null)
    }
  }, [steps, currentStep, isActive])

  // Update target rect on step change or window resize
  useEffect(() => {
    if (!isActive) return

    updateTargetRect()

    // Debounce updates for better mobile performance
    // Use longer debounce on mobile devices
    const debounceDelay = isMobile.current ? 150 : 100
    const debouncedUpdate = debounce(updateTargetRect, debounceDelay)
    
    // Use passive listeners on mobile for better scroll performance
    const scrollOptions = isMobile.current ? { capture: true, passive: true } : true
    
    window.addEventListener('resize', debouncedUpdate)
    window.addEventListener('scroll', debouncedUpdate, scrollOptions)

    return () => {
      window.removeEventListener('resize', debouncedUpdate)
      window.removeEventListener('scroll', debouncedUpdate, scrollOptions)
    }
  }, [isActive, updateTargetRect])

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
          {/* Spotlight with box-shadow overlay - highlighted element stays clear */}
          {targetRect ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: shouldReduceMotion.current ? 0 : (isMobile.current ? 0.2 : 0.3),
                ease: isMobile.current ? 'easeOut' : 'easeInOut'
              }}
              style={{
                position: 'fixed',
                top: targetRect.top - 8,
                left: targetRect.left - 8,
                width: targetRect.width + 16,
                height: targetRect.height + 16,
                zIndex: 46,
                pointerEvents: 'none',
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)', // Creates dark overlay around element
                willChange: 'transform, opacity', // GPU acceleration hint
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
                duration: shouldReduceMotion.current ? 0 : (isMobile.current ? 0.2 : 0.3),
                ease: isMobile.current ? 'easeOut' : 'easeInOut'
              }}
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 46,
                pointerEvents: 'none',
                willChange: 'opacity', // GPU acceleration hint
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
