'use client'

import { Tenant, Project } from '@/types'
import { SectorConfig, getSectorConfig } from '@/lib/sectors'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BedDouble, Maximize2, Menu, X } from 'lucide-react'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

const COSMOS_VOID = '#05050f'
const COSMOS_SURFACE = '#0a0a1a'
const COSMOS_ACCENT = '#b388ff'
const COSMOS_ACCENT2 = '#e040fb'
const COSMOS_STAR = '#e8e0f0'

export default function NebulaProjectsPage({
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
  const waPhone = tenant.whatsapp?.replace(/\D/g, '') || tenant.phone?.replace(/\D/g, '')
  const filtered = active === 'الكل' ? projects : projects.filter(p => p.category === active)

  const navLinks = [
    { href: `/${tenant.slug}`, label: 'الرئيسية' },
    { href: `/${tenant.slug}/projects`, label: sc.portfolioLabel, active: true },
    { href: `/${tenant.slug}/contact`, label: 'تواصل' },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: COSMOS_VOID, color: COSMOS_STAR }} dir="rtl">

      {/* ═══════ STARFIELD ═══════ */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(1px 1px at 10% 15%, ${COSMOS_STAR}15, transparent),
            radial-gradient(1.5px 1.5px at 40% 30%, ${COSMOS_STAR}12, transparent),
            radial-gradient(1px 1px at 25% 55%, ${COSMOS_STAR}18, transparent),
            radial-gradient(1.5px 1.5px at 60% 20%, ${COSMOS_STAR}10, transparent),
            radial-gradient(1px 1px at 75% 65%, ${COSMOS_STAR}15, transparent),
            radial-gradient(1.5px 1.5px at 85% 40%, ${COSMOS_STAR}12, transparent),
            radial-gradient(1px 1px at 15% 80%, ${COSMOS_STAR}18, transparent),
            radial-gradient(1.5px 1.5px at 50% 85%, ${COSMOS_STAR}10, transparent),
            radial-gradient(600px 600px at 30% 20%, ${COSMOS_ACCENT}04, transparent),
            radial-gradient(400px 400px at 80% 70%, ${COSMOS_ACCENT2}03, transparent)`
        }} />
      </div>

      <div className="relative z-10">

        {/* ═══════ NAV ═══════ */}
        <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: `${COSMOS_VOID}ee`, borderColor: `${COSMOS_STAR}05`, backdropFilter: 'blur(20px)' }}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href={`/${tenant.slug}`} className="font-bold text-lg tracking-tighter">
              <span style={{ background: `linear-gradient(135deg, ${COSMOS_STAR}, ${COSMOS_ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {tenant.name_ar}
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href}
                  className={`px-5 py-2 text-xs font-bold tracking-widest rounded-full transition-all ${
                    l.active ? '' : ''
                  }`}
                  style={l.active ? {
                    backgroundColor: `${COSMOS_ACCENT}15`,
                    color: COSMOS_ACCENT,
                  } : {
                    color: `${COSMOS_STAR}30`,
                  }}>
                  {l.label}
                </Link>
              ))}
            </div>
            <button className="md:hidden" onClick={() => setMenuOpen(true)} style={{ color: `${COSMOS_STAR}50` }}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>

        {/* ═══════ MOBILE DRAWER ═══════ */}
        {menuOpen && (
          <div className="fixed inset-0 z-[100] md:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} />
            <div className="absolute top-0 right-0 bottom-0 w-72 flex flex-col"
              style={{ backgroundColor: COSMOS_SURFACE, borderLeft: `1px solid ${COSMOS_STAR}05` }}>
              <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: `${COSMOS_STAR}05` }}>
                <span className="font-bold text-sm">{tenant.name_ar}</span>
                <button onClick={() => setMenuOpen(false)} style={{ color: `${COSMOS_STAR}30` }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="p-4 flex flex-col gap-2">
                {navLinks.map(l => (
                  <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 text-sm font-bold rounded-xl transition-all"
                    style={l.active ? {
                      backgroundColor: `${COSMOS_ACCENT}15`,
                      color: COSMOS_ACCENT,
                    } : {
                      color: `${COSMOS_STAR}30`,
                    }}>
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* ═══════ HEADER ═══════ */}
        <div className="px-6 py-16 border-b" style={{ borderColor: `${COSMOS_STAR}05` }}>
          <h1 className="text-5xl md:text-8xl font-black leading-none mb-4"
            style={{ background: `linear-gradient(135deg, ${COSMOS_STAR}, ${COSMOS_ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {sc.portfolioLabel}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: COSMOS_ACCENT }} />
            <span style={{ color: `${COSMOS_STAR}25` }} className="text-sm font-bold">{projects.length} {sc.portfolioItemLabel}</span>
          </div>
        </div>

        {/* ═══════ FILTERS ═══════ */}
        {categories.length > 1 && (
          <div className="flex gap-2 px-6 py-6 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className="px-5 py-2.5 text-xs font-bold tracking-widest rounded-full transition-all"
                style={active === cat ? {
                  backgroundColor: `${COSMOS_ACCENT}18`,
                  color: COSMOS_ACCENT,
                  border: `1px solid ${COSMOS_ACCENT}25`,
                } : {
                  color: `${COSMOS_STAR}25`,
                  border: `1px solid ${COSMOS_STAR}05`,
                }}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ═══════ PROJECTS GRID ═══════ */}
        <div className="px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
                className="group block rounded-2xl overflow-hidden relative transition-all duration-500 hover:scale-[1.02]"
                style={{ aspectRatio: '4/3', border: `1px solid ${COSMOS_STAR}05`, backgroundColor: COSMOS_SURFACE }}>
                {p.cover_image_url ? (
                  <Image src={p.cover_image_url} alt={p.title_ar} fill
                    className="object-cover transition-all duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${COSMOS_ACCENT}04` }}>
                    <span className="text-5xl font-black" style={{ color: COSMOS_ACCENT, opacity: 0.15 }}>{p.title_ar.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 opacity-0"
                  style={{ background: `linear-gradient(to top, ${COSMOS_VOID}ee, transparent 40%)` }} />
                <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 opacity-0"
                  style={{ boxShadow: `inset 0 0 80px ${COSMOS_ACCENT}12` }} />

                {/* status badge */}
                {sc.extraFields.status && p.status && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold z-10"
                    style={p.status === 'متاح' ? { backgroundColor: '#22c55e20', color: '#22c55e' } :
                      p.status === 'مباع' ? { backgroundColor: '#ef444420', color: '#ef4444' } :
                      { backgroundColor: '#eab30820', color: '#eab308' }}>
                    {p.status}
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {p.category && (
                    <span className="text-[10px] font-bold tracking-widest mb-2 block" style={{ color: COSMOS_ACCENT }}>{p.category}</span>
                  )}
                  <h3 className="font-bold text-sm leading-tight mb-2">{p.title_ar}</h3>
                  <div className="flex flex-wrap gap-3 text-xs" style={{ color: `${COSMOS_STAR}30` }}>
                    {sc.extraFields.price && p.price && <span className="font-bold" style={{ color: COSMOS_ACCENT }}>{p.price}</span>}
                    {sc.extraFields.area && p.area && <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" />{p.area}</span>}
                    {sc.extraFields.bedrooms && p.bedrooms && <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" />{p.bedrooms}</span>}
                    {p.year && <span>{p.year}</span>}
                    {p.location_ar && <span>{p.location_ar}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p style={{ color: `${COSMOS_STAR}15` }} className="text-xl font-bold">لا توجد {sc.portfolioItemLabelPlural} في هذه الفئة</p>
            </div>
          )}
        </div>

        <SocialFloat
          whatsapp={waPhone}
          snapchat_url={tenant.snapchat_url}
          tiktok_url={tenant.tiktok_url}
          whatsapp_note={tenant.whatsapp_note}
        />
      </div>
    </div>
  )
}
