'use client'

import { useMemo } from 'react'
import db from '@/lib/instant'
import { getUserTrialStatus, UserBillingData } from '@/lib/trial-helpers'
import { shouldShowReadOnlyMode } from '@/lib/billing-status'

/**
 * Custom hook to determine if the app should be in read-only mode
 * Returns true if user's trial has expired and they haven't upgraded
 */
export function useReadOnly() {
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
  
  const isReadOnly = useMemo(() => {
    if (!userData) return false
    return shouldShowReadOnlyMode(userData)
  }, [userData])
  
  const trialStatus = useMemo(() => {
    if (!userData) return null
    return getUserTrialStatus(userData)
  }, [userData])
  
  return {
    isReadOnly,
    trialStatus,
    userData
  }
}
