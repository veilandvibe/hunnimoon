'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Copy, Download, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

interface ChecklistSection {
  title: string
  items: string[]
}

export default function WeddingVenueChecklist() {
  // Form state
  const [guestCount, setGuestCount] = useState<string>('')
  const [season, setSeason] = useState<string>('')
  const [sameLocation, setSameLocation] = useState<string>('')
  const [indoorOutdoor, setIndoorOutdoor] = useState<string>('')
  const [destinationWedding, setDestinationWedding] = useState<string>('')
  const [smoking, setSmoking] = useState<string>('')
  const [venueType, setVenueType] = useState<string>('')

  // Checklist state
  const [checklist, setChecklist] = useState<ChecklistSection[] | null>(null)

  // Generate checklist based on inputs
  const generateChecklist = () => {
    // Validation
    if (!guestCount) {
      toast.error('Please enter guest count')
      return
    }

    const count = parseInt(guestCount)
    if (count < 10 || count > 500) {
      toast.error('Guest count must be between 10 and 500')
      return
    }

    if (!season) {
      toast.error('Please select wedding season')
      return
    }

    if (!sameLocation) {
      toast.error('Please select ceremony & reception location')
      return
    }

    if (!indoorOutdoor) {
      toast.error('Please select indoor/outdoor setup')
      return
    }

    if (!destinationWedding) {
      toast.error('Please select if destination wedding')
      return
    }

    if (!smoking) {
      toast.error('Please select smoking expectation')
      return
    }

    if (!venueType) {
      toast.error('Please select venue type')
      return
    }

    // Build checklist
    const sections: ChecklistSection[] = []

    // Section 1: Capacity & Layout (Always Included)
    const capacityItems = [
      'Confirm maximum guest capacity',
      'Confirm seated vs standing capacity',
      'Is there enough space for a dance floor?',
      'Is there a weather backup plan?',
      'Is the venue ADA accessible?',
      'Parking availability?',
      'Separate cocktail hour space?',
      'Bridal suite available?',
      'Groom suite available?',
    ]

    if (count > 150) {
      capacityItems.push('Confirm adequate restroom count for guest volume')
    }

    if (indoorOutdoor === 'outdoor' || indoorOutdoor === 'both') {
      capacityItems.push('Confirm tent requirements')
      capacityItems.push('Confirm weather contingency plan')
    }

    sections.push({
      title: 'Capacity & Layout',
      items: capacityItems,
    })

    // Section 2: What's Included (Venue Type Specific)
    const whatsIncludedItems: string[] = []

    switch (venueType) {
      case 'all-inclusive':
        whatsIncludedItems.push(
          'Catering included?',
          'Bar service included?',
          'Tables & chairs included?',
          'Linens included?',
          'Setup & teardown included?',
          'Day-of coordinator included?',
          'Basic décor included?'
        )
        break
      case 'banquet-hall':
        whatsIncludedItems.push(
          'In-house catering required?',
          'Vendor restrictions?',
          'Table layout flexibility?',
          'Curfew restrictions?',
          'Setup crew included?'
        )
        break
      case 'hotel':
        whatsIncludedItems.push(
          'Room block discounts?',
          'Catering minimum?',
          'Ballroom size options?',
          'AV equipment included?'
        )
        break
      case 'restaurant':
        whatsIncludedItems.push(
          'Full buyout required?',
          'Guest capacity limitations?',
          'Private dining room available?',
          'Noise restrictions?'
        )
        break
      case 'raw-space':
        whatsIncludedItems.push(
          'Tables provided?',
          'Chairs provided?',
          'Power capacity?',
          'Kitchen access?',
          'Restrooms adequate?',
          'Need to rent all furniture?',
          'Cleanup responsibility?'
        )
        break
      case 'barn':
        whatsIncludedItems.push(
          'Climate control?',
          'Flooring condition?',
          'Restroom trailer required?',
          'Generator required?'
        )
        break
      case 'beach':
        whatsIncludedItems.push(
          'Permit required?',
          'Public access interference?',
          'Wind contingency?',
          'Sound amplification allowed?'
        )
        break
      case 'church':
        whatsIncludedItems.push(
          'Ceremony-only?',
          'Reception allowed?',
          'Religious restrictions?',
          'Decor restrictions?'
        )
        break
      case 'backyard':
        whatsIncludedItems.push(
          'Local event permits required?',
          'Noise bylaws?',
          'Tent needed?',
          'Portable restrooms required?',
          'Liability insurance required?'
        )
        break
      case 'destination-resort':
        whatsIncludedItems.push(
          'Package tiers?',
          'Guest minimum stay?',
          'Legal marriage requirements?',
          'Vendor restrictions?'
        )
        break
    }

    sections.push({
      title: 'What\'s Included',
      items: whatsIncludedItems,
    })

    // Section 3: Costs & Contract (Always Included)
    const costsItems = [
      'Rental fee',
      'Deposit amount',
      'Payment schedule',
      'Overtime fees',
      'Cleaning fees',
      'Service charges',
      'Gratuity included?',
      'Cancellation policy',
      'Refund policy',
      'Insurance required?',
      'Damage deposit required?',
      'Vendor insurance requirements?',
    ]

    if (destinationWedding === 'yes') {
      costsItems.push(
        'Local permit requirements',
        'Marriage license requirements',
        'Currency exchange considerations'
      )
    }

    sections.push({
      title: 'Costs & Contract',
      items: costsItems,
    })

    // Section 4: Vendor Rules (Always Included)
    const vendorItems = [
      'Preferred vendor list?',
      'Outside vendors allowed?',
      'Vendor arrival time restrictions?',
      'Noise restrictions?',
      'Hard end time?',
      'Amplified music limits?',
      'Open flame allowed?',
      'Sparkler exit allowed?',
      'Confetti allowed?',
    ]

    if (venueType === 'banquet-hall') {
      vendorItems.push('In-house DJ requirement?', 'Mandatory security?')
    }

    sections.push({
      title: 'Vendor Rules',
      items: vendorItems,
    })

    // Section 5: Catering & Bar
    const cateringItems: string[] = []

    // Assume all-inclusive and hotel include catering
    const includesCatering = venueType === 'all-inclusive' || venueType === 'hotel'

    if (includesCatering) {
      cateringItems.push(
        'Menu customization allowed?',
        'Tasting included?',
        'Dietary accommodations?',
        'Kids meals available?',
        'Vendor meals required?'
      )
    } else {
      cateringItems.push(
        'Outside catering allowed?',
        'Kitchen access?',
        'Corkage fee?',
        'Cake cutting fee?'
      )
    }

    // Add alcohol items
    cateringItems.push(
      'Liquor license provided?',
      'Open bar vs limited?',
      'Cash bar allowed?',
      'Outside alcohol allowed?',
      'Bartenders provided?'
    )

    sections.push({
      title: 'Catering & Bar',
      items: cateringItems,
    })

    // Section 6: Timeline & Access (Always Included)
    sections.push({
      title: 'Timeline & Access',
      items: [
        'What time can vendors arrive?',
        'What time can guests arrive?',
        'When must event end?',
        'Setup window?',
        'Breakdown window?',
        'Storage allowed overnight?',
        'Early access available for rehearsal?',
      ],
    })

    // Section 7: Logistics & Guest Comfort (Always Included)
    const logisticsItems = [
      'Heating / AC?',
      'Backup power?',
      'Lighting included?',
      'Restroom quality?',
      'Nearby hotels?',
      'Transportation required?',
      'Shuttle service needed?',
      'Cell reception reliable?',
      'Wi-Fi available?',
    ]

    if (season === 'winter') {
      logisticsItems.push('Snow removal plan?')
    }

    if (season === 'summer') {
      logisticsItems.push('Cooling plan for guests?')
    }

    sections.push({
      title: 'Logistics & Guest Comfort',
      items: logisticsItems,
    })

    // Section 8: Smoking & Property Policies
    const smokingItems = ['Confirm smoking policy', 'Confirm vaping policy']

    if (smoking === 'yes') {
      smokingItems.push(
        'Designated smoking area?',
        'Distance from event space?',
        'Ashtrays provided?',
        'Re-entry policy?',
        'Fines for violations?',
        'Security enforcement?'
      )
    }

    if (venueType === 'beach' || venueType === 'backyard') {
      smokingItems.push('Local smoking bylaws?')
    }

    sections.push({
      title: 'Smoking & Property Policies',
      items: smokingItems,
    })

    // Section 9: Final Decision Questions (Always Included)
    sections.push({
      title: 'Final Decision Questions',
      items: [
        'Does this venue match our style?',
        'Does the layout flow naturally?',
        'Do we feel comfortable here?',
        'Does the staff feel responsive?',
        'Can we see ourselves getting married here?',
        'Does this venue fit our budget realistically?',
        'Are there any red flags?',
      ],
    })

    setChecklist(sections)
    toast.success('Checklist generated!')
  }

  // Copy checklist to clipboard
  const handleCopy = () => {
    if (!checklist) return

    let output = 'Wedding Venue Checklist\n\n'

    checklist.forEach((section) => {
      output += `${section.title}\n`
      section.items.forEach((item) => {
        output += `☐ ${item}\n`
      })
      output += '\n'
    })

    navigator.clipboard.writeText(output.trim())
    toast.success('Checklist copied!')
  }

  // Download PDF
  const handleDownloadPDF = () => {
    if (!checklist) return

    const doc = new jsPDF()

    // Title
    doc.setFontSize(22)
    doc.setTextColor(212, 71, 126) // Pink
    doc.text('Wedding Venue Checklist', 20, 25)

    // Subtitle
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Your personalized venue evaluation checklist', 20, 33)

    let y = 50

    checklist.forEach((section) => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage()
        y = 20
      }

      // Section heading
      doc.setFontSize(14)
      doc.setTextColor(212, 71, 126) // Pink
      doc.setFont('helvetica', 'bold')
      doc.text(section.title, 20, y)
      y += 8

      // Items
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')

      section.items.forEach((item) => {
        if (y > 270) {
          doc.addPage()
          y = 20
        }

        // Draw empty checkbox
        doc.rect(25, y - 3.5, 4, 4)

        // Add item text
        doc.text(item, 32, y)
        y += 7
      })

      y += 5 // Extra space between sections
    })

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text('Created with Hunnimoon', 105, 285, { align: 'center' })
    }

    doc.save('wedding-venue-checklist.pdf')
    toast.success('PDF downloaded!')
  }

  // Reset form
  const handleReset = () => {
    setGuestCount('')
    setSeason('')
    setSameLocation('')
    setIndoorOutdoor('')
    setDestinationWedding('')
    setSmoking('')
    setVenueType('')
    setChecklist(null)
    toast.success('Form reset!')
  }

  return (
    <div className="max-w-4xl mx-auto mb-16">
      {/* Form */}
      <div className="bg-pink-light rounded-2xl p-6 md:p-8 space-y-8">
        {/* Section 1: Wedding Basics */}
        <div>
          <h2 className="text-xl font-bold text-pink-primary mb-4">Wedding Basics</h2>

          <div className="space-y-6">
            {/* Guest Count */}
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-2">
                Estimated guest count
              </label>
              <Input
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                placeholder="Enter guest count (10-500)"
                min="10"
                max="500"
              />
            </div>

            {/* Wedding Season */}
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-2">
                Wedding season
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full pl-4 pr-12 h-[48px] rounded-xl border-2 border-pink-primary/50 text-pink-primary text-base bg-white focus:outline-none focus:ring-2 focus:ring-pink-primary/20 transition-all duration-200 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23D4477E%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat"
              >
                <option value="">Select season</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
              </select>
            </div>

            {/* Same Location */}
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-3">
                Ceremony & reception at same location?
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sameLocation"
                    value="yes"
                    checked={sameLocation === 'yes'}
                    onChange={(e) => setSameLocation(e.target.value)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">Yes</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sameLocation"
                    value="no"
                    checked={sameLocation === 'no'}
                    onChange={(e) => setSameLocation(e.target.value)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">No</span>
                </label>
              </div>
            </div>

            {/* Indoor/Outdoor */}
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-3">
                Indoor / Outdoor setup?
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="indoorOutdoor"
                    value="indoor"
                    checked={indoorOutdoor === 'indoor'}
                    onChange={(e) => setIndoorOutdoor(e.target.value)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">Indoor only</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="indoorOutdoor"
                    value="outdoor"
                    checked={indoorOutdoor === 'outdoor'}
                    onChange={(e) => setIndoorOutdoor(e.target.value)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">Outdoor only</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="indoorOutdoor"
                    value="both"
                    checked={indoorOutdoor === 'both'}
                    onChange={(e) => setIndoorOutdoor(e.target.value)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">Both</span>
                </label>
              </div>
            </div>

            {/* Destination Wedding */}
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-3">
                Destination wedding?
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="destinationWedding"
                    value="yes"
                    checked={destinationWedding === 'yes'}
                    onChange={(e) => setDestinationWedding(e.target.value)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">Yes</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="destinationWedding"
                    value="no"
                    checked={destinationWedding === 'no'}
                    onChange={(e) => setDestinationWedding(e.target.value)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">No</span>
                </label>
              </div>
            </div>

            {/* Smoking */}
            <div>
              <label className="block text-sm font-medium text-pink-primary mb-3">
                Do you expect guests to smoke or vape?
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="smoking"
                    value="yes"
                    checked={smoking === 'yes'}
                    onChange={(e) => setSmoking(e.target.value)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">Yes</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="smoking"
                    value="no"
                    checked={smoking === 'no'}
                    onChange={(e) => setSmoking(e.target.value)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">No</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="smoking"
                    value="not-sure"
                    checked={smoking === 'not-sure'}
                    onChange={(e) => setSmoking(e.target.value)}
                    className="w-5 h-5 accent-pink-primary cursor-pointer"
                  />
                  <span className="text-pink-primary">Not sure</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Venue Type */}
        <div>
          <h2 className="text-xl font-bold text-pink-primary mb-4">Venue Type</h2>

          <div className="space-y-2">
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-pink-primary/5 transition-colors">
              <input
                type="radio"
                name="venueType"
                value="all-inclusive"
                checked={venueType === 'all-inclusive'}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-pink-primary">All-inclusive venue</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-pink-primary/5 transition-colors">
              <input
                type="radio"
                name="venueType"
                value="banquet-hall"
                checked={venueType === 'banquet-hall'}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-pink-primary">Banquet hall</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-pink-primary/5 transition-colors">
              <input
                type="radio"
                name="venueType"
                value="hotel"
                checked={venueType === 'hotel'}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-pink-primary">Hotel</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-pink-primary/5 transition-colors">
              <input
                type="radio"
                name="venueType"
                value="restaurant"
                checked={venueType === 'restaurant'}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-pink-primary">Restaurant</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-pink-primary/5 transition-colors">
              <input
                type="radio"
                name="venueType"
                value="raw-space"
                checked={venueType === 'raw-space'}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-pink-primary">Raw space / industrial loft</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-pink-primary/5 transition-colors">
              <input
                type="radio"
                name="venueType"
                value="barn"
                checked={venueType === 'barn'}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-pink-primary">Barn / farm</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-pink-primary/5 transition-colors">
              <input
                type="radio"
                name="venueType"
                value="beach"
                checked={venueType === 'beach'}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-pink-primary">Beach</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-pink-primary/5 transition-colors">
              <input
                type="radio"
                name="venueType"
                value="church"
                checked={venueType === 'church'}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-pink-primary">Church</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-pink-primary/5 transition-colors">
              <input
                type="radio"
                name="venueType"
                value="backyard"
                checked={venueType === 'backyard'}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-pink-primary">Backyard / private property</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer p-3 bg-white rounded-lg hover:bg-pink-primary/5 transition-colors">
              <input
                type="radio"
                name="venueType"
                value="destination-resort"
                checked={venueType === 'destination-resort'}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-pink-primary">Destination resort</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t-2 border-pink-primary/10 flex flex-col sm:flex-row gap-3">
          <Button onClick={generateChecklist} variant="primary" size="lg" fullWidth>
            Generate Checklist
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg" fullWidth>
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Output */}
      {checklist && (
        <div className="mt-8 bg-white rounded-2xl p-6 md:p-8 border-2 border-pink-primary/10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-pink-primary mb-2">
              Your Wedding Venue Checklist
            </h2>
            <p className="text-sm text-pink-primary/70">
              Print this checklist or save it as a PDF to take with you during venue tours.
            </p>
          </div>

          {/* Checklist Sections */}
          <div className="space-y-6 mb-8">
            {checklist.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold text-pink-primary mb-3">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start gap-3">
                      <span className="text-pink-primary/40 select-none">☐</span>
                      <span className="text-pink-primary">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-6 border-t-2 border-pink-primary/10">
            <Button onClick={handleCopy} variant="outline" size="lg" fullWidth>
              <Copy className="w-4 h-4" />
              Copy Checklist
            </Button>
            <Button onClick={handleDownloadPDF} variant="primary" size="lg" fullWidth>
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
