'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useSidebar } from '@/components/layout/SidebarContext'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const { isExpanded } = useSidebar()
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'md:max-w-[calc(100%-8rem)]', // Desktop: leave 4rem (64px) on each side for centering
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[35] transition-[left] duration-300 ease-out ${
                isExpanded ? 'md:left-[240px]' : 'md:left-[69px]'
              }`}
          />

          {/* Modal */}
          <div 
            className={`fixed top-[72px] left-0 right-0 bottom-[80px] z-[36] flex items-end justify-center p-4 pointer-events-none transition-[left] duration-300 ease-out
              md:top-[88px] md:items-center md:bottom-[16px] ${
                isExpanded ? 'md:left-[240px]' : 'md:left-[69px]'
              }`}
          >
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`bg-white rounded-4xl shadow-2xl w-full ${sizes[size]} max-h-full md:max-h-full overflow-hidden flex flex-col relative pointer-events-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between p-6 border-b border-pink-primary/10">
                  <h2 className="text-xl md:text-2xl font-black text-pink-primary">
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-pink-light transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={24} className="text-pink-primary" />
                  </button>
                </div>
              )}

              {/* Content */}
              <div className="overflow-y-auto flex-1 p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
