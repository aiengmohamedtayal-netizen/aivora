import { getTranslations } from "next-intl/server"
import { SectionConversion } from "@/components/sections/conversion"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "contact" })
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  }
}

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col bg-background pt-16">
      <SectionConversion />
    </main>
  )
}
