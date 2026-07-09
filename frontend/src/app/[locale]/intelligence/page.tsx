import { getTranslations } from "next-intl/server"
import { IntelligenceWorkspace } from "@/components/sections/ai-terminal"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "intelligence" })
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default function IntelligencePage() {
  return (
    <main className="flex min-h-screen flex-col bg-background pt-16">
      <IntelligenceWorkspace />
    </main>
  )
}
