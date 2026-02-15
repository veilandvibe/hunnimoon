'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Tool } from '@/types/tools'
import Button from '@/components/ui/Button'

interface ToolSliderProps {
  tools: Tool[]
  currentToolSlug: string
}

export default function ToolSlider({ tools, currentToolSlug }: ToolSliderProps) {
  const [startIndex, setStartIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  // Filter out current tool
  const otherTools = tools.filter(tool => tool.slug !== currentToolSlug)
  
  // Show 1 tool on mobile, 3 on desktop
  const toolsPerView = isMobile ? 1 : 3
  const visibleTools = otherTools.slice(startIndex, startIndex + toolsPerView)
  
  const canGoBack = startIndex > 0
  const canGoForward = startIndex + toolsPerView < otherTools.length

  const handlePrev = () => {
    if (canGoBack) {
      setStartIndex(startIndex - 1)
    }
  }

  const handleNext = () => {
    if (canGoForward) {
      setStartIndex(startIndex + 1)
    }
  }

  if (otherTools.length === 0) {
    return null
  }

  return (
    <div className="my-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-pink-primary">
          Try Our Other Free Wedding Tools
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={!canGoBack}
            className={`p-2 rounded-lg border-2 transition-colors ${
              canGoBack 
                ? 'border-pink-primary text-pink-primary hover:bg-pink-light' 
                : 'border-pink-primary/20 text-pink-primary/20 cursor-not-allowed'
            }`}
            aria-label="Previous tools"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoForward}
            className={`p-2 rounded-lg border-2 transition-colors ${
              canGoForward 
                ? 'border-pink-primary text-pink-primary hover:bg-pink-light' 
                : 'border-pink-primary/20 text-pink-primary/20 cursor-not-allowed'
            }`}
            aria-label="Next tools"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleTools.map((tool) => (
          <div 
            key={tool.slug}
            className="bg-white rounded-2xl p-6 border-2 border-pink-primary/10 hover:border-pink-primary/30 transition-all hover:shadow-lg"
          >
            {/* Tool Image */}
            <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-4">
              <img 
                src={tool.image} 
                alt={tool.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-lg font-bold text-pink-primary mb-2">
              {tool.name}
            </h3>
            <p className="text-pink-primary/70 text-sm mb-4">
              {tool.description}
            </p>

            <Link href={`/tools/${tool.slug}`}>
              <Button variant="outline" size="sm" fullWidth>
                Try Tool
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
