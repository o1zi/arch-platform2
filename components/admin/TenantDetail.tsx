'use client'

import { useState } from 'react'
import { Tenant, SubscriptionLog, Plan } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { FolderOpen, Palette, Globe, RefreshCw, Ban, PlayCircle } from 'lucide-react'

export default function TenantDetail({
  tenant: initial,
  logs: initialLogs,
  projectCount,
}: {
  tenant: Tenant
  logs: SubscriptionLog[]
  projectCount: number
}) {
  const supabase = createClient()
  const [tenant, setTenant] = useState(initial)
  const [logs, setLogs] = useState(initialLogs)
  const [renewDialog, setRenewDialog] = useState(false)
  const [renewForm, setRenewForm] = useState({
    plan: tenant.plan,
    subscription_end: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    notes: '',
  })

  const days = tenant.subscription_end
    ? Math.ceil((new Date(tenant.subscription_end).getTime() - Date.now()) / 86400000)
    : null

  async function runAction(action: 'activate' | 'suspend' | 'renew') {
    if (action === 'renew') {
      const { error } = await supabase
        .from('tenants')
        .update({
          plan: renewForm.plan,
          subscription_end: renewForm.subscription_end,
          is_active: true,
        })
        .eq('id', tenant.id)
      if (error) { toast.error('فشل التجديد'); return }

      const { data: log } = await supabase
        .from('subscription_logs')
        .insert({
          tenant_id: tenant.id,
          action: 'renewed',
          plan: renewForm.plan,
          notes: renewForm.notes || null,
        })
        .select()
        .single()

      setTenant(t => ({ ...t, plan: renewForm.plan as Plan, subscription_end: renewForm.subscription_end, is_active: true }))
      if (log) setLogs(prev => [log as SubscriptionLog, ...prev])
      toast.success('تم تجديد الاشتراك')
      setRenewDialog(false)
      return
    }

    const isActive = action === 'activate'
    const { error } = await supabase.from('tenants').update({ is_active: isActive }).eq('id', tenant.id)
    if (error) { toast.error('فشل تنفيذ الإجراء'); return }

    const { data: log } = await supabase
      .from('subscription_logs')
      .insert({ tenant_id: tenant.id, action: isActive ? 'activated' : 'suspended' })
      .select()
      .single()

    setTenant(t => ({ ...t, is_active: isActive }))
    if (log) setLogs(prev => [log as SubscriptionLog, ...prev])
    toast.success(isActive ? 'تم تفعيل الحساب' : 'تم إيقاف الحساب')
  }

  const actionLabels: Record<string, string> = {
    activated: 'تفعيل',
    renewed: 'تجديد',
    suspended: 'إيقاف',
    cancelled: 'إلغاء',
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500">الحالة</p>
            <Badge className="mt-1" variant={tenant.is_active ? (days && days > 0 ? 'default' : 'destructive') : 'secondary'}>
              {!tenant.is_active ? 'موقوف' : days && days > 0 ? 'نشط' : 'منتهي'}
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500 flex items-center gap-1"><FolderOpen className="h-3 w-3" /> المشاريع</p>
            <p className="text-2xl font-bold mt-1">{projectCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500 flex items-center gap-1"><Palette className="h-3 w-3" /> القالب</p>
            <p className="font-semibold mt-1 capitalize">{tenant.theme}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs text-gray-500 flex items-center gap-1"><Globe className="h-3 w-3" /> الباقة</p>
            <p className="font-semibold mt-1 capitalize">{tenant.plan}</p>
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card>
        <CardHeader><CardTitle>معلومات المكتب</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-y-3 text-sm">
          {[
            ['الاسم (عربي)', tenant.name_ar],
            ['الاسم (إنجليزي)', tenant.name_en ?? '—'],
            ['Slug', tenant.slug],
            ['الدومين الخاص', tenant.custom_domain ?? '—'],
            ['البريد الإلكتروني', tenant.email ?? '—'],
            ['الجوال', tenant.phone ?? '—'],
            ['بداية الاشتراك', tenant.subscription_start ? new Date(tenant.subscription_start).toLocaleDateString('ar-SA') : '—'],
            ['نهاية الاشتراك', tenant.subscription_end ? new Date(tenant.subscription_end).toLocaleDateString('ar-SA') : '—'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-gray-500 text-xs">{label}</p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader><CardTitle>إجراءات الاشتراك</CardTitle></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => setRenewDialog(true)} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            تجديد / تغيير الباقة
          </Button>
          {tenant.is_active ? (
            <Button variant="outline" onClick={() => runAction('suspend')} className="gap-2 text-red-600 hover:text-red-700 border-red-200">
              <Ban className="h-4 w-4" />
              إيقاف مؤقت
            </Button>
          ) : (
            <Button variant="outline" onClick={() => runAction('activate')} className="gap-2 text-green-600 hover:text-green-700 border-green-200">
              <PlayCircle className="h-4 w-4" />
              تفعيل
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Logs */}
      {logs.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">سجل الإجراءات</h2>
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right p-3 font-medium text-gray-600">الإجراء</th>
                  <th className="text-right p-3 font-medium text-gray-600">الباقة</th>
                  <th className="text-right p-3 font-medium text-gray-600">ملاحظة</th>
                  <th className="text-right p-3 font-medium text-gray-600">التاريخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map(log => (
                  <tr key={log.id}>
                    <td className="p-3"><Badge variant="outline">{actionLabels[log.action] ?? log.action}</Badge></td>
                    <td className="p-3 text-gray-600">{log.plan ?? '—'}</td>
                    <td className="p-3 text-gray-500">{log.notes ?? '—'}</td>
                    <td className="p-3 text-gray-500">{new Date(log.created_at).toLocaleDateString('ar-SA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Renew Dialog */}
      <Dialog open={renewDialog} onOpenChange={setRenewDialog}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>تجديد / تغيير الباقة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>الباقة</Label>
              <Select value={renewForm.plan} onValueChange={v => setRenewForm(f => ({ ...f, plan: v as Plan }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>تاريخ الانتهاء الجديد</Label>
              <Input type="date" value={renewForm.subscription_end} onChange={e => setRenewForm(f => ({ ...f, subscription_end: e.target.value }))} dir="ltr" />
            </div>
            <div className="space-y-2">
              <Label>ملاحظة (رقم التحويل)</Label>
              <Input value={renewForm.notes} onChange={e => setRenewForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setRenewDialog(false)}>إلغاء</Button>
              <Button onClick={() => runAction('renew')}>حفظ</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
