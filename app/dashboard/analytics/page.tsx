import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AnalyticsDashboard from './AnalyticsDashboard'

export default async function AnalyticsPage() {
  const supabase = await createClient()

  // جلب المستخدم الحالي
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // جلب بيانات المكتب
  const { data: tenantUser } = await supabase
    .from('tenant_users')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()

  if (!tenantUser) redirect('/login')

  const { data: tenant } = await supabase
    .from('tenants')
    .select('id, name_ar, plan, slug')
    .eq('id', tenantUser.tenant_id)
    .single()

  if (!tenant) redirect('/login')

  // التحليلات للباقة pro وpremium فقط
  if (tenant.plan === 'basic') {
    return (
      <div className="p-8 max-w-2xl mx-auto" dir="rtl">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-10 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">التحليلات متاحة في باقة Pro</h2>
          <p className="text-gray-500 text-sm mb-6">احصل على تقارير زوار مفصّلة، تتبع نقرات الواتساب والتواصل، وتحليلات المشاريع الأكثر مشاهدة.</p>
          <a href="/dashboard/subscription"
            className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
            ترقية الباقة
          </a>
        </div>
      </div>
    )
  }

  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const sevenDaysAgo  = new Date(now.getTime() -  7 * 24 * 60 * 60 * 1000).toISOString()
  const today         = new Date(now.setHours(0, 0, 0, 0)).toISOString()

  const [
    { count: views30 },
    { count: views7 },
    { count: viewsToday },
    { data: visitorsRaw30 },
    { count: waClicks30 },
    { count: phoneClicks30 },
    { count: emailClicks30 },
    { count: mapsClicks30 },
    { count: socialClicks30 },
    { count: contactPageViews30 },
    { count: projectViews30 },
    { data: dailyRaw },
    { data: projectsRaw },
    { data: referrersRaw },
    { data: eventTypesRaw },
  ] = await Promise.all([
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id).eq('event_type', 'page_view').gte('created_at', thirtyDaysAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id).eq('event_type', 'page_view').gte('created_at', sevenDaysAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id).eq('event_type', 'page_view').gte('created_at', today),
    // للزوار الفريدين — نجيب ip_hash ونحسبها في JS
    supabase.from('analytics_events').select('ip_hash')
      .eq('tenant_id', tenant.id).eq('event_type', 'page_view').gte('created_at', thirtyDaysAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id).eq('event_type', 'whatsapp_click').gte('created_at', thirtyDaysAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id).eq('event_type', 'phone_click').gte('created_at', thirtyDaysAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id).eq('event_type', 'email_click').gte('created_at', thirtyDaysAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id).eq('event_type', 'maps_click').gte('created_at', thirtyDaysAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id).eq('event_type', 'social_click').gte('created_at', thirtyDaysAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id).eq('event_type', 'contact_page_view').gte('created_at', thirtyDaysAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenant.id).eq('event_type', 'project_view').gte('created_at', thirtyDaysAgo),
    // بيانات آخر 14 يوم للرسم البياني
    supabase.from('analytics_events').select('created_at, ip_hash')
      .eq('tenant_id', tenant.id).eq('event_type', 'page_view')
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: true }),
    // أكثر المشاريع مشاهدة
    supabase.from('analytics_events').select('project_id, meta')
      .eq('tenant_id', tenant.id).eq('event_type', 'project_view')
      .gte('created_at', thirtyDaysAgo).not('project_id', 'is', null),
    // مصادر الزيارات
    supabase.from('analytics_events').select('referrer')
      .eq('tenant_id', tenant.id).eq('event_type', 'page_view')
      .gte('created_at', thirtyDaysAgo).not('referrer', 'is', null).neq('referrer', ''),
    // جميع أنواع الأحداث
    supabase.from('analytics_events').select('event_type')
      .eq('tenant_id', tenant.id).gte('created_at', thirtyDaysAgo),
  ])

  // حساب الزوار الفريدين
  const uniqueVisitors30 = new Set((visitorsRaw30 ?? []).map(r => r.ip_hash)).size

  // تجميع البيانات اليومية (آخر 14 يوم)
  const dailyMap: Record<string, { views: number; visitors: Set<string> }> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    dailyMap[key] = { views: 0, visitors: new Set() }
  }
  for (const row of dailyRaw ?? []) {
    const key = row.created_at.slice(0, 10)
    if (dailyMap[key]) {
      dailyMap[key].views++
      if (row.ip_hash) dailyMap[key].visitors.add(row.ip_hash)
    }
  }
  const dailyData = Object.entries(dailyMap).map(([date, d]) => ({
    date,
    label: new Date(date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
    views: d.views,
    visitors: d.visitors.size,
  }))

  // أكثر المشاريع مشاهدة
  const projectMap: Record<string, { title: string; count: number }> = {}
  for (const row of projectsRaw ?? []) {
    const id = row.project_id
    const title = (row.meta as Record<string, string>)?.project_title ?? 'مشروع'
    if (!projectMap[id]) projectMap[id] = { title, count: 0 }
    projectMap[id].count++
  }
  const topProjects = Object.values(projectMap).sort((a, b) => b.count - a.count).slice(0, 5)

  // أكثر مصادر الزيارات
  const refMap: Record<string, number> = {}
  for (const row of referrersRaw ?? []) {
    if (!row.referrer) continue
    let ref = row.referrer
    try { ref = new URL(row.referrer).hostname } catch { /* */ }
    refMap[ref] = (refMap[ref] ?? 0) + 1
  }
  const topReferrers = Object.entries(refMap).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([source, count]) => ({ source, count }))

  // توزيع أنواع الأحداث
  const typeMap: Record<string, number> = {}
  for (const row of eventTypesRaw ?? []) {
    typeMap[row.event_type] = (typeMap[row.event_type] ?? 0) + 1
  }

  const stats = {
    views30: views30 ?? 0,
    views7:  views7  ?? 0,
    viewsToday: viewsToday ?? 0,
    uniqueVisitors30,
    waClicks30:       waClicks30       ?? 0,
    phoneClicks30:    phoneClicks30    ?? 0,
    emailClicks30:    emailClicks30    ?? 0,
    mapsClicks30:     mapsClicks30     ?? 0,
    socialClicks30:   socialClicks30   ?? 0,
    contactPageViews30: contactPageViews30 ?? 0,
    projectViews30:   projectViews30   ?? 0,
    dailyData,
    topProjects,
    topReferrers,
    typeMap,
  }

  return <AnalyticsDashboard tenantName={tenant.name_ar} stats={stats} />
}
