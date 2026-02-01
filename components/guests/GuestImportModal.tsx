'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, X, AlertCircle, CheckCircle, AlertTriangle, Trash2, Download } from 'lucide-react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { parseGuestFile, parseGuestText, validateGuest, ParsedGuest } from '@/lib/guestParser'

interface GuestImportModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (guests: ParsedGuest[]) => Promise<void>
  existingHouseholds: string[]
  onDownloadTemplate?: () => void
  wedding?: {
    partner1_name?: string
    partner2_name?: string
  }
}

type TabType = 'upload' | 'paste'

export default function GuestImportModal({
  isOpen,
  onClose,
  onImport,
  existingHouseholds,
  onDownloadTemplate,
  wedding
}: GuestImportModalProps) {
  const [parsedGuests, setParsedGuests] = useState<ParsedGuest[]>([])
  const [isImporting, setIsImporting] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [pastedText, setPastedText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Side mapping state
  const [showMappingDialog, setShowMappingDialog] = useState(false)
  const [tempParsedGuests, setTempParsedGuests] = useState<ParsedGuest[]>([])
  const [uniqueSides, setUniqueSides] = useState<string[]>([])
  const [sideMapping, setSideMapping] = useState<Record<string, 'partner1' | 'partner2'>>({})
  
  // Initialize mapping when sides are detected
  const initializeSideMapping = (sides: string[]) => {
    const initialMapping: Record<string, 'partner1' | 'partner2'> = {}
    sides.forEach((side, index) => {
      // Default: first unique side -> partner1, second -> partner2
      initialMapping[side] = index === 0 ? 'partner1' : 'partner2'
    })
    return initialMapping
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setParseError(null)
    const result = await parseGuestFile(file)

    if (result.success) {
      // Check if we have unique sides that need mapping
      const sides = result.uniqueSides || []
      
      if (sides.length > 0 && wedding?.partner1_name && wedding?.partner2_name) {
        // Show mapping dialog first
        setTempParsedGuests(result.guests)
        setUniqueSides(sides)
        setSideMapping(initializeSideMapping(sides))
        setShowMappingDialog(true)
      } else {
        // No mapping needed, show preview directly
        setParsedGuests(result.guests)
      }
    } else {
      setParseError(result.error || 'Failed to parse file')
      setParsedGuests([])
    }
  }

  const handleParsePastedText = () => {
    setParseError(null)
    const result = parseGuestText(pastedText)

    if (result.success) {
      // Check if we have unique sides that need mapping
      const sides = result.uniqueSides || []
      
      if (sides.length > 0 && wedding?.partner1_name && wedding?.partner2_name) {
        // Show mapping dialog first
        setTempParsedGuests(result.guests)
        setUniqueSides(sides)
        setSideMapping(initializeSideMapping(sides))
        setShowMappingDialog(true)
      } else {
        // No mapping needed, show preview directly
        setParsedGuests(result.guests)
      }
    } else {
      setParseError(result.error || 'Failed to parse text')
      setParsedGuests([])
    }
  }

  const handleCellEdit = (index: number, field: keyof ParsedGuest, value: any) => {
    const updatedGuests = [...parsedGuests]
    updatedGuests[index] = {
      ...updatedGuests[index],
      [field]: value
    }

    // Re-validate the guest
    const validation = validateGuest(updatedGuests[index])
    updatedGuests[index].validationErrors = validation.errors
    updatedGuests[index].validationWarnings = validation.warnings

    setParsedGuests(updatedGuests)
  }

  const handleDeleteRow = (index: number) => {
    setParsedGuests(parsedGuests.filter((_, i) => i !== index))
  }

  const handleDeleteAllBlankRows = () => {
    const nonBlankGuests = parsedGuests.filter(guest => {
      // Keep rows that have at least a name or email or phone
      return guest.name?.trim() || guest.email?.trim() || guest.phone?.trim()
    })
    setParsedGuests(nonBlankGuests)
  }
  
  const handleConfirmMapping = () => {
    // Apply the mapping to all guests
    const mappedGuests = tempParsedGuests.map(guest => {
      if (!guest.rawSide) return guest
      
      const mapping = sideMapping[guest.rawSide]
      let newSide: 'Bride' | 'Groom' | 'Both' | 'Unknown' = guest.side || 'Unknown'
      
      if (mapping === 'partner1') {
        newSide = 'Bride' // Internal representation for partner 1
      } else if (mapping === 'partner2') {
        newSide = 'Groom' // Internal representation for partner 2
      }
      
      return {
        ...guest,
        side: newSide
      }
    })
    
    setParsedGuests(mappedGuests)
    setShowMappingDialog(false)
    setTempParsedGuests([])
    setUniqueSides([])
    setSideMapping({})
  }
  
  const handleCancelMapping = () => {
    setShowMappingDialog(false)
    setTempParsedGuests([])
    setUniqueSides([])
    setSideMapping({})
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleImport = async () => {
    // Filter out guests with critical errors
    const validGuests = parsedGuests.filter(guest => guest.validationErrors.length === 0)
    
    if (validGuests.length === 0) {
      alert('Please fix all errors before importing.')
      return
    }

    setIsImporting(true)
    try {
      await onImport(validGuests)
      // Reset state
      setParsedGuests([])
      setParseError(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      onClose()
    } catch (error) {
      console.error('Import error:', error)
      alert('Import failed: ' + (error instanceof Error ? error.message : 'Please check your connection and try again.'))
    } finally {
      setIsImporting(false)
    }
  }

  const handleClose = () => {
    setParsedGuests([])
    setParseError(null)
    setShowMappingDialog(false)
    setTempParsedGuests([])
    setUniqueSides([])
    setSideMapping({})
    if (fileInputRef.current) fileInputRef.current.value = ''
    onClose()
  }

  // Count validation statuses
  const validCount = parsedGuests.filter(g => g.validationErrors.length === 0 && g.validationWarnings.length === 0).length
  const errorCount = parsedGuests.filter(g => g.validationErrors.length > 0).length
  const warningCount = parsedGuests.filter(g => g.validationErrors.length === 0 && g.validationWarnings.length > 0).length
  const blankRowCount = parsedGuests.filter(g => !g.name?.trim() && !g.email?.trim() && !g.phone?.trim()).length

  const getRowStatus = (guest: ParsedGuest) => {
    if (guest.validationErrors.length > 0) return 'error'
    if (guest.validationWarnings.length > 0) return 'warning'
    return 'valid'
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl" title="Import Guests">
      <div className="space-y-6">
        {/* Show mapping dialog as separate step */}
        {showMappingDialog ? (
          <>
            {/* Side Mapping Dialog - Show as separate step */}
            {wedding && uniqueSides.length > 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-pink-primary mb-3">
                    Map Guest Sides
                  </h3>
                  <p className="text-pink-primary/70">
                    We found {uniqueSides.length} side{uniqueSides.length > 1 ? 's' : ''} in your file. Please tell us which partner each refers to:
                  </p>
                </div>
                
                <div className="space-y-4 max-w-lg mx-auto">
                  {uniqueSides.map((side) => (
                    <div key={side} className="bg-pink-light/30 rounded-xl p-4">
                      <label className="block">
                        <span className="text-sm font-bold text-pink-primary mb-2 block">
                          "{side}" refers to:
                        </span>
                        <select
                          value={sideMapping[side] || 'partner1'}
                          onChange={(e) => setSideMapping({
                            ...sideMapping,
                            [side]: e.target.value as 'partner1' | 'partner2'
                          })}
                          className="w-full px-4 py-3 rounded-lg border-2 border-pink-primary/20 focus:border-pink-primary focus:outline-none focus:ring-2 focus:ring-pink-primary/20 text-pink-primary bg-white font-medium"
                        >
                          <option value="partner1">{wedding.partner1_name}</option>
                          <option value="partner2">{wedding.partner2_name}</option>
                        </select>
                      </label>
                    </div>
                  ))}
                  
                  {/* Check for duplicate mappings */}
                  {(() => {
                    const mappedValues = Object.values(sideMapping)
                    const hasDuplicates = uniqueSides.length > 1 && 
                      mappedValues.length === uniqueSides.length &&
                      new Set(mappedValues).size < mappedValues.length
                    
                    return hasDuplicates ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">
                        <AlertTriangle className="inline mr-2" size={16} />
                        Multiple sides can't refer to the same partner. Please select different partners.
                      </div>
                    ) : null
                  })()}
                  
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleConfirmMapping}
                      className="flex-1"
                      disabled={(() => {
                        const mappedValues = Object.values(sideMapping)
                        return uniqueSides.length > 1 && 
                          mappedValues.length === uniqueSides.length &&
                          new Set(mappedValues).size < mappedValues.length
                      })()}
                    >
                      Continue to Preview
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleCancelMapping}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* 3-Step Instructions */}
            {parsedGuests.length === 0 && (
          <div className="space-y-6">
            {/* Step 1: Download Template */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <h3 className="text-lg font-bold text-pink-primary">Download Template</h3>
              </div>
              <p className="text-sm text-pink-primary/70 ml-11">
                Download our simple spreadsheet template to get started
              </p>
              <div className="ml-11">
                <Button onClick={onDownloadTemplate} variant="outline" className="w-full md:w-auto">
                  <Download size={18} />
                  Download Template
                </Button>
              </div>
            </div>

            {/* Step 2: Add Your Guests */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <h3 className="text-lg font-bold text-pink-primary">Add Your Guests</h3>
              </div>
              <div className="ml-11 space-y-2">
                <p className="text-sm text-pink-primary/70">Open the template in Excel, Google Sheets, or Numbers. Already have a guest list? Just copy and paste your info into the template columns.</p>
                <ul className="text-sm text-pink-primary/70 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-primary">•</span>
                    <span>Fill in: <strong>Name</strong> (required), Email, Phone, Side, Household ID</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-primary">•</span>
                    <span>Side: You can use any name (e.g., "Bride", "Groom", partner names, or anything else). We'll ask you to map them after upload.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-primary">•</span>
                    <span>Household ID: Use the same name for family members (e.g., "Johnson Family")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-primary">•</span>
                    <span>Save the file as CSV when done</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3: Upload */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-pink-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <h3 className="text-lg font-bold text-pink-primary">Upload Your Completed File</h3>
              </div>
              <div className="ml-11">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="block border-2 border-dashed border-pink-primary/30 rounded-2xl p-6 text-center hover:border-pink-primary/50 transition-colors cursor-pointer"
                >
                  <Upload className="mx-auto mb-3 text-pink-primary/60" size={40} />
                  <span className="text-pink-primary font-medium hover:underline text-base">
                    Click to Upload CSV
                  </span>
                  <p className="text-xs text-pink-primary/60 mt-2">
                    Only accepts CSV files from our template
                  </p>
                </label>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-pink-light/30 rounded-xl p-4 text-sm text-pink-primary/70">
              <p className="font-medium text-pink-primary mb-2">📋 Why use our template?</p>
              <ul className="space-y-1 ml-4">
                <li>• Ensures your data uploads correctly every time</li>
                <li>• No formatting errors or missing information</li>
                <li>• Works with Excel, Google Sheets, and Numbers</li>
              </ul>
            </div>
          </div>
        )}

        {/* Parse Error */}
        {parseError && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="font-medium text-red-700">Invalid Format</p>
                <p className="text-sm text-red-600 mt-1">{parseError}</p>
                <div className="mt-3 flex gap-2">
                  <Button onClick={onDownloadTemplate} variant="outline" size="sm">
                    Download Template
                  </Button>
                  <Button 
                    onClick={() => {
                      setParseError(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }} 
                    variant="outline" 
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Table */}
        {parsedGuests.length > 0 && (
          <div className="space-y-4">
            {/* Summary Bar */}
            <div className="bg-pink-light/50 rounded-xl p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4 text-sm flex-wrap">
                  <span className="font-bold text-pink-primary">
                    {parsedGuests.length} {parsedGuests.length === 1 ? 'guest' : 'guests'}
                  </span>
                  {validCount > 0 && (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle size={16} />
                      {validCount} valid
                    </span>
                  )}
                  {warningCount > 0 && (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <AlertTriangle size={16} />
                      {warningCount} {warningCount === 1 ? 'warning' : 'warnings'}
                    </span>
                  )}
                  {errorCount > 0 && (
                    <span className="flex items-center gap-1 text-red-600">
                      <AlertCircle size={16} />
                      {errorCount} {errorCount === 1 ? 'error' : 'errors'}
                    </span>
                  )}
                </div>
                {blankRowCount > 0 && (
                  <Button
                    onClick={handleDeleteAllBlankRows}
                    variant="outline"
                    size="sm"
                    className="text-sm"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete {blankRowCount} Blank {blankRowCount === 1 ? 'Row' : 'Rows'}
                  </Button>
                )}
              </div>
            </div>

            {/* Editable Table */}
            <div className="border-2 border-pink-primary/20 rounded-xl overflow-hidden">
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-pink-light/30 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2 text-left text-pink-primary font-bold w-8"></th>
                      <th className="px-3 py-2 text-left text-pink-primary font-bold min-w-[150px]">Name *</th>
                      <th className="px-3 py-2 text-left text-pink-primary font-bold min-w-[180px]">Email</th>
                      <th className="px-3 py-2 text-left text-pink-primary font-bold min-w-[120px]">Phone</th>
                      <th className="px-3 py-2 text-left text-pink-primary font-bold min-w-[120px]">Side</th>
                      <th className="px-3 py-2 text-left text-pink-primary font-bold min-w-[150px]">Household</th>
                      <th className="px-3 py-2 text-center text-pink-primary font-bold w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedGuests.map((guest, index) => {
                      const status = getRowStatus(guest)
                      return (
                        <tr
                          key={index}
                          className={`border-t border-pink-primary/10 ${
                            status === 'error' ? 'bg-red-50' : status === 'warning' ? 'bg-yellow-50' : ''
                          }`}
                        >
                          {/* Status Icon */}
                          <td className="px-3 py-2 text-center">
                            {status === 'valid' && <CheckCircle className="text-green-500" size={16} />}
                            {status === 'warning' && <AlertTriangle className="text-yellow-500" size={16} />}
                            {status === 'error' && <AlertCircle className="text-red-500" size={16} />}
                          </td>

                          {/* Name */}
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={guest.name}
                              onChange={(e) => handleCellEdit(index, 'name', e.target.value)}
                              className={`w-full px-2 py-1 rounded border ${
                                guest.validationErrors.some(e => e.includes('Name'))
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-pink-primary/20'
                              } focus:outline-none focus:ring-1 focus:ring-pink-primary text-pink-primary`}
                              placeholder="Enter name"
                            />
                          </td>

                          {/* Email */}
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={guest.email || ''}
                              onChange={(e) => handleCellEdit(index, 'email', e.target.value)}
                              className={`w-full px-2 py-1 rounded border ${
                                guest.validationWarnings.some(w => w.includes('email'))
                                  ? 'border-yellow-500 bg-yellow-50'
                                  : 'border-pink-primary/20'
                              } focus:outline-none focus:ring-1 focus:ring-pink-primary text-pink-primary`}
                              placeholder="optional"
                            />
                          </td>

                          {/* Phone */}
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={guest.phone || ''}
                              onChange={(e) => handleCellEdit(index, 'phone', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-pink-primary/20 focus:outline-none focus:ring-1 focus:ring-pink-primary text-pink-primary"
                              placeholder="optional"
                            />
                          </td>

                          {/* Side */}
                          <td className="px-3 py-2">
                            <select
                              value={guest.side || 'Unknown'}
                              onChange={(e) => handleCellEdit(index, 'side', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-pink-primary/20 focus:outline-none focus:ring-1 focus:ring-pink-primary text-pink-primary bg-white"
                            >
                              {wedding ? (
                                <>
                                  <option value="Bride">{wedding.partner1_name}'s Side</option>
                                  <option value="Groom">{wedding.partner2_name}'s Side</option>
                                  <option value="Both">Both Sides</option>
                                  <option value="Unknown">Unknown</option>
                                </>
                              ) : (
                                <>
                                  <option value="Bride">Bride</option>
                                  <option value="Groom">Groom</option>
                                  <option value="Both">Both</option>
                                  <option value="Unknown">Unknown</option>
                                </>
                              )}
                            </select>
                          </td>

                          {/* Household */}
                          <td className="px-3 py-2">
                            <input
                              type="text"
                              value={guest.household || ''}
                              onChange={(e) => handleCellEdit(index, 'household', e.target.value)}
                              list={`household-suggestions-${index}`}
                              className="w-full px-2 py-1 rounded border border-pink-primary/20 focus:outline-none focus:ring-1 focus:ring-pink-primary text-pink-primary"
                              placeholder="optional"
                            />
                            <datalist id={`household-suggestions-${index}`}>
                              {existingHouseholds.map(household => (
                                <option key={household} value={household} />
                              ))}
                            </datalist>
                          </td>

                          {/* Delete */}
                          <td className="px-3 py-2 text-center">
                            <button
                              onClick={() => handleDeleteRow(index)}
                              className="text-pink-primary/60 hover:text-red-500 transition-colors"
                              title="Delete row"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Info Messages */}
            {errorCount > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
                <AlertCircle className="inline mr-2" size={16} />
                Please fix all errors (missing names) before importing.
              </div>
            )}
            {warningCount > 0 && errorCount === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">
                <AlertTriangle className="inline mr-2" size={16} />
                You can import with warnings, but you may want to fix invalid emails.
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-pink-primary/20">
          <Button
            onClick={handleImport}
            disabled={parsedGuests.length === 0 || errorCount > 0 || isImporting}
            className="flex-1"
          >
            {isImporting ? 'Importing... Please wait' : `Import ${parsedGuests.filter(g => g.validationErrors.length === 0).length} ${parsedGuests.filter(g => g.validationErrors.length === 0).length === 1 ? 'Guest' : 'Guests'}`}
          </Button>
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
        </div>
          </>
        )}
      </div>
    </Modal>
  )
}
