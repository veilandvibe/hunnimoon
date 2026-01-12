'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ padding = 'md', hover = false, className = '', children, ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    const Component = hover ? motion.div : 'div'
    const motionProps = hover ? {
      whileHover: { y: -2, boxShadow: '0 10px 30px rgba(194, 24, 91, 0.12)' },
      transition: { duration: 0.2, ease: 'easeOut' }
    } : {}

    return (
      <Component
        ref={ref}
        className={`bg-white rounded-4xl shadow-card transition-shadow duration-200 ${paddings[padding]} ${className}`}
        {...motionProps}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Card.displayName = 'Card'

export default Card
