import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe, Sparkles } from 'lucide-react'

export default function PlayfulBusiness({ data, settings }) {
  const { personal, experience, education, skills, certifications } = data
  const accent = settings?.color || '#F59E0B' // Default amber/gold
  const blockColor = accent + '15' // 15% opacity for backgrounds

  return (
    <div className="resume-canvas bg-[#FAFAF9]" style={{ fontFamily: '"Outfit", "Inter", sans-serif' }}>
      
      {/* HEADER WRAPPER */}
      <div className="p-10 pb-4">
        <header className="rounded-2xl p-6 relative overflow-hidden" style={{ background: accent }}>
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="text-white">
              <h1 className="text-[32px] font-black leading-tight tracking-tight mb-1">
                {personal.fullName || 'FULL NAME'}
              </h1>
              <div className="text-[13px] font-bold uppercase tracking-widest text-white/90">
                {personal.jobTitle || 'PROFESSIONAL TITLE'}
              </div>
            </div>
          </div>
        </header>

        {/* Floating Contact Bar */}
        <div className="mx-4 -mt-3 bg-white rounded-xl shadow-sm border border-slate-100 p-3 flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold text-slate-600 relative z-20">
          {personal.location && <div className="flex items-center gap-1.5"><MapPin size={12} style={{ color: accent }}/> {personal.location}</div>}
          {personal.phone && <div className="flex items-center gap-1.5"><Phone size={12} style={{ color: accent }}/> {personal.phone}</div>}
          {personal.email && <div className="flex items-center gap-1.5"><Mail size={12} style={{ color: accent }}/> {personal.email}</div>}
          {personal.linkedin && <div className="flex items-center gap-1.5"><Linkedin size={12} style={{ color: accent }}/> {personal.linkedin}</div>}
        </div>
      </div>

      <div className="p-8 pt-4 grid grid-cols-1 md:grid-cols-[1fr_250px] gap-6">
        
        {/* MAIN COLUMN */}
        <div className="space-y-6">
          {personal.summary && (
            <section className="resume-section" data-break-inside="avoid">
              <h2 className="text-[14px] font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <Sparkles size={14} style={{ color: accent }} /> About Me
              </h2>
              <p className="text-[12.5px] leading-relaxed text-slate-700 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                {personal.summary}
              </p>
            </section>
          )}

          {experience?.length > 0 && (
            <section className="resume-section">
              <h2 className="text-[14px] font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">💼</div>
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map(exp => (
                  <div key={exp.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100" data-break-inside="avoid">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-[14px] font-bold text-slate-900 leading-snug">{exp.title}</h3>
                        <div className="text-[12px] font-bold" style={{ color: accent }}>{exp.company}</div>
                      </div>
                      <div className="text-[10px] font-bold px-2 py-1 rounded-lg" style={{ background: blockColor, color: accent }}>
                        {exp.startDate} – {exp.current ? 'Now' : exp.endDate}
                      </div>
                    </div>
                    {exp.bullets?.length > 0 && (
                      <ul className="space-y-1.5 pl-4 mt-3">
                        {exp.bullets.map((b, i) => (
                          <li key={i} className="text-[12.5px] text-slate-600 leading-relaxed list-disc marker:text-slate-300">
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* SIDE COLUMN */}
        <div className="space-y-6">
          {skills?.length > 0 && (
            <section className="resume-section" data-break-inside="avoid">
              <h2 className="text-[14px] font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">⚡</div>
                Skills
              </h2>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-3">
                {skills.map((s, i) => (
                  <div key={s.id} className={i !== 0 ? "pt-3 border-t border-slate-100" : ""}>
                    <div className="text-[11px] font-black text-slate-900 mb-2 uppercase">{s.category}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {s.items.split(',').map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-50 text-slate-700 text-[10px] font-medium rounded-md border border-slate-100">
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
            <section className="resume-section" data-break-inside="avoid">
              <h2 className="text-[14px] font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">🎓</div>
                Education
              </h2>
              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 border-l-4" style={{ borderLeftColor: accent }}>
                    <h3 className="text-[12px] font-bold text-slate-900 leading-tight">{edu.degree}</h3>
                    <div className="text-[11px] text-slate-500 font-medium my-1">{edu.school}</div>
                    <div className="text-[10px] font-bold text-slate-400">
                      {edu.dateStart ? `${edu.dateStart} - ` : ''}{edu.dateEnd} • {edu.grade}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications?.length > 0 && (
            <section className="resume-section" data-break-inside="avoid">
              <h2 className="text-[14px] font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center text-[10px]">🏆</div>
                Awards
              </h2>
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
                <ul className="space-y-2">
                  {certifications.map(cert => (
                    <li key={cert.id} className="text-[11px] pb-2 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="font-bold text-slate-800">{cert.name}</div>
                      <div className="text-slate-400 mt-0.5">{cert.date}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>

      </div>
    </div>
  )
}
