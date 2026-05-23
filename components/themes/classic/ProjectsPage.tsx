'use client'

import { Tenant, Project } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function ClassicProjectsPage({ tenant, projects }: { tenant: Tenant; projects: Project[] }) {
  const categories = ['الكل', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean))) as string[]]
  const [active, setActive] = useState('الكل')
  const filtered = active === 'الكل' ? projects : projects.filter(p => p.category === active)

  return (
    <div className="min-h-screen bg-[#f5f0e8]" dir="rtl">
      <div className="border-b-2 border-[#2c1a0e] px-8 py-2 flex items-center justify-between text-[10px] tracking-[0.2em] text-[#2c1a0e]/50 uppercase">
        <span>معرض المشاريع</span>
        <Link href={`/${tenant.slug}`} className="hover:text-[#8b6914] transition-colors">{tenant.name_ar}</Link>
      </div>

      <header className="border-b-2 border-[#2c1a0e]/20 px-8 py-6 text-center">
        <h1 className="text-4xl font-black text-[#2c1a0e]">المشاريع</h1>
        <p className="text-[#2c1a0e]/40 text-sm mt-1">{projects.length} مشروع</p>
        <nav className="flex justify-center gap-8 mt-4 text-xs text-[#2c1a0e]/60 tracking-widest uppercase">
          <Link href={`/${tenant.slug}`} className="hover:text-[#8b6914]">الرئيسية</Link>
          <span className="text-[#8b6914]">المشاريع</span>
          <Link href={`/${tenant.slug}/contact`} className="hover:text-[#8b6914]">التواصل</Link>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {categories.length > 1 && (
          <div className="flex justify-center gap-4 flex-wrap mb-12">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`text-xs tracking-widest uppercase pb-1 border-b-2 transition-colors ${active === cat ? 'border-[#8b6914] text-[#8b6914]' : 'border-transparent text-[#2c1a0e]/40 hover:text-[#2c1a0e]'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* editorial two-column */}
        <div className="space-y-8">
          {filtered.map((p, i) => (
            <Link key={p.id} href={`/projects/${p.id}`}
              className={`group flex gap-6 items-start ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}>
              <div className="relative w-1/2 aspect-[4/3] flex-shrink-0 overflow-hidden border border-[#2c1a0e]/10">
                {p.cover_image_url
                  ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover group-hover:scale-103 transition-transform duration-700" />
                  : <div className="w-full h-full bg-[#2c1a0e]/5 flex items-center justify-center text-[#2c1a0e]/20 text-sm">لا توجد صورة</div>
                }
              </div>
              <div className="flex-1 py-4">
                {p.category && <p className="text-[#8b6914] text-xs tracking-widest uppercase mb-2">{p.category}</p>}
                <h3 className="text-2xl font-black text-[#2c1a0e] mb-3 leading-tight">{p.title_ar}</h3>
                {p.description_ar && <p className="text-[#2c1a0e]/60 text-sm leading-relaxed line-clamp-3">{p.description_ar}</p>}
                <div className="flex gap-4 mt-4 text-xs text-[#2c1a0e]/40">
                  {p.year && <span>{p.year}</span>}
                  {p.location_ar && <span>{p.location_ar}</span>}
                </div>
                <p className="text-[#8b6914] text-xs tracking-widest uppercase mt-4 group-hover:underline">عرض التفاصيل ←</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t-2 border-double border-[#2c1a0e] px-8 py-6 text-center text-xs text-[#2c1a0e]/40 tracking-widest">
        {tenant.name_ar} &mdash; {new Date().getFullYear()}
      </footer>
    </div>
  )
}
