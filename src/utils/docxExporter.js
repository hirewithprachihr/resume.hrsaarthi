import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx'
import { saveAs } from 'file-saver'

/**
 * HR Saarthi DOCX Exporter v2.0
 * Full-featured MS Word export with all 8 resume sections.
 *
 * @param {object} data     - Resume data (personal, experience, education, skills, ...)
 * @param {object} settings - Template settings (accentColor, sectionOrder)
 */
export const exportToDocx = async (data, settings) => {
  const {
    personal = {},
    experience = [],
    education = [],
    skills = [],
    certifications = [],
    projects = [],
    languages = [],
    hobbies = [],
  } = data

  const order = settings?.sectionOrder || [
    'summary', 'experience', 'education', 'skills',
    'projects', 'certifications', 'languages', 'hobbies',
  ]

  // ── Accent color (strip # for docx) ─────────────────────────────
  const accent = (settings?.accentColor || '#1A56DB').replace('#', '')

  // ── Helper: section header ───────────────────────────────────────
  const sectionHeader = (text) => new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        color: accent,
        font: 'Calibri',
      }),
    ],
    border: {
      bottom: { style: BorderStyle.SINGLE, color: 'E2E8F0', size: 6, space: 4 },
    },
    spacing: { before: 280, after: 120 },
  })

  // ── Helper: entry date line ──────────────────────────────────────
  const dateLine = (text) => new Paragraph({
    children: [new TextRun({ text, size: 18, color: '64748B', italics: true, font: 'Calibri' })],
    spacing: { after: 60 },
  })

  // ── Helper: bullet point ─────────────────────────────────────────
  const bullet = (text) => new Paragraph({
    text,
    bullet: { level: 0 },
    spacing: { after: 60 },
    style: 'ListParagraph',
  })

  // ── Helper: regular paragraph ───────────────────────────────────
  const para = (text, opts = {}) => new Paragraph({
    children: [new TextRun({ text, size: 20, font: 'Calibri', ...opts })],
    spacing: { after: opts.spaceAfter ?? 100 },
  })

  const children = []

  // ─────────────────────────────────────────────────────────────────
  // 1. HEADER — Name + Title + Contact
  // ─────────────────────────────────────────────────────────────────
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: personal.fullName || 'Your Name',
          bold: true,
          size: 40,
          font: 'Calibri',
          color: '0F172A',
        }),
      ],
    }),
  )

  if (personal.jobTitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
        children: [
          new TextRun({
            text: personal.jobTitle,
            bold: true,
            size: 24,
            color: accent,
            font: 'Calibri',
          }),
        ],
      }),
    )
  }

  // Contact line: email | phone | location
  const contactParts = [personal.email, personal.phone, personal.location].filter(Boolean)
  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({ text: contactParts.join('  |  '), size: 18, font: 'Calibri', color: '334155' }),
        ],
      }),
    )
  }

  // Social links line: LinkedIn | GitHub | Portfolio | Twitter
  const socialParts = [
    personal.linkedin && `LinkedIn: ${personal.linkedin}`,
    personal.github   && `GitHub: ${personal.github}`,
    personal.website  && `Portfolio: ${personal.website}`,
    personal.twitter  && `Twitter: ${personal.twitter}`,
  ].filter(Boolean)
  if (socialParts.length > 0) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({ text: socialParts.join('  |  '), size: 18, font: 'Calibri', color: '334155' }),
        ],
      }),
    )
  }

  // ─────────────────────────────────────────────────────────────────
  // 2. SECTIONS — rendered in sectionOrder
  // ─────────────────────────────────────────────────────────────────
  order.forEach(id => {

    // ── Summary ────────────────────────────────────────────────────
    if (id === 'summary' && personal.summary?.trim()) {
      children.push(sectionHeader('Professional Summary'))
      children.push(para(personal.summary, { spaceAfter: 200 }))
    }

    // ── Experience ─────────────────────────────────────────────────
    else if (id === 'experience' && experience.length > 0) {
      children.push(sectionHeader('Work Experience'))
      experience.forEach(exp => {
        // Title — Company · Location
        const titleText = [exp.title, exp.company].filter(Boolean).join(' — ')
        const locText   = [exp.location].filter(Boolean).join('')
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: titleText, bold: true, size: 22, font: 'Calibri', color: '0F172A' }),
              locText ? new TextRun({ text: `  ·  ${locText}`, size: 20, font: 'Calibri', color: '64748B' }) : new TextRun(''),
            ],
            spacing: { after: 60 },
          }),
        )
        // Date range
        const dates = [exp.startDate, exp.current ? 'Present' : exp.endDate].filter(Boolean).join(' – ')
        if (dates) children.push(dateLine(dates))
        // Bullets
        ;(exp.bullets || []).filter(b => b?.trim()).forEach(b => children.push(bullet(b)))
        children.push(new Paragraph({ spacing: { after: 160 } }))
      })
    }

    // ── Education ──────────────────────────────────────────────────
    else if (id === 'education' && education.length > 0) {
      children.push(sectionHeader('Education'))
      education.forEach(edu => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: edu.degree || '', bold: true, size: 22, font: 'Calibri', color: '0F172A' }),
            ],
            spacing: { after: 60 },
          }),
        )
        const schoolLine = [edu.school, edu.location].filter(Boolean).join(', ')
        const gradeLine  = [edu.startDate, edu.endDate].filter(Boolean).join(' – ')
        const edLine     = [schoolLine, gradeLine, edu.grade].filter(Boolean).join('  |  ')
        if (edLine) children.push(dateLine(edLine))
        children.push(new Paragraph({ spacing: { after: 120 } }))
      })
    }

    // ── Skills ─────────────────────────────────────────────────────
    else if (id === 'skills' && skills.length > 0) {
      children.push(sectionHeader('Skills'))
      skills.forEach(sk => {
        children.push(
          new Paragraph({
            spacing: { after: 80 },
            children: [
              new TextRun({ text: sk.category ? `${sk.category}: ` : '', bold: true, size: 20, font: 'Calibri' }),
              new TextRun({ text: sk.items || '', size: 20, font: 'Calibri', color: '334155' }),
            ],
          }),
        )
      })
      children.push(new Paragraph({ spacing: { after: 100 } }))
    }

    // ── Projects ───────────────────────────────────────────────────
    else if (id === 'projects' && projects.length > 0) {
      children.push(sectionHeader('Projects'))
      projects.forEach(proj => {
        const headerParts = [proj.name, proj.tech ? `(${proj.tech})` : ''].filter(Boolean).join(' ')
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: headerParts, bold: true, size: 22, font: 'Calibri', color: '0F172A' }),
            ],
            spacing: { after: 60 },
          }),
        )
        if (proj.link) children.push(dateLine(proj.link))
        if (proj.description?.trim()) children.push(para(proj.description, { spaceAfter: 160 }))
        else children.push(new Paragraph({ spacing: { after: 120 } }))
      })
    }

    // ── Certifications ─────────────────────────────────────────────
    else if (id === 'certifications' && certifications.length > 0) {
      children.push(sectionHeader('Certifications'))
      certifications.forEach(cert => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: cert.name || '', bold: true, size: 22, font: 'Calibri', color: '0F172A' }),
            ],
            spacing: { after: 60 },
          }),
        )
        const certLine = [cert.issuer, cert.date].filter(Boolean).join('  ·  ')
        if (certLine) children.push(dateLine(certLine))
        children.push(new Paragraph({ spacing: { after: 100 } }))
      })
    }

    // ── Languages ──────────────────────────────────────────────────
    else if (id === 'languages' && languages.length > 0) {
      children.push(sectionHeader('Languages'))
      const langText = languages
        .map(l => [l.language, l.proficiency].filter(Boolean).join(' — '))
        .filter(Boolean)
        .join('  ·  ')
      if (langText) children.push(para(langText, { spaceAfter: 160 }))
    }

    // ── Hobbies ────────────────────────────────────────────────────
    else if (id === 'hobbies' && hobbies.length > 0) {
      children.push(sectionHeader('Interests'))
      const hobbyText = Array.isArray(hobbies)
        ? hobbies.map(h => h?.name || h || '').filter(Boolean).join(', ')
        : String(hobbies)
      if (hobbyText) children.push(para(hobbyText, { spaceAfter: 160 }))
    }
  })

  // ─────────────────────────────────────────────────────────────────
  // 3. BUILD & SAVE
  // ─────────────────────────────────────────────────────────────────
  const doc = new Document({
    creator : 'HR Saarthi Resume Builder',
    title   : `${personal.fullName || 'Resume'} — Resume`,
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 900, bottom: 720, left: 900 }, // ~1.27cm margins (Word default)
        },
      },
      children,
    }],
  })

  const blob = await Packer.toBlob(doc)
  const safeName = (personal.fullName || 'Resume').replace(/[^a-z0-9]/gi, '_')
  saveAs(blob, `${safeName}_Resume.docx`)
}
