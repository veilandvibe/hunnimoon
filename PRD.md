# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Hunnimoon Wedding Planner

**Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Production Ready

---

## 1. EXECUTIVE SUMMARY

### 1.1 Product Vision
Hunnimoon is a modern, mobile-first wedding planning application that enables engaged couples to manage every aspect of their wedding through a single, intuitive platform. The app provides real-time collaboration, guest management, RSVP tracking, budget monitoring, and vendor coordination.

### 1.2 Target Audience
- **Primary:** Engaged couples planning their wedding (ages 25-40)
- **Secondary:** Wedding planners managing client events
- **Geographic:** Global, English-language initially

### 1.3 Key Differentiators
- **Mobile-first design** with seamless desktop experience
- **Real-time updates** across all devices
- **Zero-setup** - no complex configuration required
- **Magic link authentication** - no passwords to remember
- **Public RSVP forms** with unique wedding URLs
- **Built-in security** and rate limiting

---

## 2. CORE FEATURES

### 2.1 Authentication & Onboarding

#### Magic Link Authentication
- **6-digit code** sent via email
- **No passwords** required
- **30-day session** persistence
- **Rate limiting:** 3 attempts per hour per email

#### First-Time Onboarding
- Welcome screen with app overview
- Wedding details form:
  - Partner 1 name (required)
  - Partner 2 name (required)
  - Wedding date (required, must be future)
  - Wedding slug (auto-generated, customizable)
- Creates initial wedding record with default settings
- Redirects to dashboard upon completion

### 2.2 Dashboard (Home)

#### Wedding Countdown Timer
- **Real-time countdown** to wedding date
- Displays: Days, Hours, Minutes, Seconds
- Shows both partner names
- Animated gradient background
- Updates every second

#### Guest Metrics
- **Total Guests:** Complete guest list count
- **Invites Sent:** Number and percentage sent
- **Projected Attendance:** Yes + 50% of pending RSVPs
- **Total Budget:** Sum of all budget items

#### RSVP Status Section
- **Confirmed (Yes):** Green indicator
- **Declined (No):** Red indicator
- **Awaiting Response:** Amber indicator
- **Pie Chart Visualization:** Interactive donut chart with percentages

#### Budget Overview
- **Total Budget:** All estimated costs
- **Amount Spent:** Actual costs tracked
- **Remaining Budget:** Difference calculation
- **Progress Bar:** Visual spending tracker
- Color-coded warnings (red when over budget)

### 2.3 Guest Management

#### Guest List Features
- **Full CRUD operations:** Create, Read, Update, Delete
- **Real-time search** by name, email, or household
- **Advanced filtering:**
  - RSVP status (Yes, No, Pending)
  - Side (Bride, Groom, Both, Unknown)
  - Plus-one status
  - Invite sent status
- **Household grouping** for families
- **Sorting options:** Name, RSVP status, date added

#### Guest Information Fields
**Basic Information:**
- Full name (required)
- Email address
- Phone number
- Side (Bride/Groom/Both/Unknown)

**RSVP Details:**
- RSVP status (Pending/Yes/No)
- Plus-one allowed (yes/no)
- Plus-one name (if applicable)
- Meal choice (customizable options)
- Dietary restrictions/notes
- Shuttle service needed (yes/no)

**Contact Information:**
- Street address
- City
- State/Province
- Postal code
- Country

**Metadata:**
- Household ID (for grouping)
- Invite sent (yes/no)
- Source (Manual/RSVP)
- Last updated timestamp

#### Bulk Operations
- **CSV Export:** Export complete guest list
- **CSV Import:** Upload guest list (max 1,000 guests per upload)
- **Rate limits:** 3 uploads per hour, 50 manual additions per hour

### 2.4 Public RSVP Form

#### Unique Wedding URL
- Format: `yourapp.com/rsvp/[wedding-slug]`
- Customizable slug (e.g., "john-and-jane-2026")
- Shareable via any channel (email, text, social)

#### RSVP Form Fields
**Configurable Settings:**
- Show/hide meal choice
- Show/hide dietary restrictions
- Require/optional dietary restrictions
- Show/hide notes field
- Enable/disable shuttle service option
- Custom thank-you message

**Guest Autocomplete:**
- Type-ahead search for guest names
- Pre-fills known information
- Creates new guest if not found

**Form Submission:**
- Real-time validation
- CSRF protection
- Rate limiting (5 submissions per hour per IP)
- Immediate dashboard update
- Optional confirmation message

#### Bot Protection
- Rate limiting per IP
- Input validation (Zod schemas)
- Generic error messages (no data leakage)

### 2.5 Budget Tracking

#### Budget Categories
**Predefined Categories:**
- Venue
- Catering
- Photography
- Videography
- Flowers/Décor
- Music/Entertainment
- Attire
- Invitations
- Rings
- Transportation
- Accommodations
- Wedding Planner
- Miscellaneous

#### Budget Item Management
- **Create custom categories**
- **Estimated cost** field
- **Actual cost** field (tracks spending)
- **Paid status** toggle
- **Active/Inactive** toggle (hide categories)
- **Sort order** customization
- **Auto-calculation** of totals

#### Budget Visualization
- **Progress bars** per category
- **Total vs. Spent** comparison
- **Remaining budget** indicator
- **Over-budget warnings** (red highlighting)
- **Percentage complete** display

#### Export Options
- **CSV export** of all budget items
- Includes all cost details and status

### 2.6 Vendor Management

#### Vendor Information
- **Vendor name** (required)
- **Contact name**
- **Email address**
- **Phone number**
- **Website URL**
- **Notes/description**
- **Linked budget category** (optional)

#### Vendor List Features
- **Search and filter** by name or category
- **Quick contact actions:**
  - Click to call
  - Click to email
  - Click to visit website
- **Budget integration** (links to budget items)
- **CRUD operations** (Create, Read, Update, Delete)

#### Export Options
- **CSV export** of vendor list
- Includes all contact details

### 2.7 Settings & Configuration

#### RSVP Form Settings
- Toggle meal choice field
- Toggle dietary restrictions field
- Require dietary restrictions (yes/no)
- Toggle notes field
- Toggle shuttle service option
- Custom thank-you message (rich text)

#### Wedding Details
- Edit partner names
- Change wedding date
- Update wedding slug
- View unique RSVP URL

#### Account Management
- View account email
- Sign out option
- Session expiry (30 days)

---

## 3. TECHNICAL ARCHITECTURE

### 3.1 Technology Stack

**Frontend:**
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Charts:** Recharts
- **Icons:** Lucide React

**Backend:**
- **Database:** InstantDB (real-time, serverless)
- **Authentication:** InstantDB Auth (magic links)
- **API:** Built-in InstantDB SDK
- **Validation:** Zod

**Deployment:**
- **Hosting:** Vercel (recommended)
- **Domain:** Custom domain support
- **SSL:** Automatic HTTPS
- **CDN:** Global edge network

### 3.2 Data Model

#### Weddings Table
```typescript
{
  id: string (UUID)
  user_id: string (auth user ID)
  partner1_name: string
  partner2_name: string
  wedding_date: string (ISO 8601)
  wedding_slug: string (unique)
  created_at: number (timestamp)
}
```

#### Guests Table
```typescript
{
  id: string (UUID)
  wedding_id: string (foreign key)
  full_name: string
  email: string
  phone: string
  side: 'Bride' | 'Groom' | 'Both' | 'Unknown'
  household_id: string
  plus_one_allowed: boolean
  invite_sent: boolean
  rsvp_status: 'Pending' | 'Yes' | 'No'
  meal_choice: string
  dietary_notes: string
  rsvp_notes: string
  shuttle_needed: boolean
  address_street: string
  address_city: string
  address_state: string
  address_postal: string
  address_country: string
  source: 'Manual' | 'RSVP'
  last_updated: number (timestamp)
}
```

#### Budget Items Table
```typescript
{
  id: string (UUID)
  wedding_id: string (foreign key)
  category_name: string
  estimated_cost: number
  actual_cost: number
  is_paid: boolean
  is_active: boolean
  is_custom: boolean
  sort_order: number
}
```

#### Vendors Table
```typescript
{
  id: string (UUID)
  wedding_id: string (foreign key)
  vendor_name: string
  contact_name: string
  email: string
  phone: string
  website: string
  notes: string
  budget_item_id: string (optional foreign key)
}
```

#### RSVP Settings Table
```typescript
{
  id: string (UUID)
  wedding_id: string (foreign key)
  show_meal_choice: boolean
  show_dietary_restrictions: boolean
  require_dietary_restrictions: boolean
  show_notes_field: boolean
  shuttle_service_available: boolean
  custom_message: string
}
```

### 3.3 Data Relationships
- **Weddings → Guests:** One-to-many
- **Weddings → Budget Items:** One-to-many
- **Weddings → Vendors:** One-to-many
- **Weddings → RSVP Settings:** One-to-one
- **Vendors → Budget Items:** Many-to-one (optional)

---

## 4. SECURITY REQUIREMENTS

### 4.1 Authentication & Authorization
- ✅ Magic link authentication (no passwords)
- ✅ 30-day session persistence
- ✅ Automatic session expiry
- ✅ User ID verification on all operations
- ✅ Row-level security (users only see their data)

### 4.2 Data Protection
- ✅ HTTPS enforced (Vercel automatic)
- ✅ Environment variable protection
- ✅ Data encryption at rest (InstantDB default)
- ✅ Secure session storage
- ✅ No sensitive data in URLs or logs

### 4.3 Rate Limiting
- **Global:** 100 requests/minute per IP
- **RSVP submissions:** 5/hour per IP
- **Magic link requests:** 3/hour per email
- **Guest creation:** 50/hour per user
- **CSV uploads:** 3/hour per user

### 4.4 Input Validation
- ✅ Zod schema validation on all inputs
- ✅ Sanitization of user-provided text
- ✅ Email format validation
- ✅ Date validation (future dates only)
- ✅ URL validation for vendor websites

### 4.5 Error Handling
- ✅ Generic error messages (no data leakage)
- ✅ Detailed logging for debugging (server-side only)
- ✅ Graceful degradation
- ✅ User-friendly error displays

### 4.6 CSRF Protection
- ✅ Built-in Next.js CSRF tokens
- ✅ Origin validation on public forms
- ✅ Rate limiting on form submissions

---

## 5. USER EXPERIENCE

### 5.1 Responsive Design

**Desktop (1024px+):**
- Left sidebar navigation
- Wide dashboard layouts
- Multi-column grids
- Hover interactions

**Tablet (768px - 1023px):**
- Collapsible sidebar
- 2-column grids
- Touch-optimized buttons

**Mobile (<768px):**
- Bottom navigation bar
- Single-column layouts
- Card-based UI
- Large touch targets (44px min)
- Swipe gestures

### 5.2 Navigation Structure

**Main Navigation:**
1. Dashboard (home icon)
2. Guests (users icon)
3. RSVP Manager (clipboard icon)
4. Budget (dollar icon)
5. Vendors (briefcase icon)
6. Settings (gear icon)

**Bottom Nav (Mobile):**
1. Home
2. Guests
3. RSVP
4. Budget
5. More (overflow menu)

### 5.3 Loading States
- Skeleton screens for data loading
- Animated loading indicators
- Optimistic UI updates
- Real-time synchronization

### 5.4 Animations
- Smooth page transitions (Framer Motion)
- Hover effects on interactive elements
- Chart animations on load
- Countdown timer updates
- Modal entrances/exits

---

## 6. PERFORMANCE REQUIREMENTS

### 6.1 Speed Targets
- **Initial page load:** <3 seconds
- **Route transitions:** <500ms
- **Dashboard data fetch:** <2 seconds
- **Form submissions:** <1 second
- **Real-time updates:** <500ms latency

### 6.2 Optimization Strategies
- Dynamic imports for heavy components
- Code splitting per route
- Image optimization
- Lazy loading for charts
- Selective data fetching (route-based)
- Memoization of expensive calculations

### 6.3 Scalability
- **Max guests per wedding:** 10,000
- **Max budget items:** 100
- **Max vendors:** 100
- **Concurrent users:** Unlimited (InstantDB handles)
- **Data storage:** Unlimited (InstantDB)

---

## 7. DEPLOYMENT

### 7.1 Environment Setup
```env
NEXT_PUBLIC_INSTANT_APP_ID=your_app_id_here
```

### 7.2 Deployment Platform (Vercel)
- Push to GitHub repository
- Connect to Vercel
- Add environment variables
- Automatic deployments on push
- Preview deployments for PRs

### 7.3 Custom Domain
- Configure DNS records
- Automatic SSL certificates
- Global CDN distribution

---

## 8. FUTURE ENHANCEMENTS (Post-MVP)

### Phase 2 Features:
- Multi-user collaboration (share with partner/planner)
- Unique RSVP links per guest (pre-filled forms)
- Email/SMS notifications
- Timeline and checklist management
- Seating chart builder
- Thank-you card tracker

### Phase 3 Features:
- Native mobile apps (iOS/Android)
- Print-friendly guest lists and labels
- Integration with wedding registries
- Vendor marketplace
- Budget recommendations based on location
- Guest messaging system

---

## 9. SUCCESS METRICS

### 9.1 User Engagement
- Daily active users
- Average session duration
- Feature adoption rates
- RSVP response rates

### 9.2 Performance Metrics
- Page load times
- Error rates
- API response times
- Uptime percentage (target: 99.9%)

### 9.3 User Satisfaction
- Net Promoter Score (NPS)
- Customer satisfaction surveys
- Feature request volume
- Support ticket volume

---

## 10. PROJECT STRUCTURE

```
/
├── app/                        # Next.js app directory
│   ├── dashboard/             # Dashboard page
│   ├── guests/                # Guest management
│   ├── budget/                # Budget tracking
│   ├── vendors/               # Vendor management
│   ├── settings/              # App settings
│   ├── rsvp/[slug]/          # Public RSVP form
│   ├── rsvp-manager/         # RSVP settings management
│   ├── login/                 # Authentication
│   ├── onboarding/            # Wedding setup
│   └── layout.tsx             # Root layout
├── components/                 # React components
│   ├── layout/                # Layout components (Sidebar, BottomNav)
│   ├── dashboard/             # Dashboard-specific components
│   ├── guests/                # Guest-specific components
│   ├── providers/             # Context providers
│   └── ui/                    # Shared UI components
├── lib/                        # Utility functions
│   ├── instant.ts             # InstantDB client
│   ├── auth.ts                # Authentication utilities
│   ├── validation.ts          # Zod validation schemas
│   ├── rate-limit.ts          # Rate limiting
│   ├── utils.ts               # Helper functions
│   └── constants.ts           # App constants
├── types/                      # TypeScript type definitions
├── instant.schema.ts           # InstantDB schema definition
└── middleware.ts              # Next.js middleware
```

---

**Document Owner:** Product Team  
**Technical Lead:** Engineering Team  
**Last Review:** January 2026
