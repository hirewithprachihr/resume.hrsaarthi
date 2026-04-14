/**
 * RejectionAnalyzerPanel
 * ─────────────────────────────────────────────────────────────────
 * Displays auto-rejection signals from the Rejection Analyzer engine.
 * Used in the Builder sidebar (Score tab) and optionally on the Dashboard.
 *
 * Props:
 *   resumeData  — Zustand resumeData
 *   compact     — boolean, show compressed version for sidebar
 *   onJumpTo    — fn(sectionId) — navigate to that section
 */
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react'
import { analyzeRejectionRisk } from '../utils/rejectionAnalyzer'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'

const RISK_CONFIG = {
  high:   { label: 'High Risk', bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-700',   dot: 'bg-red-500'    },
  medium: { label: 'Medium Risk', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400'  },
  low:    { label: 'Low Risk',  bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500' },
}

export default function RejectionAnalyzerPanel({ resumeData, compact = false, onJumpTo }) {
  const [expanded, setExpanded] = useState(false)
  const [showPassed, setShowPassed] = useState(false)

  if (!resumeData?.personal) return null

  const { rejections, warnings, passedChecks, rejectionRisk, score } = analyzeRejectionRisk(resumeData)
  const riskCfg = RISK_CONFIG[rejectionRisk]
  const totalIssues = rejections.length + warnings.length

  // Nothing wrong — show a compact success state
  if (totalIssues === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl">
        <ShieldCheck size={14} className="text-emerald-500 flex-shrink-0" />
        <span className="text-[10px] font-bold text-emerald-700">No auto-rejection signals detected</span>
      </div>
    )
  }

  if (compact) {
    // ── Compact mode (sidebar Score tab) ──────────────────────────
    return (
      <div className={clsx('rounded-xl border', riskCfg.bg, riskCfg.border)}>
        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center gap-2 px-3 py-2.5"
        >
          <div className={clsx('w-2 h-2 rounded-full flex-shrink-0', riskCfg.dot)} />
          <span className={clsx('text-[10px] font-black uppercase tracking-widest flex-1 text-left', riskCfg.text)}>
            {rejections.length > 0
              ? `${rejections.length} Auto-Rejection Risk${rejections.length > 1 ? 's' : ''}`
              : `${warnings.length} Warning${warnings.length > 1 ? 's' : ''}`}
          </span>
          {expanded ? <ChevronUp size={11} className={riskCfg.text} /> : <ChevronDown size={11} className={riskCfg.text} />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 space-y-2 border-t border-current/10">
                {[...rejections, ...warnings].slice(0, 4).map(item => (
                  <IssueRow key={item.id} item={item} compact onJumpTo={onJumpTo} />
                ))}
                {totalIssues > 4 && (
                  <p className={clsx('text-[9px] font-bold text-center', riskCfg.text)}>
                    +{totalIssues - 4} more issues…
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // ── Full mode (Dashboard / dedicated view) ────────────────────────
  return (
    <div className="space-y-4">
      {/* Risk score header */}
      <div className={clsx('flex items-center gap-4 p-4 rounded-2xl border', riskCfg.bg, riskCfg.border)}>
        <div className="relative">
          <svg width={60} height={60} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={30} cy={30} r={24} fill="none" stroke="#e5e7eb" strokeWidth={6} />
            <motion.circle
              cx={30} cy={30} r={24}
              fill="none"
              stroke={rejectionRisk === 'high' ? '#ef4444' : rejectionRisk === 'medium' ? '#f59e0b' : '#10b981'}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 24}
              initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - score / 100) }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-black text-gray-900">{score}</span>
            <span className="text-[8px] font-bold text-gray-400 leading-none">SAFE</span>
          </div>
        </div>
        <div className="flex-1">
          <div className={clsx('text-xs font-black uppercase tracking-widest mb-0.5', riskCfg.text)}>
            {riskCfg.label}
          </div>
          <div className="text-sm font-bold text-gray-800">
            {rejections.length > 0
              ? `${rejections.length} automatic rejection trigger${rejections.length > 1 ? 's' : ''} found`
              : `${warnings.length} issue${warnings.length > 1 ? 's' : ''} reducing callback rate`}
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">Fix these before applying anywhere</p>
        </div>
      </div>

      {/* Critical rejections */}
      {rejections.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[9px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1.5">
            <XCircle size={10} /> Critical — Causes Auto-Rejection
          </h3>
          {rejections.map(item => <IssueRow key={item.id} item={item} onJumpTo={onJumpTo} />)}
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-[9px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
            <AlertCircle size={10} /> Warnings — Reduces Callback Rate
          </h3>
          {warnings.map(item => <IssueRow key={item.id} item={item} onJumpTo={onJumpTo} />)}
        </div>
      )}

      {/* Passed checks (collapsible) */}
      {passedChecks.length > 0 && (
        <div>
          <button
            onClick={() => setShowPassed(!showPassed)}
            className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600 uppercase tracking-widest"
          >
            <CheckCircle2 size={10} />
            {passedChecks.length} Checks Passed
            {showPassed ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
          </button>
          <AnimatePresence>
            {showPassed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-2 space-y-1"
              >
                {passedChecks.map(p => (
                  <div key={p.id} className="flex items-center gap-2 text-[10px] text-emerald-600 font-medium">
                    <CheckCircle2 size={10} className="flex-shrink-0" />
                    {p.title}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

// ── Individual issue row ──────────────────────────────────────────
function IssueRow({ item, compact, onJumpTo }) {
  const [open, setOpen] = useState(false)
  const isCritical = item.severity === 'critical'

  if (compact) {
    return (
      <div className="pt-2">
        <div className="flex items-start gap-2">
          {isCritical
            ? <XCircle size={11} className="text-red-500 flex-shrink-0 mt-0.5" />
            : <AlertTriangle size={11} className="text-amber-500 flex-shrink-0 mt-0.5" />
          }
          <div className="flex-1 min-w-0">
            <p className={clsx('text-[10px] font-black leading-tight', isCritical ? 'text-red-700' : 'text-amber-700')}>
              {item.title}
            </p>
            {onJumpTo && item.section && (
              <button
                onClick={() => onJumpTo(item.section)}
                className="text-[9px] text-gray-400 hover:text-brand-500 font-bold mt-0.5 transition-colors"
              >
                Fix → {item.section}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={clsx(
      'rounded-xl border p-3 transition-all',
      isCritical ? 'bg-red-50/60 border-red-200' : 'bg-amber-50/60 border-amber-200',
    )}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-2.5 text-left"
      >
        <div className={clsx('w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5',
          isCritical ? 'bg-red-100' : 'bg-amber-100'
        )}>
          {isCritical
            ? <XCircle size={11} className="text-red-600" />
            : <AlertTriangle size={11} className="text-amber-600" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className={clsx('text-xs font-black', isCritical ? 'text-red-800' : 'text-amber-800')}>
            {item.title}
          </p>
        </div>
        {open ? <ChevronUp size={12} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={12} className="text-gray-400 flex-shrink-0" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="mt-2.5 ml-7 space-y-2">
              <p className="text-[10px] text-gray-600 leading-relaxed">{item.detail}</p>
              {item.fix && (
                <div className="flex items-start gap-1.5 p-2 bg-white rounded-lg border border-gray-200">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider flex-shrink-0 mt-0.5">FIX:</span>
                  <p className="text-[10px] text-gray-700 font-medium leading-relaxed">{item.fix}</p>
                </div>
              )}
              {onJumpTo && item.section && (
                <button
                  onClick={() => onJumpTo(item.section)}
                  className="text-[10px] font-black text-brand-600 hover:text-brand-700 uppercase tracking-wider transition-colors"
                >
                  → Fix in {item.section.charAt(0).toUpperCase() + item.section.slice(1)} section
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
