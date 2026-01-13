'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export default function NavigationProgress() {
  const pathname = usePathname()
  const [isNavigating, setIsNavigating] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Start progress animation when pathname is about to change
    setIsNavigating(true)
    setProgress(0)

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev // Cap at 90% until navigation completes
        return prev + Math.random() * 15
      })
    }, 200)

    // Complete progress after a short delay
    const timeout = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setIsNavigating(false)
      }, 300)
    }, 100)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [pathname])

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: progress / 100, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-primary to-pink-secondary z-[100] origin-left"
          style={{
            boxShadow: '0 0 10px rgba(194, 24, 91, 0.5)',
          }}
        />
      )}
    </AnimatePresence>
  )
}
