'use client'

import { useState, useRef } from 'react'
import { Tenant } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import Image from 'next/image'

export default function ProfileForm({ tenant }: { tenant: Tenant }) {
  const supabase = createClient()
  const [saving, setSaving] = useState(false)
  const [logoPreview, setLogoPreview] = useState(tenant.logo_url)
  const [coverPreview, setCoverPreview] = useState(tenant.cover_url)
  const logoRef = useRef<HTMLInputElement>(null)
  const coverRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    name_ar: tenant.name_ar ?? '',
    name_en: tenant.name_en ?? '',
    bio_ar: tenant.bio_ar ?? '',
    bio_en: tenant.bio_en ?? '',
    phone: tenant.phone ?? '',
    email: tenant.email ?? '',
    address_ar: tenant.address_ar ?? '',
    address_en: tenant.address_en ?? '',
    google_maps_url: tenant.google_maps_url ?? '',
    instagram_url: tenant.instagram_url ?? '',
    twitter_url: tenant.twitter_url ?? '',
    linkedin_url: tenant.linkedin_url ?? '',
    snapchat_url: tenant.snapchat_url ?? '',
  })

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function uploadImage(file: File, bucket: string, path: string): Promise<string | null> {
    // delete old file first to avoid extension conflicts
    await supabase.storage.from(bucket).remove([path])
    const { error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
      contentType: file.type,
    })
    if (error) { toast.error('فشل رفع الصورة'); return null }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    // cache buster so browser shows the new image immediately
    return `${data.publicUrl}?t=${Date.now()}`
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('حجم الشعار يجب أن يكون أقل من 2MB'); return }
    // fixed path — no extension so it never conflicts
    const url = await uploadImage(file, 'tenant-logos', `${tenant.id}/logo`)
    if (url) {
      setLogoPreview(url)
      await supabase.from('tenants').update({ logo_url: url }).eq('id', tenant.id)
      toast.success('تم رفع الشعار')
    }
    // reset input so the same file can be re-selected
    if (logoRef.current) logoRef.current.value = ''
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) { toast.error('حجم الصورة يجب أن يكون أقل من 10MB'); return }
    const url = await uploadImage(file, 'tenant-covers', `${tenant.id}/cover`)
    if (url) {
      setCoverPreview(url)
      await supabase.from('tenants').update({ cover_url: url }).eq('id', tenant.id)
      toast.success('تم رفع صورة الغلاف')
    }
    if (coverRef.current) coverRef.current.value = ''
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase
      .from('tenants')
      .update(form)
      .eq('id', tenant.id)

    if (error) {
      toast.error('حدث خطأ أثناء الحفظ')
    } else {
      toast.success('تم حفظ المعلومات بنجاح')
    }
    setSaving(false)
  }

  return (
    <div className="space-y-8 bg-white rounded-xl border border-gray-200 p-6">
      {/* Logo & Cover */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">الصور</h2>
        <div className="flex gap-6 flex-wrap">
          <div className="space-y-2">
            <Label>الشعار</Label>
            <div
              className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-gray-400 transition-colors"
              onClick={() => logoRef.current?.click()}
            >
              {logoPreview ? (
                <Image src={logoPreview} alt="logo" width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400 text-center p-2">اضغط لرفع الشعار</span>
              )}
            </div>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
          </div>
          <div className="space-y-2 flex-1 min-w-48">
            <Label>صورة الغلاف</Label>
            <div
              className="w-full h-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-gray-400 transition-colors"
              onClick={() => coverRef.current?.click()}
            >
              {coverPreview ? (
                <Image src={coverPreview} alt="cover" width={400} height={96} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-gray-400">اضغط لرفع صورة الغلاف</span>
              )}
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </div>
        </div>
      </div>

      <Separator />

      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">المعلومات الأساسية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>اسم المكتب (عربي)</Label>
            <Input value={form.name_ar} onChange={e => handleChange('name_ar', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>اسم المكتب (إنجليزي)</Label>
            <Input value={form.name_en} onChange={e => handleChange('name_en', e.target.value)} dir="ltr" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>النبذة التعريفية (عربي)</Label>
            <Textarea value={form.bio_ar} onChange={e => handleChange('bio_ar', e.target.value)} rows={4} />
          </div>
          <div className="space-y-2">
            <Label>النبذة التعريفية (إنجليزي)</Label>
            <Textarea value={form.bio_en} onChange={e => handleChange('bio_en', e.target.value)} rows={4} dir="ltr" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Contact */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">معلومات التواصل</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>رقم الجوال</Label>
            <Input value={form.phone} onChange={e => handleChange('phone', e.target.value)} dir="ltr" />
          </div>
          <div className="space-y-2">
            <Label>البريد الإلكتروني</Label>
            <Input value={form.email} onChange={e => handleChange('email', e.target.value)} dir="ltr" type="email" />
          </div>
          <div className="space-y-2">
            <Label>العنوان (عربي)</Label>
            <Input value={form.address_ar} onChange={e => handleChange('address_ar', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>العنوان (إنجليزي)</Label>
            <Input value={form.address_en} onChange={e => handleChange('address_en', e.target.value)} dir="ltr" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>رابط Google Maps</Label>
          <Input value={form.google_maps_url} onChange={e => handleChange('google_maps_url', e.target.value)} dir="ltr" placeholder="https://maps.google.com/..." />
        </div>
      </div>

      <Separator />

      {/* Social */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">السوشيال ميديا</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { field: 'instagram_url', label: 'إنستقرام' },
            { field: 'twitter_url', label: 'تويتر / X' },
            { field: 'linkedin_url', label: 'لينكدإن' },
            { field: 'snapchat_url', label: 'سناب شات' },
          ].map(({ field, label }) => (
            <div key={field} className="space-y-2">
              <Label>{label}</Label>
              <Input
                value={form[field as keyof typeof form]}
                onChange={e => handleChange(field, e.target.value)}
                dir="ltr"
                placeholder="https://..."
              />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
        {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
      </Button>
    </div>
  )
}
