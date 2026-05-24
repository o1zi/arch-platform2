import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('admin_users').select('id').eq('user_id', user.id).single()
  return data ? user : null
}

// GET /api/admin/themes/[id]/tenants — قائمة المشتركين المخصصين لهذا القالب
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const admin = await requireAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { data, error } = await supabase
    .from('custom_theme_tenants')
    .select('*, tenant:tenants(id, name_ar, slug, plan, is_active)')
    .eq('custom_theme_id', params.id)
    .order('assigned_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ assignments: data })
}

// POST /api/admin/themes/[id]/tenants — تخصيص القالب لمشترك
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const admin = await requireAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  let body: { tenant_id: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'JSON غير صالح' }, { status: 400 }) }

  if (!body.tenant_id) return NextResponse.json({ error: 'tenant_id مطلوب' }, { status: 400 })

  // تحقق أن المكتب موجود
  const { data: tenant } = await supabase.from('tenants').select('id, name_ar').eq('id', body.tenant_id).single()
  if (!tenant) return NextResponse.json({ error: 'المكتب غير موجود' }, { status: 404 })

  const { data, error } = await supabase
    .from('custom_theme_tenants')
    .upsert({ custom_theme_id: params.id, tenant_id: body.tenant_id, assigned_by: admin.id })
    .select('*, tenant:tenants(id, name_ar, slug, plan)')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ assignment: data }, { status: 201 })
}

// DELETE /api/admin/themes/[id]/tenants — إلغاء تخصيص مشترك
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const admin = await requireAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'غير مصرح' }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const tenantId = searchParams.get('tenant_id')
  if (!tenantId) return NextResponse.json({ error: 'tenant_id مطلوب' }, { status: 400 })

  const { error } = await supabase
    .from('custom_theme_tenants')
    .delete()
    .eq('custom_theme_id', params.id)
    .eq('tenant_id', tenantId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
