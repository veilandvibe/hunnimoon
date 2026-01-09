'use client'

import { motion } from 'framer-motion'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export default function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <motion.div
          className={`w-11 h-6 rounded-full transition-colors ${
            checked ? 'bg-pink-primary' : 'bg-gray-300'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          animate={{ backgroundColor: checked ? '#C82777' : '#D1D5DB' }}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
            animate={{ x: checked ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.div>
      </div>
      {label && (
        <span className={`text-sm font-medium text-pink-primary ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      )}
    </label>
  )
}
