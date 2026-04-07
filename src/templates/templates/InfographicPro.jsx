/** InfographicPro — visual skill bars, accent timeline */
import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import { TYPE, pt } from '../typography'

function SkillBar({ label, level = 80, accent }) {
  return (
    <div style={{ marginBottom: '7px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
        <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#334155', fontWeight: TYPE.weight.medium }}>{label}</span>
        <span style={{ ...pt(TYPE.SIZE.MICRO), color: '#94a3b8' }}>{level}%</span>
      </div>
      <div style={{ height: '4px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${level}%`, background: `linear-gradient(to right, ${accent}, ${accent}90)`, borderRadius: '4px' }} />
      </div>
    </div>
  )
}

const InfographicPro = React.memo(function InfographicPro({ data, settings }) {
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data || {}
  const accent = settings?.accentColor || '#0891B2'
  const sideWidth = '230px'

  function SideSecHead({ children }) {
    return <div style={{ ...pt(TYPE.SIZE.MICRO), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#64748b', marginBottom: '10px', marginTop: '18px' }}>{children}</div>
  }

  function MainSecHead({ children }) {
    return (
      <div className="resume-section-head" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', marginTop: '20px' }}>
        <div style={{ width: '3px', height: '14px', background: accent, borderRadius: '2px', flexShrink: 0 }} />
        <span style={{ ...pt(TYPE.SIZE.SECTION), fontWeight: TYPE.weight.bold, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#0f172a' }}>{children}</span>
        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
      </div>
    )
  }

  const skillLevels = [90, 80, 75, 85, 70, 65, 78, 88]

  return (
    <div style={{ display: 'flex', fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%' }}>
      {/* Left sidebar */}
      <div style={{ width: sideWidth, flexShrink: 0, background: '#f8fafc', borderRight: `1px solid #e2e8f0`, padding: '32px 20px' }}>
        {/* Avatar + name */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: `linear-gradient(135deg, ${accent}, ${accent}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: TYPE.weight.bold, color: '#fff', margin: '0 auto 12px', boxShadow: `0 4px 20px ${accent}30` }}>
            {(personal.fullName || 'Y')[0].toUpperCase()}
          </div>
          <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a', lineHeight: 1.2, overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {personal.fullName || 'Your Name'}
          </div>
          {personal.jobTitle && (
            <div style={{ ...pt(TYPE.SIZE.SMALL), color: accent, fontWeight: TYPE.weight.semibold, marginTop: '3px', lineHeight: 1.4 }}>
              {personal.jobTitle}
            </div>
          )}
        </div>

        {/* divider */}
        <div style={{ height: '1px', background: '#e2e8f0', marginBottom: '18px' }} />

        {/* Contact */}
        <SideSecHead>Contact</SideSecHead>
        {[
          personal.email    && { icon: Mail,     text: personal.email },
          personal.phone    && { icon: Phone,    text: personal.phone },
          personal.location && { icon: MapPin,   text: personal.location },
          personal.linkedin && { icon: Linkedin, text: personal.linkedin },
          personal.website  && { icon: Globe,    text: personal.website },
        ].filter(Boolean).map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', ...pt(TYPE.SIZE.SMALL), color: '#475569', marginBottom: '6px' }}>
            <item.icon size={10} style={{ color: accent, flexShrink: 0, marginTop: '1px' }} />
            <span style={{ wordBreak: 'break-all', lineHeight: 1.4 }}>{item.text}</span>
          </div>
        ))}

        {/* Skill bars */}
        {skills.length > 0 && (
          <>
            <SideSecHead>Skills</SideSecHead>
            {skills.flatMap((sk, si) =>
              (sk.items || '').split(',').filter(Boolean).slice(0, 3).map((item, ii) => (
                <SkillBar key={`${si}-${ii}`} label={item.trim()} level={skillLevels[(si * 3 + ii) % skillLevels.length]} accent={accent} />
              ))
            ).slice(0, 8)}
          </>
        )}

        {(languages || []).length > 0 && (
          <>
            <SideSecHead>Languages</SideSecHead>
            {languages.map(l => (
              <div key={l.id} style={{ ...pt(TYPE.SIZE.SMALL), marginBottom: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ fontWeight: TYPE.weight.semibold, color: '#334155' }}>{l.language}</span>
                  <span style={{ color: '#94a3b8' }}>{l.proficiency}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Main */}
      <div style={{ flex: 1, background: '#fff', padding: '32px 28px' }}>
        {personal.summary?.trim() && (
          <div className="resume-entry" style={{ marginBottom: '8px', padding: '12px 16px', background: `${accent}08`, borderRadius: '10px', borderLeft: `3px solid ${accent}` }}>
            <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#334155', margin: 0 }}>{personal.summary}</p>
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <MainSecHead>Experience</MainSecHead>
            <div style={{ position: 'relative', paddingLeft: '20px' }}>
              <div style={{ position: 'absolute', left: '6px', top: '6px', bottom: '6px', width: '2px', background: `${accent}20` }} />
              {experience.map((exp, idx) => (
                <div key={exp.id} className="resume-entry" style={{ position: 'relative', marginBottom: idx < experience.length - 1 ? `${TYPE.SPACE.ENTRY_BOTTOM}px` : '4px' }}>
                  <div style={{ position: 'absolute', left: '-17px', top: '4px', width: '12px', height: '12px', borderRadius: '50%', background: idx === 0 ? accent : '#fff', border: `2px solid ${accent}`, zIndex: 1 }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div>
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
          </div>
        )}

        {education.length > 0 && (
          <div>
            <MainSecHead>Education</MainSecHead>
            {education.map(edu => (
              <div key={edu.id} className="resume-entry" style={{ marginBottom: '8px' }}>
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

        {projects.length > 0 && (
          <div>
            <MainSecHead>Projects</MainSecHead>
            {projects.map(proj => (
              <div key={proj.id} className="resume-entry" style={{ marginBottom: '8px' }}>
                <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>
                  {proj.name}{proj.tech && <span style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.regular, color: '#64748b' }}> · {proj.tech}</span>}
                </div>
                {proj.description && <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#334155', marginTop: '3px' }}>{proj.description}</p>}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div className="resume-section-compact">
            <MainSecHead>Certifications</MainSecHead>
            {certifications.map(c => (
              <div key={c.id} style={{ ...pt(TYPE.SIZE.BODY), marginBottom: '5px' }}>
                <span style={{ fontWeight: TYPE.weight.semibold, color: '#0f172a' }}>{c.name}</span>
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

export default InfographicPro
