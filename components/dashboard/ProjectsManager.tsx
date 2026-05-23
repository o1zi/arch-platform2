'use client'

import { useState } from 'react'
import { Tenant, Project, PLAN_LIMITS } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Star } from 'lucide-react'
import Image from 'next/image'

const CATEGORIES = ['سكني', 'تجاري', 'صناعي', 'ترفيهي', 'حكومي', 'تعليمي']

interface ProjectForm {
  title_ar: string
  title_en: string
  description_ar: string
  description_en: string
  category: string | null
  location_ar: string
  year: string
  is_featured: boolean
}

const emptyForm: ProjectForm = {
  title_ar: '', title_en: '', description_ar: '', description_en: '',
  category: null, location_ar: '', year: '', is_featured: false,
}

export default function ProjectsManager({ tenant, projects: initial }: { tenant: Tenant; projects: Project[] }) {
  const supabase = createClient()
  const [projects, setProjects] = useState(initial)
  const [open, setOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [form, setForm] = useState<ProjectForm>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>([])
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)

  const limit = PLAN_LIMITS[tenant.plan].projects
  const atLimit = limit !== Infinity && projects.length >= limit

  function openNew() {
    setEditProject(null)
    setForm(emptyForm)
    setCoverPreview(null)
    setCoverFile(null)
    setGalleryFiles([])
    setGalleryPreviews([])
    setExistingImages([])
    setOpen(true)
  }

  async function openEdit(p: Project) {
    setEditProject(p)
    setForm({
      title_ar: p.title_ar, title_en: p.title_en ?? '',
      description_ar: p.description_ar ?? '', description_en: p.description_en ?? '',
      category: p.category ?? null, location_ar: p.location_ar ?? '',
      year: p.year?.toString() ?? '', is_featured: p.is_featured,
    })
    setCoverPreview(p.cover_image_url)
    setCoverFile(null)
    setGalleryFiles([])
    setGalleryPreviews([])
    // load existing gallery images
    const { data } = await supabase
      .from('project_images')
      .select('id, url')
      .eq('project_id', p.id)
      .order('sort_order', { ascending: true })
    setExistingImages((data ?? []) as { id: string; url: string }[])
    setOpen(true)
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  function handleGalleryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const remaining = 20 - existingImages.length - galleryFiles.length
    const toAdd = files.slice(0, remaining)
    setGalleryFiles(prev => [...prev, ...toAdd])
    setGalleryPreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))])
    e.target.value = ''
  }

  function removeNewGalleryImage(index: number) {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index))
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  async function deleteExistingImage(imageId: string) {
    setDeletingImageId(imageId)
    await supabase.from('project_images').delete().eq('id', imageId)
    setExistingImages(prev => prev.filter(img => img.id !== imageId))
    setDeletingImageId(null)
  }

  async function handleSave() {
    if (!form.title_ar.trim()) { toast.error('اسم المشروع (عربي) مطلوب'); return }
    setSaving(true)

    let coverUrl = editProject?.cover_image_url ?? null

    if (coverFile) {
      const ext = coverFile.name.split('.').pop()
      const projectId = editProject?.id ?? crypto.randomUUID()
      const { error: upErr } = await supabase.storage
        .from('project-covers')
        .upload(`${tenant.id}/${projectId}/cover.${ext}`, coverFile, { upsert: true })
      if (upErr) { toast.error('فشل رفع الصورة'); setSaving(false); return }
      const { data: urlData } = supabase.storage.from('project-covers').getPublicUrl(`${tenant.id}/${projectId}/cover.${ext}`)
      coverUrl = urlData.publicUrl
    }

    const payload = {
      tenant_id: tenant.id,
      title_ar: form.title_ar,
      title_en: form.title_en || null,
      description_ar: form.description_ar || null,
      description_en: form.description_en || null,
      category: form.category || null,
      location_ar: form.location_ar || null,
      year: form.year ? parseInt(form.year) : null,
      is_featured: form.is_featured,
      cover_image_url: coverUrl,
    }

    let savedProjectId = editProject?.id ?? ''

    if (editProject) {
      const { data, error } = await supabase.from('projects').update(payload).eq('id', editProject.id).select().single()
      if (error) { toast.error('فشل التحديث'); setSaving(false); return }
      setProjects(prev => prev.map(p => p.id === editProject.id ? { ...p, ...data } : p))
      toast.success('تم تحديث المشروع')
    } else {
      const { data, error } = await supabase.from('projects').insert({ ...payload, sort_order: projects.length }).select().single()
      if (error) { toast.error('فشل الإضافة'); setSaving(false); return }
      savedProjectId = data.id
      setProjects(prev => [...prev, data])
      toast.success('تم إضافة المشروع')
    }

    // upload gallery images
    if (galleryFiles.length > 0) {
      const currentCount = existingImages.length
      for (let i = 0; i < galleryFiles.length; i++) {
        const file = galleryFiles[i]
        const ext = file.name.split('.').pop()
        const imageId = crypto.randomUUID()
        const path = `${tenant.id}/${savedProjectId}/${imageId}.${ext}`
        const { error: upErr } = await supabase.storage.from('project-images').upload(path, file, { upsert: true })
        if (upErr) continue
        const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(path)
        await supabase.from('project_images').insert({
          project_id: savedProjectId,
          tenant_id: tenant.id,
          url: urlData.publicUrl,
          sort_order: currentCount + i,
        })
      }
      if (galleryFiles.length > 0) toast.success(`تم رفع ${galleryFiles.length} صورة`)
    }

    setSaving(false)
    setOpen(false)
  }

  async function handleDelete() {
    if (!deleteId) return
    const { error } = await supabase
      .from('projects')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', deleteId)
    if (error) { toast.error('فشل الحذف'); return }
    setProjects(prev => prev.filter(p => p.id !== deleteId))
    setDeleteId(null)
    toast.success('تم حذف المشروع')
  }

  return (
    <>
      <div className="flex justify-between items-center">
        <Button onClick={openNew} disabled={atLimit} className="gap-2">
          <Plus className="h-4 w-4" />
          مشروع جديد
        </Button>
        {atLimit && <p className="text-sm text-amber-600">وصلت للحد الأقصى لباقتك</p>}
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        {projects.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p>لا توجد مشاريع بعد. ابدأ بإضافة مشروعك الأول!</p>
          </div>
        ) : (
          <table className="w-full text-sm min-w-[480px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-right p-3 font-medium text-gray-600">المشروع</th>
                <th className="text-right p-3 font-medium text-gray-600 hidden sm:table-cell">التصنيف</th>
                <th className="text-right p-3 font-medium text-gray-600 hidden md:table-cell">السنة</th>
                <th className="text-center p-3 font-medium text-gray-600">مميّز</th>
                <th className="text-right p-3 font-medium text-gray-600">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map(project => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {project.cover_image_url && (
                        <Image src={project.cover_image_url} alt="" width={40} height={40} className="w-10 h-10 rounded-md object-cover flex-shrink-0" />
                      )}
                      <span className="font-medium">{project.title_ar}</span>
                    </div>
                  </td>
                  <td className="p-3 hidden sm:table-cell">
                    {project.category && <Badge variant="secondary">{project.category}</Badge>}
                  </td>
                  <td className="p-3 hidden md:table-cell text-gray-500">{project.year}</td>
                  <td className="p-3 text-center">
                    {project.is_featured && <Star className="h-4 w-4 text-amber-500 mx-auto" />}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(project)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => setDeleteId(project.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editProject ? 'تعديل المشروع' : 'مشروع جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الاسم (عربي) *</Label>
                <Input value={form.title_ar} onChange={e => setForm(f => ({ ...f, title_ar: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>الاسم (إنجليزي)</Label>
                <Input value={form.title_en} onChange={e => setForm(f => ({ ...f, title_en: e.target.value }))} dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>الوصف (عربي)</Label>
                <Textarea value={form.description_ar} onChange={e => setForm(f => ({ ...f, description_ar: e.target.value }))} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>الوصف (إنجليزي)</Label>
                <Textarea value={form.description_en} onChange={e => setForm(f => ({ ...f, description_en: e.target.value }))} rows={3} dir="ltr" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>التصنيف</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="اختر..." /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الموقع</Label>
                <Input value={form.location_ar} onChange={e => setForm(f => ({ ...f, location_ar: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>السنة</Label>
                <Input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))} placeholder="2024" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={form.is_featured}
                onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                className="h-4 w-4"
              />
              <Label htmlFor="featured">مشروع مميّز (يظهر في الصفحة الرئيسية)</Label>
            </div>
            <div className="space-y-2">
              <Label>صورة الغلاف</Label>
              {coverPreview && (
                <Image src={coverPreview} alt="cover" width={200} height={120} className="rounded-lg object-cover w-48 h-28" />
              )}
              <Input type="file" accept="image/*" onChange={handleCoverChange} />
            </div>

            {/* Gallery */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>معرض الصور</Label>
                <span className="text-xs text-gray-400">
                  {existingImages.length + galleryFiles.length} / 20 صورة
                </span>
              </div>

              {/* existing images */}
              {existingImages.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {existingImages.map(img => (
                    <div key={img.id} className="relative group aspect-square">
                      <Image src={img.url} alt="" fill className="object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => deleteExistingImage(img.id)}
                        disabled={deletingImageId === img.id}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white text-xl"
                      >
                        {deletingImageId === img.id ? '...' : '×'}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* new images to upload */}
              {galleryPreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {galleryPreviews.map((src, i) => (
                    <div key={i} className="relative group aspect-square">
                      <Image src={src} alt="" fill className="object-cover rounded-lg opacity-70" />
                      <div className="absolute top-1 right-1 bg-blue-500 text-white text-[10px] px-1 rounded">جديد</div>
                      <button
                        type="button"
                        onClick={() => removeNewGalleryImage(i)}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center text-white text-xl"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {existingImages.length + galleryFiles.length < 20 && (
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-gray-400 transition-colors text-sm text-gray-400 hover:text-gray-600">
                  <span>+ أضف صور للمعرض</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
                </label>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'جارٍ الحفظ...' : 'حفظ'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={o => !o && setDeleteId(null)}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>حذف المشروع</AlertDialogTitle>
            <AlertDialogDescription>هل أنت متأكد من حذف هذا المشروع؟ لا يمكن التراجع عن هذا الإجراء.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">حذف</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
