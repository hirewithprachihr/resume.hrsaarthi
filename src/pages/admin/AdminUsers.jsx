import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Users, Star, Trash2, Edit3, ChevronDown, X, Check, UserCheck } from 'lucide-react'
import { fetchAllUsers, setUserPlan } from '../../services/adminApi'
import toast from 'react-hot-toast'

const PLAN_COLORS = { pro: 'text-emerald-400 bg-emerald-500/15', free: 'text-white/40 bg-white/8', deleted: 'text-red-400 bg-red-500/15' }

export default function AdminUsers() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [sortBy, setSortBy]   = useState('created_at')
  const [editId, setEditId]   = useState(null)
  const [editPlan, setEditPlan] = useState('')

  useEffect(() => {
    fetchAllUsers().then(setUsers).catch(e => toast.error(e.message)).finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    return users
      .filter(u => {
        const q = search.toLowerCase()
        const match = !q || (u.name||'').toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q)
        const planMatch = planFilter === 'all' || (u.plan || 'free') === planFilter
        return match && planMatch
      })
      .sort((a, b) => {
        if (sortBy === 'created_at') return new Date(b.created_at) - new Date(a.created_at)
        if (sortBy === 'name')       return (a.name||'').localeCompare(b.name||'')
        return 0
      })
  }, [users, search, planFilter, sortBy])

  const handlePlanSave = async (userId) => {
    try {
      await setUserPlan(userId, editPlan)
      setUsers(u => u.map(x => x.id === userId ? { ...x, plan: editPlan } : x))
      toast.success('Plan updated')
    } catch (e) { toast.error(e.message) }
    setEditId(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-white">User Management</h1>
          <p className="text-white/40 text-xs mt-0.5">{users.length} registered users</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase text-white/30"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <UserCheck size={12} /> {users.filter(u => u.plan === 'pro').length} Pro
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs font-bold text-white placeholder-white/25 outline-none"
            style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
        <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white outline-none cursor-pointer"
          style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.08)' }}>
          <option value="all">All Plans</option>
          <option value="pro">Pro</option>
          <option value="free">Free</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white outline-none cursor-pointer"
          style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.08)' }}>
          <option value="created_at">Newest First</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['#', 'User', 'Email', 'Plan', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-white/30">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6} className="px-4 py-3">
                      <div className="h-8 rounded-lg animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
                    </td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-white/30 text-xs">No users found</td></tr>
              ) : filtered.map((u, i) => (
                <tr key={u.id} className="border-t transition-colors hover:bg-white/3" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <td className="px-4 py-3 text-[10px] text-white/25 font-bold">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white flex-shrink-0"
                        style={{ background: `hsl(${(i * 53) % 360}, 70%, 40%)` }}>
                        {(u.name || u.email || '?')[0].toUpperCase()}
                      </div>
                      <div className="text-xs font-bold text-white/80">{u.name || '—'}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-white/50 font-bold">{u.email}</td>
                  <td className="px-4 py-3">
                    {editId === u.id ? (
                      <div className="flex items-center gap-2">
                        <select value={editPlan} onChange={e => setEditPlan(e.target.value)}
                          className="px-2 py-1 rounded-lg text-[10px] font-black text-white outline-none"
                          style={{ background: '#0B0D17', border: '1px solid rgba(255,255,255,0.15)' }}>
                          <option value="free">Free</option>
                          <option value="pro">Pro</option>
                        </select>
                        <button onClick={() => handlePlanSave(u.id)} className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/30">
                          <Check size={11} />
                        </button>
                        <button onClick={() => setEditId(null)} className="w-6 h-6 rounded-md bg-white/8 flex items-center justify-center text-white/40 hover:bg-white/15">
                          <X size={11} />
                        </button>
                      </div>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase ${PLAN_COLORS[u.plan || 'free']}`}>
                        {u.plan === 'pro' && <Star size={8} className="inline mr-1 fill-current" />}{u.plan || 'free'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[10px] text-white/40">{u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { setEditId(u.id); setEditPlan(u.plan || 'free') }}
                      className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/15 transition-colors" title="Edit Plan">
                      <Edit3 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] text-white/30 font-bold">{filtered.length} of {users.length} users shown</span>
        </div>
      </div>
    </div>
  )
}
