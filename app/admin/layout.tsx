'use client'

import React, { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Logo, IconBtn, Badge, SearchInput, SideNavItem, Avatar } from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { sbSignOut } from '@/lib/api'

const NAV_ITEMS = [
  { icon: 'home' as const, label: 'الرئيسية', path: '/admin' },
  { icon: 'building' as const, label: 'المكاتب', path: '/admin/tenants' },
  { icon: 'template' as const, label: 'القوالب', path: '/admin/themes' },
  { icon: 'bar' as const, label: 'الإحصائيات', path: '/admin/analytics' },
  { icon: 'list' as const, label: 'السجلات', path: '/admin/subscriptions' },
  { icon: 'settings' as const, label: 'الإعدادات', path: '/admin/settings' },
]

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'لوحة التحكم',
  '/admin/tenants': 'المكاتب',
  '/admin/themes': 'القوالب',
  '/admin/analytics': 'التحليلات',
  '/admin/subscriptions': 'الاشتراكات',
  '/admin/settings': 'الإعدادات',
}

const sidebarVars = {
  '--ink-soft': '#e8eae5',
  '--muted': '#8a9388',
  '--primary': '#b08a3e',
  '--primary-soft': 'rgba(176,138,62,0.15)',
  '--bg-alt': 'rgba(255,255,255,0.06)',
  '--border': 'rgba(255,255,255,0.08)',
  '--surface': 'rgba(255,255,255,0.04)',
} as React.CSSProperties

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')

  const pageTitle =
    PAGE_TITLES[pathname] ||
    Object.entries(PAGE_TITLES).find(([k]) => k !== '/admin' && pathname.startsWith(k))?.[1] ||
    'لوحة التحكم'

  const handleLogout = async () => {
    const { error } = await sbSignOut()
    if (!error) router.push('/login')
  }

  const isActive = (p: string) => (p === '/admin' ? pathname === p : pathname.startsWith(p))

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }} dir="rtl">
      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(20,32,26,0.4)',
            backdropFilter: 'blur(2px)', zIndex: 110,
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 240, minHeight: '100vh', position: 'sticky', top: 0,
          background: 'var(--ink)', color: '#e8eae5',
          display: 'flex', flexDirection: 'column',
          zIndex: 120, flexShrink: 0, transition: 'transform .2s ease',
          transform: mobileOpen ? 'translateX(0)' : undefined,
          ...sidebarVars,
        }}
        className="max-md:fixed max-md:inset-y-0 max-md:right-0 max-md:translate-x-full max-md:translate-x-[0]"
      >
        {/* Brand */}
        <div style={{ padding: '20px 18px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Logo size={20} color="#e8eae5" />
            <Badge tone="gold">admin</Badge>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(({ icon, label, path }) => (
            <SideNavItem
              key={path}
              icon={icon}
              label={label}
              active={isActive(path)}
              onClick={() => {
                router.push(path)
                setMobileOpen(false)
              }}
            />
          ))}
        </nav>

        {/* User info card */}
        <div
          style={{
            padding: '14px 16px', borderTop: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <Avatar name="مالك المنصة" size={36} bg="rgba(176,138,62,0.2)" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#e8eae5', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              مالك المنصة
            </div>
            <div style={{ fontSize: 11, color: '#8a9388', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              admin@wujood.sa
            </div>
          </div>
          <IconBtn
            icon="logout"
            title="تسجيل الخروج"
            size={32}
            onClick={handleLogout}
            style={{ color: '#8a9388' }}
          />
        </div>
      </aside>

      {/* ── Right side: Header + Main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top header */}
        <header
          style={{
            height: 60, background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '0 22px', flexShrink: 0,
            position: 'sticky', top: 0, zIndex: 100,
          }}
        >
          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            style={{
              width: 36, height: 36, borderRadius: 8,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--ink-soft)',
            }}
          >
            {Icons.menu?.({ size: 20 })}
          </button>

          {/* Page title + badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600 }}>
              {pageTitle}
            </h1>
            <Badge tone="gold">Admin</Badge>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Search */}
          <div style={{ width: 220 }} className="max-md:hidden">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="بحث..."
            />
          </div>

          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <IconBtn icon="bell" title="الإشعارات" size={36} />
            <span
              style={{
                position: 'absolute', top: 6, right: 8,
                width: 8, height: 8, borderRadius: '50%',
                background: 'var(--danger)',
                border: '2px solid var(--surface)',
              }}
            />
          </div>
        </header>

        {/* Main content */}
        <main style={{ flex: 1, padding: '22px 24px', overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
