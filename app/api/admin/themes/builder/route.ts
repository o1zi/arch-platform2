import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { validateThemeConfig } from '@/lib/theme-validator'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase: null, user: null, error: 'غير مصرح' }
  const { data: adminRow } = await supabase.from('admin_users').select('id').eq('user_id', user.id).single()
  if (!adminRow) return { supabase: null, user: null, error: 'غير مصرح' }
  return { supabase, user, error: null }
}

// POST — إنشاء قالب جديد من المحرر
export async function POST(req: NextRequest) {
  const { supabase, user, error } = await checkAdmin()
  if (error || !supabase || !user) return NextResponse.json({ error }, { status: 403 })

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 }) }

  const { name_ar, name_en, description_ar, plan_required, visibility, config } = body

  if (!name_ar || typeof name_ar !== 'string' || !name_ar.trim())
    return NextResponse.json({ error: 'اسم القالب مطلوب' }, { status: 400 })

  const { valid, errors } = validateThemeConfig(config)
  if (!valid) return NextResponse.json({ error: 'إعدادات القالب غير صالحة', details: errors }, { status: 400 })

  const { data: theme, error: dbErr } = await supabase
    .from('custom_themes')
    .insert({
      name_ar: (name_ar as string).trim(),
      name_en: name_en || null,
      description_ar: description_ar || null,
      plan_required: plan_required || 'pro',
      visibility: visibility || 'public',
      config,
      fonts: [],
      is_active: true,
      created_by: user.id,
    })
    .select()
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json({ theme }, { status: 201 })
}

// PUT — تعديل قالب موجود من المحرر
export async function PUT(req: NextRequest) {
  const { supabase, error } = await checkAdmin()
  if (error || !supabase) return NextResponse.json({ error }, { status: 403 })

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'بيانات غير صالحة' }, { status: 400 }) }

  const { id, name_ar, name_en, description_ar, plan_required, visibility, config } = body

  if (!id) return NextResponse.json({ error: 'معرف القالب مطلوب' }, { status: 400 })
  if (!name_ar || typeof name_ar !== 'string' || !name_ar.trim())
    return NextResponse.json({ error: 'اسم القالب مطلوب' }, { status: 400 })

  const { valid, errors } = validateThemeConfig(config)
  if (!valid) return NextResponse.json({ error: 'إعدادات القالب غير صالحة', details: errors }, { status: 400 })

  const { data: theme, error: dbErr } = await supabase
    .from('custom_themes')
    .update({
      name_ar: (name_ar as string).trim(),
      name_en: name_en || null,
      description_ar: description_ar || null,
      plan_required: plan_required || 'pro',
      visibility: visibility || 'public',
      config,
    })
    .eq('id', id)
    .select()
    .single()

  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })
  return NextResponse.json({ theme })
}
