/**
 * ProtectedRoute — Redirects unauthenticated users to /login
 * preserving the intended destination as ?returnTo=...
 *
 * Usage:
 *   <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
 */
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute({ children }) {
  const user          = useAuthStore(s => s.user)
  const isAuthLoading = useAuthStore(s => s.isAuthLoading)
  const navigate      = useNavigate()
  const location      = useLocation()

  // Hard timeout: if auth hasn't resolved in 10s, force-clear the loading flag
  // (guards against Supabase network timeouts or getSession hanging)
  useEffect(() => {
    if (!isAuthLoading) return
    const timer = setTimeout(() => {
      useAuthStore.setState({ isAuthLoading: false })
    }, 10000)
    return () => clearTimeout(timer)
  }, [isAuthLoading])

  useEffect(() => {
    // Wait for Supabase session to restore before redirecting
    if (isAuthLoading) return
    if (!user) {
      navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`, { replace: true })
    }
  }, [user, isAuthLoading, navigate, location.pathname])

  // While auth is loading, show a clean centered spinner
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Authenticating...</p>
        </div>
      </div>
    )
  }

  // Not logged in, waiting for redirect — return null to avoid flash
  if (!user) return null

  return children
}
