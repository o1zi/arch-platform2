import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tenant } from '@/types'
import DomainSettings from '@/components/dashboard/DomainSettings'

export default async function DomainPage() {
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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">إعدادات الدومين</h1>
        <p className="text-gray-500 mt-1">رابط موقعك والدومين الخاص</p>
      </div>
      <DomainSettings tenant={tenant} />
    </div>
  )
}
