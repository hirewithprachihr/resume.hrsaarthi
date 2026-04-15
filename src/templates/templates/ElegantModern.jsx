import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import { TYPE, pt } from '../typography'

const ElegantModern = React.memo(function ElegantModern({ data, settings }) {
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [], hobbies = [] } = data || {}
  const accent = settings?.accentColor || '#B45309'

  function SecHead({ children }) {
    return (
      <div className="resume-section-head" style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', marginTop: '24px' }}>
        <div style={{ width: '24px', height: '1px', background: accent }} />
        <span style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: accent }}>{children}</span>
        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
      </div>
    )
  }

  return (
    <div style={{ fontFamily: TYPE.SERIF, ...pt(TYPE.SIZE.BODY), minHeight: '100%', background: '#fff', color: '#1e293b' }}>
      {/* Minimal header — all white, no background */}
      <div style={{ padding: `${TYPE.SPACE.PAGE_TOP + 8}px ${TYPE.SPACE.PAGE_SIDES + 8}px 20px`, textAlign: 'center', borderBottom: `1px solid #e2e8f0` }}>
        <div style={{ fontSize: `${TYPE.SIZE.NAME * 1.4}px`, fontWeight: TYPE.weight.bold, letterSpacing: '-0.02em', color: '#0f172a', lineHeight: 1.1, marginBottom: '6px', overflowWrap: 'break-word' }}>
          {personal.fullName || 'Your Full Name'}
        </div>
        {personal.jobTitle && (
          <div style={{ ...pt(TYPE.SIZE.TITLE - 1), color: accent, fontWeight: TYPE.weight.regular, fontStyle: 'italic', marginBottom: '14px', letterSpacing: '0.03em' }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 16px', marginBottom: '4px' }}>
          {[
            personal.email    && { icon: Mail,     text: personal.email },
            personal.phone    && { icon: Phone,    text: personal.phone },
            personal.location && { icon: MapPin,   text: personal.location },
            personal.linkedin && { icon: Linkedin, text: personal.linkedin },
            personal.website  && { icon: Globe,    text: personal.website },
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', ...pt(TYPE.SIZE.SMALL), color: '#64748b', fontFamily: TYPE.SANS }}>
              <item.icon size={9} style={{ color: accent, flexShrink: 0 }} />
              <span style={{ wordBreak: 'break-all' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: `0 ${TYPE.SPACE.PAGE_SIDES + 8}px ${TYPE.SPACE.PAGE_SIDES}px` }}>
        {personal.summary?.trim() && (
          <div className="resume-entry">
            <SecHead>Profile</SecHead>
            <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.loose), color: '#475569', margin: 0, fontFamily: TYPE.SERIF, maxWidth: '95%', marginLeft: 'auto', marginRight: 'auto', textAlign: 'center', fontStyle: 'italic' }}>{personal.summary}</p>
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SecHead>Experience</SecHead>
            {experience.map((exp, idx) => (
              <div key={exp.id} className="resume-entry" style={{ marginBottom: idx < experience.length - 1 ? `${TYPE.SPACE.ENTRY_BOTTOM}px` : '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
                  <div>
                    <span style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a', fontFamily: TYPE.SERIF }}>{exp.title}</span>
                    {exp.company && <span style={{ ...pt(TYPE.SIZE.BODY), color: accent, fontFamily: TYPE.SANS, marginLeft: '8px' }}>{exp.company}{exp.location ? <span style={{ color: '#94a3b8' }}>, {exp.location}</span> : ''}</span>}
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: TYPE.SANS }}>
                    {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                  </span>
                </div>
                {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                  <ul style={{ paddingLeft: `${TYPE.SPACE.BULLET_INDENT}px`, marginTop: '6px', listStyle: 'none' }}>
                    {exp.bullets.filter(b => b?.trim()).map((b, i) => (
                      <li key={i} className="resume-bullet" style={{ ...pt(TYPE.SIZE.BULLET, TYPE.leading.relaxed), color: '#334155', marginBottom: '4px', fontFamily: TYPE.SANS }}>{b}</li>
                    ))}
                  </ul>
                )}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <SecHead>Education</SecHead>
            {education.map(edu => (
              <div key={edu.id} className="resume-entry" style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a', fontFamily: TYPE.SERIF }}>{edu.degree}</div>
                    <div style={{ ...pt(TYPE.SIZE.BODY), color: '#475569', fontFamily: TYPE.SANS }}>{edu.school}{edu.grade ? ` · ${edu.grade}` : ''}</div>
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: TYPE.SANS }}>{edu.endDate}</span>
                </div>
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="resume-section-compact">
            <SecHead>Expertise</SecHead>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {skills.map(sk => (
                <div key={sk.id} style={{ ...pt(TYPE.SIZE.BODY), fontFamily: TYPE.SANS }}>
                  {sk.category && <span style={{ fontWeight: TYPE.weight.bold, color: accent }}>{sk.category} — </span>}
                  <span style={{ color: '#334155' }}>{sk.items}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="resume-section-compact">
            <SecHead>Certifications</SecHead>
            {certifications.map(c => (
              <div key={c.id} style={{ ...pt(TYPE.SIZE.BODY), marginBottom: '5px', fontFamily: TYPE.SANS }}>
                <span style={{ fontWeight: TYPE.weight.semibold, color: '#0f172a' }}>{c.name}</span>
                {c.issuer && <span style={{ color: '#475569', fontStyle: 'italic' }}> — {c.issuer}</span>}
                {c.date && <span style={{ color: '#94a3b8' }}> ({c.date})</span>}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <SecHead>Selected Projects</SecHead>
            {projects.map(proj => (
              <div key={proj.id} className="resume-entry" style={{ marginBottom: '10px' }}>
                <span style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a', fontFamily: TYPE.SERIF }}>{proj.name}</span>
                {proj.tech && <span style={{ ...pt(TYPE.SIZE.SMALL), color: accent, fontFamily: TYPE.SANS, marginLeft: '8px', fontStyle: 'italic' }}>{proj.tech}</span>}
                {proj.description && <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#475569', marginTop: '3px', fontFamily: TYPE.SANS }}>{proj.description}</p>}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {(languages || []).length > 0 && (
          <div className="resume-section-compact">
            <SecHead>Languages</SecHead>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
              {languages.map(l => (
                <span key={l.id} style={{ ...pt(TYPE.SIZE.BODY), fontFamily: TYPE.SANS }}>
                  <strong style={{ color: '#0f172a' }}>{l.language}</strong>
                  {l.proficiency && <span style={{ color: '#94a3b8', fontStyle: 'italic' }}> — {l.proficiency}</span>}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default ElegantModern
