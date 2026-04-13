# Phase 2 — Implementation Tasks

## Task 1: Create Supabase Database Tables
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 30 minutes

Create `job_applications` and `cover_letters` tables with proper schema, RLS policies, and indexes.

**Acceptance Criteria**:
- [ ] `job_applications` table created with all columns
- [ ] `cover_letters` table created with all columns
- [ ] RLS policies enabled and tested for both tables
- [ ] Indexes created on `user_id` columns
- [ ] Test queries work correctly with RLS

**Files**:
- Supabase SQL Editor (run migration scripts from design.md)

---

## Task 2: Implement Job Applications API Functions
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 45 minutes

Implement `fetchJobApplications`, `createJobApplication`, `updateJobApplication`, `deleteJobApplication` in `services/supabase.js`.

**Acceptance Criteria**:
- [ ] All 4 functions implemented with proper error handling
- [ ] Functions use correct Supabase queries
- [ ] Return types match expected data structures
- [ ] Error messages are user-friendly

**Files**:
- `src/services/supabase.js`

---

## Task 3: Build Job Tracker Kanban Board UI
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 2 hours

Create Kanban board with 4 columns in `DashboardPage.jsx` using existing TiltCard component.

**Acceptance Criteria**:
- [ ] 4 columns render: Applied, Screening, Interview, Offer+Rejected
- [ ] Job cards use TiltCard component for consistency
- [ ] Empty state shows helpful message with "Add Job" CTA
- [ ] Responsive layout works on tablet and desktop
- [ ] Visual design matches existing dashboard aesthetic

**Files**:
- `src/pages/DashboardPage.jsx`

---

## Task 4: Implement Drag-and-Drop for Job Tracker
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 1.5 hours

Add native HTML5 drag-and-drop to move jobs between status columns.

**Acceptance Criteria**:
- [ ] Jobs are draggable within and between columns
- [ ] Drop zones highlight on drag over
- [ ] Status updates in database on drop
- [ ] Optimistic UI update with rollback on error
- [ ] Visual feedback during drag (opacity, cursor)

**Files**:
- `src/pages/DashboardPage.jsx`

---

## Task 5: Add Job Application CRUD UI
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 1.5 hours

Create modal for adding/editing job applications with form validation.

**Acceptance Criteria**:
- [ ] "Add Job" button opens modal
- [ ] Form fields: company (required), role (required), applied_date, notes, job_url
- [ ] Validation shows errors for required fields
- [ ] Save button creates/updates application
- [ ] Delete button (for edit mode) with confirmation
- [ ] Modal closes on successful save

**Files**:
- `src/pages/DashboardPage.jsx`

---

## Task 6: Implement Cover Letters API Functions
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 30 minutes

Implement `fetchCoverLetters`, `saveCoverLetter`, `deleteCoverLetter` in `services/supabase.js`.

**Acceptance Criteria**:
- [ ] All 3 functions implemented with proper error handling
- [ ] `saveCoverLetter` uses upsert for create/update
- [ ] Functions return expected data structures
- [ ] Error handling includes network failures

**Files**:
- `src/services/supabase.js`

---

## Task 7: Wire Cover Letter Save/Load Functionality
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 1 hour

Connect cover letter UI to database functions for full persistence.

**Acceptance Criteria**:
- [ ] On mount, fetch and populate `savedLetters` state
- [ ] Save button calls `saveCoverLetter` and shows "Saved ✓" indicator
- [ ] Indicator fades after 2 seconds
- [ ] Dropdown shows saved letters with format: "{title} - {company} ({date})"
- [ ] Selecting letter populates all form fields

**Files**:
- `src/pages/CoverLetterPage.jsx`

---

## Task 8: Add Cover Letter Delete Functionality
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 30 minutes

Add delete button with confirmation for saved cover letters.

**Acceptance Criteria**:
- [ ] Trash icon button appears per saved letter in dropdown
- [ ] Click shows confirmation modal: "Delete this cover letter?"
- [ ] Confirm calls `deleteCoverLetter` and removes from state
- [ ] Cancel closes modal without deleting
- [ ] Toast notification on successful delete

**Files**:
- `src/pages/CoverLetterPage.jsx`

---

## Task 9: Ensure JD Persistence in Zustand Store
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 20 minutes

Verify `jobDescription` field is included in persist middleware.

**Acceptance Criteria**:
- [ ] `jobDescription` is NOT in exclude list of persist config
- [ ] JD text persists across browser refresh
- [ ] Test with long JD (>1000 chars)
- [ ] No console errors related to localStorage quota

**Files**:
- `src/store/resumeStore.js`

---

## Task 10: Add JD Character Count and Clear Button
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 30 minutes

Add character counter and clear button to JD textarea in AICoachSidebar.

**Acceptance Criteria**:
- [ ] Character count displays: "{count} / 5000 characters"
- [ ] Count updates in real-time as user types
- [ ] Clear button (trash icon) appears when JD has content
- [ ] Clear button shows confirmation if JD >100 chars
- [ ] Clear button empties textarea and updates store

**Files**:
- `src/components/AICoachSidebar.jsx`

---

## Task 11: Implement Auto-Match to JD Feature
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 1.5 hours

Add "Auto-match to JD" button that shows diff modal before applying changes.

**Acceptance Criteria**:
- [ ] Zap icon button appears below JD textarea
- [ ] Click calls `tailorResumeToJD()` from `atsScorer.js`
- [ ] Modal shows before/after comparison for each suggested change
- [ ] User can review changes before applying
- [ ] "Apply All" button updates resume data
- [ ] "Cancel" closes modal without changes

**Files**:
- `src/components/AICoachSidebar.jsx`
- `src/utils/atsScorer.js`

---

## Task 12: Implement PrachiSignature Photo Rendering
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 45 minutes

Add photo rendering with circle frame or initials fallback in PrachiSignature template.

**Acceptance Criteria**:
- [ ] If `personal.photo` exists, render in circular frame
- [ ] Frame border uses `settings.accentColor`
- [ ] If no photo, show initials in colored circle
- [ ] Initials background uses `settings.accentColor`
- [ ] Photo is properly sized (w-24 h-24) and centered

**Files**:
- `src/templates/templates/PrachiSignature.jsx`

---

## Task 13: Convert Skills to Visual Pills in PrachiSignature
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 30 minutes

Render skills as pill-shaped tags instead of plain text.

**Acceptance Criteria**:
- [ ] Skills split by comma and rendered as individual pills
- [ ] Pills have rounded borders and padding
- [ ] Background color uses `settings.accentColor` with 20% opacity
- [ ] Border and text color use `settings.accentColor`
- [ ] Pills wrap to multiple lines if needed

**Files**:
- `src/templates/templates/PrachiSignature.jsx`

---

## Task 14: Make PrachiSignature Fully Accent-Color Driven
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 30 minutes

Remove all hardcoded color hex values and use `settings.accentColor` throughout.

**Acceptance Criteria**:
- [ ] No hardcoded hex colors in template (search for #)
- [ ] All accent elements use `settings.accentColor`
- [ ] Test with 5 different accent colors
- [ ] Visual hierarchy remains clear with any color

**Files**:
- `src/templates/templates/PrachiSignature.jsx`

---

## Task 15: Add Font Size Scaling to PrachiSignature
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 45 minutes

Implement responsive font sizing based on `settings.fontSize` (small/medium/large).

**Acceptance Criteria**:
- [ ] Create font size map for small/medium/large
- [ ] Apply to all text elements (base text, headings, labels)
- [ ] Test with all 3 sizes - text should scale proportionally
- [ ] No text overflow or clipping at any size
- [ ] Maintain visual hierarchy at all sizes

**Files**:
- `src/templates/templates/PrachiSignature.jsx`

---

## Task 16: Add Page Break Prevention to PrachiSignature
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 15 minutes

Add `page-break-inside: avoid` to experience entries for PDF export.

**Acceptance Criteria**:
- [ ] Each experience entry wrapped in div with `pageBreakInside: 'avoid'`
- [ ] Test PDF export with 2-page resume
- [ ] Verify experience entries don't split across pages
- [ ] If entry too long, it moves to next page entirely

**Files**:
- `src/templates/templates/PrachiSignature.jsx`

---

## Task 17: Implement DOCX Bullet List Formatting
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 1.5 hours

Convert plain text bullets to actual Word list items using `docx` library.

**Acceptance Criteria**:
- [ ] Experience bullets render as Word list items with bullet points
- [ ] Proper indentation (left: 720, hanging: 360)
- [ ] Bullets use • character
- [ ] Test in Microsoft Word - bullets are editable as list items
- [ ] Test in Google Docs - bullets render correctly

**Files**:
- `src/utils/docxExporter.js`

---

## Task 18: Add Section Headings to DOCX Export
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 30 minutes

Use `HeadingLevel.HEADING_2` for section headings in DOCX.

**Acceptance Criteria**:
- [ ] All section headings (EXPERIENCE, EDUCATION, etc.) use HEADING_2
- [ ] Proper spacing before (240) and after (120) headings
- [ ] Headings are bold and larger than body text
- [ ] Test in Word - headings appear in document outline

**Files**:
- `src/utils/docxExporter.js`

---

## Task 19: Create Contact Table in DOCX Export
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 45 minutes

Replace contact line with borderless table for better formatting.

**Acceptance Criteria**:
- [ ] Single row table with 4 cells: email | phone | linkedin | location
- [ ] All borders set to NONE (invisible)
- [ ] Table width 100% of page
- [ ] Cells evenly distributed
- [ ] Test in Word and Google Docs - looks like single line

**Files**:
- `src/utils/docxExporter.js`

---

## Task 20: Strip Photo from DOCX Export
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 15 minutes

Remove photo from resume data before DOCX generation for ATS compatibility.

**Acceptance Criteria**:
- [ ] Photo field set to empty string before export
- [ ] Original resume data not modified (use copy)
- [ ] DOCX file size reduced (no image data)
- [ ] Test with resume that has photo - DOCX has no photo

**Files**:
- `src/utils/docxExporter.js`

---

## Task 21: Test Job Tracker End-to-End
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 1 hour

Comprehensive testing of Job Tracker functionality.

**Test Cases**:
- [ ] Create job application in "Applied" column
- [ ] Drag job to "Screening" - status updates in DB
- [ ] Edit job application - changes persist
- [ ] Delete job application - removed from UI and DB
- [ ] Test with 20+ jobs - performance is acceptable
- [ ] Test offline - shows error message
- [ ] Refresh page - jobs load correctly

**Files**:
- `src/pages/DashboardPage.jsx`
- `src/services/supabase.js`

---

## Task 22: Test Cover Letter End-to-End
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 45 minutes

Comprehensive testing of Cover Letter save/load/delete.

**Test Cases**:
- [ ] Generate cover letter, save with title
- [ ] Refresh page - saved letter appears in dropdown
- [ ] Select saved letter - all fields populate correctly
- [ ] Edit and save - updates existing letter
- [ ] Delete letter - removed from dropdown
- [ ] Test with 10+ saved letters - dropdown scrollable

**Files**:
- `src/pages/CoverLetterPage.jsx`
- `src/services/supabase.js`

---

## Task 23: Test JD Persistence and Auto-Match
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 30 minutes

Test JD persistence and auto-match functionality.

**Test Cases**:
- [ ] Paste JD (500+ chars), refresh page - JD persists
- [ ] Character count updates correctly
- [ ] Clear button works with confirmation
- [ ] Auto-match shows diff modal with suggestions
- [ ] Apply changes updates resume correctly
- [ ] Cancel doesn't modify resume

**Files**:
- `src/components/AICoachSidebar.jsx`
- `src/store/resumeStore.js`

---

## Task 24: Test PrachiSignature Template
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 45 minutes

Test PrachiSignature with various settings and data.

**Test Cases**:
- [ ] With photo - renders in circle with accent border
- [ ] Without photo - shows initials in colored circle
- [ ] Skills render as pills with accent color
- [ ] Change accent color - all elements update
- [ ] Test small/medium/large font sizes - scales correctly
- [ ] Export to PDF - no page breaks mid-entry
- [ ] Test with 2-page resume - formatting consistent

**Files**:
- `src/templates/templates/PrachiSignature.jsx`

---

## Task 25: Test DOCX Export Formatting
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 45 minutes

Test DOCX export in Microsoft Word and Google Docs.

**Test Cases**:
- [ ] Open in Microsoft Word - bullets are list items
- [ ] Edit bullets in Word - behave like native lists
- [ ] Section headings appear in document outline
- [ ] Contact line looks like single line (table invisible)
- [ ] No photo in exported DOCX
- [ ] Open in Google Docs - formatting preserved
- [ ] File size reasonable (<100KB for 2-page resume)

**Files**:
- `src/utils/docxExporter.js`

---

## Task 26: Create Phase 2 Integration Summary
**Status**: pending  
**Assignee**: unassigned  
**Estimated effort**: 30 minutes

Document all Phase 2 changes and create summary report.

**Acceptance Criteria**:
- [ ] Summary document lists all completed features
- [ ] Known issues documented (if any)
- [ ] Performance metrics recorded
- [ ] Screenshots of new features
- [ ] Recommendations for Phase 3

**Files**:
- `src/test/bugs/phase-2-integration-summary.md` (new)
