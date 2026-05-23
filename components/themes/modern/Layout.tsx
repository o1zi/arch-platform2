'use client'

import { ThemeProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function ModernLayout({ tenant, featuredProjects }: ThemeProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <div className="min-h-screen bg-[#0f0f0f]" dir="rtl">
      {/* NAV */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0f0f0f]/95 backdrop-blur border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo_url && (
              <Image src={tenant.logo_url} alt="" width={32} height={32} className="rounded-full object-cover" />
            )}
            <span className="text-white font-bold tracking-tight">{tenant.name_ar}</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-white/50">
            <Link href={`/${tenant.slug}`} className="hover:text-white transition-colors">الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} className="hover:text-white transition-colors">المشاريع</Link>
            <Link href={`/${tenant.slug}/contact`} className="bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-white/90 transition-colors">تواصل</Link>
          </div>
        </div>
      </nav>

      {/* HERO — split layout */}
      <section className="min-h-screen flex flex-col justify-end pb-20 px-6 pt-24 relative overflow-hidden">
        {tenant.cover_url && (
          <>
            <Image src={tenant.cover_url} alt="" fill className="object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
          </>
        )}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">مكتب هندسي</p>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">{tenant.name_ar}</h1>
              {tenant.name_en && <p className="text-white/30 text-lg font-light" dir="ltr">{tenant.name_en}</p>}
            </div>
            {tenant.bio_ar && (
              <p className="text-white/50 max-w-xs leading-relaxed text-sm md:text-right">{tenant.bio_ar}</p>
            )}
          </div>
          <div className="mt-12 flex gap-4">
            <Link href={`/${tenant.slug}/projects`} className="bg-white text-black px-8 py-3 font-bold hover:bg-white/90 transition-colors">
              استعرض المشاريع
            </Link>
            <Link href={`/${tenant.slug}/contact`} className="border border-white/20 text-white px-8 py-3 font-medium hover:border-white/50 transition-colors">
              تواصل معنا
            </Link>
          </div>
        </div>
        {/* scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-xs tracking-widest">scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="bg-white py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <h2 className="text-5xl font-black text-black">مشاريع<br />مختارة</h2>
              <Link href={`/${tenant.slug}/projects`} className="text-black/40 hover:text-black text-sm transition-colors flex items-center gap-2">
                جميع المشاريع <span>←</span>
              </Link>
            </div>
            {/* asymmetric grid */}
            <div className="grid grid-cols-12 gap-3">
              {featuredProjects.slice(0, 5).map((p, i) => {
                const sizes = [
                  'col-span-12 md:col-span-7 aspect-[16/9]',
                  'col-span-12 md:col-span-5 aspect-[4/3]',
                  'col-span-12 md:col-span-4 aspect-square',
                  'col-span-12 md:col-span-4 aspect-square',
                  'col-span-12 md:col-span-4 aspect-square',
                ]
                return (
                  <Link key={p.id} href={`/projects/${p.id}`} className={`group relative overflow-hidden bg-gray-100 ${sizes[i] ?? 'col-span-12 md:col-span-4 aspect-square'}`}>
                    {p.cover_image_url && (
                      <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-bold text-lg">{p.title_ar}</p>
                      {p.category && <p className="text-white/60 text-sm">{p.category}</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT STRIP */}
      <section className="bg-[#0f0f0f] py-20 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <h3 className="text-3xl font-black text-white">هل لديك مشروع؟</h3>
          <div className="flex gap-4">
            {tenant.phone && (
              <a href={`tel:${tenant.phone}`} className="text-white/50 hover:text-white transition-colors" dir="ltr">{tenant.phone}</a>
            )}
            <Link href={`/${tenant.slug}/contact`} className="bg-white text-black px-8 py-3 font-bold hover:bg-white/90 transition-colors">
              ابدأ الآن
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
