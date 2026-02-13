import { init } from '@instantdb/react'
import schema from '../instant.schema'

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!

if (!APP_ID) {
  throw new Error('NEXT_PUBLIC_INSTANT_APP_ID is not set in environment variables')
}

// Initialize InstantDB client
// The schema provides type inference automatically
const db = init({
  appId: APP_ID,
  schema,
  devtool: false, // Hide the InstantDB devtools icon
})

export default db

// Export types for manual typing when needed
export type { AppSchema } from '../instant.schema'
export type {
  Guest,
  Wedding,
  BudgetItem,
  Vendor,
  RsvpSettings,
  InstantUser,
  Database,
  RSVPStatus,
  Side,
} from './instant-types'
