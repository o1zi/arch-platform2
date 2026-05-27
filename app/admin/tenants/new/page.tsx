'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SectionHeader, Card, Field, Input, Textarea, Select, Btn, IconBtn, Alert } from '@/components/ui/atoms'
import { PLANS, fmtSAR } from '@/lib/data'
import { sbGetAllTenants } from '@/lib/api'

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
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const today = new Date().toISOString().split('T')[0]
  const yearLater = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]

  const [form, setForm] = useState({
    name_ar: '',
    slug: '',
    email: '',
    password: '',
    phone: '',
    address_ar: '',
    plan: 'basic' as string,
    subscription_start: today,
    subscription_end: yearLater,
    notes: '',
  })

  const set = (field: string, value: string) => {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'name_ar' && !prev.slug) {
        next.slug = slugify(value)
      }
      return next
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name_ar || !form.slug || !form.email || !form.password) {
      setError('يرجى ملء جميع الحقول الإلزامية')
      return
    }

    try {
      const result = await sbGetAllTenants()
      if (result?.data) {
        const exists = (result.data as Record<string, unknown>[]).find(
          r => (r.slug as string) === form.slug
        )
        if (exists) {
          setError('هذا الرابط مستخدم بالفعل، اختر رابطاً آخر')
          return
        }
      }
    } catch { /* proceed */ }

    setSaving(true)
    try {
      const res = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'حدث خطأ')
        setSaving(false)
        return
      }

      setSuccess('تم إنشاء المكتب بنجاح')
      setTimeout(() => router.push(`/admin/tenants/${data.tenantId}`), 800)
    } catch {
      setError('حدث خطأ في الاتصال')
      setSaving(false)
    }
  }

  return (
    <div className="wj-anim-in" style={{ maxWidth: 700 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <IconBtn icon="arrowLeft" title="رجوع" onClick={() => router.push('/admin/tenants')} />
        <SectionHeader title="إضافة مكتب جديد" sub="إنشاء حساب مكتب جديد في المنصة" />
      </div>

      {error && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone="danger" icon="warn">{error}</Alert>
        </div>
      )}
      {success && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone="success" icon="check">{success}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <Card pad>
          <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
            معلومات المكتب
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="max-sm:grid-cols-[1fr]">
              <Field label="اسم المكتب (عربي) *" error={!form.name_ar && saving ? 'مطلوب' : undefined}>
                <Input
                  value={form.name_ar}
                  onChange={e => set('name_ar', e.target.value)}
                  placeholder="مكتب الفارابي للاستشارات الهندسية"
                  required
                />
              </Field>
              <Field label="الرابط (Slug) *" hint="يُولّد تلقائياً من الاسم، يمكن تعديله" error={!form.slug && saving ? 'مطلوب' : undefined}>
                <Input
                  value={form.slug}
                  onChange={e => set('slug', slugify(e.target.value))}
                  placeholder="alfarabi"
                  style={{ direction: 'ltr', fontFamily: 'var(--font-mono)' }}
                  required
                />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="max-sm:grid-cols-[1fr]">
              <Field label="البريد الإلكتروني *" error={!form.email && saving ? 'مطلوب' : undefined}>
                <Input
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="info@alfarabi.sa"
                  style={{ direction: 'ltr' }}
                  required
                />
              </Field>
              <Field label="كلمة المرور المؤقتة *" error={!form.password && saving ? 'مطلوب' : undefined}>
                <Input
                  type="text"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  placeholder="كلمة مرور مؤقتة"
                  style={{ direction: 'ltr' }}
                  required
                />
              </Field>
            </div>
            <Field label="رقم الجوال">
              <Input
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+966 50 000 0000"
                style={{ direction: 'ltr' }}
              />
            </Field>
            <Field label="العنوان">
              <Input
                value={form.address_ar}
                onChange={e => set('address_ar', e.target.value)}
                placeholder="الرياض، حي الورود"
              />
            </Field>
          </div>
        </Card>

        <Card pad>
          <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
            الباقة والاشتراك
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }} className="max-sm:grid-cols-[1fr]">
              <Field label="الباقة">
                <Select value={form.plan} onChange={e => set('plan', e.target.value)} style={{ width: '100%', height: 40, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 14, padding: '0 10px' }}>
                  {Object.entries(PLANS).map(([key, p]) => (
                    <option key={key} value={key}>
                      {p.labelAr} — {fmtSAR(p.priceY)} ر.س/سنة
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="تاريخ البداية">
                <Input type="date" value={form.subscription_start} onChange={e => set('subscription_start', e.target.value)} style={{ direction: 'ltr' }} />
              </Field>
              <Field label="تاريخ النهاية">
                <Input type="date" value={form.subscription_end} onChange={e => set('subscription_end', e.target.value)} style={{ direction: 'ltr' }} />
              </Field>
            </div>
            <Field label="ملاحظة (رقم التحويل، اسم المحوّل)">
              <Textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="تحويل رقم #xxxx — بنك الراجحي"
                rows={2}
              />
            </Field>
          </div>
        </Card>

        <div style={{ display: 'flex', gap: 10 }}>
          <Btn kind="primary" type="submit" disabled={saving} size="lg">
            {saving ? 'جارٍ الإنشاء...' : 'إنشاء المكتب'}
          </Btn>
          <Btn kind="ghost" onClick={() => router.push('/admin/tenants')} size="lg">
            إلغاء
          </Btn>
        </div>
      </form>
    </div>
  )
}
