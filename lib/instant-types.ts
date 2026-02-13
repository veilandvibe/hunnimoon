/**
 * TypeScript type definitions for InstantDB entities
 * These types match the schema defined in instant.schema.ts
 * All fields are optional to match InstantDB's .optional() pattern
 */

// Type aliases for common patterns
export type RSVPStatus = 'Pending' | 'Yes' | 'No'
export type Side = 'Bride' | 'Groom' | 'Both' | 'Unknown'

/**
 * Guest entity
 * Represents a wedding guest with contact info, RSVP status, and preferences
 */
export interface Guest {
  id: string
  wedding_id?: string
  full_name?: string
  email?: string
  phone?: string
  side?: string
  household_id?: string
  plus_one_allowed?: boolean
  plus_one_name?: string
  invite_sent?: boolean
  rsvp_status?: string
  meal_choice?: string
  dietary_notes?: string
  rsvp_notes?: string
  shuttle_needed?: boolean
  song_request?: string
  needs_accommodation?: boolean
  address_street?: string
  address_city?: string
  address_state?: string
  address_postal?: string
  address_country?: string
  source?: string
  last_updated?: number
}

/**
 * Wedding entity
 * Core wedding information
 */
export interface Wedding {
  id: string
  user_id?: string
  partner1_name?: string
  partner2_name?: string
  wedding_date?: string
  wedding_slug?: string
  total_budget?: number
  created_at?: number
}

/**
 * BudgetItem entity
 * Individual budget line items for wedding expenses
 */
export interface BudgetItem {
  id: string
  wedding_id?: string
  category_name?: string
  estimated_cost?: number
  actual_cost?: number
  is_paid?: boolean
  is_active?: boolean
  is_custom?: boolean
  sort_order?: number
}

/**
 * Vendor entity
 * Wedding vendor contact information
 */
export interface Vendor {
  id: string
  wedding_id?: string
  vendor_name?: string
  contact_name?: string
  email?: string
  phone?: string
  website?: string
  notes?: string
}

/**
 * RsvpSettings entity
 * Configuration for the public RSVP form
 */
export interface RsvpSettings {
  id: string
  wedding_id?: string
  custom_message?: string
  meal_options?: string
  password_protected?: boolean
  require_dietary_restrictions?: boolean
  rsvp_password?: string
  show_dietary_restrictions?: boolean
  show_meal_choice?: boolean
  show_notes_field?: boolean
  show_song_request?: boolean
  show_accommodation_question?: boolean
  shuttle_service_available?: boolean
}

/**
 * InstantUser entity (maps to $users in schema)
 * User authentication and billing information
 */
export interface InstantUser {
  id: string
  email?: string
  imageURL?: string
  type?: string
  first_name?: string
  trial_start_date?: number
  billing_status?: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  subscription_plan?: string
  subscription_start_date?: number
  subscription_canceled_at?: number
  acq_source?: string
  acq_source_set_at?: number
  trial_expiring_email_sent?: boolean
  trial_expired_email_sent?: boolean
}

/**
 * Complete database schema type
 * Defines all entities and their relationships for InstantDB
 */
export interface Database {
  guests: Guest
  weddings: Wedding
  budgetItems: BudgetItem
  vendors: Vendor
  rsvpSettings: RsvpSettings
  $users: InstantUser
}
