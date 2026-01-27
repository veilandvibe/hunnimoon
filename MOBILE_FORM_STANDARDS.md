# Mobile Form Standards for Marketing Tools

## Overview
This document outlines the required styling standards for all marketing tool pages to ensure proper visibility and usability on mobile devices, particularly iOS Safari.

## Background
Mobile Safari renders form inputs differently than desktop browsers. Without proper styling, inputs can appear gray, low-contrast, or invisible on actual devices even when they look fine in desktop browser dev tools.

## Required Standards

### 1. Input Component (`/components/ui/Input.tsx`)

All text, date, time, and number inputs MUST include:
- `bg-white` - White background for contrast against pink-light containers
- `border-2` - 2px borders for visibility
- `border-pink-primary/50` - 50% opacity borders (NOT 20% or 30%)
- `min-h-[48px]` - Minimum 48px height for touch targets

**Standard className pattern:**
```typescript
className="w-full px-4 py-3 min-h-[48px] rounded-xl border-2 transition-all duration-200 text-base touch-manipulation bg-white border-pink-primary/50 focus:border-pink-primary focus:outline-none focus:ring-2 focus:ring-pink-primary/20 text-pink-primary placeholder:text-pink-primary/40"
```

### 2. Checkbox Inputs

All checkboxes MUST use this exact className:
```typescript
className="w-5 h-5 accent-pink-primary cursor-pointer"
```

**DO NOT USE:**
- `w-4 h-4` - Too small for mobile touch targets
- `border-pink-primary/30` or lower opacity - Not visible enough
- Inline Tailwind classes without the global CSS styles

### 3. Radio Buttons

All radio buttons MUST follow the same pattern as checkboxes:
```typescript
className="w-5 h-5 accent-pink-primary cursor-pointer"
```

Global CSS in `globals.css` handles the visual styling.

### 4. Select Dropdowns

All select dropdowns MUST include:
- `bg-white` - White background
- `border-2 border-pink-primary/50` - 50% opacity borders
- `min-h-[48px]` or `h-[48px]` - Proper touch target height

**Example:**
```typescript
className="w-full px-4 pr-10 h-[48px] rounded-xl border-2 border-pink-primary/50 text-pink-primary text-base bg-white focus:outline-none focus:ring-2 focus:ring-pink-primary/20"
```

### 5. Global CSS Requirements (`/app/globals.css`)

The following CSS is already in place and handles iOS-specific rendering:

- **Date/Time Input Styling** - Forces pink text color and proper visibility
- **Checkbox Custom Styling** - Creates visible checkboxes with pink checked state
- **Radio Button Custom Styling** - Creates visible radio buttons with pink selected state

These styles are global and automatic - you don't need to add them to individual components.

## Testing Requirements

### Desktop Testing (Not Sufficient)
❌ Chrome DevTools mobile simulation
❌ Firefox responsive design mode
❌ Responsive view in desktop browsers

### Required Mobile Testing
✅ Actual iPhone with Safari
✅ Actual Android device with Chrome
✅ Test on both light and dark backgrounds
✅ Test all form interactions (focus, select, type)

## Common Mistakes to Avoid

1. **Using low-opacity borders** - `/20` or `/30` opacity is too light
2. **Forgetting white backgrounds** - Forms on `bg-pink-light` need `bg-white` inputs
3. **Small touch targets** - Always use `w-5 h-5` minimum for checkboxes/radios
4. **Assuming desktop = mobile** - Always test on real devices

## Creating New Tool Pages

When creating a new marketing tool component:

1. **Use the Input component** from `/components/ui/Input.tsx`
2. **Follow checkbox pattern** - Always use `w-5 h-5 accent-pink-primary cursor-pointer`
3. **Test on actual mobile devices** before considering it complete
4. **Reference existing tools** - Use `WeddingTimelineGenerator.tsx` as the reference implementation

## Files Updated (Reference Implementation)

- `/components/ui/Input.tsx` - Standard input component
- `/app/globals.css` - Global mobile form styles
- `/components/tools/WeddingTimelineGenerator.tsx` - Reference implementation
- `/components/tools/WeddingReceptionTimelineGenerator.tsx` - Reference implementation
- `/components/tools/WeddingDayTimelineGenerator.tsx` - Uses Input component

## Contact

If you encounter mobile visibility issues:
1. Check this document first
2. Compare against reference implementations
3. Test on actual iOS Safari (not just dev tools)

---

**Last Updated:** January 27, 2026
**Issue Fixed:** iOS Safari form input visibility issues on marketing tool pages
