/**
 * Supabase Edge Function: create-subscription
 * ─────────────────────────────────────────────────────────────────
 * Creates a Razorpay Subscription server-side (secret key never exposed to client).
 *
 * POST /create-subscription
 * Body: { plan_id: string, user_id: string, user_email: string, user_name: string }
 * Headers: Authorization: Bearer <user_jwt>
 *
 * Response: { ok: true, subscription_id: string }
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

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
    // ── Auth check ──────────────────────────────────────────────
    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonError("Unauthorized", 401)
    }

    // ── Parse request body ──────────────────────────────────────
    const body = await req.json().catch(() => null)
    if (!body?.plan_id) {
      return jsonError("Missing plan_id in request body", 400)
    }

    const { plan_id, user_id, user_email, user_name } = body

    // ── Razorpay credentials (from Supabase Secrets) ────────────
    const razorpayKeyId     = Deno.env.get("RAZORPAY_KEY_ID")
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET")

    if (!razorpayKeyId || !razorpayKeySecret) {
      return jsonError("Razorpay credentials not configured in Supabase Secrets", 500)
    }

    // ── Create Razorpay Subscription ─────────────────────────────
    const auth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`)

    const rzpResponse = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method : "POST",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": `Basic ${auth}`,
      },
      body: JSON.stringify({
        plan_id,
        total_count: 12,              // Max billing cycles (1 year for monthly)
        quantity   : 1,
        customer_notify: 1,
        notes: {
          user_id,
          user_email: user_email || "",
        },
      }),
    })

    const rzpData = await rzpResponse.json().catch(() => ({}))

    if (!rzpResponse.ok) {
      const errMsg = rzpData?.error?.description || `Razorpay error ${rzpResponse.status}`
      console.error("[create-subscription] Razorpay error:", errMsg)
      return jsonError(`Subscription creation failed: ${errMsg}`, rzpResponse.status)
    }

    const subscriptionId = rzpData.id
    if (!subscriptionId) {
      return jsonError("Razorpay did not return a subscription ID", 500)
    }

    console.log(`[create-subscription] Created subscription ${subscriptionId} for user ${user_id}`)

    return new Response(JSON.stringify({ ok: true, subscription_id: subscriptionId }), {
      status : 200,
      headers: {
        "Content-Type"               : "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })

  } catch (err) {
    console.error("[create-subscription] Unhandled error:", err)
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
