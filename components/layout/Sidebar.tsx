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

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[69px] bg-white border-r border-pink-primary/10 z-50">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 border-b border-pink-primary/10">
        <div className="w-6 h-3 relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-pink-primary rounded-full" />
          <div className="absolute top-1.5 left-0 w-full h-[2px] bg-pink-primary rounded-full" />
          <div className="absolute top-3 left-0 w-full h-[2px] bg-pink-primary rounded-full" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center py-8 gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group relative"
              title={item.label}
            >
              <div
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all ${
                  isActive
                    ? 'bg-pink-primary text-white'
                    : 'text-pink-primary hover:bg-pink-primary/10'
                }`}
              >
                <Icon size={20} strokeWidth={2.5} />
              </div>
              <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
