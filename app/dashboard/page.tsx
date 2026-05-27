'use client'

import React, { useState, useEffect } from 'react'
import { SectionHeader, StatCard, Card, Alert } from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT, daysUntil, fmtDate } from '@/lib/data'
import { sbGetMyTenant } from '@/lib/api'

export default function DashboardHome() {
  const [tenant, setTenant] = useState<Record<string, unknown>>({ ...DEMO_TENANT })

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await sbGetMyTenant()
        if (data && !error) {
          setTenant({ ...DEMO_TENANT, ...data } as Record<string, unknown>)
        }
      } catch {
        /* fallback */
      }
    })()
  }, [])

  const _t = tenant as Record<string, unknown>
  const name = (_t.short_ar as string) || (_t.name_ar as string) || 'المكتب'
  const plan = (_t.plan as string) || 'basic'
  const active = !!_t.is_active
  const endsAt = (_t.subscription_end as string) || null
  const theme = (_t.theme as string) || 'modern'
  const days = daysUntil(endsAt)

  // Next steps checklist
  const nextSteps = [
    {
      done: !!_t.logo_url,
      label: 'رفع الشعار',
      href: '/dashboard/profile',
    },
    {
      done: !!_t.bio_ar,
      label: 'كتابة نبذة عن المكتب',
      href: '/dashboard/profile',
    },
    {
      done: !!_t.phone,
      label: 'إضافة رقم الجوال',
      href: '/dashboard/profile',
    },
    {
      done: theme !== 'modern',
      label: 'تخصيص القالب',
      href: '/dashboard/theme',
    },
    {
      done: false,
      label: 'إضافة أول مشروع',
      href: '/dashboard/projects',
    },
  ]

  const completed = nextSteps.filter((s) => s.done).length
  const allDone = completed === nextSteps.length

  // Site link URLs
  const sub = (_t.subdomain as string) || (_t.slug as string) || ''
  const siteUrl = `https://${sub}`
  const siteLinks = [
    { label: 'الصفحة الرئيسية', href: siteUrl, icon: 'home' },
    { label: 'صفحة المشاريع', href: `${siteUrl}/projects`, icon: 'briefcase' },
    { label: 'صفحة التواصل', href: `${siteUrl}/contact`, icon: 'phone' },
  ] as const

  const themeLabels: Record<string, string> = {
    modern: 'عصري',
    classic: 'كلاسيكي',
    bold: 'جريء',
    minimal: 'بسيط',
    luxury: 'فاخر',
  }

  const planLabels: Record<string, string> = {
    basic: 'أساسية',
    pro: 'احترافية',
    premium: 'بريميوم',
  }

  return (
    <div dir="rtl">
      {/* ── Header ── */}
      <SectionHeader
        title={`مرحباً، ${name}`}
        sub={
          days > 0
            ? `اشتراكك ينتهي يوم ${fmtDate(endsAt)} (${days} يوم متبقٍ)`
            : days < 0
            ? 'انتهى اشتراكك — يرجى التجديد'
            : ''
        }
      />

      {/* ── Warning alert ── */}
      {days > 0 && days <= 30 && (
        <Alert
          tone="warn"
          icon="warn"
          title="تنبيه: اقتراب انتهاء الاشتراك"
        >
          ينتهي اشتراكك خلال <strong>{days} يوم</strong>. تواصل معنا على واتساب
          للتجديد قبل انتهاء المدة.
        </Alert>
      )}

      {days < 0 && (
        <Alert
          tone="danger"
          icon="warn"
          title="انتهى الاشتراك"
        >
          موقعك متوقف حالياً عن العرض. يرجى تجديد اشتراكك للاستمرار.
        </Alert>
      )}

      {/* ── 4 StatCards ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          marginTop: 20,
        }}
        className="stats-grid"
      >
        <StatCard
          label="حالة الحساب"
          value={active ? 'نشط' : 'موقوف'}
          icon="shield"
          tone={active ? undefined : 'gold'}
          hint={
            active
              ? days > 30
                ? 'كل شيء يعمل'
                : days > 0
                ? 'قارب الانتهاء'
                : 'منتهي'
              : 'متوقف'
          }
        />
        <StatCard
          label="القالب الحالي"
          value={themeLabels[theme] || theme}
          icon="palette"
          hint="من صفحة القالب"
        />
        <StatCard
          label="المدة المتبقية"
          value={days > 0 ? days : 0}
          suffix="يوم"
          icon="clock"
          hint={active ? (days > 0 ? 'متاح' : 'منتهي') : 'متوقف'}
        />
        <StatCard
          label="الباقة"
          value={planLabels[plan] || plan}
          icon="card"
          hint="من صفحة الاشتراك"
        />
      </div>

      {/* ── Lower grid (2fr : 1fr) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: 18,
          marginTop: 22,
        }}
        className="lower-grid"
      >
        {/* Left: Last 30 days stats */}
        <Card pad>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
            }}
          >
            {Icons.trend?.({ size: 18 })}
            <h3
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              آخر ٣٠ يوماً
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
            }}
          >
            <div
              style={{
                textAlign: 'center',
                padding: '14px 8px',
                background: 'var(--bg)',
                borderRadius: 'var(--r-md)',
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                }}
              >
                1,247
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                زائر
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                padding: '14px 8px',
                background: 'var(--bg)',
                borderRadius: 'var(--r-md)',
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                }}
              >
                342
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                مشاهدة مشروع
              </div>
            </div>
            <div
              style={{
                textAlign: 'center',
                padding: '14px 8px',
                background: 'var(--bg)',
                borderRadius: 'var(--r-md)',
              }}
            >
              <div
                className="mono"
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  fontFamily: 'var(--font-display)',
                }}
              >
                58
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                نقرة واتساب
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: 'var(--muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {Icons.info?.({ size: 13 })}
              بيانات تقديرية — التحليلات التفصيلية في صفحة تحليلات الزوار
            </span>
          </div>
        </Card>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Next steps checklist */}
          <Card pad>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 12,
              }}
            >
              {Icons.check?.({ size: 18 })}
              <h3
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                الخطوات التالية
              </h3>
            </div>

            {allDone && (
              <div
                style={{
                  fontSize: 13,
                  color: 'var(--primary)',
                  textAlign: 'center',
                  padding: 8,
                  background: 'var(--primary-soft)',
                  borderRadius: 'var(--r-sm)',
                  marginBottom: 8,
                }}
              >
                مكتمل — موقعك جاهز
              </div>
            )}

            <div
              style={{
                fontSize: 12,
                color: 'var(--muted)',
                marginBottom: 8,
              }}
            >
              {completed} / {nextSteps.length} منجز
            </div>

            <div
              style={{
                width: '100%',
                height: 6,
                background: 'var(--bg-alt)',
                borderRadius: 3,
                overflow: 'hidden',
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: `${(completed / nextSteps.length) * 100}%`,
                  height: '100%',
                  background: 'var(--primary)',
                  borderRadius: 3,
                  transition: 'width .3s ease',
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {nextSteps.map((step) => (
                <div
                  key={step.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    color: step.done ? 'var(--muted)' : 'var(--ink)',
                    textDecoration: step.done ? 'line-through' : undefined,
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: '50%',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: step.done
                        ? 'var(--primary-soft)'
                        : 'var(--bg-alt)',
                      color: step.done ? 'var(--primary)' : 'var(--muted)',
                      flexShrink: 0,
                    }}
                  >
                    {step.done
                      ? Icons.check?.({ size: 12 })
                      : Icons.chevronLeft?.({ size: 11 })}
                  </span>
                  <a
                    href={step.href}
                    style={{
                      color: 'inherit',
                      textDecoration: 'none',
                      flex: 1,
                    }}
                  >
                    {step.label}
                  </a>
                </div>
              ))}
            </div>
          </Card>

          {/* Site links */}
          <Card pad>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 10,
              }}
            >
              {Icons.globe?.({ size: 18 })}
              <h3
                style={{
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                روابط الموقع
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {siteLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontSize: 13,
                    color: 'var(--ink)',
                    textDecoration: 'none',
                    transition: 'background .15s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = 'var(--bg-alt)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = 'transparent')
                  }
                >
                  <span style={{ color: 'var(--muted)' }}>
                    {Icons[link.icon as keyof typeof Icons]?.({ size: 14 })}
                  </span>
                  <span style={{ flex: 1 }}>{link.label}</span>
                  <span style={{ color: 'var(--muted)' }}>
                    {Icons.external?.({ size: 12 })}
                  </span>
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1023px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .lower-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 639px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
