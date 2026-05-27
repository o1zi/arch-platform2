'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  SectionHeader,
  Card,
  Btn,
  IconBtn,
  Toggle,
  Modal,
  Field,
  Input,
  Textarea,
  Badge,
  ProjectCover,
  EmptyImg,
  Alert,
} from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT, DEMO_PROJECTS, PLAN_LIMITS } from '@/lib/data'
import { sbGetMyTenant, sbGetProjects, sbAddProject, sbUpdateProject, sbDeleteProject, sbUpload } from '@/lib/api'
import type { Plan } from '@/types'

const CATEGORIES = ['سكني', 'تجاري', 'صناعي', 'ترفيهي', 'حكومي', 'تعليمي', 'صحي', 'ديني']

export default function ProjectsPage() {
  const router = useRouter()
  const [tenant, setTenant] = useState<Record<string, unknown>>({ ...DEMO_TENANT })
  const [projects, setProjects] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null)

  const emptyForm = {
    title_ar: '', title_en: '', category: 'سكني', location_ar: '',
    year: String(new Date().getFullYear()), is_featured: false,
    description_ar: '', description_en: '',
  }
  const [form, setForm] = useState(emptyForm)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    try {
      const { data: td, error: te } = await sbGetMyTenant()
      const t = td && !te ? { ...DEMO_TENANT, ...td } as Record<string, unknown> : { ...DEMO_TENANT }
      setTenant(t)
      const tid = (t.id as string) || 't-1'
      const { data, error } = await sbGetProjects(tid)
      if (data && !error) {
        setProjects(data as Record<string, unknown>[])
      } else {
        setProjects([...DEMO_PROJECTS] as unknown as Record<string, unknown>[])
      }
    } catch {
      setProjects([...DEMO_PROJECTS] as unknown as Record<string, unknown>[])
    }
    setLoading(false)
  }

  function openAdd() {
    setEditId(null)
    setForm(emptyForm)
    setCoverFile(null)
    setCoverPreview(null)
    setGalleryFiles([])
    setGalleryPreviews([])
    setModalOpen(true)
  }

  function openEdit(p: Record<string, unknown>) {
    setEditId(p.id as string)
    setForm({
      title_ar: (p.title_ar as string) || '',
      title_en: (p.title_en as string) || '',
      category: (p.category as string) || 'سكني',
      location_ar: (p.location_ar as string) || '',
      year: String(p.year || new Date().getFullYear()),
      is_featured: !!p.is_featured,
      description_ar: (p.description_ar as string) || '',
      description_en: (p.description_en as string) || '',
    })
    setCoverFile(null)
    setCoverPreview((p.cover_image_url as string) || null)
    setGalleryFiles([])
    setGalleryPreviews([])
    setModalOpen(true)
  }

  function updateForm(key: string, val: string | boolean) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    const reader = new FileReader()
    reader.onload = () => setCoverPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    setGalleryFiles(prev => [...prev, ...files])
    const readers = files.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.readAsDataURL(file)
      })
    })
    const results = await Promise.all(readers)
    setGalleryPreviews(prev => [...prev, ...results])
  }

  function removeGalleryPreview(index: number) {
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
    setGalleryFiles(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSave() {
    setSaving(true)
    setMsg(null)
    try {
      const tid = tenant.id as string
      const payload: Record<string, unknown> = {
        tenant_id: tid,
        title_ar: form.title_ar,
        title_en: form.title_en || null,
        category: form.category,
        location_ar: form.location_ar || null,
        year: parseInt(form.year as string) || null,
        is_featured: form.is_featured,
        description_ar: form.description_ar || null,
        description_en: form.description_en || null,
      }

      if (coverFile) {
        const pid = editId || 'temp-' + Date.now()
        const ext = coverFile.name.split('.').pop() || 'jpg'
        const { url, error } = await sbUpload('project-covers', `${tid}/${pid}/cover.${ext}`, coverFile)
        if (!error && url) payload.cover_image_url = url
      }

      if (editId) {
        await sbUpdateProject(editId, payload as Partial<import('@/types').Project>)
      } else {
        const { data, error } = await sbAddProject(payload as Partial<import('@/types').Project>)
        if (!error && data && galleryFiles.length > 0) {
          const newPid = (data as Record<string, unknown>).id as string
          for (let i = 0; i < galleryFiles.length; i++) {
            const ext = galleryFiles[i].name.split('.').pop() || 'jpg'
            await sbUpload('project-images', `${tid}/${newPid}/${i}.${ext}`, galleryFiles[i])
          }
        }
      }

      setModalOpen(false)
      await loadData()
      setMsg({ tone: 'success', text: editId ? 'تم تحديث المشروع' : 'تم إضافة المشروع' })
      setTimeout(() => setMsg(null), 3000)
    } catch {
      setMsg({ tone: 'danger', text: 'حدث خطأ' })
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return
    await sbDeleteProject(id)
    await loadData()
    setMsg({ tone: 'success', text: 'تم حذف المشروع' })
    setTimeout(() => setMsg(null), 3000)
  }

  const plan = (tenant.plan as Plan) || 'basic'
  const limit = PLAN_LIMITS[plan].projects
  const count = projects.length

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
        title="المشاريع"
        sub={`${count} / ${limit === Infinity ? '∞' : limit} مشروع`}
        action={
          <Btn
            kind="primary"
            icon="plus"
            onClick={openAdd}
            disabled={limit !== Infinity && count >= limit}
          >
            إضافة مشروع
          </Btn>
        }
      />

      {limit !== Infinity && count >= limit && (
        <Alert tone="warn" icon="warn" title="وصلت للحد الأقصى">
          لقد وصلت للحد الأقصى ({limit} مشروع). لزيادة العدد، قم بترقية باقتك.
        </Alert>
      )}

      {msg && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone={msg.tone} icon={msg.tone === 'success' ? 'check' : 'warn'} title={msg.text}>
            {msg.tone === 'success' ? 'تم بنجاح' : 'يرجى المحاولة مرة أخرى'}
          </Alert>
        </div>
      )}

      {projects.length === 0 ? (
        <Card pad>
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
            <p style={{ fontSize: 16, marginBottom: 12 }}>لا توجد مشاريع بعد</p>
            <Btn kind="primary" icon="plus" onClick={openAdd}>إضافة أول مشروع</Btn>
          </div>
        </Card>
      ) : (
        <Card pad>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--muted)', fontWeight: 500, width: 120 }}>الصورة</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--muted)', fontWeight: 500 }}>الاسم</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--muted)', fontWeight: 500 }}>التصنيف</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--muted)', fontWeight: 500 }}>السنة</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--muted)', fontWeight: 500 }}>مميز</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--muted)', fontWeight: 500, width: 100 }}>إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, i) => (
                  <tr key={p.id as string} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 8 }}>
                      <ProjectCover seed={i + 1} label={(p.title_ar as string)?.slice(0, 2)} h={50} radius={8} />
                    </td>
                    <td style={{ padding: '8px 12px', fontWeight: 500 }}>{p.title_ar as string}</td>
                    <td style={{ padding: '8px 12px' }}><Badge>{p.category as string}</Badge></td>
                    <td style={{ padding: '8px 12px', color: 'var(--muted)' }}>{p.year as string || '—'}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <Toggle
                        on={!!p.is_featured}
                        onChange={async (v) => {
                          await sbUpdateProject(p.id as string, { is_featured: v } as Partial<import('@/types').Project>)
                          setProjects(prev => prev.map(x => x.id === p.id ? { ...x, is_featured: v } : x))
                        }}
                      />
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <IconBtn icon="edit" size={30} title="تعديل" onClick={() => openEdit(p)} />
                        <IconBtn icon="trash" size={30} title="حذف" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(p.id as string)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'تعديل مشروع' : 'مشروع جديد'}
        width={640}
        footer={
          <>
            <Btn kind="ghost" onClick={() => setModalOpen(false)}>إلغاء</Btn>
            <Btn kind="primary" icon="check" onClick={handleSave} disabled={saving || !form.title_ar}>
              {saving ? 'جارٍ الحفظ...' : editId ? 'حفظ التعديلات' : 'إضافة المشروع'}
            </Btn>
          </>
        }
      >
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>اسم المشروع (عربي)</span>
              <input style={inputStyle} value={form.title_ar} onChange={e => updateForm('title_ar', e.target.value)} placeholder="اسم المشروع" />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>اسم المشروع (إنجليزي)</span>
              <input style={inputStyle} value={form.title_en as string} onChange={e => updateForm('title_en', e.target.value)} placeholder="Project name" dir="ltr" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
            <div>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>التصنيف</span>
              <select
                style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.category as string}
                onChange={e => updateForm('category', e.target.value)}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>الموقع</span>
              <input style={inputStyle} value={form.location_ar as string} onChange={e => updateForm('location_ar', e.target.value)} placeholder="الرياض" />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>سنة التنفيذ</span>
              <input style={inputStyle} value={form.year as string} onChange={e => updateForm('year', e.target.value)} placeholder="2025" type="number" dir="ltr" />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Toggle on={form.is_featured as boolean} onChange={v => updateForm('is_featured', v)} />
            <span style={{ fontSize: 14, color: 'var(--ink-soft)' }}>مشروع مميز (يظهر في الصفحة الرئيسية)</span>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>الوصف (عربي)</span>
            <textarea style={textareaStyle} value={form.description_ar as string} onChange={e => updateForm('description_ar', e.target.value)} placeholder="وصف المشروع..." />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>الوصف (إنجليزي)</span>
            <textarea style={textareaStyle} value={form.description_en as string} onChange={e => updateForm('description_en', e.target.value)} placeholder="Project description..." dir="ltr" />
          </div>

          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>صورة الغلاف</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 120, height: 80, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <EmptyImg label="غلاف" w={120} h={80} radius={8} />
                )}
              </div>
              <label style={{ cursor: 'pointer', color: 'var(--primary)', fontSize: 13, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {Icons.upload?.({ size: 14 })}
                رفع صورة
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleCoverChange} />
              </label>
            </div>
          </div>

          <div>
            <span style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-soft)', marginBottom: 6 }}>معرض الصور</span>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {galleryPreviews.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: 80, height: 60, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => removeGalleryPreview(i)}
                    style={{
                      position: 'absolute', top: 2, right: 2, width: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(0,0,0,.5)', color: '#fff', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <label style={{
                width: 80, height: 60, borderRadius: 6, border: '2px dashed var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--muted)', transition: 'border-color .15s',
              }}>
                {Icons.plus?.({ size: 18 })}
                <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleGalleryChange} />
              </label>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
