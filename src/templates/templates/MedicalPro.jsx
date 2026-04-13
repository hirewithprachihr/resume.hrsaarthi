/**
 * MedicalPro — Doctor / Nurse / Healthcare Professional Template
 * ──────────────────────────────────────────────────────────────
 * Layout  : Clean white with blue cross accent, credential-first
 * Target  : MBBS, MD, MS, Nurses, Allied Health, Hospital Management
 * Notes   : Emphasizes Registration Number, Specializations, Hospital affiliations
 * Tier    : Pro
 */
const DEFAULT_ACCENT = '#0891B2'
const font = "'Inter', 'Helvetica Neue', Arial, sans-serif"

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 9 }}>
        <div style={{ width: 20, height: 20, borderRadius: 4, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: '#fff', fontSize: '10px', fontWeight: 900, lineHeight: 1 }}>+</span>
        </div>
        <div style={{ fontSize: '8.5px', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0f172a', fontFamily: font }}>{title}</div>
      </div>
      {children}
    </div>
  )
}

export default function MedicalPro({ data = {}, settings = {} }) {
  const accent = settings?.accentColor || DEFAULT_ACCENT
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data

  return (
    <div className="resume-a4" style={{ fontFamily: font, background: '#fff', color: '#1e293b' }}>
      {/* Header */}
      <header style={{ padding: '28px 40px 20px', borderBottom: `3px solid ${accent}`, background: `linear-gradient(180deg, #f0f9ff 0%, #fff 100%)` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
              <span style={{ fontSize: '26px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{personal.fullName || 'Dr. Your Name'}</span>
              {/* Credential suffix area */}
              {certifications.length > 0 && (
                <span style={{ fontSize: '11px', fontWeight: 700, color: accent }}>
                  {certifications.slice(0, 2).map(c => c.name.split(' ')[0]).join(', ')}
                </span>
              )}
            </div>
            {personal.jobTitle && <div style={{ fontSize: '12px', fontWeight: 700, color: accent, letterSpacing: '0.04em', marginBottom: 8 }}>{personal.jobTitle}</div>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '9px', color: '#475569' }}>
              {personal.email    && <span>✉ {personal.email}</span>}
              {personal.phone    && <span>📱 {personal.phone}</span>}
              {personal.location && <span>📍 {personal.location}</span>}
              {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
            </div>
          </div>
          {/* Cross / Medical Icon */}
          <div style={{ width: 56, height: 56, borderRadius: 12, background: accent + '15', border: `2px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '28px', color: accent, fontWeight: 900, lineHeight: 1 }}>✚</span>
          </div>
        </div>
        {personal.summary && (
          <div style={{ marginTop: 12, padding: '8px 12px', borderLeft: `3px solid ${accent}`, background: accent + '08', fontSize: '9.5px', color: '#374151', lineHeight: 1.65 }}>
            {personal.summary}
          </div>
        )}
      </header>

      {/* Body */}
      <div style={{ padding: '20px 40px', display: 'flex', gap: 24 }}>
        {/* Left: Qualifications, Skills, Registration, Languages */}
        <div style={{ width: '34%', flexShrink: 0 }}>
          {education.length > 0 && (
            <Section title="Qualifications" accent={accent}>
              {education.map((ed, i) => (
                <div key={i} style={{ marginBottom: 10, paddingLeft: 8, borderLeft: `2px solid ${accent}25` }}>
                  <div style={{ fontWeight: 800, fontSize: '10px', color: '#0f172a', lineHeight: 1.3 }}>{ed.degree}</div>
                  <div style={{ fontSize: '9px', color: '#475569', marginTop: 1 }}>{ed.school}</div>
                  <div style={{ fontSize: '8.5px', display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginTop: 1 }}>
                    <span style={{ fontWeight: 700, color: accent }}>{ed.grade}</span>
                    <span>{ed.endDate}</span>
                  </div>
                </div>
              ))}
            </Section>
          )}
          {certifications.length > 0 && (
            <Section title="Registrations & Certifications" accent={accent}>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 8, padding: '6px 10px', background: accent + '08', borderRadius: 6, border: `1px solid ${accent}20` }}>
                  <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#0f172a' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '8.5px', color: accent, fontWeight: 600 }}>{c.issuer}</div>}
                  {c.date && <div style={{ fontSize: '8px', color: '#94a3b8' }}>{c.date}</div>}
                </div>
              ))}
            </Section>
          )}
          {skills.length > 0 && (
            <Section title="Clinical Skills" accent={accent}>
              {skills.map((sk, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  {sk.category && <div style={{ fontSize: '7.5px', fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>{sk.category}</div>}
                  <div style={{ fontSize: '9.5px', color: '#374151', lineHeight: 1.5 }}>{sk.items}</div>
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

        {/* Right: Clinical Experience + Research/Publications */}
        <div style={{ flex: 1 }}>
          {experience.length > 0 && (
            <Section title="Clinical Experience" accent={accent}>
              {experience.map((exp, i) => (
                <div key={exp.id || i} className="resume-entry" style={{ marginBottom: 14, paddingBottom: 12, borderBottom: i < experience.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>{exp.title}</div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: accent }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                    </div>
                    <span style={{ fontSize: '8px', color: '#94a3b8', whiteSpace: 'nowrap', background: '#f0f9ff', padding: '2px 8px', borderRadius: 4, border: `1px solid ${accent}25`, flexShrink: 0, marginLeft: 8 }}>
                      {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                    </span>
                  </div>
                  {(exp.bullets || []).filter(b => b?.trim()).map((b, j) => (
                    <div key={j} style={{ display: 'flex', gap: 6, fontSize: '9.5px', color: '#374151', lineHeight: 1.55, marginBottom: 3 }}>
                      <span style={{ color: accent, flexShrink: 0, marginTop: 1 }}>◆</span><span>{b}</span>
                    </div>
                  ))}
                </div>
              ))}
            </Section>
          )}
          {projects.length > 0 && (
            <Section title="Research & Publications" accent={accent}>
              {projects.map((p, i) => (
                <div key={i} className="resume-entry" style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: '10.5px', color: '#0f172a', marginBottom: 2 }}>{p.name}</div>
                  {p.technologies && <div style={{ fontSize: '8.5px', color: accent, marginBottom: 2, fontWeight: 600 }}>{p.technologies}</div>}
                  {p.description && <div style={{ fontSize: '9.5px', color: '#475569', lineHeight: 1.55 }}>{p.description}</div>}
                  {p.url && <div style={{ fontSize: '8.5px', color: accent, fontWeight: 600, marginTop: 2 }}>DOI/URL: {p.url}</div>}
                </div>
              ))}
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}
