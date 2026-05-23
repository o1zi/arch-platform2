import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tenant, PLAN_LIMITS } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FolderOpen, Palette, CreditCard, AlertTriangle } from 'lucide-react'

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const diff = new Date(dateStr).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default async function DashboardPage() {
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

  const { count: projectCount } = await supabase
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('tenant_id', tenant.id)
    .is('deleted_at', null)

  const daysLeft = daysUntil(tenant.subscription_end)
  const planLimits = PLAN_LIMITS[tenant.plan]

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">مرحباً، {tenant.name_ar}</h1>
        <p className="text-gray-500 mt-1">لوحة تحكم مكتبك الهندسي</p>
      </div>

      {/* Expiry warning */}
      {daysLeft !== null && daysLeft <= 30 && daysLeft > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            ينتهي اشتراكك خلال <strong>{daysLeft} يوم</strong>. تواصل معنا على واتساب للتجديد.
          </p>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">المشاريع</CardTitle>
            <FolderOpen className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{projectCount ?? 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              من أصل {planLimits.projects === Infinity ? 'غير محدود' : planLimits.projects}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">القالب</CardTitle>
            <Palette className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{tenant.theme}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">الباقة</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold capitalize">{tenant.plan}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">الاشتراك</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            {tenant.subscription_end ? (
              <>
                <Badge variant={daysLeft && daysLeft > 0 ? 'default' : 'destructive'}>
                  {daysLeft && daysLeft > 0 ? 'نشط' : 'منتهي'}
                </Badge>
                <p className="text-xs text-gray-500 mt-2">
                  ينتهي: {new Date(tenant.subscription_end).toLocaleDateString('ar-SA')}
                </p>
              </>
            ) : (
              <Badge variant="secondary">غير محدد</Badge>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
