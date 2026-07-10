import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges Tailwind CSS classes with conflict resolution.
 * Combines clsx's conditional class support with tailwind-merge's
 * deduplication to produce safe, composable className strings.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Resolves the base URL dynamically based on environment variables.
 * Fallbacks: NEXT_PUBLIC_SITE_URL -> NEXT_PUBLIC_VERCEL_URL -> local fallback.
 */
export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  return "http://localhost:3000"
}
