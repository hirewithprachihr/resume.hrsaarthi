/**
 * AI Enhancer v3.0 — Edge Function Proxy
 * ─────────────────────────────────────────────────────────────────
 * Routes all AI calls through the `enhance-bullet` Supabase Edge Function.
 * The OpenAI key lives in Supabase Secrets — never in the client bundle.
 */

import { supabase } from './supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

/** Shared edge function caller */
async function callEdge(payload) {
  const { data: { session } } = await supabase.auth.getSession()
  const jwt = session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY

  const res = await fetch(`${SUPABASE_URL}/functions/v1/enhance-bullet`, {
    method : 'POST',
    headers: {
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${jwt}`,
    },
    body: JSON.stringify(payload),
  })

  const json = await res.json().catch(() => null)
  if (!res.ok || !json?.ok) {
    throw new Error(json?.error || `AI request failed (${res.status})`)
  }
  return json.data
}

// ── Public API ───────────────────────────────────────────────────

/**
 * Generate a professional resume summary from resume data.
 * @param {object} resumeData - Full Zustand resumeData object
 * @returns {Promise<string>} A polished 60–80 word professional summary
 */
export async function generateSummary(resumeData) {
  const { personal, experience, skills, education } = resumeData

  const context = [
    personal.jobTitle && `Job Title: ${personal.jobTitle}`,
    personal.location && `Location: ${personal.location}`,
    experience.length > 0 && `Years of experience: ${experience.length > 3 ? '5+' : experience.length > 1 ? '2-4' : '1-2'} years`,
    experience.length > 0 && `Most recent role: ${experience[0].title} at ${experience[0].company || 'company'}`,
    skills.length > 0 && `Top skills: ${skills.map(s => s.items).join(', ').slice(0, 200)}`,
    education.length > 0 && `Education: ${education[0].degree} from ${education[0].school}`,
  ].filter(Boolean).join('\n')

  const data = await callEdge({ type: 'summary', context })
  return data.summary
}

/**
 * Enhance a single bullet point with 3 AI-powered variations.
 * @param {string} bulletText - The original bullet point
 * @param {string} jobTitle   - Job title for context
 * @param {string} company    - Company name for context
 * @returns {Promise<{metric: string, leadership: string, action: string}>}
 */
export async function enhanceBullet(bulletText, jobTitle = '', company = '') {
  const data = await callEdge({ type: 'bullet', text: bulletText, jobTitle, company })
  return {
    metric    : data.metric     || '',
    leadership: data.leadership || '',
    action    : data.action     || '',
  }
}
