import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, company, phone, type, audience, stage, timeline, budget, description } = body

    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      // Gracefully degrade — lead was already saved to Supabase, just skip email
      console.warn("RESEND_API_KEY not set — skipping email notification")
      return NextResponse.json({ success: true, skipped: true })
    }

    const resend = new Resend(resendApiKey)

    const htmlBody = `
      <!DOCTYPE html>
      <html dir="ltr" lang="en">
      <head><meta charset="UTF-8" /><title>New Lead - Aivora</title></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f9f9f9; padding: 32px;">
        <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #eaeaea; overflow: hidden;">
          <div style="background: #0a0a0a; padding: 24px 32px; display: flex; align-items: center; gap: 12px;">
            <h1 style="color: #fff; font-size: 20px; margin: 0; font-weight: 600;">🚀 طلب مشروع جديد – Aivora</h1>
          </div>
          <div style="padding: 32px; display: flex; flex-direction: column; gap: 16px;">
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

    const { error } = await resend.emails.send({
      from: "Aivora Leads <onboarding@resend.dev>",
      to: "aiengmohamedtayal@gmail.com",
      subject: `🚀 طلب مشروع جديد من ${name || "زائر"} – ${company || ""}`,
      html: htmlBody,
      replyTo: email || undefined,
    })

    if (error) {
      console.error("Resend error:", error)
      // Don't fail — lead already saved in Supabase
      return NextResponse.json({ success: true, emailError: error.message })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Notify lead error:", err)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
