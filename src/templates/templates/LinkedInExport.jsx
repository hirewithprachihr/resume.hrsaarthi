/** LinkedInExport — mirrors LinkedIn's visual grammar exactly */
import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe, ExternalLink } from 'lucide-react'
import { TYPE, pt } from '../typography'

const LinkedInExport = React.memo(function LinkedInExport({ data, settings }) {
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data || {}
  const accent = settings?.accentColor || '#0077B5'

  function SecHead({ children }) {
    return (
      <div className="resume-section-head" style={{ ...pt(TYPE.SIZE.TITLE), fontWeight: TYPE.weight.bold, color: '#191919', borderBottom: '1px solid #e2e8f0', paddingBottom: '5px', marginBottom: '14px', marginTop: '20px' }}>
        {children}
      </div>
    )
  }

  const initials = (personal.fullName || 'YN').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%', background: '#fff' }}>
      {/* LinkedIn-style profile header */}
      <div style={{ background: `linear-gradient(180deg, ${accent}15 0%, #fff 100%)`, padding: `${TYPE.SPACE.PAGE_TOP}px ${TYPE.SPACE.PAGE_SIDES}px 20px`, borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
          {/* Profile avatar */}
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, ${accent}90)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: TYPE.weight.bold, color: '#fff', flexShrink: 0, border: '3px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
            {initials}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: `${TYPE.SIZE.NAME * 1.2}px`, fontWeight: TYPE.weight.bold, color: '#191919', letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: '4px', overflowWrap: 'break-word' }}>
              {personal.fullName || 'Your Full Name'}
            </div>
            {personal.jobTitle && (
              <div style={{ ...pt(TYPE.SIZE.TITLE - 1), color: '#191919', fontWeight: TYPE.weight.regular, marginBottom: '6px' }}>
                {personal.jobTitle}
              </div>
            )}
            {personal.location && (
              <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#666', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                <MapPin size={10} style={{ color: accent }} />
                {personal.location}
              </div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
              {personal.email    && <a href={`mailto:${personal.email}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', ...pt(TYPE.SIZE.SMALL), color: accent, textDecoration: 'none' }}><Mail size={9}/>{personal.email}</a>}
              {personal.phone    && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', ...pt(TYPE.SIZE.SMALL), color: '#444' }}><Phone size={9}/>{personal.phone}</span>}
              {personal.linkedin && <a href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', ...pt(TYPE.SIZE.SMALL), color: accent, textDecoration: 'none' }}><Linkedin size={9}/>{personal.linkedin}</a>}
              {personal.website  && <a href={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`} style={{ display: 'flex', alignItems: 'center', gap: '4px', ...pt(TYPE.SIZE.SMALL), color: accent, textDecoration: 'none' }}><Globe size={9}/>{personal.website}</a>}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: `0 ${TYPE.SPACE.PAGE_SIDES}px ${TYPE.SPACE.PAGE_SIDES}px` }}>
        {personal.summary?.trim() && (
          <div className="resume-entry">
            <SecHead>About</SecHead>
            <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#333', margin: 0 }}>{personal.summary}</p>
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SecHead>Experience</SecHead>
            {experience.map((exp, idx) => (
              <div key={exp.id} className="resume-entry" style={{ display: 'flex', gap: '14px', marginBottom: idx < experience.length - 1 ? `${TYPE.SPACE.ENTRY_BOTTOM}px` : '4px' }}>
                {/* Company logo placeholder */}
                <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: `${accent}15`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.bold, color: accent }}>
                  {(exp.company || 'C')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#191919' }}>{exp.title}</div>
                  {exp.company && <div style={{ ...pt(TYPE.SIZE.BODY), color: '#333', fontWeight: TYPE.weight.semibold }}>{exp.company}{exp.location ? <span style={{ color: '#666', fontWeight: TYPE.weight.regular }}> · {exp.location}</span> : ''}</div>}
                  <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#666', marginTop: '1px' }}>
                    {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                  </div>
                  {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                    <ul style={{ paddingLeft: `${TYPE.SPACE.BULLET_INDENT}px`, marginTop: '6px', listStyleType: 'disc' }}>
                      {exp.bullets.filter(b => b?.trim()).map((b, i) => (
                        <li key={i} className="resume-bullet-text" style={{ ...pt(TYPE.SIZE.BULLET, TYPE.leading.relaxed), color: '#444', marginBottom: '3px' }}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <SecHead>Education</SecHead>
            {education.map(edu => (
              <div key={edu.id} className="resume-entry" style={{ display: 'flex', gap: '14px', marginBottom: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.bold, color: '#475569' }}>
                  {(edu.school || 'U')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#191919' }}>{edu.school}</div>
                  <div style={{ ...pt(TYPE.SIZE.BODY), color: '#333' }}>{edu.degree}{edu.grade ? ` · ${edu.grade}` : ''}</div>
                  {edu.endDate && <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#666' }}>{edu.startDate ? `${edu.startDate} – ` : ''}{edu.endDate}</div>}
                </div>
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="resume-section-compact">
            <SecHead>Skills</SecHead>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {skills.flatMap(sk => (sk.items || '').split(',').filter(Boolean).map((item, i) => (
                <span key={`${sk.id}-${i}`} style={{ ...pt(TYPE.SIZE.SMALL), background: `${accent}10`, color: accent, border: `1px solid ${accent}25`, borderRadius: '20px', padding: '3px 12px', fontWeight: TYPE.weight.semibold }}>
                  {item.trim()}
                </span>
              )))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="resume-section-compact">
            <SecHead>Licenses & Certifications</SecHead>
            {certifications.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: '14px', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.bold, color: '#475569' }}>
                  ✓
                </div>
                <div>
                  <div style={{ ...pt(TYPE.SIZE.BODY), fontWeight: TYPE.weight.bold, color: '#191919' }}>{c.name}</div>
                  {c.issuer && <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#666' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

export default LinkedInExport
