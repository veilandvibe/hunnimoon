'use client'

import { useState } from 'react'
import { Trash2, Users } from 'lucide-react'
import Button from '@/components/ui/Button'

interface BulkActionBarProps {
  selectedCount: number
  totalCount: number
  onSelectAll: () => void
  onDelete: () => void
  onMarkInvited: () => void
  onMarkNotInvited: () => void
  onChangeSide: (side: 'Bride' | 'Groom' | 'Both' | 'Unknown') => void
  onCancel: () => void
  isReadOnly?: boolean
}

export default function BulkActionBar({
  selectedCount,
  totalCount,
  onSelectAll,
  onDelete,
  onMarkInvited,
  onMarkNotInvited,
  onChangeSide,
  onCancel,
  isReadOnly = false
}: BulkActionBarProps) {
  const [showSideMenu, setShowSideMenu] = useState(false)
  const [showInviteMenu, setShowInviteMenu] = useState(false)
  
  return (
    <div className="bg-white/90 backdrop-blur-lg border-2 border-pink-primary/20 rounded-2xl p-3 mb-4 animate-in slide-in-from-top duration-200 shadow-sm">
      {/* Selection Info */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-pink-primary">
          {selectedCount} guest{selectedCount !== 1 ? 's' : ''} selected
        </span>
        <div className="flex items-center gap-3">
          {/* Mobile: Select All button next to Cancel */}
          <button
            onClick={onSelectAll}
            className="md:hidden text-xs text-pink-primary/70 hover:text-pink-primary underline"
          >
            Select All
          </button>
          <button
            onClick={onCancel}
            className="text-xs text-pink-primary/70 hover:text-pink-primary underline"
          >
            Cancel
          </button>
        </div>
      </div>
      
      {/* Actions - Single Row */}
      <div className="flex items-center gap-2">
        {/* Desktop Only: Select All button */}
        <Button
          onClick={onSelectAll}
          variant="outline"
          size="sm"
          className="hidden md:inline-flex px-2 py-2 h-9 whitespace-nowrap"
        >
          <span className="text-xs">Select All</span>
        </Button>
        
        {/* Delete button - fixed width for desktop */}
        <Button
          onClick={onDelete}
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50 px-2 py-2 h-9 whitespace-nowrap md:w-[140px]"
          disabled={isReadOnly}
          title={isReadOnly ? 'Upgrade to delete guests' : undefined}
        >
          <Trash2 size={14} className="hidden md:inline" />
          <span className="text-xs md:ml-1">Delete</span>
        </Button>
        
        {/* Mark Invited Dropdown - fixed width for desktop */}
        <div className="relative flex-1 md:flex-none">
          <Button
            onClick={() => setShowInviteMenu(!showInviteMenu)}
            variant="outline"
            size="sm"
            className="w-full md:w-[140px] px-2 py-2 h-9 whitespace-nowrap"
            disabled={isReadOnly}
            title={isReadOnly ? 'Upgrade to edit guests' : undefined}
          >
            <span className="text-xs">Mark Invited ▼</span>
          </Button>
          
          {showInviteMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowInviteMenu(false)}
              />
              <div className="absolute left-0 mt-2 w-full bg-white border-2 border-pink-primary/20 rounded-xl shadow-lg z-20">
                <button
                  onClick={() => {
                    onMarkInvited()
                    setShowInviteMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-pink-primary hover:bg-pink-light transition-colors rounded-t-xl"
                >
                  ✓ Mark as Invited
                </button>
                <button
                  onClick={() => {
                    onMarkNotInvited()
                    setShowInviteMenu(false)
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-pink-primary hover:bg-pink-light transition-colors rounded-b-xl"
                >
                  ✗ Mark as Not Invited
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* Change Side Dropdown - fixed width for desktop */}
        <div className="relative flex-1 md:flex-none">
          <Button
            onClick={() => setShowSideMenu(!showSideMenu)}
            variant="outline"
            size="sm"
            className="w-full md:w-[140px] px-2 py-2 h-9 whitespace-nowrap"
            disabled={isReadOnly}
            title={isReadOnly ? 'Upgrade to edit guests' : undefined}
          >
            <Users size={14} className="hidden md:inline" />
            <span className="text-xs md:ml-1">Change Side ▼</span>
          </Button>
          
          {showSideMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowSideMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-full bg-white border-2 border-pink-primary/20 rounded-xl shadow-lg z-20">
                {(['Bride', 'Groom', 'Both', 'Unknown'] as const).map(side => (
                  <button
                    key={side}
                    onClick={() => {
                      onChangeSide(side)
                      setShowSideMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-pink-primary hover:bg-pink-light transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    {side}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
