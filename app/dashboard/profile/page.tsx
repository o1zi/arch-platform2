'use client'

import React, { useState, useEffect } from 'react'
import {
  SectionHeader,
  Card,
  Btn,
  Alert,
  EmptyImg,
} from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT } from '@/lib/data'
import { sbGetMyTenant, sbUpdateTenant, sbUpload } from '@/lib/api'

export default function ProfilePage() {
  const [tenant, setTenant] = useState<Record<string, unknown>>({ ...DEMO_TENANT })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null)

  const [form, setForm] = useState<Record<string, string>>({
    name_ar: '', name_en: '', bio_ar: '', bio_en: '',
    phone: '', email: '', address_ar: '', address_en: '',
    google_maps_url: '',
    instagram_url: '', twitter_url: '', linkedin_url: '', snapchat_url: '', tiktok_url: '',
    whatsapp: '',
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const { data, error } = await sbGetMyTenant()
        if (data && !error) {
          const t = { ...DEMO_TENANT, ...data } as Record<string, unknown>
          setTenant(t)
          const fields = ['name_ar', 'name_en', 'bio_ar', 'bio_en', 'phone', 'email',
            'address_ar', 'address_en', 'google_maps_url',
            'instagram_url', 'twitter_url', 'linkedin_url', 'snapchat_url', 'tiktok_url', 'whatsapp']
          const f: Record<string, string> = {}
          for (const k of fields) f[k] = (t[k] as string) || ''
          setForm(f)
          if (t.logo_url) setLogoPreview(t.logo_url as string)
          if (t.cover_url) setCoverPreview(t.cover_url as string)
        }
      } catch { /* fallback */ }
      setLoading(false)
    })()
  }, [])

  function update(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    const reader = new FileReader()
    reader.onload = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    const reader = new FileReader()
    reader.onload = () => setCoverPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    try {
      const tid = tenant.id as string
      const updates: Record<string, unknown> = { ...form }

      if (logoFile) {
        const ext = logoFile.name.split('.').pop() || 'png'
        const { url, error } = await sbUpload('tenant-logos', `${tid}/logo.${ext}`, logoFile)
        if (!error && url) updates.logo_url = url
      }
      if (coverFile) {
        const ext = coverFile.name.split('.').pop() || 'png'
        const { url, error } = await sbUpload('tenant-covers', `${tid}/cover.${ext}`, coverFile)
        if (!error && url) updates.cover_url = url
      }

      const { error } = await sbUpdateTenant(tid, updates as Partial<import('@/types').Tenant>)
      if (error) {
        setMsg({ tone: 'danger', text: 'فشل الحفظ: ' + (error as unknown as string) })
      } else {
        setMsg({ tone: 'success', text: 'تم حفظ التغييرات بنجاح' })
        setTenant(prev => ({ ...prev, ...updates }))
        setTimeout(() => setMsg(null), 3000)
      }
    } catch {
      setMsg({ tone: 'danger', text: 'حدث خطأ غير متوقع' })
    }
    setSaving(false)
  }

  if (loading) {
    return <div dir="rtl" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>جاري التحميل...</div>
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    background: 'var(--surface)',
    color: 'var(--ink)',
    outline: 'none',
    transition: 'border-color .15s ease',
  }

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: 100,
    resize: 'vertical',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--ink-soft)',
    marginBottom: 6,
  }

  return (
    <div dir="rtl">
      <SectionHeader
        title="المعلومات الشخصية"
        sub="عدّل بيانات مكتبك التي تظهر على موقعك"
        action={
          <Btn kind="primary" icon="check" onClick={handleSave} disabled={saving}>
            {saving ? 'جارٍ الحفظ...' : 'حفظ التغييرات'}
          </Btn>
        }
      />

      {msg && (
        <Alert tone={msg.tone} icon={msg.tone === 'success' ? 'check' : 'warn'} title={msg.text}>
          {msg.tone === 'success' ? 'تم تحديث بيانات المكتب بنجاح' : 'يرجى المحاولة مرة أخرى'}
        </Alert>
      )}

      <div style={{ display: 'grid', gap: 20 }}>
        {/* Logo + Cover */}
        <Card pad>
          <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>الشعار والغلاف</h3>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div>
              <span style={{ ...labelStyle }}>الشعار</span>
              <div
                style={{
                  width: 120, height: 120, borderRadius: 12, overflow: 'hidden',
                  border: '1px solid var(--border)', marginBottom: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <EmptyImg label="شعار" w={120} h={120} radius={12} />
                )}
              </div>
              <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>
                {Icons.upload?.({ size: 14 })}
                رفع شعار
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleLogoChange} />
              </label>
            </div>
            <div>
              <span style={{ ...labelStyle }}>صورة الغلاف</span>
              <div
                style={{
                  width: 240, height: 120, borderRadius: 12, overflow: 'hidden',
                  border: '1px solid var(--border)', marginBottom: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <EmptyImg label="غلاف" w={240} h={120} radius={12} />
                )}
              </div>
              <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--primary)', fontWeight: 500 }}>
                {Icons.upload?.({ size: 14 })}
                رفع غلاف
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverChange} />
              </label>
            </div>
          </div>
        </Card>

        {/* Main info */}
        <Card pad>
          <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>معلومات أساسية</h3>
          <div style={{ display: 'grid', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <span style={labelStyle}>اسم المكتب (عربي)</span>
                <input style={inputStyle} value={form.name_ar} onChange={e => update('name_ar', e.target.value)} placeholder="مكتب الفارابي للاستشارات الهندسية" />
              </div>
              <div>
                <span style={labelStyle}>اسم المكتب (إنجليزي)</span>
                <input style={inputStyle} value={form.name_en} onChange={e => update('name_en', e.target.value)} placeholder="Al-Farabi Engineering Consultants" />
              </div>
            </div>
            <div>
              <span style={labelStyle}>نبذة تعريفية (عربي)</span>
              <textarea style={textareaStyle} value={form.bio_ar} onChange={e => update('bio_ar', e.target.value)} placeholder="اكتب نبذة عن مكتبك..." />
            </div>
            <div>
              <span style={labelStyle}>نبذة تعريفية (إنجليزي)</span>
              <textarea style={textareaStyle} value={form.bio_en} onChange={e => update('bio_en', e.target.value)} placeholder="Write a brief about your office..." />
            </div>
          </div>
        </Card>

        {/* Contact info */}
        <Card pad>
          <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>معلومات التواصل</h3>
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <span style={labelStyle}>رقم الجوال</span>
                <input style={inputStyle} value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+966 50 123 4567" dir="ltr" />
              </div>
              <div>
                <span style={labelStyle}>البريد الإلكتروني</span>
                <input style={inputStyle} value={form.email} onChange={e => update('email', e.target.value)} placeholder="info@example.com" dir="ltr" />
              </div>
            </div>
            <div>
              <span style={labelStyle}>الواتساب</span>
              <input style={inputStyle} value={form.whatsapp} onChange={e => update('whatsapp', e.target.value)} placeholder="966501234567" dir="ltr" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <span style={labelStyle}>العنوان (عربي)</span>
                <input style={inputStyle} value={form.address_ar} onChange={e => update('address_ar', e.target.value)} placeholder="الرياض، حي الورود" />
              </div>
              <div>
                <span style={labelStyle}>العنوان (إنجليزي)</span>
                <input style={inputStyle} value={form.address_en} onChange={e => update('address_en', e.target.value)} placeholder="Riyadh, Al-Wurood" dir="ltr" />
              </div>
            </div>
            <div>
              <span style={labelStyle}>رابط Google Maps</span>
              <input style={inputStyle} value={form.google_maps_url} onChange={e => update('google_maps_url', e.target.value)} placeholder="https://maps.google.com/..." dir="ltr" />
            </div>
          </div>
        </Card>

        {/* Social media */}
        <Card pad>
          <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>روابط التواصل الاجتماعي</h3>
          <div style={{ display: 'grid', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <span style={{ ...labelStyle, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{Icons.instagram?.({ size: 14 })} انستقرام</span>
                <input style={inputStyle} value={form.instagram_url} onChange={e => update('instagram_url', e.target.value)} placeholder="https://instagram.com/..." dir="ltr" />
              </div>
              <div>
                <span style={{ ...labelStyle, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{Icons.twitter?.({ size: 14 })} تويتر / X</span>
                <input style={inputStyle} value={form.twitter_url} onChange={e => update('twitter_url', e.target.value)} placeholder="https://x.com/..." dir="ltr" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <span style={{ ...labelStyle, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{Icons.linkedin?.({ size: 14 })} لينكدإن</span>
                <input style={inputStyle} value={form.linkedin_url} onChange={e => update('linkedin_url', e.target.value)} placeholder="https://linkedin.com/..." dir="ltr" />
              </div>
              <div>
                <span style={{ ...labelStyle, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{Icons.snapchat?.({ size: 14 })} سناب شات</span>
                <input style={inputStyle} value={form.snapchat_url} onChange={e => update('snapchat_url', e.target.value)} placeholder="https://snapchat.com/..." dir="ltr" />
              </div>
            </div>
            <div>
              <span style={{ ...labelStyle, display: 'inline-flex', alignItems: 'center', gap: 6 }}>{Icons.tiktok?.({ size: 14 })} تيك توك</span>
              <input style={inputStyle} value={form.tiktok_url} onChange={e => update('tiktok_url', e.target.value)} placeholder="https://tiktok.com/..." dir="ltr" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
