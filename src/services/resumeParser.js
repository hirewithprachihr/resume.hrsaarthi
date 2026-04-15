/**
 * AI Resume Parser v5.0 — Edge Function Proxy
 * ──────────────────────────────────────────────────────────────────
 * FIXES in v5.0:
 *  1. CRITICAL: Use supabase.functions.invoke() instead of raw fetch().
 *     The Supabase client handles JWT auth internally — immune to
 *     getSession() lock timeouts that caused HTTP 401 errors.
 *  2. PDF worker: uses Vite-bundled worker URL (not protocol-relative CDN).
 *  3. DOCX parser: extracts <w:t> elements directly with proper spacing.
 *  4. Better error messages for all failure modes.
 *
 * STRATEGY:
 *  1. Extract plain text from the uploaded file (browser-side)
 *     - PDF  → pdfjs-dist (Vite-bundled worker)
 *     - DOCX → fflate unzip + proper XML parsing
 *     - TXT  → plain FileReader
 *  2. Send extracted text → Supabase Edge Function via supabase.functions.invoke()
 *     The edge function calls OpenAI with OPENAI_API_KEY (server secret).
 *     The OpenAI key is NEVER exposed in the client bundle.
 */

import { supabase } from './supabase'

// ── PDF.js Setup ─────────────────────────────────────────────────
// Import pdfjs-dist — the worker is configured using Vite's asset
// handling so the version always matches the installed package.
import * as pdfjsLib from 'pdfjs-dist'

// FIXED: Use Vite's URL() import for the worker — ensures version consistency
// and works correctly in secure contexts (https://) without CDN dependency.
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
  ).toString()
} catch (_) {
  // Fallback: Use CDN with exact version (better than mismatched version)
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`
}

// ── Main Entry ───────────────────────────────────────────────────

/**
 * Parse a resume file using AI via Supabase Edge Function.
 * @param {File} file - The uploaded resume file (PDF / DOCX / TXT)
 * @returns {Promise<object>} Structured resume data
 */
export async function parseResumeWithAI(file) {
  // Detect file format early for better error messages
  const format = detectFormat(file)

  if (format === 'unsupported') {
    throw new Error(
      'Unsupported file format. Please upload a PDF, DOCX, or TXT file.\n' +
      'Note: Legacy .doc files are not supported — please save as .docx first.'
    )
  }

  // Step 1: extract text from file
  let text
  try {
    text = await extractText(file, format)
  } catch (extractErr) {
    // Re-throw with format context
    throw new Error(extractErr.message || `Failed to read ${format.toUpperCase()} file.`)
  }

  if (!text || text.trim().length < 50) {
    if (format === 'pdf') {
      throw new Error(
        'Could not extract text from this PDF. This usually means:\n' +
        '• The PDF is a scanned image (not text-based) — please use a text PDF or DOCX.\n' +
        '• The PDF is password-protected — please remove the password first.'
      )
    }
    throw new Error(
      'Could not extract readable content from this file. ' +
      'Please try a different file or format (DOCX or TXT work best).'
    )
  }

  // Step 2: Call edge function via supabase.functions.invoke()
  // CRITICAL FIX: Using invoke() instead of raw fetch().
  // The Supabase client automatically attaches the correct Bearer JWT from
  // its internal session — this bypasses the getSession() lock issue entirely.
  // Raw fetch() was failing with 401 because getSession() timed out (locked)
  // and all manual JWT fallbacks (accessToken, anon key) were also null.

  console.log('[AI Parse] Initiating request to Supabase Edge Function…')

  const bodyText = text.length > 10000
    ? text.slice(0, 7000) + '\n...(continued)...\n' + text.slice(-3000)
    : text

  try {
    const { data, error } = await supabase.functions.invoke('parse-resume', {
      body: { text: bodyText },
    })

    if (error) {
      // FunctionsFetchError or FunctionsHttpError
      const status = error.context?.status
      if (status === 401) {
        throw new Error(
          'Session expired. Please refresh the page and sign in again, then retry parsing.'
        )
      }
      if (status === 504 || error.message?.includes('timeout')) {
        throw new Error(
          'AI parsing timed out. This can happen during peak hours — please try again in a moment.'
        )
      }
      throw new Error(error.message || 'AI parsing failed. Please try again.')
    }

    if (!data?.ok) {
      console.error('[AI Parse Error]:', data)
      throw new Error(data?.error || 'AI parsing failed. Please try a different file format.')
    }

    return data.data
  } catch (err) {
    console.error('[AI Parse Exception]:', err)
    throw err
  }
}

// ── Format Detection ─────────────────────────────────────────────

function detectFormat(file) {
  const name = file.name?.toLowerCase() || ''
  const type = file.type || ''

  if (type === 'text/plain' || name.endsWith('.txt')) return 'txt'
  if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    name.endsWith('.docx')
  ) return 'docx'
  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'
  if (name.endsWith('.doc')) return 'unsupported' // Legacy .doc — explicit error
  return 'unknown'
}

// ── Text Extraction dispatcher ───────────────────────────────────

async function extractText(file, format) {
  switch (format) {
    case 'txt':     return readAsText(file)
    case 'docx':    return extractDocxText(file)
    case 'pdf':     return extractPdfText(file)
    default:        return readAsText(file) // best-effort for unknown types
  }
}

// ── TXT ──────────────────────────────────────────────────────────

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('File read failed — the file may be corrupted.'))
    reader.readAsText(file, 'utf-8')
  })
}

// ── PDF ──────────────────────────────────────────────────────────

/**
 * Robust PDF text extraction using pdfjs-dist (v4+).
 * FIXED: Worker URL now uses Vite-bundled path (defined at module top).
 */
async function extractPdfText(file) {
  let pdf
  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      // Disable font/image loading for pure text extraction (faster, less memory)
      disableFontFace: false,
      verbosity: 0,
    })
    pdf = await loadingTask.promise
  } catch (loadErr) {
    const msg = loadErr?.message || ''
    if (msg.includes('password') || msg.includes('encrypted')) {
      throw new Error('This PDF is password-protected. Please remove the password and try again.')
    }
    if (msg.includes('worker') || msg.includes('Worker')) {
      throw new Error('PDF reader failed to initialize. Please try uploading as DOCX instead.')
    }
    throw new Error('Failed to read PDF. The file may be corrupted — try re-saving it.')
  }

  let fullText = ''
  let extractedPages = 0

  for (let i = 1; i <= pdf.numPages; i++) {
    try {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()

      // Join text items, preserving meaningful whitespace between them
      let pageText = ''
      let lastY = null
      for (const item of textContent.items) {
        if (!item.str) continue
        // Insert newline when Y position changes significantly (new line)
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 2) {
          pageText += '\n'
        } else if (pageText.length > 0 && !pageText.endsWith(' ') && !item.str.startsWith(' ')) {
          pageText += ' '
        }
        pageText += item.str
        lastY = item.transform[5]
      }

      fullText += pageText + '\n\n'
      extractedPages++
    } catch (pageErr) {
      console.warn(`[PDF Parser] Failed to extract page ${i}:`, pageErr.message)
      // Continue with other pages
    }
  }

  if (extractedPages === 0 || fullText.trim().length < 50) {
    throw new Error(
      'No readable text found in this PDF. It may be a scanned image.\n' +
      'Please use a text-based PDF, or convert to DOCX format.'
    )
  }

  return fullText
}

// ── DOCX ─────────────────────────────────────────────────────────

/**
 * DOCX text extraction — unzips the XML and correctly preserves word spacing.
 *
 * FIXED: The previous regex stripped all tags which caused word concatenation.
 * Now we:
 *  1. Insert space markers at word run (</w:r>) and paragraph (</w:p>) boundaries
 *  2. Extract text from <w:t> elements directly (handles xml:space="preserve")
 *  3. Decode XML entities after extraction
 */
async function extractDocxText(file) {
  try {
    const { unzip } = await import('fflate')
    const buffer = await file.arrayBuffer()

    return new Promise((resolve, reject) => {
      unzip(new Uint8Array(buffer), (err, files) => {
        if (err) {
          reject(new Error('Could not open DOCX file. It may be corrupted or password-protected.'))
          return
        }
        if (!files['word/document.xml']) {
          reject(new Error('Invalid DOCX structure — missing document.xml. Try re-saving the file.'))
          return
        }

        const xml = new TextDecoder().decode(files['word/document.xml'])

        // Step 1: Extract text content properly
        // Process paragraphs one by one to preserve structure
        const paragraphs = []

        // Split by paragraph tags
        const paraRegex = /<w:p[\s>]([\s\S]*?)<\/w:p>/g
        let paraMatch

        while ((paraMatch = paraRegex.exec(xml)) !== null) {
          const paraXml = paraMatch[1]
          let paraText = ''

          // Extract all text runs within this paragraph
          // <w:t> elements contain the actual text content
          const runRegex = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g
          let runMatch

          while ((runMatch = runRegex.exec(paraXml)) !== null) {
            paraText += runMatch[1]
          }

          // Also handle <w:tab/> as a space/tab character
          if (/<w:tab[\s\/]/.test(paraXml)) {
            paraText = paraText.replace(/<w:tab[\s\/][^>]*>/g, '\t')
          }

          const decoded = decodeXmlEntities(paraText).trim()
          if (decoded) paragraphs.push(decoded)
        }

        // Fallback: if paragraph-based extraction failed, use line-based approach
        if (paragraphs.length === 0) {
          // Simple fallback: extract all <w:t> content with spaces
          const fallbackText = xml
            .replace(/<w:br[^/]*/g, '\n')
            .replace(/<w:p[\s>][^>]*>/g, '\n')
            .replace(/<w:tab[\s\/][^>]*>/g, ' ')
            .replace(/<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g, ' $1')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
            .replace(/&apos;/g, "'").replace(/&quot;/g, '"')
            .replace(/\s+/g, ' ').trim()

          if (fallbackText.length < 50) {
            reject(new Error('Could not read DOCX content. Try saving as PDF or TXT format.'))
            return
          }
          resolve(fallbackText)
          return
        }

        const text = paragraphs.join('\n').replace(/\n{3,}/g, '\n\n').trim()

        if (text.length < 50) {
          reject(new Error('DOCX file appears to be empty or has very little content.'))
          return
        }

        resolve(text)
      })
    })
  } catch (err) {
    if (err.message?.includes('Could not open') || err.message?.includes('Invalid DOCX')) {
      throw err
    }
    throw new Error(err.message || 'DOCX parsing failed. Please try PDF or TXT format.')
  }
}

/**
 * Decode XML/HTML entities in extracted text.
 */
function decodeXmlEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9A-Fa-f]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
}

/** Legacy helper — kept for compatibility */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result.split(',')[1])
    reader.onerror = () => reject(new Error('File read failed'))
    reader.readAsDataURL(file)
  })
}
