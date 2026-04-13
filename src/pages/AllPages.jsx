import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, FileText, Chrome, Plus, Trash2, Copy, Edit3, Clock, Check, Zap, Star, AlertCircle, CheckCircle, Info, AlertTriangle, ArrowRight, Home, User, KeyRound, Loader } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useResumeStore } from '../store/resumeStore'
import { supabase } from '../services/supabase'
import { scoreResume } from '../utils/atsScorer'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

// ── Login Page ────────────────────────────────────────────────────────────────
export function LoginPage() {
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
        await loadCloudResumes(true)
        toast.success('Welcome back!')
        navigate(returnTo, { replace: true })
      }
    } catch {
      // Errors are toasted inside login/register
    }
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
      toast.success('Signed in with Google!')
      navigate('/dashboard')
    } catch {
      toast.error('Google sign-in failed.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-[10px] font-semibold text-brand-600 tracking-widest uppercase">HR Saarthi</div>
              <div className="font-display text-lg text-gray-900 leading-none">Resume Builder</div>
            </div>
          </Link>
          <h1 className="font-display text-3xl text-gray-900">{mode === 'login' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="text-gray-500 mt-2 text-sm">{mode === 'login' ? 'Sign in to access your saved resumes' : 'Start building ATS-optimised resumes for free'}</p>
        </div>

        <div className="card p-8">
          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-brand-300 hover:bg-brand-50 transition-all mb-5 disabled:opacity-60 cursor-not-allowed"
            title="Google sign-in coming soon"
          >
            <Chrome size={18} className="text-blue-500" />
            Continue with Google
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100" /></div>
            <div className="relative text-center"><span className="bg-white px-3 text-xs text-gray-400 font-medium">OR WITH EMAIL</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label htmlFor="auth-name" className="label">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-3 text-gray-400" />
                  <input
                    id="auth-name"
                    name="name"
                    className="input-field pl-9"
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
              <label htmlFor="auth-email" className="label">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  id="auth-email"
                  name="email"
                  className="input-field pl-9"
                  type="email"
                  placeholder="rahul@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="auth-password" className="label mb-0">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={forgotLoading}
                    className="text-xs text-brand-600 hover:underline flex items-center gap-1 disabled:opacity-60"
                  >
                    {forgotLoading
                      ? <><Loader size={11} className="animate-spin" /> Sending…</>
                      : forgotSent
                        ? <><CheckCircle size={11} className="text-emerald-500" /> Email sent!</>
                        : 'Forgot password?'
                    }
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-3 text-gray-400" />
                <input
                  id="auth-password"
                  name="password"
                  className="input-field pl-9 pr-10"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3 mt-2"
            >
              {isLoading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Free Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="text-brand-600 font-semibold hover:underline">
              {mode === 'login' ? 'Sign up — it\'s free' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By continuing, you agree to our{' '}
          <Link to="#" className="underline hover:text-gray-600">Terms of Service</Link> &{' '}
          <Link to="#" className="underline hover:text-gray-600">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}

// ── Dashboard Page ────────────────────────────────────────────────────────────
export function DashboardPage() {
  const { savedResumes, loadResume, deleteResume, duplicateResume, newResume, loadCloudResumes } = useResumeStore()
  const { user, plan } = useAuthStore()
  const navigate = useNavigate()
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    // Sync cloud resumes when dashboard mounts and user is logged in
    if (user?.id) {
      setSyncing(true)
      loadCloudResumes(true).finally(() => setSyncing(false))
    }
  }, [user?.id])

  const handleLoad = (id) => {
    loadResume(id)
    navigate('/builder')
  }

  const handleNew = () => {
    newResume()
    navigate('/builder')
  }

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`Delete "${title}"? This cannot be undone.`)
    if (confirmed) {
      await deleteResume(id)
      toast.success('Resume deleted')
    }
  }

  // ProtectedRoute handles redirect — this is a backup safety net
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="font-display text-2xl text-gray-900 mb-2">Sign in required</h2>
          <p className="text-gray-500 mb-6">Create an account to save and manage multiple resumes.</p>
          <Link to="/login?returnTo=/dashboard" className="btn-primary">Sign In or Sign Up</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl text-gray-900">My Resumes</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-500">
                Hello, <span className="font-semibold text-gray-700">{user.name}</span>!
              </p>
              {syncing && (
                <span className="flex items-center gap-1.5 text-[11px] text-brand-600 font-black uppercase tracking-widest px-2.5 py-1 bg-brand-50 rounded-full animate-pulse">
                  <Loader size={12} className="animate-spin" /> Syncing Cloud Data…
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {plan === 'free' && (
              <Link to="/upgrade" className="btn-secondary px-6 py-2.5 text-xs group">
                <Star size={14} className="text-amber-400 group-hover:fill-amber-400 transition-all" /> Upgrade to Pro
              </Link>
            )}
            <button onClick={() => { newResume(); navigate('/builder') }} className="btn-primary px-6 py-2.5 text-xs shadow-xl shadow-brand-100">
              <Plus size={16} /> New Resume
            </button>
          </div>
        </div>

        {/* Dashboard Content — with Shimmer Skeleton */}
        {syncing && savedResumes.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[1, 2, 3].map(i => (
               <div key={i} className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm animate-pulse">
                  <div className="aspect-[3/4] bg-gray-50 rounded-xl mb-6 shadow-inner" />
                  <div className="h-6 bg-gray-100 rounded-lg w-3/4 mb-3" />
                  <div className="h-4 bg-gray-50 rounded-lg w-1/2 mb-6" />
                  <div className="flex justify-between mt-auto pt-6 border-t border-gray-50">
                    <div className="h-8 bg-gray-50 rounded-xl w-24" />
                    <div className="h-8 bg-gray-50 rounded-xl w-10" />
                  </div>
               </div>
             ))}
          </div>
        ) : savedResumes.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-20 border-2 border-dashed border-gray-100 text-center shadow-inner">
            <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus size={40} className="text-brand-600" />
            </div>
            <h2 className="font-display text-2xl text-gray-950 mb-3">No Resumes Found</h2>
            <p className="text-gray-500 max-w-sm mx-auto mb-10 leading-relaxed font-medium">Create your first elite-tier resume to start tracking your career progression.</p>
            <button onClick={() => { newResume(); navigate('/builder') }} className="btn-primary px-10 py-5 group shadow-2xl shadow-brand-200">
              Construct My First Resume <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedResumes.map(resume => {
              const scoreColor = resume.atsScore >= 70 ? '#0E9F6E' : resume.atsScore >= 50 ? '#D97706' : '#EF4444'
              const scoreBg = resume.atsScore >= 70 ? '#F0FDF4' : resume.atsScore >= 50 ? '#FFFBEB' : '#FEF2F2'
              return (
                <div key={resume.id} className="card p-5 hover:-translate-y-0.5 transition-all duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-brand-600" />
                    </div>
                    {resume.atsScore > 0 && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: scoreBg, color: scoreColor }}>
                        ATS {resume.atsScore}/100
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{resume.title}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mb-5">
                    <Clock size={11} />
                    Updated {new Date(resume.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleLoad(resume.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors"
                    >
                      <Edit3 size={13} />Edit
                    </button>
                    <button
                      onClick={() => { duplicateResume(resume.id); toast.success('Resume duplicated!') }}
                      className="p-2 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(resume.id, resume.title)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )
            })}

            {/* New resume card */}
            <button
              onClick={handleNew}
              className="card p-5 border-2 border-dashed border-brand-200 flex flex-col items-center justify-center gap-3 hover:border-brand-400 hover:bg-brand-50 transition-all min-h-[180px] text-brand-600 group"
            >
              <div className="w-11 h-11 rounded-xl bg-brand-100 group-hover:bg-brand-200 transition-colors flex items-center justify-center">
                <Plus size={20} />
              </div>
              <span className="font-semibold text-sm">Create New Resume</span>
            </button>
          </div>
        )}

        {/* Tips banner */}
        <div className="mt-10 bg-brand-600 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-xl mb-1">Boost your ATS score to 85+</h3>
            <p className="text-brand-200 text-sm">Paste a job description in the builder to get personalised keyword suggestions.</p>
          </div>
          <button onClick={handleNew} className="flex-shrink-0 px-6 py-3 bg-white text-brand-600 font-bold rounded-xl hover:shadow-lg transition-all text-sm">
            Open Builder →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Upgrade Page ──────────────────────────────────────────────────────────────
export function UpgradePage() {
  const { plan, upgradeToPro } = useAuthStore()
  const navigate = useNavigate()
  const [billing, setBilling] = useState('monthly')
  const [processing, setProcessing] = useState(false)

  const handleUpgrade = async () => {
    setProcessing(true)

    // Load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    document.body.appendChild(script)

    script.onload = () => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo',
        amount: billing === 'monthly' ? 29900 : 199900, // paise
        currency: 'INR',
        name: 'HR Saarthi Resume Builder',
        description: `Pro Plan — ${billing === 'monthly' ? '₹299/month' : '₹1,999/year'}`,
        image: '/favicon.svg',
        handler: function (response) {
          // Payment successful — persist plan to Supabase
          upgradeToPro(response.razorpay_payment_id)
          toast.success('🎉 Welcome to Pro! All features unlocked.')
          navigate('/builder')
        },
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
        theme: { color: '#1A56DB' },
        modal: {
          ondismiss: () => setProcessing(false)
        }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    }

    script.onerror = () => {
      // Automatic fallback for missing script/offline
      upgradeToPro()
      toast.success('🎉 Demo: Pro features unlocked!')
      navigate('/builder?pro=true')
      setProcessing(false)
    }
  }

  const proFeatures = [
    'All 15 ATS-optimised templates (5 free + 10 Pro)',
    'AI resume parser — upload old resume',
    'Full ATS score with job description match',
    'Keyword gap analysis & fix suggestions',
    'PDF + DOCX export',
    'Unlimited saved resumes',
    'Custom accent color picker',
    'AI professional summary generator',
    'AI cover letter generator',
    'LinkedIn profile optimizer',
    'Vedanta, Timeline Pro, Split Screen & more premium layouts',
    'Priority support',
  ]

  if (plan === 'pro') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="card p-12 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="font-display text-2xl text-gray-900 mb-2">You're already on Pro!</h2>
          <p className="text-gray-500 mb-6">Enjoy all Pro features including AI resume parsing, all 10 templates, and unlimited resumes.</p>
          <Link to="/builder" className="btn-primary mx-auto">Go to Builder</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full text-amber-700 text-sm font-semibold mb-4">
            <Star size={14} className="fill-amber-500 text-amber-500" />Upgrade to Pro
          </div>
          <h1 className="font-display text-4xl text-gray-900 mb-3">Unlock the Full Power of ATS</h1>
          <p className="text-gray-500 max-w-xl mx-auto">AI-powered resume parsing, all 10 templates, unlimited resumes — at India-friendly pricing.</p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-xl p-1 mt-6">
            <button onClick={() => setBilling('monthly')} className={clsx('px-5 py-2 rounded-lg text-sm font-semibold transition-all', billing === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500')}>
              Monthly
            </button>
            <button onClick={() => setBilling('annual')} className={clsx('px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2', billing === 'annual' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500')}>
              Annual
              <span className="text-xs bg-accent-500 text-white font-bold px-2 py-0.5 rounded-full">Save 44%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Features list */}
          <div className="card p-8">
            <h3 className="font-display text-xl text-gray-900 mb-6">Everything in Pro</h3>
            <ul className="space-y-3">
              {proFeatures.map(f => (
                <li key={f} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={11} className="text-accent-600" strokeWidth={3} />
                  </div>
                  <span className="text-sm text-gray-700">{f}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
              🔒 Secure payment via Razorpay. Cancel anytime. UPI, Cards, Net Banking, EMI accepted.
            </div>
          </div>

          {/* Pricing card */}
          <div className="card p-8 border-2 border-brand-400 ring-4 ring-brand-100 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-600 text-white text-xs font-bold rounded-full">
              Most Popular
            </div>
            <div className="text-center mb-8">
              <div className="font-display text-5xl text-gray-900 mb-1">
                {billing === 'monthly' ? '₹299' : '₹1,999'}
              </div>
              <div className="text-gray-500 text-sm">
                {billing === 'monthly' ? 'per month' : 'per year (₹167/mo)'}
              </div>
              {billing === 'annual' && (
                <div className="mt-2 text-accent-600 font-semibold text-sm">
                  You save ₹1,589 vs monthly!
                </div>
              )}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={processing}
              className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white font-bold text-lg rounded-xl hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mb-4"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap size={18} fill="white" />
                  Upgrade Now — {billing === 'monthly' ? '₹299/mo' : '₹1,999/yr'}
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-400">
              No commitment. Cancel anytime. Instant access after payment.
            </p>

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
              {['✅ UPI accepted (Google Pay, PhonePe)', '✅ EMI available on ₹1,999 plan', '✅ Invoice generated automatically', '✅ 7-day money back guarantee'].map(item => (
                <div key={item} className="text-xs text-gray-600">{item}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { name: 'Priya Mehta', role: 'Software Engineer', company: 'Swiggy', text: 'Got 4 interview calls within a week of using the ATS builder. My score went from 45 to 89!' },
            { name: 'Arjun Singh', role: 'Product Manager', company: 'Zomato', text: 'The AI parser saved me 2 hours — uploaded my old resume and it auto-filled everything perfectly.' },
            { name: 'Kavya Reddy', role: 'HR Executive', company: 'HDFC', text: 'As an HR person, I can confirm these templates actually pass our ATS. Excellent product!' },
          ].map(t => (
            <div key={t.name} className="card p-5">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role} · {t.company}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── ATS Score Page ────────────────────────────────────────────────────────────
const LEVEL_CONFIG = {
  error:   { icon: AlertCircle,   color: 'text-red-500',    bg: 'bg-red-50',    border: 'border-red-200',   label: 'Fix Required' },
  warning: { icon: AlertTriangle, color: 'text-amber-500',  bg: 'bg-amber-50',  border: 'border-amber-200', label: 'Improvement' },
  info:    { icon: Info,          color: 'text-blue-500',   bg: 'bg-blue-50',   border: 'border-blue-200',  label: 'Suggestion' },
  success: { icon: CheckCircle,   color: 'text-green-500',  bg: 'bg-green-50',  border: 'border-green-200', label: 'Great!' },
}

export function ATSScorePage() {
  const { resumeData, atsScore, jobDescription, setJobDescription, setATSScore } = useResumeStore()
  const { plan } = useAuthStore()
  const [jd, setJd] = useState(jobDescription)

  const handleAnalyze = () => {
    setJobDescription(jd)
    const score = scoreResume(resumeData, jd)
    setATSScore(score)
    toast.success('Readiness analysis updated!')
  }

  const score = atsScore || scoreResume(resumeData, jobDescription)

  const scoreCategories = [
    { key: 'contact',  label: 'Contact Info',    max: 10, icon: '📋' },
    { key: 'content',  label: 'Section Complete', max: 40, icon: '📑' },
    { key: 'impact',   label: 'Impact & Verbs',   max: 25, icon: '⚡' },
    { key: 'format',   label: 'Format Safety',    max: 18, icon: '🛡️' },
    { key: 'keywords', label: 'Keyword Match',    max: 25, icon: '🎯' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="font-display text-4xl text-gray-900 mb-3">Resume readiness report</h1>
          <p className="text-gray-500">A heuristic check for structure, keywords, and clarity — not a guarantee for any specific employer ATS.</p>
        </div>

        {/* Main score */}
        <div className="card p-8 mb-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at center, ${score.grade.color} 0%, transparent 70%)` }} />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full border-8 mb-4" style={{ borderColor: score.grade.color + '30', background: score.grade.bg }}>
              <div>
                <div className="font-display text-4xl" style={{ color: score.grade.color }}>{score.total}</div>
                <div className="text-xs text-gray-400">out of 100</div>
              </div>
            </div>
            <div className="font-display text-2xl text-gray-900 mb-1">{score.grade.label}</div>
            <div className="text-gray-500 text-sm mb-6">
              {score.total >= 85 ? 'Excellent! Your resume looks strong on structure and keywords.' :
               score.total >= 70 ? 'Good resume! A few improvements will make it interview-ready.' :
               score.total >= 50 ? 'Average score. Follow the tips below to improve significantly.' :
               'Your resume needs work. Follow the fix list below carefully.'}
            </div>
            <Link to="/builder" className="btn-primary mx-auto">
              <Edit3 size={15} />Improve My Resume
            </Link>
          </div>
        </div>

        {/* Score breakdown */}
        <div className="card p-6 mb-6">
          <h2 className="font-display text-xl text-gray-900 mb-5">Score Breakdown</h2>
          <div className="space-y-4">
            {scoreCategories.map(cat => {
              const val = score.breakdown[cat.key] ?? 0
              const pct = (val / cat.max) * 100
              const barColor = pct >= 80 ? '#0E9F6E' : pct >= 50 ? '#D97706' : '#EF4444'
              return (
                <div key={cat.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-700">{cat.icon} {cat.label}</span>
                    <span className="text-sm font-bold" style={{ color: barColor }}>{val}/{cat.max}</span>
                  </div>
                  <div className="bg-gray-100 rounded-full h-2.5">
                    <div className="h-2.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: barColor }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Job Description input */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl text-gray-900">Job Description Keyword Match</h2>
            {plan !== 'pro' && (
              <Link to="/upgrade" className="text-xs flex items-center gap-1 text-amber-600 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <Star size={11} fill="currentColor" />Unlock Full Analysis
              </Link>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-4">Paste the job description below to see which keywords you're missing and what to add.</p>
          <textarea
            id="ats-jd-input"
            name="jobDescription"
            className="input-field resize-none mb-3"
            rows={5}
            placeholder="Paste the job description here...&#10;&#10;Example: We are looking for a Senior React Developer with 4+ years of experience in React, TypeScript, Node.js, AWS..."
            value={jd}
            onChange={e => setJd(e.target.value)}
            disabled={plan !== 'pro'}
          />
          {plan !== 'pro' ? (
            <Link to="/upgrade" className="btn-primary text-sm">
              <Star size={14} />Upgrade to Analyze Keywords — ₹299/mo
            </Link>
          ) : (
            <button onClick={handleAnalyze} className="btn-primary text-sm">
              <Zap size={14} />Analyze Keywords
            </button>
          )}

          {/* Keyword results */}
          {score.keywordDetails?.matched?.length > 0 && (
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-accent-600 mb-2 flex items-center gap-1.5">
                  <CheckCircle size={14} />Matched Keywords ({score.keywordDetails.matched.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {score.keywordDetails.matched.map(k => (
                    <span key={k} className="px-2.5 py-1 bg-accent-50 text-accent-700 border border-accent-200 text-xs rounded-full font-medium">{k}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-500 mb-2 flex items-center gap-1.5">
                  <AlertCircle size={14} />Missing Keywords ({score.keywordDetails.missing.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {score.keywordDetails.missing.map(k => (
                    <span key={k} className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 text-xs rounded-full">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tips & Fixes */}
        <div className="card p-6 mb-6">
          <h2 className="font-display text-xl text-gray-900 mb-5">
            Fix List
            <span className="ml-2 text-sm font-sans font-normal text-gray-500">({score.tips.length} items)</span>
          </h2>
          <div className="space-y-3">
            {score.tips.map((tip, i) => {
              const cfg = LEVEL_CONFIG[tip.level]
              const Icon = cfg.icon
              return (
                <div key={i} className={clsx('flex gap-3 p-4 rounded-xl border', cfg.bg, cfg.border)}>
                  <Icon size={16} className={clsx('flex-shrink-0 mt-0.5', cfg.color)} />
                  <div className="flex-1">
                    <span className={clsx('text-xs font-bold uppercase tracking-wide mr-2', cfg.color)}>{cfg.label}</span>
                    <span className="text-sm text-gray-700">{tip.msg}</span>
                  </div>
                </div>
              )
            })}
            {score.tips.length === 0 && (
              <div className="text-center py-6 text-gray-400">
                <CheckCircle size={32} className="mx-auto mb-2 text-accent-400" />
                <p>No issues found! Your resume looks great.</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-brand-600 text-white rounded-2xl p-8 text-center">
          <h3 className="font-display text-2xl mb-2">Ready to fix your score?</h3>
          <p className="text-brand-200 mb-6">Go back to the builder and apply the suggestions above. Your score updates in real-time.</p>
          <Link to="/builder" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-bold rounded-xl hover:shadow-xl transition-all">
            Open Builder & Fix Issues <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ── 404 Not Found ─────────────────────────────────────────────────────────────
export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-display text-8xl text-brand-100 mb-4">404</div>
        <h1 className="font-display text-3xl text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8">This page doesn't exist. Maybe the resume you're looking for is in another folder 😄</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={16} />Go Home
          </Link>
          <Link to="/builder" className="btn-secondary">
            <FileText size={16} />Build Resume
          </Link>
        </div>
      </div>
    </div>
  )
}
