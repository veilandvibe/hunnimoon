'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTour } from '@/components/providers/TourContext'
import { getTourSteps } from '@/lib/tourSteps'
import TourStep from './TourStep'

export default function SpotlightTour() {
  const { currentTourPage, endPageTour } = useTour()
  const [currentStep, setCurrentStep] = useState(0)
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

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
      const rect = element.getBoundingClientRect()
      setTargetRect(rect)

      // Smart scroll behavior based on element size
      const viewportHeight = window.innerHeight
      const elementHeight = rect.height
      
      // If element is very tall (> 50% of viewport), scroll to top
      // Otherwise scroll to center
      const scrollBlock = elementHeight > viewportHeight * 0.5 ? 'start' : 'center'
      
      element.scrollIntoView({
        behavior: 'smooth',
        block: scrollBlock,
        inline: 'center',
      })
    } else {
      setTargetRect(null)
    }
  }, [steps, currentStep, isActive])

  // Update target rect on step change or window resize
  useEffect(() => {
    if (!isActive) return

    updateTargetRect()

    // Update on window resize or scroll
    const handleUpdate = () => updateTargetRect()
    window.addEventListener('resize', handleUpdate)
    window.addEventListener('scroll', handleUpdate, true)

    return () => {
      window.removeEventListener('resize', handleUpdate)
      window.removeEventListener('scroll', handleUpdate, true)
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
                duration: 0.3,
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
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)', // Creates dark overlay around element
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
                duration: 0.3,
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
