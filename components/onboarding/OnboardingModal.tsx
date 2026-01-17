'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Users, 
  ClipboardCheck, 
  DollarSign, 
  Briefcase, 
  Settings, 
  X,
  ChevronRight
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useTour } from '@/components/providers/TourContext'

interface OnboardingPage {
  icon: React.ElementType
  title: string
  description: string
  features: string[]
}

const onboardingPages: OnboardingPage[] = [
  {
    icon: Home,
    title: 'Dashboard',
    description: 'See everything at a glance - your countdown, guest list, RSVPs, and budget.',
    features: [
      'Countdown to your big day',
      'Guest and attendance numbers',
      'See who\'s attending at a glance',
      'Track your budget and spending'
    ]
  },
  {
    icon: Users,
    title: 'Guests',
    description: 'Build your guest list. Add guests one by one or import a spreadsheet, group them into households, and track who\'s coming.',
    features: [
      'Add guests one by one or import a list',
      'Group guests into households',
      'Search and filter your list',
      'Track RSVP status for each guest'
    ]
  },
  {
    icon: ClipboardCheck,
    title: 'RSVP Manager',
    description: 'Get RSVPs online. Share your unique link with guests and their responses come straight to you - no manual tracking needed.',
    features: [
      'Share one link with all your guests',
      'Guests find their name and RSVP online',
      'Responses update your guest list instantly',
      'Ask about meals, dietary needs, song requests, and more'
    ]
  },
  {
    icon: DollarSign,
    title: 'Budget',
    description: 'Keep your spending on track. Set your budget, add categories, and see where every dollar goes.',
    features: [
      'Set your total budget',
      'See what you\'ve spent and what\'s left',
      'Use our categories or create your own',
      'Check off paid items to update your total'
    ]
  },
  {
    icon: Briefcase,
    title: 'Vendors',
    description: 'Keep all your vendor contacts in one place. Photographers, florists, caterers - everyone you need.',
    features: [
      'Save contact info for each vendor',
      'Add notes and details',
      'Click to call, email, or visit their website',
      'Link vendors to your budget categories'
    ]
  },
  {
    icon: Settings,
    title: 'Settings',
    description: 'Update your wedding details anytime. Change your date, names, RSVP link, and more.',
    features: [
      'Edit your wedding date and names',
      'Change your RSVP link',
      'View your subscription status',
      'Replay this tour anytime'
    ]
  }
]

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const { completeOnboarding } = useTour()

  const currentPage = onboardingPages[currentStep]
  const isLastStep = currentStep === onboardingPages.length - 1
  const Icon = currentPage.icon

  const handleNext = () => {
    if (isLastStep) {
      completeOnboarding()
      onClose()
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    completeOnboarding()
    onClose()
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
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
            className="fixed inset-0 bg-gradient-to-br from-pink-primary/95 to-pink-secondary/95 backdrop-blur-sm z-[60]"
          />

          {/* Modal Content */}
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-4xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            >
              {/* Skip button */}
              <button
                onClick={handleSkip}
                className="absolute top-6 right-6 p-2 text-pink-primary/60 hover:text-pink-primary transition-colors rounded-full hover:bg-pink-light"
                aria-label="Skip tour"
              >
                <X size={24} />
              </button>

              {/* Progress indicator */}
              <div className="pt-8 pb-4 px-8">
                <div className="flex gap-2">
                  {onboardingPages.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        index <= currentStep ? 'bg-pink-primary' : 'bg-pink-primary/20'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-pink-primary/60 mt-3 text-center">
                  {currentStep + 1} of {onboardingPages.length}
                </p>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="px-8 pb-8"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pink-primary to-pink-secondary flex items-center justify-center">
                      <Icon size={40} className="text-white" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-black text-pink-primary text-center mb-4">
                    {currentPage.title}
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-pink-primary/80 text-center mb-8">
                    {currentPage.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {currentPage.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 text-pink-primary/70"
                      >
                        <ChevronRight size={20} className="flex-shrink-0 mt-0.5 text-pink-primary" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Navigation buttons */}
                  <div className="flex gap-3">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        onClick={handleBack}
                        className="flex-1"
                      >
                        Back
                      </Button>
                    )}
                    <Button
                      onClick={handleNext}
                      className="flex-1"
                    >
                      {isLastStep ? 'Get Started' : 'Next'}
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
