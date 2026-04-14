import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { Suspense, lazy, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageLoader from './components/PageLoader'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/authStore'

const LandingPage     = lazy(() => import('./pages/LandingPage'))
const BuilderPage     = lazy(() => import('./pages/BuilderPage'))
const TemplatesPage   = lazy(() => import('./pages/TemplatesPage'))
const LoginPage       = lazy(() => import('./pages/LoginPage'))
const DashboardPage   = lazy(() => import('./pages/DashboardPage'))
const UpgradePage     = lazy(() => import('./pages/UpgradePage'))
const ATSScorePage    = lazy(() => import('./pages/ATSScorePage'))
const CoverLetterPage = lazy(() => import('./pages/CoverLetterPage'))
const InterviewPrepPage = lazy(() => import('./pages/InterviewPrepPage'))
const NotFoundPage    = lazy(() => import('./pages/NotFoundPage'))
const AuthCallback       = lazy(() => import('./pages/AuthCallback'))
const SharePage          = lazy(() => import('./pages/SharePage'))
const PrivacyPolicyPage  = lazy(() => import('./pages/PrivacyPolicyPage'))
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'))
const JobTrackerPage     = lazy(() => import('./pages/JobTrackerPage'))

// ── Admin (lazy-loaded as one chunk) ─────────────────────────────
const AdminGuard          = lazy(() => import('./pages/admin/AdminGuard'))
const AdminLayout         = lazy(() => import('./pages/admin/AdminLayout'))
const AdminOverview       = lazy(() => import('./pages/admin/AdminOverview'))
const AdminUsers          = lazy(() => import('./pages/admin/AdminUsers'))
const AdminResumeDatabase = lazy(() => import('./pages/admin/AdminResumeDatabase'))
const AdminPayments       = lazy(() => import('./pages/admin/AdminPayments'))
const AdminDiscounts      = lazy(() => import('./pages/admin/AdminDiscounts'))
const AdminPlans          = lazy(() => import('./pages/admin/AdminPlans'))
const AdminSettings       = lazy(() => import('./pages/admin/AdminSettings'))

const HIDE_FOOTER = ['/builder']

function Layout({ children, pathname }) {
  const noFooter = HIDE_FOOTER.some(p => pathname?.startsWith(p))
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      {!noFooter && <Footer />}
    </div>
  )
}

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    // Call initAuth ONCE on mount using stable getState reference.
    // Do NOT put initAuth in the dep array — Zustand recreates function
    // references on each render, which would cause infinite re-subscriptions.
    useAuthStore.getState().initAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Handle ?pro=true test URL param
    useAuthStore.getState().init()
  }, [location.search])

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public Routes ─────────────────────────────────── */}
        <Route path="/"           element={<Layout pathname={location.pathname}><LandingPage  /></Layout>} />
        <Route path="/templates"  element={<Layout pathname={location.pathname}><TemplatesPage /></Layout>} />
        <Route path="/login"      element={<Layout pathname={location.pathname}><LoginPage    /></Layout>} />
        <Route path="/upgrade"    element={<Layout pathname={location.pathname}><UpgradePage  /></Layout>} />
        <Route path="/ats-score"       element={<Layout pathname={location.pathname}><ATSScorePage /></Layout>} />
        <Route path="/cover-letter"    element={<Layout pathname={location.pathname}><CoverLetterPage /></Layout>} />
        <Route path="/interview-prep"  element={<Layout pathname={location.pathname}><InterviewPrepPage /></Layout>} />
        <Route path="/share/:id"  element={<SharePage />} />
        <Route path="/tracker"     element={<Layout pathname={location.pathname}><JobTrackerPage /></Layout>} />

        {/* ── Auth Callback (email confirmation deep-link) ───── */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* ── Legal Pages ─────────────────────────────────── */}
        <Route path="/privacy-policy"   element={<Layout pathname={location.pathname}><PrivacyPolicyPage /></Layout>} />
        <Route path="/terms-of-service" element={<Layout pathname={location.pathname}><TermsOfServicePage /></Layout>} />

        {/* ── Builder — accessible to all, but Pro locked inside ─ */}
        <Route path="/builder"           element={<Layout pathname={location.pathname}><BuilderPage  /></Layout>} />
        <Route path="/builder/:resumeId" element={<Layout pathname={location.pathname}><BuilderPage /></Layout>} />

        {/* ── Admin Portal ──────────────────────────────── */}
        <Route path="/admin" element={
          <AdminGuard>
            <AdminLayout />
          </AdminGuard>
        }>
          <Route index              element={<AdminOverview />} />
          <Route path="users"       element={<AdminUsers />} />
          <Route path="resumes"     element={<AdminResumeDatabase />} />
          <Route path="payments"    element={<AdminPayments />} />
          <Route path="discounts"   element={<AdminDiscounts />} />
          <Route path="plans"       element={<AdminPlans />} />
          <Route path="settings"    element={<AdminSettings />} />
        </Route>

        {/* ── Protected Routes — require login ──────────────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout pathname={location.pathname}><DashboardPage /></Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Layout pathname={location.pathname}><NotFoundPage /></Layout>} />
      </Routes>
    </Suspense>
  )
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style  : { fontFamily: "'Inter', sans-serif", fontSize: '14px', borderRadius: '12px' },
          success: { iconTheme: { primary: '#0E9F6E', secondary: '#fff' } },
          error  : { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
      <AppContent />
    </BrowserRouter>
  )
}
