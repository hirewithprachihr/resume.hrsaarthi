import { useState, useRef, useEffect, useMemo, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, ArrowRight, Sparkles, ShieldCheck, Layers, Filter, Eye,
  Briefcase, GraduationCap, Code2, BarChart2, Palette, Users,
  TrendingUp, Heart, Scale, BookOpen, Building2, ChevronRight,
  Check, Cpu, Star
} from 'lucide-react'
import { TEMPLATES } from '../templates/registry'
import { useAuthStore } from '../store/authStore'
import { useEntitlements } from '../utils/entitlements'
import { clsx } from 'clsx'

// ── ATS Level Config ─────────────────────────────────────────────
const ATS_CONFIG = {
  high  : { label: 'ATS High',   color: '#059669', bg: '#ecfdf5', border: '#a7f3d0', dot: '🟢' },
  medium: { label: 'ATS Medium', color: '#d97706', bg: '#fffbeb', border: '#fde68a', dot: '🟡' },
  low   : { label: 'ATS Creative', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', dot: '🔴' },
}

// ── Badge Color Map ──────────────────────────────────────────────
const BADGE_COLORS = {
  'ATS-Safe'      : { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' },
  'For Freshers'  : { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  'Tech'          : { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  'Startup'       : { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' },
  'Executive'     : { bg: '#1e293b', text: '#e2e8f0', border: '#334155' },
  'Finance'       : { bg: '#0f172a', text: '#93c5fd', border: '#1e3a5f' },
  'Flagship'      : { bg: '#fefce8', text: '#92400e', border: '#fde68a' },
  'Creative'      : { bg: '#faf5ff', text: '#7e22ce', border: '#e9d5ff' },
  'Premium'       : { bg: '#fdf4ff', text: '#86198f', border: '#f0abfc' },
  'Premium Indian': { bg: '#fefce8', text: '#78350f', border: '#fde68a' },
  'Global'        : { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  'Minimal'       : { bg: '#f8fafc', text: '#475569', border: '#cbd5e1' },
  'Modern'        : { bg: '#f5f3ff', text: '#5b21b6', border: '#ddd6fe' },
  'LinkedIn'      : { bg: '#eff6ff', text: '#0077b5', border: '#bfdbfe' },
  'Timeline'      : { bg: '#ecfeff', text: '#0891b2', border: '#a5f3fc' },
  'Visual'        : { bg: '#fdf4ff', text: '#9333ea', border: '#e879f9' },
  'HR & People'   : { bg: '#f0fdfa', text: '#0d9488', border: '#99f6e4' },
  'Marketing'     : { bg: '#fffbeb', text: '#d97706', border: '#fde68a' },
  'Healthcare'    : { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc' },
  'Legal'         : { bg: '#fefce8', text: '#854d0e', border: '#fef08a' },
  'Education'     : { bg: '#faf5ff', text: '#7c3aed', border: '#ddd6fe' },
  'Govt / PSU'    : { bg: '#eff6ff', text: '#1e40af', border: '#bfdbfe' },
  'Sales'         : { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' },
}

// ── Category Filters (expanded per master prompt) ────────────────
const CATEGORY_FILTERS = [
  { id: 'all',       label: 'All Templates',  icon: Layers,       count: null },
  { id: 'fresher',   label: 'Freshers',       icon: GraduationCap, count: null },
  { id: 'tech',      label: 'Tech / Dev',     icon: Code2,        count: null },
  { id: 'finance',   label: 'Finance',        icon: BarChart2,    count: null },
  { id: 'executive', label: 'Executive',      icon: Briefcase,    count: null },
  { id: 'creative',  label: 'Creative',       icon: Palette,      count: null },
  { id: 'hr',        label: 'HR & People',    icon: Users,        count: null },
  { id: 'marketing', label: 'Marketing',      icon: TrendingUp,   count: null },
  { id: 'sales',     label: 'Sales',          icon: Star,         count: null },
  { id: 'medical',   label: 'Healthcare',     icon: Heart,        count: null },
  { id: 'legal',     label: 'Legal',          icon: Scale,        count: null },
  { id: 'education', label: 'Education',      icon: BookOpen,     count: null },
  { id: 'govt',      label: 'Govt / PSU',     icon: Building2,    count: null },
]

const ATS_FILTERS = [
  { id: 'all',    label: 'All ATS Levels' },
  { id: 'high',   label: '🟢 High' },
  { id: 'medium', label: '🟡 Medium' },
  { id: 'low',    label: '🔴 Creative' },
]

const TIER_FILTERS = [
  { id: 'all',  label: 'Free + Pro' },
  { id: 'free', label: 'Free Only' },
  { id: 'pro',  label: '⭐ Pro Only' },
]

// ── "Find My Template" Role-to-Template Mapping ──────────────────
const ROLE_RECOMMENDATIONS = [
  { role: 'Software Engineer / Developer',  catFilter: 'tech',      recommended: 'dev-stack',       emoji: '💻' },
  { role: 'Fresher / Campus Placement',     catFilter: 'fresher',   recommended: 'campus-pro',      emoji: '🎓' },
  { role: 'Finance / CA / Banking',         catFilter: 'finance',   recommended: 'finance-edge',    emoji: '💰' },
  { role: 'HR / Talent Acquisition',        catFilter: 'hr',        recommended: 'hr-people',       emoji: '👥' },
  { role: 'Marketing / Growth',             catFilter: 'marketing', recommended: 'marketing-maven', emoji: '📣' },
  { role: 'Sales / Business Development',   catFilter: 'sales',     recommended: 'sales-warrior',   emoji: '🏆' },
  { role: 'UX / Graphic Designer',          catFilter: 'creative',  recommended: 'design-canvas',   emoji: '🎨' },
  { role: 'Doctor / Healthcare',            catFilter: 'medical',   recommended: 'medical-pro',     emoji: '🏥' },
  { role: 'Lawyer / Legal',                 catFilter: 'legal',     recommended: 'legal-eagle',     emoji: '⚖️' },
  { role: 'Teacher / Educator',             catFilter: 'education', recommended: 'teacher-first',   emoji: '📚' },
  { role: 'Government / PSU / UPSC',        catFilter: 'govt',      recommended: 'govt-ready',      emoji: '🏛️' },
  { role: 'Senior Executive / Director',    catFilter: 'executive', recommended: 'prachi-signature', emoji: '👔' },
]

// ── Demo Data for Live Mini Previews ─────────────────────────────
const DEMO_DATA = {
  personal: {
    fullName : 'Rahul Sharma',
    jobTitle : 'Senior Software Engineer',
    email    : 'rahul@example.com',
    phone    : '+91 98765 43210',
    location : 'Bengaluru, Karnataka',
    linkedin : 'linkedin.com/in/rahul',
    github   : 'github.com/rahulsharma',
    summary  : 'Results-driven engineer with 6 years building scalable products. Led teams of 8, shipped 15 production features delivering ₹50L+ in new revenue.',
  },
  experience: [
    { id: '1', title: 'Senior Engineer',   company: 'Flipkart', location: 'Bengaluru', startDate: 'Jul 2021', endDate: '', current: true,  bullets: ['Led migration of monolith to microservices, improving deploy frequency 3x', 'Mentored team of 5 junior engineers, improving velocity by 25%', 'Reduced API response time by 60% via Redis caching + query optimization'] },
    { id: '2', title: 'Software Engineer', company: 'Infosys',  location: 'Pune',      startDate: 'Jun 2019', endDate: 'Jun 2021', current: false, bullets: ['Built payment gateway handling ₹50L/day in transactions', 'Implemented CI/CD pipeline reducing deploy time by 40%'] },
  ],
  education: [
    { id: '1', degree: 'B.Tech Computer Science', school: 'IIT Bombay', location: 'Mumbai', startDate: '2015', endDate: '2019', grade: '8.7 CGPA', achievements: "Dean's List" },
  ],
  skills: [
    { id: '1', category: 'Backend',  items: 'Node.js, Python, Java, PostgreSQL, Redis, AWS' },
    { id: '2', category: 'Frontend', items: 'React, TypeScript, Next.js' },
    { id: '3', category: 'DevOps',   items: 'Docker, Kubernetes, CI/CD, Terraform' },
  ],
  certifications : [{ id: '1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: 'Jan 2023' }],
  projects       : [{ id: '1', name: 'E-Commerce Platform', description: 'Full-stack platform handling 10K+ daily orders with 99.9% uptime', tech: 'React, Node.js, MongoDB', technologies: 'React, Node.js, MongoDB', url: 'github.com/demo', date: '2023' }],
  languages      : [{ id: '1', language: 'English', proficiency: 'Fluent' }, { id: '2', language: 'Hindi', proficiency: 'Native' }],
  hobbies        : [{ id: '1', name: 'Open Source' }, { id: '2', name: 'Photography' }],
  customSections : [],
}

// ── Mini Preview Loader ──────────────────────────────────────────
function MiniPreviewLoader() {
  return (
    <div style={{ width: '100%', height: '100%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 12, height: 12, border: '2px solid #e2e8f0', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )
}

// ── Live Mini Preview ────────────────────────────────────────────
function LiveMiniPreview({ t }) {
  const SCALE = 0.165
  const W = 794
  const H = 1123
  
  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden', background: '#f8fafc',
      position: 'relative', borderRadius: '10px',
    }}>
      <div style={{
        width: W, height: H,
        transform: `scale(${SCALE})`,
        transformOrigin: 'top left',
        pointerEvents: 'none', userSelect: 'none',
        position: 'absolute', top: 0, left: 0,
      }}>
        <div style={{ width: W, minHeight: H, background: '#fff', overflow: 'hidden' }}>
          <Suspense fallback={<MiniPreviewLoader />}>
            <t.component
              data={DEMO_DATA}
              settings={{ accentColor: t.colors[0], fontSize: 'medium' }}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

// ── Badge Pills ──────────────────────────────────────────────────
function BadgePill({ badge }) {
  const style = BADGE_COLORS[badge] || { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' }
  return (
    <span style={{
      display: 'inline-block', fontSize: '8px', fontWeight: 800, letterSpacing: '0.06em',
      padding: '2px 7px', borderRadius: 999, textTransform: 'uppercase',
      background: style.bg, color: style.text, border: `1px solid ${style.border}`,
    }}>
      {badge}
    </span>
  )
}

function ATSBadge({ level }) {
  const cfg = ATS_CONFIG[level] || ATS_CONFIG.medium
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      fontSize: '8px', fontWeight: 800, letterSpacing: '0.04em',
      padding: '2px 7px', borderRadius: 999,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.dot} {cfg.label}
    </span>
  )
}

// ── Main Page ────────────────────────────────────────────────────
export default function TemplatesPage() {
  const [preview, setPreview]        = useState(null)
  const [catFilter, setCatFilter]    = useState('all')
  const [atsFilter, setAtsFilter]    = useState('all')
  const [tierFilter, setTierFilter]  = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [showFindMe, setShowFindMe]  = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  const { plan } = useAuthStore()
  const { isPro } = useEntitlements()

  const previewContainerRef = useRef(null)
  const [previewScale, setPreviewScale] = useState(0.62)

  useEffect(() => {
    if (!preview || !previewContainerRef.current) return
    const updateScale = () => {
      const availW = previewContainerRef.current?.clientWidth || 794
      const scale = Math.min(0.95, (availW - 40) / 794)
      setPreviewScale(scale)
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [preview])

  // Build category counts
  const categoryCounts = useMemo(() => {
    const counts = {}
    TEMPLATES.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1
      counts['all'] = (counts['all'] || 0) + 1
    })
    return counts
  }, [])

  // Normalize category for v7 templates
  const normalizeCategory = (t) => {
    const catMap = {
      'hr-people'      : 'hr',
      'sales-warrior'  : 'sales',
      'medical-pro'    : 'medical',
      'legal-eagle'    : 'legal',
      'teacher-first'  : 'education',
      'govt-ready'     : 'govt',
      'marketing-maven': 'marketing',
    }
    return catMap[t.id] || t.category
  }

  const filtered = useMemo(() => {
    return TEMPLATES.filter(t => {
      const cat = normalizeCategory(t)
      if (catFilter !== 'all' && cat !== catFilter && t.category !== catFilter) return false
      if (atsFilter !== 'all' && t.atsLevel !== atsFilter) return false
      if (tierFilter !== 'all' && t.tier !== tierFilter) return false
      return true
    })
  }, [catFilter, atsFilter, tierFilter])

  // NEW templates badge logic
  const isNew = (t) => [
    'campus-pro','dev-stack','finance-edge','hr-people','sales-warrior',
    'medical-pro','legal-eagle','teacher-first','govt-ready','marketing-maven'
  ].includes(t.id)

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ── Hero Header ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-12">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-[0.35em] mb-5 border border-brand-100">
            <Sparkles size={10} /> Design Collection 2026
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }}
                className="text-5xl md:text-6xl font-black text-gray-950 tracking-tight leading-[1.05] mb-4">
                Resume Templates
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
                className="text-gray-500 text-lg font-medium max-w-xl leading-relaxed">
                {TEMPLATES.length} templates engineered for ATS performance — freshers to C-suite, every Indian industry covered.
              </motion.p>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.16 }}>
              <button
                onClick={() => setShowFindMe(v => !v)}
                className={clsx(
                  'inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all border',
                  showFindMe
                    ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-200'
                    : 'bg-white text-brand-600 border-brand-200 hover:border-brand-400 hover:shadow-md'
                )}
              >
                <Cpu size={16} />
                Find My Template
                <ChevronRight size={14} className={clsx('transition-transform', showFindMe && 'rotate-90')} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* ── "Find My Template" Onboarding Bar ─────────────────── */}
        <AnimatePresence>
          {showFindMe && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-3xl border border-brand-100 p-8 shadow-lg shadow-brand-50">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-[10px] font-black text-brand-500 uppercase tracking-[0.3em] mb-1">AI Template Matcher</div>
                    <h2 className="text-xl font-black text-gray-950 tracking-tight">What's your field?</h2>
                    <p className="text-sm text-gray-400 mt-1">Select your industry and we'll recommend the best template for you.</p>
                  </div>
                  <button onClick={() => setShowFindMe(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {ROLE_RECOMMENDATIONS.map((r, i) => (
                    <motion.button
                      key={r.role}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      onClick={() => {
                        setSelectedRole(r)
                        setCatFilter(r.catFilter)
                        setShowFindMe(false)
                        // Scroll to recommended template after filter
                        setTimeout(() => {
                          const el = document.getElementById(`template-${r.recommended}`)
                          el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                        }, 300)
                      }}
                      className={clsx(
                        'flex items-center gap-2.5 px-3 py-3 rounded-2xl border text-left transition-all hover:shadow-md',
                        selectedRole?.role === r.role
                          ? 'bg-brand-600 text-white border-brand-600 shadow-lg'
                          : 'bg-gray-50 text-gray-700 border-gray-100 hover:border-brand-200 hover:bg-white'
                      )}
                    >
                      <span className="text-xl leading-none">{r.emoji}</span>
                      <span className="text-[11px] font-bold leading-tight">{r.role}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Selected Role Banner ───────────────────────────────── */}
        <AnimatePresence>
          {selectedRole && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3 px-5 py-3 mb-6 bg-brand-50 border border-brand-100 rounded-2xl"
            >
              <span className="text-xl">{selectedRole.emoji}</span>
              <div className="flex-1">
                <span className="text-sm font-black text-brand-700">Showing templates for: </span>
                <span className="text-sm font-medium text-brand-600">{selectedRole.role}</span>
              </div>
              <button onClick={() => { setSelectedRole(null); setCatFilter('all') }}
                className="text-brand-400 hover:text-brand-700 transition-colors">
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Category Filter Bar ────────────────────────────────── */}
        <div className="mb-8">
          {/* Scrollable category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            {CATEGORY_FILTERS.map((f, i) => {
              const Icon = f.icon
              const isActive = catFilter === f.id
              return (
                <motion.button key={f.id}
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.04 + i * 0.025 }}
                  onClick={() => { setCatFilter(f.id); setSelectedRole(null) }}
                  className={clsx(
                    'flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border outline-none whitespace-nowrap',
                    isActive
                      ? 'bg-gray-950 text-white border-gray-950 shadow-lg'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-brand-300 hover:text-brand-600'
                  )}
                >
                  <Icon size={11} />
                  {f.label}
                </motion.button>
              )
            })}
            
            <button
              onClick={() => setShowFilters(v => !v)}
              className={clsx(
                'flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black transition-all border outline-none',
                showFilters ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-400 border-gray-200 hover:border-brand-300'
              )}
            >
              <Filter size={11} /> More Filters
            </button>
          </div>

          {/* Advanced Filters (collapsible) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-wrap items-center gap-6 py-4 px-6 bg-white rounded-2xl border border-gray-100 mt-2 shadow-sm">
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">ATS Level</div>
                    <div className="flex gap-2">
                      {ATS_FILTERS.map(f => (
                        <button key={f.id} onClick={() => setAtsFilter(f.id)}
                          className={clsx('px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border',
                            atsFilter === f.id ? 'bg-gray-950 text-white border-gray-950' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400')}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Tier</div>
                    <div className="flex gap-2">
                      {TIER_FILTERS.map(f => (
                        <button key={f.id} onClick={() => setTierFilter(f.id)}
                          className={clsx('px-3 py-1.5 rounded-lg text-[10px] font-black transition-all border',
                            tierFilter === f.id ? 'bg-gray-950 text-white border-gray-950' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400')}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {(catFilter !== 'all' || atsFilter !== 'all' || tierFilter !== 'all') && (
                    <div className="flex items-end">
                      <button onClick={() => { setCatFilter('all'); setAtsFilter('all'); setTierFilter('all'); setSelectedRole(null) }}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-black text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-all">
                        ✕ Clear All
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result count */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-[11px] font-semibold text-gray-400">
              Showing <span className="font-black text-gray-700">{filtered.length}</span> of {TEMPLATES.length} templates
            </span>
            {(catFilter !== 'all' || atsFilter !== 'all' || tierFilter !== 'all') && (
              <button onClick={() => { setCatFilter('all'); setAtsFilter('all'); setTierFilter('all'); setSelectedRole(null) }}
                className="text-[10px] font-black text-brand-500 hover:text-brand-700 transition-colors">
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* ── Templates Grid ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => {
              const locked = t.tier === 'pro' && !isPro
              const rec = selectedRole?.recommended === t.id
              return (
                <motion.div
                  id={`template-${t.id}`}
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ delay: i * 0.025, duration: 0.22 }}
                  className={clsx(
                    'group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col cursor-pointer',
                    rec
                      ? 'border-brand-400 shadow-xl shadow-brand-100 ring-2 ring-brand-200'
                      : 'border-gray-100 hover:border-brand-300 hover:shadow-2xl hover:shadow-gray-200 hover:-translate-y-1'
                  )}
                >
                  {/* PRO badge */}
                  {t.tier === 'pro' && (
                    <div className="absolute top-2.5 right-2.5 z-20 bg-gray-950 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow">PRO</div>
                  )}

                  {/* NEW badge */}
                  {isNew(t) && (
                    <div className="absolute top-2.5 left-2.5 z-20">
                      <span className="bg-emerald-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow">NEW</span>
                    </div>
                  )}

                  {/* Recommended star */}
                  {rec && (
                    <div className="absolute top-2.5 left-2.5 z-30 bg-brand-600 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-0.5">
                      <Star size={7} className="fill-white" /> Pick
                    </div>
                  )}

                  {/* ── LIVE MINI PREVIEW ── */}
                  <div className="w-full aspect-[3/4] relative overflow-hidden bg-gray-50"
                    onClick={() => setPreview(t)}
                  >
                    <div className="w-full h-full group-hover:scale-[1.02] transition-transform duration-500 rounded-t-2xl overflow-hidden">
                      <LiveMiniPreview t={t} />
                    </div>

                    {/* Hover overlay with eye button */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-200">
                        <div className="flex items-center gap-1.5 bg-white text-gray-900 text-[10px] font-black px-4 py-2.5 rounded-full shadow-xl">
                          <Eye size={12} /> Preview Full Size
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ── Card Footer ── */}
                  <div className="px-3 pb-3 pt-2.5 flex flex-col gap-2 flex-1">
                    <div>
                      <div className="text-[10px] font-black text-gray-900 uppercase tracking-widest truncate group-hover:text-brand-600 transition-colors">
                        {t.name}
                      </div>
                      <div className="text-[9px] text-gray-400 font-medium mt-0.5 line-clamp-2 leading-tight">
                        {t.description}
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-1">
                      {t.badge && <BadgePill badge={t.badge} />}
                      {t.atsLevel && <ATSBadge level={t.atsLevel} />}
                    </div>

                    {/* Best for */}
                    {t.bestFor && t.bestFor.length > 0 && (
                      <div className="text-[8px] text-gray-400 leading-tight">
                        <span className="font-bold text-gray-500">Best for: </span>
                        {t.bestFor.slice(0, 2).join(' · ')}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex gap-1.5 mt-auto pt-1">
                      <button onClick={() => setPreview(t)}
                        className="flex-1 text-[9px] py-2 bg-gray-50 text-gray-500 font-black uppercase tracking-widest rounded-lg hover:bg-gray-100 transition-all border border-gray-100">
                        Preview
                      </button>
                      <Link
                        to={`/builder?template=${t.id}`}
                        onClick={e => { if (locked) { e.preventDefault(); setPreview(t) } }}
                        className="flex-1 text-[9px] py-2 bg-gray-950 text-white font-black uppercase tracking-widest rounded-lg hover:bg-brand-600 transition-all text-center"
                      >
                        {locked ? 'Upgrade' : 'Use'}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <div className="font-black text-gray-700 text-lg mb-2">No templates match these filters</div>
            <button onClick={() => { setCatFilter('all'); setAtsFilter('all'); setTierFilter('all') }}
              className="mt-4 px-6 py-2.5 bg-gray-950 text-white rounded-xl text-xs font-black hover:bg-brand-600 transition-all">
              Clear All Filters
            </button>
          </div>
        )}

        {/* ── Feature Cards ─────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { Icon: ShieldCheck, color: '#0E9F6E', bg: '#ecfdf5', title: 'ATS-Safe by Design', desc: 'No canvas tricks. Every glyph is clean, parseable text for 100% ATS extraction on Workday, Greenhouse, and Lever.' },
            { Icon: Layers,      color: '#6366F1', bg: '#eff6ff', title: 'Indian Market First', desc: 'Keywords, formats, and layouts tuned for Naukri.com, LinkedIn India, and Indian corporate hiring — not US-only templates.' },
            { Icon: Cpu,         color: '#F59E0B', bg: '#fffbeb', title: 'Category-Specific', desc: 'Dedicated templates for 11+ industries — Tech, Finance, HR, Healthcare, Legal, Govt & more. Built for your domain.' },
          ].map(({ Icon, color, bg, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                <Icon size={18} color={color} />
              </div>
              <h3 className="text-sm font-black text-gray-900 mb-2">{title}</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">{desc}</p>
            </div>
          ))}
        </motion.div>

      </div>

      {/* ── Preview Modal ─────────────────────────────────────────── */}
      {preview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="font-black text-gray-900 text-base tracking-tight">{preview.name}</h3>
                {preview.badge && <BadgePill badge={preview.badge} />}
                {preview.atsLevel && <ATSBadge level={preview.atsLevel} />}
                {preview.tier === 'pro' && (
                  <span className="bg-gray-950 text-white text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">PRO</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/builder?template=${preview.id}`}
                  onClick={e => { if (preview.tier === 'pro' && !isPro) { e.preventDefault() } }}
                  className="inline-flex items-center gap-1.5 text-xs font-black bg-gray-950 text-white px-5 py-2.5 rounded-xl hover:bg-brand-600 transition-all whitespace-nowrap"
                >
                  Use Template <ArrowRight size={13} />
                </Link>
                <button onClick={() => setPreview(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Body — Two Panel */}
            <div className="flex-1 overflow-hidden flex">
              
              {/* Left — Template preview */}
              <div ref={previewContainerRef} className="flex-1 overflow-auto p-6 bg-gray-100 flex justify-center">
                <div style={{
                  width: '794px',
                  transformOrigin: 'top center',
                  transform: `scale(${previewScale})`,
                  flexShrink: 0,
                  marginBottom: `${(previewScale - 1) * 1123}px`,
                }}>
                  <div className="resume-a4 bg-white shadow-sm">
                    <preview.component
                      data={DEMO_DATA}
                      settings={{ accentColor: preview.colors[0], fontSize: 'medium' }}
                    />
                  </div>
                </div>
              </div>

              {/* Right — Metadata Panel */}
              <div className="w-72 shrink-0 border-l border-gray-100 overflow-y-auto p-6 bg-white">
                <div className="space-y-6">
                  
                  {/* Template Info */}
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Description</div>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">{preview.description}</p>
                  </div>

                  {/* ATS Info */}
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">ATS Compatibility</div>
                    <div className={clsx(
                      'rounded-xl p-3 border',
                      preview.atsLevel === 'high'   ? 'bg-emerald-50 border-emerald-100' :
                      preview.atsLevel === 'medium'  ? 'bg-amber-50 border-amber-100'    :
                                                       'bg-red-50 border-red-100'
                    )}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">{ATS_CONFIG[preview.atsLevel]?.dot}</span>
                        <span className="text-[10px] font-black text-gray-700">{ATS_CONFIG[preview.atsLevel]?.label}</span>
                      </div>
                      <p className="text-[9px] text-gray-500 leading-relaxed">
                        {preview.atsLevel === 'high'
                          ? 'Fully parseable on Workday, Greenhouse, Lever, and Naukri ATS systems. Safe for automated portals.'
                          : preview.atsLevel === 'medium'
                          ? 'Works on most ATS systems. Two-column layout may not parse on older portals.'
                          : 'Creative design optimized for agency/portfolio submissions. Use ATS Classic for automated portals.'}
                      </p>
                    </div>
                  </div>

                  {/* Layout Type */}
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Layout</div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                      <Layers size={12} className="text-gray-400" />
                      {preview.layout === 'single'  ? 'Single Column' :
                       preview.layout === 'sidebar' ? 'Sidebar Layout' :
                       preview.layout === 'two-col' ? 'Two-Column Layout' : preview.layout}
                    </div>
                  </div>

                  {/* Best for */}
                  {preview.bestFor && preview.bestFor.length > 0 && (
                    <div>
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Best for</div>
                      <div className="flex flex-wrap gap-1.5">
                        {preview.bestFor.map((b, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-[9px] font-bold text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
                            <Check size={8} className="text-emerald-500" /> {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Color Options */}
                  <div>
                    <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Accent Colors</div>
                    <div className="flex gap-2">
                      {preview.colors.slice(0, 4).map((c, i) => (
                        <div key={i} title={c}>
                          <Link
                            to={`/builder?template=${preview.id}&color=${encodeURIComponent(c)}`}
                            style={{ background: c }}
                            className="block w-6 h-6 rounded-full border-2 border-white shadow hover:scale-125 transition-transform"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Creative Warning */}
                  {preview.atsLevel === 'low' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <div className="text-[9px] font-black text-amber-700 uppercase tracking-wider mb-1">⚠ ATS Note</div>
                      <p className="text-[9px] text-amber-600 leading-relaxed">
                        Best for agency/portfolio submissions. For automated job portals, use <strong>ATS Classic</strong> instead.
                      </p>
                    </div>
                  )}

                  {/* Use CTA */}
                  <Link
                    to={`/builder?template=${preview.id}`}
                    onClick={e => { if (preview.tier === 'pro' && !isPro) { e.preventDefault() } }}
                    className="w-full inline-flex items-center justify-center gap-2 text-sm font-black bg-gray-950 text-white px-5 py-3.5 rounded-2xl hover:bg-brand-600 transition-all"
                  >
                    {preview.tier === 'pro' && !isPro ? '⭐ Upgrade to Pro' : `Use ${preview.name}`}
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
