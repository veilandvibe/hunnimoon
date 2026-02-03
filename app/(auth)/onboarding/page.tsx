'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { id } from '@instantdb/react'
import db from '@/lib/instant'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Heart, Sparkles, CheckCircle, Loader2, X } from 'lucide-react'

// Helper function to check if slug exists
const checkSlugExists = async (slug: string): Promise<boolean> => {
  try {
    const response = await fetch(`/api/check-slug?slug=${encodeURIComponent(slug)}`)
    
    // If the API returns an error status, throw an error
    if (!response.ok) {
      throw new Error('API check failed')
    }
    
    const data = await response.json()
    
    // Check if the response has an error field
    if (data.error) {
      throw new Error(data.error)
    }
    
    return data.exists
  } catch (error) {
    console.error('Error checking slug:', error)
    // Re-throw the error so the caller knows the check failed
    throw error
  }
}

// Helper to find next available slug with -1, -2, -3 suffix
const findAvailableSlug = async (baseSlug: string): Promise<string> => {
  try {
    // First try the base slug
    const baseExists = await checkSlugExists(baseSlug)
    if (!baseExists) return baseSlug
    
    // Try with incrementing suffixes: -1, -2, -3, etc.
    let counter = 1
    while (counter < 100) { // Safety limit
      const candidateSlug = `${baseSlug}-${counter}`
      const exists = await checkSlugExists(candidateSlug)
      if (!exists) return candidateSlug
      counter++
    }
    
    // Fallback with timestamp if we somehow hit 100 duplicates
    return `${baseSlug}-${Date.now()}`
  } catch (error) {
    // If checking fails, throw the error to be handled by caller
    throw new Error('Unable to verify slug availability. Please check your connection.')
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = db.useAuth()
  const { data, isLoading: queryLoading } = db.useQuery(
    user?.id ? {
      weddings: {
        $: {
          where: {
            user_id: user.id
          }
        }
      }
    } : null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    partner1_name: '',
    partner2_name: '',
    wedding_date: '',
    wedding_slug: '',
  })
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [autoGenerating, setAutoGenerating] = useState(false) // Track if we're auto-generating

  // Check if user already has a wedding - redirect immediately to prevent flash
  useEffect(() => {
    if (queryLoading) return
    if (data?.weddings && data.weddings.length > 0) {
      // Use replace instead of push to prevent back button issues
      router.replace('/dashboard')
    }
  }, [data, queryLoading, router])

  // Real-time slug availability check ONLY for manual edits
  useEffect(() => {
    // Skip if we're auto-generating (to avoid race condition)
    if (autoGenerating) return
    
    const checkSlugAvailability = async () => {
      if (!formData.wedding_slug || formData.wedding_slug.length < 3) {
        setSlugAvailable(null)
        return
      }
      
      setCheckingSlug(true)
      try {
        const exists = await checkSlugExists(formData.wedding_slug)
        setSlugAvailable(!exists)
      } catch (error) {
        console.error('Error checking slug availability:', error)
        setSlugAvailable(null)
      } finally {
        setCheckingSlug(false)
      }
    }
    
    const debounceTimer = setTimeout(checkSlugAvailability, 500)
    return () => clearTimeout(debounceTimer)
  }, [formData.wedding_slug, autoGenerating])

  // Show loading while checking for existing wedding or if user already has one
  if (queryLoading || (!queryLoading && data?.weddings && data.weddings.length > 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Auto-generate slug from partner names
  const generateSlug = (p1: string, p2: string) => {
    if (!p1 || !p2) return ''
    const year = new Date().getFullYear()
    return `${p1}-and-${p2}-${year}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handlePartner1Change = async (value: string) => {
    const baseSlug = generateSlug(value, formData.partner2_name)
    
    // Update the form data immediately
    setFormData(prev => ({
      ...prev,
      partner1_name: value,
      wedding_slug: baseSlug,
    }))
    
    // If we don't have both names yet, stop here
    if (!value || !formData.partner2_name) {
      setSlugAvailable(null)
      setError('')
      return
    }

    // We have both names - auto-generate available slug
    setAutoGenerating(true)
    setCheckingSlug(true)
    setSlugAvailable(null)
    setError('')
    
    try {
      // Find an available slug (base or with suffix)
      const availableSlug = await findAvailableSlug(baseSlug)
      
      setFormData(prev => ({
        ...prev,
        wedding_slug: availableSlug,
      }))
      setSlugAvailable(true) // Always available because we auto-adjusted
    } catch (error: any) {
      console.error('Error generating slug:', error)
      setSlugAvailable(null)
      setError(error.message || 'Unable to check RSVP link availability. Please try again.')
    } finally {
      setCheckingSlug(false)
      setAutoGenerating(false)
    }
  }

  const handlePartner2Change = async (value: string) => {
    const baseSlug = generateSlug(formData.partner1_name, value)
    
    // Update the form data immediately
    setFormData(prev => ({
      ...prev,
      partner2_name: value,
      wedding_slug: baseSlug,
    }))
    
    // If we don't have both names yet, stop here
    if (!formData.partner1_name || !value) {
      setSlugAvailable(null)
      setError('')
      return
    }

    // We have both names - auto-generate available slug
    setAutoGenerating(true)
    setCheckingSlug(true)
    setSlugAvailable(null)
    setError('')
    
    try {
      // Find an available slug (base or with suffix)
      const availableSlug = await findAvailableSlug(baseSlug)
      
      setFormData(prev => ({
        ...prev,
        wedding_slug: availableSlug,
      }))
      setSlugAvailable(true) // Always available because we auto-adjusted
    } catch (error: any) {
      console.error('Error generating slug:', error)
      setSlugAvailable(null)
      setError(error.message || 'Unable to check RSVP link availability. Please try again.')
    } finally {
      setCheckingSlug(false)
      setAutoGenerating(false)
    }
  }

  // Manual slug change - validate in real-time
  const handleSlugChange = (value: string) => {
    const cleanedSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
    setFormData(prev => ({ ...prev, wedding_slug: cleanedSlug }))
    setAutoGenerating(false) // User is manually editing, enable debounced check
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Don't proceed if we're still checking
    if (checkingSlug) {
      setError('Please wait while we check your RSVP link...')
      return
    }
    
    // Don't proceed if slug check failed (slugAvailable is null due to error)
    if (slugAvailable === null && formData.partner1_name && formData.partner2_name) {
      setError('Unable to verify RSVP link. Please check your connection and try again.')
      return
    }
    
    setLoading(true)

    try {
      // Final server-side check before creating account
      let slugExists: boolean
      try {
        slugExists = await checkSlugExists(formData.wedding_slug)
      } catch (error) {
        throw new Error('Unable to verify RSVP link. Please check your connection and try again.')
      }
      
      if (slugExists) {
        // Race condition - someone took it between check and submit
        // Auto-generate a new one
        const baseSlug = generateSlug(formData.partner1_name, formData.partner2_name)
        const availableSlug = await findAvailableSlug(baseSlug)
        setFormData(prev => ({ ...prev, wedding_slug: availableSlug }))
        setSlugAvailable(true)
        setError('That link was just taken - we found you a new one! Please submit again.')
        setLoading(false)
        return // DO NOT CREATE ACCOUNT
      }

      // Validate wedding date is in the future
      const weddingDate = new Date(formData.wedding_date)
      if (weddingDate <= new Date()) {
        throw new Error('Wedding date must be in the future')
      }

      if (!user) {
        throw new Error('You must be logged in to create a wedding')
      }

      // Get acquisition source from localStorage
      const acqSource = typeof window !== 'undefined' 
        ? localStorage.getItem('acq_source') 
        : null

      // Create wedding record and initialize trial
      const weddingId = id()
      const now = Date.now()
      
      const transactions = [
        db.tx.weddings[weddingId].update({
          user_id: user.id,
          partner1_name: formData.partner1_name,
          partner2_name: formData.partner2_name,
          wedding_date: weddingDate.toISOString(),
          wedding_slug: formData.wedding_slug,
          created_at: now,
        }),
        db.tx.$users[user.id].update({
          trial_start_date: now,
          billing_status: 'trial',
          ...(acqSource && {
            acq_source: acqSource,
            acq_source_set_at: now,
          }),
        }),
      ]
      
      await db.transact(transactions)

      // Send welcome email (fire-and-forget, don't block user)
      try {
        const firstName = formData.partner1_name.split(' ')[0] || formData.partner1_name
        fetch('/api/emails/send-trial-started', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            firstName,
            isEtsyUser: acqSource === 'etsy',
          }),
        }).catch(err => console.error('Failed to send welcome email:', err))
      } catch (emailError) {
        // Don't block onboarding if email fails
        console.error('Error sending welcome email:', emailError)
      }

      // Clear acquisition source from localStorage
      if (typeof window !== 'undefined' && acqSource) {
        localStorage.removeItem('acq_source')
      }

      // Track Meta Pixel conversion events
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'CompleteRegistration');
        window.fbq('track', 'StartTrial');
      }

      // ONLY redirect on successful creation
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Error creating wedding:', err)
      
      let friendlyMessage = 'Something went wrong. Please try again.'
      
      if (err.message?.includes('wedding_slug') || err.message?.includes('unique')) {
        friendlyMessage = 'That RSVP link is already taken. Refreshing the page...'
        setSlugAvailable(false)
        // Auto-regenerate after a moment
        setTimeout(() => {
          handlePartner1Change(formData.partner1_name)
        }, 1000)
      } else if (err.message === 'Wedding date must be in the future') {
        friendlyMessage = err.message
      } else if (err.message === 'You must be logged in to create a wedding') {
        friendlyMessage = err.message
      } else if (err.message?.includes('Unable to verify')) {
        friendlyMessage = err.message
      }
      
      setError(friendlyMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <Sparkles size={64} className="mx-auto mb-4 text-pink-primary" />
          <h1 className="text-4xl font-black text-pink-primary mb-2">
            Welcome to Hunnimoon!
          </h1>
          <p className="text-pink-primary/70">
            Let's get started by setting up your wedding details
          </p>
        </div>

        {/* Onboarding Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Partner 1 Name"
                required
                value={formData.partner1_name}
                onChange={(e) => handlePartner1Change(e.target.value)}
                placeholder="Alex"
                autoFocus
              />

              <Input
                label="Partner 2 Name"
                required
                value={formData.partner2_name}
                onChange={(e) => handlePartner2Change(e.target.value)}
                placeholder="Jordan"
              />
            </div>

            <Input
              label="Wedding Date"
              type="date"
              required
              value={formData.wedding_date}
              onChange={(e) => setFormData({ ...formData, wedding_date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
            />

            <div>
              <Input
                label="Wedding Slug (for your RSVP URL)"
                required
                value={formData.wedding_slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="alex-and-jordan-2026"
              />
              {formData.wedding_slug && formData.wedding_slug.length >= 3 && (
                <div className="flex items-center gap-1 mt-2 text-xs">
                  {checkingSlug ? (
                    <>
                      <Loader2 size={16} className="text-pink-primary/50 animate-spin" />
                      <span className="text-pink-primary/60">Checking availability...</span>
                    </>
                  ) : slugAvailable === true ? (
                    <>
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-green-600 font-medium">Available</span>
                    </>
                  ) : slugAvailable === false ? (
                    <>
                      <X size={16} className="text-red-600" />
                      <span className="text-red-600 font-medium">Taken</span>
                    </>
                  ) : null}
                </div>
              )}
            </div>

            <div className="p-4 rounded-xl bg-pink-light">
              <p className="text-sm text-pink-primary">
                <strong>Your RSVP URL will be:</strong>
                <br />
                <code className="text-xs">
                  {typeof window !== 'undefined' ? window.location.origin : ''}/rsvp/{formData.wedding_slug || 'your-wedding-slug'}
                </code>
              </p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              disabled={loading || checkingSlug || slugAvailable === false}
            >
              <Heart size={20} />
              {loading 
                ? 'Creating Your Wedding...' 
                : checkingSlug 
                  ? 'Checking availability...' 
                  : slugAvailable === false 
                    ? 'Link Unavailable' 
                    : 'Create My Wedding'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
