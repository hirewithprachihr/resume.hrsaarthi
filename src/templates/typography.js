/**
 * PREMIUM TYPOGRAPHY SYSTEM v4.0
 * ─────────────────────────────────────────────────────────────
 * Single source of truth for all resume template typography.
 * Every template MUST use these constants — never hardcode values.
 *
 * DESIGN PHILOSOPHY:
 *   - Resume text lives on physical A4 paper (210mm × 297mm = 794px × 1123px at 96dpi)
 *   - Print typesetting rules apply: 10–12pt body, 6–8pt captions, tight leading
 *   - "pt" in print = 1/72 inch. At 96dpi: 1pt = 1.333px
 *   - We use pt() to convert so templates feel like real print design
 */

// ─── Font Stacks ────────────────────────────────────────────
export const TYPE = {

  // Font families — paired for premium print quality
  SERIF: '"Libre Baskerville", "Georgia", "Times New Roman", serif',
  SANS : '"Inter", "Plus Jakarta Sans", "Helvetica Neue", Arial, sans-serif',
  MONO : '"JetBrains Mono", "Fira Code", "Courier New", monospace',

  // ── Type Scale (in pt — print units) ────────────────────
  SIZE: {
    NAME     : 22,   // Full name — large, commanding
    TITLE    : 11,   // Job title under name — medium weight
    SECTION  : 9.5,  // Section heading (EXPERIENCE, EDUCATION, etc.)
    ENTRY_HDR: 10.5, // Job title, degree title — bold
    BODY     : 9.5,  // Standard body text
    BULLET   : 9.5,  // Bullet point text
    SMALL    : 8.5,  // Dates, locations, captions, contact info
    MICRO    : 7.5,  // Tags, badges, fine print
  },

  // ── Font Weights ─────────────────────────────────────────
  weight: {
    light   : '300',
    regular : '400',
    medium  : '500',
    semibold: '600',
    bold    : '700',
    black   : '900',
  },

  // ── Letter Spacing ───────────────────────────────────────
  tracking: {
    tight  : '-0.02em',
    normal : '0',
    wide   : '0.05em',
    wider  : '0.08em',
    widest : '0.15em',
    caps   : '0.2em',  // Small caps / section labels
  },

  // ── Line Heights ─────────────────────────────────────────
  leading: {
    tight  : 1.2,
    snug   : 1.35,
    normal : 1.45,
    relaxed: 1.6,
    loose  : 1.75,
  },

  // ── Spacing Constants (px) ───────────────────────────────
  SPACE: {
    PAGE_TOP      : 36,  // Padding from top of page to first content
    PAGE_SIDES    : 44,  // Left/right page margin
    PAGE_SIDES_SM : 32,  // Tighter side margin for two-column layouts
    SECTION_BOTTOM: 6,   // Space between section head rule and first entry
    ENTRY_BOTTOM  : 14,  // Space between consecutive experience entries
    AFTER_SECTION : 20,  // Space after entire section block before next
    COMPACT_ENTRY : 8,   // Compact entries (certs, skills, languages)
    BULLET_INDENT : 14,  // Left indent for bullet lists
    BULLET_SPACING: 3,   // Space between consecutive bullets
  },
}

// ─── pt() — Convert print points to CSS pixel string ────────
/**
 * Converts point sizes to browser-renderable font-size in pixels.
 * 1pt = 1.333px at 96dpi (standard browser resolution).
 *
 * Usage: style={{ ...pt(TYPE.SIZE.BODY) }}
 *        → { fontSize: '12.7px', lineHeight: 1.45 }
 */
export function pt(pts, lineHeight = TYPE.leading.normal) {
  return {
    fontSize  : `${(pts * 1.333).toFixed(1)}px`,
    lineHeight: lineHeight,
  }
}

// ─── Section Heading Styles ──────────────────────────────────
/**
 * Generate consistent section heading styles.
 * @param {string} accent - CSS color value
 * @param {'rule'|'bar'|'dot'|'line'|'caps'} variant - visual style
 */
export function sectionStyle(accent, variant = 'rule') {
  const base = {
    ...pt(TYPE.SIZE.SECTION),
    fontWeight   : TYPE.weight.bold,
    textTransform: 'uppercase',
    letterSpacing: TYPE.tracking.caps,
    marginBottom : `${TYPE.SPACE.SECTION_BOTTOM}px`,
    marginTop    : `${TYPE.SPACE.AFTER_SECTION}px`,
    color        : '#0f172a',
    display      : 'block',
  }

  const variants = {
    rule: {  // Bottom border only — clean ATS
      ...base,
      borderBottom: `1.5px solid ${accent}`,
      paddingBottom: '4px',
      color: accent,
    },
    bar: {   // Left thick bar — modern two-column
      ...base,
      borderLeft  : `3px solid ${accent}`,
      paddingLeft : '10px',
    },
    caps: {  // All caps with subtle underline — luxury
      ...base,
      color        : '#1e293b',
      borderBottom : '1px solid #e2e8f0',
      paddingBottom: '5px',
      letterSpacing: TYPE.tracking.caps,
    },
    dot: {   // Dot prefix — minimal
      ...base,
      color: '#1e293b',
    },
    inverse: { // White text on dark — for dark headerss
      ...base,
      color        : '#ffffff',
      letterSpacing: TYPE.tracking.caps,
      opacity      : 0.7,
    },
  }

  return variants[variant] || variants.rule
}

// ─── Contact Item Helper ─────────────────────────────────────
export function contactItemStyle(accent) {
  return {
    display    : 'flex',
    alignItems : 'center',
    gap        : '5px',
    ...pt(TYPE.SIZE.SMALL),
    color      : '#64748b',
    flexShrink : 0,
  }
}

// ─── Bullet Point Helper ─────────────────────────────────────
export function bulletStyle() {
  return {
    ...pt(TYPE.SIZE.BULLET, TYPE.leading.relaxed),
    color      : '#334155',
    marginBottom: `${TYPE.SPACE.BULLET_SPACING}px`,
    paddingLeft : '2px',
  }
}
