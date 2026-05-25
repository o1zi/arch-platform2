'use client'

import { Tenant, Project } from '@/types'
import { SectorConfig, getSectorConfig } from '@/lib/sectors'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BedDouble, Bath, Maximize2, Menu, X } from 'lucide-react'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

export default function ClassicProjectsPage({
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
  const [menuOpen, setMenuOpen] = useState(false)
  const filtered = active === 'الكل' ? projects : projects.filter(p => p.category === active)
  const waPhone = tenant.whatsapp?.replace(/\D/g, '') || tenant.phone?.replace(/\D/g, '')

  return (
    <div className="min-h-screen bg-[#f5f0e8]" dir="rtl">
      <div className="border-b-2 border-[#2c1a0e] px-8 py-2 flex items-center justify-between text-[10px] tracking-[0.2em] text-[#2c1a0e]/50 uppercase">
        <span>{sc.portfolioLabel}</span>
        <div className="flex items-center gap-4">
          <Link href={`/${tenant.slug}`} className="hover:text-[#8b6914] transition-colors hidden md:block">{tenant.name_ar}</Link>
          <button className="md:hidden text-[#2c1a0e]/60 hover:text-[#8b6914]" onClick={() => setMenuOpen(true)}>
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-64 bg-[#faf6f0] border-l-2 border-[#2c1a0e]/20 flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-[#2c1a0e]/10">
              <span className="text-xs text-[#2c1a0e]/60 tracking-widest uppercase">{tenant.name_ar}</span>
              <button onClick={() => setMenuOpen(false)} className="text-[#2c1a0e]/40"><X className="w-4 h-4" /></button>
            </div>
            <nav className="p-4 flex flex-col gap-1">
              {[
                { href: `/${tenant.slug}`, label: 'الرئيسية' },
                { href: `/${tenant.slug}/projects`, label: sc.portfolioLabel, active: true },
                { href: `/${tenant.slug}/contact`, label: 'التواصل' },
              ].map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 text-xs tracking-widest uppercase transition-colors ${l.active ? 'text-[#8b6914]' : 'text-[#2c1a0e]/60 hover:text-[#8b6914]'}`}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <header className="border-b-2 border-[#2c1a0e]/20 px-8 py-6 text-center">
        <h1 className="text-4xl font-black text-[#2c1a0e]">{sc.portfolioLabel}</h1>
        <p className="text-[#2c1a0e]/40 text-sm mt-1">{projects.length} {sc.portfolioItemLabel}</p>
        <nav className="hidden md:flex justify-center gap-8 mt-4 text-xs text-[#2c1a0e]/60 tracking-widest uppercase">
          <Link href={`/${tenant.slug}`} className="hover:text-[#8b6914]">الرئيسية</Link>
          <span className="text-[#8b6914]">{sc.portfolioLabel}</span>
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

        <div className="space-y-8">
          {filtered.map((p, i) => (
            <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
              className={`group flex gap-6 items-start ${i % 2 === 1 ? 'flex-row-reverse' : ''}`}>
              <div className="relative w-1/2 aspect-[4/3] flex-shrink-0 overflow-hidden border border-[#2c1a0e]/10">
                {p.cover_image_url
                  ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  : <div className="w-full h-full bg-[#2c1a0e]/5 flex items-center justify-center text-[#2c1a0e]/20 text-sm">لا توجد صورة</div>
                }
                {sc.extraFields.status && p.status && (
                  <div className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] font-bold ${
                    p.status === 'متاح' ? 'bg-green-600 text-white' :
                    p.status === 'مباع' ? 'bg-red-600 text-white' :
                    'bg-yellow-600 text-black'
                  }`}>{p.status}</div>
                )}
              </div>
              <div className="flex-1 py-4">
                {p.category && <p className="text-[#8b6914] text-xs tracking-widest uppercase mb-2">{p.category}</p>}
                <h3 className="text-2xl font-black text-[#2c1a0e] mb-3 leading-tight">{p.title_ar}</h3>
                {p.description_ar && <p className="text-[#2c1a0e]/60 text-sm leading-relaxed line-clamp-3">{p.description_ar}</p>}

                {(sc.extraFields.price || sc.extraFields.area || sc.extraFields.bedrooms) && (
                  <div className="flex flex-wrap gap-4 mt-3 text-[#2c1a0e]/50 text-xs">
                    {sc.extraFields.price && p.price && (
                      <span className="text-[#8b6914] font-bold text-sm">{p.price}</span>
                    )}
                    {sc.extraFields.area && p.area && (
                      <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" />{p.area}</span>
                    )}
                    {sc.extraFields.bedrooms && p.bedrooms && (
                      <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{p.bedrooms} غرف</span>
                    )}
                    {sc.extraFields.bedrooms && p.bathrooms && (
                      <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms} حمام</span>
                    )}
                  </div>
                )}

                <div className="flex gap-4 mt-3 text-xs text-[#2c1a0e]/40">
                  {p.year && <span>{p.year}</span>}
                  {p.location_ar && <span>{p.location_ar}</span>}
                </div>
                <p className="text-[#8b6914] text-xs tracking-widest uppercase mt-4 group-hover:underline">عرض التفاصيل ←</p>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[#2c1a0e]/30 py-16">لا توجد {sc.portfolioItemLabelPlural} في هذه الفئة</p>
        )}
      </div>

      <footer className="border-t-2 border-double border-[#2c1a0e] px-8 py-6 text-center text-xs text-[#2c1a0e]/40 tracking-widest">
        {tenant.name_ar} &mdash; {new Date().getFullYear()}
      </footer>

      <SocialFloat
        whatsapp={waPhone}
        snapchat_url={tenant.snapchat_url}
        tiktok_url={tenant.tiktok_url}
        whatsapp_note={tenant.whatsapp_note}
      />
    </div>
  )
}

