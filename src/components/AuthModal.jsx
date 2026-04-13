/**
 * AuthModal — Premium portal-mounted auth modal
 * Opens when a guest user tries to download or access a Pro feature.
 * On success, calls onSuccess() so the parent can continue the gated action.
 */
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, Eye, EyeOff, User, FileText, Loader, CheckCircle, Sparkles, Shield } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useResumeStore } from '../store/resumeStore'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

export default function AuthModal({ onClose, onSuccess, trigger = 'download' }) {
  const [mode, setMode]         = useState('login') // 'login' | 'signup'
  const [email, setEmail]       = useState('')
  const [name, setName]         = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [step, setStep]         = useState('auth') // 'auth' | 'success'

  const { login, register, isLoading } = useAuthStore()
  const { loadCloudResumes, saveResume, resumeData }   = useResumeStore()

  const triggerMeta = {
    download: {
      icon : '📥',
      title: 'Almost there!',
      sub  : 'Create a free account to download your resume in perfect PDF format.',
    },
    pro: {
      icon : '⚡',
      title: 'Unlock Pro Features',
      sub  : 'Sign in or create a free account, then upgrade to Pro.',
    },
    save: {
      icon : '☁️',
      title: 'Save to Cloud',
      sub  : 'Sign in to save your resume securely and access it anywhere.',
    },
  }
  const meta = triggerMeta[trigger] || triggerMeta.download

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'signup') {
        await register(email, password, name)
        // After signup, Supabase may require email confirm.
        // Try to login immediately (works if email confirm is off).
        try {
          await login(email, password)
          await handlePostAuth()
        } catch {
          // Email confirmation required — show success message
          setStep('success')
        }
      } else {
        await login(email, password)
        await handlePostAuth()
      }
    } catch {
      // errors toasted inside login/register
    }
  }

  const handlePostAuth = async () => {
    // Merge local resume to cloud
    try {
      await loadCloudResumes(true)
      if (resumeData?.personal?.fullName || resumeData?.experience?.length) {
        await saveResume(resumeData.personal.fullName || 'My Resume')
      }
    } catch { /* non-critical */ }
    toast.success(mode === 'signup' ? '🎉 Account created!' : '👋 Welcome back!')
    onSuccess?.()
    onClose()
  }

  const handleForgotPassword = async () => {
    if (!email) { toast.error('Enter your email first'); return }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (error) throw error
      setForgotSent(true)
      toast.success('Password reset email sent!')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options : { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
      // Google redirects away — store pending action
      sessionStorage.setItem('post_auth_action', trigger)
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed')
    }
  }

  const modal = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10"
        >
          {/* Top gradient banner */}
          <div className="h-1.5 w-full bg-gradient-to-r from-brand-500 via-violet-500 to-indigo-500" />

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X size={14} />
          </button>

          <div className="p-8">
            {step === 'success' ? (
              /* Email confirmation step */
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <h2 className="font-black text-xl text-gray-900 mb-2">Check your email!</h2>
                <p className="text-sm text-gray-500 mb-6">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then come back here.</p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-brand-600 text-white font-bold rounded-2xl hover:bg-brand-700 transition-colors text-sm"
                >
                  Got it
                </button>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="text-3xl mb-3">{meta.icon}</div>
                  <h2 className="font-black text-xl text-gray-900">{meta.title}</h2>
                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{meta.sub}</p>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 mb-5">
                  {['100% Free', 'No spam', 'Secure'].map(b => (
                    <div key={b} className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Shield size={9} className="text-emerald-400" />
                      {b}
                    </div>
                  ))}
                </div>

                {/* Tab toggle */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl mb-5">
                  {[['login', 'Sign In'], ['signup', 'Create Account']].map(([m, label]) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={clsx(
                        'flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all',
                        mode === m ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600',
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Google OAuth */}
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:border-brand-300 hover:bg-brand-50 transition-all mb-4 text-sm group"
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
                  <div className="relative text-center"><span className="bg-white px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">or with email</span></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  {mode === 'signup' && (
                    <div className="relative">
                      <User size={13} className="absolute left-4 top-3.5 text-gray-400" />
                      <input
                        id="auth-name"
                        name="name"
                        aria-label="Full Name"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm bg-gray-50/50 placeholder:text-gray-400"
                        type="text" placeholder="Full Name" value={name}
                        onChange={e => setName(e.target.value)} required
                      />
                    </div>
                  )}
                  <div className="relative">
                    <Mail size={13} className="absolute left-4 top-3.5 text-gray-400" />
                    <input
                      id="auth-email"
                      name="email"
                      aria-label="Email address"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm bg-gray-50/50 placeholder:text-gray-400"
                      type="email" placeholder="Email address" value={email}
                      onChange={e => setEmail(e.target.value)} required
                    />
                  </div>
                  <div className="relative">
                    <Lock size={13} className="absolute left-4 top-3.5 text-gray-400" />
                    <input
                      id="auth-password"
                      name="password"
                      aria-label="Password"
                      className="w-full pl-10 pr-12 py-3 rounded-2xl border border-gray-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm bg-gray-50/50 placeholder:text-gray-400"
                      type={showPass ? 'text' : 'password'}
                      placeholder="Password (min 8 chars)" value={password}
                      onChange={e => setPassword(e.target.value)} required minLength={8}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>

                  {mode === 'login' && (
                    <div className="text-right">
                      <button type="button" onClick={handleForgotPassword} className="text-xs text-brand-600 hover:underline">
                        {forgotSent ? '✓ Email sent!' : 'Forgot password?'}
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-black rounded-2xl hover:shadow-lg hover:shadow-brand-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                  >
                    {isLoading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                      : mode === 'login' ? '→ Sign In & Continue' : '→ Create Free Account'
                    }
                  </button>
                </form>

                {/* Pro mention if upgrade trigger */}
                {trigger === 'download' && (
                  <div className="mt-4 flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                    <Sparkles size={13} className="text-amber-500 flex-shrink-0" />
                    <p className="text-[10px] font-bold text-amber-700">
                      After signing in, your resume auto-saves. Upgrade to <strong>Pro</strong> for unlimited downloads + AI tools.
                    </p>
                  </div>
                )}

                <p className="text-center text-xs text-gray-400 mt-4">
                  By continuing you agree to our{' '}
                  <a href="/terms" className="underline hover:text-gray-600">Terms</a> &{' '}
                  <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )

  return createPortal(modal, document.body)
}
