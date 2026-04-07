/**
 * AuthCallback — Handles Supabase email confirmation deep-links
 * Supabase redirects to /auth/callback after user clicks confirmation email.
 * This page shows a friendly "confirming..." state then redirects on success.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { useAuthStore } from '../store/authStore'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export default function AuthCallback() {
  const [status, setStatus] = useState('loading') // loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const navigate  = useNavigate()
  const loadCloud = useAuthStore(s => s._handleSession)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase auto-parses the URL hash/query and sets the session
        const { data, error } = await supabase.auth.getSession()
        if (error) throw error

        const session = data?.session
        if (!session?.user) {
          // No session after redirect — could be expired link
          throw new Error('Confirmation link may have expired. Please request a new one.')
        }

        setStatus('success')
        // Redirect to builder after brief success screen
        setTimeout(() => navigate('/builder'), 2000)
      } catch (err) {
        setStatus('error')
        setErrorMsg(err.message || 'Email confirmation failed.')
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[2rem] shadow-premium border border-gray-100 p-12 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Loader size={48} className="text-brand-600 animate-spin" />
            </div>
            <h1 className="font-display text-2xl text-gray-900 mb-2">Confirming your email…</h1>
            <p className="text-gray-500 text-sm">Just a moment, we're verifying your account.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-emerald-50 rounded-full flex items-center justify-center">
              <CheckCircle size={48} className="text-emerald-500" />
            </div>
            <h1 className="font-display text-2xl text-gray-900 mb-2">Email Confirmed! 🎉</h1>
            <p className="text-gray-500 text-sm mb-6">Your account is verified. Taking you to the builder…</p>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-600 rounded-full animate-[width_2s_ease-in-out]" style={{ width: '100%', transition: 'width 2s ease-in-out' }} />
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
              <XCircle size={48} className="text-red-500" />
            </div>
            <h1 className="font-display text-2xl text-gray-900 mb-2">Confirmation Failed</h1>
            <p className="text-gray-500 text-sm mb-6">{errorMsg}</p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary w-full justify-center"
            >
              Back to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  )
}
