'use client'

import React, { useState, useEffect } from 'react'
import {
  SectionHeader,
  Card,
  Btn,
  IconBtn,
  Toggle,
  Modal,
  TabBar,
  Input,
  Textarea,
  Alert,
} from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT, DEMO_SERVICES, DEMO_FEATURES } from '@/lib/data'
import { sbGetMyTenant, sbGetServices, sbAddService, sbUpdateService, sbDeleteService } from '@/lib/api'

const ICON_OPTIONS = ['cube', 'shield', 'bar', 'palette', 'star', 'users', 'clock', 'briefcase', 'building', 'bolt', 'sparkles', 'eye', 'trend', 'mail', 'phone', 'map', 'globe', 'layers']

export default function ServicesPage() {
  const [tenant, setTenant] = useState<Record<string, unknown>>({ ...DEMO_TENANT })
  const [services, setServices] = useState<Record<string, unknown>[]>([])
  const [features, setFeatures] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('services')
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [editType, setEditType] = useState('service')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null)

  const emptyForm = { title: '', desc: '', icon: 'cube', published: true }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const { data: td, error: te } = await sbGetMyTenant()
      const t = td && !te ? { ...DEMO_TENANT, ...td } as Record<string, unknown> : { ...DEMO_TENANT }
      setTenant(t)
      const tid = (t.id as string) || 't-1'
      const { data, error } = await sbGetServices(tid)
      if (data && !error) {
        const all = data as Record<string, unknown>[]
        setServices(all.filter(s => s.type === 'service'))
        setFeatures(all.filter(s => s.type === 'feature'))
      } else {
        setServices([...DEMO_SERVICES] as unknown as Record<string, unknown>[])
        setFeatures([...DEMO_FEATURES] as unknown as Record<string, unknown>[])
      }
    } catch {
      setServices([...DEMO_SERVICES] as unknown as Record<string, unknown>[])
      setFeatures([...DEMO_FEATURES] as unknown as Record<string, unknown>[])
    }
    setLoading(false)
  }

  function openAdd(type: string) {
    setEditId(null)
    setEditType(type)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(item: Record<string, unknown>, type: string) {
    setEditId(item.id as string)
    setEditType(type)
    setForm({
      title: (item.title as string) || '',
      desc: (item.desc as string) || (item.description as string) || '',
      icon: (item.icon as string) || 'cube',
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
        type: editType,
        title: form.title,
        desc: form.desc,
        icon: form.icon,
        published: form.published,
      }

      let result
      if (editId) {
        result = await sbUpdateService(editId, payload)
      } else {
        result = await sbAddService(payload)
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
    if (!confirm('هل أنت متأكد من الحذف؟')) return
    await sbDeleteService(id)
    await loadData()
    setMsg({ tone: 'success', text: 'تم الحذف' })
    setTimeout(() => setMsg(null), 3000)
  }

  async function togglePublished(item: Record<string, unknown>) {
    const published = !(item.published !== false && item.is_active !== false)
    await sbUpdateService(item.id as string, { published })
    setServices(prev => prev.map(x => x.id === item.id ? { ...x, published } : x))
    setFeatures(prev => prev.map(x => x.id === item.id ? { ...x, published } : x))
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

  const currentItems = activeTab === 'services' ? services : features
  const tabLabel = activeTab === 'services' ? 'الخدمات' : 'المميزات'

  if (loading) {
    return <div dir="rtl" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>جاري التحميل...</div>
  }

  return (
    <div dir="rtl">
      <SectionHeader
        title="الخدمات والمميزات"
        sub="أدر خدماتك ومميزاتك التي تظهر على موقعك"
        action={
          <Btn kind="primary" icon="plus" onClick={() => openAdd(activeTab)}>
            {activeTab === 'services' ? 'إضافة خدمة' : 'إضافة ميزة'}
          </Btn>
        }
      />

      {msg && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone={msg.tone} icon={msg.tone === 'success' ? 'check' : 'warn'} title={msg.text}>
            {msg.tone === 'success' ? 'تم بنجاح' : 'يرجى المحاولة مرة أخرى'}
          </Alert>
        </div>
      )}

      <TabBar
        tabs={[
          { id: 'services', label: 'الخدمات', icon: 'cube' },
          { id: 'features', label: 'المميزات', icon: 'star' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
      />

      <div style={{ marginTop: 20 }}>
        {currentItems.length === 0 ? (
          <Card pad>
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
              <p style={{ fontSize: 16, marginBottom: 12 }}>لا توجد {tabLabel} بعد</p>
              <Btn kind="primary" icon="plus" onClick={() => openAdd(activeTab)}>
                {activeTab === 'services' ? 'إضافة أول خدمة' : 'إضافة أول ميزة'}
              </Btn>
            </div>
          </Card>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: 16,
          }}>
            {currentItems.map((item) => {
              const icon = (item.icon as string) || 'cube'
              const published = item.published !== false && item.is_active !== false
              return (
                <Card pad key={item.id as string}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: 10,
                      background: published ? 'var(--primary-soft)' : 'var(--bg-alt)',
                      color: published ? 'var(--primary)' : 'var(--muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      {Icons[icon as keyof typeof Icons]?.({ size: 18 })}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title as string}
                        </h4>
                        {!published && <span style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--bg-alt)', padding: '2px 8px', borderRadius: 4, flexShrink: 0 }}>مخفي</span>}
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>
                        {(item.desc as string) || (item.description as string) || '—'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    <Toggle on={published} onChange={() => togglePublished(item)} />
                    <span style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>{published ? 'ظاهر' : 'مخفي'}</span>
                    <IconBtn icon="edit" size={30} title="تعديل" onClick={() => openEdit(item, activeTab === 'services' ? 'service' : 'feature')} />
                    <IconBtn icon="trash" size={30} title="حذف" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(item.id as string)} />
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? `تعديل ${editType === 'service' ? 'خدمة' : 'ميزة'}` : `إضافة ${editType === 'service' ? 'خدمة' : 'ميزة'}`}
        width={520}
        footer={
          <>
            <Btn kind="ghost" onClick={() => setModalOpen(false)}>إلغاء</Btn>
            <Btn kind="primary" icon="check" onClick={handleSave} disabled={saving || !form.title}>
              {saving ? 'جارٍ الحفظ...' : editId ? 'حفظ' : 'إضافة'}
            </Btn>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>العنوان</span>
            <input style={inputStyle} value={form.title} onChange={e => updateForm('title', e.target.value)} placeholder="عنوان الخدمة أو الميزة" />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>الوصف</span>
            <textarea style={textareaStyle} value={form.desc} onChange={e => updateForm('desc', e.target.value)} placeholder="وصف مختصر..." />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>الأيقونة</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ICON_OPTIONS.map(name => (
                <button
                  key={name}
                  onClick={() => updateForm('icon', name)}
                  style={{
                    width: 40, height: 40, borderRadius: 8, border: '1px solid',
                    borderColor: form.icon === name ? 'var(--primary)' : 'var(--border)',
                    background: form.icon === name ? 'var(--primary-soft)' : 'var(--surface)',
                    color: form.icon === name ? 'var(--primary)' : 'var(--muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all .15s ease',
                  }}
                  title={name}
                >
                  {Icons[name as keyof typeof Icons]?.({ size: 17 })}
                </button>
              ))}
            </div>
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
