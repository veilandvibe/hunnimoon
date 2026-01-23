'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useWedding } from '@/components/providers/WeddingProvider'
import db from '@/lib/instant'
import { Copy, Check, Calendar, User, LogOut, Loader2, HelpCircle, RotateCcw, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTour } from '@/components/providers/TourContext'
import BillingSection from '@/components/settings/BillingSection'
import { useReadOnly } from '@/lib/use-read-only'

export default function SettingsPage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = db.useAuth()
  const { wedding, isLoading: weddingLoading } = useWedding()
  const { startOnboarding } = useTour()
  const { isReadOnly } = useReadOnly()
  
  // Detect URL parameters for auto-opening upgrade flows
  const [autoOpenUpgrade, setAutoOpenUpgrade] = useState(false)
  const [autoOpenPromo, setAutoOpenPromo] = useState(false)
  
  // Query user data with billing fields and rsvpSettings
  const { data, isLoading: dataLoading, error } = db.useQuery(
    wedding?.id && user?.id ? {
      rsvpSettings: {
        $: {
          where: {
            wedding: wedding.id
          }
        }
      },
      $users: {
        $: {
          where: {
            id: user.id
          }
        }
      }
    } : null
  )
  
  const rsvpSettings = data?.rsvpSettings?.[0]
  const userData = data?.$users?.[0]
  
  const [weddingDetails, setWeddingDetails] = useState({
    partner1_name: '',
    partner2_name: '',
    wedding_date: '',
    wedding_slug: '',
  })
  const [originalSlug, setOriginalSlug] = useState('')
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)
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
      setOriginalSlug(wedding.wedding_slug || '')
      setSlugAvailable(true) // Current slug is always valid
    }
  }, [wedding])

  // Check for URL parameters to auto-open upgrade flows
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const action = params.get('action')
      const promo = params.get('promo')
      
      if (action === 'upgrade') {
        if (promo === 'true') {
          setAutoOpenPromo(true)
        } else {
          setAutoOpenUpgrade(true)
        }
        // Clean up URL after detecting parameters
        window.history.replaceState({}, '', '/settings')
      }
    }
  }, [])

  // Real-time slug availability check for manual edits
  useEffect(() => {
    const checkSlugAvailability = async () => {
      // Don't check if it's the original slug (unchanged)
      if (!weddingDetails.wedding_slug || 
          weddingDetails.wedding_slug === originalSlug ||
          weddingDetails.wedding_slug.length < 3) {
        setSlugAvailable(true) // Original slug is always valid
        return
      }
      
      setCheckingSlug(true)
      try {
        // Check if the new slug is available
        const response = await fetch(`/api/check-slug?slug=${encodeURIComponent(weddingDetails.wedding_slug)}`)
        const data = await response.json()
        setSlugAvailable(!data.exists)
      } catch (error) {
        console.error('Error checking slug availability:', error)
        setSlugAvailable(null)
      } finally {
        setCheckingSlug(false)
      }
    }
    
    const debounceTimer = setTimeout(checkSlugAvailability, 500)
    return () => clearTimeout(debounceTimer)
  }, [weddingDetails.wedding_slug, originalSlug])

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!wedding?.id) {
      toast.error('Wedding not found. Please refresh the page.')
      return
    }
    
    // CRITICAL: Block save if slug is unavailable
    if (slugAvailable === false) {
      toast.error('That RSVP link is already taken. Please choose a different one.')
      return
    }
    
    // Block save while checking
    if (checkingSlug) {
      toast.error('Please wait while we verify your RSVP link.')
      return
    }
    
    try {
      setSaving(true)
      
      // Validate wedding date is in the future
      const weddingDate = new Date(weddingDetails.wedding_date)
      if (weddingDate <= new Date()) {
        toast.error('Wedding date must be in the future')
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
      
      // Update the original slug tracker after successful save
      setOriginalSlug(weddingDetails.wedding_slug)
      
      toast.success('Wedding details updated!')
    } catch (error: any) {
      console.error('Error saving settings:', error)
      
      let friendlyMessage = 'Failed to save settings. Please try again.'
      
      if (error.message?.includes('wedding_slug') || error.message?.includes('unique')) {
        friendlyMessage = 'That RSVP link is already taken. Please choose a different one.'
        setSlugAvailable(false) // Mark as unavailable for real-time feedback
      }
      
      toast.error(friendlyMessage)
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

  const handleRetakeTour = () => {
    // Clear the onboarding completed flag
    localStorage.removeItem('onboardingCompleted')
    // Start the onboarding tour
    startOnboarding()
    toast.success('Onboarding tour started!')
  }

  // Loading state
  if (authLoading || weddingLoading || dataLoading) {
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
      <Card data-tour="wedding-details">
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

          <div>
            <Input
              label="Wedding Slug (for RSVP URL)"
              required
              value={weddingDetails.wedding_slug}
              onChange={(e) =>
                setWeddingDetails({ ...weddingDetails, wedding_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })
              }
              placeholder="john-and-jane-2026"
              disabled={isReadOnly}
            />
            {/* Visual feedback indicator */}
            {weddingDetails.wedding_slug && 
             weddingDetails.wedding_slug !== originalSlug && 
             weddingDetails.wedding_slug.length >= 3 && (
              <div className="flex items-center gap-1 mt-2 text-xs">
                {checkingSlug ? (
                  <>
                    <Loader2 size={16} className="text-pink-primary/50 animate-spin" />
                    <span className="text-pink-primary/60">Checking availability...</span>
                  </>
                ) : slugAvailable === true ? (
                  <>
                    <Check size={16} className="text-green-600" />
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

          {/* Show warning if slug is taken */}
          {slugAvailable === false && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-700">
                This RSVP link is already in use. Please choose a different one.
              </p>
            </div>
          )}

          <Button 
            type="submit" 
            fullWidth 
            disabled={
              saving || 
              checkingSlug || 
              slugAvailable === false || 
              isReadOnly
            } 
            title={isReadOnly ? 'Upgrade to edit settings' : undefined}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : checkingSlug ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </Card>

      {/* Billing & Subscription */}
      {userData && (
        <BillingSection 
          user={{
            ...userData,
            id: user!.id,
            email: user?.email ?? undefined,
            billing_status: userData.billing_status as 'trial' | 'active' | 'expired' | 'canceled' | null | undefined,
            subscription_plan: userData.subscription_plan as 'monthly' | 'yearly' | null | undefined,
          }}
          autoOpenUpgrade={autoOpenUpgrade}
          autoOpenPromo={autoOpenPromo}
        />
      )}

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

      {/* Help & Support */}
      <Card data-tour="retake-tour">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-primary/10 rounded-xl flex items-center justify-center">
              <HelpCircle size={20} className="text-pink-primary" />
            </div>
            <h2 className="text-xl font-black text-pink-primary">
              Help & Support
            </h2>
          </div>

          <p className="text-pink-primary/70 text-sm">
            Need a refresher on how things work? Retake the onboarding tour to see all the features again.
          </p>

          <Button 
            variant="outline" 
            fullWidth 
            onClick={handleRetakeTour}
          >
            <RotateCcw size={18} />
            Retake Onboarding Tour
          </Button>
        </div>
      </Card>
    </div>
  )
}
