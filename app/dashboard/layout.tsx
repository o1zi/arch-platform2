'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  Logo,
  IconBtn,
  PlanPill,
  StatePill,
  SideNavItem,
  Avatar,
} from '@/components/ui/atoms'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT, daysUntil } from '@/lib/data'
import { sbGetMyTenant, sbSignOut } from '@/lib/api'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'الرئيسية',
  '/dashboard/profile': 'المعلومات الشخصية',
  '/dashboard/projects': 'المشاريع',
  '/dashboard/services': 'الخدمات',
  '/dashboard/stats': 'الإحصائيات',
  '/dashboard/testimonials': 'آراء العملاء',
  '/dashboard/faq': 'الأسئلة الشائعة',
  '/dashboard/theme': 'القالب',
  '/dashboard/domain': 'الدومين',
  '/dashboard/subscription': 'الاشتراك',
  '/dashboard/analytics': 'تحليلات الزوار',
}

const NAV_ITEMS = [
  { href: '/dashboard', icon: 'home', label: 'الرئيسية' },
  { href: '/dashboard/profile', icon: 'user', label: 'المعلومات' },
  { href: '/dashboard/projects', icon: 'briefcase', label: 'المشاريع' },
  { href: '/dashboard/services', icon: 'cube', label: 'الخدمات' },
  { href: '/dashboard/stats', icon: 'bar', label: 'الإحصائيات' },
  { href: '/dashboard/testimonials', icon: 'star', label: 'آراء العملاء' },
  { href: '/dashboard/faq', icon: 'faq', label: 'الأسئلة الشائعة' },
  { href: '/dashboard/theme', icon: 'palette', label: 'القالب' },
  { href: '/dashboard/domain', icon: 'globe', label: 'الدومين' },
  { href: '/dashboard/subscription', icon: 'card', label: 'الاشتراك' },
  { href: '/dashboard/analytics', icon: 'trend', label: 'تحليلات' },
]

const SIDE_W = 260
const HEADER_H = 60

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [tenant, setTenant] = useState<Record<string, unknown>>({ ...DEMO_TENANT })
  const [sidebarOpen, setSidebarOpen] = useState(false)
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

  const _tenant = tenant as Record<string, unknown>
  const name = (_tenant.short_ar as string) || (_tenant.name_ar as string) || 'المكتب'
  const sub = (_tenant.subdomain as string) || (_tenant.slug as string) || ''
  const plan = (_tenant.plan as string) || 'basic'
  const active = !!_tenant.is_active
  const endsAt = _tenant.subscription_end as string | null
  const days = daysUntil(endsAt)

  const pageTitle = PAGE_TITLES[pathname] || 'لوحة التحكم'

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href)

  async function handleLogout() {
    await sbSignOut()
    router.push('/login')
  }

  function closeSidebar() {
    setSidebarOpen(false)
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <Logo size={22} />
      </div>

      {/* Tenant info card */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 8,
          }}
        >
          <Avatar name={name} size={34} />
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {name}
            </p>
            <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0 }}>
              {sub}
            </p>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
            marginBottom: 4,
          }}
        >
          <PlanPill plan={plan} />
          <StatePill active={active} endsAt={endsAt} />
        </div>
        <a
          href={`https://${sub}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 12,
            color: 'var(--primary)',
            textDecoration: 'none',
          }}
        >
          {Icons.external?.({ size: 13 })}{' '}
          زيارة موقعي
        </a>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '6px 12px' }}>
        {NAV_ITEMS.map((item) => (
          <SideNavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            active={isActive(item.href)}
            onClick={() => {
              router.push(item.href)
              closeSidebar()
            }}
          />
        ))}
      </nav>

      {/* User + Logout */}
      <div
        style={{
          padding: '10px 20px 12px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Avatar name={name} size={28} />
        <IconBtn
          icon="logout"
          size={32}
          onClick={handleLogout}
          title="تسجيل الخروج"
        />
      </div>
    </>
  )

  return (
    <div
      style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex' }}
      dir="rtl"
    >
      {/* ── Desktop sidebar ── */}
      <aside
        style={{
          width: SIDE_W,
          minWidth: SIDE_W,
          background: '#fff',
          borderInlineEnd: '1px solid var(--border)',
          display: 'none',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 30,
        }}
        className="d-sidebar"
      >
        {sidebarContent}
      </aside>

      {/* ── Right side: header + main ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* ── Fixed header bar ── */}
        <header
          style={{
            height: HEADER_H,
            background: '#fff',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            position: 'sticky',
            top: 0,
            zIndex: 20,
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mobile hamburger */}
            <IconBtn
              icon="menu"
              size={36}
              onClick={() => setSidebarOpen(true)}
              title="القائمة"
              style={{ display: 'none' }}
              className="m-hamburger"
            />
            <h2
              style={{
                margin: 0,
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {pageTitle}
            </h2>
            <StatePill active={active} endsAt={endsAt} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <IconBtn icon="bell" size={36} title="الإشعارات" />
            <Avatar name={name} size={32} />
          </div>
        </header>

        {/* ── Main content ── */}
        <main style={{ flex: 1, padding: '20px 24px 40px', overflow: 'auto' }}>
          {children}
        </main>
      </div>

      {/* ── Mobile sidebar overlay ── */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'none',
          }}
          className="m-overlay"
        >
          {/* Backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(20, 32, 26, 0.4)',
              backdropFilter: 'blur(2px)',
            }}
            onClick={closeSidebar}
          />
          {/* Drawer */}
          <aside
            style={{
              position: 'absolute',
              insetInlineEnd: 0,
              top: 0,
              bottom: 0,
              width: SIDE_W,
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--sh-xl)',
            }}
          >
            <div
              style={{
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <Logo size={20} />
              <IconBtn
                icon="x"
                size={32}
                onClick={closeSidebar}
                title="إغلاق"
              />
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          .d-sidebar { display: flex !important; }
          .m-hamburger { display: none !important; }
        }
        @media (max-width: 767px) {
          .d-sidebar { display: none !important; }
          .m-hamburger { display: inline-flex !important; }
          .m-overlay { display: block !important; }
        }
      `}</style>
    </div>
  )
}
