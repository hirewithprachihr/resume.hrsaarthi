/**
 * ResumeSelector — dropdown to switch between saved resumes in the Builder.
 * Also allows creating a new resume without leaving the builder.
 * Free tier: shows locked "New Resume" with Pro badge when user has 1 resume.
 */
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Plus, FileText, Check, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useResumeStore } from '../store/resumeStore'
import { useAuthStore } from '../store/authStore'
import { clsx } from 'clsx'

export default function ResumeSelector() {
  const { savedResumes, activeResumeId, loadResume, newResume } = useResumeStore()
  const { plan, testMode } = useAuthStore()
  const isPro = plan === 'pro' || testMode
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Free tier: at limit when they have 1+ resume and are not Pro
  const isAtFreeLimit = !isPro && savedResumes.length >= 1

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const active = savedResumes.find(r => r.id === activeResumeId)
  const displayTitle = active?.title || 'Untitled Resume'

  const handleSelect = (id) => {
    loadResume(id)
    setOpen(false)
  }

  const handleNew = () => {
    newResume()
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-brand-300 hover:bg-white transition-all max-w-[200px] group"
        title="Switch resume"
      >
        <FileText size={14} className="text-brand-600 flex-shrink-0" />
        <span className="truncate">{displayTitle}</span>
        <ChevronDown
          size={14}
          className={clsx('text-gray-400 flex-shrink-0 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 z-50 w-64 bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden"
          >
            <div className="p-1.5 max-h-72 overflow-y-auto">
              {savedResumes.length === 0 ? (
                <div className="px-4 py-3 text-xs text-gray-400 text-center">No saved resumes yet</div>
              ) : (
                savedResumes.map(r => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect(r.id)}
                    className={clsx(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all',
                      r.id === activeResumeId
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <FileText size={14} className="flex-shrink-0 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{r.title}</div>
                      <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">
                        {r.atsScore > 0 ? `ATS ${r.atsScore}/100` : 'Not scored'}
                      </div>
                    </div>
                    {r.id === activeResumeId && <Check size={14} className="text-brand-600 flex-shrink-0" />}
                  </button>
                ))
              )}
            </div>
            <div className="border-t border-gray-100 p-1.5">
              {isAtFreeLimit ? (
                // Free user at limit — show locked state linking to upgrade
                <Link
                  to="/upgrade"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-600 hover:bg-amber-50 transition-all"
                >
                  <Lock size={14} />
                  <span>New Resume</span>
                  <span className="ml-auto text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                    Pro
                  </span>
                </Link>
              ) : (
                <button
                  onClick={handleNew}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-600 hover:bg-brand-50 transition-all"
                >
                  <Plus size={14} />
                  New Resume
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
