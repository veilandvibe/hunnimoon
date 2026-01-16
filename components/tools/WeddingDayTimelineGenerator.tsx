'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

export default function WeddingDayTimelineGenerator() {
  const [ceremonyTime, setCeremonyTime] = useState('15:00')
  const [receptionStart, setReceptionStart] = useState('18:00')
  const [venueType, setVenueType] = useState('same-location')
  const [timeline, setTimeline] = useState<any[]>([])

  const generateTimeline = () => {
    // Parse times
    const ceremonyHour = parseInt(ceremonyTime.split(':')[0])
    const ceremonyMin = parseInt(ceremonyTime.split(':')[1])
    const receptionHour = parseInt(receptionStart.split(':')[0])
    
    const events = []
    
    // Getting ready (3 hours before ceremony)
    const gettingReadyHour = ceremonyHour - 3
    events.push({
      time: `${gettingReadyHour.toString().padStart(2, '0')}:00`,
      event: 'Hair and makeup begins',
      duration: '2-3 hours'
    })
    
    // Pre-ceremony
    events.push({
      time: `${(ceremonyHour - 1).toString().padStart(2, '0')}:00`,
      event: 'Get dressed and final touches',
      duration: '45 min'
    })
    
    events.push({
      time: `${(ceremonyHour - 1).toString().padStart(2, '0')}:30`,
      event: 'First look (if applicable)',
      duration: '30 min'
    })
    
    // Ceremony
    events.push({
      time: ceremonyTime,
      event: 'Ceremony begins',
      duration: '30 min'
    })
    
    const postCeremonyHour = ceremonyHour + 1
    events.push({
      time: `${postCeremonyHour.toString().padStart(2, '0')}:00`,
      event: 'Family photos and portraits',
      duration: '1 hour'
    })
    
    // Cocktail hour
    if (venueType === 'same-location') {
      events.push({
        time: `${(receptionHour - 1).toString().padStart(2, '0')}:00`,
        event: 'Cocktail hour',
        duration: '1 hour'
      })
    } else {
      events.push({
        time: `${(receptionHour - 1).toString().padStart(2, '0')}:00`,
        event: 'Travel to reception venue',
        duration: '30 min'
      })
      events.push({
        time: `${(receptionHour - 1).toString().padStart(2, '0')}:30`,
        event: 'Cocktail hour at reception',
        duration: '30 min'
      })
    }
    
    // Reception
    events.push({
      time: receptionStart,
      event: 'Grand entrance',
      duration: '10 min'
    })
    
    events.push({
      time: `${receptionHour.toString().padStart(2, '0')}:15`,
      event: 'First dance',
      duration: '5 min'
    })
    
    events.push({
      time: `${receptionHour.toString().padStart(2, '0')}:20`,
      event: 'Welcome toasts',
      duration: '15 min'
    })
    
    events.push({
      time: `${receptionHour.toString().padStart(2, '0')}:35`,
      event: 'Dinner service',
      duration: '1 hour'
    })
    
    events.push({
      time: `${(receptionHour + 1).toString().padStart(2, '0')}:45`,
      event: 'Cake cutting',
      duration: '10 min'
    })
    
    events.push({
      time: `${(receptionHour + 2).toString().padStart(2, '0')}:00`,
      event: 'Parent dances',
      duration: '10 min'
    })
    
    events.push({
      time: `${(receptionHour + 2).toString().padStart(2, '0')}:15`,
      event: 'Open dancing',
      duration: '2 hours'
    })
    
    events.push({
      time: `${(receptionHour + 4).toString().padStart(2, '0')}:15`,
      event: 'Bouquet and garter toss',
      duration: '15 min'
    })
    
    events.push({
      time: `${(receptionHour + 4).toString().padStart(2, '0')}:30`,
      event: 'Last dance and send-off',
      duration: '30 min'
    })
    
    setTimeline(events)
  }

  const handleReset = () => {
    setCeremonyTime('15:00')
    setReceptionStart('18:00')
    setVenueType('same-location')
    setTimeline([])
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-pink-light rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              Ceremony Time
            </label>
            <Input
              type="time"
              value={ceremonyTime}
              onChange={(e) => setCeremonyTime(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              Reception Start Time
            </label>
            <Input
              type="time"
              value={receptionStart}
              onChange={(e) => setReceptionStart(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-primary mb-2">
            Venue Setup
          </label>
          <Select
            value={venueType}
            onChange={(e) => setVenueType(e.target.value)}
          >
            <option value="same-location">Ceremony and reception at same location</option>
            <option value="different-location">Separate ceremony and reception venues</option>
          </Select>
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
          <h3 className="text-xl font-bold text-pink-primary mb-4">
            Your Wedding Day Timeline
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
            This timeline is a starting point. Adjust times based on your specific needs and vendor recommendations.
          </p>
        </div>
      )}
    </div>
  )
}
