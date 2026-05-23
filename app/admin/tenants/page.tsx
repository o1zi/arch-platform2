import { createClient } from '@/lib/supabase/server'
import { Tenant } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function AdminTenantsPage() {
  const supabase = await createClient()
  const { data: tenants } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">المكاتب</h1>
          <p className="text-gray-500 mt-1">{tenants?.length ?? 0} مكتب مسجل</p>
        </div>
        <Link href="/admin/tenants/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            مكتب جديد
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-right p-3 font-medium text-gray-600">المكتب</th>
              <th className="text-right p-3 font-medium text-gray-600 hidden sm:table-cell">الباقة</th>
              <th className="text-right p-3 font-medium text-gray-600">الحالة</th>
              <th className="text-right p-3 font-medium text-gray-600 hidden lg:table-cell">انتهاء الاشتراك</th>
              <th className="text-right p-3 font-medium text-gray-600">إجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(tenants as Tenant[])?.map(t => {
              const days = t.subscription_end ? Math.ceil((new Date(t.subscription_end).getTime() - Date.now()) / 86400000) : null
              const statusLabel = !t.is_active ? 'موقوف' : days && days > 0 ? 'نشط' : 'منتهي'
              const statusVariant = !t.is_active ? 'secondary' : days && days > 0 ? 'default' : 'destructive'
              return (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <p className="font-medium">{t.name_ar}</p>
                    <p className="text-xs text-gray-400" dir="ltr">{t.slug}</p>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    <Badge variant="outline" className="capitalize">{t.plan}</Badge>
                  </td>
                  <td className="p-3">
                    <Badge variant={statusVariant}>{statusLabel}</Badge>
                  </td>
                  <td className="p-3 text-gray-500 hidden lg:table-cell">
                    {t.subscription_end ? (
                      <span className={days && days <= 30 && days > 0 ? 'text-amber-600 font-medium' : ''}>
                        {new Date(t.subscription_end).toLocaleDateString('ar-SA')}
                        {days !== null && days > 0 && <span className="text-gray-400 text-xs mr-1">({days}ي)</span>}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/tenants/${t.id}`}>
                      <Button size="sm" variant="outline">تفاصيل</Button>
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
