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
  },
  {
    id         : 'corporate-pro',
    name       : 'Corporate Pro',
    description: 'Executive two-column with dark sidebar — boardroom ready',
    tier       : 'free',
    component  : LazyCorporatePro,
    colors     : ['#1A56DB', '#0f172a', '#334155', '#0E9F6E'],
    tags       : ['two-column', 'corporate', 'sidebar'],
  },
  {
    id         : 'tech-minimal',
    name       : 'Dev Dark',
    description: 'Dark header, monospace accents — engineered for developers',
    tier       : 'free',
    component  : LazyTechMinimal,
    colors     : ['#0E9F6E', '#1A56DB', '#DC2626', '#7C3AED'],
    tags       : ['dark', 'tech', 'monospace'],
  },
  {
    id         : 'creative-sidebar',
    name       : 'Creative Sidebar',
    description: 'Bold left panel with avatar — visually striking',
    tier       : 'free',
    component  : LazyCreativeSidebar,
    colors     : ['#7C3AED', '#1A56DB', '#0E9F6E', '#DC2626'],
    tags       : ['creative', 'sidebar', 'colorful'],
  },
  {
    id         : 'fresher-first',
    name       : 'Fresher First',
    description: 'Education & Projects first — ideal for new grads',
    tier       : 'free',
    component  : LazyFresherFirst,
    colors     : ['#0E9F6E', '#1A56DB', '#7C3AED', '#DC2626'],
    tags       : ['fresher', 'student', 'clean'],
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
  },
  {
    id         : 'elegant-modern',
    name       : 'Elegant Modern',
    description: 'Centered serif, wide margins — luxury editorial feel',
    tier       : 'pro',
    component  : LazyElegantModern,
    colors     : ['#B45309', '#7C3AED', '#1A56DB', '#0E9F6E'],
    tags       : ['elegant', 'luxury', 'serif'],
  },
  {
    id         : 'sleek-financial',
    name       : 'Sleek Financial',
    description: 'Clean, structured, single-column heavy layout perfect for executives',
    tier       : 'pro',
    component  : LazySleekFinancial,
    colors     : ['#1A56DB', '#0f172a', '#111827', '#0E9F6E'],
    tags       : ['sleek', 'finance', 'executive'],
  },
  {
    id         : 'modern-split',
    name       : 'Modern Split',
    description: 'A classic two-column design with elegant sidebar elements',
    tier       : 'pro',
    component  : LazyModernSplit,
    colors     : ['#2D3748', '#1A56DB', '#DC2626', '#B45309'],
    tags       : ['two-column', 'modern', 'structured'],
  },
  {
    id         : 'playful-business',
    name       : 'Playful Business',
    description: 'Creative and vibrant block-based layout for designers & thinkers',
    tier       : 'pro',
    component  : LazyPlayfulBusiness,
    colors     : ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
    tags       : ['creative', 'colorful', 'playful'],
  },
  {
    id         : 'startup-hustler',
    name       : 'Startup Hustler',
    description: 'High-energy, compact — startup and product roles',
    tier       : 'pro',
    component  : LazyStartupHustler,
    colors     : ['#DC2626', '#1A56DB', '#0E9F6E', '#7C3AED'],
    tags       : ['startup', 'compact', 'energetic'],
  },
  {
    id         : 'infographic-pro',
    name       : 'Infographic Pro',
    description: 'Visual skill bars, timeline dots — stands out instantly',
    tier       : 'pro',
    component  : LazyInfographicPro,
    colors     : ['#0891B2', '#7C3AED', '#1A56DB', '#0E9F6E'],
    tags       : ['visual', 'infographic', 'bars'],
  },
  {
    id         : 'international',
    name       : 'International',
    description: 'Two-column, right sidebar — global recruiter standard',
    tier       : 'pro',
    component  : LazyInternational,
    colors     : ['#4F46E5', '#1A56DB', '#0E9F6E', '#DC2626'],
    tags       : ['global', 'two-column', 'clean'],
  },
  {
    id         : 'linkedin-export',
    name       : 'LinkedIn Export',
    description: 'Mirrors LinkedIn layout — instantly recognisable',
    tier       : 'pro',
    component  : LazyLinkedInExport,
    colors     : ['#0077B5', '#1A56DB', '#0E9F6E', '#7C3AED'],
    tags       : ['linkedin', 'professional', 'familiar'],
  },
  {
    id         : 'vedanta',
    name       : 'Vedanta',
    description: 'Dark navy header + gold accents — Indian corporate premium',
    tier       : 'pro',
    component  : LazyVedanta,
    colors     : ['#D4AF37', '#1A56DB', '#0E9F6E', '#DC2626'],
    tags       : ['indian', 'corporate', 'gold'],
  },
  {
    id         : 'minimal-ink',
    name       : 'Minimal Ink',
    description: 'Typography-only, zero decoration — pure content focus',
    tier       : 'pro',
    component  : LazyMinimalInk,
    colors     : ['#0f172a', '#475569', '#1A56DB', '#0E9F6E'],
    tags       : ['minimal', 'typography', 'clean'],
  },
  {
    id         : 'split-screen',
    name       : 'Split Screen',
    description: 'Charcoal/white split with numbered sections',
    tier       : 'pro',
    component  : LazySplitScreen,
    colors     : ['#6366F1', '#1A56DB', '#DC2626', '#0E9F6E'],
    tags       : ['split', 'two-column', 'modern'],
  },
  {
    id         : 'timeline-pro',
    name       : 'Timeline Pro',
    description: 'Visual career timeline with milestone dots',
    tier       : 'pro',
    component  : LazyTimelinePro,
    colors     : ['#0891B2', '#7C3AED', '#0E9F6E', '#1A56DB'],
    tags       : ['timeline', 'visual', 'career'],
  },
  {
    id         : 'prachi-signature',
    name       : 'Prachi Signature',
    description: 'Navy sidebar + gold accents — Indian corporate premium',
    tier       : 'pro',
    component  : LazyPrachiSignature,
    colors     : ['#C9A84C', '#1A2B4B', '#2D4A8A', '#8B6914'],
    tags       : ['premium', 'corporate', 'indian', 'sidebar', 'gold'],
  },
  {
    id         : 'design-canvas',
    name       : 'Design Canvas',
    description: 'Bold color-block left column — built for creatives & designers',
    tier       : 'pro',
    component  : LazyDesignCanvas,
    colors     : ['#7B2D8B', '#1E40AF', '#B91C1C', '#047857'],
    tags       : ['creative', 'designer', 'ux', 'bold', 'colorblock'],
  },
]

/**
 * Get a template by ID. Falls back to the first (ATS Classic) if not found.
 */
export function getTemplate(id) {
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[0]
}
