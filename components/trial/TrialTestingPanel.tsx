'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { resetModalTracking } from '@/lib/modal-manager'
import { FlaskConical, X } from 'lucide-react'
import db from '@/lib/instant'
import { isEtsyUser, getUserTrialStatus, UserBillingData } from '@/lib/trial-helpers'

/**
 * 🧪 TESTING COMPONENT - REMOVE BEFORE PRODUCTION!
 * 
 * This panel helps you test different trial states without waiting.
 * Access it from any page by adding ?test=true to the URL
 */
export default function TrialTestingPanel() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const { user } = db.useAuth()
  
  // Query user data with billing fields
  const { data } = db.useQuery(
    user?.id ? {
      $users: {
        $: {
          where: {
            id: user.id
          }
        }
      }
    } : null
  )
  
  const userData = data?.$users?.[0] as UserBillingData | undefined

  // Only show in development or when ?test=true is in URL
  if (typeof window !== 'undefined') {
    const hasTestParam = new URLSearchParams(window.location.search).has('test')
    if (!hasTestParam) return null
  }

  const setTrialDay = (day: number) => {
    if (day === 0) {
      localStorage.removeItem('__test_trial_day')
      console.log('🧪 Test mode disabled - using real trial day')
    } else {
      localStorage.setItem('__test_trial_day', day.toString())
      console.log(`🧪 Test mode: Simulating trial day ${day}`)
    }
    router.refresh()
    window.location.reload()
  }

  const resetModals = () => {
    resetModalTracking()
    console.log('🧪 All modal tracking cleared')
    router.refresh()
    window.location.reload()
  }

  const getCurrentTestDay = () => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('__test_trial_day')
  }
  
  const toggleEtsyUser = () => {
    if (typeof window === 'undefined') return
    const currentValue = localStorage.getItem('__test_etsy_user')
    if (currentValue === 'true') {
      localStorage.setItem('__test_etsy_user', 'false')
      console.log('🧪 Test mode: Now testing as REGULAR user')
    } else {
      localStorage.setItem('__test_etsy_user', 'true')
      console.log('🧪 Test mode: Now testing as ETSY user')
    }
    router.refresh()
    window.location.reload()
  }
  
  const getTestEtsyStatus = () => {
    if (typeof window === 'undefined') return null
    const value = localStorage.getItem('__test_etsy_user')
    if (value === 'true') return true
    if (value === 'false') return false
    return null
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all"
        title="Trial Testing Panel"
      >
        <FlaskConical size={24} />
      </button>
    )
  }
  
  const isEtsy = userData ? isEtsyUser(userData) : false
  const testEtsyOverride = getTestEtsyStatus()
  const effectiveEtsyStatus = testEtsyOverride !== null ? testEtsyOverride : isEtsy
  const trialStatus = userData ? getUserTrialStatus(userData) : null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 w-80 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FlaskConical size={20} className="text-purple-600" />
          <h3 className="font-semibold text-gray-900">Trial Testing</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Current Status Display */}
      <div className="space-y-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-600">User Type:</span>
            <span className={`font-semibold ${effectiveEtsyStatus ? 'text-orange-600' : 'text-blue-600'}`}>
              {effectiveEtsyStatus ? '🛍️ ETSY' : '👤 REGULAR'}
              {testEtsyOverride !== null && ' (override)'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Billing Status:</span>
            <span className="font-semibold text-gray-900">
              {userData?.billing_status || 'N/A'}
            </span>
          </div>
          {trialStatus && (
            <div className="flex justify-between">
              <span className="text-gray-600">Days Remaining:</span>
              <span className="font-semibold text-gray-900">
                {trialStatus.daysRemaining}
              </span>
            </div>
          )}
        </div>
      </div>

      {getCurrentTestDay() && (
        <div className="mb-3 p-2 bg-purple-100 border border-purple-300 rounded-lg text-sm text-purple-800">
          🧪 Currently simulating: <strong>Day {getCurrentTestDay()}</strong>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <p className="text-xs text-gray-600 mb-2">Jump to trial day:</p>
        
        <Button
          onClick={() => setTrialDay(1)}
          size="sm"
          variant="outline"
          fullWidth
        >
          Day 1 (Fresh start)
        </Button>
        
        <Button
          onClick={() => setTrialDay(4)}
          size="sm"
          variant="outline"
          fullWidth
        >
          Day 4 (No warnings yet)
        </Button>
        
        <Button
          onClick={() => setTrialDay(5)}
          size="sm"
          variant="outline"
          fullWidth
          className="border-orange-300 hover:bg-orange-50"
        >
          Day 5 {effectiveEtsyStatus ? '(Etsy modal!)' : '(Banner starts)'}
        </Button>
        
        <Button
          onClick={() => setTrialDay(6)}
          size="sm"
          variant="outline"
          fullWidth
          className="border-orange-300 hover:bg-orange-50"
        >
          Day 6 (Banner shows)
        </Button>
        
        <Button
          onClick={() => setTrialDay(7)}
          size="sm"
          variant="outline"
          fullWidth
          className="border-red-300 hover:bg-red-50"
        >
          Day 7 (Last day!)
        </Button>
        
        <Button
          onClick={() => setTrialDay(8)}
          size="sm"
          variant="outline"
          fullWidth
          className="border-red-500 hover:bg-red-50"
        >
          Day 8 (Expired)
        </Button>
      </div>

      <div className="space-y-2 pt-3 border-t border-gray-200">
        <Button
          onClick={toggleEtsyUser}
          size="sm"
          variant={effectiveEtsyStatus ? 'primary' : 'outline'}
          fullWidth
        >
          {effectiveEtsyStatus ? '🛍️ Switch to Regular' : '👤 Switch to Etsy'}
        </Button>
        
        <Button
          onClick={resetModals}
          size="sm"
          variant="outline"
          fullWidth
        >
          Reset All Modals
        </Button>
        
        <Button
          onClick={() => setTrialDay(0)}
          size="sm"
          variant="secondary"
          fullWidth
        >
          Disable Test Mode
        </Button>
      </div>

      <p className="text-xs text-gray-500 mt-3 text-center">
        Remove this component before production!
      </p>
    </div>
  )
}
