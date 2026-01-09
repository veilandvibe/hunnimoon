'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, ClipboardCheck, DollarSign, MoreHorizontal } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/guests', icon: Users, label: 'Guests' },
  { href: '/rsvp-manager', icon: ClipboardCheck, label: 'RSVP' },
  { href: '/budget', icon: DollarSign, label: 'Budget' },
  { href: '/settings', icon: MoreHorizontal, label: 'More' },
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
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                  isActive ? 'bg-pink-primary/10' : ''
                }`}
              >
                <Icon size={22} strokeWidth={2.5} />
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
