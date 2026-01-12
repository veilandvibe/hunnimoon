import Card from '../ui/Card'
import Button from '../ui/Button'
import { Mail, Phone, Globe, Edit, Trash2, ExternalLink } from 'lucide-react'

interface VendorCardProps {
  vendor: any
  onEdit: (vendor: any) => void
  onDelete: (vendorId: string) => void
}

export default function VendorCard({ vendor, onEdit, onDelete }: VendorCardProps) {
  return (
    <Card padding="md">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-pink-primary truncate">
              {vendor.vendor_name}
            </h3>
            {vendor.contact_name && (
              <p className="text-sm text-pink-primary/60">
                Contact: {vendor.contact_name}
              </p>
            )}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(vendor)}
              className="p-2 hover:bg-pink-light rounded-lg transition-colors"
              aria-label="Edit vendor"
            >
              <Edit size={16} className="text-pink-primary" />
            </button>
            <button
              onClick={() => onDelete(vendor.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete vendor"
            >
              <Trash2 size={16} className="text-red-500" />
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2">
          {vendor.email && (
            <a
              href={`mailto:${vendor.email}`}
              className="flex items-center gap-2 text-sm text-pink-primary/70 hover:text-pink-primary transition-colors"
            >
              <Mail size={14} />
              <span className="truncate">{vendor.email}</span>
            </a>
          )}
          
          {vendor.phone && (
            <a
              href={`tel:${vendor.phone}`}
              className="flex items-center gap-2 text-sm text-pink-primary/70 hover:text-pink-primary transition-colors"
            >
              <Phone size={14} />
              <span>{vendor.phone}</span>
            </a>
          )}
          
          {vendor.website && (
            <a
              href={vendor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-pink-primary/70 hover:text-pink-primary transition-colors"
            >
              <Globe size={14} />
              <span className="truncate">Visit website</span>
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Notes */}
        {vendor.notes && (
          <div className="pt-3 border-t border-pink-primary/10">
            <p className="text-sm text-pink-primary/60 line-clamp-3">
              {vendor.notes}
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
