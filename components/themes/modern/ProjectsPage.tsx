'use client'

import { Tenant, Project } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function ModernProjectsPage({ tenant, projects }: { tenant: Tenant; projects: Project[] }) {
  const categories = ['الكل', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean))) as string[]]
  const [active, setActive] = useState('الكل')
  const filtered = active === 'الكل' ? projects : projects.filter(p => p.category === active)

  return (
    <div className="min-h-screen bg-[#0f0f0f]" dir="rtl">
      {/* top nav */}
      <nav className="border-b border-white/5 px-6 h-16 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="./" className="text-white font-bold">{tenant.name_ar}</Link>
        <div className="flex gap-6 text-sm text-white/40">
          <Link href="./" className="hover:text-white transition-colors">الرئيسية</Link>
          <span className="text-white">المشاريع</span>
          <Link href="./contact" className="hover:text-white transition-colors">تواصل</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* header */}
        <div className="mb-12">
          <h1 className="text-6xl font-black text-white mb-2">المشاريع</h1>
          <p className="text-white/30">{projects.length} مشروع</p>
        </div>

        {/* filter tabs */}
        {categories.length > 1 && (
          <div className="flex gap-2 flex-wrap mb-12">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-5 py-2 text-sm font-medium transition-all ${active === cat ? 'bg-white text-black' : 'border border-white/10 text-white/40 hover:border-white/30 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {filtered.map(p => (
            <Link key={p.id} href={`/projects/${p.id}`} className="group relative aspect-[4/3] bg-[#0f0f0f] overflow-hidden">
              {p.cover_image_url
                ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                : <div className="w-full h-full bg-white/5" />
              }
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-5">
                <p className="text-white font-bold text-lg leading-tight">{p.title_ar}</p>
                <div className="flex gap-3 mt-1 text-white/40 text-xs">
                  {p.category && <span>{p.category}</span>}
                  {p.year && <span>{p.year}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
