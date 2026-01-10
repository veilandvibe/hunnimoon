// InstantDB Schema for Hunnimoon Wedding Planner
// Visit https://instantdb.com/dash to manage your schema

import { i } from '@instantdb/react'

const schema = i.schema({
  entities: {
    weddings: i.entity({
      user_id: i.string(),
      partner1_name: i.string(),
      partner2_name: i.string(),
      wedding_date: i.string(),
      wedding_slug: i.string().unique(),
      created_at: i.number(),
    }),
    guests: i.entity({
      wedding_id: i.string(),
      full_name: i.string(),
      email: i.string().optional(),
      phone: i.string().optional(),
      side: i.string(), // 'Bride' | 'Groom' | 'Both' | 'Unknown'
      household_id: i.string().optional(),
      plus_one_allowed: i.boolean(),
      plus_one_name: i.string().optional(),
      invite_sent: i.boolean(),
      rsvp_status: i.string(), // 'Pending' | 'Yes' | 'No'
      meal_choice: i.string().optional(),
      dietary_notes: i.string().optional(),
      rsvp_notes: i.string().optional(),
      shuttle_needed: i.boolean(),
      address_street: i.string().optional(),
      address_city: i.string().optional(),
      address_state: i.string().optional(),
      address_postal: i.string().optional(),
      address_country: i.string().optional(),
      source: i.string(), // 'Manual' | 'RSVP'
      last_updated: i.number(),
    }),
    budgetItems: i.entity({
      wedding_id: i.string(),
      category_name: i.string(),
      estimated_cost: i.number(),
      actual_cost: i.number(),
      is_paid: i.boolean(),
      is_active: i.boolean(),
      is_custom: i.boolean(),
      sort_order: i.number(),
    }),
    vendors: i.entity({
      wedding_id: i.string(),
      vendor_name: i.string(),
      contact_name: i.string().optional(),
      email: i.string().optional(),
      phone: i.string().optional(),
      website: i.string().optional(),
      notes: i.string().optional(),
    }),
    rsvpSettings: i.entity({
      wedding_id: i.string(),
      show_meal_choice: i.boolean(),
      show_dietary_restrictions: i.boolean(),
      require_dietary_restrictions: i.boolean(),
      show_notes_field: i.boolean(),
      shuttle_service_available: i.boolean(),
      custom_message: i.string().optional(),
    }),
  },
  links: {
    weddingGuests: {
      forward: {
        on: 'weddings',
        has: 'many',
        label: 'guests',
      },
      reverse: {
        on: 'guests',
        has: 'one',
        label: 'wedding',
      },
    },
    weddingBudget: {
      forward: {
        on: 'weddings',
        has: 'many',
        label: 'budgetItems',
      },
      reverse: {
        on: 'budgetItems',
        has: 'one',
        label: 'wedding',
      },
    },
    weddingVendors: {
      forward: {
        on: 'weddings',
        has: 'many',
        label: 'vendors',
      },
      reverse: {
        on: 'vendors',
        has: 'one',
        label: 'wedding',
      },
    },
    weddingSettings: {
      forward: {
        on: 'weddings',
        has: 'one',
        label: 'rsvpSettings',
      },
      reverse: {
        on: 'rsvpSettings',
        has: 'one',
        label: 'wedding',
      },
    },
  },
  permissions: {
    // Weddings: Users can only access their own weddings
    // Public can read weddings by slug for RSVP pages
    weddings: {
      allow: {
        create: 'auth.id != null',
        read: 'auth.id == data.user_id || data.wedding_slug != null',
        update: 'auth.id == data.user_id',
        delete: 'auth.id == data.user_id',
      },
    },
    // Guests: Wedding owners can CRUD, public can read/create/update for RSVP
    guests: {
      allow: {
        create: 'auth.id == data.ref("wedding").user_id || auth.id == null',
        read: 'auth.id == data.ref("wedding").user_id || auth.id == null',
        update: 'auth.id == data.ref("wedding").user_id || auth.id == null',
        delete: 'auth.id == data.ref("wedding").user_id',
      },
    },
    // Budget Items: Only wedding owners can access
    budgetItems: {
      allow: {
        create: 'auth.id == data.ref("wedding").user_id',
        read: 'auth.id == data.ref("wedding").user_id',
        update: 'auth.id == data.ref("wedding").user_id',
        delete: 'auth.id == data.ref("wedding").user_id',
      },
    },
    // Vendors: Only wedding owners can access
    vendors: {
      allow: {
        create: 'auth.id == data.ref("wedding").user_id',
        read: 'auth.id == data.ref("wedding").user_id',
        update: 'auth.id == data.ref("wedding").user_id',
        delete: 'auth.id == data.ref("wedding").user_id',
      },
    },
    // RSVP Settings: Wedding owners can CRUD, public can read for RSVP pages
    rsvpSettings: {
      allow: {
        create: 'auth.id == data.ref("wedding").user_id',
        read: 'auth.id == data.ref("wedding").user_id || auth.id == null',
        update: 'auth.id == data.ref("wedding").user_id',
        delete: 'auth.id == data.ref("wedding").user_id',
      },
    },
  },
})

export default schema

// Type exports for TypeScript
export type Schema = typeof schema
