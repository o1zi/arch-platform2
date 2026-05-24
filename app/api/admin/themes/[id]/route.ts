import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('admin_users').select('id').eq('user_id', user.id).single()
  return data ? user : null
}

// ── PATCH /api/admin/themes/[id] — تعديل (تفعيل/إيقاف/تغيير الباقة) ───────
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const admin = await requireAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'JSON غير صالح' }, { status: 400 }) }

  const allowed = ['name_ar', 'name_en', 'description_ar', 'is_active', 'plan_required', 'visibility']
  const updates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in body) updates[key] = body[key]
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'لا توجد حقول للتعديل' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('custom_themes')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ theme: data })
}

// ── DELETE /api/admin/themes/[id] — حذف قالب ────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const admin = await requireAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  // إلغاء ربط أي مكتب يستخدم هذا القالب أولاً
  await supabase
    .from('tenants')
    .update({ custom_theme_id: null })
    .eq('custom_theme_id', params.id)

  const { error } = await supabase.from('custom_themes').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
