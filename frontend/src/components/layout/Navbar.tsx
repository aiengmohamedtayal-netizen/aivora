"use client"

import * as React from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { Menu, X } from "lucide-react"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher"
import { VisuallyHidden } from "@/components/ui/VisuallyHidden"

export function Navbar() {
  const t = useTranslations("Navigation")
  const locale = useLocale()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navLinks = [
    { href: "/capabilities", label: t("capabilities") },
    { href: "/case-studies", label: t("caseStudies") },
    { href: "/about", label: t("about") },
    { href: "/intelligence", label: t("intelligence") },
  ] as const

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass-surface border-b"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
            aria-label={locale === "ar" ? "الرئيسية أيفورا" : "Aivora Home"}
          >
            <div className="relative h-8 w-8 flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Aivora Logo"
                width={32}
                height={32}
                className="object-contain"
              />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              {locale === "ar" ? "أيفورا" : "Aivora"}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 border-e border-border pe-4">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
          <Button asChild variant="primary" size="sm">
            <Link href="/intake">{t("contact")}</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <VisuallyHidden>{isMobileMenuOpen ? t("closeMenu") : t("menu")}</VisuallyHidden>
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="glass-surface border-b border-border md:hidden"
        >
          <nav className="flex flex-col space-y-4 px-4 pb-6 pt-4" aria-label="Mobile Navigation">
            <ul className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-secondary",
                        isActive ? "bg-secondary text-primary" : "text-muted-foreground"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="flex flex-col space-y-4 border-t border-border pt-4">
              <div className="px-3">
                <LocaleSwitcher />
              </div>
              <div className="px-3">
                <Button asChild variant="primary" className="w-full">
                  <Link href="/intake">{t("contact")}</Link>
                </Button>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
