/**
 * Supabase Edge Function: razorpay-webhook
 * ─────────────────────────────────────────────────────────────────
 * Receives Razorpay webhook events for subscription lifecycle management.
 * Updates users.plan in Supabase based on subscription status.
 *
 * Events handled:
 *  - subscription.activated   → set plan = 'pro'
 *  - subscription.charged     → set plan = 'pro' (renewal)
 *  - subscription.cancelled   → set plan = 'free'
 *  - subscription.completed   → set plan = 'free' (all cycles done)
 *  - payment.captured         → log one-time payment
 *
 * Configure webhook URL in Razorpay dashboard:
 *   https://<your-project>.supabase.co/functions/v1/razorpay-webhook
 *
 * IMPORTANT: Set RAZORPAY_WEBHOOK_SECRET in Supabase Secrets
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"

Deno.serve(async (req: Request) => {
  // ── CORS preflight ──────────────────────────────────────────
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "x-razorpay-signature, content-type",
      },
    })
  }

  try {
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")
    const bodyText      = await req.text()

    // ── Verify Razorpay webhook signature ───────────────────────
    if (webhookSecret) {
      const razorpaySignature = req.headers.get("x-razorpay-signature") || ""
      const isValid = await verifySignature(bodyText, razorpaySignature, webhookSecret)
      if (!isValid) {
        console.error("[razorpay-webhook] Invalid signature")
        return new Response("Invalid signature", { status: 400 })
      }
    }

    const event = JSON.parse(bodyText)
    const eventType = event.event
    console.log(`[razorpay-webhook] Event: ${eventType}`)

    // ── Supabase Admin Client ────────────────────────────────────
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } }
    )

    // ── Handle events ────────────────────────────────────────────
    const payload    = event.payload
    const subscription = payload?.subscription?.entity
    const payment    = payload?.payment?.entity

    // Extract user_id from notes
    const userId = subscription?.notes?.user_id || payment?.notes?.user_id

    if (userId) {
      switch (eventType) {
        case "subscription.activated":
        case "subscription.charged": {
          // Subscription is active — upgrade user to Pro
          const { error } = await supabase
            .from("profiles")
            .update({
              plan          : "pro",
              plan_expires_at: computeExpiry(subscription),
              subscription_id: subscription?.id || null,
            })
            .eq("id", userId)

          if (error) {
            console.error(`[razorpay-webhook] DB update error for ${eventType}:`, error)
          } else {
            console.log(`[razorpay-webhook] User ${userId} upgraded to Pro (${eventType})`)
          }
          break
        }

        case "subscription.cancelled":
        case "subscription.completed":
        case "subscription.expired": {
          // Subscription ended — downgrade user to Free
          const { error } = await supabase
            .from("profiles")
            .update({
              plan          : "free",
              plan_expires_at: null,
              subscription_id: null,
            })
            .eq("id", userId)

          if (error) {
            console.error(`[razorpay-webhook] DB update error for ${eventType}:`, error)
          } else {
            console.log(`[razorpay-webhook] User ${userId} downgraded to Free (${eventType})`)
          }
          break
        }

        case "payment.captured": {
          // Log payment record
          if (payment?.order_id || payment?.subscription_id) {
            await supabase.from("payments").upsert({
              user_id            : userId,
              razorpay_payment_id: payment.id,
              razorpay_order_id  : payment.order_id || null,
              status             : "paid",
              amount             : payment.amount,
              currency           : payment.currency,
              plan               : "pro",
            }, { onConflict: "razorpay_payment_id" })
          }
          break
        }

        default:
          console.log(`[razorpay-webhook] Unhandled event type: ${eventType}`)
      }
    } else {
      console.warn(`[razorpay-webhook] No user_id found in event ${eventType}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      status : 200,
      headers: { "Content-Type": "application/json" },
    })

  } catch (err) {
    console.error("[razorpay-webhook] Unhandled error:", err)
    return new Response("Internal server error", { status: 500 })
  }
})

/**
 * Verify Razorpay webhook signature using HMAC-SHA256.
 */
async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder  = new TextEncoder()
    const keyData  = encoder.encode(secret)
    const msgData  = encoder.encode(body)
    const key      = await crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
    const macBuf   = await crypto.subtle.sign("HMAC", key, msgData)
    const computed = Array.from(new Uint8Array(macBuf)).map(b => b.toString(16).padStart(2, "0")).join("")
    return computed === signature
  } catch {
    return false
  }
}

/**
 * Compute plan expiry based on subscription charge_at or current_end timestamps.
 */
function computeExpiry(subscription: any): string | null {
  if (!subscription) return null
  const ts = subscription.current_end || subscription.end_at || subscription.charge_at
  if (!ts) return null
  return new Date(ts * 1000).toISOString()
}
