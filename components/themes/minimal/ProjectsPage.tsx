'use client'

import { Tenant, Project } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function MinimalProjectsPage({ tenant, projects }: { tenant: Tenant; projects: Project[] }) {
  const categories = ['الكل', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean))) as string[]]
  const [active, setActive] = useState('الكل')
  const filtered = active === 'الكل' ? projects : projects.filter(p => p.category === active)

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="px-10 py-6 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="text-[11px] text-gray-400 tracking-[0.25em] uppercase hover:text-gray-700 transition-colors">{tenant.name_ar}</Link>
        <nav className="flex gap-8 text-[11px] text-gray-300 tracking-[0.2em] uppercase">
          <Link href="/" className="hover:text-gray-700 transition-colors">رئيسية</Link>
          <span className="text-gray-500">مشاريع</span>
          <Link href="/contact" className="hover:text-gray-700 transition-colors">تواصل</Link>
        </nav>
      </header>

      <div className="px-10 py-16">
        <div className="mb-16">
          <h1 className="text-6xl font-extralight text-gray-900 leading-tight">المشاريع</h1>
          <p className="text-[11px] text-gray-300 tracking-widest uppercase mt-3">{projects.length} مشروع</p>
        </div>

        {/* filter */}
        {categories.length > 1 && (
          <div className="flex gap-6 mb-16 border-b border-gray-100 pb-6">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`text-[11px] tracking-[0.2em] uppercase transition-colors ${active === cat ? 'text-gray-900' : 'text-gray-300 hover:text-gray-500'}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* two-column grid with hover reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {filtered.map((p, i) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="group">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 mb-4">
                {p.cover_image_url
                  ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700" />
                  : <div className="w-full h-full" />
                }
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] text-gray-300 tracking-widest uppercase mb-1">{p.category ?? ''}</p>
                  <h3 className="text-lg font-light text-gray-700 group-hover:text-gray-900 transition-colors">{p.title_ar}</h3>
                </div>
                <span className="text-[11px] text-gray-200 tracking-widest pt-1 flex-shrink-0">{p.year ?? String(i + 1).padStart(2, '0')}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
