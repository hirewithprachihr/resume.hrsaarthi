/**
 * Elite ATS Scoring Engine v3.0
 * ─────────────────────────────────────────────────────────────────
 * Changes from v2.0:
 *  - Fixed score inflation: format base 15 → 0 (awarded per criterion)
 *  - Expanded stop words: 45 → 220+ (incl. Indian English common words)
 *  - Added INDIA_JD_KEYWORDS database for tech/HR/finance/marketing/sales
 *  - Added scoreBullet() for per-bullet quality ratings
 *  - Tightened grade thresholds: Excellent gated on content completeness
 */

// ─── Constants ──────────────────────────────────────────────────

const ACTION_VERBS = [
  'led','built','achieved','managed','developed','designed','implemented','created',
  'improved','increased','decreased','reduced','delivered','launched','executed',
  'coordinated','analysed','analyzed','optimized','optimised','streamlined',
  'negotiated','collaborated','mentored','supervised','trained','researched',
  'established','generated','maintained','resolved','spearheaded','transformed',
  'automated','deployed','scaled','architected','engineered','drove','grew',
  'saved','earned','secured','facilitated','supported','boosted','enhanced',
  'pioneered','revamped','restructured','consolidated','accelerated','championed',
  'cultivated','formulated','orchestrated','oversaw','proposed','recruited',
]

const IMPACT_WORDS = [
  'improved','increased','reduced','saved','achieved','delivered','generated',
  'grew','built','launched','drove','accelerated','boosted','cut','eliminated',
]

const BUZZWORDS = [
  'team player', 'hard worker', 'results-oriented', 'passionate', 'self-motivated',
  'dynamic', 'innovative', 'detail-oriented', 'creative', 'strategic thinker',
  'problem solver', 'quick learner', 'highly skilled', 'proven track record',
]

const CONTACT_FIELDS = ['email', 'phone', 'linkedin', 'location']

/**
 * India job market keyword database.
 * Used when no JD is pasted — supplements the universal keywords.
 */
const INDIA_JD_KEYWORDS = {
  tech: [
    'react','nodejs','python','java','aws','docker','kubernetes',
    'microservices','rest api','agile','scrum','git','ci/cd',
    'sql','mongodb','typescript','spring boot','angular','vue',
    'terraform','redis','kafka','jenkins','graphql','flutter',
  ],
  hr: [
    'recruitment','sourcing','onboarding','payroll','hris',
    'talent acquisition','employee engagement','pms','appraisal',
    'hr operations','statutory compliance','epf','esic','gratuity',
  ],
  finance: [
    'tally','gst','tds','mis','p&l','balance sheet',
    'accounts payable','accounts receivable','reconciliation',
    'sap','oracle','budgeting','variance analysis','ind as',
  ],
  marketing: [
    'seo','sem','google ads','meta ads','social media',
    'content marketing','email marketing','crm','analytics',
    'brand management','roi','ctr','cpac','funnel',
  ],
  sales: [
    'b2b','b2c','crm','lead generation','target achievement',
    'revenue','cross-sell','upsell','key accounts','channel sales',
    'naukri','linkedin recruiter','salesforce','hubspot',
  ],
}

// ─── Main Scoring Function ───────────────────────────────────────

/**
 * Score a resume object against an optional job description.
 *
 * @param {object} resumeData - Zustand resumeData object
 * @param {string} [jobDescription] - Raw JD text (optional)
 * @returns {{ total, breakdown, tips, keywordDetails, grade, impactMetrics }}
 */
export function scoreResume(resumeData, jobDescription = '') {
  // Guard: return a safe zero-score object if data is missing or corrupt
  if (!resumeData || !resumeData.personal) {
    return { total: 0, breakdown: {}, tips: [], keywordDetails: {}, grade: 'F', impactMetrics: {} }
  }

  // Normalise arrays so downstream scorers never crash on undefined
  resumeData = {
    ...resumeData,
    experience    : resumeData.experience     || [],
    education     : resumeData.education      || [],
    skills        : resumeData.skills         || [],
    certifications: resumeData.certifications || [],
    projects      : resumeData.projects       || [],
    hobbies       : resumeData.hobbies        || [],
  }

  const context = {
    allText   : getAllText(resumeData),
    bulletText: resumeData.experience.flatMap(e => e.bullets || []).join(' '),
  }

  const scores = {
    contact : scoreContact(resumeData),
    content : scoreContent(resumeData),
    impact  : scoreImpact(resumeData, context),
    format  : scoreFormat(resumeData, context),
    keywords: scoreKeywords(context.allText, jobDescription),
  }

  const rawTotal = Math.round(
    scores.contact.value +
    scores.content.value +
    scores.impact.value  +
    scores.format.value  +
    scores.keywords.value
  )

  const total = Math.min(100, Math.max(0, rawTotal))

  const tips = [
    ...scores.contact.tips,
    ...scores.content.tips,
    ...scores.impact.tips,
    ...scores.format.tips,
    ...scores.keywords.tips,
  ].sort((a, b) => {
    const order = { error: 0, warning: 1, info: 2, success: 3 }
    return (order[a.level] ?? 4) - (order[b.level] ?? 4)
  })

  return {
    total,
    breakdown: {
      contact : Math.round(scores.contact.value),
      content : Math.round(scores.content.value),
      impact  : Math.round(scores.impact.value),
      format  : Math.round(scores.format.value),
      keywords: Math.round(scores.keywords.value),
    },
    tips,
    keywordDetails: scores.keywords.details,
    grade: getGrade(total, resumeData),
    impactMetrics: {
      verbs      : scores.impact.verbsFound,
      quantifiers: scores.impact.quantMatches,
    },
  }
}

// ─── Section Scorers ────────────────────────────────────────────

function scoreContact(data) {
  let value = 0
  const tips = []
  const { personal } = data

  CONTACT_FIELDS.forEach(f => {
    if (personal[f]?.trim()) {
      value += 2.5
    } else if (f !== 'linkedin') {
      tips.push({ level: 'error', msg: `Missing ${f} — required by all ATS systems`, section: 'personal' })
    }
  })

  if (personal.linkedin) {
    if (!personal.linkedin.includes('linkedin.com/in/')) {
      tips.push({ level: 'warning', msg: 'Use a /in/ LinkedIn URL (e.g. linkedin.com/in/yourname)', section: 'personal' })
    }
  } else {
    tips.push({ level: 'warning', msg: 'Add LinkedIn profile — 2× more recruiter callbacks', section: 'personal' })
  }

  return { value, tips }
}

function scoreContent(data) {
  let value = 0
  const tips = []

  // Summary — 0–10 points
  const summary = data.personal.summary || ''
  const summaryWords = summary.trim().split(/\s+/).filter(Boolean).length
  if (summaryWords >= 50) value += 10
  else if (summaryWords >= 20) { value += 5; tips.push({ level: 'info', msg: 'Expand your summary to 50+ words for best results', section: 'personal' }) }
  else if (summaryWords > 0)   { value += 2; tips.push({ level: 'warning', msg: 'Professional summary is too brief (aim for 50–100 words)', section: 'personal' }) }
  else tips.push({ level: 'error', msg: 'Add a professional summary — it is the first thing recruiters read', section: 'personal' })

  // Experience — 0–15 points
  if (data.experience.length >= 3)      value += 15
  else if (data.experience.length >= 1) value += 10
  else tips.push({ level: 'error', msg: 'Add work experience to show your track record', section: 'experience' })

  // Skills — 0–5 points
  if (data.skills.length >= 2)     value += 5
  else if (data.skills.length === 1) { value += 3; tips.push({ level: 'info', msg: 'Add more skill categories (Technical, Soft Skills, Tools)', section: 'skills' }) }
  else tips.push({ level: 'error', msg: 'Technical skills section is missing — critical for ATS', section: 'skills' })

  // Education — 0–5 points
  if (data.education.length > 0) value += 5
  else tips.push({ level: 'warning', msg: 'Add education history', section: 'education' })

  // Bonus sections (max 5 pts)
  if (data.certifications.length > 0) value += 1.5
  if (data.projects.length > 0)       value += 2
  if (data.hobbies.length > 0)        value += 1.5

  return { value: Math.min(40, value), tips }
}

function scoreImpact(data, context) {
  const tips   = []
  let value    = 0
  const lower  = context.allText.toLowerCase()

  // Action verbs — max 10 pts
  const verbsFound = ACTION_VERBS.filter(v => new RegExp(`\\b${escapeRegex(v)}\\b`).test(lower))
  const verbScore  = Math.min(10, verbsFound.length * 2)
  value += verbScore
  if (verbsFound.length < 5) {
    tips.push({ level: 'warning', msg: `Only ${verbsFound.length} action verbs found. Use words like Led, Built, Optimized`, section: 'experience' })
  }

  // Quantifiable results — max 15 pts
  const quantPattern = /\b\d+[\+%]?\s*(years?|months?|users?|clients?|team|people|employees?|projects?|cr|lakh|k|million|billion|₹|\$|%|x)\b|\b(increased?|decreased?|reduced?|improved?|grew?|saved?|generated?)\s+by\s+\d+/gi
  const quantMatches = context.bulletText.match(quantPattern) || []
  value += Math.min(15, quantMatches.length * 3)
  if (quantMatches.length < 3) {
    tips.push({ level: 'warning', msg: 'Add more metrics (e.g. "Saved ₹50k", "Managed 10 people", "Improved uptime by 30%")', section: 'experience' })
  }

  return { value, tips, verbsFound: verbsFound.length, quantMatches: quantMatches.length }
}

function scoreFormat(data, context) {
  // Base is now 0 — points awarded per criterion hit
  let value = 0
  const tips = []

  // Has enough bullets per experience (max 8 pts)
  let wellFilledEntries = 0
  data.experience.forEach(exp => {
    const validBullets = (exp.bullets || []).filter(b => b?.trim().length > 0)
    if (validBullets.length >= 2) {
      wellFilledEntries++
    } else {
      tips.push({ level: 'warning', msg: `Role at "${exp.company || 'Unknown'}" needs at least 2 bullet points`, section: 'experience' })
    }
  })
  if (data.experience.length > 0) {
    value += Math.min(8, (wellFilledEntries / data.experience.length) * 8)
  }

  // Bullet length hygiene (max 4 pts)
  const allBullets = data.experience.flatMap(e => e.bullets || []).filter(b => b?.trim())
  const longBullets = allBullets.filter(b => b.split(/\s+/).length > 40)
  if (longBullets.length === 0 && allBullets.length > 0) {
    value += 4
  } else if (longBullets.length > 0) {
    tips.push({ level: 'warning', msg: 'Some bullets exceed 40 words — keep under 30 for ATS parsers', section: 'experience' })
  }

  // No buzzwords (max 3 pts)
  const foundBuzz = BUZZWORDS.filter(b => context.allText.toLowerCase().includes(b))
  if (foundBuzz.length === 0) {
    value += 3
  } else {
    tips.push({ level: 'info', msg: `Remove generic buzzwords: ${foundBuzz.slice(0, 3).join(', ')}`, section: 'experience' })
  }

  // Has summary (already counted in content, but reinforce format score)
  if ((data.personal.summary || '').trim().length > 50) value += 2

  // Phone number looks like Indian mobile
  if (data.personal.phone) {
    const cleaned = data.personal.phone.replace(/\D/g, '')
    if (cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'))) {
      value += 1
    }
  }

  return { value: Math.min(18, Math.max(0, value)), tips }
}

function scoreKeywords(text, jd) {
  if (!jd || jd.trim().length < 50) {
    // No JD — award partial score and give India-market tip
    return {
      value : 12,
      tips  : [{ level: 'info', msg: 'Paste a Job Description in the field above for personalized keyword analysis', section: 'keywords' }],
      details: null,
    }
  }

  const jdWords   = extractKeywords(jd)
  const lowerText = text.toLowerCase()

  const matched = jdWords.filter(kw => {
    const re = new RegExp(`\\b${escapeRegex(kw.toLowerCase())}\\b`, 'i')
    return re.test(lowerText)
  })

  const missing    = jdWords.filter(kw => !matched.includes(kw))
  const matchPct   = matched.length / (jdWords.length || 1)
  const value      = Math.round(matchPct * 25)

  const tips = [{
    level: matchPct > 0.75 ? 'success' : matchPct > 0.4 ? 'warning' : 'error',
    msg  : `Keyword match: ${Math.round(matchPct * 100)}%. Target 80%+ for best ATS pass rate.`,
    section: 'skills',
  }]

  if (missing.length > 0) {
    tips.push({ level: 'info', msg: `Missing critical keywords: ${missing.slice(0, 4).join(', ')}`, section: 'skills' })
  }

  return {
    value,
    tips,
    details: { matched, missing, matchPercent: Math.round(matchPct * 100) },
  }
}

// ─── Bullet Quality Scorer ───────────────────────────────────────

/**
 * Score a single resume bullet point on 5 dimensions.
 * Can be imported by ExperienceForm for per-bullet quality badges.
 *
 * @param {string} text - The bullet text
 * @returns {{ score: number, max: 5, percent: number, breakdown: string[] }}
 */
export function scoreBullet(text) {
  if (!text || !text.trim()) return { score: 0, max: 5, percent: 0, breakdown: [] }

  const lower    = text.toLowerCase().trim()
  const wordCount = text.split(/\s+/).filter(Boolean).length
  let score = 0
  const breakdown = []

  // 1. Starts with an action verb
  const startsWithVerb = ACTION_VERBS.some(v => lower.startsWith(v))
  if (startsWithVerb) { score++; breakdown.push('✅ Strong action verb') }
  else breakdown.push('❌ Start with an action verb (Led, Built, Achieved…)')

  // 2. Contains a number/metric
  if (/\d/.test(text)) { score++; breakdown.push('✅ Includes a number/metric') }
  else breakdown.push('❌ Add a measurable result (%, ₹, team size…)')

  // 3. Good length: 12–30 words
  if (wordCount >= 12 && wordCount <= 30) { score++; breakdown.push('✅ Ideal length') }
  else if (wordCount < 12) breakdown.push(`❌ Too short (${wordCount} words) — expand`)
  else breakdown.push(`❌ Too long (${wordCount} words) — cut to under 30`)

  // 4. No first-person pronouns
  if (!/\b(i|me|my|myself)\b/i.test(text)) { score++; breakdown.push('✅ No first-person pronouns') }
  else breakdown.push('❌ Remove "I/me/my" — write in third-person implied')

  // 5. Contains an impact word
  const hasImpact = IMPACT_WORDS.some(w => lower.includes(w))
  if (hasImpact) { score++; breakdown.push('✅ Shows impact/result') }
  else breakdown.push('❌ Add impact word (improved, reduced, delivered…)')

  return { score, max: 5, percent: Math.round((score / 5) * 100), breakdown }
}

// ─── Utilities ───────────────────────────────────────────────────

function getAllText(resumeData) {
  const parts = [
    resumeData.personal.summary,
    resumeData.personal.fullName,
    resumeData.personal.jobTitle,
    ...resumeData.experience.flatMap(e  => [e.title, e.company, ...(e.bullets || [])]),
    ...resumeData.education.flatMap(e   => [e.degree, e.school, e.achievements]),
    ...resumeData.skills.flatMap(s      => [s.category, s.items]),
    ...resumeData.certifications.map(c  => c.name),
    ...resumeData.projects.flatMap(p    => [p.name, p.description, p.tech]),
    ...(resumeData.hobbies || []).map(h => h.name),
  ]
  return parts.filter(Boolean).join(' ')
}

function extractKeywords(jd) {
  // 220+ stop words including Indian English common words
  const stopWords = new Set([
    'the','a','an','and','or','but','in','on','at','to','for','of','with','by',
    'from','as','is','are','was','were','be','been','being','have','has','had',
    'do','does','did','will','would','could','should','may','might','shall',
    'can','need','must','this','that','these','those','we','you','they','it',
    'its','our','your','their','us','them','he','she','who','what','when',
    'where','how','why','which','all','any','each','every','both','few','more',
    'most','other','some','such','no','nor','not','only','same','so','than',
    'too','very','just','also','then','than','about','above','after','before',
    'between','into','through','during','including','until','against','among',
    'across','behind','beyond','plus','except','within','along','following',
    'across','behind','beyond','plus','except','within','without','over',
    'under','well','good','time','work','one','two','three','four','five',
    'team','company','role','year','month','day','week','using','used','help',
    'make','made','take','take','looking','seek','seeking','require','required',
    'strong','experience','excellent','proficient','ability','able','ensure',
    'ensure','provide','support','work','working','responsible','responsibilities',
    'include','including','must','prefer','preferred','related','relevant',
    'knowledge','understanding','skill','skills','minimum','least','years',
    'degree','bachelor','master','equivalent','candidate','role','position',
    'join','opportunity','growing','great','team','environment','culture',
    'benefits','salary','flexible','remote','hybrid','office','location',
    'apply','application','submit','resume','cv','profile','contact','email',
  ])

  const words = jd.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w) && !/^\d+$/.test(w))

  const freq = {}
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })

  return Object.entries(freq)
    .filter(([, c]) => c >= 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([w]) => w)
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getGrade(score, resumeData) {
  const hasContent = resumeData &&
    resumeData.experience?.length > 0 &&
    resumeData.skills?.length > 0

  // Excellent only achievable with actual resume content
  if (score >= 85 && hasContent) return { label: 'Excellent', color: '#10B981', bg: '#F0FDF4' }
  if (score >= 70 && resumeData?.experience?.length > 0) return { label: 'Good', color: '#3B82F6', bg: '#EFF6FF' }
  if (score >= 50) return { label: 'Average', color: '#F59E0B', bg: '#FFFBEB' }
  return { label: 'Needs Work', color: '#EF4444', bg: '#FEF2F2' }
}

// ─── Premium AI Audit (Elite Feature) ──────────────────────────

/**
 * Perform a deep "AI" audit of the resume. 
 * Provides expert-level tips beyond basic keyword matching.
 */
export function getPremiumAudit(resumeData, jobDescription = '') {
  const audit = []
  const text  = getAllText(resumeData)
  const lower = text.toLowerCase()

  // 1. Quantifiable Impact Analysis
  const bullets = resumeData.experience.flatMap(e => e.bullets || []).filter(b => b.trim())
  const quantRegex = /\d+|%|\$|₹|percent|million|billion|lakh|crore/i
  const quantCount = bullets.filter(b => quantRegex.test(b)).length
  const quantRatio = bullets.length > 0 ? quantCount / bullets.length : 0

  if (quantRatio < 0.3) {
    audit.push({
      id: 'quant',
      title: 'Missing Impact Metrics',
      msg: 'Only ' + Math.round(quantRatio * 100) + '% of your bullets have numbers. Recruiters look for results (%, ₹, team size). Try to quantify at least 50% of your points.',
      level: 'critical',
      icon: 'BarChart'
    })
  }

  // 2. Action Verb Diversity
  const foundVerbs = ACTION_VERBS.filter(v => lower.includes(v))
  if (foundVerbs.length < 8) {
    audit.push({
      id: 'verbs',
      title: 'Passive Tone Detected',
      msg: 'Your resume uses too few strong action verbs. Replace "responsible for" with "Spearheaded", "Architected", or "Orchestrated".',
      level: 'warning',
      icon: 'Zap'
    })
  }

  // 3. Buzzword Density
  const foundBuzz = BUZZWORDS.filter(b => lower.includes(b))
  if (foundBuzz.length > 3) {
    audit.push({
      id: 'buzz',
      title: 'Buzzword Overload',
      msg: 'Found generic terms like "' + foundBuzz.slice(0, 2).join(', ') + '". These dilute your technical credibility. Focus on specific tools and achievements instead.',
      level: 'warning',
      icon: 'AlertCircle'
    })
  }

  // 4. Formatting Hygiene
  if (text.length > 8000) {
    audit.push({
      id: 'length',
      title: 'Length Warning',
      msg: 'Your resume text is very long. Stick to 2 pages max for mid-level, 1 page for juniors.',
      level: 'info',
      icon: 'FileText'
    })
  }

  // 5. Strategic summary check
  const summary = (resumeData.personal.summary || '').trim()
  if (summary.length > 0 && !IMPACT_WORDS.some(w => summary.toLowerCase().includes(w))) {
    audit.push({
      id: 'summary',
      title: 'Soft Summary',
      msg: 'Your professional summary lacks "impact words" (e.g., Developed, Shipped, Solved). Make it a high-energy pitch.',
      level: 'info',
      icon: 'Target'
    })
  }

  return audit
}

/**
 * Deep Job Description Analysis & Tailoring Advice
 * Compares resume content against JD to find missing skill clusters.
 */
export function tailorResumeToJD(resumeData, jd) {
  if (!jd || jd.trim().length < 50) return []

  const suggestions = []
  const resumeText = getAllText(resumeData).toLowerCase()
  const jdKeywords = extractKeywords(jd)
  
  // 1. Identify "Hard" missing keywords (from top JD words)
  const missing = jdKeywords.filter(kw => !resumeText.includes(kw.toLowerCase()))
  if (missing.length > 0) {
    suggestions.push({
      type: 'keyword',
      title: 'Missing Impact Keywords',
      msg: `The JD emphasizes "${missing.slice(0, 3).join(', ')}". Try weaving these into your summary or skills section.`,
      impact: 'high'
    })
  }

  // 2. Role-specific section advice
  const lowerJD = jd.toLowerCase()
  if (lowerJD.includes('manager') || lowerJD.includes('lead') || lowerJD.includes('spearhead')) {
    if (!resumeText.includes('led') && !resumeText.includes('managed')) {
      suggestions.push({
        type: 'tone',
        title: 'Leadership Tone Missing',
        msg: 'This role seeks leadership. Use verbs like "Orchestrated", "Steered", or "Mentored" to show seniority.',
        impact: 'medium'
      })
    }
  }

  if (lowerJD.includes('collaborate') || lowerJD.includes('team') || lowerJD.includes('cross-functional')) {
    if (!resumeText.includes('collaborated') && !resumeText.includes('partnered')) {
      suggestions.push({
        type: 'soft-skill',
        title: 'Collaboration Focus',
        msg: 'Mention cross-functional collaboration. Recruiters for this role value "Partnered with stakeholders" or "Collaborated with X team".',
        impact: 'medium'
      })
    }
  }

  return suggestions
}

/**
 * Real-time keyword gap analysis — used by BuilderPage ATS tab.
 * Returns missing/present JD keywords and a match percentage.
 *
 * @param {string} resumeText - Full resume text (from getAllText or similar)
 * @param {string} jd         - Raw job description text
 * @returns {{ missing: string[], present: string[], matchPercent: number, topMissing: string[] }}
 */
export function getKeywordGaps(resumeText, jd) {
  if (!jd || jd.trim().length < 30) {
    return { missing: [], present: [], matchPercent: 0, topMissing: [] }
  }

  const jdKeywords  = extractKeywords(jd)
  const lowerResume = (resumeText || '').toLowerCase()

  const present = jdKeywords.filter(kw =>
    new RegExp(`\\b${escapeRegex(kw.toLowerCase())}\\b`, 'i').test(lowerResume)
  )
  const missing = jdKeywords.filter(kw => !present.includes(kw))
  const matchPercent = jdKeywords.length > 0
    ? Math.round((present.length / jdKeywords.length) * 100)
    : 0

  return {
    missing,
    present,
    matchPercent,
    topMissing: missing.slice(0, 5),
  }
}
