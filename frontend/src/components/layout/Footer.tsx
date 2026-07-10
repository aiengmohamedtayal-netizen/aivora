import { useTranslations } from "next-intl"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { ArrowRight, Github, Instagram, Mail } from "lucide-react"
import { NewsletterForm } from "@/components/sections/NewsletterForm"

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="border-t border-border bg-background" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center gap-2">
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
            <p className="text-sm leading-6 text-muted-foreground max-w-xs">
              {t("supportingText")}
            </p>
            <div className="flex space-x-6 rtl:space-x-reverse">
              <a href="https://github.com/aiengmohamedtayal-netizen" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="https://www.instagram.com/aiivoraa" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
              <a href="mailto:aivoraaa@outlook.com" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Outlook</span>
                <Mail className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-medium leading-6 text-foreground">{t("services")}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/services/web-development" className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                      {t("links.webDev")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/ai-solutions" className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                      {t("links.aiIntegration")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/custom-software" className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                      {t("links.cloud")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/automation" className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                      {t("links.automation")}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-medium leading-6 text-foreground">{t("company")}</h3>
                <ul role="list" className="mt-6 space-y-4">
                  <li>
                    <Link href="/about" className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                      {t("links.about")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                      {t("services")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                      {t("links.blog")}
                    </Link>
                  </li>
                  <li>
                    <Link href="/intake" className="text-sm leading-6 text-muted-foreground hover:text-foreground">
                      {t("links.contact")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div className="mt-10 xl:mt-0">
                <h3 className="text-sm font-medium leading-6 text-foreground">{t("newsletter")}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("newsletterDesc")}
                </p>
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs leading-5 text-muted-foreground">
            &copy; {new Date().getFullYear()} Aivora. {t("rights")}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-foreground">
              {t("links.privacy")}
            </Link>
            <Link href="/terms-of-service" className="text-xs text-muted-foreground hover:text-foreground">
              {t("links.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
