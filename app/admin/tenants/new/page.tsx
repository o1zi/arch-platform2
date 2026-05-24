'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plan } from '@/types'
import { ALL_SECTORS, Sector } from '@/lib/sectors'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function slugify(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
}

export default function NewTenantPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name_ar: '',
    slug: '',
    email: '',
    password: '',
    plan: 'basic' as Plan,
    sector: 'engineering' as Sector,
    subscription_start: new Date().toISOString().split('T')[0],
    subscription_end: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    notes: '',
  })

  function set(field: string, value: string) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'name_ar' && !prev.slug) {
        next.slug = slugify(value)
      }
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name_ar || !form.slug || !form.email || !form.password) {
      toast.error('يرجى ملء جميع الحقول الإلزامية')
      return
    }
    setSaving(true)

    // Call the API route that uses service role
    const res = await fetch('/api/admin/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()

    if (!res.ok) {
      toast.error(data.error ?? 'حدث خطأ')
      setSaving(false)
      return
    }

    toast.success('تم إنشاء المكتب بنجاح')
    router.push(`/admin/tenants/${data.tenantId}`)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/tenants" className="text-gray-500 hover:text-gray-700">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">إضافة مكتب جديد</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader><CardTitle>معلومات المكتب</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>اسم المكتب (عربي) *</Label>
                <Input value={form.name_ar} onChange={e => set('name_ar', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>الـ Slug (رابط المكتب) *</Label>
                <Input value={form.slug} onChange={e => set('slug', slugify(e.target.value))} dir="ltr" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>البريد الإلكتروني *</Label>
                <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} dir="ltr" required />
              </div>
              <div className="space-y-2">
                <Label>كلمة المرور المؤقتة *</Label>
                <Input type="text" value={form.password} onChange={e => set('password', e.target.value)} dir="ltr" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader><CardTitle>القطاع والاشتراك</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>القطاع</Label>
              <Select value={form.sector} onValueChange={(v) => v && set('sector', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ALL_SECTORS.map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">يحدد نوع الأعمال والتصنيفات — لا يمكن تغييره لاحقاً</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>الباقة</Label>
                <Select value={form.plan} onValueChange={(v) => v && set('plan', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="pro">Pro</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>تاريخ البداية</Label>
                <Input type="date" value={form.subscription_start} onChange={e => set('subscription_start', e.target.value)} dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>تاريخ النهاية</Label>
                <Input type="date" value={form.subscription_end} onChange={e => set('subscription_end', e.target.value)} dir="ltr" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>ملاحظة (رقم التحويل، اسم المحوّل)</Label>
              <Input value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mt-4">
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? 'جارٍ الإنشاء...' : 'إنشاء المكتب'}
          </Button>
          <Link href="/admin/tenants">
            <Button type="button" variant="outline">إلغاء</Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
