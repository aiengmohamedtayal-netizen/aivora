import { NextResponse } from "next/server"
import { getSubscriberStatus } from "@/lib/newsletter/database"

export async function GET(req: Request) {
  try {
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
