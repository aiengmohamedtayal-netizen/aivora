"use client"

import { useState, Suspense } from "react"
import { createClient } from "@aivora/lib/supabase/client"
import { Input } from "@aivora/ui/Input"
import { Button } from "@aivora/ui/Button"
import { useRouter, useSearchParams } from "next/navigation"

function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlError = searchParams.get("error")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const supabase = createClient()
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError || !authData.user) {
      setError(authError?.message || "Invalid login credentials")
      setLoading(false)
      return
    }

    // Check role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', authData.user.id)
      .single()

    if (roleError || !roleData || !['admin', 'editor', 'owner', 'marketer', 'sales', 'support'].includes(roleData.role)) {
      await supabase.auth.signOut()
      setError("Unauthorized. Admins only.")
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 bg-card rounded-2xl border border-border shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">Aivora OS</h1>
        <p className="text-center text-muted-foreground mb-8 text-sm">Sign in to Aivora Business Operations</p>

        {(error || urlError) && (
          <div className="p-3 mb-6 bg-destructive/10 text-destructive border border-destructive/20 rounded-lg text-sm text-center">
            {error || (urlError === "unauthorized" ? "Access denied. Admins only." : "An error occurred.")}
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
          
          <Button type="submit" className="w-full h-11 mt-4" disabled={loading} loading={loading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background text-sm text-muted-foreground">Loading Aivora OS...</div>}>
      <AdminLoginForm />
    </Suspense>
  )
}

