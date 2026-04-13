# HR Saarthi Resume Builder — Template & Design Master Upgrade Prompt
## Vision: "World-class resume builder jo Indian job seekers ke liye truly best ho — 2026 standards"

---

> **LLM ke liye context:**  
> Ye ek React-based resume builder hai jahan har template ek JSX component hai jo `{ data, settings }` props leta hai aur ek A4 page (794×1123px) render karta hai. Templates inline styles + Tailwind se bane hain. User ka data Zustand store mein hai. ATS scoring engine already exists. Is prompt ka kaam hai: existing templates upgrade karna, nayi category-specific templates add karna, aur builder ki overall design quality world-class level pe le jaana — jaise Zety, Kickresume, Enhancv ke saath compete kar sake. Koi file directly reference mat karna — sochna hai ki "kya hona chahiye" not "kya file mein kya likh dena hai."

---

## PART 1 — Template Philosophy: Ye Samajhna Zaroori Hai

### 2026 Mein Ek Great Resume Template Kya Hota Hai?

Top resume builders (Zety, Kickresume, Resume.io, Enhancv) ne 2026 mein ek clear pattern establish kiya hai:

**1. Dual Readability — Machine + Human dono ke liye**
- ATS (Applicant Tracking System) resume ko ek plain text document ki tarah parse karta hai
- Hiring manager resume ko 6-10 seconds mein scan karta hai
- Great template dono kaam ek saath karta hai: visually clean aur ATS-safe

**2. Visual Hierarchy ke 3 Zones**
- **Zone 1 (Top 30%)** — Naam, title, contact, summary. Ye sabse important hai. Recruiter ki aankh yahan 3 seconds rukti hai. Bold, confident, unmissable.
- **Zone 2 (Middle 50%)** — Experience aur education. Bullet points, dates, company names. Clean scanning ke liye structured.
- **Zone 3 (Bottom 20%)** — Skills, certifications, projects, languages. Quick reference area.

**3. ATS Safety Rules (jo kabhi break nahi karne)**
- Text kabhi bhi image ke andar nahi hona chahiye
- Tables se content parse nahi hoti — avoid karo ya sirf layout ke liye use karo
- Columns use karo but ensure kaaro ki left column ka content ATS skip na kare — single column text flow preferred
- Font: Inter, Calibri, Lato, Roboto, Georgia, Garamond — standard fonts only
- No text boxes, no floating elements, no SVG text
- Header/footer mein important content mat daalo — ATS ignore karta hai

**4. Design Restraint**
- Maximum 2 colors (accent + dark base)
- Maximum 2 font families (one serif header, one sans body — ya dono sans)
- White space = luxury. Empty space is not wasted space.
- Skill bars/dots: visually appealing hain but ATS ke liye meaningless — sirf design templates mein use karo, ATS-first templates mein nahi

---

## PART 2 — Current Template Audit

Jo templates already hain unhe is scale pe rate karo aur upgrade karo:

### Grading Criteria (har template ke liye check karo):
1. **ATS Parse Safety** — Kya pure text extractable hai? Koi text image mein to nahi?
2. **Visual Zone Clarity** — Kya top 30% strong hai?
3. **Section Labeling** — Standard headings hain? (Experience, Education, Skills — na ki fancy names)
4. **Accent Color Integration** — Kya `settings.accentColor` puri template mein consistent apply hoti hai?
5. **Font Size Scaling** — `settings.fontSize` (small/medium/large) kaam karta hai?
6. **Photo Handling** — Agar photo hai to gracefully show ho, nahi hai to initials fallback ho
7. **Page Break Safety** — Experience entries between pages cut nahi hone chahiye
8. **Empty State Handling** — Agar koi section empty hai to wo section gracefully hide ho jaye, ugly blank space nahi

### Har existing template ke liye mandatory upgrades:

**ATS-Classic (pure ATS template)**
- Ye template zero visual elements ke saath maximum keyword density ke liye hai
- Upgrade: Bold name (28px minimum), clean rule lines between sections, contact icons (Lucide icons, not images), tight line-height (1.3-1.4), summary box with subtle left border accent
- Skill rendering: plain comma-separated text in categories (NOT bars/dots)
- This template must parse 100% correctly on Workday, Greenhouse, Lever

**TechMinimal / any dark-theme template**
- Problem: Dark backgrounds look great on screen but print badly and some ATS extract white text as blank
- Fix: Dark template should have a print mode — auto-switch to white background on print/PDF export
- Skills: Render as horizontal pill tags with subtle border
- GitHub link: must be prominently displayed in header
- Add: "Open to Remote / Hybrid" field visible in header area

**CreativeSidebar / any two-column template**
- Left sidebar: max 28-30% width. Content: photo, contact, skills, languages, certifications
- Right main column: experience, education, projects — this is what ATS reads
- Sidebar background: use `settings.accentColor` at 8-10% opacity for subtle tint
- Warning label on template card: "Best for agencies, startups, creative roles — may not parse on all ATS"
- Skill dots/bars are acceptable here since it's a design-forward template

**Any Executive / Senior template**
- Must feel premium: extra whitespace, generous margins (12mm minimum), strong typography
- Career timeline element: subtle vertical line connecting experience entries
- No photo option (executives rarely use photos in India for senior roles)
- Publications / Patents section option
- Board memberships / Advisory roles section option

**PrachiSignature (flagship template)**
- Ye brand ka hero template hai — must be visually stunning AND ATS safe
- Bold full-width header with name in 32px, accent underline below name
- Dual column below header: right 65% for experience/education, left 35% for skills/contact
- Photo: circular frame, 80px diameter, right side of header
- Each experience entry: company name bold, title in accent color, date right-aligned, bullets indented

---

## PART 3 — New Templates Banana Hai (Category-Specific)

### Har category ka ek dedicated template hona chahiye. India ke context mein:

---

### TEMPLATE A: "Campus Pro" — Fresher / Fresh Graduate
**Target users:** B.Tech, BCA, BBA, MBA freshers applying to TCS, Infosys, Wipro, campus placements

**Design philosophy:**
- Single column, completely ATS-safe — campus placement ATS parsers are often old
- Clean, professional, no-nonsense — not flashy
- Education sabse pehle (India mein fresher ke liye education > experience)
- Prominent CGPA / percentage display
- Projects section: bigger than experience (kyunki experience nahi hai)
- Declaration section: optional toggle (Indian companies still ask for it)
- Internships section: separate from full-time experience

**Layout:**
```
┌─────────────────────────────────────────┐
│  NAME (bold, 26px)                      │
│  B.Tech CSE | CGPA: 8.7/10            │
│  📧 email  📱 phone  📍 city  🔗 linkedin │
├─────────────────────────────────────────┤
│  OBJECTIVE (2-3 lines, italic)          │
├─────────────────────────────────────────┤
│  EDUCATION (most important for fresher) │
│  ├─ Graduation  |  College  |  CGPA    │
│  ├─ 12th Class  |  Board    |  %       │
│  └─ 10th Class  |  Board    |  %       │
├─────────────────────────────────────────┤
│  PROJECTS (2-3 with tech stack tags)   │
├─────────────────────────────────────────┤
│  INTERNSHIPS (if any)                  │
├─────────────────────────────────────────┤
│  SKILLS  |  CERTIFICATIONS             │
├─────────────────────────────────────────┤
│  ACHIEVEMENTS / AWARDS                 │
└─────────────────────────────────────────┘
```

**ATS fields required:** fullName, jobTitle (as objective), email, phone, location, linkedin, education, projects, skills, certifications, summary (as objective)

**Special fields for this template's data:**
- CGPA/percentage (inside education entry's grade field)
- 10th/12th marks (inside education entries)
- Tech stack tags for projects (comma-separated inside project description)
- Declaration text (optional boolean toggle)

---

### TEMPLATE B: "DevStack" — Software Engineer / Developer
**Target users:** React devs, Backend engineers, Full-stack, DevOps — 0 to 8 years experience

**Design philosophy:**
- Two-zone layout: thin left strip (30%) + main right (70%)
- Left: dark background (accent color), white text — contact, skills in categories (Frontend / Backend / Tools / Cloud), GitHub stats placeholder
- Right: white background — experience with code-style bullet points, projects with live links, education
- Monospace font accent for section headers (gives coding vibe without hurting readability)
- Tech stack tags: render each skill as a small tag/chip (dark bg, accent text)

**Must-have fields for this template:**
- GitHub URL (prominent, left sidebar)
- Portfolio / personal website
- Skills MUST be categorized: Frontend | Backend | DevOps | Languages | Databases | Tools
- Projects MUST show: project name + tech stack used + impact metric + GitHub/live link
- Certifications: AWS, GCP, Azure certs shown with logo-like badge styling

**Layout:**
```
┌────────────┬──────────────────────────────┐
│ DARK STRIP │  NAME (large, bold)          │
│            │  Senior React Developer       │
│ [PHOTO     │  ─────────────────────────── │
│  or        │  EXPERIENCE                  │
│  INITIALS] │  ● Zomato | SDE-2 | 2022-24  │
│            │    • Built X, improved Y      │
│ 📧 email   │                              │
│ 📱 phone   │  PROJECTS                    │
│ 🔗 github  │  ● AppName | React, Node.js  │
│            │    github.com/x | live: url  │
│ SKILLS     │                              │
│ ─────────  │  EDUCATION                   │
│ React      │  ● IIT Bombay | B.Tech CSE   │
│ Node.js    │                              │
│ AWS        │  CERTIFICATIONS              │
│ Docker     │  ● AWS Solutions Architect   │
└────────────┴──────────────────────────────┘
```

---

### TEMPLATE C: "FinanceEdge" — Finance / CA / Banking / Investment
**Target users:** CA, CFA, MBA Finance, Investment Banking, Financial Analyst, CFO-track

**Design philosophy:**
- Ultra-conservative, corporate — dark navy header, white body
- No decorative elements — precision and trust convey the brand
- Numbers everywhere: every achievement MUST have a rupee/percentage figure
- Certifications (CA, CFA, CPA, FRM) displayed very prominently — these are career-defining
- No photo (investment banking culture doesn't use photos)
- Two-column for skills: Technical Skills | Domain Knowledge

**Special fields:**
- CA Rank / Articleship details
- CFA Level achieved
- AUM managed (if applicable)
- Deal values ($Xbn transaction) for IB roles
- Board/Committee memberships

**Layout:**
```
┌─────────────────────────────────────────┐
│  ██████████████████████████████████████ │
│  NAME (white on navy)   CA | CFA Level 2│
│  email | phone | linkedin | Delhi       │
│  ██████████████████████████████████████ │
├──────────────────────────────────────── │
│  PROFESSIONAL SUMMARY                   │
│  "CA with 6 years in Big 4..."         │
├────────────────┬──────────────────────── │
│  KEY EXPERTISE │  WORK EXPERIENCE       │
│  ─────────────│  ─────────────────────  │
│  Financial    │  Deloitte | Manager     │
│  Modeling     │  2020–Present           │
│  GST/TDS      │  • Managed audit for    │
│  IFRS/Ind AS  │    ₹500Cr company       │
│  SAP/Oracle   │                         │
└────────────────┴────────────────────────┘
```

---

### TEMPLATE D: "CreativeCanvas" — Designer / UX / Graphic / Creative
**Target users:** UI/UX Designers, Graphic Designers, Art Directors, Brand Managers, Motion Designers

**Design philosophy:**
- This template IS the portfolio preview — it should demonstrate taste
- Asymmetric layout: full-width bold header with gradient or bold color block
- Portfolio URL must be the MOST prominent thing after name
- Skills shown as categorized bubbles/pills — Figma | Adobe XD | Illustrator etc.
- Case studies format for experience: Problem → Solution → Impact (3-line bullets)
- Color: user's accent color fully expresses in header background
- Typography: Poppins or Raleway for headings (imported via @import CSS)
- Visual elements: subtle geometric shapes as section dividers

**Caveat:** Include a warning that says "For design agency applications / portfolio submissions. Use ATS Classic for automated portals."

**Special fields:**
- Portfolio URL (most prominent placement)
- Behance / Dribbble links
- Design tools: Adobe Suite, Figma, Sketch, Webflow
- AI design tools: Midjourney, Adobe Firefly, DALL-E — these are 2026 must-haves
- Type of design: Brand | UI/UX | Motion | Illustration | Print

---

### TEMPLATE E: "MarketingMaven" — Marketing / Digital Marketing / Growth
**Target users:** Digital marketers, SEO/SEM specialists, Growth hackers, Brand managers, CMOs

**Design philosophy:**
- Data-driven personality: every bullet must have a metric
- ROI language: CTR, ROAS, CAC, LTV, MQL, SQL, ARR — these terms should feel natural in this template
- Colors: bold but professional. Marketing people like personality.
- Two-column: left for skills (tools: HubSpot, Salesforce, Google Analytics, Meta Ads), right for experience
- Campaign highlights section: mini case study format (Campaign → Platform → Result)

**Special fields:**
- Tools: CRM | Analytics | Advertising | Automation | Social
- Key campaigns section
- Budget managed (₹Xcr campaigns)
- Team size managed
- Channels expertise: SEO | SEM | Email | Social | Content | Influencer | Affiliate

---

### TEMPLATE F: "HRPeople" — Human Resources / Talent Acquisition / HRBP
**Target users:** HR Executives, Talent Acquisition specialists, HR Business Partners, L&D, TA leads

**Design philosophy:**
- Warm, approachable — HR is a people function, the template should feel human
- Pastel accent colors work well (not dark/aggressive)
- People metrics: headcount managed, offer acceptance rate, time-to-hire, attrition rate
- Statutory compliance section: EPF, ESIC, Gratuity, POSH — important for Indian HR
- HRIS tools section: Darwinbox, Keka, GreytHR, SAP SuccessFactors, Workday

**Special fields:**
- Headcount managed
- Hiring volume (hired X people in Y months)
- Industries/domains recruited for
- Statutory knowledge: EPF, ESIC, Shops Act, etc.
- HRIS tools used

---

### TEMPLATE G: "SalesWarrior" — Sales / Business Development / Account Management
**Target users:** Sales executives, BDMs, Key Account Managers, Sales Directors

**Design philosophy:**
- Bold and confident — sales people are result-driven
- Revenue numbers MUST be giant and unmissable
- Target vs. Achievement format for experience bullets
- Geography coverage map implied in experience (PAN India / North India / etc.)
- Client portfolio section

**Special fields:**
- Revenue generated / quota achieved
- Team size managed
- Clients / enterprise accounts
- Revenue targets vs achieved (₹ or %)
- Regions handled

---

### TEMPLATE H: "MedicalPro" — Healthcare / Doctor / Nurse / Medical
**Target users:** MBBS, MD, nurses, hospital administrators, pharma medical reps

**Design philosophy:**
- White/clean — clinical precision
- Registration number (MCI/NMC/State Council) prominently displayed
- Clinical experience format: hospital + department + duration + procedures performed
- Publications/Research section
- CME credits / certifications
- No photos for doctors (they use their degrees instead)

**Special fields:**
- MCI/NMC Registration Number
- Specialization
- Clinical skills: procedures, surgeries, OPD capacity
- Publications / Research papers
- Medical software: HIS, NABH, Apollo EMR etc.

---

### TEMPLATE I: "LegalEagle" — Legal / Advocate / Lawyer / Compliance
**Target users:** Advocates, In-house counsel, Compliance officers, Law graduates

**Design philosophy:**
- Most formal of all templates — black and white preferred
- Bar enrollment number prominently shown
- Practice areas as primary skill section
- Court appearances / matters handled
- Law firm prestige hierarchy matters here

**Special fields:**
- Bar enrollment number
- High Court / Supreme Court enrollment
- Practice areas (Civil, Criminal, Corporate, IP, etc.)
- Key matters handled (anonymized)
- Internships at specific law firms / chambers

---

### TEMPLATE J: "TeacherFirst" — Education / Teacher / Academic / Researcher
**Target users:** School teachers, College professors, Educational administrators, Researchers

**Design philosophy:**
- Academic and dignified — clean single column
- Publications / Research papers section is primary (for academia)
- For school teachers: student outcomes, board results improvement
- Teaching philosophy (2 lines) in summary

**Special fields:**
- Subject specialization
- Classes taught (6th-12th / College / PG)
- Board experience: CBSE / ICSE / State Board / IB / IGCSE
- Publications / Research (with DOI links for digital)
- Student outcomes metrics

---

### TEMPLATE K: "GovtReady" — Government Jobs / PSU / SSC / UPSC / Banking
**Target users:** SSC CGL, UPSC aspirants, PSU roles, Bank PO, Railway jobs

**Design philosophy:**
- Most conservative format — follows DoPT guidelines
- Single column, black/white/navy only
- Education: 10th → 12th → Graduation → Post-Grad (ascending, NOT reverse chronological for govt)
- Date format: DD/MM/YYYY (Indian government standard)
- Father's name / DOB / Category: optional but expected fields
- Declaration section: mandatory
- Passport size photo: explicitly recommended in template

**Special fields:**
- Father's / Mother's name (optional toggle)
- Date of Birth
- Category (General / OBC / SC / ST / EWS)
- Nationality
- Languages known (Read/Write/Speak checkboxes)
- Declaration with date and place

---

## PART 4 — Template Registry / Selector UI Upgrades

### Template Card Design (yahan sabse zyada improvement chahiye)

**Current problem:** Template cards mein just static gradient blocks hain — users samajh nahi paate ki template kaisa dikhega.

**Upgrade:**
1. **Live mini preview** — Har template card pe actual sample resume data render ho, scale(0.17) par. User dekh sake ki real resume kaisa dikhega.
2. **Category badge** — Har template pe badge: `ATS-Safe`, `Creative`, `For Freshers`, `Executive`, `Govt Jobs` etc.
3. **Industry tags** — "Best for: Tech | Startup | MNC | Consulting"
4. **ATS score indicator** — Har template ka ATS compatibility indicator: 🟢 High / 🟡 Medium / 🔴 Low (creative)
5. **Hover animation** — Template card hover pe slightly scale up + shadow, aur ek "Preview Full Size" button appear ho
6. **Filter bar** — Templates ko filter kar sako: by Category (Fresher | Tech | Finance | Creative...), by ATS Level, by Layout (Single col | Two col | Sidebar)

### Template Preview Modal
- Koi bhi template card click karo to ek large modal open ho
- Modal mein template ka full A4 preview dikh jaye — user ka actual data render ho usme
- Left side: template preview (scrollable for 2-page)
- Right side: template info, ATS score, best-for industries, "Use This Template" CTA button

---

## PART 5 — ATS Scoring Engine Upgrades

Current scoring engine ek solid foundation hai. Ise aur smarter banana hai:

### 5.1 — Industry-Aware Scoring
- Jab user apna job title daale ("Data Scientist", "HR Executive", "Sales Manager"), auto-detect karke relevant keyword set load ho
- India-specific job titles: "Sr. Executive", "Deputy Manager", "Associate Vice President (AVP)", "Senior Manager", "DGM", "GM", "VP" — ye Indian corporate hierarchy hai
- India-specific platforms in skills: Naukri, Apna app, LinkedIn (common for recruiters)

### 5.2 — Indian Job Market Keywords (expand karo)
Current database expand karo with:

**IT/Tech (India-specific):**
service-based companies: TCS, Infosys, Wipro, HCL, Tech Mahindra
product companies: Zomato, Swiggy, Paytm, Razorpay, PhonePe, Freshworks, Zoho
global MNCs India: Google, Microsoft, Amazon, Samsung R&D, Qualcomm
skills: Java, Spring Boot, Microservices, REST API, Oracle DB, PL/SQL, SAP ABAP, Mainframes (legacy but still common in India)

**Banking/Finance (India-specific):**
SEBI regulations, RBI guidelines, NABARD, SIDBI
IRDA, NPA, CRAR, PCR (banking terms)
Tally ERP, Busy, Wings (Indian accounting software)
GST portal, TDS return, ROC filings, MCA21
NBFC experience, Fintech, UPI ecosystem

**HR India:**
Darwinbox, Keka, GreytHR, Spine HR (Indian HRIS)
EPF portal, ESIC portal, PF Form 19/10C
Shops & Establishment Act, POSH Act, Maternity Benefit Act
Naukri.com hiring, Apna app sourcing

**Manufacturing/Operations (India):**
5S, TPM, Six Sigma (Green Belt / Black Belt)
SAP PP/MM/QM modules
IATF 16949, ISO 9001, BIS certification
Lean manufacturing, Kaizen, SMED
OEE, MTBF, MTTR (manufacturing KPIs)

### 5.3 — Resume Score Breakdown UI Improvements
Current score is a single number. Improve karo:
- Gauge/dial chart instead of plain number
- Color-coded ring: Red (0-40), Orange (40-60), Yellow (60-75), Green (75-90), Purple (90-100)
- Category breakdown bars: Contact | Summary | Experience | Skills | Keywords | Format
- Per-bullet quality rating: show a quality badge next to each experience bullet (Weak / Good / Strong / Excellent)
- "Quick Wins" panel: "Add these 3 keywords to jump from 67 → 78"

---

## PART 6 — Form/Builder UX Field-Level Upgrades

### 6.1 — Smart Field Placeholders (Context-Aware)
Placeholder text abhi generic hai. Upgrade karo:

When user's job title = "Software Engineer":
- Summary placeholder: "Senior React Developer with 5+ years building scalable SPAs for fintech and e-commerce. Led migration of monolith to microservices at Paytm, reducing API latency by 40%."
- Experience bullet placeholder: "• Architected REST API serving 2M+ daily requests, achieving 99.9% uptime..."

When user's job title = "HR Manager":
- Summary placeholder: "HR Business Partner with 8 years driving talent strategy for 500+ employee organizations. Reduced attrition by 22% through structured L&D and compensation benchmarking."
- Bullet placeholder: "• Managed end-to-end recruitment for 150+ positions annually, reducing time-to-hire from 45 to 28 days..."

When job title = "Sales Manager":
- Bullet placeholder: "• Exceeded annual revenue target of ₹5Cr by 118%, generating ₹5.9Cr through strategic account development in Western India territory..."

This makes the product feel like it "knows" your profession.

### 6.2 — Skills Autocomplete with Categories
Jab user skills type kare:
- Autocomplete suggestions based on job title
- Auto-categorize: user "React" type kare → automatically "Frontend" category mein add ho
- Popular skill sets: "Add all React Developer skills" → pre-fills React, TypeScript, Redux, Next.js, Jest, Webpack

### 6.3 — Experience Bullet Writer UX
Sabse important section aur abhi most friction:
- Character/word count indicator per bullet (Optimal: 15-25 words)
- Impact word detector: agar bullet mein action verb nahi to yellow underline + suggestion
- Number detector: agar bullet mein no metric to amber indicator "Add a number to strengthen this"
- STAR format guide tooltip: "Situation → Task → Action → Result"

### 6.4 — One-Click "Resume Facelift"
Ek button: "Upgrade All My Bullets with AI" 
- Runs through ALL experience bullets in one shot
- Shows before/after comparison in a modal
- User approve/reject kar sakta hai per bullet
- Pro feature only

---

## PART 7 — Template Visual Design Standards

### Typography Rules (sab templates follow karein)
```
Name:          28-36px | font-weight: 900 | letter-spacing: -0.02em
Job Title:     14-16px | font-weight: 600 | color: accentColor
Section Header: 11-12px | font-weight: 800 | uppercase | letter-spacing: 0.1em | color: accentColor
Body Text:     10-11px | font-weight: 400 | line-height: 1.45 | color: #1e293b
Dates:         9-10px  | font-weight: 600 | color: #64748b
Bullet Text:   10-11px | line-height: 1.4
Company Name:  11px    | font-weight: 700
```

### Spacing Rules
```
Page margin:     10mm all sides (38px)
Section gap:     16px between sections
Entry gap:       12px between experience entries  
Bullet indent:   16px left padding
Line spacing:    1.4 multiplier minimum
Header padding:  24px top, 16px bottom
```

### Color Application Rules
```
accentColor → Apply to: section headers, name underline, date dots, skill tags background, divider lines, sidebar background (at 10% opacity)
Dark text (#0f172a) → Headings, company names, job titles
Gray text (#64748b) → Dates, subtitles, meta info
Light gray (#f1f5f9) → Alternate row backgrounds (optional), sidebar fill
White (#ffffff) → Always body/page background
```

### ATS-Safe Design Checklist per Template
- [ ] Sabhi text DOM mein hai — koi text image/canvas mein nahi
- [ ] Section headings standard hain: "Work Experience" not "My Journey"
- [ ] Dates consistent format: "Jan 2022 – Mar 2024" or "2022 – 2024"
- [ ] Skills ek readable format mein: "React, Node.js, MongoDB" ya categorized
- [ ] Contact info page pe ek jagah clearly listed
- [ ] Koi text box nahi (CSS positioned divs are fine, HTML text boxes nahi)
- [ ] No watermark ya logo on free tier (ye ATS mein text inject karta hai)
- [ ] PDF export karne ke baad text selectable hona chahiye

---

## PART 8 — Missing Features Jo World-Class Builders Mein Hain

Research ke basis pe ye features top resume builders mein hain jo abhi missing hain:

### 8.1 — Pre-Written Content Library
Zety aur Kickresume ka killer feature: job-title ke basis pe pre-written bullet points

Implementation concept:
- "Add from library" button har experience entry ke andar
- User job title se match karta hai content library
- 5-8 pre-written bullets show hote hain
- User click kare to add, fir customize kare
- Library: Tech (SWE, PM, QA, DevOps), Finance (CA, Analyst, CFO), HR, Marketing, Sales, Operations

### 8.2 — Resume Tailoring for Specific JD
Ye feature abhi ATS coach mein partially hai. Proper implementation:
- User JD paste kare
- AI analyze kare: kaunse keywords missing hain
- Specific suggestions: "Line 3 of your experience should include 'Agile methodology'"
- One-click insertion: "Add to resume" button next to each suggestion
- Before/After score comparison

### 8.3 — LinkedIn Profile to Resume (One-Click)
Top builders sabke paas hai. User LinkedIn PDF export upload kare → auto-parse → resume populate.

### 8.4 — Resume Version Management
Multiple versions of same resume for different job applications:
- "Clone for this job" button
- Version naming: "Zomato Application - April 2026"
- Side-by-side comparison of two versions
- ATS score comparison between versions

### 8.5 — Real-Time Spell Check + Grammar
- Underline spelling errors (red)
- Grammar suggestions (blue underline)
- Indian English: accept "CTC", "lakh", "crore", "Hike", "Joining", "Notice Period" — these are valid

### 8.6 — Resume Strength Meter (per section)
Not just overall score. Each section has its own strength:
- Personal Info: 4/5 fields filled → "Good"
- Experience: 2 entries, avg 3 bullets each → "Needs improvement (add 1 more role)"
- Skills: 8 skills → "Good (optimal: 10-15)"
- Certifications: 0 → "Consider adding certifications for your field"

---

## PART 9 — Category-to-Template Mapping

Jab user sign up kare ya builder open kare, pehle poochho:

**"Aap konse field mein hain?"**

| User selects | Recommended Template | ATS Level |
|---|---|---|
| Software Engineer | DevStack | High |
| Data Scientist / ML | TechMinimal (dark) | High |
| Product Manager | DevStack / CorporatePro | High |
| Graphic Designer / UX | CreativeCanvas | Medium |
| Marketing | MarketingMaven | High |
| Finance / CA | FinanceEdge | High |
| HR | HRPeople | High |
| Sales / BD | SalesWarrior | High |
| Fresher (any) | Campus Pro | High |
| Government Jobs | GovtReady | High |
| Doctor / Healthcare | MedicalPro | High |
| Lawyer | LegalEagle | High |
| Teacher / Academic | TeacherFirst | High |
| Creative (generic) | PrachiSignature / CreativeCanvas | Medium |
| Executive (10+ yrs) | CorporatePro / FinanceEdge | High |

This onboarding question + recommendation dramatically improves first experience.

---

## PART 10 — Implementation Priority Order

```
Priority 1 (Highest Impact, Do First):
  → Template Registry UI upgrade: live mini preview + filters + category badges
  → Campus Pro template (biggest fresher market in India)
  → DevStack template (largest user segment: tech professionals)
  → FinanceEdge template (high-value segment)

Priority 2:
  → ATS Scoring: per-bullet quality indicators
  → Smart field placeholders (job-title aware)
  → Pre-written content library (basic version: 5 job titles, 8 bullets each)
  → Upgrade all existing templates for ATS-safety checklist

Priority 3:
  → All remaining category templates
  → Resume tailoring UX improvement
  → Skills autocomplete with categories
  → Section strength indicators

Priority 4 (Polish):
  → Template preview modal (full-size)
  → Resume version management
  → Spell check integration
  → One-click "facelift" all bullets
```

---

## FINAL PRINCIPLE: Quality Bar

> "Agar koi Indian professional Zety ya Kickresume dekh ke aye, aur phir HR Saarthi use kare — to usse acha lagana chahiye, worse nahi."

Ye hai bar. Isse neeche mat girna. Isse upar jaana hai.

Har template jo banaoge usse is question se pass karo:
*"Kya ye resume agar Infosys, Zomato, ya Deloitte ke recruiter ke samne aaye, to shortlist hogi?"*

Haan = release karo. Nahi = redesign karo.

---

*Research sources: Kickresume, Resume.io, Zety, Enhancv, ResumeGenius, Resume.org, BeamJobs, TealHQ — April 2026 audit*  
*Indian market context: Naukri.com hiring patterns, TCS/Infosys placement format, Indian corporate hierarchy*
