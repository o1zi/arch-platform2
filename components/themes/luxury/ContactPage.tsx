'use client'

import { Tenant } from '@/types'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'
import { ContactPageTracker } from '@/components/themes/shared/ContactPageTracker'

const LUX_BG = '#080808'
const LUX_GOLD = '#c9a84c'
const LUX_CREAM = '#f5f0e8'

export default function LuxuryContactPage({ tenant }: { tenant: Tenant }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const waPhone = tenant.whatsapp?.replace(/\D/g, '') || tenant.phone?.replace(/\D/g, '')

  const socials = [
    { label: 'إنستقرام', url: tenant.instagram_url },
    { label: 'تويتر', url: tenant.twitter_url },
    { label: 'لينكدإن', url: tenant.linkedin_url },
    { label: 'سناب شات', url: tenant.snapchat_url },
    { label: 'تيك توك', url: tenant.tiktok_url },
  ].filter(s => s.url)

  const navLinks = [
    { href: `/${tenant.slug}`, label: 'رئيسية' },
    { href: `/${tenant.slug}/projects`, label: 'مشاريع' },
    { href: `/${tenant.slug}/contact`, label: 'تواصل', active: true },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: LUX_BG, color: LUX_CREAM }} dir="rtl">
      <div className="h-px" style={{ background: `linear-gradient(to left, transparent, ${LUX_GOLD}, transparent)` }} />

      {/* NAV */}
      <nav className="px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Link href={`/${tenant.slug}`} className="text-xs tracking-[0.3em] uppercase" style={{ color: LUX_GOLD }}>{tenant.name_ar}</Link>
        <div className="hidden md:flex gap-8 text-[11px] tracking-[0.25em] uppercase" style={{ color: `${LUX_CREAM}30` }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="transition-colors"
              style={{ color: l.active ? LUX_GOLD : `${LUX_CREAM}30` }}>
              {l.label}
            </Link>
          ))}
        </div>
        <button className="md:hidden" style={{ color: `${LUX_GOLD}60` }} onClick={() => setMenuOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-72 flex flex-col" style={{ backgroundColor: '#0d0d0d' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: `${LUX_GOLD}20` }}>
              <span className="text-xs tracking-widest uppercase" style={{ color: LUX_GOLD }}>{tenant.name_ar}</span>
              <button onClick={() => setMenuOpen(false)} style={{ color: `${LUX_CREAM}30` }}><X className="w-5 h-5" /></button>
            </div>
            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-[11px] tracking-widest uppercase transition-colors"
                  style={{ color: l.active ? LUX_GOLD : `${LUX_CREAM}40` }}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-8 py-20">
        {/* Title */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12" style={{ backgroundColor: LUX_GOLD }} />
            <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: LUX_GOLD }}>تواصل معنا</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-light leading-tight" style={{ color: LUX_CREAM }}>يسعدنا<br />سماعك</h1>
        </div>

        {/* Contact cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px" style={{ backgroundColor: `${LUX_CREAM}08` }}>
          {tenant.phone && (
            <a href={`tel:${tenant.phone}`} className="group p-8 transition-colors" style={{ backgroundColor: LUX_BG }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0e0e0e'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = LUX_BG}>
              <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: LUX_GOLD }}>الجوال</p>
              <p className="text-2xl font-light transition-colors" style={{ color: `${LUX_CREAM}60` }} dir="ltr">{tenant.phone}</p>
              <div className="w-0 group-hover:w-full h-px mt-4 transition-all duration-500" style={{ backgroundColor: LUX_GOLD }} />
            </a>
          )}
          {tenant.email && (
            <a href={`mailto:${tenant.email}`} className="group p-8 transition-colors" style={{ backgroundColor: LUX_BG }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0e0e0e'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = LUX_BG}>
              <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: LUX_GOLD }}>البريد الإلكتروني</p>
              <p className="text-lg font-light transition-colors" style={{ color: `${LUX_CREAM}60` }} dir="ltr">{tenant.email}</p>
              <div className="w-0 group-hover:w-full h-px mt-4 transition-all duration-500" style={{ backgroundColor: LUX_GOLD }} />
            </a>
          )}
          {tenant.address_ar && (
            <div className="p-8" style={{ backgroundColor: LUX_BG }}>
              <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: LUX_GOLD }}>العنوان</p>
              <p className="text-lg font-light" style={{ color: `${LUX_CREAM}50` }}>{tenant.address_ar}</p>
            </div>
          )}
          {tenant.google_maps_url && (
            <a href={tenant.google_maps_url} target="_blank" rel="noopener noreferrer"
              className="group p-8 flex flex-col justify-between transition-colors" style={{ backgroundColor: LUX_BG }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#0e0e0e'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = LUX_BG}>
              <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: LUX_GOLD }}>الموقع</p>
              <div className="flex items-center justify-between">
                <span className="font-light transition-colors" style={{ color: `${LUX_CREAM}30` }}>افتح على الخريطة</span>
                <span className="text-2xl transition-colors" style={{ color: `${LUX_GOLD}40` }}>←</span>
              </div>
            </a>
          )}
        </div>

        {/* Socials */}
        {socials.length > 0 && (
          <div className="mt-16 pt-12 border-t" style={{ borderColor: `${LUX_CREAM}08` }}>
            <p className="text-[10px] tracking-[0.4em] uppercase mb-6" style={{ color: LUX_GOLD }}>منصات التواصل</p>
            <div className="flex gap-8 flex-wrap">
              {socials.map(s => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] tracking-widest uppercase transition-colors"
                  style={{ color: `${LUX_CREAM}25` }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-px" style={{ background: `linear-gradient(to left, transparent, ${LUX_GOLD}30, transparent)` }} />

      <ContactPageTracker tenantSlug={tenant.slug} />
      <SocialFloat
        whatsapp={waPhone}
        snapchat_url={tenant.snapchat_url}
        tiktok_url={tenant.tiktok_url}
        whatsapp_note={tenant.whatsapp_note}
        tenantSlug={tenant.slug}
      />
    </div>
  )
}
