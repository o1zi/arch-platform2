'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SectionHeader, Card, Badge, SearchInput, Btn, Select, PlanPill } from '@/components/ui/atoms'
import { SUBSCRIPTION_LOG, ADMIN_TENANTS, fmtDate, fmtSAR } from '@/lib/data'
import { sbGetAllTenants } from '@/lib/api'

type TenantBrief = { id: string; name: string; slug: string }

type LogEntry = {
  id: string
  tenantId: string
  tenantName: string
  action: string
  plan: string
  amount: number | null
  note: string | null
  date: string
  by: string | null
}

function getMockLogs(): LogEntry[] {
  const tMap = new Map((ADMIN_TENANTS as unknown as { id: string; name: string }[]).map(t => [t.id, t.name]))
  return (SUBSCRIPTION_LOG as unknown as { id: string; action: string; plan: string; amount: number | null; note: string | null; at: string; by: string | null }[]).map((l, i) => ({
    id: l.id,
    tenantId: ADMIN_TENANTS[i % ADMIN_TENANTS.length]?.id || `t-${i}`,
    tenantName: ADMIN_TENANTS[i % ADMIN_TENANTS.length]?.name || tMap.get(`t-${i + 1}`) || '—',
    action: l.action,
    plan: l.plan,
    amount: l.amount,
    note: l.note,
    date: l.at,
    by: l.by,
  }))
}

const ACTION_LABELS: Record<string, string> = {
  activated: 'تفعيل',
  renewed: 'تجديد',
  suspended: 'إيقاف',
  cancelled: 'إلغاء',
  'تجديد سنوي': 'تجديد سنوي',
  'ترقية الباقة': 'ترقية الباقة',
  'تفعيل أولي': 'تفعيل أولي',
}
const ACTION_TONES: Record<string, 'green' | 'red' | 'gold' | 'default'> = {
  activated: 'green',
  renewed: 'green',
  suspended: 'red',
  cancelled: 'red',
  'تجديد سنوي': 'green',
  'ترقية الباقة': 'gold',
  'تفعيل أولي': 'green',
}

export default function AdminSubscriptionsPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [tenants, setTenants] = useState<TenantBrief[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const result = await sbGetAllTenants()
        if (!cancelled && result?.data) {
          const briefs = (result.data as Record<string, unknown>[]).map(r => ({
            id: r.id as string,
            name: (r.name_ar as string) || (r.name as string) || '',
            slug: (r.slug as string) || '',
          }))
          setTenants(briefs)
        }
      } catch { /* use fallback */ }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const mockLogs = getMockLogs()
  const allLogs = tenants.length > 0
    ? mockLogs.map(l => {
        const t = tenants.find(tt => tt.id === l.tenantId)
        return t ? { ...l, tenantName: t.name } : l
      })
    : mockLogs

  const filtered = allLogs.filter(l => {
    if (search) {
      const q = search.toLowerCase()
      if (!l.tenantName?.toLowerCase().includes(q) && !l.note?.toLowerCase().includes(q)) return false
    }
    if (actionFilter !== 'all' && l.action !== actionFilter) return false
    return true
  })

  const grouped = filtered.reduce<Record<string, LogEntry[]>>((acc, l) => {
    const key = l.tenantId
    if (!acc[key]) acc[key] = []
    acc[key].push(l)
    return acc
  }, {})

  const groupedKeys = Object.keys(grouped).sort((a, b) => {
    const an = tenants.find(t => t.id === a)?.name || a
    const bn = tenants.find(t => t.id === b)?.name || b
    return an.localeCompare(bn, 'ar')
  })

  const totalRevenue = filtered.reduce((s, l) => s + (l.amount || 0), 0)

  return (
    <div className="wj-anim-in" style={{ maxWidth: 1200 }}>
      <SectionHeader
        title="سجل الاشتراكات"
        sub={`${filtered.length} عملية — إجمالي ${fmtSAR(totalRevenue)} ر.س`}
        action={
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn kind="secondary" icon="download" size="sm">
              تصدير CSV
            </Btn>
          </div>
        }
      />

      <div style={{
        display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <div style={{ width: 260, minWidth: 180 }}>
          <SearchInput value={search} onChange={setSearch} placeholder="بحث باسم المكتب أو ملاحظة..." />
        </div>
        <Select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          style={{ width: 140, height: 40, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, padding: '0 10px' }}
        >
          <option value="all">كل الإجراءات</option>
          <option value="تجديد سنوي">تجديد سنوي</option>
          <option value="ترقية الباقة">ترقية الباقة</option>
          <option value="تفعيل أولي">تفعيل أولي</option>
        </Select>
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 13, color: 'var(--muted)' }}>
          {loading ? 'جاري التحميل...' : `${groupedKeys.length} مكتب`}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {groupedKeys.map(tid => {
          const group = grouped[tid]
          const t = tenants.find(tt => tt.id === tid)
          return (
            <Card key={tid} pad style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '12px 18px',
                background: 'var(--bg-alt)',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>{t?.name || group[0]?.tenantName || tid}</span>
                  <Badge>{group.length} عملية</Badge>
                </div>
                <button
                  onClick={() => router.push(`/admin/tenants/${tid}`)}
                  style={{
                    padding: '5px 12px', borderRadius: 'var(--r-sm)',
                    background: 'var(--primary-soft)', color: 'var(--primary)',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
                  }}
                >
                  تفاصيل المكتب
                </button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <th style={thStyle}>الإجراء</th>
                      <th style={thStyle}>الباقة</th>
                      <th style={{ ...thStyle, textAlign: 'center' }}>المبلغ</th>
                      <th style={thStyle}>ملاحظات</th>
                      <th style={thStyle}>التاريخ</th>
                      <th style={thStyle}>نفذ بواسطة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.map(l => (
                      <tr key={l.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                        <td style={tdStyle}>
                          <Badge tone={ACTION_TONES[l.action] || 'default'}>
                            {ACTION_LABELS[l.action] || l.action}
                          </Badge>
                        </td>
                        <td style={tdStyle}>
                          <PlanPill plan={l.plan} />
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center', fontFamily: 'var(--font-mono)' } as React.CSSProperties}>
                          {l.amount ? `${fmtSAR(l.amount)} ر.س` : '—'}
                        </td>
                        <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' } as React.CSSProperties}>
                          {l.note || '—'}
                        </td>
                        <td style={tdStyle}>{fmtDate(l.date)}</td>
                        <td style={tdStyle}>{l.by || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )
        })}

        {groupedKeys.length === 0 && (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            لا توجد سجلات مطابقة
          </div>
        )}
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '10px 14px', fontSize: 12, fontWeight: 600, color: 'var(--muted)',
  textAlign: 'right', whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '11px 14px', fontSize: 13, textAlign: 'right', whiteSpace: 'nowrap',
}
