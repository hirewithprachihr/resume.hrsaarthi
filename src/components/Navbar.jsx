import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, Zap, LayoutTemplate, User, ChevronDown,
  Menu, X, Star, LogOut, Sparkles, BarChart3, Brain, Shield
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { clsx } from 'clsx'
import { EVENT_NAMES, trackEvent } from '../services/analytics'
import { useEntitlements } from '../utils/entitlements'
import { isAdmin } from '../services/adminApi'

const LAUNCH_DATE = new Date('2026-04-07')
const SHOW_NEW = (new Date() - LAUNCH_DATE) < (30 * 24 * 60 * 60 * 1000)

// Premium gradient avatar colors per first letter
const AVATAR_GRADIENTS = {
  A:'#5B4BF5,#8B5CF6', B:'#0EC8A0,#14B8A6', C:'#F59E0B,#EF4444',
  D:'#3B82F6,#6366F1', E:'#10B981,#0EC8A0', F:'#EF4444,#F97316',
  G:'#8B5CF6,#EC4899', H:'#5B4BF5,#3B82F6', I:'#0EC8A0,#22D3EE',
  J:'#F59E0B,#84CC16', K:'#EC4899,#F43F5E', L:'#6366F1,#8B5CF6',
  M:'#14B8A6,#0EC8A0', N:'#3B82F6,#22D3EE', O:'#F97316,#FBBF24',
  P:'#D4A843,#C9A84C', Q:'#8B5CF6,#A855F7', R:'#EF4444,#F43F5E',
  S:'#10B981,#34D399', T:'#0EA5E9,#38BDF8', U:'#7C3AED,#8B5CF6',
  V:'#5B4BF5,#818CF8', W:'#F59E0B,#FCD34D', X:'#EC4899,#F472B6',
  Y:'#84CC16,#A3E635', Z:'#06B6D4,#22D3EE',
}
function avatarGrad(name) {
  const ch = (name || 'U').trim()[0].toUpperCase()
  return AVATAR_GRADIENTS[ch] || '5B4BF5,#0EC8A0'
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [adminAccess, setAdminAccess] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, plan, logout, isAuthLoading } = useAuthStore()
  const { isPro, launchOfferActive } = useEntitlements()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    let cancelled = false
    async function checkAdmin() {
      if (!user?.id) {
        setAdminAccess(false)
        return
      }
      try {
        const ok = await isAdmin(user.id)
        if (!cancelled) setAdminAccess(ok)
      } catch {
        if (!cancelled) setAdminAccess(false)
      }
    }
    checkAdmin()
    return () => { cancelled = true }
  }, [user?.id])

  const isBuilder = location.pathname.startsWith('/builder')
  const isDark = scrolled || isBuilder

  return (
    <>
      <header className={clsx(
        'sticky top-0 z-50 transition-all duration-500',
        isDark
          ? 'bg-[#0A0A0F]/95 backdrop-blur-2xl border-b border-white/8 shadow-2xl'
          : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-[68px]">

            {/* ── Logo ────────────────────────────────── */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-9 h-9">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #5B4BF5 0%, #0EC8A0 100%)', boxShadow: '0 4px 16px rgba(91,75,245,0.4)' }}>
                  <Sparkles size={16} className="text-white" />
                </div>
                {/* Pulse ring on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ boxShadow: '0 0 0 4px rgba(91,75,245,0.25)' }} />
              </div>
              <div className="flex flex-col leading-none">
                <span className={clsx('text-[9px] font-black tracking-[0.22em] uppercase transition-colors',
                  isDark ? 'text-indigo-400' : 'text-indigo-600')}>
                  HR Saarthi
                </span>
                <span className={clsx('font-bold text-base tracking-tight transition-colors',
                  isDark ? 'text-white' : 'text-gray-950')}>
                  Elite <span className={isDark ? 'text-white/40' : 'text-gray-400'} style={{ fontWeight: 300 }}>Builder</span>
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ──────────────────────────── */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink to="/templates"     icon={<LayoutTemplate size={13} />} dark={isDark}>Templates</NavLink>
              <NavLinkBadge to="/cover-letter"   icon={<FileText size={13}/>}    dark={isDark} badge="New" badgeColor="#0EC8A0">Cover Letter</NavLinkBadge>
              <NavLinkBadge to="/interview-prep" icon={<Brain size={13} />}      dark={isDark} badge="New" badgeColor="#8B5CF6">Interview</NavLinkBadge>
              <NavLink to="/ats-score"     icon={<Zap size={13} />}            dark={isDark}>Readiness</NavLink>
              {user && <NavLink to="/dashboard" icon={<BarChart3 size={13} />} dark={isDark}>Dashboard</NavLink>}
            </nav>

            {/* ── Right Side ──────────────────────────── */}
            <div className="hidden md:flex items-center gap-3">
              {/* Plan badge */}
              {isPro ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border"
                  style={{ background: 'linear-gradient(135deg, #D4A84320, #C9A84C15)', color: '#D4A843', borderColor: '#D4A84340' }}>
                  <Star size={10} className="fill-current" /> {launchOfferActive && plan !== 'pro' ? 'Trial Pro' : 'Elite Pro'}
                </div>
              ) : (
                <Link
                  to="/upgrade"
                  onClick={() => trackEvent(EVENT_NAMES.UPGRADE_CLICK, { source: 'navbar' })}
                  className={clsx(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all',
                    isDark
                      ? 'bg-white/8 text-white/70 hover:bg-white/15 border border-white/10'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                  )}
                >
                  <Star size={10} /> Upgrade
                </Link>
              )}

              {/* Auth */}
              {isAuthLoading ? (
                <div className="w-20 h-9 rounded-xl animate-pulse" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#F3F4F6' }} />
              ) : user ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-xl transition-all"
                    style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'transparent' }}>
                    {/* Gradient avatar */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg flex-shrink-0"
                      style={{ background: `linear-gradient(135deg, #${avatarGrad(user.name)})` }}>
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className={clsx('text-xs font-bold tracking-tight hidden xl:block', isDark ? 'text-white' : 'text-gray-900')}>
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={13} className={clsx('transition-transform duration-300', isDark ? 'text-white/50' : 'text-gray-400', userMenuOpen && 'rotate-180')} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <>
                        {/* Backdrop */}
                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute right-0 top-full mt-2.5 w-56 rounded-2xl border overflow-hidden z-50"
                          style={{ background: '#0A0A0F', borderColor: 'rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)' }}>
                          {/* User info */}
                          <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                            <div className="text-white text-xs font-bold">{user.name}</div>
                            <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.email}</div>
                          </div>
                          <div className="p-1.5">
                            <DropItem to="/dashboard"   icon={<BarChart3 size={13} />} onClick={() => setUserMenuOpen(false)}>My Dashboard</DropItem>
                            <DropItem to="/upgrade"     icon={<Star size={13} />}      onClick={() => setUserMenuOpen(false)}>Upgrade to Pro</DropItem>
                            {adminAccess && (
                              <DropItem to="/admin" icon={<Shield size={13} />} onClick={() => setUserMenuOpen(false)}>
                                <span style={{ color: '#D4A843' }}>Admin Panel</span>
                              </DropItem>
                            )}
                            <div className="my-1" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
                            <button onClick={async () => {
                              setUserMenuOpen(false)
                              await logout()
                              navigate('/')
                            }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
                              <LogOut size={13} /> Sign Out
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login" className={clsx('text-xs font-bold px-3 py-2 rounded-xl transition-all',
                  isDark ? 'text-white/60 hover:text-white hover:bg-white/8' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50')}>
                  Sign In
                </Link>
              )}

              {/* CTA */}
              <Link to="/builder"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all hover:-translate-y-0.5 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #5B4BF5 0%, #7C3AED 100%)',
                  boxShadow: '0 4px 20px rgba(91,75,245,0.4)',
                }}>
                <Sparkles size={12} /> Launch
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all"
              style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#F9FAFB' }}
              onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen
                ? <X size={18} className={isDark ? 'text-white' : 'text-gray-900'} />
                : <Menu size={18} className={isDark ? 'text-white' : 'text-gray-900'} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden border-t overflow-hidden"
              style={{ background: '#0A0A0F', borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="px-4 py-5 space-y-1">
                <MobLink to="/templates">     <LayoutTemplate size={14} /> Templates</MobLink>
                <MobLink to="/cover-letter">  <FileText size={14} />       Cover Letter</MobLink>
                <MobLink to="/interview-prep"><Brain size={14} />           Interview Prep</MobLink>
                <MobLink to="/ats-score">     <Zap size={14} />            Readiness</MobLink>
                {user && <MobLink to="/dashboard"><BarChart3 size={14} /> Dashboard</MobLink>}
                {!isPro && <MobLink to="/upgrade"><Star size={14} /> Upgrade to Elite</MobLink>}
                <div className="pt-2 mt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                  {user
                    ? <button onClick={async () => { await logout(); navigate('/') }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors">
                        <LogOut size={14} /> Sign Out
                      </button>
                    : <MobLink to="/login"><User size={14} /> Sign In</MobLink>}
                </div>
                <Link to="/builder" className="flex items-center justify-center gap-2 w-full py-3.5 mt-2 text-white text-xs font-black uppercase tracking-widest rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #5B4BF5, #7C3AED)', boxShadow: '0 4px 20px rgba(91,75,245,0.35)' }}>
                  <Sparkles size={14} /> Launch Elite Builder
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────────

function NavLink({ to, children, icon, dark }) {
  const loc = useLocation()
  const active = loc.pathname === to || loc.pathname.startsWith(to + '/')
  return (
    <Link to={to} className={clsx(
      'flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-bold tracking-wide transition-all relative',
      dark
        ? active ? 'text-white bg-white/10' : 'text-white/50 hover:text-white hover:bg-white/8'
        : active ? 'text-gray-900 bg-gray-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
    )}>
      {icon}{children}
      {active && (
        <motion.div layoutId="nav-indicator" className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
          style={{ background: 'linear-gradient(90deg, #5B4BF5, #0EC8A0)' }} />
      )}
    </Link>
  )
}

function NavLinkBadge({ to, children, icon, dark, badge, badgeColor }) {
  return (
    <div className="relative">
      <NavLink to={to} icon={icon} dark={dark}>{children}</NavLink>
      {badge && SHOW_NEW && (
        <span className="absolute -top-1.5 -right-1 text-[7px] font-black uppercase text-white px-1.5 py-0.5 rounded-full leading-none"
          style={{ background: badgeColor }}>
          {badge}
        </span>
      )}
    </div>
  )
}

function DropItem({ to, icon, children, onClick }) {
  return (
    <Link to={to} onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-colors">
      {icon}{children}
    </Link>
  )
}

function MobLink({ to, children }) {
  return (
    <Link to={to}
      className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-colors">
      {children}
    </Link>
  )
}
