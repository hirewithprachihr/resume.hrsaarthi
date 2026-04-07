import { useEffect, useState } from 'react'
import { Settings, Save, Loader, Globe, Mail, Key, CreditCard, Brain, LayoutTemplate, Shield, RefreshCw } from 'lucide-react'
import { fetchSettings, saveSetting } from '../../services/adminApi'
import toast from 'react-hot-toast'

const SETTING_GROUPS = [
  {
    label: 'Branding', icon: Globe, color: '#5B4BF5',
    fields: [
      { key: 'site_name',  label: 'Platform Name',            type: 'text',   placeholder: 'HR Saarthi' },
      { key: 'tagline',    label: 'Tagline / Sub-heading',     type: 'text',   placeholder: 'Build Resumes That Actually Get Interviews' },
      { key: 'support_email', label: 'Support Email',          type: 'email',  placeholder: 'hello@hrsaarthi.com' },
    ]
  },
  {
    label: 'Features & Limits', icon: LayoutTemplate, color: '#0EC8A0',
    fields: [
      { key: 'free_template_limit', label: 'Free Plan Template Limit', type: 'number', placeholder: '3' },
      { key: 'ai_enabled',          label: 'AI Features Enabled',      type: 'toggle' },
      { key: 'razorpay_live_mode',  label: 'Razorpay Live Mode',       type: 'toggle' },
    ]
  },
  {
    label: 'Security', icon: Shield, color: '#EC4899',
    fields: [
      { key: 'admin_email', label: 'Admin Email', type: 'text', placeholder: 'srsolutionhub@gmail.com', readOnly: true },
      { key: 'admin_id',    label: 'Admin UUID',  type: 'text', placeholder: '7d7d97a2-ac96-4564-ba40-6668c74d46ad', readOnly: true },
    ]
  },
]

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    site_name         : 'HR Saarthi',
    tagline           : 'Build Resumes That Actually Get Interviews',
    support_email     : 'hello@hrsaarthi.com',
    free_template_limit: '3',
    ai_enabled        : true,
    razorpay_live_mode: true,
    admin_email       : 'srsolutionhub@gmail.com',
    admin_id          : '7d7d97a2-ac96-4564-ba40-6668c74d46ad',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState({})
  const [changed, setChanged] = useState({})

  useEffect(() => {
    fetchSettings()
      .then(s => setSettings(prev => ({ ...prev, ...s })))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (key, val) => {
    setSettings(s => ({ ...s, [key]: val }))
    setChanged(c => ({ ...c, [key]: true }))
  }

  const save = async (key) => {
    setSaving(s => ({ ...s, [key]: true }))
    try {
      await saveSetting(key, settings[key])
      setChanged(c => { const x = { ...c }; delete x[key]; return x })
      toast.success('Saved')
    } catch (e) { toast.error(e.message) }
    setSaving(s => ({ ...s, [key]: false }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-white">Platform Settings</h1>
        <p className="text-white/40 text-xs mt-0.5">Configure global platform behaviour</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size={24} className="animate-spin text-indigo-400" />
        </div>
      ) : SETTING_GROUPS.map(group => (
        <div key={group.label} className="rounded-2xl overflow-hidden" style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.07)' }}>
          {/* Group header */}
          <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: group.color + '25' }}>
              <group.icon size={15} style={{ color: group.color }} />
            </div>
            <span className="text-sm font-black text-white">{group.label}</span>
          </div>

          <div className="p-5 space-y-4">
            {group.fields.map(f => (
              <div key={f.key} className="flex items-start sm:items-center gap-4 flex-col sm:flex-row">
                <div className="w-48 flex-shrink-0">
                  <div className="text-xs font-black text-white/70">{f.label}</div>
                  <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-0.5">{f.key}</div>
                </div>

                {f.type === 'toggle' ? (
                  <div className="flex items-center gap-3">
                    <button onClick={() => !f.readOnly && set(f.key, !settings[f.key])}
                      className={`relative w-11 h-6 rounded-full transition-all ${settings[f.key] ? '' : ''}`}
                      style={{ background: settings[f.key] ? '#0EC8A0' : 'rgba(255,255,255,0.1)', cursor: f.readOnly ? 'default' : 'pointer' }}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${settings[f.key] ? 'left-6' : 'left-1'}`} />
                    </button>
                    <span className={`text-xs font-black ${settings[f.key] ? 'text-emerald-400' : 'text-white/30'}`}>
                      {settings[f.key] ? 'Enabled' : 'Disabled'}
                    </span>
                    {changed[f.key] && (
                      <button onClick={() => save(f.key)} disabled={saving[f.key]}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black text-white"
                        style={{ background: '#5B4BF5' }}>
                        {saving[f.key] ? <Loader size={10} className="animate-spin" /> : <Save size={10} />} Save
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type={f.type}
                      value={settings[f.key] || ''}
                      onChange={e => !f.readOnly && set(f.key, e.target.value)}
                      readOnly={f.readOnly}
                      placeholder={f.placeholder}
                      className="flex-1 px-3 py-2.5 rounded-xl text-xs font-bold text-white outline-none min-w-0"
                      style={{
                        background: f.readOnly ? 'rgba(255,255,255,0.03)' : '#0B0D17',
                        border: `1px solid ${changed[f.key] ? 'rgba(91,75,245,0.5)' : 'rgba(255,255,255,0.08)'}`,
                        cursor: f.readOnly ? 'default' : 'text',
                        color: f.readOnly ? 'rgba(255,255,255,0.3)' : undefined,
                      }} />
                    {changed[f.key] && !f.readOnly && (
                      <button onClick={() => save(f.key)} disabled={saving[f.key]}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black text-white flex-shrink-0"
                        style={{ background: '#5B4BF5' }}>
                        {saving[f.key] ? <Loader size={10} className="animate-spin" /> : <Save size={10} />}
                        Save
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* SQL Migration note */}
      <div className="rounded-2xl p-5" style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 mb-4">
          <Key size={15} className="text-yellow-400" />
          <span className="text-sm font-black text-white">Database Setup</span>
        </div>
        <p className="text-xs text-white/50 mb-4 leading-relaxed">
          Run the admin migration SQL to set up database tables for discounts, admin roles, and platform settings.
          Navigate to: <strong className="text-white/70">Supabase Dashboard → SQL Editor</strong> and paste the migration.
        </p>
        <div className="px-4 py-3 rounded-xl text-xs font-mono text-white/50" style={{ background: '#0B0D17', border: '1px solid rgba(255,255,255,0.06)' }}>
          📁 supabase/migrations/20260407_admin_system.sql
        </div>
        <a href="https://supabase.com/dashboard/project/mtfxwyezotzrzzsyhoay/sql"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-xs font-black text-white transition-all"
          style={{ background: 'rgba(91,75,245,0.2)', border: '1px solid rgba(91,75,245,0.3)' }}>
          <RefreshCw size={12} /> Open Supabase SQL Editor
        </a>
      </div>
    </div>
  )
}
