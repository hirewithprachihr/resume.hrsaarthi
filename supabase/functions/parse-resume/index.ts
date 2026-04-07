/**
 * Supabase Edge Function: parse-resume
 * ─────────────────────────────────────────────────────────────────
 * Accepts resume text from the client, calls OpenAI GPT-4o-mini,
 * and returns structured parsed JSON.
 *
 * The OPENAI_API_KEY is read from Supabase Secrets — never exposed
 * to the client browser.
 *
 * POST /parse-resume
 * Body: { text: string }         — plain text extracted from resume
 * Headers: Authorization: Bearer <user_jwt>
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const SYSTEM_PROMPT = `You are an expert resume parser. Extract all information from the provided resume text and return ONLY a valid JSON object with this exact schema:
{
  "name": "string",
  "jobTitle": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "website": "string",
  "summary": "string",
  "experience": [
    {
      "title": "string",
      "company": "string",
      "location": "string",
      "startDate": "string (MMM YYYY format)",
      "endDate": "string (MMM YYYY or 'Present')",
      "current": false,
      "bullets": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "school": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "grade": "string"
    }
  ],
  "skills": [
    { "category": "string", "items": "comma-separated string" }
  ],
  "certifications": [
    { "name": "string", "issuer": "string", "date": "string" }
  ],
  "projects": [
    { "name": "string", "description": "string", "tech": "string", "url": "" }
  ],
  "languages": [
    { "language": "string", "proficiency": "string" }
  ],
  "hobbies": []
}
Rules:
- If a field is not present, use "" or []
- Do NOT invent data not present in the resume
- Return ONLY the JSON object, no markdown fences`

Deno.serve(async (req: Request) => {
  // ── CORS preflight ──────────────────────────────────────────
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, content-type",
      },
    })
  }

  try {
    // ── Validate auth ───────────────────────────────────────────
    const authHeader = req.headers.get("authorization")
    const hasAuth = authHeader?.startsWith("Bearer ")
    
    // Log basic metadata for debugging (no sensitive tokens)
    console.log(`[parse-resume] Request received. Method: ${req.method}, Has Auth: ${!!hasAuth}`)

    // ── Parse request body ──────────────────────────────────────
    const body = await req.json().catch(() => null)
    
    // Health check ping
    if (body?.ping) {
      return new Response(JSON.stringify({ ok: true, message: "pong" }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      })
    }

    if (!body?.text || typeof body.text !== "string") {
      return jsonError("Missing or invalid 'text' field in request body", 400)
    }

    const resumeText = body.text.trim().slice(0, 14000) // ~3.5k tokens max
    if (resumeText.length < 50) {
      return jsonError("Resume text is too short to parse", 400)
    }

    // ── Call OpenAI with server-side secret ─────────────────────
    const openAIKey = Deno.env.get("OPENAI_API_KEY")
    if (!openAIKey) {
      return jsonError("OpenAI API key not configured in Supabase Secrets", 500)
    }

    const openaiController = new AbortController()
    const openaiTimeout = setTimeout(() => openaiController.abort(), 50000) // 50s internal timeout

    console.time("[parse-resume] openai-fetch")
    try {
      const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method : "POST",
        headers: {
          "Content-Type" : "application/json",
          "Authorization": `Bearer ${openAIKey}`,
        },
        signal: openaiController.signal,
        body: JSON.stringify({
          model          : "gpt-4o-mini",
          messages       : [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user",   content: resumeText },
          ],
          response_format: { type: "json_object" },
          temperature    : 0,
          max_tokens     : 2048,
        }),
      })
      clearTimeout(openaiTimeout)
      console.timeEnd("[parse-resume] openai-fetch")

      if (!aiResponse.ok) {
        const err = await aiResponse.json().catch(() => ({}))
        const msg = err?.error?.message || `OpenAI error ${aiResponse.status}`
        console.error("[parse-resume] OpenAI error:", msg)
        return jsonError(`AI parsing failed: ${msg}`, aiResponse.status)
      }

      const aiData  = await aiResponse.json()
      const content = aiData?.choices?.[0]?.message?.content
      if (!content) {
        return jsonError("Empty response from OpenAI", 500)
      }

      try {
        const parsed = JSON.parse(content)

        return new Response(JSON.stringify({ ok: true, data: parsed }), {
          status : 200,
          headers: {
            "Content-Type"               : "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
      } catch (parseErr) {
        console.error("[parse-resume] JSON parse error:", parseErr, content)
        return jsonError("AI returned invalid JSON structure", 500)
      }
    } catch (fetchErr: any) {
      clearTimeout(openaiTimeout)
      if (fetchErr.name === 'AbortError') {
        console.error("[parse-resume] OpenAI call timed out after 50s")
        return jsonError("AI synthesis timed out. The resume might be too complex.", 504)
      }
      throw fetchErr
    }
  } catch (err) {
    console.error("[parse-resume] Unhandled error:", err)
    return jsonError("Internal server error", 500)
  }
})

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: {
      "Content-Type"               : "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
