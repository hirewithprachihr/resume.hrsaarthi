import { Plus, Trash2, ChevronDown, ChevronUp, GripVertical, Sparkles, Wand2, Check, RefreshCw, X, Lightbulb } from 'lucide-react'
import { useResumeStore } from '../../store/resumeStore'
import { useEntitlements } from '../../utils/entitlements'
import { useState } from 'react'
import { enhanceBullet } from '../../services/aiEnhancer'
import { getBulletSuggestions } from '../../data/contentLibrary'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import ProGate from '../ProGate'
import { clsx } from 'clsx'
import BulletQualityBadge from '../BulletQualityBadge'

export default function ExperienceForm() {
  const { resumeData, addExperience, updateExperience, removeExperience, markAiAssistUsed } = useResumeStore()
  const { isPro } = useEntitlements()
  const [expanded, setExpanded] = useState({})
  const [enhancing, setEnhancing] = useState(null) // { expId, bulletIdx }
  const [variations, setVariations] = useState(null) // { metric, leadership, action }
  const [suggesting, setSuggesting] = useState(null) // expId
  const [suggestFilter, setSuggestFilter] = useState('all') // 'all'|'quantified'|'leadership'|'technical'

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  const updateBullet = (expId, idx, val) => {
    const exp = resumeData.experience.find(e => e.id === expId)
    const bullets = [...(exp.bullets || [])]
    bullets[idx] = val
    updateExperience(expId, { bullets })
  }

  const handleEnhance = async (expId, bulletIdx, text, title, company) => {
    if (!text || text.length < 5) {
      toast.error('Add more detail before enhancing')
      return
    }
    
    setEnhancing({ expId, bulletIdx })
    setVariations(null)
    
    try {
      const results = await enhanceBullet(text, title, company)
      setVariations(results)
    } catch (err) {
      toast.error(err.message)
      setEnhancing(null)
    }
  }

  const applyVariation = (expId, bulletIdx, val) => {
    updateBullet(expId, bulletIdx, val)
    markAiAssistUsed()
    setEnhancing(null)
    setVariations(null)
    toast.success('Achievement upgraded!')
  }

  const addBullet = (expId) => {
    const exp = resumeData.experience.find(e => e.id === expId)
    updateExperience(expId, { bullets: [...(exp.bullets || []), ''] })
  }

  const removeBullet = (expId, idx) => {
    const exp = resumeData.experience.find(e => e.id === expId)
    const bullets = exp.bullets.filter((_, i) => i !== idx)
    updateExperience(expId, { bullets: bullets.length ? bullets : [''] })
  }

  return (
    <div className="space-y-3">
      {resumeData.experience.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-sm text-gray-400 mb-3">No work experience added yet</p>
        </div>
      )}

      {resumeData.experience.map((exp, index) => {
        const isOpen = expanded[exp.id] !== false
        return (
          <div key={exp.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Header */}
            <div
              className="flex items-center gap-2 px-4 py-3 bg-gray-50/50 cursor-pointer hover:bg-gray-100/50 transition-colors"
              onClick={() => toggle(exp.id)}
            >
              <GripVertical size={14} className="text-gray-300 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs uppercase tracking-widest text-gray-900 truncate">{exp.title || 'New Position'}</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate">{exp.company}{exp.company && exp.startDate ? ' • ' : ''}{exp.startDate}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={e => { e.stopPropagation(); removeExperience(exp.id) }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={13} />
                </button>
                {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </div>

            {/* Form fields */}
            {isOpen && (
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`exp-title-${exp.id}`} className="label">Job Title</label>
                    <input id={`exp-title-${exp.id}`} name="title" className="input-field" placeholder="Software Engineer" value={exp.title} onChange={e => updateExperience(exp.id, { title: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor={`exp-company-${exp.id}`} className="label">Company</label>
                    <input id={`exp-company-${exp.id}`} name="company" className="input-field" placeholder="Infosys Ltd." value={exp.company} onChange={e => updateExperience(exp.id, { company: e.target.value })} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`exp-location-${exp.id}`} className="label">Location</label>
                    <input id={`exp-location-${exp.id}`} name="location" className="input-field" placeholder="Bengaluru, Karnataka" value={exp.location} onChange={e => updateExperience(exp.id, { location: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-end">
                    <div>
                      <label htmlFor={`exp-start-${exp.id}`} className="label">Start Date</label>
                      <input id={`exp-start-${exp.id}`} name="startDate" className="input-field" placeholder="Jun 2021" value={exp.startDate} onChange={e => updateExperience(exp.id, { startDate: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor={`exp-end-${exp.id}`} className="label">End Date</label>
                      <input id={`exp-end-${exp.id}`} name="endDate" className="input-field" placeholder="Present" disabled={exp.current} value={exp.current ? 'Present' : exp.endDate} onChange={e => updateExperience(exp.id, { endDate: e.target.value })} />
                    </div>
                  </div>
                </div>
                
                <label htmlFor={`exp-current-${exp.id}`} className="flex items-center gap-2 cursor-pointer self-start mt-1 select-none">
                  <input
                    id={`exp-current-${exp.id}`}
                    name="current"
                    type="checkbox"
                    checked={exp.current}
                    onChange={e => updateExperience(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                    className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">I currently work here</span>
                </label>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                  <div>
                    <label htmlFor={`exp-emp-type-${exp.id}`} className="label">Employment type</label>
                    <select
                      id={`exp-emp-type-${exp.id}`}
                      className="input-field"
                      value={exp.employmentType || 'full_time'}
                      onChange={e => updateExperience(exp.id, { employmentType: e.target.value })}
                    >
                      <option value="full_time">Full-time</option>
                      <option value="contract">Contract</option>
                      <option value="intern">Internship</option>
                      <option value="consulting">Consulting</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor={`exp-team-${exp.id}`} className="label">Team size (optional)</label>
                    <input
                      id={`exp-team-${exp.id}`}
                      className="input-field"
                      placeholder="e.g. 12"
                      inputMode="numeric"
                      value={exp.teamSize ?? ''}
                      onChange={e => updateExperience(exp.id, { teamSize: e.target.value })}
                    />
                  </div>
                </div>

                {/* Bullets */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Achievements & Responsibilities</label>
                    <span className="text-[9px] font-bold text-brand-500 px-2 py-0.5 bg-brand-50 rounded-full">AI Enhanced</span>
                  </div>
                  
                  <div className="space-y-4">
                    {(exp.bullets || ['']).map((bullet, bi) => {
                      const isThisEnhancing = enhancing?.expId === exp.id && enhancing?.bulletIdx === bi
                      return (
                        <div key={bi} className="relative group">
                          <div className="flex gap-3 items-start">
                            <div className="mt-3 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-200" />
                            <div className="flex-1 relative">
                              <textarea
                                id={`exp-bullet-${exp.id}-${bi}`}
                                name="bullet"
                                aria-label="Achievement description"
                                className={clsx(
                                  'w-full p-3 rounded-xl text-sm text-gray-700 bg-gray-50/50 border transition-all resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/10',
                                  isThisEnhancing ? 'border-brand-300 ring-2 ring-brand-500/5' : 'border-transparent hover:border-gray-200 focus:border-brand-400',
                                  bullet.length > 200 && 'border-amber-300 bg-amber-50/30'
                                )}
                                rows={2}
                                placeholder="Describe a key achievement..."
                                value={bullet}
                                onChange={e => {
                                  if (e.target.value.length <= 250) { // Hard limit at 250
                                    updateBullet(exp.id, bi, e.target.value)
                                  }
                                }}
                              />

                              <div className="absolute left-2 -bottom-5">
                                <BulletQualityBadge text={bullet} />
                              </div>
                              
                              <div className="absolute right-2 -bottom-5 flex items-center gap-2">
                                {bullet.length > 150 && (
                                  <span className={clsx("text-[9px] font-bold uppercase tracking-tight", bullet.length > 200 ? "text-amber-500" : "text-gray-400")}>
                                    {bullet.length > 200 ? '⚠️ Too Long for ATS' : `${200 - bullet.length} chars left`}
                                  </span>
                                )}
                              </div>
                              
                              {/* Magic Button */}
                              <div className="absolute right-2 bottom-2 flex gap-1 items-center">
                                {isPro ? (
                                  <button 
                                    onClick={() => handleEnhance(exp.id, bi, bullet, exp.title, exp.company)}
                                    className="p-1.5 bg-white text-brand-600 rounded-lg shadow-sm border border-gray-100 hover:scale-110 active:scale-95 transition-all group/magic"
                                    title="Enhance with AI"
                                  >
                                    <Sparkles size={14} className="group-hover/magic:animate-pulse" />
                                  </button>
                                ) : (
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ProGate feature="AI Achievement Polishing">
                                      <button className="p-1.5 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed">
                                        <Sparkles size={14} />
                                      </button>
                                    </ProGate>
                                  </div>
                                )}
                                
                                {exp.bullets.length > 1 && (
                                  <button onClick={() => removeBullet(exp.id, bi)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* AI Variation Popover */}
                          <AnimatePresence>
                            {isThisEnhancing && (
                              <motion.div 
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="mt-2 ml-4 p-4 bg-white border border-brand-100 rounded-2xl shadow-xl relative z-20 space-y-3"
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-brand-600">
                                    <Wand2 size={12} /> The Alchemist Variations
                                  </div>
                                  <button onClick={() => setEnhancing(null)} className="text-gray-400 hover:text-gray-600 p-1">
                                    <X size={14} />
                                  </button>
                                </div>

                                {!variations ? (
                                  <div className="py-4 flex flex-col items-center justify-center gap-3">
                                    <RefreshCw className="text-brand-400 animate-spin" size={20} />
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Transmuting Achievement...</span>
                                  </div>
                                ) : (
                                  <div className="grid gap-2">
                                    {[
                                      { id: 'metric', label: '📊 Metric Master', val: variations.metric },
                                      { id: 'leadership', label: '💪 Leadership Pro', val: variations.leadership },
                                      { id: 'action', label: '⚡ Action Elite', val: variations.action },
                                    ].map(v => (
                                      <button 
                                        key={v.id}
                                        onClick={() => applyVariation(exp.id, bi, v.val)}
                                        className="text-left p-2.5 rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50/50 transition-all group/var"
                                      >
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">{v.label}</p>
                                        <p className="text-[11px] text-gray-700 leading-relaxed font-medium">{v.val}</p>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                  
                  {/* Suggest Bullets Button + Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => {
                        setSuggesting(suggesting === exp.id ? null : exp.id)
                        setSuggestFilter('all')
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-all"
                    >
                      <Lightbulb size={11} /> Suggest Bullets
                    </button>

                    {/* Suggestion dropdown */}
                    <AnimatePresence>
                      {suggesting === exp.id && (() => {
                        const suggestions = getBulletSuggestions(exp.title || 'Software Engineer', suggestFilter)
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            className="absolute top-full left-0 mt-1 w-[340px] bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden"
                          >
                            {/* Header */}
                            <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Pre-written bullets · {exp.title || 'General'}</span>
                              <button onClick={() => setSuggesting(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={12} />
                              </button>
                            </div>

                            {/* Filter chips */}
                            <div className="flex gap-1.5 px-3 py-2 border-b border-gray-100">
                              {['all', 'quantified', 'leadership', 'technical'].map(f => (
                                <button
                                  key={f}
                                  onClick={() => setSuggestFilter(f)}
                                  className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider transition-all ${
                                    suggestFilter === f
                                      ? 'bg-gray-900 text-white'
                                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                  }`}
                                >
                                  {f}
                                </button>
                              ))}
                            </div>

                            {/* Suggestion list */}
                            <div className="max-h-[260px] overflow-y-auto">
                              {suggestions.slice(0, 5).map((s, si) => (
                                <button
                                  key={si}
                                  onClick={() => {
                                    // Fix #7: single atomic update — no addBullet race
                                    const currentBullets = exp.bullets || []
                                    const emptyIdx = currentBullets.findIndex(b => !b.trim())
                                    let newBullets
                                    if (emptyIdx !== -1) {
                                      newBullets = [...currentBullets]
                                      newBullets[emptyIdx] = s
                                    } else {
                                      newBullets = [...currentBullets, s]
                                    }
                                    updateExperience(exp.id, { bullets: newBullets })
                                    setSuggesting(null)
                                    toast.success('Bullet added!')
                                  }}
                                  className="w-full text-left px-3 py-2.5 text-[11px] text-gray-700 hover:bg-amber-50 border-b border-gray-50 transition-colors flex items-start gap-2 group"
                                >
                                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-300 flex-shrink-0" />
                                  <span className="leading-relaxed">{s}</span>
                                </button>
                              ))}
                            </div>

                            <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
                              <p className="text-[9px] text-gray-400">Click a bullet to insert it · Edit to customize</p>
                            </div>
                          </motion.div>
                        )
                      })()}
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                  <button onClick={() => addBullet(exp.id)} className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-brand-600 hover:bg-brand-50 rounded-xl flex items-center gap-2 transition-all">
                    <Plus size={14} />Add Achievement
                  </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}

      <button onClick={addExperience} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-dashed border-brand-200 text-brand-600 rounded-2xl hover:border-brand-400 hover:bg-brand-50 transition-all group">
        <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus size={18} />
        </div>
        <div className="text-left">
          <div className="font-black text-[11px] uppercase tracking-widest">Add New Position</div>
          <div className="text-[10px] text-brand-400 font-bold tracking-tight">Expand your career timeline</div>
        </div>
      </button>
    </div>
  )
}
