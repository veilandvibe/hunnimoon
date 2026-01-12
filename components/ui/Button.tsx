'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', fullWidth, className = '', children, ...props }, ref) => {
    const baseStyles = 'font-medium rounded-5xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
    
    const variants = {
      primary: 'bg-pink-primary text-white hover:bg-pink-primary/90 shadow-sm',
      secondary: 'bg-white text-pink-primary hover:bg-pink-light border border-pink-primary/20',
      outline: 'bg-transparent text-pink-primary hover:bg-pink-light border-2 border-pink-primary',
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]',
      lg: 'px-8 py-4 text-lg min-h-[52px]',
    }
    
    const width = fullWidth ? 'w-full' : ''

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
        {...(props as any)}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
