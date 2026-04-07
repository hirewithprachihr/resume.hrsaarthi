/**
 * Supabase Edge Function: generate-interview-questions
 * ─────────────────────────────────────────────────────────────────
 * Generates 12 interview questions (3 per category) tailored to the
 * candidate's resume and target company, for the Indian job market.
 *
 * POST /generate-interview-questions
 * Body: { jobTitle, company, resumeSummary, skills, experience, isPro }
 * Headers: Authorization: Bearer <user_jwt>
 *
 * Response: { ok: true, data: { technical, behavioral, company_fit, salary_negotiation } }
 */
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const SYSTEM_PROMPT = `You are a senior technical interviewer and HR professional with 15+ years 
of experience hiring for Indian companies (TCS, Infosys, Wipro, Paytm, Flipkart, startups, MNCs, Big 4). 

Generate interview questions and model answers based on the candidate's resume. 
Return ONLY valid JSON. No markdown. No explanation. No code blocks.

JSON Schema (exactly 3 items per array):
{
  "technical": [
    { "question": string, "difficulty": "easy|medium|hard", "modelAnswer": string, "tip": string }
  ],
  "behavioral": [
    { "question": string, "framework": "STAR", "modelAnswer": string, "tip": string }
  ],
  "company_fit": [
    { "question": string, "modelAnswer": string, "tip": string }
  ],
  "salary_negotiation": [
    { "question": string, "modelAnswer": string }
  ]
}

Rules:
- Make questions SPECIFIC to the candidate's actual experience, not generic
- For India: reference realistic INR salary ranges for the role/city
- Behavioral answers should use STAR format (Situation, Task, Action, Result)
- Tips should be actionable, 1 sentence each
- modelAnswer should be 3-5 sentences, not too long`

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
    if (!body?.jobTitle) {
      return jsonError("Missing jobTitle in request body", 400)
    }

    const {
      jobTitle       = "",
      company        = "",
      resumeSummary  = "",
      skills         = "",
      experience     = "",
      location       = "India",
    } = body

    const userPrompt = `Generate 3 interview questions per category for:

Job Title: ${jobTitle}
Company: ${company || "a reputed Indian company"}
Candidate Summary: ${resumeSummary ? resumeSummary.slice(0, 500) : "Not provided"}
Key Skills: ${skills ? skills.slice(0, 300) : "Not provided"}
Work Experience: ${experience ? experience.slice(0, 500) : "Not provided"}
Location: ${location}

Return exactly 3 questions per category. Strictly return valid JSON only.`

    const openAIKey = Deno.env.get("OPENAI_API_KEY")
    if (!openAIKey) {
      return jsonError("OpenAI API key not configured", 500)
    }

    const controller = new AbortController()
    const timeoutId  = setTimeout(() => controller.abort(), 50000)

    console.time("[interview-questions] openai-fetch")

    try {
      const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          "Authorization": `Bearer ${openAIKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model      : "gpt-4o-mini",
          messages   : [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user",   content: userPrompt },
          ],
          temperature     : 0.7,
          max_tokens      : 2000,
          response_format : { type: "json_object" },
        }),
      })

      clearTimeout(timeoutId)
      console.timeEnd("[interview-questions] openai-fetch")

      if (!aiResponse.ok) {
        const err = await aiResponse.json().catch(() => ({}))
        return jsonError(`OpenAI error: ${err?.error?.message || aiResponse.status}`, aiResponse.status)
      }

      const aiData = await aiResponse.json()
      const raw    = aiData?.choices?.[0]?.message?.content?.trim()

      if (!raw) {
        return jsonError("Empty response from OpenAI", 500)
      }

      // Parse JSON response
      let parsed: any
      try {
        parsed = JSON.parse(raw)
      } catch {
        return jsonError("AI returned invalid JSON. Please try again.", 500)
      }

      // Validate structure
      const required = ["technical", "behavioral", "company_fit", "salary_negotiation"]
      for (const key of required) {
        if (!Array.isArray(parsed[key]) || parsed[key].length === 0) {
          return jsonError(`Missing or empty ${key} in AI response. Please retry.`, 500)
        }
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
        return jsonError("Request timed out after 50 seconds. Please try again.", 504)
      }
      throw fetchErr
    }

  } catch (err) {
    console.error("[interview-questions] Unhandled error:", err)
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
