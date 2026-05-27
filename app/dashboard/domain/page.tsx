'use client'

import React, { useState, useEffect } from 'react'
import {
  SectionHeader,
  Card,
  Btn,
  Input,
  Alert,
} from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT } from '@/lib/data'
import { sbGetMyTenant, sbUpdateTenant } from '@/lib/api'
import type { Plan } from '@/types'

export default function DomainPage() {
  const [tenant, setTenant] = useState<Record<string, unknown>>({ ...DEMO_TENANT })
  const [loading, setLoading] = useState(true)
  const [customDomain, setCustomDomain] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ tone: 'success' | 'danger'; text: string } | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const { data, error } = await sbGetMyTenant()
        if (data && !error) {
          const t = { ...DEMO_TENANT, ...data } as Record<string, unknown>
          setTenant(t)
          setCustomDomain((t.custom_domain as string) || '')
        }
      } catch { /* fallback */ }
      setLoading(false)
    })()
  }, [])

  const slug = (tenant.slug as string) || 'my-office'
  const subdomain = `${slug}.wujood.sa`
  const plan = (tenant.plan as Plan) || 'basic'
  const canCustomDomain = plan === 'premium'

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(subdomain)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* fallback */
    }
  }

  async function handleSaveDomain() {
    setSaving(true)
    setMsg(null)
    try {
      const { error } = await sbUpdateTenant(tenant.id as string, { custom_domain: customDomain } as Partial<import('@/types').Tenant>)
      if (error) {
        setMsg({ tone: 'danger', text: 'فشل حفظ الدومين' })
      } else {
        setTenant(prev => ({ ...prev, custom_domain: customDomain }))
        setMsg({ tone: 'success', text: 'تم حفظ الدومين الخاص' })
        setTimeout(() => setMsg(null), 3000)
      }
    } catch {
      setMsg({ tone: 'danger', text: 'حدث خطأ' })
    }
    setSaving(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--r-md)',
    fontFamily: 'var(--font-sans)',
    fontSize: 14,
    background: 'var(--surface)',
    color: 'var(--ink)',
  }

  if (loading) {
    return <div dir="rtl" style={{ padding: 40, textAlign: 'center', color: 'var(--muted)' }}>جاري التحميل...</div>
  }

  return (
    <div dir="rtl">
      <SectionHeader
        title="إعدادات الدومين"
        sub="رابط موقعك والدومين الخاص"
      />

      {msg && (
        <div style={{ marginBottom: 16 }}>
          <Alert tone={msg.tone} icon={msg.tone === 'success' ? 'check' : 'warn'} title={msg.text}>
            {msg.tone === 'success' ? 'تم بنجاح' : 'يرجى المحاولة مرة أخرى'}
          </Alert>
        </div>
      )}

      <div style={{ display: 'grid', gap: 20, maxWidth: 640 }}>
        {/* Subdomain */}
        <Card pad>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            {Icons.globe?.({ size: 18 })}
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>رابط موقعك</h3>
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 14px', background: 'var(--bg)',
            borderRadius: 'var(--r-md)', border: '1px solid var(--border)',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 15, fontWeight: 500,
              color: 'var(--ink)', flex: 1, direction: 'ltr', textAlign: 'right',
            }}>
              {subdomain}
            </span>
            <Btn kind="secondary" size="sm" icon={copied ? 'check' : 'copy'} onClick={copyToClipboard}>
              {copied ? 'تم النسخ' : 'نسخ'}
            </Btn>
            <a href={`https://${subdomain}`} target="_blank" rel="noopener noreferrer">
              <Btn kind="ghost" size="sm" icon="external">زيارة</Btn>
            </a>
          </div>
        </Card>

        {/* Custom Domain */}
        <Card pad>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            {Icons.link?.({ size: 18 })}
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>دومين خاص</h3>
            {canCustomDomain && customDomain && (
              <span style={{
                fontSize: 10, fontWeight: 600, color: 'var(--primary)',
                background: 'var(--primary-soft)', padding: '2px 8px',
                borderRadius: 4,
              }}>
                مفعّل
              </span>
            )}
          </div>

          {!canCustomDomain ? (
            <Alert tone="info" icon="info" title="متاح للباقة المميزة">
              الدومين الخاص متاح فقط للباقة المميزة (بريميوم).{' '}
              <a href="/dashboard/subscription" style={{ color: 'inherit', fontWeight: 600 }}>قم بترقية باقتك</a>.
            </Alert>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  value={customDomain}
                  onChange={e => setCustomDomain(e.target.value)}
                  placeholder="example.com"
                  dir="ltr"
                />
                <Btn kind="primary" onClick={handleSaveDomain} disabled={saving}>
                  {saving ? 'جارٍ الحفظ...' : 'حفظ'}
                </Btn>
              </div>

              <Alert tone="info" icon="info" title="تعليمات إعداد الدومين">
                <div style={{ fontSize: 13, lineHeight: 1.8 }}>
                  <p style={{ margin: '0 0 8px' }}>لربط دومينك الخاص، اتبع الخطوات التالية:</p>
                  <ol style={{ margin: 0, paddingRight: 18 }}>
                    <li>سجل دخولك إلى مزود الدومين (GoDaddy، Namecheap، إلخ).</li>
                    <li>اذهب إلى إعدادات DNS أو إدارة النطاق.</li>
                    <li>أضف سجل <strong>CNAME</strong> جديد بالقيم التالية:
                      <div style={{
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        borderRadius: 'var(--r-sm)', padding: '8px 12px', marginTop: 4,
                        fontFamily: 'var(--font-mono)', fontSize: 12, direction: 'ltr', textAlign: 'right',
                      }}>
                        Name: <strong>www</strong> (أو @)<br />
                        Value: <strong>cname.wujood.sa</strong>
                      </div>
                    </li>
                    <li>احفظ التغييرات وانتظر 24-48 ساعة حتى ينتشر DNS.</li>
                  </ol>
                </div>
              </Alert>

              {customDomain && (
                <div style={{ marginTop: 14 }}>
                  <Alert tone="info" icon="clock" title="حالة التحقق">
                    الدومين <strong style={{ direction: 'ltr', display: 'inline-block' }}>{customDomain}</strong> قيد التحقق.
                    تأكد من صحة إعدادات CNAME. سيتم التحقق تلقائياً.
                  </Alert>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
