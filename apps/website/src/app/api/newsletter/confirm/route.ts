import { NextResponse } from "next/server"
import { confirmSubscriber } from "@/lib/newsletter/database"
import { sendWelcomeEmail } from "@/lib/newsletter/mailer"
import { checkRateLimit } from "@/lib/newsletter/rate-limit"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get("token")
  
  const pathname = url.pathname
  const locale = pathname.startsWith("/en") ? "en" : "ar"

  const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"
  if (!checkRateLimit(ip, 10, 60000)) {
    return NextResponse.redirect(new URL(`/${locale}?newsletter=error`, url.origin))
  }

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}?newsletter=error`, url.origin))
  }

  // 1. Confirm subscriber in DB
  const subscriber = await confirmSubscriber(token)
  if (!subscriber) {
    return NextResponse.redirect(new URL(`/${locale}?newsletter=error`, url.origin))
  }

  // 2. Dispatch onboarding Welcome email
  await sendWelcomeEmail(
    subscriber.email,
    subscriber.locale as "ar" | "en",
    subscriber.unsubscribe_token
  )

  // 3. Redirect back to website home page
  return NextResponse.redirect(new URL(`/${subscriber.locale || "ar"}?newsletter=confirmed`, url.origin))
}

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"
    if (!checkRateLimit(ip, 10, 60000)) {
      return NextResponse.json({ error: "Too many confirmation attempts. Please retry shortly." }, { status: 429 })
    }

    const { token } = await req.json()
    if (!token) {
      return NextResponse.json({ error: "Missing verification token" }, { status: 400 })
    }

    const subscriber = await confirmSubscriber(token)
    if (!subscriber) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    await sendWelcomeEmail(
      subscriber.email,
      subscriber.locale as "ar" | "en",
      subscriber.unsubscribe_token
    )

    return NextResponse.json({ 
      status: "confirmed", 
      message: "Subscription successfully confirmed!" 
    })
  } catch (error) {
    console.error("Newsletter confirm API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
