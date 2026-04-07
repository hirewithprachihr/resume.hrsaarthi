import { useEffect, useState, useMemo } from 'react'
import { Search, Download, Filter, Database, MapPin, Briefcase, Clock, Phone, Mail, Building2, Eye } from 'lucide-react'
import { fetchAllResumes, fetchAllUsers } from '../../services/adminApi'
import toast from 'react-hot-toast'

const EXP_BUCKETS = ['Fresher', '0-1 yr', '1-3 yrs', '3-5 yrs', '5-10 yrs', '10+ yrs']

function expLabel(years) {
  const y = parseFloat(years) || 0
  if (y === 0)  return 'Fresher'
  if (y <= 1)   return '0-1 yr'
  if (y <= 3)   return '1-3 yrs'
  if (y <= 5)   return '3-5 yrs'
  if (y <= 10)  return '5-10 yrs'
  return '10+ yrs'
}

function totalExpYears(experience = []) {
  let total = 0
  for (const exp of experience) {
    const start = exp.startDate ? new Date(exp.startDate + '-01') : null
    const end   = exp.current ? new Date() : (exp.endDate ? new Date(exp.endDate + '-01') : null)
    if (start && end) total += (end - start) / (365.25 * 24 * 3600 * 1000)
  }
  return Math.round(total * 10) / 10
}

export default function AdminResumeDatabase() {
  const [resumes, setResumes]   = useState([])
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filterExp, setFilterExp]   = useState('all')
  const [filterCity, setFilterCity] = useState('all')
  const [filterDept, setFilterDept] = useState('all')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    Promise.all([fetchAllResumes(), fetchAllUsers()])
      .then(([r, u]) => { setResumes(r); setUsers(u) })
      .catch(e => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Flatten resumes into candidate rows
  const candidates = useMemo(() => {
    return resumes.map(r => {
      const rd = r.resumeData || r.data || {}
      const p  = rd.personal || {}
      const exp = rd.experience || []
      const totalExp = totalExpYears(exp)
      const lastComp = exp[0]?.company || ''
      const user = users.find(u => u.id === r.user_id)
      return {
        id         : r.id,
        resumeId   : r.id,
        userId     : r.user_id,
        name       : p.fullName || '—',
        jobTitle   : p.jobTitle || '—',
        email      : p.email || user?.email || '—',
        phone      : p.phone || '—',
        city       : p.location?.split(',')[0]?.trim() || '—',
        company    : lastComp || '—',
        totalExp,
        expLabel   : expLabel(totalExp),
        skills     : (rd.skills || []).map(s => s.items).join(', '),
        template   : r.settings?.templateId || 'ats-classic',
        updatedAt  : r.updated_at,
        summary    : p.summary || '',
        experience : exp,
        education  : rd.education || [],
        resumeData : rd,
        settings   : r.settings,
      }
    })
  }, [resumes, users])

  // All unique cities and job departments
  const allCities = [...new Set(candidates.map(c => c.city).filter(c => c && c !== '—'))].sort()
  const allDepts  = [...new Set(candidates.map(c => c.jobTitle).filter(t => t && t !== '—'))].sort()

  const filtered = useMemo(() => candidates.filter(c => {
    const q = search.toLowerCase()
    const mqSearch = !q || c.name.toLowerCase().includes(q) || c.jobTitle.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)
    const mqExp  = filterExp  === 'all' || c.expLabel === filterExp
    const mqCity = filterCity === 'all' || c.city === filterCity
    const mqDept = filterDept === 'all' || c.jobTitle === filterDept
    return mqSearch && mqExp && mqCity && mqDept
  }), [candidates, search, filterExp, filterCity, filterDept])

  const handleDownload = async (c) => {
    // Dynamically import pdfExporter to avoid loading it eagerly
    try {
      const { exportToPDF } = await import('../../utils/pdfExporter')
      const { getTemplate } = await import('../../templates/registry')
      const tpl = getTemplate(c.template)
      await exportToPDF(c.resumeData, c.settings, tpl.component, c.name)
      toast.success('Resume downloaded')
    } catch (e) { toast.error('Download failed: ' + e.message) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-black text-white">Resume Database</h1>
          <p className="text-white/40 text-xs mt-0.5">{candidates.length} candidate profiles · Candidate talent pool for job matching</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase"
          style={{ background: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.25)', color: '#D4A843' }}>
          <Database size={11} /> {filtered.length} Matching
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, title, email, company…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs font-bold text-white placeholder-white/25 outline-none"
            style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
        {[
          { value: filterExp,  setter: setFilterExp,  opts: ['all', ...EXP_BUCKETS],     label: 'Experience' },
          { value: filterCity, setter: setFilterCity, opts: ['all', ...allCities],        label: 'City' },
          { value: filterDept, setter: setFilterDept, opts: ['all', ...allDepts.slice(0,20)], label: 'Job Title' },
        ].map(f => (
          <select key={f.label} value={f.value} onChange={e => f.setter(e.target.value)}
            className="px-3 py-2.5 rounded-xl text-xs font-bold text-white outline-none cursor-pointer min-w-[130px]"
            style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.08)' }}>
            <option value="all">All {f.label}</option>
            {f.opts.filter(o => o !== 'all').map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#13152A', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['#','Name','Job Title / Dept','Experience','Email','Phone','Last Company','City','Template','Actions'].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-[9px] font-black uppercase tracking-widest text-white/30 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={10} className="px-4 py-3">
                    <div className="h-8 animate-pulse rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  </td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-14 text-white/30 text-xs">No candidates match the filters</td></tr>
              ) : filtered.map((c, i) => (
                <>
                  <tr key={c.id}
                    className="border-t cursor-pointer hover:bg-white/3 transition-colors"
                    style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                    onClick={() => setExpanded(expanded === c.id ? null : c.id)}>
                    <td className="px-3 py-3 text-[10px] text-white/25 font-bold">{i + 1}</td>
                    <td className="px-3 py-3">
                      <div className="text-xs font-black text-white/85">{c.name}</div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <Briefcase size={10} style={{ color: '#5B4BF5' }} />
                        <span className="text-[10px] font-bold text-white/60">{c.jobTitle}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${
                        c.expLabel === 'Fresher' ? 'text-blue-400 bg-blue-500/15'
                        : c.totalExp <= 3 ? 'text-emerald-400 bg-emerald-500/15'
                        : c.totalExp <= 7 ? 'text-yellow-400 bg-yellow-500/15'
                        : 'text-purple-400 bg-purple-500/15'
                      }`}>
                        {c.expLabel} {c.totalExp > 0 && `(${c.totalExp}y)`}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 text-[10px] text-white/50">
                        <Mail size={9} />{c.email}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 text-[10px] text-white/50">
                        <Phone size={9} />{c.phone}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 text-[10px] text-white/50">
                        <Building2 size={9} />{c.company}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1 text-[10px] text-white/50">
                        <MapPin size={9} />{c.city}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[8px] font-black text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-full uppercase">{c.template}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={e => { e.stopPropagation(); setExpanded(expanded === c.id ? null : c.id) }}
                          className="p-1.5 rounded-lg text-indigo-400 hover:bg-indigo-500/15 transition-colors" title="View Details">
                          <Eye size={12} />
                        </button>
                        <button onClick={e => { e.stopPropagation(); handleDownload(c) }}
                          className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/15 transition-colors" title="Download Resume PDF">
                          <Download size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded row */}
                  {expanded === c.id && (
                    <tr key={c.id + '-exp'} style={{ background: 'rgba(91,75,245,0.05)' }}>
                      <td colSpan={10} className="px-5 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[10px] text-white/60 font-bold">
                          <div>
                            <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Profile Summary</div>
                            <p className="text-white/50 leading-relaxed">{c.summary || 'No summary provided'}</p>
                          </div>
                          <div>
                            <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Experience ({c.experience?.length || 0})</div>
                            {c.experience?.slice(0, 3).map((e, j) => (
                              <div key={j} className="mb-1.5">
                                <span className="text-white/70">{e.title}</span>
                                <span className="text-white/35"> @ {e.company}</span>
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Education</div>
                            {c.education?.slice(0, 2).map((e, j) => (
                              <div key={j} className="mb-1.5">
                                <span className="text-white/70">{e.degree}</span>
                                <span className="text-white/35"> · {e.school}</span>
                              </div>
                            ))}
                            <div className="mt-3">
                              <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Skills</div>
                              <div className="flex flex-wrap gap-1">
                                {c.skills?.split(',').slice(0, 8).map((s, j) => (
                                  <span key={j} className="px-1.5 py-0.5 rounded text-[8px] bg-indigo-500/15 text-indigo-300">{s.trim()}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <span className="text-[10px] text-white/30 font-bold">{filtered.length} candidates · Click row to expand · Download PDF to view full resume</span>
        </div>
      </div>
    </div>
  )
}
