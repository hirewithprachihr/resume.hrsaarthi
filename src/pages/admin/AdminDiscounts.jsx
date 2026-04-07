import { useEffect, useState } from 'react'
import { Plus, Trash2, ToggleLeft, ToggleRight, Copy, BadgePercent, Check, X, Loader } from 'lucide-react'
import { fetchDiscounts, createDiscount, updateDiscount, deleteDiscount } from '../../services/adminApi'
import toast from 'react-hot-toast'

const EMPTY = {
  code: '', description: '', discount_pct: 20,
  valid_from: new Date().toISOString().split('T')[0],
  valid_until: '', max_uses: '', is_active: true,
}

export default function AdminDiscounts() {
  const [list, setList]       = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [form, setForm]       = useState(EMPTY)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    fetchDiscounts().then(setList).catch(e => toast.error(e.message)).finally(() => setLoading(false))
  }, [])

  const handleCreate = async () => {
    if (!form.code.trim()) return toast.error('Code is required')
    setSaving(true)
    try {
      const payload = {
        ...form,
        code       : form.code.toUpperCase().trim(),
        max_uses   : form.max_uses ? parseInt(form.max_uses) : null,
        valid_until: form.valid_until || null,
      }
      const created = await createDiscount(payload)
      setList(l => [created, ...l])
      setForm(EMPTY); setCreating(false)
      toast.success('Discount code created!')
    } catch (e) { toast.error(e.message) }
    setSaving(false)
  }

  const toggleActive = async (d) => {
    try {
      const updated = await updateDiscount(d.id, { is_active: !d.is_active })
      setList(l => l.map(x => x.id === d.id ? updated : x))
    } catch (e) { toast.error(e.message) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this discount code?')) return
    try {
      await deleteDiscount(id)
      setList(l => l.filter(x => x.id !== id))
      toast.success('Deleted')
    } catch (e) { toast.error(e.message) }
  }

  const copyCode = (code) => { navigator.clipboard.writeText(code); toast.success('Code copied!') }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-white">Offers & Discount Codes</h1>
          <p className="text-white/40 text-xs mt-0.5">{list.filter(d => d.is_active).length} active codes</p>
        </div>
        <button onClick={() => setCreating(!creating)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #5B4BF5, #7C3AED)', boxShadow: '0 4px 16px rgba(91,75,245,0.3)' }}>
          <Plus size={14} /> Create Code
        </button>
      </div>

      {/* Create Form */}
      {creating && (
        <div className="rounded-2xl p-5 space-y-4" style={{ background: '#13152A', border: '1px solid rgba(91,75,245,0.3)' }}>
          <h3 className="text-sm font-black text-white">New Discount Code</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Code *</label>
              <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                placeholder="SUMMER25"
                className="w-full px-3 py-2.5 rounded-xl text-xs font-black text-white uppercase outline-none"
                style={{ background: '#0B0D17', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Discount %</label>
              <input type="number" min="1" max="100" value={form.discount_pct} onChange={e => setForm(f => ({ ...f, discount_pct: parseInt(e.target.value) }))}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-black text-white outline-none"
                style={{ background: '#0B0D17', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Max Uses (blank = ∞)</label>
              <input type="number" value={form.max_uses} onChange={e => setForm(f => ({ ...f, max_uses: e.target.value }))}
                placeholder="Unlimited"
                className="w-full px-3 py-2.5 rounded-xl text-xs font-black text-white outline-none"
                style={{ background: '#0B0D17', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Valid From</label>
              <input type="date" value={form.valid_from} onChange={e => setForm(f => ({ ...f, valid_from: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-black text-white outline-none"
                style={{ background: '#0B0D17', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Valid Until (blank = forever)</label>
              <input type="date" value={form.valid_until} onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl text-xs font-black text-white outline-none"
                style={{ background: '#0B0D17', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
            <div>
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 block mb-1.5">Description</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Summer sale offer"
                className="w-full px-3 py-2.5 rounded-xl text-xs font-bold text-white outline-none"
                style={{ background: '#0B0D17', border: '1px solid rgba(255,255,255,0.1)' }} />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleCreate} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white transition-all disabled:opacity-50"
              style={{ background: '#5B4BF5' }}>
              {saving ? <Loader size={13} className="animate-spin" /> : <Check size={13} />}
              {saving ? 'Creating…' : 'Create Code'}
            </button>
            <button onClick={() => { setCreating(false); setForm(EMPTY) }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white/60 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              <X size={13} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Codes grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3].map(n => <div key={n} className="h-36 rounded-2xl animate-pulse" style={{ background: '#13152A' }} />)}
        </div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 text-white/30 text-sm">No discount codes yet. Create one!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map(d => {
            const expired = d.valid_until && new Date(d.valid_until) < new Date()
            return (
              <div key={d.id} className="rounded-2xl p-4 relative overflow-hidden"
                style={{ background: '#13152A', border: `1px solid ${d.is_active && !expired ? 'rgba(91,75,245,0.3)' : 'rgba(255,255,255,0.07)'}` }}>
                {/* Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BadgePercent size={14} style={{ color: d.is_active && !expired ? '#D4A843' : '#555' }} />
                    <button onClick={() => copyCode(d.code)}
                      className="text-sm font-black text-white hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                      {d.code} <Copy size={11} className="text-white/30" />
                    </button>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                    expired ? 'text-red-400 bg-red-500/15' :
                    d.is_active ? 'text-emerald-400 bg-emerald-500/15' : 'text-white/30 bg-white/8'
                  }`}>
                    {expired ? 'Expired' : d.is_active ? 'Active' : 'Paused'}
                  </span>
                </div>
                <div className="text-3xl font-black mb-1" style={{ color: '#D4A843' }}>{d.discount_pct}% OFF</div>
                <div className="text-[10px] text-white/40 mb-3">{d.description || 'No description'}</div>
                <div className="flex items-center gap-3 text-[9px] text-white/30 font-bold mb-4">
                  <span>Used: {d.uses_count}/{d.max_uses || '∞'}</span>
                  {d.valid_until && <span>Expires: {new Date(d.valid_until).toLocaleDateString('en-IN')}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleActive(d)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                    {d.is_active ? <ToggleRight size={13} className="text-emerald-400" /> : <ToggleLeft size={13} className="text-white/40" />}
                    <span className="text-white/60">{d.is_active ? 'Pause' : 'Activate'}</span>
                  </button>
                  <button onClick={() => handleDelete(d.id)}
                    className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
