/** StartupHustler — high-energy, compact, achievement-focused */
import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe, Zap } from 'lucide-react'
import { TYPE, pt } from '../typography'

const StartupHustler = React.memo(function StartupHustler({ data, settings }) {
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data || {}
  const accent = settings?.accentColor || '#DC2626'

  function SecHead({ children, icon }) {
    return (
      <div className="resume-section-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', marginTop: '20px', background: `${accent}08`, borderRadius: '8px', padding: '6px 12px', border: `1px solid ${accent}15` }}>
        {icon && <span style={{ color: accent }}>{icon}</span>}
        <span style={{ ...pt(TYPE.SIZE.SECTION), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: accent }}>{children}</span>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%', background: '#fff' }}>
      {/* Compact header bar */}
      <div style={{ background: `linear-gradient(135deg, ${accent} 0%, #b91c1c 100%)`, padding: `40px ${TYPE.SPACE.PAGE_SIDES}px 22px`, color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: `${TYPE.SIZE.NAME * 1.3}px`, fontWeight: TYPE.weight.black, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '4px', overflowWrap: 'break-word' }}>
              {personal.fullName || 'Your Name'}
            </div>
            {personal.jobTitle && (
              <div style={{ ...pt(TYPE.SIZE.TITLE), color: 'rgba(255,255,255,0.85)', fontWeight: TYPE.weight.semibold, letterSpacing: '0.03em' }}>
                {personal.jobTitle}
              </div>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px', flexShrink: 0 }}>
            {[
              personal.email    && { icon: Mail,     text: personal.email },
              personal.phone    && { icon: Phone,    text: personal.phone },
              personal.location && { icon: MapPin,   text: personal.location },
              personal.linkedin && { icon: Linkedin, text: personal.linkedin },
            ].filter(Boolean).map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', ...pt(TYPE.SIZE.SMALL), color: 'rgba(255,255,255,0.8)' }}>
                <item.icon size={9} style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-all' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: `12px ${TYPE.SPACE.PAGE_SIDES}px ${TYPE.SPACE.PAGE_SIDES}px` }}>
        {personal.summary?.trim() && (
          <div className="resume-entry" style={{ marginBottom: '8px' }}>
            <SecHead icon={<Zap size={12} />}>Pitch</SecHead>
            <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#334155', margin: 0, fontWeight: TYPE.weight.medium }}>{personal.summary}</p>
            <span className="resume-entry-end" />
          </div>
        )}

        {skills.length > 0 && (
          <div className="resume-section-compact" style={{ marginBottom: '8px' }}>
            <SecHead>Stack</SecHead>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {skills.flatMap(sk => (sk.items || '').split(',').filter(Boolean).map((item, i) => (
                <span key={`${sk.id}-${i}`} style={{ ...pt(TYPE.SIZE.SMALL), background: '#f8fafc', border: `1px solid ${accent}30`, color: '#334155', borderRadius: '6px', padding: '3px 10px', fontWeight: TYPE.weight.semibold }}>
                  {item.trim()}
                </span>
              )))}
            </div>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <SecHead>Experience</SecHead>
            {experience.map((exp, idx) => (
              <div key={exp.id} className="resume-entry" style={{ marginBottom: idx < experience.length - 1 ? `${TYPE.SPACE.ENTRY_BOTTOM}px` : '4px', paddingLeft: '12px', borderLeft: `2px solid ${accent}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div>
                    <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{exp.title}</div>
                    {exp.company && <div style={{ ...pt(TYPE.SIZE.BODY), color: accent, fontWeight: TYPE.weight.semibold }}>{exp.company}{exp.location ? <span style={{ color: '#94a3b8' }}> · {exp.location}</span> : ''}</div>}
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>
                    {[exp.startDate, exp.current ? 'Now' : exp.endDate].filter(Boolean).join(' – ')}
                  </span>
                </div>
                {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                  <ul style={{ paddingLeft: `${TYPE.SPACE.BULLET_INDENT}px`, marginTop: '5px', listStyle: 'none' }}>
                    {exp.bullets.filter(b => b?.trim()).map((b, i) => (
                      <li key={i} className="resume-bullet" style={{ ...pt(TYPE.SIZE.BULLET, TYPE.leading.relaxed), color: '#334155', marginBottom: '3px' }}>{b}</li>
                    ))}
                  </ul>
                )}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div style={{ marginBottom: '8px' }}>
            <SecHead>Builds</SecHead>
            <div style={{ display: 'grid', gridTemplateColumns: projects.length > 1 ? 'repeat(2,1fr)' : '1fr', gap: '8px' }}>
              {projects.map(proj => (
                <div key={proj.id} className="resume-entry" style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{proj.name}</div>
                  {proj.tech && <div style={{ ...pt(TYPE.SIZE.MICRO), color: accent, fontWeight: TYPE.weight.bold, marginTop: '2px' }}>{proj.tech}</div>}
                  {proj.description && <p style={{ ...pt(TYPE.SIZE.SMALL, TYPE.leading.relaxed), color: '#475569', marginTop: '4px' }}>{proj.description}</p>}
                  <span className="resume-entry-end" />
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <SecHead>Education</SecHead>
            {education.map(edu => (
              <div key={edu.id} className="resume-entry" style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{edu.degree}</div>
                    <div style={{ ...pt(TYPE.SIZE.BODY), color: '#475569' }}>{edu.school}{edu.grade ? ` · ${edu.grade}` : ''}</div>
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>{edu.endDate}</span>
                </div>
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export default StartupHustler
