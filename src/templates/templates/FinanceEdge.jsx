/**
 * FinanceEdge — Finance / CA / Banking / Investment Template
 * ────────────────────────────────────────────────────────────
 * Layout  : Full-width dark navy header + two-column body (Key Expertise | Experience)
 * Target  : CA, CFA, MBA Finance, Investment Banking, Financial Analyst, CFO-track
 * Tone    : Ultra-conservative, corporate — precision and trust
 * Tier    : Pro
 *
 * Design rules:
 *  - Numbers everywhere: every achievement must have a ₹ or % figure
 *  - No photo (investment banking culture doesn't use photos in India for senior roles)
 *  - Certifications (CA, CFA, CPA) displayed very prominently
 *  - Two-column body: Technical Skills/Domain | Work Experience
 */

const DEFAULT_ACCENT = '#1A56DB'
const NAVY = '#0f1e3d'

function BodySection({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{
        fontSize: '8px', fontWeight: 900, letterSpacing: '0.22em', textTransform: 'uppercase',
        color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: 3, marginBottom: 8,
        fontFamily: "'Inter', sans-serif",
      }}>{title}</div>
      {children}
    </div>
  )
}

export default function FinanceEdge({ data = {}, settings = {} }) {
  const accent = settings?.accentColor || DEFAULT_ACCENT
  const navyBg = settings?.sidebarColor || NAVY
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

  // Split skills into two groups for two-column layout
  const technicalSkills = skills.filter(s =>
    (s.category || '').toLowerCase().match(/technical|tool|software|system|erp|program|it|computer|data/i)
  )
  const domainSkills = skills.filter(s => !technicalSkills.includes(s))

  return (
    <div className="resume-a4" style={{ fontFamily: bodyFont, background: '#fff', color: '#1e293b' }}>

      {/* ── NAVY HEADER ──────────────────────────────────────── */}
      <header style={{ background: navyBg, padding: '28px 40px 22px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{
              fontSize: '30px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em',
              lineHeight: 1.1, marginBottom: 4,
            }}>
              {personal.fullName || 'Your Name'}
            </div>
            {personal.jobTitle && (
              <div style={{ fontSize: '13px', fontWeight: 600, color: accent === DEFAULT_ACCENT ? '#93c5fd' : accent + 'cc', letterSpacing: '0.04em' }}>
                {personal.jobTitle}
              </div>
            )}
            {/* Certification credentials inline with title */}
            {certifications.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {certifications.slice(0, 4).map((c, i) => (
                  <span key={i} style={{
                    fontSize: '8px', fontWeight: 800, padding: '3px 10px', borderRadius: 4,
                    background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)',
                    color: '#fff', letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>
                    {c.name.length > 25 ? c.name.substring(0, 23) + '…' : c.name}
                    {c.date ? ` (${c.date})` : ''}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Contact block — right side */}
          <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 24 }}>
            {personal.email    && <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{personal.email}</div>}
            {personal.phone    && <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{personal.phone}</div>}
            {personal.location && <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{personal.location}</div>}
            {personal.linkedin && <div style={{ fontSize: '9px', color: '#93c5fd', marginBottom: 4, wordBreak: 'break-all' }}>{personal.linkedin}</div>}
          </div>
        </div>

        {/* Summary inside header */}
        {personal.summary && (
          <div style={{
            marginTop: 14, padding: '10px 14px',
            background: 'rgba(255,255,255,0.07)', borderLeft: `3px solid ${accent === DEFAULT_ACCENT ? '#93c5fd' : accent}`,
            borderRadius: '0 4px 4px 0',
          }}>
            <div style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.65 }}>
              {personal.summary}
            </div>
          </div>
        )}
      </header>

      {/* ── TWO-COLUMN BODY ──────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 0 }}>

        {/* LEFT: Key Expertise + Education + Certifications full list */}
        <div style={{ width: '32%', padding: '22px 20px 22px 28px', borderRight: `1px solid #e2e8f0`, boxSizing: 'border-box' }}>

          {/* Key Expertise */}
          {skills.length > 0 && (
            <BodySection title="Key Expertise" accent={accent}>
              {skills.map((sk, i) => (
                <div key={sk.id || i} style={{ marginBottom: 8 }}>
                  {sk.category && (
                    <div style={{ fontSize: '8px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                      {sk.category}
                    </div>
                  )}
                  <div style={{ fontSize: '9px', color: '#475569', lineHeight: 1.5 }}>{sk.items}</div>
                </div>
              ))}
            </BodySection>
          )}

          {/* Education */}
          {education.length > 0 && (
            <BodySection title="Education" accent={accent}>
              {education.map((ed, i) => (
                <div key={ed.id || i} style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#0f172a', lineHeight: 1.3 }}>{ed.degree}</div>
                  <div style={{ fontSize: '9px', color: '#475569', marginTop: 1 }}>{ed.school}</div>
                  {ed.location && <div style={{ fontSize: '8.5px', color: '#94a3b8' }}>{ed.location}</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <span style={{ fontSize: '8px', color: accent, fontWeight: 700 }}>{ed.grade}</span>
                    <span style={{ fontSize: '8px', color: '#94a3b8' }}>{ed.endDate}</span>
                  </div>
                </div>
              ))}
            </BodySection>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <BodySection title="Languages" accent={accent}>
              {languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, color: '#0f172a' }}>{l.language}</span>
                  {l.proficiency && <span style={{ color: '#94a3b8' }}>{l.proficiency}</span>}
                </div>
              ))}
            </BodySection>
          )}
        </div>

        {/* RIGHT: Work Experience + Projects */}
        <div style={{ flex: 1, padding: '22px 28px 22px 22px', boxSizing: 'border-box' }}>

          {/* Work Experience */}
          {experience.length > 0 && (
            <BodySection title="Work Experience" accent={accent}>
              {experience.map((exp, i) => (
                <div key={exp.id || i} className="resume-entry" style={{ marginBottom: 14, paddingBottom: 12, borderBottom: i < experience.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>{exp.title}</div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: navyBg, marginTop: 1 }}>
                        {exp.company}
                        {exp.location && <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: '9px' }}> · {exp.location}</span>}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '8px', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap',
                      background: navyBg, padding: '2px 8px', borderRadius: 4, flexShrink: 0,
                    }}>
                      {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                    </span>
                  </div>
                  {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                    <ul style={{ paddingLeft: 14, marginTop: 5, listStyleType: 'none' }}>
                      {exp.bullets.filter(b => b?.trim()).map((b, j) => (
                        <li key={j} style={{ fontSize: '9.5px', color: '#334155', lineHeight: 1.55, marginBottom: 3, display: 'flex', gap: 6 }}>
                          <span style={{ color: accent, fontWeight: 900, flexShrink: 0 }}>▪</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </BodySection>
          )}

          {/* Projects / Key Deals */}
          {projects.length > 0 && (
            <BodySection title="Key Projects & Deals" accent={accent}>
              {projects.map((p, i) => (
                <div key={p.id || i} className="resume-entry" style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: '10.5px', color: '#0f172a', marginBottom: 2 }}>{p.name}</div>
                  {p.technologies && (
                    <div style={{ fontSize: '8.5px', color: accent, fontWeight: 600, marginBottom: 3 }}>{p.technologies}</div>
                  )}
                  {p.description && (
                    <div style={{ fontSize: '9.5px', color: '#475569', lineHeight: 1.55 }}>{p.description}</div>
                  )}
                </div>
              ))}
            </BodySection>
          )}
        </div>
      </div>

      {/* ── Accent footer rule ─────────────────────────────── */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${navyBg}, ${accent})` }} />
    </div>
  )
}
