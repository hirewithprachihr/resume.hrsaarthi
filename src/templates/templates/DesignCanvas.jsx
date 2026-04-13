/**
 * DesignCanvas — Creative Designer Pro Template
 * ─────────────────────────────────────────────────────
 * Layout: Bold color-block left column (35%) + clean white right (65%)
 * Typography: Plus Jakarta Sans / Inter
 * Target: Graphic Designers, UX/UI, Creative Directors
 * Tier: Pro
 */

const DESIGN_TOOLS = ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'After Effects', 'InVision', 'Sketch', 'Webflow']

export default function DesignCanvas({ data = {}, settings = {} }) {
  const accent = settings.accentColor || '#7B2D8B'
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [] } = data

  const bodyFont = "'Plus Jakarta Sans', 'Inter', sans-serif"
  const headFont = "'Plus Jakarta Sans', 'Inter', sans-serif"

  // Derive complementary light from accent
  const lightBg   = '#FAFAFA'
  const textMain  = '#0F0F14'
  const textSub   = '#5A5A72'

  // Find design tools in skills
  const allSkillText = skills.map(s => s.items || '').join(',').toLowerCase()
  const foundTools = DESIGN_TOOLS.filter(t => allSkillText.includes(t.toLowerCase()))

  return (
    <div style={{ display: 'flex', fontFamily: bodyFont, background: lightBg, overflow: 'visible', minHeight: '100%' }}>

      {/* ── LEFT COLOR BLOCK ──────────────────────────── */}
      <div data-is-sidebar="true" style={{
        width: '35%', background: accent, color: '#fff',
        padding: '40px 22px 36px', boxSizing: 'border-box',
        display: 'flex', flexDirection: 'column', position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 120, height: 120,
          borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 30, left: -30, width: 90, height: 90,
          borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none',
        }} />

        {/* Name — Large */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div style={{
            fontSize: '24px', fontWeight: 900, color: '#fff',
            fontFamily: headFont, lineHeight: 1.1, letterSpacing: '-0.02em',
            wordBreak: 'break-word',
          }}>
            {(personal.fullName || 'Designer Name').toUpperCase()}
          </div>
          <div style={{
            fontSize: '9.5px', fontWeight: 700, color: 'rgba(255,255,255,0.85)',
            fontFamily: bodyFont, letterSpacing: '0.14em', textTransform: 'uppercase',
            marginTop: 6,
          }}>
            {personal.jobTitle || 'Creative Designer'}
          </div>
          {/* Accent dash */}
          <div style={{ width: 32, height: 3, background: '#fff', borderRadius: 2, marginTop: 10, opacity: 0.7 }} />
        </div>

        {/* Portfolio — Prominent */}
        {(personal.website || personal.linkedin) && (
          <div style={{
            background: 'rgba(255,255,255,0.15)', borderRadius: 8,
            padding: '8px 12px', marginBottom: 18,
            border: '1px solid rgba(255,255,255,0.25)',
          }}>
            <div style={{ fontSize: '7px', fontWeight: 900, letterSpacing: '0.16em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 2 }}>
              Portfolio
            </div>
            <div style={{ fontSize: '9px', color: '#fff', fontFamily: bodyFont, fontWeight: 600, wordBreak: 'break-all' }}>
              {personal.website || personal.linkedin}
            </div>
          </div>
        )}

        {/* Contact */}
        <div style={{ marginBottom: 18 }}>
          <SidebarLabel>Contact</SidebarLabel>
          {personal.email    && <SidebarInfo label="Email"    value={personal.email} />}
          {personal.phone    && <SidebarInfo label="Phone"    value={personal.phone} />}
          {personal.location && <SidebarInfo label="Location" value={personal.location} />}
          {personal.linkedin && <SidebarInfo label="LinkedIn" value={personal.linkedin.replace('linkedin.com/in/', '')} />}
        </div>

        {/* Skills as Pills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <SidebarLabel>Skills</SidebarLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {skills.map((sk) =>
                (sk.items || '').split(',').slice(0, 5).map((s, j) => (
                  <span key={j} style={{
                    fontSize: '7.5px', fontFamily: bodyFont, fontWeight: 700,
                    background: 'rgba(255,255,255,0.18)', color: '#fff',
                    padding: '3px 8px', borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.3)',
                    letterSpacing: '0.04em',
                  }}>
                    {s.trim()}
                  </span>
                ))
              )}
            </div>
          </div>
        )}

        {/* Design Tools */}
        {foundTools.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <SidebarLabel>Tools</SidebarLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {foundTools.map(t => (
                <span key={t} style={{
                  fontSize: '7.5px', fontFamily: bodyFont, fontWeight: 800,
                  background: 'rgba(255,255,255,0.22)', color: '#fff',
                  padding: '2px 7px', borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.25)',
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <SidebarLabel>Education</SidebarLabel>
            {education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: '8.5px', fontWeight: 700, color: '#fff', fontFamily: bodyFont }}>{ed.degree || ed.school}</div>
                <div style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.7)', fontFamily: bodyFont }}>{ed.school}</div>
                <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.5)', fontFamily: bodyFont }}>{[ed.startDate, ed.endDate].filter(Boolean).join(' – ')}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT MAIN ───────────────────────────────── */}
      <div style={{ width: '65%', background: '#fff', padding: '40px 28px 36px', boxSizing: 'border-box' }}>

        {/* Summary */}
        {personal.summary && (
          <div style={{ marginBottom: 22 }}>
            <MainSectionTitle accent={accent}>About Me</MainSectionTitle>
            <div style={{ fontSize: '9.5px', color: textSub, lineHeight: 1.7, fontFamily: bodyFont }}>
              {personal.summary}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="resume-section" style={{ marginBottom: 20 }}>
            <MainSectionTitle accent={accent}>Experience</MainSectionTitle>
            {experience.map((exp, i) => (
              <div key={i} className="resume-entry" style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < experience.length - 1 ? '1px solid #F0F0F5' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                  <div>
                    <div style={{ fontSize: '10.5px', fontWeight: 800, color: textMain, fontFamily: headFont }}>{exp.title}</div>
                    <div style={{ fontSize: '9px', fontWeight: 600, color: accent, fontFamily: bodyFont }}>{exp.company}</div>
                  </div>
                  {/* Role tag pill */}
                  <div style={{
                    fontSize: '7px', fontWeight: 700, fontFamily: bodyFont,
                    background: `${accent}14`, color: accent,
                    border: `1px solid ${accent}30`, padding: '2px 8px',
                    borderRadius: 999, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 6,
                  }}>
                    {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                  </div>
                </div>
                {exp.location && (
                  <div style={{ fontSize: '7.5px', color: textSub, fontFamily: bodyFont, marginBottom: 5 }}>📍 {exp.location}</div>
                )}
                {(exp.bullets || []).map((b, j) => (
                  <div key={j} style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: accent, flexShrink: 0, marginTop: 5,
                    }} />
                    <span style={{ fontSize: '9px', color: textSub, lineHeight: 1.65, fontFamily: bodyFont }}>{b}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Projects / Portfolio highlights */}
        {projects.length > 0 && (
          <div className="resume-section" style={{ marginBottom: 20 }}>
            <MainSectionTitle accent={accent}>Design Projects</MainSectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {projects.slice(0, 4).map((p, i) => (
                <div key={i} className="resume-entry" style={{
                  background: `${accent}09`, border: `1px solid ${accent}20`,
                  borderRadius: 8, padding: '10px 12px',
                }}>
                  <div style={{ fontSize: '9.5px', fontWeight: 800, color: textMain, fontFamily: headFont, marginBottom: 2 }}>{p.name}</div>
                  {p.technologies && (
                    <div style={{ fontSize: '7.5px', color: accent, fontFamily: bodyFont, fontWeight: 700, marginBottom: 4 }}>{p.technologies}</div>
                  )}
                  {p.description && (
                    <div style={{ fontSize: '8.5px', color: textSub, lineHeight: 1.55, fontFamily: bodyFont }}>{p.description.substring(0, 100)}{p.description.length > 100 ? '...' : ''}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="resume-section">
            <MainSectionTitle accent={accent}>Certifications</MainSectionTitle>
            {certifications.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                <span style={{ fontSize: '9px', fontWeight: 700, color: textMain, fontFamily: bodyFont }}>{c.name}</span>
                <span style={{ fontSize: '8px', color: textSub, fontFamily: bodyFont }}>· {c.issuer} {c.date && `(${c.date})`}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer accent bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: '35%', right: 0,
          height: 5, background: `linear-gradient(90deg, ${accent}, ${accent}55)`,
        }} />
      </div>
    </div>
  )
}

function SidebarLabel({ children }) {
  return (
    <div style={{
      fontSize: '7.5px', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.6)', marginBottom: 8, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
    }}>
      {children}
    </div>
  )
}

function SidebarInfo({ label, value }) {
  return (
    <div style={{ marginBottom: 5 }}>
      <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: "'Inter', sans-serif" }}>
        {label}
      </div>
      <div style={{ fontSize: '8.5px', color: '#fff', fontFamily: "'Inter', sans-serif", wordBreak: 'break-all' }}>
        {value}
      </div>
    </div>
  )
}

function MainSectionTitle({ children, accent }) {
  return (
    <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        fontSize: '8.5px', fontWeight: 900, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: accent,
        fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
      }}>
        {children}
      </div>
      <div style={{ flex: 1, height: 1, background: `${accent}30` }} />
    </div>
  )
}
