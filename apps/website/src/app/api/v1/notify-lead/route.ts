import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json()
    const { name, email, company, phone, type, audience, stage, timeline, budget, description } = body

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const resendApiKey = process.env.RESEND_API_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase server-side configuration")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // 1. Insert into Supabase database server-side using service role key (bypasses client-side RLS/401 issues)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    })

    const dbMessage = [
      `Project Type: ${type || "—"}`,
      `Target Audience: ${audience || "—"}`,
      `Stage: ${stage || "—"}`,
      `Timeline: ${timeline || "—"}`,
      `Budget: ${budget || "—"}`,
      `Phone: ${phone || "—"}`,
      `Description: ${description || "—"}`
    ].join("\n")

    const { error: dbError } = await supabase.from("leads").insert({
      name: name || "Anonymous",
      email: email,
      company: company || "N/A",
      message: dbMessage
    })

    if (dbError) {
      console.error("Supabase server-side insert error:", dbError)
      // We continue to send email even if DB insert fails, to not lose the lead details
    }

    // 2. Send email notification via Resend
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not set — skipping email notification")
      return NextResponse.json({ success: true, emailSkipped: true })
    }

    const resend = new Resend(resendApiKey)

    const htmlBody = `
      <!DOCTYPE html>
      <html dir="ltr" lang="en">
      <head><meta charset="UTF-8" /><title>New Lead - Aivora</title></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9f9f9; padding: 32px;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #eaeaea; overflow: hidden;">
          <div style="background: #0a0a0a; padding: 24px 32px;">
            <h1 style="color: #fff; font-size: 20px; margin: 0; font-weight: 600;">🚀 طلب مشروع جديد – Aivora</h1>
          </div>
          <div style="padding: 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; width: 140px;">الاسم</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px;">${name || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">البريد الإلكتروني</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px;"><a href="mailto:${email}" style="color: #4f46e5;">${email || "—"}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">الشركة</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px;">${company || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">الهاتف</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px;">${phone || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">نوع المشروع</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px;">${type || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">الجمهور المستهدف</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px;">${audience || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">مرحلة المشروع</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px;">${stage || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">الجدول الزمني</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px;">${timeline || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">الميزانية</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px;">${budget || "—"}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">تفاصيل المشروع</td>
                <td style="padding: 10px 0; font-weight: 400; font-size: 14px; color: #555; line-height: 1.7;">${description || "—"}</td>
              </tr>
            </table>
          </div>
          <div style="background: #f9f9f9; padding: 20px 32px; border-top: 1px solid #eaeaea; text-align: center;">
            <p style="color: #aaa; font-size: 12px; margin: 0;">تم الإرسال تلقائياً من نموذج الاستفسار في موقع <strong>Aivora</strong></p>
          </div>
        </div>
      </body>
      </html>
    `

    const { error: emailError } = await resend.emails.send({
      from: "Aivora Leads <onboarding@resend.dev>",
      to: "aiengmohamedtayal@gmail.com",
      subject: `🚀 طلب مشروع جديد من ${name || "زائر"} – ${company || ""}`,
      html: htmlBody,
      replyTo: email || undefined,
    })

    if (emailError) {
      console.error("Resend email send error:", emailError)
      return NextResponse.json({ success: true, emailError: emailError.message })
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Unknown error"
    console.error("Notify lead endpoint crash:", errMsg)
    return NextResponse.json({ error: "Failed to process request", details: errMsg }, { status: 500 })
  }
}
