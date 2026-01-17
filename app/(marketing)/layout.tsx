'use client'

import { Suspense } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import PublicHeader from '@/components/marketing/PublicHeader'
import PublicFooter from '@/components/marketing/PublicFooter'
import SourceTracker from '@/components/marketing/SourceTracker'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to">
      {/* Track acquisition source from URL params */}
      <Suspense fallback={null}>
        <SourceTracker />
      </Suspense>
      
      <PublicHeader />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <PublicFooter />
    </div>
  )
}
