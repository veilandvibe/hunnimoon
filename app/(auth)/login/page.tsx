'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import db from '@/lib/instant'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Heart, Mail } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sentEmail, setSentEmail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await db.auth.sendMagicCode({ email })
      setSentEmail(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await db.auth.signInWithMagicCode({ email, code })
      // Auth state will update automatically, redirect will happen in middleware
      router.push('/onboarding')
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <Heart size={64} className="mx-auto mb-4 text-pink-primary" fill="#C82777" />
          <h1 className="text-4xl font-black text-pink-primary mb-2">
            hunnimoon
          </h1>
          <p className="text-pink-primary/70">
            Your wedding planning journey starts here
          </p>
        </div>

        {/* Login Card */}
        <Card>
          {!sentEmail ? (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-pink-primary mb-2">
                  Sign In
                </h2>
                <p className="text-sm text-pink-primary/70">
                  We'll send you a magic code to sign in. No password needed!
                </p>
              </div>

              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoFocus
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth disabled={loading}>
                <Mail size={18} />
                {loading ? 'Sending...' : 'Send Magic Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-pink-primary mb-2">
                  Check Your Email
                </h2>
                <p className="text-sm text-pink-primary/70">
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              <Input
                label="6-Digit Code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                autoFocus
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <Button type="submit" fullWidth disabled={loading || code.length !== 6}>
                  {loading ? 'Verifying...' : 'Verify Code'}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setSentEmail(false)
                    setCode('')
                    setError('')
                  }}
                  className="w-full text-sm text-pink-primary/70 hover:text-pink-primary transition-colors"
                >
                  Use a different email
                </button>
              </div>
            </form>
          )}
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-pink-primary/60">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
