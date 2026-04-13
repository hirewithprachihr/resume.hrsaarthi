import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, FileText, Chrome, User, Loader, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import { useResumeStore } from '../store/resumeStore'
import { supabase } from '../services/supabase'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [mode, setMode]         = useState('login')
  const [email, setEmail]       = useState('')
  const [name, setName]         = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
  const { login, register, loginWithGoogle, isLoading } = useAuthStore()
  const loadCloudResumes = useResumeStore(s => s.loadCloudResumes)
  const navigate         = useNavigate()
  const [searchParams]   = useSearchParams()
  const returnTo         = searchParams.get('returnTo') || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (mode === 'signup') {
        await register(email, password, name)
        toast.success('Account created! Check your email to confirm.')
        setMode('login')
      } else {
        await login(email, password)
        toast.success('Welcome back!')
        // Small delay to let the store stabilize before navigation
        setTimeout(() => {
          navigate(returnTo, { replace: true })
          // Load resumes in background
          loadCloudResumes(true).catch(() => {})
        }, 100)
      }
    } catch { /* Errors are toasted inside login/register */ }
  }

  const handleForgotPassword = async () => {
    if (!email) { toast.error('Enter your email address first.'); return }
    setForgotLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (error) throw error
      setForgotSent(true)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (err) {
      toast.error(err.message || 'Could not send reset email.')
    } finally {
      setForgotLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await loginWithGoogle()
    } catch {
      toast.error('Google sign-in failed.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent-100/30 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-11 h-11 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-200 group-hover:shadow-xl group-hover:shadow-brand-200 transition-all">
              <FileText size={20} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-black text-brand-600 tracking-[0.2em] uppercase">HR Saarthi</div>
              <div className="font-bold text-lg text-gray-900 leading-none tracking-tight">Resume Builder</div>
            </div>
          </Link>
          <h1 className="font-bold text-3xl text-gray-900 tracking-tight">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {mode === 'login' ? 'Sign in to access your saved resumes' : 'Start building ATS-optimised resumes for free'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 p-8">
          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border-2 border-gray-200 rounded-2xl font-semibold text-gray-700 hover:border-brand-300 hover:bg-brand-50 transition-all mb-6 disabled:opacity-60 group"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.616z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative text-center"><span className="bg-white px-4 text-xs text-gray-400 font-semibold uppercase tracking-wider">or with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="full-name" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    id="full-name"
                    name="name"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm bg-gray-50/50 placeholder:text-gray-400"
                    type="text"
                    placeholder="Rahul Sharma"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  id="login-email"
                  name="email"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm bg-gray-50/50 placeholder:text-gray-400"
                  type="email"
                  placeholder="rahul@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="login-password" className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                {mode === 'login' && (
                  <button type="button" onClick={handleForgotPassword} disabled={forgotLoading}
                    className="text-xs text-brand-600 hover:underline flex items-center gap-1 disabled:opacity-60">
                    {forgotLoading ? <><Loader size={11} className="animate-spin" /> Sending…</> : forgotSent ? <><CheckCircle size={11} className="text-emerald-500" /> Sent!</> : 'Forgot password?'}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-3.5 text-gray-400" />
                <input
                  id="login-password"
                  name="password"
                  className="w-full pl-11 pr-12 py-3 rounded-2xl border border-gray-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all text-sm bg-gray-50/50 placeholder:text-gray-400"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-brand-200 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {isLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Please wait…</> : mode === 'login' ? 'Sign In' : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-brand-600 font-bold hover:underline">
              {mode === 'login' ? "Sign up — it's free" : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing, you agree to our{' '}
          <Link to="#" className="underline hover:text-gray-600">Terms</Link> &{' '}
          <Link to="#" className="underline hover:text-gray-600">Privacy Policy</Link>
        </p>
      </motion.div>
    </div>
  )
}
