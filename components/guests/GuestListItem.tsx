'use client'

import { useState, useRef, useEffect } from 'react'
import Badge from '../ui/Badge'
import { Eye, Edit, Trash2, MoreVertical, Users2 } from 'lucide-react'
import { getSideLabel } from '@/lib/sideLabels'

interface GuestListItemProps {
  guest: any
  onView: (guest: any) => void
  onEdit: (guest: any) => void
  onDelete: (guestId: string) => void
  wedding?: any
  isSelected?: boolean
  isHovered?: boolean
  isSelectMode?: boolean
  onToggleSelect?: (id: string) => void
  onHover?: (id: string | null) => void
  onSelectMultiple?: (id: string) => void
  isReadOnly?: boolean
}

export default function GuestListItem({ 
  guest, 
  onView, 
  onEdit, 
  onDelete,
  wedding,
  isSelected,
  isHovered,
  isSelectMode,
  onToggleSelect,
  onHover,
  onSelectMultiple,
  isReadOnly = false
}: GuestListItemProps) {
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
    <div 
      className={`relative bg-white rounded-2xl shadow-card p-4 hover:shadow-lg transition-all ${
        isSelected ? 'ring-2 ring-pink-primary bg-pink-light/20' : ''
      }`}
      onMouseEnter={() => onHover?.(guest.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Overlay checkbox - desktop: shows on hover, mobile: shows only in select mode */}
      {onToggleSelect && (
        <div className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 ${
          isSelectMode ? 'block' : 'hidden md:block'
        } ${isHovered || isSelectMode ? 'opacity-100' : 'md:opacity-0'} transition-opacity`}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation()
              onToggleSelect(guest.id)
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-5 h-5 rounded border-2 border-pink-primary/30 text-pink-primary focus:ring-pink-primary cursor-pointer bg-white shadow-sm"
          />
        </div>
      )}
      
      <div className={`grid grid-cols-[1fr_90px_40px] md:grid-cols-[1fr_120px_140px_140px] gap-3 items-center transition-all ${
        isSelectMode ? 'pl-8' : (isHovered ? 'md:pl-8' : '')
      }`}>
        {/* Name column - Left aligned */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base font-black text-pink-primary truncate">
            {guest.full_name}
          </span>
          
          {/* Household badge - Desktop only */}
          {guest.household_id && (
            <span className="hidden md:inline-block px-2 py-0.5 bg-pink-100 text-pink-700 text-xs font-medium rounded flex-shrink-0">
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
            {wedding?.partner1_name && guest.side === 'Bride' 
              ? wedding.partner1_name 
              : wedding?.partner2_name && guest.side === 'Groom' 
                ? wedding.partner2_name 
                : guest.side}
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
                  className="w-full px-4 py-2 text-left text-sm text-pink-primary hover:bg-pink-light transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                >
                  <Edit size={16} className="text-pink-primary" />
                  Edit {isReadOnly && '(Upgrade)'}
                </button>
                {!isSelectMode && onSelectMultiple && (
                  <button
                    onClick={() => {
                      onSelectMultiple(guest.id)
                      setIsMenuOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-pink-primary hover:bg-pink-light transition-colors flex items-center gap-2"
                  >
                    <Users2 size={16} className="text-pink-primary" strokeWidth={2} />
                    Select Multiple
                  </button>
                )}
                <button
                  onClick={() => {
                    onDelete(guest.id)
                    setIsMenuOpen(false)
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={isReadOnly}
                >
                  <Trash2 size={16} className="text-red-500" />
                  Delete {isReadOnly && '(Upgrade)'}
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
              className="p-2 hover:bg-pink-light rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Edit guest"
              disabled={isReadOnly}
              title={isReadOnly ? 'Upgrade to edit guests' : undefined}
            >
              <Edit size={16} className="text-pink-primary" />
            </button>
            <button
              onClick={() => onDelete(guest.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Delete guest"
              disabled={isReadOnly}
              title={isReadOnly ? 'Upgrade to delete guests' : undefined}
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
