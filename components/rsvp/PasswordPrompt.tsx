'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Lock, AlertCircle } from 'lucide-react'

interface PasswordPromptProps {
  onSuccess: () => void
  correctPassword: string
  coupleName: string
}

export default function PasswordPrompt({ onSuccess, correctPassword, coupleName }: PasswordPromptProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(false)

    // Simple password verification
    if (password.trim() === correctPassword.trim()) {
      onSuccess()
    } else {
      setError(true)
      setIsSubmitting(false)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 md:py-12 bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="text-center">
          {/* Lock Icon */}
          <div className="w-16 h-16 bg-pink-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={32} className="text-pink-primary" />
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-black text-pink-primary mb-2">
            Password Protected
          </h1>
          
          <p className="text-pink-primary/70 mb-6">
            {coupleName}'s RSVP form requires a password to access
          </p>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(false)
              }}
              placeholder="Enter password"
              required
              autoFocus
              disabled={isSubmitting}
            />

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 rounded-xl text-red-600"
                >
                  <AlertCircle size={18} className="flex-shrink-0" />
                  <p className="text-sm font-medium">
                    Incorrect password. Please try again.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isSubmitting || !password.trim()}
            >
              {isSubmitting ? 'Verifying...' : 'Continue to RSVP'}
            </Button>
          </form>

          {/* Help Text */}
          <p className="text-xs text-pink-primary/50 mt-6">
            Contact the couple if you don't have the password
          </p>
        </Card>
      </motion.div>
    </div>
  )
}
