'use client'

import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import Button from '../ui/Button'
import { Vendor } from '@/lib/dummyData'

interface VendorFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vendor: Partial<Vendor>) => void
  editingVendor?: Vendor | null
}

export default function VendorFormModal({ isOpen, onClose, onSave, editingVendor }: VendorFormModalProps) {
  const [formData, setFormData] = useState<Partial<Vendor>>({
    vendor_name: '',
    contact_name: '',
    email: '',
    phone: '',
    website: '',
    notes: '',
  })

  useEffect(() => {
    if (editingVendor) {
      setFormData(editingVendor)
    } else {
      setFormData({
        vendor_name: '',
        contact_name: '',
        email: '',
        phone: '',
        website: '',
        notes: '',
      })
    }
  }, [editingVendor, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Vendor/Company Name"
          required
          value={formData.vendor_name || ''}
          onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
          placeholder="Perfect Photography Studio"
        />

        <Input
          label="Contact Person"
          value={formData.contact_name || ''}
          onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
          placeholder="Jane Smith"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="contact@vendor.com"
          />

          <Input
            label="Phone"
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="555-0123"
          />
        </div>

        <Input
          label="Website"
          type="text"
          value={formData.website || ''}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          placeholder="vendor.com"
        />

        <Textarea
          label="Notes"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Contract details, pricing, special notes..."
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {editingVendor ? 'Save Changes' : 'Add Vendor'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
