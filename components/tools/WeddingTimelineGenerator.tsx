'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Copy, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

interface TimelinePeriod {
  period: string
  events: string[]
}

export default function WeddingTimelineGenerator() {
  const [weddingDate, setWeddingDate] = useState('')
  
  // Pre-Wedding Celebrations
  const [includeEngagementParty, setIncludeEngagementParty] = useState(false)
  const [includeBridalShower, setIncludeBridalShower] = useState(false)
  const [includeBachelorParty, setIncludeBachelorParty] = useState(false)
  
  // Guest & Communication Milestones
  const [includeSaveDates, setIncludeSaveDates] = useState(false)
  const [includeInvitations, setIncludeInvitations] = useState(false)
  
  // Wedding Week Events
  const [includeRehearsal, setIncludeRehearsal] = useState(false)
  const [includeRehearsalDinner, setIncludeRehearsalDinner] = useState(false)
  const [includeVenueWalkthrough, setIncludeVenueWalkthrough] = useState(false)
  
  // Wedding Day
  const [includeGettingReady, setIncludeGettingReady] = useState(false)
  const [includeCeremony, setIncludeCeremony] = useState(false)
  const [includeReception, setIncludeReception] = useState(false)
  
  // After-Wedding Events
  const [includeAfterParty, setIncludeAfterParty] = useState(false)
  const [includeFarewellBrunch, setIncludeFarewellBrunch] = useState(false)
  
  // Honeymoon
  const [includeDepartHoneymoon, setIncludeDepartHoneymoon] = useState(false)
  
  const [timeline, setTimeline] = useState<TimelinePeriod[]>([])

  const generateTimeline = () => {
    if (!weddingDate) {
      toast.error('Please select your wedding date')
      return
    }

    const periods: TimelinePeriod[] = []
    
    // Define the period order and which events belong to each
    const periodMapping = {
      '6–9 Months Before': [
        { included: includeEngagementParty, name: 'Engagement party' },
        { included: includeSaveDates, name: 'Save-the-dates sent' }
      ],
      '1–3 Months Before': [
        { included: includeBridalShower, name: 'Bridal shower' },
        { included: includeBachelorParty, name: 'Bachelor / bachelorette party' },
        { included: includeInvitations, name: 'Invitations sent' }
      ],
      '2–3 Weeks Before': [
        { included: includeVenueWalkthrough, name: 'Final venue walk-through' }
      ],
      'Day Before': [
        { included: includeRehearsal, name: 'Rehearsal' },
        { included: includeRehearsalDinner, name: 'Rehearsal dinner' }
      ],
      'Wedding Day': [
        { included: includeGettingReady, name: 'Getting ready' },
        { included: includeCeremony, name: 'Ceremony' },
        { included: includeReception, name: 'Reception' }
      ],
      'Day After': [
        { included: includeAfterParty, name: 'After-party' },
        { included: includeFarewellBrunch, name: 'Farewell brunch' },
        { included: includeDepartHoneymoon, name: 'Depart for honeymoon' }
      ]
    }

    // Build timeline with only selected events
    Object.entries(periodMapping).forEach(([period, events]) => {
      const selectedEvents = events
        .filter(event => event.included)
        .map(event => event.name)
      
      if (selectedEvents.length > 0) {
        periods.push({
          period,
          events: selectedEvents
        })
      }
    })

    if (periods.length === 0) {
      toast.error('Please select at least one event')
      return
    }

    setTimeline(periods)
  }

  const handleCopyTimeline = () => {
    const timelineText = timeline
      .map(period => `${period.period}\n${period.events.map(e => `• ${e}`).join('\n')}`)
      .join('\n\n')
    
    navigator.clipboard.writeText(timelineText)
    toast.success('Timeline copied to clipboard!')
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(22)
    doc.setTextColor(212, 71, 126) // Pink
    doc.text('Wedding Timeline', 20, 25)
    
    // Subtitle
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Your planning timeline from engagement to wedding day', 20, 33)
    
    // Timeline periods
    doc.setFontSize(12)
    let y = 50
    
    timeline.forEach((period, periodIndex) => {
      // Check if we need a new page
      if (y > 250) {
        doc.addPage()
        y = 20
      }
      
      // Period header (pink, bold)
      doc.setTextColor(212, 71, 126)
      doc.setFont('helvetica', 'bold')
      doc.text(period.period, 20, y)
      y += 8
      
      // Events (black, normal)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      
      period.events.forEach((event) => {
        // Check if we need a new page
        if (y > 270) {
          doc.addPage()
          y = 20
        }
        
        doc.text(`• ${event}`, 25, y)
        y += 7
      })
      
      // Add space between periods
      if (periodIndex < timeline.length - 1) {
        y += 5
      }
    })
    
    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text('Created with Hunnimoon', 105, 285, { align: 'center' })
    }
    
    doc.save('wedding-timeline.pdf')
    toast.success('Timeline PDF downloaded!')
  }

  const handleReset = () => {
    setWeddingDate('')
    
    // Pre-Wedding Celebrations
    setIncludeEngagementParty(false)
    setIncludeBridalShower(false)
    setIncludeBachelorParty(false)
    
    // Guest & Communication Milestones
    setIncludeSaveDates(false)
    setIncludeInvitations(false)
    
    // Wedding Week Events
    setIncludeRehearsal(false)
    setIncludeRehearsalDinner(false)
    setIncludeVenueWalkthrough(false)
    
    // Wedding Day
    setIncludeGettingReady(false)
    setIncludeCeremony(false)
    setIncludeReception(false)
    
    // After-Wedding Events
    setIncludeAfterParty(false)
    setIncludeFarewellBrunch(false)
    
    // Honeymoon
    setIncludeHoneymoonBooked(false)
    setIncludeDepartHoneymoon(false)
    
    setTimeline([])
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-pink-light rounded-2xl p-6 space-y-6">
        {/* Wedding Date */}
        <div>
          <label className="block text-sm font-medium text-pink-primary mb-2">
            Wedding Date
          </label>
          <Input
            type="date"
            value={weddingDate}
            onChange={(e) => setWeddingDate(e.target.value)}
            className="h-[48px]"
          />
          <p className="text-xs text-pink-primary/60 mt-1">
            We'll use this to place events at the right time before and after your wedding
          </p>
        </div>

        {/* Events to Include */}
        <div>
          <label className="block text-sm font-medium text-pink-primary mb-3">
            Events to Include
          </label>
          
          <div className="space-y-4">
            {/* Pre-Wedding Celebrations */}
            <div>
              <p className="text-xs font-semibold text-pink-primary/70 uppercase tracking-wide mb-2">
                Pre-Wedding Celebrations
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeEngagementParty}
                    onChange={(e) => setIncludeEngagementParty(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Engagement party</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeBridalShower}
                    onChange={(e) => setIncludeBridalShower(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Bridal shower</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeBachelorParty}
                    onChange={(e) => setIncludeBachelorParty(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Bachelor / bachelorette party</span>
                </label>
              </div>
            </div>

            {/* Guest & Communication Milestones */}
            <div>
              <p className="text-xs font-semibold text-pink-primary/70 uppercase tracking-wide mb-2">
                Guest & Communication Milestones
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeSaveDates}
                    onChange={(e) => setIncludeSaveDates(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Save-the-dates sent</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeInvitations}
                    onChange={(e) => setIncludeInvitations(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Invitations sent</span>
                </label>
              </div>
            </div>

            {/* Wedding Week Events */}
            <div>
              <p className="text-xs font-semibold text-pink-primary/70 uppercase tracking-wide mb-2">
                Wedding Week Events
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeRehearsal}
                    onChange={(e) => setIncludeRehearsal(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Rehearsal</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeRehearsalDinner}
                    onChange={(e) => setIncludeRehearsalDinner(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Rehearsal dinner</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeVenueWalkthrough}
                    onChange={(e) => setIncludeVenueWalkthrough(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Final venue walk-through</span>
                </label>
              </div>
            </div>

            {/* Wedding Day */}
            <div>
              <p className="text-xs font-semibold text-pink-primary/70 uppercase tracking-wide mb-2">
                Wedding Day
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeGettingReady}
                    onChange={(e) => setIncludeGettingReady(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Getting ready</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeCeremony}
                    onChange={(e) => setIncludeCeremony(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Ceremony</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeReception}
                    onChange={(e) => setIncludeReception(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Reception</span>
                </label>
              </div>
            </div>

            {/* After-Wedding Events */}
            <div>
              <p className="text-xs font-semibold text-pink-primary/70 uppercase tracking-wide mb-2">
                After-Wedding Events
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeAfterParty}
                    onChange={(e) => setIncludeAfterParty(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">After-party</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeFarewellBrunch}
                    onChange={(e) => setIncludeFarewellBrunch(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Farewell brunch</span>
                </label>
              </div>
            </div>

            {/* Honeymoon */}
            <div>
              <p className="text-xs font-semibold text-pink-primary/70 uppercase tracking-wide mb-2">
                Honeymoon
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeDepartHoneymoon}
                    onChange={(e) => setIncludeDepartHoneymoon(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Depart for honeymoon</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={generateTimeline} className="flex-1">
            Generate Timeline
          </Button>
          {timeline.length > 0 && (
            <Button onClick={handleReset} variant="outline">
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {timeline.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-pink-primary/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-pink-primary">
              Your Wedding Timeline
            </h3>
            <div className="flex gap-2">
              <Button
                onClick={handleCopyTimeline}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            {timeline.map((period, index) => (
              <div key={index}>
                <h4 className="text-lg font-bold text-pink-primary mb-3">
                  {period.period}
                </h4>
                <div className="space-y-2">
                  {period.events.map((event, eventIndex) => (
                    <div 
                      key={eventIndex}
                      className="flex items-start gap-2 text-pink-primary"
                    >
                      <span>•</span>
                      <span>{event}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
