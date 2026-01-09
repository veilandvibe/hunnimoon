'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Card from '@/components/ui/Card'
import { dummyWedding, dummyGuests, Guest } from '@/lib/dummyData'
import { Heart, Check } from 'lucide-react'

export default function RSVPPage() {
  const params = useParams()
  const slug = params.slug as string

  const [guestName, setGuestName] = useState('')
  const [suggestions, setSuggestions] = useState<Guest[]>([])
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [rsvpStatus, setRsvpStatus] = useState<'Yes' | 'No' | null>(null)
  const [plusOneName, setPlusOneName] = useState('')
  const [mealChoice, setMealChoice] = useState('')
  const [dietaryNotes, setDietaryNotes] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Check if slug matches
  const isValidSlug = slug === dummyWedding.wedding_slug

  if (!isValidSlug) {
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
      const matches = dummyGuests.filter((guest) =>
        guest.full_name.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestions(matches.slice(0, 5))
    } else {
      setSuggestions([])
    }
  }

  const handleSelectGuest = (guest: Guest) => {
    setSelectedGuest(guest)
    setGuestName(guest.full_name)
    setSuggestions([])
    setRsvpStatus(guest.rsvp_status === 'Pending' ? null : guest.rsvp_status)
    setPlusOneName(guest.plus_one_name || '')
    setMealChoice(guest.meal_choice || '')
    setDietaryNotes(guest.dietary_notes || '')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rsvpStatus) return

    // In real app, this would save to database
    console.log('RSVP Submitted:', {
      guestName,
      rsvpStatus,
      plusOneName,
      mealChoice,
      dietaryNotes,
      notes,
    })

    setIsSubmitted(true)
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
              <strong>{dummyWedding.partner1_name} & {dummyWedding.partner2_name}</strong>
            </p>
            <p className="text-xs text-pink-primary/60 mt-1">
              {new Date(dummyWedding.wedding_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
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
            {dummyWedding.partner1_name} & {dummyWedding.partner2_name}
          </h1>
          <p className="text-lg">
            {new Date(dummyWedding.wedding_date).toLocaleDateString('en-US', {
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
                <Input
                  label="Meal Preference"
                  value={mealChoice}
                  onChange={(e) => setMealChoice(e.target.value)}
                  placeholder="Chicken, Fish, Vegetarian, etc."
                />

                {/* Dietary Restrictions */}
                <Textarea
                  label="Dietary Restrictions / Allergies"
                  value={dietaryNotes}
                  onChange={(e) => setDietaryNotes(e.target.value)}
                  placeholder="Let us know about any dietary requirements..."
                />
              </>
            )}

            {/* Notes */}
            <Textarea
              label="Additional Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests or messages for the couple..."
            />

            {/* Submit */}
            <Button type="submit" fullWidth size="lg" disabled={!rsvpStatus}>
              Submit RSVP
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
