import { getTranslations } from "next-intl/server"
import { ProjectIntake } from "@/components/sections/project-intake"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "IntakePortalPage" })
  return {
    title: t("title"),
    description: t("subtitle"),
  }
}

export default function IntakePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <ProjectIntake />
    </main>
  )
}
