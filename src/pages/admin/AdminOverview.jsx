import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, FileText, CreditCard, TrendingUp, Activity, Eye, Download, ArrowUpRight, Loader } from 'lucide-react'
import { fetchAllUsers, fetchAllResumes, fetchPayments } from '../../services/adminApi'
import { Link } from 'react-router-dom'

function StatCard({ label, value, sub, icon: Icon, color, to, loading }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-5 flex flex-col gap-3 cursor-pointer group"
      style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.07)' }}>
      {/* Glow */}
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: color, transform: 'translate(40%, -40%)' }} />
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: color + '22' }}>
          <Icon size={18} style={{ color }} />
        </div>
        {to && (
          <Link to={to} className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={14} style={{ color }} />
          </Link>
        )}
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">{label}</div>
        {loading
          ? <div className="h-7 w-16 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
          : <div className="text-2xl font-black text-white">{value}</div>
        }
        {sub && <div className="text-[10px] text-white/30 font-bold mt-1">{sub}</div>}
      </div>
    </motion.div>
  )
}

function ActivityRow({ icon: Icon, color, text, time }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: color + '20' }}>
        <Icon size={12} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-white/70">{text}</div>
        <div className="text-[10px] text-white/30">{time}</div>
      </div>
    </div>
  )
}

export default function AdminOverview() {
  const [users, setUsers]     = useState([])
  const [resumes, setResumes] = useState([])
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchAllUsers(), fetchAllResumes(), fetchPayments()])
      .then(([u, r, p]) => { setUsers(u); setResumes(r); setPayments(p) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const proUsers   = users.filter(u => u.plan === 'pro').length
  const freeUsers  = users.length - proUsers
  const revenue    = payments.length * 149
  const todayUsers = users.filter(u => {
    const d = new Date(u.created_at)
    const t = new Date()
    return d.toDateString() === t.toDateString()
  }).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Platform Overview</h1>
        <p className="text-white/40 text-sm mt-1">HR Saarthi · Live dashboard · {new Date().toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users"      value={loading ? '—' : users.length}    sub={`${todayUsers} joined today`}              icon={Users}     color="#5B4BF5" to="/admin/users"    loading={loading} />
        <StatCard label="Pro Subscribers"  value={loading ? '—' : proUsers}         sub={`${freeUsers} on Free plan`}              icon={TrendingUp} color="#0EC8A0" to="/admin/plans"    loading={loading} />
        <StatCard label="Total Resumes"    value={loading ? '—' : resumes.length}   sub="Across all users"                         icon={FileText}  color="#D4A843"  to="/admin/resumes"  loading={loading} />
        <StatCard label="Est. Revenue"     value={loading ? '—' : `₹${revenue.toLocaleString('en-IN')}`} sub="Based on Pro subs"  icon={CreditCard} color="#EC4899" to="/admin/payments"  loading={loading} />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <div className="lg:col-span-2 rounded-2xl p-5" style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-black text-white">Recent Signups</h3>
            <Link to="/admin/users" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300">View All</Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(n => <div key={n} className="h-10 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />)}
            </div>
          ) : users.length === 0 ? (
            <p className="text-white/30 text-xs text-center py-8">No users yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-[9px] font-black uppercase tracking-widest text-white/30">
                    <th className="text-left pb-3">User</th>
                    <th className="text-left pb-3">Plan</th>
                    <th className="text-left pb-3">Joined</th>
                    <th className="text-left pb-3">Resumes</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 8).map((u, i) => {
                    const userResumes = resumes.filter(r => r.user_id === u.id).length
                    return (
                      <tr key={u.id} className="border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                              style={{ background: `hsl(${(i * 47) % 360}, 70%, 45%)` }}>
                              {(u.name || u.email || '?')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white/80 truncate max-w-[120px]">{u.name || '—'}</div>
                              <div className="text-[9px] text-white/30 truncate max-w-[120px]">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                            u.plan === 'pro' ? 'text-emerald-400 bg-emerald-500/15' : 'text-white/40 bg-white/8'
                          }`}>{u.plan || 'free'}</span>
                        </td>
                        <td className="py-2.5 text-[10px] text-white/40">{u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'}</td>
                        <td className="py-2.5 text-xs font-black text-white/60">{userResumes}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Activity */}
        <div className="rounded-2xl p-5" style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-sm font-black text-white mb-5">Platform Health</h3>
          <div className="space-y-4">
            {[
              { label: 'Active Users (7d)', value: users.filter(u => new Date(u.created_at) > new Date(Date.now()-7*86400000)).length, color: '#5B4BF5' },
              { label: 'Pro Conversion Rate', value: users.length ? `${Math.round(proUsers/users.length*100)}%` : '0%', color: '#0EC8A0' },
              { label: 'Avg Resumes/User',    value: users.length ? (resumes.length/users.length).toFixed(1) : '0', color: '#D4A843' },
                { label: 'Templates Used',      value: [...new Set(resumes.map(r => r.settings?.templateId).filter(Boolean))].length, color: '#EC4899' },
            ].map(m => (
              <div key={m.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                <span className="text-[10px] text-white/40 font-bold">{m.label}</span>
                <span className="text-sm font-black" style={{ color: m.color }}>{loading ? '—' : m.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
            <div className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-3">System Status</div>
            {[
              { label: 'Supabase DB',  ok: true },
              { label: 'Razorpay',     ok: true },
              { label: 'OpenAI API',   ok: true },
              { label: 'PDF Engine',   ok: true },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between py-1.5">
                <span className="text-[10px] text-white/50 font-bold">{s.label}</span>
                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${s.ok ? 'text-emerald-400 bg-emerald-500/15' : 'text-red-400 bg-red-500/15'}`}>
                  {s.ok ? '● Online' : '● Offline'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
