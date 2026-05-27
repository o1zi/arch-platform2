'use client'

import React, { useState, useEffect } from 'react'
import {
  SectionHeader,
  Card,
  Btn,
  PlanPill,
  Alert,
} from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT, PLANS, SUBSCRIPTION_LOG, fmtDate, fmtSAR, daysUntil } from '@/lib/data'
import { sbGetMyTenant, sbGetSubLogs } from '@/lib/api'
import type { Plan } from '@/types'

export default function SubscriptionPage() {
  const [tenant, setTenant] = useState<Record<string, unknown>>({ ...DEMO_TENANT })
  const [logs, setLogs] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const { data: td, error: te } = await sbGetMyTenant()
        const t = td && !te ? { ...DEMO_TENANT, ...td } as Record<string, unknown> : { ...DEMO_TENANT }
        setTenant(t)
        const tid = (t.id as string) || 't-1'
        const { data: logData, error: le } = await sbGetSubLogs(tid)
        if (logData && !le) {
          setLogs(logData as Record<string, unknown>[])
        } else {
          setLogs([...SUBSCRIPTION_LOG] as unknown as Record<string, unknown>[])
        }
      } catch {
        setLogs([...SUBSCRIPTION_LOG] as unknown as Record<string, unknown>[])
      }
      setLoading(false)
    })()
  }, [])

  const plan = (tenant.plan as Plan) || 'basic'
  const endsAt = tenant.subscription_end as string | null
  const startAt = tenant.subscription_start as string | null
  const days = daysUntil(endsAt)
  const planData = PLANS[plan]
  const isExpiring = days > 0 && days <= 30
  const isExpired = days < 0

  const actionLabels: Record<string, string> = {
    activated: 'تفعيل',
    renewed: 'تجديد',
    suspended: 'إيقاف',
    cancelled: 'إلغاء',
  }

  if (loading) {
    return <div dir="rtl" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>جاري التحميل...</div>
  }

  return (
    <div dir="rtl">
      <SectionHeader
        title="الاشتراك"
        sub="تفاصيل باقتك وسجل اشتراكاتك"
      />

      {isExpired && (
        <Alert tone="danger" icon="warn" title="انتهى الاشتراك">
          موقعك متوقف حالياً. يرجى تجديد اشتراكك بأسرع وقت.
        </Alert>
      )}

      {isExpiring && (
        <Alert tone="warn" icon="warn" title="اقتراب انتهاء الاشتراك">
          ينتهي اشتراكك خلال <strong>{days} يوم</strong>. بادر بالتجديد لضمان استمرارية موقعك.
        </Alert>
      )}

      <div style={{ display: 'grid', gap: 20, maxWidth: 680 }}>
        {/* Current Plan */}
        <Card pad>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {Icons.card?.({ size: 20 })}
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600 }}>الباقة الحالية</h3>
            </div>
            <PlanPill plan={plan} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12,
            marginBottom: 18,
          }}>
            <div style={{
              textAlign: 'center', padding: '14px 8px',
              background: 'var(--bg)', borderRadius: 'var(--r-md)',
            }}>
              <div className="mono" style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                {planData.projects === Infinity ? '∞' : planData.projects}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>مشروع</div>
            </div>
            <div style={{
              textAlign: 'center', padding: '14px 8px',
              background: 'var(--bg)', borderRadius: 'var(--r-md)',
            }}>
              <div className="mono" style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                {planData.storage}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>تخزين</div>
            </div>
            <div style={{
              textAlign: 'center', padding: '14px 8px',
              background: 'var(--bg)', borderRadius: 'var(--r-md)',
            }}>
              <div className="mono" style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-display)' }}>
                {fmtSAR(planData.priceY)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>ر.س / سنة</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0' }}>
              <span style={{ color: 'var(--muted)' }}>القوالب المتاحة</span>
              <span style={{ fontWeight: 500 }}>{planData.templates}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderTop: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--muted)' }}>الدومين الخاص</span>
              <span style={{ fontWeight: 500, color: planData.custom_domain ? 'var(--primary)' : 'var(--muted)' }}>
                {planData.custom_domain ? 'متاح' : 'غير متاح'}
              </span>
            </div>
          </div>
        </Card>

        {/* Dates */}
        <Card pad>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            {Icons.clock?.({ size: 20 })}
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600 }}>مدة الاشتراك</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {startAt && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                <span style={{ color: 'var(--muted)' }}>تاريخ البداية</span>
                <span style={{ fontWeight: 500 }}>{fmtDate(startAt)}</span>
              </div>
            )}
            {endsAt && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5, borderTop: !startAt ? undefined : '1px solid var(--border)', paddingTop: !startAt ? undefined : 10 }}>
                <span style={{ color: 'var(--muted)' }}>تاريخ الانتهاء</span>
                <span style={{
                  fontWeight: 500,
                  color: isExpired ? 'var(--danger)' : isExpiring ? 'var(--accent)' : 'var(--ink)',
                }}>
                  {fmtDate(endsAt)}
                  {days > 0 && (
                    <span style={{ fontSize: 12, color: 'var(--muted)', marginRight: 8 }}>
                      ({days} يوم متبقٍ)
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          {days > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{
                width: '100%', height: 8, background: 'var(--bg-alt)',
                borderRadius: 4, overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%', borderRadius: 4,
                  width: `${Math.min(100, Math.max(0, ((365 - days) / 365) * 100))}%`,
                  background: isExpiring ? 'var(--accent)' : 'var(--primary)',
                  transition: 'width .3s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
                <span>0 يوم</span>
                <span>365 يوم</span>
              </div>
            </div>
          )}
        </Card>

        {/* Renewal CTA */}
        <Card pad>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 10 }}>
              {Icons.whatsapp?.({ size: 22 })}
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>للتجديد أو الترقية</h3>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 14px', lineHeight: 1.6 }}>
              تواصل معنا على واتساب وسنقوم بتجديد اشتراكك يدوياً بعد استلام التحويل البنكي.
            </p>
            <a
              href={`https://wa.me/966500000000?text=${encodeURIComponent('مرحباً، أريد تجديد اشتراكي. اسم المكتب: ' + ((tenant.name_ar as string) || ''))}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Btn kind="primary" icon="whatsapp" style={{ background: '#25D366', borderColor: '#25D366' }}>
                تواصل على واتساب
              </Btn>
            </a>
          </div>
        </Card>

        {/* Logs */}
        {logs.length > 0 && (
          <Card pad>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              {Icons.list?.({ size: 18 })}
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>سجل الاشتراكات</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--muted)', fontWeight: 500 }}>الإجراء</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--muted)', fontWeight: 500 }}>الباقة</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--muted)', fontWeight: 500 }}>ملاحظة</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--muted)', fontWeight: 500 }}>التاريخ</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id as string} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 12px' }}>
                        <span style={{
                          fontSize: 12, fontWeight: 500, padding: '3px 8px',
                          borderRadius: 4,
                          background: (log.action as string) === 'renewed' ? 'var(--primary-soft)' :
                            (log.action as string) === 'activated' ? 'var(--primary-soft)' : 'var(--bg-alt)',
                          color: (log.action as string) === 'renewed' ? 'var(--primary)' :
                            (log.action as string) === 'activated' ? 'var(--primary)' : 'var(--muted)',
                        }}>
                          {actionLabels[log.action as string] ?? (log.action as string)}
                        </span>
                      </td>
                      <td style={{ padding: '8px 12px', color: 'var(--ink-soft)' }}>{(log.plan as string) || '—'}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--muted)', fontSize: 12 }}>{(log.note as string) || '—'}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--muted)', fontSize: 12 }}>
                        {typeof log.at === 'string' && log.at.length > 4 ? log.at as string : fmtDate(log.created_at as string || null)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
