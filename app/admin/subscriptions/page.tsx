import { createClient } from '@/lib/supabase/server'
import { Tenant } from '@/types'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function AdminSubscriptionsPage() {
  const supabase = await createClient()

  // Get tenants expiring soon or already expired
  const { data: tenants } = await supabase
    .from('tenants')
    .select('id, name_ar, slug, plan, is_active, subscription_end')
    .eq('is_active', true)
    .lt('subscription_end', new Date(Date.now() + 30 * 86400000).toISOString())
    .order('subscription_end', { ascending: true })

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">متابعة الاشتراكات</h1>
        <p className="text-gray-500 mt-1">المكاتب التي اشتراكها منتهٍ أو سينتهي خلال 30 يوم</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        {!tenants?.length ? (
          <div className="p-12 text-center text-gray-400">لا توجد اشتراكات تحتاج متابعة</div>
        ) : (
          <table className="w-full text-sm min-w-[480px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-right p-3 font-medium text-gray-600">المكتب</th>
                <th className="text-right p-3 font-medium text-gray-600">الباقة</th>
                <th className="text-right p-3 font-medium text-gray-600">الانتهاء</th>
                <th className="text-right p-3 font-medium text-gray-600">الحالة</th>
                <th className="text-right p-3 font-medium text-gray-600">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(tenants as Tenant[]).map(t => {
                const days = t.subscription_end
                  ? Math.ceil((new Date(t.subscription_end).getTime() - Date.now()) / 86400000)
                  : null
                return (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="p-3">
                      <p className="font-medium">{t.name_ar}</p>
                      <p className="text-xs text-gray-400" dir="ltr">{t.slug}</p>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="capitalize">{t.plan}</Badge>
                    </td>
                    <td className="p-3 text-gray-600">
                      {t.subscription_end ? new Date(t.subscription_end).toLocaleDateString('ar-SA') : '—'}
                    </td>
                    <td className="p-3">
                      <Badge variant={days !== null && days <= 0 ? 'destructive' : 'secondary'}>
                        {days !== null && days <= 0 ? 'منتهي' : `ينتهي بعد ${days} يوم`}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Link href={`/admin/tenants/${t.id}`}>
                        <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">تجديد</Badge>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
