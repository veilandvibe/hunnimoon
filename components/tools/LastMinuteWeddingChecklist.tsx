'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { Copy, Download, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

// Master checklist data
const MASTER_CHECKLIST = {
  twoWeeksOut: [
    'Confirm final guest count deadline',
    'Follow up on outstanding RSVPs',
    'Confirm vendor balances due',
    'Finalize seating chart draft',
    'Confirm ceremony script with officiant',
    'Confirm dress/suit pickup',
    'Break in shoes',
    'Plan vendor tip amounts',
    'Confirm rehearsal logistics'
  ],
  weekOf: [
    'Confirm vendor arrival times',
    'Send final timeline to wedding party',
    'Confirm final guest count with caterer',
    'Prepare seating chart display',
    'Pack décor for venue drop-off',
    'Confirm transportation schedule',
    'Prepare thank-you gifts',
    'Confirm cake delivery time',
    'Assign someone to collect gifts/cards'
  ],
  threeFourDays: [
    'Print vows',
    'Confirm ceremony order',
    'Final beauty schedule check',
    'Confirm DJ announcements',
    'Confirm photographer arrival time',
    'Organize vendor payment envelopes'
  ],
  oneTwoDays: [
    'Pack emergency kit',
    'Lay out full outfit including accessories',
    'Steam attire',
    'Charge devices',
    'Prepare rings',
    'Reconfirm weather forecast',
    'Confirm marriage license location'
  ],
  immediate: [
    'Confirm vendor arrival times',
    'Confirm final headcount',
    'Organize payment envelopes',
    'Prepare seating chart',
    'Confirm transportation'
  ],
  doNow: [
    'Lay out attire',
    'Prepare rings',
    'Pack emergency kit',
    'Confirm vendor timing',
    'Sleep'
  ],
  morningOf: [
    'Eat breakfast',
    'Hydrate',
    'Give vendor contact sheet to trusted person',
    'Silence notifications',
    'Stick to timeline'
  ],
  destination: [
    'Travel documents packed',
    'Attire in carry-on',
    'Local vendor contact sheet printed',
    'Weather forecast checked',
    'Local marriage requirements confirmed',
    'Backup vendor contact list saved',
    'Extra timeline buffer built in'
  ],
  oftenForgotten: [
    'Vendor meals arranged',
    'Marriage license witness confirmed',
    'Cash for tips ready',
    'Overnight bag packed',
    'Decor pick-up plan for next day',
    'Rental return plan confirmed',
    'Printed vendor contact list backup'
  ],
  emotional: [
    'Build 15 minutes of "nothing" into your morning',
    'Decide now who handles problems that day (not you)',
    'Bring water to getting-ready space',
    'Accept that something small will go wrong',
    'Stay off group chats',
    'Choose one moment to mentally pause during ceremony',
    'Hand your phone to someone during reception'
  ]
}

const COMPLETED_OPTIONS = [
  'Final headcount confirmed',
  'Vendor final numbers sent',
  'Final payments scheduled',
  'Tip envelopes prepared',
  'Rehearsal confirmed',
  'Officiant script finalized',
  'Ceremony music confirmed',
  'DJ playlist sent',
  'Photographer shot list sent',
  'Family photo list created',
  'Welcome bags prepared',
  'Marriage license picked up',
  'Backup weather plan confirmed',
  'Emergency contact person assigned',
  'Wedding party timeline shared'
]

interface ChecklistSection {
  title: string
  items: string[]
}

export default function LastMinuteWeddingChecklist() {
  const [weddingDate, setWeddingDate] = useState('')
  const [weddingType, setWeddingType] = useState<'local' | 'destination'>('local')
  const [weddingSize, setWeddingSize] = useState('50-100')
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set())
  const [hideCompleted, setHideCompleted] = useState(false)
  const [includeEmotionalReminders, setIncludeEmotionalReminders] = useState(false)
  const [generatedChecklist, setGeneratedChecklist] = useState<{
    sections: ChecklistSection[]
    daysUntil: number
    priority5: string[]
    header: string
    subheader: string
  } | null>(null)

  const toggleCompletedItem = (item: string) => {
    const newCompleted = new Set(completedItems)
    if (newCompleted.has(item)) {
      newCompleted.delete(item)
    } else {
      newCompleted.add(item)
    }
    setCompletedItems(newCompleted)
  }

  const calculateDaysUntil = (selectedDate: string): number => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const wedding = new Date(selectedDate)
    wedding.setHours(0, 0, 0, 0)
    const daysUntil = Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntil
  }

  const filterItemsBySize = (items: string[]): string[] => {
    // For larger weddings, keep all items
    if (weddingSize === '200+') {
      return items
    }
    // For smaller weddings, remove scale-based reminders
    if (weddingSize === 'under-50') {
      return items.filter(item => 
        !item.toLowerCase().includes('seating chart') ||
        item.toLowerCase().includes('draft')
      )
    }
    return items
  }

  const generateChecklist = () => {
    if (!weddingDate) {
      toast.error('Please select a wedding date')
      return
    }

    const daysUntil = calculateDaysUntil(weddingDate)

    // Handle past dates
    if (daysUntil < 0) {
      toast.error('Your selected date has already passed.')
      return
    }

    const sections: ChecklistSection[] = []
    let header = ''
    let subheader = ''

    // Determine scenario and build sections
    if (daysUntil >= 30) {
      // Scenario 1: 30+ days away
      header = `Your wedding is in ${daysUntil} days.`
      subheader = 'This checklist is designed for the final stretch.'
      
      sections.push({ title: '2 Weeks Out', items: filterItemsBySize(MASTER_CHECKLIST.twoWeeksOut) })
      sections.push({ title: 'Week Of', items: filterItemsBySize(MASTER_CHECKLIST.weekOf) })
      sections.push({ title: '3–4 Days Before', items: MASTER_CHECKLIST.threeFourDays })
      sections.push({ title: '1–2 Days Before', items: MASTER_CHECKLIST.oneTwoDays })
      sections.push({ title: 'Morning Of', items: MASTER_CHECKLIST.morningOf })
    } else if (daysUntil >= 14) {
      // Scenario 2: 14-29 days away
      header = `Your wedding is in ${daysUntil} days.`
      subheader = 'Here\'s what to focus on right now.'
      
      sections.push({ title: '2 Weeks Out', items: filterItemsBySize(MASTER_CHECKLIST.twoWeeksOut) })
      sections.push({ title: 'Week Of', items: filterItemsBySize(MASTER_CHECKLIST.weekOf) })
      sections.push({ title: '3–4 Days Before', items: MASTER_CHECKLIST.threeFourDays })
      sections.push({ title: '1–2 Days Before', items: MASTER_CHECKLIST.oneTwoDays })
      sections.push({ title: 'Morning Of', items: MASTER_CHECKLIST.morningOf })
    } else if (daysUntil >= 7) {
      // Scenario 3: 7-13 days away
      header = `Your wedding is in ${daysUntil} days.`
      subheader = 'Here\'s what needs attention.'
      
      sections.push({ title: 'Week Of', items: filterItemsBySize(MASTER_CHECKLIST.weekOf) })
      sections.push({ title: '3–4 Days Before', items: MASTER_CHECKLIST.threeFourDays })
      sections.push({ title: '1–2 Days Before', items: MASTER_CHECKLIST.oneTwoDays })
      sections.push({ title: 'Morning Of', items: MASTER_CHECKLIST.morningOf })
    } else if (daysUntil >= 3) {
      // Scenario 4: 3-6 days away
      header = `Your wedding is in ${daysUntil} days.`
      subheader = 'Focus on these immediate tasks.'
      
      sections.push({ title: 'Immediate (Do Today)', items: MASTER_CHECKLIST.immediate })
      sections.push({ title: '1–2 Days Before', items: MASTER_CHECKLIST.oneTwoDays })
      sections.push({ title: 'Morning Of', items: MASTER_CHECKLIST.morningOf })
    } else {
      // Scenario 5: 0-2 days away
      header = `Your wedding is ${daysUntil === 0 ? 'today' : daysUntil === 1 ? 'tomorrow' : `in ${daysUntil} days`}.`
      subheader = 'Stay calm and focus on essentials.'
      
      sections.push({ title: 'Do Now', items: MASTER_CHECKLIST.doNow })
      sections.push({ title: 'Morning Of', items: MASTER_CHECKLIST.morningOf })
    }

    // Add destination section if needed
    if (weddingType === 'destination') {
      sections.push({ title: 'If Destination Wedding', items: MASTER_CHECKLIST.destination })
    }

    // Always add often forgotten
    sections.push({ title: 'Often Forgotten Details', items: MASTER_CHECKLIST.oftenForgotten })

    // Add emotional reminders if toggled
    if (includeEmotionalReminders) {
      sections.push({ title: 'Calm Reminders for the Day', items: MASTER_CHECKLIST.emotional })
    }

    // Filter out completed items if hide toggle is on
    let filteredSections = sections
    if (hideCompleted && completedItems.size > 0) {
      filteredSections = sections.map(section => ({
        ...section,
        items: section.items.filter(item => !completedItems.has(item))
      })).filter(section => section.items.length > 0)
    }

    // Generate Priority 5
    const priority5 = generatePriority5(sections, daysUntil)

    setGeneratedChecklist({
      sections: filteredSections,
      daysUntil,
      priority5,
      header,
      subheader
    })
  }

  const generatePriority5 = (sections: ChecklistSection[], daysUntil: number): string[] => {
    // Get the most urgent section based on days until wedding
    let urgentItems: string[] = []
    
    if (daysUntil >= 14) {
      urgentItems = [...MASTER_CHECKLIST.twoWeeksOut, ...MASTER_CHECKLIST.weekOf]
    } else if (daysUntil >= 7) {
      urgentItems = MASTER_CHECKLIST.weekOf
    } else if (daysUntil >= 3) {
      urgentItems = [...MASTER_CHECKLIST.immediate, ...MASTER_CHECKLIST.threeFourDays]
    } else {
      urgentItems = [...MASTER_CHECKLIST.doNow, ...MASTER_CHECKLIST.morningOf]
    }

    // Return first 5 items
    return urgentItems.slice(0, 5)
  }

  const handleCopy = () => {
    if (!generatedChecklist) return

    let text = `${generatedChecklist.header}\n${generatedChecklist.subheader}\n\n`
    
    generatedChecklist.sections.forEach(section => {
      text += `${section.title}\n`
      section.items.forEach(item => {
        text += `• ${item}\n`
      })
      text += '\n'
    })

    text += 'Top 5 Things to Focus on Right Now\n'
    generatedChecklist.priority5.forEach(item => {
      text += `• ${item}\n`
    })

    navigator.clipboard.writeText(text)
    toast.success('Checklist copied to clipboard!')
  }

  const handleDownloadPDF = () => {
    if (!generatedChecklist) return

    const doc = new jsPDF()
    let yPos = 25

    // Title
    doc.setFontSize(22)
    doc.setTextColor(212, 71, 126) // Pink
    doc.setFont('helvetica', 'bold')
    doc.text('Last Minute Wedding Checklist', 20, yPos)
    yPos += 8

    // Subtitle
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    doc.text(`${generatedChecklist.header} - ${generatedChecklist.subheader}`, 20, yPos)
    yPos += 15

    // Sections
    generatedChecklist.sections.forEach(section => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      // Section heading
      doc.setFontSize(14)
      doc.setTextColor(212, 71, 126) // Pink
      doc.setFont('helvetica', 'bold')
      doc.text(section.title, 20, yPos)
      yPos += 8

      // Items with checkboxes
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')

      section.items.forEach(item => {
        if (yPos > 275) {
          doc.addPage()
          yPos = 20
        }
        
        // Draw empty checkbox
        doc.setDrawColor(212, 71, 126) // Pink border
        doc.rect(25, yPos - 3.5, 4, 4)
        
        // Add item text
        doc.text(item, 32, yPos)
        yPos += 7
      })
      yPos += 5
    })

    // Priority 5 Section
    if (yPos > 220) {
      doc.addPage()
      yPos = 20
    }

    // Priority 5 heading
    doc.setFontSize(16)
    doc.setTextColor(212, 71, 126) // Pink
    doc.setFont('helvetica', 'bold')
    doc.text('Top 5 Things to Focus on Right Now', 20, yPos)
    yPos += 10

    // Priority 5 items
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')

    generatedChecklist.priority5.forEach((item, idx) => {
      if (yPos > 275) {
        doc.addPage()
        yPos = 20
      }
      
      // Number
      doc.setTextColor(212, 71, 126) // Pink
      doc.setFont('helvetica', 'bold')
      doc.text(`${idx + 1}.`, 25, yPos)
      
      // Item text
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.text(item, 32, yPos)
      yPos += 7
    })

    // Footer on last page
    const pageCount = doc.internal.pages.length - 1
    doc.setPage(pageCount)
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.setFont('helvetica', 'normal')
    doc.text('Generated by Hunnimoon - Your Wedding Planning Assistant', 20, 285)

    doc.save('last-minute-wedding-checklist.pdf')
    toast.success('PDF downloaded!')
  }

  const handleReset = () => {
    setWeddingDate('')
    setWeddingType('local')
    setWeddingSize('50-100')
    setCompletedItems(new Set())
    setHideCompleted(false)
    setIncludeEmotionalReminders(false)
    setGeneratedChecklist(null)
    toast.success('Form reset')
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-pink-primary mb-6">
        Generate Your Last Minute Checklist
      </h2>

      {/* Form */}
      <div className="space-y-6 mb-8">
        {/* Wedding Date */}
        <div>
          <label className="block text-sm font-semibold text-pink-primary mb-2">
            Wedding Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={weddingDate}
            onChange={(e) => setWeddingDate(e.target.value)}
            className="w-full px-4 py-3 border-2 border-pink-primary/20 rounded-xl focus:border-pink-primary focus:outline-none text-pink-primary"
          />
        </div>

        {/* Wedding Type */}
        <div>
          <label className="block text-sm font-semibold text-pink-primary mb-3">
            Wedding Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="local"
                checked={weddingType === 'local'}
                onChange={(e) => setWeddingType(e.target.value as 'local' | 'destination')}
                className="w-5 h-5 text-pink-primary focus:ring-pink-primary border-pink-primary/30"
              />
              <span className="ml-2 text-pink-primary">Local wedding</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                value="destination"
                checked={weddingType === 'destination'}
                onChange={(e) => setWeddingType(e.target.value as 'local' | 'destination')}
                className="w-5 h-5 text-pink-primary focus:ring-pink-primary border-pink-primary/30"
              />
              <span className="ml-2 text-pink-primary">Destination wedding</span>
            </label>
          </div>
        </div>

        {/* Wedding Size */}
        <div>
          <label className="block text-sm font-semibold text-pink-primary mb-2">
            Wedding Size
          </label>
          <select
            value={weddingSize}
            onChange={(e) => setWeddingSize(e.target.value)}
            className="w-full px-4 py-3 pr-10 border-2 border-pink-primary/20 rounded-xl focus:border-pink-primary focus:outline-none text-pink-primary appearance-none bg-white bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23D4477E%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat"
          >
            <option value="under-50">Under 50 guests</option>
            <option value="50-100">50–100 guests</option>
            <option value="100-200">100–200 guests</option>
            <option value="200+">200+</option>
          </select>
        </div>

        {/* What's Already Completed */}
        <div>
          <label className="block text-sm font-semibold text-pink-primary mb-3">
            What's Already Completed? (Optional)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-4 bg-pink-light/30 rounded-xl">
            {COMPLETED_OPTIONS.map((item) => (
              <label key={item} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={completedItems.has(item)}
                  onChange={() => toggleCompletedItem(item)}
                  className="w-4 h-4 text-pink-primary focus:ring-pink-primary border-pink-primary/30 rounded"
                />
                <span className="ml-2 text-sm text-pink-primary">{item}</span>
              </label>
            ))}
          </div>
          
          {/* Hide Completed Toggle */}
          <label className="flex items-center cursor-pointer mt-3">
            <input
              type="checkbox"
              checked={hideCompleted}
              onChange={(e) => setHideCompleted(e.target.checked)}
              className="w-4 h-4 text-pink-primary focus:ring-pink-primary border-pink-primary/30 rounded"
            />
            <span className="ml-2 text-sm text-pink-primary font-medium">
              Hide completed items from output
            </span>
          </label>
        </div>

        {/* Emotional Reminders Toggle */}
        <div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={includeEmotionalReminders}
              onChange={(e) => setIncludeEmotionalReminders(e.target.checked)}
              className="w-4 h-4 text-pink-primary focus:ring-pink-primary border-pink-primary/30 rounded"
            />
            <span className="ml-2 text-sm text-pink-primary font-medium">
              Include calm reminders for the day
            </span>
          </label>
        </div>

        {/* Generate Button */}
        <Button onClick={generateChecklist} fullWidth size="lg">
          Generate Checklist
        </Button>
      </div>

      {/* Output */}
      {generatedChecklist && (
        <div className="border-t-2 border-pink-primary/10 pt-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-pink-primary mb-2">
              {generatedChecklist.header}
            </h3>
            <p className="text-lg text-pink-primary/70">
              {generatedChecklist.subheader}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <Button onClick={handleCopy} variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copy Checklist
            </Button>
            <Button onClick={handleDownloadPDF} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download as PDF
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Form
            </Button>
          </div>

          {/* Checklist Sections */}
          <div className="space-y-8 mb-12">
            {generatedChecklist.sections.map((section, idx) => (
              <div key={idx} className="bg-pink-light/20 rounded-xl p-6">
                <h4 className="text-xl font-bold text-pink-primary mb-4">
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start">
                      <span className="text-pink-primary mr-2">•</span>
                      <span className="text-pink-primary">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Priority 5 */}
          <div className="bg-pink-primary/5 border-2 border-pink-primary rounded-xl p-6 mb-8">
            <h4 className="text-2xl font-bold text-pink-primary mb-4">
              Top 5 Things to Focus on Right Now
            </h4>
            <ul className="space-y-3">
              {generatedChecklist.priority5.map((item, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="text-xl font-bold text-pink-primary mr-3">{idx + 1}.</span>
                  <span className="text-pink-primary font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center bg-pink-light rounded-xl p-8">
            <p className="text-lg text-pink-primary mb-4 font-semibold">
              Feeling like this is cutting it close?
            </p>
            <Button
              onClick={() => window.location.href = '/login'}
              size="lg"
            >
              Start organizing your full wedding plan
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
