/**
 * ATS CLASSIC — Premium Redesign v4.0
 * ─────────────────────────────────────────────────────────────
 * Single-column serif template.
 * Maximum ATS compatibility + award-winning typography.
 *
 * Design language:
 *   - Libre Baskerville serif for headings, Inter for body
 *   - Clean 8pt grid spatial system
 *   - Accent color used sparingly but purposefully
 *   - Section heads: all-caps + rule, stays with content
 */

import React from 'react'
import { Mail, Phone, MapPin, Linkedin, Globe, Github, Twitter } from 'lucide-react'
import { TYPE, pt, sectionStyle, bulletStyle } from './typography'

// ─── Shared sub-components ────────────────────────────────────

function ContactItem({ icon: Icon, text, href }) {
  if (!text?.trim()) return null
  const content = (
    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', ...pt(TYPE.SIZE.SMALL), color: '#475569' }}>
      <Icon size={10} style={{ flexShrink: 0, color: '#94a3b8' }} />
      <span style={{ wordBreak: 'break-all' }}>{text}</span>
    </span>
  )
  return href ? <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</a> : content
}

function SectionHead({ children, accent }) {
  return (
    <div className="resume-section-head" data-break-after="true" style={sectionStyle(accent, 'rule')}>
      {children}
    </div>
  )
}

function EntryHeader({ title, subtitle, location, dateStart, dateEnd, current }) {
  const dateStr = [dateStart, current ? 'Present' : dateEnd].filter(Boolean).join(' – ')
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '3px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a', fontFamily: TYPE.SERIF, lineHeight: TYPE.leading.snug, overflowWrap: 'break-word' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ ...pt(TYPE.SIZE.BODY), color: '#475569', fontWeight: TYPE.weight.medium, marginTop: '1px', fontFamily: TYPE.SANS }}>
            {subtitle}{location ? <span style={{ color: '#94a3b8' }}> · {location}</span> : ''}
          </div>
        )}
      </div>
      {dateStr && (
        <div style={{ ...pt(TYPE.SIZE.SMALL), color: '#64748b', whiteSpace: 'nowrap', fontFamily: TYPE.SANS, fontVariantNumeric: 'tabular-nums', paddingTop: '1px', flexShrink: 0 }}>
          {dateStr}
        </div>
      )}
    </div>
  )
}

// ─── Main Template ────────────────────────────────────────────

const ATSClassic = React.memo(function ATSClassic({ data, settings }) {
  const {
    personal = {},
    experience = [],
    education = [],
    skills = [],
    certifications = [],
    projects = [],
    languages = [],
    hobbies = [],
  } = data || {}

  const accent = settings?.accentColor || '#1A56DB'

  const hasSocial = personal.linkedin || personal.website
  const contactItems = [
    personal.email    && { icon: Mail,    text: personal.email,    href: `mailto:${personal.email}` },
    personal.phone    && { icon: Phone,   text: personal.phone,    href: null },
    personal.location && { icon: MapPin,  text: personal.location, href: null },
    personal.linkedin && { icon: Linkedin, text: personal.linkedin.replace(/^https?:\/\/(www\.)?/i, ''), href: personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}` },
    personal.website  && { icon: Globe,   text: personal.website.replace(/^https?:\/\/(www\.)?/i, ''),  href: personal.website.startsWith('http') ? personal.website : `https://${personal.website}` },
    personal.github   && { icon: Github,  text: personal.github.replace(/^https?:\/\/(www\.)?/i, ''),   href: personal.github.startsWith('http') ? personal.github : `https://${personal.github}` },
    personal.twitter  && { icon: Twitter, text: personal.twitter.replace(/^https?:\/\/(www\.)?/i, ''),  href: personal.twitter.startsWith('http') ? personal.twitter : `https://${personal.twitter}` },
  ].filter(Boolean)

  return (
    <div style={{
      fontFamily : TYPE.SANS,
      ...pt(TYPE.SIZE.BODY),
      minHeight  : '100%',
      color      : '#1e293b',
      background : '#ffffff',
    }}>
      {/* ── Header ──────────────────────────────────────────── */}
      <div style={{
        padding     : `${TYPE.SPACE.PAGE_TOP}px ${TYPE.SPACE.PAGE_SIDES}px 24px`,
        borderBottom: `2px solid ${accent}`,
        display     : 'flex',
        alignItems  : 'flex-start',
        gap         : '20px',
      }}>
        {/* Left: Name + Title + Contact */}
        <div style={{ flex: 1 }}>
          {/* Name */}
          <div style={{
            fontFamily   : TYPE.SERIF,
            fontSize     : `${(TYPE.SIZE.NAME * 1.5).toFixed(0)}px`,
            fontWeight   : TYPE.weight.bold,
            letterSpacing: TYPE.tracking.tight,
            color        : '#0f172a',
            lineHeight   : 1.05,
            marginBottom : '8px',
            overflowWrap : 'break-word',
            wordBreak    : 'break-word',
          }}>
            {personal.fullName || 'Your Full Name'}
          </div>

          {/* Job Title */}
          {personal.jobTitle && (
            <div style={{
              ...pt(TYPE.SIZE.TITLE),
              fontWeight   : TYPE.weight.semibold,
              color        : accent,
              letterSpacing: '0.01em',
              marginBottom : '14px',
              fontFamily   : TYPE.SANS,
            }}>
              {personal.jobTitle}
            </div>
          )}

          {/* Contact Row */}
          {contactItems.length > 0 && (
            <div style={{
              display   : 'flex',
              flexWrap  : 'wrap',
              gap       : '6px 20px',
              alignItems: 'center',
            }}>
              {contactItems.map((item, i) => (
                <ContactItem key={i} icon={item.icon} text={item.text} href={item.href} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Profile photo (if provided) */}
        {personal.photo && (
          <div style={{ flexShrink: 0 }}>
            <img
              src={personal.photo}
              alt={personal.fullName || 'Profile'}
              style={{
                width       : '72px',
                height      : '72px',
                objectFit   : 'cover',
                borderRadius: '6px',
                border      : `2px solid ${accent}30`,
                display     : 'block',
              }}
            />
          </div>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div style={{ padding: `16px ${TYPE.SPACE.PAGE_SIDES}px ${TYPE.SPACE.PAGE_SIDES}px` }}>

        {/* Professional Summary */}
        {personal.summary?.trim() && (
          <div className="resume-entry" style={{ marginBottom: `${TYPE.SPACE.AFTER_SECTION}px` }}>
            <SectionHead accent={accent}>Professional Summary</SectionHead>
            <div style={{
              ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed),
              color      : '#334155',
              margin     : 0,
              fontFamily : TYPE.SANS,
              borderLeft : `3px solid ${accent}`,
              paddingLeft: '12px',
              background : `${accent}05`,
              padding    : '10px 12px',
              borderRadius: '0 4px 4px 0'
            }}>
              {personal.summary}
            </div>
            <span className="resume-entry-end" />
          </div>
        )}

        {/* Work Experience */}
        {experience.length > 0 && (
          <div>
            <SectionHead accent={accent}>Work Experience</SectionHead>
            {experience.map((exp, idx) => (
              <div
                key={exp.id}
                className="resume-entry"
                style={{
                  marginBottom: idx < experience.length - 1 ? `${TYPE.SPACE.ENTRY_BOTTOM}px` : '4px',
                }}
              >
                <EntryHeader
                  title={exp.title}
                  subtitle={exp.company}
                  location={exp.location}
                  dateStart={exp.startDate}
                  dateEnd={exp.endDate}
                  current={exp.current}
                />
                {(exp.bullets || []).filter(b => b?.trim()).length > 0 && (
                  <ul style={{
                    paddingLeft : `${TYPE.SPACE.BULLET_INDENT}px`,
                    margin      : '5px 0 0',
                    listStyleType: 'disc',
                  }}>
                    {exp.bullets.filter(b => b?.trim()).map((b, i) => (
                      <li key={i} className="resume-bullet-text" style={bulletStyle()}>{b}</li>
                    ))}
                  </ul>
                )}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <SectionHead accent={accent}>Education</SectionHead>
            {education.map((edu, idx) => (
              <div
                key={edu.id}
                className="resume-entry"
                style={{ marginBottom: idx < education.length - 1 ? `${TYPE.SPACE.COMPACT_ENTRY}px` : '4px' }}
              >
                <EntryHeader
                  title={edu.degree}
                  subtitle={edu.school}
                  location={edu.location}
                  dateStart={edu.startDate}
                  dateEnd={edu.endDate}
                  current={false}
                />
                {(edu.grade || edu.achievements) && (
                  <div style={{ ...pt(TYPE.SIZE.BULLET), color: '#64748b', marginTop: '2px', fontFamily: TYPE.SANS }}>
                    {[edu.grade && `Grade: ${edu.grade}`, edu.achievements].filter(Boolean).join(' · ')}
                  </div>
                )}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <SectionHead accent={accent}>Projects</SectionHead>
            {projects.map((proj, idx) => (
              <div
                key={proj.id}
                className="resume-entry"
                style={{ marginBottom: idx < projects.length - 1 ? `${TYPE.SPACE.COMPACT_ENTRY}px` : '4px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ ...pt(TYPE.SIZE.ENTRY_HDR), fontWeight: TYPE.weight.bold, color: '#0f172a', fontFamily: TYPE.SERIF }}>
                      {proj.name}
                    </span>
                    {proj.tech && (
                      <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#64748b', marginLeft: '8px', fontFamily: TYPE.SANS }}>
                        {proj.tech}
                      </span>
                    )}
                  </div>
                  {proj.date && <span style={{ ...pt(TYPE.SIZE.SMALL), color: '#94a3b8', whiteSpace: 'nowrap', fontFamily: TYPE.SANS }}>{proj.date}</span>}
                </div>
                {proj.description && (
                  <p style={{ ...pt(TYPE.SIZE.BODY, TYPE.leading.relaxed), color: '#334155', marginTop: '3px' }}>{proj.description}</p>
                )}
                <span className="resume-entry-end" />
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="resume-section-compact">
            <SectionHead accent={accent}>Skills</SectionHead>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {skills.map(sk => (
                <div key={sk.id} style={{ ...pt(TYPE.SIZE.BODY), fontFamily: TYPE.SANS }}>
                  {sk.category && (
                    <span style={{ fontWeight: TYPE.weight.bold, color: '#0f172a' }}>{sk.category}: </span>
                  )}
                  <span style={{ color: '#334155' }}>{sk.items}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="resume-section-compact">
            <SectionHead accent={accent}>Certifications</SectionHead>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {certifications.map(cert => (
                <div key={cert.id} style={{ ...pt(TYPE.SIZE.BODY), fontFamily: TYPE.SANS }}>
                  <span style={{ fontWeight: TYPE.weight.semibold, color: '#0f172a' }}>{cert.name}</span>
                  {cert.issuer && <span style={{ color: '#475569' }}> · {cert.issuer}</span>}
                  {cert.date   && <span style={{ color: '#94a3b8' }}> ({cert.date})</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {(languages || []).length > 0 && (
          <div className="resume-section-compact">
            <SectionHead accent={accent}>Languages</SectionHead>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
              {languages.map(lang => (
                <span key={lang.id} style={{ ...pt(TYPE.SIZE.BODY), fontFamily: TYPE.SANS }}>
                  <strong style={{ color: '#0f172a', fontWeight: TYPE.weight.semibold }}>{lang.language}</strong>
                  {lang.proficiency && <span style={{ color: '#64748b' }}> — {lang.proficiency}</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Hobbies */}
        {(hobbies || []).filter(h => h?.name?.trim()).length > 0 && (
          <div className="resume-section-compact">
            <SectionHead accent={accent}>Interests</SectionHead>
            <div style={{ ...pt(TYPE.SIZE.BODY), color: '#475569', fontFamily: TYPE.SANS }}>
              {hobbies.filter(h => h?.name?.trim()).map(h => h.name).join(' · ')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
})

export default ATSClassic
