'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Copy, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

type DinnerStyle = 'plated' | 'buffet' | 'family-style' | 'cocktail-style'

export default function WeddingReceptionTimelineGenerator() {
  const [startTime, setStartTime] = useState('18:00')
  const [duration, setDuration] = useState('5')
  const [dinnerStyle, setDinnerStyle] = useState<DinnerStyle>('plated')
  
  // Formal moments
  const [includeGrandEntrance, setIncludeGrandEntrance] = useState(true)
  const [includeFirstDance, setIncludeFirstDance] = useState(true)
  const [includeWelcomeSpeech, setIncludeWelcomeSpeech] = useState(true)
  const [includeToasts, setIncludeToasts] = useState(true)
  const [includeDances, setIncludeDances] = useState(true)
  
  // Food moments
  const [includeCakeCutting, setIncludeCakeCutting] = useState(true)
  const [includeDessert, setIncludeDessert] = useState(false)
  
  // Fun traditions
  const [includeAnniversaryDance, setIncludeAnniversaryDance] = useState(false)
  const [includeBouquetToss, setIncludeBouquetToss] = useState(false)
  const [includeGarterToss, setIncludeGarterToss] = useState(false)
  const [includeSendoff, setIncludeSendoff] = useState(false)
  
  const [timeline, setTimeline] = useState<Array<{ time: string; event: string }>>([])

  const dinnerDurations: Record<DinnerStyle, number> = {
    'plated': 75,
    'buffet': 75,
    'family-style': 60,
    'cocktail-style': 0
  }

  const formatTimeAMPM = (hours: number, mins: number): string => {
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
  }

  const generateTimeline = () => {
    const startHour = parseInt(startTime.split(':')[0])
    const startMin = parseInt(startTime.split(':')[1])
    const durationHours = parseInt(duration)
    const receptionStartMin = startHour * 60 + startMin
    const receptionEndMin = receptionStartMin + (durationHours * 60)
    
    const events: Array<{ time: string; event: string }> = []
    let currentTime = receptionStartMin
    
    const addEvent = (event: string, durationMin: number) => {
      const hours = Math.floor(currentTime / 60)
      const mins = currentTime % 60
      events.push({
        time: formatTimeAMPM(hours, mins),
        event
      })
      currentTime += durationMin
    }
    
    const addEventAtTime = (timeMin: number, event: string, durationMin: number) => {
      const hours = Math.floor(timeMin / 60)
      const mins = timeMin % 60
      events.push({
        time: formatTimeAMPM(hours, mins),
        event
      })
      return timeMin + durationMin
    }
    
    // EARLY ZONE: Formal entrance and dinner
    if (includeGrandEntrance) {
      addEvent('Grand entrance', 5)
    }
    
    if (includeFirstDance) {
      addEvent('First dance', 5)
    }
    
    if (includeWelcomeSpeech) {
      addEvent('Welcome speech', 5)
    }
    
    if (includeToasts) {
      addEvent('Toasts', 20) // Increased from 15 to 20
    }
    
    const dinnerStartTime = currentTime
    const dinnerDuration = dinnerDurations[dinnerStyle]
    if (dinnerDuration > 0) {
      addEvent('Dinner service begins', dinnerDuration)
    }
    
    // MID ZONE: Parent dances, then open dancing begins
    if (includeDances) {
      addEvent('Parent dances', 10)
    }
    
    // Calculate when mid-zone events should happen
    const cakeTargetTime = dinnerStartTime + 75 // 75 min after dinner starts
    
    // Cake and dessert (happens ~60-90 min after dinner starts)
    if (includeCakeCutting) {
      const timeUntilCake = cakeTargetTime - currentTime
      if (timeUntilCake > 0) {
        currentTime = cakeTargetTime
      }
      addEvent('Cake cutting', 10)
      if (includeDessert) {
        addEvent('Dessert table opens', 5)
      }
    }
    
    // Open dance floor (only show once!)
    addEvent('Open dance floor', 0)
    
    // Tosses happen during dancing (in mid-late zone)
    const lateZoneStart = receptionEndMin - 60 // Final hour
    const tossTime = lateZoneStart - 30 // 30 min before late zone
    
    if (includeBouquetToss || includeGarterToss) {
      currentTime = tossTime
      
      if (includeBouquetToss) {
        addEvent('Bouquet toss', 5)
      }
      
      if (includeGarterToss) {
        addEvent('Garter toss', 5)
      }
    }
    
    // LATE ZONE: Optional anniversary dance
    if (includeAnniversaryDance) {
      const anniversaryTime = receptionEndMin - 25 // 25 min before end
      currentTime = anniversaryTime
      addEvent('Anniversary dance', 10)
    }
    
    // Always end with last dance
    addEvent('Last dance', 5)
    
    // Optional send-off
    if (includeSendoff) {
      addEvent('Send-off', 10)
    }
    
    setTimeline(events)
  }

  const handleCopyTimeline = () => {
    const timelineText = timeline.map(item => `${item.time} – ${item.event}`).join('\n')
    navigator.clipboard.writeText(timelineText)
    toast.success('Timeline copied to clipboard!')
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(22)
    doc.setTextColor(212, 71, 126) // Pink
    doc.text('Wedding Reception Timeline', 20, 25)
    
    // Subtitle
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Share this timeline with your DJ, photographer, and venue coordinator', 20, 33)
    
    // Timeline items
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    let y = 50
    
    timeline.forEach((item, index) => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      
      // Time (pink, bold)
      doc.setTextColor(212, 71, 126)
      doc.setFont('helvetica', 'bold')
      doc.text(item.time, 20, y)
      
      // Event (black, normal)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.text(item.event, 60, y)
      
      // Separator line
      if (index < timeline.length - 1) {
        doc.setDrawColor(230, 230, 230)
        doc.line(20, y + 3, 190, y + 3)
      }
      
      y += 10
    })
    
    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text('Created with Hunnimoon', 105, 285, { align: 'center' })
    }
    
    doc.save('wedding-reception-timeline.pdf')
    toast.success('Timeline PDF downloaded!')
  }

  const handleReset = () => {
    setStartTime('18:00')
    setDuration('5')
    setDinnerStyle('plated')
    
    // Formal moments
    setIncludeGrandEntrance(true)
    setIncludeFirstDance(true)
    setIncludeWelcomeSpeech(true)
    setIncludeToasts(true)
    setIncludeDances(true)
    
    // Food moments
    setIncludeCakeCutting(true)
    setIncludeDessert(false)
    
    // Fun traditions
    setIncludeAnniversaryDance(false)
    setIncludeBouquetToss(false)
    setIncludeGarterToss(false)
    setIncludeSendoff(false)
    
    setTimeline([])
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-pink-light rounded-2xl p-6 space-y-6">
        {/* Reception Basics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              Reception Start Time
            </label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="h-[48px]"
            />
            <p className="text-xs text-pink-primary/60 mt-1">
              Usually after cocktail hour
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              Reception Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 pr-10 h-[48px] rounded-xl border-2 border-pink-primary/20 text-pink-primary text-base bg-white focus:outline-none focus:ring-2 focus:ring-pink-primary/20 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4477E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
            >
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
              <option value="5">5 hours</option>
              <option value="6">6 hours</option>
            </select>
            <p className="text-xs text-pink-primary/60 mt-1">
              Most receptions are 4-5 hours
            </p>
          </div>
        </div>

        {/* Dinner Style */}
        <div>
          <label className="block text-sm font-medium text-pink-primary mb-3">
            Dinner Style
          </label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'plated', label: 'Plated Dinner' },
              { value: 'buffet', label: 'Buffet' },
              { value: 'family-style', label: 'Family Style' },
              { value: 'cocktail-style', label: 'No Formal Dinner' }
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  dinnerStyle === option.value
                    ? 'border-pink-primary bg-pink-primary/5'
                    : 'border-pink-primary/20 hover:border-pink-primary/40'
                }`}
              >
                <input
                  type="radio"
                  name="dinnerStyle"
                  value={option.value}
                  checked={dinnerStyle === option.value}
                  onChange={(e) => setDinnerStyle(e.target.value as DinnerStyle)}
                  className="w-4 h-4 text-pink-primary"
                />
                <span className="text-sm text-pink-primary font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Events to Include */}
        <div>
          <label className="block text-sm font-medium text-pink-primary mb-3">
            Events to Include
          </label>
          
          <div className="space-y-4">
            {/* Formal Moments */}
            <div>
              <p className="text-xs font-semibold text-pink-primary/70 uppercase tracking-wide mb-2">
                Formal Moments
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeGrandEntrance}
                    onChange={(e) => setIncludeGrandEntrance(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Grand entrance</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeFirstDance}
                    onChange={(e) => setIncludeFirstDance(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">First dance</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeWelcomeSpeech}
                    onChange={(e) => setIncludeWelcomeSpeech(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Welcome speech</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeToasts}
                    onChange={(e) => setIncludeToasts(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Toasts</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeDances}
                    onChange={(e) => setIncludeDances(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Parent dances</span>
                </label>
              </div>
            </div>

            {/* Food Moments */}
            <div>
              <p className="text-xs font-semibold text-pink-primary/70 uppercase tracking-wide mb-2">
                Food Moments
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeCakeCutting}
                    onChange={(e) => setIncludeCakeCutting(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Cake cutting</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeDessert}
                    onChange={(e) => setIncludeDessert(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Dessert table opens</span>
                </label>
              </div>
            </div>

            {/* Fun Traditions */}
            <div>
              <p className="text-xs font-semibold text-pink-primary/70 uppercase tracking-wide mb-2">
                Fun Traditions
              </p>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeAnniversaryDance}
                    onChange={(e) => setIncludeAnniversaryDance(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Anniversary dance</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeBouquetToss}
                    onChange={(e) => setIncludeBouquetToss(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Bouquet toss</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeGarterToss}
                    onChange={(e) => setIncludeGarterToss(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Garter toss</span>
                </label>
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeSendoff}
                    onChange={(e) => setIncludeSendoff(e.target.checked)}
                    className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
                  />
                  <span className="text-sm text-pink-primary">Send-off</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={generateTimeline} className="flex-1">
            Generate Reception Timeline
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
              Your Reception Timeline
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
          
          <div className="space-y-2">
            {timeline.map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 py-3 border-b border-pink-primary/10 last:border-0"
              >
                <div className="min-w-[100px]">
                  <span className="font-bold text-pink-primary">{item.time}</span>
                </div>
                <div className="flex-1">
                  <span className="text-pink-primary">{item.event}</span>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-pink-primary/60 mt-6 pt-4 border-t border-pink-primary/10">
            Share this timeline with your DJ, photographer, and venue coordinator before your wedding day.
          </p>
        </div>
      )}
    </div>
  )
}
