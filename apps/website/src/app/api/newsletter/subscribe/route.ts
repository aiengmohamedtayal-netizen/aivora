import { NextResponse } from "next/server"
import { subscribeSchema } from "@/lib/newsletter/validation"
import { createSubscriber } from "@/lib/newsletter/database"
import { sendConfirmationEmail } from "@/lib/newsletter/mailer"
import { checkRateLimit } from "@/lib/newsletter/rate-limit"

export async function POST(req: Request) {
  try {
    // Extract IP address for rate limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"
    
    // Allow 5 subscription attempts per minute per IP
    if (!checkRateLimit(ip, 5, 60000)) {
      return NextResponse.json(
        { error: "Too many subscription requests. Please try again in a minute." },
        { status: 429 }
      )
    }

    const body = await req.json()
    
    // 1. Zod Validation
    const parsed = subscribeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input parameters" },
        { status: 400 }
      )
    }

    const { email, locale, source, honeypot } = parsed.data

    // 2. Honeypot Spam Check
    if (honeypot) {
      console.warn(`Honeypot triggered for subscriber email: ${email}`)
      return NextResponse.json({ 
        status: "pending", 
        message: locale === "ar" ? "تم إرسال بريد التأكيد بنجاح." : "Verification email sent successfully." 
      })
    }

    // 3. Database Insertion
    const result = await createSubscriber(email, locale, source)
    if (!result) {
      return NextResponse.json(
        { error: locale === "ar" ? "فشل حفظ البيانات." : "Failed to record subscriber." },
        { status: 500 }
      )
    }

    const { subscriber, rawVerificationToken } = result

    // 4. Return immediately if already confirmed
    if (subscriber.status === "confirmed") {
      return NextResponse.json({
        status: "confirmed",
        message: locale === "ar" ? "أنت مشترك بالفعل في النشرة!" : "You are already subscribed to the newsletter!"
      })
    }

    // 5. Send double opt-in verification email
    const emailSent = await sendConfirmationEmail(
      subscriber.email,
      locale as "ar" | "en",
      rawVerificationToken,
      subscriber.unsubscribe_token
    )

    if (!emailSent) {
      return NextResponse.json(
        { error: locale === "ar" ? "فشل إرسال بريد التأكيد." : "Failed to dispatch verification email." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: "pending",
      message: locale === "ar" 
        ? "تم إرسال بريد تأكيد. يرجى مراجعة صندوق الوارد الخاص بك." 
        : "Verification email sent. Please check your inbox to confirm."
    })

  } catch (error: any) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
