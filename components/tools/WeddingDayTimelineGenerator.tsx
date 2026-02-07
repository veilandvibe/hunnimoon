'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Copy, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

type HairMakeupService = 'bride-only' | 'bride-party' | 'none'
type ServiceSpeed = 'efficient' | 'average' | 'relaxed'
type FamilyPhotoSize = 'immediate' | 'immediate-grandparents' | 'extended'
type DinnerStyle = 'plated' | 'buffet' | 'family-style' | 'cocktail-style'
type SpeechVibe = 'short' | 'average' | 'long'

interface TimelineEvent {
  time: string
  event: string
  duration?: string
  isWarning?: boolean
}

export default function WeddingDayTimelineGenerator() {
  // Required inputs
  const [ceremonyTime, setCeremonyTime] = useState('15:00')
  const [ceremonyLength, setCeremonyLength] = useState<20 | 30 | 60>(30)
  
  // Getting ready
  const [hairMakeupService, setHairMakeupService] = useState<HairMakeupService>('bride-only')
  const [numberOfPeople, setNumberOfPeople] = useState(1)
  const [serviceSpeed, setServiceSpeed] = useState<ServiceSpeed>('average')
  
  // Optional wake-up
  const [useWakeUpTime, setUseWakeUpTime] = useState(false)
  const [wakeUpTime, setWakeUpTime] = useState('08:00')
  
  // Photos
  const [includeFirstLook, setIncludeFirstLook] = useState(false)
  const [includeWeddingPartyPhotos, setIncludeWeddingPartyPhotos] = useState(false)
  const [includeFamilyPhotos, setIncludeFamilyPhotos] = useState(false)
  const [familyPhotoSize, setFamilyPhotoSize] = useState<FamilyPhotoSize>('immediate')
  const [includeDetailShots, setIncludeDetailShots] = useState(false)
  
  // Bridal party size
  const [bridesmaids, setBridesmaids] = useState(0)
  const [groomsmen, setGroomsmen] = useState(0)
  
  // Reception
  const [hasReception, setHasReception] = useState(true)
  const [hasCocktailHour, setHasCocktailHour] = useState(true)
  const [cocktailHourDuration, setCocktailHourDuration] = useState(60)
  const [receptionDuration, setReceptionDuration] = useState(5) // Total reception duration in hours
  const [dinnerStyle, setDinnerStyle] = useState<DinnerStyle>('plated')
  const [numberOfSpeakers, setNumberOfSpeakers] = useState(0)
  const [speechVibe, setSpeechVibe] = useState<SpeechVibe>('average')
  const [includeParentDances, setIncludeParentDances] = useState(false)
  const [includeCakeCutting, setIncludeCakeCutting] = useState(false)
  const [includeSendoff, setIncludeSendoff] = useState(false)
  
  // Results
  const [timeline, setTimeline] = useState<TimelineEvent[]>([])
  const [wakeUpWarning, setWakeUpWarning] = useState<string>('')

  const formatTimeAMPM = (hours: number, mins: number): string => {
    const period = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`
  }

  const timeToMinutes = (timeString: string): number => {
    const [hours, mins] = timeString.split(':').map(Number)
    return hours * 60 + mins
  }

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60) % 24
    const mins = minutes % 60
    return formatTimeAMPM(hours, mins)
  }

  const roundToFiveMinutes = (minutes: number): number => {
    return Math.round(minutes / 5) * 5
  }

  const generateTimeline = () => {
    const events: TimelineEvent[] = []
    let currentTime = timeToMinutes(ceremonyTime)
    
    // Calculate getting ready duration
    const speedMultiplier = serviceSpeed === 'efficient' ? 0.85 : serviceSpeed === 'relaxed' ? 1.2 : 1.0
    
    let gettingReadyDuration = 0
    if (hairMakeupService !== 'none') {
      const baseBuffer = 75 // morning routine, breakfast
      const brideHairMakeup = 120 // realistic bride time
      const additionalPeople = hairMakeupService === 'bride-party' ? Math.max(0, numberOfPeople - 1) : 0
      const additionalPersonTime = serviceSpeed === 'efficient' ? 35 : serviceSpeed === 'relaxed' ? 50 : 40
      const gettingDressed = 60 // dress, accessories, final touches
      const detailPhotos = 20
      
      gettingReadyDuration = roundToFiveMinutes(
        (baseBuffer + brideHairMakeup + (additionalPeople * additionalPersonTime) + gettingDressed + detailPhotos) * speedMultiplier
      )
    } else {
      // No hair/makeup - just getting dressed and details
      gettingReadyDuration = roundToFiveMinutes((75 + 60) * speedMultiplier)
    }
    
    // Calculate photo duration
    let photoDuration = 0
    if (includeFirstLook) photoDuration += 30
    if (includeWeddingPartyPhotos) {
      photoDuration += roundToFiveMinutes(10 + ((bridesmaids + groomsmen) * 2))
    }
    if (includeFamilyPhotos) {
      photoDuration += familyPhotoSize === 'immediate' ? 30 : familyPhotoSize === 'immediate-grandparents' ? 45 : 60
    }
    if (includeDetailShots && hairMakeupService === 'none') {
      photoDuration += 15
    }
    
    // Guest arrival buffer
    const guestArrivalBuffer = 30
    
    // Calculate required pre-ceremony time
    const requiredPreCeremonyTime = gettingReadyDuration + photoDuration + guestArrivalBuffer
    const suggestedWakeUpMinutes = currentTime - requiredPreCeremonyTime
    
    // Validate wake-up time if provided
    if (useWakeUpTime) {
      const userWakeUpMinutes = timeToMinutes(wakeUpTime)
      const availableTime = currentTime - userWakeUpMinutes
      
      if (availableTime < requiredPreCeremonyTime) {
        const shortage = requiredPreCeremonyTime - availableTime
        setWakeUpWarning(
          `⚠️ Your wake-up time is ${shortage} minutes too late. Suggested wake-up: ${minutesToTime(suggestedWakeUpMinutes)}`
        )
      } else if (availableTime > requiredPreCeremonyTime + 60) {
        const buffer = availableTime - requiredPreCeremonyTime
        setWakeUpWarning(`✨ You'll have ${buffer} extra minutes of buffer time in the morning!`)
      } else {
        setWakeUpWarning('')
      }
    } else {
      setWakeUpWarning('')
    }
    
    // Build timeline starting from wake-up (rounded to 5-min intervals)
    let timelineStartMinutes = roundToFiveMinutes(useWakeUpTime ? timeToMinutes(wakeUpTime) : suggestedWakeUpMinutes)
    let currentEventTime = timelineStartMinutes
    
    // Wake up
    events.push({
      time: minutesToTime(currentEventTime),
      event: 'Wake up and morning routine',
      duration: '75 min'
    })
    currentEventTime += 75
    
    // Getting ready
    if (hairMakeupService !== 'none') {
      const brideHairMakeupTime = roundToFiveMinutes(120 * speedMultiplier)
      events.push({
        time: minutesToTime(currentEventTime),
        event: 'Hair and makeup begins',
        duration: hairMakeupService === 'bride-only' ? `${brideHairMakeupTime} min` : `${brideHairMakeupTime} min (bride)`
      })
      currentEventTime += brideHairMakeupTime
      
      if (hairMakeupService === 'bride-party') {
        const additionalTime = roundToFiveMinutes((numberOfPeople - 1) * (serviceSpeed === 'efficient' ? 35 : serviceSpeed === 'relaxed' ? 50 : 40) * speedMultiplier)
        if (additionalTime > 0) {
          events.push({
            time: minutesToTime(currentEventTime - brideHairMakeupTime),
            event: `Wedding party hair and makeup (${numberOfPeople - 1} people)`,
            duration: `${additionalTime} min`
          })
        }
      }
      
      events.push({
        time: minutesToTime(currentEventTime),
        event: 'Detail shots and dress preparation',
        duration: '20 min'
      })
      currentEventTime += 20
    }
    
    events.push({
      time: minutesToTime(currentEventTime),
      event: 'Get dressed and final touches',
      duration: '60 min'
    })
    currentEventTime += 60
    
    // Pre-ceremony photos
    if (includeFirstLook) {
      events.push({
        time: minutesToTime(currentEventTime),
        event: 'First look',
        duration: '30 min'
      })
      currentEventTime += 30
    }
    
    if (includeWeddingPartyPhotos) {
      const weddingPartyPhotoTime = roundToFiveMinutes(10 + ((bridesmaids + groomsmen) * 2))
      events.push({
        time: minutesToTime(currentEventTime),
        event: 'Wedding party photos',
        duration: `${weddingPartyPhotoTime} min`
      })
      currentEventTime += weddingPartyPhotoTime
    }
    
    if (includeDetailShots && hairMakeupService === 'none') {
      events.push({
        time: minutesToTime(currentEventTime),
        event: 'Detail shots',
        duration: '15 min'
      })
      currentEventTime += 15
    }
    
    // Guest arrival
    const guestArrivalTime = currentTime - guestArrivalBuffer
    events.push({
      time: minutesToTime(guestArrivalTime),
      event: 'Guests begin arriving',
      duration: '30 min'
    })
    
    // Ceremony
    events.push({
      time: minutesToTime(currentTime),
      event: 'Ceremony begins',
      duration: `${ceremonyLength} min`
    })
    currentTime += ceremonyLength
    
    // Post-ceremony
    events.push({
      time: minutesToTime(currentTime),
      event: 'Receiving line and congratulations',
      duration: '15 min'
    })
    currentTime += 15
    
    // Family photos (if not done before ceremony)
    if (includeFamilyPhotos) {
      const familyPhotoTime = familyPhotoSize === 'immediate' ? 30 : familyPhotoSize === 'immediate-grandparents' ? 45 : 60
      events.push({
        time: minutesToTime(currentTime),
        event: `Family photos (${familyPhotoSize === 'immediate' ? 'immediate family' : familyPhotoSize === 'immediate-grandparents' ? 'immediate + grandparents' : 'extended family'})`,
        duration: `${familyPhotoTime} min`
      })
      currentTime += familyPhotoTime
    }
    
    // Reception or end
    if (hasReception) {
      // Track reception start time for calculating send-off
      let receptionStartTime = currentTime
      
      // Cocktail hour
      if (hasCocktailHour) {
        events.push({
          time: minutesToTime(currentTime),
          event: 'Cocktail hour',
          duration: `${cocktailHourDuration} min`
        })
        currentTime += cocktailHourDuration
      } else {
        // If no cocktail hour, reception starts at grand entrance
        receptionStartTime = currentTime
      }
      
      // Reception begins
      events.push({
        time: minutesToTime(currentTime),
        event: 'Reception grand entrance',
        duration: '5 min'
      })
      currentTime += 5
      
      events.push({
        time: minutesToTime(currentTime),
        event: 'First dance',
        duration: '5 min'
      })
      currentTime += 5
      
      // Toasts
      if (numberOfSpeakers > 0) {
        const speakerDuration = speechVibe === 'short' ? 5 : speechVibe === 'long' ? 10 : 5
        const toastDuration = roundToFiveMinutes(5 + (numberOfSpeakers * speakerDuration))
        events.push({
          time: minutesToTime(currentTime),
          event: `Toasts (${numberOfSpeakers} speaker${numberOfSpeakers > 1 ? 's' : ''})`,
          duration: `${toastDuration} min`
        })
        currentTime += toastDuration
      }
      
      // Dinner
      if (dinnerStyle !== 'cocktail-style') {
        const dinnerDuration = dinnerStyle === 'family-style' ? 60 : 75
        events.push({
          time: minutesToTime(currentTime),
          event: `Dinner service (${dinnerStyle})`,
          duration: `${dinnerDuration} min`
        })
        currentTime += dinnerDuration
      }
      
      // Parent dances
      if (includeParentDances) {
        events.push({
          time: minutesToTime(currentTime),
          event: 'Parent dances',
          duration: '10 min'
        })
        currentTime += 10
      }
      
      // Cake cutting
      if (includeCakeCutting) {
        events.push({
          time: minutesToTime(currentTime),
          event: 'Cake cutting',
          duration: '10 min'
        })
        currentTime += 10
      }
      
      // Calculate send-off time based on total reception duration
      const receptionDurationMinutes = receptionDuration * 60
      const sendoffTime = receptionStartTime + receptionDurationMinutes
      
      // Open dancing - fills remaining time until send-off
      const danceFloorDuration = sendoffTime - currentTime
      const danceFloorHours = Math.floor(danceFloorDuration / 60)
      const danceFloorMins = danceFloorDuration % 60
      const danceFloorDisplay = danceFloorMins > 0 
        ? `${danceFloorHours} hr ${danceFloorMins} min`
        : `${danceFloorHours} hours`
      
      events.push({
        time: minutesToTime(currentTime),
        event: 'Open dance floor',
        duration: danceFloorDisplay
      })
      
      // Send-off
      if (includeSendoff) {
        events.push({
          time: minutesToTime(sendoffTime),
          event: 'Send-off',
          duration: '10 min'
        })
      }
    } else {
      // No reception - just photos and departure
      if (!includeFamilyPhotos) {
        events.push({
          time: minutesToTime(currentTime),
          event: 'Couple photos',
          duration: '30 min'
        })
        currentTime += 30
      }
      
      events.push({
        time: minutesToTime(currentTime),
        event: 'Departure',
        duration: ''
      })
    }
    
    setTimeline(events)
  }

  const handleCopyTimeline = () => {
    const timelineText = timeline
      .map(item => `${item.time} – ${item.event}${item.duration ? ` (${item.duration})` : ''}`)
      .join('\n')
    navigator.clipboard.writeText(timelineText)
    toast.success('Timeline copied to clipboard!')
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(22)
    doc.setTextColor(212, 71, 126) // Pink
    doc.text('Wedding Day Timeline', 20, 25)
    
    // Subtitle
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Share this timeline with your vendors and wedding party', 20, 33)
    
    // Timeline items
    doc.setFontSize(11)
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
      const eventText = item.duration ? `${item.event} (${item.duration})` : item.event
      doc.text(eventText, 55, y)
      
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
    
    doc.save('wedding-day-timeline.pdf')
    toast.success('Timeline PDF downloaded!')
  }

  const handleReset = () => {
    setCeremonyTime('15:00')
    setCeremonyLength(30)
    setHairMakeupService('bride-only')
    setNumberOfPeople(1)
    setServiceSpeed('average')
    setUseWakeUpTime(false)
    setWakeUpTime('08:00')
    setIncludeFirstLook(false)
    setIncludeWeddingPartyPhotos(false)
    setIncludeFamilyPhotos(false)
    setFamilyPhotoSize('immediate')
    setIncludeDetailShots(false)
    setBridesmaids(0)
    setGroomsmen(0)
    setHasReception(true)
    setHasCocktailHour(true)
    setCocktailHourDuration(60)
    setReceptionDuration(5)
    setDinnerStyle('plated')
    setNumberOfSpeakers(0)
    setSpeechVibe('average')
    setIncludeParentDances(false)
    setIncludeCakeCutting(false)
    setIncludeSendoff(false)
    setTimeline([])
    setWakeUpWarning('')
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="bg-pink-light rounded-2xl p-6 space-y-6">
        {/* Required Inputs */}
        <div>
          <h3 className="text-lg font-bold text-pink-primary mb-4">Ceremony Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-2">
                Ceremony Start Time *
              </label>
              <Input
                type="time"
                value={ceremonyTime}
                onChange={(e) => setCeremonyTime(e.target.value)}
                className="h-[48px]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-2">
                Ceremony Length
              </label>
              <select
                value={ceremonyLength}
                onChange={(e) => setCeremonyLength(Number(e.target.value) as 20 | 30 | 60)}
                className="w-full pl-4 pr-12 h-[48px] rounded-xl border-2 border-pink-primary/50 text-pink-primary text-base bg-white focus:outline-none focus:ring-2 focus:ring-pink-primary/20 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4477E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
              >
                <option value={20}>Short (20 min)</option>
                <option value={30}>Standard (30 min)</option>
                <option value={60}>Long with mass (60 min)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Getting Ready */}
        <div>
          <h3 className="text-lg font-bold text-pink-primary mb-4">Getting Ready</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-3">
                Hair & Makeup Service
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'bride-only', label: 'Bride only' },
                  { value: 'bride-party', label: 'Bride + wedding party' },
                  { value: 'none', label: 'None' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      hairMakeupService === option.value
                        ? 'border-pink-primary bg-pink-primary/5'
                        : 'border-pink-primary/20 hover:border-pink-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hairMakeupService"
                      value={option.value}
                      checked={hairMakeupService === option.value}
                      onChange={(e) => setHairMakeupService(e.target.value as HairMakeupService)}
                      className="w-4 h-4 text-pink-primary"
                    />
                    <span className="text-sm text-pink-primary font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {hairMakeupService === 'bride-party' && (
              <div>
                <label className="block text-sm font-medium text-pink-primary mb-2">
                  Total Number of People Getting Services (including bride)
                </label>
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-[48px]"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-pink-primary mb-3">
                Service Speed
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'efficient', label: 'Efficient team (fast)' },
                  { value: 'average', label: 'Average' },
                  { value: 'relaxed', label: 'Relaxed / slow morning' }
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      serviceSpeed === option.value
                        ? 'border-pink-primary bg-pink-primary/5'
                        : 'border-pink-primary/20 hover:border-pink-primary/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceSpeed"
                      value={option.value}
                      checked={serviceSpeed === option.value}
                      onChange={(e) => setServiceSpeed(e.target.value as ServiceSpeed)}
                      className="w-4 h-4 text-pink-primary"
                    />
                    <span className="text-sm text-pink-primary font-medium">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Optional Wake-Up Time */}
        <div>
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={useWakeUpTime}
              onChange={(e) => setUseWakeUpTime(e.target.checked)}
              className="w-5 h-5 accent-pink-primary cursor-pointer"
            />
            <span className="text-sm font-medium text-pink-primary">
              I have a preferred wake-up time
            </span>
          </label>
          
          {useWakeUpTime && (
            <Input
              type="time"
              value={wakeUpTime}
              onChange={(e) => setWakeUpTime(e.target.value)}
              className="h-[48px]"
            />
          )}
        </div>

        {/* Photos Section */}
        <div>
          <h3 className="text-lg font-bold text-pink-primary mb-4">Photos</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeFirstLook}
                onChange={(e) => setIncludeFirstLook(e.target.checked)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-sm text-pink-primary">First look</span>
            </label>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeWeddingPartyPhotos}
                onChange={(e) => setIncludeWeddingPartyPhotos(e.target.checked)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-sm text-pink-primary">Wedding party photos</span>
            </label>
            
            <div>
              <label className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={includeFamilyPhotos}
                  onChange={(e) => setIncludeFamilyPhotos(e.target.checked)}
                  className="w-5 h-5 accent-pink-primary cursor-pointer"
                />
                <span className="text-sm text-pink-primary">Family photos</span>
              </label>
              
              {includeFamilyPhotos && (
                  <select
                    value={familyPhotoSize}
                    onChange={(e) => setFamilyPhotoSize(e.target.value as FamilyPhotoSize)}
                    className="ml-7 pl-4 pr-12 h-[40px] rounded-lg border-2 border-pink-primary/50 text-pink-primary text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-primary/20 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4477E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
                  >
                  <option value="immediate">Immediate family only</option>
                  <option value="immediate-grandparents">Immediate + grandparents</option>
                  <option value="extended">Big extended family</option>
                </select>
              )}
            </div>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={includeDetailShots}
                onChange={(e) => setIncludeDetailShots(e.target.checked)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-sm text-pink-primary">Detail shots</span>
            </label>
          </div>
        </div>

        {/* Bridal Party Size */}
        <div>
          <h3 className="text-lg font-bold text-pink-primary mb-4">Bridal Party Size</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-2">
                Number of Bridesmaids
              </label>
              <select
                value={bridesmaids}
                onChange={(e) => setBridesmaids(Number(e.target.value))}
                className="w-full pl-4 pr-12 h-[48px] rounded-xl border-2 border-pink-primary/50 text-pink-primary text-base bg-white focus:outline-none focus:ring-2 focus:ring-pink-primary/20 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4477E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
              >
                {Array.from({ length: 16 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-2">
                Number of Groomsmen
              </label>
              <select
                value={groomsmen}
                onChange={(e) => setGroomsmen(Number(e.target.value))}
                className="w-full pl-4 pr-12 h-[48px] rounded-xl border-2 border-pink-primary/50 text-pink-primary text-base bg-white focus:outline-none focus:ring-2 focus:ring-pink-primary/20 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4477E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
              >
                {Array.from({ length: 16 }, (_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reception Toggle */}
        <div>
          <h3 className="text-lg font-bold text-pink-primary mb-4">Reception</h3>
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={hasReception}
              onChange={(e) => setHasReception(e.target.checked)}
              className="w-5 h-5 accent-pink-primary cursor-pointer"
            />
            <span className="text-sm font-medium text-pink-primary">
              Reception after ceremony
            </span>
          </label>

          {hasReception && (
            <div className="space-y-4 pl-7">
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={hasCocktailHour}
                    onChange={(e) => setHasCocktailHour(e.target.checked)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-sm font-medium text-pink-primary">
                    Cocktail hour
                  </span>
                </label>
                
                {hasCocktailHour && (
                  <select
                    value={cocktailHourDuration}
                    onChange={(e) => setCocktailHourDuration(Number(e.target.value))}
                    className="ml-7 pl-4 pr-12 h-[40px] rounded-lg border-2 border-pink-primary/50 text-pink-primary text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-primary/20 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4477E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-primary mb-2">
                  Dinner Style
                </label>
              <select
                value={dinnerStyle}
                onChange={(e) => setDinnerStyle(e.target.value as DinnerStyle)}
                className="w-full pl-4 pr-12 h-[48px] rounded-xl border-2 border-pink-primary/50 text-pink-primary text-base bg-white focus:outline-none focus:ring-2 focus:ring-pink-primary/20 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4477E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
              >
                  <option value="plated">Plated dinner</option>
                  <option value="buffet">Buffet</option>
                  <option value="family-style">Family style</option>
                  <option value="cocktail-style">No formal dinner</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-pink-primary mb-2">
                  Total Reception Duration
                </label>
                <select
                  value={receptionDuration}
                  onChange={(e) => setReceptionDuration(Number(e.target.value))}
                  className="w-full pl-4 pr-12 h-[48px] rounded-xl border-2 border-pink-primary/50 text-pink-primary text-base bg-white focus:outline-none focus:ring-2 focus:ring-pink-primary/20 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4477E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
                >
                  <option value={4}>4 hours</option>
                  <option value={5}>5 hours</option>
                  <option value={6}>6 hours</option>
                  <option value={7}>7 hours</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-pink-primary mb-2">
                    Number of Speakers for Toasts
                  </label>
                  <select
                    value={numberOfSpeakers}
                    onChange={(e) => setNumberOfSpeakers(Number(e.target.value))}
                    className="w-full pl-4 pr-12 h-[48px] rounded-xl border-2 border-pink-primary/50 text-pink-primary text-base bg-white focus:outline-none focus:ring-2 focus:ring-pink-primary/20 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4477E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
                  >
                    {Array.from({ length: 7 }, (_, i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>

                {numberOfSpeakers > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-pink-primary mb-2">
                      Speech Vibe
                    </label>
                  <select
                    value={speechVibe}
                    onChange={(e) => setSpeechVibe(e.target.value as SpeechVibe)}
                    className="w-full pl-4 pr-12 h-[48px] rounded-xl border-2 border-pink-primary/50 text-pink-primary text-base bg-white focus:outline-none focus:ring-2 focus:ring-pink-primary/20 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4477E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
                  >
                      <option value="short">Short + sweet</option>
                      <option value="average">Average</option>
                      <option value="long">Long / emotional</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeParentDances}
                    onChange={(e) => setIncludeParentDances(e.target.checked)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-sm text-pink-primary">Parent dances</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeCakeCutting}
                    onChange={(e) => setIncludeCakeCutting(e.target.checked)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-sm text-pink-primary">Cake cutting</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeSendoff}
                    onChange={(e) => setIncludeSendoff(e.target.checked)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-sm text-pink-primary">Send-off</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button onClick={generateTimeline} className="flex-1">
            Generate Wedding Day Timeline
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
          {wakeUpWarning && (
            <div className={`mb-6 p-4 rounded-xl ${
              wakeUpWarning.startsWith('⚠️') 
                ? 'bg-amber-50 border-2 border-amber-200' 
                : 'bg-green-50 border-2 border-green-200'
            }`}>
              <p className={`text-sm font-medium ${
                wakeUpWarning.startsWith('⚠️') 
                  ? 'text-amber-800' 
                  : 'text-green-800'
              }`}>
                {wakeUpWarning}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-2 justify-center">
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
            <h3 className="text-xl font-bold text-pink-primary text-center">
              Your Wedding Day Timeline
            </h3>
          </div>
          
          <div className="space-y-2">
            {timeline.map((item, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 py-3 border-b border-pink-primary/10 last:border-0"
              >
                <div className="min-w-[100px]">
                  <span className="font-bold text-pink-primary">{item.time}</span>
                </div>
                <div className="flex-1">
                  <span className="text-pink-primary">{item.event}</span>
                  {item.duration && (
                    <span className="text-sm text-pink-primary/60 ml-2">({item.duration})</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-sm text-pink-primary/60 mt-6 pt-4 border-t border-pink-primary/10">
            This timeline is a guide. Adjust times based on your specific needs and vendor recommendations. Share with your photographer, videographer, coordinator, and wedding party.
          </p>
        </div>
      )}
    </div>
  )
}
