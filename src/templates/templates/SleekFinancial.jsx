import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import { TYPE, pt, sectionStyle, bulletStyle } from '../typography'

export default function SleekFinancial({ data, settings }) {
  const { personal, experience, education, skills, certifications } = data
  const accent = settings?.color || '#1A56DB'

  return (
    <div className="resume-canvas bg-white" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* HEADER */}
      <header className="resume-section p-8 pb-6 border-b-4" style={{ borderColor: accent, background: '#F8FAFC' }}>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
          {personal.fullName || 'FULL NAME'}
        </h1>
        <div className="text-lg font-bold mt-1" style={{ color: accent, letterSpacing: '0.05em' }}>
          {(personal.jobTitle || 'PROFESSIONAL TITLE').toUpperCase()}
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-4 text-xs font-semibold text-slate-600">
          {personal.email && <div className="flex items-center gap-1.5"><Mail size={12}/>{personal.email}</div>}
          {personal.phone && <div className="flex items-center gap-1.5"><Phone size={12}/>{personal.phone}</div>}
          {personal.location && <div className="flex items-center gap-1.5"><MapPin size={12}/>{personal.location}</div>}
          {personal.linkedin && <div className="flex items-center gap-1.5"><Linkedin size={12}/>{personal.linkedin}</div>}
          {personal.website && <div className="flex items-center gap-1.5"><Globe size={12}/>{personal.website}</div>}
        </div>

        {personal.summary && (
          <div className="mt-5 text-sm leading-relaxed text-slate-700 italic border-l-2 pl-4" style={{ borderColor: accent }}>
            {personal.summary}
          </div>
        )}
      </header>

      {/* BODY */}
      <div className="p-8 space-y-6">
        
        {/* EXPERIENCE */}
        {experience?.length > 0 && (
          <section className="resume-section">
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-4 border-b pb-1" style={{ borderBottomColor: '#E2E8F0' }}>
              Professional Experience
            </h2>
            <div className="space-y-5">
              {experience.map(exp => (
                <div key={exp.id} className="resume-item" data-break-inside="avoid">
                  <div className="flex justify-between items-end mb-1">
                    <h3 className="text-base font-bold text-slate-900">{exp.title}</h3>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm font-semibold mb-2" style={{ color: accent }}>
                    {exp.company} {exp.location && <span className="text-slate-400 font-medium">| {exp.location}</span>}
                  </div>
                  {exp.bullets?.length > 0 && (
                    <ul className="space-y-1.5 pl-4">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="text-[13px] text-slate-700 leading-relaxed list-disc">
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

        {/* EDUCATION */}
        {education?.length > 0 && (
          <section className="resume-section">
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-4 border-b pb-1" style={{ borderBottomColor: '#E2E8F0' }}>
              Education
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {education.map(edu => (
                <div key={edu.id} className="resume-item bg-slate-50 p-3 rounded-lg border border-slate-100" data-break-inside="avoid">
                  <h3 className="text-sm font-bold text-slate-900">{edu.degree}</h3>
                  <div className="text-[13px]" style={{ color: accent }}>{edu.school}</div>
                  <div className="flex justify-between mt-1 text-xs text-slate-500">
                    <span>{edu.dateStart ? `${edu.dateStart} - ` : ''}{edu.dateEnd}</span>
                    <span className="font-semibold text-slate-700">{edu.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS */}
        {skills?.length > 0 && (
          <section className="resume-section" data-break-inside="avoid">
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-4 border-b pb-1" style={{ borderBottomColor: '#E2E8F0' }}>
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(s => (
                <div key={s.id} className="w-full">
                  <span className="font-bold text-[13px] text-slate-900 w-1/4 inline-block">{s.category}:</span>
                  <span className="text-[13px] text-slate-700">{s.items}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications?.length > 0 && (
          <section className="resume-section" data-break-inside="avoid">
            <h2 className="text-lg font-black uppercase tracking-widest text-slate-900 mb-4 border-b pb-1" style={{ borderBottomColor: '#E2E8F0' }}>
              Certifications
            </h2>
            <ul className="grid grid-cols-2 gap-2">
              {certifications.map(cert => (
                <li key={cert.id} className="text-[13px] font-medium text-slate-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
                  {cert.name} <span className="text-slate-400 font-normal ml-1">({cert.date})</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
