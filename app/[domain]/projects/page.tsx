import { notFound } from 'next/navigation'
import { getTenantByIdentifier } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { Project, CustomTheme } from '@/types'
import DynamicProjectsPage from '@/components/themes/DynamicProjectsPage'
import { getCustomTheme } from '@/lib/get-custom-theme'
import { getSectorConfig } from '@/lib/sectors'
import { DEFAULT_THEME_CONFIG } from '@/lib/default-theme'

export default async function TenantProjectsPage({ params }: { params: { domain: string } }) {
  const tenant = await getTenantByIdentifier(params.domain)
  if (!tenant) notFound()

  const supabase = await createClient()
  const [{ data: projects }, customTheme] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('tenant_id', tenant.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    getCustomTheme(tenant.id),
  ])

  const sectorConfig = getSectorConfig(tenant.sector)
  const config = (customTheme as CustomTheme | null)?.config ?? DEFAULT_THEME_CONFIG

  return (
    <DynamicProjectsPage
      tenant={tenant}
      projects={(projects ?? []) as Project[]}
      config={config}
      sectorConfig={sectorConfig}
    />
  )
}
