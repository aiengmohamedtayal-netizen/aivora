import { z } from "zod"

export const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  locale: z.enum(["ar", "en"]).default("ar"),
  source: z.string().default("website"),
  honeypot: z.string().max(0, "Spam detected").optional() // should be empty
})

export type SubscribeInput = z.infer<typeof subscribeSchema>
