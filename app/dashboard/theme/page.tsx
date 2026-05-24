import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tenant, PLAN_LIMITS, CustomTheme } from '@/types'
import ThemeSelector from '@/components/dashboard/ThemeSelector'

export default async function ThemePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tenantUser } = await supabase
    .from('tenant_users')
    .select('tenant_id, tenants(*)')
    .eq('user_id', user.id)
    .single()

  if (!tenantUser) redirect('/login')
  const tenant = (tenantUser as unknown as { tenants: Tenant & { custom_theme_id?: string | null } }).tenants

  const planOrder = { basic: 0, pro: 1, premium: 2 }
  const tenantPlanLevel = planOrder[tenant.plan]

  // ١. القوالب العامة — visibility = 'public' ومناسبة للباقة
  const [{ data: publicThemes }, { data: assignedThemes }] = await Promise.all([
    supabase
      .from('custom_themes')
      .select('*')
      .eq('is_active', true)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false }),

    // ٢. القوالب الخاصة المخصصة لهذا المكتب تحديداً
    supabase
      .from('custom_theme_tenants')
      .select('custom_theme_id')
      .eq('tenant_id', tenant.id),
  ])

  const availablePublic = ((publicThemes ?? []) as CustomTheme[]).filter(
    t => planOrder[t.plan_required] <= tenantPlanLevel
  )

  // جلب تفاصيل القوالب الخاصة المخصصة (بعد معرفة الـ IDs)
  const privateThemeIds = (assignedThemes ?? []).map((a: { custom_theme_id: string }) => a.custom_theme_id)
  const publicIds = new Set(availablePublic.map(t => t.id))
  // نستثني ما هو موجود في العامة تجنباً للتكرار
  const newPrivateIds = privateThemeIds.filter(id => !publicIds.has(id))

  let availablePrivate: CustomTheme[] = []
  if (newPrivateIds.length > 0) {
    const { data: privateThemes } = await supabase
      .from('custom_themes')
      .select('*')
      .in('id', newPrivateIds)
      .eq('is_active', true)
    availablePrivate = (privateThemes ?? []) as CustomTheme[]
  }

  const availableCustomThemes = [...availablePublic, ...availablePrivate]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">اختيار القالب</h1>
        <p className="text-gray-500 mt-1">اختر شكل موقعك من القوالب المتاحة لباقتك</p>
      </div>
      <ThemeSelector
        tenant={tenant}
        availableThemes={PLAN_LIMITS[tenant.plan].themes}
        customThemes={availableCustomThemes}
      />
    </div>
  )
}
