import { notFound } from 'next/navigation'
import { getTenantByIdentifier } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { Project, ProjectImage } from '@/types'
import { getCustomTheme } from '@/lib/get-custom-theme'
import { getSectorConfig } from '@/lib/sectors'
import ProjectDetailClient from './ProjectDetailClient'

export default async function ProjectDetailPage({ params }: { params: { domain: string; id: string } }) {
  const tenant = await getTenantByIdentifier(params.domain)
  if (!tenant) notFound()

  const supabase = await createClient()
  const [{ data: project }, customTheme] = await Promise.all([
    supabase
      .from('projects')
      .select('*, images:project_images(*)')
      .eq('id', params.id)
      .eq('tenant_id', tenant.id)
      .is('deleted_at', null)
      .single(),
    getCustomTheme(tenant.id),
  ])

  if (!project) notFound()
  const p = project as Project & { images: ProjectImage[] }
  const images = (p.images ?? []).sort((a, b) => a.sort_order - b.sort_order)
  const sectorConfig = getSectorConfig(tenant.sector)

  const colors = customTheme?.config?.colors
  const bgColor      = colors?.background ?? '#ffffff'
  const primaryColor = colors?.primary    ?? '#0f0f0f'
  const accentColor  = colors?.accent     ?? '#3b82f6'
  const textColor    = colors?.text       ?? '#111111'
  const textLight    = colors?.textLight  ?? '#666666'
  const secondaryBg  = colors?.secondary  ?? '#f8f8f8'
  const headingFont  = customTheme?.config?.fonts?.heading
  const bodyFont     = customTheme?.config?.fonts?.body

  const themeFont = (tenant.theme === 'classic' || tenant.theme === 'luxury')
    ? 'Georgia, serif'
    : 'inherit'

  const waPhone = tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null

  return (
    <ProjectDetailClient
      tenant={tenant}
      project={p}
      images={images}
      sectorConfig={sectorConfig}
      customTheme={customTheme}
      bgColor={bgColor}
      primaryColor={primaryColor}
      accentColor={accentColor}
      textColor={textColor}
      textLight={textLight}
      secondaryBg={secondaryBg}
      headingFont={headingFont ?? null}
      bodyFont={bodyFont ?? null}
      themeFont={themeFont}
      waUrl={waUrl}
    />
  )
}
