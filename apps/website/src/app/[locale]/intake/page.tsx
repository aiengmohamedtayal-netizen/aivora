import { getTranslations } from "next-intl/server"
import { ProjectIntake } from "@/components/sections/project-intake"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "intake-portal" })
  return {
    title: t("seoTitle"),
    description: t("seoDescription"),
  }
}

export default function IntakePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <ProjectIntake />
    </main>
  )
}
