/**
 * InterviewPrepPage — AI Interview Prep Module
 * ─────────────────────────────────────────────────────────────────
 * Route: /interview-prep (Pro-gated)
 *
 * Layout:
 * - Header: Job Title + Company inputs + Generate button
 * - Tab bar: Technical | Behavioral | Company Fit | Salary Negotiation
 * - Question cards: Question → expandable Model Answer → User Answer textarea → Difficulty
 * - Progress: X of 12 practiced
 * - Practice Mode: hides model answers until revealed
 * - Free users see 2 blurred questions + upgrade CTA
 */
import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, ChevronDown, ChevronUp, Eye, EyeOff, Loader, Sparkles,
  CheckCircle2, Lock, Crown, Target, Users, DollarSign,
  RefreshCw, Lightbulb, Trophy, Zap, AlertCircle,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useResumeStore } from '../store/resumeStore'
import { useAuthStore } from '../store/authStore'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

const TABS = [
  { id: 'technical',          label: 'Technical',         icon: Brain,       color: '#6366F1', badge: 3 },
  { id: 'behavioral',         label: 'Behavioral',        icon: Users,       color: '#0E9F6E', badge: 3 },
  { id: 'company_fit',        label: 'Company Fit',       icon: Target,      color: '#F59E0B', badge: 3 },
  { id: 'salary_negotiation', label: 'Salary & Offer',    icon: DollarSign,  color: '#EC4899', badge: 3 },
]

const DIFFICULTY_COLORS = {
  easy:   { bg: '#D1FAE5', text: '#059669' },
  medium: { bg: '#FEF3C7', text: '#D97706' },
  hard:   { bg: '#FEE2E2', text: '#DC2626' },
}

/**
 * Individual question card with reveal-on-click model answer
 */
function QuestionCard({ item, index, practiceMode, practiced, onTogglePracticed, isLocked }) {
  const [expanded, setExpanded]       = useState(false)
  const [userAnswer, setUserAnswer]   = useState('')
  const [showAnswer, setShowAnswer]   = useState(false)

  const diffColor = DIFFICULTY_COLORS[item.difficulty] || DIFFICULTY_COLORS.medium

  if (isLocked) {
    return (
      <div className="relative rounded-2xl border-2 border-dashed border-gray-200 p-5 overflow-hidden">
        <div className="filter blur-sm pointer-events-none">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <Lock size={20} className="text-gray-400 mb-2" />
          <Link to="/upgrade" className="text-xs font-black text-brand-600 uppercase tracking-wider hover:underline">
            Upgrade to Pro to unlock →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-2xl border-2 transition-all ${
        practiced
          ? 'border-emerald-200 bg-emerald-50/30'
          : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
    >
      {/* Question header */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Index */}
          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-500 flex-shrink-0 mt-0.5">
            {index + 1}
          </div>

          <div className="flex-1 min-w-0">
            {/* Difficulty badge */}
            {item.difficulty && (
              <span
                className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-2"
                style={{ background: diffColor.bg, color: diffColor.text }}
              >
                {item.difficulty}
              </span>
            )}
            {item.framework && (
              <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ml-1.5 bg-blue-50 text-blue-600">
                {item.framework}
              </span>
            )}

            {/* Question text */}
            <p className="text-sm font-bold text-gray-900 leading-relaxed">{item.question}</p>

            {/* Tip */}
            {item.tip && (
              <div className="mt-2 flex items-start gap-1.5 text-[10px] text-amber-600 bg-amber-50 rounded-lg px-2.5 py-1.5">
                <Lightbulb size={10} className="flex-shrink-0 mt-0.5" />
                <span className="font-medium">{item.tip}</span>
              </div>
            )}
          </div>

          {/* Practiced toggle */}
          <button
            onClick={onTogglePracticed}
            className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${
              practiced
                ? 'bg-emerald-500 text-white'
                : 'bg-gray-100 text-gray-300 hover:bg-gray-200'
            }`}
            title={practiced ? 'Mark as not practiced' : 'Mark as practiced'}
          >
            <CheckCircle2 size={14} />
          </button>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 ml-9 flex items-center gap-1.5 text-[10px] font-black text-gray-400 hover:text-gray-700 uppercase tracking-wider transition-colors"
        >
          {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded ? 'Collapse' : 'Practice this question'}
        </button>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 ml-9 space-y-3 border-t border-gray-100 pt-3">
              {/* Your answer textarea */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1.5">
                  Your Answer (practice)
                </label>
                <textarea
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Type your answer here to practice..."
                  rows={4}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all resize-none"
                />
              </div>

              {/* Model answer reveal */}
              {practiceMode ? (
                <div>
                  {!showAnswer ? (
                    <button
                      onClick={() => setShowAnswer(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-black rounded-xl uppercase tracking-wider hover:bg-gray-800 transition-all"
                    >
                      <Eye size={12} /> Reveal Model Answer
                    </button>
                  ) : (
                    <div>
                      <button
                        onClick={() => setShowAnswer(false)}
                        className="flex items-center gap-1.5 text-[10px] text-gray-400 hover:text-gray-600 font-bold mb-2 uppercase tracking-wider"
                      >
                        <EyeOff size={10} /> Hide Answer
                      </button>
                      <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <div className="text-[9px] font-black text-indigo-400 uppercase tracking-wider mb-1.5">
                          Model Answer
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{item.modelAnswer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="text-[9px] font-black text-indigo-400 uppercase tracking-wider mb-1.5">
                    Model Answer
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{item.modelAnswer}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────
// MAIN InterviewPrepPage
// ─────────────────────────────────────────────────────────────────
export default function InterviewPrepPage() {
  const { resumeData } = useResumeStore()
  const { user, plan, testMode } = useAuthStore()
  const isPro = plan === 'pro' || testMode

  const [jobTitle, setJobTitle]     = useState(resumeData?.personal?.jobTitle || '')
  const [company, setCompany]       = useState('')
  const [activeTab, setActiveTab]   = useState('technical')
  const [practiceMode, setPracticeMode] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions]   = useState(null)
  const [practiced, setPracticed]   = useState({}) // { "technical-0": true, ... }
  const [showBulletHints, setShowBulletHints] = useState(true)

  // Extract resume bullets with their experience context
  const resumeBullets = (resumeData?.experience || []).flatMap(exp =>
    (exp.bullets || []).filter(b => b?.trim().length > 20).map(bullet => ({
      bullet,
      role   : exp.title || '',
      company: exp.company || '',
    }))
  ).slice(0, 6)

  // Generate resume-anchored question hints from bullets
  const bulletHints = resumeBullets.map(({ bullet, role, company }) => {
    const hasMetric = /\d+|%|₹|\$|lakh|crore/i.test(bullet)
    const hasLead   = /\b(led|managed|owned|headed|drove|orchestrated|spearheaded)\b/i.test(bullet)
    const hasImpact = /\b(improved|reduced|increased|saved|delivered|built|launched)\b/i.test(bullet)
    const questions = []

    // Generic template driven from bullet content
    questions.push(`"Tell me more about: ${bullet.slice(0, 70)}${bullet.length > 70 ? '…' : ''}" — Be ready to go 2 levels deeper.`)
    if (hasMetric)  questions.push('"How did you measure that result? What was your methodology?"')
    if (hasLead)    questions.push('"What was the biggest challenge with that team/initiative?"')
    if (hasImpact)  questions.push('"What would have happened if you hadn\'t made this change?"')

    return { bullet, role, company, questions }
  })

  const p = resumeData?.personal || {}
  const skills = (resumeData?.skills || []).slice(0, 3).map(s => s.items).join(', ')
  const experience = (resumeData?.experience || []).slice(0, 2)
    .map(e => `${e.title} at ${e.company}`)
    .join(', ')

  const handleGenerate = useCallback(async () => {
    if (!jobTitle.trim()) {
      toast.error('Please enter a Job Title first.')
      return
    }

    setIsGenerating(true)
    setQuestions(null)
    setPracticed({})

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const jwt = session?.access_token

      const controller = new AbortController()
      const timeoutId  = setTimeout(() => controller.abort(), 60000)

      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-interview-questions`, {
        method : 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${jwt || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        signal: controller.signal,
        body  : JSON.stringify({
          jobTitle,
          company,
          resumeSummary: p.summary || '',
          skills,
          experience,
          location: p.location || 'India',
        }),
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || `Request failed (${res.status})`)
      }

      const json = await res.json().catch(() => null)
      if (!json?.ok) throw new Error(json?.error || 'Generation failed')

      setQuestions(json.data)
      toast.success('12 questions generated! 🎯')

    } catch (err) {
      if (err.name === 'AbortError') {
        toast.error('Request timed out. Please try again.')
      } else {
        toast.error(err.message || 'Generation failed. Try again.')
      }
    } finally {
      setIsGenerating(false)
    }
  }, [jobTitle, company, p.summary, skills, experience, p.location])

  const togglePracticed = (tabId, idx) => {
    const key = `${tabId}-${idx}`
    setPracticed(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const totalPracticed = Object.values(practiced).filter(Boolean).length
  const totalQuestions = questions
    ? Object.values(questions).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0)
    : 12

  const activeQ = questions?.[activeTab] || []

  const freePreviewData = {
    technical          : [{ question: "Walk me through your most impactful project and the technical decisions you made.", difficulty: "medium", modelAnswer: "I built a real-time notification service at my last company that served 50K users. I chose WebSockets over polling, used Redis pub/sub for fan-out, and implemented circuit breakers to handle downstream failures gracefully.", tip: "Focus on your specific contributions and the 'why' behind each decision." }],
    behavioral         : [{ question: "Tell me about a time you faced a tight deadline. How did you handle it?", framework: "STAR", modelAnswer: "Situation: Our product launch was moved up by 2 weeks. Task: I had to deliver 3 features solo. Action: I re-scoped with PM to cut 40% of non-critical work, focused on the core user journey, and shipped on time. Result: Launch succeeded, NPS jumped by 15 points.", tip: "Use the STAR method — Situation, Task, Action, Result." }],
    company_fit        : [{ question: "Why do you want to join our company specifically?", modelAnswer: "Your focus on building for Bharat resonates with me deeply. I've followed your journey from Series A, and the way you've balanced scale with unit economics shows strong product discipline. I want to contribute to the next phase of growth." }],
    salary_negotiation : [{ question: "What are your salary expectations for this role?", modelAnswer: "Based on my research and my experience, I'm targeting ₹18–22 LPA. That said, I'm flexible based on the overall package, growth trajectory, and equity component." }],
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #F0F4FF 0%, #FAFAFF 40%, #F0FFF8 100%)' }}>
      {/* Page header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-lg sticky top-20 z-30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Brain size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-950 tracking-tight">AI Interview Prep</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">India-Optimized · 12 Questions · GPT-4</p>
            </div>
            {!isPro && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                <Crown size={9} /> Pro Feature
              </span>
            )}
          </div>

          {questions && (
            <div className="flex items-center gap-3">
              {/* Practice mode toggle */}
              <button
                onClick={() => setPracticeMode(!practiceMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  practiceMode
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {practiceMode ? <EyeOff size={12} /> : <Eye size={12} />}
                {practiceMode ? 'Practice Mode ON' : 'Show Answers'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Premium Hero Banner */}
      <div className="relative bg-gray-950 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-20" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-violet-600 rounded-full blur-[100px] opacity-15" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 glass-dark rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">
                <Brain size={10} /> AI-Powered Interview Coach · GPT-4
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 leading-tight">
                Ace Every Interview<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                  with AI-Personalized Questions
                </span>
              </h1>
              <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-lg">
                12 custom questions tailored to your resume + target role across Technical, Behavioral, Company Fit & Salary tracks.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: '🧠', label: 'Technical' },
                { icon: '🤝', label: 'Behavioral' },
                { icon: '🎯', label: 'Company Fit' },
                { icon: '💰', label: 'Salary' },
              ].map(chip => (
                <div key={chip.label} className="flex items-center gap-1.5 px-3 py-2 glass-dark rounded-xl text-xs font-bold text-gray-300">
                  <span>{chip.icon}</span> {chip.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── Generator form ─── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Job Title *</label>
              <input
                type="text"
                value={jobTitle}
                onChange={e => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-600 mb-1.5">Company Name</label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="e.g. Infosys, Razorpay, Google"
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>
            <div className="flex items-end">
              {isPro ? (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !jobTitle}
                  className="h-[46px] px-6 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-black text-sm rounded-xl hover:shadow-lg hover:shadow-indigo-200/80 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center gap-2 whitespace-nowrap"
                >
                  {isGenerating
                    ? <><Loader size={14} className="animate-spin" /> Generating…</>
                    : questions
                      ? <><RefreshCw size={14} /> Regenerate</>
                      : <><Sparkles size={14} /> Generate Questions</>
                  }
                </button>
              ) : (
                <Link
                  to="/upgrade"
                  className="h-[46px] px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm rounded-xl flex items-center gap-2 whitespace-nowrap hover:shadow-lg hover:shadow-amber-200/80 hover:-translate-y-0.5 transition-all"
                >
                  <Crown size={14} /> Upgrade for AI Prep
                </Link>
              )}
            </div>
          </div>

          {/* Auto-fill note */}
          {(p.summary || skills) && (
            <p className="mt-3 text-xs text-indigo-500 font-medium">
              ✓ Auto-using your resume data for personalized questions
            </p>
          )}
        </div>

        {/* ── Resume-Anchored Question Hints ─── */}
        {bulletHints.length > 0 && (
          <div className="mb-6 bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <button
              onClick={() => setShowBulletHints(!showBulletHints)}
              className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap size={14} className="text-indigo-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-black text-gray-900">Resume-Anchored Questions</div>
                <div className="text-[10px] text-gray-400 font-medium mt-0.5">
                  Questions interviewers WILL ask based on your actual resume bullets
                </div>
              </div>
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                {bulletHints.length} bullets analyzed
              </span>
              {showBulletHints ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
            </button>

            {showBulletHints && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {bulletHints.map((hint, i) => (
                  <div key={i} className="px-5 py-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[9px] font-black text-white">{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                          {hint.role}{hint.company ? ` · ${hint.company}` : ''}
                        </div>
                        <p className="text-xs text-gray-700 font-medium italic leading-relaxed">
                          "{hint.bullet}"
                        </p>
                      </div>
                    </div>
                    <div className="ml-8 space-y-1.5">
                      {hint.questions.map((q, qi) => (
                        <div key={qi} className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                          <AlertCircle size={11} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <p className="text-[10px] text-amber-800 font-medium leading-relaxed">{q}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Free user preview ─── */}
        {!isPro && (
          <div className="mb-6">
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 text-center">
              <Crown size={24} className="text-amber-500 mx-auto mb-3" />
              <h2 className="font-black text-gray-900 mb-2">AI Interview Prep Preview</h2>
              <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
                Here's a sample of what Pro members get — 12 personalized questions with model answers for every interview.
              </p>
              <div className="grid md:grid-cols-2 gap-3 text-left mb-4">
                {Object.entries(freePreviewData).slice(0, 2).map(([key, arr]) => (
                  arr.map((item, i) => (
                    <QuestionCard
                      key={`${key}-${i}`}
                      item={item}
                      index={i}
                      practiceMode={false}
                      practiced={false}
                      onTogglePracticed={() => {}}
                      isLocked={false}
                    />
                  ))
                ))}
                <QuestionCard item={{}} index={0} practiceMode={false} practiced={false} onTogglePracticed={() => {}} isLocked={true} />
                <QuestionCard item={{}} index={1} practiceMode={false} practiced={false} onTogglePracticed={() => {}} isLocked={true} />
              </div>
              <Link
                to="/upgrade"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black rounded-2xl hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wide"
              >
                <Crown size={14} /> Unlock All 12 Questions
              </Link>
            </div>
          </div>
        )}

        {/* ── Questions display (Pro only) ─── */}
        {isPro && questions && (
          <>
            {/* Progress bar */}
            <div className="mb-6 p-4 bg-white rounded-2xl border border-gray-100 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-600">Practice Progress</span>
                  <span className="text-xs font-black text-indigo-600">{totalPracticed} / {totalQuestions} practiced</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    animate={{ width: `${(totalPracticed / totalQuestions) * 100}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
              </div>
              {totalPracticed === totalQuestions && (
                <div className="flex items-center gap-2 text-emerald-600 font-black text-sm">
                  <Trophy size={16} /> Completed!
                </div>
              )}
            </div>

            {/* Tab bar */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {TABS.map(tab => {
                const Icon = tab.icon
                const tabQ  = questions[tab.id] || []
                const done  = tabQ.filter((_, i) => practiced[`${tab.id}-${i}`]).length
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                      activeTab === tab.id
                        ? 'bg-white shadow-sm border-2 text-gray-900'
                        : 'bg-gray-100 text-gray-500 hover:bg-white hover:shadow-sm border-2 border-transparent'
                    }`}
                    style={activeTab === tab.id ? { borderColor: tab.color } : {}}
                  >
                    <Icon size={12} style={{ color: tab.color }} />
                    {tab.label}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-black ${done === tab.badge ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                      {done}/{tab.badge}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Question cards */}
            <div className="space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-3"
                >
                  {activeQ.map((item, i) => (
                    <QuestionCard
                      key={`${activeTab}-${i}`}
                      item={item}
                      index={i}
                      practiceMode={practiceMode}
                      practiced={!!practiced[`${activeTab}-${i}`]}
                      onTogglePracticed={() => togglePracticed(activeTab, i)}
                      isLocked={false}
                    />
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </>
        )}

        {/* Empty state for Pro users who haven't generated yet */}
        {isPro && !questions && !isGenerating && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Brain size={32} className="text-indigo-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">Ready for your interview?</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
              Enter the job title and company above, then click "Generate Questions" to get 12 AI-personalized interview questions.
            </p>
            <div className="flex flex-wrap gap-2 justify-center text-xs">
              {['Technical deep-dives', 'STAR behavioral', 'Company culture fit', 'Salary negotiation'].map(f => (
                <span key={f} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-full font-bold border border-indigo-100">
                  ✓ {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {isGenerating && (
          <div className="text-center py-20">
            <Loader size={32} className="animate-spin text-indigo-500 mx-auto mb-4" />
            <p className="text-gray-500 font-bold">Generating personalized questions…</p>
            <p className="text-gray-400 text-sm mt-1">Analyzing your resume and the role (~10-15 seconds)</p>
          </div>
        )}
      </div>
    </div>
  )
}
