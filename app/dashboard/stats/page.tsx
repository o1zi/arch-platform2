'use client'

import React, { useState, useEffect } from 'react'
import {
  SectionHeader,
  Card,
  Btn,
  IconBtn,
  Modal,
  Alert,
} from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT, DEMO_STATS } from '@/lib/data'
import { sbGetMyTenant, sbGetStats, sbAddStat, sbUpdateStat, sbDeleteStat } from '@/lib/api'

export default function StatsPage() {
  const [tenant, setTenant] = useState<Record<string, unknown>>({ ...DEMO_TENANT })
  const [stats, setStats] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null)

  const emptyForm = { label: '', value: '0', suffix: '', sort_order: 0 }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const { data: td, error: te } = await sbGetMyTenant()
      const t = td && !te ? { ...DEMO_TENANT, ...td } as Record<string, unknown> : { ...DEMO_TENANT }
      setTenant(t)
      const tid = (t.id as string) || 't-1'
      const { data, error } = await sbGetStats(tid)
      if (data && !error) {
        setStats((data as Record<string, unknown>[]).sort((a, b) => ((a.sort_order as number) || 0) - ((b.sort_order as number) || 0)))
      } else {
        setStats([...DEMO_STATS] as unknown as Record<string, unknown>[])
      }
    } catch {
      setStats([...DEMO_STATS] as unknown as Record<string, unknown>[])
    }
    setLoading(false)
  }

  function openAdd() {
    setEditId(null)
    setForm({ ...emptyForm, sort_order: stats.length })
    setModalOpen(true)
  }

  function openEdit(item: Record<string, unknown>) {
    setEditId(item.id as string)
    setForm({
      label: (item.label as string) || '',
      value: String(item.value || 0),
      suffix: (item.suffix as string) || '',
      sort_order: (item.sort_order as number) || 0,
    })
    setModalOpen(true)
  }

  function updateForm(key: string, val: string) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    try {
      const tid = tenant.id as string
      const payload: Record<string, unknown> = {
        tenant_id: tid,
        label: form.label,
        value: parseInt(form.value as string) || 0,
        suffix: form.suffix || null,
        sort_order: form.sort_order,
      }

      let result
      if (editId) {
        result = await sbUpdateStat(editId, payload)
      } else {
        result = await sbAddStat(payload)
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
    if (!confirm('هل أنت متأكد من حذف هذه الإحصائية؟')) return
    await sbDeleteStat(id)
    await loadData()
    setMsg({ tone: 'success', text: 'تم الحذف' })
    setTimeout(() => setMsg(null), 3000)
  }

  async function moveUp(index: number) {
    if (index === 0) return
    const a = stats[index]
    const b = stats[index - 1]
    const newStats = [...stats]
    newStats[index] = b
    newStats[index - 1] = a
    setStats(newStats)
    await sbUpdateStat(a.id as string, { sort_order: index - 1 })
    await sbUpdateStat(b.id as string, { sort_order: index })
  }

  async function moveDown(index: number) {
    if (index === stats.length - 1) return
    const a = stats[index]
    const b = stats[index + 1]
    const newStats = [...stats]
    newStats[index] = b
    newStats[index + 1] = a
    setStats(newStats)
    await sbUpdateStat(a.id as string, { sort_order: index + 1 })
    await sbUpdateStat(b.id as string, { sort_order: index })
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

  if (loading) {
    return <div dir="rtl" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>جاري التحميل...</div>
  }

  return (
    <div dir="rtl">
      <SectionHeader
        title="الإحصائيات"
        sub="أضف أرقاماً إحصائية تظهر على موقعك"
        action={
          <Btn kind="primary" icon="plus" onClick={openAdd}>إضافة إحصائية</Btn>
        }
      />

      {msg && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone={msg.tone} icon={msg.tone === 'success' ? 'check' : 'warn'} title={msg.text}>
            {msg.tone === 'success' ? 'تم بنجاح' : 'يرجى المحاولة مرة أخرى'}
          </Alert>
        </div>
      )}

      {stats.length === 0 ? (
        <Card pad>
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
            <p style={{ fontSize: 16, marginBottom: 12 }}>لا توجد إحصائيات بعد</p>
            <Btn kind="primary" icon="plus" onClick={openAdd}>إضافة أول إحصائية</Btn>
          </div>
        </Card>
      ) : (
        <Card pad>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.map((item, i) => (
              <div
                key={item.id as string}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  background: 'var(--bg)',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border)',
                  transition: 'border-color .15s ease',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    onClick={() => moveUp(i)}
                    style={{ background: 'none', border: 'none', cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? 'var(--border)' : 'var(--muted)', padding: 2, display: 'flex' }}
                    disabled={i === 0}
                  >
                    {Icons.chevronDown?.({ size: 12, stroke: 2 })}
                  </button>
                  <button
                    onClick={() => moveDown(i)}
                    style={{ background: 'none', border: 'none', cursor: i === stats.length - 1 ? 'default' : 'pointer', color: i === stats.length - 1 ? 'var(--border)' : 'var(--muted)', padding: 2, display: 'flex', transform: 'rotate(180deg)' }}
                    disabled={i === stats.length - 1}
                  >
                    {Icons.chevronDown?.({ size: 12, stroke: 2 })}
                  </button>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 10,
                    background: 'var(--primary-soft)',
                    color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600,
                    flexShrink: 0,
                  }}>
                    {item.value as number}{item.suffix as string}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{item.label as string}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>الترتيب: {(item.sort_order as number) || i}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <IconBtn icon="edit" size={32} title="تعديل" onClick={() => openEdit(item)} />
                  <IconBtn icon="trash" size={32} title="حذف" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(item.id as string)} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'تعديل إحصائية' : 'إضافة إحصائية'}
        width={460}
        footer={
          <>
            <Btn kind="ghost" onClick={() => setModalOpen(false)}>إلغاء</Btn>
            <Btn kind="primary" icon="check" onClick={handleSave} disabled={saving || !form.label}>
              {saving ? 'جارٍ الحفظ...' : editId ? 'حفظ' : 'إضافة'}
            </Btn>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>العنوان</span>
            <input style={inputStyle} value={form.label} onChange={e => updateForm('label', e.target.value)} placeholder="عدد المشاريع المنجزة" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>القيمة</span>
              <input style={inputStyle} value={form.value as string} onChange={e => updateForm('value', e.target.value)} placeholder="220" type="number" dir="ltr" />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>لاحقة</span>
              <input style={inputStyle} value={form.suffix as string} onChange={e => updateForm('suffix', e.target.value)} placeholder="+" dir="ltr" />
            </div>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>الترتيب</span>
            <input style={inputStyle} value={String(form.sort_order)} onChange={e => updateForm('sort_order', e.target.value)} placeholder="0" type="number" dir="ltr" />
          </div>
        </div>
      </Modal>
    </div>
  )
}
