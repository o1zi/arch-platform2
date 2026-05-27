'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'
import type { Tenant, Project } from '@/types'
import { ADMIN_PLATFORM_STATS } from '@/lib/data'

// ── Field mappers ──────────────────────────────────────────────
function mapSvc(s: Record<string, unknown>) {
  return { ...s, desc: s.description } as Record<string, unknown>
}
function mapTesti(t: Record<string, unknown>) {
  return { ...t, text: t.body } as Record<string, unknown>
}
function mapFaq(f: Record<string, unknown>) {
  return { ...f, q: f.question, a: f.answer } as Record<string, unknown>
}
function mapLog(l: Record<string, unknown>) {
  return {
    ...l,
    by: (l as Record<string, unknown>).by_user,
    at: ((l as Record<string, unknown>).created_at as string || '').split('T')[0],
  }
}

// ── Auth ──────────────────────────────────────────────────────
export async function sbSignIn(email: string, password: string) {
  const supabase = await createClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export async function sbSignOut() {
  const supabase = await createClient()
  return supabase.auth.signOut()
}

export async function sbGetSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function sbIsAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const sbAdm = await createServiceClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return false
    const { data } = await sbAdm.from('admin_users').select('id').eq('user_id', session.user.id).maybeSingle()
    return !!data
  } catch { return false }
}

// ── Tenant ────────────────────────────────────────────────────
export async function sbGetMyTenant() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return { data: null, error: 'no_user' }
  return supabase.from('tenants').select('*').eq('user_id', session.user.id).maybeSingle()
}

export async function sbGetTenantBySlug(slug: string) {
  const supabase = await createClient()
  return supabase.from('tenants').select('*').eq('slug', slug).maybeSingle()
}

export async function sbGetAllTenants() {
  const sbAdm = await createServiceClient()
  return sbAdm.from('tenants').select('*').order('created_at', { ascending: false })
}

export async function sbUpdateTenant(id: string, updates: Partial<Tenant>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('tenants').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  return { data, error }
}

export async function sbToggleTenant(id: string, active: boolean) {
  const sbAdm = await createServiceClient()
  return sbAdm.from('tenants').update({ is_active: active }).eq('id', id).select().single()
}

export async function sbRenewTenant(id: string, months = 12) {
  const sbAdm = await createServiceClient()
  const { data: t } = await sbAdm.from('tenants').select('plan, subscription_end').eq('id', id).single()
  if (!t) return { error: 'tenant_not_found' }
  const newEnd = new Date(t.subscription_end || new Date().toISOString().split('T')[0])
  newEnd.setMonth(newEnd.getMonth() + months)
  const planRev: Record<string, number> = { basic: 1200, pro: 2000, premium: 3500 }
  const { error } = await sbAdm.from('tenants').update({
    subscription_end: newEnd.toISOString().split('T')[0], is_active: true,
  }).eq('id', id)
  if (error) return { error: error.message }
  await sbAdm.from('subscription_logs').insert({
    tenant_id: id, action: 'renewed', plan: t.plan,
    amount: planRev[t.plan] || 0, notes: `تجديد ${months} شهر`, performed_by: 'admin',
  })
  return { error: null }
}

export async function sbUpgradePlan(id: string, newPlan: string) {
  const sbAdm = await createServiceClient()
  const { data: t } = await sbAdm.from('tenants').select('plan').eq('id', id).single()
  if (!t) return { error: 'tenant_not_found' }
  const planRev: Record<string, number> = { basic: 1200, pro: 2000, premium: 3500 }
  const { error } = await sbAdm.from('tenants').update({ plan: newPlan }).eq('id', id)
  if (error) return { error: error.message }
  await sbAdm.from('subscription_logs').insert({
    tenant_id: id, action: 'activated', plan: newPlan,
    amount: planRev[newPlan] - (planRev[t.plan] || 0), notes: `ترقية من ${t.plan} إلى ${newPlan}`, performed_by: 'admin',
  })
  return { error: null }
}

export async function sbPauseTenant(id: string) {
  const sbAdm = await createServiceClient()
  const { error } = await sbAdm.from('tenants').update({ is_active: false }).eq('id', id)
  if (error) return { error: error.message }
  await sbAdm.from('subscription_logs').insert({
    tenant_id: id, action: 'suspended', plan: '', amount: 0, notes: 'إيقاف من قبل الأدمن', performed_by: 'admin',
  })
  return { error: null }
}

// ── Projects ──────────────────────────────────────────────────
export async function sbGetProjects(tid: string) {
  const supabase = await createClient()
  return supabase.from('projects').select('*').eq('tenant_id', tid).is('deleted_at', null).order('sort_order')
}

export async function sbAddProject(proj: Partial<Project>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('projects').insert(proj).select().single()
  return { data, error }
}

export async function sbUpdateProject(id: string, upd: Partial<Project>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('projects').update(upd).eq('id', id).select().single()
  return { data, error }
}

export async function sbDeleteProject(id: string) {
  const supabase = await createClient()
  return supabase.from('projects').update({ deleted_at: new Date().toISOString() }).eq('id', id)
}

// ── Content Blocks (services/features) ───────────────────────
export async function sbGetServices(tid: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('content_blocks').select('*').eq('tenant_id', tid).order('sort_order')
  return { data: data?.map(mapSvc) ?? null, error }
}

export async function sbAddService(svc: Record<string, unknown>) {
  const supabase = await createClient()
  const s = svc as Record<string, unknown>
  const payload = { tenant_id: s.tenant_id, type: s.type, title: s.title, icon: s.icon, sort_order: s.sort_order, is_active: s.is_active, description: s.desc ?? s.description ?? '' }
  const { data, error } = await supabase.from('content_blocks').insert(payload).select().single()
  return { data: data ? mapSvc(data) : null, error }
}

export async function sbUpdateService(id: string, upd: Record<string, unknown>) {
  const supabase = await createClient()
  const payload = { ...upd }
  if ('desc' in payload) { payload.description = payload.desc; delete payload.desc }
  const { data, error } = await supabase.from('content_blocks').update(payload).eq('id', id).select().single()
  return { data: data ? mapSvc(data) : null, error }
}

export async function sbDeleteService(id: string) {
  const supabase = await createClient()
  return supabase.from('content_blocks').delete().eq('id', id)
}

// ── Stats ─────────────────────────────────────────────────────
export async function sbGetStats(tid: string) {
  const supabase = await createClient()
  return supabase.from('tenant_stats').select('*').eq('tenant_id', tid).order('sort_order')
}
export async function sbAddStat(s: Record<string, unknown>) {
  const supabase = await createClient()
  return supabase.from('tenant_stats').insert(s).select().single()
}
export async function sbUpdateStat(id: string, u: Record<string, unknown>) {
  const supabase = await createClient()
  return supabase.from('tenant_stats').update(u).eq('id', id).select().single()
}
export async function sbDeleteStat(id: string) {
  const supabase = await createClient()
  return supabase.from('tenant_stats').delete().eq('id', id)
}

// ── Testimonials ──────────────────────────────────────────────
export async function sbGetTestimonials(tid: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('tenant_testimonials').select('*').eq('tenant_id', tid).order('sort_order')
  return { data: data?.map(mapTesti) ?? null, error }
}
export async function sbAddTestimonial(t: Record<string, unknown>) {
  const supabase = await createClient()
  const ti = t as Record<string, unknown>
  const payload = { tenant_id: ti.tenant_id, name: ti.name, role: ti.role, rating: ti.rating, sort_order: ti.sort_order, is_active: ti.is_active, content: ti.text ?? ti.content ?? '' }
  const { data, error } = await supabase.from('tenant_testimonials').insert(payload).select().single()
  return { data: data ? mapTesti(data) : null, error }
}
export async function sbUpdateTestimonial(id: string, upd: Record<string, unknown>) {
  const supabase = await createClient()
  const payload = { ...upd }
  if ('text' in payload) { payload.content = payload.text; delete payload.text }
  const { data, error } = await supabase.from('tenant_testimonials').update(payload).eq('id', id).select().single()
  return { data: data ? mapTesti(data) : null, error }
}
export async function sbDeleteTestimonial(id: string) {
  const supabase = await createClient()
  return supabase.from('tenant_testimonials').delete().eq('id', id)
}

// ── FAQs ──────────────────────────────────────────────────────
export async function sbGetFaqs(tid: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('tenant_faqs').select('*').eq('tenant_id', tid).order('sort_order')
  return { data: data?.map(mapFaq) ?? null, error }
}
export async function sbAddFaq(f: Record<string, unknown>) {
  const supabase = await createClient()
  const fa = f as Record<string, unknown>
  const payload = { tenant_id: fa.tenant_id, sort_order: fa.sort_order, is_active: fa.is_active, question: fa.q ?? fa.question ?? '', answer: fa.a ?? fa.answer ?? '' }
  const { data, error } = await supabase.from('tenant_faqs').insert(payload).select().single()
  return { data: data ? mapFaq(data) : null, error }
}
export async function sbUpdateFaq(id: string, upd: Record<string, unknown>) {
  const supabase = await createClient()
  const payload = { ...upd }
  if ('q' in payload) { payload.question = payload.q; delete payload.q }
  if ('a' in payload) { payload.answer = payload.a; delete payload.a }
  const { data, error } = await supabase.from('tenant_faqs').update(payload).eq('id', id).select().single()
  return { data: data ? mapFaq(data) : null, error }
}
export async function sbDeleteFaq(id: string) {
  const supabase = await createClient()
  return supabase.from('tenant_faqs').delete().eq('id', id)
}

// ── Subscription Logs ─────────────────────────────────────────
export async function sbGetSubLogs(tid: string) {
  const sbAdm = await createServiceClient()
  const { data, error } = await sbAdm.from('subscription_logs').select('*').eq('tenant_id', tid).order('created_at', { ascending: false })
  return { data: data?.map(mapLog) ?? null, error }
}

// ── Admin platform stats ──────────────────────────────────────
export async function sbGetAdminStats() {
  const sbAdm = await createServiceClient()
  const { data } = await sbAdm.from('tenants').select('id, is_active, plan, subscription_end')
  if (!data?.length) return ADMIN_PLATFORM_STATS
  const now = new Date()
  const planRev: Record<string, number> = { basic: 1200, pro: 2000, premium: 3500 }
  return {
    total_tenants: data.length,
    active_tenants: data.filter(t => t.is_active).length,
    ending_soon: data.filter(t => {
      const d = Math.ceil((new Date(t.subscription_end).getTime() - now.getTime()) / 86400000)
      return t.is_active && d <= 30 && d > 0
    }).length,
    expired: data.filter(t => !t.is_active).length,
    monthly_revenue: Math.round(data.filter(t => t.is_active).reduce((s, t) => s + (planRev[t.plan] || 0), 0) / 12),
    total_visitors_30d: 47820,
  }
}

// ── Storage upload ────────────────────────────────────────────
export async function sbUpload(bucket: string, path: string, file: File) {
  const supabase = await createClient()
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true, contentType: file.type })
  if (error) return { url: null, error: error.message }
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: publicUrl, error: null }
}
