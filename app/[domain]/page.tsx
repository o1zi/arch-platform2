import { notFound } from 'next/navigation'
import { getTenantByIdentifier } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { Project, ContentBlock, CustomTheme, TenantStat, TenantTestimonial, TenantFAQ } from '@/types'
import DynamicThemeEngine from '@/components/themes/DynamicThemeEngine'
import { getSectorConfig } from '@/lib/sectors'
import { getCustomTheme } from '@/lib/get-custom-theme'
import { DEFAULT_THEME_CONFIG } from '@/lib/default-theme'

export default async function TenantHomePage({ params }: { params: { domain: string } }) {
  const tenant = await getTenantByIdentifier(params.domain)
  if (!tenant) notFound()

  const supabase = await createClient()

  const [projectsResult, blocksResult, customTheme, statsResult, testimonialsResult, faqsResult] = await Promise.all([
    supabase
      .from('projects')
      .select('*, images:project_images(*)')
      .eq('tenant_id', tenant.id)
      .is('deleted_at', null)
      .order('sort_order', { ascending: true }),
    supabase
      .from('tenant_content_blocks')
      .select('*')
      .eq('tenant_id', tenant.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    getCustomTheme(tenant.id),
    supabase
      .from('tenant_stats')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('sort_order', { ascending: true }),
    supabase
      .from('tenant_testimonials')
      .select('*')
      .eq('tenant_id', tenant.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('tenant_faqs')
      .select('*')
      .eq('tenant_id', tenant.id)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ])

  const allProjects = (projectsResult.data ?? []) as Project[]
  const featuredProjects = allProjects.filter(p => p.is_featured).slice(0, 6)

  const allBlocks = (blocksResult.data ?? []) as ContentBlock[]
  const services = allBlocks.filter(b => b.type === 'service')
  const features = allBlocks.filter(b => b.type === 'feature')

  const sectorConfig = getSectorConfig(tenant.sector)
  const stats = (statsResult.data ?? []) as TenantStat[]
  const testimonials = (testimonialsResult.data ?? []) as TenantTestimonial[]
  const faqs = (faqsResult.data ?? []) as TenantFAQ[]

  // استخدام القالب المخصص إن وُجد، وإلا القالب الافتراضي الفاخر
  const config = (customTheme as CustomTheme | null)?.config ?? DEFAULT_THEME_CONFIG

  return (
    <DynamicThemeEngine
      config={config}
      tenant={tenant}
      projects={allProjects}
      featuredProjects={featuredProjects}
      services={services}
      features={features}
      sectorConfig={sectorConfig}
      stats={stats}
      testimonials={testimonials}
      faqs={faqs}
    />
  )
}
