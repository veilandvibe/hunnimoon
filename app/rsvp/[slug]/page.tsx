'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Textarea from '@/components/ui/Textarea'
import Card from '@/components/ui/Card'
import PasswordPrompt from '@/components/rsvp/PasswordPrompt'
import db from '@/lib/instant'
import { Heart, Check, Loader2 } from 'lucide-react'
import { id } from '@instantdb/react'
import toast from 'react-hot-toast'

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
      guests: {},
      rsvpSettings: {},
    },
  })

  const wedding = data?.weddings?.[0]
  const weddingGuests = wedding?.guests || []
  const rsvpSettings = wedding?.rsvpSettings

  // Check password authentication on mount and when wedding changes
  useEffect(() => {
    if (!wedding || !rsvpSettings) return

    // If password protection is not enabled, user is automatically authenticated
    if (!rsvpSettings.password_protected) {
      setIsAuthenticated(true)
      return
    }

    // Check localStorage for existing authentication
    const authKey = `rsvp_auth_${wedding.id}`
    const storedAuth = localStorage.getItem(authKey)

    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth)
        const expiryTime = authData.timestamp + (24 * 60 * 60 * 1000) // 24 hours

        if (Date.now() < expiryTime) {
          // Authentication is still valid
          setIsAuthenticated(true)
        } else {
          // Authentication expired, clear it
          localStorage.removeItem(authKey)
          setIsAuthenticated(false)
        }
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem(authKey)
        setIsAuthenticated(false)
      }
    } else {
      setIsAuthenticated(false)
    }
  }, [wedding, rsvpSettings])

  // Handle successful password authentication
  const handlePasswordSuccess = () => {
    if (!wedding) return

    // Store authentication in localStorage
    const authKey = `rsvp_auth_${wedding.id}`
    const authData = {
      timestamp: Date.now(),
      verified: true
    }
    localStorage.setItem(authKey, JSON.stringify(authData))
    setIsAuthenticated(true)
  }

  // Debug logging
  console.log('RSVP Form Debug:', {
    wedding: wedding?.id,
    hasRsvpSettings: !!rsvpSettings,
    rsvpSettings,
    shuttleAvailable: rsvpSettings?.shuttle_service_available,
    showMeal: rsvpSettings?.show_meal_choice,
    showSong: rsvpSettings?.show_song_request,
    showAccommodation: rsvpSettings?.show_accommodation_question,
  })

  const [guestName, setGuestName] = useState('')
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [selectedGuest, setSelectedGuest] = useState<any | null>(null)
  const [householdMembers, setHouseholdMembers] = useState<any[]>([])
  const [householdResponses, setHouseholdResponses] = useState<{[key: string]: any}>({})
  const [rsvpStatus, setRsvpStatus] = useState<'Yes' | 'No' | null>(null)
  const [plusOneName, setPlusOneName] = useState('')
  const [mealChoice, setMealChoice] = useState('')
  const [dietaryNotes, setDietaryNotes] = useState('')
  const [shuttleNeeded, setShuttleNeeded] = useState<boolean | null>(null)
  const [songRequest, setSongRequest] = useState('')
  const [needsAccommodation, setNeedsAccommodation] = useState<boolean | null>(null)
  const [notes, setNotes] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

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

  // Password protection gate
  if (rsvpSettings?.password_protected && !isAuthenticated) {
    return (
      <PasswordPrompt
        onSuccess={handlePasswordSuccess}
        correctPassword={rsvpSettings.rsvp_password || ''}
        coupleName={`${wedding.partner1_name} & ${wedding.partner2_name}`}
      />
    )
  }

  // Handle guest search
  const handleGuestSearch = (value: string) => {
    setGuestName(value)
    
    // Clear selected guest if they're typing something different
    if (selectedGuest && value !== selectedGuest.full_name) {
      setSelectedGuest(null)
      setPlusOneName('')
      setMealChoice('')
      setDietaryNotes('')
    }
    
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
    
    // Check if guest has a household
    if (guest.household_id && guest.household_id.trim()) {
      // Find all household members
      const members = weddingGuests.filter(
        (g: any) => g.household_id === guest.household_id
      )
      setHouseholdMembers(members)
      
      // Initialize responses for each household member
      const initialResponses: {[key: string]: any} = {}
      members.forEach((member: any) => {
        initialResponses[member.id] = {
          rsvp_status: member.rsvp_status === 'Pending' ? null : member.rsvp_status,
          meal_choice: member.meal_choice || '',
          dietary_notes: member.dietary_notes || '',
          shuttle_needed: member.shuttle_needed ?? null,
          song_request: member.song_request || '',
          needs_accommodation: member.needs_accommodation ?? null,
          rsvp_notes: member.rsvp_notes || '',
        }
      })
      setHouseholdResponses(initialResponses)
    } else {
      // Single guest (no household)
      setHouseholdMembers([])
      setHouseholdResponses({})
      setRsvpStatus(guest.rsvp_status === 'Pending' ? null : guest.rsvp_status)
      setPlusOneName(guest.plus_one_name || '')
      setMealChoice(guest.meal_choice || '')
      setDietaryNotes(guest.dietary_notes || '')
      setShuttleNeeded(guest.shuttle_needed ?? null)
      setSongRequest(guest.song_request || '')
      setNeedsAccommodation(guest.needs_accommodation ?? null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wedding) return

    // Validate: If household, check that at least one member has responded
    if (householdMembers.length > 0) {
      const hasResponses = Object.values(householdResponses).some(
        (response: any) => response.rsvp_status !== null
      )
      if (!hasResponses) {
        toast.error('Please RSVP for at least one household member')
        return
      }
    } else {
      // Single guest validation
      if (!rsvpStatus) {
        toast.error('Please select if you will be attending')
        return
      }
    }

    setIsSubmitting(true)

    try {
      if (householdMembers.length > 0) {
        // Multi-member household RSVP
        const transactions = householdMembers
          .filter((member: any) => householdResponses[member.id]?.rsvp_status !== null)
          .map((member: any) => {
            const response = householdResponses[member.id]
            return db.tx.guests[member.id].update({
              rsvp_status: response.rsvp_status,
              meal_choice: response.meal_choice || '',
              dietary_notes: response.dietary_notes || '',
              shuttle_needed: response.shuttle_needed ?? false,
              song_request: response.song_request || '',
              needs_accommodation: response.needs_accommodation ?? false,
              rsvp_notes: response.rsvp_notes || '',
              last_updated: Date.now(),
            })
          })
        
        await db.transact(transactions)
      } else if (selectedGuest) {
        // Single existing guest
        await db.transact([
          db.tx.guests[selectedGuest.id].update({
            rsvp_status: rsvpStatus,
            plus_one_name: plusOneName,
            meal_choice: mealChoice,
            dietary_notes: dietaryNotes,
            rsvp_notes: notes,
            shuttle_needed: shuttleNeeded ?? false,
            song_request: songRequest,
            needs_accommodation: needsAccommodation ?? false,
            last_updated: Date.now(),
          }),
        ])
      } else {
        // Create new guest from RSVP
        const guestId = id()
        await db.transact([
          db.tx.guests[guestId]
            .update({
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
              shuttle_needed: shuttleNeeded ?? false,
              song_request: songRequest,
              needs_accommodation: needsAccommodation ?? false,
              address_street: '',
              address_city: '',
              address_state: '',
              address_postal: '',
              address_country: '',
              source: 'RSVP Submission',
              last_updated: Date.now(),
            })
            .link({ wedding: wedding.id }),
        ])
      }

      setIsSubmitted(true)
      toast.success('RSVP submitted successfully!')
    } catch (error) {
      console.error('Error submitting RSVP:', error)
      toast.error('Failed to submit RSVP. Please try again.')
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
              {rsvpSettings?.custom_message || "Your RSVP has been received. We can't wait to celebrate with you!"}
            </p>
          </div>

          <div className="p-4 bg-pink-light rounded-2xl">
            <p className="text-sm text-pink-primary">
              <strong>{wedding.partner1_name} & {wedding.partner2_name}</strong>
            </p>
            <p className="text-xs text-pink-primary/60 mt-1">
              {wedding.wedding_date && new Date(wedding.wedding_date).toLocaleDateString('en-US', {
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
            {wedding.partner1_name} & {wedding.partner2_name}
          </h1>
          <p className="text-lg">
            {wedding.wedding_date && new Date(wedding.wedding_date).toLocaleDateString('en-US', {
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
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RSVP Status or Household Members */}
            {householdMembers.length > 0 ? (
              /* Household RSVP */
              <div className="space-y-6">
                <div className="p-4 bg-pink-light rounded-xl">
                  <p className="text-sm font-bold text-pink-primary mb-1">
                    Family RSVP
                  </p>
                  <p className="text-xs text-pink-primary/70">
                    Please RSVP for each family member individually
                  </p>
                </div>

                {householdMembers.map((member: any, index: number) => (
                  <div key={member.id} className="border-2 border-pink-primary/20 rounded-xl p-4 space-y-4">
                    <h3 className="text-lg font-bold text-pink-primary">
                      {member.full_name}
                    </h3>

                    {/* RSVP Status for this member */}
                    <div>
                      <label className="block text-sm font-medium text-pink-primary mb-3">
                        Will they be attending?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setHouseholdResponses({
                            ...householdResponses,
                            [member.id]: {
                              ...householdResponses[member.id],
                              rsvp_status: 'Yes',
                            }
                          })}
                          className={`py-3 rounded-xl font-medium transition-all ${
                            householdResponses[member.id]?.rsvp_status === 'Yes'
                              ? 'bg-pink-primary text-white'
                              : 'bg-white border-2 border-pink-primary/20 text-pink-primary hover:border-pink-primary'
                          }`}
                        >
                          ✓ Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setHouseholdResponses({
                            ...householdResponses,
                            [member.id]: {
                              ...householdResponses[member.id],
                              rsvp_status: 'No',
                            }
                          })}
                          className={`py-3 rounded-xl font-medium transition-all ${
                            householdResponses[member.id]?.rsvp_status === 'No'
                              ? 'bg-pink-primary text-white'
                              : 'bg-white border-2 border-pink-primary/20 text-pink-primary hover:border-pink-primary'
                          }`}
                        >
                          ✗ No
                        </button>
                      </div>
                    </div>

                    {/* Show fields if attending */}
                    {householdResponses[member.id]?.rsvp_status === 'Yes' && (
                      <>
                        {/* Meal Choice */}
                        {rsvpSettings?.show_meal_choice && rsvpSettings?.meal_options && (
                          <Select
                            label="Meal Preference"
                            value={householdResponses[member.id]?.meal_choice || ''}
                            onChange={(e) => setHouseholdResponses({
                              ...householdResponses,
                              [member.id]: {
                                ...householdResponses[member.id],
                                meal_choice: e.target.value,
                              }
                            })}
                            options={[
                              { value: '', label: 'Select a meal option' },
                              ...rsvpSettings.meal_options.split(',').map((option: string) => ({
                                value: option.trim(),
                                label: option.trim(),
                              })),
                            ]}
                          />
                        )}

                        {/* Dietary Restrictions */}
                        {rsvpSettings?.show_dietary_restrictions && (
                          <Textarea
                            label="Dietary Restrictions / Allergies"
                            required={rsvpSettings?.require_dietary_restrictions}
                            value={householdResponses[member.id]?.dietary_notes || ''}
                            onChange={(e) => setHouseholdResponses({
                              ...householdResponses,
                              [member.id]: {
                                ...householdResponses[member.id],
                                dietary_notes: e.target.value,
                              }
                            })}
                            placeholder="Let us know about any dietary requirements..."
                          />
                        )}

                        {/* Shuttle Service */}
                        {rsvpSettings?.shuttle_service_available && (
                          <div>
                            <label className="block text-sm font-medium text-pink-primary mb-3">
                              Will they need shuttle service?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setHouseholdResponses({
                                  ...householdResponses,
                                  [member.id]: {
                                    ...householdResponses[member.id],
                                    shuttle_needed: true,
                                  }
                                })}
                                className={`py-3 rounded-xl font-medium transition-all ${
                                  householdResponses[member.id]?.shuttle_needed === true
                                    ? 'bg-pink-primary text-white'
                                    : 'bg-white border-2 border-pink-primary/20 text-pink-primary hover:border-pink-primary'
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setHouseholdResponses({
                                  ...householdResponses,
                                  [member.id]: {
                                    ...householdResponses[member.id],
                                    shuttle_needed: false,
                                  }
                                })}
                                className={`py-3 rounded-xl font-medium transition-all ${
                                  householdResponses[member.id]?.shuttle_needed === false
                                    ? 'bg-pink-primary text-white'
                                    : 'bg-white border-2 border-pink-primary/20 text-pink-primary hover:border-pink-primary'
                                }`}
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Song Request */}
                        {rsvpSettings?.show_song_request && (
                          <Input
                            label="Song Request (Optional)"
                            value={householdResponses[member.id]?.song_request || ''}
                            onChange={(e) => setHouseholdResponses({
                              ...householdResponses,
                              [member.id]: {
                                ...householdResponses[member.id],
                                song_request: e.target.value,
                              }
                            })}
                            placeholder="Suggest a song for the playlist"
                          />
                        )}

                        {/* Hotel Info Needed */}
                        {rsvpSettings?.show_accommodation_question && (
                          <div>
                            <label className="block text-sm font-medium text-pink-primary mb-3">
                              Do they need hotel accommodation information?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => setHouseholdResponses({
                                  ...householdResponses,
                                  [member.id]: {
                                    ...householdResponses[member.id],
                                    needs_accommodation: true,
                                  }
                                })}
                                className={`py-3 rounded-xl font-medium transition-all ${
                                  householdResponses[member.id]?.needs_accommodation === true
                                    ? 'bg-pink-primary text-white'
                                    : 'bg-white border-2 border-pink-primary/20 text-pink-primary hover:border-pink-primary'
                                }`}
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setHouseholdResponses({
                                  ...householdResponses,
                                  [member.id]: {
                                    ...householdResponses[member.id],
                                    needs_accommodation: false,
                                  }
                                })}
                                className={`py-3 rounded-xl font-medium transition-all ${
                                  householdResponses[member.id]?.needs_accommodation === false
                                    ? 'bg-pink-primary text-white'
                                    : 'bg-white border-2 border-pink-primary/20 text-pink-primary hover:border-pink-primary'
                                }`}
                              >
                                No
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {rsvpSettings?.show_notes_field && (
                          <Textarea
                            label="Additional Notes (Optional)"
                            value={householdResponses[member.id]?.rsvp_notes || ''}
                            onChange={(e) => setHouseholdResponses({
                              ...householdResponses,
                              [member.id]: {
                                ...householdResponses[member.id],
                                rsvp_notes: e.target.value,
                              }
                            })}
                            placeholder="Any special requests or messages..."
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* Single Guest RSVP */
              <>
                <div>
                  <label className="block text-sm font-medium text-pink-primary mb-3">
                    Will you be attending? <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('Yes')}
                      className={`py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all ${
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
                      className={`py-3 md:py-4 rounded-xl font-bold text-sm md:text-base transition-all ${
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
                {rsvpSettings?.show_meal_choice && rsvpSettings?.meal_options && (
                  <Select
                    label="Meal Preference"
                    value={mealChoice}
                    onChange={(e) => setMealChoice(e.target.value)}
                    options={[
                      { value: '', label: 'Select a meal option' },
                      ...rsvpSettings.meal_options.split(',').map((option: string) => ({
                        value: option.trim(),
                        label: option.trim(),
                      })),
                    ]}
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

                {/* Shuttle Service */}
                {rsvpSettings?.shuttle_service_available && (
                  <div>
                    <label className="block text-sm font-medium text-pink-primary mb-3">
                      Will you need shuttle service?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setShuttleNeeded(true)}
                        className={`py-3 rounded-xl font-medium transition-all ${
                          shuttleNeeded === true
                            ? 'bg-pink-primary text-white'
                            : 'bg-white border-2 border-pink-primary/20 text-pink-primary hover:border-pink-primary'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setShuttleNeeded(false)}
                        className={`py-3 rounded-xl font-medium transition-all ${
                          shuttleNeeded === false
                            ? 'bg-pink-primary text-white'
                            : 'bg-white border-2 border-pink-primary/20 text-pink-primary hover:border-pink-primary'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}

                {/* Song Request */}
                {rsvpSettings?.show_song_request && (
                  <Input
                    label="Song Request (Optional)"
                    value={songRequest}
                    onChange={(e) => setSongRequest(e.target.value)}
                    placeholder="Suggest a song for the playlist"
                  />
                )}

                {/* Hotel Info Needed */}
                {rsvpSettings?.show_accommodation_question && (
                  <div>
                    <label className="block text-sm font-medium text-pink-primary mb-3">
                      Do you need hotel accommodation information?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setNeedsAccommodation(true)}
                        className={`py-3 rounded-xl font-medium transition-all ${
                          needsAccommodation === true
                            ? 'bg-pink-primary text-white'
                            : 'bg-white border-2 border-pink-primary/20 text-pink-primary hover:border-pink-primary'
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setNeedsAccommodation(false)}
                        className={`py-3 rounded-xl font-medium transition-all ${
                          needsAccommodation === false
                            ? 'bg-pink-primary text-white'
                            : 'bg-white border-2 border-pink-primary/20 text-pink-primary hover:border-pink-primary'
                        }`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Notes - Only for single guests */}
            {!householdMembers.length && rsvpSettings?.show_notes_field && (
              <Textarea
                label="Additional Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests or messages for the couple..."
              />
            )}
              </>
            )}

            {/* Submit */}
            <Button 
              type="submit" 
              fullWidth 
              size="lg" 
              disabled={householdMembers.length > 0 ? isSubmitting : (!rsvpStatus || isSubmitting)}
            >
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
      </div>
    </div>
  )
}
