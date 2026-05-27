'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SectionHeader, Card, Badge, SearchInput, Avatar, PlanPill, StatePill, Btn, Select, IconBtn } from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { ADMIN_TENANTS, daysUntil, fmtDate } from '@/lib/data'
import { sbGetAllTenants } from '@/lib/api'

type AdminTenant = {
  id: string
  name: string
  slug: string
  plan: string
  active: boolean
  ends_at: string | null
  projects: number
  custom_domain: string | null
  created: string
}

function normalizeTenant(row: Record<string, unknown>): AdminTenant {
  return {
    id: row.id as string,
    name: (row.name_ar as string) || (row.name as string) || '',
    slug: (row.slug as string) || '',
    plan: (row.plan as string) || 'basic',
    active: (row.is_active as boolean) ?? (row.active as boolean) ?? false,
    ends_at: (row.subscription_end as string | null) || (row.ends_at as string | null) || null,
    projects: (row.projects as number) || 0,
    custom_domain: (row.custom_domain as string | null) || null,
    created: (row.created_at as string) || (row.created as string) || '',
  }
}

export default function AdminTenantsPage() {
  const router = useRouter()
  const [tenants, setTenants] = useState<AdminTenant[]>(ADMIN_TENANTS as unknown as AdminTenant[])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const result = await sbGetAllTenants()
        if (!cancelled && result?.data?.length) {
          setTenants((result.data as Record<string, unknown>[]).map(normalizeTenant))
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
      const nameMatch = t.name.toLowerCase().includes(q)
      const slugMatch = t.slug.toLowerCase().includes(q)
      const domainMatch = t.custom_domain?.toLowerCase().includes(q)
      if (!nameMatch && !slugMatch && !domainMatch) return false
    }
    if (statusFilter !== 'all') {
      if (statusFilter === 'active' && (!t.active || (t.ends_at && daysUntil(t.ends_at) < 0))) return false
      if (statusFilter === 'ending_soon') {
        if (!t.active || !t.ends_at) return false
        const d = daysUntil(t.ends_at)
        if (!(d <= 30 && d > 0)) return false
      }
      if (statusFilter === 'expired') {
        if (t.active && t.ends_at && daysUntil(t.ends_at) >= 0) return false
      }
      if (statusFilter === 'paused' && t.active) return false
    }
    if (planFilter !== 'all' && t.plan !== planFilter) return false
    return true
  })

  return (
    <div className="wj-anim-in" style={{ maxWidth: 1300 }}>
      <SectionHeader
        title="المكاتب"
        sub={`${filtered.length} مكتب`}
        action={
          <Btn kind="primary" icon="plus" onClick={() => router.push('/admin/tenants/new')}>
            إضافة مكتب جديد
          </Btn>
        }
      />

      <div style={{
        display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ width: 260, minWidth: 180 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="بحث بالاسم أو الرابط..." />
        </div>
        <Select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ width: 140, height: 40, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, padding: '0 10px' }}
        >
          <option value="all">كل الحالات</option>
          <option value="active">نشط</option>
          <option value="ending_soon">قارب الانتهاء</option>
          <option value="expired">منتهي</option>
          <option value="paused">موقوف</option>
        </Select>
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
          {loading ? 'جاري التحميل...' : `${filtered.length} من ${tenants.length} مكتب`}
        </span>
      </div>

      <Card pad className="overflow-hidden" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-alt)' }}>
                <th style={thStyle}>المكتب</th>
                <th style={thStyle}>الرابط</th>
                <th style={thStyle}>دومين خاص</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>الباقة</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>الحالة</th>
                <th style={thStyle}>تاريخ الانتهاء</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>المشاريع</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '40px 12px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                    {loading ? 'جاري التحميل...' : 'لا توجد نتائج مطابقة'}
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr
                    key={t.id}
                    style={{ borderBottom: '1px solid var(--border-soft)', cursor: 'pointer' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-alt)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    onClick={() => router.push(`/admin/tenants/${t.id}`)}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar name={t.name} size={36} />
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{t.name}</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)', direction: 'ltr', display: 'inline-block' }}>
                        {t.slug}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {t.custom_domain ? (
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--primary)', direction: 'ltr', display: 'inline-block' }}>
                          {t.custom_domain}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--muted)', fontSize: 13 }}>—</span>
                      )}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                      <PlanPill plan={t.plan} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                      <StatePill active={t.active} endsAt={t.ends_at} />
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 13, color: daysUntil(t.ends_at) <= 30 && daysUntil(t.ends_at) > 0 ? 'var(--warn)' : 'var(--ink-soft)' }}>
                        {fmtDate(t.ends_at)}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                      <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
                        {t.projects}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <IconBtn icon="edit" title="تعديل" size={32}
                          onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/admin/tenants/${t.id}`)
                          }}
                        />
                        <IconBtn icon="external" title="زيارة الموقع" size={32}
                          onClick={(e) => {
                            e.stopPropagation()
                            const url = t.custom_domain
                              ? `https://${t.custom_domain}`
                              : `https://${t.slug}.wujood.sa`
                            window.open(url, '_blank')
                          }}
                        />
                      </div>
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
  padding: '10px 14px',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--muted)',
  textAlign: 'right',
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '11px 14px',
  fontSize: 14,
  textAlign: 'right',
  whiteSpace: 'nowrap',
}
