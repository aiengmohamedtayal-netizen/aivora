import { getTranslations } from "next-intl/server"
import { CaseStudiesEditorial } from "@/components/sections/case-studies-editorial"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "case-studies" })
  return {
    title: t("headline"),
    description: t("subheadline"),
  }
}

export default function CaseStudiesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <CaseStudiesEditorial />
    </main>
  )
}
