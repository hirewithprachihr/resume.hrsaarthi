// @refresh reset
import React, { lazy, Suspense } from 'react'
import ATSClassic from './ATSClassic'

// ── Loading fallback ──────────────────────────────────────────────
const TemplateLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#94a3b8', fontSize: '12px', fontFamily: 'Inter, sans-serif', gap: '8px' }}>
    <div style={{ width: '14px', height: '14px', border: '2px solid #e2e8f0', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    Loading template…
  </div>
)

/** Wrap a lazy-imported default export in Suspense + ErrorBoundary */
const withLazy = (importFn) => {
  const LazyComponent = lazy(importFn)
  return (props) => (
    <TemplateErrorBoundary>
      <Suspense fallback={<TemplateLoader />}>
        <LazyComponent {...props} />
      </Suspense>
    </TemplateErrorBoundary>
  )
}

/** Specific error boundary for template rendering issues */
class TemplateErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(error, info) { console.error('[TemplateError]', error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', textAlign: 'center', background: '#fff1f2', border: '1px solid #fecaca', borderRadius: '12px' }}>
          <div style={{ fontSize: '24px', marginBottom: '12px' }}>⚠️</div>
          <div style={{ fontWeight: 'bold', color: '#991b1b', marginBottom: '4px' }}>Design Load Failed</div>
          <p style={{ fontSize: '11px', color: '#b91c1c', marginBottom: '16px' }}>This template is currently unavailable or has an error.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{ padding: '8px 16px', background: '#991b1b', color: 'white', border: 'none', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Try Reloading Design
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ── Pro Templates (individually lazy-loaded for code splitting) ───
const LazyCorporatePro    = withLazy(() => import('./templates/CorporatePro'))
const LazyTechMinimal     = withLazy(() => import('./templates/TechMinimal'))
const LazyCreativeSidebar = withLazy(() => import('./templates/CreativeSidebar'))
const LazyExecutiveBold   = withLazy(() => import('./templates/ExecutiveBold'))
const LazyElegantModern   = withLazy(() => import('./templates/ElegantModern'))
const LazyStartupHustler  = withLazy(() => import('./templates/StartupHustler'))
const LazyInfographicPro  = withLazy(() => import('./templates/InfographicPro'))
const LazyInternational   = withLazy(() => import('./templates/International'))
const LazyLinkedInExport  = withLazy(() => import('./templates/LinkedInExport'))

// ── New Templates v4.0 (individually lazy-loaded) ─────────────────
const LazyVedanta       = withLazy(() => import('./NewTemplates').then(m => ({ default: m.Vedanta     })))
const LazyMinimalInk    = withLazy(() => import('./NewTemplates').then(m => ({ default: m.MinimalInk  })))
const LazySplitScreen   = withLazy(() => import('./NewTemplates').then(m => ({ default: m.SplitScreen })))
const LazyTimelinePro   = withLazy(() => import('./NewTemplates').then(m => ({ default: m.TimelinePro })))
const LazyFresherFirst  = withLazy(() => import('./NewTemplates').then(m => ({ default: m.FresherFirst })))

// ── New Premium Pro Templates v5.0 ────────────────────────────────
const LazyPrachiSignature = withLazy(() => import('./templates/PrachiSignature'))
const LazyDesignCanvas    = withLazy(() => import('./templates/DesignCanvas'))
const LazySleekFinancial  = withLazy(() => import('./templates/SleekFinancial'))
const LazyModernSplit     = withLazy(() => import('./templates/ModernSplit'))
const LazyPlayfulBusiness = withLazy(() => import('./templates/PlayfulBusiness'))

// ── Category Templates v6.0 (new 2026 category-specific) ─────────
const LazyCampusPro      = withLazy(() => import('./templates/CampusPro'))
const LazyDevStack       = withLazy(() => import('./templates/DevStack'))
const LazyFinanceEdge    = withLazy(() => import('./templates/FinanceEdge'))

// ── Category Templates v7.0 — Industry-Specific ──────────────────
const LazyHRPeople       = withLazy(() => import('./templates/HRPeople'))
const LazySalesWarrior   = withLazy(() => import('./templates/SalesWarrior'))
const LazyMedicalPro     = withLazy(() => import('./templates/MedicalPro'))
const LazyLegalEagle     = withLazy(() => import('./templates/LegalEagle'))
const LazyTeacherFirst   = withLazy(() => import('./templates/TeacherFirst'))
const LazyGovtReady      = withLazy(() => import('./templates/GovtReady'))
const LazyMarketingMaven = withLazy(() => import('./templates/MarketingMaven'))

// ── Template Registry ─────────────────────────────────────────────
export const TEMPLATES = [
  // ─── FREE TIER ───────────────────────────────────────────────
  {
    id         : 'ats-classic',
    name       : 'ATS Classic',
    description: 'Clean serif, single-column — maximum ATS compatibility',
    tier       : 'free',
    component  : ATSClassic,
    colors     : ['#1A56DB', '#0E9F6E', '#DC2626', '#7C3AED'],
    tags       : ['clean', 'ats-safe', 'traditional'],
    category   : 'all',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'ATS-Safe',
    bestFor    : ['Any Industry', 'Portals', 'Workday', 'Greenhouse'],
  },
  {
    id         : 'corporate-pro',
    name       : 'Corporate Pro',
    description: 'Executive two-column with dark sidebar — boardroom ready',
    tier       : 'free',
    component  : LazyCorporatePro,
    colors     : ['#1A56DB', '#0f172a', '#334155', '#0E9F6E'],
    tags       : ['two-column', 'corporate', 'sidebar'],
    category   : 'executive',
    atsLevel   : 'high',
    layout     : 'sidebar',
    badge      : 'Executive',
    bestFor    : ['MNC', 'Consulting', 'Corporate'],
  },
  {
    id         : 'tech-minimal',
    name       : 'Dev Dark',
    description: 'Dark header, monospace accents — engineered for developers',
    tier       : 'free',
    component  : LazyTechMinimal,
    colors     : ['#0E9F6E', '#1A56DB', '#DC2626', '#7C3AED'],
    tags       : ['dark', 'tech', 'monospace'],
    category   : 'tech',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'Tech',
    bestFor    : ['Startups', 'Product Companies', 'FAANG'],
  },
  {
    id         : 'creative-sidebar',
    name       : 'Creative Sidebar',
    description: 'Bold left panel with avatar — visually striking',
    tier       : 'free',
    component  : LazyCreativeSidebar,
    colors     : ['#7C3AED', '#1A56DB', '#0E9F6E', '#DC2626'],
    tags       : ['creative', 'sidebar', 'colorful'],
    category   : 'creative',
    atsLevel   : 'medium',
    layout     : 'sidebar',
    badge      : 'Creative',
    bestFor    : ['Agencies', 'Startups', 'Design Roles'],
  },
  {
    id         : 'fresher-first',
    name       : 'Fresher First',
    description: 'Education & Projects first — ideal for new grads',
    tier       : 'free',
    component  : LazyFresherFirst,
    colors     : ['#0E9F6E', '#1A56DB', '#7C3AED', '#DC2626'],
    tags       : ['fresher', 'student', 'clean'],
    category   : 'fresher',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'For Freshers',
    bestFor    : ['Campus Placements', 'IT Companies', 'Internships'],
  },

  // ─── PRO TIER ────────────────────────────────────────────────
  {
    id         : 'executive-bold',
    name       : 'Executive Bold',
    description: 'Full-bleed graphite header, large name — C-suite presence',
    tier       : 'pro',
    component  : LazyExecutiveBold,
    colors     : ['#1A56DB', '#7C3AED', '#0f172a', '#0E9F6E'],
    tags       : ['executive', 'bold', 'leader'],
    category   : 'executive',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'Executive',
    bestFor    : ['Director+', 'C-Suite', 'Senior Leadership'],
  },
  {
    id         : 'elegant-modern',
    name       : 'Elegant Modern',
    description: 'Centered serif, wide margins — luxury editorial feel',
    tier       : 'pro',
    component  : LazyElegantModern,
    colors     : ['#B45309', '#7C3AED', '#1A56DB', '#0E9F6E'],
    tags       : ['elegant', 'luxury', 'serif'],
    category   : 'executive',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'Premium',
    bestFor    : ['Law Firms', 'Finance', 'Consulting'],
  },
  {
    id         : 'sleek-financial',
    name       : 'Sleek Financial',
    description: 'Clean, structured, single-column heavy layout perfect for executives',
    tier       : 'pro',
    component  : LazySleekFinancial,
    colors     : ['#1A56DB', '#0f172a', '#111827', '#0E9F6E'],
    tags       : ['sleek', 'finance', 'executive'],
    category   : 'finance',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'Finance',
    bestFor    : ['Banking', 'Finance', 'CXO Roles'],
  },
  {
    id         : 'modern-split',
    name       : 'Modern Split',
    description: 'A classic two-column design with elegant sidebar elements',
    tier       : 'pro',
    component  : LazyModernSplit,
    colors     : ['#2D3748', '#1A56DB', '#DC2626', '#B45309'],
    tags       : ['two-column', 'modern', 'structured'],
    category   : 'all',
    atsLevel   : 'medium',
    layout     : 'two-col',
    badge      : 'Modern',
    bestFor    : ['Corporate', 'Tech', 'Management'],
  },
  {
    id         : 'playful-business',
    name       : 'Playful Business',
    description: 'Creative and vibrant block-based layout for designers & thinkers',
    tier       : 'pro',
    component  : LazyPlayfulBusiness,
    colors     : ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
    tags       : ['creative', 'colorful', 'playful'],
    category   : 'creative',
    atsLevel   : 'low',
    layout     : 'two-col',
    badge      : 'Creative',
    bestFor    : ['Designers', 'Marketing', 'Agencies'],
  },
  {
    id         : 'startup-hustler',
    name       : 'Startup Hustler',
    description: 'High-energy, compact — startup and product roles',
    tier       : 'pro',
    component  : LazyStartupHustler,
    colors     : ['#DC2626', '#1A56DB', '#0E9F6E', '#7C3AED'],
    tags       : ['startup', 'compact', 'energetic'],
    category   : 'tech',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'Startup',
    bestFor    : ['Startups', 'Product Roles', 'VC-backed'],
  },
  {
    id         : 'infographic-pro',
    name       : 'Infographic Pro',
    description: 'Visual skill bars, timeline dots — stands out instantly',
    tier       : 'pro',
    component  : LazyInfographicPro,
    colors     : ['#0891B2', '#7C3AED', '#1A56DB', '#0E9F6E'],
    tags       : ['visual', 'infographic', 'bars'],
    category   : 'creative',
    atsLevel   : 'low',
    layout     : 'sidebar',
    badge      : 'Visual',
    bestFor    : ['Design Agencies', 'Portfolio Submissions'],
  },
  {
    id         : 'international',
    name       : 'International',
    description: 'Two-column, right sidebar — global recruiter standard',
    tier       : 'pro',
    component  : LazyInternational,
    colors     : ['#4F46E5', '#1A56DB', '#0E9F6E', '#DC2626'],
    tags       : ['global', 'two-column', 'clean'],
    category   : 'all',
    atsLevel   : 'high',
    layout     : 'two-col',
    badge      : 'Global',
    bestFor    : ['MNC', 'Global Companies', 'Visa Applications'],
  },
  {
    id         : 'linkedin-export',
    name       : 'LinkedIn Export',
    description: 'Mirrors LinkedIn layout — instantly recognisable',
    tier       : 'pro',
    component  : LazyLinkedInExport,
    colors     : ['#0077B5', '#1A56DB', '#0E9F6E', '#7C3AED'],
    tags       : ['linkedin', 'professional', 'familiar'],
    category   : 'all',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'LinkedIn',
    bestFor    : ['Social Profiles', 'Networking', 'Referrals'],
  },
  {
    id         : 'vedanta',
    name       : 'Vedanta',
    description: 'Dark navy header + gold accents — Indian corporate premium',
    tier       : 'pro',
    component  : LazyVedanta,
    colors     : ['#D4AF37', '#1A56DB', '#0E9F6E', '#DC2626'],
    tags       : ['indian', 'corporate', 'gold'],
    category   : 'executive',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'Premium Indian',
    bestFor    : ['Indian Corporates', 'PSU', 'Banks', 'FMCG'],
  },
  {
    id         : 'minimal-ink',
    name       : 'Minimal Ink',
    description: 'Typography-only, zero decoration — pure content focus',
    tier       : 'pro',
    component  : LazyMinimalInk,
    colors     : ['#0f172a', '#475569', '#1A56DB', '#0E9F6E'],
    tags       : ['minimal', 'typography', 'clean'],
    category   : 'all',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'Minimal',
    bestFor    : ['Academic', 'Legal', 'Research'],
  },
  {
    id         : 'split-screen',
    name       : 'Split Screen',
    description: 'Charcoal/white split with numbered sections',
    tier       : 'pro',
    component  : LazySplitScreen,
    colors     : ['#6366F1', '#1A56DB', '#DC2626', '#0E9F6E'],
    tags       : ['split', 'two-column', 'modern'],
    category   : 'tech',
    atsLevel   : 'medium',
    layout     : 'two-col',
    badge      : 'Modern',
    bestFor    : ['Tech', 'Product', 'Design'],
  },
  {
    id         : 'timeline-pro',
    name       : 'Timeline Pro',
    description: 'Visual career timeline with milestone dots',
    tier       : 'pro',
    component  : LazyTimelinePro,
    colors     : ['#0891B2', '#7C3AED', '#0E9F6E', '#1A56DB'],
    tags       : ['timeline', 'visual', 'career'],
    category   : 'executive',
    atsLevel   : 'medium',
    layout     : 'single',
    badge      : 'Timeline',
    bestFor    : ['Senior Roles', 'Long Career Histories'],
  },
  {
    id         : 'prachi-signature',
    name       : 'Prachi Signature',
    description: 'Navy sidebar + gold accents — Indian corporate premium',
    tier       : 'pro',
    component  : LazyPrachiSignature,
    colors     : ['#C9A84C', '#1A2B4B', '#2D4A8A', '#8B6914'],
    tags       : ['premium', 'corporate', 'indian', 'sidebar', 'gold'],
    category   : 'executive',
    atsLevel   : 'high',
    layout     : 'sidebar',
    badge      : 'Flagship',
    bestFor    : ['Indian MNC', 'Senior Management', 'HR Showcase'],
  },
  {
    id         : 'design-canvas',
    name       : 'Design Canvas',
    description: 'Bold color-block left column — built for creatives & designers',
    tier       : 'pro',
    component  : LazyDesignCanvas,
    colors     : ['#7B2D8B', '#1E40AF', '#B91C1C', '#047857'],
    tags       : ['creative', 'designer', 'ux', 'bold', 'colorblock'],
    category   : 'creative',
    atsLevel   : 'low',
    layout     : 'sidebar',
    badge      : 'Creative',
    bestFor    : ['UX/UI Designers', 'Graphic Designers', 'Art Directors'],
  },

  // ─── CATEGORY TEMPLATES v6.0 ─────────────────────────────────
  {
    id         : 'campus-pro',
    name       : 'Campus Pro',
    description: 'Single-column, education-first — campus placements & freshers',
    tier       : 'free',
    component  : LazyCampusPro,
    colors     : ['#1A56DB', '#0E9F6E', '#7C3AED', '#DC2626'],
    tags       : ['fresher', 'campus', 'education-first', 'ats-safe'],
    category   : 'fresher',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'For Freshers',
    bestFor    : ['Campus Placements', 'TCS', 'Infosys', 'Wipro', 'Internships'],
  },
  {
    id         : 'dev-stack',
    name       : 'DevStack',
    description: 'Dark sidebar with categorized skills — built for developers',
    tier       : 'pro',
    component  : LazyDevStack,
    colors     : ['#0E9F6E', '#1A56DB', '#7C3AED', '#DC2626'],
    tags       : ['developer', 'tech', 'dark', 'sidebar', 'code'],
    category   : 'tech',
    atsLevel   : 'high',
    layout     : 'sidebar',
    badge      : 'Tech',
    bestFor    : ['Zomato', 'Swiggy', 'Paytm', 'Razorpay', 'Startups', 'MNCs'],
  },
  {
    id         : 'finance-edge',
    name       : 'FinanceEdge',
    description: 'Dark navy header, number-heavy format — CA/CFA/Banking/IB',
    tier       : 'pro',
    component  : LazyFinanceEdge,
    colors     : ['#1A56DB', '#0f1e3d', '#374151', '#0E9F6E'],
    tags       : ['finance', 'banking', 'ca', 'cfa', 'conservative'],
    category   : 'finance',
    atsLevel   : 'high',
    layout     : 'two-col',
    badge      : 'Finance',
    bestFor    : ['Deloitte', 'EY', 'KPMG', 'HDFC', 'SEBI', 'Big 4'],
  },

  // ─── CATEGORY TEMPLATES v7.0 — Industry-Specific ─────────────
  {
    id         : 'hr-people',
    name       : 'HRPeople',
    description: 'Teal header + HR expertise tags — built for HR & TA professionals',
    tier       : 'pro',
    component  : LazyHRPeople,
    colors     : ['#0E9F6E', '#059669', '#0891B2', '#7C3AED'],
    tags       : ['hr', 'talent', 'people', 'hrbp'],
    category   : 'all',
    atsLevel   : 'high',
    layout     : 'two-col',
    badge      : 'HR & People',
    bestFor    : ['HR Executives', 'TA Leads', 'HRBPs', 'L&D Managers'],
  },
  {
    id         : 'sales-warrior',
    name       : 'SalesWarrior',
    description: 'Dark header + metric banner — numbers-first for sales closers',
    tier       : 'pro',
    component  : LazySalesWarrior,
    colors     : ['#DC2626', '#B91C1C', '#0f172a', '#1A56DB'],
    tags       : ['sales', 'bd', 'revenue', 'kam', 'quota'],
    category   : 'all',
    atsLevel   : 'high',
    layout     : 'two-col',
    badge      : 'Sales',
    bestFor    : ['B2B Sales', 'KAM', 'Business Development', 'Inside Sales'],
  },
  {
    id         : 'medical-pro',
    name       : 'MedicalPro',
    description: 'Clinical blue + cross icon — credential-first for healthcare',
    tier       : 'pro',
    component  : LazyMedicalPro,
    colors     : ['#0891B2', '#0e7490', '#0E9F6E', '#1A56DB'],
    tags       : ['medical', 'doctor', 'nurse', 'clinical', 'healthcare'],
    category   : 'all',
    atsLevel   : 'high',
    layout     : 'two-col',
    badge      : 'Healthcare',
    bestFor    : ['MBBS/MD Doctors', 'Nurses', 'Allied Health', 'Hospital Admin'],
  },
  {
    id         : 'legal-eagle',
    name       : 'LegalEagle',
    description: 'Formal serif + navy/gold — authoritative legal brief style',
    tier       : 'pro',
    component  : LazyLegalEagle,
    colors     : ['#1e3a5f', '#C9A84C', '#1A56DB', '#0f172a'],
    tags       : ['legal', 'lawyer', 'advocate', 'counsel', 'llb', 'llm'],
    category   : 'all',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'Legal',
    bestFor    : ['Advocates', 'Corporate Counsel', 'LLB/LLM Graduates', 'Law Firms'],
  },
  {
    id         : 'teacher-first',
    name       : 'TeacherFirst',
    description: 'Warm ivory + purple — education-focused for teachers & academics',
    tier       : 'free',
    component  : LazyTeacherFirst,
    colors     : ['#7C3AED', '#6d28d9', '#0E9F6E', '#1A56DB'],
    tags       : ['teacher', 'professor', 'education', 'academic', 'lecturer'],
    category   : 'all',
    atsLevel   : 'high',
    layout     : 'two-col',
    badge      : 'Education',
    bestFor    : ['School Teachers', 'College Professors', 'Lecturers', 'Ed-Tech'],
  },
  {
    id         : 'govt-ready',
    name       : 'GovtReady',
    description: 'Indian Govt CV format — tabular, plain, declaration included',
    tier       : 'free',
    component  : LazyGovtReady,
    colors     : ['#1A56DB', '#0f1e3d', '#0E9F6E', '#DC2626'],
    tags       : ['government', 'psu', 'upsc', 'ssc', 'bank', 'ias', 'defence'],
    category   : 'all',
    atsLevel   : 'high',
    layout     : 'single',
    badge      : 'Govt / PSU',
    bestFor    : ['UPSC/IAS', 'Bank PO/SO', 'SSC', 'PSU (ONGC/NTPC/Railway)', 'Defence'],
  },
  {
    id         : 'marketing-maven',
    name       : 'MarketingMaven',
    description: 'Amber KPI ribbon + dark header — data-driven for marketers',
    tier       : 'pro',
    component  : LazyMarketingMaven,
    colors     : ['#F59E0B', '#D97706', '#DC2626', '#0E9F6E'],
    tags       : ['marketing', 'brand', 'growth', 'digital', 'kpi', 'roas'],
    category   : 'all',
    atsLevel   : 'high',
    layout     : 'two-col',
    badge      : 'Marketing',
    bestFor    : ['Digital Marketers', 'Brand Managers', 'Growth Hackers', 'CMO-track'],
  },
]

/**
 * Get a template by ID. Falls back to the first (ATS Classic) if not found.
 */
export function getTemplate(id) {
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[0]
}
