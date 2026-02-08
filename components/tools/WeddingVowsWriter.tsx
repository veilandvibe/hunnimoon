'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Copy, Download, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

export default function WeddingVowsWriter() {
  // Form fields
  const [partnerName, setPartnerName] = useState('')
  const [tone, setTone] = useState('romantic')
  const [length, setLength] = useState('medium')
  const [relationshipLength, setRelationshipLength] = useState('')
  const [themes, setThemes] = useState<string[]>([])
  const [additionalNotes, setAdditionalNotes] = useState('')

  // Output state
  const [generatedVows, setGeneratedVows] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const toneOptions = [
    { value: 'romantic', label: 'Romantic' },
    { value: 'lighthearted', label: 'Lighthearted' },
    { value: 'traditional', label: 'Traditional' },
    { value: 'short-and-sweet', label: 'Short and sweet' },
    { value: 'emotional-but-simple', label: 'Emotional but simple' },
    { value: 'funny', label: 'Funny' },
    { value: 'cheeky', label: 'Cheeky' },
  ]

  const lengthOptions = [
    { value: 'short', label: 'Short' },
    { value: 'medium', label: 'Medium' },
    { value: 'long', label: 'Long' },
  ]

  const relationshipLengthOptions = [
    { value: '', label: 'Select...' },
    { value: 'less-than-1-year', label: 'Less than 1 year' },
    { value: '1-to-3-years', label: '1 to 3 years' },
    { value: '3-to-5-years', label: '3 to 5 years' },
    { value: '5-plus-years', label: '5+ years' },
  ]

  const themeOptions = [
    'Support',
    'Humor',
    'Growth',
    'Adventure',
    'Commitment',
    'Family',
    'Friendship',
  ]

  const handleThemeToggle = (theme: string) => {
    if (themes.includes(theme)) {
      setThemes(themes.filter(t => t !== theme))
    } else {
      setThemes([...themes, theme])
    }
  }

  const generateVows = async () => {
    // Validation
    if (!partnerName.trim()) {
      toast.error('Please enter your partner\'s name')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/vows/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partnerName: partnerName.trim(),
          tone,
          length,
          relationshipLength,
          themes,
          additionalNotes: additionalNotes.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.error || 'Failed to generate vows')
        return
      }

      setGeneratedVows(data.vows)
      toast.success('Vows generated!')
    } catch (error) {
      console.error('Error generating vows:', error)
      toast.error('Failed to generate vows. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyVows = () => {
    navigator.clipboard.writeText(generatedVows)
    toast.success('Vows copied to clipboard!')
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(22)
    doc.setTextColor(212, 71, 126) // Pink
    doc.text('Wedding Ceremony Vows', 20, 25)

    // Subtitle
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text('This is a draft to help you get started', 20, 33)

    // Vows text
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')

    // Split vows into lines and handle line breaks
    const lines = generatedVows.split('\n')
    let y = 50

    lines.forEach((line) => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage()
        y = 20
      }

      // Handle empty lines (paragraph breaks)
      if (line.trim() === '') {
        y += 7
        return
      }

      // Split long lines to fit within page width
      const splitLines = doc.splitTextToSize(line, 170)
      splitLines.forEach((splitLine: string) => {
        if (y > 270) {
          doc.addPage()
          y = 20
        }
        doc.text(splitLine, 20, y)
        y += 7
      })
    })

    // Footer
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(9)
      doc.setTextColor(150, 150, 150)
      doc.text('Created with Hunnimoon', 105, 285, { align: 'center' })
    }

    doc.save('wedding-vows-draft.pdf')
    toast.success('Vows PDF downloaded!')
  }

  return (
    <div className="space-y-8 mb-16">
      {/* Input Form */}
      <div className="bg-pink-light rounded-2xl p-6 md:p-8">
        <div className="space-y-6">
          {/* Partner Name */}
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              Partner name *
            </label>
            <Input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="Enter your partner's name"
              className="w-full"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              Tone *
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-pink-primary/20 bg-white text-pink-primary focus:outline-none focus:border-pink-primary transition-colors appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23D4477E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundPosition: 'center right 1rem',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {toneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              Length *
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-pink-primary/20 bg-white text-pink-primary focus:outline-none focus:border-pink-primary transition-colors appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23D4477E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundPosition: 'center right 1rem',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {lengthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Relationship Length */}
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              How long have you been together?
            </label>
            <select
              value={relationshipLength}
              onChange={(e) => setRelationshipLength(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-pink-primary/20 bg-white text-pink-primary focus:outline-none focus:border-pink-primary transition-colors appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%23D4477E' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                backgroundPosition: 'center right 1rem',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {relationshipLengthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Themes */}
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-3">
              Themes to include
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {themeOptions.map((theme) => (
                <label
                  key={theme}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={themes.includes(theme)}
                    onChange={() => handleThemeToggle(theme)}
                    className="w-4 h-4 rounded border-pink-primary/30 text-pink-primary focus:ring-pink-primary"
                  />
                  <span className="text-sm text-pink-primary">{theme}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-pink-primary mb-2">
              Additional notes or moments
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Anything you want mentioned. A memory. A habit. A feeling. Messy is fine."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-pink-primary/20 bg-white text-pink-primary focus:outline-none focus:border-pink-primary transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={generateVows}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : generatedVows ? (
                'Regenerate'
              ) : (
                'Generate vows'
              )}
            </Button>

            {/* Progress Bar */}
            {isLoading && (
              <div className="space-y-2">
                <div className="w-full bg-pink-primary/20 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-pink-primary transition-all duration-300 ease-out rounded-full"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-pink-primary/70 text-center">
                  Generating your vows... {Math.round(loadingProgress)}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Output Section */}
      {generatedVows && (
        <div className="bg-white rounded-2xl border-2 border-pink-primary/10 p-6 md:p-8">
          <div className="space-y-6">
            {/* User Expectation Message */}
            <div className="bg-pink-light rounded-xl p-4">
              <p className="text-sm text-pink-primary/80 text-center">
                This is a draft to help you get started. Most couples edit their
                vows after.
              </p>
            </div>

            {/* Generated Vows */}
            <div className="prose prose-pink max-w-none">
              <div className="whitespace-pre-wrap text-pink-primary/90 leading-relaxed">
                {generatedVows}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-pink-primary/10">
              <Button
                onClick={handleCopyVows}
                variant="outline"
                className="flex items-center gap-2 flex-1"
              >
                <Copy className="w-4 h-4" />
                Copy
              </Button>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="flex items-center gap-2 flex-1"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
