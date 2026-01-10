'use client'

import { useState, useEffect } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Select from '../ui/Select'
import Toggle from '../ui/Toggle'
import Button from '../ui/Button'
import { BudgetItem } from '@/lib/dummyData'

interface BudgetFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Partial<BudgetItem>) => void
  editingItem?: BudgetItem | null
}

const PRESET_CATEGORIES = [
  'Custom (enter your own)',
  'Venue',
  'Catering/Food',
  'Photography',
  'Videography',
  'Flowers/Decorations',
  'Music/DJ/Band',
  'Wedding Attire',
  'Rings',
  'Invitations',
  'Transportation',
  'Hair & Makeup',
  'Wedding Planner',
  'Favors & Gifts',
  'Miscellaneous',
]

export default function BudgetFormModal({ isOpen, onClose, onSave, editingItem }: BudgetFormModalProps) {
  const [formData, setFormData] = useState<Partial<BudgetItem>>({
    category_name: '',
    estimated_cost: 0,
    actual_cost: 0,
    is_paid: false,
    is_active: true,
  })
  const [selectedPreset, setSelectedPreset] = useState('Custom (enter your own)')
  const [isCustom, setIsCustom] = useState(true)

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem)
      setSelectedPreset('Custom (enter your own)')
      setIsCustom(true)
    } else {
      setFormData({
        category_name: '',
        estimated_cost: 0,
        actual_cost: 0,
        is_paid: false,
        is_active: true,
      })
      setSelectedPreset('Custom (enter your own)')
      setIsCustom(true)
    }
  }, [editingItem, isOpen])

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value)
    if (value === 'Custom (enter your own)') {
      setIsCustom(true)
      setFormData({ ...formData, category_name: '' })
    } else {
      setIsCustom(false)
      setFormData({ ...formData, category_name: value })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Edit Budget Item' : 'Add Budget Category'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {!editingItem && (
          <Select
            label="Category"
            value={selectedPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            options={PRESET_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
          />
        )}

        {(isCustom || editingItem) && (
        <Input
          label="Category Name"
          required
          value={formData.category_name}
          onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
          placeholder="e.g., Venue, Catering, Photography"
        />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Budgeted Amount"
            type="number"
            required
            min="0"
            step="0.01"
            value={formData.estimated_cost}
            onChange={(e) => setFormData({ ...formData, estimated_cost: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />

          <Input
            label="Amount Spent"
            type="number"
            min="0"
            step="0.01"
            value={formData.actual_cost}
            onChange={(e) => setFormData({ ...formData, actual_cost: parseFloat(e.target.value) || 0 })}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-3 pt-4 border-t border-pink-primary/10">
          <Toggle
            checked={formData.is_paid || false}
            onChange={(checked) => setFormData({ ...formData, is_paid: checked })}
            label="Mark as paid"
          />

          <Toggle
            checked={formData.is_active !== false}
            onChange={(checked) => setFormData({ ...formData, is_active: checked })}
            label="Active (show in budget)"
          />
        </div>

        <div className="flex gap-3 pt-6">
          <Button type="submit" fullWidth>
            {editingItem ? 'Save Changes' : 'Add Category'}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
