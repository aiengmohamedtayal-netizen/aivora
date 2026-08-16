import { NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

const intlMiddleware = createMiddleware(routing)

export default function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/maintenance") {
    return NextResponse.next()
  }

  if (
    process.env.MAINTENANCE_MODE === "true" &&
    request.nextUrl.pathname !== "/maintenance" &&
    !request.nextUrl.pathname.startsWith("/_next") &&
    !request.nextUrl.pathname.startsWith("/api") &&
    !request.nextUrl.pathname.startsWith("/_vercel") &&
    !request.nextUrl.pathname.includes(".")
  ) {
    return NextResponse.rewrite(new URL("/maintenance", request.url))
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    "/",
    "/(ar|en)/:path*",
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
}
