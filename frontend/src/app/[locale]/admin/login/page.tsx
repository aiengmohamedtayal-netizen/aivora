"use client"

import { use, useState } from "react"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"

export default function AdminLoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(`/${locale}/admin`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 bg-card rounded-2xl border border-border/50 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">Aivora OS</h1>
        <p className="text-center text-muted-foreground mb-8">Sign in to the Admin Dashboard</p>

        {error && (
          <div className="p-3 mb-6 bg-destructive/10 text-destructive border border-destructive/20 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input 
            label="Email Address" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-background"
          />
          <Input 
            label="Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-background"
          />
          
          <Button type="submit" className="w-full h-12 mt-4" disabled={loading} loading={loading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}
