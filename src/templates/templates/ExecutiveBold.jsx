import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import { TYPE, pt } from '../typography'

const ExecutiveBold = React.memo(function ExecutiveBold({ data, settings }) {
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data || {}
  const accent = settings?.accentColor || '#1A56DB'
  const headerBg = '#0f172a'

  function SecHead({ children }) {
    return (
      <div className="resume-section-head" style={{
        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', marginTop: '22px',
      }}>
        <span style={{ ...pt(TYPE.SIZE.SECTION), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: accent }}>{children}</span>
        <div style={{ flex: 1, height: '2px', background: `linear-gradient(to right, ${accent}80, transparent)` }} />
      </div>
    )
  }

  return (
    <div style={{ fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%', background: '#fff' }}>
      {/* Full-bleed header */}
      <div style={{ background: headerBg, padding: `40px ${TYPE.SPACE.PAGE_SIDES}px 32px`, position: 'relative', overflow: 'hidden' }}>
        {/* decorative accent stripe */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(to right, ${accent}, ${accent}80, transparent)` }} />
        {/* decorative large BG letter */}
        <div style={{ position: 'absolute', right: '32px', top: '10px', fontSize: '120px', fontWeight: '900', color: 'rgba(255,255,255,0.03)', letterSpacing: '-8px', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
          {(personal.fullName || 'Y')[0].toUpperCase()}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: `${TYPE.SIZE.NAME * 1.6}px`, fontWeight: TYPE.weight.black, color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: '8px', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {personal.fullName || 'Your Full Name'}
          </div>
          {personal.jobTitle && (
            <div style={{ ...pt(TYPE.SIZE.TITLE + 1), color: accent, fontWeight: TYPE.weight.bold, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '18px' }}>
              {personal.jobTitle}
            </div>
          )}
          {/* horizontal rule */}
          <div style={{ width: '48px', height: '3px', background: accent, marginBottom: '18px', borderRadius: '2px' }} />
          {/* contact row */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px', alignItems: 'center' }}>
            {[
              personal.email    && { icon: Mail,     text: personal.email },
              personal.phone    && { icon: Phone,    text: personal.phone },
              personal.location && { icon: MapPin,   text: personal.location },
              personal.linkedin && { icon: Linkedin, text: personal.linkedin },
              personal.website  && { icon: Globe,    text: personal.website },
            ].filter(Boolean).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', ...pt(TYPE.SIZE.SMALL), color: '#94a3b8' }}>
                <item.icon size={10} style={{ color: accent, flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-all' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: `0 ${TYPE.SPACE.PAGE_SIDES}px ${TYPE.SPACE.PAGE_SIDES}px` }}>
        {personal.summary?.trim() && (
          <div className="resume-entry">
            <SecHead>Executive Profile</SecHead>
            <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#334155', margin: 0 }}>{personal.summary}</p>
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SecHead>Career History</SecHead>
            {experience.map((exp, idx) => (
              <div key={exp.id} className="resume-entry" style={{ marginBottom: idx < experience.length - 1 ? `${TYPE.SPACE.ENTRY_BOTTOM}px` : '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', borderLeft: `3px solid ${accent}`, paddingLeft: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{exp.title}</div>
                    {exp.company && <div style={{ ...pt(TYPE.SIZE.BODY), color: accent, fontWeight: TYPE.weight.semibold }}>{exp.company}{exp.location ? <span style={{ color: '#94a3b8', fontWeight: TYPE.weight.regular }}> — {exp.location}</span> : ''}</div>}
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#64748b', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                  </span>
                </div>
                {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                  <ul style={{ paddingLeft: '28px', marginTop: '6px', listStyle: 'none' }}>
                    {exp.bullets.filter(b => b?.trim()).map((b, i) => (
                      <li key={i} className="resume-bullet" style={{ ...pt(TYPE.SIZE.BULLET, TYPE.leading.relaxed), color: '#334155', marginBottom: '4px' }}>{b}</li>
                    ))}
                  </ul>
                )}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="resume-section-compact">
            <SecHead>Core Competencies</SecHead>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {skills.map(sk => (
                <div key={sk.id} style={{ ...pt(TYPE.SIZE.BODY), padding: '6px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  {sk.category && <span style={{ fontWeight: TYPE.weight.bold, color: accent }}>{sk.category}: </span>}
                  <span style={{ color: '#334155' }}>{sk.items}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <SecHead>Education</SecHead>
            {education.map(edu => (
              <div key={edu.id} className="resume-entry" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{edu.degree}</div>
                    <div style={{ ...pt(TYPE.SIZE.BODY), color: '#475569' }}>{edu.school}{edu.grade ? ` · ${edu.grade}` : ''}</div>
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#64748b', whiteSpace: 'nowrap', flexShrink: 0 }}>{edu.endDate}</span>
                </div>
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div className="resume-section-compact">
            <SecHead>Certifications</SecHead>
            {certifications.map(c => (
              <div key={c.id} style={{ ...pt(TYPE.SIZE.BODY), marginBottom: '5px' }}>
                <span style={{ fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{c.name}</span>
                {c.issuer && <span style={{ color: '#475569' }}> · {c.issuer}</span>}
                {c.date && <span style={{ color: '#94a3b8' }}> ({c.date})</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export default ExecutiveBold
