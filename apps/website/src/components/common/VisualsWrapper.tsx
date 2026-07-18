"use client"

import React from "react"
import dynamic from "next/dynamic"

// Lazy load client-only interactive components with ssr: false
const GlobalWaveBackground = dynamic(
  () => import("@aivora/ui/common/GlobalWaveBackground").then(m => m.GlobalWaveBackground),
  { ssr: false }
)

const AivoraAssistant = dynamic(
  () => import("@aivora/ui/common/AivoraAssistant").then(m => m.AivoraAssistant),
  { ssr: false }
)

export function VisualsWrapper() {
  return (
    <>
      <GlobalWaveBackground />
      <AivoraAssistant />
    </>
  )
}
