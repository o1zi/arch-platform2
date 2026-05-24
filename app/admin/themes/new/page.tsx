'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowRight, Upload, FileArchive, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'

export default function NewThemePage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [planRequired, setPlanRequired] = useState<string>('pro')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  function handleFile(f: File | null) {
    if (!f) return
    if (!f.name.endsWith('.zip')) {
      toast.error('الملف يجب أن يكون بصيغة .zip')
      return
    }
    if (f.size > 20 * 1024 * 1024) {
      toast.error('حجم الملف يتجاوز 20MB')
      return
    }
    setFile(f)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0] ?? null)
  }

  async function handleUpload() {
    if (!file) { toast.error('اختر ملف ZIP أولاً'); return }
    setUploading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('plan_required', planRequired)

    const res = await fetch('/api/admin/themes', { method: 'POST', body: formData })
    const data = await res.json()
    setUploading(false)

    if (!res.ok) {
      if (data.details?.length) {
        toast.error(`أخطاء في theme.json:\n${data.details.join('\n')}`, { duration: 8000 })
      } else {
        toast.error(data.error ?? 'فشل الرفع')
      }
      return
    }

    toast.success('تم رفع القالب بنجاح!')
    router.push('/admin/themes')
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/themes" className="text-gray-500 hover:text-gray-700">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold">رفع قالب جديد</h1>
      </div>

      {/* إرشادات سريعة */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
        <p className="font-medium text-blue-800 text-sm">هيكل ملف ZIP المطلوب:</p>
        <div className="font-mono text-xs text-blue-700 space-y-0.5 bg-blue-100 rounded-lg p-3" dir="ltr">
          <p>📦 my-theme.zip</p>
          <p className="mr-4">├── theme.json &nbsp;&nbsp;← إلزامي</p>
          <p className="mr-4">├── preview.jpg &nbsp;← موصى به (أو .png / .webp)</p>
          <p className="mr-4">└── fonts/ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;← اختياري</p>
          <p className="mr-8">└── font.woff2</p>
        </div>
        <Link href="/THEME_BUILDER_GUIDE.md" target="_blank"
          className="inline-block text-xs text-blue-600 hover:underline mt-1">
          ← اقرأ دليل بناء القالب الكامل
        </Link>
      </div>

      {/* منطقة السحب والإفلات */}
      <div
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${
          dragOver ? 'border-blue-400 bg-blue-50' : file ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={e => handleFile(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <div className="space-y-2">
            <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
            <p className="font-medium text-green-700">{file.name}</p>
            <p className="text-sm text-green-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <p className="text-xs text-gray-400">انقر لتغيير الملف</p>
          </div>
        ) : (
          <div className="space-y-3">
            <FileArchive className="h-10 w-10 text-gray-300 mx-auto" />
            <div>
              <p className="font-medium text-gray-600">اسحب ملف ZIP هنا</p>
              <p className="text-sm text-gray-400 mt-1">أو انقر للاختيار · حد أقصى 20MB</p>
            </div>
          </div>
        )}
      </div>

      {/* إعدادات القالب */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-4">
        <h2 className="font-semibold text-gray-800">إعدادات القالب</h2>
        <div className="space-y-2">
          <Label>الباقة المطلوبة لاستخدام هذا القالب</Label>
          <Select value={planRequired} onValueChange={v => v && setPlanRequired(v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic — متاح للجميع</SelectItem>
              <SelectItem value="pro">Pro — يحتاج باقة Pro أو أعلى</SelectItem>
              <SelectItem value="premium">Premium — للباقة المميزة فقط</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* تحذير */}
      <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          تأكد أن <strong>theme.json</strong> مكتوب بشكل صحيح قبل الرفع. يمكنك الاطلاع على دليل بناء القوالب للتفاصيل.
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={handleUpload} disabled={!file || uploading} className="flex-1 gap-2">
          {uploading ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> جارٍ الرفع...</>
          ) : (
            <><Upload className="h-4 w-4" /> رفع القالب</>
          )}
        </Button>
        <Link href="/admin/themes">
          <Button variant="outline">إلغاء</Button>
        </Link>
      </div>
    </div>
  )
}
