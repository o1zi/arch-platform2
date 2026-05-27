'use client'

import React, { useState, useEffect } from 'react'
import {
  SectionHeader,
  Card,
  Btn,
  IconBtn,
  Toggle,
  Modal,
  Alert,
} from '@/components/ui/atoms'
import { DEMO_TENANT, DEMO_FAQS } from '@/lib/data'
import { sbGetMyTenant, sbGetFaqs, sbAddFaq, sbUpdateFaq, sbDeleteFaq } from '@/lib/api'

export default function FAQPage() {
  const [tenant, setTenant] = useState<Record<string, unknown>>({ ...DEMO_TENANT })
  const [items, setItems] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null)

  const emptyForm = { q: '', a: '', published: true }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const { data: td, error: te } = await sbGetMyTenant()
      const t = td && !te ? { ...DEMO_TENANT, ...td } as Record<string, unknown> : { ...DEMO_TENANT }
      setTenant(t)
      const tid = (t.id as string) || 't-1'
      const { data, error } = await sbGetFaqs(tid)
      if (data && !error) {
        setItems(data as Record<string, unknown>[])
      } else {
        setItems([...DEMO_FAQS] as unknown as Record<string, unknown>[])
      }
    } catch {
      setItems([...DEMO_FAQS] as unknown as Record<string, unknown>[])
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
      q: (item.q as string) || (item.question as string) || '',
      a: (item.a as string) || (item.answer as string) || '',
      published: item.published !== false && item.is_active !== false,
    })
    setModalOpen(true)
  }

  function updateForm(key: string, val: string | boolean) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    try {
      const tid = tenant.id as string
      const payload: Record<string, unknown> = {
        tenant_id: tid,
        q: form.q,
        a: form.a,
        published: form.published,
      }

      let result
      if (editId) {
        result = await sbUpdateFaq(editId, payload)
      } else {
        result = await sbAddFaq(payload)
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
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return
    await sbDeleteFaq(id)
    await loadData()
    setMsg({ tone: 'success', text: 'تم الحذف' })
    setTimeout(() => setMsg(null), 3000)
  }

  async function togglePublished(item: Record<string, unknown>) {
    const published = !(item.published !== false && item.is_active !== false)
    await sbUpdateFaq(item.id as string, { published })
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

  if (loading) {
    return <div dir="rtl" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>جاري التحميل...</div>
  }

  return (
    <div dir="rtl">
      <SectionHeader
        title="الأسئلة الشائعة"
        sub="أدر الأسئلة الشائعة التي تظهر على موقعك"
        action={
          <Btn kind="primary" icon="plus" onClick={openAdd}>إضافة سؤال</Btn>
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
            <p style={{ fontSize: 16, marginBottom: 12 }}>لا توجد أسئلة بعد</p>
            <Btn kind="primary" icon="plus" onClick={openAdd}>إضافة أول سؤال</Btn>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((item) => {
            const published = item.published !== false && item.is_active !== false
            return (
              <Card pad key={item.id as string}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, flex: 1 }}>
                      <span style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: published ? 'var(--primary-soft)' : 'var(--bg-alt)',
                        color: published ? 'var(--primary)' : 'var(--muted)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600,
                        flexShrink: 0, marginTop: 2,
                      }}>
                        س
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
                          {(item.q as string) || (item.question as string)}
                          {!published && <span style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--bg-alt)', padding: '2px 8px', borderRadius: 4, fontWeight: 400, flexShrink: 0 }}>مخفي</span>}
                        </div>
                        <p style={{ margin: 0, fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                          {(item.a as string) || (item.answer as string)}
                        </p>
                      </div>
                    </div>
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
        title={editId ? 'تعديل سؤال' : 'إضافة سؤال'}
        width={520}
        footer={
          <>
            <Btn kind="ghost" onClick={() => setModalOpen(false)}>إلغاء</Btn>
            <Btn kind="primary" icon="check" onClick={handleSave} disabled={saving || !form.q || !form.a}>
              {saving ? 'جارٍ الحفظ...' : editId ? 'حفظ' : 'إضافة'}
            </Btn>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>السؤال</span>
            <input style={inputStyle} value={form.q} onChange={e => updateForm('q', e.target.value)} placeholder="اكتب السؤال..." />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>الإجابة</span>
            <textarea style={textareaStyle} value={form.a} onChange={e => updateForm('a', e.target.value)} placeholder="اكتب الإجابة..." />
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
