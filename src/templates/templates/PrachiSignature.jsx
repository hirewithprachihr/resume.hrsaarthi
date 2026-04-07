/**
 * PrachiSignature — Indian Corporate Premium Template
 * ─────────────────────────────────────────────────────
 * Layout: Dark navy sidebar (28%) + white main (72%)
 * Typography: Libre Baskerville name, Inter body
 * Palette: Navy + customizable Gold accent
 * Tier: Pro
 */

const DEFAULT_SETTINGS = {
  accentColor : '#C9A84C',
  sidebarColor: '#1A2B4B',
  fontFamily  : 'Inter, sans-serif',
}

export default function PrachiSignature({ data = {}, settings = {} }) {
  const { accentColor = DEFAULT_SETTINGS.accentColor, sidebarColor = DEFAULT_SETTINGS.sidebarColor } = settings
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data

  const navyBg    = sidebarColor
  const goldColor = accentColor
  const white     = '#FFFFFF'
  const bodyFont  = "'Inter', 'Helvetica Neue', Arial, sans-serif"
  const serifFont = "'Libre Baskerville', Georgia, serif"

  const sideStyle = { background: navyBg, color: white, padding: '40px 24px', boxSizing: 'border-box' }
  const mainStyle = { background: white, color: '#1A1A2E', padding: '40px 32px', boxSizing: 'border-box' }

  const sectionLabel = {
    fontSize: '8px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase',
    color: goldColor, marginBottom: '12px', fontFamily: bodyFont,
    display: 'flex', alignItems: 'center', gap: 8,
  }

  const dividerLine = {
    border: 'none', borderTop: `1px solid rgba(255,255,255,0.12)`, margin: '20px 0',
  }

  const mainSection = {
    borderLeft: `3px solid ${goldColor}`, paddingLeft: '14px',
    marginBottom: '22px',
  }

  const mainSectionTitle = {
    fontSize: '9px', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: goldColor, marginBottom: '14px', fontFamily: bodyFont,
  }

  return (
    <div className="resume-a4" style={{ display: 'flex', fontFamily: bodyFont, background: white }}>

      {/* ── LEFT SIDEBAR ─────────────────────────────── */}
      <div style={{ width: '28%', ...sideStyle, display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* Name + Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{
            fontFamily: serifFont, fontSize: '22px', fontWeight: 700,
            color: white, lineHeight: 1.2, marginBottom: 4,
            letterSpacing: '-0.01em',
          }}>
            {personal.fullName || 'Your Name'}
          </div>
          <div style={{
            fontSize: '10px', fontWeight: 600, color: goldColor,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            fontFamily: bodyFont,
          }}>
            {personal.jobTitle || 'Professional Title'}
          </div>
          <div style={{ width: 40, height: 2, background: goldColor, marginTop: 10, borderRadius: 1 }} />
        </div>

        {/* Contact */}
        <div style={{ marginBottom: 20 }}>
          <div style={sectionLabel}>
            <span style={{ width: 16, height: 1, background: goldColor, display: 'inline-block' }} />
            Contact
          </div>
          {personal.email && (
            <ContactRow icon="✉" text={personal.email} color={goldColor} />
          )}
          {personal.phone && (
            <ContactRow icon="📱" text={personal.phone} color={goldColor} />
          )}
          {personal.location && (
            <ContactRow icon="📍" text={personal.location} color={goldColor} />
          )}
          {personal.linkedin && (
            <ContactRow icon="in" text={personal.linkedin} color={goldColor} serif />
          )}
          {personal.website && (
            <ContactRow icon="🌐" text={personal.website} color={goldColor} />
          )}
        </div>

        <hr style={dividerLine} />

        {/* Skills */}
        {skills.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={sectionLabel}>
              <span style={{ width: 16, height: 1, background: goldColor, display: 'inline-block' }} />
              Expertise
            </div>
            {skills.map((sk, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                {sk.category && (
                  <div style={{ fontSize: '7.5px', fontWeight: 800, color: goldColor, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4, fontFamily: bodyFont }}>
                    {sk.category}
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {(sk.items || '').split(',').slice(0, 6).map((s, j) => (
                    <span key={j} style={{
                      fontSize: '8px', fontFamily: bodyFont, fontWeight: 500,
                      background: 'rgba(255,255,255,0.1)', border: `1px solid rgba(255,255,255,0.2)`,
                      color: white, padding: '2px 6px', borderRadius: 3,
                    }}>
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <hr style={dividerLine} />

        {/* Education */}
        {education.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={sectionLabel}>
              <span style={{ width: 16, height: 1, background: goldColor, display: 'inline-block' }} />
              Education
            </div>
            {education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '9.5px', fontWeight: 700, color: white, fontFamily: bodyFont, marginBottom: 2 }}>
                  {ed.degree || ed.school}
                </div>
                <div style={{ fontSize: '8px', color: 'rgba(255,255,255,0.7)', fontFamily: bodyFont, marginBottom: 1 }}>
                  {ed.school}
                </div>
                <div style={{ fontSize: '7.5px', color: goldColor, fontFamily: bodyFont }}>
                  {[ed.startDate, ed.endDate].filter(Boolean).join(' – ')}
                  {ed.grade && ` · ${ed.grade}`}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Languages */}
        {languages.length > 0 && (
          <>
            <hr style={dividerLine} />
            <div>
              <div style={sectionLabel}>
                <span style={{ width: 16, height: 1, background: goldColor, display: 'inline-block' }} />
                Languages
              </div>
              {languages.map((l, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: '9px', color: white, fontFamily: bodyFont }}>{l.language}</span>
                  <span style={{ fontSize: '7.5px', color: goldColor, fontFamily: bodyFont, fontWeight: 700 }}>{l.proficiency}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Certifications in sidebar */}
        {certifications.length > 0 && (
          <>
            <hr style={dividerLine} />
            <div>
              <div style={sectionLabel}>
                <span style={{ width: 16, height: 1, background: goldColor, display: 'inline-block' }} />
                Certifications
              </div>
              {certifications.slice(0, 4).map((c, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: '8.5px', fontWeight: 700, color: white, fontFamily: bodyFont }}>{c.name}</div>
                  <div style={{ fontSize: '7.5px', color: goldColor, fontFamily: bodyFont }}>{c.issuer} {c.date && `· ${c.date}`}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── RIGHT MAIN ───────────────────────────────── */}
      <div style={{ width: '72%', ...mainStyle }}>

        {/* Summary box */}
        {personal.summary && (
          <div style={{
            background: '#F8F5EF', border: `1px solid ${goldColor}33`,
            borderLeft: `3px solid ${goldColor}`,
            borderRadius: '0 6px 6px 0',
            padding: '12px 16px', marginBottom: 24,
          }}>
            <div style={{ fontSize: '7.5px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: goldColor, marginBottom: 6, fontFamily: bodyFont }}>
              Professional Profile
            </div>
            <div style={{ fontSize: '9.5px', color: '#374151', lineHeight: 1.65, fontFamily: bodyFont }}>
              {personal.summary}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="resume-section" style={mainSection}>
            <div style={mainSectionTitle}>Professional Experience</div>
            {experience.map((exp, i) => (
              <div key={i} className="resume-entry" style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#1A1A2E', fontFamily: bodyFont }}>{exp.title}</div>
                    <div style={{ fontSize: '9.5px', fontWeight: 600, color: navyBg, fontFamily: bodyFont }}>{exp.company}{exp.location && ` · ${exp.location}`}</div>
                  </div>
                  <div style={{
                    fontSize: '7.5px', fontWeight: 700, color: goldColor,
                    background: `${goldColor}18`, border: `1px solid ${goldColor}33`,
                    padding: '2px 8px', borderRadius: 3, fontFamily: bodyFont,
                    whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 8,
                  }}>
                    {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                  </div>
                </div>
                {(exp.bullets || []).map((b, j) => (
                  <div key={j} style={{ display: 'flex', gap: 7, marginTop: 4 }}>
                    <span style={{ color: goldColor, flexShrink: 0, fontSize: 10, lineHeight: 1.6 }}>▸</span>
                    <span style={{ fontSize: '9.5px', color: '#374151', lineHeight: 1.65, fontFamily: bodyFont }}>{b}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="resume-section" style={mainSection}>
            <div style={mainSectionTitle}>Key Projects</div>
            {projects.slice(0, 3).map((p, i) => (
              <div key={i} className="resume-entry" style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'baseline', marginBottom: 2 }}>
                  <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#1A1A2E', fontFamily: bodyFont }}>{p.name}</div>
                  {p.technologies && (
                    <div style={{ fontSize: '7.5px', color: '#6B7280', fontFamily: bodyFont }}>· {p.technologies}</div>
                  )}
                </div>
                {p.description && (
                  <div style={{ fontSize: '9px', color: '#4B5563', lineHeight: 1.6, fontFamily: bodyFont }}>{p.description}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ContactRow({ icon, text, color, serif }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
      <span style={{
        width: 16, height: 16, borderRadius: 4,
        background: `${color}22`, border: `1px solid ${color}44`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: serif ? '7px' : '8px', fontWeight: 900, color,
        flexShrink: 0, fontFamily: serif ? "'Libre Baskerville', serif" : 'Inter, sans-serif',
      }}>
        {typeof icon === 'string' && icon.length <= 2 ? icon : '●'}
      </span>
      <span style={{
        fontSize: '8px', color: 'rgba(255,255,255,0.8)',
        fontFamily: "'Inter', sans-serif", lineHeight: 1.4,
        wordBreak: 'break-all',
      }}>
        {text}
      </span>
    </div>
  )
}
