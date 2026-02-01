# Canonical URL Fix for Google Indexing

**Date:** February 1, 2026  
**Issue:** Marketing pages discovered but not indexed (9 pages discovered, only 1 indexed)  
**Root Cause:** All pages had canonical URL pointing to homepage (`/`)

## Changes Made

### 1. Root Layout Update
**File:** `app/layout.tsx`
- Kept `canonical: '/'` for homepage (this is correct)
- This will be overridden by child page metadata

### 2. Tool Pages (Dynamic Routes)
**File:** `app/(marketing)/tools/[slug]/page.tsx`
- Updated `generateMetadata` to include proper canonical URL
- Added `alternates.canonical: /tools/${params.slug}`
- Added OpenGraph URL with full canonical path
- **Result:** Each tool page now has unique canonical URL

### 3. Tools Listing Page
**File:** `app/(marketing)/tools/page.tsx`
- Added complete metadata export with title, description
- Added `alternates.canonical: '/tools'`
- Added OpenGraph metadata
- **Result:** `/tools` page now has proper canonical

### 4. Pricing Page
**File:** `app/(marketing)/pricing/layout.tsx` (NEW)
- Created layout wrapper with metadata (since page is client component)
- Added `alternates.canonical: '/pricing'`
- Added OpenGraph metadata
- **Result:** `/pricing` page now has proper canonical

### 5. Legal Pages
**Files:**
- `app/(marketing)/privacy/page.tsx`
- `app/(marketing)/terms/page.tsx`
- `app/(marketing)/refunds/page.tsx`

Added metadata exports to each with:
- Proper page titles
- SEO descriptions
- Canonical URLs (`/privacy`, `/terms`, `/refunds`)

## Canonical URLs Now Set

| Page | Canonical URL | Status |
|------|---------------|--------|
| Homepage | `/` | ✅ Set in root layout |
| Tools Listing | `/tools` | ✅ Set in page metadata |
| Wedding Timeline Generator | `/tools/wedding-timeline-generator` | ✅ Set in generateMetadata |
| Wedding Day Timeline Generator | `/tools/wedding-day-timeline-generator` | ✅ Set in generateMetadata |
| Wedding Reception Timeline Generator | `/tools/wedding-reception-timeline-generator` | ✅ Set in generateMetadata |
| Pricing | `/pricing` | ✅ Set in pricing layout |
| Privacy | `/privacy` | ✅ Set in page metadata |
| Terms | `/terms` | ✅ Set in page metadata |
| Refunds | `/refunds` | ✅ Set in page metadata |

## For Future Tools

**Documentation added to:** `lib/tools-data.ts`

When adding new tools:
1. Add tool object to the `tools` array with complete metadata
2. Canonical URL is **automatically generated** from the slug
3. Create the component in `components/tools/`
4. Add component to toolComponents map in `app/(marketing)/tools/[slug]/page.tsx`

## Next Steps for Google Indexing

1. **Deploy these changes** to production
2. **Request re-indexing** for each tool page in Google Search Console:
   - https://hunnimoon.app/tools
   - https://hunnimoon.app/tools/wedding-timeline-generator
   - https://hunnimoon.app/tools/wedding-day-timeline-generator
   - https://hunnimoon.app/tools/wedding-reception-timeline-generator
   - https://hunnimoon.app/pricing

3. **Wait 3-7 days** for Google to re-crawl and index
4. **Verify in Search Console** that pages show proper canonical URLs

## How to Verify

After deployment, view page source of any tool page:
```html
<!-- Before fix -->
<link rel="canonical" href="https://hunnimoon.app"/>

<!-- After fix -->
<link rel="canonical" href="https://hunnimoon.app/tools/wedding-timeline-generator"/>
```

## Important Notes

- ✅ Only marketing pages have explicit canonical URLs
- ✅ Core app pages (dashboard, budget, guests, etc.) do NOT have canonical tags (they're behind auth and blocked in robots.txt)
- ✅ All marketing pages can now be properly indexed by Google
- ✅ Each page declares itself as the canonical version

## Expected Result

Once Google re-indexes:
- All 9 marketing pages should show as "Indexed"
- Each page will rank for its own content
- No more duplicate content issues
