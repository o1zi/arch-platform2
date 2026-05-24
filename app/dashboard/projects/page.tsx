import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tenant, Project, PLAN_LIMITS } from '@/types'
import { getSectorConfig } from '@/lib/sectors'
import ProjectsManager from '@/components/dashboard/ProjectsManager'

export default async function ProjectsPage() {
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

  const { data: projects } = await supabase
    .from('projects')
    .select('*, images:project_images(*)')
    .eq('tenant_id', tenant.id)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })

  const sectorConfig = getSectorConfig(tenant.sector)
  const limit = PLAN_LIMITS[tenant.plan].projects

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">{sectorConfig.portfolioLabel}</h1>
        <p className="text-gray-500 mt-1">
          {projects?.length ?? 0} / {limit === Infinity ? '∞' : limit} {sectorConfig.portfolioItemLabel}
        </p>
      </div>
      <ProjectsManager
        tenant={tenant}
        projects={(projects ?? []) as Project[]}
        sectorConfig={sectorConfig}
      />
    </div>
  )
}
