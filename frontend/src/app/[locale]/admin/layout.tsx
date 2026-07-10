import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/admin/Sidebar'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect(`/${locale}/admin/login`)
  }

  // Check RBAC
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!roles || !['admin', 'editor'].includes(roles.role)) {
    // If not admin/editor, redirect to home
    redirect(`/${locale}`)
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 pt-24 lg:pt-8 ml-64">
        {children}
      </main>
    </div>
  )
}
