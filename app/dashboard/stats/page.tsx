import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TenantStat } from '@/types'
import StatsManager from './StatsManager'

export default async function StatsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tenantUser } = await supabase
    .from('tenant_users')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()

  if (!tenantUser) redirect('/login')

  const { data: stats } = await supabase
    .from('tenant_stats')
    .select('*')
    .eq('tenant_id', tenantUser.tenant_id)
    .order('sort_order', { ascending: true })

  return (
    <StatsManager
      tenantId={tenantUser.tenant_id}
      initialStats={(stats ?? []) as TenantStat[]}
    />
  )
}
