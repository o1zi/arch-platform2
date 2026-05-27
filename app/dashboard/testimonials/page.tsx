'use client'

import React, { useState, useEffect } from 'react'
import {
  SectionHeader,
  Card,
  Btn,
  IconBtn,
  Toggle,
  Modal,
  Textarea,
  Alert,
} from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT, DEMO_TESTIMONIALS } from '@/lib/data'
import { sbGetMyTenant, sbGetTestimonials, sbAddTestimonial, sbUpdateTestimonial, sbDeleteTestimonial } from '@/lib/api'

export default function TestimonialsPage() {
  const [tenant, setTenant] = useState<Record<string, unknown>>({ ...DEMO_TENANT })
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null)

  const emptyForm = { name: '', role: '', text: '', rating: 5, published: true }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const { data: td, error: te } = await sbGetMyTenant()
      const t = td && !te ? { ...DEMO_TENANT, ...td } as Record<string, unknown> : { ...DEMO_TENANT }
      setTenant(t)
      const tid = (t.id as string) || 't-1'
      const { data, error } = await sbGetTestimonials(tid)
      if (data && !error) {
        setItems(data as Record<string, unknown>[])
      } else {
        setItems([...DEMO_TESTIMONIALS] as unknown as Record<string, unknown>[])
      }
    } catch {
      setItems([...DEMO_TESTIMONIALS] as unknown as Record<string, unknown>[])
    }
    setLoading(false)
  }

  function openAdd() {
    setEditId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(item: Record<string, unknown>) {
    setEditId(item.id as string)
    setForm({
      name: (item.name as string) || '',
      role: (item.role as string) || '',
      text: (item.text as string) || (item.content as string) || '',
      rating: (item.rating as number) || 5,
      published: item.published !== false && item.is_active !== false,
    })
    setModalOpen(true)
  }

  function updateForm(key: string, val: string | number | boolean) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    try {
      const tid = tenant.id as string
      const payload: Record<string, unknown> = {
        tenant_id: tid,
        name: form.name,
        role: form.role || null,
        text: form.text,
        rating: form.rating,
        published: form.published,
      }

      let result
      if (editId) {
        result = await sbUpdateTestimonial(editId, payload)
      } else {
        result = await sbAddTestimonial(payload)
      }

      if (result?.error) {
        setMsg({ tone: 'danger', text: 'فشل الحفظ' })
      } else {
        setModalOpen(false)
        await loadData()
        setMsg({ tone: 'success', text: editId ? 'تم التحديث' : 'تمت الإضافة' })
        setTimeout(() => setMsg(null), 3000)
      }
    } catch {
      setMsg({ tone: 'danger', text: 'حدث خطأ' })
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return
    await sbDeleteTestimonial(id)
    await loadData()
    setMsg({ tone: 'success', text: 'تم الحذف' })
    setTimeout(() => setMsg(null), 3000)
  }

  async function togglePublished(item: Record<string, unknown>) {
    const published = !(item.published !== false && item.is_active !== false)
    await sbUpdateTestimonial(item.id as string, { published })
    setItems(prev => prev.map(x => x.id === item.id ? { ...x, published } : x))
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
  }
  const textareaStyle: React.CSSProperties = { ...inputStyle, minHeight: 80, resize: 'vertical' }

  function StarRating({ rating, onChange }: { rating: number; onChange?: (v: number) => void }) {
    return (
      <div style={{ display: 'flex', gap: 2, direction: 'rtl' }}>
        {[5, 4, 3, 2, 1].map(n => (
          <button
            key={n}
            type="button"
            onClick={() => onChange?.(n)}
            style={{
              background: 'none', border: 'none', cursor: onChange ? 'pointer' : 'default',
              color: n <= rating ? '#e6b800' : 'var(--border)',
              padding: 0, lineHeight: 1,
            }}
          >
            {Icons.star?.({ size: 20, stroke: n <= rating ? 0 : 1.5 })}
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return <div dir="rtl" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>جاري التحميل...</div>
  }

  return (
    <div dir="rtl">
      <SectionHeader
        title="آراء العملاء"
        sub="أدر تقييمات العملاء التي تظهر على موقعك"
        action={
          <Btn kind="primary" icon="plus" onClick={openAdd}>إضافة تقييم</Btn>
        }
      />

      {msg && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone={msg.tone} icon={msg.tone === 'success' ? 'check' : 'warn'} title={msg.text}>
            {msg.tone === 'success' ? 'تم بنجاح' : 'يرجى المحاولة مرة أخرى'}
          </Alert>
        </div>
      )}

      {items.length === 0 ? (
        <Card pad>
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
            <p style={{ fontSize: 16, marginBottom: 12 }}>لا توجد تقييمات بعد</p>
            <Btn kind="primary" icon="plus" onClick={openAdd}>إضافة أول تقييم</Btn>
          </div>
        </Card>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 16,
        }}>
          {items.map((item) => {
            const published = item.published !== false && item.is_active !== false
            const text = (item.text as string) || (item.content as string) || ''
            return (
              <Card pad key={item.id as string}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <StarRating rating={(item.rating as number) || 5} />
                    {!published && <span style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--bg-alt)', padding: '2px 8px', borderRadius: 4 }}>مخفي</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.7, flex: 1 }}>
                    &ldquo;{text}&rdquo;
                  </p>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{item.name as string}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.role as string || '—'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    <Toggle on={published} onChange={() => togglePublished(item)} />
                    <span style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>{published ? 'ظاهر' : 'مخفي'}</span>
                    <IconBtn icon="edit" size={30} title="تعديل" onClick={() => openEdit(item)} />
                    <IconBtn icon="trash" size={30} title="حذف" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(item.id as string)} />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'تعديل تقييم' : 'إضافة تقييم'}
        width={520}
        footer={
          <>
            <Btn kind="ghost" onClick={() => setModalOpen(false)}>إلغاء</Btn>
            <Btn kind="primary" icon="check" onClick={handleSave} disabled={saving || !form.name || !form.text}>
              {saving ? 'جارٍ الحفظ...' : editId ? 'حفظ' : 'إضافة'}
            </Btn>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>الاسم</span>
            <input style={inputStyle} value={form.name} onChange={e => updateForm('name', e.target.value)} placeholder="اسم العميل" />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>المنصب / الوصف</span>
            <input style={inputStyle} value={form.role as string} onChange={e => updateForm('role', e.target.value)} placeholder="مدير عام، شركة..." />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>نص التقييم</span>
            <textarea style={textareaStyle} value={form.text as string} onChange={e => updateForm('text', e.target.value)} placeholder="نص تقييم العميل..." />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>التقييم</span>
            <StarRating rating={form.rating as number} onChange={v => updateForm('rating', v)} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Toggle on={form.published as boolean} onChange={v => updateForm('published', v)} />
            <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>منشور (ظاهر للزوار)</span>
          </div>
        </div>
      </Modal>
    </div>
  )
}
