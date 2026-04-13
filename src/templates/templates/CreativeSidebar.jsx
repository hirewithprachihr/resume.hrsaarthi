import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import { TYPE, pt } from '../typography'

const CreativeSidebar = React.memo(function CreativeSidebar({ data, settings }) {
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [], hobbies = [] } = data || {}
  const accent = settings?.accentColor || '#7C3AED'
  const sideWidth = '230px'

  return (
    <div style={{ display: 'flex', fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%' }}>
      {/* Sidebar */}
      <div style={{ width: sideWidth, flexShrink: 0, background: accent, color: '#fff', padding: '40px 22px', position: 'relative', overflow: 'hidden' }}>
        {/* decorative circle */}
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '60px', left: '-30px', width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        {/* Avatar */}
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: TYPE.weight.bold, color: '#fff', marginBottom: '16px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
          {(personal.fullName || 'Y')[0].toUpperCase()}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ ...pt(TYPE.SIZE.NAME - 6), fontWeight: TYPE.weight.bold, color: '#fff', lineHeight: 1.2, marginBottom: '4px', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
            {personal.fullName || 'Your Name'}
          </div>
          {personal.jobTitle && (
            <div style={{ ...pt(TYPE.SIZE.SMALL), color: 'rgba(255,255,255,0.75)', fontWeight: TYPE.weight.medium, marginBottom: '20px', lineHeight: 1.4 }}>
              {personal.jobTitle}
            </div>
          )}

          {/* Contact */}
          <SideSection title="Contact">
            {personal.email    && <SideItem icon={<Mail    size={10}/>} text={personal.email} />}
            {personal.phone    && <SideItem icon={<Phone   size={10}/>} text={personal.phone} />}
            {personal.location && <SideItem icon={<MapPin  size={10}/>} text={personal.location} />}
            {personal.linkedin && <SideItem icon={<Linkedin size={10}/>} text={personal.linkedin} />}
            {personal.website  && <SideItem icon={<Globe   size={10}/>} text={personal.website} />}
          </SideSection>

          {skills.length > 0 && (
            <SideSection title="Skills">
              {skills.map(sk => (
                <div key={sk.id} style={{ marginBottom: '9px' }}>
                  {sk.category && <div style={{ ...pt(TYPE.SIZE.SMALL), color: 'rgba(255,255,255,0.9)', fontWeight: TYPE.weight.bold, marginBottom: '4px' }}>{sk.category}</div>}
                  <div style={{ ...pt(TYPE.SIZE.SMALL), color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{sk.items}</div>
                </div>
              ))}
            </SideSection>
          )}

          {(languages || []).length > 0 && (
            <SideSection title="Languages">
              {languages.map(l => (
                <div key={l.id} style={{ ...pt(TYPE.SIZE.SMALL), marginBottom: '4px', color: 'rgba(255,255,255,0.75)' }}>
                  <span style={{ fontWeight: TYPE.weight.semibold, color: '#fff' }}>{l.language}</span>
                  {l.proficiency && ` · ${l.proficiency}`}
                </div>
              ))}
            </SideSection>
          )}

          {certifications.length > 0 && (
            <SideSection title="Certifications">
              {certifications.map(c => (
                <div key={c.id} style={{ marginBottom: '6px' }}>
                  <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#fff', fontWeight: TYPE.weight.semibold, lineHeight: 1.3 }}>{c.name}</div>
                  {c.issuer && <div style={{ ...pt(TYPE.SIZE.MICRO), color: 'rgba(255,255,255,0.55)' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>}
                </div>
              ))}
            </SideSection>
          )}

          {(hobbies || []).filter(h => h?.name?.trim()).length > 0 && (
            <SideSection title="Interests">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {hobbies.filter(h => h?.name?.trim()).map(h => (
                  <span key={h.id} style={{ ...pt(TYPE.SIZE.MICRO), background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: '20px', padding: '2px 8px', border: '1px solid rgba(255,255,255,0.2)' }}>{h.name}</span>
                ))}
              </div>
            </SideSection>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, background: '#fff', padding: '40px 28px' }}>
        {personal.summary?.trim() && (
          <div className="resume-entry" style={{ marginBottom: '20px', padding: '14px 16px', background: `${accent}08`, borderRadius: '10px', borderLeft: `3px solid ${accent}` }}>
            <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#334155', margin: 0 }}>{personal.summary}</p>
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && (
          <MainSection title="Experience" accent={accent} style={{ marginBottom: '18px' }}>
            {experience.map((exp, idx) => (
              <div key={exp.id} className="resume-entry" style={{ marginBottom: idx < experience.length - 1 ? `${TYPE.SPACE.ENTRY_BOTTOM}px` : '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div>
                    <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{exp.title}</div>
                    {exp.company && <div style={{ ...pt(TYPE.SIZE.BODY), color: accent, fontWeight: TYPE.weight.semibold }}>{exp.company}{exp.location ? <span style={{ color: '#94a3b8', fontWeight: TYPE.weight.regular }}> · {exp.location}</span> : ''}</div>}
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, paddingTop: '2px' }}>
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
          </MainSection>
        )}

        {education.length > 0 && (
          <MainSection title="Education" accent={accent} style={{ marginBottom: '18px' }}>
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
          </MainSection>
        )}

        {projects.length > 0 && (
          <MainSection title="Projects" accent={accent}>
            {projects.map(proj => (
              <div key={proj.id} className="resume-entry" style={{ marginBottom: '10px' }}>
                <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>
                  {proj.name}{proj.tech && <span style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.regular, color: '#64748b' }}> · {proj.tech}</span>}
                </div>
                {proj.description && <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#334155', marginTop: '3px' }}>{proj.description}</p>}
                <span className="resume-entry-end" />
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  )
})

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ ...pt(TYPE.SIZE.MICRO), fontWeight: TYPE.weight.black, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.15)', paddingBottom: '4px', marginBottom: '8px' }}>{title}</div>
      {children}
    </div>
  )
}

function SideItem({ icon, text }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '7px', ...pt(TYPE.SIZE.SMALL), color: 'rgba(255,255,255,0.75)', marginBottom: '5px' }}>
      <span style={{ flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <span style={{ wordBreak: 'break-all', lineHeight: 1.4 }}>{text}</span>
    </div>
  )
}

function MainSection({ title, accent, children, style }) {
  return (
    <div style={style}>
      <div className="resume-section-head" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, flexShrink: 0 }} />
        <span style={{ ...pt(TYPE.SIZE.SECTION), fontWeight: TYPE.weight.bold, textTransform: 'uppercase', letterSpacing: TYPE.tracking.caps, color: '#0f172a' }}>{title}</span>
        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
      </div>
      {children}
    </div>
  )
}

export default CreativeSidebar
