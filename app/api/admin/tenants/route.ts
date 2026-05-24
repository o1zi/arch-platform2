import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createServiceClient()

  // Verify caller is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: adminRecord } = await supabase
    .from('admin_users')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!adminRecord) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { name_ar, slug, email, password, plan, sector, subscription_start, subscription_end, notes } = body

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

  // Create tenant
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .insert({
      name_ar,
      slug,
      plan,
      sector: sector || 'engineering',
      subscription_start: subscription_start || null,
      subscription_end: subscription_end || null,
      is_active: true,
    })
    .select()
    .single()

  if (tenantError) {
    await supabase.auth.admin.deleteUser(authData.user.id)
    return NextResponse.json({ error: tenantError.message }, { status: 400 })
  }

  // Link user to tenant
  await supabase.from('tenant_users').insert({
    tenant_id: tenant.id,
    user_id: authData.user.id,
    role: 'owner',
  })

  // Log subscription
  await supabase.from('subscription_logs').insert({
    tenant_id: tenant.id,
    action: 'activated',
    plan,
    notes: notes || null,
    performed_by: user.id,
  })

  // TODO: Send welcome email via Resend

  return NextResponse.json({ tenantId: tenant.id })
}
