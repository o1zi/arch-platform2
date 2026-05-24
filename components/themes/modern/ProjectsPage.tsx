'use client'

import { Tenant, Project } from '@/types'
import { SectorConfig, getSectorConfig } from '@/lib/sectors'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BedDouble, Bath, Maximize2, Tag } from 'lucide-react'

export default function ModernProjectsPage({
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
    <div className="min-h-screen bg-[#0f0f0f]" dir="rtl">
      {/* top nav */}
      <nav className="border-b border-white/5 px-6 h-16 flex items-center justify-between max-w-7xl mx-auto">
        <Link href={`/${tenant.slug}`} className="text-white font-bold">{tenant.name_ar}</Link>
        <div className="flex gap-6 text-sm text-white/40">
          <Link href={`/${tenant.slug}`} className="hover:text-white transition-colors">الرئيسية</Link>
          <span className="text-white">{sc.portfolioLabel}</span>
          <Link href={`/${tenant.slug}/contact`} className="hover:text-white transition-colors">تواصل</Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* header */}
        <div className="mb-12">
          <h1 className="text-6xl font-black text-white mb-2">{sc.portfolioLabel}</h1>
          <p className="text-white/30">{projects.length} {sc.portfolioItemLabel}</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`} className="group relative bg-[#1a1a1a] overflow-hidden rounded-sm">
              <div className="relative aspect-[4/3] overflow-hidden">
                {p.cover_image_url
                  ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  : <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <span className="text-white/10 text-4xl font-black">{p.title_ar.charAt(0)}</span>
                    </div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />

                {/* status badge for real_estate */}
                {sc.extraFields.status && p.status && (
                  <div className={`absolute top-3 right-3 px-2 py-0.5 text-xs font-bold ${
                    p.status === 'متاح' ? 'bg-green-500 text-white' :
                    p.status === 'مباع' ? 'bg-red-500 text-white' :
                    p.status === 'مؤجر' ? 'bg-blue-500 text-white' :
                    'bg-yellow-500 text-black'
                  }`}>{p.status}</div>
                )}
                {p.is_featured && !sc.extraFields.status && (
                  <div className="absolute top-3 right-3 bg-white text-black text-xs font-bold px-2 py-0.5">مميز</div>
                )}
              </div>

              <div className="p-4">
                {p.category && <p className="text-white/40 text-xs mb-1">{p.category}</p>}
                <p className="text-white font-bold leading-tight">{p.title_ar}</p>

                {/* real_estate extra fields */}
                {(sc.extraFields.price || sc.extraFields.area || sc.extraFields.bedrooms) && (
                  <div className="flex flex-wrap gap-3 mt-2 text-white/50 text-xs">
                    {sc.extraFields.price && p.price && (
                      <span className="text-green-400 font-bold">{p.price}</span>
                    )}
                    {sc.extraFields.area && p.area && (
                      <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" />{p.area}</span>
                    )}
                    {sc.extraFields.bedrooms && p.bedrooms && (
                      <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{p.bedrooms}</span>
                    )}
                    {sc.extraFields.bedrooms && p.bathrooms && (
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms}</span>
                    )}
                  </div>
                )}

                {p.tags && p.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mt-2">
                    {p.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="flex gap-3 mt-2 text-white/20 text-xs">
                  {p.year && <span>{p.year}</span>}
                  {p.location_ar && <span>{p.location_ar}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-white/20 text-lg">لا توجد {sc.portfolioItemLabelPlural} في هذه الفئة</p>
          </div>
        )}
      </div>
    </div>
  )
}
