'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

/**
 * Client component to track acquisition sources from URL parameters
 * Checks for ?src=etsy (or any other source) and stores in localStorage
 */
export default function SourceTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const source = searchParams.get('src')
    
    if (source) {
      // Store in localStorage to persist across navigation
      localStorage.setItem('acq_source', source)
      console.log('[SourceTracker] Acquisition source captured:', source)
    }
  }, [searchParams])

  // This component doesn't render anything
  return null
}
