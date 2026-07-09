import { getTranslations } from "next-intl/server"
import { CapabilitiesGrid } from "@/components/sections/capabilities-grid"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "capabilities" })
  return {
    title: t("title"),
    description: t("subtitle"),
  }
}

export default function CapabilitiesPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <CapabilitiesGrid />
    </main>
  )
}
