'use client'

import { Tenant } from '@/types'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'
import { ContactPageTracker } from '@/components/themes/shared/ContactPageTracker'

export default function MinimalContactPage({ tenant }: { tenant: Tenant }) {
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
    <div className="min-h-screen bg-white" dir="rtl">
      {/* HEADER */}
      <header className="px-10 py-6 flex items-center justify-between border-b border-gray-100">
        <Link href={`/${tenant.slug}`} className="text-[11px] text-gray-400 tracking-[0.25em] uppercase hover:text-gray-700 transition-colors">
          {tenant.name_ar}
        </Link>
        <nav className="hidden md:flex gap-8 text-[11px] text-gray-300 tracking-[0.2em] uppercase">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className={`transition-colors ${l.active ? 'text-gray-500' : 'hover:text-gray-700'}`}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button className="md:hidden text-gray-400 hover:text-gray-700" onClick={() => setMenuOpen(true)}>
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/20" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-64 bg-white border-l border-gray-100 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <span className="text-[11px] text-gray-500 tracking-widest uppercase">{tenant.name_ar}</span>
              <button onClick={() => setMenuOpen(false)} className="text-gray-300"><X className="w-4 h-4" /></button>
            </div>
            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 text-[11px] tracking-widest uppercase transition-colors ${l.active ? 'text-gray-700' : 'text-gray-300 hover:text-gray-700'}`}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="px-10 py-24 max-w-xl">
        <p className="text-[11px] text-gray-300 tracking-[0.3em] uppercase mb-6">تواصل معنا</p>
        <h1 className="text-6xl font-extralight text-gray-900 leading-tight mb-20">نسعد<br />بخدمتك</h1>

        <div className="space-y-12">
          {tenant.phone && (
            <div>
              <p className="text-[10px] text-gray-300 tracking-widest uppercase mb-2">الجوال</p>
              <a href={`tel:${tenant.phone}`} className="text-2xl font-light text-gray-700 hover:text-gray-900 transition-colors" dir="ltr">{tenant.phone}</a>
            </div>
          )}
          {tenant.email && (
            <div>
              <p className="text-[10px] text-gray-300 tracking-widest uppercase mb-2">البريد الإلكتروني</p>
              <a href={`mailto:${tenant.email}`} className="text-xl font-light text-gray-700 hover:text-gray-900 transition-colors" dir="ltr">{tenant.email}</a>
            </div>
          )}
          {tenant.address_ar && (
            <div>
              <p className="text-[10px] text-gray-300 tracking-widest uppercase mb-2">العنوان</p>
              <p className="text-lg font-light text-gray-700">{tenant.address_ar}</p>
            </div>
          )}
          {tenant.google_maps_url && (
            <div>
              <a href={tenant.google_maps_url} target="_blank" rel="noopener noreferrer"
                className="text-[11px] text-gray-300 tracking-widest uppercase hover:text-gray-700 transition-colors border-b border-gray-200 pb-0.5">
                عرض على الخريطة
              </a>
            </div>
          )}
        </div>

        {socials.length > 0 && (
          <div className="mt-20 pt-12 border-t border-gray-100">
            <p className="text-[10px] text-gray-300 tracking-widest uppercase mb-4">منصات التواصل</p>
            <div className="flex gap-8 flex-wrap">
              {socials.map(s => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-gray-400 hover:text-gray-700 tracking-widest uppercase transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

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
