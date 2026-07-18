import { NextResponse } from "next/server"
import { confirmSubscriber } from "@/lib/newsletter/database"
import { sendWelcomeEmail } from "@/lib/newsletter/mailer"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get("token")
  
  // Extract locale from referer or default to 'ar'
  const pathname = url.pathname
  const locale = pathname.startsWith("/en") ? "en" : "ar"

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}?newsletter=error`, url.origin))
  }

  // 1. Confirm subscriber in DB (hashes raw token and verifies it)
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

  // 3. Redirect back to website home page with verification success flag
  return NextResponse.redirect(new URL(`/${subscriber.locale || "ar"}?newsletter=confirmed`, url.origin))
}

export async function POST(req: Request) {
  try {
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
