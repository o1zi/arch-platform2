'use client'

import { Tenant, Project } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function LuxuryProjectsPage({ tenant, projects }: { tenant: Tenant; projects: Project[] }) {
  const categories = ['الكل', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean))) as string[]]
  const [active, setActive] = useState('الكل')
  const filtered = active === 'الكل' ? projects : projects.filter(p => p.category === active)

  return (
    <div className="min-h-screen bg-[#080808]" dir="rtl">
      <div className="h-px bg-gradient-to-l from-transparent via-[#c9a84c] to-transparent" />
      <nav className="px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Link href={`/${tenant.slug}`} className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase hover:text-[#c9a84c]/70 transition-colors">{tenant.name_ar}</Link>
        <div className="flex gap-8 text-[11px] text-white/30 tracking-[0.25em] uppercase">
          <Link href={`/${tenant.slug}`} className="hover:text-[#c9a84c] transition-colors">رئيسية</Link>
          <span className="text-[#c9a84c]">مشاريع</span>
          <Link href={`/${tenant.slug}/contact`} className="hover:text-[#c9a84c] transition-colors">تواصل</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[10px] tracking-[0.4em] uppercase">معرض الأعمال</span>
          </div>
          <h1 className="text-6xl font-light text-white">المشاريع</h1>
          <p className="text-white/20 text-sm mt-2">{projects.length} مشروع</p>
        </div>

        {/* filters */}
        {categories.length > 1 && (
          <div className="flex gap-6 flex-wrap mb-12 border-b border-white/5 pb-6">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`text-[11px] tracking-[0.25em] uppercase transition-all pb-2 border-b-2 ${active === cat ? 'border-[#c9a84c] text-[#c9a84c]' : 'border-transparent text-white/25 hover:text-white/50'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* full-width showcase */}
        <div className="space-y-2">
          {filtered.map(p => (
            <Link key={p.id} href={`/projects/${p.id}`}
              className="group relative flex items-center gap-0 overflow-hidden bg-[#0e0e0e] border border-white/[0.04] hover:border-[#c9a84c]/30 transition-all duration-500 h-32 md:h-44">
              {/* image */}
              <div className="relative w-48 md:w-80 h-full flex-shrink-0 overflow-hidden">
                {p.cover_image_url
                  ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
                  : <div className="w-full h-full bg-[#1a1a1a]" />
                }
              </div>
              {/* gold divider */}
              <div className="w-px h-1/2 bg-[#c9a84c]/20 group-hover:bg-[#c9a84c]/60 group-hover:h-full transition-all duration-500 flex-shrink-0" />
              {/* info */}
              <div className="flex-1 px-8">
                {p.category && <p className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase mb-2 opacity-60 group-hover:opacity-100 transition-opacity">{p.category}</p>}
                <h2 className="text-xl md:text-3xl font-light text-white/70 group-hover:text-white transition-colors">{p.title_ar}</h2>
                <div className="flex gap-4 mt-2 text-white/20 text-xs">
                  {p.year && <span>{p.year}</span>}
                  {p.location_ar && <span>{p.location_ar}</span>}
                </div>
              </div>
              {/* arrow */}
              <div className="px-8 text-[#c9a84c]/20 group-hover:text-[#c9a84c] transition-colors text-2xl font-light flex-shrink-0">
                ←
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="h-px bg-gradient-to-l from-transparent via-[#c9a84c]/30 to-transparent mt-16" />
    </div>
  )
}
