import { useMemo } from 'react'
import { AlertCircle, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import { useResumeStore } from '../store/resumeStore'

function priorityRank(item) {
  const order = { error: 0, warning: 1, info: 2, pass: 3, success: 3 }
  return order[item.level] ?? 9
}

/**
 * NextBestFixes
 * - Combines completeness checks + ATS tips into 3 guided actions.
 * - Drives candidates to high-impact edits without hunting through sections.
 */
export default function NextBestFixes({ completeness, atsScore, onJumpToSection }) {
  const { resumeData } = useResumeStore()

  const actions = useMemo(() => {
    const out = []

    // Completeness first: missing essentials
    const missing = (completeness?.checks || []).filter(c => !c.done)
    for (const c of missing) {
      out.push({
        id: `c-${c.id}`,
        title: c.label,
        section: c.section,
        level: c.id === 'summary' || c.id === 'linkedin' ? 'warning' : 'error',
        source: 'completeness',
      })
    }

    // ATS tips next: known pain points
    const tips = (atsScore?.tips || []).map((t, idx) => ({
      id: `t-${idx}`,
      title: t.msg,
      section: t.section || 'experience',
      level: t.level || 'info',
      source: 'ats',
    }))
    out.push(...tips)

    // Deduplicate by (section + title)
    const seen = new Set()
    const deduped = []
    for (const a of out) {
      const k = `${a.section}::${a.title}`
      if (seen.has(k)) continue
      seen.add(k)
      deduped.push(a)
    }

    return deduped.sort((a, b) => priorityRank(a) - priorityRank(b)).slice(0, 3)
  }, [atsScore?.tips, completeness?.checks])

  const strength = completeness?.percent ?? 0
  const strengthColor = strength >= 80 ? '#10B981' : strength >= 50 ? '#F59E0B' : '#EF4444'

  if (!actions.length) return null

  return (
    <div className="mx-4 mt-2 mb-3 p-3 rounded-2xl border bg-white"
      style={{ borderColor: 'rgba(0,0,0,0.06)', boxShadow: '0 1px 10px rgba(0,0,0,0.04)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: strengthColor + '18', color: strengthColor }}>
            <Sparkles size={14} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Next Best Fixes</div>
            <div className="text-[11px] font-bold text-gray-800 leading-tight">
              Profile strength: <span style={{ color: strengthColor }}>{strength}%</span>
            </div>
          </div>
        </div>
        <div className="text-[9px] font-black uppercase tracking-widest text-gray-300">
          {resumeData?.personal?.fullName?.trim() ? 'Editing' : 'Start'}
        </div>
      </div>

      <div className="space-y-1.5">
        {actions.map(a => {
          const isCritical = a.level === 'error'
          const Icon = isCritical ? AlertCircle : CheckCircle2
          const color = isCritical ? '#EF4444' : a.level === 'warning' ? '#F59E0B' : '#3B82F6'
          return (
            <button
              key={a.id}
              onClick={() => onJumpToSection?.(a.section)}
              className={clsx(
                'w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-xl border transition-all',
                'hover:bg-gray-50 active:scale-[0.99]',
              )}
              style={{ borderColor: 'rgba(0,0,0,0.06)' }}
            >
              <div className="mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: color + '18', color }}>
                <Icon size={13} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-bold text-gray-700 leading-snug">
                  {a.title}
                </div>
                <div className="text-[9px] font-black uppercase tracking-widest text-gray-300 mt-0.5">
                  {a.section}
                </div>
              </div>
              <ArrowRight size={14} className="text-gray-300 flex-shrink-0 mt-1" />
            </button>
          )
        })}
      </div>
    </div>
  )
}

