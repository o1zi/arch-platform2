import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function getTenantId(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from('tenant_users')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()
  return data?.tenant_id ?? null
}

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const type = req.nextUrl.searchParams.get('type')
  let query = supabase
    .from('tenant_content_blocks')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('sort_order', { ascending: true })

  if (type === 'service' || type === 'feature') {
    query = query.eq('type', type)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const tenantId = await getTenantId(supabase)
  if (!tenantId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { type, title, description, icon, sort_order } = body

  if (!type || !title) return NextResponse.json({ error: 'type and title are required' }, { status: 400 })
  if (type !== 'service' && type !== 'feature') return NextResponse.json({ error: 'invalid type' }, { status: 400 })

  // Enforce max 6 per type
  const { count } = await supabase
    .from('tenant_content_blocks')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('type', type)

  if ((count ?? 0) >= 6) {
    return NextResponse.json({ error: 'الحد الأقصى 6 عناصر لكل قسم' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('tenant_content_blocks')
    .insert({ tenant_id: tenantId, type, title, description, icon, sort_order: sort_order ?? (count ?? 0) })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
