import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tenant, PLAN_LIMITS } from '@/types'
import ThemeSelector from '@/components/dashboard/ThemeSelector'

export default async function ThemePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tenantUser } = await supabase
    .from('tenant_users')
    .select('tenant_id, tenants(*)')
    .eq('user_id', user.id)
    .single()

  if (!tenantUser) redirect('/login')
  const tenant = (tenantUser as unknown as { tenants: Tenant }).tenants

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">اختيار القالب</h1>
        <p className="text-gray-500 mt-1">اختر شكل موقعك من القوالب المتاحة لباقتك</p>
      </div>
      <ThemeSelector tenant={tenant} availableThemes={PLAN_LIMITS[tenant.plan].themes} />
    </div>
  )
}
