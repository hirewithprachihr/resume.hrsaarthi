/**
 * GovtReady — Government / PSU / IAS / Banking / Defence Template
 * ───────────────────────────────────────────────────────────────
 * Layout  : UPSC/SSC-standard plain format — single column, no color excesses
 * Target  : IAS/IPS aspirants, Bank PO, SSC, PSU (ONGC/NTPC/Railway), Defence
 * Notes   : Indian Govt CVs have a specific plain format requirement.
 *           - No photo required in text form
 *           - Must include: DOB, Father's name, Category, Domicile are optional fields
 *           - Very easy for ATS / government portals
 * Tier    : Free
 */
const DEFAULT_ACCENT = '#1A56DB'
const font = "'Arial', 'Helvetica Neue', sans-serif"

function TableRow({ label, value, accent }) {
  if (!value) return null
  return (
    <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
      <td style={{ width: '38%', padding: '5px 8px', fontSize: '9.5px', fontWeight: 700, color: '#475569', verticalAlign: 'top', fontFamily: font }}>{label}</td>
      <td style={{ width: 10, color: '#94a3b8', fontSize: '9.5px', padding: '5px 4px' }}>:</td>
      <td style={{ padding: '5px 8px', fontSize: '9.5px', color: '#0f172a', verticalAlign: 'top', fontFamily: font }}>{value}</td>
    </tr>
  )
}

function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ background: accent, padding: '4px 10px', marginBottom: 8 }}>
        <span style={{ fontSize: '9px', fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#fff', fontFamily: font }}>{title}</span>
      </div>
      {children}
    </div>
  )
}

export default function GovtReady({ data = {}, settings = {} }) {
  const accent = settings?.accentColor || DEFAULT_ACCENT
  const { personal = {}, experience = [], education = [], skills = [], certifications = [], projects = [], languages = [] } = data

  return (
    <div className="resume-a4" style={{ fontFamily: font, background: '#fff', color: '#1e293b', padding: '32px 40px' }}>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: `3px double ${accent}` }}>
        <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>{personal.fullName || 'YOUR FULL NAME'}</div>
        {personal.jobTitle && (
          <div style={{ fontSize: '11px', fontWeight: 700, color: accent, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>{personal.jobTitle}</div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 20px', fontSize: '9px', color: '#475569' }}>
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      </header>

      {/* Personal Particulars (Indian Govt CV standard table) */}
      <Section title="Personal Particulars" accent={accent}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5px', background: '#fafafa', border: '1px solid #e2e8f0' }}>
          <tbody>
            <TableRow label="Date of Birth" value={personal.dateOfBirth || 'DD/MM/YYYY'} accent={accent} />
            <TableRow label="Father's Name" value={personal.fatherName || ''} accent={accent} />
            <TableRow label="Category" value={personal.category || 'General'} accent={accent} />
            <TableRow label="Domicile State" value={personal.domicileState || personal.location?.split(',').pop()?.trim()} accent={accent} />
            <TableRow label="Notice Period" value={personal.noticePeriodDays ? `${personal.noticePeriodDays} days` : '30 days'} accent={accent} />
            <TableRow label="LinkedIn" value={personal.linkedin} accent={accent} />
          </tbody>
        </table>
      </Section>

      {/* Objective */}
      {personal.summary && (
        <Section title="Career Objective" accent={accent}>
          <p style={{ fontSize: '10px', color: '#374151', lineHeight: 1.75, textAlign: 'justify', padding: '0 8px' }}>{personal.summary}</p>
        </Section>
      )}

      {/* Education in tabular format */}
      {education.length > 0 && (
        <Section title="Educational Qualifications" accent={accent}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px', border: '1px solid #e2e8f0' }}>
            <thead>
              <tr style={{ background: accent + '15' }}>
                {['Examination / Degree', 'Board / University', 'Year', 'Marks / Grade'].map(h => (
                  <th key={h} style={{ padding: '5px 8px', textAlign: 'left', fontSize: '8px', fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: `1px solid ${accent}30` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {education.map((ed, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '6px 8px', fontWeight: 700, color: '#0f172a' }}>{ed.degree}</td>
                  <td style={{ padding: '6px 8px', color: '#475569' }}>{ed.school}{ed.location ? `, ${ed.location}` : ''}</td>
                  <td style={{ padding: '6px 8px', color: '#64748b', whiteSpace: 'nowrap' }}>{ed.endDate}</td>
                  <td style={{ padding: '6px 8px', fontWeight: 700, color: accent }}>{ed.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <Section title="Work Experience" accent={accent}>
          {experience.map((exp, i) => (
            <div key={exp.id || i} className="resume-entry" style={{ marginBottom: 14, paddingLeft: 8, borderLeft: `3px solid ${accent}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>{exp.title}</span>
                  {exp.company && <span style={{ fontSize: '10px', color: '#475569', marginLeft: 6 }}>— {exp.company}{exp.location ? `, ${exp.location}` : ''}</span>}
                </div>
                <span style={{ fontSize: '9px', color: '#64748b', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 8, fontWeight: 700 }}>
                  {[exp.startDate, exp.current ? 'Till Date' : exp.endDate].filter(Boolean).join(' to ')}
                </span>
              </div>
              {(exp.bullets || []).filter(b => b?.trim()).map((b, j) => (
                <div key={j} style={{ display: 'flex', gap: 6, fontSize: '9.5px', color: '#374151', lineHeight: 1.6, marginBottom: 3 }}>
                  <span style={{ fontWeight: 900, flexShrink: 0, color: accent }}>•</span><span>{b}</span>
                </div>
              ))}
            </div>
          ))}
        </Section>
      )}

      {/* Skills + Certifications in two columns */}
      <div style={{ display: 'flex', gap: 24 }}>
        {skills.length > 0 && (
          <div style={{ flex: 1 }}>
            <Section title="Key Skills" accent={accent}>
              {skills.map((sk, i) => (
                <div key={i} style={{ marginBottom: 5 }}>
                  {sk.category && <span style={{ fontWeight: 800, fontSize: '9.5px', color: '#0f172a', marginRight: 6 }}>{sk.category}:</span>}
                  <span style={{ fontSize: '9.5px', color: '#475569' }}>{sk.items}</span>
                </div>
              ))}
            </Section>
          </div>
        )}
        {certifications.length > 0 && (
          <div style={{ flex: 1 }}>
            <Section title="Certifications & Exams Cleared" accent={accent}>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 6, fontSize: '9.5px' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{c.name}</span>
                  {c.issuer && <span style={{ color: '#94a3b8', marginLeft: 4 }}>· {c.issuer}{c.date ? ` (${c.date})` : ''}</span>}
                </div>
              ))}
            </Section>
          </div>
        )}
      </div>

      {/* Languages */}
      {languages.length > 0 && (
        <Section title="Languages Known" accent={accent}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 24px', padding: '0 8px' }}>
            {languages.map((l, i) => (
              <span key={i} style={{ fontSize: '9.5px' }}>
                <strong style={{ color: '#0f172a' }}>{l.language}</strong>
                {l.proficiency && <span style={{ color: '#94a3b8' }}> ({l.proficiency})</span>}
              </span>
            ))}
          </div>
        </Section>
      )}

      {/* Declaration */}
      <div style={{ marginTop: 20, paddingTop: 12, borderTop: '1px solid #e2e8f0' }}>
        <div style={{ fontSize: '8px', fontWeight: 900, color: accent, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Declaration</div>
        <div style={{ fontSize: '9px', color: '#6b7280', lineHeight: 1.7 }}>
          I hereby declare that the information furnished in this Curriculum Vitae is true, correct and complete to the best of my knowledge and belief. I understand that in the event of any information being found false or incorrect at any stage, my candidature/appointment is liable to be cancelled/terminated.
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, fontSize: '9px', color: '#6b7280' }}>
          <span>Date: ________________</span>
          <span>Place: {personal.location || '________________'}</span>
          <span>Signature: ________________</span>
        </div>
      </div>
    </div>
  )
}
