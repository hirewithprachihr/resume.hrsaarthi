import { useState, useEffect, Suspense, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Plus, Trash2, Copy, Edit3, Clock, FileText, Loader,
  Sparkles, BarChart2, ChevronRight, Shield, Download,
  MoreVertical, Star, TrendingUp, LayoutTemplate, Zap,
  Target, Brain, ArrowUpRight, CheckCircle2, Rocket
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useResumeStore } from '../store/resumeStore'
import { getTemplate } from '../templates/registry'
import { scoreResume } from '../utils/atsScorer'
import { exportToPDF } from '../utils/pdfExporter'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

// ── Animated Count-Up Hook ─────────────────────────────────────
function useCountUp(target, duration = 800) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      observer.disconnect()
      let start = 0
      const step = target / (duration / 16)
      const timer = setInterval(() => {
        start += step
        if (start >= target) { setCount(target); clearInterval(timer) }
        else setCount(Math.floor(start))
      }, 16)
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])
  return [count, ref]
}

// ── Mini resume thumbnail (live render at tiny scale) ─────────
function ResumeMiniPreview({ resumeData, settings }) {
  const template = getTemplate(settings?.templateId || 'ats-classic')
  const Comp = template.component
  return (
    <div style={{
      width: '794px', height: '1123px',
      transform: 'scale(0.17)', transformOrigin: 'top left',
      pointerEvents: 'none', position: 'absolute', top: 0, left: 0,
      background: '#fff', overflow: 'hidden',
    }}>
      <Suspense fallback={null}>
        <Comp data={resumeData} settings={settings} />
      </Suspense>
    </div>
  )
}

// ── ATS Score badge ───────────────────────────────────────────
function ATSBadge({ resumeData }) {
  const score = scoreResume(resumeData)
  const grade = score?.grade || { color: '#94a3b8', label: '—' }
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider"
      style={{ background: grade.color + '18', color: grade.color }}>
      <Shield size={8} />
      {score ? `${score.total} ATS` : '—'}
    </div>
  )
}

// ── 3D Tilt Card ─────────────────────────────────────────────
function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 300, damping: 30 })

  const handleMouse = (e) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={cardRef}
      className={className}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', perspective: 800 }}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
    >
      {children}
    </motion.div>
  )
}

// ── Resume Card ───────────────────────────────────────────────
function ResumeCard({ resume, onLoad, onDelete, onDuplicate, onDownload }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const template = getTemplate(resume.settings?.templateId || 'ats-classic')
  const title    = resume.resumeData?.personal?.fullName?.trim() || 'Untitled Resume'
  const jobTitle = resume.resumeData?.personal?.jobTitle?.trim() || ''
  const thumbH   = 1123 * 0.17

  return (
    <TiltCard className="group relative cursor-pointer">
      <motion.div
        layout
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="bg-white rounded-2xl border border-gray-100/80 overflow-hidden transition-shadow duration-300"
        style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
        whileHover={{ boxShadow: '0 16px 48px rgba(91,75,245,0.12), 0 2px 12px rgba(0,0,0,0.06)' }}
        onClick={() => onLoad(resume.id)}
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-slate-50"
          style={{ height: thumbH, width: '100%' }}>
          <div style={{ width: 794 * 0.17, height: '100%', position: 'relative' }}>
            <ResumeMiniPreview resumeData={resume.resumeData} settings={resume.settings} />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />
          {/* Template badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[7px] font-black text-gray-500 uppercase tracking-wider border border-white shadow-sm">
            {template.name}
          </div>
          {/* Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200"
            onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen) }}>
            <button className="w-7 h-7 bg-white/95 rounded-full flex items-center justify-center shadow-lg border border-white hover:scale-110 transition-transform">
              <MoreVertical size={11} className="text-gray-600" />
            </button>
            <AnimatePresence>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={e => { e.stopPropagation(); setMenuOpen(false) }} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    className="absolute right-0 top-9 w-44 rounded-2xl border overflow-hidden z-20"
                    style={{ background: '#0A0A0F', borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 16px 48px rgba(0,0,0,0.5)' }}>
                    <DarkMenuItem icon={<Edit3 size={12} />}    onClick={() => onLoad(resume.id)}>Edit Resume</DarkMenuItem>
                    <DarkMenuItem icon={<Copy size={12} />}     onClick={() => onDuplicate(resume.id)}>Duplicate</DarkMenuItem>
                    <DarkMenuItem icon={downloading ? <Loader size={12} className="animate-spin" /> : <Download size={12} />}
                      onClick={async () => { setDownloading(true); await onDownload(resume); setDownloading(false) }}>
                      Download PDF
                    </DarkMenuItem>
                    <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '2px 0' }} />
                    <DarkMenuItem icon={<Trash2 size={12} />}   onClick={() => onDelete(resume.id, title)} danger>Delete</DarkMenuItem>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          {/* Edit overlay on hover */}
          <div className="absolute inset-0 bg-indigo-950/0 group-hover:bg-indigo-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 rounded-xl text-xs font-black text-indigo-700 shadow-xl">
              <Edit3 size={12} /> Open Editor
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-50">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-gray-900 truncate">{title}</div>
              {jobTitle && <div className="text-[9px] text-gray-400 truncate mt-0.5">{jobTitle}</div>}
            </div>
            <ATSBadge resumeData={resume.resumeData} />
          </div>
          <div className="flex items-center gap-1 text-[8px] text-gray-300">
            <Clock size={8} />
            {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : 'Recently edited'}
          </div>
        </div>
      </motion.div>
    </TiltCard>
  )
}

function DarkMenuItem({ icon, children, onClick, danger = false }) {
  return (
    <button onClick={e => { e.stopPropagation(); onClick() }}
      className={clsx(
        'w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold transition-colors',
        danger ? 'text-red-400 hover:bg-red-500/10' : 'text-white/70 hover:text-white hover:bg-white/8'
      )}>
      {icon}{children}
    </button>
  )
}

// ── Stat Card (with count-up) ─────────────────────────────────
function StatCard({ icon: Icon, label, value, color, isNumber = false, suffix = '' }) {
  const numVal = isNumber ? Number(value) : 0
  const [count, ref] = useCountUp(isNumber ? numVal : 0)

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-4"
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
      {/* Glow corner */}
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: color, transform: 'translate(30%, -30%)' }} />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color + '18' }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</div>
        <div className="font-black text-gray-900 text-lg leading-none">
          {isNumber ? `${count}${suffix}` : value}
        </div>
      </div>
    </div>
  )
}

// ── Quick Action Link ─────────────────────────────────────────
function QuickLink({ to, icon: Icon, color, title, desc }) {
  return (
    <Link to={to} className="group relative overflow-hidden rounded-2xl p-5 flex items-center gap-4 transition-all duration-300 hover:-translate-y-0.5"
      style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: `radial-gradient(circle at 20% 50%, ${color}08, transparent 70%)` }} />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
        style={{ background: color + '15' }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-gray-900">{title}</div>
        <div className="text-xs text-gray-400 mt-0.5 leading-tight">{desc}</div>
      </div>
      <ArrowUpRight size={16} className="text-gray-300 group-hover:text-gray-600 transition-colors flex-shrink-0" />
    </Link>
  )
}

// ── Main Dashboard ────────────────────────────────────────────
export default function DashboardPage() {
  const { savedResumes, loadResume, deleteResume, duplicateResume, newResume, loadCloudResumes } = useResumeStore()
  const { user, plan } = useAuthStore()
  const navigate = useNavigate()
  const [syncing, setSyncing]         = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    if (user?.id) {
      setSyncing(true)
      loadCloudResumes().finally(() => setSyncing(false))
    }
  }, [user?.id])

  const handleLoad     = (id) => { loadResume(id);  navigate('/builder') }
  const handleNew      = ()   => { newResume();      navigate('/builder') }
  const handleDuplicate = async (id) => {
    duplicateResume(id)
    toast.success('Resume duplicated!')
  }
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    await deleteResume(deleteTarget.id)
    toast.success('Deleted')
    setDeleteTarget(null)
  }
  const handleDownload = async (resume) => {
    const tpl = getTemplate(resume.settings?.templateId || 'ats-classic')
    try {
      await exportToPDF(resume.resumeData, resume.settings, tpl.component, resume.resumeData?.personal?.fullName || 'resume')
      toast.success('PDF downloaded!')
    } catch { toast.error('PDF failed — try opening the resume first.') }
  }

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #F5F7FF 0%, #EEF2FF 100%)' }}>
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl"
          style={{ background: 'linear-gradient(135deg, #5B4BF5, #0EC8A0)' }}>
          <Rocket size={28} className="text-white" />
        </div>
        <h2 className="font-black text-2xl text-gray-900 mb-2">Sign in to continue</h2>
        <p className="text-gray-500 mb-6 text-sm">Access your resumes, templates, and AI tools.</p>
        <Link to="/login?returnTo=/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl text-sm transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #5B4BF5, #7C3AED)', boxShadow: '0 4px 20px rgba(91,75,245,0.4)' }}>
          Sign In or Sign Up <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  )

  const bestScore = savedResumes.reduce((best, r) => {
    if (!r.resumeData?.personal) return best
    const s = scoreResume(r.resumeData)?.total || 0
    return s > best ? s : best
  }, 0)

  const firstName = user.name?.split(' ')[0] || 'there'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="min-h-screen" style={{ background: '#F5F7FF' }}>

      {/* ── Premium Gradient Hero Banner ─────────────────────── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1040 60%, #0A1020 100%)' }}>
        {/* Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px] opacity-20 pointer-events-none"
          style={{ background: '#5B4BF5' }} />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-[80px] opacity-15 pointer-events-none"
          style={{ background: '#0EC8A0' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              {/* Greeting */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                {greeting}, {firstName} 👋
              </motion.div>
              <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="text-3xl font-black text-white tracking-tight mb-1">
                My Resume Dashboard
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}
                className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {savedResumes.length > 0
                  ? `${savedResumes.length} resume${savedResumes.length > 1 ? 's' : ''} · Best ATS: ${bestScore}/118`
                  : 'Build your first ATS-optimised resume'}
              </motion.p>
            </div>

            <div className="flex items-center gap-3">
              {/* Plan badge */}
              {plan === 'pro' ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border"
                  style={{ background: 'rgba(212,168,67,0.15)', color: '#D4A843', borderColor: 'rgba(212,168,67,0.3)' }}>
                  <Star size={12} className="fill-current" /> Elite Pro
                </div>
              ) : (
                <Link to="/upgrade"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:opacity-90"
                  style={{ background: 'rgba(212,168,67,0.15)', color: '#D4A843', border: '1px solid rgba(212,168,67,0.3)' }}>
                  <Star size={12} /> Upgrade to Pro
                </Link>
              )}
              {syncing && (
                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black"
                  style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                  <Loader size={10} className="animate-spin" /> Syncing
                </div>
              )}
              <motion.button onClick={handleNew} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all"
                style={{ background: 'linear-gradient(135deg, #5B4BF5, #7C3AED)', boxShadow: '0 4px 20px rgba(91,75,245,0.4)' }}>
                <Plus size={14} /> New Resume
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Stats Row ───────────────────────────────────── */}
        {savedResumes.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard icon={FileText}   label="Total Resumes" value={savedResumes.length} isNumber color="#5B4BF5" />
            <StatCard icon={TrendingUp} label="Best ATS Score" value={bestScore} isNumber suffix="/118" color="#0EC8A0" />
            <StatCard icon={BarChart2}  label="Plan"          value={plan === 'pro' ? '⭐ Elite Pro' : 'Free'} color="#D4A843" />
          </motion.div>
        )}

        {/* ── Resume Grid ─────────────────────────────────── */}
        {syncing && savedResumes.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            {[1,2,3,4,5].map(n => (
              <div key={n} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="bg-gradient-to-br from-gray-100 to-slate-100" style={{ height: 1123 * 0.17 }} />
                <div className="p-3 space-y-2">
                  <div className="h-2.5 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-2 bg-gray-50 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : savedResumes.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-16 text-center mb-8 border-2 border-dashed"
            style={{ background: 'rgba(91,75,245,0.03)', borderColor: 'rgba(91,75,245,0.15)' }}>
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl"
              style={{ background: 'linear-gradient(135deg, #5B4BF5, #0EC8A0)' }}>
              <Sparkles size={32} className="text-white" />
            </div>
            <h2 className="font-black text-xl text-gray-900 mb-2">No resumes yet</h2>
            <p className="text-gray-400 text-sm mb-7 max-w-xs mx-auto">Pick from 15 premium ATS-optimised templates and build your perfect resume in minutes.</p>
            <motion.button onClick={handleNew} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-black rounded-xl text-sm"
              style={{ background: 'linear-gradient(135deg, #5B4BF5, #7C3AED)', boxShadow: '0 6px 24px rgba(91,75,245,0.4)' }}>
              <Sparkles size={15} /> Create My First Resume
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
            <AnimatePresence mode="popLayout">
              {savedResumes.map(resume => (
                <ResumeCard key={resume.id} resume={resume}
                  onLoad={handleLoad}
                  onDelete={(id, title) => setDeleteTarget({ id, title })}
                  onDuplicate={handleDuplicate}
                  onDownload={handleDownload}
                />
              ))}
              {/* Add new card */}
              <motion.button key="new" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={handleNew} whileHover={{ y: -4 }}
                className="group rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 min-h-[200px] transition-all duration-300"
                style={{ borderColor: 'rgba(91,75,245,0.2)', background: 'rgba(91,75,245,0.02)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(91,75,245,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(91,75,245,0.2)'}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                  style={{ background: 'rgba(91,75,245,0.1)' }}>
                  <Plus size={20} style={{ color: '#5B4BF5' }} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#5B4BF5' }}>New Resume</span>
              </motion.button>
            </AnimatePresence>
          </div>
        )}

        {/* ── Quick Actions ──────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickLink to="/templates"     icon={LayoutTemplate} color="#5B4BF5" title="Browse Templates"   desc="15 premium ATS-optimised designs" />
          <QuickLink to="/cover-letter"  icon={FileText}       color="#0EC8A0" title="Cover Letter AI"    desc="Generate a tailored letter in 30s" />
          <QuickLink to="/interview-prep" icon={Brain}         color="#8B5CF6" title="Interview Coach"    desc="12 role-specific prep questions" />
          <QuickLink to={plan === 'pro' ? '/dashboard' : '/upgrade'}
                                         icon={plan === 'pro' ? CheckCircle2 : Star}
                                         color="#D4A843"
                                         title={plan === 'pro' ? 'Elite Pro Active' : 'Upgrade to Pro'}
                                         desc={plan === 'pro' ? 'All features unlocked' : 'Unlock all 17 templates + AI tools'} />
        </motion.div>
      </div>

      {/* Delete modal */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Resume?"
        message={`"${deleteTarget?.title}" will be permanently deleted.`}
        confirmLabel="Delete" danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
