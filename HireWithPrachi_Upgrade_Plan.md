# 🚀 HireWithPrachi Resume Builder — Complete Upgrade & Implementation Plan
### Competitive Intelligence + Phase-Wise Roadmap + LLM Implementation Instructions

> **Document Version:** 1.0 — April 2026  
> **Platform:** resume.hirewithprachi.com  
> **Stack:** React 18 · Vite · Tailwind CSS · Zustand · Supabase · Razorpay  
> **Prepared for:** Development Team / AI Implementation Agent

---

## ⚠️ CRITICAL INSTRUCTIONS FOR ANY AI/LLM IMPLEMENTING THIS PLAN

These instructions MUST be followed by any AI agent, developer, or LLM that picks up this document to implement changes:

1. **DO NOT skip phases or reorder them.** Each phase builds on the previous one. Starting Phase 2 without completing Phase 1 will break dependencies.
2. **DO NOT change the tech stack** (React, Vite, Tailwind, Zustand, Supabase, Razorpay) unless explicitly listed in a phase as "migration required."
3. **DO NOT modify existing store schemas** (`resumeStore.js`, `authStore.js`) without running the migration function first. Always increment `SCHEMA_VERSION`.
4. **DO NOT expose API keys** (OpenAI, Anthropic, Razorpay secret) in frontend code. All AI calls MUST go through Supabase Edge Functions.
5. **DO NOT rename existing routes** (`/builder`, `/dashboard`, `/ats-score`) — they are user-bookmarked and SEO-indexed.
6. **ALWAYS write new components as `.jsx` files** in the `src/components/` directory before importing into pages.
7. **Each task in this document must be marked `[DONE]`** in a progress tracker before the next task begins.
8. **If a task is ambiguous, refer back to the "Exact Implementation Spec"** section under that task — do not improvise structure.

---

## 📊 SECTION 1: CURRENT STATE AUDIT

### What You Have (Strengths)
| Feature | Status | Quality |
|---|---|---|
| React + Vite architecture | ✅ Live | Excellent — lazy loading, code splitting done right |
| Zustand state management | ✅ Live | Good — schema versioning, migration logic present |
| ATS Scoring Engine | ✅ Live | Good — India-specific keywords, 7 dimensions |
| AI Resume Parser (PDF/DOCX) | ✅ Live | Good — Edge Function proxy, timeout handling |
| AI Bullet Enhancer | ✅ Live | Good — 3 variations (metric/leadership/action) |
| 10+ Resume Templates | ✅ Live | Good — lazy-loaded, error-boundary protected |
| Supabase Auth + Cloud Save | ✅ Live | Good — RLS policies, cloud-local merge |
| Razorpay Payment Integration | ✅ Live | Present — needs subscription management |
| PDF Export | ✅ Live | Present — html2canvas based |
| DOCX Export | ✅ Live | Present |
| Public Resume Share Links | ✅ Live | Present |
| Section Reorder UI | ✅ Live | Present |
| Completeness Tracker | ✅ Live | Good |
| Keyboard Shortcuts | ✅ Live | Good |
| Responsive Auto-zoom | ✅ Live | Good |

### Critical Gaps (Weaknesses vs. Competitors)
| Missing Feature | Competitor Who Has It | Priority |
|---|---|---|
| AI Cover Letter Generator | Kickresume, Zety, ResumeGyani, Naukri Pro | 🔴 CRITICAL |
| AI Interview Prep / Mock Questions | Kickresume, Naukri Pro | 🔴 CRITICAL |
| Job Description Auto-Tailoring (one-click) | Teal, Rezi, PitchMeAI | 🔴 CRITICAL |
| LinkedIn Profile Import | Kickresume, Resume.io | 🔴 CRITICAL |
| Multiple Resume Versions for same job | Teal, Zety | 🟠 HIGH |
| Real-time keyword match % as you type | Rezi, Jobscan | 🟠 HIGH |
| Photo upload in resume | Novoresume, Kickresume | 🟠 HIGH |
| Pre-written bullet examples per role | Zety, Resume.io | 🟠 HIGH |
| Resume analytics (views, downloads) | Enhancv | 🟡 MEDIUM |
| Chrome Extension for job boards | Teal, PitchMeAI, Kickresume | 🟡 MEDIUM |
| Naukri/LinkedIn apply integration | Naukri Pro | 🟡 MEDIUM |
| AI Summary rewrite variations | Zety, Enhancv | 🟡 MEDIUM |
| Mobile-first builder experience | All competitors | 🟡 MEDIUM |
| Payment — subscription model (not one-time) | All competitors | 🟡 MEDIUM |
| Watermark on free PDF | Needs implementing | 🟡 MEDIUM |
| Email notifications (save, share) | Resume.io | 🟢 LOW |
| Dark mode | Enhancv | 🟢 LOW |

---

## 📈 SECTION 2: COMPETITOR ANALYSIS SUMMARY

### Global Leaders (Benchmark Targets)
| Competitor | Key Differentiator | Pricing (2026) | What to Steal |
|---|---|---|---|
| **Kickresume** | Best AI writer quality, Chrome extension, Job interview prep, Career Map | $9/week or ~$19/mo | AI content generation from scratch, interview prep feature |
| **Resume.io** | Fastest UX (20 min), Recruiter-AI, 55K+ reviews, step-by-step | ~$2.95–$14.95/mo | Recruiter-AI keyword extraction from JD, guided wizard flow |
| **Teal** | Job tracker integration, unlimited free, Chrome extension, ATS+keyword | Free tier + paid | Job tracking board, per-application resume tailoring |
| **Zety** | Guided wizard, pre-written phrases, 15+ templates, auto-suggestions | ~$2.70 trial → $23/mo | Pre-written content suggestions per section, guided step-by-step |
| **Rezi** | Real-time ATS analysis, inline AI sentence completion | ~$29/mo | Real-time keyword density score as you type |
| **Enhancv** | Creative professionals, storytelling approach, executive focus | $19/mo | Career story sections, visual timeline, executive templates |
| **Novoresume** | Design-forward, 74 color themes, 12 fonts, visual templates | Freemium | Advanced customization, design-heavy templates |

### India-Specific Competitors
| Competitor | Key Differentiator | Threat Level |
|---|---|---|
| **Naukri Pro AI Resume Maker** | Naukri profile import, ATS formats, massive user base (millions), ₹399/3mo | 🔴 HIGH |
| **ResumeGyani** | India's free tier, 50+ templates, AI suggestions, cover letter, ATS checker | 🟠 MEDIUM |
| **Resumeera.xyz** | Just launched, 2-min resume, cover letter generator, ATS dashboard | 🟠 MEDIUM |
| **Resumod.co** | AI content suggestions, India-focused, JD-based scoring | 🟡 LOW-MEDIUM |

### Your Competitive Advantage to Build On
- **Brand:** "HireWithPrachi" — personal, trusted, India-specific coaching brand
- **Pricing:** ₹299/mo or ₹1,999/yr is competitive vs Naukri Pro's ₹1,999/3mo
- **AI Quality:** Using OpenAI via secure Edge Function (better than Naukri's basic AI)
- **India JD Keywords:** Already built into ATS scorer
- **Coach Brand Integration:** Opportunity for Prachi's expertise as content/video tie-ins

---

## 🗺️ SECTION 3: PHASE-WISE UPGRADE ROADMAP

---

### ═══════════════════════════════════════════
### PHASE 1: MONETIZATION & RETENTION FIXES
### Timeline: Week 1–2 | Priority: CRITICAL
### ═══════════════════════════════════════════

**Goal:** Fix the leaks in your current funnel. Users are leaving because of missing must-have features and broken free-tier incentives.

---

#### TASK 1.1 — Add Watermark on Free PDF Export
**Why:** You currently give clean PDFs for free. This is your primary conversion mechanism — competitors all watermark free downloads.

**File to modify:** `src/utils/pdfExporter.js`

**Exact Implementation Spec:**
```javascript
// In pdfExporter.js, after generating the PDF canvas, add this watermark layer:
// Check if user is free tier BEFORE calling html2canvas
// If plan !== 'pro', overlay a diagonal watermark text on the PDF

async function addWatermark(pdf, pageCount) {
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.setTextColor(200, 200, 200)  // Light gray
    pdf.setFontSize(38)
    pdf.setFont('helvetica', 'bold')
    pdf.saveGraphicsState()
    // Rotate 45 degrees, center of A4 page
    pdf.text('resume.hirewithprachi.com', 100, 160, { 
      angle: 45, 
      align: 'center',
      opacity: 0.15 
    })
    pdf.restoreGraphicsState()
  }
}
```

**Import in `ExportMenu.jsx`:** Pass `isPro` flag to `exportToPDF()`. Add a "Remove watermark → Upgrade" tooltip on the download button for free users.

---

#### TASK 1.2 — Implement Razorpay Subscription (Monthly/Annual)
**Why:** One-time payment doesn't build recurring revenue. Competitors use subscriptions.

**File to modify:** `src/pages/UpgradePage.jsx`, `src/services/supabase.js`

**Exact Implementation Spec:**

Step 1 — Add two price options in UpgradePage:
```javascript
const PLANS = [
  { 
    id: 'monthly', 
    label: 'Monthly', 
    price: 299, 
    period: '/month',
    razorpayPlanId: 'plan_XXXXX',  // Create in Razorpay dashboard
    badge: null 
  },
  { 
    id: 'annual', 
    label: 'Annual', 
    price: 1999, 
    period: '/year',
    razorpayPlanId: 'plan_YYYYY',  // Create in Razorpay dashboard
    badge: 'Save 44%',  // (299*12=3588 vs 1999) 
    popular: true 
  },
]
```

Step 2 — Switch from `orders` API to `subscriptions` API in Razorpay:
```javascript
// Instead of creating an order, create a subscription:
const response = await fetch('/api/create-subscription', {
  method: 'POST',
  body: JSON.stringify({ plan_id: selectedPlan.razorpayPlanId, user_id: user.id })
})
```

Step 3 — Add Supabase Edge Function `create-subscription` that calls Razorpay subscriptions API with your secret key (NEVER in frontend).

Step 4 — Add webhook handler Edge Function to receive `subscription.activated`, `subscription.charged`, `subscription.cancelled` events from Razorpay and update `users.plan` in Supabase accordingly.

Step 5 — In `authStore.js`, add `planExpiry` field and check it on init.

---

#### TASK 1.3 — Free Tier Resume Limit (1 saved resume)
**Why:** Currently unlimited saving is possible on free tier. This reduces upgrade incentive.

**File to modify:** `src/store/resumeStore.js`, `src/components/ResumeSelector.jsx`

**Exact Implementation Spec:**
```javascript
// In saveResume() in resumeStore.js:
saveResume: async (title) => {
  const { plan } = useAuthStore.getState()
  const state = get()
  
  // Free tier: max 1 resume
  if (plan !== 'pro') {
    const isExistingResume = state.savedResumes.some(r => r.id === state.activeResumeId)
    if (!isExistingResume && state.savedResumes.length >= 1) {
      toast.error('Free plan: 1 resume max. Upgrade to Pro for unlimited resumes!')
      return null
    }
  }
  // ... rest of existing save logic
}
```

In `ResumeSelector.jsx`: Show a "Pro" badge on the "+ New Resume" button with a tooltip for free users when they already have 1 saved.

---

### ═══════════════════════════════════════════
### PHASE 2: AI COVER LETTER GENERATOR
### Timeline: Week 3–4 | Priority: CRITICAL
### ═══════════════════════════════════════════

**Goal:** This is the #1 most-requested feature in the India job market. Every competitor has it. You must ship this.

---

#### TASK 2.1 — Create Supabase Edge Function: `generate-cover-letter`

**File to create:** `supabase/functions/generate-cover-letter/index.ts`

**Exact Prompt to use in Edge Function:**
```typescript
const systemPrompt = `You are an expert career coach specializing in the Indian job market. 
Generate professional cover letters for Indian job seekers applying to companies in India 
(Infosys, TCS, Wipro, startups, MNCs, etc). 

Rules:
- Length: 250-320 words exactly
- Tone: Professional but warm, confident but not arrogant  
- Structure: Opening hook → Why this company → Why you're the right fit (2-3 achievements) → Call to action
- Use Indian conventions: reference city-based roles, Indian degree names (B.Tech, MBA, etc.)
- Include specific numbers/metrics from the resume when available
- Output ONLY the letter body text, no subject line, no headers
- Do NOT start with "I am writing to..." — use a compelling hook instead`

const userPrompt = `Generate a cover letter for:
Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription}

Candidate Profile:
Name: ${name}
Current Role: ${currentRole}
Years of Experience: ${yearsExp}
Top Skills: ${topSkills}
Key Achievement 1: ${achievement1}
Key Achievement 2: ${achievement2}
Education: ${education}
Location: ${location}`
```

**Response format:** `{ ok: true, data: { letter: string, wordCount: number } }`

---

#### TASK 2.2 — Create CoverLetterPage component

**File to create:** `src/pages/CoverLetterPage.jsx`

**Route to add in `App.jsx`:** `/cover-letter` (public for free users to try, download gated to Pro)

**UI Layout spec:**
- **Left panel (420px):** Form with Job Title, Company Name, paste Job Description textarea, tone selector (Formal/Warm/Assertive), auto-populated from current resume data
- **Right panel:** Live preview of cover letter with same template styling as resume
- **Bottom bar:** "Generate with AI" button, word count, "Copy Text" button, "Download PDF" (Pro gate)

**Integration with BuilderPage:** Add a "Generate Cover Letter" button in the BuilderPage top toolbar that opens `/cover-letter?from=builder` with resume data pre-loaded.

---

#### TASK 2.3 — Add Cover Letter Templates

**File to create:** `src/templates/cover-letter/CLClassic.jsx`, `src/templates/cover-letter/CLModern.jsx`

Match the styling of the main resume templates. Cover letter template should mirror the resume template in terms of header, fonts, and accent color.

---

#### TASK 2.4 — Add to Navigation

**File to modify:** `src/components/Navbar.jsx`

Add "Cover Letter" as a nav item between "Templates" and "ATS Score". Mark it with a "New" badge for 30 days after launch.

---

### ═══════════════════════════════════════════
### PHASE 3: AI INTERVIEW PREP MODULE
### Timeline: Week 5–6 | Priority: HIGH
### ═══════════════════════════════════════════

**Goal:** Kickresume and Naukri Pro both offer interview prep. This increases session time and justifies Pro pricing.

---

#### TASK 3.1 — Create Supabase Edge Function: `generate-interview-questions`

**File to create:** `supabase/functions/generate-interview-questions/index.ts`

**Exact Prompt:**
```typescript
const systemPrompt = `You are a senior technical interviewer and HR professional with 15+ years 
of experience hiring for Indian companies (TCS, Infosys, startups, MNCs, Big 4). 

Generate interview questions and model answers based on the candidate's resume. 
Return ONLY valid JSON. No markdown. No explanation.

JSON Schema:
{
  "technical": [
    { "question": string, "difficulty": "easy|medium|hard", "modelAnswer": string, "tip": string }
  ],
  "behavioral": [
    { "question": string, "framework": "STAR", "modelAnswer": string, "tip": string }
  ],
  "company_fit": [
    { "question": string, "modelAnswer": string, "tip": string }
  ],
  "salary_negotiation": [
    { "question": string, "modelAnswer": string }
  ]
}`
```

**Response:** Return 3 questions per category = 12 total questions.

---

#### TASK 3.2 — Create InterviewPrepPage

**File to create:** `src/pages/InterviewPrepPage.jsx`

**Route:** `/interview-prep` (Pro gated)

**UI Layout spec:**
- **Header:** Job Title input + Company input + "Generate Questions" button
- **Tab bar:** Technical | Behavioral | Company Fit | Salary Negotiation
- **Question cards:** Each card shows: Question text → Expandable Model Answer → "Your Answer" textarea → AI Feedback button → Difficulty badge
- **Progress tracker:** X of 12 questions practiced
- **"Practice Mode":** Hides model answers until user clicks "Reveal Answer"

**Gate:** Entire page is Pro-only. Free users see a preview with 2 blurred questions and "Upgrade to Practice" CTA.

---

### ═══════════════════════════════════════════
### PHASE 4: ONE-CLICK JOB TAILORING ENGINE
### Timeline: Week 7–8 | Priority: HIGH
### ═══════════════════════════════════════════

**Goal:** Teal and Rezi's biggest advantage is per-job tailoring. Users should be able to paste a JD and get a tailored resume version in one click.

---

#### TASK 4.1 — Upgrade ATS Scorer to Real-Time Keyword Mode

**File to modify:** `src/utils/atsScorer.js`

**Enhancement:** Add a `getKeywordGaps(resumeText, jdText)` function that returns:
```javascript
{
  missing: ['kubernetes', 'terraform', 'agile'],  // keywords in JD not in resume
  present: ['react', 'nodejs', 'python'],           // keywords matched
  matchPercent: 67,                                  // percentage match
  topMissing: ['kubernetes', 'terraform'],          // top 3 to add
}
```

This should update in the ATS tab in real-time as the user types in the Job Description textarea (already present in BuilderPage). Display a horizontal keyword match bar with color-coded chips for present/missing keywords.

---

#### TASK 4.2 — Create Supabase Edge Function: `tailor-resume`

**File to create:** `supabase/functions/tailor-resume/index.ts`

**Exact Prompt:**
```typescript
const systemPrompt = `You are an expert ATS optimization specialist for the Indian job market.
Your task: rewrite specific sections of a resume to better match a job description.

Rules:
- ONLY rewrite bullet points and summary — do NOT change job titles, companies, dates, or facts
- INSERT missing keywords naturally — do not keyword stuff
- Keep the Indian professional tone
- Return ONLY valid JSON matching the exact schema provided
- Preserve all existing achievements but rephrase using JD language`

const userPrompt = `
Job Description: ${jd}

Current Resume Summary: ${summary}
Current Experience Bullets: ${JSON.stringify(bullets)}

Return JSON:
{
  "summary": "rewritten summary",
  "bullets": [
    { "id": "experience_id", "bullets": ["bullet1", "bullet2"] }
  ],
  "addedKeywords": ["keyword1", "keyword2"],
  "tailoringScore": 85
}`
```

---

#### TASK 4.3 — "Tailor for This Job" Button in BuilderPage

**File to modify:** `src/pages/BuilderPage.jsx`

**Where to add:** In the ATS tab, below the Job Description textarea, add a button:
```jsx
<button 
  onClick={handleTailorResume}
  className="w-full py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-black text-sm"
  disabled={!jobDescription || isTailoring}
>
  <Wand2 size={14} />
  {isTailoring ? 'Tailoring...' : '✨ Tailor Resume for This Job'}
</button>
```

**Behavior:** 
1. Calls `tailor-resume` Edge Function
2. Shows a diff view: original bullets in red strikethrough, new bullets in green
3. User can "Accept All Changes", "Reject All", or accept/reject per bullet
4. Auto-creates a duplicate resume named "Resume - [Company Name]" with tailored content
5. Original resume is NEVER modified

**Pro gate:** This feature is Pro-only. Show a locked version with a preview for free users.

---

### ═══════════════════════════════════════════
### PHASE 5: PHOTO UPLOAD + PROFILE ENHANCEMENTS
### Timeline: Week 9–10 | Priority: HIGH
### ═══════════════════════════════════════════

**Goal:** Most global templates support photos (Novoresume, Kickresume). Indian market increasingly expects photos on resumes for non-tech roles.

---

#### TASK 5.1 — Add Photo Upload to PersonalInfoForm

**File to modify:** `src/components/ResumeForm/PersonalInfoForm.jsx`

**Exact Implementation Spec:**

Step 1 — Add `photo` field to `DEFAULT_RESUME.personal` in `resumeStore.js`:
```javascript
personal: {
  ...existingFields,
  photo: '',       // base64 string or Supabase storage URL
  photoShape: 'circle',  // 'circle' | 'square' | 'none'
}
```

Step 2 — Add photo upload UI in PersonalInfoForm:
```jsx
// Photo upload with crop preview
// Accept: image/jpeg, image/png, max 2MB
// Client-side resize to 300x300px using canvas before storing
// Store as base64 in resumeData.personal.photo (for localStorage)
// For Pro users with cloud save: upload to Supabase Storage bucket 'resume-photos'
```

Step 3 — Update templates to show photo when `personal.photo` is set AND template supports it. Add `supportsPhoto: true` flag to template registry for photo-friendly templates.

---

#### TASK 5.2 — Add Social Links Fields

**File to modify:** `src/components/ResumeForm/PersonalInfoForm.jsx`, `src/store/resumeStore.js`

Add these optional fields to `DEFAULT_RESUME.personal`:
```javascript
github: '',
portfolio: '',
twitter: '',
```

These should render as clickable icons in the resume header on templates that support them.

---

### ═══════════════════════════════════════════
### PHASE 6: PRE-WRITTEN CONTENT LIBRARY
### Timeline: Week 11–12 | Priority: HIGH
### ═══════════════════════════════════════════

**Goal:** Zety's #1 feature is pre-written phrases. Indian users who struggle with English benefit enormously from this. This reduces the "blank page" problem.

---

#### TASK 6.1 — Create Content Library Data File

**File to create:** `src/data/contentLibrary.js`

Structure:
```javascript
export const BULLET_TEMPLATES = {
  'Software Engineer': [
    'Developed and maintained RESTful APIs serving 50,000+ daily active users',
    'Reduced application load time by 40% through code optimization and caching strategies',
    'Led migration of monolithic architecture to microservices, improving deployment frequency by 3x',
    // 15 more bullets...
  ],
  'Marketing Manager': [
    'Managed ₹50L monthly digital marketing budget across Google, Meta, and LinkedIn',
    'Increased organic traffic by 120% through SEO optimization and content strategy',
    // 15 more bullets...
  ],
  'HR Executive': [
    'Managed end-to-end recruitment for 200+ positions across technical and non-technical roles',
    'Reduced time-to-hire by 30% by implementing structured interview processes',
    // 15 more...
  ],
  // Add: Data Analyst, Product Manager, Sales Executive, Finance Analyst, 
  //      Operations Manager, Business Analyst, Graphic Designer, Content Writer
}

export const SUMMARY_TEMPLATES = {
  'Software Engineer': [
    '{{yearsExp}}+ years of full-stack development experience with expertise in {{topSkill1}} and {{topSkill2}}...',
    // 3 variations
  ],
  // ... for each role
}
```

---

#### TASK 6.2 — "Suggest Bullets" Button in ExperienceForm

**File to modify:** `src/components/ResumeForm/ExperienceForm.jsx`

**Where:** Next to each bullet point input, add a lightbulb icon button.

**Behavior:**
1. On click, open a small dropdown showing 5 relevant pre-written bullets based on the job title
2. Also show a "✨ Generate Custom" option that calls the AI enhancer
3. User clicks a bullet to insert it into that position
4. Bullets should be filterable: "quantified", "leadership", "technical"

---

#### TASK 6.3 — "Suggest Summary" Button in PersonalInfoForm

**File to modify:** `src/components/ResumeForm/PersonalInfoForm.jsx`

**Where:** Next to the Summary textarea "AI Generate" button — add "Examples" button.

Show 3 template summaries based on `personal.jobTitle`, with placeholders replaced by actual data.

---

### ═══════════════════════════════════════════
### PHASE 7: LINKEDIN IMPORT
### Timeline: Week 13–14 | Priority: HIGH
### ═══════════════════════════════════════════

**Goal:** Kickresume and Resume.io both offer LinkedIn import. It's the fastest onboarding method.

---

#### TASK 7.1 — LinkedIn Import via Paste (No OAuth Required)

**Why paste, not OAuth:** LinkedIn's API is restricted and expensive for small apps. The "paste" approach (used by Kickresume for their free tier) has no API costs.

**File to create:** `src/components/LinkedInImportModal.jsx`

**Exact Implementation Spec:**

Step 1 — User opens modal and sees instructions:
```
"How to import from LinkedIn:
1. Go to your LinkedIn profile
2. Click 'More' → 'Save to PDF'  
3. Upload that PDF here — our AI will parse it"
```

Step 2 — This reuses the EXISTING `parseResumeWithAI()` function from `resumeParser.js` — no new Edge Function needed.

Step 3 — Add a button "Import from LinkedIn" in the UploadResumeModal alongside the existing file upload.

---

#### TASK 7.2 — Naukri Profile Import (India-Specific)

**File to create:** `src/components/NaukriImportModal.jsx`

**Exact Implementation Spec:**

Same approach as LinkedIn — instruct users to download their Naukri profile as PDF, then parse via existing AI parser. This is a HUGE differentiator for the India market.

Naukri PDFs have a specific layout — update the `parseResumeWithAI` prompt in the Edge Function to add:
```
"If this looks like a Naukri.com profile PDF, extract: 
Key Skills section, current salary, expected salary, notice period, 
and current location separately."
```

---

### ═══════════════════════════════════════════
### PHASE 8: MOBILE EXPERIENCE OVERHAUL
### Timeline: Week 15–16 | Priority: MEDIUM-HIGH
### ═══════════════════════════════════════════

**Goal:** 60%+ of Indian job seekers browse on mobile. The current BuilderPage is desktop-only. This is a massive traffic leak.

---

#### TASK 8.1 — Mobile-First BuilderPage Layout

**File to modify:** `src/pages/BuilderPage.jsx`

**Exact Implementation Spec:**

Current layout: `flex h-[calc(100vh-64px)]` — desktop sidebar + preview  
Mobile layout: Tab-based full-screen — `Form` tab | `Preview` tab | `ATS` tab

Add this breakpoint logic:
```jsx
const isMobile = useMediaQuery('(max-width: 768px)')

// Mobile: Show tabs instead of split view
// Tab 1: Full-screen form (entire sidebar content)
// Tab 2: Full-screen resume preview (scrollable, pinch-to-zoom)
// Tab 3: Full-screen ATS score + tips

// Desktop: Keep existing split layout
```

**Bottom tab bar for mobile:**
```jsx
// Fixed at bottom on mobile screens
<div className="md:hidden fixed bottom-0 left-0 right-0 flex bg-white border-t border-gray-200 z-50">
  <TabButton icon={Edit3} label="Build" tab="form" />
  <TabButton icon={Eye} label="Preview" tab="preview" />
  <TabButton icon={BarChart3} label="Score" tab="ats" />
  <TabButton icon={Download} label="Export" tab="export" />
</div>
```

---

#### TASK 8.2 — Touch-Optimized Form Inputs

**File to modify:** All files in `src/components/ResumeForm/`

Ensure all inputs have:
- `min-height: 44px` (iOS touch target standard)
- `font-size: 16px` minimum (prevents iOS zoom on focus)
- `autocomplete` attributes set correctly for each field type

---

### ═══════════════════════════════════════════
### PHASE 9: ANALYTICS & GROWTH FEATURES
### Timeline: Week 17–18 | Priority: MEDIUM
### ═══════════════════════════════════════════

**Goal:** Add features that create viral loops and retention.

---

#### TASK 9.1 — Resume View Analytics

**File to modify:** `src/pages/SharePage.jsx`, `src/services/supabase.js`

**Supabase table to add:**
```sql
CREATE TABLE resume_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  referrer TEXT,
  viewed_at TIMESTAMPTZ DEFAULT now()
);
```

**What to track:** When someone opens a share link (`/share/:id`), log the view.

**What to show in DashboardPage:** A "Views" column on each resume card. "Your resume was viewed 12 times this week 👀"

---

#### TASK 9.2 — Referral Program

**File to create:** `src/pages/ReferralPage.jsx`

**Route:** `/refer`

**Mechanic:**
- Each user gets a unique referral code stored in `users.referral_code`
- Share URL: `resume.hirewithprachi.com/?ref=PRACHI123`
- When a referred user upgrades to Pro: referrer gets 1 month free (credit to `users.pro_credits`)
- Show referral stats: "You've referred 3 friends → 1 upgraded → You earned 1 free month"

---

#### TASK 9.3 — Resume Score Badge (Shareable)

**File to create:** `src/components/ScoreBadge.jsx`

Allow Pro users to generate a shareable "ATS Score Badge" image they can post on LinkedIn:
```
┌─────────────────────────────┐
│ 🏆 ATS Score: 94/118        │
│ Grade: EXCELLENT            │
│ Verified by HireWithPrachi  │
└─────────────────────────────┘
```

Generate as PNG using canvas and trigger download. This is free viral marketing.

---

### ═══════════════════════════════════════════
### PHASE 10: PERFORMANCE & SEO
### Timeline: Week 19–20 | Priority: MEDIUM
### ═══════════════════════════════════════════

---

#### TASK 10.1 — Add Meta Tags & Open Graph

**File to modify:** `index.html`, create `src/utils/seo.js`

For each page, set:
```html
<title>Free ATS Resume Builder India | HireWithPrachi</title>
<meta name="description" content="Create ATS-optimized resumes for Indian job market. 15+ templates, AI bullet enhancer, cover letter generator. Trusted by 50,000+ Indian professionals." />
<meta property="og:image" content="https://resume.hirewithprachi.com/og-image.jpg" />
```

Target keywords: "resume builder India", "ATS resume builder India", "free resume builder Naukri", "AI resume builder India 2026"

---

#### TASK 10.2 — Server-Side Rendering for Landing Page

**Current issue:** Landing page is a React SPA — Google sees empty HTML until JS loads. This kills SEO.

**Solution:** Use Vite SSR or migrate the LandingPage to Astro/Next.js as a static page while keeping the builder as React SPA.

**Simpler alternative:** Add `react-helmet-async` to inject meta tags + add a `sitemap.xml` + submit to Google Search Console.

---

#### TASK 10.3 — Bundle Size Optimization

**Files to check:** Run `npm run build -- --analyze` (add `rollup-plugin-visualizer`)

**Expected wins:**
- Move `framer-motion` to dynamic import in templates (saves ~40KB)
- Tree-shake lucide-react (import individual icons, not the whole package)
- Split the template files into separate dynamic chunks (already partially done via lazy loading)

---

### ═══════════════════════════════════════════
### PHASE 11: ADVANCED AI FEATURES (v2.0)
### Timeline: Week 21–24 | Priority: MEDIUM (Pro-only)
### ═══════════════════════════════════════════

---

#### TASK 11.1 — AI Career Coach Chat

**File to create:** `src/components/CareerChatModal.jsx`

A floating chat widget (bottom-right corner) powered by Claude/GPT-4o that knows the user's resume data and can answer:
- "How can I improve my summary?"
- "What skills should I add for a Product Manager role?"
- "Review my bullet points for the Google application"
- "What salary should I negotiate for this role in Bangalore?"

**Implementation:** Pass full `resumeData` as context in every API call. Use streaming (`text/event-stream`) for real-time response.

**Gate:** Pro-only, 50 messages/month limit.

---

#### TASK 11.2 — AI Resume Score Comparison

**File to create:** `src/pages/CompareResumesPage.jsx`

Allow Pro users to compare two versions of their resume side-by-side with ATS scores. This directly targets the Teal "multiple versions" feature.

---

#### TASK 11.3 — Industry-Specific Resume Templates

**Files to create:** New templates in `src/templates/templates/`

Add templates for:
- `FresherTemplate.jsx` — College graduates, internship-heavy format
- `ITServicesTemplate.jsx` — TCS/Infosys/Wipro format (very specific layout preference)
- `MBATemplate.jsx` — Business school format with leadership sections
- `HealthcareTemplate.jsx` — Doctor/Nurse format with certifications prominent
- `GovernmentTemplate.jsx` — UPSC/PSU format

---

## 📋 SECTION 4: IMPLEMENTATION PROGRESS TRACKER

Copy this section to a separate file and check off tasks as they are completed.

```
PHASE 1 — MONETIZATION FIXES
[ ] TASK 1.1 — Watermark on free PDF
[ ] TASK 1.2 — Razorpay subscription billing
[ ] TASK 1.3 — Free tier 1-resume limit

PHASE 2 — COVER LETTER GENERATOR
[ ] TASK 2.1 — Edge Function: generate-cover-letter
[ ] TASK 2.2 — CoverLetterPage.jsx
[ ] TASK 2.3 — Cover Letter Templates
[ ] TASK 2.4 — Add to Navbar

PHASE 3 — INTERVIEW PREP
[ ] TASK 3.1 — Edge Function: generate-interview-questions
[ ] TASK 3.2 — InterviewPrepPage.jsx

PHASE 4 — JOB TAILORING ENGINE
[ ] TASK 4.1 — Real-time keyword match in ATS scorer
[ ] TASK 4.2 — Edge Function: tailor-resume
[ ] TASK 4.3 — Tailor button in BuilderPage

PHASE 5 — PHOTO + PROFILE ENHANCEMENTS
[ ] TASK 5.1 — Photo upload in PersonalInfoForm
[ ] TASK 5.2 — Social links (GitHub, Portfolio, Twitter)

PHASE 6 — CONTENT LIBRARY
[ ] TASK 6.1 — contentLibrary.js data file
[ ] TASK 6.2 — Suggest Bullets in ExperienceForm
[ ] TASK 6.3 — Suggest Summary in PersonalInfoForm

PHASE 7 — LINKEDIN / NAUKRI IMPORT
[ ] TASK 7.1 — LinkedIn PDF import modal
[ ] TASK 7.2 — Naukri profile import modal

PHASE 8 — MOBILE EXPERIENCE
[ ] TASK 8.1 — Mobile tab layout for BuilderPage
[ ] TASK 8.2 — Touch-optimized inputs

PHASE 9 — ANALYTICS & GROWTH
[ ] TASK 9.1 — Resume view tracking
[ ] TASK 9.2 — Referral program
[ ] TASK 9.3 — ATS score shareable badge

PHASE 10 — SEO & PERFORMANCE
[ ] TASK 10.1 — Meta tags + Open Graph
[ ] TASK 10.2 — SSR or sitemap for landing page
[ ] TASK 10.3 — Bundle size optimization

PHASE 11 — ADVANCED AI (v2.0)
[ ] TASK 11.1 — AI Career Coach chat widget
[ ] TASK 11.2 — Resume comparison tool
[ ] TASK 11.3 — Industry-specific templates
```

---

## 🔐 SECTION 5: SECURITY CHECKLIST

Before going live with each phase, verify:

```
[ ] No API keys (OpenAI, Anthropic, Razorpay secret) in src/ directory
[ ] All AI calls go through Supabase Edge Functions only
[ ] Razorpay payment verification happens server-side (Edge Function), not client-side
[ ] Supabase RLS policies updated for any new tables
[ ] Photo uploads go to private Supabase bucket (not public URL)
[ ] User can only access their own resumes (RLS: auth.uid() = user_id)
[ ] Rate limiting on Edge Functions (max 10 AI calls per user per hour)
[ ] Input sanitization on JD paste textarea (max 5000 chars)
```

---

## 💰 SECTION 6: REVISED PRICING RECOMMENDATION

Based on competitor research:

| Plan | Price | What's Included |
|---|---|---|
| **Free** | ₹0 | 4 templates, 1 resume, watermarked PDF, basic ATS score |
| **Pro Monthly** | ₹299/mo | All 15+ templates, unlimited resumes, no watermark, AI features, cover letter, interview prep |
| **Pro Annual** | ₹1,999/yr (₹167/mo) | Everything in Pro Monthly — save 44% |
| **Team/College** | ₹9,999/yr for 10 seats | For placement cells, coaching institutes |

**Comparison:**
- Naukri Pro: ₹1,999 for 3 months = ₹667/mo — you're 55% cheaper
- Resume.io: $14.95/mo = ₹1,250/mo — you're 75% cheaper for India market
- ResumeGyani: Free (your free tier must match them on quality)

---

## 📅 SECTION 7: EXECUTION TIMELINE SUMMARY

| Phase | Features | Timeline | Impact |
|---|---|---|---|
| Phase 1 | Watermark, Subscriptions, Limits | Week 1–2 | 💰 Immediate revenue fix |
| Phase 2 | Cover Letter Generator | Week 3–4 | 🔴 Biggest user demand |
| Phase 3 | Interview Prep | Week 5–6 | ⏫ Pro value increase |
| Phase 4 | Job Tailoring Engine | Week 7–8 | 🏆 Competitive parity with Teal |
| Phase 5 | Photo + Social Links | Week 9–10 | 🌍 Global template support |
| Phase 6 | Content Library | Week 11–12 | 👶 Fresher-friendly onboarding |
| Phase 7 | LinkedIn/Naukri Import | Week 13–14 | 📥 Onboarding speed |
| Phase 8 | Mobile Experience | Week 15–16 | 📱 60% traffic fix |
| Phase 9 | Analytics & Growth | Week 17–18 | 📊 Virality + retention |
| Phase 10 | SEO & Performance | Week 19–20 | 🔍 Organic traffic |
| Phase 11 | Advanced AI (v2.0) | Week 21–24 | 🤖 Premium differentiation |

---

## 🚫 SECTION 8: DO NOT DO LIST

These are features/decisions that will waste time or hurt you:

1. **DO NOT build a Chrome Extension before Phase 8** — mobile experience is more important for India market
2. **DO NOT build a job board** — compete with Naukri is suicidal; stay in the resume-building lane
3. **DO NOT switch to Next.js** — Vite + React is working fine; migration would take weeks with no user benefit
4. **DO NOT add more templates before Phase 6** — you have enough templates; content library brings more value
5. **DO NOT add dark mode** — nice-to-have but 0 impact on conversion; deprioritize completely
6. **DO NOT build a native mobile app (React Native)** — PWA + mobile web is sufficient for now
7. **DO NOT integrate OpenAI directly in frontend** — security violation; always use Edge Functions
8. **DO NOT offer lifetime deal** — damages LTV; subscriptions are the right model

---

*Document ends. Total estimated development time: 20–24 weeks for a single developer, 10–12 weeks for a 2-person team.*

*Built for HireWithPrachi — resume.hirewithprachi.com*  
*Audit conducted: April 2026*
