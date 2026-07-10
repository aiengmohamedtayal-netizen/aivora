"use client"

import * as React from "react"
import Image from "next/image"
import { useTranslations, useLocale } from "next-intl"
import { Menu, X } from "lucide-react"
import { Link, usePathname } from "@/i18n/routing"
import { cn } from "@aivora/lib/utils"
import { Button } from "@aivora/ui/Button"
import { ThemeToggle } from "@aivora/ui/common/ThemeToggle"
import { LocaleSwitcher } from "@aivora/ui/common/LocaleSwitcher"
import { VisuallyHidden } from "@aivora/ui/VisuallyHidden"
import { motion } from "framer-motion"

export function Navbar() {
  const t = useTranslations("navigation")
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
    { href: "/services", label: t("capabilities") },
    { href: "/about", label: t("about") },
    { href: "/intelligence", label: t("intelligence") },
  ] as const

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm"
          : "bg-transparent border-transparent"
      )}
    >
      <div 
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-all duration-300",
          isScrolled ? "h-14" : "h-16"
        )}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="group flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md px-1"
            aria-label={locale === "ar" ? "الرئيسية أيفورا" : "Aivora Home"}
          >
            <div className="relative h-7 w-7 flex items-center justify-center transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Aivora Logo"
                width={28}
                height={28}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[1.15rem] font-bold tracking-tight">
              {locale === "ar" ? "أيفورا" : "Aivora"}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          <ul className="flex items-center gap-6 relative">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative text-[13px] font-medium transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md px-2 py-1.5",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-indicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 border-e border-border/40 pe-4">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
          <Button 
            asChild 
            variant="primary" 
            size="sm" 
            className="h-8 px-4 text-xs font-medium tracking-wide shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all"
          >
            <Link href="/intake">{t("contact")}</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <VisuallyHidden>{isMobileMenuOpen ? t("closeMenu") : t("menu")}</VisuallyHidden>
            {isMobileMenuOpen ? (
              <X className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Menu className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="bg-background/95 backdrop-blur-md border-b border-border/40 shadow-lg md:hidden"
        >
          <nav className="flex flex-col space-y-4 px-4 pb-6 pt-4" aria-label="Mobile Navigation">
            <ul className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50",
                        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground"
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="flex flex-col space-y-4 border-t border-border/40 pt-4">
              <div className="px-2">
                <LocaleSwitcher />
              </div>
              <div className="px-2">
                <Button asChild variant="primary" className="w-full h-10 shadow-md shadow-primary/20">
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
