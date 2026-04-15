/**
 * DevStack — Software Engineer / Developer Template
 * ──────────────────────────────────────────────────
 * Layout  : Dark sidebar 30% + white main 70%
 * Target  : React devs, Backend, Full-stack, DevOps — 0 to 8 years experience
 * Tier    : Pro
 *
 * Sidebar: dark accent bg, contact, categorized skills, GitHub
 * Main   : experience with code-style bullets, projects with tech tags, education, certs
 */

const DEFAULT_ACCENT = '#0E9F6E'

function SkillPill({ label }) {
  return (
    <span style={{
      display: 'inline-block', fontSize: '7.5px', fontWeight: 600,
      padding: '2px 7px', borderRadius: 3,
      background: 'rgba(255,255,255,0.12)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: '#fff', lineHeight: 1.4, margin: '2px 2px 2px 0',
    }}>{label}</span>
  )
}

function SideSection({ title, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontSize: '7px', fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.45)', marginBottom: 7, fontFamily: "'Inter', sans-serif",
        borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 4,
      }}>{title}</div>
      {children}
    </div>
  )
}

function MainSection({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{
        fontSize: '8.5px', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase',
        color: accent, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: "'Inter', sans-serif",
      }}>
        {title}
        <div style={{ flex: 1, height: 1, background: accent + '30' }} />
      </div>
      {children}
    </div>
  )
}

export default function DevStack({ data = {}, settings = {} }) {
  const accent = settings?.accentColor || DEFAULT_ACCENT
  const {
    personal = {},
    experience = [],
    education = [],
    skills = [],
    certifications = [],
    projects = [],
    languages = [],
  } = data

  const bodyFont = "'Inter', 'Helvetica Neue', Arial, sans-serif"
  const monoFont = "'JetBrains Mono', 'Fira Code', 'Courier New', monospace"

  // Group skills by category for sidebar
  const skillGroups = skills.reduce((acc, sk) => {
    const cat = sk.category || 'Skills'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(...(sk.items || '').split(',').map(s => s.trim()).filter(Boolean))
    return acc
  }, {})

  return (
    <div className="resume-a4" style={{ display: 'flex', fontFamily: bodyFont, background: '#fff' }}>

      {/* ── LEFT DARK SIDEBAR ───────────────────────── */}
      <div data-is-sidebar="true" style={{
        width: '30%', background: '#0f172a', color: '#e2e8f0',
        padding: '32px 18px', display: 'flex', flexDirection: 'column', boxSizing: 'border-box',
      }}>

        {/* Avatar / Initials */}
        <div style={{ marginBottom: 16 }}>
          {personal.photo ? (
            <img src={personal.photo} alt="Profile" style={{
              width: 72, height: 72, borderRadius: '50%', objectFit: 'cover',
              border: `2px solid ${accent}`, marginBottom: 12,
            }} />
          ) : (
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: accent + '30',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', fontWeight: 900, color: accent, marginBottom: 10, letterSpacing: '-1px',
            }}>
              {(personal.fullName || 'Y').charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Contact */}
        <SideSection title="Contact">
          {personal.email    && <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: 5, wordBreak: 'break-all' }}>✉ {personal.email}</div>}
          {personal.phone    && <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: 5 }}>📱 {personal.phone}</div>}
          {personal.location && <div style={{ fontSize: '8px', color: '#94a3b8', marginBottom: 5 }}>📍 {personal.location}</div>}
          {personal.linkedin && <div style={{ fontSize: '8px', color: accent, marginBottom: 5, wordBreak: 'break-all' }}>🔗 {personal.linkedin}</div>}
          {personal.github   && <div style={{ fontSize: '8px', color: accent, marginBottom: 5, wordBreak: 'break-all' }}>⌨ {personal.github}</div>}
          {personal.website  && <div style={{ fontSize: '8px', color: accent, wordBreak: 'break-all' }}>🌐 {personal.website}</div>}
        </SideSection>

        {/* Skills by Category */}
        {Object.keys(skillGroups).length > 0 && (
          <SideSection title="Skills">
            {Object.entries(skillGroups).map(([cat, items]) => (
              <div key={cat} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '7.5px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{cat}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {items.slice(0, 8).map((s, i) => <SkillPill key={i} label={s} />)}
                </div>
              </div>
            ))}
          </SideSection>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <SideSection title="Languages">
            {languages.map((l, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', marginBottom: 4 }}>
                <span style={{ color: '#e2e8f0' }}>{l.language}</span>
                {l.proficiency && <span style={{ color: '#64748b', fontSize: '7.5px' }}>{l.proficiency}</span>}
              </div>
            ))}
          </SideSection>
        )}

        {/* Certifications (sidebar compact) */}
        {certifications.length > 0 && (
          <SideSection title="Certifications">
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: 7 }}>
                <div style={{ fontSize: '8px', fontWeight: 700, color: '#cbd5e1', lineHeight: 1.4 }}>{c.name}</div>
                {c.issuer && <div style={{ fontSize: '7px', color: '#64748b' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>}
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* ── RIGHT MAIN CONTENT ──────────────────────── */}
      <div style={{ width: '70%', background: '#fff', padding: '32px 28px', boxSizing: 'border-box' }}>

        {/* Name + Title */}
        <div style={{ marginBottom: 18, paddingBottom: 14, borderBottom: `2px solid ${accent}20` }}>
          <div style={{
            fontSize: '26px', fontWeight: 900, color: '#0f172a', lineHeight: 1.1,
            letterSpacing: '-0.02em', marginBottom: 3,
          }}>
            {personal.fullName || 'Your Name'}
          </div>
          {personal.jobTitle && (
            <div style={{ fontSize: '12px', fontWeight: 600, color: accent, letterSpacing: '0.04em', marginBottom: 6 }}>
              {personal.jobTitle}
            </div>
          )}
          {personal.summary && (
            <div style={{ fontSize: '9.5px', color: '#475569', lineHeight: 1.6, maxWidth: '90%' }}>
              {personal.summary}
            </div>
          )}
        </div>

        {/* Experience */}
        {experience.length > 0 && (
          <MainSection title="Work Experience" accent={accent}>
            {experience.map((exp, i) => (
              <div key={exp.id || i} className="resume-entry" style={{ marginBottom: 14, paddingBottom: 12, borderBottom: i < experience.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>{exp.title}</span>
                    {exp.company && (
                      <span style={{ fontSize: '10px', fontWeight: 600, color: accent, marginLeft: 6 }}>@ {exp.company}</span>
                    )}
                    {exp.location && (
                      <span style={{ fontSize: '8.5px', color: '#94a3b8', marginLeft: 4 }}>· {exp.location}</span>
                    )}
                  </div>
                  <span style={{
                    fontSize: '8px', color: '#64748b', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 8,
                    background: '#f8fafc', padding: '2px 8px', borderRadius: 4, border: '1px solid #e2e8f0',
                    fontFamily: monoFont,
                  }}>
                    {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                  </span>
                </div>
                {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                  <ul style={{ paddingLeft: 14, marginTop: 5, listStyleType: 'none' }}>
                    {exp.bullets.filter(b => b?.trim()).map((b, j) => (
                      <li key={j} style={{ fontSize: '9.5px', color: '#374151', lineHeight: 1.55, marginBottom: 3, display: 'flex', gap: 6 }}>
                        <span style={{ color: accent, flexShrink: 0, marginTop: 1 }}>▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <MainSection title="Projects" accent={accent}>
            {projects.map((p, i) => (
              <div key={p.id || i} className="resume-entry" style={{ marginBottom: 12, paddingLeft: 10, borderLeft: `2px solid ${accent}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f172a' }}>{p.name}</span>
                  {(p.url || p.github) && (
                    <span style={{ fontSize: '7.5px', color: accent, fontWeight: 600, marginLeft: 8, whiteSpace: 'nowrap' }}>
                      🔗 {p.url || p.github}
                    </span>
                  )}
                </div>
                {p.technologies && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 3 }}>
                    {p.technologies.split(',').map((t, j) => (
                      <span key={j} style={{
                        fontSize: '7px', fontWeight: 700, padding: '1px 6px', borderRadius: 3,
                        background: accent + '15', color: accent, border: `1px solid ${accent}30`,
                      }}>{t.trim()}</span>
                    ))}
                  </div>
                )}
                {p.description && (
                  <div style={{ fontSize: '9px', color: '#4b5563', lineHeight: 1.55 }}>{p.description}</div>
                )}
              </div>
            ))}
          </MainSection>
        )}

        {/* Education */}
        {education.length > 0 && (
          <MainSection title="Education" accent={accent}>
            {education.map((ed, i) => (
              <div key={ed.id || i} className="resume-entry" style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#0f172a' }}>{ed.degree}</div>
                  <div style={{ fontSize: '9.5px', color: '#475569' }}>{ed.school}{ed.location ? `, ${ed.location}` : ''}{ed.grade ? ` · ${ed.grade}` : ''}</div>
                </div>
                <span style={{ fontSize: '8.5px', color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: monoFont }}>
                  {ed.endDate || ed.startDate}
                </span>
              </div>
            ))}
          </MainSection>
        )}
      </div>
    </div>
  )
}
