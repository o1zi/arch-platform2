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

  // جلب القوالب العامة + القوالب الخاصة المخصصة لهذا المكتب معاً
  const [{ data: publicThemes }, { data: privateAssignments }] = await Promise.all([
    supabase
      .from('custom_themes')
      .select('*')
      .eq('is_active', true)
      .eq('visibility', 'public')
      .order('created_at', { ascending: false }),
    supabase
      .from('custom_theme_tenants')
      .select('custom_theme:custom_themes(*)')
      .eq('tenant_id', tenant.id),
  ])

  // القوالب العامة المتاحة حسب الباقة
  const availablePublic = ((publicThemes ?? []) as CustomTheme[]).filter(
    t => planOrder[t.plan_required] <= tenantPlanLevel
  )

  // القوالب الخاصة المخصصة لهذا المكتب (بغض النظر عن الباقة)
  const availablePrivate = (privateAssignments ?? [])
    .map((a: { custom_theme: unknown }) => a.custom_theme as CustomTheme | null)
    .filter((t): t is CustomTheme => t !== null && (t as CustomTheme).is_active === true)

  // دمج القائمتين بدون تكرار
  const allCustomThemeIds = new Set(availablePublic.map(t => t.id))
  const availableCustomThemes = [
    ...availablePublic,
    ...availablePrivate.filter(t => !allCustomThemeIds.has(t.id)),
  ]

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
