import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, Zap, FileText, Upload, Star, ArrowRight, Shield,
  TrendingUp, Award, Sparkles, Binary, Mail, Phone, MapPin,
  Linkedin, Globe, Brain, Target, Cpu, Users, BarChart3,
  ChevronDown, Quote
} from 'lucide-react'
import { TEMPLATES } from '../templates/registry'
import ATSClassic from '../templates/ATSClassic'

const HERO_SAMPLE_DATA = {
  personal: {
    fullName: 'Arjun Sharma',
    jobTitle: 'Senior Frontend Engineer',
    email   : 'arjun.s@google.com',
    phone   : '+91 98765 43210',
    location: 'Bangalore, KA',
    linkedin: 'linkedin.com/in/arjunsharma',
    website : 'arjunsharma.dev',
    summary : 'Senior Engineering Lead with 8+ years of expertise in building high-performance React architectures at scale. Proven track record of reducing bundle sizes by 40% and leading teams to deliver sub-second LCP for consumer-facing apps at Google and Zomato.',
  },
  experience: [
    { id: '1', title: 'Senior Frontend Engineer', company: 'Google', location: 'Bangalore', startDate: '2021', endDate: 'Present', current: true, bullets: ['Leading the redesign of the Google Ads Dashboard core components.', 'Reduced initial load time by 35% using advanced code-splitting.'] },
    { id: '2', title: 'Mid-Level Developer', company: 'Zomato', location: 'Gurugram', startDate: '2018', endDate: '2021', current: false, bullets: ['Architected the micro-frontend system for Zomato Pro features.', 'Mentored 10+ junior developers and standardized React patterns.'] },
  ],
  education: [
    { id: '3', school: 'IIT Delhi', degree: 'B.Tech in Computer Science', startDate: '2014', endDate: '2018', location: 'Delhi', grade: '9.2 CGPA' },
  ],
  skills: [
    { id: '4', category: 'Frontend', items: 'React, Next.js, TypeScript, Tailwind, Three.js' },
    { id: '5', category: 'Architecture', items: 'Microfrontends, Webpack, Testing Library, CI/CD' },
  ],
  certifications: [{ id: '6', name: 'Google Cloud Certified Architect', issuer: 'Google', date: '2022' }],
  projects: [], languages: [], hobbies: [],
}

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <LaunchBanner />
      <Hero />
      <TrustBar />
      <Features />
      <Process />
      <LaunchOfferPromo />
      <Testimonials />
      <TemplateShowcase />
      <ATSSection />
      <Pricing />
      <FAQ />
      <CTA />
      <MobileStickyBar />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// LAUNCH BANNER & OFFER
// ═══════════════════════════════════════════════════════════════
function LaunchBanner() {
  return (
    <div className="relative overflow-hidden w-full bg-gradient-to-r from-[#5B4BF5] via-[#7C3AED] to-[#D4A843] py-2.5 z-50">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3 relative z-10">
        <Sparkles size={14} className="text-white animate-pulse" />
        <p className="text-white text-xs sm:text-sm font-black tracking-wide">
          <span className="text-yellow-200">GRAND LAUNCH OFFER:</span> Get 30 Days of Elite Pro completely FREE! No Credit Card Required.
        </p>
        <Link to="/upgrade" className="hidden sm:flex px-3 py-1 bg-white text-[#5B4BF5] rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">
          Claim Now
        </Link>
      </div>
    </div>
  )
}

function LaunchOfferPromo() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0A0A0F]">
      {/* Premium Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D4A843 0%, #5B4BF5 50%, transparent 100%)' }} />

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          className="rounded-3xl p-[1px] overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(212,168,67,0.5), rgba(91,75,245,0.5), transparent)' }}>
          <div className="bg-[#13152A]/90 backdrop-blur-3xl rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            {/* Decor */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4A843] rounded-full blur-[80px] opacity-20" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#5B4BF5] rounded-full blur-[80px] opacity-20" />

            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#D4A843]/30 bg-[#D4A843]/10">
              <Award size={16} className="text-[#D4A843]" />
              <span className="text-xs font-black uppercase tracking-widest text-[#D4A843]">Limited Time Launch Special</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
              30 Days of Elite Pro. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4A843] to-[#FDE047]">
                Completely Free.
              </span>
            </h2>

            <p className="max-w-2xl mx-auto text-lg text-white/60 mb-10 leading-relaxed font-medium">
              We are celebrating the launch of HR Saarthi. Build your award-winning resume, pass the ATS, and generate unlimited AI cover letters without paying a single rupee for your first month.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left max-w-4xl mx-auto">
              {[
                { icon: Star, title: 'All Premium Templates', desc: 'Unlock 17+ industry-approved designs.' },
                { icon: Zap, title: 'Unlimited AI Generation', desc: 'Cover letters and bullet text fixing.' },
                { icon: Shield, title: 'Zero Risk', desc: 'No credit card required to start.' },
              ].map((f, i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10">
                  <f.icon size={20} className="text-[#0EC8A0] mb-3" />
                  <h3 className="text-white font-bold mb-1">{f.title}</h3>
                  <p className="text-white/50 text-sm">{f.desc}</p>
                </div>
              ))}
            </div>

            <Link to="/login" className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#D4A843] to-[#B38D35] hover:from-[#E5BC54] hover:to-[#C49E46] text-[#0A0A0F] rounded-full text-sm font-black uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_40px_rgba(212,168,67,0.4)]">
              Claim Your Free Month <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════
function Hero() {
  const CHIPS = [
    { label: 'ATS Score', value: '92/100', color: '#10B981', bg: '#D1FAE5', top: '12%', left: '-18%', delay: 0 },
    { label: 'Keywords Matched', value: 'High ✓', color: '#6366F1', bg: '#EEF2FF', top: '48%', left: '-22%', delay: 0.3 },
    { label: 'AI Suggestion', value: 'Applied ⚡', color: '#F59E0B', bg: '#FEF3C7', top: '76%', left: '-16%', delay: 0.6 },
  ]

  return (
    <section className="relative pt-16 pb-0 overflow-hidden bg-[#F8FAFB]">
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.4 }}
      />
      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[10%] right-[5%] w-[55%] h-[60%] bg-indigo-100/60 rounded-full blur-[120px]" />
        <div className="absolute top-[30%] -left-[5%] w-[40%] h-[50%] bg-emerald-50/80 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 min-h-[calc(100vh-80px)] py-16">

          {/* LEFT */}
          <div className="flex-1 max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-brand-100 shadow-sm rounded-full text-brand-700 text-[11px] font-black uppercase tracking-widest mb-6">
              <Sparkles size={11} className="text-brand-500" />
              India's #1 AI Resume Builder · GPT-4 Powered
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
              className="font-display text-5xl md:text-6xl lg:text-7xl text-gray-950 mb-6 leading-[1.05] tracking-tighter">
              This resume builder<br />
              gets you{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-600">your dream job.</span>
                <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 200 6" fill="none">
                  <path d="M0 3 Q50 0 100 3 Q150 6 200 3" stroke="url(#ug)" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                  <defs><linearGradient id="ug" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#6366F1"/><stop offset="100%" stopColor="#14B8A6"/></linearGradient></defs>
                </svg>
              </span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="text-gray-500 text-lg max-w-xl mb-8 font-medium leading-relaxed">
              AI-powered precision for Indian professionals aiming at top-tier roles. Beat ATS, impress recruiters, and land <strong className="text-gray-800">4.8× more interviews</strong>.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}
              className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link to="/builder" className="btn-primary px-8 py-4 text-base group shadow-lg shadow-brand-200/60">
                Build My Resume Free
                <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <Link to="/templates" className="btn-secondary px-8 py-4 text-base hover:bg-white">
                See All Templates
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-5 mb-8">
              <div className="flex items-center gap-2">
                <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-amber-400 fill-amber-400" />)}</div>
                <span className="text-sm font-bold text-gray-700">4.9/5</span>
                <span className="text-xs text-gray-400">· 12,400+ reviews</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                <TrendingUp size={14} className="text-emerald-500" />
                <span>4.8× more interview callbacks</span>
              </div>
              <div className="h-4 w-px bg-gray-200" />
              <div className="flex items-center gap-1.5 text-sm text-gray-600 font-medium">
                <Shield size={14} className="text-brand-500" />
                <span>100% ATS-safe templates</span>
              </div>
            </motion.div>

            {/* Company trust */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em] mb-3">Alumni hired at</p>
              <div className="flex flex-wrap items-center gap-5 opacity-50">
                {['Google', 'Amazon', 'Microsoft', 'Flipkart', 'Zomato', 'JPMC'].map(name => (
                  <span key={name} className="text-sm font-black text-gray-700 tracking-tight">{name}</span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Live Preview */}
          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 max-w-lg w-full relative">
            {CHIPS.map((chip) => (
              <motion.div key={chip.label}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + chip.delay, type: 'spring', stiffness: 120 }}
                className="absolute z-20 hidden lg:flex items-center gap-2 px-3 py-2 bg-white rounded-xl shadow-lg border border-white/60"
                style={{ top: chip.top, left: chip.left, minWidth: 160 }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: chip.color }} />
                <div>
                  <div className="text-[9px] font-black uppercase tracking-wider text-gray-400">{chip.label}</div>
                  <div className="text-xs font-black" style={{ color: chip.color }}>{chip.value}</div>
                </div>
              </motion.div>
            ))}

            <div className="relative">
              <div className="absolute inset-0 bg-white shadow-xl translate-x-3 translate-y-3 rounded-2xl opacity-30" />
              <div className="absolute inset-0 bg-white shadow-xl translate-x-1.5 translate-y-1.5 rounded-2xl opacity-50" />
              <div className="relative bg-white rounded-2xl shadow-2xl ring-1 ring-black/5 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-300" />
                    <div className="w-3 h-3 rounded-full bg-amber-300" />
                    <div className="w-3 h-3 rounded-full bg-emerald-300" />
                  </div>
                  <div className="flex-1 mx-3 px-3 py-1 bg-white border border-gray-200 rounded-full text-[9px] font-mono text-gray-400 flex items-center gap-1.5">
                    <Shield size={8} /> hrsaarthi.com/builder
                  </div>
                </div>
                <div style={{ overflow: 'hidden', height: `${1123 * 0.45}px` }}>
                  <div style={{ width: '794px', height: '1123px', transform: 'scale(0.45)', transformOrigin: 'top left', pointerEvents: 'none' }}>
                    <ATSClassic data={HERO_SAMPLE_DATA} settings={{ accentColor: '#4F46E5', templateId: 'ats-classic' }} />
                  </div>
                </div>
              </div>
              <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.1, type: 'spring' }}
                className="absolute -bottom-5 -right-5 bg-gray-950 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Zap size={14} className="text-emerald-400 fill-emerald-400" />
                </div>
                <div>
                  <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Today</div>
                  <div className="text-sm font-black text-white">39,597 resumes built</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// TRUST BAR — Dark stats ribbon
// ═══════════════════════════════════════════════════════════════
function TrustBar() {
  const stats = [
    { value: '50,000+', label: 'Resumes Created', color: '#6366F1' },
    { value: '4.9/5',   label: 'Average Rating',   color: '#F59E0B' },
    { value: '4.8×',    label: 'More Callbacks',   color: '#10B981' },
    { value: '15+',     label: 'Elite Templates',  color: '#EC4899' },
    { value: '100%',    label: 'ATS Compatible',   color: '#6366F1' },
    { value: '₹299/mo', label: 'Pro Access',       color: '#14B8A6' },
  ]
  return (
    <div className="bg-gray-950 border-y border-white/5 py-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-px bg-white/5 rounded-2xl overflow-hidden">
          {stats.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="bg-gray-950 px-4 py-5 text-center">
              <div className="text-xl md:text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// FEATURES — Bento Grid
// ═══════════════════════════════════════════════════════════════
function Features() {
  const cards = [
    {
      title: 'Precision AI Parser',
      desc: 'Upload any PDF/DOCX — GPT-4o extracts 100% of your career data in seconds with surgical field accuracy.',
      icon: <Brain className="text-brand-600" size={26} />,
      bg: 'from-brand-50 to-indigo-50',
      metric: '99.8%', metricLabel: 'Parse Accuracy',
      wide: false,
    },
    {
      title: 'ATS Core Alignment',
      desc: 'Battle-tested templates that bypass Workday, Greenhouse, and Taleo filters effortlessly.',
      icon: <Shield className="text-emerald-600" size={26} />,
      bg: 'from-emerald-50 to-teal-50',
      metric: '100%', metricLabel: 'ATS Pass Rate',
      wide: false,
    },
    {
      title: 'Quantified Impact Bullets',
      desc: 'Our AI rewrites your experience bullets into data-driven achievement statements that recruiters remember. Every sentence earns its place.',
      icon: <TrendingUp className="text-amber-600" size={26} />,
      bg: 'from-amber-50 to-orange-50',
      metric: '4.8×', metricLabel: 'More Interviews',
      wide: true,
    },
    {
      title: 'AI Cover Letter Architect',
      desc: 'Generate a tailored, tone-perfect cover letter for any job in 30 seconds.',
      icon: <FileText className="text-rose-600" size={26} />,
      bg: 'from-rose-50 to-pink-50',
      metric: '30s', metricLabel: 'Generation Time',
      wide: false,
    },
    {
      title: 'Interview Coach',
      desc: 'Get 12 role-specific questions across Technical, Behavioral & Salary tracks.',
      icon: <Target className="text-violet-600" size={26} />,
      bg: 'from-violet-50 to-purple-50',
      metric: '12', metricLabel: 'Custom Questions',
      wide: false,
    },
  ]

  return (
    <section className="py-28 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 rounded-full text-brand-700 text-[10px] font-black uppercase tracking-widest mb-4">
            <Cpu size={11} /> Platform Capabilities
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-title mb-5">Engineered for Extreme Impact</motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
            Five precision tools, one mission: land your dream role at the world's top companies.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-fr">
          {/* Row 1: 2 normal + 1 wide spanning 2 cols (wide on lg) */}
          {cards.slice(0, 2).map((c, i) => (
            <FeatureCard key={c.title} card={c} delay={i * 0.08} />
          ))}
          <FeatureCard card={cards[2]} delay={0.16} className="lg:col-span-1" wide />
          {cards.slice(3).map((c, i) => (
            <FeatureCard key={c.title} card={c} delay={(i + 3) * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ card: c, delay = 0, className = '' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay }}
      className={`p-8 rounded-[2rem] bg-gradient-to-br ${c.bg} border border-white shadow-glass group hover:-translate-y-2 transition-all duration-500 flex flex-col ${className}`}>
      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-premium group-hover:scale-110 transition-transform flex-shrink-0">
        {c.icon}
      </div>
      <h3 className="text-lg font-black text-gray-950 mb-3">{c.title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed font-medium flex-1">{c.desc}</p>
      <div className="mt-6 pt-5 border-t border-black/5 flex items-center gap-3">
        <span className="text-2xl font-black text-gray-950">{c.metric}</span>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{c.metricLabel}</span>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// PROCESS — Dark numbered steps
// ═══════════════════════════════════════════════════════════════
function Process() {
  const steps = [
    {
      num: '01',
      title: 'Neural Resume Scan',
      desc: 'Upload your existing PDF or DOCX. GPT-4o maps your entire career history into a structured profile in under 10 seconds.',
      icon: <Upload size={18} />,
      chip: { text: 'Parsing complete ✓', color: '#10B981' },
    },
    {
      num: '02',
      title: 'Elite Refinement Studio',
      desc: 'Choose a template built for your target role. The AI Coach rewrites each bullet into a quantified, impact-first statement.',
      icon: <FileText size={18} />,
      chip: { text: 'ATS Score: 94/100', color: '#6366F1' },
    },
    {
      num: '03',
      title: 'One-Click Global Launch',
      desc: 'Download a pixel-perfect, ATS-engineered PDF. Apply to Google, Amazon, Razorpay — and get callbacks.',
      icon: <TrendingUp size={18} />,
      chip: { text: '4.8× more interviews', color: '#F59E0B' },
    },
  ]

  return (
    <section className="py-28 bg-gray-950 relative overflow-hidden" id="how-it-works">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-600 rounded-full blur-[140px] opacity-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-600 rounded-full blur-[120px] opacity-8" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 glass-dark rounded-full text-brand-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Zap size={10} /> How It Works
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-white font-display text-4xl md:text-5xl lg:text-6xl mb-5 leading-tight tracking-tighter">
            From Upload to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Offer Letter</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg font-medium max-w-xl mx-auto">
            Three steps. Ten minutes. Career transformed.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div key={step.num}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="glass-dark rounded-[2rem] p-8 border border-white/10 hover:border-brand-500/40 transition-all duration-500 group">
              {/* Step number */}
              <div className="text-6xl font-black text-white/5 group-hover:text-white/10 transition-colors mb-4 leading-none select-none">
                {step.num}
              </div>
              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-5 group-hover:bg-brand-600/30 transition-colors">
                {step.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium mb-6">{step.desc}</p>
              {/* Result chip */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-black"
                style={{ background: step.chip.color + '18', color: step.chip.color }}>
                {step.chip.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA inside Process */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.4 }} className="text-center mt-14">
          <Link to="/builder" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-950 font-black text-base rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition-all group">
            Start for Free — No Card Required
            <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// TESTIMONIALS
// ═══════════════════════════════════════════════════════════════
function Testimonials() {
  const testimonials = [
    {
      name: 'Sneha Reddy',
      role: 'SDE-2',
      company: 'Amazon',
      avatar: 'SR',
      color: '#6366F1',
      stars: 5,
      quote: '"I uploaded my old Word resume, picked the Architect template, and had a Google-ready PDF in 8 minutes. Got 3 interview calls within a week. This is the real deal."',
    },
    {
      name: 'Karan Mehta',
      role: 'Product Manager',
      company: 'Razorpay',
      avatar: 'KM',
      color: '#10B981',
      stars: 5,
      quote: '"The ATS scorer told me exactly what was missing. I added keywords, ran the AI bullet optimizer, and my ATS score jumped from 61 to 94. Hired in 3 weeks."',
    },
    {
      name: 'Priya Iyer',
      role: 'Data Scientist',
      company: 'Flipkart',
      avatar: 'PI',
      color: '#F59E0B',
      stars: 5,
      quote: '"The cover letter AI is unreal — it read my resume and wrote a letter that felt completely personal. My recruiter actually commented on how tailored it was."',
    },
  ]

  return (
    <section className="py-28 bg-gradient-to-b from-gray-50/50 to-white" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 rounded-full text-amber-700 text-[10px] font-black uppercase tracking-widest mb-4">
            <Star size={10} className="fill-amber-500 text-amber-500" /> Success Stories
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-title mb-5">Real Results, Real People</motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-xl mx-auto font-medium text-lg">
            50,000+ professionals upgraded their careers. Here's what they say.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2rem] p-8 border border-gray-100 hover:border-brand-200 hover:shadow-2xl transition-all duration-500 flex flex-col">
              {/* Quote icon */}
              <Quote size={24} className="text-gray-200 mb-4" />
              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array(t.stars).fill(0).map((_, j) => (
                  <Star key={j} size={13} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed font-medium flex-1 mb-6">{t.quote}</p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-gray-50">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}99)` }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-black text-gray-900">{t.name}</div>
                  <div className="text-[10px] text-gray-400 font-bold">{t.role} · {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aggregate rating */}
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ delay: 0.35 }} className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => <Star key={s} size={18} className="text-amber-400 fill-amber-400" />)}
          </div>
          <span className="text-2xl font-black text-gray-950">4.9/5</span>
          <span className="text-gray-400 font-medium">from 12,400+ verified reviews on Product Hunt &amp; Google</span>
        </motion.div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// TEMPLATE SHOWCASE
// ═══════════════════════════════════════════════════════════════
function TemplateShowcase() {
  return (
    <section className="py-28 bg-white" id="templates">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 rounded-full text-brand-700 text-[10px] font-black uppercase tracking-widest mb-4">
              <FileText size={11} /> Template Gallery
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="section-title mb-4">Designed for Dominance</motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl">
              Curated templates for engineering, product, design, and leadership roles. ATS-safe by design.
            </motion.p>
          </div>
          <Link to="/templates" className="btn-secondary group whitespace-nowrap flex-shrink-0">
            View All 15 Templates <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TEMPLATES.slice(0, 6).map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="group relative bg-white rounded-2xl p-3 border border-gray-100 hover:border-brand-200 hover:shadow-xl transition-all duration-500 overflow-hidden">
              <div className="aspect-[3/4] rounded-xl mb-3 overflow-hidden relative">
                <div className="w-full h-full rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${t.colors[0]} 0%, ${t.colors[1] || t.colors[0]}88 100%)` }}>
                  <div className="p-3 h-full flex flex-col gap-2">
                    <div className="space-y-1">
                      <div className="h-1.5 rounded-full bg-white/70 w-2/3" />
                      <div className="h-1 rounded-full bg-white/40 w-1/2" />
                    </div>
                    <div className="h-px bg-white/20" />
                    {[80,65,55,70,50,60,45].map((w, j) => (
                      <div key={j} className="h-1 rounded-full bg-white/25" style={{ width: `${w}%` }} />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gray-950/0 group-hover:bg-gray-950/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl">
                  <Link to={`/builder?template=${t.id}`} className="bg-white text-gray-950 text-xs font-black px-3 py-1.5 rounded-xl hover:bg-brand-50 transition-colors">
                    Use →
                  </Link>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-xs truncate">{t.name}</h3>
              <div className="flex items-center justify-between mt-1">
                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{t.tier}</p>
                <div className="flex gap-0.5">
                  {t.colors.slice(0, 2).map(c => (
                    <div key={c} className="w-2 h-2 rounded-full border border-white/50" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// ATS SECTION
// ═══════════════════════════════════════════════════════════════
function ATSSection() {
  const checks = ['Workday ATS', 'Greenhouse', 'Taleo / Oracle', 'Lever', 'LinkedIn Easy Apply', 'Naukri.com']
  return (
    <section className="py-28 bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="glass-card p-10 md:p-16 flex flex-col md:flex-row items-center gap-14 border-white shadow-3xl rounded-[3rem]">
          <div className="flex-1">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-7">
              <Shield className="text-emerald-600" size={28} />
            </div>
            <h2 className="font-display text-4xl lg:text-5xl text-gray-950 mb-5 leading-tight tracking-tighter">
              Your Resume,{' '}
              <span className="text-emerald-600">Unstoppable</span>
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed mb-8 text-lg">
              We use the same parsing engine as top HR software. 100% data extraction accuracy — guaranteed.
            </p>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <div className="text-3xl font-black text-gray-950 mb-1">100%</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Parsing Accuracy</div>
              </div>
              <div>
                <div className="text-3xl font-black text-gray-950 mb-1">4.8×</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Interview Rate</div>
              </div>
            </div>
            <Link to="/ats-score" className="btn-primary">
              Check My ATS Score Free <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex-1 w-full">
            <div className="bg-gray-950 rounded-[2rem] p-8 shadow-2xl">
              <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-5">Verified Compatible With</div>
              <div className="space-y-3">
                {checks.map((name) => (
                  <div key={name} className="flex items-center gap-3">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                    <div className="flex-1 h-1.5 bg-emerald-500/20 rounded-full">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${75 + Math.random() * 25}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold">{name}</span>
                  </div>
                ))}
              </div>
              <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">ATS Compatibility</span>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle size={11} /> All Passed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// PRICING — With Monthly/Annual Toggle
// ═══════════════════════════════════════════════════════════════
function Pricing() {
  const [annual, setAnnual] = useState(false)

  const plans = [
    {
      name: 'Free Starter', price: '₹0', period: '/forever', annualPrice: '₹0', annualPeriod: '/forever',
      color: 'border-gray-100 bg-white',
      features: ['5 Elite ATS templates', 'Precision manual editor', 'Basic ATS score checker', 'One-click PDF download', '1 Active resume', 'Watermarked PDF'],
      cta: 'Get Started Free', ctaStyle: 'btn-secondary w-full justify-center group', link: '/builder',
    },
    {
      name: 'Elite Pro', price: '₹149', period: '/month', annualPrice: '₹999', annualPeriod: '/year',
      originalPrice: '₹299', originalAnnualPrice: '₹1,999',
      color: 'border-brand-500 ring-4 ring-brand-100',
      badge: 'Most Popular',
      popular: true,
      features: ['All 15 Elite templates', 'Deep AI resume parser 🤖', 'Surgical ATS + keyword analysis', 'Clean PDF + DOCX export', 'Unlimited active resumes', 'AI Cover Letter Architect', 'AI Interview Coach (12 Qs)', annual ? '2 months FREE' : null].filter(Boolean),
      cta: annual ? 'Go Annual — ₹999/yr' : 'Upgrade to Elite — ₹149',
      ctaStyle: 'btn-primary w-full justify-center group', link: '/upgrade',
    },
    {
      name: 'Team / Placement', price: '₹499', period: '/month', annualPrice: '₹3,999', annualPeriod: '/year',
      originalPrice: '₹999', originalAnnualPrice: '₹7,999',
      color: 'border-accent-500/50',
      badge: 'For Institutes',
      features: ['Everything in Elite Pro', 'Up to 10 student accounts', 'Bulk PDF generation', 'Placement team dashboard', 'Priority WhatsApp support', 'Custom branding option'],
      cta: 'Contact for Team Access', ctaStyle: 'btn-accent w-full justify-center group', link: 'mailto:hello@hrsaarthi.com',
    },
  ]

  return (
    <section className="py-28 bg-white" id="pricing">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 rounded-full text-brand-700 text-[10px] font-black uppercase tracking-widest mb-4">
            Transparent Pricing
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-title mb-5">Invest in Your Potential</motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-xl mx-auto font-medium mb-8">
            Transparent, high-value pricing for professionals aiming at India's top companies.
          </motion.p>
          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-gray-100 rounded-2xl p-1.5">
            <button onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${!annual ? 'bg-white shadow text-gray-900' : 'text-gray-400'}`}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${annual ? 'bg-white shadow text-gray-900' : 'text-gray-400'}`}>
              Annual
              <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full uppercase tracking-wider">Save 44%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div key={plan.name}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className={`relative rounded-[2rem] p-8 border-2 flex flex-col hover:shadow-2xl transition-all duration-500 ${plan.color}`}>
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-5 py-1.5 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-xl whitespace-nowrap ${plan.popular ? 'bg-brand-600 animate-pulse-subtle' : 'bg-gray-950'}`}>
                  {plan.badge}
                </div>
              )}
              <div className="mb-8">
                <h3 className="text-lg font-black text-gray-900 mb-3">{plan.name}</h3>
                <AnimatePresence mode="wait">
                  <motion.div key={annual ? 'annual' : 'monthly'}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                    className="flex flex-col mb-2">
                    
                    {/* Original Price Strikethrough */}
                    {(plan.originalPrice || plan.originalAnnualPrice) && (
                      <div className="text-gray-400 font-bold mb-1">
                        <span className="line-through decoration-red-400/60 decoration-2">
                          {annual ? plan.originalAnnualPrice : plan.originalPrice}
                        </span>
                        <span className="text-[10px] ml-2 text-brand-500 bg-brand-50 px-1.5 py-0.5 rounded uppercase tracking-widest font-black">50% Off</span>
                      </div>
                    )}

                    <div className="flex items-end gap-1.5">
                      <span className="text-4xl font-black text-gray-950 tracking-tighter">
                        {annual ? plan.annualPrice : plan.price}
                      </span>
                      <span className="text-gray-400 font-bold text-sm mb-1">
                        {annual ? plan.annualPeriod : plan.period}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <ul className="space-y-3.5 mb-10 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                    <CheckCircle size={16} className="text-accent-500 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={plan.link} className={plan.ctaStyle}>
                {annual && plan.popular ? plan.cta : plan.popular ? plan.cta : plan.cta}
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ delay: 0.4 }} className="text-center text-[11px] text-gray-400 font-medium mt-8">
          ✓ No credit card required for free plan &nbsp;·&nbsp; ✓ Cancel anytime &nbsp;·&nbsp; ✓ Secure payments via Razorpay
        </motion.p>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// FAQ
// ═══════════════════════════════════════════════════════════════
function FAQ() {
  const [openIdx, setOpenIdx] = useState(null)
  const faqs = [
    { q: 'What is ATS and why does it matter?', a: 'ATS (Applicant Tracking System) is software used by recruiters to automatically filter resumes. 75% of resumes are rejected before a human sees them. Our templates are architecturally designed to pass every major ATS with 100% precision.' },
    { q: 'Are the free templates truly ATS-compatible?', a: 'Yes. Every free template uses standard single-column or structured two-column layouts with machine-readable fonts and spacing. They parse flawlessly on LinkedIn, Naukri, Greenhouse, and Workday.' },
    { q: 'How does the AI resume parser work?', a: 'Upload your PDF or DOCX. We use OpenAI GPT-4o-mini to extract your career history into structured fields in real-time. Your data is processed in-memory and never stored unless you explicitly save it.' },
    { q: 'Can I build multiple resumes for different roles?', a: 'Yes — Pro users get unlimited saved resumes. Tailoring your resume per job description is the single most effective way to increase your interview rate, and our dashboard makes it easy.' },
    { q: 'Is ₹299/month worth it?', a: 'One successful interview from HR Saarthi can lead to a salary hike of ₹3–10 lakhs. At ₹299/month — that\'s a 1000× return on investment. Most Pro users land interviews within 2 weeks.' },
    { q: 'Is my data secure?', a: 'We use enterprise-grade Supabase infrastructure with Row-Level Security (RLS) policies — only you can access your data. We never sell personal information, and all connections are SSL-encrypted.' },
  ]

  return (
    <section className="py-28 bg-gray-50/50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 rounded-full text-brand-700 text-[10px] font-black uppercase tracking-widest mb-4">
            FAQ
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="section-title">Frequently Asked Questions</motion.h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-brand-200 transition-colors">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left gap-4">
                <span className="font-bold text-gray-900 text-sm leading-snug">{faq.q}</span>
                <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center transition-all ${openIdx === i ? 'bg-brand-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                  <ChevronDown size={14} className={`transition-transform ${openIdx === i ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <AnimatePresence>
                {openIdx === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: 'easeInOut' }}>
                    <div className="px-6 pb-6 text-sm text-gray-500 leading-relaxed font-medium border-t border-gray-50 pt-4">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// CTA
// ═══════════════════════════════════════════════════════════════
function CTA() {
  return (
    <section className="py-32 relative overflow-hidden bg-gray-950">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_50%,#4F46E5_0%,transparent_55%)] opacity-20" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,#14B8A6_0%,transparent_55%)] opacity-15" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] flex items-center justify-center mx-auto mb-10">
          <Award size={40} className="text-brand-400" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight tracking-tighter">
          Your Next Career Milestone<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">
            Starts Right Now
          </span>
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-gray-400 text-lg md:text-xl mb-12 font-medium">
          Join 50,000+ professionals who secured roles at Google, Amazon, Razorpay, and Tata — with a resume built here.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/builder" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-950 font-black text-lg rounded-2xl hover:shadow-3xl hover:-translate-y-1 transition-all group">
            Build My Resume — Free
            <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link to="/upgrade" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-bold transition-colors">
            <Sparkles size={14} /> Upgrade to Elite Pro — ₹299/mo
          </Link>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.45 }}
          className="text-gray-600 text-xs font-medium mt-8">
          No credit card required · Cancel anytime · 4.9/5 rating
        </motion.p>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════
// MOBILE STICKY CTA BAR
// ═══════════════════════════════════════════════════════════════
function MobileStickyBar() {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white/95 backdrop-blur-xl border-t border-gray-100 px-4 py-3 flex items-center gap-3 shadow-2xl">
        <Link to="/builder" className="flex-1 btn-primary justify-center py-3 text-sm">
          Build My Resume Free <ArrowRight size={16} />
        </Link>
        <Link to="/upgrade" className="flex-shrink-0 px-4 py-3 border border-brand-200 text-brand-600 font-black text-sm rounded-2xl hover:bg-brand-50 transition-colors">
          Pro ₹299
        </Link>
      </div>
    </motion.div>
  )
}
