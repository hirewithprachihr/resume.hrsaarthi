import { useState, useRef, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Sparkles, ShieldCheck, Layers, Filter, Eye } from 'lucide-react'
import { TEMPLATES } from '../templates/registry'
import { useAuthStore } from '../store/authStore'
import { clsx } from 'clsx'

// ── ATS Level Config ─────────────────────────────────────────────
const ATS_CONFIG = {
  high  : { label: '🟢 ATS High',   color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
  medium: { label: '🟡 ATS Medium', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
  low   : { label: '🔴 ATS Low',    color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
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
}

// ── Category Filters ─────────────────────────────────────────────
const CATEGORY_FILTERS = [
  { id: 'all',       label: 'All' },
  { id: 'fresher',   label: '🎓 Freshers' },
  { id: 'tech',      label: '💻 Tech' },
  { id: 'finance',   label: '💰 Finance' },
  { id: 'executive', label: '👔 Executive' },
  { id: 'creative',  label: '🎨 Creative' },
]

const ATS_FILTERS = [
  { id: 'all',    label: 'All ATS Levels' },
  { id: 'high',   label: '🟢 High' },
  { id: 'medium', label: '🟡 Medium' },
  { id: 'low',    label: '🔴 Low (Creative)' },
]

const TIER_FILTERS = [
  { id: 'all',  label: 'Free + Pro' },
  { id: 'free', label: 'Free' },
  { id: 'pro',  label: '⭐ Pro' },
]

// ── Thumbnail Visual (abstract representation) ───────────────────
const THUMB = {
  'ats-classic'     : { bg: 'linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)', accent: '#1A56DB', lines: [70,55,45,55,40,50] },
  'corporate-pro'   : { bg: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', accent: '#93c5fd', lines: [65,50,45,55,35], sidebar: '#1a3a7a' },
  'tech-minimal'    : { bg: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', accent: '#0E9F6E', lines: [70,52,40,58,38] },
  'creative-sidebar': { bg: 'linear-gradient(135deg,#7C3AED 0%,#5b21b6 100%)', accent: '#fff', lines: [60,50,55,40,48], sidebar: '#6d28d9' },
  'fresher-first'   : { bg: 'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)', accent: '#0E9F6E', lines: [60,70,55,45,52] },
  'executive-bold'  : { bg: 'linear-gradient(135deg,#1e293b 0%,#0f172a 100%)', accent: '#93c5fd', lines: [75,55,45,60,40] },
  'elegant-modern'  : { bg: 'linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)', accent: '#B45309', lines: [65,50,45,55,38] },
  'startup-hustler' : { bg: 'linear-gradient(135deg,#fff1f2 0%,#ffe4e6 100%)', accent: '#DC2626', lines: [72,55,48,58,40] },
  'infographic-pro' : { bg: 'linear-gradient(135deg,#ecfeff 0%,#cffafe 100%)', accent: '#0891B2', lines: [60,50,45,55,42], bars: true },
  'international'   : { bg: 'linear-gradient(135deg,#eef2ff 0%,#e0e7ff 100%)', accent: '#4F46E5', lines: [65,52,48,58,40] },
  'linkedin-export' : { bg: 'linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%)', accent: '#0077B5', lines: [68,52,45,55,40] },
  'vedanta'         : { bg: 'linear-gradient(135deg,#0f1f3d 0%,#1e3a6e 100%)', accent: '#D4AF37', lines: [70,55,45,58,38] },
  'minimal-ink'     : { bg: 'linear-gradient(135deg,#fafafa 0%,#f1f5f9 100%)', accent: '#0f172a', lines: [72,56,46,58,42] },
  'split-screen'    : { bg: 'linear-gradient(135deg,#1e2433 0%,#2d3748 100%)', accent: '#6366F1', lines: [65,50,48,55,40], sidebar: '#252d3e' },
  'timeline-pro'    : { bg: 'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)', accent: '#0891B2', lines: [68,54,45,58,40], timeline: true },
  'prachi-signature': { bg: 'linear-gradient(135deg,#1A2B4B 0%,#2D4A8A 100%)', accent: '#C9A84C', lines: [70,55,45,58,38], sidebar: '#152240' },
  'design-canvas'   : { bg: 'linear-gradient(135deg,#7B2D8B 0%,#6d1e7f 100%)', accent: '#fff', lines: [65,50,48,55,40], sidebar: '#5a1a68' },
  'sleek-financial' : { bg: 'linear-gradient(135deg,#f0f4ff 0%,#e0e7ff 100%)', accent: '#1A56DB', lines: [70,55,45,60,38] },
  'modern-split'    : { bg: 'linear-gradient(135deg,#f1f5f9 0%,#e2e8f0 100%)', accent: '#2D3748', lines: [68,52,46,57,40], sidebar: '#2D3748' },
  'playful-business': { bg: 'linear-gradient(135deg,#fef9c3 0%,#fef3c7 100%)', accent: '#F59E0B', lines: [65,50,45,55,40] },
  'campus-pro'      : { bg: 'linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%)', accent: '#1A56DB', lines: [75,60,55,65,48,52] },
  'dev-stack'       : { bg: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', accent: '#0E9F6E', lines: [65,50,45,55,40,38], sidebar: '#0a1020' },
  'finance-edge'    : { bg: 'linear-gradient(135deg,#0f1e3d 0%,#1a2c52 100%)', accent: '#93c5fd', lines: [65,52,45,55,40] },
}

function TemplateThumbnail({ t }) {
  const th = THUMB[t.id] || { bg: 'linear-gradient(135deg,#f8fafc,#e2e8f0)', accent: '#6366F1', lines: [65,50,45] }
  const hasSidebar = !!th.sidebar
  return (
    <div style={{ width: '100%', height: '100%', background: th.bg, borderRadius: '10px', overflow: 'hidden', position: 'relative', display: 'flex' }}>
      {hasSidebar && (
        <div style={{ width: '30%', background: th.sidebar || th.accent + '60', height: '100%', flexShrink: 0, padding: '8px 6px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: th.accent + '40', marginBottom: 4 }} />
          {[40, 35, 50, 32, 45].map((w, i) => (
            <div key={i} style={{ height: 3, background: th.accent + '50', borderRadius: 2, width: `${w}%`, marginBottom: 2 }} />
          ))}
        </div>
      )}
      <div style={{ flex: 1, padding: hasSidebar ? '8px 6px' : '10px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Name bar */}
        <div style={{ height: 6, background: th.accent, borderRadius: 3, width: '70%', opacity: 0.9 }} />
        <div style={{ height: 3, background: th.accent, borderRadius: 2, width: '45%', opacity: 0.5 }} />
        {/* Rule */}
        <div style={{ height: 1, background: th.accent, opacity: 0.2, margin: '2px 0' }} />
        {/* Content lines */}
        {(th.lines || []).map((w, i) =>
          th.bars && i > 1 ? (
            <div key={i} style={{ height: 3, background: 'rgba(0,0,0,0.12)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${w}%`, background: th.accent, borderRadius: 2 }} />
            </div>
          ) : (
            <div key={i} style={{ height: 3, background: i === 0 ? th.accent + '80' : th.accent + '25', borderRadius: 2, width: `${w}%` }} />
          )
        )}
      </div>
    </div>
  )
}

const DEMO_DATA = {
  personal: {
    fullName: 'Rahul Sharma', jobTitle: 'Senior Software Engineer',
    email: 'rahul@example.com', phone: '+91 98765 43210',
    location: 'Bengaluru, Karnataka', linkedin: 'linkedin.com/in/rahul',
    summary: 'Results-driven engineer with 6 years building scalable products. Led teams of 8, shipped 15 production features.',
    github: 'github.com/rahulsharma',
  },
  experience: [
    { id: '1', title: 'Senior Engineer', company: 'Flipkart', location: 'Bengaluru', startDate: 'Jul 2021', endDate: '', current: true, bullets: ['Led migration of monolith to microservices', 'Mentored team of 5 junior engineers', 'Reduced API response time by 60%'] },
    { id: '2', title: 'Software Engineer', company: 'Infosys', location: 'Pune', startDate: 'Jun 2019', endDate: 'Jun 2021', current: false, bullets: ['Built payment gateway handling ₹50L/day', 'Implemented CI/CD pipeline reducing deploy time by 40%'] },
  ],
  education: [
    { id: '1', degree: 'B.Tech Computer Science', school: 'IIT Bombay', location: 'Mumbai', startDate: '2015', endDate: '2019', grade: '8.7 CGPA', achievements: "Dean's List" },
  ],
  skills: [
    { id: '1', category: 'Backend', items: 'Node.js, Python, Java, PostgreSQL, Redis, AWS' },
    { id: '2', category: 'Frontend', items: 'React, TypeScript, Next.js' },
    { id: '3', category: 'DevOps', items: 'Docker, Kubernetes, CI/CD, Terraform' },
  ],
  certifications: [{ id: '1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: 'Jan 2023' }],
  projects: [{ id: '1', name: 'E-Commerce Platform', description: 'Full-stack platform handling 10K+ daily orders', tech: 'React, Node.js, MongoDB', technologies: 'React, Node.js, MongoDB', url: 'github.com/demo', date: '2023' }],
  languages: [{ id: '1', language: 'English', proficiency: 'Fluent' }, { id: '2', language: 'Hindi', proficiency: 'Native' }],
  hobbies: [{ id: '1', name: 'Open Source' }, { id: '2', name: 'Photography' }],
  customSections: [],
}

function BadgePill({ badge }) {
  const style = BADGE_COLORS[badge] || { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' }
  return (
    <span style={{
      display: 'inline-block', fontSize: '7.5px', fontWeight: 800, letterSpacing: '0.06em',
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
      display: 'inline-block', fontSize: '7px', fontWeight: 800, letterSpacing: '0.04em',
      padding: '2px 7px', borderRadius: 999,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
    }}>
      {cfg.label}
    </span>
  )
}

export default function TemplatesPage() {
  const [preview, setPreview] = useState(null)
  const [catFilter, setCatFilter]  = useState('all')
  const [atsFilter, setAtsFilter]  = useState('all')
  const [tierFilter, setTierFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const { plan } = useAuthStore()

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

  const filtered = useMemo(() => {
    return TEMPLATES.filter(t => {
      if (catFilter !== 'all' && t.category !== catFilter && t.category !== 'all') return false
      if (atsFilter !== 'all' && t.atsLevel !== atsFilter) return false
      if (tierFilter !== 'all' && t.tier !== tierFilter) return false
      return true
    })
  }, [catFilter, atsFilter, tierFilter])

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-[0.35em] mb-5 border border-brand-100">
            <Sparkles size={10} />Design Collection 2026
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="text-5xl md:text-6xl font-black text-gray-950 tracking-tight mb-5 leading-[1.05]">
            Resume Templates
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-gray-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">
            {TEMPLATES.length} templates engineered for ATS performance — from campus freshers to C-suite executives.
          </motion.p>
        </div>

        {/* ── Filters ── */}
        <div className="mb-10">
          {/* Category Pills (always shown) */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {CATEGORY_FILTERS.map((f, i) => (
              <motion.button key={f.id}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.18 + i * 0.04 }}
                onClick={() => setCatFilter(f.id)}
                className={clsx('px-5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border outline-none',
                  catFilter === f.id
                    ? 'bg-gray-950 text-white border-gray-950 shadow-lg'
                    : 'bg-white text-gray-400 border-gray-200 hover:border-brand-300 hover:text-brand-600')}>
                {f.label}
              </motion.button>
            ))}
            <button
              onClick={() => setShowFilters(v => !v)}
              className={clsx('px-4 py-2 rounded-xl text-[11px] font-black transition-all border outline-none flex items-center gap-1.5',
                showFilters ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-gray-400 border-gray-200 hover:border-brand-300')}>
              <Filter size={11} />Filters
            </button>
          </div>

          {/* Advanced Filters (collapsible) */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden">
                <div className="flex flex-wrap justify-center gap-6 py-4 px-6 bg-gray-50 rounded-2xl border border-gray-100 mt-2">
                  {/* ATS Level */}
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
                  {/* Tier */}
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
                  {/* Reset */}
                  {(catFilter !== 'all' || atsFilter !== 'all' || tierFilter !== 'all') && (
                    <div className="flex items-end">
                      <button onClick={() => { setCatFilter('all'); setAtsFilter('all'); setTierFilter('all') }}
                        className="px-3 py-1.5 rounded-lg text-[10px] font-black text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-all">
                        ✕ Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result count */}
          <div className="text-center mt-3">
            <span className="text-[11px] font-semibold text-gray-400">
              Showing <span className="font-black text-gray-700">{filtered.length}</span> of {TEMPLATES.length} templates
            </span>
          </div>
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => {
              const locked = t.tier === 'pro' && plan !== 'pro'
              return (
                <motion.div key={t.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ delay: i * 0.03, duration: 0.22 }}
                  className={clsx('group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col',
                    locked ? 'border-gray-100 opacity-90' : 'border-gray-100 hover:border-brand-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer')}>

                  {/* PRO badge */}
                  {t.tier === 'pro' && (
                    <div className="absolute top-2.5 right-2.5 z-20 bg-gray-950 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow">PRO</div>
                  )}

                  {/* NEW badge for category templates */}
                  {['campus-pro','dev-stack','finance-edge'].includes(t.id) && (
                    <div className="absolute top-2.5 left-2.5 z-20 bg-green-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow">NEW</div>
                  )}

                  {/* Thumbnail */}
                  <div className="w-full aspect-[3/4] p-2.5 relative" onClick={() => setPreview(t)}>
                    <div className="w-full h-full rounded-lg overflow-hidden transition-transform duration-500 shadow-inner group-hover:scale-[1.02]">
                      <TemplateThumbnail t={t} />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-2.5 rounded-lg bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="flex items-center gap-1.5 bg-white text-gray-900 text-[9px] font-black px-4 py-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200">
                        <Eye size={10} /> Preview
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-3 pb-3 flex flex-col gap-2 flex-1">
                    <div>
                      <div className="text-[10px] font-black text-gray-900 uppercase tracking-widest truncate group-hover:text-brand-600 transition-colors">{t.name}</div>
                      <div className="text-[9px] text-gray-400 font-medium mt-0.5 line-clamp-2 leading-tight">{t.description}</div>
                    </div>

                    {/* Badges row */}
                    <div className="flex flex-wrap gap-1">
                      {t.badge && <BadgePill badge={t.badge} />}
                      {t.atsLevel && <ATSBadge level={t.atsLevel} />}
                    </div>

                    {/* Best for mini tags */}
                    {t.bestFor && t.bestFor.length > 0 && (
                      <div className="text-[8px] text-gray-400 leading-tight">
                        <span className="font-bold text-gray-500">Best for: </span>
                        {t.bestFor.slice(0, 2).join(' · ')}
                      </div>
                    )}

                    {/* CTA buttons */}
                    <div className="flex gap-1.5 mt-auto pt-1">
                      <button onClick={() => setPreview(t)}
                        className="flex-1 text-[9px] py-2 bg-gray-50 text-gray-500 font-black uppercase tracking-widest rounded-lg hover:bg-gray-100 transition-all border border-gray-100">
                        Preview
                      </button>
                      <Link to={`/builder?template=${t.id}`}
                        onClick={e => { if (locked) { e.preventDefault(); setPreview(t) } }}
                        className="flex-1 text-[9px] py-2 bg-gray-950 text-white font-black uppercase tracking-widest rounded-lg hover:bg-brand-600 transition-all text-center">
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

        {/* ── ATS Feature Cards ── */}
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { Icon: ShieldCheck, color: '#0E9F6E', title: 'ATS-Safe by Design', desc: 'No canvas tricks. Every glyph is clean, parseable text for 100% ATS extraction accuracy on Workday, Greenhouse, and Lever.' },
            { Icon: Layers,      color: '#6366F1', title: 'Indian Market First', desc: 'Keywords, formats, and layouts tuned for Naukri.com, LinkedIn India, and Indian corporate hiring — not US-only templates.' },
            { Icon: Sparkles,    color: '#F59E0B', title: 'Category-Specific', desc: 'Dedicated templates for freshers, developers, finance, creatives & more — each engineered for that specific domain.' },
          ].map(({ Icon, color, title, desc }) => (
            <div key={title} className="bg-gray-50 rounded-2xl p-7 border border-gray-100">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: color + '15' }}>
                <Icon size={18} color={color} />
              </div>
              <h3 className="text-sm font-black text-gray-900 mb-2">{title}</h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">{desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Preview Modal ── */}
      {preview && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[94vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-3 flex-wrap mb-1">
                  <h3 className="font-black text-gray-900 text-base tracking-tight">{preview.name}</h3>
                  {preview.badge && <BadgePill badge={preview.badge} />}
                  {preview.atsLevel && <ATSBadge level={preview.atsLevel} />}
                  {preview.tier === 'pro' && (
                    <span className="bg-gray-950 text-white text-[8px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest">PRO</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{preview.description}</p>
                {preview.bestFor && (
                  <p className="text-[10px] text-gray-500 mt-1">
                    <span className="font-bold">Best for: </span>{preview.bestFor.slice(0, 4).join(' · ')}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link to={`/builder?template=${preview.id}`}
                  onClick={e => { if (preview.tier === 'pro' && plan !== 'pro') { e.preventDefault() } }}
                  className="inline-flex items-center gap-1.5 text-xs font-black bg-gray-950 text-white px-4 py-2 rounded-xl hover:bg-brand-600 transition-all whitespace-nowrap">
                  Use Template <ArrowRight size={13} />
                </Link>
                <button onClick={() => setPreview(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {/* Modal Canvas */}
            <div ref={previewContainerRef} className="overflow-auto flex-1 p-5 bg-gray-100 flex justify-center">
              <div style={{
                width: '794px',
                transformOrigin: 'top center',
                transform: `scale(${previewScale})`,
                flexShrink: 0,
                marginBottom: `${(previewScale - 1) * 1123}px`,
              }}>
                <div className="resume-a4 bg-white shadow-sm">
                  <preview.component data={DEMO_DATA} settings={{ accentColor: preview.colors[0] }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
