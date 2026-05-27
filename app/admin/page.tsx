'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, Badge, SectionHeader, StatCard, Avatar, PlanPill, Btn } from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { ADMIN_PLATFORM_STATS, ADMIN_TENANTS, PLANS, daysUntil, fmtSAR } from '@/lib/data'
import { sbGetAdminStats, sbGetAllTenants } from '@/lib/api'

type AdminTenant = {
  id: string
  name: string
  slug: string
  plan: string
  active: boolean
  ends_at: string | null
  created: string
  custom_domain: string | null
}

function normalizeTenant(row: Record<string, unknown>): AdminTenant {
  return {
    id: row.id as string,
    name: (row.name_ar as string) || (row.name as string) || '',
    slug: (row.slug as string) || '',
    plan: (row.plan as string) || row.plan as string || 'basic',
    active: (row.is_active as boolean) ?? (row.active as boolean) ?? false,
    ends_at: (row.subscription_end as string | null) || (row.ends_at as string | null) || null,
    created: (row.created_at as string) || (row.created as string) || '',
    custom_domain: (row.custom_domain as string | null) || null,
  }
}

export default function AdminHome() {
  const router = useRouter()
  const [stats, setStats] = useState(ADMIN_PLATFORM_STATS)
  const [tenants, setTenants] = useState<AdminTenant[]>(ADMIN_TENANTS as unknown as AdminTenant[])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [s, tResult] = await Promise.all([sbGetAdminStats(), sbGetAllTenants()])
        if (!cancelled) {
          if (s) setStats(s)
          if (tResult?.data?.length) {
            setTenants((tResult.data as Record<string, unknown>[]).map(normalizeTenant))
          }
        }
      } catch { /* fallback to defaults */ }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const endingSoon = tenants.filter(t => {
    if (!t.active || !t.ends_at) return false
    const d = daysUntil(t.ends_at)
    return d <= 30 && d > 0
  })

  const recent = tenants.slice(0, 5)
  const annualRevenue = (stats.monthly_revenue || 0) * 12

  return (
    <div className="wj-anim-in" style={{ maxWidth: 1200 }}>
      {/* ── Section header ── */}
      <SectionHeader
        title="نظرة عامة"
        sub="لوحة التحكم الرئيسية للمنصة"
        action={
          <Btn kind="primary" icon="plus" onClick={() => router.push('/admin/tenants/new')}>
            إضافة مكتب جديد
          </Btn>
        }
      />

      {/* ── Stat cards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <StatCard
          label="إجمالي المكاتب"
          value={loading ? '—' : stats.total_tenants}
          icon="building"
        />
        <StatCard
          label="المكاتب النشطة"
          value={loading ? '—' : stats.active_tenants}
          icon="check"
          tone="gold"
        />
        <StatCard
          label="قاربت على الانتهاء"
          value={loading ? '—' : stats.ending_soon}
          suffix="مكتب"
          icon="warn"
        />
        <StatCard
          label="الإيراد السنوي"
          value={fmtSAR(annualRevenue)}
          suffix="ر.س"
          icon="riyal"
        />
      </div>

      {/* ── Lower grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 20,
          alignItems: 'start',
        }}
        className="max-lg:grid-cols-[1fr]"
      >
        {/* ── Left: subscriptions needing attention ── */}
        <Card pad className="overflow-hidden">
          <div style={{ paddingBottom: 12 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
              اشتراكات تحتاج متابعة
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--muted)' }}>
              اشتراكات تنتهي خلال 30 يوم
            </p>
          </div>

          {endingSoon.length === 0 ? (
            <div style={{
              padding: '32px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 14,
            }}>
              {loading ? 'جاري التحميل...' : 'لا توجد اشتراكات قاربت على الانتهاء'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={thStyle}>المكتب</th>
                  <th style={thStyle}>الباقة</th>
                  <th style={thStyle}>تاريخ الانتهاء</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>الأيام المتبقية</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>إجراء</th>
                </tr>
              </thead>
              <tbody>
                {endingSoon.map(t => {
                  const remaining = daysUntil(t.ends_at)
                  return (
                    <tr
                      key={t.id}
                      style={{ borderBottom: '1px solid var(--border-soft)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-alt)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                    >
                      <td style={tdStyle}>
                        <span style={{ fontWeight: 500 }}>{t.name}</span>
                      </td>
                      <td style={tdStyle}>
                        <PlanPill plan={t.plan} />
                      </td>
                      <td style={{ ...tdStyle, color: 'var(--muted)', fontSize: 13 }}>
                        {t.ends_at ? new Date(t.ends_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                        <Badge tone={remaining <= 7 ? 'red' : 'amber'} dot>
                          {remaining} يوم
                        </Badge>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                        <button
                          onClick={() => router.push(`/admin/tenants/${t.id}`)}
                          style={{
                            padding: '5px 12px', borderRadius: 'var(--r-sm)',
                            background: 'var(--primary-soft)', color: 'var(--primary)',
                            fontSize: 13, fontWeight: 500, cursor: 'pointer',
                            border: 'none',
                          }}
                        >
                          متابعة
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </Card>

        {/* ── Right: recently added offices ── */}
        <Card pad>
          <div style={{ paddingBottom: 14 }}>
            <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
              آخر المكاتب المضافة
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recent.map(t => (
              <div
                key={t.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px', borderRadius: 'var(--r-md)',
                  cursor: 'pointer',
                  transition: 'background .15s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-alt)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
                onClick={() => router.push(`/admin/tenants/${t.id}`)}
              >
                <Avatar name={t.name} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {t.created ? new Date(t.created).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                  </div>
                </div>
                <PlanPill plan={t.plan} />
              </div>
            ))}

            {recent.length === 0 && (
              <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                لا توجد مكاتب بعد
              </div>
            )}
          </div>

          <div style={{ paddingTop: 14 }}>
            <button
              onClick={() => router.push('/admin/tenants')}
              style={{
                width: '100%', padding: '9px 14px', borderRadius: 'var(--r-md)',
                background: 'var(--bg-alt)', color: 'var(--ink-soft)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none',
                transition: 'background .15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border-soft)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-alt)' }}
            >
              عرض كل المكاتب
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}

const thStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--muted)',
  textAlign: 'right',
  whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '11px 12px',
  fontSize: 14,
  textAlign: 'right',
  whiteSpace: 'nowrap',
}
