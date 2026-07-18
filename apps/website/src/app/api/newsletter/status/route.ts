import { NextResponse } from "next/server"
import { getSubscriberStatus } from "@/lib/newsletter/database"
import { checkRateLimit } from "@/lib/newsletter/rate-limit"

export async function GET(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1"
    if (!checkRateLimit(ip, 10, 60000)) {
      return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 })
    }

    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Missing email parameter" }, { status: 400 })
    }

    const status = await getSubscriberStatus(email)
    
    return NextResponse.json({ 
      email, 
      status: status || "not_found" 
    })
  } catch (error) {
    console.error("Newsletter status API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
