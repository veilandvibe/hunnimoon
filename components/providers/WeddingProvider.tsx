'use client'

import { createContext, useContext, ReactNode } from 'react'
import db from '@/lib/instant'

interface WeddingContextType {
  wedding: any | null
  isLoading: boolean
}

const WeddingContext = createContext<WeddingContextType | null>(null)

export function WeddingProvider({ children }: { children: ReactNode }) {
  const { user } = db.useAuth()
  const { data, isLoading } = db.useQuery(
    user?.id ? {
      weddings: {
        $: {
          where: {
            user_id: user.id
          }
        }
      }
    } : null
  )
  const wedding = data?.weddings?.[0] || null
  
  return (
    <WeddingContext.Provider value={{ wedding, isLoading }}>
      {children}
    </WeddingContext.Provider>
  )
}

export const useWedding = () => {
  const context = useContext(WeddingContext)
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider')
  }
  return context
}
