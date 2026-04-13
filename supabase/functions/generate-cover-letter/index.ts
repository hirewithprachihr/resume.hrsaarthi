/**
 * Supabase Edge Function: generate-cover-letter
 * ─────────────────────────────────────────────────────────────────
 * Accepts structured resume data + job details, returns a professional
 * cover letter for the Indian job market using OpenAI GPT-4o-mini.
 *
 * POST /generate-cover-letter
 * Body: {
 *   jobTitle: string,
 *   company: string,
 *   jobDescription: string,
 *   tone: 'formal' | 'warm' | 'assertive',
 *   resumeData: {
 *     name, currentRole, yearsExp, topSkills, achievement1, achievement2,
 *     education, location
 *   },
 *   existingLetter?: string,
 *   refineInstruction?: string
 * }
 * Headers: Authorization: Bearer <user_jwt>
 *
 * Response: { ok: true, data: { letter: string, wordCount: number } }
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const SYSTEM_PROMPT = `You are an expert career coach specializing in the Indian job market. 
Generate professional cover letters for Indian job seekers applying to companies in India 
(Infosys, TCS, Wipro, startups, MNCs, etc). 

Rules:
- Length: 250-320 words exactly
- Tone: Professional but warm, confident but not arrogant  
- Structure: Opening hook → Why this company → Why you're the right fit (2-3 achievements) → Call to action
- Use Indian conventions: reference city-based roles, Indian degree names (B.Tech, MBA, MCA, etc.)
- Include specific numbers/metrics from the resume when available
- Output ONLY the letter body text, no subject line, no headers, no "Dear Hiring Manager" prefix
- Do NOT start with "I am writing to..." — use a compelling hook instead
- Write naturally for India: mention rupees (₹) not dollars for salary context, reference Indian companies, cities
- End with a polite, confident call to action`

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req: Request) => {
  // ── CORS preflight ──────────────────────────────────────────
  if (req.method === "OPTIONS") {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  try {
    // ── Auth check ──────────────────────────────────────────────
    const authHeader = req.headers.get("authorization")
    const hasAuth = authHeader?.startsWith("Bearer ")
    console.log(`[generate-cover-letter] Request received. Has Auth: ${!!hasAuth}`)

    // ── Parse request body ──────────────────────────────────────
    const body = await req.json().catch(() => null)

    if (!body?.jobTitle || !body?.company) {
      return jsonError("Missing required fields: jobTitle, company", 400)
    }

    const {
      jobTitle        = "",
      company         = "",
      jobDescription  = "",
      tone            = "formal",
      resumeData      = {},
      existingLetter  = "",
      refineInstruction = "",
    } = body

    const {
      name        = "",
      currentRole = jobTitle,
      yearsExp    = "3+",
      topSkills   = "",
      achievement1 = "",
      achievement2 = "",
      education   = "",
      location    = "",
    } = resumeData

    // ── Tone instruction ────────────────────────────────────────
    const toneInstructions: Record<string, string> = {
      formal   : "Formal and professional. Respectful and composed.",
      warm     : "Warm and approachable. Friendly yet professional.",
      assertive: "Confident and direct. Show conviction and ambition.",
    }
    const toneHint = toneInstructions[tone] || toneInstructions.formal

    // ── Build user prompt ───────────────────────────────────────
    let userPrompt = ""
    
    if (refineInstruction && existingLetter) {
      userPrompt = `Refine the following cover letter based on this specific instruction: "${refineInstruction}"
      
Current Letter:
${existingLetter}

Context:
Job Title: ${jobTitle}
Company: ${company}

Tone to maintain: ${toneHint}

Rules:
- Keep the length between 250-320 words.
- Maintain the same structure unless the instruction says otherwise.
- Output ONLY the refined letter body text. No subject lines or headers.`
    } else {
      userPrompt = `Generate a cover letter for:
Job Title: ${jobTitle}
Company: ${company}
Job Description: ${jobDescription ? jobDescription.slice(0, 1500) : "Not provided"}

Candidate Profile:
Name: ${name}
Current Role: ${currentRole}
Years of Experience: ${yearsExp}
Top Skills: ${topSkills}
Key Achievement 1: ${achievement1}
Key Achievement 2: ${achievement2}
Education: ${education}
Location: ${location}

Required Tone: ${toneHint}

Write 250-320 words. Start with a compelling hook. No headers. No "Dear Hiring Manager."`
    }

    // ── Call OpenAI ─────────────────────────────────────────────
    const openAIKey = Deno.env.get("OPENAI_API_KEY")
    if (!openAIKey) {
      return jsonError("OpenAI API key not configured in Supabase Secrets", 500)
    }

    const openaiController = new AbortController()
    const openaiTimeout = setTimeout(() => openaiController.abort(), 50000)

    console.time("[generate-cover-letter] openai-fetch")

    try {
      const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method : "POST",
        headers: {
          "Content-Type" : "application/json",
          "Authorization": `Bearer ${openAIKey}`,
        },
        signal: openaiController.signal,
        body: JSON.stringify({
          model      : "gpt-4o-mini",
          messages   : [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user",   content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens : 800,
        }),
      })

      clearTimeout(openaiTimeout)
      console.timeEnd("[generate-cover-letter] openai-fetch")

      if (!aiResponse.ok) {
        const err = await aiResponse.json().catch(() => ({}))
        const msg = err?.error?.message || `OpenAI error ${aiResponse.status}`
        console.error("[generate-cover-letter] OpenAI error:", msg)
        return jsonError(`AI generation failed: ${msg}`, aiResponse.status)
      }

      const aiData  = await aiResponse.json()
      const letter  = aiData?.choices?.[0]?.message?.content?.trim()

      if (!letter) {
        return jsonError("Empty response from OpenAI", 500)
      }

      const wordCount = letter.split(/\s+/).filter(Boolean).length

      return new Response(JSON.stringify({ ok: true, data: { letter, wordCount } }), {
        status : 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type"               : "application/json",
        },
      })

    } catch (fetchErr: any) {
      clearTimeout(openaiTimeout)
      if (fetchErr.name === "AbortError") {
        console.error("[generate-cover-letter] OpenAI call timed out after 50s")
        return jsonError("AI generation timed out. Please try again.", 504)
      }
      throw fetchErr
    }

  } catch (err) {
    console.error("[generate-cover-letter] Unhandled error:", err)
    return jsonError("Internal server error", 500)
  }
})

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type"               : "application/json",
    },
  })
}
