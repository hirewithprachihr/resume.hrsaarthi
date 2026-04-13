# Phase 2 — Feature Completions

## Overview
Complete 5 partially implemented features that have UI but lack backend functionality or proper wiring. These features are visible to users but currently non-functional or incomplete.

## Target Users
- All users (Job Tracker, Cover Letter save/load, JD persistence)
- Pro users (PrachiSignature template)
- Export users (DOCX formatting)

## Business Value
- **Job Tracker**: Increases user engagement and retention by providing application tracking
- **Cover Letter**: Completes the cover letter workflow, making it actually usable
- **JD Persistence**: Improves ATS optimization workflow by preserving job descriptions
- **PrachiSignature**: Makes the brand's signature template production-ready
- **DOCX Export**: Ensures professional formatting for ATS compatibility

## Success Criteria
1. Job Tracker: Users can create, update, and track job applications with Kanban board
2. Cover Letter: Users can save, load, and delete cover letters with full persistence
3. JD Persistence: Job descriptions persist across sessions and show character count
4. PrachiSignature: Template renders correctly with all features (photo, skills pills, accent colors)
5. DOCX Export: Bullet points render as actual Word list items, not plain text

## Technical Scope

### 2.1 — Job Tracker (Dashboard) — Make It Functional
**Files**: `pages/DashboardPage.jsx`, `services/supabase.js`

**Current State**: Job application tracker UI exists but backend functions may be stubs.

**Requirements**:
- Supabase table `job_applications` with proper schema and RLS
- Implement `fetchJobApplications`, `createJobApplication`, `updateJobApplication` in supabase.js
- Kanban-style board with 4 columns: Applied / Screening / Interview / Offer+Rejected
- Drag-to-reorder between columns (no external DnD library)
- Uses existing TiltCard component for visual consistency

### 2.2 — Cover Letter: Save & Load History
**Files**: `pages/CoverLetterPage.jsx`, `services/supabase.js`

**Current State**: UI for saved letters dropdown exists but not wired up correctly.

**Requirements**:
- Supabase table `cover_letters` with proper schema and RLS
- Implement `fetchCoverLetters`, `saveCoverLetter` functions
- On mount, populate `savedLetters` state from database
- On select from dropdown, populate all fields (jobTitle, company, tone, content)
- Add delete button with confirmation per saved letter
- Show "Saved ✓" indicator for 2 seconds after save

### 2.3 — AI Coach Sidebar: JD-Paste Persistence
**Files**: `components/AICoachSidebar.jsx`, `store/resumeStore.js`

**Current State**: JD text is in Zustand store but clears on page refresh.

**Requirements**:
- Ensure `jobDescription` is included in persist middleware
- Add character count display
- Add "Clear JD" button
- Add "Auto-match to JD" button with Zap icon
- Show diff modal of suggested changes before applying

### 2.4 — Template: PrachiSignature — Make It Production-Ready
**Files**: `templates/templates/PrachiSignature.jsx`

**Current State**: Brand's signature template exists but may have incomplete features.

**Requirements**:
- Photo rendering: circle/hexagon frame if present, initials fallback if absent
- Skills section: render as visual pill tags, not plain text
- Accent color: fully driven by `settings.accentColor` (no hardcoded hex)
- Font size scaling: test with small/medium/large settings
- Add `page-break-inside: avoid` to experience entries for PDF export

### 2.5 — DOCX Export: Fix List Formatting
**Files**: `utils/docxExporter.js`

**Current State**: Bullet points render as plain text paragraphs in DOCX export.

**Requirements**:
- Experience bullets → actual Word list items using `ListItem` with numbering
- Section headings → `HeadingLevel.HEADING_2`
- Contact line → single `TableRow` with 4 cells (email | phone | linkedin | location)
- Strip photo from DOCX for ATS compatibility
- No text boxes, no tables for main content

## Out of Scope
- New features not listed above
- UI redesigns (use existing components)
- Performance optimizations
- Mobile-specific changes
- Admin panel features

## Dependencies
- Supabase database access
- `docx` npm package (already installed)
- Existing Zustand store structure
- Existing template component interface

## Risks & Mitigations
- **Risk**: Supabase tables may not exist
  - **Mitigation**: Create tables with proper RLS policies first
- **Risk**: Breaking existing resume data structure
  - **Mitigation**: Only add new fields, never remove/rename existing ones
- **Risk**: DOCX export library limitations
  - **Mitigation**: Test with Microsoft Word and Google Docs both

## Testing Strategy
- Verify Job Tracker CRUD operations work correctly
- Test Cover Letter save/load/delete flow end-to-end
- Confirm JD persistence across browser refresh
- Test PrachiSignature with all settings combinations
- Open exported DOCX in Word and Google Docs to verify formatting
