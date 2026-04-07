/**
 * AI Resume Parser v3.0 — Edge Function Proxy
 * ──────────────────────────────────────────────────────────────────
 * Strategy:
 *  1. Extract plain text from the uploaded file (browser-side)
 *     - PDF  → BT/ET text stream extraction + raw fallback
 *     - DOCX → unzip + XML strip
 *     - TXT  → plain FileReader
 *  2. Send extracted text → Supabase Edge Function (parse-resume)
 *     The edge function calls OpenAI with OPENAI_API_KEY (server secret).
 *     The OpenAI key is NEVER exposed in the client bundle.
 */

import { supabase } from './supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

// ── Main Entry ───────────────────────────────────────────────────

/**
 * Parse a resume file using AI via Supabase Edge Function.
 * @param {File} file - The uploaded resume file (PDF / DOCX / TXT)
 * @returns {Promise<object>} Structured resume data
 */
export async function parseResumeWithAI(file) {
  // Step 1: extract text from file
  const text = await extractText(file)

  if (!text || text.trim().length < 50) {
    throw new Error(
      'Could not extract readable text. ' +
      'Use a text-layer PDF (not a scanned image) or a DOCX/TXT file.'
    )
  }

  // Step 2: get current user session JWT
  const { data: { session } } = await supabase.auth.getSession()
  const jwt = session?.access_token

  // Step 3: call edge function with hard 55s timeout
  // (Supabase Edge Functions have a 60s wall-time limit;
  //  we abort at 55s to ensure we can handle the abort gracefully)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 55000)

  console.log('[AI Parse] Initiating fetch to Supabase...')
  console.time('[AI Parse] Network Request')

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/parse-resume`, {
      method : 'POST',
      headers: {
        'Content-Type' : 'application/json',
        'Authorization': `Bearer ${jwt || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      signal: controller.signal,
      // Aggressive truncation to 10kb to avoid OpenAI latency spikes (> 60s)
      body: JSON.stringify({
        text: text.length > 10000
          ? text.slice(0, 7000) + '\n...(continued)...\n' + text.slice(-3000)
          : text,
      }),
    })

    console.timeEnd('[AI Parse] Network Request')
    console.log('[AI Parse] Status:', res.status)

    clearTimeout(timeoutId)

    // Handle non-ok HTTP responses BEFORE calling .json()
    // (e.g., 504 Gateway Timeout returns HTML, not JSON)
    if (!res.ok) {
      const json = await res.json().catch(() => null)
      const errMsg = json?.error || `AI parsing failed (HTTP ${res.status}). Please try again.`
      console.error('[AI Parse Error]:', { status: res.status, json })
      throw new Error(errMsg)
    }

    const json = await res.json().catch(() => null)

    if (!json?.ok) {
      console.error('[AI Parse Error Debug]:', { 
        status: res.status, 
        ok: res.ok, 
        json: json || 'invalid-json' 
      })
      throw new Error(json?.error || `AI parsing failed (${res.status}). Try a different file format.`)
    }

    return json.data
  } catch (err) {
    console.timeEnd('[AI Parse] Network Request')
    if (err.name === 'AbortError') {
      console.error('[AI Parse] Aborted due to 55s timeout.')
      throw new Error('AI parsing timed out after 55 seconds. OpenAI is experiencing high latency — please try again in a moment.')
    }
    console.error('[AI Parse Exception]:', err)
    throw err
  }
}

// ── Text Extraction ──────────────────────────────────────────────

async function extractText(file) {
  const type = file.type || ''

  if (type === 'text/plain') return readAsText(file)

  if (
    type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.name?.endsWith('.docx')
  ) return extractDocxText(file)

  if (type === 'application/pdf' || file.name?.endsWith('.pdf')) {
    return extractPdfText(file)
  }

  return readAsText(file)
}

function readAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('File read failed'))
    reader.readAsText(file, 'utf-8')
  })
}

/**
 * Lightweight PDF text extraction — reads raw binary, finds BT/ET blocks.
 * Works for text-layer PDFs. Scanned PDFs return empty → error shown to user.
 */
async function extractPdfText(file) {
  const buffer = await file.arrayBuffer()

  // Use TextDecoder with latin1 — O(n) instead of O(n²) char-by-char concat
  const raw = new TextDecoder('latin1').decode(buffer)

  const btEtBlocks = raw.match(/BT[\s\S]*?ET/g) || []
  const textPieces = []
  const tjPattern  = /\(([^)]*)\)\s*Tj/g
  const TjPattern  = /\[([^\]]*)\]\s*TJ/g

  for (const block of btEtBlocks) {
    let m
    while ((m = tjPattern.exec(block)) !== null) textPieces.push(decodePdfString(m[1]))
    while ((m = TjPattern.exec(block)) !== null) {
      const arr = m[1].match(/\(([^)]*)\)/g) || []
      arr.forEach(s => textPieces.push(decodePdfString(s.slice(1, -1))))
    }
  }

  const extracted = textPieces.join(' ').replace(/\s+/g, ' ').trim()
  return extracted.length < 100 ? extractPdfRawFallback(raw) : extracted
}

function decodePdfString(s) {
  return s
    .replace(/\\n/g, '\n').replace(/\\r/g, ' ').replace(/\\t/g, ' ')
    .replace(/\\\\/g, '\\')
    .replace(/\\([0-7]{3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)))
    .replace(/\\(.)/g, '$1')
}

function extractPdfRawFallback(raw) {
  const words = raw.match(/[A-Za-z][A-Za-z0-9.@,+\-/()₹%&':#]{2,}/g) || []
  return words.join(' ').slice(0, 14000)
}

/**
 * Minimal DOCX text extraction — unzips the XML and strips tags.
 */
async function extractDocxText(file) {
  try {
    const { unzip } = await import('fflate')
    const buffer = await file.arrayBuffer()
    return new Promise((resolve, reject) => {
      unzip(new Uint8Array(buffer), (err, files) => {
        if (err) { reject(new Error('DOCX unzip failed — try saving as PDF instead.')); return }
        if (!files['word/document.xml']) { reject(new Error('Invalid DOCX structure.')); return }
        const xml  = new TextDecoder().decode(files['word/document.xml'])
        const text = xml
          .replace(/<w:br[^/]*/g, '\n').replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&apos;/g, "'").replace(/&quot;/g, '"')
          .replace(/\s+/g, ' ').trim()
        if (text.length < 50) { reject(new Error('Could not read DOCX content. Try saving as PDF.')); return }
        resolve(text)
      })
    })
  } catch (err) {
    // Don't silently fall back to raw XML — that confuses GPT badly
    throw new Error(err.message || 'DOCX parsing failed. Please try PDF or TXT format.')
  }
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
