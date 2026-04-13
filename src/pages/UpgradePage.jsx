/**
 * UpgradePage — Premium Pro upgrade with Razorpay payment
 * ─────────────────────────────────────────────────────────────
 * Flow:
 *  1. Guest → AuthModal (sign in first)
 *  2. Logged-in free user → plan selection → Razorpay checkout
 *  3. Monthly: ₹299/mo subscription via Razorpay Subscriptions API
 *  4. Annual:  ₹1,999/yr subscription (save 44%)
 *  5. Already Pro → show Pro dashboard link
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2, Zap, Star, Download, Sparkles, Palette,
  FileText, BarChart3, Globe, Lock, ArrowRight, Crown,
  Infinity as InfinityIcon, Shield, Calendar, TrendingDown,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useResumeStore } from '../store/resumeStore'
import { supabase } from '../services/supabase'
import AuthModal from '../components/AuthModal'
import toast from 'react-hot-toast'
import { useEntitlements } from '../utils/entitlements'

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

// ── Subscription Plans ─────────────────────────────────────────
const PLANS = [
  {
    id                  : 'monthly',
    label               : 'Monthly',
    price               : 149,
    period              : '/month',
    priceDisplay        : '₹149',
    originalPriceDisplay: '₹299',
    razorpayPlanId      : import.meta.env.VITE_RAZORPAY_PLAN_MONTHLY || '',  // Set in .env
    badge               : '50% OFF',
    popular             : false,
    description         : 'Perfect to get started',
  },
  {
    id                  : 'annual',
    label               : 'Annual',
    price               : 999,
    period              : '/year',
    priceDisplay        : '₹999',
    originalPriceDisplay: '₹1,999',
    razorpayPlanId      : import.meta.env.VITE_RAZORPAY_PLAN_ANNUAL || '',   // Set in .env
    badge               : 'Save 44%',
    popular             : true,
    description         : '₹83/month · Best value',
  },
]

// ── Plan features ─────────────────────────────────────────────
const FREE_FEATURES = [
  { icon: FileText,  text: '4 Free templates' },
  { icon: Download,  text: 'PDF download (with watermark)', dim: true },
  { icon: BarChart3, text: 'Basic ATS score' },
  { icon: Globe,     text: '1 resume saved', dim: true },
]

const PRO_FEATURES = [
  { icon: Crown,        text: '15+ Premium templates', highlight: true },
  { icon: Download,     text: 'Unlimited PDF downloads — no watermark', highlight: true },
  { icon: Sparkles,     text: 'AI Cover Letter Generator', highlight: true },
  { icon: Sparkles,     text: 'AI bullet point enhancer (GPT-4)' },
  { icon: Palette,      text: 'Custom accent colors' },
  { icon: BarChart3,    text: 'Advanced ATS Score + job JD matching' },
  { icon: InfinityIcon, text: 'Save unlimited resumes to cloud' },
  { icon: Globe,        text: 'Interview Prep AI + Job Tailoring' },
  { icon: Shield,       text: 'Priority support' },
]

// ── Load Razorpay SDK ──────────────────────────────────────────
function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload  = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function UpgradePage() {
  const [paying, setPaying]           = useState(false)
  const [showAuth, setShowAuth]       = useState(false)
  const [paySuccess, setPaySuccess]   = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]) // Default to Annual

  const { user, plan, upgradeToPro } = useAuthStore()
  const { resumeData }               = useResumeStore()
  const { isPro, launchOfferActive } = useEntitlements()

  // Prefetch Razorpay on mount
  useEffect(() => { loadRazorpay() }, [])

  // Already Pro
  if (isPro) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-200">
            <Crown size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">{launchOfferActive && plan !== 'pro' ? "30-Day Pro Trial Active! 🎉" : "You're a Pro! 🎉"}</h1>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            {launchOfferActive && plan !== 'pro'
              ? 'All Pro features are unlocked during the launch trial. Build and export without restrictions.'
              : 'All Pro features are unlocked. Go build something amazing.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/builder" className="px-6 py-3 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors flex items-center gap-2">
              <FileText size={16} /> Open Builder
            </Link>
            <Link to="/dashboard" className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-2xl hover:border-gray-400 transition-colors">
              Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (paySuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-16">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-3">Welcome to Pro! 🚀</h1>
          <p className="text-gray-500 mb-8">Your subscription is active. All Pro features are now unlocked!</p>
          <Link to="/builder" className="px-8 py-4 bg-gradient-to-r from-brand-600 to-violet-600 text-white font-black rounded-2xl hover:shadow-xl transition-all uppercase tracking-wider text-sm">
            Start Building →
          </Link>
        </motion.div>
      </div>
    )
  }

  const handleUpgrade = async () => {
    if (!user) {
      setShowAuth(true)
      return
    }

    const loaded = await loadRazorpay()
    if (!loaded) {
      toast.error('Payment gateway failed to load. Check your internet connection.')
      return
    }

    setPaying(true)

    try {
      // If a Razorpay Plan ID is configured, use Subscriptions API (recurring)
      if (selectedPlan.razorpayPlanId) {
        await handleSubscription()
      } else {
        // Fallback: one-time order (legacy ₹499 lifetime)
        await handleOneTimePayment()
      }
    } catch (err) {
      toast.error('Payment initialization failed. Please try again.')
      setPaying(false)
    }
  }

  // ── Subscription Mode (Monthly/Annual) ─────────────────────────
  const handleSubscription = async () => {
    try {
      // Call Edge Function to create subscription server-side
      const { data: { session } } = await supabase.auth.getSession()
      const jwt = session?.access_token

      const resp = await fetch(`${SUPABASE_URL}/functions/v1/create-subscription`, {
        method : 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${jwt || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          plan_id : selectedPlan.razorpayPlanId,
          user_id : user.id,
          user_email: user.email,
          user_name : user.name || resumeData?.personal?.fullName || '',
        }),
      })

      const result = await resp.json().catch(() => null)
      if (!resp.ok || !result?.subscription_id) {
        throw new Error(result?.error || 'Subscription creation failed')
      }

      const options = {
        key            : RAZORPAY_KEY,
        subscription_id: result.subscription_id,
        name           : 'HR Saarthi',
        description    : `Resume Builder Pro — ${selectedPlan.label} (${selectedPlan.priceDisplay}${selectedPlan.period})`,
        image          : `${window.location.origin}/logo.png`,
        prefill        : {
          name : user.name  || resumeData?.personal?.fullName || '',
          email: user.email || '',
        },
        notes: { user_id: user.id, plan: selectedPlan.id },
        theme: { color: '#1A56DB' },
        handler: async (response) => {
          await upgradeToPro(response.razorpay_payment_id)
          setPaySuccess(true)
          toast.success('🎉 Pro subscription active! Enjoy all premium features.')
          setPaying(false)
        },
        modal: { ondismiss: () => setPaying(false) },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`)
        setPaying(false)
      })
      rzp.open()
    } catch (err) {
      console.error('[UpgradePage] Subscription error:', err)
      // Fallback to one-time payment if subscription fails
      toast.error('Subscription setup failed. Falling back to one-time payment.')
      await handleOneTimePayment()
    }
  }

  // ── One-Time Payment (Fallback / Legacy) ───────────────────────
  const handleOneTimePayment = async () => {
    const amount = selectedPlan.id === 'annual' ? 199900 : 29900  // paise
    const options = {
      key        : RAZORPAY_KEY,
      amount,
      currency   : 'INR',
      name       : 'HireWithPrachi',
      description: `Resume Builder Pro — ${selectedPlan.label} Access`,
      image      : `${window.location.origin}/logo.png`,
      prefill    : {
        name : user.name  || resumeData?.personal?.fullName || '',
        email: user.email || '',
      },
      notes: { user_id: user.id, plan: selectedPlan.id },
      theme: { color: '#1A56DB' },
      handler: async (response) => {
        const paymentId = response.razorpay_payment_id
        try {
          await supabase.from('payments').insert({
            user_id             : user.id,
            razorpay_payment_id : paymentId,
            razorpay_order_id   : response.razorpay_order_id || null,
            status              : 'paid',
            amount,
            currency            : 'INR',
            plan                : `pro-${selectedPlan.id}`,
          })
        } catch { /* non-critical */ }

        await upgradeToPro(paymentId)
        setPaySuccess(true)
        toast.success('🎉 Pro unlocked! Enjoy all premium features.')
        setPaying(false)
      },
      modal: { ondismiss: () => setPaying(false) },
    }

    const rzp = new window.Razorpay(options)
    rzp.on('payment.failed', (response) => {
      toast.error(`Payment failed: ${response.error.description}`)
      setPaying(false)
    })
    rzp.open()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — Obsidian Premium */}
      <div className="relative bg-gray-950 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-600 rounded-full blur-[160px] opacity-15" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-600 rounded-full blur-[120px] opacity-10" />
        </div>

        <div className="relative z-10 text-center pt-20 pb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-dark rounded-full text-xs font-black text-brand-400 uppercase tracking-widest mb-8">
              <Zap size={11} fill="currentColor" />
              India's Most Affordable Pro Resume Builder
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-5 leading-[1.08]">
              Build resumes that get
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-violet-400">
                you hired.
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 font-medium leading-relaxed">
              Upgrade to Pro and unlock every template, AI tools, cover letters, and unlimited downloads.
            </p>
            {/* Trust stats row */}
            <div className="flex flex-wrap justify-center gap-6 mb-4">
              {[
                { value: '50,000+', label: 'Resumes Created' },
                { value: '4.9/5', label: 'Rating' },
                { value: '₹167/mo', label: 'Annual Price' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-black text-white">{stat.value}</div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Plan Toggle */}
      <div className="flex justify-center mb-8 px-4 pt-10">
        <div className="flex bg-gray-100 rounded-2xl p-1.5 gap-2">
          {PLANS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlan(p)}
              className={`relative px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all ${
                selectedPlan.id === p.id
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}
              {p.badge && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                  {p.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing cards */}
      <div className="max-w-4xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-6">

        {/* Free card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border-2 border-gray-200 rounded-3xl p-8"
        >
          <div className="mb-6">
            <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Free</div>
            <div className="text-4xl font-black text-gray-900">₹0</div>
            <div className="text-sm text-gray-400 mt-1">Forever free</div>
          </div>
          <ul className="space-y-3 mb-8">
            {FREE_FEATURES.map((f, i) => (
              <li key={i} className={`flex items-center gap-3 text-sm ${f.dim ? 'opacity-50' : 'text-gray-700'}`}>
                <f.icon size={15} className="text-gray-400 flex-shrink-0" />
                {f.text}
              </li>
            ))}
          </ul>
          <Link
            to="/builder"
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:border-gray-400 text-sm transition-colors"
          >
            Continue Free
          </Link>
        </motion.div>

        {/* Pro card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="relative bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl p-8 text-white overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-brand-500/20 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-violet-500/20 rounded-full blur-2xl" />

          <div className="relative">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4">
              <Star size={9} fill="currentColor" />
              Most Popular
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPlan.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="mb-6"
              >
                <div className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">
                  Pro — {selectedPlan.label}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="line-through decoration-red-500/80 decoration-2 text-gray-500 font-bold text-lg">
                      {selectedPlan.originalPriceDisplay}
                    </span>
                    <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full font-black tracking-widest uppercase">
                      Limited Time 50% Off
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <div className="text-4xl md:text-5xl font-black text-white">{selectedPlan.priceDisplay}</div>
                    <div className="text-sm text-gray-400 font-bold">{selectedPlan.period}</div>
                  </div>
                </div>
                <div className="text-xs text-emerald-400 font-bold mt-1 uppercase tracking-wider">
                  {selectedPlan.description}
                </div>
                {selectedPlan.id === 'annual' && (
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingDown size={12} className="text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-bold">
                      Save ₹{(299 * 12) - 1999}/year vs monthly
                    </span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <ul className="space-y-3 mb-8">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 size={14} className={f.highlight ? 'text-emerald-400' : 'text-gray-500'} />
                  <span className={f.highlight ? 'text-white font-semibold' : 'text-gray-400'}>{f.text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={paying}
              className="w-full py-4 bg-gradient-to-r from-brand-500 to-violet-600 text-white font-black rounded-2xl hover:shadow-xl hover:shadow-brand-500/20 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {paying
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing…</>
                : <><Zap size={14} fill="currentColor" /> Upgrade to Pro — {selectedPlan.priceDisplay}{selectedPlan.period}</>
              }
            </button>

            {selectedPlan.razorpayPlanId && (
              <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1.5">
                <Calendar size={11} />
                Recurring {selectedPlan.label.toLowerCase()} · Cancel anytime
              </p>
            )}

            <p className="text-center text-xs text-gray-500 mt-2">
              🔒 Secure payment via Razorpay · 7-day money-back guarantee
            </p>

            {/* Pricing comparison */}
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center">
                Compare vs competitors
              </p>
              <div className="mt-2 space-y-1 text-[11px]">
                <div className="flex justify-between text-gray-500">
                  <span>Naukri Pro</span><span className="text-red-400">₹667/month</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Resume.io</span><span className="text-red-400">₹1,250/month</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-400">
                  <span>HR Saarthi</span>
                  <span>{selectedPlan.id === 'annual' ? '₹167/month' : '₹299/month'}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto px-4 pb-24">
        <h2 className="text-center text-xl font-black text-gray-900 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            { q: 'Can I cancel anytime?', a: 'Yes! Cancel your subscription anytime from your account dashboard. No cancellation fees.' },
            { q: 'What happens to my resumes if I cancel?', a: 'You keep read-only access. Your resumes are safe. Upgrading again restores full access immediately.' },
            { q: 'Can I get a refund?', a: 'Yes. If you\'re not satisfied, contact us within 7 days for a full refund, no questions asked.' },
            { q: 'What payment methods are accepted?', a: 'UPI, credit/debit cards, net banking, and all major wallets via Razorpay.' },
            { q: 'Is my data safe?', a: 'Your resume data is stored securely in Supabase with row-level security. We never share your data.' },
          ].map(({ q, a }, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5">
              <h3 className="font-bold text-gray-900 text-sm mb-2">{q}</h3>
              <p className="text-gray-500 text-sm">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {showAuth && (
        <AuthModal
          trigger="pro"
          onClose={() => setShowAuth(false)}
          onSuccess={() => {
            setShowAuth(false)
            handleUpgrade()
          }}
        />
      )}
    </div>
  )
}
