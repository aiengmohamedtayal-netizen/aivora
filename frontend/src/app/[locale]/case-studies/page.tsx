import { getTranslations } from "next-intl/server"
import { CaseStudiesEditorial } from "@/components/sections/case-studies-editorial"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "CaseStudiesPage" })
  return {
    title: t("title"),
    description: t("subtitle"),
  }
}

export default function CaseStudiesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <CaseStudiesEditorial />
    </main>
  )
}
