'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, ClipboardCheck, DollarSign, Briefcase, MoreHorizontal, Settings, MessageSquare } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/guests', icon: Users, label: 'Guests' },
  { href: '/rsvp-manager', icon: ClipboardCheck, label: 'RSVP' },
  { href: '/budget', icon: DollarSign, label: 'Budget' },
  { href: '/vendors', icon: Briefcase, label: 'Vendors' },
]

const moreMenuItems = [
  { href: '/feedback', icon: MessageSquare, label: 'Feedback' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false)
      }
    }

    if (showMoreMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMoreMenu])

  const isMoreActive = pathname === '/settings' || pathname?.startsWith('/settings/') || 
                       pathname === '/feedback' || pathname?.startsWith('/feedback/')

  const handleMoreItemClick = (href: string) => {
    setShowMoreMenu(false)
    router.push(href)
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-pink-primary/10 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-pink-primary' : 'text-gray-400'
              }`}
            >
              <div
                className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-pink-primary/10' : ''
                }`}
              >
                <Icon size={20} strokeWidth={2.5} />
                <span className="text-[9px] font-medium mt-0.5">{item.label}</span>
              </div>
            </Link>
          )
        })}

        {/* More Menu */}
        <div ref={moreMenuRef} className="relative flex-1 h-full">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              isMoreActive ? 'text-pink-primary' : 'text-gray-400'
            }`}
          >
            <div
              className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                isMoreActive ? 'bg-pink-primary/10' : ''
              }`}
            >
              <MoreHorizontal size={20} strokeWidth={2.5} />
              <span className="text-[9px] font-medium mt-0.5">More</span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showMoreMenu && (
            <div className="absolute bottom-full right-2 mb-2 bg-white border border-pink-primary/10 rounded-2xl shadow-2xl overflow-hidden min-w-[140px]">
              {moreMenuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')

                return (
                  <button
                    key={item.href}
                    onClick={() => handleMoreItemClick(item.href)}
                    className={`flex items-center gap-3 w-full px-4 py-3 transition-colors ${
                      isActive 
                        ? 'bg-pink-primary/10 text-pink-primary' 
                        : 'text-pink-primary/70 hover:bg-pink-primary/5'
                    }`}
                  >
                    <Icon size={18} strokeWidth={2.5} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
