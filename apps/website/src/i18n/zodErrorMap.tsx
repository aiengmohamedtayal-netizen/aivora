import { z } from "zod"
import { useTranslations } from "next-intl"

/**
 * Creates a localized Zod error map using next-intl.
 * This should be initialized at the layout or component level where
 * the hook `useTranslations` can be called.
 */
export function useZodErrorMap() {
  const t = useTranslations("Validation")

  const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    let message: string

    switch (issue.code) {
      case z.ZodIssueCode.invalid_type:
        if (issue.received === "undefined") {
          message = t("required")
        } else {
          message = ctx.defaultError
        }
        break
      case z.ZodIssueCode.invalid_string:
        if (issue.validation === "email") {
          message = t("email")
        } else if (issue.validation === "url") {
          message = t("url")
        } else {
          message = ctx.defaultError
        }
        break
      case z.ZodIssueCode.too_small:
        if (issue.type === "string") {
          message = t("minLength", { min: Number(issue.minimum) })
        } else {
          message = ctx.defaultError
        }
        break
      case z.ZodIssueCode.too_big:
        if (issue.type === "string") {
          message = t("maxLength", { max: Number(issue.maximum) })
        } else {
          message = ctx.defaultError
        }
        break
      default:
        message = ctx.defaultError
    }

    return { message }
  }

  return customErrorMap
}

/**
 * Client-side Zod validation configuration provider component.
 */
export function ZodErrorProvider({ children }: { children: React.ReactNode }) {
  const errorMap = useZodErrorMap()
  z.setErrorMap(errorMap)

  return <>{children}</>
}
