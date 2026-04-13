# HR Saarthi Resume Builder — Master Upgrade Prompt
## For: resume.hrsaarthi.com | Stack: React 18 + Vite + Tailwind + Zustand + Supabase

---

> **Context for the LLM executing this prompt:**  
> This is a production React SPA (no Next.js, no SSR). State is managed via Zustand with `persist` middleware (localStorage + Supabase cloud sync). Styling is Tailwind CSS with custom CSS variables defined in `index.css`. AI calls route through a Supabase Edge Function (`enhance-bullet`). Payments via Razorpay. All templates are JSX components that receive `{ data, settings }` props and render an A4 page (794×1123px). The codebase is clean and well-commented — do not refactor working logic unless explicitly instructed.

---

## PHASE 1 — Critical Bug Fixes & UX Polish

### 1.1 — Google Sign-In (currently broken)
**File:** `pages/AllPages.jsx` → `LoginPage` component  
**File:** `store/authStore.js` → `loginWithGoogle` method  

**Problem:** The Google OAuth button shows `cursor-not-allowed` and has `title="Google sign-in coming soon"` — it's disabled. The `loginWithGoogle` method either doesn't exist or isn't wired to Supabase's `signInWithOAuth`.

**Fix:**
1. In `authStore.js`, implement `loginWithGoogle`:
```js
loginWithGoogle: async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  })
  if (error) throw error
}
```
2. In `LoginPage`, remove `disabled` prop and `title="Google sign-in coming soon"` from the Google button. Remove `cursor-not-allowed`. Add `onClick={handleGoogle}`.
3. Verify `AuthCallback.jsx` handles `supabase.auth.exchangeCodeForSession()` on mount.
4. In Supabase Dashboard → Authentication → Providers → Google: ensure Google OAuth is enabled with correct Client ID/Secret.

---

### 1.2 — Launch Offer Expiry Logic Is Fragile
**File:** `utils/entitlements.js`

**Problem:** `launchOfferActive` is hardcoded as `Date.now() - LAUNCH_OFFER_START < THIRTY_DAYS_MS`. After 30 days, all Pro features will silently break for legitimate free users who were using them under the launch offer — with no graceful degradation or message.

**Fix:**
1. Add a toast/banner notification when `launchOfferActive` transitions from `true` → `false` (check on app mount via `authStore`).
2. In `entitlements.js`, add an exported constant `LAUNCH_OFFER_END_DATE` for use in UI banners.
3. In `LandingPage.jsx` → `LaunchBanner`, show a countdown timer (days remaining) using this constant.
4. After offer expires, `isPro` should fall back to `state.plan === 'pro'` only — confirm this is correct in `getEntitlements`.

---

### 1.3 — PDF Export: Text Clipping at Page Break
**File:** `utils/pdfExporter.js`

**Problem:** `html2canvas` cuts text at pixel boundaries when content spans A4 pages. Long resumes clip mid-sentence.

**Fix (already partially planned — implement it):**
1. Before rendering, clone the resume DOM node into an off-screen container at exactly 794px width.
2. Use `html2canvas` with `scale: 2` for retina quality.
3. Implement DOM-aware multi-page splitting: after getting the full canvas, slice it into 1123px-height chunks (accounting for `scale`), then add each chunk as a new `jsPDF` page.
4. Add `padding-bottom: 40px` to the resume template wrapper to prevent footer clipping.
5. Test with `InfographicPro`, `CreativeSidebar`, and `DesignCanvas` templates specifically — these are the most likely to clip.

---

### 1.4 — ATS Scorer: Substring Keyword Matching Bug
**File:** `utils/atsScorer.js`

**Problem:** The keyword matching currently does string `.includes()` which causes false positives — e.g., "react" matches inside "interactive", "overreact", etc.

**Fix:**
```js
// Replace every keyword match check with word-boundary regex:
function keywordMatch(text, keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`\\b${escaped}\\b`, 'i')
  return regex.test(text)
}
```
Apply this to: `INDIA_JD_KEYWORDS` scanning, JD keyword extraction, `getKeywordGaps()`, and `tailorResumeToJD()`.

---

### 1.5 — ResumeStore: Schema Migration Safety
**File:** `store/resumeStore.js`

**Problem:** `SCHEMA_VERSION = 4` but there is no migration handler for users on schema v1/v2/v3. Old localStorage data will silently fail or cause render errors.

**Fix:**
```js
// In the persist middleware's `onRehydrateStorage` or `migrate` option:
migrate: (persistedState, version) => {
  if (version < 2) {
    // Add `github`, `twitter` fields to personal
    persistedState.resumeData.personal.github = persistedState.resumeData.personal.github || ''
    persistedState.resumeData.personal.twitter = persistedState.resumeData.personal.twitter || ''
  }
  if (version < 3) {
    // Add `customSections` array
    persistedState.resumeData.customSections = persistedState.resumeData.customSections || []
  }
  if (version < 4) {
    // Add compensation and work preference fields
    persistedState.resumeData.personal.expectedCompensation = 
      persistedState.resumeData.personal.expectedCompensation || { currency: 'INR', min: '', max: '', period: 'annual' }
    persistedState.resumeData.personal.preferredWorkMode = 
      persistedState.resumeData.personal.preferredWorkMode || ''
  }
  return persistedState
},
version: SCHEMA_VERSION,
```

---

## PHASE 2 — Feature Completions

### 2.1 — Job Tracker (Dashboard) — Make It Functional
**File:** `pages/DashboardPage.jsx`

**Current state:** Job application tracker UI exists but `fetchJobApplications`, `createJobApplication`, `updateJobApplication` are imported from `services/supabase.js`. Verify these functions are fully implemented in supabase.js (they may be stubs).

**Required Supabase table:** `job_applications` with columns:
```sql
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id) on delete cascade,
company text not null,
role text not null,
status text default 'applied', -- applied | screening | interview | offer | rejected
applied_date date,
notes text,
resume_id uuid,
job_url text,
created_at timestamptz default now()
```

**Fix:**
1. Verify / create this table in Supabase with RLS: `user_id = auth.uid()`.
2. In `services/supabase.js`, implement all three functions if stubbed.
3. In `DashboardPage.jsx`, add a Kanban-style board (4 columns: Applied / Screening / Interview / Offer+Rejected) using the existing TiltCard component for visual consistency.
4. Add drag-to-reorder between columns using `onDragStart`/`onDrop` (no external DnD library).

---

### 2.2 — Cover Letter: Save & Load History
**File:** `pages/CoverLetterPage.jsx`  
**File:** `services/supabase.js` → `fetchCoverLetters`, `saveCoverLetter`

**Current state:** UI for saved letters dropdown exists (`savedLetters` state, `selectedLetterId`), but may not be wired up correctly.

**Supabase table needed:**
```sql
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id) on delete cascade,
resume_id uuid,
title text,
company text,
job_title text,
content text,
tone text,
template_id text,
created_at timestamptz default now()
```

**Fix:**
1. On page mount, call `fetchCoverLetters(user.id)` and populate `savedLetters`.
2. `saveCoverLetter` should upsert by `id`.
3. On select from dropdown, populate all fields (jobTitle, company, tone, letter content).
4. Add a delete button (trash icon) per saved letter with confirmation.
5. Show a "Saved ✓" indicator for 2 seconds after save.

---

### 2.3 — AI Coach Sidebar: JD-Paste Persistence
**File:** `components/AICoachSidebar.jsx`  
**Store:** `store/resumeStore.js` → `jobDescription` field

**Current state:** JD text is in Zustand store but clears on page refresh (not persisted separately).

**Fix:**
1. Ensure `jobDescription` is included in the `persist` middleware's `partialize` or is not excluded.
2. Add a character count and a "Clear JD" button to the textarea.
3. Add a `Zap` icon button "Auto-match to JD" that calls `tailorResumeToJD()` from `atsScorer.js` and shows a diff of suggested changes in a modal before applying.

---

### 2.4 — Template: PrachiSignature — Make It Production-Ready
**File:** `templates/templates/PrachiSignature.jsx`

This is the brand's signature template. Ensure:
1. Photo rendering: if `personal.photo` (base64) is present, show it in a circle/hexagon frame in the header. If absent, show initials fallback.
2. Skills section: render as visual pill tags, not plain text.
3. Accent color: fully driven by `settings.accentColor` — no hardcoded hex values in the template.
4. Test with `fontSize: 'small' | 'medium' | 'large'` settings — all text must scale proportionally.
5. Add `page-break-inside: avoid` to experience entries via inline style to prevent PDF splits mid-entry.

---

### 2.5 — DOCX Export: Fix List Formatting
**File:** `utils/docxExporter.js`

**Problem:** Bullet points in DOCX export render as plain text paragraphs, not actual Word list items.

**Fix using `docx` npm package:**
1. Experience bullets → `new ListItem({ text: bullet, numbering: { reference: "bullets", level: 0 } })` style.
2. Section headings → `new Paragraph({ text, heading: HeadingLevel.HEADING_2 })`.
3. Contact line → a single `TableRow` with 4 `TableCell` entries (email | phone | linkedin | location) with `NoBorder` borders.
4. Ensure the exported `.docx` passes ATS scanners — no text boxes, no tables for main content, no images (strip photo from DOCX).

---

## PHASE 3 — New High-Value Features

### 3.1 — LinkedIn Profile Import
**Files:** New `services/linkedinImporter.js` + UI in `components/UploadResumeModal.jsx`

**Implementation:**
1. Add a new tab in `UploadResumeModal` called "LinkedIn PDF".
2. User exports their LinkedIn profile as PDF and uploads it.
3. Send to Supabase Edge Function `resume-parser` (or same `enhance-bullet` with action `parse_linkedin`):
   - Extract: name, headline/jobTitle, location, experience (company, title, dates, description), education, skills, certifications
   - Return as structured JSON matching `DEFAULT_RESUME` shape
4. Pre-fill the resume store with parsed data.
5. Show a diff/preview before applying: "We found X fields. Review before importing."
6. Pro gate: this feature requires Pro.

**Prompt for Edge Function (include this in the Edge Function code):**
```
You are an expert resume parser. Extract data from this LinkedIn PDF export and return ONLY a JSON object with this exact shape:
{
  "personal": { "fullName": "", "jobTitle": "", "location": "", "email": "", "phone": "", "linkedin": "", "summary": "" },
  "experience": [{ "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "current": false, "bullets": [] }],
  "education": [{ "school": "", "degree": "", "startDate": "", "endDate": "", "location": "", "grade": "" }],
  "skills": [{ "category": "Skills", "items": "" }],
  "certifications": [{ "name": "", "issuer": "", "date": "" }],
  "projects": [],
  "languages": [],
  "hobbies": []
}
Return ONLY the JSON. No preamble. No markdown fences.
```

---

### 3.2 — Resume Score History Chart
**File:** `pages/DashboardPage.jsx`

**Feature:** Per resume, track ATS score over time as the user edits.

**Implementation:**
1. In `resumeStore.js`, add `scoreHistory: []` to `DEFAULT_SETTINGS` per resume. Max 20 entries.
2. Every time `atsScore` updates (debounced 2s), append `{ score: total, timestamp: Date.now() }` to the active resume's `scoreHistory`.
3. In `DashboardPage`, on the resume card expanded view, render a mini sparkline (SVG, no library) showing score trend.
4. Color-code: upward trend = green, downward = amber.

**Sparkline SVG implementation:**
```jsx
function Sparkline({ data, width = 80, height = 24, color = '#0E9F6E' }) {
  if (!data || data.length < 2) return null
  const scores = data.map(d => d.score)
  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const range = max - min || 1
  const pts = scores.map((s, i) => 
    `${(i / (scores.length - 1)) * width},${height - ((s - min) / range) * height}`
  ).join(' ')
  return (
    <svg width={width} height={height} style={{ overflow: 'visible' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
```

---

### 3.3 — AI Bullet Rewriter: "Quantify This" Mode
**File:** `components/ResumeForm/ExperienceForm.jsx`  
**Service:** `services/aiEnhancer.js`

**Feature:** A new AI mode that specifically adds numbers/metrics to vague bullets.

**UI change:** In the bullet enhancement dropdown (wherever AI variations are shown), add a 4th option: `⚡ Quantify This`.

**Edge Function payload:**
```js
{ 
  type: 'quantify_bullet', 
  bullet: bulletText, 
  jobTitle: currentJobTitle, 
  company: currentCompany 
}
```

**Edge Function system prompt (add this action handler):**
```
Given this resume bullet point, rewrite it to include specific quantifiable metrics. 
If numbers aren't available, use realistic placeholders in [brackets] that the user should fill in.
Example: "Led team meetings" → "Led weekly stand-ups for a team of [8-12] engineers, reducing blocker resolution time by [~30%]"
Return ONLY the rewritten bullet. No explanation.
```

---

### 3.4 — Referral System
**Files:** New `pages/ReferralPage.jsx` + `services/supabase.js` additions

**Feature:** Refer a friend → both get 15 extra Pro days.

**DB tables:**
```sql
-- referral_codes
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id),
code text unique not null, -- e.g. "HARISH2026"
uses_count int default 0,
created_at timestamptz default now()

-- referral_uses  
id uuid primary key default gen_random_uuid(),
referrer_id uuid references auth.users(id),
referee_id uuid references auth.users(id),
created_at timestamptz default now()
```

**Flow:**
1. On signup, auto-generate a referral code (`profiles` table: add `referral_code` column).
2. Referral link: `resume.hrsaarthi.com/signup?ref=CODE`
3. On signup with `?ref=CODE`: record referral, extend both users' Pro by 15 days (add `pro_expires_at` column to `profiles`).
4. `getEntitlements` should check `pro_expires_at > now()` in addition to `plan === 'pro'`.
5. Referral dashboard card in `DashboardPage`: "Share your link → Earn free Pro days".

---

### 3.5 — Mobile Builder UX Overhaul
**File:** `pages/BuilderPage.jsx`

**Problem:** The builder is a 3-column layout (nav sidebar | form | preview). On mobile (<768px), this becomes unusable — preview is hidden but the form UX is poor.

**Fix:**
1. On mobile, hide the preview pane entirely (`hidden md:flex`).
2. Add a floating bottom bar on mobile with 3 tabs: `Edit | Preview | Score`.
3. "Preview" tab shows the resume template at `scale(0.45)` centered in viewport with pinch-zoom support (`touch-action: pinch-zoom`).
4. "Score" tab shows a condensed version of `AICoachSidebar` (just score circle + top 3 fixes).
5. The existing `useResponsiveScale` hook already handles scale — use it for the mobile preview tab.
6. Add haptic feedback on form saves via `navigator.vibrate(50)` (Android only, no-op elsewhere).

---

## PHASE 4 — SEO & Performance

### 4.1 — Meta Tags & OG Image
**File:** `index.html` (Vite root)

Add the following inside `<head>`:
```html
<title>HR Saarthi Resume Builder — Free ATS Resume Builder for India</title>
<meta name="description" content="Build ATS-optimised resumes in minutes. 15+ professional templates, AI-powered bullet rewriting, instant ATS score. Free for Indian job seekers." />
<meta name="keywords" content="resume builder india, ATS resume, free resume builder, naukri resume, linkedin resume builder, HR Saarthi" />
<meta property="og:title" content="HR Saarthi — Build Resumes That Get Interviews" />
<meta property="og:description" content="Free ATS resume builder with 15+ templates. Used by 1000+ Indian professionals." />
<meta property="og:image" content="https://resume.hrsaarthi.com/og-image.png" />
<meta property="og:url" content="https://resume.hrsaarthi.com" />
<meta name="twitter:card" content="summary_large_image" />
<link rel="canonical" href="https://resume.hrsaarthi.com" />
```

Also add `<meta name="robots" content="index, follow" />` for the landing/templates/upgrade pages, and `<meta name="robots" content="noindex" />` for `/builder`, `/dashboard`, `/admin/*`.

---

### 4.2 — Lazy Load Heavy Pages
**File:** `App.jsx`

Wrap all page imports (except `LandingPage`) in `React.lazy()`:
```js
const BuilderPage = lazy(() => import('./pages/BuilderPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const InterviewPrepPage = lazy(() => import('./pages/InterviewPrepPage'))
const CoverLetterPage = lazy(() => import('./pages/CoverLetterPage'))
const UpgradePage = lazy(() => import('./pages/UpgradePage'))
```
Wrap routes in `<Suspense fallback={<PageLoader />}>`. `PageLoader` already exists in `components/PageLoader.jsx`.

---

### 4.3 — Image Optimization
**File:** `utils/imageCompressor.js`

**Current state:** Already exists. Ensure it's called in `PersonalInfoForm.jsx` on photo upload.

**Fix:**
1. In `PersonalInfoForm.jsx`, find the photo upload handler and verify `compressImage()` is called before storing to Zustand.
2. Set max dimensions: 200×200px, max file size: 100KB, output: JPEG quality 0.85.
3. Show a loading spinner during compression (it's async).

---

## PHASE 5 — Admin Panel Improvements

### 5.1 — Admin: Real Revenue Dashboard
**File:** `pages/admin/AdminOverview.jsx`

**Current state:** Shows stats cards. Likely uses mock/static data.

**Fix:**
1. Add Supabase queries:
   - Total users: `select count(*) from profiles`
   - Pro users: `select count(*) from profiles where plan = 'pro'`
   - Revenue MTD: `select sum(amount) from payments where created_at > date_trunc('month', now())`
   - Resumes created today: `select count(*) from resumes where created_at > now() - interval '1 day'`
2. Display as animated count-up cards (reuse `useCountUp` hook from `DashboardPage.jsx`).
3. Add a simple 30-day line chart for new signups using inline SVG (same sparkline pattern from 3.2).

---

### 5.2 — Admin Guard: Hardcode Check + Supabase Role
**File:** `pages/admin/AdminGuard.jsx`

**Fix:**
1. Check both: `user.email === 'your-admin@email.com'` AND `profile.role === 'admin'` (add `role` column to `profiles` table).
2. Show a proper 403 page (not just a redirect) with a message "Access restricted to administrators."

---

## IMPLEMENTATION ORDER (Recommended for any LLM)

```
Phase 1 first — these are bugs that affect all users right now.
Then Phase 2.1 (Job Tracker) and 2.2 (Cover Letter save) — these are visible broken features.
Then Phase 4.2 (Lazy loading) — quick performance win, no design changes.
Then Phase 3.5 (Mobile UX) — large user segment on mobile.
Then Phase 3.1 (LinkedIn Import) — high-value Pro feature.
Then remaining phases in order.
```

---

## THINGS TO NEVER CHANGE

1. The `DEFAULT_RESUME` shape in `resumeStore.js` — adding fields is OK, removing/renaming will break existing user data.
2. The `{ data, settings }` props interface for all template components.
3. The `SCHEMA_VERSION` constant — always increment it when adding new fields to `DEFAULT_RESUME`.
4. The `getEntitlements()` function signature — UI components throughout the app depend on its exact return shape.
5. The Supabase Edge Function URL path (`/functions/v1/enhance-bullet`) — this is live.
6. Brand colors: `#5B4BF5` (primary purple), `#D4A843` (gold), `#0E9F6E` (emerald green).

---

## TESTING CHECKLIST (After Each Phase)

- [ ] Guest user can build resume without account
- [ ] Google OAuth sign-in completes and redirects to `/dashboard`
- [ ] PDF export: test with 1-page and 2-page resume on `ATSClassic` and `CreativeSidebar`
- [ ] DOCX export: open in Microsoft Word and Google Docs both
- [ ] ATS score updates within 1s of typing in any form field
- [ ] Pro gate: free user sees blur + upgrade CTA on Pro features
- [ ] Admin panel: only accessible to admin email
- [ ] Mobile (375px): builder tabs work, preview renders correctly
- [ ] localStorage full: `QuotaExceededError` shows toast, doesn't crash
- [ ] Supabase offline: app doesn't crash, shows error toast

---

*Generated via full src codebase audit — resume.hrsaarthi.com | April 2026*
