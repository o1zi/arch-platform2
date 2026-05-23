import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tenant } from '@/types'
import ProfileForm from '@/components/dashboard/ProfileForm'

export default async function ProfilePage() {
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
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">معلومات المكتب</h1>
        <p className="text-gray-500 mt-1">عدّل بيانات مكتبك التي تظهر على موقعك</p>
      </div>
      <ProfileForm tenant={tenant} />
    </div>
  )
}
