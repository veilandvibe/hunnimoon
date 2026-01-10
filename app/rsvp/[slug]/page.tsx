'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Card from '@/components/ui/Card'
import db from '@/lib/instant'
import { Heart, Check, Loader2 } from 'lucide-react'
import { id } from '@instantdb/react'

export default function RSVPPage() {
  const params = useParams()
  const slug = params.slug as string

  // Query wedding and guests by slug
  const { data, isLoading, error } = db.useQuery({
    weddings: {
      $: {
        where: {
          wedding_slug: slug,
        },
      },
    },
    guests: {},
    rsvpSettings: {},
  })

  const wedding = data?.weddings?.[0]
  const allGuests = data?.guests || []
  const rsvpSettings = data?.rsvpSettings?.[0]
  
  // Filter guests for this wedding
  const weddingGuests = wedding ? allGuests.filter((g: any) => g.wedding_id === wedding.id) : []

  const [guestName, setGuestName] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null)
  const [rsvpStatus, setRsvpStatus] = useState<'Yes' | 'No' | null>(null)
  const [plusOneName, setPlusOneName] = useState('')
  const [mealChoice, setMealChoice] = useState('')
  const [dietaryNotes, setDietaryNotes] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-pink-primary mx-auto" />
          <p className="text-pink-primary">Loading wedding details...</p>
        </div>
      </div>
    )
  }

  // Error or invalid slug
  if (error || !wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <h1 className="text-2xl font-black text-pink-primary mb-4">
            Wedding Not Found
          </h1>
          <p className="text-pink-primary/70">
            This RSVP link is not valid. Please check the URL and try again.
          </p>
        </Card>
      </div>
    )
  }

  // Handle guest search
  const handleGuestSearch = (value: string) => {
    setGuestName(value)
    if (value.length > 2) {
      const matches = weddingGuests.filter((guest: any) =>
        guest.full_name.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(matches.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const handleSelectGuest = (guest: any) => {
    setSelectedGuest(guest)
    setGuestName(guest.full_name)
    setSuggestions([])
    setRsvpStatus(guest.rsvp_status === 'Pending' ? null : guest.rsvp_status)
    setPlusOneName(guest.plus_one_name || '')
    setMealChoice(guest.meal_choice || '')
    setDietaryNotes(guest.dietary_notes || '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvpStatus || !wedding) return

    setIsSubmitting(true)

    try {
      if (selectedGuest) {
        // Update existing guest
        await db.transact([
          db.tx.guests[selectedGuest.id].update({
            rsvp_status: rsvpStatus,
            plus_one_name: plusOneName,
            meal_choice: mealChoice,
            dietary_notes: dietaryNotes,
            rsvp_notes: notes,
            last_updated: Date.now(),
          }),
        ])
      } else {
        // Create new guest from RSVP
        const guestId = id()
        await db.transact([
          db.tx.guests[guestId].update({
            wedding_id: wedding.id,
            full_name: guestName,
            email: '',
            phone: '',
            side: 'Unknown',
            plus_one_allowed: false,
            plus_one_name: plusOneName,
            invite_sent: false,
            rsvp_status: rsvpStatus,
            meal_choice: mealChoice,
            dietary_notes: dietaryNotes,
            rsvp_notes: notes,
            shuttle_needed: false,
            address_street: '',
            address_city: '',
            address_state: '',
            address_postal: '',
            address_country: '',
            source: 'RSVP',
            last_updated: Date.now(),
          }),
        ])
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      alert('Failed to submit RSVP. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to">
        <Card className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-pink-primary mb-2">
              Thank You!
            </h1>
            <p className="text-pink-primary/70">
              Your RSVP has been received. We can't wait to celebrate with you!
            </p>
          </div>

          <div className="p-4 bg-pink-light rounded-2xl">
            <p className="text-sm text-pink-primary">
              <strong>{wedding.partner1_name} & {wedding.partner2_name}</strong>
            </p>
            <p className="text-xs text-pink-primary/60 mt-1">
              {new Date(wedding.wedding_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          
          {rsvpSettings?.custom_message && (
            <div className="mt-4 p-4 bg-pink-primary/5 rounded-2xl">
              <p className="text-sm text-pink-primary/80">
                {rsvpSettings.custom_message}
              </p>
            </div>
          )}
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center text-pink-primary">
          <Heart size={48} className="mx-auto mb-4" fill="#C82777" />
          <h1 className="text-4xl md:text-5xl font-black mb-2">
            {wedding.partner1_name} & {wedding.partner2_name}
          </h1>
          <p className="text-lg">
            {new Date(wedding.wedding_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* RSVP Form */}
        <Card className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-pink-primary mb-6">
            RSVP to Our Wedding
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Guest Name Search */}
            <div className="relative">
              <Input
                label="Your Name"
                required
                value={guestName}
                onChange={(e) => handleGuestSearch(e.target.value)}
                placeholder="Start typing your name..."
              />

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border-2 border-pink-primary/20 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map((guest) => (
                    <button
                      key={guest.id}
                      type="button"
                      onClick={() => handleSelectGuest(guest)}
                      className="w-full px-4 py-3 text-left hover:bg-pink-light transition-colors border-b border-pink-primary/10 last:border-b-0"
                    >
                      <div className="font-medium text-pink-primary">{guest.full_name}</div>
                      <div className="text-xs text-pink-primary/60">{guest.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RSVP Status */}
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-3">
                Will you be attending? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpStatus('Yes')}
                  className={`py-4 rounded-xl font-bold transition-all ${
                    rsvpStatus === 'Yes'
                      ? 'bg-pink-primary text-white'
                      : 'bg-white border-2 border-pink-primary/20 text-pink-primary hover:border-pink-primary'
                  }`}
                >
                  ✓ Yes, I'll be there!
                </button>
                <button
                  type="button"
                  onClick={() => setRsvpStatus('No')}
                  className={`py-4 rounded-xl font-bold transition-all ${
                    rsvpStatus === 'No'
                      ? 'bg-pink-primary text-white'
                      : 'bg-white border-2 border-pink-primary/20 text-pink-primary hover:border-pink-primary'
                  }`}
                >
                  ✗ Sorry, can't make it
                </button>
              </div>
            </div>

            {/* Show additional fields if attending */}
            {rsvpStatus === 'Yes' && (
              <>
                {/* Plus-One */}
                {selectedGuest?.plus_one_allowed && (
                  <Input
                    label="Plus-One Name (Optional)"
                    value={plusOneName}
                    onChange={(e) => setPlusOneName(e.target.value)}
                    placeholder="Guest's name"
                  />
                )}

                {/* Meal Choice */}
                {rsvpSettings?.show_meal_choice && (
                  <Input
                    label="Meal Preference"
                    value={mealChoice}
                    onChange={(e) => setMealChoice(e.target.value)}
                    placeholder="Chicken, Fish, Vegetarian, etc."
                  />
                )}

                {/* Dietary Restrictions */}
                {rsvpSettings?.show_dietary_restrictions && (
                  <Textarea
                    label="Dietary Restrictions / Allergies"
                    required={rsvpSettings?.require_dietary_restrictions}
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    placeholder="Let us know about any dietary requirements..."
                  />
                )}
              </>
            )}

            {/* Notes */}
            {rsvpSettings?.show_notes_field && (
              <Textarea
                label="Additional Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or messages for the couple..."
              />
            )}

            {/* Submit */}
            <Button type="submit" fullWidth size="lg" disabled={!rsvpStatus || isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit RSVP'
              )}
            </Button>
          </form>
        </Card>

        {/* Footer */}
        <p className="text-center text-pink-primary/60 text-sm">
          Questions? Contact us at wedding@example.com
        </p>
      </div>
    </div>
  )
}
