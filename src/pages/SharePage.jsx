import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getPublicResume } from '../services/supabase'
import { getTemplate } from '../templates/registry'
import { FileText, Download, Briefcase, ExternalLink, ShieldCheck, Loader, ArrowLeft } from 'lucide-react'
import ErrorBoundary from '../components/ErrorBoundary'
import PageLoader from '../components/PageLoader'
import { clsx } from 'clsx'

export default function SharePage() {
  const { id } = useParams()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadResume() {
      try {
        const data = await getPublicResume(id)
        setResume(data)
      } catch (err) {
        setError(err.message === 'JSON object requested, but no rows were returned' 
          ? 'This resume is either private or does not exist.' 
          : 'Could not load resume.')
      } finally {
        setLoading(false)
      }
    }
    loadResume()
  }, [id])

  if (loading) return <PageLoader />

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={40} className="text-red-400" />
          </div>
          <h1 className="font-display text-2xl text-gray-900 mb-2">Resume Not Found</h1>
          <p className="text-gray-500 mb-8">{error}</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const { data, settings } = resume
  const tpl = getTemplate(settings.templateId)
  const ResumeComponent = tpl.component

  return (
    <div className="min-h-screen bg-[#F3F4F6] pb-20">
      {/* Floating Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-200">
            <FileText size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-900 leading-none">{data.personal.fullName || 'Professional Resume'}</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Verified via HR Saarthi</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`mailto:${data.personal.email}`}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black transition-all shadow-xl shadow-gray-200"
          >
            <Briefcase size={14} /> Hire Me
          </a>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-50 transition-all"
          >
            <Download size={14} /> PDF
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 pt-10 flex flex-col items-center">
        {/* Verification Badge */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-[10px] font-black uppercase tracking-widest shadow-sm">
          <ShieldCheck size={14} /> Authentic Resume Document
        </div>

        {/* Resume Canvas */}
        <div className="bg-white shadow-2xl shadow-gray-200/50 rounded-sm relative overflow-hidden ring-1 ring-gray-200">
          <div className="w-[794px] bg-white">
            <ErrorBoundary>
              <ResumeComponent data={data} settings={settings} />
            </ErrorBoundary>
          </div>
        </div>

        {/* Footer Watermark */}
        <div className="mt-12 text-center">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Resumed Hosted with</p>
          <Link to="/" className="inline-flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
             <div className="w-6 h-6 bg-brand-600 rounded-md flex items-center justify-center">
               <FileText size={12} className="text-white" />
             </div>
             <span className="font-display text-sm text-gray-900">HR Saarthi</span>
          </Link>
          <p className="text-[10px] text-gray-400 mt-4 leading-relaxed max-w-xs mx-auto italic">
            This resume was generated using our award-winning ATS technology. Build yours for free at hrsaarthi.com
          </p>
        </div>
      </div>

      {/* Mobile Hire CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:hidden z-50">
        <a 
          href={`mailto:${data.personal.email}`}
          className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-2xl shadow-black/20 text-sm uppercase tracking-widest"
        >
          <Briefcase size={18} /> Hire Now
        </a>
      </div>
    </div>
  )
}
