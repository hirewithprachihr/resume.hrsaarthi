import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, FileText, CreditCard, Tag, Settings,
  ChevronLeft, ChevronRight, Bell, LogOut, Sparkles, Database,
  TrendingUp, Menu, X, Shield, BadgePercent, Globe
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const NAV = [
  { to: '/admin',           label: 'Overview',      icon: LayoutDashboard, end: true },
  { to: '/admin/users',     label: 'Users',         icon: Users },
  { to: '/admin/resumes',   label: 'Resume DB',     icon: Database },
  { to: '/admin/payments',  label: 'Payments',      icon: CreditCard },
  { to: '/admin/discounts', label: 'Offers & Codes',icon: BadgePercent },
  { to: '/admin/plans',     label: 'Plans',         icon: TrendingUp },
  { to: '/admin/settings',  label: 'Settings',      icon: Settings },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mob, setMob] = useState(false)
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0B0D17', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Mobile overlay ─── */}
      <AnimatePresence>
        {mob && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 lg:hidden" style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setMob(false)} />
        )}
      </AnimatePresence>

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 240 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className={`relative z-40 flex-shrink-0 h-full flex flex-col border-r overflow-hidden
          ${mob ? 'fixed left-0 top-0' : 'hidden lg:flex'}
          lg:flex`}
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#0D0F1E', width: mob ? 240 : undefined }}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #5B4BF5, #0EC8A0)' }}>
            <Sparkles size={16} className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-black tracking-widest uppercase" style={{ color: '#5B4BF5' }}>HR Saarthi</span>
              <span className="text-white font-bold text-sm leading-none">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group ${
                  isActive
                    ? 'text-white'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, rgba(91,75,245,0.25), rgba(14,200,160,0.1))', border: '1px solid rgba(91,75,245,0.3)' } : {}}>
              <item.icon size={15} className="flex-shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User info + collapse */}
        <div className="px-3 pb-4 space-y-2 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #D4A843, #C9A84C)' }}>
              {(user?.name || 'H')[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-white text-[10px] font-bold truncate">{user?.name || 'Admin'}</div>
                <div className="text-[9px] font-black uppercase tracking-widest" style={{ color: '#D4A843' }}>Super Admin</div>
              </div>
            )}
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[10px] font-bold text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={14} className="flex-shrink-0" />
            {!collapsed && 'Sign Out'}
          </button>
          {/* Collapse toggle */}
          <button onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-full h-8 rounded-xl transition-all text-white/30 hover:text-white/70 hover:bg-white/5">
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </motion.aside>

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 flex-shrink-0 border-b" style={{ background: '#0D0F1E', borderColor: 'rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setMob(!mob)}>
              {mob ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest"
              style={{ background: 'rgba(91,75,245,0.15)', border: '1px solid rgba(91,75,245,0.25)', color: '#818CF8' }}>
              <Shield size={11} /> Admin Portal
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[10px] text-white/30 font-bold hidden sm:block">HR Saarthi · Prachi Digital Ventures</div>
            <button className="w-9 h-9 rounded-xl flex items-center justify-center transition-all text-white/40 hover:text-white hover:bg-white/8"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <Bell size={16} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ background: '#0B0D17' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
