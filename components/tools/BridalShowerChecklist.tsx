'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Toggle from '@/components/ui/Toggle'
import { Copy, Download, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

interface ChecklistSection {
  title: string
  items: string[]
}

type HostType = 'bride' | 'maidOfHonor' | 'bridesmaids' | 'family' | 'friend' | 'multiple'
type ShowerType = 'traditional' | 'brunch' | 'tea' | 'garden' | 'restaurant' | 'atHome' | 'destination' | 'themed' | 'surprise'
type GuestCount = 'under10' | '10-20' | '20-40' | '40+'
type LocationType = 'privateHome' | 'restaurant' | 'eventVenue' | 'outdoor'
type Timeline = '3+months' | '2months' | '1month' | '2-3weeks' | 'less2weeks'
type DecorLevel = 'minimal' | 'standard' | 'fullPinterest'

export default function BridalShowerChecklist() {
  const [host, setHost] = useState<HostType>('maidOfHonor')
  const [showerType, setShowerType] = useState<ShowerType>('traditional')
  const [guestCount, setGuestCount] = useState<GuestCount>('10-20')
  const [location, setLocation] = useState<LocationType>('privateHome')
  const [timeline, setTimeline] = useState<Timeline>('3+months')
  const [includeGames, setIncludeGames] = useState(true)
  const [openGifts, setOpenGifts] = useState(true)
  const [fullMeal, setFullMeal] = useState(true)
  const [includeAlcohol, setIncludeAlcohol] = useState(true)
  const [decorLevel, setDecorLevel] = useState<DecorLevel>('standard')
  const [generatedChecklist, setGeneratedChecklist] = useState<{
    sections: ChecklistSection[]
    header: string
    subheader: string
  } | null>(null)

  const generateChecklist = () => {
    const sections: ChecklistSection[] = []
    
    // Generate header text
    const hostText = host === 'bride' 
      ? "For a shower you're planning yourself"
      : "For the shower you're hosting"
    
    const showerTypeLabel = {
      traditional: 'Traditional Bridal Shower',
      brunch: 'Brunch Shower',
      tea: 'Tea Party',
      garden: 'Garden Party',
      restaurant: 'Restaurant Event',
      atHome: 'At-Home Shower',
      destination: 'Destination Shower',
      themed: 'Themed Shower',
      surprise: 'Surprise Shower'
    }[showerType]
    
    const guestCountLabel = {
      'under10': 'Under 10 guests',
      '10-20': '10-20 guests',
      '20-40': '20-40 guests',
      '40+': '40+ guests'
    }[guestCount]
    
    const locationLabel = {
      privateHome: 'Private Home',
      restaurant: 'Restaurant',
      eventVenue: 'Event Venue',
      outdoor: 'Outdoor Space'
    }[location]

    const header = 'Your Bridal Shower Checklist'
    const subheader = `For a ${showerTypeLabel} with ${guestCountLabel} at a ${locationLabel}`

    // Generate sections based on timeline
    if (timeline === '3+months') {
      // Full timeline
      
      // 8-12 Weeks Before
      const weeks8to12 = [
        'Set budget',
        'Confirm host responsibilities',
        'Choose date',
        'Draft guest list',
        'Choose theme'
      ]
      if (location !== 'privateHome') {
        weeks8to12.push('Book venue')
      }
      if (location === 'restaurant') {
        weeks8to12.push('Discuss menu options with restaurant')
      }
      if (location === 'outdoor') {
        weeks8to12.push('Plan weather backup')
      }
      if (showerType === 'destination') {
        weeks8to12.push('Confirm travel logistics')
      }
      if (showerType === 'surprise') {
        weeks8to12.push('Coordinate with key people to keep surprise')
      }
      sections.push({
        title: '8-12 Weeks Before',
        items: weeks8to12
      })

      // 6-8 Weeks Before
      const weeks6to8 = ['Send invitations']
      if (location !== 'restaurant') {
        weeks6to8.push('Plan menu')
      } else {
        weeks6to8.push('Confirm restaurant menu selections', 'Finalize headcount estimate')
      }
      if (includeGames) {
        weeks6to8.push('Plan games')
      }
      if (decorLevel === 'fullPinterest') {
        weeks6to8.push('Order decor', 'Order custom signage', 'Plan styled photo area')
      } else if (decorLevel === 'standard') {
        weeks6to8.push('Order decor')
      }
      if (location !== 'restaurant' && location !== 'eventVenue') {
        weeks6to8.push('Arrange rentals (if needed)')
      }
      if (includeAlcohol && location !== 'restaurant') {
        weeks6to8.push('Plan bar setup')
      }
      sections.push({
        title: '6-8 Weeks Before',
        items: weeks6to8
      })

      // 3-4 Weeks Before
      const weeks3to4 = ['Track RSVPs']
      if (location !== 'restaurant') {
        weeks3to4.push('Order cake/desserts', 'Finalize menu quantities')
      } else {
        weeks3to4.push('Confirm final headcount with restaurant', 'Finalize menu selections')
      }
      if (includeGames) {
        weeks3to4.push('Purchase game prizes')
      }
      if (guestCount === '20-40' || guestCount === '40+') {
        if (location !== 'restaurant') {
          weeks3to4.push('Confirm seating layout')
        }
      }
      sections.push({
        title: '3-4 Weeks Before',
        items: weeks3to4
      })

      // 1 Week Before
      const week1 = ['Confirm timeline of event']
      if (location !== 'restaurant') {
        week1.push('Confirm vendors', 'Buy non-perishable items')
        if (decorLevel !== 'minimal') {
          week1.push('Prep decor')
        }
      } else {
        week1.push('Confirm reservation details', 'Confirm any special requests')
      }
      if (includeAlcohol && location !== 'restaurant') {
        week1.push('Purchase alcohol and mixers')
      }
      if (includeGames) {
        week1.push('Print game materials')
      }
      if (location === 'outdoor') {
        week1.push('Check weather forecast')
      }
      sections.push({
        title: '1 Week Before',
        items: week1
      })

      // Day Before
      const dayBefore = ['Confirm bride arrival']
      if (location === 'privateHome') {
        if (decorLevel !== 'minimal') {
          dayBefore.push('Set up decor')
        }
        dayBefore.push('Pick up food', 'Organize serving supplies')
        if (includeAlcohol) {
          dayBefore.push('Chill drinks')
        }
      } else if (location === 'eventVenue') {
        dayBefore.push('Coordinate venue access', 'Confirm setup time')
        if (includeAlcohol) {
          dayBefore.push('Chill drinks')
        }
      } else if (location === 'restaurant') {
        dayBefore.push('Confirm reservation time', 'Confirm any dietary restrictions')
      } else if (location === 'outdoor') {
        dayBefore.push('Check weather forecast', 'Confirm backup plan if needed')
        if (includeAlcohol) {
          dayBefore.push('Chill drinks')
        }
      }
      sections.push({
        title: 'Day Before',
        items: dayBefore
      })

      // Day Of
      const dayOf = ['Take photos']
      if (location === 'privateHome') {
        dayOf.unshift('Set up welcome area', 'Set up food')
        if (includeAlcohol) {
          dayOf.push('Set up drink station')
        }
      } else if (location === 'eventVenue') {
        dayOf.unshift('Arrive early for setup', 'Coordinate with venue staff')
      } else if (location === 'restaurant') {
        dayOf.unshift('Arrive on time', 'Check in with restaurant host')
      } else if (location === 'outdoor') {
        dayOf.unshift('Check weather conditions')
        if (decorLevel !== 'minimal') {
          dayOf.push('Set up shade/tent if needed')
        }
        dayOf.push('Set up welcome area')
      }
      if (includeGames) {
        dayOf.push('Run games')
      }
      if (openGifts) {
        dayOf.push('Assign someone to track gifts')
      }
      sections.push({
        title: 'Day Of',
        items: dayOf
      })

    } else if (timeline === '2months' || timeline === '1month') {
      // Compressed timeline
      
      // 4-6 Weeks Out
      const fourToSix = [
        'Set budget',
        'Choose date and venue',
        'Draft guest list',
        'Send invitations',
        'Choose theme'
      ]
      if (location !== 'restaurant') {
        fourToSix.push('Plan menu basics')
      } else {
        fourToSix.push('Review restaurant menu options')
      }
      sections.push({ title: '4-6 Weeks Out', items: fourToSix })

      // 2-3 Weeks Out
      const twoToThree = ['Track RSVPs']
      if (location !== 'restaurant') {
        twoToThree.push('Order decor and supplies', 'Order cake/desserts', 'Finalize quantities')
      } else {
        twoToThree.push('Confirm final headcount', 'Finalize menu choices')
      }
      if (includeGames) {
        twoToThree.push('Plan games')
      }
      if (includeAlcohol && location !== 'restaurant') {
        twoToThree.push('Plan bar setup')
      }
      sections.push({ title: '2-3 Weeks Out', items: twoToThree })

      // 1 Week Out
      const oneWeekOut = []
      if (location !== 'restaurant') {
        oneWeekOut.push('Confirm vendors', 'Buy supplies', 'Prep decor')
      } else {
        oneWeekOut.push('Confirm reservation')
      }
      if (includeGames) {
        oneWeekOut.push('Print materials')
      }
      if (location === 'outdoor') {
        oneWeekOut.push('Check weather forecast')
      }
      oneWeekOut.push('Plan setup')
      sections.push({ title: '1 Week Out', items: oneWeekOut })

      // Final Days
      const finalDays = ['Confirm details', 'Organize day-of roles']
      if (location === 'privateHome' || location === 'outdoor') {
        finalDays.unshift('Pick up food', 'Set up decor')
        if (includeAlcohol) {
          finalDays.push('Chill drinks')
        }
      } else if (location === 'restaurant') {
        finalDays.unshift('Confirm arrival time')
      } else if (location === 'eventVenue') {
        finalDays.unshift('Confirm venue access')
        if (includeAlcohol) {
          finalDays.push('Chill drinks')
        }
      }
      sections.push({ title: 'Final Days', items: finalDays })
      
    } else {
      // Immediate timeline (2-3 weeks or less)
      
      // Do Immediately
      const immediate = ['Send digital invites']
      if (location !== 'restaurant') {
        immediate.unshift('Confirm venue', 'Finalize food plan', 'Order quick-ship decor')
      } else {
        immediate.unshift('Confirm restaurant reservation', 'Review menu')
      }
      sections.push({ title: 'Do Immediately', items: immediate })

      // This Week
      const thisWeek = ['Confirm RSVPs', 'Assign setup roles']
      if (location !== 'restaurant') {
        thisWeek.push('Buy supplies')
      }
      if (includeGames) {
        thisWeek.push('Print materials')
      }
      if (location === 'outdoor') {
        thisWeek.push('Check weather forecast')
      }
      sections.push({ title: 'This Week', items: thisWeek })

      // Final Days
      const finalDays = ['Confirm final details']
      if (location === 'privateHome' || location === 'outdoor') {
        finalDays.unshift('Prep food', 'Pack supplies')
      } else if (location === 'restaurant') {
        finalDays.unshift('Confirm arrival time')
      } else if (location === 'eventVenue') {
        finalDays.unshift('Confirm venue access')
      }
      sections.push({ title: 'Final Days', items: finalDays })
    }

    setGeneratedChecklist({
      sections,
      header,
      subheader: `${hostText}. ${subheader}. Timeline: ${timeline.replace('months', ' months').replace('weeks', ' weeks').replace('2weeks', '2 weeks')}`
    })

    toast.success('Checklist generated!')
  }

  const handleCopy = () => {
    if (!generatedChecklist) return

    let text = `${generatedChecklist.header}\n${generatedChecklist.subheader}\n\n`
    
    generatedChecklist.sections.forEach(section => {
      text += `${section.title}\n`
      section.items.forEach(item => {
        text += `[ ] ${item}\n`
      })
      text += '\n'
    })

    navigator.clipboard.writeText(text)
    toast.success('Checklist copied to clipboard!')
  }

  const handleDownloadPDF = () => {
    if (!generatedChecklist) return

    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(22)
    doc.setTextColor(212, 71, 126) // pink-primary
    doc.text(generatedChecklist.header, 105, 20, { align: 'center' })
    
    // Subheader
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    const subheaderLines = doc.splitTextToSize(generatedChecklist.subheader, 170)
    doc.text(subheaderLines, 105, 30, { align: 'center' })
    
    // Content
    let yPosition = 45
    
    generatedChecklist.sections.forEach((section) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }
      
      // Section header
      doc.setFontSize(14)
      doc.setTextColor(212, 71, 126)
      doc.text(section.title, 20, yPosition)
      yPosition += 8
      
      // Items
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      section.items.forEach((item) => {
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
        
        // Draw checkbox
        doc.setDrawColor(212, 71, 126) // pink-primary border
        doc.setLineWidth(0.5)
        doc.rect(20, yPosition - 3, 3, 3) // x, y, width, height
        
        // Add text with proper spacing
        doc.text(item, 26, yPosition)
        yPosition += 7
      })
      yPosition += 5
    })
    
    // Footer on every page
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text('Created with Hunnimoon', 105, 285, { align: 'center' })
    }
    
    doc.save('bridal-shower-checklist.pdf')
    toast.success('Checklist downloaded!')
  }

  const handleReset = () => {
    setHost('maidOfHonor')
    setShowerType('traditional')
    setGuestCount('10-20')
    setLocation('privateHome')
    setTimeline('3+months')
    setIncludeGames(true)
    setOpenGifts(true)
    setFullMeal(true)
    setIncludeAlcohol(true)
    setDecorLevel('standard')
    setGeneratedChecklist(null)
    toast.success('Form reset!')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Tool Form */}
      <div className="bg-white rounded-2xl border-2 border-pink-primary/10 p-6 md:p-8 mb-8">
        {/* Section 1: Event Details */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-pink-primary mb-6">Event Details</h3>
          
          {/* Who is Hosting */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-pink-primary mb-3">
              Who Is Hosting?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { value: 'bride' as HostType, label: 'Bride' },
                { value: 'maidOfHonor' as HostType, label: 'Maid of Honor' },
                { value: 'bridesmaids' as HostType, label: 'Bridesmaids' },
                { value: 'family' as HostType, label: 'Family Member' },
                { value: 'friend' as HostType, label: 'Friend' },
                { value: 'multiple' as HostType, label: 'Multiple Hosts' }
              ].map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="host"
                    value={option.value}
                    checked={host === option.value}
                    onChange={(e) => setHost(e.target.value as HostType)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Shower Type */}
          <div className="mb-6">
            <Select
              label="Shower Type"
              value={showerType}
              onChange={(e) => setShowerType(e.target.value as ShowerType)}
              options={[
                { value: 'traditional', label: 'Traditional Bridal Shower' },
                { value: 'brunch', label: 'Brunch Shower' },
                { value: 'tea', label: 'Tea Party' },
                { value: 'garden', label: 'Garden Party' },
                { value: 'restaurant', label: 'Restaurant Event' },
                { value: 'atHome', label: 'At-Home Shower' },
                { value: 'destination', label: 'Destination Shower' },
                { value: 'themed', label: 'Themed Shower' },
                { value: 'surprise', label: 'Surprise Shower' }
              ]}
            />
          </div>

          {/* Guest Count */}
          <div className="mb-6">
            <Select
              label="Estimated Guest Count"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value as GuestCount)}
              options={[
                { value: 'under10', label: 'Under 10' },
                { value: '10-20', label: '10-20' },
                { value: '20-40', label: '20-40' },
                { value: '40+', label: '40+' }
              ]}
            />
          </div>

          {/* Location Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-pink-primary mb-3">
              Location Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'privateHome' as LocationType, label: 'Private Home' },
                { value: 'restaurant' as LocationType, label: 'Restaurant' },
                { value: 'eventVenue' as LocationType, label: 'Event Venue' },
                { value: 'outdoor' as LocationType, label: 'Outdoor Space' }
              ].map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="location"
                    value={option.value}
                    checked={location === option.value}
                    onChange={(e) => setLocation(e.target.value as LocationType)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-6">
            <Select
              label="Timeline"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value as Timeline)}
              options={[
                { value: '3+months', label: '3+ months away' },
                { value: '2months', label: '2 months away' },
                { value: '1month', label: '1 month away' },
                { value: '2-3weeks', label: '2-3 weeks away' },
                { value: 'less2weeks', label: 'Less than 2 weeks' }
              ]}
            />
          </div>
        </div>

        {/* Section 2: Optional Elements */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-pink-primary mb-6">Optional Elements</h3>
          
          {/* Include Games */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-pink-primary/10">
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-1">
                Include Games?
              </label>
              <p className="text-sm text-pink-primary/60">Add game planning and coordination tasks</p>
            </div>
            <Toggle checked={includeGames} onChange={setIncludeGames} />
          </div>

          {/* Open Gifts */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-pink-primary/10">
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-1">
                Open Gifts During Event?
              </label>
              <p className="text-sm text-pink-primary/60">Assign gift tracking and coordination</p>
            </div>
            <Toggle checked={openGifts} onChange={setOpenGifts} />
          </div>

          {/* Meal Type */}
          <div className="mb-6 pb-6 border-b border-pink-primary/10">
            <label className="block text-sm font-medium text-pink-primary mb-3">
              Serve Full Meal?
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: true, label: 'Full Meal' },
                { value: false, label: 'Light Bites Only' }
              ].map(option => (
                <label key={String(option.value)} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="fullMeal"
                    value={String(option.value)}
                    checked={fullMeal === option.value}
                    onChange={() => setFullMeal(option.value)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Include Alcohol */}
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-pink-primary/10">
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-1">
                Include Alcohol?
              </label>
              <p className="text-sm text-pink-primary/60">Add bar planning tasks</p>
            </div>
            <Toggle checked={includeAlcohol} onChange={setIncludeAlcohol} />
          </div>

          {/* Decor Level */}
          <div className="mb-0">
            <label className="block text-sm font-medium text-pink-primary mb-3">
              Decor Level
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { value: 'minimal' as DecorLevel, label: 'Minimal' },
                { value: 'standard' as DecorLevel, label: 'Standard' },
                { value: 'fullPinterest' as DecorLevel, label: 'Full Pinterest Mode' }
              ].map(option => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="decorLevel"
                    value={option.value}
                    checked={decorLevel === option.value}
                    onChange={(e) => setDecorLevel(e.target.value as DecorLevel)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={generateChecklist} fullWidth size="lg">
          Generate Checklist
        </Button>
      </div>

      {/* Output */}
      {generatedChecklist && (
        <div className="bg-white rounded-2xl border-2 border-pink-primary/10 p-6 md:p-8">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <Button onClick={handleCopy} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copy Checklist
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-pink-primary mb-2">
              {generatedChecklist.header}
            </h3>
            <p className="text-pink-primary/70 text-sm">
              {generatedChecklist.subheader}
            </p>
          </div>

          {/* Checklist Sections */}
          <div className="space-y-8">
            {generatedChecklist.sections.map((section, index) => (
              <div key={index}>
                <h4 className="text-lg font-bold text-pink-primary mb-4">
                  {section.title}
                </h4>
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-start gap-3 p-3 bg-pink-light rounded-lg hover:bg-pink-primary/10 transition-colors"
                    >
                      <div className="w-5 h-5 rounded border-2 border-pink-primary flex-shrink-0 mt-0.5" />
                      <span className="text-pink-primary">{item}</span>
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
