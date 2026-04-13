/**
 * TeacherFirst — Teacher / Professor / Educator / Academic Template
 * ─────────────────────────────────────────────────────────────────
 * Layout  : Warm ivory background, two-column — Education/Certs | Teaching Experience
 * Target  : School teachers, College professors, Lecturers, Tutors, Ed-Tech
 * Tier    : Free
 */
const DEFAULT_ACCENT = '#7C3AED'
const WARM = '#faf7f0'
const font = "'Inter', 'Helvetica Neue', Arial, sans-serif"

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <div style={{ height: 2, width: 20, background: accent, borderRadius: 2, flexShrink: 0 }} />
        <div style={{ fontSize: '8.5px', fontWeight: 900, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent, fontFamily: font }}>{title}</div>
        <div style={{ height: 2, flex: 1, background: `${accent}18`, borderRadius: 2 }} />
      </div>
      {children}
    </div>
  )
}

export default function TeacherFirst({ data = {}, settings = {} }) {
  const accent = settings?.accentColor || DEFAULT_ACCENT
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data

  return (
    <div className="resume-a4" style={{ fontFamily: font, background: WARM, color: '#1e293b' }}>
      {/* Header */}
      <header style={{ background: accent, padding: '26px 40px 20px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 4 }}>{personal.fullName || 'Your Name'}</div>
            {personal.jobTitle && <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em', marginBottom: 10 }}>{personal.jobTitle}</div>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', fontSize: '9px', color: 'rgba(255,255,255,0.75)' }}>
              {personal.email    && <span>✉ {personal.email}</span>}
              {personal.phone    && <span>📱 {personal.phone}</span>}
              {personal.location && <span>📍 {personal.location}</span>}
              {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
            </div>
          </div>
          {/* Years teaching */}
          <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 16px', flexShrink: 0 }}>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>{experience.length > 0 ? `${experience.length * 2}+` : '5+'}</div>
            <div style={{ fontSize: '7.5px', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.3 }}>Years<br/>Teaching</div>
          </div>
        </div>
        {personal.summary && (
          <div style={{ marginTop: 12, fontSize: '9.5px', color: 'rgba(255,255,255,0.82)', lineHeight: 1.65, fontStyle: 'italic' }}>
            {personal.summary}
          </div>
        )}
      </header>

      {/* Body */}
      <div style={{ padding: '22px 40px', display: 'flex', gap: 24 }}>
        {/* Left column */}
        <div style={{ width: '34%', flexShrink: 0 }}>
          {education.length > 0 && (
            <Section title="Education" accent={accent}>
              {education.map((ed, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 800, fontSize: '10px', color: '#0f172a', lineHeight: 1.3 }}>{ed.degree}</div>
                  <div style={{ fontSize: '9px', color: '#475569' }}>{ed.school}{ed.location ? `, ${ed.location}` : ''}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8.5px', marginTop: 2 }}>
                    <span style={{ fontWeight: 700, color: accent }}>{ed.grade}</span>
                    <span style={{ color: '#94a3b8' }}>{ed.endDate}</span>
                  </div>
                </div>
              ))}
            </Section>
          )}
          {certifications.length > 0 && (
            <Section title="Training & Certifications" accent={accent}>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: '9.5px', fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '8.5px', color: accent }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>}
                </div>
              ))}
            </Section>
          )}
          {skills.length > 0 && (
            <Section title="Subject Expertise" accent={accent}>
              {skills.flatMap(s => (s.items || '').split(',').map(i => i.trim()).filter(Boolean)).map((sk, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: '9.5px', color: '#374151', marginBottom: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '2px', background: accent + '40', flexShrink: 0 }} />
                  {sk}
                </div>
              ))}
            </Section>
          )}
          {languages.length > 0 && (
            <Section title="Languages" accent={accent}>
              {languages.map((l, i) => (
                <div key={i} style={{ fontSize: '9px', display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontWeight: 600 }}>{l.language}</span>
                  <span style={{ color: '#94a3b8' }}>{l.proficiency}</span>
                </div>
              ))}
            </Section>
          )}
        </div>

        {/* Right: Teaching Experience + Projects/Research */}
        <div style={{ flex: 1 }}>
          {experience.length > 0 && (
            <Section title="Teaching Experience" accent={accent}>
              {experience.map((exp, i) => (
                <div key={exp.id || i} className="resume-entry" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: i < experience.length - 1 ? '1px solid #e8e0d4' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>{exp.title}</div>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: accent }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                    </div>
                    <span style={{ fontSize: '8px', color: '#94a3b8', whiteSpace: 'nowrap', background: accent + '12', padding: '2px 8px', borderRadius: 4, border: `1px solid ${accent}20`, flexShrink: 0, marginLeft: 8 }}>
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
            <Section title="Research & Academic Projects" accent={accent}>
              {projects.map((p, i) => (
                <div key={i} className="resume-entry" style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 800, fontSize: '10.5px', color: '#0f172a', marginBottom: 2 }}>{p.name}</div>
                  {p.technologies && <div style={{ fontSize: '8.5px', color: accent, fontWeight: 600, marginBottom: 2 }}>{p.technologies}</div>}
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
