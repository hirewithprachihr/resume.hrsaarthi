import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Upload, FileText, Loader, CheckCircle, AlertCircle, Sparkles, Shield, Lock } from 'lucide-react'
import { parseResumeWithAI } from '../services/resumeParser'
import { useResumeStore } from '../store/resumeStore'
import { useAuthStore } from '../store/authStore'
import { useEntitlements } from '../utils/entitlements'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function UploadResumeModal({ onClose }) {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('idle') // idle | parsing | success | error
  const [error, setError] = useState('')
  const [consentChecked, setConsentChecked] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('Reading file...')
  const fileRef = useRef(null)
  const { fillFromParsed, markAiAssistUsed } = useResumeStore()
  const { plan, testMode } = useAuthStore()
  const { isPro } = useEntitlements()

  const handleFile = (f) => {
    if (!f) return
    if (f.size > 5 * 1024 * 1024) { setError('File too large. Max 5MB.'); return }
    const validTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ]
    const validExt = f.name.endsWith('.pdf') || f.name.endsWith('.docx') || f.name.endsWith('.txt')
    if (!validTypes.includes(f.type) && !validExt) {
      setError('Only PDF, DOCX, or TXT files are supported.'); return
    }
    setFile(f); setError('')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const handleParse = async () => {
    if (!file) return
    if (!consentChecked) {
      setError('Please consent to secure server processing before continuing.')
      return
    }

    // Pro gate — respects plan, testMode, AND active launch trial
    if (!isPro) {
      toast.error('AI Resume Parse is a Pro feature. Upgrade to access it.')
      return
    }

    setStatus('parsing')
    setProgress(0)

    // Realistic progress steps with labels
    const steps = [
      { pct: 15, label: 'Reading file...' },
      { pct: 35, label: 'Extracting text...' },
      { pct: 55, label: 'Sending to AI engine...' },
      { pct: 75, label: 'Parsing structure...' },
      { pct: 85, label: 'Organizing data...' },
    ]
    let stepIdx = 0
    const timer = setInterval(() => {
      if (stepIdx < steps.length) {
        setProgress(steps[stepIdx].pct)
        setProgressLabel(steps[stepIdx].label)
        stepIdx++
      } else {
        // Progress crawl: move slowly from 85% to 98%
        setProgress(prev => {
          if (prev < 98) {
            if (prev > 90) setProgressLabel('Finalizing structure...')
            else setProgressLabel('AI logic thinking...')
            return prev + 1
          }
          return prev
        })
      }
    }, 1500) // Slower intervals for a steadier feel

    // Retry once on failure (handles edge function cold starts)
    let parsed = null
    let lastErr = null
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        parsed = await parseResumeWithAI(file)
        break
      } catch (err) {
        lastErr = err
        if (attempt === 1) {
          setProgressLabel('Retrying...')
          await new Promise(r => setTimeout(r, 1500))
        } else {
          // Final failure: stop the timer immediately
          clearInterval(timer)
        }
      }
    }

    clearInterval(timer)

    if (parsed) {
      try {
        fillFromParsed(parsed)
        markAiAssistUsed()
        setProgress(100)
        setProgressLabel('Complete!')
        setStatus('success')
        toast.success('Resume parsed successfully! Builder auto-filled.')
        setTimeout(onClose, 1800)
      } catch (ex) {
        console.error('[UploadResumeModal] Error during fillFromParsed:', ex)
        setStatus('error')
        setError('Failed to merge AI data. Please refresh the page and try again.')
      }
    } else {
      setStatus('error')
      setError(lastErr?.message || 'AI parsing failed. Try a different file or format.')
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[2rem] shadow-premium w-full max-w-lg overflow-hidden border border-gray-100" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-10 pb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-100">
                <Sparkles size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-950 tracking-tight">AI Resume Intelligence</h2>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1">Upload & Auto-Fill</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-full transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="px-10 pb-10 space-y-8">
          {/* Drop zone */}
          {status === 'idle' && (
            <motion.div
              layout
              className={`group relative border-2 border-dashed rounded-[1.75rem] p-12 text-center cursor-pointer transition-all duration-500 ${file ? 'border-brand-500 bg-brand-50/50' : 'border-gray-100 bg-gray-50/30 hover:bg-white hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-100/50'}`}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                id="resume-file-upload"
                name="resume-file"
                ref={fileRef}
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={e => handleFile(e.target.files[0])}
              />
              {file ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-brand-100">
                    <FileText size={32} className="text-brand-600" />
                  </div>
                  <div>
                    <span className="block font-black text-gray-900 text-lg leading-tight">{file.name}</span>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-2 block">{(file.size / 1024).toFixed(1)} KB • Click to Replace</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-5">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center border border-gray-100 group-hover:scale-110 group-hover:shadow-lg transition-all duration-500">
                    <Upload size={32} className="text-gray-300 group-hover:text-brand-500 transition-colors" />
                  </div>
                  <div>
                    <span className="block font-bold text-gray-900 text-lg">Select Your Document</span>
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 block">PDF · DOCX · TXT • Maximum 5MB</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Parsing progress */}
          {status === 'parsing' && (
            <div className="py-8 space-y-8">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <Loader size={20} className="text-brand-600 animate-spin" />
                    <span className="text-xl font-black text-gray-950 tracking-tight">AI Decoding...</span>
                  </div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.15em]">{progressLabel}</p>
                </div>
                <span className="text-3xl font-black text-brand-600">{progress}%</span>
              </div>
              <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="bg-brand-600 h-full rounded-full shadow-lg shadow-brand-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                  <div className="h-2 bg-brand-100 rounded w-1/2 mb-2 animate-pulse" />
                  <div className="h-1.5 bg-gray-200 rounded w-full animate-pulse" />
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100/50">
                  <div className="h-2 bg-brand-100 rounded w-1/2 mb-2 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="h-1.5 bg-gray-200 rounded w-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          {/* Success */}
          {status === 'success' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 flex flex-col items-center gap-6"
            >
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-inner">
                <CheckCircle size={48} />
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black text-gray-950 tracking-tight">Intelligence Sync Successful</h3>
                <p className="text-sm text-gray-500 font-medium mt-2">Personalizing your builder experience now...</p>
              </div>
            </motion.div>
          )}

          {/* Error */}
          {(error || status === 'error') && (
            <motion.div 
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-start gap-4 p-5 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800"
            >
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-sm block uppercase tracking-wider mb-1">Analysis Failed</span>
                <p className="text-xs font-medium leading-relaxed opacity-80">{error || 'Unable to connect to AI engine. Please verify your environment configuration.'}</p>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          {status === 'idle' && (
            <div className="flex gap-4">
              <button onClick={onClose} className="flex-1 px-8 py-4 text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100">
                Discard
              </button>
              <button
                onClick={handleParse}
                disabled={!file || !consentChecked}
                className="flex-2 px-10 py-4 text-xs font-black uppercase tracking-widest text-white bg-gray-950 rounded-2xl hover:bg-black hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-30 disabled:translate-y-0 flex items-center justify-center gap-3 active:scale-95 shadow-premium"
              >
                <Sparkles size={16} />Extract with AI
              </button>
            </div>
          )}
          {status === 'error' && (
            <button onClick={() => { setStatus('idle'); setError('') }} className="w-full px-8 py-4 text-xs font-black uppercase tracking-widest text-gray-900 bg-gray-50 rounded-2xl hover:bg-gray-100 border border-gray-100">
              Re-attempt Analysis
            </button>
          )}

          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] bg-gray-50 px-4 py-2 rounded-full border border-gray-100/50">
              <Shield size={10} className="text-emerald-500" /> Encrypted in transit • Processed securely on servers
            </span>
          </div>

          {status === 'idle' && (
            <label htmlFor="data-consent-checkbox" className="flex items-start gap-2.5 text-[11px] text-gray-500 leading-relaxed cursor-pointer">
              <input
                id="data-consent-checkbox"
                name="data-consent"
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-brand-600 rounded border-gray-300"
              />
              <span>
                I consent to securely processing this file on server infrastructure to extract resume fields.
              </span>
            </label>
          )}
        </div>
      </motion.div>
    </div>
  )
}
