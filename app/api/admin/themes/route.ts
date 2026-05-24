import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateThemeConfig } from '@/lib/theme-validator'
import JSZip from 'jszip'

// ── GET /api/admin/themes — قائمة القوالب المخصصة ───────────────────────────
export async function GET() {
  const supabase = await createClient()

  // التحقق من أن المستخدم أدمن
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const { data: adminRow } = await supabase
    .from('admin_users').select('id').eq('user_id', user.id).single()
  if (!adminRow) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { data: themes, error } = await supabase
    .from('custom_themes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ themes })
}

// ── POST /api/admin/themes — رفع قالب جديد (ZIP) ───────────────────────────
export async function POST(req: NextRequest) {
  const supabase = await createClient()

  // التحقق من الأدمن
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 })

  const { data: adminRow } = await supabase
    .from('admin_users').select('id').eq('user_id', user.id).single()
  if (!adminRow) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  // استلام الملف
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'فشل قراءة الملف' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'لم يتم إرسال ملف' }, { status: 400 })
  if (!file.name.endsWith('.zip')) return NextResponse.json({ error: 'الملف يجب أن يكون بصيغة .zip' }, { status: 400 })
  if (file.size > 20 * 1024 * 1024) return NextResponse.json({ error: 'حجم الملف يتجاوز 20MB' }, { status: 400 })

  const planRequired = (formData.get('plan_required') as string) || 'pro'

  // قراءة ZIP
  let zip: JSZip
  try {
    const buffer = await file.arrayBuffer()
    zip = await JSZip.loadAsync(buffer)
  } catch {
    return NextResponse.json({ error: 'فشل فتح ملف ZIP — تأكد أن الملف سليم' }, { status: 400 })
  }

  // التحقق من وجود theme.json
  const themeJsonFile = zip.file('theme.json')
  if (!themeJsonFile) {
    return NextResponse.json({ error: 'الملف theme.json غير موجود داخل ZIP' }, { status: 400 })
  }

  // قراءة وتحليل theme.json
  let config: unknown
  try {
    const raw = await themeJsonFile.async('string')
    config = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'theme.json غير صالح — تأكد من صحة JSON' }, { status: 400 })
  }

  // التحقق من صحة الـ schema
  const { valid, errors } = validateThemeConfig(config)
  if (!valid) {
    return NextResponse.json({ error: 'theme.json يحتوي على أخطاء', details: errors }, { status: 400 })
  }

  const cfg = config as Record<string, unknown>
  const nameAr = (cfg.name_ar as string) || file.name.replace('.zip', '')
  const nameEn = (cfg.name_en as string) || null
  const descriptionAr = (cfg.description_ar as string) || null

  // البحث عن صورة المعاينة
  const previewFile = zip.file('preview.jpg') || zip.file('preview.png') || zip.file('preview.webp') || zip.file('preview.jpeg')

  let previewUrl: string | null = null
  if (previewFile) {
    try {
      const previewBuffer = await previewFile.async('nodebuffer')
      const ext = previewFile.name.split('.').pop() ?? 'jpg'
      const previewPath = `${crypto.randomUUID()}/preview.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('theme-previews')
        .upload(previewPath, previewBuffer, { contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`, upsert: false })

      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('theme-previews').getPublicUrl(previewPath)
        previewUrl = urlData.publicUrl
      }
    } catch {
      // صورة المعاينة اختيارية — نكمل بدونها
    }
  }

  // معالجة الخطوط (fonts/ مجلد اختياري)
  const fontsData: Array<{ name: string; url: string }> = []
  const fontFiles = Object.keys(zip.files).filter(
    name => name.startsWith('fonts/') && !zip.files[name].dir &&
      /\.(woff2?|ttf|otf)$/i.test(name)
  )

  for (const fontPath of fontFiles) {
    try {
      const fontFile = zip.file(fontPath)
      if (!fontFile) continue
      const fontBuffer = await fontFile.async('nodebuffer')
      const fontName = fontPath.split('/').pop() ?? fontPath
      const storagePath = `${crypto.randomUUID()}/${fontName}`
      const ext = fontName.split('.').pop() ?? 'woff2'
      const mimeTypes: Record<string, string> = { woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', otf: 'font/otf' }

      const { error: fontErr } = await supabase.storage
        .from('theme-fonts')
        .upload(storagePath, fontBuffer, { contentType: mimeTypes[ext] ?? 'font/woff2', upsert: false })

      if (!fontErr) {
        const { data: urlData } = supabase.storage.from('theme-fonts').getPublicUrl(storagePath)
        fontsData.push({ name: fontName.replace(/\.[^.]+$/, ''), url: urlData.publicUrl })
      }
    } catch {
      // تجاهل الخطوط الفاشلة
    }
  }

  // حفظ في قاعدة البيانات
  const { data: theme, error: dbError } = await supabase
    .from('custom_themes')
    .insert({
      name_ar: nameAr,
      name_en: nameEn,
      description_ar: descriptionAr,
      preview_url: previewUrl,
      config,
      fonts: fontsData,
      plan_required: planRequired,
      created_by: user.id,
    })
    .select()
    .single()

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })

  return NextResponse.json({ theme }, { status: 201 })
}
