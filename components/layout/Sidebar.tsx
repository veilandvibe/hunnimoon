'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, ClipboardCheck, DollarSign, Briefcase, Settings, Menu, HelpCircle, LogOut, Shield, MessageSquare } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSidebar } from './SidebarContext'
import { useTour } from '@/components/providers/TourContext'
import { isAdminEmail, getAdminPath } from '@/lib/admin-helpers'
import db from '@/lib/instant'

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
  const router = useRouter()
  const { isExpanded, setIsExpanded } = useSidebar()
  const { startPageTour } = useTour()
  const { user } = db.useAuth()
  const isAdmin = isAdminEmail(user?.email)

  const handleHelpClick = () => {
    // Determine current page from pathname
    const pageName = pathname?.split('/')[1] || 'dashboard'
    startPageTour(pageName)
  }

  const handleSignOut = async () => {
    try {
      await db.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isExpanded ? 240 : 69,
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="hidden md:flex flex-col fixed left-0 top-0 h-screen bg-white border-r border-pink-primary/10 z-50 overflow-hidden"
    >
      {/* Hamburger Menu */}
      <div className="flex items-center h-16 border-b border-pink-primary/10 px-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-pink-light rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} className="text-pink-primary" strokeWidth={2.5} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col py-8 gap-4 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="group"
              title={!isExpanded ? item.label : undefined}
            >
              <motion.div
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-pink-primary text-white'
                    : 'text-pink-primary hover:bg-pink-primary/10'
                }`}
              >
                <Icon size={20} strokeWidth={2.5} className="flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium text-sm whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}

        {/* Admin Link (only visible to admins) */}
        {isAdmin && (
          <Link
            href={getAdminPath()}
            className="group mt-auto"
            title={!isExpanded ? 'Admin Dashboard' : undefined}
          >
            <motion.div
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
                pathname === getAdminPath()
                  ? 'bg-pink-primary text-white'
                  : 'text-pink-primary hover:bg-pink-primary/10'
              }`}
            >
              <Shield size={20} strokeWidth={2} className="flex-shrink-0" />
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium text-sm whitespace-nowrap overflow-hidden"
                  >
                    Admin
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        )}

        {/* Feedback Link */}
        <Link
          href="/feedback"
          className={`group ${!isAdmin ? 'mt-auto' : ''}`}
          title={!isExpanded ? 'Feedback' : undefined}
        >
          <motion.div
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors ${
              pathname === '/feedback' || pathname?.startsWith('/feedback/')
                ? 'bg-pink-primary text-white'
                : 'text-pink-primary hover:bg-pink-primary/10'
            }`}
          >
            <MessageSquare size={20} strokeWidth={2} className="flex-shrink-0" />
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm whitespace-nowrap overflow-hidden"
                >
                  Feedback
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        {/* Help Button */}
        <button
          onClick={handleHelpClick}
          className="group"
          title={!isExpanded ? 'Page Help' : undefined}
        >
          <motion.div
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-pink-primary hover:bg-pink-primary/10 transition-colors"
          >
            <HelpCircle size={20} strokeWidth={2} className="flex-shrink-0" />
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm whitespace-nowrap overflow-hidden"
                >
                  Help
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </button>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="group"
          title={!isExpanded ? 'Sign Out' : undefined}
        >
          <motion.div
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-pink-primary hover:bg-pink-primary/10 transition-colors"
          >
            <LogOut size={20} strokeWidth={2} className="flex-shrink-0" />
            <AnimatePresence mode="wait">
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium text-sm whitespace-nowrap overflow-hidden"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </button>
      </nav>
    </motion.aside>
  )
}
