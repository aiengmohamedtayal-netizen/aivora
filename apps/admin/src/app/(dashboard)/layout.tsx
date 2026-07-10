import { redirect } from 'next/navigation'
import { createClient } from '@aivora/lib/supabase/server'
import { Sidebar } from '@/components/admin/Sidebar'
import { Topbar } from '@/components/admin/Topbar'
import { CommandPalette } from '@/components/admin/CommandPalette'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Check RBAC role
  const { data: roles } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!roles || !['admin', 'editor', 'owner', 'marketer', 'sales', 'support'].includes(roles.role)) {
    // If not admin, editor, owner, marketer, sales, or support, block and redirect to login
    redirect('/login?error=unauthorized')
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <CommandPalette />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-8 pt-24 pl-72 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
