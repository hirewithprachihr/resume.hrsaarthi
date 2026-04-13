/**
 * ResumeVersionPanel — Resume Version & Clone Management
 * ───────────────────────────────────────────────────────
 * Provides:
 *  - Clone / Duplicate current resume with a custom label
 *  - "Clone for this Job" flow (give it a target company/job name)
 *  - List of saved versions with dates
 *  - Switch to any version
 *  - Delete a version
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Trash2, Check, ChevronDown, ChevronUp, Tag, Briefcase, Plus, X } from 'lucide-react'
import { useResumeStore } from '../store/resumeStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

const MAX_VERSIONS_FREE = 3
const MAX_VERSIONS_PRO  = 10

function timeAgo(isoStr) {
  if (!isoStr) return 'Just now'
  const diff = Date.now() - new Date(isoStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30)  return `${days}d ago`
  return new Date(isoStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
}

export default function ResumeVersionPanel({ onClose }) {
  const { resumeData, savedResumes, loadResume, cloneResume, deleteResume, currentResumeId } = useResumeStore()
  const { plan } = useAuthStore()
  const isPro = plan === 'pro'
  const maxVersions = isPro ? MAX_VERSIONS_PRO : MAX_VERSIONS_FREE

  const [showCloneForm, setShowCloneForm] = useState(false)
  const [cloneLabel, setCloneLabel]   = useState('')
  const [cloneTarget, setCloneTarget] = useState('')
  const [isCloning, setIsCloning]     = useState(false)

  // saved resumes sorted newest first
  const versions = (savedResumes || [])
    .slice()
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))

  const handleClone = async () => {
    if (!cloneLabel.trim()) {
      toast.error('Give this version a name')
      return
    }
    if (versions.length >= maxVersions) {
      toast.error(isPro ? `Max ${MAX_VERSIONS_PRO} versions per account` : `Free plan allows ${MAX_VERSIONS_FREE} versions. Upgrade for more!`)
      return
    }
    setIsCloning(true)
    try {
      const label = cloneTarget.trim()
        ? `${cloneLabel.trim()} — ${cloneTarget.trim()}`
        : cloneLabel.trim()
      await cloneResume(label)
      toast.success(`Cloned as "${label}"`)
      setShowCloneForm(false)
      setCloneLabel('')
      setCloneTarget('')
    } catch (e) {
      toast.error('Clone failed: ' + e.message)
    } finally {
      setIsCloning(false)
    }
  }

  const handleLoad = async (id) => {
    if (id === currentResumeId) return
    try {
      await loadResume(id)
      toast.success('Switched to version')
      onClose?.()
    } catch (e) {
      toast.error('Could not load version')
    }
  }

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Delete version "${label}"? This cannot be undone.`)) return
    try {
      await deleteResume(id)
      toast.success('Version deleted')
    } catch (e) {
      toast.error('Delete failed')
    }
  }

  return (
    <div style={{ width: 340, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Version History</div>
          <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: 2 }}>{versions.length} of {maxVersions} versions used{!isPro && ' · Upgrade for more'}</div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ padding: '4px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Clone button */}
      <button
        onClick={() => setShowCloneForm(v => !v)}
        disabled={versions.length >= maxVersions}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: '10px', border: '2px dashed #3b82f6',
          background: '#eff6ff', color: '#1d4ed8', fontSize: '10px', fontWeight: 800,
          textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          opacity: versions.length >= maxVersions ? 0.4 : 1, marginBottom: 8,
          transition: 'all 0.15s',
        }}
      >
        <Copy size={12} /> Clone Current Resume
      </button>

      {/* Clone form */}
      <AnimatePresence>
        {showCloneForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: 12 }}
          >
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '12px' }}>
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: '9px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
                  Version Label *
                </label>
                <input
                  id="version-clone-label"
                  name="clone-label"
                  placeholder="e.g. Senior Engineer Version"
                  value={cloneLabel}
                  onChange={e => setCloneLabel(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleClone()}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: '9px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4 }}>
                  Target Company / Job (optional)
                </label>
                <input
                  id="version-clone-target"
                  name="clone-target"
                  placeholder="e.g. Flipkart — Senior SDE"
                  value={cloneTarget}
                  onChange={e => setCloneTarget(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleClone()}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px', outline: 'none', boxSizing: 'border-box', fontFamily: "'Inter', sans-serif" }}
                />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={handleClone}
                  disabled={isCloning || !cloneLabel.trim()}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px', border: 'none',
                    background: cloneLabel.trim() ? '#1d4ed8' : '#e2e8f0', color: cloneLabel.trim() ? '#fff' : '#94a3b8',
                    fontSize: '10px', fontWeight: 800, cursor: cloneLabel.trim() ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                  }}
                >
                  {isCloning ? '⏳ Cloning…' : <><Copy size={11} /> Create Clone</>}
                </button>
                <button
                  onClick={() => { setShowCloneForm(false); setCloneLabel(''); setCloneTarget('') }}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version List */}
      <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6, paddingRight: 2 }}>
        {versions.length === 0 && (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8', fontSize: '10px' }}>
            <div style={{ fontSize: '24px', marginBottom: 8 }}>📋</div>
            No saved versions yet.<br />Clone your current resume to start versioning.
          </div>
        )}
        {versions.map((v, i) => {
          const isCurrent = v.id === currentResumeId
          const label = v.title || v.name || `Resume #${i + 1}`
          return (
            <motion.div
              key={v.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
                borderRadius: '10px', border: `1.5px solid ${isCurrent ? '#3b82f6' : '#e2e8f0'}`,
                background: isCurrent ? '#eff6ff' : '#fff',
                cursor: isCurrent ? 'default' : 'pointer',
                transition: 'all 0.15s',
              }}
              onClick={() => !isCurrent && handleLoad(v.id)}
            >
              {/* Icon */}
              <div style={{ width: 30, height: 30, borderRadius: '8px', background: isCurrent ? '#3b82f6' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {isCurrent ? <Check size={14} color="#fff" /> : <Tag size={13} color="#94a3b8" />}
              </div>
              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: isCurrent ? '#1d4ed8' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {label}
                  {isCurrent && <span style={{ marginLeft: 6, fontSize: '7.5px', fontWeight: 900, padding: '1px 6px', borderRadius: 999, background: '#3b82f6', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Active</span>}
                </div>
                <div style={{ fontSize: '8.5px', color: '#94a3b8', marginTop: 1 }}>
                  {timeAgo(v.updatedAt || v.createdAt)}
                  {v.templateId && <span style={{ marginLeft: 6, color: '#cbd5e1' }}>· {v.templateId}</span>}
                </div>
              </div>
              {/* Delete */}
              {!isCurrent && (
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(v.id, label) }}
                  style={{ padding: '4px', borderRadius: '6px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8', transition: 'all 0.15s', flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
                  title="Delete this version"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Upgrade nudge */}
      {!isPro && versions.length >= MAX_VERSIONS_FREE && (
        <div style={{ marginTop: 10, padding: '8px 12px', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: '10px', fontSize: '9.5px', color: '#78350f', textAlign: 'center' }}>
          ⭐ Upgrade to Pro for {MAX_VERSIONS_PRO} version slots + unlimited saves
        </div>
      )}
    </div>
  )
}
