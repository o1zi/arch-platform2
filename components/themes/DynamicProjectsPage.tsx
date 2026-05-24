'use client'

import { Tenant, Project, CustomThemeConfig } from '@/types'
import { SectorConfig, getSectorConfig } from '@/lib/sectors'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

interface Props {
  tenant: Tenant
  projects: Project[]
  config: CustomThemeConfig
  sectorConfig?: SectorConfig
}

function buildCSSVars(config: CustomThemeConfig): React.CSSProperties {
  return {
    '--c-primary':    config.colors.primary,
    '--c-secondary':  config.colors.secondary,
    '--c-accent':     config.colors.accent,
    '--c-bg':         config.colors.background,
    '--c-text':       config.colors.text,
    '--c-text-light': config.colors.textLight,
    '--font-heading': `'${config.fonts.heading}', serif`,
    '--font-body':    `'${config.fonts.body}', sans-serif`,
  } as React.CSSProperties
}

function borderRadiusClass(br: CustomThemeConfig['layout']['borderRadius']) {
  return { none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' }[br]
}

function gridColsClass(cols: number) {
  return {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[cols] ?? 'grid-cols-1 sm:grid-cols-3'
}

export default function DynamicProjectsPage({ tenant, projects, config, sectorConfig }: Props) {
  const sc = sectorConfig ?? getSectorConfig(tenant.sector)
  const [activeCategory, setActiveCategory] = useState('الكل')
  const br = borderRadiusClass(config.layout.borderRadius)
  const cols = config.projectsGrid.columns
  const style = config.projectsGrid.style

  const usedCategories = ['الكل', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean) as string[]))]

  const filtered = activeCategory === 'الكل'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <div dir="rtl" style={{ ...buildCSSVars(config), fontFamily: 'var(--font-body)', backgroundColor: 'var(--c-bg)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(config.fonts.heading)}:wght@400;700;900&family=${encodeURIComponent(config.fonts.body)}:wght@300;400;500;700&display=swap');
      `}</style>

      {/* Nav */}
      <nav style={{ backgroundColor: 'var(--c-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo_url && (
              <Image src={tenant.logo_url} alt="" width={32} height={32} className={`object-cover ${br}`} />
            )}
            <span className="font-bold" style={{ color: 'var(--c-bg)' }}>{tenant.name_ar}</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href={`/${tenant.slug}`} style={{ color: 'var(--c-bg)' }} className="opacity-70 hover:opacity-100 transition-opacity">الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} style={{ color: 'var(--c-bg)' }} className="font-bold">{sc.portfolioLabel}</Link>
            <Link href={`/${tenant.slug}/contact`} className={`px-4 py-1.5 font-medium ${br}`}
              style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }}>
              تواصل
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="py-16 px-6" style={{ backgroundColor: 'var(--c-primary)' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--c-accent)' }}>{sc.featuredLabel}</p>
          <h1 className="text-5xl font-black" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-bg)' }}>
            {sc.portfolioLabel}
          </h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--c-text-light)' }}>
            {projects.length} {sc.portfolioItemLabel} منجز
          </p>
        </div>
      </div>

      {/* Filters */}
      {usedCategories.length > 1 && (
        <div className="px-6 py-6 border-b" style={{ backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-secondary)' }}>
          <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
            {usedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${br}`}
                style={
                  activeCategory === cat
                    ? { backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }
                    : { backgroundColor: 'var(--c-secondary)', color: 'var(--c-text-light)' }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24" style={{ color: 'var(--c-text-light)' }}>
            <p className="text-xl">لا توجد {sc.portfolioItemLabelPlural} في هذا التصنيف</p>
          </div>
        ) : style === 'list' ? (
          <div className="space-y-4">
            {filtered.map(p => (
              <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
                className={`flex gap-4 overflow-hidden group ${br}`}
                style={{ backgroundColor: 'var(--c-secondary)' }}>
                {p.cover_image_url && (
                  <div className="relative w-40 h-28 flex-shrink-0">
                    <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-4 flex flex-col justify-center">
                  <p className="font-bold text-lg" style={{ color: 'var(--c-text)' }}>{p.title_ar}</p>
                  <div className="flex gap-3 mt-1 flex-wrap">
                    {p.category && <span className="text-xs" style={{ color: 'var(--c-accent)' }}>{p.category}</span>}
                    {p.year && <span className="text-xs" style={{ color: 'var(--c-text-light)' }}>{p.year}</span>}
                    {p.location_ar && <span className="text-xs" style={{ color: 'var(--c-text-light)' }}>{p.location_ar}</span>}
                  </div>
                  {p.description_ar && (
                    <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--c-text-light)' }}>{p.description_ar}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={`grid ${gridColsClass(cols)} gap-4`}>
            {filtered.map(p => (
              <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
                className={`group relative overflow-hidden aspect-square ${br}`}
                style={{ backgroundColor: 'var(--c-secondary)' }}>
                {p.cover_image_url ? (
                  <Image src={p.cover_image_url} alt={p.title_ar} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-black opacity-20" style={{ color: 'var(--c-text)' }}>
                      {p.title_ar.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 flex items-end p-4
                  bg-black/0 group-hover:bg-black/50 transition-colors duration-300">
                  <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-bold text-white">{p.title_ar}</p>
                    <div className="flex gap-2 mt-1">
                      {p.category && <span className="text-xs text-white/70">{p.category}</span>}
                      {p.year && <span className="text-xs text-white/50">{p.year}</span>}
                    </div>
                  </div>
                </div>
                {p.is_featured && (
                  <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 ${br}`}
                    style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }}>
                    مميز
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer strip */}
      <div className="py-8 px-6 border-t" style={{ backgroundColor: 'var(--c-primary)', borderColor: 'var(--c-secondary)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-sm" style={{ color: 'var(--c-text-light)' }}>{tenant.name_ar}</span>
          <Link href={`/${tenant.slug}`} className="flex items-center gap-1.5 text-sm transition-opacity hover:opacity-70"
            style={{ color: 'var(--c-text-light)' }}>
            <ArrowRight className="h-4 w-4" />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
