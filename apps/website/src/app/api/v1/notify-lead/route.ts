import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import nodemailer from "nodemailer"

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const body = await req.json()
    const { name, email, company, phone, type, audience, stage, timeline, budget, description } = body

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase server-side configuration")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // 1. Insert into Supabase database server-side using service role key
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

    let dbErrorDetails = null;
    try {
      const { error: dbError } = await supabase.from("leads").insert({
        name: name || "Anonymous",
        email: email,
        company: company || "N/A",
        message: dbMessage
      })

      if (dbError) {
        console.error("Supabase server-side insert error:", dbError)
        dbErrorDetails = dbError.message;
      }
    } catch (dbCrash: any) {
      console.error("Supabase server-side insert crashed:", dbCrash)
      dbErrorDetails = dbCrash.message;
    }

    // 2. Send email notification via Gmail SMTP (Nodemailer) — non-blocking to prevent UI crash
    let emailErrorDetails = null;
    try {
      const smtpUser = process.env.SMTP_USER || "mota200615@gmail.com"
      const smtpPass = process.env.SMTP_PASS || "iktjdsuxkbszobxx"

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      })

      const htmlBody = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8" />
          <title>طلب مشروع جديد - Aivora</title>
        </head>
        <body style="font-family: system-ui, -apple-system, sans-serif; background-color: #f9f9f9; padding: 32px; direction: rtl; text-align: right;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; border: 1px solid #eaeaea; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
            <div style="background: #0a0a0a; padding: 24px 32px; text-align: center;">
              <h1 style="color: #fff; font-size: 20px; margin: 0; font-weight: 600;">🚀 طلب مشروع جديد – Aivora</h1>
            </div>
            <div style="padding: 32px;">
              <table style="width: 100%; border-collapse: collapse; text-align: right; direction: rtl;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px; width: 140px;">الاسم</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px; color: #111;">${name || "—"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">البريد الإلكتروني</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px;"><a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email || "—"}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">الشركة</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px; color: #111;">${company || "—"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">الهاتف</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px; color: #111;">${phone || "—"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">نوع المشروع</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px; color: #111;">${type || "—"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">الجمهور المستهدف</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px; color: #111;">${audience || "—"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">مرحلة المشروع</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px; color: #111;">${stage || "—"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">الجدول الزمني</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px; color: #111;">${timeline || "—"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #888; font-size: 13px;">الميزانية</td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 500; font-size: 14px; color: #111;">${budget || "—"}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #888; font-size: 13px; vertical-align: top;">تفاصيل المشروع</td>
                  <td style="padding: 10px 0; font-weight: 400; font-size: 14px; color: #555; line-height: 1.7;">${description || "—"}</td>
                </tr>
              </table>
            </div>
            <div style="background: #f9f9f9; padding: 20px 32px; border-top: 1px solid #eaeaea; text-align: center;">
              <p style="color: #aaa; font-size: 11px; margin: 0;">تم الإرسال تلقائياً من نموذج الاستفسار في موقع <strong>Aivora</strong></p>
            </div>
          </div>
        </body>
        </html>
      `

      await transporter.sendMail({
        from: `"Aivora Platform" <${smtpUser}>`,
        to: "aiengmohamedtayal@gmail.com",
        subject: `🚀 طلب مشروع جديد من ${name || "زائر"} – ${company || ""}`,
        html: htmlBody,
      })
    } catch (emailError: any) {
      console.error("Nodemailer email send error:", emailError)
      emailErrorDetails = emailError.message;
    }

    // Always return success if we did our best, indicating lead status
    return NextResponse.json({ 
      success: true, 
      dbSaved: !dbErrorDetails, 
      emailSent: !emailErrorDetails,
      dbError: dbErrorDetails,
      emailError: emailErrorDetails 
    })
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : "Unknown error"
    console.error("Notify lead endpoint crash:", errMsg)
    return NextResponse.json({ error: "Failed to process request", details: errMsg }, { status: 500 })
  }
}
