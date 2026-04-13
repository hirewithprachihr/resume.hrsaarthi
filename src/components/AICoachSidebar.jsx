import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useResumeStore } from '../store/resumeStore'
import { getKeywordGaps } from '../utils/atsScorer'
import { useEntitlements } from '../utils/entitlements'
import { AlertCircle, Zap, ShieldCheck, Target, Lightbulb, ChevronRight, BarChart, Briefcase, Lock, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'

export default function AICoachSidebar() {
  const { atsScore, jobDescription, setJobDescription, clearJobDescription, resumeData, updatePersonal, updateExperience } = useResumeStore()
  const { isPro } = useEntitlements()
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [showAutoMatchModal, setShowAutoMatchModal] = useState(false)
  const [autoMatchSuggestions, setAutoMatchSuggestions] = useState([])
  
  // Show 'add content' empty state after 3s if still no score
  const [showEmpty, setShowEmpty] = useState(false)
  useEffect(() => {
    if (atsScore) { setShowEmpty(false); return }
    const t = setTimeout(() => setShowEmpty(true), 3000)
    return () => clearTimeout(t)
  }, [atsScore])

  const handleClearJD = () => {
    if (jobDescription.length > 100) {
      setShowClearConfirm(true)
    } else {
      clearJobDescription()
    }
  }

  const confirmClearJD = () => {
    clearJobDescription()
    setShowClearConfirm(false)
  }

  const handleAutoMatch = () => {
    if (!jobDescription || jobDescription.trim().length < 50) {
      return
    }
    
    // Import tailorResumeToJD dynamically to avoid circular deps
    import('../utils/atsScorer').then(({ tailorResumeToJD }) => {
      const suggestions = tailorResumeToJD(resumeData, jobDescription)
      setAutoMatchSuggestions(suggestions)
      setShowAutoMatchModal(true)
    })
  }

  const applyAllSuggestions = () => {
    // This is a simplified implementation - in production you'd want more sophisticated logic
    // For now, we'll just close the modal as the suggestions are advisory
    setShowAutoMatchModal(false)
  }

  if (!atsScore) return (
    <div className="p-8 text-center space-y-4">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
        <BarChart className={showEmpty ? 'text-gray-200' : 'text-gray-300 animate-pulse'} size={32} />
      </div>
      <p className="text-xs text-gray-400 font-medium">
        {showEmpty ? 'Add content to see your ATS score → fill in Personal Info first.' : 'Analyzing your career data…'}
      </p>
    </div>
  )

  const { total, breakdown, tips, grade } = atsScore
  const resumeTextForKeywordGap = [
    resumeData?.personal?.summary,
    ...(resumeData?.experience || []).flatMap(e => e?.bullets || []),
    ...(resumeData?.skills || []).map(s => s?.items),
  ].join(' ')
  const keywordGaps = getKeywordGaps(resumeTextForKeywordGap, jobDescription)

  const criticalTips = tips.filter(t => t.level === 'error')
  const minorTips = tips.filter(t => t.level === 'warning' || t.level === 'info')

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Sentinel Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-4"
            style={{ borderColor: grade.color }}
          />
          <div 
            className="w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center bg-white shadow-xl relative z-10"
            style={{ borderColor: grade.color }}
          >
            <span className="text-2xl font-black text-gray-900 leading-none">{total}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Score</span>
          </div>
        </div>
        
        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1">The Sentinel Analysis</h4>
        <div 
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
          style={{ background: grade.bg, color: grade.color }}
        >
          <ShieldCheck size={12} />
          {grade.label} Status
        </div>
      </div>

      {/* Real-time Insights */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
      {/* Score Breakdown */}
        {(() => {
          const CAT_META = {
            contact : { label: 'Contact Info',  max: 10 },
            content : { label: 'Sections',      max: 40 },
            impact  : { label: 'Impact & Verbs', max: 25 },
            format  : { label: 'Format Safety', max: 18 },
            keywords: { label: 'Keywords',      max: 25 },
          }
          return (
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(breakdown).map(([key, val]) => {
                const meta = CAT_META[key] || { label: key, max: 20 }
                const pct  = Math.min(100, (val / meta.max) * 100)
                const color = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444'
                return (
                  <div key={key} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate">{meta.label}</span>
                      <span className="text-xs font-bold text-gray-700">{val}/{meta.max}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}

        {/* Target Job Analysis */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase size={14} className="text-gray-950" />
            <span className="text-[10px] font-black text-gray-950 uppercase tracking-widest">Target Job</span>
          </div>
          <div className="border border-gray-100 rounded-xl overflow-hidden focus-within:border-brand-300 transition-colors">
            {isPro ? (
              <>
                <textarea
                  id="jd-input"
                  name="jobDescription"
                  aria-label="Job Description"
                  className="w-full p-3 text-[11px] text-gray-700 resize-none focus:outline-none bg-gray-50/50"
                  rows={4}
                  placeholder="Paste Job Description here for deep keyword analysis..."
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  maxLength={5000}
                />
                <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-100">
                  <span className="text-[10px] text-gray-500 font-medium">
                    {jobDescription.length} / 5000 characters
                  </span>
                  {jobDescription.length > 0 && (
                    <button
                      onClick={handleClearJD}
                      className="flex items-center gap-1 text-[10px] text-red-600 hover:text-red-700 font-medium transition-colors"
                      title="Clear job description"
                    >
                      <Trash2 size={12} />
                      Clear
                    </button>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/upgrade"
                className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-brand-50 to-indigo-50 hover:from-brand-100 hover:to-indigo-100 transition-all group"
              >
                <div className="w-8 h-8 bg-brand-100 group-hover:bg-brand-200 rounded-xl flex items-center justify-center transition-colors">
                  <Lock size={14} className="text-brand-600" />
                </div>
                <p className="text-[11px] text-center font-semibold text-brand-700">
                  Upgrade to Pro for real-time keyword matching against job descriptions.
                </p>
                <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest group-hover:underline">
                  Unlock Pro →
                </span>
              </Link>
            )}
          </div>

          {/* Auto-Match Button */}
          {isPro && jobDescription.length >= 50 && (
            <button
              onClick={handleAutoMatch}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-lg font-medium text-xs transition-all shadow-sm hover:shadow-md"
            >
              <Zap size={14} className="fill-current" />
              Auto-Match to JD
            </button>
          )}

          {/* Keyword Match Results (same logic as Builder ATS tab) */}
          {(keywordGaps?.matched?.length > 0 || keywordGaps?.missing?.length > 0) && (
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Optimization Match</span>
                <span className="text-lg font-black text-emerald-600">{keywordGaps.matchPercent}%</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {keywordGaps.matched.slice(0, 8).map(k => (
                  <span key={k} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] rounded-full font-bold uppercase tracking-tight">{k}</span>
                ))}
                {keywordGaps.missing.slice(0, 5).map(k => (
                  <span key={k} className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-100 text-[9px] rounded-full font-bold uppercase tracking-tight opacity-60">{k}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actionable Advice */}
        <div className="space-y-4">
          {/* Immediate Fixes */}
          {criticalTips.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle size={14} className="text-red-500" />
                <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Immediate Fixes</span>
              </div>
              <div className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {criticalTips.map((tip, i) => (
                    <motion.div 
                      key={tip.msg}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3 rounded-xl border border-red-100 bg-red-50/50 flex gap-3 group"
                    >
                      <Zap size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-800 leading-relaxed">{tip.msg}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Elite Optimizations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} className="text-brand-600" />
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Elite Optimizations</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {minorTips.map((tip, i) => (
                  <motion.div 
                    key={tip.msg}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                      'p-3 rounded-xl border flex gap-3 transition-all',
                      tip.level === 'warning' ? 'border-amber-100 bg-amber-50/30' : 'border-gray-100 bg-gray-50/30'
                    )}
                  >
                    <Lightbulb size={14} className={clsx('flex-shrink-0 mt-0.5', tip.level === 'warning' ? 'text-amber-500' : 'text-blue-500')} />
                    <p className="text-xs font-medium text-gray-600 leading-relaxed">{tip.msg}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status */}
      <div className="p-4 bg-gray-950 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          </div>
          <span>Sentinel Intel Active</span>
        </div>
        <span className="text-gray-500">v2.0</span>
      </div>

      {/* Auto-Match Modal */}
      <AnimatePresence>
        {showAutoMatchModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAutoMatchModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center">
                  <Zap size={20} className="text-brand-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Auto-Match Suggestions</h3>
                  <p className="text-xs text-gray-500">Review these recommendations to align your resume with the job description</p>
                </div>
              </div>

              {autoMatchSuggestions.length === 0 ? (
                <div className="text-center py-8">
                  <ShieldCheck size={48} className="text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700">Your resume looks great!</p>
                  <p className="text-xs text-gray-500 mt-1">No critical changes needed for this job description.</p>
                </div>
              ) : (
                <div className="space-y-4 mb-6">
                  {autoMatchSuggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className={clsx(
                        'p-4 rounded-xl border-2',
                        suggestion.impact === 'high' ? 'border-red-200 bg-red-50' :
                        suggestion.impact === 'medium' ? 'border-amber-200 bg-amber-50' :
                        'border-blue-200 bg-blue-50'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={clsx(
                          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                          suggestion.impact === 'high' ? 'bg-red-100' :
                          suggestion.impact === 'medium' ? 'bg-amber-100' :
                          'bg-blue-100'
                        )}>
                          {suggestion.type === 'keyword' && <Target size={16} className={
                            suggestion.impact === 'high' ? 'text-red-600' :
                            suggestion.impact === 'medium' ? 'text-amber-600' :
                            'text-blue-600'
                          } />}
                          {suggestion.type === 'tone' && <Lightbulb size={16} className={
                            suggestion.impact === 'high' ? 'text-red-600' :
                            suggestion.impact === 'medium' ? 'text-amber-600' :
                            'text-blue-600'
                          } />}
                          {suggestion.type === 'soft-skill' && <ShieldCheck size={16} className={
                            suggestion.impact === 'high' ? 'text-red-600' :
                            suggestion.impact === 'medium' ? 'text-amber-600' :
                            'text-blue-600'
                          } />}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-900 mb-1">{suggestion.title}</h4>
                          <p className="text-xs text-gray-700 leading-relaxed">{suggestion.msg}</p>
                          <span className={clsx(
                            'inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider',
                            suggestion.impact === 'high' ? 'bg-red-100 text-red-700' :
                            suggestion.impact === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          )}>
                            {suggestion.impact} impact
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAutoMatchModal(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
                {autoMatchSuggestions.length > 0 && (
                  <button
                    onClick={applyAllSuggestions}
                    className="flex-1 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Got It
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear JD Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle size={20} className="text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Clear Job Description?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-6">
                This will remove {jobDescription.length} characters of job description text. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClearJD}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
