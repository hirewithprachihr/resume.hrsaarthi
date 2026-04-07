/**
 * NEW PREMIUM TEMPLATES — v3.0
 * ─────────────────────────────────────────────────────
 * Template 11: Vedanta        — India corporate, dark navy + gold
 * Template 12: Minimal Ink   — Ultra-minimal, typography only
 * Template 13: Split Screen  — 50/50 charcoal/white premium two-column
 * Template 14: Timeline Pro  — Visual career timeline with dot indicators
 * Template 15: Fresher First — Entry-level optimized, education → projects → experience
 */

import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react'
import { TYPE, pt } from './typography'

// ─── Shared utilities ────────────────────────────────────────────

/** Indian corporate gold accent */
const GOLD = '#D4AF37'

function noop(v, fallback) {
  return v && v.trim() ? v : (fallback || '')
}

// ─────────────────────────────────────────────────────────────────
//  Template 11 — Vedanta
//  Dark navy header (#0f1f3d) + gold (#D4AF37) — Indian corporate
// ─────────────────────────────────────────────────────────────────
export const Vedanta = React.memo(function Vedanta({ data, settings }) {
  const { personal, experience, education, skills, certifications, projects, languages, hobbies } = data
  const accent = settings?.accentColor || '#D4AF37'
  const navy   = '#0f1f3d'

  const sHead = {
    ...pt(TYPE.SIZE.SMALL),
    fontWeight   : TYPE.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color        : accent,
    borderBottom : `2px solid ${accent}`,
    paddingBottom: '4px',
    marginBottom : `${TYPE.SPACE.SECTION_BOTTOM}px`,
    marginTop    : '20px',
  }

  return (
    <div style={{ fontFamily: TYPE.SERIF, ...pt(TYPE.SIZE.BODY), minHeight: '100%', color: '#1e293b' }}>
      {/* Header */}
      <div style={{
        background  : navy,
        padding     : '44px 52px 32px',
        color       : '#e8edf5',
        position    : 'relative',
        overflowX   : 'hidden',
      }}>
        {/* Subtle decorative bar left edge */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: accent }} />

        <div style={{
          ...pt(TYPE.SIZE.NAME),
          fontWeight   : TYPE.weight.bold,
          color        : '#ffffff',
          letterSpacing: TYPE.tracking.tight,
          marginBottom : '6px',
          overflowWrap : 'break-word',
          wordBreak    : 'break-word',
        }}>
          {personal.fullName || 'Your Full Name'}
        </div>

        {personal.jobTitle && (
          <div style={{
            ...pt(TYPE.SIZE.TITLE),
            color        : accent,
            fontWeight   : TYPE.weight.semibold,
            letterSpacing: '1px',
            marginBottom : '18px',
          }}>
            {personal.jobTitle}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px', ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', alignItems: 'center' }}>
          {personal.email    && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Mail    size={11}/>{personal.email}</span>}
          {personal.phone    && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Phone   size={11}/>{personal.phone}</span>}
          {personal.location && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><MapPin  size={11}/>{personal.location}</span>}
          {personal.linkedin && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Linkedin size={11}/>{personal.linkedin}</span>}
          {personal.website  && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Globe   size={11}/>{personal.website}</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '28px 52px' }}>
        {personal.summary && (
          <div className="resume-entry" style={{ marginBottom: '20px' }}>
            <div className="resume-section-head" style={sHead}>Professional Summary</div>
            <p style={{ ...pt(TYPE.SIZE.BODY), color: '#334155', lineHeight: TYPE.leading.relaxed }}>
              {personal.summary}
            </p>
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <div className="resume-section-head" style={sHead}>Work Experience</div>
            {experience.map(exp => (
              <div key={exp.id} className="resume-entry" style={{ marginBottom: `${TYPE.SPACE.ENTRY_BOTTOM}px` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR), color: '#0f172a', overflowWrap: 'break-word' }}>
                      {exp.title}
                    </div>
                    {exp.company && (
                      <div style={{ color: accent, fontWeight: TYPE.weight.semibold, ...pt(TYPE.SIZE.BODY) }}>
                        {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                      </div>
                    )}
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#64748b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul style={{ paddingLeft: '16px', marginTop: '5px' }}>
                  {(exp.bullets || []).filter(b => b.trim()).map((b, i) => (
                    <li key={i} className="resume-bullet-text" style={{ marginBottom: '3px', ...pt(TYPE.SIZE.BULLET), color: '#334155' }}>{b}</li>
                  ))}
                </ul>
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <div className="resume-section-head" style={sHead}>Education</div>
            {education.map(edu => (
              <div key={edu.id} className="resume-entry" style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR) }}>{edu.degree}</span>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#64748b' }}>{edu.endDate}</span>
                </div>
                <div style={{ color: '#475569', ...pt(TYPE.SIZE.BODY) }}>
                  {edu.school}{edu.location ? `, ${edu.location}` : ''}{edu.grade ? ` · ${edu.grade}` : ''}
                </div>
                {edu.achievements && <div style={{ ...pt(TYPE.SIZE.BULLET), color: '#64748b', marginTop: '2px' }}>{edu.achievements}</div>}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="resume-section-compact">
            <div className="resume-section-head" style={sHead}>Core Competencies</div>
            {skills.map(sk => (
              <div key={sk.id} style={{ marginBottom: '4px', ...pt(TYPE.SIZE.BODY) }}>
                {sk.category && <span style={{ fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{sk.category}: </span>}
                <span style={{ color: '#334155' }}>{sk.items}</span>
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div className="resume-section-compact">
            <div className="resume-section-head" style={sHead}>Certifications</div>
            {certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: '4px', ...pt(TYPE.SIZE.BODY) }}>
                <span style={{ fontWeight: TYPE.weight.semibold }}>{cert.name}</span>
                {cert.issuer && <span style={{ color: '#475569' }}> — {cert.issuer}</span>}
                {cert.date   && <span style={{ color: '#94a3b8' }}> ({cert.date})</span>}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <div className="resume-section-head" style={sHead}>Projects</div>
            {projects.map(proj => (
              <div key={proj.id} className="resume-entry" style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR) }}>{proj.name}</span>
                {proj.tech        && <span style={{ color: '#475569', ...pt(TYPE.SIZE.BULLET) }}> | {proj.tech}</span>}
                {proj.description && <div style={{ ...pt(TYPE.SIZE.BODY), marginTop: '2px', color: '#334155' }}>{proj.description}</div>}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {(languages || []).length > 0 && (
          <div className="resume-section-compact">
            <div className="resume-section-head" style={sHead}>Languages</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
              {languages.map(lang => (
                <span key={lang.id} style={{ ...pt(TYPE.SIZE.BODY) }}>
                  <strong>{lang.language}</strong> — <span style={{ color: '#64748b' }}>{lang.proficiency}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

// ─────────────────────────────────────────────────────────────────
//  Template 12 — Minimal Ink
//  Ultra-minimal Muji aesthetic: typography only, zero borders
// ─────────────────────────────────────────────────────────────────
export const MinimalInk = React.memo(function MinimalInk({ data, settings }) {
  const { personal, experience, education, skills, certifications, projects, languages, hobbies } = data
  const accent = settings?.accentColor || '#0f172a'

  return (
    <div style={{
      fontFamily: TYPE.SERIF,
      ...pt(TYPE.SIZE.BODY),
      minHeight : '100%',
      color     : '#1a1a1a',
      padding   : `${TYPE.SPACE.PAGE_TOP}px 52px`,
    }}>
      {/* Header — large quiet name + thin separator */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          fontSize     : '26pt',
          fontWeight   : '300',
          letterSpacing: '-0.5px',
          color        : '#0f172a',
          lineHeight   : 1.1,
          marginBottom : '8px',
          overflowWrap : 'break-word',
          wordBreak    : 'break-word',
        }}>
          {personal.fullName || 'Your Name'}
        </div>
        {personal.jobTitle && (
          <div style={{ ...pt(TYPE.SIZE.TITLE), color: '#475569', fontWeight: '400', marginBottom: '16px', fontStyle: 'italic' }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', ...pt(TYPE.SIZE.SMALL), color: '#64748b' }}>
          {personal.email    && <span>{personal.email}</span>}
          {personal.phone    && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
        </div>
      </div>

      {/* Thin rule */}
      <div style={{ height: '1px', background: '#e2e8f0', marginBottom: '28px' }} />

      {personal.summary && (
        <div className="resume-entry" style={{ marginBottom: '24px' }}>
          <p style={{ ...pt(TYPE.SIZE.BODY), color: '#475569', lineHeight: TYPE.leading.relaxed, maxWidth: '90%' }}>
            {personal.summary}
          </p>
          <span className="resume-entry-end" />
        </div>
      )}

      {experience.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <MISection title="Experience" accent={accent} />
          {experience.map(exp => (
            <div key={exp.id} className="resume-entry" style={{ marginBottom: `${TYPE.SPACE.ENTRY_BOTTOM}px`, display: 'grid', gridTemplateColumns: '110px 1fr', gap: '0 20px' }}>
              <div style={{ textAlign: 'left', color: '#94a3b8', ...pt(TYPE.SIZE.SMALL), paddingTop: '1px' }}>
                {exp.startDate && (
                  <>{exp.startDate}<br />{exp.current ? '– Present' : (exp.endDate ? `– ${exp.endDate}` : '')}</>
                )}
              </div>
              <div>
                <div style={{ fontWeight: TYPE.weight.semibold, ...pt(TYPE.SIZE.ENTRY_HDR) }}>
                  {exp.title}{exp.company ? <span style={{ fontWeight: 400, color: '#475569' }}> · {exp.company}</span> : ''}
                </div>
                {exp.location && <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8' }}>{exp.location}</div>}
                <ul style={{ paddingLeft: '14px', marginTop: '4px', listStyleType: 'disc' }}>
                  {(exp.bullets || []).filter(b => b.trim()).map((b, i) => (
                    <li key={i} className="resume-bullet-text" style={{ marginBottom: '3px', ...pt(TYPE.SIZE.BULLET), color: '#334155' }}>{b}</li>
                  ))}
                </ul>
                <span className="resume-entry-end" />
              </div>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <MISection title="Education" accent={accent} />
          {education.map(edu => (
            <div key={edu.id} className="resume-entry" style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns: '110px 1fr', gap: '0 20px' }}>
              <div style={{ color: '#94a3b8', ...pt(TYPE.SIZE.SMALL) }}>{edu.endDate}</div>
              <div>
                <div style={{ fontWeight: TYPE.weight.semibold }}>{edu.degree}</div>
                <div style={{ color: '#475569', ...pt(TYPE.SIZE.BODY) }}>{edu.school}{edu.grade ? ` · ${edu.grade}` : ''}</div>
                <span className="resume-entry-end" />
              </div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="resume-section-compact" style={{ marginBottom: '24px' }}>
          <MISection title="Skills" accent={accent} />
          {skills.map(sk => (
            <div key={sk.id} style={{ marginBottom: '4px', ...pt(TYPE.SIZE.BODY), display: 'grid', gridTemplateColumns: '110px 1fr', gap: '0 20px' }}>
              <div style={{ color: '#94a3b8', ...pt(TYPE.SIZE.SMALL) }}>{sk.category}</div>
              <div style={{ color: '#334155' }}>{sk.items}</div>
            </div>
          ))}
        </div>
      )}

      {certifications.length > 0 && (
        <div className="resume-section-compact" style={{ marginBottom: '24px' }}>
          <MISection title="Certifications" accent={accent} />
          {certifications.map(cert => (
            <div key={cert.id} style={{ marginBottom: '4px', ...pt(TYPE.SIZE.BODY), display: 'grid', gridTemplateColumns: '110px 1fr', gap: '0 20px' }}>
              <div style={{ color: '#94a3b8', ...pt(TYPE.SIZE.SMALL) }}>{cert.date}</div>
              <div><strong>{cert.name}</strong>{cert.issuer ? ` · ${cert.issuer}` : ''}</div>
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <MISection title="Projects" accent={accent} />
          {projects.map(proj => (
            <div key={proj.id} className="resume-entry" style={{ marginBottom: '10px' }}>
              <div style={{ fontWeight: TYPE.weight.semibold }}>{proj.name}{proj.tech ? <span style={{ fontWeight: 400, color: '#64748b' }}> — {proj.tech}</span> : ''}</div>
              {proj.description && <div style={{ color: '#475569', ...pt(TYPE.SIZE.BODY) }}>{proj.description}</div>}
              <span className="resume-entry-end" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
})

function MISection({ title, accent }) {
  return (
    <div className="resume-section-head" style={{
      ...pt(TYPE.SIZE.SMALL),
      fontWeight   : TYPE.weight.bold,
      textTransform: 'uppercase',
      letterSpacing: '2px',
      color        : '#0f172a',
      marginBottom : '12px',
      marginTop    : '0',
    }}>
      {title}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
//  Template 13 — Split Screen
//  Left: deep charcoal (#1e2433) | Right: clean white
//  Section numbering 01, 02, 03...
// ─────────────────────────────────────────────────────────────────
export const SplitScreen = React.memo(function SplitScreen({ data, settings }) {
  const { personal, experience, education, skills, certifications, projects, languages, hobbies } = data
  const accent   = settings?.accentColor || '#6366F1'
  const charcoal = '#1e2433'

  return (
    <div style={{ display: 'flex', fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '1123px' }}>
      {/* Left Column */}
      <div style={{
        width     : '270px',
        flexShrink: 0,
        background: charcoal,
        color     : '#e8edf5',
        padding   : '40px 24px',
      }}>
        {/* Avatar initial */}
        <div style={{
          width           : '64px',
          height          : '64px',
          borderRadius    : '50%',
          background      : accent,
          display         : 'flex',
          alignItems      : 'center',
          justifyContent  : 'center',
          ...pt(TYPE.SIZE.NAME),
          color           : '#fff',
          fontWeight      : TYPE.weight.bold,
          marginBottom    : '16px',
          flexShrink      : 0,
        }}>
          {(personal.fullName || 'Y')[0].toUpperCase()}
        </div>

        <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, lineHeight: 1.2, marginBottom: '6px', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
          {personal.fullName || 'Your Name'}
        </div>
        <div style={{ ...pt(TYPE.SIZE.SMALL), color: accent, fontWeight: TYPE.weight.semibold, marginBottom: '24px' }}>
          {personal.jobTitle}
        </div>

        <SSLeftSection title="Contact">
          {personal.email    && <SSContact icon={<Mail    size={11}/>} text={personal.email} />}
          {personal.phone    && <SSContact icon={<Phone   size={11}/>} text={personal.phone} />}
          {personal.location && <SSContact icon={<MapPin  size={11}/>} text={personal.location} />}
          {personal.linkedin && <SSContact icon={<Linkedin size={11}/>} text={personal.linkedin} isLink />}
          {personal.website  && <SSContact icon={<Globe   size={11}/>} text={personal.website} />}
        </SSLeftSection>

        {skills.length > 0 && (
          <SSLeftSection title="Skills">
            {skills.map(sk => (
              <div key={sk.id} style={{ marginBottom: '10px' }}>
                {sk.category && (
                  <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#cbd5e1', fontWeight: TYPE.weight.semibold, marginBottom: '3px' }}>
                    {sk.category}
                  </div>
                )}
                <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', lineHeight: 1.5 }}>{sk.items}</div>
              </div>
            ))}
          </SSLeftSection>
        )}

        {(languages || []).length > 0 && (
          <SSLeftSection title="Languages">
            {languages.map(l => (
              <div key={l.id} style={{ ...pt(TYPE.SIZE.SMALL), marginBottom: '4px' }}>
                <span style={{ color: '#e2e8f0', fontWeight: TYPE.weight.semibold }}>{l.language}</span>
                <span style={{ color: '#64748b' }}> · {l.proficiency}</span>
              </div>
            ))}
          </SSLeftSection>
        )}

        {certifications.length > 0 && (
          <SSLeftSection title="Certifications">
            {certifications.map(c => (
              <div key={c.id} style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', marginBottom: '6px' }}>
                <div style={{ color: '#e2e8f0', fontWeight: TYPE.weight.semibold }}>{c.name}</div>
                <div>{c.issuer}</div>
              </div>
            ))}
          </SSLeftSection>
        )}

        {(hobbies || []).length > 0 && (
          <SSLeftSection title="Interests">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 8px', ...pt(TYPE.SIZE.SMALL), color: '#94a3b8' }}>
              {hobbies.map(h => <span key={h.id}>{h.name}</span>)}
            </div>
          </SSLeftSection>
        )}
      </div>

      {/* Right Column */}
      <div style={{ flex: 1, background: '#fff', padding: '40px 32px' }}>
        {personal.summary && (
          <div className="resume-entry" style={{ marginBottom: '24px' }}>
            <SSRightSection num="01" title="Profile" accent={accent} />
            <p style={{ ...pt(TYPE.SIZE.BODY), color: '#334155', lineHeight: TYPE.leading.relaxed }}>
              {personal.summary}
            </p>
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SSRightSection num="02" title="Experience" accent={accent} />
            {experience.map(exp => (
              <div key={exp.id} className="resume-entry" style={{ marginBottom: `${TYPE.SPACE.ENTRY_BOTTOM}px` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR), color: '#0f172a', overflowWrap: 'break-word' }}>{exp.title}</div>
                    {exp.company && <div style={{ color: accent, fontWeight: TYPE.weight.semibold, ...pt(TYPE.SIZE.BODY) }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>}
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul style={{ paddingLeft: '16px', marginTop: '5px' }}>
                  {(exp.bullets || []).filter(b => b.trim()).map((b, i) => (
                    <li key={i} className="resume-bullet-text" style={{ marginBottom: '3px', ...pt(TYPE.SIZE.BULLET), color: '#334155' }}>{b}</li>
                  ))}
                </ul>
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <SSRightSection num="03" title="Education" accent={accent} />
            {education.map(edu => (
              <div key={edu.id} className="resume-entry" style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR) }}>{edu.degree}</span>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#64748b' }}>{edu.endDate}</span>
                </div>
                <div style={{ color: '#475569', ...pt(TYPE.SIZE.BODY) }}>{edu.school}{edu.grade ? ` · ${edu.grade}` : ''}</div>
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <SSRightSection num="04" title="Projects" accent={accent} />
            {projects.map(proj => (
              <div key={proj.id} className="resume-entry" style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR) }}>{proj.name}{proj.tech ? <span style={{ fontWeight: 400, color: '#64748b', ...pt(TYPE.SIZE.SMALL) }}> · {proj.tech}</span> : ''}</div>
                {proj.description && <div style={{ ...pt(TYPE.SIZE.BODY), color: '#334155', marginTop: '2px' }}>{proj.description}</div>}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

function SSLeftSection({ title, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{
        ...pt(TYPE.SIZE.SMALL),
        fontWeight   : TYPE.weight.bold,
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color        : '#94a3b8',
        borderBottom : '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '5px',
        marginBottom : '10px',
      }}>{title}</div>
      {children}
    </div>
  )
}

function SSContact({ icon, text, isLink }) {
  return (
    <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#cbd5e1', marginBottom: '6px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
      <span style={{ flexShrink: 0 }}>{icon}</span>
      <span style={{ wordBreak: 'break-all', lineHeight: 1.4 }}>{text}</span>
    </div>
  )
}

function SSRightSection({ num, title, accent }) {
  return (
    <div className="resume-section-head" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', marginTop: '0' }}>
      <span style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.black, color: accent, opacity: 0.5 }}>{num}</span>
      <span style={{ ...pt(TYPE.SIZE.SECTION), fontWeight: TYPE.weight.bold, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</span>
      <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────
//  Template 14 — Timeline Pro
//  Visual career timeline with dot indicators per job
// ─────────────────────────────────────────────────────────────────
export const TimelinePro = React.memo(function TimelinePro({ data, settings }) {
  const { personal, experience, education, skills, certifications, projects, languages, hobbies } = data
  const accent = settings?.accentColor || '#0891B2'

  const sHead = {
    ...pt(TYPE.SIZE.SECTION),
    fontWeight   : TYPE.weight.bold,
    color        : '#0f172a',
    borderLeft   : `4px solid ${accent}`,
    paddingLeft  : '12px',
    marginBottom : '16px',
    marginTop    : '24px',
  }

  return (
    <div style={{ fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%', color: '#1a1a1a' }}>
      {/* Header */}
      <div style={{ background: `${accent}10`, borderBottom: `3px solid ${accent}`, padding: '32px 48px 24px' }}>
        <div style={{ ...pt(TYPE.SIZE.NAME), fontWeight: TYPE.weight.bold, color: '#0f172a', letterSpacing: TYPE.tracking.tight, marginBottom: '6px', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
          {personal.fullName || 'Your Name'}
        </div>
        {personal.jobTitle && (
          <div style={{ ...pt(TYPE.SIZE.TITLE), color: accent, fontWeight: TYPE.weight.semibold, marginBottom: '14px' }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', ...pt(TYPE.SIZE.SMALL), color: '#64748b', alignItems: 'center' }}>
          {personal.email    && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Mail    size={11}/>{personal.email}</span>}
          {personal.phone    && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Phone   size={11}/>{personal.phone}</span>}
          {personal.location && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><MapPin  size={11}/>{personal.location}</span>}
          {personal.linkedin && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Linkedin size={11}/>{personal.linkedin}</span>}
        </div>
      </div>

      <div style={{ padding: '20px 52px' }}>
        {personal.summary && (
          <div className="resume-entry" style={{ marginBottom: '4px' }}>
            <div className="resume-section-head" style={sHead}>Summary</div>
            <p style={{ ...pt(TYPE.SIZE.BODY), color: '#334155', lineHeight: TYPE.leading.relaxed, paddingLeft: '16px' }}>
              {personal.summary}
            </p>
            <span className="resume-entry-end" />
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <div className="resume-section-head" style={sHead}>Experience</div>
            {/* Timeline */}
            <div style={{ position: 'relative', paddingLeft: '32px' }}>
              {/* Vertical axis line */}
              <div style={{ position: 'absolute', left: '7px', top: '6px', bottom: '6px', width: '2px', background: `${accent}25` }} />
              {experience.map((exp, idx) => (
                <div key={exp.id} className="resume-entry" style={{ position: 'relative', marginBottom: `${TYPE.SPACE.ENTRY_BOTTOM}px` }}>
                  {/* Dot */}
                  <div style={{
                    position  : 'absolute',
                    left      : '-25px',
                    top       : '4px',
                    width     : '14px',
                    height    : '14px',
                    borderRadius: '50%',
                    background: idx === 0 ? accent : '#fff',
                    border    : `2px solid ${accent}`,
                    zIndex    : 1,
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR), color: '#0f172a', overflowWrap: 'break-word' }}>{exp.title}</div>
                      {exp.company && <div style={{ color: accent, fontWeight: TYPE.weight.semibold, ...pt(TYPE.SIZE.BODY) }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>}
                    </div>
                    <div style={{ textAlign: 'right', ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <ul style={{ paddingLeft: '16px', marginTop: '5px' }}>
                    {(exp.bullets || []).filter(b => b.trim()).map((b, i) => (
                      <li key={i} className="resume-bullet-text" style={{ marginBottom: '3px', ...pt(TYPE.SIZE.BULLET), color: '#334155' }}>{b}</li>
                    ))}
                  </ul>
                  <span className="resume-entry-end" />
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <div className="resume-section-head" style={sHead}>Education</div>
            {education.map(edu => (
              <div key={edu.id} className="resume-entry" style={{ marginBottom: '10px', paddingLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR) }}>{edu.degree}</span>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#64748b' }}>{edu.endDate}</span>
                </div>
                <div style={{ color: '#475569', ...pt(TYPE.SIZE.BODY) }}>{edu.school}{edu.grade ? ` · ${edu.grade}` : ''}</div>
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="resume-section-compact">
            <div className="resume-section-head" style={sHead}>Skills</div>
            <div style={{ paddingLeft: '16px' }}>
              {skills.map(sk => (
                <div key={sk.id} style={{ marginBottom: '4px', ...pt(TYPE.SIZE.BODY) }}>
                  {sk.category && <span style={{ fontWeight: TYPE.weight.bold }}>{sk.category}: </span>}
                  <span style={{ color: '#334155' }}>{sk.items}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="resume-section-compact">
            <div className="resume-section-head" style={sHead}>Certifications</div>
            <div style={{ paddingLeft: '16px' }}>
              {certifications.map(cert => (
                <div key={cert.id} style={{ marginBottom: '4px', ...pt(TYPE.SIZE.BODY) }}>
                  <span style={{ fontWeight: TYPE.weight.semibold }}>{cert.name}</span>
                  {cert.issuer && <span style={{ color: '#475569' }}> — {cert.issuer}</span>}
                  {cert.date   && <span style={{ color: '#94a3b8' }}> ({cert.date})</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

// ─────────────────────────────────────────────────────────────────
//  Template 15 — Fresher First (FREE TIER)
//  Education → Projects → Experience — optimized for freshers
//  Skills shown as categorized tag-style chips
// ─────────────────────────────────────────────────────────────────
export const FresherFirst = React.memo(function FresherFirst({ data, settings }) {
  const { personal, experience, education, skills, certifications, projects, languages, hobbies } = data
  const accent = settings?.accentColor || '#0E9F6E'

  const sHead = {
    ...pt(TYPE.SIZE.SMALL),
    fontWeight   : TYPE.weight.black,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    color        : accent,
    borderBottom : `2px solid ${accent}`,
    paddingBottom: '4px',
    marginBottom : '12px',
    marginTop    : '20px',
  }

  return (
    <div style={{ fontFamily: TYPE.SANS, ...pt(TYPE.SIZE.BODY), minHeight: '100%', color: '#111827' }}>
      {/* Header */}
      <div style={{ padding: '32px 48px 20px', background: '#fff', borderBottom: `3px solid ${accent}` }}>
        <div style={{ ...pt(TYPE.SIZE.NAME), fontWeight: TYPE.weight.bold, color: '#0f172a', overflowWrap: 'break-word', wordBreak: 'break-word', marginBottom: '4px' }}>
          {personal.fullName || 'Your Full Name'}
        </div>
        {personal.jobTitle && (
          <div style={{ ...pt(TYPE.SIZE.TITLE), color: accent, fontWeight: TYPE.weight.semibold, marginBottom: '12px' }}>
            {personal.jobTitle}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 18px', ...pt(TYPE.SIZE.SMALL), color: '#475569', alignItems: 'center' }}>
          {personal.email    && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Mail    size={11} color={accent}/>{personal.email}</span>}
          {personal.phone    && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Phone   size={11} color={accent}/>{personal.phone}</span>}
          {personal.location && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><MapPin  size={11} color={accent}/>{personal.location}</span>}
          {personal.linkedin && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Linkedin size={11} color={accent}/>{personal.linkedin}</span>}
          {personal.website  && <span style={{ display:'flex', alignItems:'center', gap:'5px' }}><Globe   size={11} color={accent}/>{personal.website}</span>}
        </div>
      </div>

      <div style={{ padding: '20px 52px' }}>
        {personal.summary && (
          <div className="resume-entry" style={{ marginBottom: '4px' }}>
            <div className="resume-section-head" style={sHead}>About Me</div>
            <p style={{ ...pt(TYPE.SIZE.BODY), color: '#334155', lineHeight: TYPE.leading.relaxed }}>
              {personal.summary}
            </p>
            <span className="resume-entry-end" />
          </div>
        )}

        {/* EDUCATION FIRST — Fresher's strongest asset */}
        {education.length > 0 && (
          <div>
            <div className="resume-section-head" style={sHead}>Education</div>
            {education.map(edu => (
              <div key={edu.id} className="resume-entry" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR), color: '#0f172a' }}>{edu.degree}</div>
                    <div style={{ color: '#475569', ...pt(TYPE.SIZE.BODY) }}>{edu.school}{edu.location ? ` · ${edu.location}` : ''}{edu.grade ? ` · ${edu.grade}` : ''}</div>
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#64748b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {edu.startDate && edu.endDate ? `${edu.startDate} – ${edu.endDate}` : edu.endDate || edu.startDate}
                  </span>
                </div>
                {edu.achievements && <div style={{ ...pt(TYPE.SIZE.BULLET), color: '#64748b', marginTop: '3px' }}>{edu.achievements}</div>}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {/* SKILLS as chips — prominent for freshers */}
        {skills.length > 0 && (
          <div className="resume-section-compact">
            <div className="resume-section-head" style={sHead}>Technical Skills</div>
            {skills.map(sk => (
              <div key={sk.id} style={{ marginBottom: '8px' }}>
                {sk.category && (
                  <div style={{ ...pt(TYPE.SIZE.SMALL), fontWeight: TYPE.weight.bold, color: '#0f172a', marginBottom: '4px' }}>{sk.category}</div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 6px' }}>
                  {(sk.items || '').split(',').filter(Boolean).map((item, i) => (
                    <span key={i} style={{
                      ...pt(TYPE.SIZE.SMALL),
                      background   : `${accent}12`,
                      color        : accent,
                      border       : `1px solid ${accent}35`,
                      borderRadius : '20px',
                      padding      : '3px 10px',
                      fontWeight   : TYPE.weight.semibold,
                      whiteSpace   : 'nowrap',
                    }}>
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PROJECTS SECOND — Fresher's proof of work */}
        {projects.length > 0 && (
          <div>
            <div className="resume-section-head" style={sHead}>Projects</div>
            {projects.map(proj => (
              <div key={proj.id} className="resume-entry" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR), color: '#0f172a' }}>{proj.name}</span>
                  {proj.date && <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8' }}>{proj.date}</span>}
                </div>
                {proj.tech && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 5px', marginTop: '3px' }}>
                    {proj.tech.split(',').filter(Boolean).map((t, i) => (
                      <span key={i} style={{ ...pt(TYPE.SIZE.SMALL), background: '#f1f5f9', color: '#475569', borderRadius: '4px', padding: '1px 6px', fontWeight: TYPE.weight.semibold }}>{t.trim()}</span>
                    ))}
                  </div>
                )}
                {proj.description && <div style={{ ...pt(TYPE.SIZE.BODY), color: '#334155', marginTop: '4px', lineHeight: TYPE.leading.relaxed }}>{proj.description}</div>}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {/* EXPERIENCE last (internships, part-time, etc.) */}
        {experience.length > 0 && (
          <div>
            <div className="resume-section-head" style={sHead}>Work Experience</div>
            {experience.map(exp => (
              <div key={exp.id} className="resume-entry" style={{ marginBottom: `${TYPE.SPACE.ENTRY_BOTTOM}px` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontWeight: TYPE.weight.bold, ...pt(TYPE.SIZE.ENTRY_HDR), color: '#0f172a', overflowWrap: 'break-word' }}>{exp.title}</div>
                    {exp.company && <div style={{ color: '#475569', fontWeight: TYPE.weight.semibold, ...pt(TYPE.SIZE.BODY) }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>}
                  </div>
                  <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#64748b', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                    {exp.startDate}{exp.startDate && (exp.endDate || exp.current) ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <ul style={{ paddingLeft: '16px', marginTop: '4px' }}>
                  {(exp.bullets || []).filter(b => b.trim()).map((b, i) => (
                    <li key={i} className="resume-bullet-text" style={{ marginBottom: '3px', ...pt(TYPE.SIZE.BULLET), color: '#334155' }}>{b}</li>
                  ))}
                </ul>
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {certifications.length > 0 && (
          <div className="resume-section-compact">
            <div className="resume-section-head" style={sHead}>Certifications</div>
            {certifications.map(cert => (
              <div key={cert.id} style={{ marginBottom: '4px', ...pt(TYPE.SIZE.BODY) }}>
                <span style={{ fontWeight: TYPE.weight.semibold }}>{cert.name}</span>
                {cert.issuer && <span style={{ color: '#475569' }}> — {cert.issuer}</span>}
                {cert.date   && <span style={{ color: '#94a3b8' }}> ({cert.date})</span>}
              </div>
            ))}
          </div>
        )}

        {(languages || []).length > 0 && (
          <div className="resume-section-compact">
            <div className="resume-section-head" style={sHead}>Languages</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
              {languages.map(lang => (
                <span key={lang.id} style={{ ...pt(TYPE.SIZE.BODY) }}>
                  <strong>{lang.language}</strong> — <span style={{ color: '#475569' }}>{lang.proficiency}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {(hobbies || []).length > 0 && (
          <div className="resume-section-compact">
            <div className="resume-section-head" style={sHead}>Hobbies & Interests</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px' }}>
              {hobbies.map(hobby => (
                <span key={hobby.id} style={{ ...pt(TYPE.SIZE.BODY), color: '#334155' }}>• {hobby.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})
