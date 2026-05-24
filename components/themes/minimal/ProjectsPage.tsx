'use client'

import { Tenant, Project } from '@/types'
import { SectorConfig, getSectorConfig } from '@/lib/sectors'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BedDouble, Bath, Maximize2 } from 'lucide-react'

export default function MinimalProjectsPage({
  tenant,
  projects,
  sectorConfig,
}: {
  tenant: Tenant
  projects: Project[]
  sectorConfig?: SectorConfig
}) {
  const sc = sectorConfig ?? getSectorConfig(tenant.sector)
  const categories = ['الكل', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean))) as string[]]
  const [active, setActive] = useState('الكل')
  const filtered = active === 'الكل' ? projects : projects.filter(p => p.category === active)

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="px-10 py-6 flex items-center justify-between border-b border-gray-100">
        <Link href={`/${tenant.slug}`} className="text-[11px] text-gray-400 tracking-[0.25em] uppercase hover:text-gray-700 transition-colors">{tenant.name_ar}</Link>
        <nav className="flex gap-8 text-[11px] text-gray-300 tracking-[0.2em] uppercase">
          <Link href={`/${tenant.slug}`} className="hover:text-gray-700 transition-colors">رئيسية</Link>
          <span className="text-gray-500">{sc.portfolioLabel}</span>
          <Link href={`/${tenant.slug}/contact`} className="hover:text-gray-700 transition-colors">تواصل</Link>
        </nav>
      </header>

      <div className="px-10 py-16">
        <div className="mb-16">
          <h1 className="text-6xl font-extralight text-gray-900 leading-tight">{sc.portfolioLabel}</h1>
          <p className="text-[11px] text-gray-300 tracking-widest uppercase mt-3">{projects.length} {sc.portfolioItemLabel}</p>
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

        {/* two-column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {filtered.map((p, i) => (
            <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`} className="group">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 mb-4">
                {p.cover_image_url
                  ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                  : <div className="w-full h-full" />
                }
                {sc.extraFields.status && p.status && (
                  <div className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-medium ${
                    p.status === 'متاح' ? 'bg-green-100 text-green-700' :
                    p.status === 'مباع' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>{p.status}</div>
                )}
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] text-gray-300 tracking-widest uppercase mb-1">{p.category ?? ''}</p>
                  <h3 className="text-lg font-light text-gray-700 group-hover:text-gray-900 transition-colors">{p.title_ar}</h3>
                  {(sc.extraFields.price || sc.extraFields.area || sc.extraFields.bedrooms) && (
                    <div className="flex flex-wrap gap-3 mt-1 text-gray-400 text-xs">
                      {sc.extraFields.price && p.price && <span className="text-gray-700 font-medium">{p.price}</span>}
                      {sc.extraFields.area && p.area && <span className="flex items-center gap-0.5"><Maximize2 className="w-3 h-3" />{p.area}</span>}
                      {sc.extraFields.bedrooms && p.bedrooms && <span className="flex items-center gap-0.5"><BedDouble className="w-3 h-3" />{p.bedrooms}</span>}
                      {sc.extraFields.bedrooms && p.bathrooms && <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />{p.bathrooms}</span>}
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-gray-200 tracking-widest pt-1 flex-shrink-0">{p.year ?? String(i + 1).padStart(2, '0')}</span>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-300 text-sm py-16">لا توجد {sc.portfolioItemLabelPlural} في هذه الفئة</p>
        )}
      </div>
    </div>
  )
}
