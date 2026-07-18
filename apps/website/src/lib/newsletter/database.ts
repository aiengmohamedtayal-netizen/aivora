import { createClient } from "@supabase/supabase-js"
import crypto from "crypto"

// Helper function to hash a token securely
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex")
}

// Generate a random secure token
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

// Initialize server-side Supabase client with service role
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase configuration in environment variables.")
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  })
}

export interface Subscriber {
  id: string
  email: string
  status: "pending" | "confirmed" | "unsubscribed"
  locale: string
  source: string
  unsubscribe_token: string
  created_at: string
  confirmed_at?: string
  last_email_sent?: string
  tags: string[]
}

// 1. Create a new subscriber with status: pending and verification token hash
export async function createSubscriber(
  email: string,
  locale: string = "ar",
  source: string = "website"
): Promise<{ subscriber: Subscriber; rawVerificationToken: string } | null> {
  const supabase = getAdminClient()
  const cleanEmail = email.toLowerCase().trim()

  // Generate secure tokens
  const rawVerificationToken = generateSecureToken()
  const verification_token_hash = hashToken(rawVerificationToken)
  const unsubscribe_token = crypto.randomUUID()

  // Check if subscriber already exists
  const { data: existing } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .eq("email", cleanEmail)
    .maybeSingle()

  if (existing) {
    // If already confirmed, return it (we don't need to re-verify)
    if (existing.status === "confirmed") {
      return { subscriber: existing as Subscriber, rawVerificationToken: "" }
    }
    
    // If pending or unsubscribed, update verification token and reset status to pending
    const { data: updated, error } = await supabase
      .from("newsletter_subscribers")
      .update({
        status: "pending",
        verification_token_hash,
        unsubscribe_token,
        locale,
        source,
        created_at: new Date().toISOString()
      })
      .eq("email", cleanEmail)
      .select()
      .single()

    if (error) {
      console.error("Error updating subscriber details:", error)
      return null
    }

    return { subscriber: updated as Subscriber, rawVerificationToken }
  }

  // Otherwise, insert new record
  const { data: inserted, error } = await supabase
    .from("newsletter_subscribers")
    .insert({
      email: cleanEmail,
      status: "pending",
      verification_token_hash,
      unsubscribe_token,
      locale,
      source,
      tags: JSON.stringify([])
    })
    .select()
    .single()

  if (error) {
    console.error("Error inserting subscriber:", error)
    return null
  }

  return { subscriber: inserted as Subscriber, rawVerificationToken }
}

// 2. Confirm subscription with the hashed verification token
export async function confirmSubscriber(rawToken: string): Promise<Subscriber | null> {
  const supabase = getAdminClient()
  const hashed = hashToken(rawToken)

  // Find subscriber with matching verification_token_hash
  const { data: subscriber, error: findError } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .eq("verification_token_hash", hashed)
    .maybeSingle()

  if (findError || !subscriber) {
    console.warn("Invalid or expired verification token.")
    return null
  }

  // Update status to confirmed
  const { data: updated, error: updateError } = await supabase
    .from("newsletter_subscribers")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      verification_token_hash: null // Clear verification hash once confirmed
    })
    .eq("id", subscriber.id)
    .select()
    .single()

  if (updateError) {
    console.error("Error confirming subscriber:", updateError)
    return null
  }

  return updated as Subscriber
}

// 3. Unsubscribe based on unsubscribe token or email
export async function unsubscribeSubscriber(tokenOrEmail: string): Promise<boolean> {
  const supabase = getAdminClient()
  const isEmail = tokenOrEmail.includes("@")

  const query = supabase.from("newsletter_subscribers").update({
    status: "unsubscribed",
    verification_token_hash: null
  })

  const { error } = isEmail
    ? await query.eq("email", tokenOrEmail.toLowerCase().trim())
    : await query.eq("unsubscribe_token", tokenOrEmail)

  if (error) {
    console.error("Error unsubscribing user:", error)
    return false
  }

  return true
}

// 4. Get current status
export async function getSubscriberStatus(email: string): Promise<string | null> {
  const supabase = getAdminClient()
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("status")
    .eq("email", email.toLowerCase().trim())
    .maybeSingle()

  if (error || !data) return null
  return data.status
}
