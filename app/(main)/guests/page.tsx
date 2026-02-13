'use client'

import { useState, useMemo } from 'react'
import { Search, Plus, Loader2, Users2, List, LayoutGrid, Upload, Download } from 'lucide-react'
import GuestCard from '@/components/guests/GuestCard'
import GuestListItem from '@/components/guests/GuestListItem'
import GuestFormModal from '@/components/guests/GuestFormModal'
import GuestImportModal from '@/components/guests/GuestImportModal'
import BulkActionBar from '@/components/guests/BulkActionBar'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { RSVPStatus, Side } from '@/lib/dummyData'
import { useWedding } from '@/components/providers/WeddingProvider'
import db, { Guest } from '@/lib/instant'
import { getSideLabel } from '@/lib/sideLabels'
import { id } from '@instantdb/react'
import { ParsedGuest } from '@/lib/guestParser'
import toast from 'react-hot-toast'
import { useReadOnly } from '@/lib/use-read-only'

export default function GuestsPage() {
  const { user, isLoading: authLoading } = db.useAuth()
  const { wedding, isLoading: weddingLoading } = useWedding()
  const { isReadOnly } = useReadOnly()
  
  // Query only guests data
  const { data, isLoading: dataLoading, error } = db.useQuery(
    wedding?.id ? {
      guests: {
        $: {
          where: {
            wedding: wedding.id
          }
        }
      }
    } : null
  )
  
  const guests = (data?.guests as Guest[] | undefined) || []
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<RSVPStatus | 'All'>('All')
  const [filterSide, setFilterSide] = useState<Side | 'All' | 'Individual'>('All')
  const [filterHousehold, setFilterHousehold] = useState<string>('All')
  const [filterPlusOne, setFilterPlusOne] = useState<'All' | 'With' | 'Without'>('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<any | null>(null)
  const [viewOnly, setViewOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; guestId: string; guestName: string }>({
    isOpen: false,
    guestId: '',
    guestName: ''
  })
  
  // Multi-select state (desktop only)
  const [selectedGuestIds, setSelectedGuestIds] = useState<Set<string>>(new Set())
  const [isSelectMode, setIsSelectMode] = useState(false)
  const [hoveredGuestId, setHoveredGuestId] = useState<string | null>(null)

  // Filter guests
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      String(guest.full_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(guest.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(guest.phone || '').includes(searchQuery)

    const matchesStatus = filterStatus === 'All' || guest.rsvp_status === filterStatus
    
    // Side filter
    let matchesSide = true
    if (filterSide !== 'All') {
      if (filterSide === 'Individual') {
        matchesSide = !guest.household_id || guest.household_id.trim() === ''
      } else {
        matchesSide = guest.side === filterSide
      }
    }
    
    // Household filter
    const matchesHousehold = 
      filterHousehold === 'All' || 
      (filterHousehold === 'Individual' && (!guest.household_id || guest.household_id.trim() === '')) ||
      guest.household_id === filterHousehold
    
    // Plus-one filter
    let matchesPlusOne = true
    if (filterPlusOne === 'With') {
      matchesPlusOne = guest.plus_one_allowed || !!guest.plus_one_name
    } else if (filterPlusOne === 'Without') {
      matchesPlusOne = !guest.plus_one_allowed && !guest.plus_one_name
    }

    return matchesSearch && matchesStatus && matchesSide && matchesHousehold && matchesPlusOne
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

  const handleEditGuest = (guest: any) => {
    setEditingGuest(guest)
    setViewOnly(false)
    setIsModalOpen(true)
  }

  const handleViewGuest = (guest: any) => {
    setEditingGuest(guest)
    setViewOnly(true)
    setIsModalOpen(true)
  }

  const handleDeleteGuest = async (guestId: string) => {
    const guest = guests.find(g => g.id === guestId)
    setDeleteConfirm({
      isOpen: true,
      guestId,
      guestName: guest?.full_name || 'this guest'
    })
  }

  const confirmDelete = async () => {
    try {
      if (deleteConfirm.guestId === 'bulk') {
        await confirmBulkDelete()
      } else {
        await db.transact([db.tx.guests[deleteConfirm.guestId].delete()])
        toast.success('Guest deleted')
      }
    } catch (error) {
      console.error('Error deleting guest:', error)
      toast.error('Failed to delete guest. Please try again.')
    }
  }

  // Multi-select handlers
  const toggleGuestSelection = (guestId: string) => {
    const newSelection = new Set(selectedGuestIds)
    if (newSelection.has(guestId)) {
      newSelection.delete(guestId)
    } else {
      newSelection.add(guestId)
    }
    setSelectedGuestIds(newSelection)
    setIsSelectMode(newSelection.size > 0)
  }

  const cancelSelection = () => {
    setSelectedGuestIds(new Set())
    setIsSelectMode(false)
  }

  const selectAll = () => {
    const allGuestIds = new Set(filteredGuests.map(g => g.id))
    setSelectedGuestIds(allGuestIds)
    setIsSelectMode(true)
  }

  const handleSelectMultiple = (guestId: string) => {
    const newSelection = new Set<string>([guestId])
    setSelectedGuestIds(newSelection)
    setIsSelectMode(true)
  }

  const handleSaveGuest = async (guestData: any) => {
    if (!wedding?.id) {
      toast.error('Wedding not found. Please refresh the page.')
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
        toast.success('Guest updated!')
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
        toast.success('Guest added!')
      }
    } catch (error) {
      console.error('Error saving guest:', error)
      toast.error('Failed to save guest. Please try again.')
    }
  }

  const handleImportGuests = async (importedGuests: ParsedGuest[], onProgress?: (current: number, total: number) => void) => {
    if (!wedding?.id) {
      toast.error('Wedding not found. Please refresh the page.')
      return
    }

    try {
      // Use very small batches for production reliability
      const BATCH_SIZE = 10 // Reduced to 10 for better reliability
      const MAX_RETRIES = 2 // Retry failed batches
      const totalBatches = Math.ceil(importedGuests.length / BATCH_SIZE)
      let successfulImports = 0
      
      for (let i = 0; i < totalBatches; i++) {
        const start = i * BATCH_SIZE
        const end = Math.min(start + BATCH_SIZE, importedGuests.length)
        const batch = importedGuests.slice(start, end)
        
        // Create transactions for this batch
        const transactions = batch.map(guest => {
          const guestId = id()
          return db.tx.guests[guestId]
            .update({
              full_name: guest.name,
              email: guest.email || '',
              phone: guest.phone || '',
              side: guest.side || 'Unknown',
              household_id: guest.household || '',
              plus_one_allowed: false,
              plus_one_name: '',
              invite_sent: false,
              rsvp_status: 'Pending',
              meal_choice: '',
              dietary_notes: '',
              rsvp_notes: '',
              shuttle_needed: false,
              song_request: '',
              needs_accommodation: false,
              address_street: '',
              address_city: '',
              address_state: '',
              address_postal: '',
              address_country: '',
              source: 'Import',
              last_updated: Date.now(),
            })
            .link({ wedding: wedding.id })
        })

        // Execute batch transaction with retry logic
        let retryCount = 0
        let batchSuccess = false
        
        while (retryCount <= MAX_RETRIES && !batchSuccess) {
          try {
            await db.transact(transactions)
            successfulImports += batch.length
            batchSuccess = true
            
            // Update progress
            if (onProgress) {
              onProgress(successfulImports, importedGuests.length)
            }
          } catch (batchError) {
            retryCount++
            console.error(`Error in batch ${i + 1} (attempt ${retryCount}):`, batchError)
            
            if (retryCount > MAX_RETRIES) {
              // If all retries failed, show partial success message
              if (successfulImports > 0) {
                toast.error(`Imported ${successfulImports} of ${importedGuests.length} guests. Batch ${i + 1} failed after ${MAX_RETRIES} retries. Please try importing the remaining guests again.`)
                return // Exit early with partial success
              } else {
                throw new Error(`Failed to import batch ${i + 1} of ${totalBatches} after ${MAX_RETRIES} retries. Please try again with a smaller number of guests.`)
              }
            }
            
            // Wait longer before retry
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
        
        // Longer delay between batches (500ms for production reliability)
        if (i < totalBatches - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
      
      toast.success(`${importedGuests.length} guest${importedGuests.length === 1 ? '' : 's'} imported successfully!`)
    } catch (error) {
      console.error('Error importing guests:', error)
      throw error // Re-throw to be handled by modal
    }
  }

  // Bulk action handlers
  const handleBulkDelete = async () => {
    const count = selectedGuestIds.size
    setDeleteConfirm({
      isOpen: true,
      guestId: 'bulk',
      guestName: `${count} guest${count !== 1 ? 's' : ''}`
    })
  }

  const confirmBulkDelete = async () => {
    const count = selectedGuestIds.size
    try {
      const deleteTransactions = Array.from(selectedGuestIds).map(id =>
        db.tx.guests[id].delete()
      )
      await db.transact(deleteTransactions)
      toast.success(`${count} guest${count !== 1 ? 's' : ''} deleted successfully`)
      cancelSelection()
    } catch (error) {
      console.error('Error deleting guests:', error)
      toast.error('Failed to delete guests. Please try again.')
    }
  }

  const handleBulkMarkInvited = async (invited: boolean) => {
    const count = selectedGuestIds.size
    try {
      const updateTransactions = Array.from(selectedGuestIds).map(id =>
        db.tx.guests[id].update({ invite_sent: invited })
      )
      await db.transact(updateTransactions)
      toast.success(`${count} guest${count !== 1 ? 's' : ''} marked as ${invited ? 'invited' : 'not invited'}`)
      cancelSelection()
    } catch (error) {
      console.error('Error updating guests:', error)
      toast.error('Failed to update guests. Please try again.')
    }
  }

  const handleBulkChangeSide = async (side: 'Bride' | 'Groom' | 'Both' | 'Unknown') => {
    const count = selectedGuestIds.size
    try {
      const updateTransactions = Array.from(selectedGuestIds).map(id =>
        db.tx.guests[id].update({ side })
      )
      await db.transact(updateTransactions)
      toast.success(`${count} guest${count !== 1 ? 's' : ''} updated to ${side} side`)
      cancelSelection()
    } catch (error) {
      console.error('Error updating guests:', error)
      toast.error('Failed to update guests. Please try again.')
    }
  }

  const handleBulkChangeRSVPStatus = async (rsvp_status: 'Pending' | 'Yes' | 'No') => {
    const count = selectedGuestIds.size
    try {
      const updateTransactions = Array.from(selectedGuestIds).map(id =>
        db.tx.guests[id].update({ rsvp_status })
      )
      await db.transact(updateTransactions)
      const statusLabel = rsvp_status === 'Pending' ? 'Pending' : rsvp_status === 'Yes' ? 'Attending' : 'Not Attending'
      toast.success(`${count} guest${count !== 1 ? 's' : ''} updated to ${statusLabel}`)
      cancelSelection()
    } catch (error) {
      console.error('Error updating guests:', error)
      toast.error('Failed to update guests. Please try again.')
    }
  }

  const handleExportGuests = () => {
    if (!wedding) return

    // Convert guests to CSV with ALL fields
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Side',
      'RSVP Status',
      'Household ID',
      'Plus One Allowed',
      'Plus One Name',
      'Invite Sent',
      'Meal Choice',
      'Dietary Notes',
      'Shuttle Needed',
      'Song Request',
      'Needs Accommodation',
      'RSVP Notes',
      'Address Street',
      'Address City',
      'Address State',
      'Address Postal Code',
      'Address Country'
    ]
    
    const rows = guests.map(g => [
      g.full_name || '',
      g.email || '',
      g.phone || '',
      g.side || 'Unknown',
      g.rsvp_status || 'Pending',
      g.household_id || '',
      g.plus_one_allowed ? 'Yes' : 'No',
      g.plus_one_name || '',
      g.invite_sent ? 'Yes' : 'No',
      g.meal_choice || '',
      g.dietary_notes || '',
      g.shuttle_needed ? 'Yes' : 'No',
      g.song_request || '',
      g.needs_accommodation ? 'Yes' : 'No',
      g.rsvp_notes || '',
      g.address_street || '',
      g.address_city || '',
      g.address_state || '',
      g.address_postal || '',
      g.address_country || ''
    ])
    
    // Generate CSV string
    const csv = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
    
    // Download file
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${wedding.partner1_name}-${wedding.partner2_name}-guests.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadTemplate = () => {
    // Create template CSV with example data
    const headers = ['Name', 'Email', 'Phone', 'Side', 'Household ID']
    const exampleRows = [
      ['John Doe', 'john@example.com', '555-0101', 'Bride', 'Johnson Family'],
      ['Jane Smith', 'jane@example.com', '555-0102', 'Groom', 'Smith Family'],
      ['Bob Johnson', 'bob@example.com', '555-0103', 'Groom', 'Johnson Family']
    ]
    
    // Generate CSV string
    const csv = [headers, ...exampleRows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')
    
    // Download file
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'guest-list-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Loading state
  if (authLoading || weddingLoading || dataLoading) {
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
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-2 flex-wrap">
          {/* View toggle buttons */}
          <div className="flex bg-white rounded-xl shadow-card p-1 gap-1" data-tour="view-toggle">
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
          
          {/* Action buttons - all on same row */}
          <div className="flex items-center gap-2 w-full md:w-auto" data-tour="add-guest">
            {/* Import button - smaller mobile padding, fixed width to match Export */}
            <Button 
              onClick={() => setIsImportModalOpen(true)} 
              variant="outline" 
              className="w-[100px] md:flex-none h-[44px] text-sm md:text-base px-2 md:px-4"
              disabled={isReadOnly}
              title={isReadOnly ? 'Upgrade to add guests' : undefined}
            >
              <Upload size={20} className="flex-shrink-0" />
              Import
            </Button>
            
            {/* Export button - smaller mobile padding, fixed width to match Import */}
            <Button 
              onClick={handleExportGuests} 
              variant="outline" 
              className="w-[100px] md:flex-none h-[44px] text-sm md:text-base px-2 md:px-4"
              disabled={guests.length === 0}
            >
              <Download size={20} className="flex-shrink-0" />
              Export
            </Button>
            
            {/* Add Guest button - smaller mobile padding, slightly wider to prevent text wrap */}
            <Button 
              onClick={handleAddGuest} 
              className="flex-1 md:flex-none h-[44px] text-sm md:text-base px-2 md:px-4 whitespace-nowrap"
              disabled={isReadOnly}
              title={isReadOnly ? 'Upgrade to add guests' : undefined}
            >
              <Plus size={20} className="flex-shrink-0" />
              Add Guest
            </Button>
          </div>
        </div>
      </div>

      {/* Household Info - Hidden but available for tour */}
      {/* Search & Filters */}
      <div className="bg-white rounded-4xl shadow-card p-4 space-y-4" data-tour="search-filter">
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
            label="Sort By"
            value={filterSide !== 'All' && filterSide !== 'Individual' ? `side-${filterSide}` : 
                   filterHousehold !== 'All' ? `household-${filterHousehold}` :
                   filterPlusOne !== 'All' ? `plusone-${filterPlusOne}` : 'All'}
            onChange={(e) => {
              const value = e.target.value
              // Reset all filters first
              setFilterSide('All')
              setFilterHousehold('All')
              setFilterPlusOne('All')
              
              if (value === 'All') {
                // All filters already reset
              } else if (value.startsWith('side-')) {
                setFilterSide(value.replace('side-', '') as Side)
              } else if (value.startsWith('household-')) {
                setFilterHousehold(value.replace('household-', ''))
              } else if (value.startsWith('plusone-')) {
                setFilterPlusOne(value.replace('plusone-', '') as 'With' | 'Without')
              }
            }}
            groupedOptions={[
              {
                label: '━━━━━ SIDE ━━━━━',
                options: [
                  { value: 'All', label: 'All Guests' },
                  { value: 'side-Bride', label: getSideLabel('Bride', wedding) },
                  { value: 'side-Groom', label: getSideLabel('Groom', wedding) },
                  { value: 'side-Both', label: 'Both Sides' },
                  { value: 'side-Unknown', label: 'Unknown Side' },
                ]
              },
              {
                label: '━━━━━ HOUSEHOLD ━━━━━',
                options: [
                  { value: 'household-Individual', label: 'Individual Guests Only' },
                  ...existingHouseholds.map(household => ({
                    value: `household-${household}`,
                    label: household
                  }))
                ]
              },
              {
                label: '━━━━━ PLUS-ONE ━━━━━',
                options: [
                  { value: 'plusone-With', label: 'With Plus-One' },
                  { value: 'plusone-Without', label: 'Without Plus-One' },
                ]
              }
            ]}
          />
        </div>
      </div>

      {/* Bulk Action Bar */}
      {isSelectMode && (
        <div className="md:sticky md:top-[56px] md:z-30 sticky top-[56px] z-30">
          <BulkActionBar
            selectedCount={selectedGuestIds.size}
            totalCount={filteredGuests.length}
            onSelectAll={selectAll}
            onDelete={handleBulkDelete}
            onMarkInvited={() => handleBulkMarkInvited(true)}
            onMarkNotInvited={() => handleBulkMarkInvited(false)}
            onChangeSide={handleBulkChangeSide}
            onChangeRSVPStatus={handleBulkChangeRSVPStatus}
            onCancel={cancelSelection}
            wedding={wedding}
            isReadOnly={isReadOnly}
          />
        </div>
      )}

      {/* Guest List */}
      {filteredGuests.length === 0 ? (
        <div className="bg-white rounded-4xl shadow-card p-12 text-center" data-tour="guest-list">
          <p className="text-pink-primary/60">
            {searchQuery || filterStatus !== 'All' || filterSide !== 'All'
              ? 'No guests match your filters'
              : 'No guests added yet'}
          </p>
          <Button 
            onClick={handleAddGuest} 
            className="mt-4"
            disabled={isReadOnly}
            title={isReadOnly ? 'Upgrade to add guests' : undefined}
          >
            Add Your First Guest
          </Button>
        </div>
      ) : viewMode === 'list' ? (
        // List View
        <div className="space-y-4" data-tour="guest-list">
          {/* Column Headers */}
          <div className="bg-white rounded-2xl shadow-card px-4 py-3">
            <div className="grid grid-cols-[1fr_90px_40px] md:grid-cols-[1fr_120px_140px_140px] gap-3 items-center">
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
                wedding={wedding}
                isSelected={selectedGuestIds.has(guest.id)}
                isHovered={hoveredGuestId === guest.id}
                isSelectMode={isSelectMode}
                onToggleSelect={toggleGuestSelection}
                onHover={setHoveredGuestId}
                onSelectMultiple={handleSelectMultiple}
                isReadOnly={isReadOnly}
              />
            ))}
          </div>
        </div>
      ) : (
        // Grid View (existing)
        <div className="space-y-6" data-tour="guest-list">
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
                    isSelected={selectedGuestIds.has(guest.id)}
                    isHovered={hoveredGuestId === guest.id}
                    isSelectMode={isSelectMode}
                    onToggleSelect={toggleGuestSelection}
                    onHover={setHoveredGuestId}
                    isReadOnly={isReadOnly}
                    wedding={wedding}
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
                  isReadOnly={isReadOnly}
                  onView={handleViewGuest}
                  isSelected={selectedGuestIds.has(guest.id)}
                  isHovered={hoveredGuestId === guest.id}
                  isSelectMode={isSelectMode}
                  onToggleSelect={toggleGuestSelection}
                  onHover={setHoveredGuestId}
                  wedding={wedding}
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
        wedding={wedding}
      />

      {/* Guest Import Modal */}
      <GuestImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportGuests}
        existingHouseholds={existingHouseholds}
        onDownloadTemplate={handleDownloadTemplate}
        wedding={wedding}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, guestId: '', guestName: '' })}
        onConfirm={confirmDelete}
        title="Delete Guest?"
        message={`This will permanently delete ${deleteConfirm.guestName}. This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}
