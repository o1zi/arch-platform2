import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

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

  // إرسال إيميل الترحيب عبر Resend
  if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 'your_resend_api_key') {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'
      const protocol = rootDomain.startsWith('localhost') ? 'http' : 'https'
      const dashboardUrl = `${protocol}://${rootDomain}/dashboard`

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? 'noreply@yourplatform.com',
        to: email,
        subject: `مرحباً بك في المنصة — ${name_ar}`,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f9f9f9;">
            <h1 style="color: #1a1a1a; font-size: 24px; margin-bottom: 8px;">مرحباً بك في المنصة! 🎉</h1>
            <p style="color: #444; font-size: 16px; line-height: 1.6;">
              تم إنشاء حساب مكتبك <strong>${name_ar}</strong> بنجاح. يمكنك الآن الدخول وإدارة موقعك.
            </p>
            <div style="background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <p style="margin: 0 0 8px; color: #888; font-size: 13px;">بيانات الدخول:</p>
              <p style="margin: 0 0 4px; color: #1a1a1a;"><strong>البريد الإلكتروني:</strong> ${email}</p>
              <p style="margin: 0; color: #1a1a1a;"><strong>رابط الداشبورد:</strong> <a href="${dashboardUrl}" style="color: #2563eb;">${dashboardUrl}</a></p>
            </div>
            <a href="${dashboardUrl}"
              style="display: inline-block; background: #1a1a1a; color: #fff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px;">
              ادخل إلى الداشبورد
            </a>
            <p style="margin-top: 32px; color: #888; font-size: 13px;">
              إذا واجهت أي مشكلة، تواصل معنا على واتساب.
            </p>
          </div>
        `,
      })
    } catch (emailErr) {
      // الإيميل اختياري — لا نوقف العملية لو فشل
      console.error('Welcome email failed:', emailErr)
    }
  }

  return NextResponse.json({ tenantId: tenant.id })
}
