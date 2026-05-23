import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Tenant, SubscriptionLog } from '@/types'
import TenantDetail from '@/components/admin/TenantDetail'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function TenantDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: tenant } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!tenant) notFound()

  const { data: logs } = await supabase
    .from('subscription_logs')
    .select('*')
    .eq('tenant_id', params.id)
    .order('created_at', { ascending: false })

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', params.id)
    .is('deleted_at', null)

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/tenants" className="text-gray-500 hover:text-gray-700">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">{(tenant as Tenant).name_ar}</h1>
      </div>
      <TenantDetail
        tenant={tenant as Tenant}
        logs={(logs ?? []) as SubscriptionLog[]}
        projectCount={projectCount ?? 0}
      />
    </div>
  )
}
