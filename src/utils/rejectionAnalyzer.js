/**
 * Rejection Analyzer — Auto-Rejection Signal Engine
 * ─────────────────────────────────────────────────────────────────
 * Identifies the specific reasons a resume gets auto-rejected BEFORE
 * a human ever reads it. Rule-based, India job market calibrated.
 *
 * Returns:
 *   rejections[]   — critical issues that cause auto-rejection
 *   warnings[]     — issues that reduce callback rate
 *   passedChecks[] — things the resume does well
 *   rejectionRisk  — 'high' | 'medium' | 'low'
 */

// Weak filler phrases that signal generic, lazy writing to recruiters
const FILLER_PHRASES = [
  'responsible for', 'duties included', 'worked on', 'helped with',
  'assisted in', 'participated in', 'was involved in', 'contributed to',
  'team player', 'hard worker', 'self-motivated', 'passionate about',
  'results-oriented', 'detail-oriented', 'quick learner', 'go-getter',
  'highly skilled', 'proven track record', 'dynamic professional',
  'strategic thinker', 'out-of-the-box', 'synergy',
]

// Generic / meaningless job titles that look unprofessional
const VAGUE_TITLES = [
  'freelancer', 'professional', 'expert', 'specialist at', 'guru', 'ninja', 'rockstar', 'wizard',
]

/**
 * Analyze a resume for auto-rejection signals.
 * @param {object} resumeData - Zustand resumeData object
 * @returns {{ rejections, warnings, passedChecks, rejectionRisk, score }}
 */
export function analyzeRejectionRisk(resumeData) {
  if (!resumeData?.personal) {
    return { rejections: [], warnings: [], passedChecks: [], rejectionRisk: 'high', score: 0 }
  }

  const { personal, experience = [], skills = [], education = [] } = resumeData
  const allBullets = experience.flatMap(e => e.bullets || []).filter(b => b?.trim())
  const allText = [
    personal.summary,
    ...experience.flatMap(e => [e.title, e.company, ...(e.bullets || [])]),
    ...skills.flatMap(s => s.items),
  ].filter(Boolean).join(' ').toLowerCase()

  const rejections = []
  const warnings   = []
  const passedChecks = []

  // ── CRITICAL: Auto-rejection triggers ───────────────────────────

  // 1. Missing contact essentials
  if (!personal.email?.trim()) {
    rejections.push({
      id: 'no_email',
      severity: 'critical',
      title: 'No Email Address',
      detail: 'ATS systems parse email first. Missing email = immediate discard.',
      fix: 'Add your professional email in Personal Info.',
      section: 'personal',
    })
  }

  if (!personal.phone?.trim()) {
    rejections.push({
      id: 'no_phone',
      severity: 'critical',
      title: 'No Phone Number',
      detail: 'Recruiters cannot call you without a phone number. This alone causes rejection.',
      fix: 'Add your 10-digit mobile number.',
      section: 'personal',
    })
  }

  // 2. Zero professional summary
  const summaryWords = (personal.summary || '').trim().split(/\s+/).filter(Boolean).length
  if (summaryWords === 0) {
    rejections.push({
      id: 'no_summary',
      severity: 'critical',
      title: 'No Professional Summary',
      detail: 'Recruiters spend 6 seconds on a resume. No summary = no story. You get skipped.',
      fix: 'Write a 2–3 sentence summary: who you are, what you offer, what you want.',
      section: 'personal',
    })
  }

  // 3. No experience at all
  if (experience.length === 0) {
    rejections.push({
      id: 'no_experience',
      severity: 'critical',
      title: 'No Work Experience',
      detail: 'Every ATS system requires at least one experience entry to parse the candidate properly.',
      fix: 'Add internships, freelance projects, or volunteer work if formal jobs are lacking.',
      section: 'experience',
    })
  }

  // 4. No skills section
  if (skills.length === 0) {
    rejections.push({
      id: 'no_skills',
      severity: 'critical',
      title: 'Skills Section Missing',
      detail: 'ATS keyword filters look in the skills section first. No skills = 0% keyword match rate.',
      fix: 'Add at least 3–5 technical and soft skills relevant to your target role.',
      section: 'skills',
    })
  }

  // 5. Bullets with zero quantification
  if (allBullets.length > 0) {
    const quantRegex = /\d+|%|₹|\$|percent|million|billion|lakh|crore|cr\b/i
    const quantifiedCount = allBullets.filter(b => quantRegex.test(b)).length
    const quantRatio = quantifiedCount / allBullets.length

    if (quantRatio === 0) {
      rejections.push({
        id: 'no_metrics',
        severity: 'critical',
        title: '0% of Bullets Have Numbers',
        detail: 'Recruiters filter for impact. Bullets without numbers read like job descriptions, not achievements. You look interchangeable.',
        fix: 'Add at least one number to each bullet: team size, % improvement, ₹ value, time saved.',
        section: 'experience',
      })
    } else if (quantRatio < 0.3) {
      warnings.push({
        id: 'low_metrics',
        severity: 'warning',
        title: `Only ${Math.round(quantRatio * 100)}% of Bullets Are Quantified`,
        detail: `You have ${quantifiedCount} of ${allBullets.length} bullets with numbers. Top candidates hit 60%+.`,
        fix: 'Add metrics to your weakest bullets — even rough estimates (e.g., "~40% improvement") are better than none.',
        section: 'experience',
      })
    } else {
      passedChecks.push({ id: 'metrics_ok', title: 'Good use of metrics in bullets' })
    }
  }

  // ── WARNINGS: High-reduction triggers ───────────────────────────

  // 6. Generic filler language
  const foundFillers = FILLER_PHRASES.filter(fp => allText.includes(fp.toLowerCase()))
  if (foundFillers.length >= 3) {
    warnings.push({
      id: 'filler_language',
      severity: 'warning',
      title: 'Filler Phrases Detected',
      detail: `"${foundFillers.slice(0, 2).join('", "')}" — these phrases signal zero impact. Recruiters ignore resumes that describe duties instead of achievements.`,
      fix: 'Replace filler verbs with strong action verbs: "Led", "Built", "Delivered", "Drove".',
      section: 'experience',
    })
  } else if (foundFillers.length > 0) {
    warnings.push({
      id: 'minor_fillers',
      severity: 'warning',
      title: `${foundFillers.length} Weak Phrase(s) Found`,
      detail: `"${foundFillers[0]}" weakens your bullets. Recruiters want impact, not descriptions.`,
      fix: `Replace "${foundFillers[0]}" with a strong action verb.`,
      section: 'experience',
    })
  } else {
    passedChecks.push({ id: 'no_fillers', title: 'No filler phrases — clean, strong language' })
  }

  // 7. LinkedIn missing
  if (!personal.linkedin?.trim()) {
    warnings.push({
      id: 'no_linkedin',
      severity: 'warning',
      title: 'LinkedIn Profile Missing',
      detail: 'Over 87% of Indian recruiters check LinkedIn before calling. Missing URL = credibility gap.',
      fix: 'Add your LinkedIn URL in Personal Info (linkedin.com/in/yourname).',
      section: 'personal',
    })
  } else {
    passedChecks.push({ id: 'linkedin_ok', title: 'LinkedIn URL present — boosts recruiter trust' })
  }

  // 8. Summary too short
  if (summaryWords > 0 && summaryWords < 30) {
    warnings.push({
      id: 'summary_weak',
      severity: 'warning',
      title: `Summary Too Short (${summaryWords} words)`,
      detail: 'A 30-word summary is a sentence, not a pitch. It tells the recruiter nothing about your value.',
      fix: 'Expand to 50–100 words. Cover: your title, top skill, biggest impact, and what you\'re seeking.',
      section: 'personal',
    })
  } else if (summaryWords >= 50) {
    passedChecks.push({ id: 'summary_ok', title: 'Professional summary has good depth' })
  }

  // 9. Bullets too long
  const longBullets = allBullets.filter(b => b.split(/\s+/).length > 40)
  if (longBullets.length > 0) {
    warnings.push({
      id: 'long_bullets',
      severity: 'warning',
      title: `${longBullets.length} Bullet(s) Too Long`,
      detail: 'ATS parsers truncate text. Recruiters skim. Bullets over 40 words get ignored.',
      fix: 'Cut every bullet to 15–25 words. Lead with the result, then the action.',
      section: 'experience',
    })
  }

  // 10. Experience bullets missing
  const expWithoutBullets = experience.filter(e => (e.bullets || []).filter(b => b?.trim()).length === 0)
  if (expWithoutBullets.length > 0) {
    warnings.push({
      id: 'empty_bullets',
      severity: 'warning',
      title: `${expWithoutBullets.length} Role(s) Have No Bullet Points`,
      detail: 'Empty experience entries tell the recruiter nothing about what you actually did.',
      fix: 'Add 2–4 achievement bullets per role. Focus on what YOU delivered, not your team.',
      section: 'experience',
    })
  }

  // ── PASSES: Things the resume does right ────────────────────────

  if (personal.email && personal.phone && personal.location) {
    passedChecks.push({ id: 'contact_complete', title: 'Contact info complete' })
  }

  if (education.length > 0) {
    passedChecks.push({ id: 'edu_ok', title: 'Education section present' })
  }

  if (experience.length >= 2) {
    passedChecks.push({ id: 'exp_depth', title: 'Multiple work experiences — shows career progression' })
  }

  // ── Risk level ───────────────────────────────────────────────────
  let rejectionRisk = 'low'
  if (rejections.length >= 3) rejectionRisk = 'high'
  else if (rejections.length >= 1 || warnings.length >= 3) rejectionRisk = 'medium'

  const score = Math.max(0, 100 - (rejections.length * 20) - (warnings.length * 8))

  return { rejections, warnings, passedChecks, rejectionRisk, score }
}
