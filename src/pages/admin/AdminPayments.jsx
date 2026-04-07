import { useEffect, useState } from 'react'
import { CreditCard, TrendingUp, Calendar, Users, Star, Download } from 'lucide-react'
import { fetchPayments } from '../../services/adminApi'
import toast from 'react-hot-toast'

export default function AdminPayments() {
  const [data, setData]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPayments().then(setData).catch(e => toast.error(e.message)).finally(() => setLoading(false))
  }, [])

  const totalRevenue = data.length * 149
  const monthly  = data.filter(p => p.plan === 'pro')
  const churned  = data.filter(p => p.plan !== 'pro')

  const handleExport = () => {
    const csv = [
      ['Name','Email','Plan','Status','Start','End'],
      ...data.map(p => [p.name||'', p.id||'', p.plan||'', p.plan === 'pro' ? 'active' : 'inactive', p.pro_activated_at||p.created_at, 'Ongoing'])
    ].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href = url; a.download = 'payments.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-white">Payment Management</h1>
          <p className="text-white/40 text-xs mt-0.5">All Pro subscription transactions</p>
        </div>
        <button onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white transition-all"
          style={{ background: 'rgba(91,75,245,0.2)', border: '1px solid rgba(91,75,245,0.3)' }}>
          <Download size={13} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Subscribers', value: data.length,   icon: Users,     color: '#5B4BF5' },
          { label: 'Active Pro',        value: monthly.length, icon: Star,      color: '#0EC8A0' },
          { label: 'Churned',           value: churned.length, icon: TrendingUp,color: '#EC4899' },
          { label: 'Est. Revenue',      value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: CreditCard, color: '#D4A843' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.color + '20' }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-[9px] text-white/30 uppercase tracking-widest font-bold">{s.label}</div>
              <div className="text-lg font-black text-white">{loading ? '—' : s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['#', 'Subscriber', 'Email', 'Plan', 'Status', 'Start Date', 'End Date', 'Amount'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-3">
                    <div className="h-8 animate-pulse rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  </td></tr>
                ))
              ) : data.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-14 text-white/30 text-xs">No payment records yet</td></tr>
              ) : data.map((p, i) => {
                const isActive = p.plan === 'pro'
                return (
                  <tr key={p.id} className="border-t hover:bg-white/3 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <td className="px-4 py-3 text-[10px] text-white/25 font-bold">{i + 1}</td>
                    <td className="px-4 py-3 text-xs font-bold text-white/80">{p.name || '—'}</td>
                    <td className="px-4 py-3 text-[10px] text-white/50">{p.id || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase text-yellow-400 bg-yellow-500/15">{p.plan || 'pro'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${isActive ? 'text-emerald-400 bg-emerald-500/15' : 'text-red-400 bg-red-500/15'}`}>
                        {isActive ? '● Active' : '● Expired'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[10px] text-white/40">{p.pro_activated_at ? new Date(p.pro_activated_at).toLocaleDateString('en-IN') : '—'}</td>
                    <td className="px-4 py-3 text-[10px] text-white/40">Ongoing</td>
                    <td className="px-4 py-3 text-xs font-black text-emerald-400">₹149</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
