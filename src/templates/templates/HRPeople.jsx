/**
 * HRPeople — HR / Talent Acquisition / HRBP Template
 * ────────────────────────────────────────────────────
 * Layout  : Warm two-tone header (teal/white) + single-column body
 * Target  : HR Executives, TA Leads, HRBPs, L&D, HR Generalists
 * Tier    : Pro
 */
const DEFAULT_ACCENT = '#0E9F6E'
const font = "'Inter', 'Helvetica Neue', Arial, sans-serif"

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: accent, whiteSpace: 'nowrap', fontFamily: font }}>{title}</div>
        <div style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg, ${accent}60, transparent)` }} />
      </div>
      {children}
    </div>
  )
}

function Tag({ text, accent }) {
  return (
    <span style={{ display: 'inline-block', fontSize: '7.5px', fontWeight: 700, padding: '2px 8px', borderRadius: 3, background: accent + '15', color: accent, border: `1px solid ${accent}25`, margin: '2px 3px 2px 0', lineHeight: 1.5 }}>{text}</span>
  )
}

export default function HRPeople({ data = {}, settings = {} }) {
  const accent = settings?.accentColor || DEFAULT_ACCENT
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data

  return (
    <div className="resume-a4" style={{ fontFamily: font, background: '#fff', color: '#1e293b' }}>
      {/* Warm teal header */}
      <header style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}dd 100%)`, padding: '28px 40px 22px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', right: 40, bottom: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4 }}>{personal.fullName || 'Your Name'}</div>
            {personal.jobTitle && <div style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em', marginBottom: 10 }}>{personal.jobTitle}</div>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '9px', color: 'rgba(255,255,255,0.8)' }}>
              {personal.email    && <span>✉ {personal.email}</span>}
              {personal.phone    && <span>📱 {personal.phone}</span>}
              {personal.location && <span>📍 {personal.location}</span>}
              {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
            </div>
          </div>
          {/* People stats (HR loves metrics) */}
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            {[
              { val: experience.length ? `${experience.length * 2}+` : '5+', label: 'Years Exp' },
              { val: experience.length ? `${experience[0]?.teamSize || '500+'}` : '500+', label: 'Employees Managed' },
            ].map(stat => (
              <div key={stat.label} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 12px', minWidth: 60 }}>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>{stat.val}</div>
                <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.3 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        {personal.summary && (
          <div style={{ position: 'relative', marginTop: 14, fontSize: '9.5px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.65, maxWidth: '75%' }}>
            {personal.summary}
          </div>
        )}
      </header>

      {/* Body */}
      <div style={{ padding: '24px 40px' }}>
        <div style={{ display: 'flex', gap: 28 }}>
          {/* Left column: skills, certifications, education */}
          <div style={{ width: '34%', flexShrink: 0 }}>
            {skills.length > 0 && (
              <Section title="HR Expertise" accent={accent}>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {skills.flatMap(s => (s.items || '').split(',').map(i => i.trim()).filter(Boolean)).map((sk, i) => (
                    <Tag key={i} text={sk} accent={accent} />
                  ))}
                </div>
              </Section>
            )}
            {certifications.length > 0 && (
              <Section title="Certifications" accent={accent}>
                {certifications.map((c, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#0f172a' }}>{c.name}</div>
                    {c.issuer && <div style={{ fontSize: '8.5px', color: accent, fontWeight: 600 }}>{c.issuer}</div>}
                    {c.date && <div style={{ fontSize: '8px', color: '#94a3b8' }}>{c.date}</div>}
                  </div>
                ))}
              </Section>
            )}
            {education.length > 0 && (
              <Section title="Education" accent={accent}>
                {education.map((ed, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: '10px', color: '#0f172a' }}>{ed.degree}</div>
                    <div style={{ fontSize: '9px', color: '#475569' }}>{ed.school}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5px', color: '#94a3b8', marginTop: 1 }}>
                      <span>{ed.grade}</span><span>{ed.endDate}</span>
                    </div>
                  </div>
                ))}
              </Section>
            )}
            {languages.length > 0 && (
              <Section title="Languages" accent={accent}>
                {languages.map((l, i) => (
                  <div key={i} style={{ fontSize: '9px', display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, color: '#0f172a' }}>{l.language}</span>
                    <span style={{ color: '#94a3b8' }}>{l.proficiency}</span>
                  </div>
                ))}
              </Section>
            )}
          </div>

          {/* Right: experience + projects */}
          <div style={{ flex: 1 }}>
            {experience.length > 0 && (
              <Section title="Experience" accent={accent}>
                {experience.map((exp, i) => (
                  <div key={exp.id || i} className="resume-entry" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: i < experience.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>{exp.title}</div>
                        <div style={{ fontSize: '10px', fontWeight: 600, color: accent }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                      </div>
                      <span style={{ fontSize: '8px', color: '#94a3b8', whiteSpace: 'nowrap', background: '#f8fafc', padding: '2px 8px', borderRadius: 4, border: '1px solid #e2e8f0', flexShrink: 0, marginLeft: 8 }}>
                        {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                      </span>
                    </div>
                    {(exp.bullets || []).filter(b => b?.trim()).map((b, j) => (
                      <div key={j} style={{ display: 'flex', gap: 6, fontSize: '9.5px', color: '#374151', lineHeight: 1.55, marginBottom: 3 }}>
                        <span style={{ color: accent, fontWeight: 900, flexShrink: 0 }}>▸</span><span>{b}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </Section>
            )}
            {projects.length > 0 && (
              <Section title="Key Initiatives" accent={accent}>
                {projects.map((p, i) => (
                  <div key={i} className="resume-entry" style={{ marginBottom: 10 }}>
                    <div style={{ fontWeight: 800, fontSize: '10.5px', color: '#0f172a', marginBottom: 2 }}>{p.name}</div>
                    {p.description && <div style={{ fontSize: '9.5px', color: '#475569', lineHeight: 1.55 }}>{p.description}</div>}
                  </div>
                ))}
              </Section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
