/**
 * LegalEagle — Lawyer / Advocate / Legal Counsel / LLB/LLM Template
 * ─────────────────────────────────────────────────────────────────
 * Layout  : Formal serif-inspired single column, midnight navy palette
 * Target  : Advocates, Corporate Lawyers, Legal Counsel, LLB/LLM graduates
 * Design  : Conservative, authoritative — like a legal brief
 * Tier    : Pro
 */
const DEFAULT_ACCENT = '#1e3a5f'
const GOLD = '#C9A84C'
const font = "'Georgia', 'Times New Roman', serif"
const sansFont = "'Inter', Arial, sans-serif"

function Rule({ accent }) {
  return <div style={{ height: '1px', background: `linear-gradient(90deg, ${accent}, ${GOLD}, ${accent})`, margin: '6px 0' }} />
}

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.25em', textTransform: 'uppercase', color: accent, fontFamily: sansFont, whiteSpace: 'nowrap' }}>{title}</div>
        <div style={{ flex: 1, height: 1, background: `${accent}30` }} />
        <div style={{ width: 4, height: 4, borderRadius: '50%', background: GOLD, flexShrink: 0 }} />
      </div>
      {children}
    </div>
  )
}

export default function LegalEagle({ data = {}, settings = {} }) {
  const accent = settings?.accentColor || DEFAULT_ACCENT
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data

  return (
    <div className="resume-a4" style={{ fontFamily: font, background: '#fff', color: '#1e293b', padding: '36px 44px' }}>

      {/* Header — Centred, formal */}
      <header style={{ textAlign: 'center', marginBottom: 18, paddingBottom: 14 }}>
        <div style={{ fontSize: '30px', fontWeight: 700, color: accent, letterSpacing: '0.02em', lineHeight: 1.1, fontFamily: font, marginBottom: 4 }}>
          {personal.fullName || 'Your Name'}
        </div>
        {/* Credentials line */}
        {(certifications.length > 0 || personal.jobTitle) && (
          <div style={{ fontSize: '11px', fontWeight: 400, color: GOLD, fontFamily: sansFont, letterSpacing: '0.08em', fontStyle: 'italic', marginBottom: 10 }}>
            {personal.jobTitle}
            {certifications.length > 0 && ` · ${certifications.slice(0, 2).map(c => c.name).join(' · ')}`}
          </div>
        )}
        <Rule accent={accent} />
        {/* Contact */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 20px', fontSize: '9px', color: '#475569', fontFamily: sansFont, marginTop: 6, marginBottom: 6 }}>
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
        <Rule accent={accent} />
      </header>

      {/* Profile / Summary */}
      {personal.summary && (
        <Section title="Professional Profile" accent={accent}>
          <p style={{ fontSize: '10px', color: '#374151', lineHeight: 1.75, textAlign: 'justify', fontStyle: 'italic', marginLeft: 8, borderLeft: `2px solid ${GOLD}`, paddingLeft: 12 }}>
            {personal.summary}
          </p>
        </Section>
      )}

      {/* Practice Areas / Skills */}
      {skills.length > 0 && (
        <Section title="Areas of Practice" accent={accent}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 0', fontFamily: sansFont }}>
            {skills.flatMap(s => (s.items || '').split(',').map(i => i.trim()).filter(Boolean)).map((sk, i, arr) => (
              <span key={i} style={{ fontSize: '9.5px', color: '#1e293b' }}>
                {sk}{i < arr.length - 1 ? <span style={{ color: GOLD, margin: '0 6px' }}>·</span> : ''}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Legal Experience */}
      {experience.length > 0 && (
        <Section title="Legal Experience" accent={accent}>
          {experience.map((exp, i) => (
            <div key={exp.id || i} className="resume-entry" style={{ marginBottom: 16, paddingLeft: 10, borderLeft: `2px solid ${GOLD}40` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: accent, fontFamily: font }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: '10px', color: '#475569', fontFamily: sansFont, fontStyle: 'italic', marginLeft: 8 }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</span>}
                </div>
                <span style={{ fontSize: '9px', color: '#64748b', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 8, fontFamily: sansFont }}>
                  {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                </span>
              </div>
              {(exp.bullets || []).filter(b => b?.trim()).map((b, j) => (
                <div key={j} style={{ display: 'flex', gap: 8, fontSize: '9.5px', color: '#374151', lineHeight: 1.65, marginBottom: 3, fontFamily: sansFont, textAlign: 'justify' }}>
                  <span style={{ color: GOLD, fontWeight: 900, flexShrink: 0 }}>§</span><span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </Section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <Section title="Academic Qualifications" accent={accent}>
          {education.map((ed, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${GOLD}40`, fontFamily: sansFont }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '10.5px', color: accent, fontFamily: font }}>{ed.degree}</div>
                <div style={{ fontSize: '9.5px', color: '#475569', fontStyle: 'italic' }}>{ed.school}{ed.location ? `, ${ed.location}` : ''}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                {ed.grade && <div style={{ fontSize: '9px', fontWeight: 700, color: GOLD }}>{ed.grade}</div>}
                <div style={{ fontSize: '8.5px', color: '#94a3b8' }}>{ed.endDate}</div>
              </div>
            </div>
          ))}
        </Section>
      )}

      {/* Cases / Notable Matters */}
      {projects.length > 0 && (
        <Section title="Notable Matters & Publications" accent={accent}>
          {projects.map((p, i) => (
            <div key={i} className="resume-entry" style={{ marginBottom: 10, paddingLeft: 10, borderLeft: `2px solid ${GOLD}40`, fontFamily: sansFont }}>
              <div style={{ fontWeight: 700, fontSize: '10.5px', color: accent, fontFamily: font, marginBottom: 2 }}>{p.name}</div>
              {p.technologies && <div style={{ fontSize: '8.5px', color: GOLD, fontWeight: 600, marginBottom: 2 }}>{p.technologies}</div>}
              {p.description && <div style={{ fontSize: '9.5px', color: '#475569', lineHeight: 1.6, textAlign: 'justify' }}>{p.description}</div>}
            </div>
          ))}
        </Section>
      )}

      {/* Certifications + Languages row */}
      <div style={{ display: 'flex', gap: 28, marginTop: 4 }}>
        {certifications.length > 0 && (
          <div style={{ flex: 1 }}>
            <Section title="Bar Enrolment & Certifications" accent={accent}>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 6, fontFamily: sansFont }}>
                  <span style={{ fontSize: '9.5px', fontWeight: 700, color: '#0f172a' }}>{c.name}</span>
                  {c.issuer && <span style={{ color: '#94a3b8', fontSize: '8.5px', marginLeft: 4 }}>· {c.issuer}{c.date ? ` (${c.date})` : ''}</span>}
                </div>
              ))}
            </Section>
          </div>
        )}
        {languages.length > 0 && (
          <div style={{ flex: 1 }}>
            <Section title="Languages" accent={accent}>
              {languages.map((l, i) => (
                <div key={i} style={{ fontSize: '9.5px', display: 'flex', justifyContent: 'space-between', marginBottom: 3, fontFamily: sansFont }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span><span style={{ color: '#94a3b8' }}>{l.proficiency}</span>
                </div>
              ))}
            </Section>
          </div>
        )}
      </div>
    </div>
  )
}
