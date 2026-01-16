import { Suspense } from 'react'
import PublicHeader from '@/components/marketing/PublicHeader'
import PublicFooter from '@/components/marketing/PublicFooter'
import SourceTracker from '@/components/marketing/SourceTracker'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-gradient-from to-pink-gradient-to">
      {/* Track acquisition source from URL params */}
      <Suspense fallback={null}>
        <SourceTracker />
      </Suspense>
      
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}
