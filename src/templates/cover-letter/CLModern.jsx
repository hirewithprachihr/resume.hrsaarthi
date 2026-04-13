/**
 * CLModern — Modern Cover Letter Template
 * Sidebar accent, bold header, contemporary design.
 */
import React from 'react'

export default function CLModern({ data = {} }) {
  const {
    candidateName = '',
    candidateEmail = '',
    candidatePhone = '',
    candidateLocation = '',
    date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    recipientName = 'Hiring Manager',
    company = '',
    jobTitle = '',
    letter = '',
    accentColor = '#1A56DB',
    isEditing = false,
    onLetterChange = () => {},
  } = data

  return (
    <div
      className="bg-white"
      style={{
        fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif',
        fontSize: '10.5pt',
        lineHeight: 1.6,
        color: '#1a1a1a',
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box',
        display: 'flex',
      }}
    >
      {/* Left accent sidebar */}
      <div style={{
        width: '6px',
        background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}88)`,
        flexShrink: 0,
      }} />

      {/* Main content */}
      <div style={{ flex: 1, padding: '48px 52px' }}>
        {/* Header */}
        <div style={{
          background: `${accentColor}08`,
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}>
          <div>
            <div style={{ fontSize: '22pt', fontWeight: '800', color: '#0f0f0f', letterSpacing: '-0.5px', marginBottom: '6px' }}>
              {candidateName || 'Your Name'}
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '9pt', color: '#6b7280' }}>
              {candidateEmail && <span>✉ {candidateEmail}</span>}
              {candidatePhone && <span>📱 {candidatePhone}</span>}
              {candidateLocation && <span>📍 {candidateLocation}</span>}
            </div>
          </div>
          {/* Date badge */}
          <div style={{
            background: accentColor,
            color: 'white',
            fontSize: '9pt',
            fontWeight: '700',
            padding: '6px 12px',
            borderRadius: '20px',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}>
            {date}
          </div>
        </div>

        {/* Recipient + Job info */}
        <div style={{
          marginBottom: '24px',
          padding: '16px',
          borderLeft: `3px solid ${accentColor}`,
          background: '#fafafa',
          borderRadius: '0 8px 8px 0',
        }}>
          <div style={{ fontWeight: '700', color: '#111827', fontSize: '11pt' }}>{recipientName}</div>
          {company && <div style={{ color: '#374151', marginTop: '2px' }}>{company}</div>}
          {jobTitle && (
            <div style={{
              marginTop: '8px',
              display: 'inline-block',
              background: `${accentColor}15`,
              color: accentColor,
              fontSize: '9pt',
              fontWeight: '700',
              padding: '3px 10px',
              borderRadius: '12px',
            }}>
              RE: {jobTitle}
            </div>
          )}
        </div>

        {/* Greeting */}
        <div style={{ marginBottom: '18px', fontWeight: '600', color: '#111827' }}>
          Dear {recipientName},
        </div>

        {/* Letter body */}
        <div style={{ position: 'relative' }}>
          {isEditing ? (
            <textarea
              value={letter}
              onChange={(e) => onLetterChange(e.target.value)}
              placeholder=""
              className="w-full bg-transparent border-none focus:ring-0 p-0 resize-none overflow-hidden"
              style={{
                fontFamily: 'inherit',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                color: '#374151',
                minHeight: '400px',
                width: '100%',
                outline: 'none',
                whiteSpace: 'pre-wrap',
              }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
          ) : (
            <div style={{ whiteSpace: 'pre-wrap', color: '#374151', lineHeight: 1.8 }}>
              {letter || '[Your cover letter will appear here after generation]'}
            </div>
          )}
        </div>

        {/* Sign-off */}
        <div style={{ marginTop: '36px' }}>
          <div style={{ marginBottom: '32px', color: '#374151', fontStyle: 'italic' }}>
            With warm regards,
          </div>
          <div style={{
            display: 'inline-block',
            borderTop: `2px solid ${accentColor}`,
            paddingTop: '12px',
            minWidth: '180px',
          }}>
            <div style={{ fontWeight: '800', color: '#111827', fontSize: '12pt' }}>
              {candidateName || 'Your Name'}
            </div>
            {candidateEmail && (
              <div style={{ fontSize: '9pt', color: '#6b7280', marginTop: '3px' }}>{candidateEmail}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
