import { Resend } from "resend"
import { getConfirmationEmailHtml } from "@/emails/ConfirmationEmail"
import { getWelcomeEmailHtml } from "@/emails/WelcomeEmail"

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY in environment variables.")
  }
  return new Resend(apiKey)
}

const FROM_EMAIL = process.env.NEWSLETTER_FROM_EMAIL || "Aivora <onboarding@resend.dev>"
const REPLY_TO_EMAIL = process.env.NEWSLETTER_REPLY_TO || "aivoraaa@outlook.com"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://aivora-lac.vercel.app"

export async function sendConfirmationEmail(
  email: string,
  locale: "ar" | "en",
  verificationToken: string,
  unsubscribeToken: string
): Promise<boolean> {
  try {
    const resend = getResendClient()

    const confirmUrl = `${APP_URL}/${locale}/newsletter/confirm?token=${verificationToken}`
    const unsubscribeUrl = `${APP_URL}/${locale}/newsletter/unsubscribe?token=${unsubscribeToken}`

    const subject = locale === "ar" 
      ? "تأكيد اشتراكك في نشرة أيفورا البريدية" 
      : "Confirm your subscription to Aivora newsletter"

    const html = getConfirmationEmailHtml(confirmUrl, unsubscribeUrl, locale)

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO_EMAIL,
      subject,
      html,
    })

    if (response.error) {
      console.error("Resend confirmation email failed:", response.error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    return false
  }
}

export async function sendWelcomeEmail(
  email: string,
  locale: "ar" | "en",
  unsubscribeToken: string
): Promise<boolean> {
  try {
    const resend = getResendClient()

    const unsubscribeUrl = `${APP_URL}/${locale}/newsletter/unsubscribe?token=${unsubscribeToken}`

    const subject = locale === "ar" 
      ? "مرحباً بك في أيفورا 🎉" 
      : "Welcome to Aivora 🎉"

    const html = getWelcomeEmailHtml(unsubscribeUrl, locale)

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: REPLY_TO_EMAIL,
      subject,
      html,
    })

    if (response.error) {
      console.error("Resend welcome email failed:", response.error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return false
  }
}
