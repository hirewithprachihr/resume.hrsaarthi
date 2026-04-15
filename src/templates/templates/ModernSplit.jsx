import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import { TYPE, pt } from '../typography'

/**
 * ModernSplit — Two-column layout with vertical rule divider.
 * FIXED v2:
 *  - All Tailwind classes removed from resume content (html2canvas fails on detached Tailwind)
 *  - data-is-sidebar on right column ensures print color-adjust
 *  - Proper A4 padding: 40px sides (≈ 11mm), 36px top/bottom (≈ 9mm)
 *  - resume-entry / resume-section-head classes for page break system
 */
export default function ModernSplit({ data, settings }) {
  const {
    personal = {},
    experience = [],
    education = [],
    skills = [],
    certifications = [],
    projects = [],
    languages = [],
  } = data || {}

  const accent = settings?.accentColor || '#2D3748'

  return (
    <div
      className="resume-canvas"
      style={{
        fontFamily: TYPE.SANS,
        ...pt(TYPE.SIZE.BODY),
        background: '#fff',
        color: '#1e293b',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      }}
    >
      {/* ── HEADER ───────────────────────────────────── */}
      <div
        className="resume-section-head"
        style={{
          padding: '36px 40px 28px',
          borderBottom: `4px solid ${accent}`,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <div style={{ flex: 1, paddingRight: '20px', borderRight: '1px solid #e2e8f0' }}>
          <h1
            style={{
              fontSize: `${TYPE.SIZE.NAME * 1.5}px`,
              lineHeight: 1.05,
              fontWeight: TYPE.weight.black,
              color: '#0f172a',
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              marginBottom: '6px',
              overflowWrap: 'break-word',
            }}
          >
            {personal.fullName || 'FULL NAME'}
          </h1>
          <div style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.bold, letterSpacing: TYPE.tracking.wider, textTransform: 'uppercase', color: accent }}>
            {personal.jobTitle || 'PROFESSIONAL TITLE'}
          </div>
        </div>

        {/* Contact block */}
        <div style={{ width: '220px', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[
            personal.location && { icon: MapPin,   text: personal.location },
            personal.phone    && { icon: Phone,    text: personal.phone },
            personal.email    && { icon: Mail,     text: personal.email },
            personal.linkedin && { icon: Linkedin, text: personal.linkedin },
            personal.website  && { icon: Globe,    text: personal.website },
          ].filter(Boolean).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', ...pt(TYPE.SIZE.SMALL), color: '#475569' }}>
              <item.icon size={10} style={{ color: '#94a3b8', flexShrink: 0 }} />
              <span style={{ wordBreak: 'break-word' }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TWO-COLUMN BODY ──────────────────────────── */}
      <div style={{ display: 'flex', width: '100%' }}>

        {/* LEFT: Main content */}
        <div style={{ flex: '1 1 0', padding: '28px 24px 36px 40px', borderRight: '1px solid #f1f5f9' }}>

          {personal.summary?.trim() && (
            <div className="resume-section" style={{ marginBottom: '20px' }}>
              <h2 style={{ ...pt(TYPE.SIZE.MICRO), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#0f172a', marginBottom: '6px' }}>
                Profile
              </h2>
              <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#475569', margin: 0 }}>
                {personal.summary}
              </p>
            </div>
          )}

          {experience.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h2
                className="resume-section-head"
                style={{
                  ...pt(TYPE.SIZE.MICRO),
                  fontWeight: TYPE.weight.black,
                  textTransform: 'uppercase',
                  letterSpacing: TYPE.tracking.caps,
                  color: '#0f172a',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                Experience
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {experience.map(exp => (
                  <div
                    key={exp.id}
                    className="resume-entry"
                    style={{ position: 'relative', paddingLeft: '14px', borderLeft: `2px solid ${accent}` }}
                  >
                    {/* Timeline dot */}
                    <div style={{
                      position: 'absolute', left: '-5px', top: '5px',
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: accent, border: '2px solid #fff',
                    }} />
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <h3 style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>
                        {exp.title}
                      </h3>
                      <span style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.bold, color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div style={{ ...pt(TYPE.SIZE.BODY), fontWeight: TYPE.weight.semibold, color: '#475569', marginBottom: '6px' }}>
                      {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                    </div>
                    {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                        {exp.bullets.filter(b => b?.trim()).map((b, i) => (
                          <li key={i} className="resume-bullet" style={{ ...pt(TYPE.SIZE.BULLET, TYPE.leading.relaxed), color: '#475569' }}>
                            {b}
                          </li>
                        ))}
                      </ul>
                    )}
                    <span className="resume-entry-end" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2
                className="resume-section-head"
                style={{
                  ...pt(TYPE.SIZE.MICRO),
                  fontWeight: TYPE.weight.black,
                  textTransform: 'uppercase',
                  letterSpacing: TYPE.tracking.caps,
                  color: '#0f172a',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                Projects
                <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              </h2>
              {projects.map(proj => (
                <div key={proj.id} className="resume-entry" style={{ marginBottom: '10px' }}>
                  <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>
                    {proj.name}
                    {proj.tech && <span style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.regular, color: '#64748b', marginLeft: '8px' }}>{proj.tech}</span>}
                  </div>
                  {proj.description && <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#475569', margin: '3px 0 0' }}>{proj.description}</p>}
                  <span className="resume-entry-end" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Sidebar */}
        <div
          data-is-sidebar="true"
          style={{
            width: '210px',
            flexShrink: 0,
            padding: '28px 20px 36px 24px',
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
          }}
        >
          {skills.length > 0 && (
            <div className="resume-section">
              <SideHead accent={accent}>Expertise</SideHead>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {skills.map(s => (
                  <div key={s.id}>
                    {s.category && <div style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.bold, color: '#374151', marginBottom: '4px' }}>{s.category}</div>}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
                      {(s.items || '').split(',').map((skill, i) => (
                        <span
                          key={i}
                          style={{
                            ...pt(TYPE.SIZE.MICRO),
                            padding: '2px 8px',
                            background: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '4px',
                            color: '#475569',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                          }}
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div className="resume-section">
              <SideHead accent={accent}>Education</SideHead>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {education.map(edu => (
                  <div
                    key={edu.id}
                    className="resume-entry"
                    style={{
                      background: '#fff',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #f1f5f9',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ ...pt(TYPE.SIZE.BODY), fontWeight: TYPE.weight.bold, color: '#0f172a', lineHeight: 1.3, marginBottom: '2px' }}>{edu.degree}</div>
                    <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#64748b', marginBottom: '2px' }}>{edu.school}</div>
                    <div style={{ ...pt(TYPE.SIZE.MICRO), fontWeight: TYPE.weight.bold, color: accent }}>
                      {[edu.dateStart, edu.endDate].filter(Boolean).join(' – ')}{edu.grade ? ` · ${edu.grade}` : ''}
                    </div>
                    <span className="resume-entry-end" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div className="resume-section-compact">
              <SideHead accent={accent}>Certifications</SideHead>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {certifications.map(cert => (
                  <li key={cert.id} style={{ ...pt(TYPE.SIZE.SMALL), color: '#374151', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9', marginBottom: '8px' }}>
                    <div style={{ fontWeight: TYPE.weight.bold }}>{cert.name}</div>
                    <div style={{ ...pt(TYPE.SIZE.MICRO), color: '#94a3b8', marginTop: '2px' }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {languages.length > 0 && (
            <div className="resume-section-compact">
              <SideHead accent={accent}>Languages</SideHead>
              {languages.map(l => (
                <div key={l.id} style={{ ...pt(TYPE.SIZE.SMALL), marginBottom: '4px' }}>
                  <span style={{ fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{l.language}</span>
                  {l.proficiency && <span style={{ color: '#94a3b8' }}> — {l.proficiency}</span>}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

function SideHead({ children, accent }) {
  return (
    <div className="resume-section-head" style={{
      ...pt(TYPE.SIZE.MICRO),
      fontWeight: TYPE.weight.black,
      textTransform: 'uppercase',
      letterSpacing: TYPE.tracking.caps,
      color: '#0f172a',
      paddingBottom: '4px',
      marginBottom: '10px',
      borderBottom: `2px solid ${accent}`,
    }}>
      {children}
    </div>
  )
}
