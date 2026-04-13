import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe, Github, Twitter } from 'lucide-react'
import { TYPE, pt, sectionStyle } from '../typography'

function ContactRow({ icon: Icon, text }) {
  if (!text?.trim()) return null
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', marginBottom: '6px', wordBreak: 'break-all' }}>
      <Icon size={10} style={{ flexShrink: 0 }} />
      <span>{text}</span>
    </div>
  )
}

function Section({ title, accent, children, style }) {
  return (
    <div style={style}>
      <div className="resume-section-head" style={{ ...pt(TYPE.SIZE.SECTION), fontWeight: TYPE.weight.bold, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: accent, borderBottom: `1px solid ${accent}40`, paddingBottom: '4px', marginBottom: '10px' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

const CorporatePro = React.memo(function CorporatePro({ data, settings }) {
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [], hobbies = [] } = data || {}
  const accent = settings?.accentColor || '#1A56DB'
  const dark = '#0f172a'

  return (
    <div style={{ display: 'flex', fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%' }}>
      {/* Left sidebar */}
      <div data-is-sidebar="true" style={{ width: '240px', flexShrink: 0, background: dark, color: '#e2e8f0', padding: '40px 22px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Avatar / Photo */}
        {personal.photo ? (
          <img src={personal.photo} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${accent}40`, marginBottom: '4px', flexShrink: 0 }} />
        ) : (
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: TYPE.weight.bold, color: '#fff', marginBottom: '4px', flexShrink: 0, letterSpacing: '-1px' }}>
            {(personal.fullName || 'Y')[0].toUpperCase()}
          </div>
        )}
        <div>
          <div style={{ ...pt(TYPE.SIZE.NAME - 6), fontWeight: TYPE.weight.bold, color: '#fff', lineHeight: 1.2, marginBottom: '5px', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {personal.fullName || 'Your Name'}
          </div>
          {personal.jobTitle && <div style={{ ...pt(TYPE.SIZE.SMALL), color: accent, fontWeight: TYPE.weight.semibold, letterSpacing: '0.03em', lineHeight: 1.4 }}>{personal.jobTitle}</div>}
        </div>

        <div>
          <div style={{ ...pt(TYPE.SIZE.MICRO), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#64748b', marginBottom: '8px' }}>Contact</div>
          <ContactRow icon={Mail} text={personal.email} />
          <ContactRow icon={Phone} text={personal.phone} />
          <ContactRow icon={MapPin} text={personal.location} />
          <ContactRow icon={Linkedin} text={personal.linkedin} />
          <ContactRow icon={Globe} text={personal.website} />
          <ContactRow icon={Github} text={personal.github} />
          <ContactRow icon={Twitter} text={personal.twitter} />
        </div>

        {skills.length > 0 && (
          <div>
            <div style={{ ...pt(TYPE.SIZE.MICRO), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#64748b', marginBottom: '8px' }}>Skills</div>
            {skills.map(sk => (
              <div key={sk.id} style={{ marginBottom: '9px' }}>
                {sk.category && <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#cbd5e1', fontWeight: TYPE.weight.semibold, marginBottom: '3px' }}>{sk.category}</div>}
                <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', lineHeight: 1.6 }}>{sk.items}</div>
              </div>
            ))}
          </div>
        )}

        {(languages || []).length > 0 && (
          <div>
            <div style={{ ...pt(TYPE.SIZE.MICRO), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#64748b', marginBottom: '8px' }}>Languages</div>
            {languages.map(l => (
              <div key={l.id} style={{ ...pt(TYPE.SIZE.SMALL), marginBottom: '4px' }}>
                <span style={{ color: '#e2e8f0', fontWeight: TYPE.weight.semibold }}>{l.language}</span>
                {l.proficiency && <span style={{ color: '#64748b' }}> · {l.proficiency}</span>}
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div>
            <div style={{ ...pt(TYPE.SIZE.MICRO), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#64748b', marginBottom: '8px' }}>Certifications</div>
            {certifications.map(c => (
              <div key={c.id} style={{ marginBottom: '6px' }}>
                <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#cbd5e1', fontWeight: TYPE.weight.semibold, lineHeight: 1.4 }}>{c.name}</div>
                {c.issuer && <div style={{ ...pt(TYPE.SIZE.MICRO), color: '#64748b' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right main */}
      <div style={{ flex: 1, background: '#fff', padding: '40px 32px' }}>
        {personal.summary?.trim() && (
          <div className="resume-entry" style={{ marginBottom: '22px' }}>
            <Section title="Profile" accent={accent}>
              <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#334155', margin: 0 }}>{personal.summary}</p>
              <span className="resume-entry-end" />
            </Section>
          </div>
        )}

        {experience.length > 0 && (
          <Section title="Experience" accent={accent} style={{ marginBottom: '20px' }}>
            {experience.map((exp, idx) => (
              <div key={exp.id} className="resume-entry" style={{ marginBottom: idx < experience.length - 1 ? `${TYPE.SPACE.ENTRY_BOTTOM}px` : '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div>
                    <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a', overflowWrap: 'break-word' }}>{exp.title}</div>
                    {exp.company && <div style={{ ...pt(TYPE.SIZE.BODY), color: accent, fontWeight: TYPE.weight.semibold }}>{exp.company}{exp.location ? <span style={{ color: '#94a3b8', fontWeight: TYPE.weight.regular }}> · {exp.location}</span> : ''}</div>}
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, paddingTop: '2px' }}>
                    {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                  </span>
                </div>
                {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                  <ul style={{ paddingLeft: `${TYPE.SPACE.BULLET_INDENT}px`, marginTop: '5px', listStyleType: 'disc' }}>
                    {exp.bullets.filter(b => b?.trim()).map((b, i) => (
                      <li key={i} className="resume-bullet-text" style={{ ...pt(TYPE.SIZE.BULLET, TYPE.leading.relaxed), color: '#334155', marginBottom: `${TYPE.SPACE.BULLET_SPACING}px` }}>{b}</li>
                    ))}
                  </ul>
                )}
                <span className="resume-entry-end" />
              </div>
            ))}
          </Section>
        )}

        {education.length > 0 && (
          <Section title="Education" accent={accent} style={{ marginBottom: '20px' }}>
            {education.map((edu, idx) => (
              <div key={edu.id} className="resume-entry" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{edu.degree}</div>
                    <div style={{ ...pt(TYPE.SIZE.BODY), color: '#475569' }}>{edu.school}{edu.location ? `, ${edu.location}` : ''}{edu.grade ? ` · ${edu.grade}` : ''}</div>
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>{edu.endDate}</span>
                </div>
                <span className="resume-entry-end" />
              </div>
            ))}
          </Section>
        )}

        {projects.length > 0 && (
          <Section title="Projects" accent={accent} style={{ marginBottom: '20px' }}>
            {projects.map(proj => (
              <div key={proj.id} className="resume-entry" style={{ marginBottom: '8px' }}>
                <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>
                  {proj.name}{proj.tech && <span style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.regular, color: '#64748b' }}> · {proj.tech}</span>}
                </div>
                {proj.description && <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#334155', marginTop: '3px' }}>{proj.description}</p>}
                <span className="resume-entry-end" />
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  )
})

export default CorporatePro
