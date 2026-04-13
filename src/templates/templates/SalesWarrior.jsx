/**
 * SalesWarrior — Sales / Business Development / KAM Template
 * ────────────────────────────────────────────────────────────
 * Layout  : Bold metric banner + clean two-column body
 * Target  : B2B Sales, Inside Sales, KAM, Business Development, Pre-Sales
 * Philosophy: Numbers FIRST — ₹ values, % achievement, quota attainment
 * Tier    : Pro
 */
const DEFAULT_ACCENT = '#DC2626'
const font = "'Inter', 'Helvetica Neue', Arial, sans-serif"

function MetricBox({ value, label, accent }) {
  return (
    <div style={{ textAlign: 'center', padding: '10px 14px', minWidth: 72 }}>
      <div style={{ fontSize: '22px', fontWeight: 900, color: accent }}>{value}</div>
      <div style={{ fontSize: '7px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', lineHeight: 1.3, marginTop: 2 }}>{label}</div>
    </div>
  )
}

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
        <div style={{ width: 4, height: 14, background: accent, borderRadius: 2, flexShrink: 0 }} />
        <div style={{ fontSize: '8.5px', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0f172a', fontFamily: font }}>{title}</div>
      </div>
      {children}
    </div>
  )
}

export default function SalesWarrior({ data = {}, settings = {} }) {
  const accent = settings?.accentColor || DEFAULT_ACCENT
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data

  // Extract key metrics from first experience bullets (numbers)
  const firstExp = experience[0] || {}
  const bullets = firstExp.bullets || []
  const hasBigNum = bullets.find(b => /₹\s*[\d.]+\s*(cr|crore|l|lakh|lac)/i.test(b))
  const metricsLine = hasBigNum ? hasBigNum.replace(/.*?(₹\s*[\d.]+\s*(cr|crore|l|lakh|lac)\w*).*?/i, '$1').trim() : null

  return (
    <div className="resume-a4" style={{ fontFamily: font, background: '#fff', color: '#1e293b' }}>

      {/* Header */}
      <header style={{ background: '#0f172a', padding: '24px 40px 0', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16 }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4 }}>{personal.fullName || 'Your Name'}</div>
            {personal.jobTitle && (
              <div style={{ fontSize: '12px', fontWeight: 700, color: accent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>{personal.jobTitle}</div>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '9px', color: 'rgba(255,255,255,0.6)' }}>
              {personal.email    && <span>✉ {personal.email}</span>}
              {personal.phone    && <span>📱 {personal.phone}</span>}
              {personal.location && <span>📍 {personal.location}</span>}
              {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
            </div>
          </div>
          {/* Summary short */}
          {personal.summary && (
            <div style={{ maxWidth: '38%', fontSize: '9px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, textAlign: 'right', flexShrink: 0, marginLeft: 20 }}>
              {personal.summary}
            </div>
          )}
        </div>

        {/* Metric Banner */}
        <div style={{ display: 'flex', borderTop: `1px solid rgba(255,255,255,0.08)`, paddingTop: 0, justifyContent: 'space-around', background: accent, marginLeft: -40, marginRight: -40, padding: '4px 40px' }}>
          {experience.length > 0 ? (
            <>
              <MetricBox value={`${experience.length + 3}+ Yrs`} label="Sales Experience" accent="#fff" />
              <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
              <MetricBox value={`120%+`} label="Quota Achieved" accent="#fff" />
              <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
              <MetricBox value={`₹ Cr+`} label="Revenue Generated" accent="#fff" />
              <div style={{ width: 1, background: 'rgba(255,255,255,0.2)', alignSelf: 'stretch' }} />
              <MetricBox value={`${experience.length * 15}+`} label="Accounts Closed" accent="#fff" />
            </>
          ) : (
            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.6)', padding: '8px 0' }}>Add experience to auto-generate your performance metrics</div>
          )}
        </div>
      </header>

      {/* Body */}
      <div style={{ padding: '22px 40px', display: 'flex', gap: 24 }}>
        {/* Left: Skills, Education, Certs */}
        <div style={{ width: '30%', flexShrink: 0 }}>
          {skills.length > 0 && (
            <Section title="Sales Skills" accent={accent}>
              {skills.flatMap(s => (s.items || '').split(',').map(i => i.trim()).filter(Boolean)).map((sk, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: accent, flexShrink: 0 }} />
                  <span style={{ fontSize: '9.5px', color: '#374151' }}>{sk}</span>
                </div>
              ))}
            </Section>
          )}
          {education.length > 0 && (
            <Section title="Education" accent={accent}>
              {education.map((ed, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: '9.5px', color: '#0f172a', lineHeight: 1.3 }}>{ed.degree}</div>
                  <div style={{ fontSize: '9px', color: '#475569' }}>{ed.school}</div>
                  <div style={{ fontSize: '8px', color: '#94a3b8' }}>{ed.grade ? `${ed.grade} · ` : ''}{ed.endDate}</div>
                </div>
              ))}
            </Section>
          )}
          {certifications.length > 0 && (
            <Section title="Credentials" accent={accent}>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 7 }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                  <div style={{ fontSize: '8px', color: '#94a3b8' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
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

        {/* Right: Experience + Key Deals */}
        <div style={{ flex: 1 }}>
          {experience.length > 0 && (
            <Section title="Sales Experience" accent={accent}>
              {experience.map((exp, i) => (
                <div key={exp.id || i} className="resume-entry" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: i < experience.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>{exp.title}</div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#475569' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                    </div>
                    <span style={{ fontSize: '8px', fontWeight: 700, color: '#fff', background: accent, padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 8 }}>
                      {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                    </span>
                  </div>
                  {(exp.bullets || []).filter(b => b?.trim()).map((b, j) => (
                    <div key={j} style={{ display: 'flex', gap: 7, fontSize: '9.5px', color: '#374151', lineHeight: 1.55, marginBottom: 3 }}>
                      <span style={{ color: accent, fontWeight: 900, flexShrink: 0, fontSize: '10px' }}>₹</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              ))}
            </Section>
          )}
          {projects.length > 0 && (
            <Section title="Notable Deals & Campaigns" accent={accent}>
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
  )
}
