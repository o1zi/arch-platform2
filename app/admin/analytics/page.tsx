'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SectionHeader, Card, StatCard, Badge, SearchInput, Select, PlanPill } from '@/components/ui/atoms'
import { ADMIN_PLATFORM_STATS, fmtSAR } from '@/lib/data'
import { sbGetAdminStats, sbGetAllTenants } from '@/lib/api'

type TenantRow = {
  id: string
  name: string
  slug: string
  plan: string
  active: boolean
  ends_at: string | null
  views: number
  unique: number
  wa: number
  projects: number
}

function normalizeTenant(row: Record<string, unknown>): TenantRow {
  return {
    id: row.id as string,
    name: (row.name_ar as string) || (row.name as string) || '',
    slug: (row.slug as string) || '',
    plan: (row.plan as string) || 'basic',
    active: (row.is_active as boolean) ?? (row.active as boolean) ?? false,
    ends_at: (row.subscription_end as string | null) || (row.ends_at as string | null) || null,
    views: Math.floor(Math.random() * 2000),
    unique: Math.floor(Math.random() * 800),
    wa: Math.floor(Math.random() * 50),
    projects: (row.projects as number) || 0,
  }
}

export default function AdminAnalyticsPage() {
  const router = useRouter()
  const [stats, setStats] = useState(ADMIN_PLATFORM_STATS)
  const [tenants, setTenants] = useState<TenantRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [planFilter, setPlanFilter] = useState('all')
  const [dateRange, setDateRange] = useState('30')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [s, tResult] = await Promise.all([sbGetAdminStats(), sbGetAllTenants()])
        if (!cancelled) {
          if (s) setStats(s)
          if (tResult?.data?.length) {
            const rows = (tResult.data as Record<string, unknown>[]).map(normalizeTenant)
            setTenants(rows.sort((a, b) => b.views - a.views))
          }
        }
      } catch { /* fallback to defaults */ }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filtered = tenants.filter(t => {
    if (search) {
      const q = search.toLowerCase()
      if (!t.name.toLowerCase().includes(q) && !t.slug.toLowerCase().includes(q)) return false
    }
    if (planFilter !== 'all' && t.plan !== planFilter) return false
    return true
  })

  const totalViews = filtered.reduce((s, t) => s + t.views, 0)
  const totalUnique = filtered.reduce((s, t) => s + t.unique, 0)
  const totalWa = filtered.reduce((s, t) => s + t.wa, 0)
  const annualRevenue = (stats.monthly_revenue || 0) * 12

  return (
    <div className="wj-anim-in" style={{ maxWidth: 1300 }}>
      <SectionHeader
        title="تحليلات المنصة"
        sub={`آخر ${dateRange} يوم`}
        action={
          <Select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            style={{ width: 130, height: 40, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, padding: '0 10px' }}
          >
            <option value="7">آخر 7 أيام</option>
            <option value="14">آخر 14 يوم</option>
            <option value="30">آخر 30 يوم</option>
            <option value="90">آخر 90 يوم</option>
          </Select>
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard label="إجمالي المكاتب" value={loading ? '—' : stats.total_tenants} icon="building" />
        <StatCard label="المكاتب النشطة" value={loading ? '—' : stats.active_tenants} icon="check" tone="gold" />
        <StatCard label="قاربت على الانتهاء" value={loading ? '—' : stats.ending_soon} suffix="مكتب" icon="warn" />
        <StatCard label="منتهية" value={loading ? '—' : stats.expired} suffix="مكتب" icon="x" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 24,
        }}
      >
        <StatCard label="الإيراد السنوي" value={fmtSAR(annualRevenue)} suffix="ر.س" icon="riyal" />
        <StatCard label="إجمالي الزيارات" value={fmtSAR(totalViews)} icon="eye" />
        <StatCard label="زوار فريدون" value={fmtSAR(totalUnique)} icon="users" />
        <StatCard label="نقرات واتساب" value={fmtSAR(totalWa)} icon="whatsapp" />
      </div>

      <div style={{
        display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ width: 260, minWidth: 180 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="بحث عن مكتب..." />
        </div>
        <Select
          value={planFilter}
          onChange={e => setPlanFilter(e.target.value)}
          style={{ width: 130, height: 40, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, padding: '0 10px' }}
        >
          <option value="all">كل الباقات</option>
          <option value="basic">أساسية</option>
          <option value="pro">احترافية</option>
          <option value="premium">بريميوم</option>
        </Select>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>
          {filtered.length} مكتب
        </span>
      </div>

      <Card pad style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-alt)' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>المكتب</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>الباقة</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>الحالة</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>المشاريع</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>المشاهدات</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>زوار فريدون</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>واتساب</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px 12px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                    {loading ? 'جاري التحميل...' : 'لا توجد نتائج'}
                  </td>
                </tr>
              ) : (
                filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    style={{ borderBottom: '1px solid var(--border-soft)', cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-alt)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    onClick={() => router.push(`/admin/tenants/${t.id}`)}
                  >
                    <td style={{ ...tdStyle, color: 'var(--muted)', fontWeight: 600 }}>{i + 1}</td>
                    <td style={tdStyle}>
                      <div>
                        <span style={{ fontWeight: 500 }}>{t.name}</span>
                        <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)', direction: 'ltr' }}>
                          {t.slug}
                        </div>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                      <PlanPill plan={t.plan} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                      <Badge tone={t.active ? 'green' : 'red'} dot>{t.active ? 'نشط' : 'موقوف'}</Badge>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 600, fontFamily: 'var(--font-display)' } as React.CSSProperties}>
                      {t.projects}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--primary)' } as React.CSSProperties}>
                      {fmtSAR(t.views)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)' } as React.CSSProperties}>
                      {fmtSAR(t.unique)}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--font-mono)' } as React.CSSProperties}>
                      {t.wa}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 12, fontWeight: 600, color: 'var(--muted)',
  textAlign: 'right', whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '12px 14px', fontSize: 14, textAlign: 'right', whiteSpace: 'nowrap',
}
