'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Toggle from '@/components/ui/Toggle'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import RSVPChart from '@/components/dashboard/RSVPChart'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { useWedding } from '@/components/providers/WeddingProvider'
import db from '@/lib/instant'
import { id } from '@instantdb/react'
import { Copy, Check, ExternalLink, Users, Settings, ClipboardCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { useReadOnly } from '@/lib/use-read-only'

export default function RSVPManagerPage() {
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const { wedding, isLoading: weddingLoading } = useWedding()
  const { isReadOnly } = useReadOnly()
  
  // Query only guests and rsvpSettings
  const { data, isLoading: dataLoading } = db.useQuery(
    wedding?.id ? {
      guests: {
        $: {
          where: {
            wedding: wedding.id
          }
        }
      },
      rsvpSettings: {
        $: {
          where: {
            wedding: wedding.id
          }
        }
      }
    } : null
  )

  const guests = data?.guests || []
  const rsvpSettings = wedding?.rsvpSettings
  
  // Local state for form settings
  const [showMealChoice, setShowMealChoice] = useState(false)
  const [showDietaryRestrictions, setShowDietaryRestrictions] = useState(true)
  const [requireDietaryRestrictions, setRequireDietaryRestrictions] = useState(false)
  const [showShuttleService, setShowShuttleService] = useState(false)
  const [showSongRequest, setShowSongRequest] = useState(false)
  const [showAccommodationQuestion, setShowAccommodationQuestion] = useState(false)
  const [showNotesField, setShowNotesField] = useState(true)
  const [mealOptions, setMealOptions] = useState('Chicken, Fish, Vegetarian, Vegan')
  const [customMessage, setCustomMessage] = useState('Thank you for RSVPing! We can\'t wait to celebrate with you. Please arrive 15 minutes early.')

  // Sync local state with rsvpSettings when data loads
  useEffect(() => {
    if (rsvpSettings) {
      setShowMealChoice(rsvpSettings.show_meal_choice ?? false)
      setShowDietaryRestrictions(rsvpSettings.show_dietary_restrictions ?? true)
      setRequireDietaryRestrictions(rsvpSettings.require_dietary_restrictions ?? false)
      setShowShuttleService(rsvpSettings.shuttle_service_available ?? false)
      setShowSongRequest(rsvpSettings.show_song_request ?? false)
      setShowAccommodationQuestion(rsvpSettings.show_accommodation_question ?? false)
      setShowNotesField(rsvpSettings.show_notes_field ?? true)
      setMealOptions(rsvpSettings.meal_options ?? 'Chicken, Fish, Vegetarian, Vegan')
      setCustomMessage(rsvpSettings.custom_message ?? 'Thank you for RSVPing! We can\'t wait to celebrate with you. Please arrive 15 minutes early.')
    }
  }, [rsvpSettings])
  
  const rsvpUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/rsvp/${wedding?.wedding_slug || ''}`

  // Calculate metrics
  const totalGuests = guests.length
  const yesCount = guests.filter((g: any) => g.rsvp_status === 'Yes').length
  const noCount = guests.filter((g: any) => g.rsvp_status === 'No').length
  const pendingCount = guests.filter((g: any) => g.rsvp_status === 'Pending').length

  // Get recent RSVPs (last 10, sorted by last_updated)
  const recentRSVPs = [...guests]
    .filter((g: any) => g.rsvp_status !== 'Pending')
    .sort((a: any, b: any) => (b.last_updated || 0) - (a.last_updated || 0))
    .slice(0, 10)

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(rsvpUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('RSVP link copied!')
  }

  const handleOpenRSVP = () => {
    window.open(rsvpUrl, '_blank')
  }

  const handleSaveSettings = async () => {
    if (!wedding) return

    setSaving(true)
    setSaveSuccess(false)
    
    try {
      console.log('Starting save...', { wedding: wedding.id, rsvpSettings })
      
      if (rsvpSettings) {
        // Update existing settings
        console.log('Updating existing settings:', rsvpSettings.id)
        await db.transact([
          db.tx.rsvpSettings[rsvpSettings.id].update({
            show_meal_choice: showMealChoice,
            show_dietary_restrictions: showDietaryRestrictions,
            require_dietary_restrictions: requireDietaryRestrictions,
            shuttle_service_available: showShuttleService,
            show_song_request: showSongRequest,
            show_accommodation_question: showAccommodationQuestion,
            show_notes_field: showNotesField,
            meal_options: mealOptions,
            custom_message: customMessage,
          }),
        ])
        console.log('Settings updated successfully')
      } else {
        // Create new settings if they don't exist
        const settingsId = id()
        console.log('Creating new settings:', settingsId)
        await db.transact([
          db.tx.rsvpSettings[settingsId]
            .update({
              show_meal_choice: showMealChoice,
              show_dietary_restrictions: showDietaryRestrictions,
              require_dietary_restrictions: requireDietaryRestrictions,
              shuttle_service_available: showShuttleService,
              show_song_request: showSongRequest,
              show_accommodation_question: showAccommodationQuestion,
              show_notes_field: showNotesField,
              meal_options: mealOptions,
              custom_message: customMessage,
            })
            .link({ wedding: wedding.id }),
        ])
        console.log('Settings created successfully')
      }
      
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
      toast.success('RSVP settings saved!')
    } catch (error) {
      console.error('Error saving RSVP settings:', error)
      toast.error('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Yes':
        return 'success'
      case 'No':
        return 'danger'
      default:
        return 'warning'
    }
  }

  // Loading state
  if (weddingLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // No wedding found
  if (!wedding) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <p className="text-pink-primary/70">
              No wedding found. Please complete onboarding first.
            </p>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-pink-primary">
          RSVP Manager
        </h1>
        <p className="text-pink-primary/60 mt-1">
          Share your RSVP link and track responses
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-tour="rsvp-metrics">
        <Card className="text-center">
          <div className="text-3xl md:text-4xl font-black text-pink-primary mb-2">
            {totalGuests}
          </div>
          <div className="text-xs md:text-sm text-pink-primary/60">Total Guests</div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl md:text-4xl font-black text-green-600 mb-2">
            {yesCount}
          </div>
          <div className="text-xs md:text-sm text-pink-primary/60">Confirmed</div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl md:text-4xl font-black text-red-600 mb-2">
            {noCount}
          </div>
          <div className="text-xs md:text-sm text-pink-primary/60">Declined</div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl md:text-4xl font-black text-amber-600 mb-2">
            {pendingCount}
          </div>
          <div className="text-xs md:text-sm text-pink-primary/60">Pending</div>
        </Card>
      </div>

      {/* RSVP Chart & Recent RSVPs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div data-tour="rsvp-chart">
          <RSVPChart
            yesCount={yesCount}
            noCount={noCount}
            pendingCount={pendingCount}
          />
        </div>

        {/* Recent RSVPs */}
        <Card data-tour="recent-rsvps">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-primary/10 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-pink-primary" />
              </div>
              <h2 className="text-xl font-black text-pink-primary">
                Recent RSVPs
              </h2>
            </div>

            {recentRSVPs.length === 0 ? (
              <p className="text-center text-pink-primary/60 py-8">
                No RSVPs yet. Share your link to get started!
              </p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {recentRSVPs.map((guest: any) => (
                  <div
                    key={guest.id}
                    className="flex items-center justify-between p-3 bg-pink-light rounded-xl"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-pink-primary truncate">
                        {guest.full_name}
                      </p>
                      {guest.plus_one_name && (
                        <p className="text-xs text-pink-primary/60">
                          + {guest.plus_one_name}
                        </p>
                      )}
                      <p className="text-xs text-pink-primary/50">
                        {guest.last_updated ? new Date(guest.last_updated).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(guest.rsvp_status)}>
                      {guest.rsvp_status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* RSVP Link & How It Works Section */}
      <div className="space-y-6" data-tour="rsvp-link-section">
        {/* RSVP Link Card */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-pink-primary">
                Your RSVP Link
              </h2>
              <Button onClick={handleOpenRSVP} variant="outline" size="sm">
                <ExternalLink size={16} />
                Preview
              </Button>
            </div>

            <p className="text-sm text-pink-primary/70">
              Share this link via email, text, social media, or include it on your wedding invitations
            </p>

            <div className="p-4 bg-pink-light rounded-xl">
              <code className="text-sm text-pink-primary break-all">
                {rsvpUrl}
              </code>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleCopyUrl} fullWidth>
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied to Clipboard!' : 'Copy Link'}
              </Button>
            </div>
          </div>
        </Card>

        {/* How It Works Info Card */}
        <div 
          className="bg-gradient-to-br from-pink-primary/5 to-pink-secondary/5 rounded-xl p-4 border-2 border-pink-primary/20"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <ClipboardCheck size={16} className="text-pink-primary" />
            </div>
            <div>
              <h3 className="font-bold text-pink-primary mb-1">How RSVP Works</h3>
              <p className="text-sm text-pink-primary/70">
                When you add guests to your guest list, they can search for their name on your custom RSVP form. 
                Their responses automatically update in your system - no manual entry needed! Household members can RSVP together too.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RSVP Form Settings Card */}
      <Card data-tour="rsvp-settings">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-primary/10 rounded-xl flex items-center justify-center">
              <Settings size={20} className="text-pink-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black text-pink-primary">
                RSVP Form Settings
              </h2>
              <p className="text-sm text-pink-primary/60">
                Customize what information you collect from guests
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border-b border-pink-primary/10 pb-4">
              <h3 className="text-sm font-bold text-pink-primary mb-3">
                Form Fields
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-pink-primary">
                      Show meal preference
                    </label>
                    <p className="text-xs text-pink-primary/60 mt-0.5">
                      Let guests select their meal choice
                    </p>
                  </div>
                  <Toggle
                    checked={showMealChoice}
                    onChange={setShowMealChoice}
                    disabled={isReadOnly}
                  />
                </div>

                {showMealChoice && (
                  <div className="ml-4 pl-4 border-l-2 border-pink-primary/10">
                    <label className="text-xs font-medium text-pink-primary block mb-2">
                      Meal Options (comma-separated)
                    </label>
                    <Input
                      value={mealOptions}
                      onChange={(e) => setMealOptions(e.target.value)}
                      placeholder="Chicken, Fish, Vegetarian, Vegan"
                      disabled={isReadOnly}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-pink-primary">
                      Show dietary restrictions
                    </label>
                    <p className="text-xs text-pink-primary/60 mt-0.5">
                      Allow guests to note dietary needs
                    </p>
                  </div>
                  <Toggle
                    checked={showDietaryRestrictions}
                    onChange={setShowDietaryRestrictions}
                    disabled={isReadOnly}
                  />
                </div>

                {showDietaryRestrictions && (
                  <div className="ml-4 pl-4 border-l-2 border-pink-primary/10">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-pink-primary">
                        Make dietary restrictions required
                      </label>
                      <Toggle
                        checked={requireDietaryRestrictions}
                        onChange={setRequireDietaryRestrictions}
                        disabled={isReadOnly}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-pink-primary">
                      Show shuttle service question
                    </label>
                    <p className="text-xs text-pink-primary/60 mt-0.5">
                      Ask if guests need shuttle service
                    </p>
                  </div>
                  <Toggle
                    checked={showShuttleService}
                    onChange={setShowShuttleService}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-pink-primary">
                      Show song request field
                    </label>
                    <p className="text-xs text-pink-primary/60 mt-0.5">
                      Let guests suggest songs for the playlist
                    </p>
                  </div>
                  <Toggle
                    checked={showSongRequest}
                    onChange={setShowSongRequest}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-pink-primary">
                      Show hotel info needed
                    </label>
                    <p className="text-xs text-pink-primary/60 mt-0.5">
                      Ask if guests need accommodation info
                    </p>
                  </div>
                  <Toggle
                    checked={showAccommodationQuestion}
                    onChange={setShowAccommodationQuestion}
                    disabled={isReadOnly}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-pink-primary">
                      Show additional notes field
                    </label>
                    <p className="text-xs text-pink-primary/60 mt-0.5">
                      Let guests leave general notes or questions
                    </p>
                  </div>
                  <Toggle
                    checked={showNotesField}
                    onChange={setShowNotesField}
                    disabled={isReadOnly}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-pink-primary mb-3">
                Post-Submission Message
              </h3>
              <p className="text-xs text-pink-primary/60 mb-3">
                This message will be shown to guests after they submit their RSVP
              </p>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
                placeholder="Thank you for RSVPing! We can't wait to celebrate with you."
                disabled={isReadOnly}
              />
            </div>

            <Button onClick={handleSaveSettings} disabled={saving || isReadOnly} fullWidth title={isReadOnly ? 'Upgrade to save settings' : undefined}>
              {saving ? (
                'Saving...'
              ) : saveSuccess ? (
                <>
                  <Check size={18} />
                  Settings Saved!
                </>
              ) : (
                'Save Settings'
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
