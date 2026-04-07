import React from 'react'
import { 
  Mail, Phone, MapPin, Linkedin, Globe, Briefcase, 
  GraduationCap, Award, Box, Languages, Heart, Circle 
} from 'lucide-react'
import { clsx } from 'clsx'
import { TYPE, SPACE, getAccentAlpha, pt } from './typography'

// Template 02: Corporate Pro — two-column, modern sans
export const CorporatePro = React.memo(({ data, settings }) => {
  const { personal, experience, education, skills, certifications, projects, languages, hobbies } = data
  const accent = settings?.accentColor || '#1A56DB'
  const sidebar = { background: accent, color: '#fff', padding: `${TYPE.SPACE.PAGE_TOP}px ${TYPE.SPACE.PAGE_SIDE_TWO}px`, width: '250px', flexShrink: 0 }
  const main = { flex: 1, padding: `${TYPE.SPACE.PAGE_TOP}px ${TYPE.SPACE.PAGE_SIDE_TWO}px`, background: '#fff' }
  const sHead = { ...pt(TYPE.SIZE.SECTION), fontWeight: TYPE.weight.bold, color: '#0f172a', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: `${TYPE.SPACE.SECTION_BOTTOM}px`, marginTop: '24px' }
  const sHeadSidebar = { ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.bold, textTransform: 'uppercase', letterSpacing: TYPE.tracking.wider, color: '#fff', opacity: 0.8, marginBottom: '12px', marginTop: '20px' }
  const accentLight = getAccentAlpha(accent, 0.1)

  return (
    <div style={{ display: 'flex', fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '1123px' }}>
      {/* Sidebar */}
      <div style={sidebar}>
        <div style={{ ...pt(TYPE.SIZE.NAME), fontWeight: TYPE.weight.bold, lineHeight: 1.1, marginBottom: '8px' }}>{personal.fullName || 'Your Name'}</div>
        <div style={{ ...pt(TYPE.SIZE.TITLE), fontWeight: TYPE.weight.semibold, opacity: 0.9, marginBottom: '24px' }}>{personal.jobTitle}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', ...pt(TYPE.SIZE.SMALL) }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={14} /> {personal.email}</div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={14} /> {personal.phone}</div>}
          {personal.location && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={14} /> {personal.location}</div>}
          {personal.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Linkedin size={14} /> <span style={{ wordBreak: 'break-all' }}>{personal.linkedin}</span></div>}
        </div>

        {skills.length > 0 && <div id="resume-sec-skills">
          <div style={sHeadSidebar}>Skills</div>
          {skills.map(sk => (
            <div key={sk.id} style={{ marginBottom: '8px' }}>
              {sk.category && <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#e2e8f0', fontWeight: TYPE.weight.semibold }}>{sk.category}</div>}
              <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#cbd5e1', lineHeight: 1.4 }}>{sk.items}</div>
            </div>
          ))}
        </div>}

        {languages.length > 0 && <div id="resume-sec-languages">
          <div style={sHeadSidebar}>Languages</div>
          {languages.map(l => (
            <div key={l.id} style={{ fontSize: pt('9pt'), color: '#cbd5e1', marginBottom: '3px' }}>
              <strong style={{ color: '#e2e8f0' }}>{l.language}</strong><br /><span style={{ fontSize: pt('8pt') }}>{l.proficiency}</span>
            </div>
          ))}
        </div>}

        {hobbies && hobbies.length > 0 && <div id="resume-sec-hobbies">
          <div style={sHeadSidebar}>Interests</div>
          <div style={{ fontSize: pt('9pt'), color: '#cbd5e1', display: 'flex', flexWrap: 'wrap', gap: '4px 8px' }}>
            {hobbies.map(h => <span key={h.id}>{h.name}</span>)}
          </div>
        </div>}

        {certifications.length > 0 && <div id="resume-sec-certifications">
          <div style={sHeadSidebar}>Certifications</div>
          {certifications.map(c => (
            <div key={c.id} style={{ fontSize: pt('9pt'), color: '#cbd5e1', marginBottom: '5px', lineHeight: TYPE.leading.normal }}>
              <div style={{ fontWeight: TYPE.weight.semibold, color: '#e2e8f0' }}>{c.name}</div>
              <div>{c.issuer}</div>
            </div>
          ))}
        </div>}
      </div>

      {/* Main */}
      <div style={main}>
        {personal.summary && <div id="resume-sec-summary" className="resume-entry">
          <div className="resume-section-head" style={{ ...sHead, marginTop: 0 }}>Summary</div>
          <p style={{ ...pt(TYPE.SIZE.BODY), color: '#334155' }}>{personal.summary}</p>
        </div>}

        {experience.length > 0 && <div id="resume-sec-experience">
          <div className="resume-section-head" style={sHead}>Experience</div>
          {experience.map(exp => (
            <div key={exp.id} className="resume-entry" style={{ marginBottom: `${TYPE.SPACE.ENTRY_BOTTOM}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <span style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR), color: '#0f172a' }}>{exp.title}</span>
                <span style={{ ...pt(TYPE.SIZE.SMALL), color: accent, fontWeight: TYPE.weight.semibold }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              {exp.company && <div style={{ color: '#64748b', fontWeight: TYPE.weight.medium, marginBottom: '4px', ...pt(TYPE.SIZE.BODY) }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>}
              <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                {(exp.bullets || []).filter(b => b.trim()).map((b, i) => <li key={i} className="resume-bullet" style={{ marginBottom: '3px', ...pt(TYPE.SIZE.BULLET), color: '#334155' }}>{b}</li>)}
              </ul>
              <span className="resume-entry-end" />
            </div>
          ))}
        </div>}

        {education.length > 0 && <div id="resume-sec-education">
          <div className="resume-section-head" style={sHead}>Education</div>
          {education.map(edu => (
            <div key={edu.id} className={clsx("resume-entry", edu.forcePageBreak && "elite-force-break")} style={{ marginBottom: '10px', marginTop: `${edu.nudge || 0}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: TYPE.weight.bold }}>{edu.degree}</span>
                <span style={{ fontSize: pt('9pt'), color: '#94a3b8' }}>{edu.endDate}</span>
              </div>
              <div style={{ color: '#64748b', fontSize: pt('10.5pt') }}>{edu.school}{edu.location ? ` · ${edu.location}` : ''}{edu.grade ? ` · ${edu.grade}` : ''}</div>
              <span className="resume-entry-end" />
            </div>
          ))}
        </div>}

        {projects.length > 0 && <div id="resume-sec-projects">
          <div className="resume-section-head" style={sHead}>Projects</div>
          {projects.map(proj => (
            <div key={proj.id} className="resume-entry" style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{proj.name}</span>
              {proj.tech && <span style={{ color: '#64748b', fontSize: pt('9pt') }}> — {proj.tech}</span>}
              {proj.description && <div style={{ color: '#334155', fontSize: pt('10.5pt'), marginTop: '2px', lineHeight: TYPE.leading.normal }}>{proj.description}</div>}
              <span className="resume-entry-end" />
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
})

// Template 03: Tech Minimal — dark header, monospace accents
export const TechMinimal = React.memo(({ data, settings }) => {
  const { personal, experience, education, skills, certifications, projects, hobbies } = data
  const accent = settings?.accentColor || '#0E9F6E'

  return (
    <div style={{ fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%', color: '#1a1a1a' }}>
      {/* Header */}
      <div style={{ background: '#0f172a', padding: '28px 40px', color: '#e2e8f0' }}>
        <div style={{ fontFamily: TYPE.MONO, color: accent, ...pt(TYPE.SIZE.SMALL), marginBottom: '4px' }}>{'>> '}{personal.jobTitle}</div>
        <div style={{ ...pt(TYPE.SIZE.NAME), fontWeight: TYPE.weight.bold, color: '#fff', letterSpacing: TYPE.tracking.tight }}>{personal.fullName || 'Your Name'}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px', marginTop: '10px', ...pt(TYPE.SIZE.SMALL), color: '#94a3b8' }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={12} color={accent} /> {personal.email}</div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={12} color={accent} /> {personal.phone}</div>}
          {personal.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={12} color={accent} /> {personal.location}</div>}
          {personal.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Linkedin size={12} color={accent} /> {personal.linkedin}</div>}
        </div>
      </div>

      <div style={{ padding: '24px 40px' }}>
        {personal.summary && (
          <div id="resume-sec-summary" className="resume-entry" style={{ borderLeft: `3px solid ${accent}`, paddingLeft: '14px', marginBottom: '20px', color: '#334155', ...pt(TYPE.SIZE.BODY) }}>
            {personal.summary}
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && (<div id="resume-sec-experience">
          <SectionTitle text="EXPERIENCE" color={accent} />
          {experience.map(exp => (
            <div key={exp.id} className={clsx("resume-entry", exp.forcePageBreak && "elite-force-break")} style={{ marginBottom: `${TYPE.SPACE.ENTRY_BOTTOM}px`, marginTop: `${exp.nudge || 0}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <span style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR) }}>{exp.title}</span>
                  {exp.company && <span style={{ color: '#475569', ...pt(TYPE.SIZE.BODY) }}> @ {exp.company}</span>}
                </div>
                <span style={{ fontFamily: TYPE.MONO, ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px' }}>
                  {exp.startDate}{exp.startDate ? '–' : ''}{exp.current ? 'now' : exp.endDate}
                </span>
              </div>
              <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                {(exp.bullets || []).filter(b => b.trim()).map((b, i) => <li key={i} className="resume-bullet" style={{ marginBottom: '3px', color: '#334155', ...pt(TYPE.SIZE.BULLET) }}>{b}</li>)}
              </ul>
              <span className="resume-entry-end" />
            </div>
          ))}
        </div>)}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
          <div>
            {education.length > 0 && (<div id="resume-sec-education">
              <SectionTitle text="EDUCATION" color={accent} />
              {education.map(edu => (
                <div key={edu.id} className={clsx("resume-entry", edu.forcePageBreak && "elite-force-break")} style={{ marginBottom: '10px', marginTop: `${edu.nudge || 0}px` }}>
                  <div style={{ fontWeight: TYPE.weight.bold }}>{edu.degree}</div>
                  <div style={{ color: '#475569', fontSize: pt('10.5pt') }}>{edu.school} {edu.grade ? `· ${edu.grade}` : ''}</div>
                  <div style={{ color: '#94a3b8', fontSize: pt('9pt') }}>{edu.endDate}</div>
                  <span className="resume-entry-end" />
                </div>
              ))}
            </div>)}
          </div>
          <div>
            {skills.length > 0 && (<div id="resume-sec-skills" className="resume-section-compact">
              <SectionTitle text="SKILLS" color={accent} />
              {skills.map(sk => (
                <div key={sk.id} style={{ marginBottom: '6px' }}>
                  {sk.category && <div style={{ fontFamily: TYPE.MONO, fontSize: pt('9pt'), color: accent }}>{sk.category}</div>}
                  <div style={{ fontSize: pt('10.5pt'), color: '#334155' }}>{sk.items}</div>
                </div>
              ))}
            </div>)}
            {hobbies && hobbies.length > 0 && (<div id="resume-sec-hobbies" className="resume-section-compact">
              <SectionTitle text="INTERESTS" color={accent} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', fontSize: '10pt', color: '#334155' }}>
                {hobbies.map(h => <span key={h.id}>{h.name}</span>)}
              </div>
            </div>)}
          </div>
        </div>

        {projects.length > 0 && (<div id="resume-sec-projects">
          <SectionTitle text="PROJECTS" color={accent} />
          {projects.map(proj => (
            <div key={proj.id} className="resume-entry" style={{ marginBottom: '10px' }}>
              <span style={{ fontFamily: TYPE.MONO, fontWeight: TYPE.weight.bold, fontSize: pt('10.5pt'), color: '#0f172a' }}>{proj.name}</span>
              {proj.tech && <span style={{ color: '#64748b', fontSize: pt('9pt') }}> · {proj.tech}</span>}
              {proj.description && <div style={{ color: '#334155', marginTop: '2px', fontSize: pt('10.5pt') }}>{proj.description}</div>}
              <span className="resume-entry-end" />
            </div>
          ))}
        </div>)}
      </div>
    </div>
  )
})

function SectionTitle({ text, color }) {
  return (
    <div className="resume-section-head" style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.bold, letterSpacing: TYPE.tracking.wider, color, textTransform: 'uppercase', borderBottom: `1px solid ${getAccentAlpha(color, 0.25)}`, paddingBottom: '4px', marginBottom: `${TYPE.SPACE.SECTION_BOTTOM}px`, marginTop: '18px' }}>
      {text}
    </div>
  )
}

// Template 04: Creative Sidebar — colorful left panel
export const CreativeSidebar = React.memo(({ data, settings }) => {
  const { personal, experience, education, skills, certifications, languages, projects, hobbies } = data
  const accent = settings?.accentColor || '#7C3AED'
  const accentLight = `${accent}18`

  return (
    <div style={{ display: 'flex', fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '1123px' }}>
      <div className="glass-morphism" style={{ width: '230px', background: accent, color: '#fff', padding: `${TYPE.SPACE.PAGE_TOP}px ${TYPE.SPACE.PAGE_SIDE_TWO}px`, flexShrink: 0, minHeight: '100%' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', ...pt(TYPE.SIZE.NAME), marginBottom: '14px', border: '1px solid rgba(255,255,255,0.2)' }}>
          {(personal.fullName || 'Y')[0]}
        </div>
        <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: 800, lineHeight: 1.1, marginBottom: '6px', letterSpacing: '-0.5px' }}>{personal.fullName || 'Your Name'}</div>
        <div style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: 500, opacity: 0.9, marginBottom: '24px', letterSpacing: '0.5px' }}>{personal.jobTitle}</div>

        <CSideSection title="CONTACT">
          {personal.email && <div style={{ ...pt(TYPE.SIZE.SMALL), opacity: 0.9, wordBreak: 'break-all', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={12} /> {personal.email}</div>}
          {personal.phone && <div style={{ ...pt(TYPE.SIZE.SMALL), opacity: 0.9, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={12} /> {personal.phone}</div>}
          {personal.location && <div style={{ ...pt(TYPE.SIZE.SMALL), opacity: 0.9, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={12} /> {personal.location}</div>}
          {personal.linkedin && <div style={{ ...pt(TYPE.SIZE.SMALL), opacity: 0.9, wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: '8px' }}><Linkedin size={12} /> {personal.linkedin}</div>}
        </CSideSection>

        {skills.length > 0 && <CSideSection title="SKILLS">
          {skills.map(sk => (
            <div key={sk.id} style={{ marginBottom: '8px' }}>
              {sk.category && <div style={{ fontSize: pt('8pt'), fontWeight: TYPE.weight.bold, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{sk.category}</div>}
              <div style={{ fontSize: pt('9pt'), opacity: 0.9, lineHeight: 1.5 }}>{sk.items}</div>
            </div>
          ))}
        </CSideSection>}

        {languages.length > 0 && <CSideSection title="LANGUAGES">
          {languages.map(l => (
            <div key={l.id} style={{ fontSize: pt('9pt'), opacity: 0.9, marginBottom: '4px' }}>
              <strong>{l.language}</strong> — {l.proficiency}
            </div>
          ))}
        </CSideSection>}

        {certifications.length > 0 && <CSideSection title="CERTS">
          {certifications.map(c => (
            <div key={c.id} style={{ fontSize: pt('9pt'), opacity: 0.9, marginBottom: '6px' }}>
              <div style={{ fontWeight: TYPE.weight.semibold, color: '#fff' }}>{c.name}</div>
              <div style={{ opacity: 0.75 }}>{c.issuer}</div>
            </div>
          ))}
        </CSideSection>}

        {hobbies && hobbies.length > 0 && <CSideSection title="INTERESTS">
          <div style={{ fontSize: pt('9pt'), opacity: 0.9, display: 'flex', flexWrap: 'wrap', gap: '4px 8px' }}>
            {hobbies.map(h => <span key={h.id}>{h.name}</span>)}
          </div>
        </CSideSection>}
      </div>

      <div style={{ flex: 1, padding: '32px 28px' }}>
        {personal.summary && (
          <div id="resume-sec-summary" className="resume-entry" style={{ background: accentLight, borderLeft: `4px solid ${accent}`, padding: '12px 16px', borderRadius: '0 8px 8px 0', marginBottom: '20px', lineHeight: TYPE.leading.relaxed, color: '#334155', fontSize: pt('10.5pt') }}>
            {personal.summary}
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && <div id="resume-sec-experience">
          <div className="resume-section-head" style={{ fontSize: pt('9pt'), fontWeight: TYPE.weight.bold, color: accent, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '12px' }}>Experience</div>
          {experience.map(exp => (
            <div key={exp.id} className={clsx("resume-entry", exp.forcePageBreak && "elite-force-break")} style={{ marginBottom: '14px', marginTop: `${exp.nudge || 0}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontWeight: TYPE.weight.bold }}>{exp.title}</span>
                  {exp.company && <span style={{ color: accent }}> · {exp.company}</span>}
                </div>
                <span style={{ fontSize: pt('9pt'), color: '#94a3b8', background: accentLight, padding: '2px 8px', borderRadius: '20px' }}>{exp.startDate}{exp.startDate ? '–' : ''}{exp.current ? 'Present' : exp.endDate}</span>
              </div>
              {exp.location && <div style={{ fontSize: pt('9pt'), color: '#64748b', marginTop: '2px' }}>{exp.location}</div>}
              <ul style={{ paddingLeft: '16px', marginTop: '5px' }}>
                {(exp.bullets || []).filter(b => b.trim()).map((b, i) => <li key={i} className="resume-bullet" style={{ marginBottom: '3px', color: '#334155' }}>{b}</li>)}
              </ul>
              <span className="resume-entry-end" />
            </div>
          ))}
        </div>}

        {education.length > 0 && <div id="resume-sec-education">
          <div className="resume-section-head" style={{ fontSize: pt('9pt'), fontWeight: TYPE.weight.bold, color: accent, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '12px', marginTop: '18px' }}>Education</div>
          {education.map(edu => (
            <div key={edu.id} className={clsx("resume-entry", edu.forcePageBreak && "elite-force-break")} style={{ marginBottom: '10px', marginTop: `${edu.nudge || 0}px` }}>
              <div style={{ fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{edu.degree}</div>
              <div style={{ color: '#475569', fontSize: pt('10.5pt') }}>{edu.school}{edu.location ? ` · ${edu.location}` : ''}{edu.grade ? ` · ${edu.grade}` : ''} {edu.endDate ? `(${edu.endDate})` : ''}</div>
              <span className="resume-entry-end" />
            </div>
          ))}
        </div>}

        {projects.length > 0 && <div id="resume-sec-projects">
          <div className="resume-section-head" style={{ fontSize: pt('9pt'), fontWeight: TYPE.weight.bold, color: accent, textTransform: 'uppercase', letterSpacing: '1.5px', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: '12px', marginTop: '18px' }}>Projects</div>
          {projects.map(proj => (
            <div key={proj.id} className="resume-entry" style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: TYPE.weight.bold }}>{proj.name}</span>
              {proj.tech && <span style={{ color: '#64748b', fontSize: pt('9pt') }}> — {proj.tech}</span>}
              {proj.description && <div style={{ color: '#334155', fontSize: pt('10.5pt'), marginTop: '2px' }}>{proj.description}</div>}
              <span className="resume-entry-end" />
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
})

function CSideSection({ title, children }) {
  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.bold, textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.65, borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '4px', marginBottom: '8px' }}>{title}</div>
      {children}
    </div>
  )
}

// Template 05 (Pro): Executive Bold
export const ExecutiveBold = React.memo(({ data, settings }) => {
  const { personal, experience, education, skills, certifications, projects, hobbies } = data
  const accent = settings?.accentColor || '#1A56DB'

  return (
    <div style={{ fontFamily: TYPE.SERIF, ...pt(TYPE.SIZE.BODY), minHeight: '100%' }}>
      <div style={{ background: `linear-gradient(135deg, ${accent} 0%, #0f172a 100%)`, padding: '40px 48px', color: '#fff' }}>
        <div style={{ ...pt(TYPE.SIZE.NAME), fontWeight: 700, letterSpacing: '-1px', marginBottom: '6px' }}>{personal.fullName || 'Your Name'}</div>
        <div style={{ ...pt(TYPE.SIZE.TITLE), opacity: 0.9, fontWeight: 300, letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '20px', color: '#cbd5e1' }}>{personal.jobTitle}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 32px', ...pt(TYPE.SIZE.SMALL), opacity: 0.9, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '16px' }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> {personal.email}</div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> {personal.phone}</div>}
          {personal.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} /> {personal.location}</div>}
        </div>
      </div>

      <div style={{ padding: '28px 48px' }}>
        {personal.summary && (
          <div id="resume-sec-summary" className="resume-entry" style={{ borderLeft: `4px solid ${accent}`, paddingLeft: '16px', marginBottom: '22px', ...pt(TYPE.SIZE.TITLE), color: '#1e293b', fontStyle: 'italic' }}>
            {personal.summary}
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && <div id="resume-sec-experience">
          <SectionTitle text="PROFESSIONAL EXPERIENCE" color={accent} />
          {experience.map(exp => (
            <div key={exp.id} className={clsx("resume-entry", exp.forcePageBreak && "elite-force-break")} style={{ marginBottom: '20px', marginTop: `${exp.nudge || 0}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR), color: '#0f172a' }}>{exp.title}</div>
                <div style={{ fontWeight: TYPE.weight.bold, color: accent }}>{exp.company}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', ...pt(TYPE.SIZE.SMALL), color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <span>{exp.location}</span>
                <span>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <ul style={{ paddingLeft: '18px' }}>
                {(exp.bullets || []).filter(b => b.trim()).map((b, i) => <li key={i} className="resume-bullet" style={{ marginBottom: '4px', ...pt(TYPE.SIZE.BULLET) }}>{b}</li>)}
              </ul>
              <span className="resume-entry-end" />
            </div>
          ))}
        </div>}

        {education.length > 0 && <div id="resume-sec-education">
          <SectionTitle text="EDUCATION" color={accent} />
          {education.map(edu => (
            <div key={edu.id} className={clsx("resume-entry", edu.forcePageBreak && "elite-force-break")} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', marginTop: `${edu.nudge || 0}px` }}>
              <div>
                <div style={{ fontWeight: 700 }}>{edu.degree}</div>
                <div style={{ color: '#475569', fontSize: pt('10.5pt') }}>{edu.school}{edu.location ? ` · ${edu.location}` : ''}{edu.grade ? ` · ${edu.grade}` : ''}</div>
              </div>
              <span style={{ color: '#64748b', fontSize: pt('9pt') }}>{edu.endDate}</span>
              <span className="resume-entry-end" />
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
})

// Template 06 (Pro): Elegant Modern — thin lines, premium feel
export const ElegantModern = React.memo(({ data, settings }) => {
  const { personal, experience, education, skills, certifications, projects, languages, hobbies } = data
  const accent = settings?.accentColor || '#B45309'

  return (
    <div style={{ fontFamily: TYPE.SERIF, ...pt(TYPE.SIZE.BODY), minHeight: '100%', background: '#fff', color: '#1e293b' }}>
      <div style={{ padding: '48px 60px 32px', textAlign: 'center', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ ...pt(TYPE.SIZE.NAME), fontWeight: TYPE.weight.bold, color: '#0f172a', letterSpacing: TYPE.tracking.tight, marginBottom: '8px' }}>{personal.fullName || 'Your Name'}</div>
        {personal.jobTitle && <div style={{ ...pt(TYPE.SIZE.TITLE), color: accent, fontWeight: TYPE.weight.medium, letterSpacing: TYPE.tracking.widest, textTransform: 'uppercase', marginBottom: '16px' }}>{personal.jobTitle}</div>}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 20px', ...pt(TYPE.SIZE.SMALL), color: '#64748b' }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={12} color={accent} /> {personal.email}</div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12} color={accent} /> {personal.phone}</div>}
          {personal.location && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={12} color={accent} /> {personal.location}</div>}
          {personal.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Linkedin size={12} color={accent} /> {personal.linkedin}</div>}
        </div>
      </div>

      <div style={{ padding: '28px 60px' }}>
        {personal.summary && (
          <div id="resume-sec-summary" className="resume-entry" style={{ textAlign: 'center', fontStyle: 'italic', color: '#475569', maxWidth: '85%', margin: '0 auto 24px', ...pt(TYPE.SIZE.BODY) }}>
            {personal.summary}
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && <div id="resume-sec-experience">
          <ElegantSection title="Experience" accent={accent} />
          {experience.map(exp => (
            <div key={exp.id} className={clsx("resume-entry", exp.forcePageBreak && "elite-force-break")} style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0 20px', marginTop: `${exp.nudge || 0}px` }}>
              <div style={{ textAlign: 'right', paddingTop: '1px' }}>
                <div style={{ fontSize: pt('9pt'), color: accent }}>{exp.startDate}{exp.startDate ? '–' : ''}{exp.current ? 'Present' : exp.endDate}</div>
              </div>
              <div>
                <div style={{ fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{exp.title}{exp.company ? ` · ${exp.company}` : ''}</div>
                <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                  {(exp.bullets || []).filter(b => b.trim()).map((b, i) => <li key={i} className="resume-bullet" style={{ marginBottom: '3px', color: '#334155', ...pt(TYPE.SIZE.BULLET) }}>{b}</li>)}
                </ul>
                <span className="resume-entry-end" />
              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
})

function ElegantSection({ title, accent }) {
  return (
    <div className="resume-section-head" style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0 12px' }}>
      <div style={{ width: '24px', height: '1px', background: accent }} />
      <span style={{ fontSize: pt('9pt'), fontWeight: TYPE.weight.bold, letterSpacing: '2.5px', textTransform: 'uppercase', color: accent }}>{title}</span>
      <div style={{ flex: 1, height: '1px', background: `${accent}30` }} />
    </div>
  )
}

// Template 07 (Pro): Startup Hustler — compact, high-density
export const StartupHustler = React.memo(({ data, settings }) => {
  const { personal, experience, education, skills, certifications, projects, hobbies } = data
  const accent = settings?.accentColor || '#DC2626'

  return (
    <div style={{ fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%', color: '#111' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: `${TYPE.SPACE.PAGE_TOP}px ${TYPE.SPACE.PAGE_SIDE_TWO}px`, borderBottom: `3px solid ${accent}` }}>
        <div>
          <div style={{ ...pt(TYPE.SIZE.NAME), fontWeight: TYPE.weight.black, letterSpacing: TYPE.tracking.tight }}>{personal.fullName || 'Your Name'}</div>
          <div style={{ color: accent, fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.BODY), letterSpacing: '0.5px' }}>{personal.jobTitle}</div>
        </div>
        <div style={{ textAlign: 'right', ...pt(TYPE.SIZE.SMALL), color: '#475569', lineHeight: 1.8 }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.email} <Mail size={12} color={accent} /></div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.phone} <Phone size={12} color={accent} /></div>}
          {personal.location && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.location} <MapPin size={12} color={accent} /></div>}
        </div>
      </div>

      <div style={{ padding: '18px 36px' }}>
        {personal.summary && (
          <div id="resume-sec-summary" className="resume-entry" style={{ background: '#f8fafc', border: `1px solid ${accent}25`, borderLeft: `4px solid ${accent}`, padding: '10px 14px', marginBottom: '16px', ...pt(TYPE.SIZE.BODY), color: '#334155' }}>
            {personal.summary}
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && <div id="resume-sec-experience">
          <SHSection title="EXPERIENCE" accent={accent} />
          {experience.map(exp => (
            <div key={exp.id} className={clsx("resume-entry", exp.forcePageBreak && "elite-force-break")} style={{ marginBottom: `${TYPE.SPACE.ENTRY_BOTTOM}px`, paddingLeft: '10px', borderLeft: `2px solid ${accent}20`, marginTop: `${exp.nudge || 0}px` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: TYPE.weight.black, ...pt(TYPE.SIZE.ENTRY_HDR) }}>{exp.title}</span>
                <span style={{ ...pt(TYPE.SIZE.SMALL), background: accent, color: '#fff', padding: '1px 8px', borderRadius: '20px' }}>{exp.startDate}{exp.startDate ? '–' : ''}{exp.current ? 'Now' : exp.endDate}</span>
              </div>
              {exp.company && <div style={{ color: accent, fontWeight: TYPE.weight.semibold, ...pt(TYPE.SIZE.SMALL) }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>}
              <ul style={{ paddingLeft: '14px', marginTop: '3px' }}>
                {(exp.bullets || []).filter(b => b.trim()).map((b, i) => <li key={i} className="resume-bullet" style={{ marginBottom: '2px', ...pt(TYPE.SIZE.BULLET) }}>{b}</li>)}
              </ul>
              <span className="resume-entry-end" />
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
})

function SHSection({ title, accent }) {
  return <div className="resume-section-head" style={{ fontWeight: 800, ...pt(TYPE.SIZE.SMALL), letterSpacing: '2px', color: accent, textTransform: 'uppercase', borderBottom: `2px solid ${accent}`, paddingBottom: '3px', marginBottom: '8px', marginTop: '16px' }}>{title}</div>
}

// Template 08: Infographic Pro
export const InfographicPro = React.memo(({ data, settings }) => {
  const { personal, experience, education, skills, certifications, hobbies } = data
  const accent = settings?.accentColor || '#0891B2'

  return (
    <div style={{ fontFamily: TYPE.SANS, minHeight: '100%', color: '#1a1a1a' }}>
      <div style={{ background: `linear-gradient(135deg, ${accent} 0%, ${accent}99 100%)`, padding: '32px 40px', color: '#fff' }}>
        <div style={{ ...pt(TYPE.SIZE.NAME), fontWeight: 700 }}>{personal.fullName || 'Your Name'}</div>
        <div style={{ ...pt(TYPE.SIZE.BODY), opacity: 0.9, marginTop: '4px' }}>{personal.jobTitle}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px', marginTop: '16px', ...pt(TYPE.SIZE.SMALL), opacity: 0.9 }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> {personal.email}</div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> {personal.phone}</div>}
          {personal.location && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} /> {personal.location}</div>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '1123px' }}>
        <div style={{ background: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '24px 20px' }}>
          {personal.summary && <div id="resume-sec-summary">
            <InfoSection title="ABOUT" accent={accent} />
            <p style={{ ...pt(TYPE.SIZE.SMALL), lineHeight: 1.6, color: '#475569' }}>{personal.summary}</p>
          </div>}

          {skills.length > 0 && <div id="resume-sec-skills">
            <InfoSection title="SKILLS" accent={accent} />
            {skills.map(sk => (
              <div key={sk.id} style={{ marginBottom: '10px' }}>
                {sk.category && <div style={{ fontSize: '9pt', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>{sk.category}</div>}
                {(sk.items || '').split(',').filter(Boolean).map((item, i) => (
                  <div key={i} style={{ marginBottom: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9pt', color: '#475569', marginBottom: '2px' }}>
                      <span>{item.trim()}</span>
                    </div>
                    <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '5px' }}>
                      <div style={{ background: accent, height: '5px', borderRadius: '4px', width: `${70 + (i * 7 % 25)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>}
        </div>

        <div style={{ padding: '24px 28px' }}>
          {experience.length > 0 && <div id="resume-sec-experience">
            <InfoSection title="WORK EXPERIENCE" accent={accent} />
            {experience.map(exp => (
              <div key={exp.id} className={clsx("resume-entry", exp.forcePageBreak && "elite-force-break")} style={{ marginBottom: `${TYPE.SPACE.ENTRY_BOTTOM}px`, position: 'relative', paddingLeft: '16px', borderLeft: `2px solid ${accent}30`, marginTop: `${exp.nudge || 0}px` }}>
                <div style={{ position: 'absolute', left: '-5px', top: '4px', width: '8px', height: '8px', borderRadius: '50%', background: accent }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR), color: '#1e293b' }}>{exp.title}</div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8' }}>{exp.startDate}{exp.startDate ? '–' : ''}{exp.current ? 'Present' : exp.endDate}</span>
                </div>
                {exp.company && <div style={{ color: accent, fontWeight: TYPE.weight.semibold, ...pt(TYPE.SIZE.SMALL) }}>{exp.company}</div>}
                <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                  {(exp.bullets || []).filter(b => b.trim()).map((b, i) => <li key={i} className="resume-bullet" style={{ marginBottom: '3px', color: '#334155', ...pt(TYPE.SIZE.BULLET) }}>{b}</li>)}
                </ul>
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  )
})

function InfoSection({ title, accent }) {
  return <div className="resume-section-head" style={{ fontSize: '10pt', fontWeight: 800, color: accent, letterSpacing: '1px', marginBottom: '12px', marginTop: '20px', borderLeft: `3px solid ${accent}`, paddingLeft: '8px' }}>{title}</div>
}

// Template 09: International
export const International = React.memo(({ data, settings }) => {
  const { personal, experience, education, skills, certifications, projects, languages, hobbies } = data
  const accent = settings?.accentColor || '#4F46E5'

  return (
    <div style={{ fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), padding: '40px', minHeight: '100%', color: '#1e293b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: `3px solid ${accent}`, paddingBottom: '16px', marginBottom: '20px' }}>
        <div>
          <div style={{ ...pt(TYPE.SIZE.NAME), fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{personal.fullName || 'Your Name'}</div>
          {personal.jobTitle && <div style={{ color: accent, fontWeight: TYPE.weight.semibold, ...pt(TYPE.SIZE.TITLE), marginTop: '3px' }}>{personal.jobTitle}</div>}
        </div>
        <div style={{ textAlign: 'right', ...pt(TYPE.SIZE.SMALL), color: '#475569', lineHeight: 1.8 }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.email} <Mail size={12} color={accent} /></div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.phone} <Phone size={12} color={accent} /></div>}
        </div>
      </div>

      {personal.summary && <div id="resume-sec-summary" className="resume-entry" style={{ borderLeft: `4px solid ${accent}`, paddingLeft: '14px', marginBottom: '20px', color: '#334155' }}>
        {personal.summary}
        <span className="resume-entry-end" />
      </div>}

      {experience.length > 0 && <div id="resume-sec-experience">
        <IntlSection title="Work Experience" accent={accent} />
        {experience.map(exp => (
          <div key={exp.id} className={clsx("resume-entry", exp.forcePageBreak && "elite-force-break")} style={{ marginBottom: `${TYPE.SPACE.ENTRY_BOTTOM}px`, marginTop: `${exp.nudge || 0}px` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR) }}>{exp.title}</span>
              <span style={{ color: '#64748b', ...pt(TYPE.SIZE.SMALL) }}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
            </div>
            {exp.company && <div style={{ color: accent, fontWeight: TYPE.weight.semibold, ...pt(TYPE.SIZE.BODY) }}>{exp.company}</div>}
            <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
              {(exp.bullets || []).filter(b => b.trim()).map((b, i) => <li key={i} className="resume-bullet" style={{ marginBottom: '3px', color: '#334155', ...pt(TYPE.SIZE.BULLET) }}>{b}</li>)}
            </ul>
            <span className="resume-entry-end" />
          </div>
        ))}
      </div>}
    </div>
  )
})

function IntlSection({ title, accent }) {
  return <div className="resume-section-head" style={{ ...pt(TYPE.SIZE.SECTION), fontWeight: TYPE.weight.bold, color: '#0f172a', borderBottom: `2px solid ${accent}`, paddingBottom: '4px', marginBottom: `${TYPE.SPACE.SECTION_BOTTOM}px`, marginTop: '16px' }}>{title}</div>
}

// Template 10: LinkedIn Export
export const LinkedInExport = React.memo(({ data, settings }) => {
  const { personal, experience, education, skills, certifications, hobbies } = data
  const accent = settings?.accentColor || '#0077B5'

  return (
    <div style={{ fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%', background: '#fff' }}>
      <div style={{ background: `linear-gradient(180deg, ${accent}15 0%, #fff 100%)`, borderBottom: `3px solid ${accent}`, padding: '32px 40px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', ...pt(TYPE.SIZE.NAME), color: '#fff', fontWeight: TYPE.weight.bold, flexShrink: 0 }}>
            {(personal.fullName || 'Y')[0]}
          </div>
          <div>
            <div style={{ ...pt(TYPE.SIZE.NAME), fontWeight: TYPE.weight.bold, color: '#191919' }}>{personal.fullName || 'Your Name'}</div>
            {personal.jobTitle && <div style={{ ...pt(TYPE.SIZE.TITLE), color: '#666', marginTop: '2px' }}>{personal.jobTitle}</div>}
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 40px' }}>
        {personal.summary && <div id="resume-sec-summary" className="resume-entry">
          <LISection title="About" accent={accent} />
          <p style={{ ...pt(TYPE.SIZE.BODY), color: '#333' }}>{personal.summary}</p>
          <span className="resume-entry-end" />
        </div>}

        {experience.length > 0 && <div id="resume-sec-experience">
          <LISection title="Experience" accent={accent} />
          {experience.map(exp => (
            <div key={exp.id} className={clsx("resume-entry", exp.forcePageBreak && "elite-force-break")} style={{ display: 'flex', gap: '14px', marginBottom: `${TYPE.SPACE.ENTRY_BOTTOM}px`, marginTop: `${exp.nudge || 0}px` }}>
              <div style={{ width: '40px', height: '40px', background: `${accent}15`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...pt(TYPE.SIZE.SECTION), flexShrink: 0 }}>🏢</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR), color: '#191919' }}>{exp.title}</div>
                {exp.company && <div style={{ color: '#333', fontWeight: TYPE.weight.semibold, ...pt(TYPE.SIZE.BODY) }}>{exp.company}</div>}
                <ul style={{ paddingLeft: '16px', marginTop: '5px' }}>
                  {(exp.bullets || []).filter(b => b.trim()).map((b, i) => <li key={i} className="resume-bullet" style={{ marginBottom: '3px', color: '#333', ...pt(TYPE.SIZE.BULLET) }}>{b}</li>)}
                </ul>
                <span className="resume-entry-end" />
              </div>
            </div>
          ))}
        </div>}
      </div>
    </div>
  )
})

function LISection({ title, accent }) {
  return <div className="resume-section-head" style={{ ...pt(TYPE.SIZE.SECTION), fontWeight: TYPE.weight.bold, color: '#191919', borderBottom: `1px solid #e0e0e0`, paddingBottom: '6px', marginBottom: `${TYPE.SPACE.SECTION_BOTTOM}px`, marginTop: '20px' }}>{title}</div>
}
