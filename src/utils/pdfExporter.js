/**
 * PREMIUM PDF EXPORTER v4.0 — Smart Page Break Engine
 * ─────────────────────────────────────────────────────────────────
 *
 * ROOT CAUSE OF THE SPLIT-TEXT BUG (fixed here):
 *   The old algorithm searched only 160px BEFORE and 48px AFTER the
 *   mathematical boundary. For dense resumes, the nearest "safe break"
 *   (gap between entries) can be much further away — so the engine fell
 *   back to a hard pixel cut that sliced through a line of text.
 *
 * FIX — Three-tier waterfall break strategy:
 *   Tier 1 — Entry bottom (between two .resume-entry blocks) — widest search
 *   Tier 2 — Section bottom (.resume-section-compact end) — medium search
 *   Tier 3 — Line bottom (any P/LI/DIV that is block-level) — narrow search
 *   Fallback — Snap to closest blank-line gap found anywhere on the page
 *   Last resort — Hard cut, but add PAGE_SAFETY_MARGIN blank space above slice
 *
 * ADDITIONALLY:
 *   - 3× SCALE for print-crisp output
 *   - warmFonts() pre-loads all 4 font families before capture
 *   - forceFontRender probes all families for browser font-cache warm-up
 */

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

const A4_W_PX = 794
const A4_H_PX = 1123
const A4_W_MM = 210
const A4_H_MM = 297

/** 3× render scale for professional-grade crispness */
const SCALE = 3

/**
 * Editorial top-margin added to page 2+ slices (aligns with builder page-break guide).
 */
const PAGE2_TOP_MARGIN = 56

/**
 * Bottom safety buffer for page 1.
 */
const PAGE1_BOTTOM_MARGIN = 56

/** Uniform margin (mm) inset for PDF pages — keeps content off the physical edge. */
const PDF_MARGIN_MM = 8

/**
 * Blank guard margin above a hard-cut fallback page.
 * Ensures text is never flush at the very top of a slice.
 */
const PAGE_SAFETY_MARGIN = 36

// ─── Search radii per tier (1× DOM pixel space) ───────────────
// Candidates from getBoundingClientRect() are 1× DOM pixels.
// idealY = page * A4_H_PX is also 1×. Thresholds must match.
const TIER1_BEFORE = 220   // scan 220px before ideal page break
const TIER1_AFTER  =  60   // and 60px after
const TIER2_BEFORE = 140
const TIER2_AFTER  =  40
const TIER3_BEFORE =  80
const TIER3_AFTER  =  20

// ─── Main Export ──────────────────────────────────────────────

/**
 * Export the resume to a multi-page PDF.
 * @param {object}   resumeData
 * @param {object}   settings
 * @param {Function} templateComponent
 * @param {string}   [filename]
 */
/**
 * Add a diagonal watermark to every page of an in-progress jsPDF document.
 * Called ONLY for free-tier users.
 * @param {jsPDF} pdf
 * @param {number} pageCount
 */
function addWatermark(pdf, pageCount) {
  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i)
    pdf.saveGraphicsState()
    pdf.setTextColor(180, 180, 180)  // Light gray
    pdf.setFontSize(28)
    pdf.setFont('helvetica', 'bold')
    // Two passes for better visibility
    pdf.text(
      'resume.hrsaarthi.com',
      105, 180,
      { angle: 45, align: 'center' }
    )
    pdf.setFontSize(22)
    pdf.setTextColor(210, 210, 210)
    pdf.text(
      'resume.hrsaarthi.com',
      105, 100,
      { angle: 45, align: 'center' }
    )
    pdf.restoreGraphicsState()
  }
}

/**
 * Export the resume to a multi-page PDF.
 * @param {object}   resumeData
 * @param {object}   settings
 * @param {Function} templateComponent
 * @param {string}   [filename]
 * @param {boolean}  [isPro=false] — if false (free tier), a watermark is added
 */
export async function exportToPDF(resumeData, settings, templateComponent, filename = 'resume', isPro = false) {
  const container = document.createElement('div')
  container.className = 'resume-export-root'
  container.style.cssText = [
    'position:fixed',
    'left:-9999px',
    'top:0',
    `width:${A4_W_PX}px`,
    'background:white',
    'z-index:-9999',
    'visibility:hidden',
    'overflow:visible',
    '-webkit-print-color-adjust:exact',
    'print-color-adjust:exact',
  ].join(';')
  document.body.appendChild(container)

  let root = null

  try {
    // ── Mount React template ──
    const { createRoot } = await import('react-dom/client')
    const { createElement } = await import('react')
    root = createRoot(container)

    await new Promise(resolve => {
      root.render(
        createElement(
          'div',
          {
            className: 'resume-a4 bg-white',
            style: { boxSizing: 'border-box', overflow: 'visible', width: `${A4_W_PX}px` },
          },
          createElement(templateComponent, { data: resumeData, settings }),
        ),
      )
      requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))
    })

    // ── Font loading ──
    await document.fonts.ready
    await warmFonts()
    await delay(400)

    forceFontRender(container)

    await delay(150)
    await new Promise(r => requestAnimationFrame(r))

    // ── Measure ──
    const totalHeight = container.scrollHeight
    const totalPages  = Math.ceil(totalHeight / A4_H_PX)

    // ── Smart page break analysis ──
    const breakPoints = findSmartBreaks(container, totalPages, totalHeight)

    // ── html2canvas full capture ──
    container.style.visibility = 'visible'
    container.style.left = '-9999px'

    const fullCanvas = await html2canvas(container, {
      scale           : SCALE,
      useCORS         : true,
      allowTaint      : false,
      backgroundColor : '#ffffff',
      width           : A4_W_PX,
      height          : totalHeight,
      scrollX         : 0,
      scrollY         : 0,
      windowWidth     : A4_W_PX,
      windowHeight    : totalHeight,
      logging         : false,
      imageTimeout    : 25000,
      removeContainer : false,
      onclone: (doc) => {
        const el = doc.body.querySelector('.resume-export-root') || doc.body.querySelector('div')
        if (el) {
          el.style.visibility = 'visible'
          el.style.overflow = 'visible'
          el.style.overflowX = 'visible'
        }
      },
    })

    container.style.visibility = 'hidden'

    // ── Build PDF ──
    const pdf = new jsPDF({
      orientation : 'portrait',
      unit        : 'mm',
      format      : 'a4',
      compress    : true,
    })

    // ── Pre-detect Sidebar Color & Width ──
    const sidebarEl = container.querySelector('[data-is-sidebar="true"]')
    let sidebarWidthPx = 0
    let sidebarColor   = '#ffffff'
    if (sidebarEl) {
      const rect = sidebarEl.getBoundingClientRect()
      sidebarWidthPx = rect.width
      sidebarColor   = window.getComputedStyle(sidebarEl).backgroundColor
    }

    for (let p = 0; p < totalPages; p++) {
      const sliceTopPx    = breakPoints[p]
      const sliceBottomPx = breakPoints[p + 1] !== undefined ? breakPoints[p + 1] : totalHeight

      const topMargin      = p > 0 ? PAGE2_TOP_MARGIN : 0
      const bottomReserve  = p === 0 ? PAGE1_BOTTOM_MARGIN : 0
      const sliceHeightPx  = Math.min(
        sliceBottomPx - sliceTopPx,
        A4_H_PX - topMargin - bottomReserve
      )

      const pageCanvas = document.createElement('canvas')
      pageCanvas.width  = A4_W_PX * SCALE
      pageCanvas.height = A4_H_PX * SCALE

      const pageCtx = pageCanvas.getContext('2d')
      
      // 1. Fill base page (White for main, Sidebar color for side)
      pageCtx.fillStyle = '#ffffff'
      pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height)
      
      if (sidebarWidthPx > 0) {
        pageCtx.fillStyle = sidebarColor
        pageCtx.fillRect(0, 0, sidebarWidthPx * SCALE, pageCanvas.height)
      }

      // 2. Draw the content slice
      pageCtx.drawImage(
        fullCanvas,
        0,
        sliceTopPx * SCALE,
        A4_W_PX * SCALE,
        sliceHeightPx * SCALE,
        0,
        topMargin * SCALE,
        A4_W_PX * SCALE,
        sliceHeightPx * SCALE,
      )

      // ── Page 2+ Premium Header (Runner) ──
      if (p > 0) {
        // Runner background extension (optional, ensures no weird edges)
        pageCtx.fillStyle = sidebarColor
        pageCtx.fillRect(0, 0, sidebarWidthPx * SCALE, topMargin * SCALE)

        const isDarkSidebar = isColorDark(sidebarColor)

        pageCtx.fillStyle = isDarkSidebar ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)'
        pageCtx.font = `${8 * SCALE}px "Inter", sans-serif`
        
        pageCtx.textAlign = 'left'
        const nameLabel = (resumeData.personal.fullName || 'RESUME').toUpperCase()
        pageCtx.fillText(nameLabel, 48 * SCALE, 28 * SCALE)

        pageCtx.textAlign = 'right'
        pageCtx.fillText(`PAGE ${p + 1} OF ${totalPages}`, (A4_W_PX - 48) * SCALE, 28 * SCALE)
        
        // Faint separator line
        pageCtx.strokeStyle = isDarkSidebar ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
        pageCtx.lineWidth = 0.5 * SCALE
        pageCtx.beginPath()
        pageCtx.moveTo(48 * SCALE, 34 * SCALE)
        pageCtx.lineTo((A4_W_PX - 48) * SCALE, 34 * SCALE)
        pageCtx.stroke()
      }

      if (p > 0) pdf.addPage()

      const imgData = pageCanvas.toDataURL('image/png')
      const innerW = A4_W_MM - 2 * PDF_MARGIN_MM
      const innerH = A4_H_MM - 2 * PDF_MARGIN_MM
      const scaleFit = Math.min(innerW / A4_W_MM, innerH / A4_H_MM)
      const drawW = A4_W_MM * scaleFit
      const drawH = A4_H_MM * scaleFit
      const x = PDF_MARGIN_MM + (innerW - drawW) / 2
      const y = PDF_MARGIN_MM + (innerH - drawH) / 2

      pdf.addImage(imgData, 'PNG', x, y, drawW, drawH, undefined, 'FAST')
    }

    // Watermark for free-tier users
    if (!isPro) {
      addWatermark(pdf, totalPages)
    }

    const safeName = (filename || 'resume').replace(/[^a-z0-9_\-]/gi, '_').toLowerCase()
    pdf.save(`${safeName}_resume.pdf`)

    return { success: true, pages: totalPages }

  } finally {
    if (root) { try { root.unmount() } catch (_) {} }
    if (container.parentNode) document.body.removeChild(container)
  }
}


// ─── Smart Page Break Engine ─────────────────────────────────

/**
 * Three-tier waterfall page break algorithm.
 * Returns an array of Y positions (un-scaled px) marking where each page starts.
 */
function findSmartBreaks(container, totalPages, totalHeight) {
  if (totalPages <= 1) return [0]

  // Pre-collect all candidate sets
  const tier1 = collectTierCandidates(container, [
    '.resume-entry',
    '.resume-section-compact',
  ])

  const tier2 = collectTierCandidates(container, [
    '.resume-section-head',
    '[data-break-after]',
  ])

  const tier3 = collectLineCandidates(container)

  const breaks = [0]

  for (let page = 1; page < totalPages; page++) {
    const idealY = page * A4_H_PX

    // Tier 1 — entry/section boundaries — wide radius
    let found = findBestCandidate(tier1, idealY, TIER1_BEFORE, TIER1_AFTER)
    if (found !== null) { breaks.push(found); continue }

    // Tier 2 — section heads and explicit break-after markers
    found = findBestCandidate(tier2, idealY, TIER2_BEFORE, TIER2_AFTER)
    if (found !== null) { breaks.push(found); continue }

    // Tier 3 — individual line bottoms — narrow radius
    found = findBestCandidate(tier3, idealY, TIER3_BEFORE, TIER3_AFTER)
    if (found !== null) { breaks.push(found); continue }

    // Fallback — find the nearest blank gap in any direction
    found = findNearestGap(tier1, tier3, idealY, totalHeight)
    if (found !== null) { breaks.push(found); continue }

    // Last resort — hard cut with safety margin to avoid text at very top
    breaks.push(Math.max(0, idealY - PAGE_SAFETY_MARGIN))
  }

  return breaks
}

/**
 * Find the best candidate closest to idealY within [idealY-before, idealY+after].
 * Prefers candidates BEFORE idealY (no content cut) over those AFTER.
 */
function findBestCandidate(candidates, idealY, before, after) {
  const inRange = candidates.filter(y => y >= idealY - before && y <= idealY + after)
  if (!inRange.length) return null

  // Prefer candidates before the ideal boundary (content doesn't get cut)
  const before_ = inRange.filter(y => y <= idealY)
  const pool     = before_.length ? before_ : inRange

  // Pick the one closest to idealY
  pool.sort((a, b) => Math.abs(a - idealY) - Math.abs(b - idealY))
  // Add 8px breathing room after the element ends
  return Math.round(pool[0] + 8)
}

/**
 * Extend search radius until we find any gap.
 */
function findNearestGap(tier1, tier3, idealY, totalHeight) {
  const all = [...tier1, ...tier3].sort((a, b) => a - b)
  if (!all.length) return null

  // Find the pair of consecutive candidates that straddle idealY
  for (let i = 0; i < all.length - 1; i++) {
    if (all[i] <= idealY && all[i + 1] >= idealY) {
      // Break at the one closest to idealY but not past it
      const before = all[i]
      const after  = all[i + 1]
      const chosen = (idealY - before) <= (after - idealY) ? before : after
      return Math.round(chosen + 6)
    }
  }
  return null
}

/**
 * Collect bottom-edge Y positions for a set of CSS selectors.
 */
function collectTierCandidates(container, selectors) {
  const els = container.querySelectorAll(selectors.join(','))
  const containerTop = container.getBoundingClientRect().top
  const ys = []
  els.forEach(el => {
    const bottom = el.getBoundingClientRect().bottom - containerTop
    if (bottom > 0) ys.push(bottom)
  })
  ys.sort((a, b) => a - b)
  return ys.filter((y, i) => i === 0 || y - ys[i - 1] > 4)
}

/**
 * Collect the bottom of every line-level block element.
 * Used as tier-3 fine resolution.
 */
function collectLineCandidates(container) {
  const els = container.querySelectorAll('p, li, div, span')
  const containerTop = container.getBoundingClientRect().top
  const ys = []
  const seen = new Set()

  els.forEach(el => {
    // Skip containers (only want leaf-ish elements)
    const style = window.getComputedStyle(el)
    if (style.display === 'flex' || style.display === 'grid' || el.children.length > 5) return
    const bottom = Math.round(el.getBoundingClientRect().bottom - containerTop)
    if (bottom > 0 && !seen.has(bottom)) {
      seen.add(bottom)
      ys.push(bottom)
    }
  })

  ys.sort((a, b) => a - b)
  return ys.filter((y, i) => i === 0 || y - ys[i - 1] > 2)
}


// ─── Browser print — fresh A4 mount (works when live preview is not in DOM) ─

/**
 * Open a print dialog with the resume rendered inside a `.resume-a4` frame,
 * matching PDF export and on-screen typography.
 */
export async function printResumeWithComponent(templateComponent, resumeData, settings) {
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(n => n.outerHTML).join('\n')

  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    throw new Error('Pop-up blocked — allow pop-ups to print.')
  }

  printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  ${styles}
  <style>
    @page { size: A4 portrait; margin: 0; }
    html, body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    * { box-sizing: border-box; }
    .resume-page-break-visual, .no-print { display: none !important; }
    .resume-a4 {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      background: #fff;
    }
    @media print {
      .resume-a4 {
        width: 210mm !important;
        min-height: 297mm !important;
        margin: 0 !important;
        padding: 18mm 15mm !important;
        box-shadow: none !important;
      }
    }
  </style>
</head>
<body>
  <div id="print-resume-root"></div>
</body>
</html>`)
  printWindow.document.close()

  const { createRoot } = await import('react-dom/client')
  const { createElement } = await import('react')
  const mount = printWindow.document.getElementById('print-resume-root')
  const root = createRoot(mount)

  root.render(
    createElement(
      'div',
      { className: 'resume-a4 bg-white' },
      createElement(templateComponent, { data: resumeData, settings }),
    ),
  )

  await printWindow.document.fonts.ready
  await document.fonts.ready
  await warmFonts()
  await delay(400)
  forceFontRender(mount)
  await delay(150)

  printWindow.focus()
  printWindow.print()
  setTimeout(() => {
    try { root.unmount() } catch (_) {}
    try { printWindow.close() } catch (_) {}
  }, 500)
}

// ─── Browser Print Fallback ──────────────────────────────────────

export function printResume(elementId) {
  const el = document.getElementById(elementId)
  if (!el) { console.warn('[pdfExporter] element not found:', elementId); return }

  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map(n => n.outerHTML).join('\n')

  const printWindow = window.open('', '_blank')
  if (!printWindow) { alert('Allow pop-ups for this site to enable browser print PDF.'); return }

  printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Resume</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  ${styles}
  <style>
    @page { size: A4 portrait; margin: 0; }
    body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    * { box-sizing: border-box; }
    .resume-a4 {
      width: 794px;
      min-height: 1123px;
      margin: 0 auto;
      background: #fff;
    }
    @media print {
      .resume-a4 {
        width: 210mm !important;
        min-height: 297mm !important;
        margin: 0 !important;
        padding: 18mm 15mm !important;
      }
    }
    .resume-page-break-visual, .no-print { display: none !important; }
  </style>
</head>
<body>
  ${el.outerHTML}
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); window.close(); }, 500);
    });
  <\/script>
</body>
</html>`)
  printWindow.document.close()
}


// ─── Utilities ───────────────────────────────────────────────

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function forceFontRender(container) {
  const fonts = [
    '"Libre Baskerville", serif',
    '"Inter", sans-serif',
    '"Plus Jakarta Sans", sans-serif',
    '"JetBrains Mono", monospace',
  ]
  const probes = fonts.map(family => {
    const probe = document.createElement('span')
    probe.style.cssText = `position:absolute;left:-9999px;top:0;visibility:hidden;font-family:${family};font-size:11pt;white-space:nowrap;`
    probe.textContent = 'AaBbCcDdEeFfGgHhIiJj 0123456789 ₹% — –'
    container.appendChild(probe)
    void probe.getBoundingClientRect()
    return probe
  })
  probes.forEach(p => container.removeChild(p))
}

async function warmFonts() {
  const weights   = ['400', '600', '700', '900']
  const families  = ['Inter', 'Libre Baskerville', 'Plus Jakarta Sans']
  const loads = []
  for (const family of families) {
    for (const weight of weights) {
      try { loads.push(document.fonts.load(`${weight} 12px "${family}"`, 'AaBc0123')) } catch (_) {}
    }
  }
  await Promise.allSettled(loads)
}

/** Helper to determine if a color is dark enough to need light text */
function isColorDark(color) {
  if (!color || color === 'transparent') return false
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return false
  const [_, r, g, b] = match
  const brightness = (parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000
  return brightness < 155
}
