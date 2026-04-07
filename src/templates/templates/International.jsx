/** International — multi-column clean, Unicode-safe, global recruiter format */
import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import { TYPE, pt } from '../typography'

const International = React.memo(function International({ data, settings }) {
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data || {}
  const accent = settings?.accentColor || '#4F46E5'

  function SecHead({ children }) {
    return (
      <div className="resume-section-head" style={{ ...pt(TYPE.SIZE.SECTION), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#0f172a', borderBottom: `2px solid ${accent}`, paddingBottom: '5px', marginBottom: '12px', marginTop: '22px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ display: 'inline-block', width: '6px', height: '6px', background: accent, borderRadius: '2px', flexShrink: 0 }} />
        {children}
      </div>
    )
  }

  return (
    <div style={{ fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%', background: '#fff' }}>
      {/* Header */}
      <div style={{ padding: `${TYPE.SPACE.PAGE_TOP}px ${TYPE.SPACE.PAGE_SIDES}px 20px`, borderBottom: `1px solid #e2e8f0`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: `${TYPE.SIZE.NAME * 1.3}px`, fontWeight: TYPE.weight.bold, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: '6px', overflowWrap: 'break-word' }}>
            {personal.fullName || 'Your Full Name'}
          </div>
          {personal.jobTitle && (
            <div style={{ ...pt(TYPE.SIZE.TITLE), color: accent, fontWeight: TYPE.weight.semibold, marginBottom: '12px' }}>
              {personal.jobTitle}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
          {[
            personal.email    && { icon: Mail,     text: personal.email },
            personal.phone    && { icon: Phone,    text: personal.phone },
            personal.location && { icon: MapPin,   text: personal.location },
            personal.linkedin && { icon: Linkedin, text: personal.linkedin },
            personal.website  && { icon: Globe,    text: personal.website },
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', ...pt(TYPE.SIZE.SMALL), color: '#475569' }}>
              <item.icon size={10} style={{ color: accent, flexShrink: 0 }} />
              <span style={{ wordBreak: 'break-all' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content: two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '0', minHeight: '0' }}>
        {/* Main column */}
        <div style={{ padding: `0 24px 32px ${TYPE.SPACE.PAGE_SIDES}px`, borderRight: '1px solid #f1f5f9' }}>
          {personal.summary?.trim() && (
            <div className="resume-entry">
              <SecHead>Profile</SecHead>
              <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#334155', margin: 0 }}>{personal.summary}</p>
              <span className="resume-entry-end" />
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <SecHead>Professional Experience</SecHead>
              {experience.map((exp, idx) => (
                <div key={exp.id} className="resume-entry" style={{ marginBottom: idx < experience.length - 1 ? `${TYPE.SPACE.ENTRY_BOTTOM}px` : '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{exp.title}</div>
                      {exp.company && <div style={{ ...pt(TYPE.SIZE.BODY), color: accent, fontWeight: TYPE.weight.semibold }}>{exp.company}{exp.location ? <span style={{ color: '#94a3b8', fontWeight: TYPE.weight.regular }}> · {exp.location}</span> : ''}</div>}
                    </div>
                    <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                    </span>
                  </div>
                  {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                    <ul style={{ paddingLeft: `${TYPE.SPACE.BULLET_INDENT}px`, marginTop: '5px', listStyleType: 'disc' }}>
                      {exp.bullets.filter(b => b?.trim()).map((b, i) => (
                        <li key={i} className="resume-bullet-text" style={{ ...pt(TYPE.SIZE.BULLET, TYPE.leading.relaxed), color: '#334155', marginBottom: '3px' }}>{b}</li>
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
                <div key={edu.id} className="resume-entry" style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{edu.degree}</div>
                      <div style={{ ...pt(TYPE.SIZE.BODY), color: '#475569' }}>{edu.school}{edu.grade ? ` · ${edu.grade}` : ''}{edu.location ? `, ${edu.location}` : ''}</div>
                    </div>
                    <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>{edu.endDate}</span>
                  </div>
                  <span className="resume-entry-end" />
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <SecHead>Projects</SecHead>
              {projects.map(proj => (
                <div key={proj.id} className="resume-entry" style={{ marginBottom: '8px' }}>
                  <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>
                    {proj.name}{proj.tech && <span style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.regular, color: '#64748b' }}> — {proj.tech}</span>}
                  </div>
                  {proj.description && <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#334155', marginTop: '3px' }}>{proj.description}</p>}
                  <span className="resume-entry-end" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ padding: '20px 20px 32px 20px' }}>
          {skills.length > 0 && (
            <div className="resume-section-compact" style={{ marginBottom: '20px' }}>
              <div style={{ ...pt(TYPE.SIZE.MICRO), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#64748b', marginBottom: '10px' }}>Skills</div>
              {skills.map(sk => (
                <div key={sk.id} style={{ marginBottom: '10px' }}>
                  {sk.category && <div style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.bold, color: accent, marginBottom: '3px' }}>{sk.category}</div>}
                  <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#475569', lineHeight: 1.5 }}>{sk.items}</div>
                </div>
              ))}
            </div>
          )}

          {(languages || []).length > 0 && (
            <div className="resume-section-compact" style={{ marginBottom: '20px' }}>
              <div style={{ ...pt(TYPE.SIZE.MICRO), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#64748b', marginBottom: '10px' }}>Languages</div>
              {languages.map(l => (
                <div key={l.id} style={{ marginBottom: '6px' }}>
                  <div style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.semibold, color: '#0f172a' }}>{l.language}</div>
                  {l.proficiency && <div style={{ ...pt(TYPE.SIZE.MICRO), color: '#64748b' }}>{l.proficiency}</div>}
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div className="resume-section-compact">
              <div style={{ ...pt(TYPE.SIZE.MICRO), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#64748b', marginBottom: '10px' }}>Certifications</div>
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '8px' }}>
                  <div style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.semibold, color: '#0f172a', lineHeight: 1.3 }}>{c.name}</div>
                  {c.issuer && <div style={{ ...pt(TYPE.SIZE.MICRO), color: '#64748b' }}>{c.issuer}</div>}
                  {c.date && <div style={{ ...pt(TYPE.SIZE.MICRO), color: '#94a3b8' }}>{c.date}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default International
