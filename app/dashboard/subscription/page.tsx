import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tenant, SubscriptionLog } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, CreditCard, Calendar } from 'lucide-react'

function daysLeft(date: string | null): number {
  if (!date) return 0
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
}

export default async function SubscriptionPage() {
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

  const { data: logs } = await supabase
    .from('subscription_logs')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('created_at', { ascending: false })

  const days = daysLeft(tenant.subscription_end)
  const isActive = tenant.is_active && days > 0
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '966500000000'
  const waMessage = encodeURIComponent(`مرحباً، أريد تجديد اشتراكي. اسم المكتب: ${tenant.name_ar}`)
  const waUrl = `https://wa.me/${whatsapp}?text=${waMessage}`

  const planDetails = {
    basic: { label: 'أساسية', projects: '10 مشاريع', storage: '500MB', price: '1,200 ر.س / سنة' },
    pro: { label: 'احترافية', projects: '30 مشروعاً', storage: '2GB', price: '2,000 ر.س / سنة' },
    premium: { label: 'مميزة', projects: 'غير محدود', storage: '10GB', price: '3,500 ر.س / سنة' },
  }
  const plan = planDetails[tenant.plan]

  const actionLabels: Record<string, string> = {
    activated: 'تفعيل',
    renewed: 'تجديد',
    suspended: 'إيقاف',
    cancelled: 'إلغاء',
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">الاشتراك</h1>
        <p className="text-gray-500 mt-1">تفاصيل باقتك وسجل اشتراكاتك</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            الباقة الحالية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{plan.label}</h2>
            <Badge variant={isActive ? 'default' : 'destructive'}>
              {isActive ? 'نشط' : 'منتهي'}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="font-semibold">{plan.projects}</p>
              <p className="text-gray-500 text-xs mt-1">المشاريع</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="font-semibold">{plan.storage}</p>
              <p className="text-gray-500 text-xs mt-1">التخزين</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="font-semibold">{plan.price}</p>
              <p className="text-gray-500 text-xs mt-1">السعر</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            مدة الاشتراك
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tenant.subscription_start && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">تاريخ البدء</span>
              <span>{new Date(tenant.subscription_start).toLocaleDateString('ar-SA')}</span>
            </div>
          )}
          {tenant.subscription_end && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">تاريخ الانتهاء</span>
              <span className={days <= 0 ? 'text-red-600 font-semibold' : days <= 30 ? 'text-amber-600 font-semibold' : ''}>
                {new Date(tenant.subscription_end).toLocaleDateString('ar-SA')}
                {days > 0 && <span className="text-gray-400 text-xs mr-2">({days} يوم متبقٍ)</span>}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Renewal */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6 space-y-3">
          <p className="font-semibold">للتجديد أو الترقية تواصل معنا على واتساب</p>
          <p className="text-sm text-gray-600">سنرد عليك في أقرب وقت وسنجدد اشتراكك يدوياً بعد استلام التحويل.</p>
          <a href={waUrl} target="_blank" rel="noopener noreferrer">
            <Button className="gap-2 bg-green-600 hover:bg-green-700">
              <MessageCircle className="h-4 w-4" />
              تواصل على واتساب
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Logs */}
      {logs && logs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">سجل الاشتراكات</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right p-3 font-medium text-gray-600">الإجراء</th>
                  <th className="text-right p-3 font-medium text-gray-600">الباقة</th>
                  <th className="text-right p-3 font-medium text-gray-600 hidden sm:table-cell">ملاحظة</th>
                  <th className="text-right p-3 font-medium text-gray-600">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(logs as SubscriptionLog[]).map(log => (
                  <tr key={log.id}>
                    <td className="p-3">
                      <Badge variant="outline">{actionLabels[log.action] ?? log.action}</Badge>
                    </td>
                    <td className="p-3 text-gray-600">{log.plan ?? '—'}</td>
                    <td className="p-3 text-gray-500 hidden sm:table-cell">{log.notes ?? '—'}</td>
                    <td className="p-3 text-gray-500">{new Date(log.created_at).toLocaleDateString('ar-SA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
