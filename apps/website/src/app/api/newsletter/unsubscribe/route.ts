import { NextResponse } from "next/server"
import { unsubscribeSubscriber } from "@/lib/newsletter/database"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const token = url.searchParams.get("token")
  
  const pathname = url.pathname
  const locale = pathname.startsWith("/en") ? "en" : "ar"

  if (!token) {
    return NextResponse.redirect(new URL(`/${locale}?newsletter=unsub-error`, url.origin))
  }

  // 1. Mark status as unsubscribed in DB
  const success = await unsubscribeSubscriber(token)
  if (!success) {
    return NextResponse.redirect(new URL(`/${locale}?newsletter=unsub-error`, url.origin))
  }

  // 2. Redirect with success message flag
  return NextResponse.redirect(new URL(`/${locale}?newsletter=unsubscribed`, url.origin))
}

export async function POST(req: Request) {
  try {
    const { tokenOrEmail } = await req.json()
    if (!tokenOrEmail) {
      return NextResponse.json({ error: "Missing identity token or email" }, { status: 400 })
    }

    const success = await unsubscribeSubscriber(tokenOrEmail)
    if (!success) {
      return NextResponse.json({ error: "Failed to process unsubscribe request" }, { status: 400 })
    }

    return NextResponse.json({ 
      status: "unsubscribed", 
      message: "Successfully unsubscribed from all marketing emails." 
    })
  } catch (error) {
    console.error("Newsletter unsubscribe API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
