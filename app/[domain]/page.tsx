import { notFound } from 'next/navigation'
import { getTenantByIdentifier } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { Project, ContentBlock, CustomTheme, TenantStat, TenantTestimonial, TenantFAQ } from '@/types'
import { ThemeRenderer } from '@/components/themes/ThemeRenderer'
import { getSectorConfig } from '@/lib/sectors'

export default async function TenantHomePage({ params }: { params: { domain: string } }) {
  const tenant = await getTenantByIdentifier(params.domain)
  if (!tenant) notFound()

  const supabase = await createClient()

  // جلب المشاريع + الكتل + القالب المخصص (إن وجد) بالتوازي
  const tenantWithCustomTheme = tenant as typeof tenant & { custom_theme_id?: string | null }

  const [projectsResult, blocksResult, customThemeResult, statsResult, testimonialsResult, faqsResult] = await Promise.all([
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
    tenantWithCustomTheme.custom_theme_id
      ? supabase
          .from('custom_themes')
          .select('*')
          .eq('id', tenantWithCustomTheme.custom_theme_id)
          .eq('is_active', true)
          .single()
      : Promise.resolve({ data: null }),
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

  const customTheme = (customThemeResult.data ?? null) as CustomTheme | null
  const sectorConfig = getSectorConfig(tenant.sector)
  const stats = (statsResult.data ?? []) as TenantStat[]
  const testimonials = (testimonialsResult.data ?? []) as TenantTestimonial[]
  const faqs = (faqsResult.data ?? []) as TenantFAQ[]

  return (
    <ThemeRenderer
      tenant={tenant}
      projects={allProjects}
      featuredProjects={featuredProjects}
      services={services}
      features={features}
      customTheme={customTheme}
      sectorConfig={sectorConfig}
      stats={stats}
      testimonials={testimonials}
      faqs={faqs}
    />
  )
}
