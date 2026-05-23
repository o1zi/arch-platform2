'use client'

import { Tenant, Project } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function BoldProjectsPage({ tenant, projects }: { tenant: Tenant; projects: Project[] }) {
  const categories = ['الكل', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean))) as string[]]
  const [active, setActive] = useState('الكل')
  const filtered = active === 'الكل' ? projects : projects.filter(p => p.category === active)

  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      <nav className="border-b-4 border-red-600 px-6 py-4 flex items-center justify-between">
        <Link href={`/${tenant.slug}`} className="text-white font-black text-xl uppercase tracking-tighter">{tenant.name_ar}</Link>
        <div className="flex gap-0">
          <Link href={`/${tenant.slug}`} className="px-5 py-2 text-sm font-black uppercase text-white/40 hover:text-white hover:bg-red-600 transition-all">الرئيسية</Link>
          <span className="px-5 py-2 text-sm font-black uppercase bg-red-600 text-white">المشاريع</span>
          <Link href={`/${tenant.slug}/contact`} className="px-5 py-2 text-sm font-black uppercase text-white/40 hover:text-white hover:bg-red-600 transition-all">تواصل</Link>
        </div>
      </nav>

      {/* header */}
      <div className="px-6 py-12 border-b border-white/10">
        <h1 className="text-7xl md:text-9xl font-black leading-none tracking-tighter"
          style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
          المشاريع
        </h1>
        <div className="flex items-center gap-4 mt-4">
          <div className="w-4 h-4 bg-red-600" />
          <span className="text-white/30 font-black">{projects.length} مشروع</span>
        </div>
      </div>

      {/* filters */}
      {categories.length > 1 && (
        <div className="flex border-b border-white/10 overflow-x-auto">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-6 py-4 text-sm font-black uppercase tracking-widest flex-shrink-0 transition-all border-l border-white/10 ${active === cat ? 'bg-red-600 text-white' : 'text-white/30 hover:text-white hover:bg-white/5'}`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* projects — large strips */}
      <div>
        {filtered.map((p, i) => (
          <Link key={p.id} href={`/projects/${p.id}`}
            className="group flex items-stretch border-b border-white/10 hover:border-red-600 transition-colors min-h-32">
            <div className="w-16 flex-shrink-0 flex items-center justify-center border-l border-white/5">
              <span className="text-white/10 font-black text-3xl group-hover:text-red-600 transition-colors">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <div className="relative w-48 md:w-72 flex-shrink-0 overflow-hidden">
              {p.cover_image_url
                ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                : <div className="w-full h-full bg-white/5" />
              }
            </div>
            <div className="flex-1 p-6 flex flex-col justify-center">
              {p.category && <span className="text-red-600 text-xs font-black uppercase tracking-widest mb-2">{p.category}</span>}
              <h2 className="text-2xl md:text-4xl font-black leading-tight group-hover:text-red-400 transition-colors">{p.title_ar}</h2>
              <div className="flex gap-4 mt-2 text-white/20 text-sm font-black">
                {p.year && <span>{p.year}</span>}
                {p.location_ar && <span>{p.location_ar}</span>}
              </div>
            </div>
            <div className="flex items-center px-6 text-white/10 group-hover:text-red-600 transition-colors">
              <span className="text-4xl font-black">←</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
