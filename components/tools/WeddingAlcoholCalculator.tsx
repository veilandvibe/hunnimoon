'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'
import { Copy, Download, RotateCcw } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'

type DrinkingLevel = 'light' | 'moderate' | 'heavy'
type UnitSystem = 'us' | 'metric'
type PricingMode = 'skip' | 'venue' | 'diy'

interface CalculationResult {
  totalDrinks: number
  beerDrinks: number
  wineDrinks: number
  spiritsDrinks: number
  beerCount: number
  beerCases: number
  wineBottles: number
  spiritsBottles: number
  estimatedCost?: number
  unitSystem: UnitSystem
}

export default function WeddingAlcoholCalculator() {
  // Basic inputs
  const [guests, setGuests] = useState('')
  const [eventDuration, setEventDuration] = useState('')
  
  // Drinking level
  const [drinkingLevel, setDrinkingLevel] = useState<DrinkingLevel>('moderate')
  
  // Alcohol types
  const [includeBeer, setIncludeBeer] = useState(true)
  const [includeWine, setIncludeWine] = useState(true)
  const [includeSpirits, setIncludeSpirits] = useState(true)
  
  // Alcohol percentages
  const [beerPercent, setBeerPercent] = useState('40')
  const [winePercent, setWinePercent] = useState('40')
  const [spiritsPercent, setSpiritsPercent] = useState('20')
  
  // Unit system
  const [unitSystem, setUnitSystem] = useState<UnitSystem>('us')
  
  // Pricing mode
  const [pricingMode, setPricingMode] = useState<PricingMode>('skip')
  const [venuePerDrinkCost, setVenuePerDrinkCost] = useState('')
  const [beerCaseCost, setBeerCaseCost] = useState('')
  const [wineBottleCost, setWineBottleCost] = useState('')
  const [spiritsBottleCost, setSpiritsBottleCost] = useState('')
  
  // Results
  const [result, setResult] = useState<CalculationResult | null>(null)

  const drinkingMultipliers = {
    light: 0.75,
    moderate: 1.0,
    heavy: 1.25
  }

  // Calculate current percentage total for live feedback
  const currentPercentTotal = 
    (includeBeer ? (parseFloat(beerPercent) || 0) : 0) +
    (includeWine ? (parseFloat(winePercent) || 0) : 0) +
    (includeSpirits ? (parseFloat(spiritsPercent) || 0) : 0)
  
  const percentIsValid = Math.abs(currentPercentTotal - 100) < 0.01

  const handleCalculate = () => {
    // Validation
    const guestCount = parseInt(guests)
    const hours = parseFloat(eventDuration)
    
    if (!guestCount || guestCount <= 0) {
      toast.error('Please enter a valid number of guests')
      return
    }
    
    if (!hours || hours <= 0) {
      toast.error('Please enter a valid event duration')
      return
    }
    
    if (!includeBeer && !includeWine && !includeSpirits) {
      toast.error('Please select at least one alcohol type')
      return
    }
    
    // Validate percentages total 100
    const beerPct = includeBeer ? parseFloat(beerPercent) || 0 : 0
    const winePct = includeWine ? parseFloat(winePercent) || 0 : 0
    const spiritsPct = includeSpirits ? parseFloat(spiritsPercent) || 0 : 0
    const totalPercent = beerPct + winePct + spiritsPct
    
    if (Math.abs(totalPercent - 100) > 0.01) {
      toast.error('Alcohol percentages must total 100%')
      return
    }
    
    // Calculate total drinks
    const multiplier = drinkingMultipliers[drinkingLevel]
    const totalDrinks = Math.ceil(guestCount * hours * multiplier)
    
    // Calculate drinks per type using user's percentages
    const beerDrinks = Math.ceil(totalDrinks * (beerPct / 100))
    const wineDrinks = Math.ceil(totalDrinks * (winePct / 100))
    const spiritsDrinks = Math.ceil(totalDrinks * (spiritsPct / 100))
    
    // Convert to quantities
    // Beer: 355ml per drink, 24 beers per case
    const beerCount = beerDrinks
    const beerCases = Math.ceil(beerCount / 24)
    
    // Wine: 150ml per glass, 750ml per bottle = 5 glasses per bottle
    const wineBottles = Math.ceil(wineDrinks / 5)
    
    // Spirits: 44ml per pour, 750ml per bottle = ~17 pours per bottle
    const spiritsBottles = Math.ceil(spiritsDrinks / 17)
    
    // Calculate cost if pricing is enabled
    let estimatedCost: number | undefined
    
    if (pricingMode === 'venue') {
      const perDrinkCost = parseFloat(venuePerDrinkCost)
      if (perDrinkCost && perDrinkCost > 0) {
        estimatedCost = Math.ceil(totalDrinks * perDrinkCost)
      }
    } else if (pricingMode === 'diy') {
      const beerCost = parseFloat(beerCaseCost) || 0
      const wineCost = parseFloat(wineBottleCost) || 0
      const spiritsCost = parseFloat(spiritsBottleCost) || 0
      
      const totalBeerCost = includeBeer ? beerCases * beerCost : 0
      const totalWineCost = includeWine ? wineBottles * wineCost : 0
      const totalSpiritsCost = includeSpirits ? spiritsBottles * spiritsCost : 0
      
      estimatedCost = Math.ceil(totalBeerCost + totalWineCost + totalSpiritsCost)
    }
    
    setResult({
      totalDrinks,
      beerDrinks,
      wineDrinks,
      spiritsDrinks,
      beerCount,
      beerCases,
      wineBottles,
      spiritsBottles,
      estimatedCost,
      unitSystem
    })
    
    toast.success('Alcohol needs calculated')
  }

  const resetPercentages = () => {
    setBeerPercent('40')
    setWinePercent('40')
    setSpiritsPercent('20')
    toast.success('Percentages reset to defaults')
  }

  const handleReset = () => {
    setGuests('')
    setEventDuration('')
    setDrinkingLevel('moderate')
    setIncludeBeer(true)
    setIncludeWine(true)
    setIncludeSpirits(true)
    setBeerPercent('40')
    setWinePercent('40')
    setSpiritsPercent('20')
    setUnitSystem('us')
    setPricingMode('skip')
    setVenuePerDrinkCost('')
    setBeerCaseCost('')
    setWineBottleCost('')
    setSpiritsBottleCost('')
    setResult(null)
    toast.success('Calculator reset')
  }

  const handleCopy = () => {
    if (!result) return
    
    const drinkingLevelText = drinkingLevel.charAt(0).toUpperCase() + drinkingLevel.slice(1)
    const unitText = unitSystem === 'us' ? 'ounces' : 'milliliters'
    
    let text = `Wedding Alcohol Calculator Results\n\n`
    text += `Event Details:\n`
    text += `• Guests: ${guests}\n`
    text += `• Event Duration: ${eventDuration} hours\n`
    text += `• Drinking Level: ${drinkingLevelText}\n\n`
    
    text += `Alcohol Breakdown:\n`
    text += `• Total Drinks: ${result.totalDrinks}\n`
    
    if (includeBeer) {
      text += `• Beer (${beerPercent}%): ${result.beerCases} cases (${result.beerCount} beers)\n`
    }
    if (includeWine) {
      text += `• Wine (${winePercent}%): ${result.wineBottles} bottles\n`
    }
    if (includeSpirits) {
      text += `• Spirits (${spiritsPercent}%): ${result.spiritsBottles} bottles\n`
    }
    
    text += `\nUnit System: ${unitText}\n`
    
    if (result.estimatedCost) {
      text += `\nEstimated Alcohol Cost: $${result.estimatedCost.toLocaleString()}\n`
    }
    
    text += `\nDisclaimer: This is an estimate only. Always confirm with your venue or alcohol provider.`
    
    navigator.clipboard.writeText(text)
    toast.success('Results copied to clipboard')
  }

  const handleDownloadPDF = () => {
    if (!result) return
    
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(22)
    doc.setTextColor(200, 39, 119) // Pink primary
    doc.text('Wedding Alcohol Calculator', 20, 25)
    
    // Subtitle
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('Your estimated alcohol needs', 20, 33)
    
    let y = 50
    
    // Event Details Section
    doc.setFontSize(14)
    doc.setTextColor(200, 39, 119)
    doc.setFont('helvetica', 'bold')
    doc.text('Event Details', 20, y)
    y += 8
    
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.text(`Guests: ${guests}`, 25, y)
    y += 6
    doc.text(`Event Duration: ${eventDuration} hours`, 25, y)
    y += 6
    const drinkingLevelText = drinkingLevel.charAt(0).toUpperCase() + drinkingLevel.slice(1)
    doc.text(`Drinking Level: ${drinkingLevelText}`, 25, y)
    y += 12
    
    // Alcohol Breakdown Section
    doc.setFontSize(14)
    doc.setTextColor(200, 39, 119)
    doc.setFont('helvetica', 'bold')
    doc.text('Alcohol Breakdown', 20, y)
    y += 8
    
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    doc.text(`Total Drinks: ${result.totalDrinks}`, 25, y)
    y += 8
    
    if (includeBeer) {
      doc.text(`Beer (${beerPercent}%): ${result.beerCases} cases (${result.beerCount} beers)`, 25, y)
      y += 6
    }
    if (includeWine) {
      doc.text(`Wine (${winePercent}%): ${result.wineBottles} bottles`, 25, y)
      y += 6
    }
    if (includeSpirits) {
      doc.text(`Spirits (${spiritsPercent}%): ${result.spiritsBottles} bottles`, 25, y)
      y += 6
    }
    
    y += 6
    const unitText = unitSystem === 'us' ? 'ounces' : 'milliliters'
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(`Unit System: ${unitText}`, 25, y)
    y += 10
    
    // Cost Section (if applicable)
    if (result.estimatedCost) {
      doc.setFontSize(14)
      doc.setTextColor(200, 39, 119)
      doc.setFont('helvetica', 'bold')
      doc.text('Estimated Cost', 20, y)
      y += 8
      
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.text(`Total: $${result.estimatedCost.toLocaleString()}`, 25, y)
      y += 12
    }
    
    // Disclaimer
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'italic')
    const disclaimer = 'This is an estimate only. Always confirm with your venue or alcohol provider.'
    const splitDisclaimer = doc.splitTextToSize(disclaimer, 170)
    doc.text(splitDisclaimer, 20, y)
    
    doc.save('wedding-alcohol-calculator.pdf')
    toast.success('PDF downloaded')
  }

  // Prepare chart data
  const chartData = result ? [
    includeBeer && result.beerDrinks > 0 ? { name: 'Beer', value: result.beerDrinks, color: '#F59E0B' } : null,
    includeWine && result.wineDrinks > 0 ? { name: 'Wine', value: result.wineDrinks, color: '#C82777' } : null,
    includeSpirits && result.spiritsDrinks > 0 ? { name: 'Spirits', value: result.spiritsDrinks, color: '#8B5CF6' } : null,
  ].filter(Boolean) as Array<{ name: string; value: number; color: string }> : []

  return (
    <Card className="p-6 md:p-8 mb-12 bg-white shadow-lg">
      <div className="space-y-6">
        {/* Basic Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              Number of Guests *
            </label>
            <Input
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              placeholder="e.g., 120"
              min="1"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              Event Duration (hours) *
            </label>
            <Input
              type="number"
              value={eventDuration}
              onChange={(e) => setEventDuration(e.target.value)}
              placeholder="e.g., 5"
              min="0.5"
              step="0.5"
            />
          </div>
        </div>

        {/* Drinking Level */}
        <div>
          <label className="block text-sm font-medium text-pink-primary mb-3">
            Drinking Level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(['light', 'moderate', 'heavy'] as DrinkingLevel[]).map((level) => (
              <label
                key={level}
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  drinkingLevel === level
                    ? 'border-pink-primary bg-pink-light'
                    : 'border-pink-primary/20 hover:border-pink-primary/40'
                }`}
              >
                <input
                  type="radio"
                  name="drinkingLevel"
                  value={level}
                  checked={drinkingLevel === level}
                  onChange={(e) => setDrinkingLevel(e.target.value as DrinkingLevel)}
                  className="mr-3"
                />
                <span className="text-pink-primary font-medium capitalize">{level}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-pink-primary/60 mt-2">
            Light: 0.75 drinks/guest/hour • Moderate: 1.0 drinks/guest/hour • Heavy: 1.25 drinks/guest/hour
          </p>
        </div>

        {/* Alcohol Types */}
        <div>
          <label className="block text-sm font-medium text-pink-primary mb-3">
            Alcohol Types Served
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="flex items-center p-4 border-2 border-pink-primary/20 rounded-xl cursor-pointer hover:border-pink-primary/40 transition-all">
              <input
                type="checkbox"
                checked={includeBeer}
                onChange={(e) => setIncludeBeer(e.target.checked)}
                className="mr-3"
              />
              <span className="text-pink-primary font-medium">Beer</span>
            </label>
            
            <label className="flex items-center p-4 border-2 border-pink-primary/20 rounded-xl cursor-pointer hover:border-pink-primary/40 transition-all">
              <input
                type="checkbox"
                checked={includeWine}
                onChange={(e) => setIncludeWine(e.target.checked)}
                className="mr-3"
              />
              <span className="text-pink-primary font-medium">Wine</span>
            </label>
            
            <label className="flex items-center p-4 border-2 border-pink-primary/20 rounded-xl cursor-pointer hover:border-pink-primary/40 transition-all">
              <input
                type="checkbox"
                checked={includeSpirits}
                onChange={(e) => setIncludeSpirits(e.target.checked)}
                className="mr-3"
              />
              <span className="text-pink-primary font-medium">Spirits</span>
            </label>
          </div>
        </div>

        {/* Alcohol Distribution Percentages */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-pink-primary">
              Alcohol Distribution
            </label>
            <button
              type="button"
              onClick={resetPercentages}
              className="text-xs text-pink-primary/60 hover:text-pink-primary underline"
            >
              Reset to defaults
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {includeBeer && (
              <div>
                <label className="block text-sm text-pink-primary/70 mb-2">
                  Beer %
                </label>
                <Input
                  type="number"
                  value={beerPercent}
                  onChange={(e) => setBeerPercent(e.target.value)}
                  placeholder="40"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            )}
            
            {includeWine && (
              <div>
                <label className="block text-sm text-pink-primary/70 mb-2">
                  Wine %
                </label>
                <Input
                  type="number"
                  value={winePercent}
                  onChange={(e) => setWinePercent(e.target.value)}
                  placeholder="40"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            )}
            
            {includeSpirits && (
              <div>
                <label className="block text-sm text-pink-primary/70 mb-2">
                  Spirits %
                </label>
                <Input
                  type="number"
                  value={spiritsPercent}
                  onChange={(e) => setSpiritsPercent(e.target.value)}
                  placeholder="20"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm font-medium text-pink-primary/70">
              Current Total:
            </p>
            <div className={`text-sm font-bold px-3 py-1 rounded-lg ${
              percentIsValid 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {currentPercentTotal.toFixed(1)}%
              {percentIsValid ? ' ✓' : ` (${currentPercentTotal > 100 ? 'over' : 'under'} by ${Math.abs(currentPercentTotal - 100).toFixed(1)}%)`}
            </div>
          </div>
        </div>

        {/* Unit System */}
        <div>
          <label className="block text-sm font-medium text-pink-primary mb-3">
            Unit System
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                unitSystem === 'us'
                  ? 'border-pink-primary bg-pink-light'
                  : 'border-pink-primary/20 hover:border-pink-primary/40'
              }`}
            >
              <input
                type="radio"
                name="unitSystem"
                value="us"
                checked={unitSystem === 'us'}
                onChange={(e) => setUnitSystem(e.target.value as UnitSystem)}
                className="mr-3"
              />
              <span className="text-pink-primary font-medium">US (ounces)</span>
            </label>
            
            <label
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                unitSystem === 'metric'
                  ? 'border-pink-primary bg-pink-light'
                  : 'border-pink-primary/20 hover:border-pink-primary/40'
              }`}
            >
              <input
                type="radio"
                name="unitSystem"
                value="metric"
                checked={unitSystem === 'metric'}
                onChange={(e) => setUnitSystem(e.target.value as UnitSystem)}
                className="mr-3"
              />
              <span className="text-pink-primary font-medium">Metric (milliliters)</span>
            </label>
          </div>
        </div>

        {/* Pricing Mode */}
        <div>
          <label className="block text-sm font-medium text-pink-primary mb-3">
            Cost Estimation (Optional)
          </label>
          <div className="space-y-3">
            <label
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                pricingMode === 'skip'
                  ? 'border-pink-primary bg-pink-light'
                  : 'border-pink-primary/20 hover:border-pink-primary/40'
              }`}
            >
              <input
                type="radio"
                name="pricingMode"
                value="skip"
                checked={pricingMode === 'skip'}
                onChange={(e) => setPricingMode(e.target.value as PricingMode)}
                className="mr-3"
              />
              <span className="text-pink-primary font-medium">Skip cost estimate</span>
            </label>
            
            <label
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                pricingMode === 'venue'
                  ? 'border-pink-primary bg-pink-light'
                  : 'border-pink-primary/20 hover:border-pink-primary/40'
              }`}
            >
              <input
                type="radio"
                name="pricingMode"
                value="venue"
                checked={pricingMode === 'venue'}
                onChange={(e) => setPricingMode(e.target.value as PricingMode)}
                className="mr-3"
              />
              <span className="text-pink-primary font-medium">Venue cost per drink</span>
            </label>
            
            {pricingMode === 'venue' && (
              <div className="ml-8 mt-3">
                <label className="block text-sm text-pink-primary/70 mb-2">
                  Cost per drink ($)
                </label>
                <Input
                  type="number"
                  value={venuePerDrinkCost}
                  onChange={(e) => setVenuePerDrinkCost(e.target.value)}
                  placeholder="e.g., 12"
                  min="0"
                  step="0.01"
                />
              </div>
            )}
            
            <label
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                pricingMode === 'diy'
                  ? 'border-pink-primary bg-pink-light'
                  : 'border-pink-primary/20 hover:border-pink-primary/40'
              }`}
            >
              <input
                type="radio"
                name="pricingMode"
                value="diy"
                checked={pricingMode === 'diy'}
                onChange={(e) => setPricingMode(e.target.value as PricingMode)}
                className="mr-3"
              />
              <span className="text-pink-primary font-medium">Buying alcohol yourself</span>
            </label>
            
            {pricingMode === 'diy' && (
              <div className="ml-8 mt-3 space-y-3">
                {includeBeer && (
                  <div>
                    <label className="block text-sm text-pink-primary/70 mb-2">
                      Average beer case cost ($)
                    </label>
                    <Input
                      type="number"
                      value={beerCaseCost}
                      onChange={(e) => setBeerCaseCost(e.target.value)}
                      placeholder="e.g., 25"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
                
                {includeWine && (
                  <div>
                    <label className="block text-sm text-pink-primary/70 mb-2">
                      Average wine bottle cost ($)
                    </label>
                    <Input
                      type="number"
                      value={wineBottleCost}
                      onChange={(e) => setWineBottleCost(e.target.value)}
                      placeholder="e.g., 15"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
                
                {includeSpirits && (
                  <div>
                    <label className="block text-sm text-pink-primary/70 mb-2">
                      Average spirits bottle cost ($)
                    </label>
                    <Input
                      type="number"
                      value={spiritsBottleCost}
                      onChange={(e) => setSpiritsBottleCost(e.target.value)}
                      placeholder="e.g., 30"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleCalculate} fullWidth size="lg">
            Calculate Alcohol Needs
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg" className="sm:w-auto">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Results Display */}
        {result && (
          <div className="mt-8 space-y-6">
            <div className="border-t-2 border-pink-primary/10 pt-6">
              <h3 className="text-2xl font-black text-pink-primary mb-4">
                Your Alcohol Breakdown
              </h3>
              
              {/* Summary */}
              <div className="bg-pink-light rounded-xl p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-pink-primary/70 mb-1">Guests</div>
                    <div className="text-3xl font-black text-pink-primary">{guests}</div>
                  </div>
                  <div>
                    <div className="text-sm text-pink-primary/70 mb-1">Event Duration</div>
                    <div className="text-3xl font-black text-pink-primary">{eventDuration}h</div>
                  </div>
                  <div>
                    <div className="text-sm text-pink-primary/70 mb-1">Total Drinks</div>
                    <div className="text-3xl font-black text-pink-primary">{result.totalDrinks}</div>
                  </div>
                </div>
              </div>

              {/* Quantities */}
              <div className="space-y-4 mb-6">
                {includeBeer && result.beerDrinks > 0 && (
                  <div className="flex justify-between items-center p-4 bg-amber-50 rounded-xl border-2 border-amber-200">
                    <div>
                      <div className="font-bold text-pink-primary">Beer</div>
                      <div className="text-sm text-pink-primary/70">
                        {unitSystem === 'us' ? '12 oz per beer' : '355 ml per beer'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-pink-primary">{result.beerCases}</div>
                      <div className="text-sm text-pink-primary/70">cases ({result.beerCount} beers)</div>
                    </div>
                  </div>
                )}
                
                {includeWine && result.wineDrinks > 0 && (
                  <div className="flex justify-between items-center p-4 bg-pink-50 rounded-xl border-2 border-pink-200">
                    <div>
                      <div className="font-bold text-pink-primary">Wine</div>
                      <div className="text-sm text-pink-primary/70">
                        {unitSystem === 'us' ? '5 oz per glass' : '150 ml per glass'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-pink-primary">{result.wineBottles}</div>
                      <div className="text-sm text-pink-primary/70">bottles</div>
                    </div>
                  </div>
                )}
                
                {includeSpirits && result.spiritsDrinks > 0 && (
                  <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
                    <div>
                      <div className="font-bold text-pink-primary">Spirits</div>
                      <div className="text-sm text-pink-primary/70">
                        {unitSystem === 'us' ? '1.5 oz per pour' : '44 ml per pour'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-pink-primary">{result.spiritsBottles}</div>
                      <div className="text-sm text-pink-primary/70">bottles</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Cost Display */}
              {result.estimatedCost && (
                <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200 mb-6">
                  <div className="text-center">
                    <div className="text-sm text-pink-primary/70 mb-2">Estimated Alcohol Cost</div>
                    <div className="text-4xl font-black text-pink-primary">
                      ${result.estimatedCost.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Chart */}
              {chartData.length > 0 && (
                <div className="bg-white rounded-xl p-6 border-2 border-pink-primary/10 mb-6">
                  <h4 className="text-lg font-bold text-pink-primary mb-4 text-center">
                    Drink Distribution
                  </h4>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value, entry: any) => {
                          const total = chartData.reduce((sum, item) => sum + item.value, 0)
                          const percent = Math.round((entry.payload.value / total) * 100)
                          return (
                            <span className="text-sm text-pink-primary">
                              {value}: {entry.payload.value} drinks ({percent}%)
                            </span>
                          )
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6">
                <p className="text-sm text-gray-600 text-center italic">
                  This is an estimate only. Always confirm with your venue or alcohol provider.
                </p>
              </div>

              {/* Export Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button onClick={handleCopy} variant="outline" size="lg">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Results
                </Button>
                <Button onClick={handleDownloadPDF} variant="outline" size="lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
