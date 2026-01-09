'use client'

import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Toggle from '../ui/Toggle'
import Button from '../ui/Button'
import { Guest, Side, RSVPStatus } from '@/lib/dummyData'

interface GuestFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (guest: Partial<Guest>) => void
  editingGuest?: Guest | null
}

export default function GuestFormModal({ isOpen, onClose, onSave, editingGuest }: GuestFormModalProps) {
  const [formData, setFormData] = useState<Partial<Guest>>({
    full_name: '',
    email: '',
    phone: '',
    side: 'Unknown',
    rsvp_status: 'Pending',
    plus_one_allowed: false,
    plus_one_name: '',
    invite_sent: false,
    meal_choice: '',
    dietary_notes: '',
    shuttle_needed: false,
    address_street: '',
    address_city: '',
    address_state: '',
    address_postal: '',
    address_country: '',
  })

  useEffect(() => {
    if (editingGuest) {
      setFormData(editingGuest)
    } else {
      // Reset form
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        side: 'Unknown',
        rsvp_status: 'Pending',
        plus_one_allowed: false,
        plus_one_name: '',
        invite_sent: false,
        meal_choice: '',
        dietary_notes: '',
        shuttle_needed: false,
        address_street: '',
        address_city: '',
        address_state: '',
        address_postal: '',
        address_country: '',
      })
    }
  }, [editingGuest, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingGuest ? 'Edit Guest' : 'Add New Guest'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="Jane Doe"
          />

          <Select
            label="Side"
            required
            value={formData.side}
            onChange={(e) => setFormData({ ...formData, side: e.target.value as Side })}
            options={[
              { value: 'Bride', label: 'Bride' },
              { value: 'Groom', label: 'Groom' },
              { value: 'Both', label: 'Both' },
              { value: 'Unknown', label: 'Unknown' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@example.com"
          />

          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="555-0123"
          />
        </div>

        {/* RSVP Details */}
        <div className="pt-4 border-t border-pink-primary/10">
          <h4 className="text-sm font-bold text-pink-primary mb-4">RSVP Details</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="RSVP Status"
              value={formData.rsvp_status}
              onChange={(e) => setFormData({ ...formData, rsvp_status: e.target.value as RSVPStatus })}
              options={[
                { value: 'Pending', label: 'Pending' },
                { value: 'Yes', label: 'Yes' },
                { value: 'No', label: 'No' },
              ]}
            />

            <Input
              label="Meal Choice"
              value={formData.meal_choice}
              onChange={(e) => setFormData({ ...formData, meal_choice: e.target.value })}
              placeholder="Chicken, Fish, Vegetarian..."
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Dietary Restrictions / Notes"
              value={formData.dietary_notes}
              onChange={(e) => setFormData({ ...formData, dietary_notes: e.target.value })}
              placeholder="Any allergies or dietary preferences..."
            />
          </div>
        </div>

        {/* Plus-One */}
        <div className="pt-4 border-t border-pink-primary/10">
          <Toggle
            checked={formData.plus_one_allowed || false}
            onChange={(checked) => setFormData({ ...formData, plus_one_allowed: checked })}
            label="Plus-one allowed"
          />

          {formData.plus_one_allowed && (
            <div className="mt-4">
              <Input
                label="Plus-one Name"
                value={formData.plus_one_name}
                onChange={(e) => setFormData({ ...formData, plus_one_name: e.target.value })}
                placeholder="Partner's name"
              />
            </div>
          )}
        </div>

        {/* Address (Optional) */}
        <details className="pt-4 border-t border-pink-primary/10">
          <summary className="text-sm font-bold text-pink-primary cursor-pointer mb-4">
            Address (Optional)
          </summary>
          
          <div className="space-y-4">
            <Input
              label="Street Address"
              value={formData.address_street}
              onChange={(e) => setFormData({ ...formData, address_street: e.target.value })}
              placeholder="123 Main St"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={formData.address_city}
                onChange={(e) => setFormData({ ...formData, address_city: e.target.value })}
                placeholder="New York"
              />

              <Input
                label="State"
                value={formData.address_state}
                onChange={(e) => setFormData({ ...formData, address_state: e.target.value })}
                placeholder="NY"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                value={formData.address_postal}
                onChange={(e) => setFormData({ ...formData, address_postal: e.target.value })}
                placeholder="10001"
              />

              <Input
                label="Country"
                value={formData.address_country}
                onChange={(e) => setFormData({ ...formData, address_country: e.target.value })}
                placeholder="USA"
              />
            </div>
          </div>
        </details>

        {/* Options */}
        <div className="pt-4 border-t border-pink-primary/10 space-y-3">
          <Toggle
            checked={formData.invite_sent || false}
            onChange={(checked) => setFormData({ ...formData, invite_sent: checked })}
            label="Invitation sent"
          />

          <Toggle
            checked={formData.shuttle_needed || false}
            onChange={(checked) => setFormData({ ...formData, shuttle_needed: checked })}
            label="Needs shuttle service"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-6">
          <Button type="submit" fullWidth>
            {editingGuest ? 'Save Changes' : 'Add Guest'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
