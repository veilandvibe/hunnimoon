'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import VendorCard from '@/components/vendors/VendorCard'
import VendorFormModal from '@/components/vendors/VendorFormModal'
import Button from '@/components/ui/Button'
import { dummyVendors, Vendor } from '@/lib/dummyData'

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(dummyVendors)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)

  // Filter vendors
  const filteredVendors = vendors.filter((vendor) =>
    vendor.vendor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddVendor = () => {
    setEditingVendor(null)
    setIsModalOpen(true)
  }

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setIsModalOpen(true)
  }

  const handleDeleteVendor = (vendorId: string) => {
    if (confirm('Are you sure you want to delete this vendor?')) {
      setVendors(vendors.filter((v) => v.id !== vendorId))
    }
  }

  const handleSaveVendor = (vendorData: Partial<Vendor>) => {
    if (editingVendor) {
      // Update existing vendor
      setVendors(
        vendors.map((v) =>
          v.id === editingVendor.id ? { ...v, ...vendorData } : v
        )
      )
    } else {
      // Add new vendor
      const newVendor: Vendor = {
        id: `vendor-${Date.now()}`,
        wedding_id: 'wedding-1',
        vendor_name: vendorData.vendor_name || '',
        contact_name: vendorData.contact_name || '',
        email: vendorData.email || '',
        phone: vendorData.phone || '',
        website: vendorData.website || '',
        notes: vendorData.notes || '',
      }
      setVendors([...vendors, newVendor])
    }
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
        <Button onClick={handleAddVendor} size="lg">
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
        <div className="bg-white rounded-4xl shadow-card p-12 text-center">
          <p className="text-pink-primary/60">
            {searchQuery
              ? 'No vendors match your search'
              : 'No vendors added yet'}
          </p>
          <Button onClick={handleAddVendor} className="mt-4">
            Add Your First Vendor
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              onEdit={handleEditVendor}
              onDelete={handleDeleteVendor}
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
    </div>
  )
}
