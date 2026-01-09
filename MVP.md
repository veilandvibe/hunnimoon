# MINIMUM VIABLE PRODUCT (MVP) SPECIFICATION
## Hunnimoon Wedding Planner

**Version:** 1.0  
**Last Updated:** January 2026  
**Status:** Launch Ready

---

## OVERVIEW

This document defines the **Minimum Viable Product (MVP)** scope for the Hunnimoon Wedding Planner launch. The MVP includes only essential features needed to deliver core value to users while maintaining high quality and security standards.

**MVP Goal:** Enable engaged couples to manage their wedding guest list, track RSVPs, monitor budget, and coordinate vendors through a simple, mobile-friendly interface.

---

## WHAT'S IN MVP

**IMPORTANT:** All features marked with ✅ are **FULLY IMPLEMENTED AND WORKING** in the current app. Features marked "Simplified" are included but in a streamlined version (e.g., text fields instead of dropdowns, manual entry instead of automation).

### ✅ CORE FEATURES (Must Have)

#### 1. Authentication & Onboarding
**Status:** REQUIRED FOR LAUNCH

**Included:**
- Magic link login via email
- 6-digit code verification
- 30-day session persistence
- First-time onboarding flow
- Wedding details form (partner names, date, slug)
- Automatic wedding record creation
- Sign out functionality

**Excluded from MVP:**
- Password authentication
- Social login (Google, Facebook)
- Multi-factor authentication
- Account recovery flow

---

#### 2. Dashboard (Home Screen)
**Status:** REQUIRED FOR LAUNCH

**Included:**
- **Countdown Timer:**
  - Real-time countdown to wedding date
  - Days, hours, minutes, seconds
  - Partner names display
  - Animated gradient background

- **Guest Metrics (4 Cards):**
  - Total guest count
  - Invites sent (count + percentage)
  - Projected attendance
  - Total budget

- **RSVP Status Section:**
  - Yes/No/Pending counts
  - Pie chart visualization
  - Color-coded status indicators

- **Budget Overview (3 Cards):**
  - Total budget
  - Amount spent
  - Remaining budget
  - Progress bar

**Excluded from MVP:**
- Historical trends/analytics
- Customizable dashboard layouts
- Export dashboard as PDF
- Widget customization

---

#### 3. Guest Management
**Status:** REQUIRED FOR LAUNCH

**Included:**
- **Guest List View:**
  - Card-based layout (mobile) / table view (desktop)
  - Search by name
  - Filter by RSVP status
  - Sort by name or date

- **Add/Edit Guest Form:**
  - Full name (required)
  - Email address
  - Phone number
  - Side (Bride/Groom/Both/Unknown)
  - RSVP status (Pending/Yes/No)
  - Plus-one allowed (toggle)
  - Meal choice (text field)
  - Dietary restrictions (text field)
  - Contact address fields
  - Invite sent (toggle)

- **Delete Guest:**
  - Confirmation dialog
  - Permanent deletion

**✅ INCLUDED but Simplified:**
- ✓ Household grouping: Manual household_id field (you enter it yourself)
- ✓ Meal choices: Free text field (guests type their choice)
- ✓ Filtering: Basic filters work (by RSVP status and bride/groom side)

**Excluded from MVP:**
- CSV import/export
- Bulk operations (delete multiple, bulk email)
- Guest tags/categories
- Advanced search (by address, dietary needs)
- Guest notes/history
- Duplicate detection
- Merge guests feature

---

#### 4. Public RSVP Form
**Status:** REQUIRED FOR LAUNCH

**Included:**
- **Unique Wedding URL:**
  - Format: `/rsvp/[wedding-slug]`
  - Shareable link
  - Custom slug support

- **RSVP Form:**
  - Guest name input with autocomplete
  - RSVP status selection (Yes/No)
  - Plus-one name field (if applicable)
  - Meal choice (text field)
  - Dietary restrictions (text field)
  - Notes field
  - Submit button

- **Form Behavior:**
  - Real-time validation
  - Rate limiting (5 per hour per IP)
  - CSRF protection
  - Creates new guest if not found
  - Updates existing guest if found
  - Success/error messages
  - Redirect to thank you message

**✅ INCLUDED but Simplified:**
- ✓ Default form configuration works (form fields are fixed, can't toggle on/off)
- ✓ Generic thank you message shows after submission

**Excluded from MVP:**
- Customizable form fields (toggle show/hide)
- Custom thank-you messages
- RSVP deadline enforcement
- Email confirmation to guest
- Pre-filled unique links per guest
- QR code generation

---

#### 5. Budget Tracking
**Status:** REQUIRED FOR LAUNCH

**Included:**
- **Budget List View:**
  - All budget categories
  - Estimated vs. actual costs
  - Paid status indicator
  - Total calculations

- **Predefined Categories:**
  - Venue, Catering, Photography, Videography
  - Flowers/Décor, Music/Entertainment, Attire
  - Invitations, Rings, Transportation
  - Accommodations, Wedding Planner, Miscellaneous

- **Budget Item Form:**
  - Category name
  - Estimated cost
  - Actual cost
  - Paid status (toggle)
  - Active status (toggle to hide)

- **Budget Calculations:**
  - Total estimated
  - Total actual
  - Remaining budget
  - Over/under budget indicator

**✅ INCLUDED but Simplified:**
- ✓ Custom categories: Can add custom budget items (just can't drag to reorder)
- ✓ Progress bars: Simple visual bars show spending progress

**Excluded from MVP:**
- CSV export
- Budget categories with icons
- Payment due dates
- Vendor linking (linked in Phase 2)
- Budget alerts/notifications
- Historical spending charts
- Budget recommendations
- Split payment tracking

---

#### 6. Vendor Management
**Status:** REQUIRED FOR LAUNCH

**Included:**
- **Vendor List:**
  - Card-based layout
  - Vendor name and contact name
  - Contact information display

- **Add/Edit Vendor Form:**
  - Vendor name (required)
  - Contact name
  - Email address
  - Phone number
  - Website URL
  - Notes (text area)

- **Delete Vendor:**
  - Confirmation dialog
  - Permanent deletion

**✅ INCLUDED but Simplified:**
- ✓ Vendors store all contact info (name, email, phone, website, notes)
- ✓ No budget linking yet (that's Phase 2)

**Excluded from MVP:**
- Budget integration
- CSV export
- Vendor categories/tags
- Contract upload
- Payment tracking
- Vendor ratings
- Automatic vendor suggestions

---

#### 7. Mobile Responsive Design
**Status:** REQUIRED FOR LAUNCH

**Included:**
- Mobile-first design
- Bottom navigation bar (mobile)
- Left sidebar navigation (desktop)
- Touch-optimized buttons (44px min)
- Responsive layouts for all screens
- Adaptive font sizes
- Mobile-friendly modals

**Excluded from MVP:**
- Native mobile apps
- Offline mode
- Push notifications
- App store presence

---

#### 8. Settings
**Status:** REQUIRED FOR LAUNCH

**Included:**
- View wedding details
- Edit partner names
- Edit wedding date
- View wedding slug
- View RSVP URL
- Sign out button

**Simplified for MVP:**
- ⚠️ No RSVP form customization in MVP
- ⚠️ No custom thank-you message editor

**Excluded from MVP:**
- RSVP form field toggles
- Custom thank-you messages
- Email notification settings
- Theme customization
- Language settings
- Account deletion

---

## TECHNICAL REQUIREMENTS FOR MVP

### ✅ Must Have
- Next.js 14+ with App Router
- TypeScript
- InstantDB for database and auth
- Tailwind CSS for styling
- Zod for validation
- Magic link authentication
- Rate limiting on all endpoints
- HTTPS/SSL (via Vercel)
- Environment variable security
- Row-level data security
- Mobile responsive (all breakpoints)

### ✅ Included (Simplified)
- Framer Motion: Basic smooth animations (countdown, modals, transitions)
- Recharts: Simple pie chart for RSVP status
- Error handling: Generic user-friendly messages (no technical details exposed)
- Loading states: Clean skeleton screens while data loads

### ❌ Not Required
- Advanced analytics
- Email service integration
- SMS notifications
- PDF generation
- Print layouts
- Multi-language support
- Dark mode
- Advanced caching strategies

---

## MVP LAUNCH CRITERIA

### Functional Requirements
- [ ] All core features work end-to-end
- [ ] User can complete full workflow:
  - Sign up → Onboard → Add guests → Share RSVP link → Receive RSVPs → Track budget
- [ ] No critical bugs
- [ ] Forms validate correctly
- [ ] Data persists across sessions
- [ ] Real-time updates work

### Performance Requirements
- [ ] Initial page load < 3 seconds
- [ ] Dashboard data loads < 2 seconds
- [ ] Form submissions < 1 second
- [ ] Mobile page speed score > 80
- [ ] Desktop page speed score > 90

### Security Requirements
- [ ] HTTPS enabled
- [ ] Authentication working
- [ ] Rate limiting active
- [ ] Input validation in place
- [ ] No console errors in production
- [ ] Environment variables secured
- [ ] Row-level security enforced

### User Experience Requirements
- [ ] Mobile responsive on iPhone/Android
- [ ] Works on Chrome, Safari, Firefox, Edge
- [ ] Intuitive navigation
- [ ] Clear error messages
- [ ] Consistent design
- [ ] Loading states shown
- [ ] Success confirmations displayed

### Data Requirements
- [ ] Database schema deployed
- [ ] Permissions configured
- [ ] Test data cleared
- [ ] Backup strategy in place

---

## WHAT'S NOT IN MVP (FUTURE PHASES)

### Phase 2 (Post-Launch)
- CSV import/export for guests
- CSV export for budget and vendors
- Vendor-budget linking
- Customizable RSVP forms
- Custom thank-you messages
- Email notifications
- Bulk guest operations
- Advanced filtering and search

### Phase 3 (Future)
- **Native mobile apps (iOS/Android)** - Save for later when needed

---

## MVP TESTING CHECKLIST

### User Flows to Test
- [ ] **Sign Up Flow:**
  - Request magic link
  - Enter 6-digit code
  - Complete onboarding
  - Land on dashboard

- [ ] **Guest Management:**
  - Add new guest
  - Edit guest
  - Delete guest
  - Search guests
  - Filter by status

- [ ] **RSVP Submission:**
  - Access public form via slug
  - Find guest name
  - Submit RSVP
  - See confirmation
  - Verify dashboard update

- [ ] **Budget Tracking:**
  - Add budget item
  - Edit costs
  - Mark as paid
  - View totals
  - Hide inactive items

- [ ] **Vendor Management:**
  - Add vendor
  - Edit vendor info
  - Delete vendor
  - View contact info

- [ ] **Mobile Experience:**
  - Test on real mobile device
  - Verify bottom nav works
  - Test all forms on mobile
  - Verify touch targets

---

## MVP SUCCESS METRICS

### Week 1 Targets
- 100 signups
- 50 weddings created
- 1,000 guests added
- 500 RSVPs submitted
- < 5% error rate

### Month 1 Targets
- 1,000 active users
- 500 active weddings
- 10,000 guests managed
- 5,000 RSVPs processed
- 4.0+ user rating
- 99%+ uptime

---

## MVP DEPLOYMENT

### Pre-Launch Checklist
- [ ] Code pushed to production branch
- [ ] Environment variables set in Vercel
- [ ] InstantDB permissions configured
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] Analytics tracking added
- [ ] Error monitoring setup
- [ ] Backup strategy tested

### Launch Day
- [ ] Monitor error logs
- [ ] Watch performance metrics
- [ ] Respond to support requests
- [ ] Track user signups
- [ ] Monitor database performance

### Post-Launch (Week 1)
- [ ] Collect user feedback
- [ ] Fix critical bugs
- [ ] Optimize slow queries
- [ ] Update documentation
- [ ] Plan Phase 2 features

---

## TIMELINE ESTIMATE

**Total MVP Development:** 6-8 weeks

- Week 1-2: Core authentication and database setup
- Week 3-4: Dashboard, guest management, RSVP form
- Week 5-6: Budget tracking, vendor management, settings
- Week 7: Mobile optimization, testing, bug fixes
- Week 8: Final testing, deployment, launch

---

## RESOURCE REQUIREMENTS

### Development
- 1 Full-stack developer (primary)
- 1 UI/UX designer (part-time)
- 1 QA tester (part-time)

### Infrastructure
- Vercel Pro account (for production)
- InstantDB Pro account (if needed for scale)
- Domain registration and SSL
- Error monitoring service (optional)

### Support
- Email support setup
- Documentation platform
- User feedback collection method

---

**Document Owner:** Product Team  
**Approved By:** Engineering Lead  
**Launch Target:** Q1 2026  
**Status:** Ready for Implementation
