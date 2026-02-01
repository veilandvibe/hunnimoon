// Smart guest parsing utilities for CSV, TSV, and plain text imports

export interface ParsedGuest {
  name: string
  email?: string
  phone?: string
  side?: 'Bride' | 'Groom' | 'Both' | 'Unknown'
  rawSide?: string // Preserve the original side text from CSV
  household?: string
  validationErrors: string[]
  validationWarnings: string[]
}

export interface ParseResult {
  guests: ParsedGuest[]
  success: boolean
  error?: string
  uniqueSides?: string[] // List of unique side values found in the CSV
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Header detection keywords
const HEADER_KEYWORDS = {
  firstName: ['first name', 'first', 'firstname', 'given name', 'first_name'],
  lastName: ['last name', 'last', 'lastname', 'surname', 'family name', 'last_name'],
  name: ['guest name', 'name', 'full name', 'full_name', 'guest_name', 'fullname'],
  email: ['email', 'e-mail', 'e mail', 'mail', 'email address'],
  phone: ['phone', 'mobile', 'cell', 'telephone', 'tel', 'number', 'phone number'],
  side: ['guest of', 'side', 'party', 'group', 'bride/groom', 'bride or groom'],
  household: ['household', 'household_id', 'household id', 'household name']
}

/**
 * Detect delimiter in text (comma, tab, semicolon)
 */
function detectDelimiter(text: string): string | null {
  const lines = text.split('\n').filter(line => line.trim())
  if (lines.length === 0) return null
  
  // Check first few lines for consistent delimiters
  const sampleLines = lines.slice(0, Math.min(5, lines.length))
  
  const delimiters = [',', '\t', ';', '|']
  let bestDelimiter: string | null = null
  let maxCount = 0
  
  for (const delimiter of delimiters) {
    const counts = sampleLines.map(line => (line.match(new RegExp(`\\${delimiter}`, 'g')) || []).length)
    const avgCount = counts.reduce((a, b) => a + b, 0) / counts.length
    const isConsistent = counts.every(count => Math.abs(count - avgCount) <= 1)
    
    if (avgCount > maxCount && isConsistent && avgCount > 0) {
      maxCount = avgCount
      bestDelimiter = delimiter
    }
  }
  
  return bestDelimiter
}

/**
 * Find the header row in a CSV that may have summary/title rows at the top
 */
function findHeaderRow(lines: string[], delimiter: string): number {
  // Try each line to see if it looks like a header
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const cells = lines[i].split(delimiter).map(cell => cell.trim().replace(/^["']|["']$/g, ''))
    
    // Skip completely empty rows
    if (cells.every(cell => !cell)) continue
    
    // Check if this row has header keywords
    const mapping = detectHeaders(cells, delimiter)
    if (mapping && Object.keys(mapping).length >= 2) {
      // Found a row with at least 2 recognizable headers
      return i
    }
  }
  
  // Fallback: assume first non-empty row is header
  return 0
}

/**
 * Detect if first row is a header based on keywords
 */
function detectHeaders(row: string[], delimiter: string): { [key: string]: number } | null {
  const mapping: { [key: string]: number } = {}
  let matchCount = 0
  
  row.forEach((cell, index) => {
    const normalized = cell.toLowerCase().trim()
    
    // Skip empty columns
    if (!normalized) return
    
    for (const [field, keywords] of Object.entries(HEADER_KEYWORDS)) {
      // Check for exact match first, then partial match
      const exactMatch = keywords.some(keyword => normalized === keyword)
      const partialMatch = keywords.some(keyword => normalized.includes(keyword) || keyword.includes(normalized))
      
      if ((exactMatch || partialMatch) && !mapping[field]) {
        // Only set if not already mapped - prefer exact matches
        mapping[field] = index
        matchCount++
      }
    }
  })
  
  // If we found at least 2 matching headers, consider it valid
  return matchCount >= 2 ? mapping : null
}

/**
 * Normalize side values
 */
function normalizeSide(value: string): 'Bride' | 'Groom' | 'Both' | 'Unknown' {
  const normalized = value.toLowerCase().trim()
  
  if (normalized.includes('bride') || normalized === 'b') return 'Bride'
  if (normalized.includes('groom') || normalized === 'g') return 'Groom'
  if (normalized.includes('both')) return 'Both'
  
  return 'Unknown'
}

/**
 * Validate email format
 */
function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

/**
 * Validate that the CSV matches our exact template format
 */
function validateTemplateFormat(headers: string[]): boolean {
  const requiredHeaders = ['Name', 'Email', 'Phone', 'Side', 'Household ID']
  
  // Remove empty leading columns
  const cleanHeaders = headers.filter(h => h.trim())
  
  // Must have exactly 5 columns
  if (cleanHeaders.length !== 5) return false
  
  // Check each header matches exactly (case-insensitive)
  for (let i = 0; i < requiredHeaders.length; i++) {
    if (cleanHeaders[i].toLowerCase().trim() !== requiredHeaders[i].toLowerCase()) {
      return false
    }
  }
  
  return true
}

/**
 * Parse CSV/TSV formatted text - TEMPLATE ONLY
 */
function parseDelimitedText(text: string, delimiter: string): ParsedGuest[] {
  const lines = text.split('\n').filter(line => line.trim())
  if (lines.length === 0) return []
  
  // Parse first row as headers
  let headerRow = lines[0].split(delimiter).map(cell => cell.trim().replace(/^["']|["']$/g, ''))
  
  // Skip leading empty columns
  let columnOffset = 0
  while (columnOffset < headerRow.length && !headerRow[columnOffset]) {
    columnOffset++
  }
  
  if (columnOffset > 0) {
    headerRow = headerRow.slice(columnOffset)
  }
  
  // STRICT VALIDATION: Must match template exactly
  if (!validateTemplateFormat(headerRow)) {
    throw new Error('INVALID_TEMPLATE')
  }
  
  // Column mapping for our template format
  const columnMapping = {
    name: 0 + columnOffset,
    email: 1 + columnOffset,
    phone: 2 + columnOffset,
    side: 3 + columnOffset,
    household: 4 + columnOffset
  }
  
  const guests: ParsedGuest[] = []
  
  // Data starts from row 2 (after headers)
  for (let i = 1; i < lines.length; i++) {
    let cells = lines[i].split(delimiter).map(cell => cell.trim().replace(/^["']|["']$/g, ''))
    
    // Remove leading empty columns
    if (columnOffset > 0 && cells.length > columnOffset) {
      cells = cells.slice(columnOffset)
    }
    
    // Skip completely empty rows
    if (cells.every(cell => !cell)) continue
    
    const name = cells[0] || ''
    const email = cells[1] || ''
    const phone = cells[2] || ''
    const sideRaw = cells[3] || ''
    const household = cells[4] || ''
    
    const validationErrors: string[] = []
    const validationWarnings: string[] = []
    
    // Validate name (required)
    if (!name || name.trim() === '') {
      validationErrors.push('Name is required')
    }
    
    // Validate email (optional but must be valid if provided)
    if (email && !validateEmail(email)) {
      validationWarnings.push('Invalid email format')
    }
    
    guests.push({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      side: sideRaw ? normalizeSide(sideRaw) : 'Unknown',
      rawSide: sideRaw.trim(), // Preserve original side text
      household: household.trim(),
      validationErrors,
      validationWarnings
    })
  }
  
  return guests
}

/**
 * Parse plain text (one name per line)
 */
function parsePlainText(text: string): ParsedGuest[] {
  const lines = text.split('\n').filter(line => line.trim())
  
  return lines.map(line => {
    const name = line.trim()
    const validationErrors: string[] = []
    
    if (!name) {
      validationErrors.push('Name is required')
    }
    
    return {
      name,
      side: 'Unknown',
      validationErrors,
      validationWarnings: []
    }
  })
}

/**
 * Main parsing function - auto-detects format
 */
export function parseGuestText(text: string): ParseResult {
  if (!text || text.trim() === '') {
    return {
      guests: [],
      success: false,
      error: 'Empty input. Please add guest data.'
    }
  }
  
  try {
    // Detect delimiter
    const delimiter = detectDelimiter(text)
    
    let guests: ParsedGuest[]
    
    if (delimiter) {
      // Parse as CSV/TSV with strict template validation
      guests = parseDelimitedText(text, delimiter)
    } else {
      // Plain text not supported for template-only mode
      return {
        guests: [],
        success: false,
        error: 'This file doesn\'t match our template format.\n\nPlease:\n1. Download our template\n2. Copy your guest data into it\n3. Upload the template file'
      }
    }
    
    // Extract unique side values (excluding empty, 'Both', and 'Unknown')
    const uniqueSides = Array.from(
      new Set(
        guests
          .map(g => g.rawSide)
          .filter((side): side is string => {
            if (!side || side.trim() === '') return false
            const normalized = side.toLowerCase().trim()
            return normalized !== 'both' && normalized !== 'unknown'
          })
      )
    )
    
    return {
      guests,
      success: true,
      uniqueSides
    }
  } catch (error) {
    console.error('Parse error:', error)
    if (error instanceof Error && error.message === 'INVALID_TEMPLATE') {
      return {
        guests: [],
        success: false,
        error: 'This file doesn\'t match our template format.\n\nPlease:\n1. Download our template\n2. Copy your guest data into it\n3. Upload the template file'
      }
    }
    return {
      guests: [],
      success: false,
      error: 'Could not parse file. Please check format and try again.'
    }
  }
}

/**
 * Parse CSV file
 */
export async function parseGuestFile(file: File): Promise<ParseResult> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const text = e.target?.result as string
      resolve(parseGuestText(text))
    }
    
    reader.onerror = () => {
      resolve({
        guests: [],
        success: false,
        error: 'Could not read file. Please try again.'
      })
    }
    
    reader.readAsText(file)
  })
}

/**
 * Validate a single guest row
 */
export function validateGuest(guest: Partial<ParsedGuest>): { errors: string[], warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []
  
  if (!guest.name || guest.name.trim() === '') {
    errors.push('Name is required')
  }
  
  if (guest.email && !validateEmail(guest.email)) {
    warnings.push('Invalid email format')
  }
  
  return { errors, warnings }
}
