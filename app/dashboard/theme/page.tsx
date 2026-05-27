'use client'

import React, { useState, useEffect } from 'react'
import {
  SectionHeader,
  Card,
  Btn,
  Alert,
} from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT, PLAN_LIMITS } from '@/lib/data'
import { sbGetMyTenant, sbUpdateTenant } from '@/lib/api'
import type { Plan, Theme } from '@/types'

const TEMPLATES: { id: Theme; name: string; desc: string; mood: string; colors: string[]; icon: string }[] = [
  { id: 'modern', name: 'عصري', desc: 'تصميم نظيف واحترافي', mood: 'تقني، نظيف، احترافي', colors: ['#fff', '#0e3b2e', '#1a7a5a'], icon: 'hero' },
  { id: 'classic', name: 'كلاسيكي', desc: 'تصميم تقليدي راقي', mood: 'راسخ، موثوق، تقليدي', colors: ['#faf3e0', '#5c3d2e', '#b08a3e'], icon: 'template' },
  { id: 'heritage', name: 'تراثي', desc: 'طابع سعودي أصيل', mood: 'أصيل، دافئ، تراثي', colors: ['#f5ece0', '#7a5a3a', '#c9a84c'], icon: 'building' },
  { id: 'minimal', name: 'بسيط', desc: 'مساحات بيضاء وأناقة هادئة', mood: 'هادئ، راقي، مركّز', colors: ['#fff', '#f5f5f5', '#1a1a1a'], icon: 'type' },
  { id: 'luxury', name: 'فاخر', desc: 'تصميم فاخر بألوان داكنة', mood: 'حصري، فاخر، راقي جداً', colors: ['#0a0a0a', '#d4a72c', '#2a2a2a'], icon: 'sparkles' },
  { id: 'studio', name: 'استوديو', desc: 'عرض بصري جريء', mood: 'إبداعي، جريء، فني', colors: ['#1a1a2e', '#e94560', '#16213e'], icon: 'palette' },
]

export default function ThemePage() {
  const [tenant, setTenant] = useState<Record<string, unknown>>({ ...DEMO_TENANT })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null)

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

  async function handleSelect(theme: Theme) {
    if (theme === (tenant.theme as string)) return
    setSaving(true)
    setMsg(null)
    try {
      const { error } = await sbUpdateTenant(tenant.id as string, { theme } as Partial<import('@/types').Tenant>)
      if (error) {
        setMsg({ tone: 'danger', text: 'فشل تغيير القالب' })
      } else {
        setTenant(prev => ({ ...prev, theme }))
        setMsg({ tone: 'success', text: 'تم تغيير القالب بنجاح' })
        setTimeout(() => setMsg(null), 3000)
      }
    } catch {
      setMsg({ tone: 'danger', text: 'حدث خطأ' })
    }
    setSaving(false)
  }

  const plan = (tenant.plan as Plan) || 'basic'
  const allowedThemes = PLAN_LIMITS[plan].themes as Theme[]
  const currentTheme = (tenant.theme as Theme) || 'modern'

  if (loading) {
    return <div dir="rtl" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>جاري التحميل...</div>
  }

  const isRestricted = plan === 'basic'

  return (
    <div dir="rtl">
      <SectionHeader
        title="اختيار القالب"
        sub="اختر الشكل المناسب لموقعك"
      />

      {msg && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone={msg.tone} icon={msg.tone === 'success' ? 'check' : 'warn'} title={msg.text}>
            {msg.tone === 'success' ? 'تم تغيير القالب بنجاح' : 'يرجى المحاولة مرة أخرى'}
          </Alert>
        </div>
      )}

      {isRestricted && (
        <Alert tone="info" icon="info" title="باقة أساسية">
          باقتك الحالية (أساسية) تتيح قالباً واحداً فقط. للوصول إلى كل القوالب،{' '}
          <a href="/dashboard/subscription" style={{ color: 'inherit', fontWeight: 600 }}>قم بترقية باقتك</a>.
        </Alert>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 18,
        marginTop: 20,
      }}>
        {TEMPLATES.map((tmpl) => {
          const isAllowed = allowedThemes.includes(tmpl.id)
          const isActive = currentTheme === tmpl.id

          return (
            <div key={tmpl.id} style={{ position: 'relative' }}>
              <Card pad style={{
                border: isActive ? '2px solid var(--primary)' : '1px solid var(--border)',
                opacity: isAllowed ? 1 : 0.5,
                cursor: isAllowed && !isActive ? 'pointer' : 'default',
                transition: 'all .15s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
                onClick={() => isAllowed && !isActive && handleSelect(tmpl.id)}
              >
                {/* Preview */}
                <div style={{
                  width: '100%', height: 140, borderRadius: 10, overflow: 'hidden',
                  marginBottom: 14, position: 'relative',
                  background: tmpl.colors[0] || '#f5f5f5',
                  border: '1px solid var(--border)',
                }}>
                  {/* Simulated layout */}
                  <div style={{
                    height: 30, background: tmpl.colors[2] || '#333',
                    display: 'flex', alignItems: 'center', padding: '0 10px', gap: 6,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.4)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.4)' }} />
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.4)' }} />
                  </div>
                  <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ width: '60%', height: 8, borderRadius: 4, background: tmpl.colors[1] || '#666', opacity: .3 }} />
                    <div style={{ width: '80%', height: 6, borderRadius: 3, background: tmpl.colors[1] || '#666', opacity: .15 }} />
                    <div style={{ width: '40%', height: 6, borderRadius: 3, background: tmpl.colors[1] || '#666', opacity: .15 }} />
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      <div style={{ flex: 1, height: 40, borderRadius: 6, background: tmpl.colors[2] || '#666', opacity: .2 }} />
                      <div style={{ flex: 1, height: 40, borderRadius: 6, background: tmpl.colors[2] || '#666', opacity: .15 }} />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: isActive ? 'var(--primary-soft)' : 'var(--bg-alt)',
                      color: isActive ? 'var(--primary)' : 'var(--muted)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {Icons[tmpl.icon as keyof typeof Icons]?.({ size: 16 })}
                    </span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>{tmpl.name}</span>
                    {isActive && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: 'var(--primary)',
                        background: 'var(--primary-soft)', padding: '3px 8px',
                        borderRadius: 4, marginRight: 'auto',
                      }}>
                        الحالي
                      </span>
                    )}
                    {!isAllowed && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, color: 'var(--muted)',
                        background: 'var(--bg-alt)', padding: '3px 8px',
                        borderRadius: 4, marginRight: 'auto',
                      }}>
                        باقة أعلى
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--muted)', margin: '0 0 4px', lineHeight: 1.5 }}>
                    {tmpl.desc}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>
                    {tmpl.mood}
                  </p>
                </div>

                {isAllowed && !isActive && (
                  <Btn
                    kind="secondary"
                    size="sm"
                    icon="palette"
                    style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
                    onClick={(e) => { e.stopPropagation(); handleSelect(tmpl.id) }}
                    disabled={saving}
                  >
                    {saving && currentTheme !== tmpl.id ? 'جارٍ التغيير...' : 'اختيار القالب'}
                  </Btn>
                )}
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
