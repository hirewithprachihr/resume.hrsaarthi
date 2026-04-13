/**
 * CLClassic — Classic Cover Letter Template
 * Matches the ATS Classic resume template style.
 * Clean, professional, traditional layout.
 */
import React from 'react'

export default function CLClassic({ data = {} }) {
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
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        fontSize: '10.5pt',
        lineHeight: 1.6,
        color: '#1a1a1a',
        padding: '48px 56px',
        minHeight: '297mm',
        width: '210mm',
        boxSizing: 'border-box',
      }}
    >
      {/* Header — Candidate Info */}
      <div style={{ borderBottom: `2px solid ${accentColor}`, paddingBottom: '16px', marginBottom: '24px' }}>
        <div style={{ fontSize: '20pt', fontWeight: '800', color: '#0f0f0f', letterSpacing: '-0.5px', marginBottom: '6px' }}>
          {candidateName || 'Your Name'}
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '9pt', color: '#6b7280' }}>
          {candidateEmail && <span>{candidateEmail}</span>}
          {candidatePhone && <span>· {candidatePhone}</span>}
          {candidateLocation && <span>· {candidateLocation}</span>}
        </div>
      </div>

      {/* Date */}
      <div style={{ marginBottom: '20px', fontSize: '10pt', color: '#374151' }}>
        {date}
      </div>

      {/* Recipient block */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontWeight: '700', color: '#111827' }}>{recipientName}</div>
        {company && <div style={{ color: '#374151' }}>{company}</div>}
        {jobTitle && <div style={{ color: '#6b7280', fontSize: '10pt' }}>Re: {jobTitle} Position</div>}
      </div>

      {/* Greeting */}
      <div style={{ marginBottom: '18px', fontWeight: '600' }}>
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
          <div style={{ whiteSpace: 'pre-wrap', color: '#374151', lineHeight: 1.75 }}>
            {letter || '[Your cover letter will appear here after generation]'}
          </div>
        )}
      </div>

      {/* Sign-off */}
      <div style={{ marginTop: '32px' }}>
        <div style={{ marginBottom: '40px', color: '#374151' }}>
          Warm regards,
        </div>
        <div style={{ fontWeight: '700', color: '#111827', fontSize: '11pt' }}>
          {candidateName || 'Your Name'}
        </div>
        {candidateEmail && (
          <div style={{ fontSize: '9pt', color: '#6b7280', marginTop: '4px' }}>{candidateEmail}</div>
        )}
      </div>
    </div>
  )
}
