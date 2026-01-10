'use client'

import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import Toggle from '../ui/Toggle'
import Button from '../ui/Button'
import { Side, RSVPStatus } from '@/lib/dummyData'

interface GuestFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (guest: any) => void
  editingGuest?: any | null
  existingHouseholds?: string[]
  viewOnly?: boolean
}

export default function GuestFormModal({ isOpen, onClose, onSave, editingGuest, existingHouseholds = [], viewOnly = false }: GuestFormModalProps) {
  const [formData, setFormData] = useState<any>({
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
    rsvp_notes: '',
    shuttle_needed: false,
    song_request: '',
    needs_accommodation: false,
    household_id: '',
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
        rsvp_notes: '',
        shuttle_needed: false,
        song_request: '',
        needs_accommodation: false,
        household_id: '',
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
      title={viewOnly ? 'Guest Details' : (editingGuest ? 'Edit Guest' : 'Add New Guest')}
      size="lg"
    >
      {viewOnly ? (
        // View-only mode - Clean, condensed display
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-pink-primary/60 mb-1">Full Name</div>
                <div className="text-base font-semibold text-pink-primary">{formData.full_name || '-'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-pink-primary/60 mb-1">Side</div>
                <div className="text-base text-pink-primary">{formData.side || '-'}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-pink-primary/60 mb-1">Email</div>
                <div className="text-base text-pink-primary break-all">{formData.email || '-'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-pink-primary/60 mb-1">Phone</div>
                <div className="text-base text-pink-primary">{formData.phone || '-'}</div>
              </div>
            </div>
          </div>

          {/* RSVP Details */}
          <div className="pt-4 border-t border-pink-primary/10">
            <h4 className="text-sm font-bold text-pink-primary mb-3">RSVP Details</h4>
            
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs font-medium text-pink-primary/60 mb-1">RSVP Status</div>
                <div className="text-base font-semibold text-pink-primary">{formData.rsvp_status || 'Pending'}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-pink-primary/60 mb-1">Meal Choice</div>
                <div className="text-base text-pink-primary">{formData.meal_choice || '-'}</div>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-xs font-medium text-pink-primary/60 mb-1">Dietary Restrictions / Notes</div>
              <div className="text-sm text-pink-primary p-3 bg-pink-light/50 rounded-lg">
                {formData.dietary_notes || '-'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs font-medium text-pink-primary/60 mb-1">Song Request</div>
                <div className="text-sm text-pink-primary">{formData.song_request || '-'}</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-pink-primary/60 mb-1">RSVP Notes</div>
              <div className="text-sm text-pink-primary p-3 bg-pink-light/50 rounded-lg">
                {formData.rsvp_notes || '-'}
              </div>
            </div>
          </div>

          {/* Plus-One */}
          <div className="pt-4 border-t border-pink-primary/10">
            <h4 className="text-sm font-bold text-pink-primary mb-3">Plus-One</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium text-pink-primary/60 mb-1">Plus-One Allowed</div>
                <div className="text-base text-pink-primary">
                  {formData.plus_one_allowed ? (
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">Yes</span>
                  ) : (
                    <span className="text-pink-primary/60">No</span>
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-pink-primary/60 mb-1">Plus-One Name</div>
                <div className="text-base text-pink-primary">{formData.plus_one_name || '-'}</div>
              </div>
            </div>
          </div>

          {/* Household */}
          <div className="pt-4 border-t border-pink-primary/10">
            <h4 className="text-sm font-bold text-pink-primary mb-3">Household</h4>
            <div className="text-base text-pink-primary">{formData.household_id || '-'}</div>
          </div>

          {/* Address */}
          <div className="pt-4 border-t border-pink-primary/10">
            <h4 className="text-sm font-bold text-pink-primary mb-3">Address</h4>
            <div className="space-y-2">
              <div>
                <div className="text-xs font-medium text-pink-primary/60 mb-1">Street</div>
                <div className="text-sm text-pink-primary">{formData.address_street || '-'}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-pink-primary/60 mb-1">City</div>
                  <div className="text-sm text-pink-primary">{formData.address_city || '-'}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-pink-primary/60 mb-1">State</div>
                  <div className="text-sm text-pink-primary">{formData.address_state || '-'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-medium text-pink-primary/60 mb-1">Postal Code</div>
                  <div className="text-sm text-pink-primary">{formData.address_postal || '-'}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-pink-primary/60 mb-1">Country</div>
                  <div className="text-sm text-pink-primary">{formData.address_country || '-'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Toggles */}
          <div className="pt-4 border-t border-pink-primary/10">
            <h4 className="text-sm font-bold text-pink-primary mb-3">Additional Info</h4>
            <div className="flex flex-wrap gap-2">
              {formData.invite_sent && (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                  ✓ Invitation Sent
                </span>
              )}
              {formData.shuttle_needed && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                  ✓ Needs Shuttle
                </span>
              )}
              {formData.needs_accommodation && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                  ✓ Needs Accommodation Info
                </span>
              )}
              {!formData.invite_sent && !formData.shuttle_needed && !formData.needs_accommodation && (
                <span className="text-sm text-pink-primary/60">None</span>
              )}
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-6">
            <Button type="button" onClick={onClose} fullWidth>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            required
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            placeholder="Jane Doe"
            disabled={viewOnly}
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
            disabled={viewOnly}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="jane@example.com"
            disabled={viewOnly}
          />

          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="555-0123"
            disabled={viewOnly}
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
              disabled={viewOnly}
            />

            <Input
              label="Meal Choice"
              value={formData.meal_choice}
              onChange={(e) => setFormData({ ...formData, meal_choice: e.target.value })}
              placeholder="Chicken, Fish, Vegetarian..."
              disabled={viewOnly}
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="Dietary Restrictions / Notes"
              value={formData.dietary_notes}
              onChange={(e) => setFormData({ ...formData, dietary_notes: e.target.value })}
              placeholder="Any allergies or dietary preferences..."
              disabled={viewOnly}
            />
          </div>

          <div className="mt-4">
            <Input
              label="Song Request"
              value={formData.song_request}
              onChange={(e) => setFormData({ ...formData, song_request: e.target.value })}
              placeholder="Song they'd like to hear at the wedding..."
              disabled={viewOnly}
            />
          </div>

          <div className="mt-4">
            <Textarea
              label="RSVP Notes"
              value={formData.rsvp_notes}
              onChange={(e) => setFormData({ ...formData, rsvp_notes: e.target.value })}
              placeholder="Any additional notes from their RSVP..."
              disabled={viewOnly}
            />
          </div>
        </div>

        {/* Plus-One */}
        <div className="pt-4 border-t border-pink-primary/10">
          <Toggle
            checked={formData.plus_one_allowed || false}
            onChange={(checked) => setFormData({ ...formData, plus_one_allowed: checked })}
            label="Plus-one allowed"
            disabled={viewOnly}
          />

          {formData.plus_one_allowed && (
            <div className="mt-4">
              <Input
                label="Plus-one Name"
                value={formData.plus_one_name}
                onChange={(e) => setFormData({ ...formData, plus_one_name: e.target.value })}
                placeholder="Partner's name"
                disabled={viewOnly}
              />
            </div>
          )}
        </div>

        {/* Household */}
        <div className="pt-4 border-t border-pink-primary/10">
          <h4 className="text-sm font-bold text-pink-primary mb-3">Household</h4>
          {!viewOnly && (
            <p className="text-xs text-pink-primary/60 mb-4">
              Group family members together so they can RSVP as a household
            </p>
          )}
          
          {existingHouseholds.length > 0 ? (
            <Select
              label="Household ID"
              value={formData.household_id}
              onChange={(e) => setFormData({ ...formData, household_id: e.target.value })}
              options={[
                { value: '', label: 'No household (individual guest)' },
                { value: '__custom__', label: '+ Create new household' },
                ...existingHouseholds.map(h => ({ value: h, label: h })),
              ]}
              disabled={viewOnly}
            />
          ) : (
            <Input
              label="Household ID"
              value={formData.household_id}
              onChange={(e) => setFormData({ ...formData, household_id: e.target.value })}
              placeholder="e.g., Smith Family, Johnson Household"
              disabled={viewOnly}
            />
          )}

          {!viewOnly && formData.household_id === '__custom__' && (
            <div className="mt-4">
              <Input
                label="New Household Name"
                value=""
                onChange={(e) => setFormData({ ...formData, household_id: e.target.value })}
                placeholder="e.g., Smith Family, Johnson Household"
                autoFocus
              />
            </div>
          )}
          
          {!viewOnly && (
            <p className="text-xs text-pink-primary/60 mt-2">
              Use the same Household ID for all family members who should RSVP together
            </p>
          )}
        </div>

        {/* Address (Optional) */}
        <details className="pt-4 border-t border-pink-primary/10">
          <summary className="text-sm font-bold text-pink-primary cursor-pointer mb-4">
            Address {!viewOnly && '(Optional)'}
          </summary>
          
          <div className="space-y-4">
            <Input
              label="Street Address"
              value={formData.address_street}
              onChange={(e) => setFormData({ ...formData, address_street: e.target.value })}
              placeholder="123 Main St"
              disabled={viewOnly}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                value={formData.address_city}
                onChange={(e) => setFormData({ ...formData, address_city: e.target.value })}
                placeholder="New York"
                disabled={viewOnly}
              />

              <Input
                label="State"
                value={formData.address_state}
                onChange={(e) => setFormData({ ...formData, address_state: e.target.value })}
                placeholder="NY"
                disabled={viewOnly}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                value={formData.address_postal}
                onChange={(e) => setFormData({ ...formData, address_postal: e.target.value })}
                placeholder="10001"
                disabled={viewOnly}
              />

              <Input
                label="Country"
                value={formData.address_country}
                onChange={(e) => setFormData({ ...formData, address_country: e.target.value })}
                placeholder="USA"
                disabled={viewOnly}
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
            disabled={viewOnly}
          />

          <Toggle
            checked={formData.shuttle_needed || false}
            onChange={(checked) => setFormData({ ...formData, shuttle_needed: checked })}
            label="Needs shuttle service"
            disabled={viewOnly}
          />

          <Toggle
            checked={formData.needs_accommodation || false}
            onChange={(checked) => setFormData({ ...formData, needs_accommodation: checked })}
            label="Needs hotel accommodation info"
            disabled={viewOnly}
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
      )}
    </Modal>
  )
}
