'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function WeddingReceptionTimelineGenerator() {
  const [startTime, setStartTime] = useState('18:00')
  const [duration, setDuration] = useState('5')
  const [includeToasts, setIncludeToasts] = useState(true)
  const [includeDances, setIncludeDances] = useState(true)
  const [includeCakeCutting, setIncludeCakeCutting] = useState(true)
  const [includeBouquetToss, setIncludeBouquetToss] = useState(true)
  const [timeline, setTimeline] = useState<any[]>([])

  const generateTimeline = () => {
    const startHour = parseInt(startTime.split(':')[0])
    const startMin = parseInt(startTime.split(':')[1])
    const durationHours = parseInt(duration)
    
    const events = []
    let currentTime = startHour * 60 + startMin // Convert to minutes
    
    const addEvent = (event: string, durationMin: number) => {
      const hours = Math.floor(currentTime / 60)
      const mins = currentTime % 60
      events.push({
        time: `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`,
        event,
        duration: `${durationMin} min`
      })
      currentTime += durationMin
    }
    
    // Reception flow
    addEvent('Grand entrance', 10)
    addEvent('First dance', 5)
    
    if (includeToasts) {
      addEvent('Welcome speech and toasts', 20)
    }
    
    addEvent('Dinner service begins', 60)
    
    if (includeCakeCutting) {
      addEvent('Cake cutting ceremony', 10)
    }
    
    if (includeDances) {
      addEvent('Parent dances (Father/Daughter, Mother/Son)', 10)
    }
    
    // Calculate remaining time for open dancing
    const elapsedMin = currentTime - (startHour * 60 + startMin)
    const remainingMin = (durationHours * 60) - elapsedMin - 45 // Reserve 45 min for end
    
    if (remainingMin > 0) {
      addEvent('Open dancing', remainingMin)
    }
    
    if (includeBouquetToss) {
      addEvent('Bouquet and garter toss', 15)
    }
    
    addEvent('Last dance', 5)
    addEvent('Grand exit and send-off', 15)
    
    setTimeline(events)
  }

  const handleReset = () => {
    setStartTime('18:00')
    setDuration('5')
    setIncludeToasts(true)
    setIncludeDances(true)
    setIncludeCakeCutting(true)
    setIncludeBouquetToss(true)
    setTimeline([])
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-pink-light rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              Reception Start Time
            </label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <p className="text-xs text-pink-primary/60 mt-1">
              Usually after cocktail hour
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              Reception Duration (hours)
            </label>
            <Input
              type="number"
              min="3"
              max="8"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <p className="text-xs text-pink-primary/60 mt-1">
              Most receptions are 4-5 hours
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-primary mb-3">
            Events to Include
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeToasts}
                onChange={(e) => setIncludeToasts(e.target.checked)}
                className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
              />
              <span className="text-sm text-pink-primary">Welcome speech and toasts</span>
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
                checked={includeBouquetToss}
                onChange={(e) => setIncludeBouquetToss(e.target.checked)}
                className="w-4 h-4 text-pink-primary rounded border-pink-primary/30"
              />
              <span className="text-sm text-pink-primary">Bouquet and garter toss</span>
            </label>
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
          <h3 className="text-xl font-bold text-pink-primary mb-4">
            Your Reception Timeline
          </h3>
          <div className="space-y-3">
            {timeline.map((item, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 bg-pink-light/50 rounded-xl"
              >
                <div className="min-w-[80px]">
                  <span className="font-bold text-pink-primary">{item.time}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-pink-primary">{item.event}</p>
                  <p className="text-sm text-pink-primary/60">{item.duration}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-pink-primary/60 mt-4">
            Coordinate this timeline with your DJ, photographer, and venue coordinator before your wedding day.
          </p>
        </div>
      )}
    </div>
  )
}
