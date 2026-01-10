'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import db from '@/lib/instant'
import { Copy, Check, Calendar, User, LogOut, Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = db.useAuth()
  
  // Query wedding data
  const { data, isLoading: dataLoading, error } = db.useQuery({
    weddings: {
      rsvpSettings: {},
    },
  })
  
  const wedding = data?.weddings?.[0]
  const rsvpSettings = wedding?.rsvpSettings
  
  const [weddingDetails, setWeddingDetails] = useState({
    partner1_name: '',
    partner2_name: '',
    wedding_date: '',
    wedding_slug: '',
  })
  const [signingOut, setSigningOut] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Initialize form with wedding data
  useEffect(() => {
    if (wedding) {
      setWeddingDetails({
        partner1_name: wedding.partner1_name || '',
        partner2_name: wedding.partner2_name || '',
        wedding_date: wedding.wedding_date || '',
        wedding_slug: wedding.wedding_slug || '',
      })
    }
  }, [wedding])

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!wedding?.id) {
      alert('Wedding not found. Please refresh the page.')
      return
    }
    
    try {
      setSaving(true)
      
      // Validate wedding date is in the future
      const weddingDate = new Date(weddingDetails.wedding_date)
      if (weddingDate <= new Date()) {
        alert('Wedding date must be in the future')
        setSaving(false)
        return
      }
      
      // Update wedding details
      await db.transact([
        db.tx.weddings[wedding.id].update({
          partner1_name: weddingDetails.partner1_name,
          partner2_name: weddingDetails.partner2_name,
          wedding_date: weddingDate.toISOString(),
          wedding_slug: weddingDetails.wedding_slug,
        }),
      ])
      
      alert('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await db.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      setSigningOut(false)
    }
  }

  // Loading state
  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-pink-primary mx-auto" />
          <p className="text-pink-primary/60">Loading settings...</p>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <p className="text-pink-primary/70">
              Error loading settings. Please refresh the page.
            </p>
          </div>
        </Card>
      </div>
    )
  }
  
  // No wedding found
  if (!wedding) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <p className="text-pink-primary/70">
              No wedding found. Please complete onboarding first.
            </p>
            <Button onClick={() => router.push('/onboarding')} className="mt-4">
              Complete Onboarding
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-pink-primary">
          Settings
        </h1>
        <p className="text-pink-primary/60 mt-1">
          Manage your wedding details and account
        </p>
      </div>

      {/* Wedding Details */}
      <Card>
        <form onSubmit={handleSaveChanges} className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-pink-primary/10 rounded-xl flex items-center justify-center">
              <Calendar size={20} className="text-pink-primary" />
            </div>
            <h2 className="text-xl font-black text-pink-primary">
              Wedding Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Partner 1 Name"
              required
              value={weddingDetails.partner1_name}
              onChange={(e) =>
                setWeddingDetails({ ...weddingDetails, partner1_name: e.target.value })
              }
            />

            <Input
              label="Partner 2 Name"
              required
              value={weddingDetails.partner2_name}
              onChange={(e) =>
                setWeddingDetails({ ...weddingDetails, partner2_name: e.target.value })
              }
            />
          </div>

          <Input
            label="Wedding Date"
            type="date"
            required
            value={weddingDetails.wedding_date.split('T')[0]}
            onChange={(e) =>
              setWeddingDetails({ ...weddingDetails, wedding_date: new Date(e.target.value).toISOString() })
            }
          />

          <Input
            label="Wedding Slug (for RSVP URL)"
            required
            value={weddingDetails.wedding_slug}
            onChange={(e) =>
              setWeddingDetails({ ...weddingDetails, wedding_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })
            }
            placeholder="john-and-jane-2026"
          />

          <Button type="submit" fullWidth disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </Card>

      {/* Account */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-primary/10 rounded-xl flex items-center justify-center">
              <User size={20} className="text-pink-primary" />
            </div>
            <h2 className="text-xl font-black text-pink-primary">
              Account
            </h2>
          </div>

          <div className="p-4 bg-pink-light rounded-xl">
            <p className="text-sm text-pink-primary/70 mb-1">Logged in as:</p>
            <p className="text-pink-primary font-medium">{user?.email || 'Loading...'}</p>
          </div>

          <Button 
            variant="outline" 
            fullWidth 
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <LogOut size={18} />
            {signingOut ? 'Signing Out...' : 'Sign Out'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
