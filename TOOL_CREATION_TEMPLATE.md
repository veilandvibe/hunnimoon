# Wedding Tool Creation Template

This document provides the complete process for creating a new wedding tool for Hunnimoon's marketing site.

## 📋 Overview

Every tool page follows the **exact same structure and layout**. Only the content changes based on the tool's keyword and functionality.

**Reference Page:** `http://localhost:3003/tools/wedding-timeline-generator`

**Concept:** Think of this as a CMS page template. Structure is fixed, content is dynamic per tool.

---

## 🗂️ Files to Modify/Create

When adding a new tool, you will touch these files:

### 1. `types/tools.ts`
Already exists. No changes needed.

### 2. `lib/tools-data.ts`
Add new tool entry to the `tools` array.

### 3. `components/tools/[ToolName].tsx`
Create new tool component (the interactive utility).

### 4. `app/(marketing)/tools/[slug]/page.tsx`
Already exists. Auto-generates pages. Update component mapping if needed.

---

## 📐 Page Structure (CANONICAL ORDER)

**This order is LOCKED. Never change.**

1. **Breadcrumbs**
   - Tools → Tool Name

2. **SEO Header Block**
   - "TOOLS" label (uppercase, small)
   - H1 (exact target keyword)
   - Description (1-2 sentences, must include H1 keyword in first sentence)

3. **Tool Embed Section**
   - Interactive tool component
   - White background, rounded corners, padding

4. **CTA Block**
   - Pink background CTA block with headline, copy, and 'Start Free Trial' button
   - Positioned immediately after "Try Other Tools" slider
   - Full CTABlock component (not inline text)

5. **"Try Our Other Free Wedding Tools" Slider**
   - Shows 3 tools at a time
   - Auto-populated (filters out current tool)
   - Each card: Tool name + description + "Try Tool" button

6. **Testimonial Section**
   - Pink light background
   - 1 testimonial (reusable across tools)
   - Customer name + date

7. **Long-Form Blog Article**
   - H2 main keyword variation (first one, acts as blog title)
   - 8-10 H2 section headers (bold, prominent)
   - Use H3 only for subheadings under H2s
   - Follow Unified Writing Rules
   - 1,200-1,800 words
   - Natural keyword density (1-1.5%)

8. **Divider Line**
   - 2px border before FAQs

9. **FAQ Section**
   - H2: "Frequently Asked Questions"
   - 7-10 FAQs
   - FAQ questions use H3
   - Mix tool-specific + Hunnimoon product questions

10. **Final CTA Block**
    - Pink primary background
    - "Try Hunnimoon Free for 7 Days"
    - Button centered (white bg, pink text)
    - "No credit card required" under button

---

## 🚨 CRITICAL: Verified App Features Only

**BEFORE writing any content, ALWAYS reference this list.**

### ✅ Features That EXIST in Hunnimoon:

1. **Guest List Management**
   - Add/edit/delete guests
   - Household grouping
   - Import/export CSV
   - Filter & search
   - Track RSVP status per guest

2. **Budget Tracking**
   - Budget categories
   - Set budget amounts
   - Track actual spending
   - Mark items as paid
   - Budget overview/progress

3. **Vendor Organization**
   - Vendor contacts
   - Categories
   - Notes
   - Contact information

4. **RSVP Management**
   - Custom RSVP form
   - Public RSVP link
   - Guest search on RSVP form
   - Household RSVP together
   - Auto-update guest list
   - RSVP analytics/stats

5. **Wedding Details**
   - Venue information
   - Wedding date
   - Side labels (Bride/Groom)

### ❌ Features That DO NOT EXIST:

- ❌ Seating charts / table assignments
- ❌ Timeline tracking / task management
- ❌ Checklist system
- ❌ Day-of timeline
- ❌ Vendor payment tracking (beyond mark as paid)
- ❌ Contract storage
- ❌ Photo sharing
- ❌ Registry management
- ❌ Wedding website builder

---

## ⚠️ Double-Check Rule (MANDATORY)

**The Tool Topic vs. App Features:**

✅ **ALLOWED:** Create tools for features the app doesn't have (e.g., "Wedding Seating Chart Generator")
- These are free SEO tools
- Write about the topic naturally
- Provide value to users searching that keyword

❌ **FORBIDDEN:** Claim Hunnimoon has features it doesn't
- Never say "Hunnimoon helps you create seating charts"
- Never imply "manage timelines with Hunnimoon"
- Never mention features that don't exist in the app

**Approved Transition Language:**
- "Planning a wedding gets messy fast. Hunnimoon keeps your guest list, budget, vendors, and RSVPs organized in one place."
- "Once you have your [tool topic], you still need to manage guests, budgets, and vendor details. Hunnimoon handles all of that."
- "This [tool name] helps with one piece. Hunnimoon manages your guest list, budget tracking, vendor organization, and RSVP responses."

**BANNED Phrasing:**
- ❌ "Timelines, seating charts, and more"
- ❌ "Everything you need to plan your wedding"
- ❌ "Complete wedding planning suite"
- ❌ "All-in-one solution" (too vague)
- ❌ Mentioning any feature from the "DO NOT EXIST" list

---

## 📝 Step-by-Step: Adding a New Tool

### Step 1: Identify Target Keyword
Example: "wedding seating chart generator"

### Step 2: Create Tool Data Entry

Open `lib/tools-data.ts` and add to the `tools` array:

```typescript
{
  slug: 'wedding-seating-chart-generator', // URL slug (lowercase, hyphens)
  name: 'Wedding Seating Chart Generator', // Display name
  h1: 'Wedding Seating Chart Generator', // Must match exact keyword
  description: 'Use this wedding seating chart generator to organize your guests and create the perfect table layout. Plan your reception seating in minutes.', // REQUIRED: First sentence MUST include H1 keyword naturally
  category: 'planning', // planning | budget | guests | timeline | other
  icon: '/icons/seating.svg', // Icon for cards (placeholder OK)
  image: '/images/tools/[tool-slug].svg', // Placeholder path - actual images created later
  component: 'WeddingSeatingChartGenerator', // Component name (PascalCase)
  seoContent: {
    h2: 'How to Create a Wedding Seating Chart That Actually Works', // Natural variation of H1
    content: `
      <p>First paragraph introducing the topic, including the main keyword naturally...</p>

      <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Why Most Couples Struggle With Seating Charts</h2>
      <p>Section content following Unified Writing Rules...</p>

      <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">What a Seating Chart Generator Actually Does</h2>
      <p>More content...</p>

      [Continue for 1,200-1,800 words, 8-10 H2 sections total]

      <h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">When a Generator Is Not Enough</h2>
      <p>A seating chart generator is a great starting point, but it doesn't replace a full planning system. You still need to track your budget, manage your guest list, and organize vendor contacts. That is where a tool like Hunnimoon comes in.</p>
      <p>Hunnimoon keeps your entire wedding in one place. You get budget tracking, guest management, RSVP tracking, and vendor organization all synced together. Instead of juggling spreadsheets and notes, everything updates automatically.</p>
    `,
    faqs: [
      {
        question: 'What is a wedding seating chart generator?',
        answer: 'A wedding seating chart generator is a tool that helps you organize and visualize your reception seating arrangements. You can assign guests to tables and see your layout before the big day.'
      },
      {
        question: 'How do I know how many tables I need?',
        answer: 'Divide your guest count by your table size. For example, if you have 120 guests and tables seat 10, you will need 12 tables. Always round up and add a few extra for spacing.'
      },
      // 5-8 more FAQs
      {
        question: 'Does Hunnimoon help with guest management?',
        answer: 'Yes, Hunnimoon has a complete guest list manager where you can track RSVPs, organize households, and manage all your guest details in one place. It is designed to keep your entire wedding organized.'
      }
    ]
  }
}
```

### Step 3: Write Content Following ALL Writing Guidelines

**FOUNDATION:** All content MUST strictly follow [unified-writing-tool-guide.md](unified-writing-tool-guide.md).
The techniques below are ADDITIONAL humanization layers applied ON TOP of those base rules.

## Content Writing Guidelines (MANDATORY)

### Base Rules (Always Apply)
**Reference:** [unified-writing-tool-guide.md](unified-writing-tool-guide.md)

ALL content MUST follow the Unified Writing Rules:
- Fifth-grade reading level
- No em dashes (use commas or colons)
- No forbidden words (comprehensive list in guide)
- No forbidden patterns ("whether you are...", "from...to...", "...meets...")
- Active voice, contractions, natural flow
- 1-1.5% keyword density
- 7-10 FAQs with bold questions, no Q/A labels
- One personal anecdote if appropriate
- Main keyword in first paragraph
- Gradual transition from tool → full wedding planning → Hunnimoon
- ONLY mention verified Hunnimoon features

### Additional Humanization Techniques (Layer On Top)

To pass AI detection tools, apply these ADDITIONAL techniques:

#### Sentence Structure Variety
- Mix short punchy sentences (3-5 words) with longer ones (15-20 words)
- Start sentences with different words (avoid repetitive patterns)
- Use fragments occasionally: "Not anymore." "Here's why."
- Vary paragraph lengths: 1-sentence mixed with 4-5 sentence paragraphs

#### Natural Human Patterns
- Use rhetorical questions: "Why does this matter?"
- Add casual asides: "(trust me, it happens)"
- Conversational transitions from unified guide: "Here's the thing..." "Look..."
- Include hedging: "usually," "often," "most couples"
- Specific numbers: "about 3 hours" not "several hours"

#### Avoiding Additional AI Tells
- Never use: "It's important to note," "Moreover," "Furthermore," "Additionally"
- Never use: "In conclusion," "To summarize," "Delve into," "Navigate," "Landscape"
- Never use: "Seamless," "Robust," "Leverage"
- Avoid perfect parallel structure
- Vary list lengths (don't always use 3 items)

#### Emotional and Personal Touch
- Reference frustrations: "You know that feeling when..."
- Direct address: "You've been there."
- Show personality: "Here's the deal:" (from unified guide)
- Allow minor imperfections in flow

#### Imperfect Writing (Controlled)
- Use colloquialisms: "a ton of," "kind of," "sort of"
- Allow minor redundancy for emphasis
- Don't over-explain, assume shared knowledge
- Let sentences be slightly imperfect
- See full list in `unified-writing-tool-guide.md`

**H2 Structure:**
- 8-10 H2 headers
- Each should be bold: `<h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Title Here</h2>`
- Natural variations of main keyword
- Action-oriented or problem-solving titles

**FAQ Requirements:**
- 7-10 questions
- Bold question (H3), no "Q:" or "A:" labels
- Real search phrasing
- Mix of tool-specific + 1-2 Hunnimoon questions
- Last 2-3 should mention Hunnimoon naturally
- Answer length: 2-4 sentences

### Step 4: Create Tool Component

Create `components/tools/WeddingSeatingChartGenerator.tsx`:

```typescript
'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function WeddingSeatingChartGenerator() {
  const [guestCount, setGuestCount] = useState('')
  const [tableSize, setTableSize] = useState('8')
  const [result, setResult] = useState<string | null>(null)

  const handleGenerate = () => {
    const guests = parseInt(guestCount)
    const size = parseInt(tableSize)
    
    if (!guests || !size) return
    
    const tables = Math.ceil(guests / size)
    setResult(`You'll need approximately ${tables} tables for ${guests} guests with ${size} seats per table.`)
  }

  return (
    <Card className="p-6 md:p-8 mb-12 bg-white shadow-lg">
      <h2 className="text-2xl font-bold text-pink-primary mb-6">
        Calculate Your Seating Needs
      </h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-pink-primary mb-2">
            Total Number of Guests
          </label>
          <input
            type="number"
            value={guestCount}
            onChange={(e) => setGuestCount(e.target.value)}
            className="w-full px-4 py-3 border-2 border-pink-primary/20 rounded-xl focus:border-pink-primary focus:outline-none"
            placeholder="e.g., 120"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-primary mb-2">
            Guests Per Table
          </label>
          <select
            value={tableSize}
            onChange={(e) => setTableSize(e.target.value)}
            className="w-full px-4 py-3 border-2 border-pink-primary/20 rounded-xl focus:border-pink-primary focus:outline-none"
          >
            <option value="6">6</option>
            <option value="8">8</option>
            <option value="10">10</option>
            <option value="12">12</option>
          </select>
        </div>
      </div>
      
      <Button onClick={handleGenerate} fullWidth size="lg">
        Calculate Tables Needed
      </Button>
      
      {result && (
        <div className="mt-6 p-6 bg-pink-light rounded-xl border-2 border-pink-primary/20">
          <p className="text-pink-primary font-semibold text-lg">
            {result}
          </p>
        </div>
      )}
    </Card>
  )
}
```

**Tool Design Principles:**
- Simple, icon-based UI
- Client-side only (no database writes)
- No authentication required
- Instant results
- Mobile-responsive
- Clear, actionable output

### Step 5: Update Component Mapping

In `app/(marketing)/tools/[slug]/page.tsx`, add to the `toolComponents` object:

```typescript
const toolComponents: Record<string, React.ComponentType> = {
  WeddingTimelineGenerator,
  WeddingSeatingChartGenerator, // Add new tool here
  // Add more as you create them
}
```

### Step 6: Test Thoroughly

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3003/tools/[your-tool-slug]`
3. Verify all sections appear in correct order:
   - ✅ Breadcrumbs
   - ✅ SEO Header
   - ✅ Tool works
   - ✅ Soft CTA with button
   - ✅ Tool slider shows other tools
   - ✅ Testimonial
   - ✅ Blog content (check H2 formatting)
   - ✅ Divider before FAQs
   - ✅ FAQs formatted correctly
   - ✅ Final CTA centered
4. Test tool functionality
5. Check mobile responsiveness
6. Verify all internal links work
7. Confirm tool appears in slider on OTHER tool pages

---

## ✅ Pre-Launch Validation Checklist

Before considering a tool complete:

**Structure:**
- [ ] All 10 sections present in canonical order
- [ ] Breadcrumbs work
- [ ] Tool component renders and functions
- [ ] Slider shows 3 other tools
- [ ] All buttons link correctly

**SEO & Content:**
- [ ] H1 matches exact target keyword
- [ ] Description includes H1 keyword in first sentence
- [ ] Blog content is 1,200-1,800 words
- [ ] 8-10 H2 headers, all bold
- [ ] 7-10 FAQs with proper formatting
- [ ] Content follows Unified Writing Rules
- [ ] No forbidden words/phrases
- [ ] Natural keyword density (1-1.5%)

**Hunnimoon Features (CRITICAL):**
- [ ] ONLY mentions verified features (Guests, Budget, Vendors, RSVPs)
- [ ] NO false feature claims
- [ ] NO mention of: Seating charts, Timelines, Checklists, Tasks
- [ ] Soft CTA only mentions real features
- [ ] Blog transition section only mentions real features
- [ ] FAQ answers about Hunnimoon are accurate

**Design & UX:**
- [ ] Page renders correctly on mobile
- [ ] Tool UI is intuitive and simple
- [ ] All text is readable (good contrast)
- [ ] CTA buttons are centered
- [ ] Spacing/padding looks good
- [ ] No layout shifts or broken elements

---

## 🎨 Code Snippets Reference

### H2 Blog Headers
```html
<h2 class="text-2xl font-bold text-pink-primary mt-10 mb-4">Section Title Here</h2>
```

### H3 Subheadings (only if needed under H2)
```html
<h3 class="text-xl font-bold text-pink-primary mt-6 mb-3">Subsection Title</h3>
```

### Paragraphs
```html
<p>Content here with natural spacing. Write like talking to a friend. No buzzwords.</p>
```

### Lists (if needed)
```html
<ul class="list-disc pl-6 space-y-2 my-4">
  <li>List item one</li>
  <li>List item two</li>
</ul>
```

### Bold Text (sparingly)
```html
<p>This is <strong>important text</strong> in a sentence.</p>
```

---

## 🔄 Future Tools Pipeline

**Planned Tools (In Priority Order):**
1. ✅ Wedding Timeline Generator
2. Wedding Day Timeline Generator
3. Wedding Reception Timeline Generator
4. Wedding Hashtag Generator
5. Alcohol Calculator for Wedding
6. Drink Calculator for Wedding
7. Wedding Planning Checklist
8. Wedding To-Do Checklist Generator

---

## 📚 Required Reading

**Before writing any tool content, read:**
1. `unified-writing-tool-guide.md` (complete guide)
2. This template document (structure & rules)
3. Review `/tools/wedding-timeline-generator` (reference implementation)
4. Verify Hunnimoon app features (never assume)

---

## 🎯 Key Takeaways

1. **Structure never changes** - same 10 sections, same order, always
2. **Content is keyword-specific** - write for the target search term
3. **Think like a CMS** - structure is the template, content fills the slots
4. **Never lie about features** - only mention what Hunnimoon actually has
5. **Tool topics ≠ App features** - tools can cover topics the app doesn't handle
6. **Quality over speed** - follow Unified Writing Rules for every word
7. **Double-check features** - verify before claiming Hunnimoon can do something

---

**Last Updated:** January 2026  
**Reference Implementation:** `/tools/wedding-timeline-generator`  
**Verified Hunnimoon Features:** Guests, Budget, Vendors, RSVPs only
