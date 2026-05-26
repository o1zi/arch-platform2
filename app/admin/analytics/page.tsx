import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminAnalytics from './AdminAnalytics'

export default async function AdminAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: adminRecord } = await supabase
    .from('admin_users').select('id').eq('user_id', user.id).single()
  if (!adminRecord) redirect('/login')

  const now        = new Date()
  const thirtyAgo  = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const today      = new Date(now.setHours(0, 0, 0, 0)).toISOString()

  const [
    { count: totalEvents30 },
    { count: totalEventsToday },
    { count: totalPageViews30 },
    { count: totalWaClicks30 },
    { data: uniqueRaw },
    { data: allTenants },
    { data: eventTypesRaw },
    { data: dailyRaw },
    { data: perTenantRaw },
  ] = await Promise.all([
    // إجمالي الأحداث
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .gte('created_at', thirtyAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .gte('created_at', today),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('event_type', 'page_view').gte('created_at', thirtyAgo),
    supabase.from('analytics_events').select('*', { count: 'exact', head: true })
      .eq('event_type', 'whatsapp_click').gte('created_at', thirtyAgo),
    // زوار فريدون (platform-wide)
    supabase.from('analytics_events').select('ip_hash, tenant_id')
      .eq('event_type', 'page_view').gte('created_at', thirtyAgo),
    // جميع المكاتب مع خطتهم
    supabase.from('tenants').select('id, name_ar, slug, plan, is_active'),
    // توزيع الأحداث
    supabase.from('analytics_events').select('event_type')
      .gte('created_at', thirtyAgo),
    // الرسم البياني اليومي
    supabase.from('analytics_events').select('created_at, tenant_id')
      .eq('event_type', 'page_view')
      .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()),
    // إحصائيات لكل مكتب
    supabase.from('analytics_events').select('tenant_id, event_type, ip_hash')
      .gte('created_at', thirtyAgo),
  ])

  // الزوار الفريدون
  const uniqueVisitors = new Set((uniqueRaw ?? []).map(r => r.ip_hash)).size

  // توزيع الأحداث
  const typeMap: Record<string, number> = {}
  for (const row of eventTypesRaw ?? []) {
    typeMap[row.event_type] = (typeMap[row.event_type] ?? 0) + 1
  }

  // الرسم البياني اليومي
  const dailyMap: Record<string, number> = {}
  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    dailyMap[d.toISOString().slice(0, 10)] = 0
  }
  for (const row of dailyRaw ?? []) {
    const key = row.created_at.slice(0, 10)
    if (dailyMap[key] !== undefined) dailyMap[key]++
  }
  const dailyData = Object.entries(dailyMap).map(([date, views]) => ({
    date,
    label: new Date(date).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric' }),
    views,
  }))

  // إحصائيات لكل مكتب
  type TenantStats = { views: number; wa: number; uniqueVisitors: Set<string>; otherClicks: number }
  const tenantStatsMap: Record<string, TenantStats> = {}
  for (const row of perTenantRaw ?? []) {
    if (!tenantStatsMap[row.tenant_id]) {
      tenantStatsMap[row.tenant_id] = { views: 0, wa: 0, uniqueVisitors: new Set(), otherClicks: 0 }
    }
    const s = tenantStatsMap[row.tenant_id]
    if (row.event_type === 'page_view')      { s.views++; if (row.ip_hash) s.uniqueVisitors.add(row.ip_hash) }
    if (row.event_type === 'whatsapp_click') s.wa++
    if (!['page_view', 'whatsapp_click'].includes(row.event_type)) s.otherClicks++
  }

  const tenantRows = (allTenants ?? []).map(t => ({
    id:      t.id,
    name:    t.name_ar,
    slug:    t.slug,
    plan:    t.plan as string,
    active:  t.is_active as boolean,
    views:   tenantStatsMap[t.id]?.views ?? 0,
    wa:      tenantStatsMap[t.id]?.wa ?? 0,
    unique:  tenantStatsMap[t.id]?.uniqueVisitors.size ?? 0,
    clicks:  tenantStatsMap[t.id]?.otherClicks ?? 0,
  })).sort((a, b) => b.views - a.views)

  // توزيع الخطط
  const planDist: Record<string, number> = {}
  for (const t of allTenants ?? []) {
    planDist[t.plan as string] = (planDist[t.plan as string] ?? 0) + 1
  }

  return (
    <AdminAnalytics
      stats={{
        totalEvents30:   totalEvents30   ?? 0,
        totalEventsToday: totalEventsToday ?? 0,
        totalPageViews30: totalPageViews30 ?? 0,
        totalWaClicks30:  totalWaClicks30  ?? 0,
        uniqueVisitors,
        totalTenants:    (allTenants ?? []).length,
        activeTenants:   (allTenants ?? []).filter(t => t.is_active).length,
        typeMap,
        dailyData,
        tenantRows,
        planDist,
      }}
    />
  )
}
