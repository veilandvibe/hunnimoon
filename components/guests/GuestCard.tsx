import Card from '../ui/Card'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { Guest } from '@/lib/dummyData'
import { Mail, Phone, Edit, Trash2, Users, Eye } from 'lucide-react'

interface GuestCardProps {
  guest: Guest
  onEdit: (guest: Guest) => void
  onDelete: (guestId: string) => void
  onView: (guest: Guest) => void
}

export default function GuestCard({ guest, onEdit, onDelete, onView }: GuestCardProps) {
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

  return (
    <Card padding="md">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-pink-primary truncate">
              {guest.full_name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" size="sm">
                {guest.side}
              </Badge>
              <Badge variant={getStatusVariant(guest.rsvp_status)} size="sm">
                {guest.rsvp_status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
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

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          {guest.email && (
            <div className="flex items-center gap-2 text-pink-primary/70">
              <Mail size={14} />
              <a href={`mailto:${guest.email}`} className="hover:text-pink-primary truncate">
                {guest.email}
              </a>
            </div>
          )}
          {guest.phone && (
            <div className="flex items-center gap-2 text-pink-primary/70">
              <Phone size={14} />
              <a href={`tel:${guest.phone}`} className="hover:text-pink-primary">
                {guest.phone}
              </a>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="flex flex-wrap gap-2 text-xs text-pink-primary/60">
          {guest.plus_one_allowed && (
            <div className="flex items-center gap-1">
              <Users size={12} />
              <span>Plus-one{guest.plus_one_name ? `: ${guest.plus_one_name}` : ''}</span>
            </div>
          )}
          {guest.meal_choice && (
            <div className="px-2 py-1 bg-pink-light rounded">
              {guest.meal_choice}
            </div>
          )}
          {guest.invite_sent && (
            <div className="px-2 py-1 bg-green-50 text-green-700 rounded">
              Invited
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
