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

  // جلب القوالب المخصصة النشطة المتاحة لباقة هذا المكتب
  const planOrder = { basic: 0, pro: 1, premium: 2 }
  const tenantPlanLevel = planOrder[tenant.plan]

  const { data: customThemes } = await supabase
    .from('custom_themes')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  // فلترة القوالب حسب الباقة: المكتب يرى القوالب التي تناسب باقته أو أقل
  const availableCustomThemes = ((customThemes ?? []) as CustomTheme[]).filter(
    t => planOrder[t.plan_required] <= tenantPlanLevel
  )

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
