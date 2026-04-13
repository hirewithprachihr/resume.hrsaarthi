# Implementation Plan

## Bug 1: Google OAuth Non-Functional

- [x] 1. Write bug condition exploration test for Google OAuth
  - **Property 1: Bug Condition** - Google OAuth Flow Not Initiated
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the OAuth flow does not initiate
  - **Scoped PBT Approach**: Test the concrete failing case - Google button click does not trigger OAuth
  - Test implementation details from Bug Condition in design:
    - Verify Google button exists in LoginPage
    - Verify button has `disabled` prop set to true
    - Verify button shows "Google sign-in coming soon" tooltip
    - Verify `loginWithGoogle` method exists in authStore but is not connected to onClick
    - Attempt to trigger OAuth flow and verify it does NOT initiate
  - The test assertions should match the Expected Behavior Properties from design:
    - Assert OAuth flow SHOULD initiate via `supabase.auth.signInWithOAuth()`
    - Assert button SHOULD be enabled without disabled styling
    - Assert redirect URL SHOULD be `${window.location.origin}/auth/callback`
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: button is disabled, no OAuth flow starts, tooltip shows "coming soon"
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Write preservation property tests for non-Google authentication (BEFORE implementing fix)
  - **Property 2: Preservation** - Email/Password Authentication Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-Google auth:
    - Test email/password sign-in via `login(email, password)`
    - Test email/password sign-up via `register(email, password, name)`
    - Test password reset via `supabase.auth.resetPasswordForEmail()`
    - Test AuthCallback OAuth redirect handling via `exchangeCodeForSession()`
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - For all email/password sign-in attempts, verify authentication flow unchanged
    - For all email/password sign-up attempts, verify account creation unchanged
    - For all password reset requests, verify reset flow unchanged
    - For all OAuth callbacks (non-Google), verify callback handling unchanged
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 3. Fix Google OAuth button and wire OAuth flow

  - [x] 3.1 Implement the fix in LoginPage and authStore
    - In `src/pages/LoginPage.jsx`:
      - Remove `disabled` prop from Google OAuth button
      - Remove `title="Google sign-in coming soon"` attribute
      - Remove `cursor-not-allowed` CSS class
      - Add `onClick={handleGoogle}` to connect to loginWithGoogle method
    - In `src/store/authStore.js`:
      - Verify `loginWithGoogle` method calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: ${window.location.origin}/auth/callback } })`
      - Verify error handling throws error for UI toast display
    - In `src/pages/AuthCallback.jsx`:
      - Verify OAuth callback handler uses `supabase.auth.exchangeCodeForSession()` on mount
    - _Bug_Condition: isBugCondition_OAuth(input) where input.action == 'click_google_button' AND NOT oauthFlowInitiated()_
    - _Expected_Behavior: OAuth flow initiates via signInWithOAuth, button enabled, no "coming soon" tooltip_
    - _Preservation: Email/password auth, sign-up, password reset, and OAuth callback handling unchanged_
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_

  - [x] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Google OAuth Flow Initiates
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify Google button is enabled and clickable
    - Verify onClick handler calls loginWithGoogle method
    - Verify OAuth flow initiates with correct provider and redirect URL
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Email/Password Authentication Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm email/password sign-in still works identically
    - Confirm email/password sign-up still works identically
    - Confirm password reset flow still works identically
    - Confirm OAuth callback handling still works identically

- [x] 4. Checkpoint - Ensure Google OAuth tests pass
  - Verify bug condition test passes (OAuth flow initiates)
  - Verify preservation tests pass (email/password auth unchanged)
  - Test full OAuth flow: click button → redirect to Google → callback → dashboard
  - Test OAuth error handling displays toast on failure

---

## Bug 2: PDF Export Text Clipping

- [x] 5. Write bug condition exploration test for PDF text clipping
  - **Property 1: Bug Condition** - PDF Text Clipping at Page Boundaries
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate text clipping at page breaks
  - **Scoped PBT Approach**: Test concrete failing cases - multi-page resumes with dense content
  - Test implementation details from Bug Condition in design:
    - Create test resume with height > 1123px (2+ pages)
    - Add content that crosses the 1123px page boundary
    - Export to PDF using current `exportToPDF` function
    - Verify text IS clipped mid-sentence at page boundary (pixel-based splitting)
    - Test with InfographicPro, CreativeSidebar, and DesignCanvas templates
  - The test assertions should match the Expected Behavior Properties from design:
    - Assert text SHOULD NOT be clipped at page boundaries
    - Assert smart breaks SHOULD be used (entry → section → line → gap)
    - Assert complete sentences SHOULD appear at all page breaks
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: text clipped mid-word, bullet points split, section headers divided
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.4, 1.5, 1.6_

- [x] 6. Write preservation property tests for PDF export quality (BEFORE implementing fix)
  - **Property 2: Preservation** - PDF Quality Settings Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for PDF quality settings:
    - Test SCALE = 3 rendering for print quality
    - Test font loading via `warmFonts()` and `forceFontRender()`
    - Test sidebar template background color preservation
    - Test page 2+ runner headers with name and page numbers
    - Test PDF compression and image quality settings
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - For all PDF exports, verify SCALE = 3 rendering unchanged
    - For all PDF exports, verify font loading mechanisms unchanged
    - For all sidebar templates, verify background color handling unchanged
    - For all multi-page PDFs, verify runner headers unchanged
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.4, 3.5, 3.6, 3.7_

- [x] 7. Fix PDF export smart page breaks

  - [x] 7.1 Implement the fix in pdfExporter.js
    - In `src/utils/pdfExporter.js`:
      - Verify `findSmartBreaks` function exists and implements three-tier waterfall strategy
      - Expand search radii if needed:
        - TIER1_BEFORE: 160 → 220px, TIER1_AFTER: 48 → 60px
        - TIER2_BEFORE: 100 → 140px, TIER2_AFTER: 30 → 40px
        - TIER3_BEFORE: 60 → 80px, TIER3_AFTER: 15 → 20px
      - Enhance Tier 1 candidates: add `.resume-section-compact` to tier 1 selectors
      - Verify `findNearestGap()` function exists for fallback gap detection
      - Verify `PAGE_SAFETY_MARGIN = 36px` is applied to hard-cut fallback
      - Verify three-tier waterfall logic: entry → section → line → gap → hard cut
    - Test with InfographicPro, CreativeSidebar, and DesignCanvas templates
    - _Bug_Condition: isBugCondition_PDFClip(input) where input.resumeHeight > 1123 AND contentCrossesPageBoundary()_
    - _Expected_Behavior: Smart breaks used, no text clipping, complete sentences at page breaks_
    - _Preservation: SCALE = 3, font loading, sidebar colors, runner headers, compression unchanged_
    - _Requirements: 1.4, 1.5, 1.6, 2.5, 2.6, 2.7, 2.8, 3.4, 3.5, 3.6, 3.7_

  - [x] 7.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - PDF Smart Page Breaks
    - **IMPORTANT**: Re-run the SAME test from task 5 - do NOT write a new test
    - The test from task 5 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 5
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify no text clipping at page boundaries
    - Verify smart breaks are used (entry → section → line → gap)
    - Verify complete sentences at all page breaks
    - _Requirements: 2.5, 2.6, 2.7, 2.8_

  - [x] 7.3 Verify preservation tests still pass
    - **Property 2: Preservation** - PDF Quality Settings Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 6 - do NOT write new tests
    - Run preservation property tests from step 6
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm SCALE = 3 rendering unchanged
    - Confirm font loading mechanisms unchanged
    - Confirm sidebar background color handling unchanged
    - Confirm page 2+ runner headers unchanged

- [x] 8. Checkpoint - Ensure PDF export tests pass
  - Verify bug condition test passes (no text clipping)
  - Verify preservation tests pass (quality settings unchanged)
  - Test multi-page resume export with InfographicPro template
  - Test multi-page resume export with CreativeSidebar template
  - Test multi-page resume export with DesignCanvas template
  - Visual inspection: no text clipping, proper page breaks, runner headers on page 2+

---

## Bug 3: ATS Keyword False Positives

- [x] 9. Write bug condition exploration test for ATS keyword false positives
  - **Property 1: Bug Condition** - ATS Keyword Substring Matching
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate false positive keyword matches
  - **Scoped PBT Approach**: Test concrete failing cases - keywords matching as substrings
  - Test implementation details from Bug Condition in design:
    - Test keyword "react" matches "interactive" (false positive)
    - Test keyword "react" matches "overreact" (false positive)
    - Test keyword "react" matches "reaction" (false positive)
    - Test keyword "java" matches "javascript" (false positive)
    - Verify current implementation uses `.includes()` substring matching
    - Calculate ATS score and verify inflated keyword match percentage
  - The test assertions should match the Expected Behavior Properties from design:
    - Assert keyword matching SHOULD use word-boundary regex (`\breact\b`)
    - Assert "react" SHOULD NOT match "interactive", "overreact", "reaction"
    - Assert "java" SHOULD NOT match "javascript"
    - Assert keyword match percentages SHOULD be accurate (whole-word only)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: false positives inflate scores, substring matches reported
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.7, 1.8, 1.9_

- [x] 10. Write preservation property tests for ATS scoring components (BEFORE implementing fix)
  - **Property 2: Preservation** - ATS Scoring Logic Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-keyword scoring:
    - Test contact info scoring (2.5 points per valid field)
    - Test content completeness scoring (summary, experience, skills, education)
    - Test action verb detection and scoring
    - Test JD keyword extraction with stop-word filtering
    - Test quantifiable results detection (numbers, percentages, metrics)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - For all contact info evaluations, verify scoring unchanged
    - For all content completeness checks, verify scoring unchanged
    - For all action verb detections, verify scoring unchanged
    - For all JD keyword extractions, verify extraction logic unchanged
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.8, 3.9, 3.10, 3.11_

- [x] 11. Fix ATS keyword matching with word boundaries

  - [x] 11.1 Implement the fix in atsScorer.js
    - In `src/utils/atsScorer.js`:
      - Create new `keywordMatch` function:
        ```javascript
        function keywordMatch(text, keyword) {
          const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const regex = new RegExp(`\\b${escaped}\\b`, 'i')
          return regex.test(text)
        }
        ```
      - Update `scoreKeywords`: Replace `.includes()` checks with `keywordMatch()` calls
      - Update `getKeywordGaps`: Replace substring matching with word-boundary regex
      - Update `tailorResumeToJD`: Replace `.includes()` checks with `keywordMatch()` calls
      - Verify ACTION_VERBS filter uses word-boundary regex (should already be correct)
    - Test with keywords: "react", "java", "python", "node"
    - Test with text containing: "interactive", "javascript", "pythonic", "nodejs"
    - _Bug_Condition: isBugCondition_ATSKeyword(input) where substringMatchUsed() AND NOT wordBoundaryMatchUsed()_
    - _Expected_Behavior: Word-boundary regex used, no false positives, accurate match percentages_
    - _Preservation: Contact info, content, action verb, JD extraction, quantifiable results scoring unchanged_
    - _Requirements: 1.7, 1.8, 1.9, 2.9, 2.10, 2.11, 2.12, 3.8, 3.9, 3.10, 3.11_

  - [x] 11.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - ATS Word-Boundary Keyword Matching
    - **IMPORTANT**: Re-run the SAME test from task 9 - do NOT write a new test
    - The test from task 9 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 9
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify "react" does NOT match "interactive", "overreact", "reaction"
    - Verify "java" does NOT match "javascript"
    - Verify keyword match percentages are accurate (whole-word only)
    - Verify special regex characters are escaped correctly
    - _Requirements: 2.9, 2.10, 2.11, 2.12_

  - [x] 11.3 Verify preservation tests still pass
    - **Property 2: Preservation** - ATS Scoring Logic Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 10 - do NOT write new tests
    - Run preservation property tests from step 10
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm contact info scoring unchanged
    - Confirm content completeness scoring unchanged
    - Confirm action verb detection unchanged
    - Confirm JD keyword extraction unchanged

- [x] 12. Checkpoint - Ensure ATS keyword tests pass
  - Verify bug condition test passes (no false positives)
  - Verify preservation tests pass (scoring logic unchanged)
  - Test full ATS scoring flow with job description containing "react"
  - Test keyword gap analysis shows accurate match percentages
  - Test tailor-to-JD suggestions use word-boundary matching

---

## Bug 4: Schema Migration Missing

- [x] 13. Write bug condition exploration test for schema migration
  - **Property 1: Bug Condition** - Schema Migration Missing for v1/v2/v3
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate missing schema migrations
  - **Scoped PBT Approach**: Test concrete failing cases - v1/v2/v3 data loading
  - Test implementation details from Bug Condition in design:
    - Create test data with schema version 1 (missing github, twitter, photo)
    - Create test data with schema version 2 (missing customSections)
    - Create test data with schema version 3 (missing expectedCompensation, preferredWorkMode)
    - Load data using current `migrate` function
    - Verify app crashes or fails when accessing new v4 fields
    - Verify no migration handler exists for v1→v4, v2→v4, v3→v4
  - The test assertions should match the Expected Behavior Properties from design:
    - Assert v1 data SHOULD be migrated with github, twitter, photo fields
    - Assert v2 data SHOULD be migrated with customSections array
    - Assert v3 data SHOULD be migrated with expectedCompensation, preferredWorkMode
    - Assert all migrations SHOULD bring data to SCHEMA_VERSION = 4
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: crashes, undefined errors, missing fields, data loss
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.10, 1.11, 1.12_

- [x] 14. Write preservation property tests for schema v4 data loading (BEFORE implementing fix)
  - **Property 2: Preservation** - Schema v4 Data Loading Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for v4 data:
    - Test v4 data loads without migration transformations
    - Test new resumes initialize with DEFAULT_RESUME at SCHEMA_VERSION = 4
    - Test resume persistence to localStorage using `hwp-resume-store-v2` key
    - Test cloud sync normalizes `resumeData`/`data` field names
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - For all v4 data loads, verify no migration applied
    - For all new resume creations, verify DEFAULT_RESUME structure used
    - For all localStorage saves, verify persistence key unchanged
    - For all cloud syncs, verify normalization logic unchanged
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.12, 3.13, 3.14, 3.15_

- [x] 15. Fix schema migration for v1/v2/v3 to v4

  - [x] 15.1 Implement the fix in resumeStore.js
    - In `src/store/resumeStore.js`:
      - Enhance v1→v2 migration: add github, twitter, photo fields to personal object
      - Enhance v2→v3 migration: add customSections array to resumeData
      - Complete v3→v4 migration:
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
      - Verify `onRehydrateStorage` calls migrate() for old versions
      - Verify savedResumes data/resumeData field normalization
    - Test with v1, v2, v3 data structures
    - _Bug_Condition: isBugCondition_Migration(input) where input.version IN [1, 2, 3, undefined] AND NOT migrationHandlerExists()_
    - _Expected_Behavior: All v1/v2/v3 data migrated to v4 with all fields present, no data loss_
    - _Preservation: v4 data loading, new resume creation, localStorage persistence, cloud sync unchanged_
    - _Requirements: 1.10, 1.11, 1.12, 2.13, 2.14, 2.15, 2.16, 3.12, 3.13, 3.14, 3.15_

  - [x] 15.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Schema Migration v1/v2/v3 to v4
    - **IMPORTANT**: Re-run the SAME test from task 13 - do NOT write a new test
    - The test from task 13 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 13
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify v1 data migrated with github, twitter, photo fields
    - Verify v2 data migrated with customSections array
    - Verify v3 data migrated with expectedCompensation, preferredWorkMode
    - Verify all migrations bring data to SCHEMA_VERSION = 4
    - _Requirements: 2.13, 2.14, 2.15, 2.16_

  - [x] 15.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Schema v4 Data Loading Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 14 - do NOT write new tests
    - Run preservation property tests from step 14
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm v4 data loads without migration
    - Confirm new resumes use DEFAULT_RESUME structure
    - Confirm localStorage persistence unchanged
    - Confirm cloud sync normalization unchanged

- [x] 16. Checkpoint - Ensure schema migration tests pass
  - Verify bug condition test passes (v1/v2/v3 migrated to v4)
  - Verify preservation tests pass (v4 data loading unchanged)
  - Test app load with v1 localStorage data → successful migration → no crashes
  - Test app load with v2 localStorage data → successful migration → no crashes
  - Test app load with v3 localStorage data → successful migration → no crashes
  - Test cloud sync with mixed schema versions → normalization works correctly

---

## Final Integration Testing

- [x] 17. Run full integration test suite
  - Test all four bug fixes together in production-like environment
  - Verify no conflicts between fixes
  - Test user workflows: sign-in → build resume → export PDF → check ATS score
  - Test schema migration with real user data samples
  - Verify all preservation tests still pass across all bugs
  - Ensure no regressions in existing functionality
