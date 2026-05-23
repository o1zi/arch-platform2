import { notFound } from 'next/navigation'
import { getTenantByIdentifier } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { Project } from '@/types'
import { ThemeProjectsRenderer } from '@/components/themes/ThemeProjectsRenderer'

export default async function TenantProjectsPage({ params }: { params: { domain: string } }) {
  const tenant = await getTenantByIdentifier(params.domain)
  if (!tenant) notFound()

  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('tenant_id', tenant.id)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })

  return <ThemeProjectsRenderer tenant={tenant} projects={(projects ?? []) as Project[]} />
}
