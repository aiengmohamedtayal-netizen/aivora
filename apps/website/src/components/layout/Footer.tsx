import { useTranslations } from "next-intl"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { NewsletterForm } from "@/components/sections/NewsletterForm"
import { SocialLinks } from "./SocialLinks"

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="border-t border-border bg-background relative z-10" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8 lg:pt-24 flex flex-col gap-16">
        
        {/* Main Footer Layout */}
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Logo & Description */}
          <div className="space-y-6 xl:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative h-8 w-8 flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="Aivora Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight">Aivora</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-xs">
              {t("supportingText")}
            </p>
          </div>

          {/* Links and Newsletter */}
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">{t("services")}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/services/web-development" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                      {t("links.webDev")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/ai-integration" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                      {t("links.aiIntegration")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/cloud-infrastructure" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                      {t("links.cloud")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/workflow-automation" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                      {t("links.automation")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-6 text-foreground">{t("company")}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/about" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                      {t("links.about")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                      {t("services")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/intake" className="text-sm leading-6 text-muted-foreground hover:text-foreground transition-colors">
                      {t("links.contact")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Newsletter Subscription */}
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold leading-6 text-foreground">{t("newsletter")}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
                {t("newsletterDesc")}
              </p>
              <div className="mt-2 max-w-sm">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>

        {/* Divider above Social Links */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-80" />

        {/* Centered Premium Social Links Component */}
        <SocialLinks />

        {/* Bottom Rights Bar */}
        <div className="border-t border-border/40 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} Aivora. {t("rights")}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t("links.privacy")}
            </Link>
            <Link href="/terms-of-service" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              {t("links.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
