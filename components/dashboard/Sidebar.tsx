'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Tenant } from '@/types'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  User,
  FolderOpen,
  Palette,
  Globe,
  CreditCard,
  LogOut,
  ExternalLink,
  LayoutList,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const navItems = [
  { href: '/dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/dashboard/profile', label: 'معلومات المكتب', icon: User },
  { href: '/dashboard/projects', label: 'المشاريع', icon: FolderOpen },
  { href: '/dashboard/services', label: 'الخدمات والمميزات', icon: LayoutList },
  { href: '/dashboard/theme', label: 'القالب', icon: Palette },
  { href: '/dashboard/domain', label: 'الدومين', icon: Globe },
  { href: '/dashboard/subscription', label: 'الاشتراك', icon: CreditCard },
]

export default function DashboardSidebar({ tenant }: { tenant: Tenant }) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'
  const isLocalhost = rootDomain.startsWith('localhost')
  const proto = isLocalhost ? 'http' : 'https'
  const siteUrl = tenant.custom_domain
    ? `${proto}://${tenant.custom_domain}`
    : `${proto}://${rootDomain}/${tenant.slug}`

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href)

  const NavLinks = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
            isActive(href)
              ? 'bg-gray-900 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          {label}
        </Link>
      ))}
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex w-64 bg-white border-l border-gray-200 flex-col min-h-screen sticky top-0">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={tenant.logo_url ?? undefined} />
              <AvatarFallback>{tenant.name_ar.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm truncate">{tenant.name_ar}</p>
              <p className="text-xs text-gray-500 truncate">{tenant.slug}</p>
            </div>
          </div>
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            زيارة موقعي
          </a>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavLinks />
        </nav>

        <div className="p-3 border-t border-gray-200">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </Button>
        </div>
      </aside>

      {/* ── Mobile top bar ── */}
      <header className="md:hidden fixed top-0 inset-x-0 z-50 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={tenant.logo_url ?? undefined} />
            <AvatarFallback className="text-xs">{tenant.name_ar.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-semibold text-sm truncate max-w-[160px]">{tenant.name_ar}</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* ── Mobile drawer overlay ── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <aside className="relative mr-auto w-72 bg-white h-full flex flex-col shadow-xl">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={tenant.logo_url ?? undefined} />
                  <AvatarFallback>{tenant.name_ar.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{tenant.name_ar}</p>
                  <p className="text-xs text-gray-500">{tenant.slug}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-100">
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="p-3">
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-blue-600 hover:underline mb-3 px-3"
              >
                <ExternalLink className="h-3 w-3" />
                زيارة موقعي
              </a>
              <nav className="space-y-1">
                <NavLinks onNavigate={() => setOpen(false)} />
              </nav>
            </div>

            <div className="mt-auto p-3 border-t border-gray-200">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
