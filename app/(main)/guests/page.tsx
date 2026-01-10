'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Loader2, Users2, List, LayoutGrid } from 'lucide-react'
import GuestCard from '@/components/guests/GuestCard'
import GuestListItem from '@/components/guests/GuestListItem'
import GuestFormModal from '@/components/guests/GuestFormModal'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { RSVPStatus, Side } from '@/lib/dummyData'
import db from '@/lib/instant'
import { id } from '@instantdb/react'

export default function GuestsPage() {
  const { user, isLoading: authLoading } = db.useAuth()
  
  // Query wedding and guests data
  const { data, isLoading: dataLoading, error } = db.useQuery({
    weddings: {
      guests: {},
    },
  })
  
  const wedding = data?.weddings?.[0]
  const guests = wedding?.guests || []
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<RSVPStatus | 'All'>('All')
  const [filterSide, setFilterSide] = useState<Side | 'All'>('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<any | null>(null)
  const [viewOnly, setViewOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  // Filter guests
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone?.includes(searchQuery)

    const matchesStatus = filterStatus === 'All' || guest.rsvp_status === filterStatus
    const matchesSide = filterSide === 'All' || guest.side === filterSide

    return matchesSearch && matchesStatus && matchesSide
  })

  // Group guests by household
  const groupedGuests = useMemo(() => {
    const households: { [key: string]: any[] } = {}
    const individuals: any[] = []

    filteredGuests.forEach((guest) => {
      if (guest.household_id && guest.household_id.trim()) {
        if (!households[guest.household_id]) {
          households[guest.household_id] = []
        }
        households[guest.household_id].push(guest)
      } else {
        individuals.push(guest)
      }
    })

    return { households, individuals }
  }, [filteredGuests])

  // Get unique household IDs from all guests (not just filtered)
  const existingHouseholds = useMemo(() => {
    const households = new Set<string>()
    guests.forEach((guest) => {
      if (guest.household_id && guest.household_id.trim()) {
        households.add(guest.household_id)
      }
    })
    return Array.from(households).sort()
  }, [guests])

  const handleAddGuest = () => {
    setEditingGuest(null)
    setViewOnly(false)
    setIsModalOpen(true)
  }

  const handleEditGuest = (guest: Guest) => {
    setEditingGuest(guest)
    setViewOnly(false)
    setIsModalOpen(true)
  }

  const handleViewGuest = (guest: Guest) => {
    setEditingGuest(guest)
    setViewOnly(true)
    setIsModalOpen(true)
  }

  const handleDeleteGuest = async (guestId: string) => {
    if (confirm('Are you sure you want to delete this guest?')) {
      try {
        await db.transact([db.tx.guests[guestId].delete()])
      } catch (error) {
        console.error('Error deleting guest:', error)
        alert('Failed to delete guest. Please try again.')
      }
    }
  }

  const handleSaveGuest = async (guestData: any) => {
    if (!wedding?.id) {
      alert('Wedding not found. Please refresh the page.')
      return
    }
    
    try {
      if (editingGuest) {
        // Update existing guest
        await db.transact([
          db.tx.guests[editingGuest.id].update({
            ...guestData,
            last_updated: Date.now(),
          }),
        ])
      } else {
        // Add new guest
        const guestId = id()
        await db.transact([
          db.tx.guests[guestId]
            .update({
              full_name: guestData.full_name || '',
              email: guestData.email || '',
              phone: guestData.phone || '',
              side: guestData.side || 'Unknown',
              plus_one_allowed: guestData.plus_one_allowed || false,
              plus_one_name: guestData.plus_one_name || '',
              invite_sent: guestData.invite_sent || false,
              rsvp_status: guestData.rsvp_status || 'Pending',
              meal_choice: guestData.meal_choice || '',
              dietary_notes: guestData.dietary_notes || '',
              rsvp_notes: guestData.rsvp_notes || '',
              shuttle_needed: guestData.shuttle_needed || false,
              song_request: guestData.song_request || '',
              needs_accommodation: guestData.needs_accommodation || false,
              household_id: guestData.household_id || '',
              address_street: guestData.address_street || '',
              address_city: guestData.address_city || '',
              address_state: guestData.address_state || '',
              address_postal: guestData.address_postal || '',
              address_country: guestData.address_country || '',
              source: 'Manual',
              last_updated: Date.now(),
            })
            .link({ wedding: wedding.id }),
        ])
      }
    } catch (error) {
      console.error('Error saving guest:', error)
      alert('Failed to save guest. Please try again.')
    }
  }

  // Loading state
  if (authLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-pink-primary mx-auto" />
          <p className="text-pink-primary/60">Loading guests...</p>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-4xl shadow-card p-12 text-center">
          <p className="text-pink-primary/70">
            Error loading guests. Please refresh the page.
          </p>
        </div>
      </div>
    )
  }
  
  // No wedding found
  if (!wedding) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-4xl shadow-card p-12 text-center">
          <p className="text-pink-primary/70">
            No wedding found. Please complete onboarding first.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-pink-primary">
            Guest List
          </h1>
          <p className="text-pink-primary/60 mt-1">
            {filteredGuests.length} of {guests.length} guests
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle buttons */}
          <div className="flex bg-white rounded-xl shadow-card p-1 gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-pink-primary text-white'
                  : 'text-pink-primary hover:bg-pink-light'
              }`}
              aria-label="List view"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-pink-primary text-white'
                  : 'text-pink-primary hover:bg-pink-light'
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid size={20} />
            </button>
          </div>
          <Button onClick={handleAddGuest} size="lg">
            <Plus size={20} />
            Add Guest
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-4xl shadow-card p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-primary/40"
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pink-primary/20 focus:border-pink-primary focus:outline-none focus:ring-2 focus:ring-pink-primary/20 text-pink-primary placeholder:text-pink-primary/40"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="RSVP Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as RSVPStatus | 'All')}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' },
              { value: 'Pending', label: 'Pending' },
            ]}
          />

          <Select
            label="Side"
            value={filterSide}
            onChange={(e) => setFilterSide(e.target.value as Side | 'All')}
            options={[
              { value: 'All', label: 'All Sides' },
              { value: 'Bride', label: 'Bride' },
              { value: 'Groom', label: 'Groom' },
              { value: 'Both', label: 'Both' },
              { value: 'Unknown', label: 'Unknown' },
            ]}
          />
        </div>
      </div>

      {/* Guest List */}
      {filteredGuests.length === 0 ? (
        <div className="bg-white rounded-4xl shadow-card p-12 text-center">
          <p className="text-pink-primary/60">
            {searchQuery || filterStatus !== 'All' || filterSide !== 'All'
              ? 'No guests match your filters'
              : 'No guests added yet'}
          </p>
          <Button onClick={handleAddGuest} className="mt-4">
            Add Your First Guest
          </Button>
        </div>
      ) : viewMode === 'list' ? (
        // List View
        <div className="space-y-4">
          {/* Column Headers */}
          <div className="bg-white rounded-2xl shadow-card px-4 py-3">
            <div className="grid grid-cols-[1fr_120px_auto] md:grid-cols-[1fr_120px_140px_140px] gap-4 items-center">
              <span className="text-sm font-bold text-pink-primary">Name</span>
              <span className="hidden md:block text-sm font-bold text-pink-primary text-center">Side</span>
              <span className="text-sm font-bold text-pink-primary text-center">RSVP</span>
              <span className="hidden md:block text-sm font-bold text-pink-primary text-center">Actions</span>
            </div>
          </div>

          {/* All Guests - Flat List */}
          <div className="space-y-2">
            {filteredGuests.map((guest) => (
              <GuestListItem
                key={guest.id}
                guest={guest}
                onView={handleViewGuest}
                onEdit={handleEditGuest}
                onDelete={handleDeleteGuest}
              />
            ))}
          </div>
        </div>
      ) : (
        // Grid View (existing)
        <div className="space-y-6">
          {/* Households */}
          {Object.entries(groupedGuests.households).map(([householdId, householdMembers]) => (
            <div key={householdId} className="bg-white rounded-4xl shadow-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-pink-primary/10 rounded-xl flex items-center justify-center">
                  <Users2 size={20} className="text-pink-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-pink-primary">
                    {householdId}
                  </h3>
                  <p className="text-sm text-pink-primary/60">
                    {householdMembers.length} {householdMembers.length === 1 ? 'member' : 'members'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {householdMembers.map((guest) => (
                  <GuestCard
                    key={guest.id}
                    guest={guest}
                    onEdit={handleEditGuest}
                    onDelete={handleDeleteGuest}
                    onView={handleViewGuest}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Individual Guests */}
          {groupedGuests.individuals.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedGuests.individuals.map((guest) => (
                <GuestCard
                  key={guest.id}
                  guest={guest}
                  onEdit={handleEditGuest}
                  onDelete={handleDeleteGuest}
                  onView={handleViewGuest}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Guest Form Modal */}
      <GuestFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGuest}
        editingGuest={editingGuest}
        existingHouseholds={existingHouseholds}
        viewOnly={viewOnly}
      />
    </div>
  )
}
