'use client'

import { Tenant } from '@/types'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

const ACCENT = '#ff4500'

export default function BoldContactPage({ tenant }: { tenant: Tenant }) {
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
    { href: `/${tenant.slug}/contact`, label: 'تواصل', active: true },
  ]

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      {/* ACCENT BAR */}
      <div className="h-1.5" style={{ backgroundColor: ACCENT }} />

      {/* NAV */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href={`/${tenant.slug}`} className="font-black text-xl uppercase tracking-tighter">{tenant.name_ar}</Link>
        <div className="hidden md:flex gap-0">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href}
              className={`px-5 py-2 text-sm font-black uppercase transition-all ${l.active ? 'text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
              style={l.active ? { backgroundColor: ACCENT } : {}}>
              {l.label}
            </Link>
          ))}
        </div>
        <button className="md:hidden text-white/60 hover:text-white" onClick={() => setMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-[#111] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <span className="font-black text-sm">{tenant.name_ar}</span>
              <button onClick={() => setMenuOpen(false)} className="text-white/40"><X className="w-5 h-5" /></button>
            </div>
            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className="px-4 py-3 text-sm font-black uppercase transition-all"
                  style={{ color: l.active ? '#fff' : 'rgba(255,255,255,0.4)', backgroundColor: l.active ? ACCENT : 'transparent' }}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* GIANT TITLE */}
      <div className="px-6 py-16 border-b border-white/10">
        <h1 className="text-[18vw] font-black leading-none tracking-tighter"
          style={{ WebkitTextStroke: `3px ${ACCENT}`, color: 'transparent' }}>
          هيا
        </h1>
        <p className="text-white/30 font-black text-2xl mt-2">تواصل معنا الآن</p>
      </div>

      {/* CONTACT BLOCKS */}
      <div className="border-b border-white/10">
        {tenant.phone && (
          <a href={`tel:${tenant.phone}`} className="group flex items-center justify-between px-6 py-8 border-b border-white/5 transition-colors"
            style={{}} onMouseEnter={e => e.currentTarget.style.backgroundColor = ACCENT} onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}>
            <span className="text-white/30 font-black text-sm uppercase tracking-widest group-hover:text-white">الجوال</span>
            <span className="text-4xl md:text-6xl font-black group-hover:text-white" dir="ltr">{tenant.phone}</span>
          </a>
        )}
        {tenant.email && (
          <a href={`mailto:${tenant.email}`} className="group flex items-center justify-between px-6 py-8 border-b border-white/5 hover:bg-white/5 transition-colors">
            <span className="text-white/30 font-black text-sm uppercase tracking-widest">البريد</span>
            <span className="text-2xl md:text-4xl font-black text-white/70 group-hover:text-white" dir="ltr">{tenant.email}</span>
          </a>
        )}
        {tenant.address_ar && (
          <div className="flex items-center justify-between px-6 py-8 border-b border-white/5">
            <span className="text-white/30 font-black text-sm uppercase tracking-widest">العنوان</span>
            <span className="text-xl font-black text-white/60">{tenant.address_ar}</span>
          </div>
        )}
        {tenant.google_maps_url && (
          <a href={tenant.google_maps_url} target="_blank" rel="noopener noreferrer"
            className="group flex items-center justify-between px-6 py-8 transition-colors"
            onMouseEnter={e => e.currentTarget.style.backgroundColor = ACCENT} onMouseLeave={e => e.currentTarget.style.backgroundColor = ''}>
            <span className="text-white/30 font-black text-sm uppercase tracking-widest group-hover:text-white">الموقع</span>
            <span className="font-black text-white/40 group-hover:text-white text-lg">افتح الخريطة ←</span>
          </a>
        )}
      </div>

      {/* SOCIALS */}
      {socials.length > 0 && (
        <div className="px-6 py-8 flex gap-2 flex-wrap">
          {socials.map(s => (
            <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
              className="px-5 py-3 text-xs font-black uppercase tracking-widest text-white/30 border border-white/10 transition-all hover:text-white"
              style={{}} onMouseEnter={e => (e.currentTarget.style.borderColor = ACCENT)} onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}>
              {s.label}
            </a>
          ))}
        </div>
      )}

      <SocialFloat
        whatsapp={waPhone}
        snapchat_url={tenant.snapchat_url}
        tiktok_url={tenant.tiktok_url}
        whatsapp_note={tenant.whatsapp_note}
      />
    </div>
  )
}
