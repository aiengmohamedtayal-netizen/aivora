import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { subject, html, text } = body

    if (!subject || !html) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const resendApiKey = process.env.RESEND_API_KEY

    if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
      return NextResponse.json({ error: "Missing configuration" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const resend = new Resend(resendApiKey)

    // Fetch active subscribers
    const { data: subscribers, error } = await supabase
      .from("newsletter_subscribers")
      .select("email, locale")
      .eq("status", "active")

    if (error || !subscribers) {
      throw new Error("Failed to fetch subscribers")
    }

    if (subscribers.length === 0) {
      return NextResponse.json({ success: true, message: "No active subscribers" }, { status: 200 })
    }

    const emails = subscribers.map(s => s.email)

    // Send via Resend (Batched or Bcc depending on volume, Resend supports Batch API)
    // For simplicity, using a basic single broadcast with Bcc for small lists, or batch for production
    const { data, error: sendError } = await resend.emails.send({
      from: "Aivora Engineering <hello@aivora.com>",
      to: "subscribers@aivora.com",
      bcc: emails,
      subject,
      html,
      text,
    })

    if (sendError) {
      throw sendError
    }

    return NextResponse.json({ success: true, sentTo: emails.length }, { status: 200 })
  } catch (error) {
    console.error("Newsletter Broadcast Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
