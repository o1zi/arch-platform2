import { notFound } from 'next/navigation'
import { getTenantByIdentifier } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { Project } from '@/types'
import { ThemeRenderer } from '@/components/themes/ThemeRenderer'

export default async function TenantHomePage({ params }: { params: { domain: string } }) {
  const tenant = await getTenantByIdentifier(params.domain)
  if (!tenant) notFound()

  const supabase = await createClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('*, images:project_images(*)')
    .eq('tenant_id', tenant.id)
    .is('deleted_at', null)
    .order('sort_order', { ascending: true })

  const allProjects = (projects ?? []) as Project[]
  const featuredProjects = allProjects.filter(p => p.is_featured).slice(0, 6)

  return (
    <ThemeRenderer
      tenant={tenant}
      projects={allProjects}
      featuredProjects={featuredProjects}
    />
  )
}
