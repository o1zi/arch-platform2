import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { CustomTheme, Tenant } from '@/types'
import Link from 'next/link'
import { ArrowRight, Paintbrush } from 'lucide-react'
import ThemeVisibilityManager from './ThemeVisibilityManager'

export default async function AdminThemeDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const [{ data: theme }, { data: allTenants }, { data: assignments }] = await Promise.all([
    supabase.from('custom_themes').select('*').eq('id', params.id).single(),
    supabase.from('tenants').select('id, name_ar, slug, plan, is_active').order('name_ar'),
    supabase.from('custom_theme_tenants')
      .select('*, tenant:tenants(id, name_ar, slug, plan, is_active)')
      .eq('custom_theme_id', params.id)
      .order('assigned_at', { ascending: false }),
  ])

  if (!theme) notFound()

  const assignedTenantIds = new Set((assignments ?? []).map((a: { tenant_id: string }) => a.tenant_id))

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Link href="/admin/themes" className="text-gray-500 hover:text-gray-700">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{(theme as CustomTheme).name_ar}</h1>
            <p className="text-gray-500 text-sm">إدارة الرؤية وتخصيص المشتركين</p>
          </div>
        </div>
        <Link
          href={`/admin/themes/builder?edit=${params.id}`}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Paintbrush className="h-4 w-4" />
          تعديل بالمحرر المرئي
        </Link>
      </div>

      <ThemeVisibilityManager
        theme={theme as CustomTheme}
        allTenants={(allTenants ?? []) as Tenant[]}
        assignments={(assignments ?? []) as Array<{ id: string; tenant_id: string; assigned_at: string; tenant: Tenant }>}
        assignedTenantIds={Array.from(assignedTenantIds)}
      />
    </div>
  )
}
