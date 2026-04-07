import { useState, useRef, useCallback } from 'react'
import { Sparkles, CheckCircle, AlertCircle, RefreshCw, BookOpen, X, Camera, Github, Twitter, Trash2 } from 'lucide-react'
import { useResumeStore } from '../../store/resumeStore'
import { useAuthStore } from '../../store/authStore'
import { generateSummary } from '../../services/aiEnhancer'
import { getSummaryTemplates } from '../../data/contentLibrary'
import { AnimatePresence, motion } from 'framer-motion'
import { compressPhoto } from '../../utils/imageCompressor'
import ProGate, { ProBadge } from '../ProGate'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

// ── Summary quality thresholds ────────────────────────────────────
function getSummaryQuality(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  if (words === 0) return { label: '', color: '', bg: '' }
  if (words < 20)  return { label: 'Too brief', color: '#EF4444', bg: '#FEF2F2', words }
  if (words < 50)  return { label: 'Could improve', color: '#F59E0B', bg: '#FFFBEB', words }
  if (words <= 100) return { label: 'Excellent', color: '#10B981', bg: '#F0FDF4', words }
  return { label: 'Too long', color: '#F59E0B', bg: '#FFFBEB', words }
}

function isValidLinkedIn(url) {
  if (!url) return true // empty is fine, not required
  return url.includes('linkedin.com/in/') || url.startsWith('linkedin.com/in/') || url.startsWith('www.linkedin.com/in/')
}

export default function PersonalInfoForm() {
  const { resumeData, updatePersonal } = useResumeStore()
  const { plan, testMode } = useAuthStore()
  const { personal } = resumeData

  const [generatingSummary, setGeneratingSummary] = useState(false)
  const [showExamples, setShowExamples]           = useState(false)
  const [photoUploading, setPhotoUploading]       = useState(false)
  const fileInputRef = useRef(null)

  // ── Photo upload & compress ─────────────────────────────────────
  const handlePhotoChange = useCallback(async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPEG/PNG/WebP)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo too large. Please use an image under 5MB.')
      return
    }
    setPhotoUploading(true)
    try {
      const dataUrl = await compressPhoto(file, 300, 0.82)
      updatePersonal({ photo: dataUrl })
      toast.success('Photo uploaded!')
    } catch {
      toast.error('Failed to process photo. Try a different image.')
    } finally {
      setPhotoUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }, [updatePersonal])

  const fields = [
    [{ key: 'fullName', label: 'Full Name', placeholder: 'Rahul Sharma', type: 'text', span: true }],
    [{ key: 'jobTitle', label: 'Job Title / Role', placeholder: 'Senior Software Engineer', type: 'text', span: true }],
    [
      { key: 'email',   label: 'Email',  placeholder: 'rahul@email.com',     type: 'email' },
      { key: 'phone',   label: 'Phone',  placeholder: '+91 98765 43210',     type: 'tel'   },
    ],
    [
      { key: 'location', label: 'Location',     placeholder: 'Mumbai, Maharashtra',  type: 'text' },
      { key: 'linkedin', label: 'LinkedIn URL',  placeholder: 'linkedin.com/in/rahul', type: 'url'  },
    ],
    [
      { key: 'website', label: 'Portfolio / Website', placeholder: 'rahul.dev',   type: 'url' },
      { key: 'github',  label: 'GitHub',               placeholder: 'github.com/rahulsharma', type: 'url' },
    ],
    [{ key: 'twitter', label: 'Twitter / X', placeholder: 'twitter.com/rahulsharma', type: 'url', span: true }],
  ]

  const summaryQuality = getSummaryQuality(personal.summary || '')
  const linkedInValid  = isValidLinkedIn(personal.linkedin || '')
  const isPro = plan === 'pro' || testMode

  const handleGenerateSummary = async () => {
    if (!isPro) return
    if (!resumeData.personal.jobTitle && resumeData.experience.length === 0) {
      toast.error('Add your job title or some work experience first')
      return
    }
    setGeneratingSummary(true)
    try {
      const summary = await generateSummary(resumeData)
      updatePersonal({ summary })
      toast.success('AI summary generated!')
    } catch (err) {
      toast.error(err.message || 'AI generation failed. Check your API key.')
    } finally {
      setGeneratingSummary(false)
    }
  }

  return (
    <div className="space-y-4">

      {/* ── Photo Upload Block ────────────────────────────────── */}
      <div className="flex items-start gap-4 p-4 bg-gray-50/60 rounded-2xl border border-gray-100">
        {/* Photo circle */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center">
            {personal.photo ? (
              <img
                src={personal.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera size={24} className="text-gray-300" />
            )}
            {photoUploading && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                <RefreshCw size={16} className="text-brand-500 animate-spin" />
              </div>
            )}
          </div>
          {personal.photo && (
            <button
              onClick={() => updatePersonal({ photo: '' })}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
              title="Remove photo"
            >
              <Trash2 size={9} />
            </button>
          )}
        </div>

        {/* Upload controls */}
        <div className="flex-1">
          <p className="text-xs font-black text-gray-900 mb-0.5">Profile Photo</p>
          <p className="text-[10px] text-gray-400 mb-2.5">Square photo · JPEG/PNG · max 5MB · Auto-compressed</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            id="personal-photo-input"
            onChange={handlePhotoChange}
          />
          <label
            htmlFor="personal-photo-input"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[10px] font-black rounded-xl cursor-pointer hover:border-brand-300 hover:text-brand-600 transition-all uppercase tracking-wider"
          >
            <Camera size={11} /> {personal.photo ? 'Change Photo' : 'Upload Photo'}
          </label>
          {!isPro && (
            <p className="text-[9px] text-amber-500 mt-1 font-medium">✓ Free — photo shows on supported templates</p>
          )}
        </div>
      </div>

      {fields.map((row, ri) => (
        <div key={ri} className={`grid gap-3 ${row[0].span ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {row.map(({ key, label, placeholder, type }) => (
            <div key={key}>
              <label htmlFor={`personal-${key}`} className="label">{label}</label>
              <input
                id={`personal-${key}`}
                name={`personal-${key}`}
                type={type}
                className={clsx(
                  'input-field',
                  key === 'linkedin' && personal.linkedin && !linkedInValid && 'border-amber-300 focus:border-amber-400 focus:ring-amber-100'
                )}
                placeholder={placeholder}
                value={personal[key] || ''}
                onChange={e => updatePersonal({ [key]: e.target.value })}
              />
              {/* LinkedIn validation warning */}
              {key === 'linkedin' && personal.linkedin && !linkedInValid && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle size={11} className="text-amber-500 flex-shrink-0" />
                  <span className="text-[10px] text-amber-600 font-medium">Use format: linkedin.com/in/yourname</span>
                </div>
              )}
              {key === 'linkedin' && personal.linkedin && linkedInValid && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle size={11} className="text-emerald-500 flex-shrink-0" />
                  <span className="text-[10px] text-emerald-600 font-medium">Valid LinkedIn URL</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}

      {/* Professional Summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="personal-summary" className="label mb-0">Professional Summary</label>
          <div className="flex items-center gap-2">
            {/* Examples button */}
            <div className="relative">
              <button
                onClick={() => setShowExamples(!showExamples)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-black rounded-xl hover:bg-amber-100 transition-all uppercase tracking-wider"
              >
                <BookOpen size={11} /> Examples
              </button>

              {/* Examples dropdown */}
              <AnimatePresence>
                {showExamples && (() => {
                  const templates = getSummaryTemplates(personal.jobTitle || '', resumeData)
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="absolute right-0 top-full mt-1 w-[320px] bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Summary examples · {personal.jobTitle || 'Your Role'}</span>
                        <button onClick={() => setShowExamples(false)} className="text-gray-400 hover:text-gray-600">
                          <X size={12} />
                        </button>
                      </div>

                      <div className="divide-y divide-gray-50">
                        {templates.map((t, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              updatePersonal({ summary: t })
                              setShowExamples(false)
                              toast.success('Summary applied! Edit to customize.')
                            }}
                            className="w-full text-left px-3 py-3 text-[11px] text-gray-700 hover:bg-amber-50/60 transition-colors"
                          >
                            <div className="font-black text-[8px] uppercase tracking-widest text-gray-400 mb-1">Variation {i + 1}</div>
                            <p className="leading-relaxed">{t}</p>
                          </button>
                        ))}
                      </div>

                      <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
                        <p className="text-[9px] text-gray-400">Click to apply · Edit to make it yours</p>
                      </div>
                    </motion.div>
                  )
                })()}
              </AnimatePresence>
            </div>

            {isPro ? (
              <button
                onClick={handleGenerateSummary}
                disabled={generatingSummary}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-[10px] font-black rounded-xl hover:shadow-md transition-all disabled:opacity-60 uppercase tracking-wider"
              >
                {generatingSummary
                  ? <><RefreshCw size={11} className="animate-spin" /> Generating…</>
                  : <><Sparkles size={11} /> AI Generate</>
                }
              </button>
            ) : (
              <ProGate feature="AI Summary Generator">
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-400 text-[10px] font-black rounded-xl cursor-not-allowed uppercase tracking-wider">
                  <Sparkles size={11} /> AI Generate <ProBadge />
                </button>
              </ProGate>
            )}
          </div>
        </div>

        <textarea
          id="personal-summary"
          name="personal-summary"
          className="input-field resize-none"
          rows={4}
          placeholder="Results-driven Software Engineer with 5+ years of experience building scalable web applications. Led teams of 8+ engineers, improved system performance by 40%, and delivered 12 production features. Passionate about clean code and impactful products."
          value={personal.summary || ''}
          onChange={e => updatePersonal({ summary: e.target.value })}
        />

        {/* Summary quality indicator */}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-2">
            {summaryQuality.label && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ color: summaryQuality.color, background: summaryQuality.bg }}
              >
                {summaryQuality.label}
              </span>
            )}
            <span className="text-[11px] text-gray-400">
              {summaryQuality.words ? `${summaryQuality.words} words` : 'Tip: 50–100 words works best'}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">{(personal.summary || '').length} chars</span>
        </div>

        {/* Word count progress bar: target 50–100 words */}
        {summaryQuality.words > 0 && (
          <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width     : `${Math.min(100, (summaryQuality.words / 100) * 100)}%`,
                background: summaryQuality.color,
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
