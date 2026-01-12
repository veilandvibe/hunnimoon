'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        x: -12,
      }}
      animate={{ 
        opacity: 1, 
        x: 0,
      }}
      exit={{ 
        opacity: 0, 
        x: 12,
      }}
      transition={{
        duration: 0.35,
        ease: [0.19, 1, 0.22, 1], // Fluid bezier curve for swoosh effect
      }}
    >
      {children}
    </motion.div>
  )
}
