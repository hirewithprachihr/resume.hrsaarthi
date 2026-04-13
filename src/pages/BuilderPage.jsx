import { useState, useEffect, useLayoutEffect, useCallback, useMemo, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download, Zap, Sparkles, Save,
  ChevronLeft, ChevronRight,
  BarChart3, Edit3, ZoomIn, ZoomOut, Palette,
  User, Briefcase, GraduationCap, Code2, Award, FolderGit2, Globe, Heart,
  CheckCircle2, AlertCircle, ChevronRight as ChevronRightSm,
  Layers, RefreshCw,
} from 'lucide-react'
import { useResumeStore } from '../store/resumeStore'
import { useAuthStore } from '../store/authStore'
import { scoreResume, getPremiumAudit, tailorResumeToJD, getKeywordGaps } from '../utils/atsScorer'
import { exportToPDF } from '../utils/pdfExporter'
import { getTemplate, TEMPLATES } from '../templates/registry'
import PersonalInfoForm from '../components/ResumeForm/PersonalInfoForm'
import ExperienceForm from '../components/ResumeForm/ExperienceForm'
import { EducationForm, SkillsForm, CertificationsForm, ProjectsForm, LanguagesForm, HobbiesForm } from '../components/ResumeForm/OtherForms'
import AICoachSidebar from '../components/AICoachSidebar'
import SectionReorderUI from '../components/SectionReorderUI'
import ProGate, { ProBadge } from '../components/ProGate'
import UploadResumeModal from '../components/UploadResumeModal'
import ErrorBoundary from '../components/ErrorBoundary'
import ResumeSelector from '../components/ResumeSelector'
import InlineEditTitle from '../components/InlineEditTitle'
import ExportMenu from '../components/ExportMenu'
import AuthModal from '../components/AuthModal'
import NextBestFixes from '../components/NextBestFixes'
import ResumeVersionPanel from '../components/ResumeVersionPanel'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'
import { supabase } from '../services/supabase'
import { useResponsiveScale } from '../hooks/useResponsiveScale'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { EVENT_NAMES, trackEvent } from '../services/analytics'
import { useEntitlements } from '../utils/entitlements'

// ── Section definitions with premium icons ────────────────────────
const FORM_SECTIONS = [
  { id: 'personal',       label: 'Personal Info',   component: PersonalInfoForm,  icon: User,        color: '#6366F1', hint: 'Name, contact, photo & summary' },
  { id: 'experience',     label: 'Experience',       component: ExperienceForm,    icon: Briefcase,   color: '#0E9F6E', hint: 'Work history & achievements' },
  { id: 'education',      label: 'Education',        component: EducationForm,     icon: GraduationCap,color:'#F59E0B', hint: 'Degrees & institutions' },
  { id: 'skills',         label: 'Skills',           component: SkillsForm,        icon: Code2,       color: '#EC4899', hint: 'Technical & soft skills' },
  { id: 'certifications', label: 'Certifications',   component: CertificationsForm,icon: Award,       color: '#8B5CF6', hint: 'Licenses & certificates' },
  { id: 'projects',       label: 'Projects',         component: ProjectsForm,      icon: FolderGit2,  color: '#14B8A6', hint: 'Key work & side projects' },
  { id: 'languages',      label: 'Languages',        component: LanguagesForm,     icon: Globe,       color: '#0EA5E9', hint: 'Languages & proficiency' },
  { id: 'hobbies',        label: 'Interests',        component: HobbiesForm,       icon: Heart,       color: '#F97316', hint: 'Hobbies & personality' },
]

// ── Completeness check ────────────────────────────────────────────
function computeCompleteness(resumeData) {
  const { personal, experience, skills, education } = resumeData
  const checks = [
    { id: 'name',     label: 'Full Name',      done: !!personal.fullName?.trim(),  section: 'personal'   },
    { id: 'email',    label: 'Email',           done: !!personal.email?.trim(),     section: 'personal'   },
    { id: 'phone',    label: 'Phone',           done: !!personal.phone?.trim(),     section: 'personal'   },
    { id: 'location', label: 'Location',        done: !!personal.location?.trim(),  section: 'personal'   },
    { id: 'summary',  label: 'Summary 50+ words', done: (personal.summary||'').trim().split(/\s+/).filter(Boolean).length >= 50, section: 'personal' },
    { id: 'exp',      label: '1+ Experience',   done: experience.length >= 1,       section: 'experience' },
    { id: 'bullets',  label: '2+ Bullets/role', done: experience.every(e => (e.bullets||[]).filter(b=>b.trim()).length >= 2), section: 'experience' },
    { id: 'edu',      label: 'Education',       done: education.length >= 1,        section: 'education'  },
    { id: 'skills',   label: 'Skills',          done: skills.length >= 1,           section: 'skills'     },
    { id: 'linkedin', label: 'LinkedIn URL',    done: !!personal.linkedin?.trim(),  section: 'personal'   },
  ]
  const done = checks.filter(c => c.done).length
  return { checks, percent: Math.round((done / checks.length) * 100) }
}

const ZOOM_KEY = 'hwp-builder-zoom'

// ── Accent color palette ─────────────────────────────────────────
const ACCENT_COLORS = [
  { hex: '#1A56DB', name: 'Navy' },
  { hex: '#0E9F6E', name: 'Emerald' },
  { hex: '#DC2626', name: 'Crimson' },
  { hex: '#7C3AED', name: 'Purple' },
  { hex: '#0891B2', name: 'Cyan' },
  { hex: '#B45309', name: 'Amber' },
  { hex: '#4F46E5', name: 'Indigo' },
  { hex: '#0077B5', name: 'LinkedIn' },
  { hex: '#0f172a', name: 'Charcoal' },
  { hex: '#D4AF37', name: 'Gold' },
]

// ── Premium Section Nav Item ──────────────────────────────────────
function NavItem({ sec, active, completeness, onClick }) {
  const Icon = sec.icon
  const sectionChecks = completeness.checks.filter(c => c.section === sec.id)
  const done  = sectionChecks.filter(c => c.done).length
  const total = sectionChecks.length
  const isComplete = total > 0 ? done === total : true
  const hasData    = total > 0 ? done > 0 : true

  return (
    <motion.button
      onClick={onClick}
      title={sec.hint}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        'relative flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl transition-all duration-200 w-full',
        active
          ? 'bg-white shadow-md border border-gray-100'
          : 'hover:bg-white/60 border border-transparent',
      )}
    >
      <div
        className={clsx('w-9 h-9 rounded-xl flex items-center justify-center transition-all', active ? 'shadow-sm' : '')}
        style={{ background: active ? sec.color + '18' : 'transparent' }}
      >
        <Icon size={16} style={{ color: active ? sec.color : '#9ca3af' }} />
      </div>
      <span className={clsx('text-[7px] font-black uppercase tracking-wide leading-none text-center w-full', active ? 'text-gray-800' : 'text-gray-400')}>
        {sec.label.split(' ')[0].slice(0, 5)}
      </span>

      {/* Completion dot */}
      {total > 0 && (
        <span
          className="absolute top-2 right-2 w-2 h-2 rounded-full border border-white"
          style={{ background: isComplete ? '#10B981' : hasData ? '#F59E0B' : '#E5E7EB' }}
        />
      )}

      {/* Active indicator bar */}
      {active && (
        <motion.div
          layoutId="nav-active"
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full"
          style={{ background: sec.color }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
    </motion.button>
  )
}

// ── ATS Score Ring ────────────────────────────────────────────────
function ATSRing({ score, size = 56 }) {
  if (!score) return null
  const pct = Math.round((score.total / 118) * 100)
  const r   = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="7" />
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={score.grade.color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-base font-black text-gray-900 leading-none">{score.total}</div>
        <div className="text-[7px] font-black uppercase tracking-wider" style={{ color: score.grade.color }}>{score.grade.label}</div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
// MAIN BuilderPage
// ─────────────────────────────────────────────────────────────────
export default function BuilderPage() {
  const [searchParams] = useSearchParams()
  const [activeSection, setActiveSection] = useState('personal')
  const [activeTab, setActiveTab]         = useState('form') // 'form' | 'ats' | 'design'
  const [sidebarOpen, setSidebarOpen]     = useState(true)
  const [showUpload, setShowUpload]       = useState(false)
  const [isExporting, setIsExporting]     = useState(false)
  const [isSaving, setIsSaving]           = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authTrigger, setAuthTrigger]     = useState('save') // 'save' | 'pro'
  const [isAuditing, setIsAuditing]       = useState(false)
  const [auditResults, setAuditResults]   = useState(null)
  const [tailorAdvice, setTailorAdvice]   = useState(null)
  const [isTailoring, setIsTailoring]     = useState(false)
  const [tailorResult, setTailorResult]   = useState(null) // { summary, bullets, addedKeywords, tailoringScore }
  const [showVersionPanel, setShowVersionPanel] = useState(false)

  // Zoom persistence
  const [previewScale, setPreviewScale] = useState(() => {
    const saved = parseFloat(localStorage.getItem(ZOOM_KEY))
    return isNaN(saved) ? 0 : saved
  })
  const [autoScale, setAutoScale] = useState(0.65)
  const activeScale = previewScale > 0 ? previewScale : autoScale

  // ── Mobile detection ─────────────────────────────────────────────
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  // 'edit' | 'score' | 'preview'
  const [mobilePanel, setMobilePanel] = useState('edit')
  const prevAtsTotalRef = useRef(0)

  const {
    resumeData, settings, atsScore, jobDescription,
    setATSScore, setJobDescription, setTemplate, setAccentColor,
    saveResume, cloneResume, isDirty, markAiAssistUsed,
  } = useResumeStore()
  const { user, testMode, setTestMode } = useAuthStore()
  const { isPro } = useEntitlements()

  const template        = getTemplate(settings.templateId)
  const ResumeComponent = template.component
  const previewCanvasRef = useRef(null)
  const [previewPageEstimate, setPreviewPageEstimate] = useState(1)
  const ActiveForm      = FORM_SECTIONS.find(s => s.id === activeSection)?.component
  const activeSecMeta   = FORM_SECTIONS.find(s => s.id === activeSection)

  const completeness = useMemo(() => computeCompleteness(resumeData), [resumeData])

  const PREVIEW_A4_PX = 1123
  useLayoutEffect(() => {
    const el = previewCanvasRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const update = () => {
      const h = el.scrollHeight
      setPreviewPageEstimate(Math.max(1, Math.ceil(h / PREVIEW_A4_PX)))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [resumeData, settings.templateId, settings.accentColor, ResumeComponent])

  // ── Save handler ──────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (isSaving) return

    // Gate for guest users
    if (!user) {
      setAuthTrigger('save')
      setShowAuthModal(true)
      return
    }

    setIsSaving(true)
    try {
      await saveResume(resumeData.personal.fullName || 'My Resume')
      trackEvent(EVENT_NAMES.RESUME_SAVED, { hasName: !!resumeData.personal.fullName?.trim() })
      toast.success('Resume saved to cloud!')
    } finally {
      setIsSaving(false)
    }
  }, [resumeData, saveResume, isSaving, user])

  // ── AI Audit handler ──────────────────────────────────────────
  const handleRunAudit = useCallback(async () => {
    setIsAuditing(true)
    setAuditResults(null)
    setTailorAdvice(null)
    
    // Simulate expensive AI calculation
    await new Promise(r => setTimeout(r, 2200))
    
    const results = getPremiumAudit(resumeData, jobDescription)
    const tailoring = tailorResumeToJD(resumeData, jobDescription)
    
    setAuditResults(results)
    setTailorAdvice(tailoring)
    setIsAuditing(false)
    toast.success('Premium AI Audit Complete!')
  }, [resumeData, jobDescription])

  // ── Tailor Resume handler ─────────────────────────────────────
  const handleTailorResume = useCallback(async () => {
    if (!jobDescription?.trim()) {
      toast.error('Paste a job description first (in the Score tab).')
      return
    }
    if (!isPro) {
      toast.error('AI Tailoring is a Pro feature. Upgrade to unlock!')
      return
    }

    setIsTailoring(true)
    setTailorResult(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const jwt = session?.access_token

      const bullets = (resumeData.experience || []).map(e => ({
        id     : e.id,
        title  : e.title,
        bullets: e.bullets || [],
      }))

      const controller = new AbortController()
      const timeoutId  = setTimeout(() => controller.abort(), 65000)

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tailor-resume`,
        {
          method : 'POST',
          headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${jwt || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          signal: controller.signal,
          body  : JSON.stringify({
            jd     : jobDescription,
            summary: resumeData.personal.summary || '',
            bullets,
          }),
        }
      )

      clearTimeout(timeoutId)

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || `Tailor failed (${res.status})`)
      }

      const json = await res.json().catch(() => null)
      if (!json?.ok) throw new Error(json?.error || 'Tailoring failed')

      setTailorResult(json.data)
      markAiAssistUsed()
      toast.success(`Resume tailored! Keyword match improved to ${json.data.tailoringScore}% ✨`)
    } catch (err) {
      if (err.name === 'AbortError') {
        toast.error('Tailoring timed out. Please try again.')
      } else {
        toast.error(err.message || 'Tailoring failed. Try again.')
      }
    } finally {
      setIsTailoring(false)
    }
  }, [jobDescription, resumeData, isPro])

  // ── PDF export handler ────────────────────────────────────────
  const handleExportPDF = useCallback(async () => {
    setIsExporting(true)
    try {
      await exportToPDF(resumeData, settings, ResumeComponent, resumeData.personal.fullName || 'resume')
      trackEvent(EVENT_NAMES.EXPORT_PDF, { format: 'pdf', templateId: settings.templateId, source: 'builder_shortcut' })
      toast.success('PDF downloaded!')
    } catch {
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }, [resumeData, settings, ResumeComponent])

  // ── Template from URL param ───────────────────────────────────
  useEffect(() => {
    const tpl = searchParams.get('template')
    if (tpl) setTemplate(tpl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Dashboard &quot;Tailor to job&quot; prefill ───────────────────────
  useEffect(() => {
    try {
      const jd = sessionStorage.getItem('hwp-prefill-jd')
      if (jd) {
        setJobDescription(jd)
        sessionStorage.removeItem('hwp-prefill-jd')
      }
      if (sessionStorage.getItem('hwp-open-tab') === 'ats') {
        setActiveTab('ats')
        sessionStorage.removeItem('hwp-open-tab')
      }
    } catch { /* ignore */ }
  }, [setJobDescription])

  // ── ATS auto-score (1.2s debounce) ───────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setATSScore(scoreResume(resumeData, jobDescription)), 1200)
    return () => clearTimeout(t)
  }, [resumeData, jobDescription])

  // ── Analytics: ATS score improvement ──────────────────────────
  useEffect(() => {
    const current = atsScore?.total || 0
    if (current > prevAtsTotalRef.current) {
      trackEvent(EVENT_NAMES.ATS_SCORE_IMPROVED, {
        previous: prevAtsTotalRef.current,
        current,
        delta: current - prevAtsTotalRef.current,
      })
    }
    prevAtsTotalRef.current = current
  }, [atsScore?.total])

  // ── Mobile resize listener ───────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useResponsiveScale({ sidebarOpen, setAutoScale, sidebarWidth: 420 })

  // ── Auto-save 15s ────────────────────────────────────────────
  useEffect(() => {
    if (!isDirty) return
    const t = setTimeout(handleSave, 15000)
    return () => clearTimeout(t)
  }, [isDirty, resumeData, handleSave])

  // ── Save on nav-away ─────────────────────────────────────────
  useEffect(() => {
    const fn = () => { if (isDirty) handleSave() }
    window.addEventListener('beforeunload', fn)
    return () => window.removeEventListener('beforeunload', fn)
  }, [isDirty, handleSave])

  useKeyboardShortcuts({
    onSave: handleSave,
    onExportPdf: handleExportPDF,
    onSectionJump: (idx) => {
      if (FORM_SECTIONS[idx]) setActiveSection(FORM_SECTIONS[idx].id)
    },
    maxSections: 8,
  })


  const handleZoomChange = (val) => {
    setPreviewScale(val)
    if (val > 0) localStorage.setItem(ZOOM_KEY, val.toString())
    else localStorage.removeItem(ZOOM_KEY)
  }

  // ── Sidebar width ─────────────────────────────────────────────
  const SIDEBAR_W = 420

  // ══════════════════════════════════════════════════════════════
  // MOBILE LAYOUT — Tab-driven single-panel view
  // ══════════════════════════════════════════════════════════════
  if (isMobile) {
    const MOBILE_TABS = [
      { id: 'edit',    label: 'Edit',    icon: Edit3    },
      { id: 'score',   label: 'Score',   icon: BarChart3 },
      { id: 'preview', label: 'Preview', icon: ZoomIn   },
    ]

    return (
      <div className="flex flex-col h-[calc(100vh-64px)] bg-[#F0F2F7] overflow-hidden">

        {/* ── Panel area ─────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden relative">

          {/* Edit + Score panels: render sidebar content */}
          {(mobilePanel === 'edit' || mobilePanel === 'score') && (
            <div className="h-full bg-white flex flex-col overflow-hidden">
              {/* Top bar */}
              <div className="flex-shrink-0 h-11 bg-gray-50/80 border-b border-gray-100 flex items-center gap-2 px-3">
                <ResumeSelector />
                <div className="h-4 w-px bg-gray-200" />
                <div className="flex-1 min-w-0"><InlineEditTitle /></div>
              </div>

              {/* Sub-tabs for Edit: Build / Design */}
              {mobilePanel === 'edit' && (
                <div className="flex-shrink-0 flex gap-1 p-1.5 bg-gray-50/80 border-b border-gray-100">
                  {[
                    { id: 'form',   label: 'Build',  icon: Edit3   },
                    { id: 'design', label: 'Design', icon: Palette },
                  ].map(tab => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                          'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all',
                          activeTab === tab.id
                            ? 'bg-gray-900 text-white shadow-md'
                            : 'text-gray-400 hover:bg-white hover:text-gray-700',
                        )}
                      >
                        <Icon size={11} />{tab.label}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Scrollable form or ATS content */}
              <div className="flex-1 overflow-y-auto">
                {mobilePanel === 'score' ? (
                  // ── ATS / Score panel ──
                  <div className="flex flex-col">
                    {atsScore && (
                      <div className="m-4 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white">
                        <div className="flex items-center gap-4">
                          <ATSRing score={atsScore} size={64} />
                          <div className="flex-1">
                            <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Resume readiness</div>
                            <p className="text-[9px] text-gray-400 leading-snug max-w-[14rem] mb-1">Heuristic check—not your employer&apos;s ATS.</p>
                            <div className="font-black text-2xl leading-none" style={{ color: atsScore.grade.color }}>
                              {atsScore.total} <span className="text-sm text-gray-400 font-bold">/ 118</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {[
                            { label: 'Critical', count: atsScore.tips.filter(t => t.level === 'error').length,   color: '#EF4444' },
                            { label: 'Warnings', count: atsScore.tips.filter(t => t.level === 'warning').length, color: '#F59E0B' },
                            { label: 'Passed',   count: atsScore.tips.filter(t => t.level === 'pass').length,   color: '#10B981' },
                          ].map(s => (
                            <div key={s.label} className="bg-white/5 rounded-xl p-2 text-center">
                              <div className="text-base font-black" style={{ color: s.color }}>{s.count}</div>
                              <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="px-4 pb-2">
                      <label className="label text-[9px]">Paste Job Description</label>
                      <textarea
                        className="input-field resize-none text-xs"
                        rows={4}
                        placeholder="Paste the job description for keyword alignment..."
                        value={jobDescription || ''}
                  onChange={e => {
                    setJobDescription(e.target.value)
                    trackEvent(EVENT_NAMES.JD_PASTED, { length: e.target.value?.length || 0, source: 'builder_mobile' })
                  }}
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <AICoachSidebar />
                    </div>
                  </div>
                ) : activeTab === 'form' ? (
                  // ── Build (form) panel ──
                  <div className="flex h-full">
                    {/* Section nav strip */}
                    <div className="w-[60px] flex-shrink-0 bg-gray-50/60 border-r border-gray-100/80 py-3 flex flex-col gap-1 items-center">
                      {FORM_SECTIONS.map(sec => (
                        <NavItem
                          key={sec.id}
                          sec={sec}
                          active={activeSection === sec.id}
                          completeness={completeness}
                          onClick={() => setActiveSection(sec.id)}
                        />
                      ))}
                    </div>
                    {/* Form content */}
                    <div className="flex-1 p-4 overflow-y-auto">
                      {ActiveForm && <ActiveForm />}
                    </div>
                  </div>
                ) : (
                  // ── Design panel ──
                  <div className="p-4 space-y-5">
                    <div>
                      <h3 className="label text-[9px] mb-3">Resume Template</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {TEMPLATES.map(t => (
                          <button
                            key={t.id}
                            onClick={() => {
                              if (t.tier === 'pro' && !isPro) { toast.error('Upgrade to Pro to unlock this template'); return }
                              setTemplate(t.id)
                            }}
                            className={clsx(
                              'p-3 rounded-2xl border-2 text-left transition-all relative',
                              settings.templateId === t.id ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 hover:border-gray-400 bg-white',
                            )}
                          >
                            <div className={clsx('text-[10px] font-black truncate', settings.templateId === t.id ? 'text-white' : 'text-gray-700')}>{t.name}</div>
                            {t.tier === 'pro' && <span className="absolute top-1.5 right-1.5"><ProBadge /></span>}
                            {settings.templateId === t.id && <CheckCircle2 size={12} className="absolute bottom-2 right-2 text-emerald-400" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Save + Export bar */}
              <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50/80 flex items-center gap-2 p-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={clsx(
                    'flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all',
                    isDirty ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-300',
                  )}
                >
                  {isSaving ? <RefreshCw size={11} className="animate-spin" /> : <Save size={11} />}
                  {isSaving ? 'Saving…' : isDirty ? 'Save' : 'Saved ✓'}
                </button>
                <div className="flex-1"><ExportMenu ResumeComponent={ResumeComponent} /></div>
              </div>
            </div>
          )}

          {/* Preview panel */}
          {mobilePanel === 'preview' && (
            <div className="h-full overflow-auto flex flex-col items-center py-6 px-4 bg-[#ECEEF3]">
              <div style={{ transform: 'scale(0.46)', transformOrigin: 'top center', width: '794px', marginBottom: `${1123 * 0.46 - 1123 + 40}px` }}>
                <div id="resume-preview-canvas" ref={previewCanvasRef} className="resume-a4 bg-white drop-shadow-2xl">
                  <ErrorBoundary>
                    <ResumeComponent data={resumeData} settings={settings} />
                  </ErrorBoundary>
                </div>
              </div>
              <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-3 shrink-0">
                ~{previewPageEstimate} A4 page{previewPageEstimate === 1 ? '' : 's'} (estimate)
              </p>
            </div>
          )}
        </div>

        {/* ── Sticky bottom tab bar ──────────────────────────────── */}
        <div className="flex-shrink-0 flex bg-white border-t-2 border-gray-100 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          {MOBILE_TABS.map(tab => {
            const Icon = tab.icon
            const isActive = mobilePanel === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setMobilePanel(tab.id)
                  if (tab.id === 'edit')  setActiveTab('form')
                  if (tab.id === 'score') setActiveTab('ats')
                }}
                className={clsx(
                  'relative flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-all',
                  isActive ? 'text-brand-600' : 'text-gray-400',
                )}
              >
                {/* Active indicator pill */}
                {isActive && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-brand-600 rounded-full" />}
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={clsx('text-[10px] font-black uppercase tracking-widest', isActive ? 'text-brand-600' : 'text-gray-400')}>
                  {tab.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Modals */}
        {showUpload && <UploadResumeModal onClose={() => setShowUpload(false)} />}
        {showAuthModal && (
          <AuthModal
            trigger={authTrigger}
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => { setShowAuthModal(false); if (authTrigger === 'save') handleSave() }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-[#F0F2F7]">

      {/* ════════════════════════════════════════════════════════
          LEFT SIDEBAR
          ════════════════════════════════════════════════════════ */}
      <div
        className={clsx(
          'flex-shrink-0 flex flex-col bg-white border-r border-gray-200/80 transition-all duration-300 overflow-hidden shadow-lg',
          sidebarOpen ? `w-[${SIDEBAR_W}px]` : 'w-0',
        )}
        style={{ width: sidebarOpen ? `${SIDEBAR_W}px` : 0 }}
      >
        {/* ── Top bar: Resume selector + title ── */}
        <div className="flex-shrink-0 h-12 bg-gray-50/80 border-b border-gray-100 flex items-center gap-2 px-3 relative">
          <ResumeSelector />
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex-1 min-w-0">
            <InlineEditTitle />
          </div>
          {/* Version button */}
          <button
            onClick={() => setShowVersionPanel(v => !v)}
            title="Version History & Clone"
            className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
          >
            <Layers size={11} />
            <span>Versions</span>
          </button>

          {/* Version popover */}
          {showVersionPanel && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowVersionPanel(false)}
              />
              <div
                className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4"
                style={{ width: 360, maxHeight: 520, overflowY: 'auto' }}
              >
                <ResumeVersionPanel onClose={() => setShowVersionPanel(false)} />
              </div>
            </>
          )}
        </div>

        {/* ── Tab bar ── */}
        <div className="flex-shrink-0 flex gap-1 p-1.5 bg-gray-50/80 border-b border-gray-100">
          {[
            { id: 'form',   label: 'Build',  icon: Edit3   },
            { id: 'ats',    label: 'Score',   icon: BarChart3 },
            { id: 'design', label: 'Design',  icon: Palette  },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all',
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'text-gray-400 hover:bg-white hover:text-gray-700 hover:shadow-sm',
                )}
              >
                <Icon size={11} />
                {tab.label}
                {tab.id === 'ats' && atsScore && (
                  <span
                    className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[8px] font-black"
                    style={{ background: atsScore.grade.color, color: '#fff' }}
                  >
                    {atsScore.total}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Sidebar body ── */}
        <div className="flex-1 overflow-y-auto min-h-0">

          {/* ════ FORM TAB ════ */}
          {activeTab === 'form' && (
            <div className="flex h-full">

              {/* Section nav column */}
              <div className="w-[68px] flex-shrink-0 bg-gray-50/60 border-r border-gray-100/80 py-3 flex flex-col gap-1 items-center">
                {FORM_SECTIONS.map(sec => (
                  <NavItem
                    key={sec.id}
                    sec={sec}
                    active={activeSection === sec.id}
                    completeness={completeness}
                    onClick={() => {
                      setActiveSection(sec.id)
                      const el = document.getElementById(`resume-sec-${sec.id}`)
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }}
                  />
                ))}
              </div>

              {/* Form content panel */}
              <div className="flex-1 flex flex-col min-w-0">

                {/* Section header */}
                <div
                  className="flex-shrink-0 px-4 py-3 border-b border-gray-100 flex items-center gap-3"
                  style={{ background: (activeSecMeta?.color || '#6366F1') + '08' }}
                >
                  {activeSecMeta && (
                    <>
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: activeSecMeta.color + '20' }}
                      >
                        <activeSecMeta.icon size={15} style={{ color: activeSecMeta.color }} />
                      </div>
                      <div>
                        <div className="text-xs font-black text-gray-800 leading-none">{activeSecMeta.label}</div>
                        <div className="text-[9px] text-gray-400 font-medium mt-0.5">{activeSecMeta.hint}</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Completeness mini-bar */}
                <div className="flex-shrink-0 px-4 pt-2.5 pb-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Profile Strength</span>
                    <span
                      className="text-[10px] font-black"
                      style={{ color: completeness.percent >= 80 ? '#10B981' : completeness.percent >= 50 ? '#F59E0B' : '#EF4444' }}
                    >
                      {completeness.percent}%
                    </span>
                  </div>
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${completeness.percent}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{ background: completeness.percent >= 80 ? '#10B981' : completeness.percent >= 50 ? '#F59E0B' : '#6366F1' }}
                    />
                  </div>
                  {/* Quick-fix chips */}
                  {completeness.percent < 100 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {completeness.checks.filter(c => !c.done).slice(0, 3).map(c => (
                        <button
                          key={c.id}
                          onClick={() => { setActiveSection(c.section) }}
                          className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-100 rounded-full text-[8px] font-bold text-amber-600 hover:bg-amber-100 transition-all"
                        >
                          <AlertCircle size={8} />
                          {c.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI upload prompt */}
                {(
                  <div className="mx-4 my-2 flex items-center justify-between bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl px-3 py-2 border border-indigo-100/80">
                    <div className="text-[9px] font-bold text-indigo-600">Have an old resume?</div>
                    {isPro
                      ? <button onClick={() => setShowUpload(true)} className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-[9px] font-black rounded-lg shadow-sm hover:shadow-md transition-all uppercase tracking-wider">
                          <Sparkles size={9} /> AI Parse
                        </button>
                      : <button onClick={() => setShowUpload(true)} className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-400 text-[9px] font-black rounded-lg uppercase tracking-wider">
                          <Sparkles size={9} /> AI Parse <ProBadge />
                        </button>
                    }
                  </div>
                )}

                {/* Form */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="mb-3">
                    <NextBestFixes
                      completeness={completeness}
                      atsScore={atsScore}
                      onJumpToSection={(sec) => {
                        setActiveSection(sec)
                        const el = document.getElementById(`resume-sec-${sec}`)
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }}
                    />
                  </div>
                  {ActiveForm && <ActiveForm />}
                </div>
              </div>
            </div>
          )}

          {/* ════ ATS SCORE TAB ════ */}
          {activeTab === 'ats' && (
            <div className="flex flex-col">
              {/* Score summary card */}
              {atsScore && (
                <div className="m-4 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white">
                  <div className="flex items-center gap-4">
                    <ATSRing score={atsScore} size={64} />
                    <div className="flex-1">
                      <div className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Resume readiness</div>
                      <p className="text-[9px] text-gray-400 leading-snug mb-1">Heuristic check—not your employer&apos;s ATS.</p>
                      <div className="font-black text-2xl leading-none text-white" style={{ color: atsScore.grade.color }}>
                        {atsScore.total} <span className="text-sm text-gray-400 font-bold">/ 118</span>
                      </div>
                      <div className="text-[9px] font-bold uppercase tracking-wider mt-1" style={{ color: atsScore.grade.color }}>
                        {atsScore.grade.label}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { label: 'Critical', count: atsScore.tips.filter(t => t.level === 'error').length, color: '#EF4444' },
                      { label: 'Warnings', count: atsScore.tips.filter(t => t.level === 'warning').length, color: '#F59E0B' },
                      { label: 'Passed', count: atsScore.tips.filter(t => t.level === 'pass').length, color: '#10B981' },
                    ].map(s => (
                      <div key={s.label} className="bg-white/5 rounded-xl p-2 text-center">
                        <div className="text-base font-black" style={{ color: s.color }}>{s.count}</div>
                        <div className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Job description field */}
              <div className="px-4 pb-2">
                <label className="label text-[9px]">Paste Job Description for a tailored score</label>
                <textarea
                  className="input-field resize-none text-xs"
                  rows={4}
                  placeholder="Paste the job description for keyword alignment and a tailored readiness score..."
                  value={jobDescription || ''}
                  onChange={e => {
                    setJobDescription(e.target.value)
                    trackEvent(EVENT_NAMES.JD_PASTED, { length: e.target.value?.length || 0, source: 'builder_desktop' })
                  }}
                />
              </div>

              {/* ── Keyword gap chips ── */}
              {(() => {
                const gaps = getKeywordGaps(
                  [resumeData.personal.summary, ...(resumeData.experience || []).flatMap(e => e.bullets || []), ...(resumeData.skills || []).map(s => s.items)].join(' '),
                  jobDescription
                )
                if (!gaps.missing.length && !gaps.present.length) return null
                return (
                  <div className="px-4 pb-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Keyword Match</span>
                      <span className={`text-[10px] font-black ${gaps.matchPercent >= 70 ? 'text-emerald-500' : gaps.matchPercent >= 40 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {gaps.matchPercent}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {gaps.present.slice(0, 6).map(kw => (
                        <span key={kw} className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[9px] font-bold">✓ {kw}</span>
                      ))}
                      {gaps.missing.slice(0, 6).map(kw => (
                        <span key={kw} className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-600 rounded-full text-[9px] font-bold">+ {kw}</span>
                      ))}
                    </div>

                    {/* Tailor for This Job button */}
                    <button
                      onClick={handleTailorResume}
                      disabled={!jobDescription || isTailoring}
                      className="w-full py-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 hover:shadow-lg hover:shadow-violet-200/80 transition-all disabled:opacity-40 active:scale-95"
                    >
                      {isTailoring
                        ? <><RefreshCw size={11} className="animate-spin" /> Tailoring…</>
                        : <><Sparkles size={11} /> ✨ Tailor Resume for This Job</>
                      }
                    </button>
                    {!isPro && (
                      <p className="text-center text-[8px] text-gray-400 mt-1">Pro feature · <Link to="/upgrade" className="text-brand-500 font-bold hover:underline">Upgrade</Link></p>
                    )}
                  </div>
                )
              })()}

              {/* Tailor result: added keywords + score */}
              {tailorResult && (
                <div className="mx-4 mb-3 p-3 bg-violet-50 border border-violet-100 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-black text-violet-600 uppercase tracking-widest">Tailoring Complete</span>
                    <span className="text-[10px] font-black text-violet-700">{tailorResult.tailoringScore}% match</span>
                  </div>
                  {tailorResult.addedKeywords?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {tailorResult.addedKeywords.map(kw => (
                        <span key={kw} className="px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full text-[9px] font-bold">+ {kw}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-[9px] text-violet-500 mt-1.5">✓ AI rewrote your bullets &amp; summary — copy from your saved tailored draft or use AI Parse to apply.</p>
                </div>
              )}

              {/* Tips list */}
              <div className="flex-1 overflow-y-auto">
                <AICoachSidebar />
              </div>
            </div>
          )}

          {/* ════ DESIGN TAB ════ */}
          {activeTab === 'design' && (
            <div className="p-4 space-y-6">

              {/* Template selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="label text-[9px]">Resume Template</h3>
                  <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider">{TEMPLATES.length} designs</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        if (t.tier === 'pro' && !isPro) {
                          if (!user) {
                            setAuthTrigger('pro')
                            setShowAuthModal(true)
                          } else {
                            toast.error('Upgrade to Pro to unlock this template')
                          }
                          return
                        }
                        setTemplate(t.id)
                      }}
                      className={clsx(
                        'p-3 rounded-2xl border-2 text-left transition-all duration-200 relative group overflow-hidden',
                        settings.templateId === t.id
                          ? 'border-gray-900 bg-gray-900 text-white shadow-lg'
                          : 'border-gray-200 hover:border-gray-400 hover:shadow-md bg-white',
                      )}
                    >
                      {/* Color swatch + initial */}
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {(t.colors || ['#1A56DB']).slice(0, 3).map((c, ci) => (
                          <div key={ci} className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0" style={{ background: c }} />
                        ))}
                      </div>
                      <div className={clsx('text-[10px] font-black truncate leading-none', settings.templateId === t.id ? 'text-white' : 'text-gray-700')}>
                        {t.name}
                      </div>
                      <div className={clsx('text-[8px] font-medium mt-0.5 capitalize', settings.templateId === t.id ? 'text-gray-300' : 'text-gray-400')}>
                        {t.category || 'Professional'}
                      </div>
                      {t.tier === 'pro' && (
                        <span className="absolute top-1.5 right-1.5"><ProBadge /></span>
                      )}
                      {settings.templateId === t.id && (
                        <CheckCircle2 size={12} className="absolute bottom-2 right-2 text-emerald-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent color picker */}
              <div>
                <h3 className="label text-[9px] mb-3">Accent Color</h3>
                {isPro ? (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {ACCENT_COLORS.map(c => (
                        <button
                          key={c.hex}
                          onClick={() => setAccentColor(c.hex)}
                          title={c.name}
                          className={clsx(
                            'w-8 h-8 rounded-xl border-2 transition-all hover:scale-110',
                            settings.accentColor === c.hex ? 'border-gray-800 scale-110 shadow-md' : 'border-transparent',
                          )}
                          style={{ background: c.hex }}
                        />
                      ))}
                      <div className="relative w-8 h-8">
                        <input
                          type="color"
                          value={settings.accentColor}
                          onChange={e => setAccentColor(e.target.value)}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          title="Custom color"
                        />
                        <div className="w-8 h-8 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-gray-500 transition-all text-gray-400 text-xs">+</div>
                      </div>
                    </div>
                    {/* Current color preview */}
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                      <div className="w-5 h-5 rounded-lg" style={{ background: settings.accentColor }} />
                      <span className="text-[9px] font-black text-gray-500 font-mono uppercase">{settings.accentColor}</span>
                    </div>
                  </div>
                ) : (
                  <ProGate feature="Custom accent colors">
                    <div className="flex gap-2 p-2">
                      {['#1A56DB', '#0E9F6E', '#DC2626'].map(c => (
                        <div key={c} className="w-8 h-8 rounded-xl" style={{ background: c }} />
                      ))}
                    </div>
                  </ProGate>
                )}
              </div>

              {/* Section ordering */}
              <div className="border-t border-gray-100 pt-4">
                <h3 className="label text-[9px] mb-3 flex items-center gap-2">
                  <Layers size={10} />
                  Section Order
                </h3>
                <SectionReorderUI />
              </div>
            </div>
          )}
        </div>

        {/* ── Bottom toolbar ── */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-gray-50/80">
          <div className="flex items-center gap-2 p-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={clsx(
                'flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all min-w-[90px]',
                isDirty
                  ? 'bg-gray-900 text-white hover:bg-gray-800 shadow-sm'
                  : 'bg-gray-100 text-gray-300',
              )}
            >
              {isSaving
                ? <RefreshCw size={11} className="animate-spin" />
                : <Save size={11} />
              }
              {isSaving ? 'Saving…' : isDirty ? 'Save' : 'Saved ✓'}
            </button>
            <div className="flex-1">
              <ExportMenu ResumeComponent={ResumeComponent} />
            </div>
          </div>

          {/* Dev-only test toggle */}
          {import.meta.env.DEV && (
            <div className="px-3 pb-3">
              <button
                onClick={() => setTestMode(!testMode)}
                className={clsx(
                  'w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border flex items-center justify-center gap-1.5',
                  testMode ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-gray-100 text-gray-300 hover:border-gray-200',
                )}
              >
                <Zap size={9} fill={testMode ? 'currentColor' : 'none'} />
                {testMode ? '⚡ Dev Mode Active' : 'Dev Test Mode'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ════ Sidebar toggle button ════ */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute z-10 w-5 h-12 bg-white border border-gray-200 rounded-r-xl flex items-center justify-center shadow-sm hover:bg-gray-50 hover:shadow-md transition-all"
        style={{ left: sidebarOpen ? `${SIDEBAR_W}px` : 0, top: '50%', transform: 'translateY(-50%)', transition: 'left 0.3s' }}
      >
        {sidebarOpen ? <ChevronLeft size={12} className="text-gray-400" /> : <ChevronRight size={12} className="text-gray-400" />}
      </button>

      {/* ════════════════════════════════════════════════════════
          PREVIEW AREA
          ════════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-auto flex flex-col items-center py-8 px-4 lg:px-8 bg-[#ECEEF3]">
        {/* ATS quick-badge */}
        <AnimatePresence>
          {atsScore && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 mb-5 bg-white/90 backdrop-blur-xl rounded-full px-5 py-2 shadow-md border border-white/20 text-xs"
            >
              <span className="font-bold text-gray-400 uppercase tracking-widest text-[9px]">Readiness</span>
              <span className="font-black text-xl leading-none" style={{ color: atsScore.grade.color }}>{atsScore.total}</span>
              <div
                className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider"
                style={{ background: atsScore.grade.color + '20', color: atsScore.grade.color }}
              >
                {atsScore.grade.label}
              </div>
              <div className="w-px h-3 bg-gray-200" />
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                {atsScore.tips.filter(t => t.level === 'error').length} Issues
              </span>
              <button
                onClick={() => setActiveTab('ats')}
                className="flex items-center gap-0.5 text-[9px] font-black text-brand-500 hover:text-brand-600 transition-colors uppercase tracking-wider"
              >
                Fix <ChevronRightSm size={10} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resume canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{
            transform      : `scale(${activeScale})`,
            transformOrigin: 'top center',
            width          : '794px',
            marginBottom   : `${(1123 * activeScale) - 1123 + 80}px`,
          }}
          className="relative drop-shadow-2xl"
        >
          {/* Page break visual guides (56px bottom + 72px top gap) */}
          {[1, 2, 3].map(page => {
            const boundaryY = page * 1123
            return (
              <div
                key={page}
                className="resume-page-break-visual"
                style={{ position: 'absolute', top: `${boundaryY - 56}px`, left: 0, zIndex: 10, pointerEvents: 'none' }}
              >
                <div className="resume-page-boundary-line" />
                <div className="text-[10px] font-black text-slate-300 uppercase tracking-tighter opacity-50">
                  PAGE {page} | PAGE {page + 1}
                </div>
              </div>
            )
          })}

          <div id="resume-preview-canvas" ref={previewCanvasRef} className="resume-a4 bg-white">
            <ErrorBoundary>
              <ResumeComponent data={resumeData} settings={settings} />
            </ErrorBoundary>
          </div>
        </motion.div>
        <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-3">
          ~{previewPageEstimate} A4 page{previewPageEstimate === 1 ? '' : 's'} (estimate)
        </p>
      </div>

      {/* ═════ Zoom controls (fixed bottom-right) ════════════════ */}
      <div className="fixed bottom-5 right-5 flex items-center gap-1.5 bg-white/95 backdrop-blur-xl rounded-2xl px-3 py-2 shadow-xl border border-gray-100 z-20">
        <button
          onClick={() => handleZoomChange(Math.max(0.38, activeScale - 0.05))}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          title="Zoom out"
        >
          <ZoomOut size={13} />
        </button>
        <span className="text-[10px] font-black text-gray-500 w-9 text-center select-none tabular-nums">
          {Math.round(activeScale * 100)}%
        </span>
        <button
          onClick={() => handleZoomChange(Math.min(0.95, activeScale + 0.05))}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all"
          title="Zoom in"
        >
          <ZoomIn size={13} />
        </button>
        <div className="w-px h-4 bg-gray-200 mx-0.5" />
        <button
          onClick={() => handleZoomChange(0)}
          className="text-[9px] font-black text-gray-400 hover:text-brand-600 transition-colors uppercase tracking-wider px-1"
          title="Reset to auto-fit"
        >
          Auto
        </button>
      </div>

      {/* ═════ Auth Modal ════════════════════════════════════════ */}
      {showAuthModal && (
        <AuthModal
          trigger={authTrigger}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
            if (authTrigger === 'save') handleSave()
          }}
        />
      )}

      {/* ═════ Upload Modal ═══════════════════════════════════════ */}
      {showUpload && <UploadResumeModal onClose={() => setShowUpload(false)} />}
    </div>
  )
}
