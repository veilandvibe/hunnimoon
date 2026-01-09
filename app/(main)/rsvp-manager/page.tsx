'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import RSVPChart from '@/components/dashboard/RSVPChart'
import { dummyWedding, dummyGuests, getGuestMetrics } from '@/lib/dummyData'
import { Copy, Check, ExternalLink, Users, Mail } from 'lucide-react'

export default function RSVPManagerPage() {
  const [copied, setCopied] = useState(false)
  const guestMetrics = getGuestMetrics()
  
  const rsvpUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/rsvp/${dummyWedding.wedding_slug}`

  // Get recent RSVPs (last 10, sorted by last_updated)
  const recentRSVPs = [...dummyGuests]
    .filter((g) => g.rsvp_status !== 'Pending')
    .sort((a, b) => b.last_updated - a.last_updated)
    .slice(0, 10)

  const handleCopyUrl = async () => {
    await navigator.clipboard.writeText(rsvpUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpenRSVP = () => {
    window.open(rsvpUrl, '_blank')
  }

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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-pink-primary">
          RSVP Manager
        </h1>
        <p className="text-pink-primary/60 mt-1">
          Share your RSVP link and track responses
        </p>
      </div>

      {/* RSVP Link Card */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-pink-primary">
              Your RSVP Link
            </h2>
            <Button onClick={handleOpenRSVP} variant="outline" size="sm">
              <ExternalLink size={16} />
              Preview
            </Button>
          </div>

          <p className="text-sm text-pink-primary/70">
            Share this link via email, text, social media, or include it on your wedding invitations
          </p>

          <div className="p-4 bg-pink-light rounded-xl">
            <code className="text-sm text-pink-primary break-all">
              {rsvpUrl}
            </code>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleCopyUrl} fullWidth>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied to Clipboard!' : 'Copy Link'}
            </Button>
            <Button variant="outline" fullWidth>
              <Mail size={18} />
              Email to Guests
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="text-3xl md:text-4xl font-black text-pink-primary mb-2">
            {guestMetrics.totalGuests}
          </div>
          <div className="text-xs md:text-sm text-pink-primary/60">Total Guests</div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl md:text-4xl font-black text-green-600 mb-2">
            {guestMetrics.yesCount}
          </div>
          <div className="text-xs md:text-sm text-pink-primary/60">Confirmed</div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl md:text-4xl font-black text-red-600 mb-2">
            {guestMetrics.noCount}
          </div>
          <div className="text-xs md:text-sm text-pink-primary/60">Declined</div>
        </Card>

        <Card className="text-center">
          <div className="text-3xl md:text-4xl font-black text-amber-600 mb-2">
            {guestMetrics.pendingCount}
          </div>
          <div className="text-xs md:text-sm text-pink-primary/60">Pending</div>
        </Card>
      </div>

      {/* RSVP Chart & Recent RSVPs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <RSVPChart
          yesCount={guestMetrics.yesCount}
          noCount={guestMetrics.noCount}
          pendingCount={guestMetrics.pendingCount}
        />

        {/* Recent RSVPs */}
        <Card>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-primary/10 rounded-xl flex items-center justify-center">
                <Users size={20} className="text-pink-primary" />
              </div>
              <h2 className="text-xl font-black text-pink-primary">
                Recent RSVPs
              </h2>
            </div>

            {recentRSVPs.length === 0 ? (
              <p className="text-center text-pink-primary/60 py-8">
                No RSVPs yet. Share your link to get started!
              </p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {recentRSVPs.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-center justify-between p-3 bg-pink-light rounded-xl"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-pink-primary truncate">
                        {guest.full_name}
                      </p>
                      {guest.plus_one_name && (
                        <p className="text-xs text-pink-primary/60">
                          + {guest.plus_one_name}
                        </p>
                      )}
                      <p className="text-xs text-pink-primary/50">
                        {new Date(guest.last_updated).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(guest.rsvp_status)}>
                      {guest.rsvp_status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Help Card */}
      <Card>
        <div className="space-y-3">
          <h3 className="text-lg font-black text-pink-primary">
            💡 Tips for Getting More RSVPs
          </h3>
          <ul className="space-y-2 text-sm text-pink-primary/70">
            <li className="flex items-start gap-2">
              <span className="text-pink-primary">•</span>
              <span>Send your RSVP link as soon as save-the-dates go out</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-primary">•</span>
              <span>Include the link in your wedding invitation (print or digital)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-primary">•</span>
              <span>Send a friendly reminder 2-3 weeks before your RSVP deadline</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-pink-primary">•</span>
              <span>Follow up personally with guests who haven't responded</span>
            </li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
