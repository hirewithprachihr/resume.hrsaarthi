/**
 * BulletQualityBadge — Visual per-bullet quality indicator
 * ──────────────────────────────────────────────────────────
 * Shows: Weak / Good / Strong / Elite quality + spell check warnings
 */
import { scoreBullet } from '../utils/atsScorer'
import { checkSpelling } from '../utils/spellChecker'
import { clsx } from 'clsx'

const TONES = {
  elite  : { label: '⚡ Elite',  color: '#059669', bg: '#d1fae5', bar: '#10b981' },
  strong : { label: '✓ Strong', color: '#1d4ed8', bg: '#dbeafe', bar: '#3b82f6' },
  good   : { label: '◈ Good',   color: '#d97706', bg: '#fef3c7', bar: '#f59e0b' },
  weak   : { label: '✗ Weak',   color: '#dc2626', bg: '#fee2e2', bar: '#ef4444' },
}

function tone(score, max) {
  const pct = score / max
  if (pct >= 0.85) return TONES.elite
  if (pct >= 0.65) return TONES.strong
  if (pct >= 0.40) return TONES.good
  return TONES.weak
}

export default function BulletQualityBadge({ text, compact = false }) {
  if (!text?.trim()) return null

  const r = scoreBullet(text || '')
  const t = tone(r.score, r.max)
  const spellIssues = checkSpelling(text)
  const hasSpellError = spellIssues.length > 0
  const pct = Math.round((r.score / r.max) * 100)

  if (compact) {
    // Minimal dot-only version for tight spaces
    return (
      <span
        style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: t.bar, flexShrink: 0 }}
        title={`${t.label} (${r.score}/${r.max})\n${r.breakdown?.join('\n') || ''}`}
        aria-label={`Bullet quality ${t.label}`}
      />
    )
  }

  return (
    <span
      className={clsx('inline-flex items-center gap-1.5 rounded-full select-none', hasSpellError && 'ring-1 ring-orange-300')}
      style={{ background: t.bg, padding: '2px 8px 2px 6px', maxHeight: 20 }}
      title={[
        `Quality: ${t.label} (${r.score}/${r.max})`,
        r.breakdown?.length > 0 ? '\nBreakdown:\n' + r.breakdown.join('\n') : '',
        hasSpellError ? '\n⚠ Possible spelling issues: ' + spellIssues.map(i => `"${i.word}" → "${i.suggestion}"`).join(', ') : '',
      ].join('')}
      aria-label={`Bullet quality ${t.label}`}
    >
      {/* Quality bar */}
      <span style={{ display: 'inline-block', width: 16, height: 3, borderRadius: 2, background: '#e5e7eb', verticalAlign: 'middle', position: 'relative', overflow: 'hidden' }}>
        <span style={{ display: 'block', width: `${pct}%`, height: '100%', background: t.bar, borderRadius: 2 }} />
      </span>
      <span style={{ fontSize: '8px', fontWeight: 800, color: t.color, lineHeight: 1, whiteSpace: 'nowrap' }}>
        {t.label}
      </span>
      {hasSpellError && (
        <span style={{ fontSize: '8px', color: '#d97706', fontWeight: 700 }} title={`Fix: ${spellIssues.map(i => `"${i.word}" → "${i.suggestion}"`).join(', ')}`}>
          📝
        </span>
      )}
    </span>
  )
}
