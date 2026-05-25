'use client'

import { Tenant } from '@/types'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

const CREAM = '#faf6f0'
const DARK = '#2c1f10'
const GOLD = '#8b6914'

export default function ClassicContactPage({ tenant }: { tenant: Tenant }) {
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
    { href: `/${tenant.slug}`, label: 'الرئيسية' },
    { href: `/${tenant.slug}/projects`, label: 'المشاريع' },
    { href: `/${tenant.slug}/contact`, label: 'التواصل', active: true },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM }} dir="rtl">
      {/* TOP BAR */}
      <div className="border-b-2 px-8 py-2 flex items-center justify-between text-[10px] tracking-[0.2em] uppercase"
        style={{ borderColor: DARK, color: `${DARK}50` }}>
        <span>التواصل</span>
        <Link href={`/${tenant.slug}`} className="transition-colors" style={{ color: `${DARK}50` }}
          onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
          onMouseLeave={e => (e.currentTarget.style.color = `${DARK}50`)}>
          {tenant.name_ar}
        </Link>
      </div>

      {/* NAV */}
      <nav className="px-8 py-4 flex items-center justify-between border-b" style={{ borderColor: `${DARK}10` }}>
        <Link href={`/${tenant.slug}`} className="text-lg font-black" style={{ color: DARK, fontFamily: 'Georgia, serif' }}>
          {tenant.name_ar}
        </Link>
        <div className="hidden md:flex gap-8 text-xs tracking-[0.2em] uppercase" style={{ color: `${DARK}50` }}>
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className="transition-colors"
              style={{ color: l.active ? GOLD : `${DARK}50` }}>
              {l.label}
            </Link>
          ))}
        </div>
        <button className="md:hidden" style={{ color: `${DARK}60` }} onClick={() => setMenuOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-72 flex flex-col" style={{ backgroundColor: CREAM }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: `${DARK}15` }}>
              <span className="font-black text-sm" style={{ color: DARK }}>{tenant.name_ar}</span>
              <button onClick={() => setMenuOpen(false)} style={{ color: `${DARK}40` }}><X className="w-5 h-5" /></button>
            </div>
            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-sm transition-colors"
                  style={{ color: l.active ? GOLD : `${DARK}70` }}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-8 py-16">
        {/* Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black" style={{ color: DARK, fontFamily: 'Georgia, serif' }}>تواصل معنا</h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-20" style={{ backgroundColor: GOLD }} />
            <div className="w-2 h-2 rotate-45" style={{ backgroundColor: GOLD }} />
            <div className="h-px w-20" style={{ backgroundColor: GOLD }} />
          </div>
        </div>

        {/* Contact card */}
        <div className="bg-white border p-10 space-y-8" style={{ borderColor: `${DARK}10`, boxShadow: '4px 4px 0 rgba(44,26,14,0.05)' }}>
          {tenant.phone && (
            <div className="flex flex-col items-center text-center pb-8 border-b" style={{ borderColor: `${DARK}10` }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>الهاتف</p>
              <a href={`tel:${tenant.phone}`} className="text-3xl font-black transition-colors" style={{ color: DARK }} dir="ltr">{tenant.phone}</a>
            </div>
          )}
          {tenant.email && (
            <div className="flex flex-col items-center text-center pb-8 border-b" style={{ borderColor: `${DARK}10` }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>البريد الإلكتروني</p>
              <a href={`mailto:${tenant.email}`} className="text-lg font-bold transition-colors" style={{ color: DARK }} dir="ltr">{tenant.email}</a>
            </div>
          )}
          {tenant.address_ar && (
            <div className="flex flex-col items-center text-center pb-8 border-b" style={{ borderColor: `${DARK}10` }}>
              <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>العنوان</p>
              <p className="font-medium" style={{ color: DARK }}>{tenant.address_ar}</p>
            </div>
          )}
          {tenant.google_maps_url && (
            <div className="text-center">
              <a href={tenant.google_maps_url} target="_blank" rel="noopener noreferrer"
                className="inline-block border-2 px-8 py-2.5 text-sm tracking-widest uppercase transition-colors"
                style={{ borderColor: DARK, color: DARK }}>
                عرض على الخريطة
              </a>
            </div>
          )}
        </div>

        {/* Socials */}
        {socials.length > 0 && (
          <div className="text-center mt-10 pt-8 border-t" style={{ borderColor: `${DARK}10` }}>
            <p className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: GOLD }}>تابعنا</p>
            <div className="flex justify-center gap-6 flex-wrap">
              {socials.map(s => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                  className="text-sm tracking-widest transition-colors"
                  style={{ color: `${DARK}50` }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <SocialFloat
        whatsapp={waPhone}
        snapchat_url={tenant.snapchat_url}
        tiktok_url={tenant.tiktok_url}
        whatsapp_note={tenant.whatsapp_note}
      />
    </div>
  )
}
