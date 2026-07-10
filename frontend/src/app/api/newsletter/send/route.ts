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

    // Inject into Aivora Branded HTML Template
    const brandedHtml = `
      <!DOCTYPE html>
      <html>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-w-xl mx-auto p-4">
        <div style="text-align: center; margin-bottom: 32px;">
          <h2 style="color: #000; letter-spacing: -0.5px;">Aivora Engineering</h2>
        </div>
        <div style="background: #fff; padding: 24px; border-radius: 8px; border: 1px solid #eaeaea;">
          ${html}
        </div>
        <div style="text-align: center; margin-top: 32px; font-size: 12px; color: #888;">
          <p>You're receiving this because you subscribed to the Aivora Engineering Newsletter.</p>
          <p><a href="https://aivora.com/unsubscribe" style="color: #666;">Unsubscribe</a></p>
        </div>
      </body>
      </html>
    `

    // Batch emails into chunks of 50 to respect rate limits
    const chunkSize = 50;
    const emailChunks = [];
    for (let i = 0; i < emails.length; i += chunkSize) {
      emailChunks.push(emails.slice(i, i + chunkSize));
    }

    // Send via Resend
    for (const chunk of emailChunks) {
      const { error: sendError } = await resend.emails.send({
        from: "Aivora Engineering <hello@aivora.com>",
        to: "subscribers@aivora.com",
        bcc: chunk,
        subject,
        html: brandedHtml,
        text,
      })

      if (sendError) {
        console.error("Resend Batch Error:", sendError)
        // Note: For production, we'd log this to a tracking table and continue or retry
      }
    }

    return NextResponse.json({ success: true, sentTo: emails.length }, { status: 200 })
  } catch (error) {
    console.error("Newsletter Broadcast Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
