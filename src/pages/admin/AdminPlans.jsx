import { useState } from 'react'
import { TrendingUp, Star, Check, Pencil, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'

const DEFAULT_PLANS = [
  {
    id: 'free', name: 'Free', price: 0, period: 'forever',
    badge: 'Free Forever', badgeColor: 'text-white/50 bg-white/8',
    features: [
      '3 premium templates',
      '1 saved resume',
      'PDF download',
      'Basic ATS score',
      'Cover letter (limited)',
    ]
  },
  {
    id: 'monthly', name: 'Elite Pro Monthly', price: 149, period: '/month',
    badge: '50% OFF', badgeColor: 'text-indigo-400 bg-indigo-500/20',
    features: [
      '17 premium templates',
      'Unlimited saved resumes',
      'Unlimited PDF + DOCX export',
      'Full ATS score analysis',
      'AI Cover Letter (unlimited)',
      'Interview prep',
      'Resume parsing (AI upload)',
      'Priority support',
    ]
  },
  {
    id: 'annual', name: 'Elite Pro Annual', price: 999, period: '/year',
    badge: 'Best Value · ₹83/mo', badgeColor: 'text-emerald-400 bg-emerald-500/15',
    features: [
      'Everything in Monthly',
      'Save ₹1,589 vs monthly',
      'Early access to new templates',
      'Dedicated email support',
    ]
  },
]

function PlanCard({ plan, onEdit }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden"
      style={{ background: '#13152A', border: plan.id !== 'free' ? '1px solid rgba(91,75,245,0.3)' : '1px solid rgba(255,255,255,0.07)' }}>
      {plan.id !== 'free' && (
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 pointer-events-none" style={{ background: '#5B4BF5', transform: 'translate(40%,-40%)' }} />
      )}
      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${plan.badgeColor}`}>{plan.badge}</span>
        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">{plan.id}</span>
      </div>
      <div>
        <div className="text-sm font-black text-white mb-1">{plan.name}</div>
        <div className="text-3xl font-black text-white">₹{plan.price.toLocaleString('en-IN')}<span className="text-sm text-white/40 font-bold">{plan.period}</span></div>
      </div>
      <ul className="space-y-1.5">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-[10px] font-bold text-white/60">
            <Check size={10} className="text-emerald-400 flex-shrink-0" />{f}
          </li>
        ))}
      </ul>
      <button onClick={() => onEdit(plan)}
        className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white/70 hover:text-white transition-all"
        style={{ background: 'rgba(255,255,255,0.06)' }}>
        <Pencil size={12} /> Edit Plan
      </button>
    </div>
  )
}

export default function AdminPlans() {
  const [plans, setPlans]     = useState(DEFAULT_PLANS)
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})

  const startEdit = (plan) => { setEditing(plan.id); setEditForm({ ...plan, features: plan.features.join('\n') }) }
  const cancelEdit = () => setEditing(null)

  const saveEdit = () => {
    setPlans(ps => ps.map(p => p.id === editForm.id
      ? { ...editForm, price: parseInt(editForm.price) || 0, features: editForm.features.split('\n').filter(Boolean) }
      : p
    ))
    toast.success('Plan updated (local preview — sync to Supabase settings to persist)')
    setEditing(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white">Plan Management</h1>
        <p className="text-white/40 text-xs mt-0.5">Configure pricing tiers visible to users</p>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-xs font-bold text-yellow-300/80"
        style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
        <TrendingUp size={14} className="flex-shrink-0 mt-0.5 text-yellow-400" />
        Plans shown here are display configurations. Payment amounts are enforced server-side via Razorpay. Run the SQL migration to persist changes to the platform_settings table.
      </div>

      {editing ? (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: '#13152A', border: '1px solid rgba(91,75,245,0.3)' }}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white">Editing: {editForm.name}</h3>
            <button onClick={cancelEdit} className="text-white/30 hover:text-white"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'name',   label: 'Plan Name' },
              { key: 'price',  label: 'Price (₹)',   type: 'number' },
              { key: 'period', label: 'Period Label (e.g. /month)' },
              { key: 'badge',  label: 'Badge Text' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-1.5">{f.label}</label>
                <input type={f.type || 'text'} value={editForm[f.key] || ''} onChange={e => setEditForm(x => ({ ...x, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-white outline-none"
                  style={{ background: '#0B0D17', border: '1px solid rgba(255,255,255,0.1)' }} />
              </div>
            ))}
          </div>
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 block mb-1.5">Features (one per line)</label>
            <textarea rows={6} value={editForm.features || ''} onChange={e => setEditForm(x => ({ ...x, features: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-white outline-none resize-none"
              style={{ background: '#0B0D17', border: '1px solid rgba(255,255,255,0.1)' }} />
          </div>
          <div className="flex gap-3">
            <button onClick={saveEdit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white"
              style={{ background: '#5B4BF5' }}>
              <Save size={13} /> Save Changes
            </button>
            <button onClick={cancelEdit} className="px-5 py-2.5 rounded-xl text-xs font-bold text-white/50 hover:text-white"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {plans.map(plan => <PlanCard key={plan.id} plan={plan} onEdit={startEdit} />)}
        </div>
      )}
    </div>
  )
}
