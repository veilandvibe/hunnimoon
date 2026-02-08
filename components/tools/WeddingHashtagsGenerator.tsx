'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Copy } from 'lucide-react'
import toast from 'react-hot-toast'

export default function WeddingHashtagsGenerator() {
  // Required inputs
  const [aFirstName, setAFirstName] = useState('')
  const [bFirstName, setBFirstName] = useState('')

  // Optional inputs
  const [aLastName, setALastName] = useState('')
  const [bLastName, setBLastName] = useState('')
  const [aNickname, setANickname] = useState('')
  const [bNickname, setBNickname] = useState('')
  const [weddingYear, setWeddingYear] = useState(new Date().getFullYear().toString())

  // Married last name options
  const [marriedLastNameOption, setMarriedLastNameOption] = useState<'a' | 'b' | 'custom'>('a')
  const [customLastName, setCustomLastName] = useState('')

  // Results
  const [hashtags, setHashtags] = useState<string[]>([])

  // Normalize input function
  const normalizeInput = (input: string): string => {
    if (!input) return ''
    
    // Trim whitespace
    let normalized = input.trim()
    
    // Remove internal spaces
    normalized = normalized.replace(/\s+/g, '')
    
    // Remove special characters (keep only letters and numbers)
    normalized = normalized.replace(/[^a-zA-Z0-9]/g, '')
    
    // Capitalize first letter, lowercase the rest
    if (normalized.length > 0) {
      normalized = normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()
    }
    
    return normalized
  }

  // Hashtag pattern pool (40+ patterns)
  const generateHashtags = () => {
    // Validate required fields
    if (!aFirstName.trim() || !bFirstName.trim()) {
      toast.error('Please enter both first names')
      return
    }

    // Normalize all inputs
    const normA_First = normalizeInput(aFirstName)
    const normB_First = normalizeInput(bFirstName)
    const normA_Last = normalizeInput(aLastName)
    const normB_Last = normalizeInput(bLastName)
    const normA_Nick = normalizeInput(aNickname)
    const normB_Nick = normalizeInput(bNickname)
    const normYear = weddingYear.trim()
    
    // Determine married last name
    let normCoupleLast = ''
    if (marriedLastNameOption === 'a' && normA_Last) {
      normCoupleLast = normA_Last
    } else if (marriedLastNameOption === 'b' && normB_Last) {
      normCoupleLast = normB_Last
    } else if (marriedLastNameOption === 'custom' && customLastName.trim()) {
      normCoupleLast = normalizeInput(customLastName)
    }

    // Check if nicknames are different from first names
    const hasA_Nick = !!(normA_Nick && normA_Nick !== normA_First)
    const hasB_Nick = !!(normB_Nick && normB_Nick !== normB_First)

    // Pattern pool with conditional logic
    const patterns: Array<{ template: string; condition: boolean }> = [
      // Classic / Safe
      { template: `${normA_First}And${normB_First}`, condition: true },
      { template: `${normB_First}And${normA_First}`, condition: true },
      { template: `The${normCoupleLast}s`, condition: !!normCoupleLast },
      { template: `MeetThe${normCoupleLast}s`, condition: !!normCoupleLast },
      { template: `${normA_First}${normB_First}Wedding`, condition: true },
      { template: `${normB_First}${normA_First}Wedding`, condition: true },
      { template: `${normCoupleLast}Wedding`, condition: !!normCoupleLast },
      { template: `HappilyEverAfter${normCoupleLast}`, condition: !!normCoupleLast },
      { template: `${normA_First}Weds${normB_First}`, condition: true },
      { template: `${normB_First}Weds${normA_First}`, condition: true },

      // Fun / Playful
      { template: `${normA_First}Found${normB_First}`, condition: true },
      { template: `${normB_First}Found${normA_First}`, condition: true },
      { template: `${normA_First}SaidYes`, condition: true },
      { template: `${normB_First}SaidYes`, condition: true },
      { template: `Finally${normCoupleLast}s`, condition: !!normCoupleLast },
      { template: `${normA_First}And${normB_First}GetMarried`, condition: true },
      { template: `${normA_First}Marries${normB_First}`, condition: true },
      { template: `${normA_First}Loves${normB_First}`, condition: true },
      { template: `${normB_First}Loves${normA_First}`, condition: true },
      { template: `${normA_First}Hearts${normB_First}`, condition: true },
      { template: `${normB_First}Hearts${normA_First}`, condition: true },

      // Modern / Trendy
      { template: `${normCoupleLast}s${normYear}`, condition: !!normCoupleLast },
      { template: `${normA_First}${normB_First}${normYear}`, condition: true },
      { template: `${normB_First}${normA_First}${normYear}`, condition: true },
      { template: `Forever${normCoupleLast}`, condition: !!normCoupleLast },
      { template: `${normA_First}And${normB_First}ForLife`, condition: true },
      { template: `Forever${normA_First}${normB_First}`, condition: true },
      { template: `The${normCoupleLast}Era`, condition: !!normCoupleLast },
      { template: `${normA_First}${normCoupleLast}`, condition: !!normCoupleLast },
      { template: `${normB_First}${normCoupleLast}`, condition: !!normCoupleLast },
      { template: `MrAndMrs${normCoupleLast}`, condition: !!normCoupleLast },

      // Optional / Fallback (nickname-based)
      { template: `${normA_Nick}And${normB_Nick}`, condition: hasA_Nick && hasB_Nick },
      { template: `${normA_Nick}${normB_Nick}Wedding`, condition: hasA_Nick && hasB_Nick },
      { template: `Team${normCoupleLast}`, condition: !!normCoupleLast },
      { template: `TheNew${normCoupleLast}s`, condition: !!normCoupleLast },
      { template: `${normA_First}${normB_Last}`, condition: !!normB_Last },
      { template: `${normB_First}${normA_Last}`, condition: !!normA_Last },
      { template: `TogetherWith${normCoupleLast}`, condition: !!normCoupleLast },
      { template: `${normA_First}${normB_First}Married`, condition: true },
      { template: `${normCoupleLast}LoveStory`, condition: !!normCoupleLast },
      { template: `${normA_First}${normB_First}Forever`, condition: true },

      // Additional patterns
      { template: `${normA_First}And${normB_First}${normYear}`, condition: true },
      { template: `${normB_First}And${normA_First}${normYear}`, condition: true },
      { template: `${normA_First}Meets${normB_First}`, condition: true },
      { template: `${normB_First}Meets${normA_First}`, condition: true },
      { template: `${normCoupleLast}Forever`, condition: !!normCoupleLast },
      { template: `${normA_First}Plus${normB_First}`, condition: true },
      { template: `${normB_First}Plus${normA_First}`, condition: true },
      { template: `The${normA_First}${normB_First}Wedding`, condition: true },
      { template: `${normCoupleLast}Celebration`, condition: !!normCoupleLast },
      { template: `Married${normCoupleLast}`, condition: !!normCoupleLast },
      { template: `${normA_First}${normB_First}TieTheKnot`, condition: true },
      { template: `${normA_First}${normB_First}SayIDo`, condition: true },
      { template: `Celebrating${normA_First}${normB_First}`, condition: true },
      { template: `${normCoupleLast}Wedding${normYear}`, condition: !!normCoupleLast },
    ]

    // Generate hashtags based on conditions
    let generatedHashtags = patterns
      .filter(p => p.condition)
      .map(p => `#${p.template}`)
      .filter(h => h.length >= 6 && h.length <= 28) // Length filter

    // Remove duplicates
    generatedHashtags = Array.from(new Set(generatedHashtags))

    // Shuffle and select 15
    const shuffled = generatedHashtags.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 15)

    if (selected.length === 0) {
      toast.error('Could not generate hashtags with these inputs. Try adding more details.')
      return
    }

    setHashtags(selected)
    toast.success(`Generated ${selected.length} hashtag${selected.length !== 1 ? 's' : ''}!`)
  }

  const handleCopyHashtag = (hashtag: string) => {
    navigator.clipboard.writeText(hashtag)
    toast.success('Hashtag copied!')
  }

  const handleCopyAll = () => {
    const allHashtags = hashtags.join('\n')
    navigator.clipboard.writeText(allHashtags)
    toast.success('All hashtags copied!')
  }

  const handleReset = () => {
    setAFirstName('')
    setBFirstName('')
    setALastName('')
    setBLastName('')
    setANickname('')
    setBNickname('')
    setWeddingYear(new Date().getFullYear().toString())
    setMarriedLastNameOption('a')
    setCustomLastName('')
    setHashtags([])
  }

  return (
    <div className="max-w-4xl mx-auto mb-16">
      {/* Form */}
      <div className="bg-pink-light rounded-2xl p-6 md:p-8 space-y-6">
        {/* Required Section */}
        <div>
          <h3 className="text-lg font-bold text-pink-primary mb-4">Required Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Your first name"
              value={aFirstName}
              onChange={(e) => setAFirstName(e.target.value)}
              placeholder="e.g., Sarah"
              required
            />
            <Input
              label="Partner's first name"
              value={bFirstName}
              onChange={(e) => setBFirstName(e.target.value)}
              placeholder="e.g., Mike"
              required
            />
          </div>
        </div>

        {/* Optional Section */}
        <div>
          <h3 className="text-lg font-bold text-pink-primary mb-2">
            Optional Details
          </h3>
          <p className="text-sm italic text-pink-primary/60 mb-4">
            Add more details for additional hashtag options
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Your last name"
              value={aLastName}
              onChange={(e) => setALastName(e.target.value)}
              placeholder="e.g., Johnson"
            />
            <Input
              label="Partner's last name"
              value={bLastName}
              onChange={(e) => setBLastName(e.target.value)}
              placeholder="e.g., Smith"
            />
            <Input
              label="Your nickname"
              value={aNickname}
              onChange={(e) => setANickname(e.target.value)}
              placeholder="e.g., Sar"
            />
            <Input
              label="Partner's nickname"
              value={bNickname}
              onChange={(e) => setBNickname(e.target.value)}
              placeholder="e.g., Mikey"
            />
            <Input
              label="Wedding year"
              type="number"
              value={weddingYear}
              onChange={(e) => setWeddingYear(e.target.value)}
              placeholder={new Date().getFullYear().toString()}
            />
          </div>
        </div>

        {/* Married Last Name Section */}
        <div>
          <h3 className="text-lg font-bold text-pink-primary mb-4">
            Married Last Name
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="marriedLastName"
                value="a"
                checked={marriedLastNameOption === 'a'}
                onChange={() => setMarriedLastNameOption('a')}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-sm text-pink-primary">
                Your last name {aLastName && `(${aLastName})`}
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="marriedLastName"
                value="b"
                checked={marriedLastNameOption === 'b'}
                onChange={() => setMarriedLastNameOption('b')}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-sm text-pink-primary">
                Partner's last name {bLastName && `(${bLastName})`}
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="marriedLastName"
                value="custom"
                checked={marriedLastNameOption === 'custom'}
                onChange={() => setMarriedLastNameOption('custom')}
                className="w-5 h-5 accent-pink-primary cursor-pointer"
              />
              <span className="text-sm text-pink-primary">Custom last name</span>
            </label>
            {marriedLastNameOption === 'custom' && (
              <div className="ml-8">
                <Input
                  value={customLastName}
                  onChange={(e) => setCustomLastName(e.target.value)}
                  placeholder="Enter custom last name"
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={generateHashtags}
            variant="primary"
            size="lg"
            fullWidth
          >
            Get wedding hashtags
          </Button>
          {hashtags.length > 0 && (
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Results */}
      {hashtags.length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-pink-primary/10 p-6 md:p-8 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-pink-primary">
              Your Wedding Hashtags
            </h3>
            <Button
              onClick={handleCopyAll}
              variant="outline"
              size="sm"
            >
              <Copy className="w-4 h-4" />
              Copy All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hashtags.map((hashtag, index) => (
              <div
                key={index}
                className="bg-pink-light rounded-xl p-4 flex items-center justify-between gap-3 group hover:bg-pink-primary/10 transition-all duration-200"
              >
                <span className="text-pink-primary font-medium break-all">
                  {hashtag}
                </span>
                <button
                  onClick={() => handleCopyHashtag(hashtag)}
                  className="flex-shrink-0 p-2 hover:bg-pink-primary/20 rounded-lg transition-all duration-200"
                  aria-label="Copy hashtag"
                >
                  <Copy className="w-4 h-4 text-pink-primary" />
                </button>
              </div>
            ))}
          </div>

          <p className="text-sm text-pink-primary/60 mt-6 pt-4 border-t border-pink-primary/10 text-center">
            Click any hashtag to copy it individually, or use "Copy All" to get the full list.
          </p>
        </div>
      )}
    </div>
  )
}
