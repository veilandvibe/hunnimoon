'use client'

import { useState } from 'react'
import { Plus, Search, Loader2 } from 'lucide-react'
import VendorCard from '@/components/vendors/VendorCard'
import VendorFormModal from '@/components/vendors/VendorFormModal'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { useWedding } from '@/components/providers/WeddingProvider'
import db, { Vendor } from '@/lib/instant'
import { id } from '@instantdb/react'
import toast from 'react-hot-toast'
import { useReadOnly } from '@/lib/use-read-only'

export default function VendorsPage() {
  const { user, isLoading: authLoading } = db.useAuth()
  const { wedding, isLoading: weddingLoading } = useWedding()
  const { isReadOnly } = useReadOnly()
  
  // Query only vendors
  const { data, isLoading: dataLoading, error } = db.useQuery(
    wedding?.id ? {
      vendors: {
        $: {
          where: {
            wedding: wedding.id
          }
        }
      }
    } : null
  )
  
  const vendors = (data?.vendors as Vendor[] | undefined) || []
  
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<any | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; vendorId: string; vendorName: string }>({
    isOpen: false,
    vendorId: '',
    vendorName: ''
  })

  // Filter vendors
  const filteredVendors = vendors.filter((vendor) =>
    String(vendor.vendor_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(vendor.contact_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    String(vendor.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddVendor = () => {
    setEditingVendor(null)
    setIsModalOpen(true)
  }

  const handleEditVendor = (vendor: any) => {
    setEditingVendor(vendor)
    setIsModalOpen(true)
  }

  const handleDeleteVendor = async (vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId)
    setDeleteConfirm({
      isOpen: true,
      vendorId,
      vendorName: String(vendor?.vendor_name || 'this vendor')
    })
  }

  const confirmDelete = async () => {
    try {
      await db.transact([db.tx.vendors[deleteConfirm.vendorId].delete()])
      toast.success('Vendor deleted')
    } catch (error) {
      console.error('Error deleting vendor:', error)
      toast.error('Failed to delete vendor. Please try again.')
    }
  }

  const handleSaveVendor = async (vendorData: any) => {
    if (!wedding?.id) {
      toast.error('Wedding not found. Please refresh the page.')
      return
    }
    
    try {
      if (editingVendor) {
        // Update existing vendor
        await db.transact([
          db.tx.vendors[editingVendor.id].update({
            ...vendorData,
          }),
        ])
        toast.success('Vendor updated!')
      } else {
        // Add new vendor
        const vendorId = id()
        await db.transact([
          db.tx.vendors[vendorId]
            .update({
              vendor_name: vendorData.vendor_name || '',
              contact_name: vendorData.contact_name || '',
              email: vendorData.email || '',
              phone: vendorData.phone || '',
              website: vendorData.website || '',
              notes: vendorData.notes || '',
            })
            .link({ wedding: wedding.id }),
        ])
        toast.success('Vendor added!')
      }
    } catch (error) {
      console.error('Error saving vendor:', error)
      toast.error('Failed to save vendor. Please try again.')
    }
  }

  // Loading state
  if (authLoading || weddingLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-pink-primary mx-auto" />
          <p className="text-pink-primary/60">Loading vendors...</p>
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <Card>
          <div className="text-center py-12">
            <p className="text-pink-primary/70">
              Error loading vendors. Please refresh the page.
            </p>
          </div>
        </Card>
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
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-pink-primary">
            Vendors
          </h1>
          <p className="text-pink-primary/60 mt-1">
            {filteredVendors.length} of {vendors.length} vendors
          </p>
        </div>
        <Button 
          onClick={handleAddVendor} 
          size="lg" 
          type="button" 
          data-tour="add-vendor"
          disabled={isReadOnly}
          title={isReadOnly ? 'Upgrade to add vendors' : undefined}
        >
          <Plus size={20} />
          Add Vendor
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-4xl shadow-card p-4">
        <div className="relative">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-primary/40"
          />
          <input
            type="text"
            placeholder="Search vendors by name, contact, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-pink-primary/20 focus:border-pink-primary focus:outline-none focus:ring-2 focus:ring-pink-primary/20 text-pink-primary placeholder:text-pink-primary/40"
          />
        </div>
      </div>

      {/* Vendor List */}
      {filteredVendors.length === 0 ? (
        <div className="bg-white rounded-4xl shadow-card p-12 text-center" data-tour="vendor-list">
          <p className="text-pink-primary/60">
            {searchQuery
              ? 'No vendors match your search'
              : 'No vendors added yet'}
          </p>
          <Button 
            onClick={handleAddVendor} 
            className="mt-4" 
            type="button"
            disabled={isReadOnly}
            title={isReadOnly ? 'Upgrade to add vendors' : undefined}
          >
            Add Your First Vendor
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-tour="vendor-list">
          {filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onEdit={handleEditVendor}
              onDelete={handleDeleteVendor}
              isReadOnly={isReadOnly}
            />
          ))}
        </div>
      )}

      {/* Vendor Form Modal */}
      <VendorFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVendor}
        editingVendor={editingVendor}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, vendorId: '', vendorName: '' })}
        onConfirm={confirmDelete}
        title="Delete Vendor?"
        message={`This will permanently delete ${deleteConfirm.vendorName}. All vendor information will be lost.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  )
}
