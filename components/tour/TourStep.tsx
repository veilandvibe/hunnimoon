'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import Button from '@/components/ui/Button'
import { TourStep as TourStepType } from '@/lib/tourSteps'
import { useSidebar } from '@/components/layout/SidebarContext'

// Device detection for performance optimization
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
}

const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface TourStepProps {
  step: TourStepType
  currentStep: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
  onExit: () => void
  targetRect: DOMRect | null
}

export default function TourStep({
  step,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onExit,
  targetRect,
}: TourStepProps) {
  const { isExpanded } = useSidebar()
  
  // Calculate tooltip position with smart positioning to avoid clipping
  const getTooltipPosition = () => {
    // If no target, center the tooltip on screen
    if (!targetRect) {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const tooltipWidth = 320
      const tooltipHeight = 250
      
      return {
        top: (viewportHeight - tooltipHeight) / 2,
        left: (viewportWidth - tooltipWidth) / 2,
      }
    }
    
    const tooltipWidth = 320
    const tooltipHeight = 250 // Increased to better estimate actual height
    const gap = 16
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const isMobile = viewportWidth < 768
    
    // On mobile, account for bottom nav bar (64px) + extra padding (32px for safety)
    const bottomPadding = isMobile ? 96 : 16
    const edgePadding = 16
    
    // On desktop, account for sidebar width
    const sidebarWidth = isMobile ? 0 : (isExpanded ? 240 : 69)
    const leftPadding = sidebarWidth + edgePadding
    
    // Detect if element is very tall (> 50% of viewport)
    const isLargeElement = targetRect.height > viewportHeight * 0.5

    // Try positions in order of preference: right, left, top, bottom
    const positions = ['right', 'left', 'top', 'bottom']
    
    // Function to calculate position for a given direction
    const calculatePosition = (position: string) => {
      let top = 0
      let left = 0

      switch (position) {
        case 'top':
          top = targetRect.top - tooltipHeight - gap
          left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2
          break
        case 'bottom':
          top = targetRect.bottom + gap
          left = targetRect.left + targetRect.width / 2 - tooltipWidth / 2
          break
        case 'left':
          top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2
          left = targetRect.left - tooltipWidth - gap
          break
        case 'right':
          top = targetRect.top + targetRect.height / 2 - tooltipHeight / 2
          left = targetRect.right + gap
          break
      }

      return { top, left }
    }

    // For very large elements, force tooltip to top of screen
    if (isLargeElement) {
      return {
        top: edgePadding + 80, // 80px from top (below header)
        left: Math.min(
          Math.max(targetRect.left, leftPadding),
          viewportWidth - tooltipWidth - edgePadding
        )
      }
    }

    // Function to check if position fits in viewport
    const fitsInViewport = (pos: { top: number; left: number }) => {
      return (
        pos.top >= edgePadding &&
        pos.left >= leftPadding && // Use leftPadding to avoid sidebar
        pos.top + tooltipHeight <= viewportHeight - bottomPadding &&
        pos.left + tooltipWidth <= viewportWidth - edgePadding
      )
    }

    // Try preferred position first (from step config), then try others
    const preferredPosition = step.position || 'bottom'
    const orderedPositions = [preferredPosition, ...positions.filter(p => p !== preferredPosition)]

    // Find first position that fits
    for (const position of orderedPositions) {
      const pos = calculatePosition(position)
      if (fitsInViewport(pos)) {
        return pos
      }
    }

    // If no position fits perfectly, use the preferred position and clamp to viewport
    let { top, left } = calculatePosition(preferredPosition)
    
    // Clamp to viewport boundaries (accounting for sidebar on left)
    if (left < leftPadding) left = leftPadding
    if (left + tooltipWidth > viewportWidth - edgePadding) {
      left = viewportWidth - tooltipWidth - edgePadding
    }
    if (top < edgePadding) top = edgePadding
    if (top + tooltipHeight > viewportHeight - bottomPadding) {
      top = viewportHeight - tooltipHeight - bottomPadding
    }

    return { top, left }
  }

  const tooltipPosition = getTooltipPosition()
  
  // Optimize animations for mobile
  const isMobile = isMobileDevice()
  const shouldReduceMotion = prefersReducedMotion()
  const animationDuration = shouldReduceMotion ? 0 : (isMobile ? 0.2 : 0.3)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ 
        duration: animationDuration,
        ease: isMobile ? 'easeOut' : [0.4, 0, 0.2, 1]
      }}
      style={{
        position: 'fixed',
        top: tooltipPosition.top,
        left: tooltipPosition.left,
        zIndex: 47,
        transform: 'translateZ(0)', // Force GPU layer
        backfaceVisibility: 'hidden', // GPU acceleration hint
        WebkitBackfaceVisibility: 'hidden',
        willChange: 'transform, opacity',
      }}
      className="w-80 bg-white rounded-3xl shadow-2xl p-6"
    >
      {/* Close button */}
      <button
        onClick={onExit}
        className="absolute top-4 right-4 p-1 text-pink-primary/60 hover:text-pink-primary transition-colors rounded-full hover:bg-pink-light"
        aria-label="Exit tour"
      >
        <X size={18} />
      </button>

      {/* Step counter */}
      <div className="text-xs text-pink-primary/60 font-medium mb-3">
        {currentStep + 1} of {totalSteps}
      </div>

      {/* Title */}
      <h3 className="text-xl font-black text-pink-primary mb-2">
        {step.title}
      </h3>

      {/* Description */}
      <p className="text-pink-primary/70 mb-6 text-sm leading-relaxed">
        {step.description}
      </p>

      {/* Navigation */}
      <div className="flex gap-2">
        {currentStep > 0 && (
          <Button
            variant="outline"
            onClick={onBack}
            size="sm"
            className="flex-1"
          >
            Back
          </Button>
        )}
        <Button
          onClick={onNext}
          size="sm"
          className="flex-1"
        >
          {currentStep === totalSteps - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </motion.div>
  )
}
