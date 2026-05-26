import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createHash } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tenant_slug, event_type, page, project_id, meta, referrer } = body

    if (!tenant_slug || !event_type) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    // تشفير الـ IP لحماية الخصوصية
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'
    const ip_hash = createHash('sha256')
      .update(ip + tenant_slug)
      .digest('hex')
      .slice(0, 16)

    const supabase = await createServiceClient()

    // جلب بيانات المكتب
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id, plan, is_active')
      .eq('slug', tenant_slug)
      .single()

    if (!tenant || !tenant.is_active) {
      return NextResponse.json({ ok: false }, { status: 404 })
    }

    // التحليلات للباقة pro وpremium فقط
    if (tenant.plan === 'basic') {
      return NextResponse.json({ ok: true, skipped: true })
    }

    await supabase.from('analytics_events').insert({
      tenant_id:  tenant.id,
      event_type,
      page:       page       || null,
      project_id: project_id || null,
      meta:       meta       || null,
      ip_hash,
      referrer:   referrer   || null,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
