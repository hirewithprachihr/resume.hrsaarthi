import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X, ArrowRight, Sparkles, ShieldCheck, Layers } from 'lucide-react'
import { TEMPLATES } from '../templates/registry'
import { useAuthStore } from '../store/authStore'
import { clsx } from 'clsx'

// ── Gradient visual thumbnails keyed by template id ──────────────────
const THUMB = {
  'ats-classic'     : { bg: 'linear-gradient(135deg,#f8fafc 0%,#e2e8f0 100%)', accent: '#1A56DB', lines: [70,55,45,55,40,50] },
  'corporate-pro'   : { bg: 'linear-gradient(135deg,#1A56DB 0%,#0f172a 100%)', accent: '#fff', lines: [65,50,45,55,35], sidebar: '#1a3a7a' },
  'tech-minimal'    : { bg: 'linear-gradient(135deg,#0f172a 0%,#1e293b 100%)', accent: '#0E9F6E', lines: [70,52,40,58,38] },
  'creative-sidebar': { bg: 'linear-gradient(135deg,#7C3AED 0%,#5b21b6 100%)', accent: '#fff', lines: [60,50,55,40,48], sidebar: '#6d28d9' },
  'fresher-first'   : { bg: 'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)', accent: '#0E9F6E', lines: [60,70,55,45,52] },
  'executive-bold'  : { bg: 'linear-gradient(135deg,#1A56DB 0%,#0f172a 100%)', accent: '#cbd5e1', lines: [75,55,45,60,40] },
  'elegant-modern'  : { bg: 'linear-gradient(135deg,#fffbeb 0%,#fef3c7 100%)', accent: '#B45309', lines: [65,50,45,55,38] },
  'startup-hustler' : { bg: 'linear-gradient(135deg,#fff1f2 0%,#ffe4e6 100%)', accent: '#DC2626', lines: [72,55,48,58,40] },
  'infographic-pro' : { bg: 'linear-gradient(135deg,#ecfeff 0%,#cffafe 100%)', accent: '#0891B2', lines: [60,50,45,55,42], bars: true },
  'international'   : { bg: 'linear-gradient(135deg,#eef2ff 0%,#e0e7ff 100%)', accent: '#4F46E5', lines: [65,52,48,58,40] },
  'linkedin-export' : { bg: 'linear-gradient(135deg,#eff6ff 0%,#dbeafe 100%)', accent: '#0077B5', lines: [68,52,45,55,40] },
  'vedanta'         : { bg: 'linear-gradient(135deg,#0f1f3d 0%,#1e3a6e 100%)', accent: '#D4AF37', lines: [70,55,45,58,38] },
  'minimal-ink'     : { bg: 'linear-gradient(135deg,#fafafa 0%,#f1f5f9 100%)', accent: '#0f172a', lines: [72,56,46,58,42] },
  'split-screen'    : { bg: 'linear-gradient(135deg,#1e2433 0%,#2d3748 100%)', accent: '#6366F1', lines: [65,50,48,55,40], sidebar: '#252d3e' },
  'timeline-pro'    : { bg: 'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%)', accent: '#0891B2', lines: [68,54,45,58,40], timeline: true },
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
  },
  experience: [{ id: '1', title: 'Senior Engineer', company: 'Flipkart', location: 'Bengaluru', startDate: 'Jul 2021', endDate: '', current: true, bullets: ['Led migration of monolith to microservices', 'Mentored team of 5 junior engineers', 'Reduced API response time by 60%'] }, { id: '2', title: 'Software Engineer', company: 'Infosys', location: 'Pune', startDate: 'Jun 2019', endDate: 'Jun 2021', current: false, bullets: ['Built payment gateway handling ₹50L/day', 'Implemented CI/CD pipeline'] }],
  education: [{ id: '1', degree: 'B.Tech Computer Science', school: 'IIT Bombay', location: 'Mumbai', startDate: '2015', endDate: '2019', grade: '8.7 CGPA', achievements: "Dean's List" }],
  skills: [{ id: '1', category: 'Backend', items: 'Node.js, Python, Java, PostgreSQL, Redis, AWS' }, { id: '2', category: 'Frontend', items: 'React, TypeScript, Next.js' }],
  certifications: [{ id: '1', name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: 'Jan 2023' }],
  projects: [{ id: '1', name: 'E-Commerce Platform', description: 'Full-stack platform handling 10K+ daily orders', tech: 'React, Node.js, MongoDB', url: '', date: '2023' }],
  languages: [{ id: '1', language: 'English', proficiency: 'Fluent' }, { id: '2', language: 'Hindi', proficiency: 'Native' }],
  hobbies: [{ id: '1', name: 'Open Source' }, { id: '2', name: 'Photography' }],
  customSections: [],
}

export default function TemplatesPage() {
  const [preview, setPreview] = useState(null)
  const [filter, setFilter] = useState('all')
  const { plan } = useAuthStore()

  // ── Responsive canvas scaler ─────────────────────────────────
  const previewContainerRef = useRef(null)
  const [previewScale, setPreviewScale] = useState(0.62)

  useEffect(() => {
    if (!preview || !previewContainerRef.current) return
    const updateScale = () => {
      const availW = previewContainerRef.current?.clientWidth || 794
      const padding = 40 // px padding on each side inside modal
      const scale = Math.min(0.95, (availW - padding) / 794)
      setPreviewScale(scale)
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [preview])

  const filtered = filter === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.tier === filter)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-black uppercase tracking-[0.35em] mb-5 border border-brand-100">
            <Sparkles size={10} />Design Collection
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
            className="text-5xl md:text-6xl font-black text-gray-950 tracking-tight mb-5 leading-[1.05]">
            Resume Templates
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="text-gray-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">
            Every template is precision-engineered for ATS performance and world-class visual hierarchy.
          </motion.p>
        </div>

        {/* ── Filter Tabs ── */}
        <div className="flex justify-center gap-2 mb-14">
          {[
            { id: 'all', label: 'All Templates' },
            { id: 'free', label: 'Free' },
            { id: 'pro',  label: '⭐ Pro' },
          ].map((f, i) => (
            <motion.button key={f.id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.06 }}
              onClick={() => setFilter(f.id)}
              className={clsx('px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border outline-none',
                filter === f.id
                  ? 'bg-gray-950 text-white border-gray-950 shadow-lg'
                  : 'bg-white text-gray-400 border-gray-200 hover:border-brand-300 hover:text-brand-600')}>
              {f.label}
            </motion.button>
          ))}
        </div>

        {/* ── Grid ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {filtered.map((t, i) => {
            const locked = t.tier === 'pro' && plan !== 'pro'
            return (
              <motion.div key={t.id} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className={clsx('group relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden',
                  locked ? 'border-gray-100 opacity-90' : 'border-gray-100 hover:border-brand-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer')}>

                {/* PRO badge */}
                {t.tier === 'pro' && (
                  <div className="absolute top-2.5 right-2.5 z-10 bg-gray-950 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shadow">PRO</div>
                )}

                {/* Thumbnail */}
                <div className="w-full aspect-[3/4] p-2.5" onClick={() => setPreview(t)}>
                  <div className="w-full h-full rounded-lg overflow-hidden group-hover:scale-[1.02] transition-transform duration-500 shadow-inner">
                    <TemplateThumbnail t={t} />
                  </div>
                </div>

                {/* Footer */}
                <div className="px-3 pb-3">
                  <div className="text-[10px] font-black text-gray-900 uppercase tracking-widest truncate group-hover:text-brand-600 transition-colors">{t.name}</div>
                  <div className="text-[9px] text-gray-400 font-medium mt-0.5 truncate leading-tight">{t.description}</div>
                  <div className="flex gap-2 mt-3">
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
        </div>

        {/* ── ATS Feature Cards ── */}
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-28 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { Icon: ShieldCheck, color: '#0E9F6E', title: 'ATS-Safe by Design', desc: 'No canvas tricks. Every glyph is clean, parseable text for 100% ATS extraction accuracy.' },
            { Icon: Layers,      color: '#6366F1', title: 'Structural Hierarchy', desc: 'Section flows mirror modern HR screening logic — never confuses the parser.' },
            { Icon: Sparkles,    color: '#F59E0B', title: 'Keyword-First Layouts', desc: "We don't hide your skills behind graphics — we frame them for peak ATS visibility." },
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.18 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="font-black text-gray-900 text-base tracking-tight">{preview.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{preview.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link to={`/builder?template=${preview.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-black bg-gray-950 text-white px-4 py-2 rounded-xl hover:bg-brand-600 transition-all">
                  Use Template <ArrowRight size={13} />
                </Link>
                <button onClick={() => setPreview(null)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
            {/* Modal Canvas — responsive scaler */}
            <div
              ref={previewContainerRef}
              className="overflow-auto flex-1 p-5 bg-gray-100 flex justify-center"
            >
              <div style={{
                width: '794px',
                transformOrigin: 'top center',
                transform: `scale(${previewScale})`,
                flexShrink: 0,
                marginBottom: `${(previewScale - 1) * 1123}px`, // collapse whitespace from scale shrink
              }}>
                <preview.component data={DEMO_DATA} settings={{ accentColor: preview.colors[0] }} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
