/**
 * CoverLetterPage — Premium AI Cover Letter Generator
 * ─────────────────────────────────────────────────────────────────
 * Implements a split-pane, real-time interactive editor.
 * Features: Inline editing, AI Refinement suite, Glassmorphic UI.
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Copy, Check, Download, FileText, Zap, Loader,
  RefreshCw, Star, Lock, ChevronDown, Target, User, Briefcase,
  AlignLeft, Crown, Wand2, Type, ArrowLeft, Layout, Send,
  Maximize2, Eye, Edit3, Settings, ShieldCheck, Trash2
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useResumeStore } from '../store/resumeStore'
import { useAuthStore } from '../store/authStore'
import { getEntitlements } from '../utils/entitlements'
import { supabase, fetchCoverLetters, saveCoverLetter, deleteCoverLetter } from '../services/supabase'
import { EVENT_NAMES, trackEvent } from '../services/analytics'
import { exportToPDF } from '../utils/pdfExporter'
import CLClassic from '../templates/cover-letter/CLClassic'
import CLModern from '../templates/cover-letter/CLModern'
import ConfirmModal from '../components/ConfirmModal'
import toast from 'react-hot-toast'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

const TONE_OPTIONS = [
  { value: 'formal',    label: 'Formal',    description: 'CEO-ready focus', icon: '👔', color: '#6366F1' },
  { value: 'warm',      label: 'Warm',      description: 'Human-centric',    icon: '✨', color: '#10B981' },
  { value: 'assertive', label: 'Bold',      description: 'Impact-driven',    icon: '⚡', color: '#F59E0B' },
]

const TEMPLATE_OPTIONS = [
  { id: 'modern',  label: 'Modern', icon: <Layout size={14}/>, Component: CLModern },
  { id: 'classic', label: 'Classic', icon: <Type size={14}/>, Component: CLClassic },
]

export default function CoverLetterPage() {
  const navigate = useNavigate()
  const { resumeData, settings, activeResumeId } = useResumeStore()
  const { user, plan, testMode } = useAuthStore()
  const { isPro } = getEntitlements({ user, plan, testMode })

  // ── State ──────────────────────────────────────────────────────
  const [jobTitle, setJobTitle]               = useState('')
  const [company, setCompany]                 = useState('')
  const [jobDescription, setJobDescription]   = useState('')
  const [tone, setTone]                       = useState('formal')
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [recipientName, setRecipientName]     = useState('Hiring Manager')
  const [letter, setLetter]                   = useState('')
  const [isGenerating, setIsGenerating]       = useState(false)
  const [isScanning, setIsScanning]           = useState(false)
  const [copied, setCopied]                   = useState(false)
  const [isExporting, setIsExporting]         = useState(false)
  const [activeTab, setActiveTab]             = useState('details') // 'details' | 'customize'
  const [savedLetters, setSavedLetters]       = useState([])
  const [selectedLetterId, setSelectedLetterId] = useState('')
  const [savingLetter, setSavingLetter]       = useState(false)
  const [showSavedIndicator, setShowSavedIndicator] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [letterToDelete, setLetterToDelete]   = useState(null)

  useEffect(() => {
    if (!user?.id) return
    fetchCoverLetters(user.id).then(setSavedLetters).catch(() => {})
  }, [user?.id])

  const handleSaveVersion = async () => {
    if (!user?.id) {
      toast.error('Sign in to save cover letters to the cloud')
      return
    }
    if (!letter.trim()) {
      toast.error('Generate or write a letter before saving')
      return
    }
    setSavingLetter(true)
    try {
      const row = {
        ...(selectedLetterId ? { id: selectedLetterId } : {}),
        user_id: user.id,
        resume_id: activeResumeId || null,
        title: `${(company || 'Role').slice(0, 60)} · ${(jobTitle || 'Letter').slice(0, 50)}`.slice(0, 120),
        content: letter,
        tone,
        template_id: selectedTemplate,
        company: company || null,
        job_title: jobTitle || null,
      }
      const saved = await saveCoverLetter(row)
      setSelectedLetterId(saved.id)
      const list = await fetchCoverLetters(user.id)
      setSavedLetters(list)
      trackEvent(EVENT_NAMES.COVER_LETTER_SAVED, { id: saved.id })
      
      // Show "Saved ✓" indicator
      setShowSavedIndicator(true)
      setTimeout(() => setShowSavedIndicator(false), 2000)
      
      toast.success('Cover letter saved')
    } catch (e) {
      toast.error(e.message || 'Save failed')
    } finally {
      setSavingLetter(false)
    }
  }

  const loadVersion = (id) => {
    if (!id) {
      setSelectedLetterId('')
      return
    }
    const v = savedLetters.find(x => x.id === id)
    if (!v) return
    setSelectedLetterId(v.id)
    setLetter(v.content || '')
    setTone(v.tone || 'formal')
    setSelectedTemplate(v.template_id || 'modern')
    if (v.company) setCompany(v.company)
    if (v.job_title) setJobTitle(v.job_title)
  }

  const handleDeleteClick = (letterId, e) => {
    e.stopPropagation() // Prevent dropdown from changing selection
    const letter = savedLetters.find(l => l.id === letterId)
    setLetterToDelete(letter)
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!letterToDelete) return
    
    try {
      await deleteCoverLetter(letterToDelete.id)
      
      // Remove from state
      setSavedLetters(prev => prev.filter(l => l.id !== letterToDelete.id))
      
      // If deleted letter was selected, clear selection
      if (selectedLetterId === letterToDelete.id) {
        setSelectedLetterId('')
      }
      
      toast.success('Cover letter deleted')
      trackEvent(EVENT_NAMES.COVER_LETTER_DELETED, { id: letterToDelete.id })
    } catch (e) {
      toast.error(e.message || 'Delete failed')
    } finally {
      setShowDeleteConfirm(false)
      setLetterToDelete(null)
    }
  }

  // ── Derived Data ───────────────────────────────────────────────
  const wordCount = letter.trim() ? letter.trim().split(/\s+/).length : 0
  const templateData = {
    candidateName: resumeData?.personal?.fullName || '',
    candidateEmail: resumeData?.personal?.email || '',
    candidatePhone: resumeData?.personal?.phone || '',
    candidateLocation: resumeData?.personal?.location || '',
    recipientName,
    company,
    jobTitle,
    letter,
    accentColor: settings?.accentColor || '#1A56DB',
    isEditing: true,
    onLetterChange: (val) => setLetter(val)
  }

  const TemplateComponent = TEMPLATE_OPTIONS.find(t => t.id === selectedTemplate)?.Component || CLModern

  // ── Handlers ───────────────────────────────────────────────────
  const handleGenerate = useCallback(async (refineInstruction = '') => {
    if (!jobTitle.trim() || !company.trim()) {
      toast.error('Job Title and Company are required')
      return
    }

    if (refineInstruction) {
      setIsGenerating(true)
    } else {
      setIsScanning(true)
      // Artificial "Deep Scanning" delay for premium feel
      await new Promise(r => setTimeout(r, 1500))
      setIsScanning(false)
      setIsGenerating(true)
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 60000) // 60s timeout

    try {
      // Bypassing supabase.functions.invoke to avoid 'Lock not released' hangs
      // Get session from store state (already synchronized and lock-free)
      const jwt = useAuthStore.getState().accessToken || import.meta.env.VITE_SUPABASE_ANON_KEY

      const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-cover-letter`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        signal: controller.signal,
        body: JSON.stringify({
          jobTitle,
          company,
          jobDescription: jobDescription.slice(0, 2000),
          tone,
          resumeData: {
            name: resumeData?.personal?.fullName,
            currentRole: resumeData?.experience?.[0]?.title,
            topSkills: resumeData?.skills?.slice(0, 3).map(s => s.items).join(', '),
            education: resumeData?.education?.[0]?.school
          },
          existingLetter: letter,
          refineInstruction
        }),
      })

      clearTimeout(timeoutId)
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || `Generation failed (${res.status})`)
      }

      const data = await res.json()
      if (!data?.ok) {
        throw new Error(data?.error || 'AI Generation failed.')
      }

      setLetter(data.data.letter)
      trackEvent(EVENT_NAMES.COVER_LETTER_GENERATED, { company, jobTitle, refine: !!refineInstruction })
      toast.success(refineInstruction ? 'Refined successfully! ✨' : 'Generated successfully! ✨')
    } catch (err) {
      clearTimeout(timeoutId)
      if (err.name === 'AbortError') {
        toast.error('Generation timed out. Please try again.')
      } else {
        toast.error(err.message || 'AI Generation failed. Please check your connection.')
      }
      console.error('Generation Error Detail:', err)
    } finally {
      setIsGenerating(false)
    }
  }, [jobTitle, company, jobDescription, tone, resumeData, letter])

  const handleDownload = async () => {
    if (!isPro) {
      toast.error('Upgrade to Pro to download PDFs')
      return
    }
    setIsExporting(true)
    try {
      await exportToPDF(templateData, settings, TemplateComponent, `${company}_CoverLetter`, true)
      toast.success('Cover Letter downloaded!')
    } catch (err) {
      toast.error('Download failed')
    } finally {
      setIsExporting(false)
    }
  }

  // ── UI Components ──────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-[#FDFDFF] overflow-hidden">
      {/* ── Left Sidebar (Glassmorphic) ── */}
      <aside className="w-[400px] border-r border-[#F0F2F5] bg-white flex flex-col z-20 shadow-xl shadow-slate-200/20">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-[#F8FAFC]">
          <div className="flex items-center justify-between mb-6">
            <button 
              onClick={() => navigate('/builder')}
              className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100"
            >
              <ArrowLeft size={16} className="text-slate-500" />
            </button>
            <div className="flex bg-slate-100 rounded-xl p-1">
              {['details', 'customize'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    activeTab === tab ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-200">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-none mb-1">Impact Letter</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Synthesis Engine</p>
            </div>
          </div>

          {user && (
            <div className="mt-4 flex flex-col gap-2">
              <label htmlFor="cl-saved-version" className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Saved versions</label>
              <div className="flex gap-2">
                <div className="flex-1 min-w-0 relative">
                  <select
                    id="cl-saved-version"
                    value={selectedLetterId}
                    onChange={e => loadVersion(e.target.value)}
                    className="w-full text-xs font-semibold rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-10 text-slate-800 appearance-none"
                  >
                    <option value="">Current draft (unsaved)</option>
                    {savedLetters.map(s => {
                      const date = new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      const displayText = `${s.title || 'Untitled'} - ${s.company || 'No Company'} (${date})`
                      return <option key={s.id} value={s.id}>{displayText}</option>
                    })}
                  </select>
                  {selectedLetterId && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteClick(selectedLetterId, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Delete this cover letter"
                    >
                      <Trash2 size={14} className="text-slate-400 group-hover:text-red-600" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleSaveVersion}
                  disabled={savingLetter}
                  className="shrink-0 px-4 py-2 rounded-xl bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-40 relative"
                >
                  {savingLetter ? (
                    <Loader size={12} className="animate-spin" />
                  ) : showSavedIndicator ? (
                    <span className="flex items-center gap-1">
                      <Check size={12} /> Saved
                    </span>
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          {activeTab === 'details' ? (
            <>
              {/* Job Info Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Target size={14} />
                  <h3 className="text-[11px] font-black uppercase tracking-widest">Job Landscape</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label htmlFor="cl-job-title" className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1 cursor-pointer">Target Role</label>
                    <input 
                      id="cl-job-title"
                      name="jobTitle"
                      type="text" 
                      placeholder="e.g. Lead Architect"
                      value={jobTitle}
                      onChange={e => setJobTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="cl-company" className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1 cursor-pointer">Company</label>
                    <input 
                      id="cl-company"
                      name="company"
                      type="text" 
                      placeholder="e.g. Apple INC"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all outline-none"
                    />
                  </div>
                </div>
              </section>

              {/* Job Description Section */}
                <div className="relative space-y-1.5">
                  <label htmlFor="cl-job-description" className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1 cursor-pointer">Requirements (Optional)</label>
                  <textarea 
                    id="cl-job-description"
                    name="jobDescription"
                    rows={6}
                    placeholder="Paste the job description here for hyper-tailored results..."
                    value={jobDescription}
                    onChange={e => setJobDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm text-slate-800 placeholder:text-slate-300 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all outline-none resize-none"
                  />
                  <div className="absolute bottom-3 right-3 text-[9px] font-bold text-slate-300">
                    {jobDescription.length}/2000
                  </div>
                </div>
            </>
          ) : (
            <>
              {/* Customize Tab: Templates & Tones */}
              <section className="space-y-6">
                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Layout size={14} /> Structural DNA
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {TEMPLATE_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedTemplate(opt.id)}
                        className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-2 ${
                          selectedTemplate === opt.id 
                            ? 'border-violet-600 bg-violet-50/50 text-violet-700 shadow-sm' 
                            : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        {opt.icon}
                        <span className="text-xs font-bold">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Wand2 size={14} /> Professional Voice
                  </h3>
                  <div className="space-y-2">
                    {TONE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setTone(opt.value)}
                        className={`w-full p-4 rounded-3xl border-2 text-left transition-all relative overflow-hidden group ${
                          tone === opt.value 
                            ? 'border-violet-600 bg-white shadow-lg shadow-violet-100' 
                            : 'border-slate-100 bg-white hover:border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-lg">{opt.icon}</span>
                          {tone === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />}
                        </div>
                        <div className={`text-xs font-black uppercase tracking-wider ${tone === opt.value ? 'text-slate-900' : 'text-slate-500'}`}>
                          {opt.label}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">{opt.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Sidebar Footer Action */}
        <div className="p-6 border-t border-[#F8FAFC] bg-slate-50/50">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || isScanning}
            className="w-full py-4 bg-[#0F172A] text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3 relative overflow-hidden group shadow-xl shadow-slate-200"
          >
            {isGenerating || isScanning ? (
              <Loader size={16} className="animate-spin text-violet-400" />
            ) : (
              <>
                <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                Synthesize Letter
              </>
            )}
            
            {/* Gloss shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </div>
      </aside>

      {/* ── Main Canvas (Preview/Editor) ── */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#F0F2F5]">
        {/* Top Control Bar */}
        <header className="h-16 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md px-8 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${wordCount > 100 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <span className="text-[11px] font-black text-slate-950 uppercase tracking-widest">{wordCount} Words</span>
            </div>
            <div className="w-px h-6 bg-slate-100" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-50 rounded-full border border-brand-100">
               <ShieldCheck size={12} className="text-brand-600" />
               <span className="text-[10px] font-black text-brand-700 uppercase tracking-widest">Readable layout</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                navigator.clipboard.writeText(letter)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
                toast.success('Copied to clipboard')
              }}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-all text-slate-600 border border-slate-100 relative"
            >
              {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
            </button>
            <button 
              onClick={handleDownload}
              disabled={!letter || isExporting}
              className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white rounded-xl font-bold text-xs hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 disabled:opacity-50"
            >
              {isExporting ? <Loader size={14} className="animate-spin" /> : <Download size={14} />}
              Download PDF
            </button>
            {!isPro && (
              <Link to="/upgrade" className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white rounded-xl font-bold text-xs hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 uppercase tracking-widest">
                <Crown size={14} /> Pro
              </Link>
            )}
          </div>
        </header>

        {/* Scrollable Paper Area */}
        <div className="flex-1 overflow-y-auto p-12 flex justify-center custom-scrollbar">
          <div className="w-full max-w-[794px] relative">
            {/* Holographic Scanning Overlay */}
            <AnimatePresence>
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-40 bg-white/40 backdrop-blur-[2px] rounded-2xl overflow-hidden flex flex-col items-center justify-center"
                >
                  <div className="w-full h-1 bg-violet-100 absolute top-0 overflow-hidden">
                    <motion.div 
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      className="w-1/3 h-full bg-violet-600 blur-[4px]"
                    />
                  </div>
                  <div className="text-center p-8 bg-white/90 shadow-2xl rounded-3xl border border-violet-100 max-w-sm">
                    <div className="relative w-16 h-16 mx-auto mb-6">
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-dashed border-violet-600 opacity-20"
                      />
                      <div className="absolute inset-2 rounded-full border-2 border-violet-600 animate-pulse flex items-center justify-center">
                        <Target size={24} className="text-violet-600" />
                      </div>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 mb-2">Analyzing Job DNA</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">Synthesizing personal achievements with job requirements for maximum impact...</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* AI Generation State */}
            <AnimatePresence>
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 z-30 bg-white/40 backdrop-blur-[1px] flex items-center justify-center"
                >
                  <div className="flex flex-col items-center gap-4">
                     <div className="p-4 bg-white shadow-2xl rounded-3xl border border-slate-100">
                       <Loader size={32} className="animate-spin text-violet-600" />
                     </div>
                     <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 animate-pulse">Drafting Masterpiece</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* The Actual Document Canvas */}
            <motion.div 
              initial={false}
              animate={isGenerating ? { scale: 0.98, opacity: 0.8 } : { scale: 1, opacity: 1 }}
              className={`bg-white shadow-2xl shadow-slate-300/50 rounded-2xl overflow-hidden transition-all duration-300 transform-gpu relative ${!letter ? 'h-[1123px]' : ''}`}
            >
              {/* Paper Background Visuals */}
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <FileText size={400} />
              </div>
              
              {/* Template Render */}
              <TemplateComponent data={templateData} />

              {/* JD Linkage Indicator (Subtle badge on paper) */}
              {jobDescription && !letter && (
                <div className="absolute top-8 left-8 flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 animate-pulse-subtle">
                  <Target size={12} />
                  <span className="text-[10px] font-black uppercase tracking-widest">JD Sync: Active</span>
                </div>
              )}

              {/* Toolbar for AI Refinement (Visible when text is selected or letter exists) */}
              <AnimatePresence>
                {letter && !isGenerating && !isScanning && (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl z-10 border border-white/10"
                  >
                    <div className="flex items-center gap-2 border-r border-white/10 pr-6">
                       <Wand2 size={14} className="text-violet-400" />
                       <span className="text-[10px] font-black uppercase tracking-widest">AI Magic</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <button 
                         onClick={() => handleGenerate()} 
                         className="text-[10px] font-black uppercase tracking-widest hover:text-violet-400 transition-colors flex items-center gap-1.5"
                       >
                         <RefreshCw size={10} className={isGenerating ? 'animate-spin' : ''} /> Regenerate
                       </button>
                       <button 
                         onClick={() => handleGenerate('Make it shorter and more concise')}
                         className="text-[10px] font-black uppercase tracking-widest hover:text-violet-400 transition-colors flex items-center gap-1.5"
                       >
                         <Zap size={10} /> Shorten
                       </button>
                       <button 
                         onClick={() => handleGenerate('Make it more professional and executive-level')}
                         className="text-[10px] font-black uppercase tracking-widest hover:text-violet-400 transition-colors flex items-center gap-1.5"
                       >
                         <Briefcase size={10} /> Professionalize
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Empty State Mockup - Interactive */}
            {!letter && !isGenerating && !isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="opacity-5 mb-8 pointer-events-none">
                  <FileText size={160} />
                </div>
                <h3 className="text-4xl font-black text-slate-100 uppercase tracking-tighter mb-12 pointer-events-none">Your Impact Letter</h3>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex flex-col items-center gap-4 z-10"
                >
                  <button 
                    onClick={() => handleGenerate()}
                    className="flex items-center gap-3 px-10 py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:border-violet-600 hover:text-violet-600 transition-all shadow-2xl shadow-slate-200 active:scale-95 group"
                  >
                    <Sparkles size={20} className="text-violet-500 group-hover:rotate-12 transition-transform" />
                    Draft with AI
                  </button>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or start typing directly on the paper</p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── Global Styles for Custom Scrollbar ── */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 99px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete this cover letter?"
        message={letterToDelete ? `"${letterToDelete.title}" will be permanently deleted.` : ''}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        danger
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowDeleteConfirm(false)
          setLetterToDelete(null)
        }}
      />
    </div>
  )
}
