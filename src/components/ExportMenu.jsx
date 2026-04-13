/**
 * ExportMenu — Premium export controls with auth gate
 *
 * Flow:
 *  - Logged-in user: download immediately
 *  - Guest user: clicking "Download PDF" → AuthModal pops up
 *    → on success, download auto-triggers
 */
import { useState, useRef, useEffect, useCallback } from 'react'
import { Download, ChevronDown, FileText, Printer, Loader, Lock, Star, LogIn, Share2, Globe, Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { exportToPDF, printResumeWithComponent } from '../utils/pdfExporter'
import { exportToDocx } from '../utils/docxExporter'
import { useResumeStore } from '../store/resumeStore'
import { useAuthStore } from '../store/authStore'
import { Link } from 'react-router-dom'
import AuthModal from './AuthModal'
import toast from 'react-hot-toast'
import { getEntitlements } from '../utils/entitlements'
import ExportAttestationModal from './ExportAttestationModal'
import { EVENT_NAMES, trackEvent } from '../services/analytics'

export default function ExportMenu({ ResumeComponent }) {
  const [open, setOpen]           = useState(false)
  const [exporting, setExporting]  = useState(null)  // null | 'pdf' | 'print'
  const [docxLoading, setDocxLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [pendingAction, setPendingAction] = useState(null) // 'pdf' | 'print'

  const ref = useRef(null)
  const {
    resumeData, settings, activeResumeId, savedResumes, togglePublic,
    aiAssistPendingAttestation, acknowledgeAiAssistAttestation,
  } = useResumeStore()
  const { plan, testMode, user } = useAuthStore()
  const { isPro, isGuest } = getEntitlements({ plan, testMode, user })
  const isLoading = exporting !== null

  const activeResume = savedResumes.find(r => r.id === activeResumeId)
  const isPublic     = activeResume?.isPublic || false
  const [copied, setCopied] = useState(false)
  const [showAttest, setShowAttest] = useState(false)
  const [pendingExport, setPendingExport] = useState(null) // null | 'pdf' | 'docx' | 'print'

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // ── PDF export (the actual work) ──────────────────────────────
  const doPDF = useCallback(async () => {
    setOpen(false)
    setExporting('pdf')
    try {
      await exportToPDF(
        resumeData, settings, ResumeComponent,
        resumeData.personal.fullName || 'resume',
        isPro  // ← pass isPro so free users get watermark
      )
      trackEvent(EVENT_NAMES.EXPORT_PDF, { source: 'export_menu' })
      if (!isPro) {
        toast.success('PDF downloaded! 📌 Free plan — watermark added. Upgrade to remove it.')
      } else {
        toast.success('PDF downloaded!')
      }
    } catch (err) {
      console.error('[ExportMenu] PDF error:', err)
      toast.error('PDF export failed. Please try again.')
    } finally {
      setExporting(null)
    }
  }, [resumeData, settings, ResumeComponent, isPro])

  const doPrint = useCallback(async () => {
    setOpen(false)
    setExporting('print')
    try {
      await printResumeWithComponent(ResumeComponent, resumeData, settings)
    } catch (err) {
      console.error('[ExportMenu] Print error:', err)
      toast.error(err?.message || 'Print failed. Allow pop-ups and try again.')
    } finally {
      setExporting(null)
    }
  }, [ResumeComponent, resumeData, settings])

  // ── Auth gate wrapper ─────────────────────────────────────────
  const handlePDF = () => {
    if (isGuest) {
      setPendingAction('pdf')
      setShowAuthModal(true)
      setOpen(false)
      return
    }
    if (aiAssistPendingAttestation) {
      setOpen(false)
      setPendingExport('pdf')
      setShowAttest(true)
      return
    }
    doPDF()
  }

  const confirmAttestedExport = () => {
    acknowledgeAiAssistAttestation()
    setShowAttest(false)
    const kind = pendingExport
    setPendingExport(null)
    if (kind === 'pdf') doPDF()
    if (kind === 'docx') runDocxExport()
    if (kind === 'print') doPrint()
  }

  const runDocxExport = useCallback(async () => {
    if (!isPro) return
    setOpen(false)
    setDocxLoading(true)
    try {
      await exportToDocx(resumeData, settings)
      trackEvent(EVENT_NAMES.EXPORT_DOCX, { source: 'export_menu' })
      toast.success('DOCX downloaded!')
    } catch (err) {
      console.error('[ExportMenu] DOCX error:', err)
      toast.error('DOCX export failed. Please try again.')
    } finally {
      setDocxLoading(false)
    }
  }, [resumeData, settings, isPro])

  const handlePrint = () => {
    setOpen(false)
    if (isGuest) {
      setPendingAction('print')
      setShowAuthModal(true)
      return
    }
    if (aiAssistPendingAttestation) {
      setPendingExport('print')
      setShowAttest(true)
      return
    }
    doPrint()
  }

  // Called after successful auth in modal
  const handleAuthSuccess = () => {
    setShowAuthModal(false)
    if (pendingAction === 'pdf') {
      if (useResumeStore.getState().aiAssistPendingAttestation) {
        setPendingExport('pdf')
        setShowAttest(true)
      } else {
        doPDF()
      }
    }
    if (pendingAction === 'print') {
      if (useResumeStore.getState().aiAssistPendingAttestation) {
        setPendingExport('print')
        setShowAttest(true)
      } else {
        doPrint()
      }
    }
    setPendingAction(null)
  }

  const handleCopyLink = () => {
    if (!activeResumeId) return
    const url = `${window.location.origin}/share/${activeResumeId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Link copied to clipboard!')
  }

  const handleTogglePublic = async () => {
    if (isGuest) { setShowAuthModal(true); return }
    const newStatus = !isPublic
    await togglePublic(activeResumeId, newStatus)
    toast.success(newStatus ? 'Resume is now PUBLIC!' : 'Resume is now PRIVATE')
  }

  return (
    <div className="relative flex-1" ref={ref}>
      <div className="flex shadow-sm rounded-xl">
        {/* Main download button */}
        <button
          onClick={handlePDF}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-950 text-white text-[11px] font-black rounded-l-xl hover:bg-black transition-all disabled:opacity-60 uppercase tracking-widest"
        >
          {isLoading
            ? <><Loader size={14} className="animate-spin" /> {exporting?.toUpperCase()}ing…</>
            : isGuest
              ? <><LogIn size={14} /> Sign in to Download</>
              : <><Download size={14} /> Download PDF</>
          }
        </button>

        {/* Dropdown chevron */}
        <button
          onClick={() => setOpen(!open)}
          disabled={isLoading}
          className="px-2 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-r-xl border-l border-gray-700 transition-all disabled:opacity-60"
        >
          <ChevronDown size={14} className={clsx('transition-transform duration-200', open && 'rotate-180')} />
        </button>
      </div>

      {/* Guest badge */}
      {isGuest && !isLoading && (
        <div className="mt-1 text-center text-[9px] font-bold text-gray-300 uppercase tracking-widest">
          Free · No account required to build
        </div>
      )}

      {/* Dropdown menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-2 right-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-left"
          >
            <div className="p-1.5 space-y-0.5">
              {/* PDF option */}
              <button
                onClick={handlePDF}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all text-left"
              >
                <div className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800">Download PDF</div>
                  {!isPro && !isGuest
                    ? <div className="text-[10px] text-amber-500 font-bold">Free tier — watermark included · <Link to="/upgrade" className="underline" onClick={() => setOpen(false)}>Remove →</Link></div>
                    : <div className="text-[10px] text-gray-400 font-medium">Print-ready · A4 format</div>
                  }
                </div>
                {isGuest && <Lock size={12} className="text-gray-300 flex-shrink-0" />}
              </button>

              {/* DOCX option (Pro) */}
              <button
                disabled={!isPro || docxLoading}
                onClick={() => {
                  if (!isPro) { toast.error('DOCX export is a Pro feature — upgrade to unlock'); setOpen(false); return }
                  if (aiAssistPendingAttestation) {
                    setOpen(false)
                    setPendingExport('docx')
                    setShowAttest(true)
                    return
                  }
                  runDocxExport()
                }}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left',
                  isPro ? 'text-gray-700 hover:bg-gray-50' : 'opacity-40 cursor-not-allowed',
                )}
              >
                <div className="w-8 h-8 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {docxLoading
                    ? <Loader size={14} className="text-brand-600 animate-spin" />
                    : <FileText size={14} className="text-brand-600" />
                  }
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                    {docxLoading ? 'Generating DOCX…' : 'Download DOCX'}
                    {!isPro && <Lock size={11} className="text-gray-400" />}
                    {isPro && !docxLoading && <Star size={9} className="fill-amber-400 text-amber-400" />}
                  </div>
                  <div className="text-[10px] text-gray-400 font-medium">MS Word compatible · All sections</div>
                </div>
              </button>

              <div className="h-px bg-gray-100 my-1 mx-2" />

              {/* Print option */}
              <button
                onClick={handlePrint}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all text-left"
              >
                <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Printer size={14} className="text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-800">Print Resume</div>
                  <div className="text-[10px] text-gray-400 font-medium">Browser print dialog</div>
                </div>
              </button>

              <div className="h-px bg-gray-100 my-1 mx-2" />

              {/* Public Sharing Section */}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-2">
                     <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                       <Share2 size={14} className="text-emerald-500" />
                     </div>
                     <div>
                       <div className="text-sm font-bold text-gray-800">Public Link</div>
                       <div className="text-[10px] text-gray-400 font-medium">{isPublic ? 'Visible to anyone' : 'Private Save'}</div>
                     </div>
                   </div>
                   <button
                     onClick={handleTogglePublic}
                     className={clsx(
                       'w-10 h-5 rounded-full transition-all relative',
                       isPublic ? 'bg-emerald-500' : 'bg-gray-200'
                     )}
                   >
                     <div className={clsx(
                       'absolute top-1 w-3 h-3 bg-white rounded-full transition-all',
                       isPublic ? 'left-6' : 'left-1'
                     )} />
                   </button>
                </div>

                {isPublic && activeResumeId && (
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-100 transition-all"
                  >
                    {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    {copied ? 'Copied' : 'Copy Share Link'}
                  </button>
                )}
                
                {isGuest && (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-brand-50 text-brand-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-100 transition-all"
                  >
                    <LogIn size={12} /> Sign in to Share
                  </button>
                )}
              </div>
            </div>

            {/* Upgrade CTA */}
            {!isPro && (
              <div className="bg-gradient-to-r from-brand-50 to-violet-50 px-3 py-2.5 border-t border-brand-50/80">
                <Link
                  to="/upgrade"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-600 hover:text-brand-700 transition-colors"
                >
                  <Star size={10} className="fill-brand-600" /> Upgrade to Pro — ₹499 Lifetime →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth modal */}
      {showAuthModal && (
        <AuthModal
          trigger="download"
          onClose={() => { setShowAuthModal(false); setPendingAction(null) }}
          onSuccess={handleAuthSuccess}
        />
      )}

      <ExportAttestationModal
        open={showAttest}
        onCancel={() => { setShowAttest(false); setPendingExport(null) }}
        onConfirm={confirmAttestedExport}
      />
    </div>
  )
}
