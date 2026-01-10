// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/core";

const _schema = i.schema({
  entities: {
    "$files": i.entity({
      "path": i.string().unique().indexed(),
      "url": i.string().optional(),
    }),
    "$users": i.entity({
      "email": i.string().unique().indexed().optional(),
      "imageURL": i.string().optional(),
      "type": i.string().optional(),
    }),
    "budgetItems": i.entity({
      "actual_cost": i.number().optional(),
      "category_name": i.string().optional(),
      "estimated_cost": i.number().optional(),
      "is_active": i.boolean().optional(),
      "is_custom": i.boolean().optional(),
      "is_paid": i.boolean().optional(),
      "sort_order": i.number().optional(),
      "wedding_id": i.string().optional(),
    }),
    "guests": i.entity({
      "address_city": i.string().optional(),
      "address_country": i.string().optional(),
      "address_postal": i.string().optional(),
      "address_state": i.string().optional(),
      "address_street": i.string().optional(),
      "dietary_notes": i.string().optional(),
      "email": i.string().optional(),
      "full_name": i.string().optional(),
      "household_id": i.string().optional(),
      "invite_sent": i.boolean().optional(),
      "last_updated": i.number().optional(),
      "meal_choice": i.string().optional(),
      "phone": i.string().optional(),
      "plus_one_allowed": i.boolean().optional(),
      "plus_one_name": i.string().optional(),
      "rsvp_notes": i.string().optional(),
      "rsvp_status": i.string().optional(),
      "shuttle_needed": i.boolean().optional(),
      "side": i.string().optional(),
      "source": i.string().optional(),
      "wedding_id": i.string().optional(),
    }),
    "rsvpSettings": i.entity({
      "custom_message": i.string().optional(),
      "require_dietary_restrictions": i.boolean().optional(),
      "show_dietary_restrictions": i.boolean().optional(),
      "show_meal_choice": i.boolean().optional(),
      "show_notes_field": i.boolean().optional(),
      "shuttle_service_available": i.boolean().optional(),
      "wedding_id": i.string().optional(),
    }),
    "vendors": i.entity({
      "wedding_id": i.string().optional(),
      "vendor_name": i.string().optional(),
      "contact_name": i.string().optional(),
      "email": i.string().optional(),
      "phone": i.string().optional(),
      "website": i.string().optional(),
      "notes": i.string().optional(),
    }),
    "weddings": i.entity({
      "created_at": i.number().optional(),
      "partner1_name": i.string().optional(),
      "partner2_name": i.string().optional(),
      "total_budget": i.number().optional(),
      "user_id": i.string().optional(),
      "wedding_date": i.string().optional(),
      "wedding_slug": i.string().unique().optional(),
    }),
  },
  links: {
    "$usersLinkedPrimaryUser": {
      "forward": {
        "on": "$users",
        "has": "one",
        "label": "linkedPrimaryUser",
        "onDelete": "cascade"
      },
      "reverse": {
        "on": "$users",
        "has": "many",
        "label": "linkedGuestUsers"
      }
    },
    "weddingGuests": {
      "forward": {
        "on": "weddings",
        "has": "many",
        "label": "guests",
      },
      "reverse": {
        "on": "guests",
        "has": "one",
        "label": "wedding",
      },
    },
    "weddingBudget": {
      "forward": {
        "on": "weddings",
        "has": "many",
        "label": "budgetItems",
      },
      "reverse": {
        "on": "budgetItems",
        "has": "one",
        "label": "wedding",
      },
    },
    "weddingVendors": {
      "forward": {
        "on": "weddings",
        "has": "many",
        "label": "vendors",
      },
      "reverse": {
        "on": "vendors",
        "has": "one",
        "label": "wedding",
      },
    },
    "weddingSettings": {
      "forward": {
        "on": "weddings",
        "has": "one",
        "label": "rsvpSettings",
      },
      "reverse": {
        "on": "rsvpSettings",
        "has": "one",
        "label": "wedding",
      },
    },
  },
  rooms: {},
  permissions: {
    weddings: {
      allow: {
        create: "auth.id != null",
        read: "auth.id == data.user_id || data.wedding_slug != null",
        update: "auth.id == data.user_id",
        delete: "auth.id == data.user_id",
      },
    },
    guests: {
      allow: {
        create: "auth.id == data.ref('wedding').user_id || auth.id == null",
        read: "auth.id == data.ref('wedding').user_id || auth.id == null",
        update: "auth.id == data.ref('wedding').user_id || auth.id == null",
        delete: "auth.id == data.ref('wedding').user_id",
      },
    },
    budgetItems: {
      allow: {
        create: "auth.id == data.ref('wedding').user_id",
        read: "auth.id == data.ref('wedding').user_id",
        update: "auth.id == data.ref('wedding').user_id",
        delete: "auth.id == data.ref('wedding').user_id",
      },
    },
    vendors: {
      allow: {
        create: "auth.id == data.ref('wedding').user_id",
        read: "auth.id == data.ref('wedding').user_id",
        update: "auth.id == data.ref('wedding').user_id",
        delete: "auth.id == data.ref('wedding').user_id",
      },
    },
    rsvpSettings: {
      allow: {
        create: "auth.id == data.ref('wedding').user_id",
        read: "auth.id == data.ref('wedding').user_id || auth.id == null",
        update: "auth.id == data.ref('wedding').user_id",
        delete: "auth.id == data.ref('wedding').user_id",
      },
    },
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema }
export default schema;
