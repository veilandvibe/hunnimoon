# Guest Import/Export Testing Guide

## Test Data

### Test 1: CSV with Headers (Standard Excel Format)
```csv
Name,Email,Phone,Side,Household ID
John Smith,john@example.com,555-0101,Groom,
Jane Doe,jane@example.com,555-0102,Bride,
Bob Wilson,bob@example.com,555-0103,Groom,Wilson Family
Sarah Wilson,sarah@example.com,555-0104,Groom,Wilson Family
Mike Johnson,mike@example.com,555-0105,Both,
```

**Expected Result:**
- 5 guests parsed
- All valid (5 ✅)
- Household ID recognized for Wilson Family
- Sides properly mapped

### Test 2: Plain Text (One Name Per Line)
```
Alex Thompson
Maria Garcia
David Lee
Emma Brown
```

**Expected Result:**
- 4 guests parsed
- All valid (4 ✅)
- All sides default to "Unknown"
- No household IDs

### Test 3: Tab-Separated (Google Sheets Copy-Paste)
```tsv
Name	Email	Phone	Side	Household
Chris Martin	chris@test.com	555-1111	Bride	
Lisa Taylor	lisa@test.com	555-1112	Bride	Taylor-Anderson
Tom Anderson	tom@test.com	555-1113	Bride	Taylor-Anderson
```

**Expected Result:**
- 3 guests parsed
- All valid (3 ✅)
- Household detected for Taylor-Anderson

### Test 4: CSV with Errors (Missing Names)
```csv
Name,Email,Phone,Side
John Smith,john@example.com,555-0101,Groom
,missing@example.com,555-0102,Bride
Bob Wilson,bob@example.com,555-0103,Groom
,another-missing@test.com,,Unknown
```

**Expected Result:**
- 4 guests parsed
- 2 valid (2 ✅)
- 2 errors (2 ❌) - missing names
- Import button disabled until names are added
- User can click empty name cells to add names inline

### Test 5: CSV with Invalid Emails
```csv
Name,Email,Phone,Side
Sarah Johnson,sarah@example.com,555-0201,Bride
Mike Davis,invalid-email,555-0202,Groom
Amy White,amy@,555-0203,Bride
Tom Black,@test.com,555-0204,Groom
```

**Expected Result:**
- 4 guests parsed
- 1 valid (1 ✅)
- 3 warnings (3 ⚠️) - invalid email formats
- Import button enabled (warnings don't block)
- User can fix emails inline or import as-is

### Test 6: CSV Without Headers
```csv
Rachel Green,rachel@friends.com,555-0301,Bride
Monica Geller,monica@friends.com,555-0302,Bride
Ross Geller,ross@friends.com,555-0303,Groom,Geller Family
Chandler Bing,chandler@friends.com,555-0304,Groom
```

**Expected Result:**
- 4 guests parsed
- All valid (4 ✅)
- Parser assumes column order: Name, Email, Phone, Side, Household
- Household detected for Ross

### Test 7: Mixed Side Values (Flexible Parsing)
```csv
Name,Email,Phone,Side
Test User 1,user1@test.com,555-0401,bride
Test User 2,user2@test.com,555-0402,GROOM
Test User 3,user3@test.com,555-0403,B
Test User 4,user4@test.com,555-0404,g
Test User 5,user5@test.com,555-0405,both
Test User 6,user6@test.com,555-0406,unknown
```

**Expected Result:**
- 6 guests parsed
- All valid (6 ✅)
- Sides normalized to: Bride, Groom, Bride, Groom, Both, Unknown

### Test 8: Large Import (100+ Guests)
Create a CSV with 150 guests to test performance.

**Expected Result:**
- All 150 guests parsed
- Table scrolls smoothly
- Import completes in < 5 seconds
- No UI lag during editing

### Test 9: Special Characters in Names
```csv
Name,Email,Phone,Side
María José García,maria@example.com,555-0501,Bride
François Dupont,francois@example.com,555-0502,Groom
O'Brien Smith,obrien@example.com,555-0503,Bride
李明,liming@example.com,555-0504,Groom
```

**Expected Result:**
- 4 guests parsed
- All valid (4 ✅)
- Special characters preserved correctly

### Test 10: Export and Re-Import (Round Trip)
1. Export existing guest list
2. Re-import the exported CSV

**Expected Result:**
- All fields preserved
- No data loss
- Duplicates created (expected behavior - adds to list)

## Manual Testing Checklist

### Import Modal UI
- [ ] Upload tab appears first
- [ ] Paste tab switches correctly
- [ ] File upload accepts .csv, .txt, .tsv files
- [ ] Drag-and-drop works (if implemented)
- [ ] Parse button appears for paste tab

### Preview Table
- [ ] Table displays after successful parse
- [ ] Summary bar shows correct counts (valid/warning/error)
- [ ] Status icons appear correctly (✅ ⚠️ ❌)
- [ ] Name cells with errors have red border
- [ ] Email cells with warnings have yellow border
- [ ] All cells are editable
- [ ] Side dropdown works
- [ ] Household autocomplete suggests existing households
- [ ] Delete row button removes row
- [ ] Validation updates in real-time as user edits

### Import Functionality
- [ ] Import button disabled when errors exist
- [ ] Import button shows count correctly
- [ ] Import button enabled with warnings only
- [ ] Import creates guests in InstantDB
- [ ] Success message appears
- [ ] Modal closes after successful import
- [ ] Guest list refreshes automatically
- [ ] Imported guests have correct data
- [ ] Household associations work
- [ ] Source field set to "Import"

### Export Functionality
- [ ] Export button visible on guests page
- [ ] Export button disabled when no guests
- [ ] CSV file downloads with correct filename
- [ ] CSV contains all guest data
- [ ] Headers are correct
- [ ] Data is properly quoted
- [ ] Can open in Excel/Google Sheets
- [ ] Can re-import exported CSV

### Error Handling
- [ ] Empty file shows error message
- [ ] Invalid file format shows error
- [ ] Network errors handled gracefully
- [ ] Retry button works
- [ ] Cancel button clears state
- [ ] Modal can be closed without importing

### Responsive Design
- [ ] Modal works on mobile
- [ ] Table scrolls horizontally on small screens
- [ ] Buttons stack properly on mobile
- [ ] Input fields are accessible on mobile
- [ ] No layout breaking

## Performance Tests

### Large Data Sets
- [ ] 50 guests: < 1s parse time
- [ ] 100 guests: < 2s parse time
- [ ] 500 guests: < 5s parse time
- [ ] Table remains responsive with 500+ rows
- [ ] Import transaction completes successfully

### Edge Cases
- [ ] Empty lines in CSV are skipped
- [ ] Trailing commas handled correctly
- [ ] Unicode characters display properly
- [ ] Very long names/emails don't break layout
- [ ] Duplicate names allowed (no validation)

## Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

## Test Results Summary

### Status: ✅ READY FOR TESTING

All components implemented:
1. ✅ `lib/guestParser.ts` - Smart parsing utilities
2. ✅ `components/guests/GuestImportModal.tsx` - Import modal with editable table
3. ✅ `app/(main)/guests/page.tsx` - Import/Export buttons and handlers

### Features Implemented:
- ✅ CSV/TSV auto-detection
- ✅ Plain text parsing (one name per line)
- ✅ Header detection with keyword matching
- ✅ Flexible side value normalization
- ✅ Email validation (warnings)
- ✅ Name validation (errors)
- ✅ Editable preview table
- ✅ Real-time validation
- ✅ Inline editing
- ✅ Row deletion
- ✅ Household autocomplete
- ✅ Batch import transaction
- ✅ CSV export with all fields
- ✅ Success/error messages

### Ready for User Testing:
The implementation is complete and ready for the user to test with real data. All test scenarios above can be executed once the local hosting issues are resolved.
