/**
 * MarketingMaven — Marketing / Brand / Growth / Digital Template
 * ────────────────────────────────────────────────────────────────
 * Layout  : Bold header strip with campaign metrics, two-column body
 * Target  : Digital Marketers, Brand Managers, Growth Hackers, CMO-track
 * Tone    : Creative but data-driven — metrics everywhere
 * Tier    : Pro
 */
const DEFAULT_ACCENT = '#F59E0B'
const font = "'Inter', 'Helvetica Neue', Arial, sans-serif"

function KpiBox({ value, label, accent }) {
  return (
    <div style={{ textAlign: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.12)', borderRadius: 8, minWidth: 64 }}>
      <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '7px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.4, marginTop: 3 }}>{label}</div>
    </div>
  )
}

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: '8.5px', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent, fontFamily: font, whiteSpace: 'nowrap' }}>{title}</span>
        <div style={{ flex: 1, height: 1.5, background: accent + '30' }} />
      </div>
      {children}
    </div>
  )
}

export default function MarketingMaven({ data = {}, settings = {} }) {
  const accent = settings?.accentColor || DEFAULT_ACCENT
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data

  return (
    <div className="resume-a4" style={{ fontFamily: font, background: '#fff', color: '#1e293b' }}>

      {/* Bold gradient header */}
      <header style={{ background: `linear-gradient(135deg, #1e293b 0%, #0f172a 100%)`, padding: '24px 36px 0', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16 }}>
          <div>
            <div style={{ fontSize: '26px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 2 }}>{personal.fullName || 'Your Name'}</div>
            {personal.jobTitle && (<div style={{ fontSize: '11px', fontWeight: 700, color: accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{personal.jobTitle}</div>)}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px', fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>
              {personal.email    && <span>✉ {personal.email}</span>}
              {personal.phone    && <span>📱 {personal.phone}</span>}
              {personal.location && <span>📍 {personal.location}</span>}
              {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
            </div>
          </div>
          {/* Quick summary */}
          {personal.summary && (
            <div style={{ maxWidth: '42%', fontSize: '9px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, textAlign: 'right', flexShrink: 0, marginLeft: 20 }}>
              {personal.summary}
            </div>
          )}
        </div>

        {/* KPI Ribbon */}
        <div style={{ background: accent, marginLeft: -36, marginRight: -36, padding: '8px 36px', display: 'flex', gap: 8, justifyContent: 'space-around' }}>
          <KpiBox value="3x+" label="Avg. ROAS Delivered" accent={accent} />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <KpiBox value="120%+" label="Revenue Targets Hit" accent={accent} />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <KpiBox value="₹ Cr" label="Budget Managed" accent={accent} />
          <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
          <KpiBox value="5M+" label="Audience Reached" accent={accent} />
        </div>
      </header>

      {/* Body */}
      <div style={{ padding: '22px 36px', display: 'flex', gap: 24 }}>

        {/* Left narrow */}
        <div style={{ width: '30%', flexShrink: 0 }}>
          {skills.length > 0 && (
            <Section title="Marketing Skills" accent={accent}>
              {skills.map((sk, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  {sk.category && <div style={{ fontSize: '7.5px', fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{sk.category}</div>}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {(sk.items || '').split(',').map(s => s.trim()).filter(Boolean).map((s, j) => (
                      <span key={j} style={{ fontSize: '7.5px', fontWeight: 600, padding: '2px 7px', borderRadius: 3, background: accent + '18', color: '#78350f', border: `1px solid ${accent}25` }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </Section>
          )}
          {certifications.length > 0 && (
            <Section title="Certifications" accent={accent}>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                  <div style={{ fontSize: '8.5px', color: '#94a3b8' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
                </div>
              ))}
            </Section>
          )}
          {education.length > 0 && (
            <Section title="Education" accent={accent}>
              {education.map((ed, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: '9.5px', color: '#0f172a' }}>{ed.degree}</div>
                  <div style={{ fontSize: '9px', color: '#475569' }}>{ed.school}</div>
                  <div style={{ fontSize: '8.5px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: accent, fontWeight: 700 }}>{ed.grade}</span><span>{ed.endDate}</span>
                  </div>
                </div>
              ))}
            </Section>
          )}
          {languages.length > 0 && (
            <Section title="Languages" accent={accent}>
              {languages.map((l, i) => (
                <div key={i} style={{ fontSize: '9px', display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span><span style={{ color: '#94a3b8' }}>{l.proficiency}</span>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Right: Experience + Campaigns */}
        <div style={{ flex: 1 }}>
          {experience.length > 0 && (
            <Section title="Marketing Experience" accent={accent}>
              {experience.map((exp, i) => (
                <div key={exp.id || i} className="resume-entry" style={{ marginBottom: 14, paddingBottom: 12, borderBottom: i < experience.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>{exp.title}</div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#475569' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                    </div>
                    <span style={{ fontSize: '8px', fontWeight: 700, color: accent, whiteSpace: 'nowrap', background: accent + '18', padding: '2px 8px', borderRadius: 4, border: `1px solid ${accent}25`, flexShrink: 0, marginLeft: 8 }}>
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
            <Section title="Notable Campaigns & Launches" accent={accent}>
              {projects.map((p, i) => (
                <div key={i} className="resume-entry" style={{ marginBottom: 10, paddingLeft: 10, borderLeft: `2px solid ${accent}35` }}>
                  <div style={{ fontWeight: 800, fontSize: '10.5px', color: '#0f172a', marginBottom: 2 }}>{p.name}</div>
                  {p.technologies && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 3 }}>
                    {p.technologies.split(',').map((t, j) => (
                      <span key={j} style={{ fontSize: '7px', fontWeight: 700, padding: '1px 6px', borderRadius: 3, background: accent + '18', color: '#78350f', border: `1px solid ${accent}25` }}>{t.trim()}</span>
                    ))}
                  </div>}
                  {p.description && <div style={{ fontSize: '9.5px', color: '#475569', lineHeight: 1.55 }}>{p.description}</div>}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}
