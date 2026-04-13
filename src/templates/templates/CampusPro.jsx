/**
 * CampusPro — Indian Fresher / Campus Placement Template
 * ────────────────────────────────────────────────────────
 * Layout  : Single column, Education-first (India fresher standard)
 * Safety  : 100% ATS-safe — pure DOM text, no images, no floats
 * Target  : B.Tech, BCA, BBA, MBA freshers — TCS, Infosys, Wipro, campus placements
 * Tier    : Free
 *
 * Layout order:
 *   Header (Name + Tagline + Contact)
 *   Objective / Summary
 *   Education (most prominent)
 *   Projects
 *   Internships
 *   Skills | Certifications
 *   Achievements
 *   Declaration (optional)
 */

const DEFAULT_ACCENT = '#1A56DB'

export default function CampusPro({ data = {}, settings = {} }) {
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

  // Split experience into internships vs full-time
  const internships = experience.filter(e =>
    (e.type || '').toLowerCase().includes('intern') ||
    (e.title || '').toLowerCase().includes('intern')
  )
  const fullTime = experience.filter(e => !internships.includes(e))

  const font = "'Inter', 'Helvetica Neue', Arial, sans-serif"

  const sectionTitle = (label) => (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, marginTop: 16,
    }}>
      <div style={{
        fontSize: '8px', fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase',
        color: accent, fontFamily: font, whiteSpace: 'nowrap',
      }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: accent, opacity: 0.25 }} />
    </div>
  )

  return (
    <div className="resume-a4" style={{ fontFamily: font, background: '#fff', padding: '36px 42px', color: '#1e293b', fontSize: '10px', lineHeight: 1.5 }}>

      {/* ── HEADER ──────────────────────────────────────────── */}
      <header style={{ marginBottom: 14, paddingBottom: 12, borderBottom: `2.5px solid ${accent}` }}>
        <div style={{ fontSize: '28px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 3 }}>
          {personal.fullName || 'Your Full Name'}
        </div>
        {personal.jobTitle && (
          <div style={{ fontSize: '12px', fontWeight: 600, color: accent, letterSpacing: '0.03em', marginBottom: 8 }}>
            {personal.jobTitle}
          </div>
        )}
        {/* Contact row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '9px', color: '#475569', fontWeight: 500 }}>
          {personal.email    && <span>✉ {personal.email}</span>}
          {personal.phone    && <span>📱 {personal.phone}</span>}
          {personal.location && <span>📍 {personal.location}</span>}
          {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
          {personal.website  && <span>🌐 {personal.website}</span>}
          {personal.github   && <span>⌨ {personal.github}</span>}
        </div>
      </header>

      {/* ── OBJECTIVE / SUMMARY ────────────────────────────── */}
      {personal.summary && (
        <div style={{ marginBottom: 4 }}>
          {sectionTitle('Career Objective')}
          <div style={{
            fontSize: '10px', color: '#374151', lineHeight: 1.6, fontStyle: 'italic',
            borderLeft: `3px solid ${accent}`, paddingLeft: 10,
          }}>
            {personal.summary}
          </div>
        </div>
      )}

      {/* ── EDUCATION ──────────────────────────────────────── */}
      {education.length > 0 && (
        <div>
          {sectionTitle('Education')}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px' }}>
            <thead>
              <tr style={{ backgroundColor: accent + '10' }}>
                {['Degree / Examination', 'Institution / Board', 'Year', 'Score'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '5px 8px', fontSize: '8px', fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: `1px solid ${accent}30` }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {education.map((ed, i) => (
                <tr key={ed.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '6px 8px', fontWeight: 700, color: '#0f172a' }}>{ed.degree}</td>
                  <td style={{ padding: '6px 8px', color: '#475569' }}>{ed.school}{ed.location ? `, ${ed.location}` : ''}</td>
                  <td style={{ padding: '6px 8px', color: '#64748b', whiteSpace: 'nowrap' }}>{ed.endDate || ed.startDate}</td>
                  <td style={{ padding: '6px 8px', fontWeight: 700, color: accent, whiteSpace: 'nowrap' }}>{ed.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PROJECTS ───────────────────────────────────────── */}
      {projects.length > 0 && (
        <div>
          {sectionTitle('Projects')}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {projects.map((p, i) => (
              <div key={p.id || i} className="resume-entry" style={{ paddingLeft: 10, borderLeft: `2px solid ${accent}30` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '10.5px' }}>{p.name}</div>
                  {p.date && <span style={{ fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: 8 }}>{p.date}</span>}
                </div>
                {p.technologies && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 4, marginBottom: 4 }}>
                    {p.technologies.split(',').map((tech, j) => (
                      <span key={j} style={{
                        fontSize: '7.5px', fontWeight: 700, padding: '1px 6px', borderRadius: 3,
                        background: accent + '15', color: accent, border: `1px solid ${accent}30`,
                      }}>{tech.trim()}</span>
                    ))}
                  </div>
                )}
                {p.description && (
                  <div style={{ fontSize: '9.5px', color: '#4b5563', lineHeight: 1.55, marginTop: 2 }}>{p.description}</div>
                )}
                {p.url && (
                  <div style={{ fontSize: '8.5px', color: accent, marginTop: 3, fontWeight: 600 }}>🔗 {p.url}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── INTERNSHIPS ────────────────────────────────────── */}
      {internships.length > 0 && (
        <div>
          {sectionTitle('Internship Experience')}
          {internships.map((exp, i) => (
            <div key={exp.id || i} className="resume-entry" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '10.5px' }}>{exp.title}</span>
                  <span style={{ color: accent, fontWeight: 600, marginLeft: 6, fontSize: '10px' }}>{exp.company}</span>
                  {exp.location && <span style={{ color: '#94a3b8', fontSize: '9px', marginLeft: 4 }}>· {exp.location}</span>}
                </div>
                <span style={{ fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 8 }}>
                  {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                </span>
              </div>
              {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                <ul style={{ paddingLeft: 16, marginTop: 4, listStyleType: 'disc' }}>
                  {exp.bullets.filter(b => b?.trim()).map((b, j) => (
                    <li key={j} style={{ fontSize: '9.5px', color: '#374151', lineHeight: 1.55, marginBottom: 2 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── FULL-TIME experience (if any) ──────────────────── */}
      {fullTime.length > 0 && (
        <div>
          {sectionTitle('Work Experience')}
          {fullTime.map((exp, i) => (
            <div key={exp.id || i} className="resume-entry" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '10.5px' }}>{exp.title}</span>
                  <span style={{ color: accent, fontWeight: 600, marginLeft: 6, fontSize: '10px' }}>{exp.company}</span>
                  {exp.location && <span style={{ color: '#94a3b8', fontSize: '9px', marginLeft: 4 }}>· {exp.location}</span>}
                </div>
                <span style={{ fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 8 }}>
                  {[exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')}
                </span>
              </div>
              {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                <ul style={{ paddingLeft: 16, marginTop: 4, listStyleType: 'disc' }}>
                  {exp.bullets.filter(b => b?.trim()).map((b, j) => (
                    <li key={j} style={{ fontSize: '9.5px', color: '#374151', lineHeight: 1.55, marginBottom: 2 }}>{b}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── SKILLS + CERTIFICATIONS ────────────────────────── */}
      <div style={{ display: 'flex', gap: 24, marginTop: 4 }}>
        {skills.length > 0 && (
          <div style={{ flex: 1 }}>
            {sectionTitle('Technical Skills')}
            {skills.map((sk, i) => (
              <div key={sk.id || i} style={{ marginBottom: 5 }}>
                {sk.category && (
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '9.5px', marginRight: 6 }}>{sk.category}:</span>
                )}
                <span style={{ fontSize: '9.5px', color: '#475569' }}>{sk.items}</span>
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div style={{ flex: 1 }}>
            {sectionTitle('Certifications')}
            {certifications.map((c, i) => (
              <div key={c.id || i} style={{ marginBottom: 5, fontSize: '9.5px' }}>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</span>
                {c.issuer && <span style={{ color: '#94a3b8', marginLeft: 4 }}>· {c.issuer}</span>}
                {c.date   && <span style={{ color: '#94a3b8', marginLeft: 4 }}>· {c.date}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── LANGUAGES ─────────────────────────────────────── */}
      {languages.length > 0 && (
        <div style={{ marginTop: 4 }}>
          {sectionTitle('Languages')}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
            {languages.map((l, i) => (
              <span key={l.id || i} style={{ fontSize: '9.5px', color: '#374151' }}>
                <strong style={{ color: '#0f172a' }}>{l.language}</strong>
                {l.proficiency && <span style={{ color: '#94a3b8' }}> — {l.proficiency}</span>}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── DECLARATION (optional) ─────────────────────────── */}
      {settings?.showDeclaration && (
        <div style={{ marginTop: 20, paddingTop: 12, borderTop: `1px solid #e2e8f0` }}>
          <div style={{ fontSize: '8px', fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 6 }}>Declaration</div>
          <div style={{ fontSize: '9px', color: '#6b7280', lineHeight: 1.6 }}>
            I hereby declare that the information furnished above is true and correct to the best of my knowledge and belief.
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: '9px', color: '#6b7280' }}>
            <span>Date: _______________</span>
            <span>Signature: _______________</span>
            <span>Place: {personal.location || '_______________'}</span>
          </div>
        </div>
      )}
    </div>
  )
}
