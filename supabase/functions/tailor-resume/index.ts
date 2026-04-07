/**
 * Supabase Edge Function: tailor-resume
 * ─────────────────────────────────────────────────────────────────
 * Rewrites resume bullet points and summary to match a job description.
 * ONLY rewrites the content, never changes titles/companies/dates/facts.
 *
 * POST /tailor-resume
 * Body: { jd: string, summary: string, bullets: [{id, bullets}] }
 * Headers: Authorization: Bearer <user_jwt>
 *
 * Response: { ok: true, data: { summary, bullets, addedKeywords, tailoringScore } }
 */
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const SYSTEM_PROMPT = `You are an expert ATS optimization specialist for the Indian job market.
Your task: rewrite specific sections of a resume to better match a job description.

Rules:
- ONLY rewrite bullet points and summary — do NOT change job titles, companies, dates, or facts
- INSERT missing keywords naturally — do not keyword stuff
- Keep the Indian professional tone (formal, achievement-oriented)
- Return ONLY valid JSON matching the exact schema provided — no markdown, no extra text
- Preserve all existing achievements but rephrase using JD language
- If a bullet has a metric (like 30%, ₹5L, 10x), keep it or enhance it with JD context
- tailoringScore = how well the tailored resume now matches the JD (0-100)`

Deno.serve(async (req: Request) => {
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
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonError("Unauthorized", 401)
    }

    const body = await req.json().catch(() => null)
    if (!body?.jd) {
      return jsonError("Missing jd (job description) in request body", 400)
    }

    const {
      jd      = "",
      summary = "",
      bullets = [],  // [{ id: string, title: string, bullets: string[] }]
    } = body

    const userPrompt = `Job Description:
${jd.slice(0, 2000)}

Current Resume Summary:
${(summary || "").slice(0, 500) || "Not provided"}

Current Experience Bullets:
${JSON.stringify(
  bullets.slice(0, 5).map((b: any) => ({
    id     : b.id,
    title  : b.title,
    bullets: (b.bullets || []).slice(0, 5),
  }))
)}

Return JSON:
{
  "summary": "rewritten summary (60-80 words, keyword-rich, achievement-oriented)",
  "bullets": [
    { "id": "experience_id_here", "bullets": ["rewritten bullet 1", "rewritten bullet 2"] }
  ],
  "addedKeywords": ["keyword1", "keyword2", "keyword3"],
  "tailoringScore": 85
}`

    const openAIKey = Deno.env.get("OPENAI_API_KEY")
    if (!openAIKey) {
      return jsonError("OpenAI API key not configured", 500)
    }

    const controller = new AbortController()
    const timeoutId  = setTimeout(() => controller.abort(), 50000)

    console.time("[tailor-resume] openai-fetch")

    try {
      const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          "Authorization": `Bearer ${openAIKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model          : "gpt-4o-mini",
          messages       : [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user",   content: userPrompt },
          ],
          temperature    : 0.4,    // low temp for factual rewrites
          max_tokens     : 1500,
          response_format: { type: "json_object" },
        }),
      })

      clearTimeout(timeoutId)
      console.timeEnd("[tailor-resume] openai-fetch")

      if (!aiResponse.ok) {
        const err = await aiResponse.json().catch(() => ({}))
        return jsonError(`OpenAI error: ${err?.error?.message || aiResponse.status}`, aiResponse.status)
      }

      const aiData = await aiResponse.json()
      const raw    = aiData?.choices?.[0]?.message?.content?.trim()

      if (!raw) return jsonError("Empty response from OpenAI", 500)

      let parsed: any
      try {
        parsed = JSON.parse(raw)
      } catch {
        return jsonError("AI returned invalid JSON. Please retry.", 500)
      }

      if (!parsed.bullets || !Array.isArray(parsed.bullets)) {
        return jsonError("Invalid AI response format: missing bullets array", 500)
      }

      return new Response(JSON.stringify({ ok: true, data: parsed }), {
        status : 200,
        headers: {
          "Content-Type"               : "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })

    } catch (fetchErr: any) {
      clearTimeout(timeoutId)
      if (fetchErr.name === "AbortError") {
        return jsonError("Request timed out. Please try again.", 504)
      }
      throw fetchErr
    }

  } catch (err) {
    console.error("[tailor-resume] Unhandled error:", err)
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
