/**
 * AdminGuard — protects /admin/* routes
 * Checks if logged-in user is the registered admin
 */
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { isAdmin } from '../../services/adminApi'
import { Loader, Sparkles } from 'lucide-react'

export default function AdminGuard({ children }) {
  const { user, isAuthLoading } = useAuthStore()
  const [checking, setChecking]  = useState(true)
  const [allowed,  setAllowed]   = useState(false)

  useEffect(() => {
    if (isAuthLoading) return
    if (!user) { setChecking(false); return }

    // DB check (admin_roles)
    isAdmin(user.id)
      .then(ok => setAllowed(ok))
      .catch(() => setAllowed(false))
      .finally(() => setChecking(false))
  }, [user, isAuthLoading])

  if (isAuthLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0B0D17' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5B4BF5, #0EC8A0)' }}>
            <Sparkles size={20} className="text-white" />
          </div>
          <Loader size={20} className="animate-spin text-indigo-400" />
          <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Verifying Admin Access…</p>
        </div>
      </div>
    )
  }

  if (!user)    return <Navigate to="/login?returnTo=/admin" replace />
  if (!allowed) return <Navigate to="/"                       replace />

  return children
}
