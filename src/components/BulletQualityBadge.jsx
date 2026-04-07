import { scoreBullet } from '../utils/atsScorer'
import { clsx } from 'clsx'

function tone(score) {
  if (score >= 5) return { label: 'Elite', color: '#10B981', bg: '#ECFDF5' }
  if (score >= 4) return { label: 'Strong', color: '#3B82F6', bg: '#EFF6FF' }
  if (score >= 3) return { label: 'OK', color: '#F59E0B', bg: '#FFFBEB' }
  return { label: 'Weak', color: '#EF4444', bg: '#FEF2F2' }
}

export default function BulletQualityBadge({ text }) {
  const r = scoreBullet(text || '')
  const t = tone(r.score)
  if (!text?.trim()) return null

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider select-none',
      )}
      style={{ background: t.bg, color: t.color }}
      title={r.breakdown?.join('\n')}
      aria-label={`Bullet quality ${t.label} (${r.score}/${r.max})`}
    >
      {t.label} {r.score}/{r.max}
    </span>
  )
}

