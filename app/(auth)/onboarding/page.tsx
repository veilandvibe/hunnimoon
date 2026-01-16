'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { id } from '@instantdb/react'
import db from '@/lib/instant'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Heart, Sparkles } from 'lucide-react'

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

  // Check if user already has a wedding
  useEffect(() => {
    if (queryLoading) return
    if (data?.weddings && data.weddings.length > 0) {
      router.push('/dashboard')
    }
  }, [data, queryLoading, router])

  // Show loading while checking for existing wedding
  if (queryLoading) {
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

  const handlePartner1Change = (value: string) => {
    setFormData(prev => ({
      ...prev,
      partner1_name: value,
      wedding_slug: generateSlug(value, prev.partner2_name),
    }))
  }

  const handlePartner2Change = (value: string) => {
    setFormData(prev => ({
      ...prev,
      partner2_name: value,
      wedding_slug: generateSlug(prev.partner1_name, value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Validate wedding date is in the future
      const weddingDate = new Date(formData.wedding_date)
      if (weddingDate <= new Date()) {
        throw new Error('Wedding date must be in the future')
      }

      if (!user) {
        throw new Error('You must be logged in to create a wedding')
      }

      // Get acquisition source from localStorage (set on landing page)
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

      // Clear acquisition source from localStorage after saving to DB
      if (typeof window !== 'undefined' && acqSource) {
        localStorage.removeItem('acq_source')
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create wedding. Please try again.')
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

            <Input
              label="Wedding Slug (for your RSVP URL)"
              required
              value={formData.wedding_slug}
              onChange={(e) => setFormData({ 
                ...formData, 
                wedding_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') 
              })}
              placeholder="alex-and-jordan-2026"
            />

            <div className="p-4 bg-pink-light rounded-xl">
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

            <Button type="submit" fullWidth size="lg" disabled={loading}>
              <Heart size={20} />
              {loading ? 'Creating Your Wedding...' : 'Create My Wedding'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
