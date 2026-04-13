import { useState, useEffect, Suspense, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  Plus, Trash2, Copy, Edit3, Clock, FileText, Loader,
  Sparkles, BarChart2, ChevronRight, Shield, Download,
  MoreVertical, Star, TrendingUp, LayoutTemplate, Zap,
  Target, Brain, ArrowUpRight, CheckCircle2, Rocket, X, ExternalLink
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useResumeStore } from '../store/resumeStore'
import { getTemplate } from '../templates/registry'
import { scoreResume } from '../utils/atsScorer'
import { exportToPDF } from '../utils/pdfExporter'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'
import {
  fetchJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from '../services/supabase'
import { EVENT_NAMES, trackEvent } from '../services/analytics'

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
      {score ? `${score.total} ready` : '—'}
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
function ResumeCard({ resume, onLoad, onDelete, onDuplicate, onDownload, onTailor }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const template = getTemplate(resume.settings?.templateId || 'ats-classic')
  const title    = resume.resumeData?.personal?.fullName?.trim() || 'Untitled Resume'
  const jobTitle = resume.resumeData?.personal?.jobTitle?.trim() || ''
  const thumbH   = 1123 * 0.17
  const hasJd    = !!(resume.jobDescription && String(resume.jobDescription).trim())
  const isPublic = !!resume.isPublic

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
          <div className="flex flex-wrap gap-1 mb-1.5">
            {hasJd && (
              <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md bg-violet-50 text-violet-600 border border-violet-100">JD saved</span>
            )}
            {isPublic && (
              <span className="text-[7px] font-black uppercase px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">Public link</span>
            )}
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onTailor(resume) }}
            className="w-full mt-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors"
          >
            <Target size={10} className="inline mr-1 -mt-0.5" /> Tailor to a job
          </button>
          <div className="flex items-center gap-1 text-[8px] text-gray-300 mt-1">
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

// ── Job Application Modal ────────────────────────────────────
function JobApplicationModal({ open, application, resumes, onClose, onSave, onDelete }) {
  const [formData, setFormData] = useState({
    company: '',
    role_title: '',
    applied_date: '',
    notes: '',
    job_url: '',
    resume_id: '',
    status: 'applied',
  })
  const [errors, setErrors] = useState({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isEditMode = !!application?.id

  useEffect(() => {
    if (open) {
      if (application) {
        // Edit mode - populate form with existing data
        setFormData({
          company: application.company || '',
          role_title: application.role_title || '',
          applied_date: application.applied_date || '',
          notes: application.notes || '',
          job_url: application.job_url || '',
          resume_id: application.resume_id || '',
          status: application.status || 'applied',
        })
      } else {
        // Add mode - reset form
        setFormData({
          company: '',
          role_title: '',
          applied_date: '',
          notes: '',
          job_url: '',
          resume_id: '',
          status: 'applied',
        })
      }
      setErrors({})
      setShowDeleteConfirm(false)
    }
  }, [open, application])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
    }
    if (!formData.role_title.trim()) {
      newErrors.role_title = 'Role title is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setSaving(true)
    try {
      const dataToSave = {
        ...formData,
        company: formData.company.trim(),
        role_title: formData.role_title.trim(),
        notes: formData.notes.trim() || null,
        job_url: formData.job_url.trim() || null,
        applied_date: formData.applied_date || null,
        resume_id: formData.resume_id || null,
      }

      if (isEditMode) {
        await onSave(application.id, dataToSave)
      } else {
        await onSave(dataToSave)
      }
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to save application')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await onDelete(application.id)
      setShowDeleteConfirm(false)
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to delete application')
    } finally {
      setDeleting(false)
    }
  }

  if (!open) return null

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        role="presentation"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-gray-900">
                {isEditMode ? 'Edit Job Application' : 'Add Job Application'}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Track your job application progress
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`input-field w-full ${errors.company ? 'border-red-300' : ''}`}
                placeholder="e.g., Google, Microsoft, Startup Inc."
                value={formData.company}
                onChange={e => setFormData(f => ({ ...f, company: e.target.value }))}
              />
              {errors.company && (
                <p className="text-xs text-red-500 mt-1">{errors.company}</p>
              )}
            </div>

            {/* Role Title */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Role Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className={`input-field w-full ${errors.role_title ? 'border-red-300' : ''}`}
                placeholder="e.g., Senior Software Engineer, Product Manager"
                value={formData.role_title}
                onChange={e => setFormData(f => ({ ...f, role_title: e.target.value }))}
              />
              {errors.role_title && (
                <p className="text-xs text-red-500 mt-1">{errors.role_title}</p>
              )}
            </div>

            {/* Status and Applied Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Status
                </label>
                <select
                  className="input-field w-full"
                  value={formData.status}
                  onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}
                >
                  <option value="applied">Applied</option>
                  <option value="screening">Screening</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Applied Date
                </label>
                <input
                  type="date"
                  className="input-field w-full"
                  value={formData.applied_date}
                  onChange={e => setFormData(f => ({ ...f, applied_date: e.target.value }))}
                />
              </div>
            </div>

            {/* Job URL */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Job URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  className="input-field w-full pr-10"
                  placeholder="https://company.com/careers/job-id"
                  value={formData.job_url}
                  onChange={e => setFormData(f => ({ ...f, job_url: e.target.value }))}
                />
                {formData.job_url && (
                  <a
                    href={formData.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

            {/* Linked Resume */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Link Resume (Optional)
              </label>
              <select
                className="input-field w-full"
                value={formData.resume_id}
                onChange={e => setFormData(f => ({ ...f, resume_id: e.target.value }))}
              >
                <option value="">No resume linked</option>
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.title || r.resumeData?.personal?.fullName || 'Untitled Resume'}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Link the resume you used for this application
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Notes
              </label>
              <textarea
                className="input-field w-full resize-none"
                rows={4}
                placeholder="Add notes about the application, interview details, contacts, etc."
                value={formData.notes}
                onChange={e => setFormData(f => ({ ...f, notes: e.target.value }))}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              {isEditMode && (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              )}
              <div className="flex-1" />
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {isEditMode ? 'Save Changes' : 'Add Application'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete Application?"
        message={`"${formData.company} - ${formData.role_title}" will be permanently deleted.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        danger
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  )
}

// ── Job Card (for Kanban) ─────────────────────────────────────
function JobCard({ application, onDragStart, onDragEnd, onEdit }) {
  const [isDragging, setIsDragging] = useState(false)
  const statusColors = {
    applied: '#5B4BF5',
    screening: '#0EC8A0',
    interview: '#8B5CF6',
    offer: '#10B981',
    rejected: '#EF4444'
  }
  
  const color = statusColors[application.status] || '#94a3b8'
  const isOfferOrRejected = application.status === 'offer' || application.status === 'rejected'
  
  const handleDragStart = (e) => {
    setIsDragging(true)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify(application))
    if (onDragStart) onDragStart(application)
  }
  
  const handleDragEnd = () => {
    setIsDragging(false)
    if (onDragEnd) onDragEnd()
  }

  const handleClick = () => {
    if (onEdit) onEdit(application)
  }
  
  return (
    <TiltCard className="mb-3">
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        style={{ 
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
              {application.company}
            </h4>
            <p className="text-xs text-gray-500 truncate mt-0.5">{application.role_title}</p>
          </div>
          {isOfferOrRejected && (
            <div 
              className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider"
              style={{ 
                background: color + '18', 
                color: color 
              }}
            >
              {application.status}
            </div>
          )}
        </div>
        
        {application.notes && (
          <p className="text-xs text-gray-400 line-clamp-2 mb-2">{application.notes}</p>
        )}

        {application.job_url && (
          <div className="flex items-center gap-1 text-[10px] text-indigo-400 mb-2">
            <ExternalLink size={10} />
            <span className="truncate">Job posting</span>
          </div>
        )}
        
        <div className="flex items-center justify-between text-[10px] text-gray-300">
          <div className="flex items-center gap-1">
            <Clock size={10} />
            {application.applied_date 
              ? new Date(application.applied_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
              : application.updated_at 
                ? new Date(application.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
                : 'Recent'
            }
          </div>
          {application.resume_id && (
            <div className="flex items-center gap-1 text-indigo-400">
              <FileText size={10} />
              <span>Linked</span>
            </div>
          )}
        </div>

        {/* Edit hint on hover */}
        <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 rounded-xl transition-colors pointer-events-none" />
      </motion.div>
    </TiltCard>
  )
}

// ── Kanban Column ─────────────────────────────────────────────
function KanbanColumn({ title, status, applications, color, onDrop, onDragStart, onDragEnd, onEdit }) {
  const [isDragOver, setIsDragOver] = useState(false)
  
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }
  
  const handleDragLeave = (e) => {
    // Only set to false if we're leaving the column entirely
    if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    try {
      const data = e.dataTransfer.getData('application/json')
      if (data) {
        const application = JSON.parse(data)
        // Determine the target status based on the column
        let targetStatus = status
        if (status === 'offer-rejected') {
          // For the combined column, keep the original status if it's offer or rejected
          targetStatus = application.status === 'offer' || application.status === 'rejected' 
            ? application.status 
            : 'offer'
        }
        
        if (onDrop && application.status !== targetStatus) {
          onDrop(application.id, targetStatus)
        }
      }
    } catch (err) {
      console.error('Drop failed:', err)
    }
  }
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div 
          className="w-2 h-2 rounded-full" 
          style={{ background: color }}
        />
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-600">
          {title}
        </h3>
        <div 
          className="ml-auto w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
          style={{ background: color + '18', color: color }}
        >
          {applications.length}
        </div>
      </div>
      
      <div 
        className="flex-1 rounded-2xl p-3 min-h-[200px] transition-all duration-200"
        style={{ 
          background: isDragOver ? color + '15' : color + '05', 
          border: isDragOver ? `2px solid ${color}` : `1px dashed ${color}30`,
          boxShadow: isDragOver ? `0 0 0 4px ${color}10` : 'none'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="popLayout">
          {applications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-32 text-center"
            >
              <p className="text-xs text-gray-300 font-medium">
                {isDragOver ? 'Drop here' : 'No jobs yet'}
              </p>
            </motion.div>
          ) : (
            applications.map(app => (
              <JobCard 
                key={app.id} 
                application={app} 
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onEdit={onEdit}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────
export default function DashboardPage() {
  const { savedResumes, loadResume, deleteResume, duplicateResume, newResume, loadCloudResumes } = useResumeStore()
  const { user, plan } = useAuthStore()
  const navigate = useNavigate()
  const [syncing, setSyncing]         = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [applications, setApplications] = useState([])
  const [appsLoading, setAppsLoading] = useState(false)
  const [tailorTarget, setTailorTarget] = useState(null)
  const [tailorJd, setTailorJd]       = useState('')
  const [showJobModal, setShowJobModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  useEffect(() => {
    if (user?.id) {
      setSyncing(true)
      loadCloudResumes(true).finally(() => setSyncing(false))
    }
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return
    setAppsLoading(true)
    fetchJobApplications(user.id)
      .then(setApplications)
      .catch(() => {})
      .finally(() => setAppsLoading(false))
  }, [user?.id])

  const handleTailorOpen = (resume) => {
    setTailorTarget(resume)
    setTailorJd(resume.jobDescription || '')
  }

  const handleTailorSubmit = () => {
    if (!tailorTarget) return
    try {
      sessionStorage.setItem('hwp-prefill-jd', tailorJd || '')
      sessionStorage.setItem('hwp-open-tab', 'ats')
    } catch { /* ignore */ }
    loadResume(tailorTarget.id)
    trackEvent(EVENT_NAMES.TAILOR_TO_JOB_STARTED, { resumeId: tailorTarget.id })
    navigate('/builder')
    setTailorTarget(null)
    toast.success('Opening builder with your job description')
  }

  const handleAppStatus = async (id, newStatus) => {
    // Optimistic UI update
    const previousApplications = [...applications]
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus, updated_at: new Date().toISOString() } : a))
    
    try {
      await updateJobApplication(id, { status: newStatus })
      toast.success('Job status updated')
    } catch (err) {
      // Rollback on error
      setApplications(previousApplications)
      toast.error('Failed to update status. Please try again.')
      console.error('Status update failed:', err)
    }
  }

  const handleOpenJobModal = (job = null) => {
    setEditingJob(job)
    setShowJobModal(true)
  }

  const handleCloseJobModal = () => {
    setShowJobModal(false)
    setEditingJob(null)
  }

  const handleSaveJob = async (idOrData, updateData) => {
    if (!user?.id) return

    try {
      if (typeof idOrData === 'string') {
        // Edit mode - idOrData is the ID, updateData has the fields
        const updated = await updateJobApplication(idOrData, updateData)
        setApplications(prev => prev.map(a => a.id === idOrData ? updated : a))
        toast.success('Application updated')
        trackEvent(EVENT_NAMES.JOB_APPLICATION_UPDATED, { id: idOrData })
      } else {
        // Add mode - idOrData is the data object
        const row = {
          user_id: user.id,
          ...idOrData,
        }
        const created = await createJobApplication(row)
        setApplications(prev => [created, ...prev])
        toast.success('Application added')
        trackEvent(EVENT_NAMES.JOB_APPLICATION_CREATED, { id: created.id })
      }
    } catch (err) {
      throw err // Let the modal handle the error
    }
  }

  const handleDeleteJob = async (id) => {
    try {
      await deleteJobApplication(id)
      setApplications(prev => prev.filter(a => a.id !== id))
      toast.success('Application deleted')
      trackEvent(EVENT_NAMES.JOB_APPLICATION_DELETED, { id })
    } catch (err) {
      throw err // Let the modal handle the error
    }
  }

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
                  ? `${savedResumes.length} resume${savedResumes.length > 1 ? 's' : ''} · Best readiness: ${bestScore}/118`
                  : 'Build your first resume'}
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
            <StatCard icon={TrendingUp} label="Best readiness" value={bestScore} isNumber suffix="/118" color="#0EC8A0" />
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
                  onTailor={handleTailorOpen}
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

        {/* ── Job Tracker Kanban Board ───────────────────── */}
        {user && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-900">Job Tracker</h2>
              <div className="flex items-center gap-3">
                {appsLoading && <Loader size={16} className="animate-spin text-gray-400" />}
                {applications.length > 0 && (
                  <motion.button
                    onClick={() => handleOpenJobModal()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-wider hover:bg-indigo-700 transition-colors"
                  >
                    <Plus size={14} /> Add Job
                  </motion.button>
                )}
              </div>
            </div>

            {applications.length === 0 && !appsLoading ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl p-12 text-center border-2 border-dashed"
                style={{ background: 'rgba(14,200,160,0.03)', borderColor: 'rgba(14,200,160,0.15)' }}
              >
                <div className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #0EC8A0, #5B4BF5)' }}>
                  <Target size={28} className="text-white" />
                </div>
                <h3 className="font-black text-lg text-gray-900 mb-2">Start tracking your applications</h3>
                <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                  Organize your job search with a visual Kanban board. Track applications from wishlist to offer.
                </p>
                <motion.button 
                  onClick={() => handleOpenJobModal()}
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                  className="py-3 px-6 rounded-xl text-white font-black text-sm"
                  style={{ background: 'linear-gradient(135deg, #0EC8A0, #5B4BF5)', boxShadow: '0 4px 20px rgba(14,200,160,0.3)' }}
                >
                  <Plus size={16} className="inline mr-2 -mt-0.5" /> Add First Job
                </motion.button>
              </motion.div>
            ) : (
              <>
                {/* Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KanbanColumn 
                    title="Applied" 
                    status="applied" 
                    applications={applications.filter(a => a.status === 'applied')}
                    color="#5B4BF5"
                    onDrop={handleAppStatus}
                    onEdit={handleOpenJobModal}
                  />
                  <KanbanColumn 
                    title="Screening" 
                    status="screening" 
                    applications={applications.filter(a => a.status === 'screening')}
                    color="#0EC8A0"
                    onDrop={handleAppStatus}
                    onEdit={handleOpenJobModal}
                  />
                  <KanbanColumn 
                    title="Interview" 
                    status="interview" 
                    applications={applications.filter(a => a.status === 'interview')}
                    color="#8B5CF6"
                    onDrop={handleAppStatus}
                    onEdit={handleOpenJobModal}
                  />
                  <KanbanColumn 
                    title="Offer + Rejected" 
                    status="offer-rejected" 
                    applications={applications.filter(a => a.status === 'offer' || a.status === 'rejected')}
                    color="#D4A843"
                    onDrop={handleAppStatus}
                    onEdit={handleOpenJobModal}
                  />
                </div>
              </>
            )}
          </motion.div>
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

      {tailorTarget && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setTailorTarget(null)}
          role="presentation"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-black text-gray-900 mb-1">Tailor to a job</h3>
            <p className="text-xs text-gray-500 mb-4">Paste the job description. We&apos;ll open the builder on the Score tab with this text.</p>
            <textarea
              className="input-field resize-none text-sm mb-4"
              rows={8}
              placeholder="Paste job description..."
              value={tailorJd}
              onChange={e => setTailorJd(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <button type="button" className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700" onClick={() => setTailorTarget(null)}>Cancel</button>
              <button type="button" className="px-4 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white" onClick={handleTailorSubmit}>Open builder</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Job Application Modal */}
      <JobApplicationModal
        open={showJobModal}
        application={editingJob}
        resumes={savedResumes}
        onClose={handleCloseJobModal}
        onSave={handleSaveJob}
        onDelete={handleDeleteJob}
      />
    </div>
  )
}
