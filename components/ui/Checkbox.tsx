'use client'

import { Check } from 'lucide-react'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export default function Checkbox({ checked, onChange, label, disabled }: CheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-5 h-5 rounded border-2 transition-all ${
            checked
              ? 'bg-pink-primary border-pink-primary'
              : 'bg-white border-pink-primary/50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {checked && <Check size={16} className="text-white" />}
        </div>
      </div>
      {label && (
        <span className={`text-sm text-pink-primary ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </span>
      )}
    </label>
  )
}
