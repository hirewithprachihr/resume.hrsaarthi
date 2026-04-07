/**
 * Supabase Edge Function: enhance-bullet
 * ─────────────────────────────────────────────────────────────────
 * Accepts a resume bullet point and returns 3 enhanced variations.
 * Also handles professional summary generation.
 *
 * POST /enhance-bullet
 * Body: {
 *   type: "bullet" | "summary"
 *   text?: string           — bullet text (for type=bullet)
 *   jobTitle?: string
 *   company?: string
 *   context?: string        — resume context (for type=summary)
 * }
 * Headers: Authorization: Bearer <user_jwt>
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const OPENAI_URL = "https://api.openai.com/v1/chat/completions"

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
    if (!body?.type) return jsonError("Missing 'type' field", 400)

    const openAIKey = Deno.env.get("OPENAI_API_KEY")
    if (!openAIKey) return jsonError("OpenAI API key not configured", 500)

    // ── Bullet Enhancement ──────────────────────────────────────
    if (body.type === "bullet") {
      if (!body.text) return jsonError("Missing 'text' for bullet enhancement", 400)

      const systemPrompt = `You are a World-Class Executive Resume Writer.
Transform the given resume bullet point into 3 high-impact variations:
1. "metric": Focuses on quantifiable results, percentages, and data.
2. "leadership": Focuses on ownership, mentorship, and coordination.
3. "action": Uses powerful action verbs and concise professional language.

Context:
Job Title: ${body.jobTitle || "Professional"}
Company: ${body.company || ""}

Rules:
- Keep the original meaning but elevate the impact.
- NEVER add bullet characters or list markers.
- Use STAR method where possible.
- Output MUST be valid JSON: { "metric": "...", "leadership": "...", "action": "..." }`

      const result = await callOpenAI(openAIKey, "gpt-4o", [
        { role: "system", content: systemPrompt },
        { role: "user",   content: `Enhance this bullet: "${body.text}"` },
      ], { response_format: { type: "json_object" }, temperature: 0.7 })

      const content = JSON.parse(result.choices[0].message.content)
      return jsonOk({
        metric    : content.metric     || content.Metric     || "",
        leadership: content.leadership || content.Leadership || "",
        action    : content.action     || content.Action     || "",
      })
    }

    // ── Summary Generation ──────────────────────────────────────
    if (body.type === "summary") {
      if (!body.context) return jsonError("Missing 'context' for summary generation", 400)

      const result = await callOpenAI(openAIKey, "gpt-4o-mini", [
        {
          role: "system",
          content: `You are an expert resume writer specializing in Indian professionals.
Write a professional resume summary that is:
- Exactly 3-4 sentences, 60-80 words total
- Starts with job title + years of experience
- Mentions 2-3 top skills by name
- Ends with a career goal or value proposition
- Written in third-person implied voice (no "I", "my", "me")
- Tailored for Indian job market (Naukri, LinkedIn India)
- Return ONLY the summary paragraph, no preamble or quotes.`,
        },
        { role: "user", content: `Write a professional summary:\n${body.context}` },
      ], { temperature: 0.7 })

      return jsonOk({ summary: result.choices[0].message.content.trim() })
    }

    return jsonError("Invalid 'type'. Use 'bullet' or 'summary'", 400)

  } catch (err) {
    console.error("[enhance-bullet] Error:", err)
    return jsonError("Internal server error", 500)
  }
})

async function callOpenAI(apiKey: string, model: string, messages: unknown[], extra = {}) {
  const res = await fetch(OPENAI_URL, {
    method : "POST",
    headers: {
      "Content-Type" : "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages, max_tokens: 512, ...extra }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `OpenAI error ${res.status}`)
  }
  return res.json()
}

function jsonOk(data: unknown) {
  return new Response(JSON.stringify({ ok: true, data }), {
    status : 200,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  })
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  })
}
