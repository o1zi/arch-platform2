'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SectionHeader, Card, Badge, Avatar, PlanPill, StatePill, Btn, IconBtn, Modal, Field, Select, Input, Alert } from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { ADMIN_TENANTS, SUBSCRIPTION_LOG, PLANS, daysUntil, fmtDate, fmtSAR } from '@/lib/data'
import { sbGetAllTenants, sbToggleTenant, sbRenewTenant, sbUpgradePlan, sbPauseTenant, sbGetSubLogs } from '@/lib/api'

type TenantDetail = {
  id: string
  name: string
  slug: string
  plan: string
  active: boolean
  ends_at: string | null
  starts_at: string | null
  email: string | null
  sector: string | null
  custom_domain: string | null
  created: string
  projects: number
  phone?: string | null
  address?: string | null
  theme?: string
}

type Log = {
  id: string
  action: string
  plan: string
  amount: number | null
  note: string | null
  by: string | null
  at: string
}

function normalizeTenant(row: Record<string, unknown>): TenantDetail {
  return {
    id: row.id as string,
    name: (row.name_ar as string) || (row.name as string) || '',
    slug: (row.slug as string) || '',
    plan: (row.plan as string) || 'basic',
    active: (row.is_active as boolean) ?? (row.active as boolean) ?? false,
    ends_at: (row.subscription_end as string | null) || (row.ends_at as string | null) || null,
    starts_at: (row.subscription_start as string | null) || (row.starts_at as string | null) || null,
    email: (row.email as string) || null,
    sector: (row.sector as string) || null,
    custom_domain: (row.custom_domain as string | null) || null,
    created: (row.created_at as string) || (row.created as string) || '',
    projects: (row.projects as number) || 0,
    phone: (row.phone as string) || null,
    address: (row.address_ar as string) || null,
    theme: (row.theme as string) || 'modern',
  }
}

export default function TenantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [tenant, setTenant] = useState<TenantDetail | null>(null)
  const [logs, setLogs] = useState<Log[]>(SUBSCRIPTION_LOG as unknown as Log[])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const [renewOpen, setRenewOpen] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [renewMonths, setRenewMonths] = useState(12)
  const [newPlan, setNewPlan] = useState('pro')

  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const result = await sbGetAllTenants()
        if (!cancelled && result?.data) {
          const found = (result.data as Record<string, unknown>[]).find(r => r.id === id)
          if (found) {
            setTenant(normalizeTenant(found))
          }
        }
        const logResult = await sbGetSubLogs(id)
        if (!cancelled && logResult?.data?.length) {
          setLogs(logResult.data as unknown as Log[])
        }
      } catch { /* fallback */ }
      if (!cancelled) {
        // fallback to mock data
        if (!tenant) {
          const mock = (ADMIN_TENANTS as unknown as Record<string, unknown>[]).find(r => r.id === id)
          if (mock) setTenant(normalizeTenant(mock))
        }
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  if (loading || !tenant) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <span style={{ color: 'var(--muted)' }}>{loading ? 'جاري التحميل...' : 'المكتب غير موجود'}</span>
      </div>
    )
  }

  const remaining = daysUntil(tenant.ends_at)
  const planRev: Record<string, number> = { basic: 1200, pro: 2000, premium: 3500 }

  const handleToggle = async () => {
    setActionLoading(true)
    try {
      await sbToggleTenant(tenant.id, !tenant.active)
      setTenant({ ...tenant, active: !tenant.active })
      setMsg({ type: 'success', text: tenant.active ? 'تم إيقاف المكتب' : 'تم تفعيل المكتب' })
    } catch { setMsg({ type: 'error', text: 'حدث خطأ' }) }
    setActionLoading(false)
  }

  const handleRenew = async () => {
    setActionLoading(true)
    try {
      await sbRenewTenant(tenant.id, renewMonths)
      const newEnd = new Date(tenant.ends_at || new Date())
      newEnd.setMonth(newEnd.getMonth() + renewMonths)
      setTenant({ ...tenant, ends_at: newEnd.toISOString().split('T')[0], active: true })
      setRenewOpen(false)
      setMsg({ type: 'success', text: `تم تجديد الاشتراك لمدة ${renewMonths} شهر` })
    } catch { setMsg({ type: 'error', text: 'حدث خطأ في التجديد' }) }
    setActionLoading(false)
  }

  const handleUpgrade = async () => {
    if (newPlan === tenant.plan) return
    setActionLoading(true)
    try {
      await sbUpgradePlan(tenant.id, newPlan)
      setTenant({ ...tenant, plan: newPlan })
      setUpgradeOpen(false)
      setMsg({ type: 'success', text: `تم ترقية الباقة إلى ${(PLANS as Record<string, { labelAr: string }>)[newPlan]?.labelAr || newPlan}` })
    } catch { setMsg({ type: 'error', text: 'حدث خطأ في ترقية الباقة' }) }
    setActionLoading(false)
  }

  const handlePause = async () => {
    setActionLoading(true)
    try {
      await sbPauseTenant(tenant.id)
      setTenant({ ...tenant, active: false })
      setMsg({ type: 'success', text: 'تم إيقاف المكتب مؤقتاً' })
    } catch { setMsg({ type: 'error', text: 'حدث خطأ' }) }
    setActionLoading(false)
  }

  return (
    <div className="wj-anim-in" style={{ maxWidth: 1000 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <IconBtn icon="arrowLeft" title="رجوع" onClick={() => router.push('/admin/tenants')} />
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600 }}>
          {tenant.name}
        </h1>
        <PlanPill plan={tenant.plan} />
        <StatePill active={tenant.active} endsAt={tenant.ends_at} />
      </div>

      {msg && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone={msg.type === 'success' ? 'success' : 'danger'} icon={msg.type === 'success' ? 'check' : 'warn'}>
            {msg.text}
          </Alert>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }} className="max-md:grid-cols-[1fr]">
        <Card pad>
          <h3 style={{ margin: '0 0 14px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>معلومات المكتب</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Row label="الاسم" value={tenant.name} />
            <Row label="الرابط" value={tenant.slug} mono />
            <Row label="الدومين الخاص" value={tenant.custom_domain || '—'} mono />
            <Row label="البريد الإلكتروني" value={tenant.email || '—'} mono />
            <Row label="القطاع" value={tenant.sector || '—'} />
            <Row label="الباقة" value={(PLANS as Record<string, { labelAr: string }>)[tenant.plan]?.labelAr || tenant.plan} />
            <Row label="تاريخ البداية" value={fmtDate(tenant.starts_at)} />
            <Row label="تاريخ الانتهاء" value={fmtDate(tenant.ends_at)} />
            <Row label="تاريخ الإنشاء" value={fmtDate(tenant.created)} />
          </div>
        </Card>

        <Card pad>
          <h3 style={{ margin: '0 0 14px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>إحصائيات</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Row label="عدد المشاريع" value={String(tenant.projects)} />
            <Row label="القالب المستخدم" value={tenant.theme || 'modern'} />
            <div style={rowLine}>
              <span style={rowLabel}>الأيام المتبقية</span>
              <span style={{ fontWeight: 600, color: remaining <= 0 ? 'var(--danger)' : remaining <= 30 ? 'var(--warn)' : 'var(--ink)' }}>
                {remaining <= 0 ? 'منتهي' : `${remaining} يوم`}
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, marginTop: 16 }}>
            <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>إجراءات</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Btn kind="primary" icon="refresh" onClick={() => setRenewOpen(true)} size="sm" disabled={actionLoading}>
                تجديد الاشتراك
              </Btn>
              <Btn kind="secondary" icon="arrowUp" onClick={() => { setNewPlan(tenant.plan); setUpgradeOpen(true) }} size="sm" disabled={actionLoading}>
                ترقية الباقة
              </Btn>
              <Btn
                kind={tenant.active ? 'danger' : 'accent'}
                icon="shield"
                onClick={handleToggle}
                size="sm"
                disabled={actionLoading}
              >
                {tenant.active ? 'إيقاف المكتب' : 'تفعيل المكتب'}
              </Btn>
              {tenant.active && (
                <Btn kind="ghost" icon="x" onClick={handlePause} size="sm" disabled={actionLoading}>
                  إيقاف مؤقت
                </Btn>
              )}
            </div>
          </div>
        </Card>
      </div>

      <Card pad>
        <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>سجل الاشتراكات</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 500 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-alt)' }}>
                <th style={thStyle}>الإجراء</th>
                <th style={thStyle}>الباقة</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>المبلغ</th>
                <th style={thStyle}>ملاحظات</th>
                <th style={thStyle}>التاريخ</th>
                <th style={thStyle}>نفذ بواسطة</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
                    لا توجد سجلات
                  </td>
                </tr>
              ) : (
                logs.map(l => (
                  <tr key={l.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <td style={tdStyle}>
                      <Badge tone={l.action === 'renewed' || l.action === 'activated' ? 'green' : l.action === 'suspended' ? 'red' : 'default'}>
                        {l.action === 'activated' ? 'تفعيل' : l.action === 'renewed' ? 'تجديد' : l.action === 'suspended' ? 'إيقاف' : l.action === 'cancelled' ? 'إلغاء' : l.action}
                      </Badge>
                    </td>
                    <td style={tdStyle}>
                      <PlanPill plan={l.plan} />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' } as React.CSSProperties}>
                      {l.amount ? `${fmtSAR(l.amount)} ر.س` : '—'}
                    </td>
                    <td style={{ ...tdStyle, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' } as React.CSSProperties}>
                      {l.note || '—'}
                    </td>
                    <td style={tdStyle}>{fmtDate(l.at)}</td>
                    <td style={tdStyle}>{l.by || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={renewOpen} onClose={() => setRenewOpen(false)} title="تجديد الاشتراك">
        <Field label="عدد الأشهر">
          <Select value={renewMonths} onChange={e => setRenewMonths(Number(e.target.value))} style={{ width: '100%', height: 40, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 14, padding: '0 10px' }}>
            <option value={1}>شهر واحد</option>
            <option value={3}>3 أشهر</option>
            <option value={6}>6 أشهر</option>
            <option value={12}>12 شهر</option>
            <option value={24}>24 شهر</option>
          </Select>
          <div style={{ marginTop: 8, color: 'var(--muted)', fontSize: 13 }}>
            المبلغ التقريبي: {fmtSAR((planRev[tenant.plan] || 0) * (renewMonths / 12))} ر.س
          </div>
        </Field>
        <div style={{ marginTop: 16 }}>
          <Btn kind="primary" onClick={handleRenew} disabled={actionLoading}>
            {actionLoading ? 'جاري التجديد...' : 'تأكيد التجديد'}
          </Btn>
        </div>
      </Modal>

      <Modal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} title="ترقية الباقة">
        <Field label="الباقة الجديدة">
          <Select value={newPlan} onChange={e => setNewPlan(e.target.value)} style={{ width: '100%', height: 40, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 14, padding: '0 10px' }}>
            {Object.entries(PLANS).map(([key, p]) => (
              <option key={key} value={key} disabled={key === tenant.plan}>
                {p.labelAr} — {fmtSAR(p.priceY)} ر.س/سنة
              </option>
            ))}
          </Select>
        </Field>
        {newPlan !== tenant.plan && (
          <div style={{ marginTop: 8, padding: 12, background: 'var(--primary-soft)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--ink-soft)' }}>
            سيتم ترقية الباقة من {(PLANS as Record<string, { labelAr: string }>)[tenant.plan]?.labelAr} إلى {(PLANS as Record<string, { labelAr: string }>)[newPlan]?.labelAr}
          </div>
        )}
        <div style={{ marginTop: 16 }}>
          <Btn kind="primary" onClick={handleUpgrade} disabled={actionLoading || newPlan === tenant.plan}>
            {actionLoading ? 'جاري الترقية...' : 'تأكيد الترقية'}
          </Btn>
        </div>
      </Modal>
    </div>
  )
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={rowLine}>
      <span style={rowLabel}>{label}</span>
      <span style={{
        fontWeight: 500,
        fontFamily: mono ? 'var(--font-mono)' : undefined,
        direction: mono ? 'ltr' : undefined,
        display: mono ? 'inline-block' : undefined,
      }}>
        {value}
      </span>
    </div>
  )
}

const rowLine: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '6px 0', borderBottom: '1px solid var(--border-soft)',
}

const rowLabel: React.CSSProperties = { color: 'var(--muted)', fontSize: 13 }

const thStyle: React.CSSProperties = {
  padding: '10px 12px', fontSize: 12, fontWeight: 600, color: 'var(--muted)',
  textAlign: 'right', whiteSpace: 'nowrap',
}

const tdStyle: React.CSSProperties = {
  padding: '11px 12px', fontSize: 13, textAlign: 'right', whiteSpace: 'nowrap',
}
