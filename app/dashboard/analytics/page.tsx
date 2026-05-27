'use client'

import React, { useState, useEffect } from 'react'
import {
  SectionHeader,
  Card,
  StatCard,
  Alert,
} from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT } from '@/lib/data'
import { sbGetMyTenant } from '@/lib/api'
import type { Plan } from '@/types'

const DEMO_DAILY = [
  { label: '26 مايو', views: 145, visitors: 89 },
  { label: '25 مايو', views: 132, visitors: 76 },
  { label: '24 مايو', views: 98, visitors: 62 },
  { label: '23 مايو', views: 167, visitors: 104 },
  { label: '22 مايو', views: 121, visitors: 71 },
  { label: '21 مايو', views: 156, visitors: 93 },
  { label: '20 مايو', views: 189, visitors: 112 },
  { label: '19 مايو', views: 143, visitors: 85 },
  { label: '18 مايو', views: 110, visitors: 67 },
  { label: '17 مايو', views: 174, visitors: 98 },
  { label: '16 مايو', views: 136, visitors: 81 },
  { label: '15 مايو', views: 92, visitors: 55 },
  { label: '14 مايو', views: 158, visitors: 94 },
  { label: '13 مايو', views: 201, visitors: 118 },
]

const TOP_PROJECTS = [
  { title: 'مجمع الواحة السكني', views: 124 },
  { title: 'برج النخيل التجاري', views: 98 },
  { title: 'فيلا الورود الخاصة', views: 76 },
  { title: 'مدرسة الرواد الأهلية', views: 52 },
  { title: 'مستشفى الأمير سلطان', views: 38 },
]

const TOP_REFERRERS = [
  { source: 'google.com', count: 412 },
  { source: 'twitter.com', count: 187 },
  { source: 'linkedin.com', count: 95 },
  { source: 'instagram.com', count: 64 },
  { source: 'direct', count: 389 },
]

export default function AnalyticsPage() {
  const [tenant, setTenant] = useState<Record<string, unknown>>({ ...DEMO_TENANT })
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState('30d')

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const { data, error } = await sbGetMyTenant()
        if (data && !error) {
          setTenant({ ...DEMO_TENANT, ...data } as Record<string, unknown>)
        }
      } catch { /* fallback */ }
      setLoading(false)
    })()
  }, [])

  const plan = (tenant.plan as Plan) || 'basic'
  const maxViews = Math.max(...DEMO_DAILY.map(d => d.views))

  if (loading) {
    return <div dir="rtl" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>جاري التحميل...</div>
  }

  return (
    <div dir="rtl">
      <SectionHeader
        title="تحليلات الزوار"
        sub="إحصائيات زيارة موقعك"
      />

      {plan === 'basic' && (
        <Alert tone="info" icon="info" title="باقة أساسية">
          التحليلات التفصيلية متاحة للباقات المتقدمة. هذه بيانات تقديرية للعرض.{' '}
          <a href="/dashboard/subscription" style={{ color: 'inherit', fontWeight: 600 }}>قم بترقية باقتك</a>.
        </Alert>
      )}

      {/* Date range */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          { id: '7d', label: 'آخر 7 أيام' },
          { id: '30d', label: 'آخر 30 يوم' },
          { id: '90d', label: 'آخر 90 يوم' },
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => setRange(r.id)}
            style={{
              padding: '7px 14px', borderRadius: 8,
              fontSize: 13, fontWeight: 500,
              border: '1px solid',
              borderColor: range === r.id ? 'var(--primary)' : 'var(--border)',
              background: range === r.id ? 'var(--primary-soft)' : 'var(--surface)',
              color: range === r.id ? 'var(--primary)' : 'var(--muted)',
              cursor: 'pointer', transition: 'all .15s ease',
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 14,
        marginBottom: 22,
      }}
        className="analytics-stats-grid"
      >
        <StatCard label="إجمالي الزوار" value="1,247" icon="users" hint="آخر 30 يوم" />
        <StatCard label="مشاهدات المشاريع" value="342" icon="briefcase" hint="آخر 30 يوم" />
        <StatCard label="نقرات واتساب" value="58" icon="whatsapp" hint="آخر 30 يوم" tone="gold" />
        <StatCard label="متوسط الوقت" value="2:14" icon="clock" hint="دقيقة لكل جلسة" />
      </div>

      {/* Chart */}
      <Card pad style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          {Icons.bar?.({ size: 18 })}
          <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>المشاهدات اليومية</h3>
          <span style={{ fontSize: 11, color: 'var(--muted)', marginRight: 'auto' }}>آخر 14 يوم</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 180 }}>
          {DEMO_DAILY.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, color: 'var(--muted)', marginBottom: 2 }}>{d.views}</span>
              <div style={{
                width: '100%', maxWidth: 24,
                height: `${(d.views / maxViews) * 120}px`,
                background: `linear-gradient(180deg, var(--primary) 0%, var(--primary-soft) 100%)`,
                borderRadius: '4px 4px 0 0',
                transition: 'height .2s ease',
                minHeight: 4,
              }} />
              <span style={{ fontSize: 9, color: 'var(--muted)', marginTop: 4, whiteSpace: 'nowrap' }}>
                {d.label.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'center', marginTop: 12, fontSize: 12, color: 'var(--muted)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--primary)' }} /> المشاهدات
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--primary-soft)' }} /> الزوار
          </span>
        </div>
      </Card>

      {/* Bottom grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 18,
      }}
        className="analytics-bottom-grid"
      >
        {/* Top Projects */}
        <Card pad>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            {Icons.briefcase?.({ size: 18 })}
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>أكثر المشاريع مشاهدة</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOP_PROJECTS.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: i < 3 ? 'var(--primary-soft)' : 'var(--bg-alt)',
                  color: i < 3 ? 'var(--primary)' : 'var(--muted)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600,
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.title}
                </span>
                <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                  {p.views}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Referrers */}
        <Card pad>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            {Icons.globe?.({ size: 18 })}
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600 }}>مصادر الزيارات</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOP_REFERRERS.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 14, height: 14, borderRadius: 4,
                  background: ['var(--primary)', 'var(--accent)', 'var(--primary-soft)', 'var(--bg-alt)', 'var(--muted)'][i % 5],
                  flexShrink: 0,
                }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, direction: 'ltr', textAlign: 'right' }}>
                  {r.source}
                </span>
                <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .analytics-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .analytics-bottom-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 639px) {
          .analytics-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
