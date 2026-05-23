'use client'

import { useState } from 'react'
import { ContentBlock } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Building2, Layers, Eye, Lightbulb, MapPin, ClipboardList,
  Award, Users, Clock, Shield, Star, CheckCircle2,
  HardHat, Globe, Pencil, Trash2, Plus, GripVertical,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_OPTIONS = [
  { key: 'Building2', Icon: Building2, label: 'مبنى' },
  { key: 'Layers', Icon: Layers, label: 'طبقات' },
  { key: 'Eye', Icon: Eye, label: 'مراقبة' },
  { key: 'Lightbulb', Icon: Lightbulb, label: 'استشارة' },
  { key: 'MapPin', Icon: MapPin, label: 'موقع' },
  { key: 'ClipboardList', Icon: ClipboardList, label: 'إدارة' },
  { key: 'HardHat', Icon: HardHat, label: 'بناء' },
  { key: 'Globe', Icon: Globe, label: 'عالمي' },
  { key: 'Award', Icon: Award, label: 'جائزة' },
  { key: 'Users', Icon: Users, label: 'فريق' },
  { key: 'Clock', Icon: Clock, label: 'وقت' },
  { key: 'Shield', Icon: Shield, label: 'ضمان' },
  { key: 'Star', Icon: Star, label: 'تميز' },
  { key: 'CheckCircle2', Icon: CheckCircle2, label: 'تحقق' },
]

const ICON_MAP: Record<string, React.ElementType> = Object.fromEntries(
  ICON_OPTIONS.map(o => [o.key, o.Icon])
)

function getIcon(key: string | null) {
  if (!key) return Building2
  return ICON_MAP[key] ?? Building2
}

interface Props {
  type: 'service' | 'feature'
  initialBlocks: ContentBlock[]
}

type Draft = { title: string; description: string; icon: string }

const EMPTY_DRAFT: Draft = { title: '', description: '', icon: 'Building2' }

export default function ContentBlocksManager({ type, initialBlocks }: Props) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ContentBlock | null>(null)
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sectionLabel = type === 'service' ? 'الخدمات' : 'المميزات'
  const itemLabel = type === 'service' ? 'خدمة' : 'ميزة'

  function openAdd() {
    setEditing(null)
    setDraft(EMPTY_DRAFT)
    setError(null)
    setOpen(true)
  }

  function openEdit(block: ContentBlock) {
    setEditing(block)
    setDraft({ title: block.title, description: block.description ?? '', icon: block.icon ?? 'Building2' })
    setError(null)
    setOpen(true)
  }

  async function handleSave() {
    if (!draft.title.trim()) { setError('العنوان مطلوب'); return }
    setSaving(true)
    setError(null)
    try {
      if (editing) {
        const res = await fetch(`/api/dashboard/content-blocks/${editing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: draft.title, description: draft.description, icon: draft.icon }),
        })
        if (!res.ok) { const d = await res.json(); setError(d.error ?? 'حدث خطأ'); return }
        const updated = await res.json()
        setBlocks(bs => bs.map(b => b.id === updated.id ? updated : b))
      } else {
        const res = await fetch('/api/dashboard/content-blocks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, title: draft.title, description: draft.description, icon: draft.icon }),
        })
        if (!res.ok) { const d = await res.json(); setError(d.error ?? 'حدث خطأ'); return }
        const created = await res.json()
        setBlocks(bs => [...bs, created])
      }
      setOpen(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    try {
      await fetch(`/api/dashboard/content-blocks/${id}`, { method: 'DELETE' })
      setBlocks(bs => bs.filter(b => b.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  const BlockIcon = getIcon(draft.icon)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {blocks.length} / 6 عناصر — {sectionLabel} تظهر في صفحة الموقع الرئيسية
        </p>
        <Button size="sm" onClick={openAdd} disabled={blocks.length >= 6}>
          <Plus className="h-4 w-4 ml-1" />
          إضافة {itemLabel}
        </Button>
      </div>

      {blocks.length === 0 ? (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 text-center">
          <p className="text-gray-400 text-sm mb-3">لا يوجد {sectionLabel} مخصصة بعد</p>
          <p className="text-gray-300 text-xs">سيتم عرض المحتوى الافتراضي على الموقع</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={openAdd}>
            <Plus className="h-4 w-4 ml-1" />
            أضف أول {itemLabel}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {blocks.map(block => {
            const BIcon = getIcon(block.icon)
            return (
              <div key={block.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white hover:border-gray-300 transition-colors group">
                <GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0" />
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{block.title}</p>
                  {block.description && (
                    <p className="text-xs text-gray-400 truncate mt-0.5">{block.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(block)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost" size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(block.id)}
                    disabled={deleting === block.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editing ? `تعديل ${itemLabel}` : `إضافة ${itemLabel} جديدة`}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>العنوان *</Label>
              <Input
                value={draft.title}
                onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                placeholder={type === 'service' ? 'مثال: تصميم معماري' : 'مثال: خبرة واسعة'}
                className="mt-1"
              />
            </div>

            <div>
              <Label>الوصف</Label>
              <Textarea
                value={draft.description}
                onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
                placeholder="وصف قصير..."
                rows={2}
                className="mt-1 resize-none"
              />
            </div>

            <div>
              <Label className="mb-2 block">الأيقونة</Label>
              <div className="grid grid-cols-7 gap-1.5">
                {ICON_OPTIONS.map(({ key, Icon, label }) => (
                  <button
                    key={key}
                    type="button"
                    title={label}
                    onClick={() => setDraft(d => ({ ...d, icon: key }))}
                    className={cn(
                      'w-full aspect-square flex items-center justify-center rounded-lg border-2 transition-colors',
                      draft.icon === key
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 hover:border-gray-400 text-gray-500'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'جاري الحفظ...' : 'حفظ'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
