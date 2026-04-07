import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'

export default function ModernSplit({ data, settings }) {
  const { personal, experience, education, skills, certifications } = data
  const accent = settings?.color || '#2D3748' // Default dark accent

  return (
    <div className="resume-canvas bg-white text-slate-800" style={{ fontFamily: '"Helvetica Neue", Helvetica, sans-serif' }}>
      
      {/* HEADER SECTION */}
      <header className="p-8 pb-6 flex items-end justify-between" style={{ borderBottom: `4px solid ${accent}` }}>
        <div className="flex-1 pr-6 border-r border-slate-200">
          <h1 className="text-[36px] leading-tight font-black text-slate-900 tracking-tighter uppercase mb-1">
            {personal.fullName || 'FULL NAME'}
          </h1>
          <div className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>
            {personal.jobTitle || 'PROFESSIONAL TITLE'}
          </div>
        </div>
        <div className="w-[30%] pl-6 space-y-1.5 text-[10px] font-medium text-slate-600">
          {personal.location && <div className="flex items-center gap-2"><MapPin size={11} className="text-slate-400"/> {personal.location}</div>}
          {personal.phone && <div className="flex items-center gap-2"><Phone size={11} className="text-slate-400"/> {personal.phone}</div>}
          {personal.email && <div className="flex items-center gap-2"><Mail size={11} className="text-slate-400"/> {personal.email}</div>}
          {personal.linkedin && <div className="flex items-center gap-2"><Linkedin size={11} className="text-slate-400"/> {personal.linkedin}</div>}
          {personal.website && <div className="flex items-center gap-2"><Globe size={11} className="text-slate-400"/> {personal.website}</div>}
        </div>
      </header>

      {/* TWO COLUMN BODY */}
      <div className="flex w-full" style={{ minHeight: '800px' }}>
        
        {/* LEFT COLUMN: MAIN CONTENT */}
        <div className="w-[65%] p-8 pr-6 space-y-6 border-r border-slate-100">
          
          {personal.summary && (
            <section className="resume-section">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-2">Profile</h2>
              <p className="text-[13px] leading-relaxed text-slate-600">{personal.summary}</p>
            </section>
          )}

          {experience?.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-3">
                Experience
                <div className="flex-1 h-px bg-slate-200" />
              </h2>
              <div className="space-y-6">
                {experience.map(exp => (
                  <div key={exp.id} className="relative pl-4" style={{ borderLeft: `2px solid ${accent}` }} data-break-inside="avoid">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full border-2 border-white" style={{ background: accent }} />
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="text-[14px] font-bold text-slate-900">{exp.title}</h3>
                      <span className="text-[10px] font-bold text-slate-400">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-[12px] font-bold text-slate-700 mb-2">{exp.company}</div>
                    {exp.bullets?.length > 0 && (
                      <ul className="space-y-1.5 pl-4 list-disc marker:text-slate-300">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="text-[12px] text-slate-600 leading-relaxed pl-1">{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="w-[35%] p-8 pl-6 space-y-8 bg-slate-50/50">
          
          {skills?.length > 0 && (
            <section className="resume-section" data-break-inside="avoid">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 px-3 py-1 bg-slate-200/50 rounded-full inline-block">
                Expertise
              </h2>
              <div className="space-y-3">
                {skills.map(s => (
                  <div key={s.id}>
                    <div className="text-[11px] font-bold text-slate-900 mb-1">{s.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {s.items.split(',').map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-600 shadow-sm">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {education?.length > 0 && (
            <section className="resume-section">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 px-3 py-1 bg-slate-200/50 rounded-full inline-block">
                Education
              </h2>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id} data-break-inside="avoid" className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                    <h3 className="text-[12px] font-bold text-slate-900 leading-tight mb-1">{edu.degree}</h3>
                    <div className="text-[11px] font-medium text-slate-600 mb-1">{edu.school}</div>
                    <div className="text-[10px] font-bold" style={{ color: accent }}>
                      {edu.dateStart ? `${edu.dateStart} - ` : ''}{edu.dateEnd} | {edu.grade}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications?.length > 0 && (
            <section className="resume-section" data-break-inside="avoid">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 px-3 py-1 bg-slate-200/50 rounded-full inline-block">
                Certifications
              </h2>
              <ul className="space-y-2">
                {certifications.map(cert => (
                  <li key={cert.id} className="text-[11px] text-slate-700 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="font-bold">{cert.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{cert.issuer} • {cert.date}</div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

      </div>
    </div>
  )
}
