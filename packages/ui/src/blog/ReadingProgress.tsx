"use client"
import { useEffect, useState } from "react"

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const updateProgress = () => {
      const currentProgress = window.scrollY
      const scrollHeight = document.body.scrollHeight - window.innerHeight
      if (scrollHeight) {
        setProgress(Number((currentProgress / scrollHeight).toFixed(2)) * 100)
      }
    }
    window.addEventListener("scroll", updateProgress)
    return () => window.removeEventListener("scroll", updateProgress)
  }, [])
  return <div className="fixed top-0 left-0 h-1 bg-primary z-50 transition-all duration-150" style={{ width: `${progress}%` }} />
}