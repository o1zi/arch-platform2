'use client'

import React, { useEffect, type ReactNode } from 'react'
import { Icons } from '@/lib/icons'
import { initials, PLANS, SECTORS, daysUntil } from '@/lib/data'

type BtnKind = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger'
type BtnSize = 'sm' | 'md' | 'lg'
type BadgeTone = 'default' | 'green' | 'gold' | 'red' | 'amber'
type AlertTone = 'info' | 'warn' | 'danger' | 'success'

export function Logo({ size = 22, color, withTagline = false }: { size?: number; color?: string; withTagline?: boolean }) {
  return (
    <span className="wj-logo" style={{ fontSize: size, color: color || 'var(--ink)' }}>
      <span>وجود</span>
      <span className="wj-logo-dot" style={{ width: size * 0.32, height: size * 0.32 }} />
      {withTagline && <span style={{ fontSize: size * 0.55, fontWeight: 400, color: 'var(--muted)', fontFamily: 'var(--font-sans)' }}>منصة</span>}
    </span>
  )
}

export function Btn({ kind = 'primary', size = 'md', icon, iconAfter, children, className = '', ...rest }: {
  kind?: BtnKind; size?: BtnSize; icon?: string; iconAfter?: string; children?: ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sz = size === 'sm' ? 14 : 16
  return (
    <button className={`wj-btn wj-btn-${kind} ${size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : ''} ${className}`} {...rest}>
      {icon && Icons[icon as keyof typeof Icons]?.({ size: sz })}
      {children}
      {iconAfter && Icons[iconAfter as keyof typeof Icons]?.({ size: sz })}
    </button>
  )
}

export function IconBtn({ icon, title, size = 36, ...rest }: { icon: string; title?: string; size?: number } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button title={title} className="wj-btn wj-btn-ghost icon" style={{ width: size, height: size, borderRadius: 8 }} {...rest}>
      {Icons[icon as keyof typeof Icons]?.({ size: 16 })}
    </button>
  )
}

export function Card({ children, pad = true, className = '', style, ...rest }: {
  children: ReactNode; pad?: boolean; className?: string; style?: React.CSSProperties
} & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`wj-card ${pad ? 'wj-card-pad' : ''} ${className}`} style={style} {...rest}>{children}</div>
}

export function Badge({ tone = 'default', dot = false, children }: { tone?: BadgeTone; dot?: boolean; children: ReactNode }) {
  return <span className={`wj-badge ${tone} ${dot ? 'dot' : ''}`}>{children}</span>
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return <button className={`wj-toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)} aria-pressed={on} />
}

export function Field({ label, hint, children, error }: { label?: string; hint?: string; children: ReactNode; error?: string }) {
  return (
    <label className="wj-field">
      {label && <span className="wj-label">{label}</span>}
      {children}
      {hint && !error && <span className="wj-hint">{hint}</span>}
      {error && <span className="wj-hint" style={{ color: 'var(--danger)' }}>{error}</span>}
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="wj-input" {...props} />
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="wj-textarea" {...props} />
}
export function Select({ children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="wj-select" {...rest}>{children}</select>
}

export function EmptyImg({ label, w = '100%', h = 160, radius = 10, style = {} }: { label?: string; w?: string | number; h?: number; radius?: number; style?: React.CSSProperties }) {
  return <div className="wj-placeholder" style={{ width: w, height: h, borderRadius: radius, ...style }}>{label || 'صورة'}</div>
}

export function ProjectCover({ seed = 1, label, h = 180, radius = 10 }: { seed?: number; label?: string; h?: number; radius?: number }) {
  const hues = [142, 32, 200, 18, 90, 260, 350, 50]
  const hue = hues[(seed - 1) % hues.length]
  return (
    <div style={{
      width: '100%', height: h, borderRadius: radius,
      background: `linear-gradient(135deg, oklch(.72 .07 ${hue}) 0%, oklch(.55 .09 ${(hue + 30) % 360}) 100%)`,
      position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'flex-end', padding: 14,
    }}>
      <svg viewBox="0 0 200 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: .2 }}>
        <path d={`M0,${60 + seed * 3} Q50,${30 + seed * 2} 100,${50 + seed} T200,${40 + seed * 2} L200,100 L0,100 Z`} fill="rgba(255,255,255,.7)" />
        <path d={`M0,${75 - seed} Q60,${50 - seed * 2} 120,${70 - seed} T200,${65 - seed * 2} L200,100 L0,100 Z`} fill="rgba(0,0,0,.15)" />
      </svg>
      {label && <span style={{ position: 'relative', color: '#fff', fontWeight: 500, fontSize: 13, textShadow: '0 1px 4px rgba(0,0,0,.3)', letterSpacing: '.01em' }}>{label}</span>}
    </div>
  )
}

export function Avatar({ name, size = 36, bg }: { name: string; size?: number; bg?: string }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg || 'var(--primary-soft)',
      color: 'var(--primary)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-display)', fontWeight: 500,
      fontSize: size * 0.4,
      border: '1px solid var(--border)', flexShrink: 0,
    }}>
      {initials(name || '؟')}
    </div>
  )
}

export function Modal({ open, onClose, title, children, width = 560, footer }: {
  open: boolean; onClose: () => void; title?: string; children: ReactNode; width?: number; footer?: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])
  if (!open) return null
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(20, 32, 26, 0.4)',
      backdropFilter: 'blur(2px)', zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, animation: 'wjFadeIn .15s ease',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: 'var(--surface)', borderRadius: 'var(--r-lg)',
        width: '100%', maxWidth: width, maxHeight: 'calc(100vh - 40px)',
        display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--sh-xl)', overflow: 'hidden',
      }}>
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>{title}</h3>
            <IconBtn icon="x" size={32} onClick={onClose} title="إغلاق" />
          </div>
        )}
        <div style={{ padding: 22, overflowY: 'auto', flex: 1 }}>{children}</div>
        {footer && (
          <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, justifyContent: 'flex-start', background: 'var(--bg)' }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function TabBar({ tabs, active, onChange, fullWidth }: {
  tabs: { id: string; label: string; icon?: string }[]
  active: string; onChange: (id: string) => void; fullWidth?: boolean
}) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', gap: 4 }}>
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          style={{
            padding: '12px 16px', fontSize: 14, fontWeight: 500,
            color: active === t.id ? 'var(--primary)' : 'var(--muted)',
            borderBottom: active === t.id ? '2px solid var(--primary)' : '2px solid transparent',
            marginBottom: -1, flex: fullWidth ? 1 : '0 0 auto',
            display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center',
            transition: 'color .15s ease',
          }}
        >
          {t.icon && Icons[t.icon as keyof typeof Icons]?.({ size: 15 })}
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function PlanPill({ plan }: { plan: string }) {
  const map: Record<string, BadgeTone> = { basic: 'default', pro: 'green', premium: 'gold' }
  const p = PLANS[plan as keyof typeof PLANS]
  return <Badge tone={map[plan] || 'default'}>{p?.labelAr || plan}</Badge>
}

export function SectorPill({ sector }: { sector: string }) {
  return <Badge>{(SECTORS as Record<string, { label: string }>)[sector]?.label || sector}</Badge>
}

export function StatePill({ active, endsAt }: { active: boolean; endsAt?: string | null }) {
  if (!active) return <Badge tone="red" dot>موقوف</Badge>
  const days = daysUntil(endsAt)
  if (days < 0) return <Badge tone="red" dot>منتهي</Badge>
  if (days <= 30) return <Badge tone="amber" dot>قارب الانتهاء</Badge>
  return <Badge tone="green" dot>نشط</Badge>
}

export function StatCard({ label, value, suffix, icon, hint, tone }: {
  label: string; value: string | number; suffix?: string; icon?: string; hint?: string; tone?: 'gold' | string
}) {
  return (
    <div className="wj-card wj-card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>{label}</span>
        {icon && (
          <span style={{
            width: 30, height: 30, borderRadius: 8,
            background: tone === 'gold' ? 'var(--accent-soft)' : 'var(--primary-soft)',
            color: tone === 'gold' ? 'var(--accent)' : 'var(--primary)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}>{Icons[icon as keyof typeof Icons]?.({ size: 15 })}</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span className="mono" style={{ fontSize: 30, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>{value}</span>
        {suffix && <span className="mono" style={{ fontSize: 18, color: 'var(--muted)' }}>{suffix}</span>}
      </div>
      {hint && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{hint}</span>}
    </div>
  )
}

export function Alert({ tone = 'info', icon = 'info', title, children, action }: {
  tone?: AlertTone; icon?: string; title?: string; children: ReactNode; action?: ReactNode
}) {
  const toneMap: Record<AlertTone, { bg: string; bd: string; fg: string }> = {
    info:    { bg: '#eef4f1', bd: '#cfe0d6', fg: '#0e3b2e' },
    warn:    { bg: 'var(--warn-soft)', bd: '#e7cf9c', fg: '#7d5a17' },
    danger:  { bg: 'var(--danger-soft)', bd: '#e7c3be', fg: '#7e2418' },
    success: { bg: 'var(--primary-soft)', bd: '#c5d8cd', fg: 'var(--primary)' },
  }
  const t = toneMap[tone]
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, background: t.bg, borderRadius: 'var(--r-md)', border: `1px solid ${t.bd}`, padding: '14px 16px', color: t.fg }}>
      <span style={{ marginTop: 2 }}>{Icons[icon as keyof typeof Icons]?.({ size: 18 })}</span>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>{title}</div>}
        <div style={{ fontSize: 13.5, lineHeight: 1.6 }}>{children}</div>
      </div>
      {action}
    </div>
  )
}

export function SearchInput({ value, onChange, placeholder = 'بحث...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <input className="wj-input" style={{ paddingInlineStart: 38 }} value={value || ''} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} />
      <span style={{ position: 'absolute', insetInlineStart: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
        {Icons.search?.({ size: 16 })}
      </span>
    </div>
  )
}

export function SideNavItem({ icon, label, active, onClick, badge }: { icon: string; label: string; active?: boolean; onClick: () => void; badge?: string }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, width: '100%',
      padding: '9px 12px', borderRadius: 8, fontSize: 14, fontWeight: 500,
      color: active ? 'var(--primary)' : 'var(--ink-soft)',
      background: active ? 'var(--primary-soft)' : 'transparent',
      transition: 'all .15s ease', textAlign: 'right',
    }}
      onMouseEnter={(e) => !active && (e.currentTarget.style.background = 'var(--bg-alt)')}
      onMouseLeave={(e) => !active && (e.currentTarget.style.background = 'transparent')}
    >
      <span style={{ color: active ? 'var(--primary)' : 'var(--muted)' }}>{Icons[icon as keyof typeof Icons]?.({ size: 17 })}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{badge}</span>}
    </button>
  )
}

export function SectionHeader({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</h1>
        {sub && <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 14 }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}
