# Bugfix Requirements Document

## Introduction

This document addresses four critical production bugs in the HR Saarthi Resume Builder (resume.hrsaarthi.com) that are currently impacting user experience and core functionality. These bugs affect authentication, PDF export quality, ATS scoring accuracy, and data migration safety. The fixes will restore expected functionality without altering existing working behavior for non-buggy scenarios.

**Affected System:** React 18 SPA with Vite, Tailwind CSS, Zustand state management, and Supabase backend.

**Impact:** High - affects user authentication, document export quality, scoring accuracy, and data integrity for users migrating from older schema versions.

---

## Bug Analysis

### Current Behavior (Defect)

#### Bug 1: Google OAuth Non-Functional

1.1 WHEN a user clicks the "Continue with Google" button on the login page THEN the system shows a disabled button with `cursor-not-allowed` styling and displays "Google sign-in coming soon" tooltip

1.2 WHEN a user attempts to authenticate via Google OAuth THEN the system does not initiate the OAuth flow because the button is disabled

1.3 WHEN the `loginWithGoogle` method exists in authStore.js THEN the system does not connect it to the button's onClick handler in LoginPage

#### Bug 2: PDF Export Text Clipping

1.4 WHEN a resume spans multiple A4 pages THEN the system clips text mid-sentence at page boundaries using pixel-based splitting

1.5 WHEN html2canvas captures content that crosses the 1123px page boundary THEN the system performs a hard pixel cut without considering text line boundaries

1.6 WHEN long resumes are exported to PDF THEN the system produces documents with incomplete sentences at page breaks, particularly in templates like InfographicPro, CreativeSidebar, and DesignCanvas

#### Bug 3: ATS Keyword False Positives

1.7 WHEN the ATS scorer checks for the keyword "react" in resume text containing "interactive" THEN the system incorrectly reports a match using substring `.includes()` method

1.8 WHEN the keyword matching logic processes any keyword THEN the system matches partial words (e.g., "react" matches "overreact", "interactive", "reaction")

1.9 WHEN users receive ATS scores THEN the system inflates keyword match percentages due to false positive substring matches

#### Bug 4: Schema Migration Missing

1.10 WHEN a user with localStorage data from schema version 1, 2, or 3 loads the application THEN the system fails silently or crashes because no migration handler exists for SCHEMA_VERSION = 4

1.11 WHEN the persist middleware's `onRehydrateStorage` executes with old schema data THEN the system does not transform the data to include new v4 fields (expectedCompensation, preferredWorkMode)

1.12 WHEN users upgrade from v1/v2/v3 to v4 THEN the system loses or corrupts resume data due to missing field migrations

---

### Expected Behavior (Correct)

#### Bug 1: Google OAuth Functional

2.1 WHEN a user clicks the "Continue with Google" button THEN the system SHALL initiate the Supabase OAuth flow via `supabase.auth.signInWithOAuth()` with provider 'google'

2.2 WHEN the OAuth flow completes successfully THEN the system SHALL redirect to `/auth/callback` with the authorization code

2.3 WHEN the Google OAuth button is rendered THEN the system SHALL display it as enabled without `cursor-not-allowed` styling or "coming soon" tooltip

2.4 WHEN the `loginWithGoogle` method is called THEN the system SHALL set the redirect URL to `${window.location.origin}/auth/callback`

#### Bug 2: PDF Export Smart Page Breaks

2.5 WHEN a resume spans multiple A4 pages THEN the system SHALL use DOM-aware page break detection to split content at safe boundaries (between resume entries, sections, or lines)

2.6 WHEN html2canvas captures multi-page content THEN the system SHALL apply the three-tier waterfall break strategy (entry boundaries → section boundaries → line boundaries → nearest gap)

2.7 WHEN long resumes are exported to PDF THEN the system SHALL produce documents with complete sentences at all page breaks, with no mid-text clipping

2.8 WHEN page breaks are calculated THEN the system SHALL add appropriate top margins (PAGE2_TOP_MARGIN = 56px) to pages 2+ and bottom margins (PAGE1_BOTTOM_MARGIN = 56px) to page 1

#### Bug 3: ATS Keyword Word-Boundary Matching

2.9 WHEN the ATS scorer checks for the keyword "react" in resume text THEN the system SHALL use word-boundary regex (`\breact\b`) to match only complete words

2.10 WHEN the keyword matching logic processes any keyword THEN the system SHALL escape special regex characters and apply word boundaries to prevent partial matches

2.11 WHEN users receive ATS scores THEN the system SHALL report accurate keyword match percentages based on whole-word matches only

2.12 WHEN the `keywordMatch` function is called THEN the system SHALL return true only when the keyword appears as a complete word, not as a substring

#### Bug 4: Schema Migration Implemented

2.13 WHEN a user with localStorage data from schema version 1 loads the application THEN the system SHALL migrate the data by adding `github`, `twitter`, and `photo` fields to personal info

2.14 WHEN a user with localStorage data from schema version 2 loads the application THEN the system SHALL migrate the data by adding the `customSections` array

2.15 WHEN a user with localStorage data from schema version 3 loads the application THEN the system SHALL migrate the data by adding `expectedCompensation` (with currency, min, max, period) and `preferredWorkMode` fields

2.16 WHEN the persist middleware's `migrate` function executes THEN the system SHALL apply all necessary transformations to bring old data to SCHEMA_VERSION = 4 without data loss

---

### Unchanged Behavior (Regression Prevention)

#### Bug 1: Google OAuth - Preserve Existing Auth

3.1 WHEN a user signs in with email/password THEN the system SHALL CONTINUE TO authenticate via `login(email, password)` without any changes

3.2 WHEN a user signs up with email/password THEN the system SHALL CONTINUE TO create accounts via `register(email, password, name)` without any changes

3.3 WHEN the AuthCallback page handles OAuth redirects THEN the system SHALL CONTINUE TO process the callback using existing `supabase.auth.exchangeCodeForSession()` logic

#### Bug 2: PDF Export - Preserve Quality Settings

3.4 WHEN a PDF is exported with SCALE = 3 THEN the system SHALL CONTINUE TO render at 3× resolution for print quality

3.5 WHEN fonts are loaded before PDF capture THEN the system SHALL CONTINUE TO use `warmFonts()` and `forceFontRender()` for font consistency

3.6 WHEN sidebar templates are exported THEN the system SHALL CONTINUE TO detect and preserve sidebar background colors across page breaks

3.7 WHEN page 2+ headers are rendered THEN the system SHALL CONTINUE TO display the runner header with name and page numbers

#### Bug 3: ATS Scorer - Preserve Scoring Logic

3.8 WHEN the ATS scorer calculates contact info scores THEN the system SHALL CONTINUE TO award 2.5 points per valid contact field

3.9 WHEN the ATS scorer evaluates content completeness THEN the system SHALL CONTINUE TO score summary (0-10), experience (0-15), skills (0-5), and education (0-5) sections

3.10 WHEN the ATS scorer detects action verbs THEN the system SHALL CONTINUE TO award up to 10 points based on ACTION_VERBS array matches

3.11 WHEN the ATS scorer extracts JD keywords THEN the system SHALL CONTINUE TO use the `extractKeywords()` function with stop-word filtering

#### Bug 4: Schema Migration - Preserve Data Integrity

3.12 WHEN a user with SCHEMA_VERSION = 4 data loads the application THEN the system SHALL CONTINUE TO load the data without any migration transformations

3.13 WHEN new resumes are created THEN the system SHALL CONTINUE TO initialize with DEFAULT_RESUME structure at SCHEMA_VERSION = 4

3.14 WHEN resumes are saved to localStorage THEN the system SHALL CONTINUE TO persist using the `hwp-resume-store-v2` key with safe storage wrapper

3.15 WHEN cloud sync occurs THEN the system SHALL CONTINUE TO normalize `resumeData`/`data` field names for backward compatibility
