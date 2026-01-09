'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import db from '@/lib/instant'
import { dummyWedding } from '@/lib/dummyData'
import { Copy, Check, Calendar, Link as LinkIcon, User, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { user } = db.useAuth()
  const [weddingDetails, setWeddingDetails] = useState(dummyWedding)
  const [copied, setCopied] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  const rsvpUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/rsvp/${weddingDetails.wedding_slug}`

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(rsvpUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, would save to database
    alert('Settings saved successfully!')
  }

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await db.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      setSigningOut(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-pink-primary">
          Settings
        </h1>
        <p className="text-pink-primary/60 mt-1">
          Manage your wedding details and account
        </p>
      </div>

      {/* Wedding Details */}
      <Card>
        <form onSubmit={handleSaveChanges} className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-pink-primary/10 rounded-xl flex items-center justify-center">
              <Calendar size={20} className="text-pink-primary" />
            </div>
            <h2 className="text-xl font-black text-pink-primary">
              Wedding Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Partner 1 Name"
              required
              value={weddingDetails.partner1_name}
              onChange={(e) =>
                setWeddingDetails({ ...weddingDetails, partner1_name: e.target.value })
              }
            />

            <Input
              label="Partner 2 Name"
              required
              value={weddingDetails.partner2_name}
              onChange={(e) =>
                setWeddingDetails({ ...weddingDetails, partner2_name: e.target.value })
              }
            />
          </div>

          <Input
            label="Wedding Date"
            type="date"
            required
            value={weddingDetails.wedding_date.split('T')[0]}
            onChange={(e) =>
              setWeddingDetails({ ...weddingDetails, wedding_date: new Date(e.target.value).toISOString() })
            }
          />

          <Input
            label="Wedding Slug (for RSVP URL)"
            required
            value={weddingDetails.wedding_slug}
            onChange={(e) =>
              setWeddingDetails({ ...weddingDetails, wedding_slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })
            }
            placeholder="john-and-jane-2026"
          />

          <Button type="submit" fullWidth>
            Save Changes
          </Button>
        </form>
      </Card>

      {/* RSVP URL */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-primary/10 rounded-xl flex items-center justify-center">
              <LinkIcon size={20} className="text-pink-primary" />
            </div>
            <h2 className="text-xl font-black text-pink-primary">
              Your RSVP Link
            </h2>
          </div>

          <p className="text-sm text-pink-primary/70">
            Share this link with your guests so they can RSVP online
          </p>

          <div className="flex gap-2">
            <Input
              value={rsvpUrl}
              readOnly
              className="flex-1"
            />
            <Button onClick={handleCopyUrl} variant="outline">
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>

          <div className="p-4 bg-pink-light rounded-xl">
            <p className="text-sm text-pink-primary">
              💡 <strong>Tip:</strong> You can customize your slug above to make it more memorable, like "sarah-mike-wedding" or "smith-jones-2026"
            </p>
          </div>
        </div>
      </Card>

      {/* Account */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-primary/10 rounded-xl flex items-center justify-center">
              <User size={20} className="text-pink-primary" />
            </div>
            <h2 className="text-xl font-black text-pink-primary">
              Account
            </h2>
          </div>

          <div className="p-4 bg-pink-light rounded-xl">
            <p className="text-sm text-pink-primary/70 mb-1">Logged in as:</p>
            <p className="text-pink-primary font-medium">{user?.email || 'Loading...'}</p>
          </div>

          <Button 
            variant="outline" 
            fullWidth 
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <LogOut size={18} />
            {signingOut ? 'Signing Out...' : 'Sign Out'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
