import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Building2, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    { count: total },
    { count: active },
    { count: expired },
    { count: expiringSoon },
    { data: recentTenants },
  ] = await Promise.all([
    supabase.from('tenants').select('*', { count: 'exact', head: true }),
    supabase.from('tenants').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('tenants').select('*', { count: 'exact', head: true }).eq('is_active', true).lt('subscription_end', new Date().toISOString()),
    supabase.from('tenants').select('*', { count: 'exact', head: true }).eq('is_active', true).gt('subscription_end', new Date().toISOString()).lt('subscription_end', new Date(Date.now() + 30 * 86400000).toISOString()),
    supabase.from('tenants').select('id, name_ar, slug, plan, is_active, subscription_end, created_at').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'إجمالي المكاتب', value: total ?? 0, icon: Building2, color: 'text-blue-600' },
    { label: 'المكاتب النشطة', value: active ?? 0, icon: CheckCircle, color: 'text-green-600' },
    { label: 'اشتراكات منتهية', value: expired ?? 0, icon: AlertTriangle, color: 'text-red-600' },
    { label: 'تنتهي خلال 30 يوم', value: expiringSoon ?? 0, icon: Clock, color: 'text-amber-600' },
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold">لوحة التحكم</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{label}</CardTitle>
              <Icon className={`h-4 w-4 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">آخر المكاتب المضافة</h2>
          <Link href="/admin/tenants" className="text-sm text-blue-600 hover:underline">عرض الكل</Link>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[420px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-right p-3 font-medium text-gray-600">المكتب</th>
                <th className="text-right p-3 font-medium text-gray-600 hidden sm:table-cell">الباقة</th>
                <th className="text-right p-3 font-medium text-gray-600">الحالة</th>
                <th className="text-right p-3 font-medium text-gray-600 hidden md:table-cell">الانتهاء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTenants?.map(t => {
                const days = t.subscription_end ? Math.ceil((new Date(t.subscription_end).getTime() - Date.now()) / 86400000) : null
                return (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <Link href={`/admin/tenants/${t.id}`} className="font-medium hover:text-blue-600">{t.name_ar}</Link>
                      <p className="text-xs text-gray-400" dir="ltr">{t.slug}</p>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <Badge variant="outline" className="capitalize">{t.plan}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={t.is_active ? (days && days > 0 ? 'default' : 'destructive') : 'secondary'}>
                        {!t.is_active ? 'موقوف' : days && days > 0 ? 'نشط' : 'منتهي'}
                      </Badge>
                    </td>
                    <td className="p-3 text-gray-500 hidden md:table-cell">
                      {t.subscription_end ? new Date(t.subscription_end).toLocaleDateString('ar-SA') : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
