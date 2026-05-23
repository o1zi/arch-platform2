export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Tenant } from '@/types'
import DashboardSidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: tenantUser } = await supabase
    .from('tenant_users')
    .select('tenant_id, role, tenants(*)')
    .eq('user_id', user.id)
    .single()

  if (!tenantUser) redirect('/login')

  const tenant = (tenantUser as unknown as { tenants: Tenant }).tenants

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      <DashboardSidebar tenant={tenant} />
      <main className="flex-1 p-4 md:p-6 overflow-auto pt-[72px] md:pt-6">
        {children}
      </main>
    </div>
  )
}
