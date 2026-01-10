'use client'

import { useState, useRef, useEffect } from 'react'
import Badge from '../ui/Badge'
import { Guest } from '@/lib/dummyData'
import { Eye, Edit, Trash2, MoreVertical } from 'lucide-react'

interface GuestListItemProps {
  guest: Guest
  onView: (guest: Guest) => void
  onEdit: (guest: Guest) => void
  onDelete: (guestId: string) => void
}

export default function GuestListItem({ guest, onView, onEdit, onDelete }: GuestListItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <div className="bg-white rounded-2xl shadow-card p-4 hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-[1fr_120px_auto] md:grid-cols-[1fr_120px_140px_140px] gap-4 items-center">
        {/* Name column - Left aligned */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base font-black text-pink-primary truncate">
            {guest.full_name}
          </span>
          
          {/* Household badge */}
          {guest.household_id && (
            <span className="px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-medium rounded flex-shrink-0">
              {guest.household_id}
            </span>
          )}
          
          {/* Plus-one tag */}
          {(guest.plus_one_allowed || guest.plus_one_name) && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded flex-shrink-0">
              +1
            </span>
          )}
        </div>
        
        {/* Side column - Center aligned, Desktop only */}
        <div className="hidden md:flex justify-center">
          <span className="text-sm text-pink-primary/70">
            {guest.side}
          </span>
        </div>
        
        {/* Status column - Center aligned */}
        <div className="flex items-center justify-center w-full">
          <Badge variant={getStatusVariant(guest.rsvp_status)} size="sm">
            {guest.rsvp_status}
          </Badge>
        </div>

        {/* Actions column - Center aligned */}
        <div className="flex justify-center">
          {/* Mobile: 3-dot menu */}
          <div className="md:hidden relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-pink-light rounded-lg transition-colors"
              aria-label="More actions"
            >
              <MoreVertical size={20} className="text-pink-primary" />
            </button>

            {/* Dropdown menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-pink-primary/10 py-2 z-10">
                <button
                  onClick={() => {
                    onView(guest)
                    setIsMenuOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-pink-primary hover:bg-pink-light transition-colors flex items-center gap-2"
                >
                  <Eye size={16} className="text-blue-600" />
                  View
                </button>
                <button
                  onClick={() => {
                    onEdit(guest)
                    setIsMenuOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-pink-primary hover:bg-pink-light transition-colors flex items-center gap-2"
                >
                  <Edit size={16} className="text-pink-primary" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(guest.id)
                    setIsMenuOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} className="text-red-500" />
                  Delete
                </button>
              </div>
            )}
          </div>

          {/* Desktop: Icon buttons */}
          <div className="hidden md:flex gap-1">
            <button
              onClick={() => onView(guest)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="View guest details"
            >
              <Eye size={16} className="text-blue-600" />
            </button>
            <button
              onClick={() => onEdit(guest)}
              className="p-2 hover:bg-pink-light rounded-lg transition-colors"
              aria-label="Edit guest"
            >
              <Edit size={16} className="text-pink-primary" />
            </button>
            <button
              onClick={() => onDelete(guest.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete guest"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
