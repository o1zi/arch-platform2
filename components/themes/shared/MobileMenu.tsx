'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Menu, Phone, Mail } from 'lucide-react'

interface MobileMenuProps {
  tenantName: string
  tenantSlug: string
  logoUrl?: string | null
  phone?: string | null
  email?: string | null
  portfolioLabel: string
  accentColor?: string
  bgColor?: string
  textColor?: string
  variant?: 'dark' | 'light' | 'accent'
}

export default function MobileMenu({
  tenantName,
  tenantSlug,
  logoUrl,
  phone,
  email,
  portfolioLabel,
  accentColor = '#3b82f6',
  bgColor = '#ffffff',
  textColor = '#111111',
  variant = 'dark',
}: MobileMenuProps) {
  const [open, setOpen] = useState(false)

  // منع التمرير عند فتح القائمة
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // إغلاق عند الضغط على Escape
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  const isDark = variant === 'dark'
  const menuBg = isDark ? '#0a0a0a' : variant === 'accent' ? accentColor : bgColor
  const menuText = isDark ? '#ffffff' : variant === 'accent' ? bgColor : textColor
  const menuSubText = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'
  const hamburgerColor = isDark ? '#ffffff' : textColor

  const links = [
    { href: `/${tenantSlug}`, label: 'الرئيسية' },
    { href: `/${tenantSlug}/projects`, label: portfolioLabel },
    { href: `/${tenantSlug}/contact`, label: 'تواصل معنا' },
  ]

  return (
    <>
      {/* زر الهامبرجر */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/10"
        aria-label="فتح القائمة"
        style={{ color: hamburgerColor }}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[90] md:hidden transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={() => setOpen(false)}
      />

      {/* القائمة المنزلقة */}
      <div
        dir="rtl"
        className={`fixed top-0 right-0 bottom-0 z-[100] md:hidden w-[80vw] max-w-xs flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ backgroundColor: menuBg }}
      >
        {/* رأس القائمة */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(128,128,128,0.15)' }}>
          <div className="flex items-center gap-3">
            {logoUrl && (
              <Image src={logoUrl} alt="" width={32} height={32} className="rounded-full object-cover" />
            )}
            <span className="font-bold text-sm" style={{ color: menuText }}>{tenantName}</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full transition-colors hover:bg-white/10"
            aria-label="إغلاق"
            style={{ color: menuText }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* الروابط */}
        <nav className="flex-1 overflow-y-auto py-6 px-6">
          <ul className="space-y-1">
            {links.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-4 border-b text-lg font-semibold transition-opacity hover:opacity-70"
                  style={{ color: menuText, borderColor: 'rgba(128,128,128,0.1)' }}
                >
                  {link.label}
                  <span style={{ color: menuSubText }} className="text-sm">{i + 1 < 10 ? `0${i + 1}` : i + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* أسفل القائمة — معلومات التواصل */}
        <div className="p-6 space-y-3 border-t" style={{ borderColor: 'rgba(128,128,128,0.15)' }}>
          {phone && (
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-3 text-sm transition-opacity hover:opacity-70"
              style={{ color: menuSubText }}
              dir="ltr"
            >
              <Phone className="w-4 h-4 flex-shrink-0" />
              {phone}
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 text-sm transition-opacity hover:opacity-70"
              style={{ color: menuSubText }}
            >
              <Mail className="w-4 h-4 flex-shrink-0" />
              {email}
            </a>
          )}

          {/* زر CTA */}
          <Link
            href={`/${tenantSlug}/contact`}
            onClick={() => setOpen(false)}
            className="block w-full text-center py-3 rounded-lg font-bold text-sm transition-opacity hover:opacity-90 mt-4"
            style={{ backgroundColor: accentColor, color: bgColor }}
          >
            ابدأ مشروعك
          </Link>
        </div>
      </div>
    </>
  )
}
