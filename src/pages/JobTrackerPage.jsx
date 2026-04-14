/**
 * JobTrackerPage — Application Pipeline Tracker
 * ─────────────────────────────────────────────────────────────────
 * Route: /tracker
 *
 * A kanban-style board to track every job application.
 * Data stored in localStorage for simplicity (no DB required).
 * Columns: Bookmarked → Applied → Interview → Offer → Rejected
 */
import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase, Plus, X, ExternalLink, Calendar, Building2,
  ChevronRight, Trophy, Target, Clock, TrendingUp,
  Bookmark, Send, MessageSquare, Star, XCircle, Edit3,
  BarChart3, CheckCircle2, Globe,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'
import { motion as m } from 'framer-motion'

const STORAGE_KEY = 'hwp-job-tracker'

const COLUMNS = [
  { id: 'bookmarked', label: 'Saved',      icon: Bookmark,      color: '#6366F1', bg: '#EEF2FF' },
  { id: 'applied',   label: 'Applied',     icon: Send,          color: '#0E9F6E', bg: '#F0FDF4' },
  { id: 'interview', label: 'Interview',   icon: MessageSquare, color: '#F59E0B', bg: '#FFFBEB' },
  { id: 'offer',     label: 'Offer',       icon: Star,          color: '#EC4899', bg: '#FDF4FF' },
  { id: 'rejected',  label: 'Rejected',    icon: XCircle,       color: '#EF4444', bg: '#FEF2F2' },
]

const PRIORITY_COLORS = {
  high:   { bg: '#FEE2E2', text: '#DC2626' },
  medium: { bg: '#FEF3C7', text: '#D97706' },
  low:    { bg: '#D1FAE5', text: '#059669' },
}

function generateId() {
  return `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function loadJobs() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveJobs(jobs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

// ── Add/Edit Job Modal ─────────────────────────────────────────────
function JobModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState({
    company    : '',
    role       : '',
    location   : '',
    url        : '',
    salary     : '',
    notes      : '',
    priority   : 'medium',
    appliedDate: new Date().toISOString().split('T')[0],
    status     : 'bookmarked',
    ...initial,
  })

  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim()) {
      toast.error('Company and role are required.')
      return
    }
    onSave({
      ...form,
      id       : form.id || generateId(),
      createdAt: form.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-black text-gray-900">
            {initial?.id ? 'Edit Application' : 'Add Job Application'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X size={14} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Company *</label>
              <input
                type="text"
                value={form.company}
                onChange={e => handleChange('company', e.target.value)}
                placeholder="e.g. Razorpay, Google"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Role *</label>
              <input
                type="text"
                value={form.role}
                onChange={e => handleChange('role', e.target.value)}
                placeholder="e.g. Senior Product Manager"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => handleChange('location', e.target.value)}
                placeholder="Bangalore"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Est. Salary</label>
              <input
                type="text"
                value={form.salary}
                onChange={e => handleChange('salary', e.target.value)}
                placeholder="₹18L–22L"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Applied Date</label>
              <input
                type="date"
                value={form.appliedDate}
                onChange={e => handleChange('appliedDate', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Priority</label>
              <select
                value={form.priority}
                onChange={e => handleChange('priority', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 transition-all bg-white"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Status</label>
              <select
                value={form.status}
                onChange={e => handleChange('status', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 transition-all bg-white"
              >
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Job URL</label>
              <input
                type="url"
                value={form.url}
                onChange={e => handleChange('url', e.target.value)}
                placeholder="https://linkedin.com/jobs/..."
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-wider mb-1">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => handleChange('notes', e.target.value)}
                placeholder="Recruiter name, referral, key requirements..."
                rows={2}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:border-gray-400 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-black hover:bg-gray-800 transition-colors">
              {initial?.id ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

// ── Job Card ──────────────────────────────────────────────────────
function JobCard({ job, columns, onEdit, onDelete, onMove }) {
  const priorityCfg = PRIORITY_COLORS[job.priority] || PRIORITY_COLORS.medium
  const appliedDaysAgo = job.appliedDate
    ? Math.floor((Date.now() - new Date(job.appliedDate)) / 86400000)
    : null
  const currentColIdx = columns.findIndex(c => c.id === job.status)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-black text-gray-900 truncate">{job.company}</p>
          <p className="text-xs text-gray-500 font-medium truncate">{job.role}</p>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(job)}
            className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <Edit3 size={10} className="text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="w-6 h-6 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
          >
            <X size={10} className="text-red-500" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {job.location && (
          <span className="flex items-center gap-0.5 text-[9px] text-gray-400 font-medium">
            <Globe size={8} />
            {job.location}
          </span>
        )}
        {job.salary && (
          <span className="text-[9px] text-gray-400 font-medium">{job.salary}</span>
        )}
        {appliedDaysAgo !== null && (
          <span className="flex items-center gap-0.5 text-[9px] text-gray-400 font-medium ml-auto">
            <Clock size={8} />
            {appliedDaysAgo === 0 ? 'Today' : `${appliedDaysAgo}d ago`}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span
          className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
          style={{ background: priorityCfg.bg, color: priorityCfg.text }}
        >
          {job.priority}
        </span>

        <div className="flex gap-1">
          {/* Previous column */}
          {currentColIdx > 0 && (
            <button
              onClick={() => onMove(job.id, columns[currentColIdx - 1].id)}
              title={`Move to ${columns[currentColIdx - 1].label}`}
              className="text-[9px] px-1.5 py-0.5 border border-gray-200 rounded-lg text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all"
            >
              ←
            </button>
          )}
          {/* Next column */}
          {currentColIdx < columns.length - 1 && (
            <button
              onClick={() => onMove(job.id, columns[currentColIdx + 1].id)}
              title={`Move to ${columns[currentColIdx + 1].label}`}
              className="text-[9px] px-1.5 py-0.5 border border-gray-200 rounded-lg text-gray-400 hover:border-brand-500 hover:text-brand-600 hover:border-brand-300 transition-all"
            >
              →
            </button>
          )}
          {job.url && (
            <a href={job.url} target="_blank" rel="noopener noreferrer"
              className="text-[9px] px-1.5 py-0.5 border border-gray-200 rounded-lg text-gray-400 hover:text-brand-600 transition-all">
              <ExternalLink size={9} />
            </a>
          )}
        </div>
      </div>

      {job.notes && (
        <p className="mt-2 text-[9px] text-gray-400 italic truncate">{job.notes}</p>
      )}
    </motion.div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────
export default function JobTrackerPage() {
  const [jobs, setJobs]         = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editJob, setEditJob]   = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { setJobs(loadJobs()) }, [])

  const persist = useCallback((updated) => {
    setJobs(updated)
    saveJobs(updated)
  }, [])

  const handleSave = (job) => {
    const existing = jobs.find(j => j.id === job.id)
    let updated
    if (existing) {
      updated = jobs.map(j => j.id === job.id ? job : j)
      toast.success('Application updated')
    } else {
      updated = [job, ...jobs]
      toast.success('Application added!')
    }
    persist(updated)
    setShowModal(false)
    setEditJob(null)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Remove this application?')) return
    persist(jobs.filter(j => j.id !== id))
    toast.success('Removed')
  }

  const handleMove = (id, newStatus) => {
    persist(jobs.map(j => j.id === id ? { ...j, status: newStatus, updatedAt: new Date().toISOString() } : j))
  }

  const handleEdit = (job) => {
    setEditJob(job)
    setShowModal(true)
  }

  // Analytics
  const total    = jobs.length
  const applied  = jobs.filter(j => ['applied', 'interview', 'offer'].includes(j.status)).length
  const interviews = jobs.filter(j => ['interview', 'offer'].includes(j.status)).length
  const offers   = jobs.filter(j => j.status === 'offer').length
  const responseRate = applied > 0 ? Math.round((interviews / applied) * 100) : 0

  const displayJobs = filterStatus === 'all' ? jobs : jobs.filter(j => j.status === filterStatus)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-violet-600 rounded-xl flex items-center justify-center shadow-md shadow-brand-200">
              <Target size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-black text-gray-900 leading-none">Job Tracker</h1>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">Application Pipeline</p>
            </div>
          </div>
          <button
            onClick={() => { setEditJob(null); setShowModal(true) }}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-black hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Plus size={14} />
            Add Job
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Tracked',    value: total,         icon: Briefcase,  color: '#6366F1' },
            { label: 'Applied',          value: applied,       icon: Send,       color: '#0E9F6E' },
            { label: 'Response Rate',    value: `${responseRate}%`, icon: TrendingUp, color: '#F59E0B' },
            { label: 'Offers',           value: offers,        icon: Trophy,     color: '#EC4899' },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: stat.color + '18' }}>
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <div>
                  <div className="text-xl font-black text-gray-900 leading-none">{stat.value}</div>
                  <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Column filter */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={clsx(
              'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all',
              filterStatus === 'all' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
            )}
          >
            All ({total})
          </button>
          {COLUMNS.map(col => {
            const count = jobs.filter(j => j.status === col.id).length
            const Icon = col.icon
            return (
              <button
                key={col.id}
                onClick={() => setFilterStatus(col.id)}
                className={clsx(
                  'flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2',
                  filterStatus === col.id
                    ? 'text-white shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                )}
                style={filterStatus === col.id
                  ? { background: col.color, borderColor: col.color }
                  : {}
                }
              >
                <Icon size={10} />
                {col.label} {count > 0 && `(${count})`}
              </button>
            )
          })}
        </div>

        {/* Empty state */}
        {displayJobs.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Briefcase size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">
              {filterStatus === 'all' ? 'Start tracking your applications' : `No ${COLUMNS.find(c => c.id === filterStatus)?.label} yet`}
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
              {filterStatus === 'all'
                ? 'Add your first job application and track every step from bookmark to offer.'
                : 'Move cards from other columns using the → arrow on each card.'}
            </p>
            {filterStatus === 'all' && (
              <button
                onClick={() => { setEditJob(null); setShowModal(true) }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-gray-800 transition-colors"
              >
                <Plus size={14} /> Add First Application
              </button>
            )}
          </div>
        )}

        {/* Kanban-style grid (filtered or all) */}
        {displayJobs.length > 0 && filterStatus === 'all' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {COLUMNS.map(col => {
              const colJobs = jobs.filter(j => j.status === col.id)
              const Icon = col.icon
              return (
                <div key={col.id} className="space-y-3">
                  {/* Column header */}
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: col.bg }}>
                      <Icon size={11} style={{ color: col.color }} />
                    </div>
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">{col.label}</span>
                    <span className="ml-auto text-[10px] font-black text-gray-400 w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full">
                      {colJobs.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <AnimatePresence>
                    {colJobs.map(job => (
                      <JobCard
                        key={job.id}
                        job={job}
                        columns={COLUMNS}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onMove={handleMove}
                      />
                    ))}
                  </AnimatePresence>

                  {/* Add button */}
                  <button
                    onClick={() => { setEditJob({ status: col.id }); setShowModal(true) }}
                    className="w-full py-2 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all flex items-center justify-center gap-1"
                  >
                    <Plus size={11} /> Add here
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* List view when filtered */}
        {displayJobs.length > 0 && filterStatus !== 'all' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence>
              {displayJobs.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  columns={COLUMNS}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onMove={handleMove}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* CTA footer */}
        {total > 0 && responseRate < 20 && applied >= 5 && (
          <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-4">
            <BarChart3 size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-black text-gray-900 mb-1">
                Your response rate is {responseRate}% — industry average is 20–25%
              </p>
              <p className="text-xs text-gray-600 mb-3">
                You've applied to {applied} roles with {interviews} responses. A low response rate usually means the resume needs keyword optimization for the roles you're targeting.
              </p>
              <Link
                to="/builder"
                className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-black hover:bg-amber-600 transition-colors"
              >
                Optimize Resume <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <JobModal
            initial={editJob}
            onSave={handleSave}
            onClose={() => { setShowModal(false); setEditJob(null) }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
