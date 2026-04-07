/**
 * CoverLetterPage — AI Cover Letter Generator
 * ─────────────────────────────────────────────────────────────────
 * Route: /cover-letter
 * 
 * Left panel: Form (Job Title, Company, JD paste, Tone selector)
 * Right panel: Live preview of cover letter
 * Bottom bar: Generate AI, Word count, Copy, Download PDF (Pro gate)
 * 
 * Auto-populates from current resume data in Zustand store.
 */
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Copy, Check, Download, FileText, Zap, Loader,
  RefreshCw, Star, Lock, ChevronDown, Target, User, Briefcase,
  AlignLeft, Crown,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useResumeStore } from '../store/resumeStore'
import { useAuthStore } from '../store/authStore'
import { getEntitlements } from '../utils/entitlements'
import { supabase } from '../services/supabase'
import { exportToPDF } from '../utils/pdfExporter'
import CLClassic from '../templates/cover-letter/CLClassic'
import CLModern from '../templates/cover-letter/CLModern'
import toast from 'react-hot-toast'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

const TONE_OPTIONS = [
  { value: 'formal',    label: 'Formal',    description: 'Professional & traditional', icon: '🎩', color: '#6366F1' },
  { value: 'warm',      label: 'Warm',      description: 'Friendly & approachable',    icon: '🤝', color: '#10B981' },
  { value: 'assertive', label: 'Assertive', description: 'Confident & direct',         icon: '⚡', color: '#F59E0B' },
]

const TEMPLATE_OPTIONS = [
  { id: 'classic', label: 'Classic', Component: CLClassic },
  { id: 'modern',  label: 'Modern',  Component: CLModern },
]

export default function CoverLetterPage() {
  const { resumeData, settings } = useResumeStore()
  const { user, plan, testMode } = useAuthStore()
  const { isPro } = getEntitlements({ user, plan, testMode })

  // ── Form state ─────────────────────────────────────────────────
  const [jobTitle, setJobTitle]               = useState('')
  const [company, setCompany]                 = useState('')
  const [jobDescription, setJobDescription]   = useState('')
  const [tone, setTone]                       = useState('formal')
  const [selectedTemplate, setSelectedTemplate] = useState('classic')
  const [recipientName, setRecipientName]     = useState('Hiring Manager')

  // ── Letter state ───────────────────────────────────────────────
  const [letter, setLetter]       = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied]             = useState(false)
  const [isExporting, setIsExporting]   = useState(false)

  // ── Build candidate data from resume store ─────────────────────
  const p = resumeData?.personal || {}
  const experience = resumeData?.experience || []
  const education  = resumeData?.education  || []
  const skills     = resumeData?.skills     || []

  const candidateName = p.fullName   || ''
  const currentRole   = experience[0]?.title || p.jobTitle || ''
  const yearsExp      = experience.length > 0
    ? `${experience.length * 1.5 | 0}+`
    : '2+'
  const topSkills     = skills.slice(0, 2).map(s => s.items).join(', ') || ''
  const achievement1  = experience[0]?.bullets?.[0] || ''
  const achievement2  = experience[0]?.bullets?.[1] || experience[1]?.bullets?.[0] || ''
  const edu           = education[0] ? `${education[0].degree} from ${education[0].school}` : ''

  // ── Template component lookup ──────────────────────────────────
  const TemplateComponent = TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.Component || CLClassic

  // ── Template data object ───────────────────────────────────────
  const templateData = {
    candidateName,
    candidateEmail   : p.email    || '',
    candidatePhone   : p.phone    || '',
    candidateLocation: p.location || '',
    recipientName,
    company,
    jobTitle,
    letter,
    accentColor      : settings?.accentColor || '#1A56DB',
  }

  // ── Generate cover letter ──────────────────────────────────────
  const handleGenerate = useCallback(async () => {
    if (!jobTitle.trim() || !company.trim()) {
      toast.error('Please fill in Job Title and Company Name first.')
      return
    }

    setIsGenerating(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const jwt = session?.access_token

      const controller = new AbortController()
      const timeoutId  = setTimeout(() => controller.abort(), 60000)

      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-cover-letter`, {
        method : 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': `Bearer ${jwt || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        signal: controller.signal,
        body  : JSON.stringify({
          jobTitle,
          company,
          jobDescription : jobDescription.slice(0, 1500),
          tone,
          resumeData     : {
            name        : candidateName,
            currentRole,
            yearsExp,
            topSkills,
            achievement1,
            achievement2,
            education   : edu,
            location    : p.location || '',
          },
        }),
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || `Generation failed (HTTP ${res.status})`)
      }

      const json = await res.json().catch(() => null)
      if (!json?.ok || !json?.data?.letter) {
        throw new Error(json?.error || 'AI returned empty response. Please try again.')
      }

      setLetter(json.data.letter)
      setWordCount(json.data.wordCount || 0)
      toast.success('Cover letter generated! ✨')

    } catch (err) {
      if (err.name === 'AbortError') {
        toast.error('Generation timed out. Please try again.')
      } else {
        toast.error(err.message || 'Generation failed. Please try again.')
      }
    } finally {
      setIsGenerating(false)
    }
  }, [jobTitle, company, jobDescription, tone, candidateName, currentRole, yearsExp, topSkills, achievement1, achievement2, edu, p.location])

  // ── Copy to clipboard ──────────────────────────────────────────
  const handleCopy = () => {
    if (!letter) { toast.error('Generate a cover letter first!'); return }
    navigator.clipboard.writeText(letter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Copied to clipboard!')
  }

  // ── Download PDF ───────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    if (!isPro) {
      toast.error('PDF download is a Pro feature. Upgrade to download!')
      return
    }
    if (!letter) {
      toast.error('Generate a cover letter first!')
      return
    }

    setIsExporting(true)
    try {
      await exportToPDF(templateData, settings, TemplateComponent, `${candidateName || 'cover'}_cover_letter`, true)
      toast.success('PDF downloaded!')
    } catch (err) {
      toast.error('PDF export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F0F4FF 0%, #F8FAFC 50%, #F0FFF4 100%)' }}>
      {/* Page header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-lg sticky top-[80px] z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200">
              <FileText size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-gray-950 tracking-tight">AI Cover Letter</h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">India-Optimized · GPT-4</p>
            </div>
            {/* "New" badge */}
            <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
              New
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Template selector */}
            <div className="hidden md:flex items-center gap-2 bg-gray-50 rounded-xl p-1 border border-gray-200">
              {TEMPLATE_OPTIONS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    selectedTemplate === t.id
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <Link to="/builder" className="px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-200">
              ← Builder
            </Link>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto flex h-[calc(100vh-144px)] overflow-hidden">
        {/* ── Left panel: Form ─────────────────────────────────── */}
        <div className="w-full md:w-[440px] flex-shrink-0 border-r border-gray-100 overflow-y-auto bg-white">
          <div className="p-6 space-y-5">

            {/* Job info section */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                <Target size={12} /> Job Details
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Job Title *</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">Company Name *</label>
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Infosys, Razorpay, Google India"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1.5">
                    Recipient Name
                    <span className="text-gray-400 font-normal ml-1">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    placeholder="Hiring Manager"
                    className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Job description */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1.5">
                <AlignLeft size={11} />
                Paste Job Description
                <span className="text-gray-400 font-normal">(optional but recommended)</span>
              </label>
              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the job description here for a more tailored letter..."
                rows={5}
                maxLength={2000}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all resize-none"
              />
              <div className="text-right text-[10px] text-gray-400 mt-1">
                {jobDescription.length}/2000
              </div>
            </div>

            {/* Tone selector */}
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-3 flex items-center gap-1.5">
                Writing Tone
                <span className="text-[9px] text-gray-400 font-normal">(affects style &amp; vocabulary)</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {TONE_OPTIONS.map(t => (
                  <button
                    key={t.value}
                    onClick={() => setTone(t.value)}
                    className={`relative px-3 py-3.5 rounded-2xl text-left transition-all border-2 group ${
                      tone === t.value
                        ? 'border-transparent shadow-lg'
                        : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
                    }`}
                    style={tone === t.value ? {
                      background: `linear-gradient(135deg, ${t.color}10 0%, ${t.color}18 100%)`,
                      borderColor: t.color,
                    } : {}}
                  >
                    {/* Active indicator dot */}
                    {tone === t.value && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />
                    )}
                    <div className="text-lg mb-1.5">{t.icon}</div>
                    <div className="text-xs font-black uppercase tracking-wider" style={tone === t.value ? { color: t.color } : { color: '#374151' }}>{t.label}</div>
                    <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Candidate auto-filled from resume */}
            {candidateName && (
              <div className="p-4 bg-brand-50/60 rounded-xl border border-brand-100">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-brand-600 mb-2.5 flex items-center gap-1.5">
                  <User size={10} /> Auto-filled from your resume
                </h3>
                <div className="space-y-1.5 text-xs text-gray-600">
                  {candidateName && <div><span className="font-bold">Name:</span> {candidateName}</div>}
                  {currentRole  && <div><span className="font-bold">Role:</span> {currentRole}</div>}
                  {topSkills    && <div><span className="font-bold">Skills:</span> {topSkills.slice(0, 60)}…</div>}
                  {edu          && <div><span className="font-bold">Education:</span> {edu.slice(0, 50)}…</div>}
                </div>
                <Link to="/builder" className="block mt-2 text-[10px] text-brand-600 font-bold hover:underline">
                  Edit resume data →
                </Link>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !jobTitle || !company}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-wider hover:shadow-xl hover:shadow-violet-200/80 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2.5 active:scale-95 shadow-lg shadow-violet-200/50"
            >
              {isGenerating
                ? <><Loader size={16} className="animate-spin" /> Generating…</>
                : <><Sparkles size={16} /> Generate with AI</>
              }
            </button>

            {isGenerating && (
              <p className="text-center text-xs text-gray-400 animate-pulse">
                AI is crafting your cover letter… (~8-15 seconds)
              </p>
            )}
          </div>
        </div>

        {/* ── Right panel: Preview ─────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          {/* Preview area */}
          <div className="flex-1 overflow-y-auto p-6 flex justify-center">
            <div className="w-full max-w-[794px]">
              {/* Preview container */}
              <div
                className="bg-white shadow-2xl shadow-gray-200 rounded-2xl overflow-hidden"
                style={{ transform: 'scale(0.78)', transformOrigin: 'top center', marginBottom: '-22%' }}
              >
                <TemplateComponent data={templateData} />
              </div>

              {/* Empty state */}
              {!letter && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <div className="w-20 h-20 bg-violet-50 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                    <FileText size={32} className="text-violet-300" />
                  </div>
                  <h3 className="text-xl font-black text-gray-300 tracking-tight">Your cover letter preview</h3>
                  <p className="text-gray-300 text-sm mt-2 max-w-xs">Fill in the form and click "Generate with AI" to create your letter</p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="border-t border-gray-200 bg-white px-6 py-4 flex items-center justify-between gap-4 shadow-lg shadow-gray-100/50">
            {/* Word count */}
            <div className="flex items-center gap-2">
              {letter ? (
                <>
                  <div className={`w-2 h-2 rounded-full ${wordCount >= 250 && wordCount <= 320 ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                  <span className="text-sm font-bold text-gray-700">{wordCount} words</span>
                  <span className="text-xs text-gray-400">(target: 250–320)</span>
                </>
              ) : (
                <span className="text-sm text-gray-400">—</span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Regenerate */}
              {letter && (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={12} className={isGenerating ? 'animate-spin' : ''} />
                  Regenerate
                </button>
              )}

              {/* Copy */}
              <button
                onClick={handleCopy}
                disabled={!letter}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-30"
              >
                {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>

              {/* Download PDF */}
              {isPro ? (
                <button
                  onClick={handleDownloadPDF}
                  disabled={!letter || isExporting}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-gray-950 rounded-xl hover:bg-black transition-all disabled:opacity-40 shadow-lg shadow-gray-300"
                >
                  {isExporting
                    ? <><Loader size={12} className="animate-spin" /> Exporting…</>
                    : <><Download size={12} /> Download PDF</>
                  }
                </button>
              ) : (
                <Link
                  to="/upgrade"
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-lg shadow-amber-200"
                >
                  <Crown size={12} />
                  Upgrade for PDF
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
