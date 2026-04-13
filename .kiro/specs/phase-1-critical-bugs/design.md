# Phase 1 Critical Bugs - Bugfix Design

## Overview

This design addresses four critical production bugs in the HR Saarthi Resume Builder that impact core functionality: Google OAuth authentication, PDF export quality, ATS scoring accuracy, and data migration safety. The fixes will restore expected functionality using targeted, minimal changes that preserve all existing working behavior for non-buggy scenarios.

**System Context:** React 18 SPA with Vite, Tailwind CSS, Zustand state management, and Supabase backend.

**Fix Strategy:** Apply the bug condition methodology to isolate buggy inputs, define correct behavior, and ensure preservation of all non-buggy functionality through comprehensive testing.

## Glossary

- **Bug_Condition (C)**: The condition that triggers each specific bug
- **Property (P)**: The desired correct behavior when the bug condition holds
- **Preservation**: Existing functionality that must remain unchanged by the fix
- **loginWithGoogle**: Method in `authStore.js` that initiates Supabase OAuth flow
- **exportToPDF**: Function in `pdfExporter.js` that renders multi-page PDFs using html2canvas
- **keywordMatch**: Function in `atsScorer.js` that checks if a keyword appears in resume text
- **migrate**: Function in `resumeStore.js` that transforms old schema data to current version
- **SCHEMA_VERSION**: Current schema version constant (value: 4)

## Bug Details

### Bug 1: Google OAuth Non-Functional

#### Bug Condition

The bug manifests when a user attempts to sign in with Google OAuth. The `loginWithGoogle` method exists in authStore.js but the button in LoginPage.jsx is disabled and shows a "coming soon" tooltip, preventing OAuth flow initiation.

**Formal Specification:**
```
FUNCTION isBugCondition_OAuth(input)
  INPUT: input of type UserAction
  OUTPUT: boolean
  
  RETURN input.action == 'click_google_button'
         AND googleButtonExists()
         AND NOT oauthFlowInitiated()
END FUNCTION
```

#### Examples

- User clicks "Continue with Google" button → Button is disabled, no OAuth flow starts
- User expects Google sign-in → Sees `cursor-not-allowed` styling and "Google sign-in coming soon" tooltip
- `loginWithGoogle()` method exists in authStore → Not connected to button's onClick handler
- OAuth callback handler exists in AuthCallback.jsx → Never receives OAuth redirect because flow never starts

### Bug 2: PDF Export Text Clipping

#### Bug Condition

The bug manifests when a resume spans multiple A4 pages (>1123px height). The system performs pixel-based page splitting at exactly 1123px boundaries, which cuts through text lines mid-sentence when content crosses the page boundary.

**Formal Specification:**
```
FUNCTION isBugCondition_PDFClip(input)
  INPUT: input of type ResumeExportRequest
  OUTPUT: boolean
  
  RETURN input.resumeHeight > 1123
         AND contentCrossesPageBoundary(input, 1123)
         AND NOT smartBreakDetectionUsed()
END FUNCTION
```

#### Examples

- Resume with 2 pages of experience → Text at 1123px boundary is sliced mid-word
- InfographicPro template with dense content → Bullet points cut in half at page break
- CreativeSidebar template → Section headers split across pages
- DesignCanvas template with long descriptions → Sentences incomplete at page transitions

### Bug 3: ATS Keyword False Positives

#### Bug Condition

The bug manifests when the ATS scorer checks for keyword matches using substring `.includes()` method. This causes false positives where keywords match as substrings within larger words rather than as complete words.

**Formal Specification:**
```
FUNCTION isBugCondition_ATSKeyword(input)
  INPUT: input of type KeywordMatchRequest
  OUTPUT: boolean
  
  RETURN input.keyword IN JD_KEYWORDS
         AND substringMatchUsed(input.keyword, input.resumeText)
         AND NOT wordBoundaryMatchUsed(input.keyword, input.resumeText)
END FUNCTION
```

#### Examples

- Keyword "react" matches "interactive" → False positive (substring match)
- Keyword "react" matches "overreact" → False positive (substring match)
- Keyword "react" matches "reaction" → False positive (substring match)
- Keyword "java" matches "javascript" → False positive when JD specifically wants Java
- ATS score shows 85% keyword match → Actual whole-word match is only 60%

### Bug 4: Schema Migration Missing

#### Bug Condition

The bug manifests when a user with localStorage data from schema version 1, 2, or 3 loads the application with SCHEMA_VERSION = 4. No migration handler exists to transform old data structures to include new v4 fields, causing silent failures or crashes.

**Formal Specification:**
```
FUNCTION isBugCondition_Migration(input)
  INPUT: input of type LocalStorageData
  OUTPUT: boolean
  
  RETURN input.version IN [1, 2, 3, undefined]
         AND CURRENT_SCHEMA_VERSION == 4
         AND NOT migrationHandlerExists(input.version, 4)
END FUNCTION
```

#### Examples

- User with v1 data (no github/twitter fields) → App crashes when trying to render personal.github
- User with v2 data (no customSections array) → Render error when accessing customSections
- User with v3 data (no expectedCompensation object) → TypeError when accessing personal.expectedCompensation.currency
- User upgrades from old version → Resume data lost or corrupted due to missing field migrations

## Expected Behavior

### Preservation Requirements

**Bug 1: Google OAuth - Unchanged Behaviors:**
- Email/password sign-in must continue to work exactly as before via `login(email, password)`
- Email/password sign-up must continue to work exactly as before via `register(email, password, name)`
- AuthCallback page OAuth redirect handling must continue to use existing `supabase.auth.exchangeCodeForSession()` logic
- Password reset flow must continue to work via `supabase.auth.resetPasswordForEmail()`

**Bug 2: PDF Export - Unchanged Behaviors:**
- PDF rendering at SCALE = 3 for print quality must remain unchanged
- Font loading via `warmFonts()` and `forceFontRender()` must remain unchanged
- Sidebar template background color preservation across pages must remain unchanged
- Page 2+ runner headers with name and page numbers must remain unchanged
- PDF compression and image quality settings must remain unchanged

**Bug 3: ATS Scorer - Unchanged Behaviors:**
- Contact info scoring (2.5 points per valid field) must remain unchanged
- Content completeness scoring (summary, experience, skills, education) must remain unchanged
- Action verb detection and scoring must remain unchanged
- JD keyword extraction with stop-word filtering must remain unchanged
- Quantifiable results detection (numbers, percentages, metrics) must remain unchanged

**Bug 4: Schema Migration - Unchanged Behaviors:**
- Users with SCHEMA_VERSION = 4 data must load without any migration transformations
- New resumes must initialize with DEFAULT_RESUME structure at SCHEMA_VERSION = 4
- Resume persistence to localStorage must continue using `hwp-resume-store-v2` key
- Cloud sync must continue to normalize `resumeData`/`data` field names for backward compatibility

**Scope:**
All inputs that do NOT trigger the specific bug conditions should be completely unaffected by these fixes. This includes:
- All non-Google authentication methods (Bug 1)
- Single-page resumes and resumes with natural page breaks (Bug 2)
- Non-keyword-based ATS scoring components (Bug 3)
- Users already on schema v4 (Bug 4)

## Hypothesized Root Cause

### Bug 1: Google OAuth Non-Functional

Based on the code analysis, the root causes are:

1. **UI Disconnection**: The Google button in `LoginPage.jsx` has `disabled` prop set and shows "Google sign-in coming soon" tooltip, preventing user interaction
2. **Handler Not Wired**: The `loginWithGoogle` method exists in `authStore.js` but is not connected to the button's `onClick` handler
3. **Intentional Stub**: The button was intentionally disabled as a placeholder, with the backend OAuth method already implemented but not activated in the UI

### Bug 2: PDF Export Text Clipping

Based on the code analysis, the root causes are:

1. **Pixel-Based Splitting**: The old algorithm in `pdfExporter.js` used fixed 1123px boundaries without DOM-aware content analysis
2. **Narrow Search Radius**: Previous implementation searched only 160px before and 48px after the boundary, missing safe break points in dense resumes
3. **No Tier Strategy**: Lacked a waterfall approach to find entry boundaries → section boundaries → line boundaries → gaps
4. **Hard Fallback**: When no safe break found, performed hard pixel cut that sliced through text lines

### Bug 3: ATS Keyword False Positives

Based on the code analysis, the root causes are:

1. **Substring Matching**: The `keywordMatch` logic uses `.includes()` method which matches substrings anywhere in the text
2. **No Word Boundaries**: Missing regex word-boundary checks (`\b`) to ensure keywords match as complete words only
3. **Inflated Scores**: False positives artificially inflate keyword match percentages, misleading users about ATS compatibility

### Bug 4: Schema Migration Missing

Based on the code analysis, the root causes are:

1. **Incomplete Migration Function**: The `migrate()` function in `resumeStore.js` has logic for v1→v2 and v2→v3 but incomplete handling for v3→v4
2. **Missing Field Additions**: v4 added `expectedCompensation` and `preferredWorkMode` fields but migration doesn't add these to v3 data
3. **No Version Check**: The `onRehydrateStorage` callback doesn't properly invoke migration for old versions

## Correctness Properties

Property 1: Bug Condition - Google OAuth Flow Initiation

_For any_ user action where the "Continue with Google" button is clicked, the fixed system SHALL initiate the Supabase OAuth flow via `supabase.auth.signInWithOAuth()` with provider 'google', redirect to `${window.location.origin}/auth/callback`, and display the button as enabled without disabled styling or "coming soon" tooltip.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

Property 2: Preservation - Non-Google Authentication

_For any_ authentication action that is NOT Google OAuth (email/password sign-in, email/password sign-up, password reset), the fixed code SHALL produce exactly the same behavior as the original code, preserving all existing authentication flows and callback handling.

**Validates: Requirements 3.1, 3.2, 3.3**

Property 3: Bug Condition - PDF Smart Page Breaks

_For any_ resume export where the content height exceeds 1123px (multi-page), the fixed exportToPDF function SHALL use DOM-aware page break detection with the three-tier waterfall strategy (entry boundaries → section boundaries → line boundaries → nearest gap) to split content at safe boundaries, producing PDFs with complete sentences at all page breaks and no mid-text clipping.

**Validates: Requirements 2.5, 2.6, 2.7, 2.8**

Property 4: Preservation - PDF Export Quality Settings

_For any_ PDF export operation, the fixed code SHALL preserve all existing quality settings including SCALE = 3 rendering, font loading mechanisms, sidebar background color handling, page 2+ runner headers, and compression settings exactly as the original implementation.

**Validates: Requirements 3.4, 3.5, 3.6, 3.7**

Property 5: Bug Condition - ATS Word-Boundary Keyword Matching

_For any_ keyword match check in the ATS scorer, the fixed keywordMatch function SHALL use word-boundary regex (`\breact\b`) to match only complete words, escape special regex characters, and return true only when the keyword appears as a complete word (not as a substring), producing accurate keyword match percentages.

**Validates: Requirements 2.9, 2.10, 2.11, 2.12**

Property 6: Preservation - ATS Scoring Components

_For any_ ATS scoring operation that does NOT involve keyword matching (contact info scoring, content completeness, action verb detection, quantifiable results detection), the fixed code SHALL produce exactly the same scores and behavior as the original implementation.

**Validates: Requirements 3.8, 3.9, 3.10, 3.11**

Property 7: Bug Condition - Schema Migration v1/v2/v3 to v4

_For any_ localStorage data with schema version 1, 2, 3, or undefined, the fixed migrate function SHALL transform the data by adding all missing fields (v1: github/twitter/photo, v2: customSections, v3: expectedCompensation/preferredWorkMode) with safe defaults, bringing the data to SCHEMA_VERSION = 4 without data loss.

**Validates: Requirements 2.13, 2.14, 2.15, 2.16**

Property 8: Preservation - Schema v4 Data Loading

_For any_ localStorage data that is already at SCHEMA_VERSION = 4, the fixed code SHALL load the data without any migration transformations, preserving all existing persistence mechanisms and cloud sync normalization exactly as the original implementation.

**Validates: Requirements 3.12, 3.13, 3.14, 3.15**

## Fix Implementation

### Bug 1: Google OAuth Non-Functional

Assuming our root cause analysis is correct:

**File**: `src/pages/LoginPage.jsx`

**Function**: Google OAuth button handler

**Specific Changes**:
1. **Remove Disabled State**: Remove `disabled` prop from the Google OAuth button
2. **Remove Coming Soon Tooltip**: Remove `title="Google sign-in coming soon"` attribute
3. **Remove Disabled Styling**: Remove `cursor-not-allowed` CSS class
4. **Wire onClick Handler**: Add `onClick={handleGoogle}` to connect to existing `loginWithGoogle` method
5. **Verify Redirect URL**: Ensure `loginWithGoogle` in authStore.js sets `redirectTo: ${window.location.origin}/auth/callback`

**File**: `src/store/authStore.js`

**Function**: `loginWithGoogle`

**Verification**:
- Confirm method calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })`
- Confirm error handling throws error for UI toast display
- No changes needed if implementation is correct

### Bug 2: PDF Export Text Clipping

Assuming our root cause analysis is correct:

**File**: `src/utils/pdfExporter.js`

**Function**: `findSmartBreaks`, `findBestCandidate`, `collectTierCandidates`, `collectLineCandidates`

**Specific Changes**:
1. **Expand Search Radii**: Increase tier search ranges:
   - TIER1_BEFORE: 160 → 220px, TIER1_AFTER: 48 → 60px
   - TIER2_BEFORE: 100 → 140px, TIER2_AFTER: 30 → 40px
   - TIER3_BEFORE: 60 → 80px, TIER3_AFTER: 15 → 20px

2. **Enhance Tier 1 Candidates**: Add `.resume-section-compact` to tier 1 selectors for section-level breaks

3. **Add Fallback Gap Detection**: Implement `findNearestGap()` function that searches entire page for closest blank space when no tier candidates found

4. **Add Safety Margin**: Apply `PAGE_SAFETY_MARGIN = 36px` to hard-cut fallback to prevent text flush at page top

5. **Verify Existing Logic**: Confirm three-tier waterfall (entry → section → line → gap → hard cut) is already implemented correctly

**Note**: Code analysis shows the smart page break engine is already implemented in v4.0. Verify it's working correctly or adjust search radii if still clipping.

### Bug 3: ATS Keyword False Positives

Assuming our root cause analysis is correct:

**File**: `src/utils/atsScorer.js`

**Function**: `keywordMatch` (new function to create), `scoreKeywords`, `getKeywordGaps`, `tailorResumeToJD`

**Specific Changes**:
1. **Create keywordMatch Function**:
```javascript
function keywordMatch(text, keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`\\b${escaped}\\b`, 'i')
  return regex.test(text)
}
```

2. **Update scoreKeywords**: Replace `.includes()` checks with `keywordMatch()` calls in the matched keywords filter

3. **Update getKeywordGaps**: Replace substring matching with word-boundary regex in the present keywords filter

4. **Update tailorResumeToJD**: Replace `.includes()` checks with `keywordMatch()` calls in missing keywords detection

5. **Update Action Verb Matching**: Ensure ACTION_VERBS filter uses word-boundary regex (already implemented correctly)

### Bug 4: Schema Migration Missing

Assuming our root cause analysis is correct:

**File**: `src/store/resumeStore.js`

**Function**: `migrate`

**Specific Changes**:
1. **Enhance v1→v2 Migration**: Ensure github, twitter, photo fields are added to personal object

2. **Enhance v2→v3 Migration**: Ensure customSections array is added to resumeData

3. **Complete v3→v4 Migration**: Add comprehensive field additions:
```javascript
if (!old.version || old.version < 4) {
  const rd = migrated.resumeData || {}
  const ec = rd.personal?.expectedCompensation
  migrated.resumeData = {
    ...rd,
    personal: {
      ...DEFAULT_RESUME.personal,
      ...rd.personal,
      expectedCompensation: ec && typeof ec === 'object'
        ? { currency: ec.currency || 'INR', min: ec.min ?? '', max: ec.max ?? '', period: ec.period || 'annual' }
        : { currency: 'INR', min: '', max: '', period: 'annual' },
      preferredWorkMode: rd.personal?.preferredWorkMode ?? '',
    },
    experience: (rd.experience || []).map(e => ({
      ...e,
      employmentType: e.employmentType || 'full_time',
      teamSize: e.teamSize ?? '',
    })),
  }
}
```

4. **Verify onRehydrateStorage**: Confirm it calls migrate() for old versions and normalizes savedResumes data/resumeData fields

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate each bug on unfixed code, then verify the fixes work correctly and preserve existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate all four bugs BEFORE implementing fixes. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Write tests that simulate each bug condition and assert the expected failure. Run these tests on the UNFIXED code to observe failures and understand the root causes.

**Test Cases**:

1. **Google OAuth Test**: Attempt to click Google button and verify OAuth flow does NOT initiate (will fail on unfixed code - button is disabled)
2. **PDF Clipping Test**: Export a 2-page resume with dense content and verify text IS clipped at 1123px boundary (will fail on unfixed code)
3. **ATS Keyword Test**: Check if "react" matches "interactive" and verify it returns TRUE (will fail on unfixed code - false positive)
4. **Schema Migration Test**: Load v3 data and verify app crashes or fails when accessing expectedCompensation (will fail on unfixed code)

**Expected Counterexamples**:
- Google button is disabled and shows "coming soon" tooltip
- PDF export clips text mid-sentence at page boundaries
- ATS scorer reports false positive keyword matches (substring matching)
- App crashes or shows undefined errors when loading old schema data

### Fix Checking

**Goal**: Verify that for all inputs where each bug condition holds, the fixed functions produce the expected behavior.

**Pseudocode:**

**Bug 1 - Google OAuth:**
```
FOR ALL userAction WHERE isBugCondition_OAuth(userAction) DO
  result := handleGoogleClick_fixed(userAction)
  ASSERT oauthFlowInitiated(result)
  ASSERT buttonEnabled(result)
  ASSERT noComingSoonTooltip(result)
END FOR
```

**Bug 2 - PDF Export:**
```
FOR ALL resumeExport WHERE isBugCondition_PDFClip(resumeExport) DO
  result := exportToPDF_fixed(resumeExport)
  ASSERT noTextClipping(result)
  ASSERT smartBreaksUsed(result)
  ASSERT completeSentencesAtPageBreaks(result)
END FOR
```

**Bug 3 - ATS Keywords:**
```
FOR ALL keywordCheck WHERE isBugCondition_ATSKeyword(keywordCheck) DO
  result := keywordMatch_fixed(keywordCheck.keyword, keywordCheck.text)
  ASSERT wordBoundaryMatch(result)
  ASSERT noFalsePositives(result)
END FOR
```

**Bug 4 - Schema Migration:**
```
FOR ALL oldData WHERE isBugCondition_Migration(oldData) DO
  result := migrate_fixed(oldData)
  ASSERT allFieldsPresent(result)
  ASSERT noDataLoss(result)
  ASSERT schemaVersion4(result)
END FOR
```

### Preservation Checking

**Goal**: Verify that for all inputs where the bug conditions do NOT hold, the fixed functions produce the same results as the original functions.

**Pseudocode:**

**Bug 1 - Preserve Email/Password Auth:**
```
FOR ALL authAction WHERE NOT isBugCondition_OAuth(authAction) DO
  ASSERT login_original(authAction) = login_fixed(authAction)
  ASSERT register_original(authAction) = register_fixed(authAction)
END FOR
```

**Bug 2 - Preserve PDF Quality:**
```
FOR ALL pdfExport WHERE NOT isBugCondition_PDFClip(pdfExport) DO
  ASSERT exportToPDF_original(pdfExport).quality = exportToPDF_fixed(pdfExport).quality
  ASSERT exportToPDF_original(pdfExport).fonts = exportToPDF_fixed(pdfExport).fonts
END FOR
```

**Bug 3 - Preserve ATS Scoring:**
```
FOR ALL atsScore WHERE NOT involvesKeywordMatching(atsScore) DO
  ASSERT scoreResume_original(atsScore) = scoreResume_fixed(atsScore)
END FOR
```

**Bug 4 - Preserve v4 Data Loading:**
```
FOR ALL data WHERE data.version == 4 DO
  ASSERT loadResume_original(data) = loadResume_fixed(data)
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for non-buggy scenarios, then write property-based tests capturing that behavior.

**Test Cases**:

1. **Email Auth Preservation**: Verify email/password sign-in and sign-up continue to work identically
2. **PDF Single-Page Preservation**: Verify single-page resumes export with same quality and formatting
3. **ATS Non-Keyword Preservation**: Verify contact info, content, impact, and format scoring unchanged
4. **Schema v4 Preservation**: Verify v4 data loads without migration and persists correctly

### Unit Tests

**Bug 1: Google OAuth**
- Test Google button is enabled and clickable
- Test onClick handler calls loginWithGoogle method
- Test loginWithGoogle initiates OAuth flow with correct provider and redirect URL
- Test error handling displays toast on OAuth failure

**Bug 2: PDF Export**
- Test findSmartBreaks returns safe break points for 2-page resume
- Test collectTierCandidates finds entry and section boundaries
- Test collectLineCandidates finds line-level break points
- Test findNearestGap finds closest blank space when no tier candidates
- Test hard-cut fallback applies PAGE_SAFETY_MARGIN

**Bug 3: ATS Keywords**
- Test keywordMatch("react", "I use react") returns true
- Test keywordMatch("react", "interactive design") returns false
- Test keywordMatch("java", "javascript developer") returns false
- Test special regex characters are escaped correctly
- Test case-insensitive matching works

**Bug 4: Schema Migration**
- Test migrate(v1Data) adds github, twitter, photo fields
- Test migrate(v2Data) adds customSections array
- Test migrate(v3Data) adds expectedCompensation and preferredWorkMode
- Test migrate(v4Data) returns data unchanged
- Test onRehydrateStorage calls migrate for old versions

### Property-Based Tests

**Bug 1: Google OAuth**
- Generate random user click events and verify OAuth flow initiates for Google button clicks
- Generate random authentication methods and verify non-Google methods unchanged

**Bug 2: PDF Export**
- Generate random resume content with varying heights and verify no text clipping at page breaks
- Generate random single-page resumes and verify quality settings preserved

**Bug 3: ATS Keywords**
- Generate random keyword/text pairs and verify word-boundary matching (no false positives)
- Generate random resume content and verify non-keyword scoring components unchanged

**Bug 4: Schema Migration**
- Generate random v1/v2/v3 data structures and verify successful migration to v4
- Generate random v4 data and verify no migration applied

### Integration Tests

**Bug 1: Google OAuth**
- Test full OAuth flow: click button → redirect to Google → callback → dashboard
- Test OAuth error handling: failed OAuth → error toast → stay on login page
- Test OAuth with existing session: already logged in → redirect to dashboard

**Bug 2: PDF Export**
- Test multi-page resume export with InfographicPro template
- Test multi-page resume export with CreativeSidebar template
- Test multi-page resume export with DesignCanvas template
- Test visual inspection: no text clipping, proper page breaks, runner headers on page 2+

**Bug 3: ATS Keywords**
- Test full ATS scoring flow with job description containing "react"
- Test keyword gap analysis shows accurate match percentages
- Test tailor-to-JD suggestions use word-boundary matching

**Bug 4: Schema Migration**
- Test app load with v1 localStorage data → successful migration → no crashes
- Test app load with v2 localStorage data → successful migration → no crashes
- Test app load with v3 localStorage data → successful migration → no crashes
- Test cloud sync with mixed schema versions → normalization works correctly
