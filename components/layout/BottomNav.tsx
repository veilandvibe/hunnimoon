'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, ClipboardCheck, DollarSign, Briefcase, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/guests', icon: Users, label: 'Guests' },
  { href: '/rsvp-manager', icon: ClipboardCheck, label: 'RSVP' },
  { href: '/budget', icon: DollarSign, label: 'Budget' },
  { href: '/vendors', icon: Briefcase, label: 'Vendors' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export default function BottomNav() {
  const pathname = usePathname()

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
      </div>
    </nav>
  )
}
