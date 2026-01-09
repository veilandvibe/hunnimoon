'use client'

export default function MobileHeader({ title }: { title?: string }) {
  return (
    <header className="md:hidden sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-b border-pink-primary/10 z-40">
      <div className="flex items-center justify-center h-14 px-4">
        <h1 className="text-xl font-bold text-pink-primary">
          {title || 'hunnimoon'}
        </h1>
      </div>
    </header>
  )
}
