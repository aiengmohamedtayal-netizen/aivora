import { getTranslations } from "next-intl/server"
import { EngineeringCulture } from "@/components/sections/engineering-culture"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "EngineeringCulturePage" })
  return {
    title: t("title"),
    description: t("manifesto"),
  }
}

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <EngineeringCulture />
    </main>
  )
}
