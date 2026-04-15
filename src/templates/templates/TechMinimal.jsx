import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import { TYPE, pt } from '../typography'

const TechMinimal = React.memo(function TechMinimal({ data, settings }) {
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data || {}
  const accent = settings?.accentColor || '#0E9F6E'
  const dark = '#0d1117'

  const Divider = () => <div style={{ height: '1px', background: `${accent}30`, margin: '18px 0 14px' }} />

  function SecHead({ children }) {
    return (
      <div className="resume-section-head" style={{
        display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px',
      }}>
        <span style={{ fontFamily: TYPE.MONO, ...pt(TYPE.SIZE.SMALL), color: accent, fontWeight: TYPE.weight.bold }}>##</span>
        <span style={{ ...pt(TYPE.SIZE.SECTION), fontWeight: TYPE.weight.bold, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#e2e8f0' }}>{children}</span>
        <div style={{ flex: 1, height: '1px', background: `${accent}25` }} />
      </div>
    )
  }

  return (
    <div style={{ fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%', background: dark, color: '#e2e8f0' }}>
      {/* Header */}
      <div style={{ padding: `${TYPE.SPACE.PAGE_TOP}px ${TYPE.SPACE.PAGE_SIDES}px 24px`, borderBottom: `2px solid ${accent}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
          <div>
            <div style={{ fontFamily: TYPE.MONO, fontSize: `${TYPE.SIZE.NAME * 1.333}px`, fontWeight: TYPE.weight.bold, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '6px', overflowWrap: 'break-word' }}>
              {personal.fullName || 'Your Name'}
            </div>
            {personal.jobTitle && (
              <div style={{ ...pt(TYPE.SIZE.TITLE), color: accent, fontWeight: TYPE.weight.semibold, letterSpacing: '0.02em' }}>
                {personal.jobTitle}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
            {[
              personal.email    && { icon: Mail,     text: personal.email },
              personal.phone    && { icon: Phone,    text: personal.phone },
              personal.location && { icon: MapPin,   text: personal.location },
              personal.linkedin && { icon: Linkedin, text: personal.linkedin },
              personal.website  && { icon: Globe,    text: personal.website },
            ].filter(Boolean).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', ...pt(TYPE.SIZE.SMALL), color: '#64748b' }}>
                <span style={{ color: accent }}><item.icon size={10} /></span>
                <span style={{ wordBreak: 'break-all' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: `20px ${TYPE.SPACE.PAGE_SIDES}px ${TYPE.SPACE.PAGE_SIDES}px` }}>
        {personal.summary?.trim() && (
          <div className="resume-entry" style={{ marginBottom: '18px' }}>
            <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#94a3b8', fontFamily: TYPE.MONO, margin: 0, borderLeft: `2px solid ${accent}`, paddingLeft: '12px' }}>
              {personal.summary}
            </p>
            <span className="resume-entry-end" />
          </div>
        )}

        {skills.length > 0 && (
          <div className="resume-section-compact" style={{ marginBottom: '18px' }}>
            <SecHead>Skills</SecHead>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
              {skills.map(sk => (
                <div key={sk.id} style={{ ...pt(TYPE.SIZE.BODY), background: '#161b22', border: `1px solid ${accent}20`, borderRadius: '6px', padding: '6px 10px' }}>
                  {sk.category && <span style={{ color: accent, fontWeight: TYPE.weight.bold, fontFamily: TYPE.MONO }}>{sk.category}: </span>}
                  <span style={{ color: '#94a3b8' }}>{sk.items}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <SecHead>Experience</SecHead>
            {experience.map((exp, idx) => (
              <div key={exp.id} className="resume-entry" style={{ marginBottom: idx < experience.length - 1 ? `${TYPE.SPACE.ENTRY_BOTTOM}px` : '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '5px' }}>
                  <div>
                    <span style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#f1f5f9' }}>{exp.title}</span>
                    {exp.company && <span style={{ ...pt(TYPE.SIZE.BODY), color: accent, marginLeft: '8px' }}>@ {exp.company}</span>}
                    {exp.location && <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#475569', marginLeft: '6px' }}>· {exp.location}</span>}
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#475569', fontFamily: TYPE.MONO, whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                  </span>
                </div>
                {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                  <ul style={{ paddingLeft: `${TYPE.SPACE.BULLET_INDENT}px`, marginTop: '4px', listStyle: 'none' }}>
                    {exp.bullets.filter(b => b?.trim()).map((b, i) => (
                      <li key={i} className="resume-bullet" style={{ ...pt(TYPE.SIZE.BULLET, TYPE.leading.relaxed), color: '#94a3b8', marginBottom: '3px' }}>{b}</li>
                    ))}
                  </ul>
                )}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <SecHead>Education</SecHead>
            {education.map(edu => (
              <div key={edu.id} className="resume-entry" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#f1f5f9' }}>{edu.degree}</div>
                    <div style={{ ...pt(TYPE.SIZE.BODY), color: '#64748b' }}>{edu.school}{edu.grade ? ` · ${edu.grade}` : ''}</div>
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#475569', fontFamily: TYPE.MONO, whiteSpace: 'nowrap', flexShrink: 0 }}>{edu.endDate}</span>
                </div>
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <SecHead>Projects</SecHead>
            {projects.map(proj => (
              <div key={proj.id} className="resume-entry" style={{ marginBottom: '10px', background: '#161b22', border: `1px solid ${accent}20`, borderRadius: '8px', padding: '10px 14px' }}>
                <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#f1f5f9' }}>
                  {proj.name}{proj.tech && <span style={{ ...pt(TYPE.SIZE.SMALL), color: accent, fontFamily: TYPE.MONO, marginLeft: '8px' }}>[{proj.tech}]</span>}
                </div>
                {proj.description && <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#64748b', marginTop: '4px' }}>{proj.description}</p>}
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
                <span style={{ color: '#f1f5f9', fontWeight: TYPE.weight.semibold }}>{c.name}</span>
                {c.issuer && <span style={{ color: '#475569' }}> · {c.issuer}</span>}
                {c.date && <span style={{ color: '#334155', fontFamily: TYPE.MONO }}> ({c.date})</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export default TechMinimal
