import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"
import { getTranslations } from "next-intl/server"

// Schema validation
const subscribeSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email address"),
  locale: z.string().default("en"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = subscribeSchema.safeParse(body)

    if (!result.success) {
      const locale = body.locale || "en"
      const t = await getTranslations({ locale, namespace: "validation" })
      return NextResponse.json({ error: t("invalidEmail") }, { status: 400 })
    }

    const { email, locale } = result.data

    // Initialize Supabase admin client to bypass RLS for checking duplicates safely if needed
    // However, our policy allows INSERT for anyone, but we want to gracefully handle duplicates.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Supabase configuration is missing.")
      return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Attempt to insert
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([
        {
          email,
          locale,
          source: "website",
          status: "active",
        },
      ])

    if (error) {
      // Check for unique constraint violation (code 23505)
      if (error.code === "23505") {
        const t = await getTranslations({ locale, namespace: "validation" })
        return NextResponse.json({ error: t("duplicateEmail") || "Email already subscribed" }, { status: 409 })
      }

      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }

    // Success
    return NextResponse.json({ success: true, message: "Subscribed successfully" }, { status: 200 })

  } catch (error) {
    console.error("Newsletter API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
