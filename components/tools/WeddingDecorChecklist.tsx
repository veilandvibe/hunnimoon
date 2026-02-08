'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import { Copy, Download, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

interface ChecklistItem {
  id: string
  label: string
  category: string
}

interface CategoryData {
  name: string
  items: string[]
}

const CHECKLIST_CATEGORIES: CategoryData[] = [
  {
    name: 'Ceremony Decor',
    items: [
      'Ceremony arch / arbor',
      'Arch florals',
      'Arch draping / fabric',
      'Altar arrangements',
      'Aisle runner',
      'Aisle florals',
      'Petals / confetti cones',
      'Reserved seating signs',
      'Reserved chair markers',
      'Welcome sign',
      'Ceremony programs',
      'Program holder / basket',
      'Unity ceremony items',
      'Officiant table decor',
      'Ceremony backdrop'
    ]
  },
  {
    name: 'Reception Decor',
    items: [
      'Reception entrance sign',
      'Table linens',
      'Table runners',
      'Napkins',
      'Charger plates',
      'Centerpieces',
      'Table numbers',
      'Table number holders',
      'Place cards',
      'Place card holders',
      'Escort cards',
      'Seating chart',
      'Seating chart stand',
      'Sweetheart table decor',
      'Head table decor',
      'Cake table decor',
      'Gift table decor',
      'Card box',
      'Dessert table decor'
    ]
  },
  {
    name: 'Floral Decor',
    items: [
      'Bridal bouquet',
      'Bridesmaid bouquets',
      'Boutonnieres',
      'Corsages',
      'Ceremony florals',
      'Reception florals',
      'Table greenery',
      'Floral garlands',
      'Floral installations',
      'Loose florals for styling'
    ]
  },
  {
    name: 'Lighting & Ambiance',
    items: [
      'Candles',
      'Votive candles',
      'Pillar candles',
      'LED candles',
      'Lanterns',
      'String lights',
      'Café lights',
      'Uplighting',
      'Spotlights',
      'Neon sign',
      'Monogram lighting',
      'Fairy lights'
    ]
  },
  {
    name: 'Signage',
    items: [
      'Welcome sign',
      'Seating chart sign',
      'Bar sign',
      'Guest book sign',
      'Cards & gifts sign',
      'Dessert sign',
      'Bathroom basket sign',
      'No phones / unplugged ceremony sign',
      'Directional signs'
    ]
  },
  {
    name: 'Tabletop & Styling Details',
    items: [
      'Menu cards',
      'Menu stands',
      'Napkin rings',
      'Coasters',
      'Chair decor',
      'Chair signs',
      'Chair sashes',
      'Table accents',
      'Decorative trays'
    ]
  },
  {
    name: 'Personal Touches',
    items: [
      'Guest book',
      'Guest book table decor',
      'Favors',
      'Favor tags',
      'Favor display',
      'Memory table',
      'Memorial sign',
      'Photo display',
      'Custom signage',
      'Cultural decor items'
    ]
  },
  {
    name: 'Bar Decor',
    items: [
      'Bar signage',
      'Drink menu',
      'Signature drink signs',
      'Bar florals',
      'Cocktail napkins',
      'Straw holders',
      'Garnish display'
    ]
  },
  {
    name: 'Lounge & Specialty Areas',
    items: [
      'Lounge furniture',
      'Pillows',
      'Throws / blankets',
      'Low tables',
      'Area rugs',
      'Photo booth backdrop',
      'Photo booth props',
      'Photo booth signage'
    ]
  },
  {
    name: 'Outdoor / Venue Extras',
    items: [
      'Ceremony chairs',
      'Reception chairs',
      'Heaters',
      'Fans',
      'Umbrella basket',
      'Bug spray station',
      'Sunscreen station',
      'Water station signage',
      'Lawn games',
      'Lawn game signage'
    ]
  },
  {
    name: 'Miscellaneous',
    items: [
      'Extra candles',
      'Extra signage stands',
      'Tape / adhesive',
      'Zip ties',
      'Scissors',
      'Emergency decor kit'
    ]
  }
]

export default function WeddingDecorChecklist() {
  // Initialize all items as unchecked
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  // Generate unique ID for each item
  const getItemId = (category: string, item: string) => {
    return `${category}-${item}`.replace(/\s+/g, '-').toLowerCase()
  }

  // Toggle individual item
  const toggleItem = (category: string, item: string) => {
    const itemId = getItemId(category, item)
    const newChecked = new Set(checkedItems)
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId)
    } else {
      newChecked.add(itemId)
    }
    setCheckedItems(newChecked)
  }

  // Toggle all items in a category
  const toggleCategory = (categoryName: string) => {
    const category = CHECKLIST_CATEGORIES.find(c => c.name === categoryName)
    if (!category) return

    const categoryItemIds = category.items.map(item => getItemId(categoryName, item))
    const allChecked = categoryItemIds.every(id => checkedItems.has(id))

    const newChecked = new Set(checkedItems)
    if (allChecked) {
      // Uncheck all
      categoryItemIds.forEach(id => newChecked.delete(id))
    } else {
      // Check all
      categoryItemIds.forEach(id => newChecked.add(id))
    }
    setCheckedItems(newChecked)
  }

  // Toggle category collapse
  const toggleCollapse = (categoryName: string) => {
    const newCollapsed = new Set(collapsedCategories)
    if (newCollapsed.has(categoryName)) {
      newCollapsed.delete(categoryName)
    } else {
      newCollapsed.add(categoryName)
    }
    setCollapsedCategories(newCollapsed)
  }

  // Check if category has any checked items
  const getCategoryCheckedCount = (categoryName: string) => {
    const category = CHECKLIST_CATEGORIES.find(c => c.name === categoryName)
    if (!category) return 0
    return category.items.filter(item => checkedItems.has(getItemId(categoryName, item))).length
  }

  // Get selected items grouped by category
  const getSelectedItems = (): Array<{ category: string; items: string[] }> => {
    const selected: Array<{ category: string; items: string[] }> = []
    
    CHECKLIST_CATEGORIES.forEach(category => {
      const selectedInCategory = category.items.filter(item => 
        checkedItems.has(getItemId(category.name, item))
      )
      if (selectedInCategory.length > 0) {
        selected.push({
          category: category.name,
          items: selectedInCategory
        })
      }
    })
    
    return selected
  }

  // Copy checklist to clipboard
  const handleCopyChecklist = () => {
    const selectedItems = getSelectedItems()
    
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item')
      return
    }

    let output = ''
    selectedItems.forEach(({ category, items }) => {
      output += `${category}\n`
      items.forEach(item => {
        output += `☐ ${item}\n`
      })
      output += '\n'
    })

    navigator.clipboard.writeText(output.trim())
    toast.success('Checklist copied!')
  }

  // Download PDF
  const handleDownloadPDF = () => {
    const selectedItems = getSelectedItems()
    
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item')
      return
    }

    const doc = new jsPDF()

    // Title
    doc.setFontSize(22)
    doc.setTextColor(212, 71, 126) // Pink
    doc.text('Wedding Decor Checklist', 20, 25)

    // Subtitle
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Your selected decor items', 20, 33)

    let y = 50

    selectedItems.forEach(({ category, items }) => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage()
        y = 20
      }

      // Category heading
      doc.setFontSize(14)
      doc.setTextColor(212, 71, 126) // Pink
      doc.setFont('helvetica', 'bold')
      doc.text(category, 20, y)
      y += 8

      // Items
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')

      items.forEach(item => {
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

      y += 5 // Extra space between categories
    })

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text('Created with Hunnimoon', 105, 285, { align: 'center' })
    }

    doc.save('wedding-decor-checklist.pdf')
    toast.success('PDF downloaded!')
  }

  const totalSelected = checkedItems.size

  return (
    <div className="max-w-4xl mx-auto mb-16">
      {/* Checklist Form */}
      <div className="bg-pink-light rounded-2xl p-6 md:p-8 space-y-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-pink-primary mb-2">
            Select Your Decor Items
          </h2>
          <p className="text-sm text-pink-primary/70">
            Check the items you need for your wedding. You can select or deselect entire categories.
          </p>
        </div>

        {/* Categories */}
        {CHECKLIST_CATEGORIES.map((category) => {
          const isCollapsed = collapsedCategories.has(category.name)
          const checkedCount = getCategoryCheckedCount(category.name)
          const allChecked = checkedCount === category.items.length

          return (
            <div
              key={category.name}
              className="bg-white rounded-xl border-2 border-pink-primary/10 overflow-hidden"
            >
              {/* Category Header */}
              <div className="bg-pink-primary/5 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      onChange={() => toggleCategory(category.name)}
                      className="w-5 h-5 accent-pink-primary cursor-pointer"
                    />
                    <div>
                      <h3 className="font-bold text-pink-primary">
                        {category.name}
                      </h3>
                      <p className="text-xs text-pink-primary/60">
                        {checkedCount} of {category.items.length} selected
                      </p>
                    </div>
                  </label>
                </div>
                <button
                  onClick={() => toggleCollapse(category.name)}
                  className="p-2 hover:bg-pink-primary/10 rounded-lg transition-colors"
                  aria-label={isCollapsed ? 'Expand category' : 'Collapse category'}
                >
                  {isCollapsed ? (
                    <ChevronDown className="w-5 h-5 text-pink-primary" />
                  ) : (
                    <ChevronUp className="w-5 h-5 text-pink-primary" />
                  )}
                </button>
              </div>

              {/* Category Items */}
              {!isCollapsed && (
                <div className="p-4 space-y-2">
                  {category.items.map((item) => {
                    const itemId = getItemId(category.name, item)
                    const isChecked = checkedItems.has(itemId)

                    return (
                      <label
                        key={itemId}
                        className="flex items-center gap-3 p-2 hover:bg-pink-primary/5 rounded-lg cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItem(category.name, item)}
                          className="w-4 h-4 accent-pink-primary cursor-pointer"
                        />
                        <span className="text-sm text-pink-primary">
                          {item}
                        </span>
                      </label>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Action Buttons */}
        <div className="pt-6 border-t-2 border-pink-primary/10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-pink-primary">
              {totalSelected} item{totalSelected !== 1 ? 's' : ''} selected
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={handleCopyChecklist}
              variant="outline"
              size="lg"
              fullWidth
              disabled={totalSelected === 0}
            >
              <Copy className="w-4 h-4" />
              Copy Checklist
            </Button>
            <Button
              onClick={handleDownloadPDF}
              variant="primary"
              size="lg"
              fullWidth
              disabled={totalSelected === 0}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
