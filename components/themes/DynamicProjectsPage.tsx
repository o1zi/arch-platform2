'use client'

import { Tenant, Project, CustomThemeConfig } from '@/types'
import { SectorConfig, getSectorConfig } from '@/lib/sectors'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Menu, X, MapPin, Calendar, ArrowLeft, Search } from 'lucide-react'
import { trackEvent } from '@/lib/analytics-client'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

interface Props {
  tenant: Tenant
  projects: Project[]
  config: CustomThemeConfig
  sectorConfig?: SectorConfig
}

// ── CSS Variables ─────────────────────────────────────────────────────────────
function buildCSSVars(config: CustomThemeConfig): React.CSSProperties {
  const c = config.colors
  const f = config.fonts
  const lsMap: Record<string, string> = { tight: '-0.02em', normal: '0', wide: '0.05em', wider: '0.1em' }
  const lhMap: Record<string, string> = { tight: '1.2', normal: '1.5', relaxed: '1.7', loose: '2' }
  const bsMap: Record<string, string> = { sm: '0.875rem', md: '1rem', lg: '1.125rem' }

  return {
    '--c-primary':    c.primary,
    '--c-secondary':  c.secondary,
    '--c-accent':     c.accent,
    '--c-accent2':    c.accentSecondary ?? c.accent,
    '--c-bg':         c.background,
    '--c-text':       c.text,
    '--c-text-light': c.textLight,
    '--c-card-bg':    c.cardBg ?? c.secondary,
    '--c-border':     c.border ?? `${c.primary}22`,
    '--c-nav-bg':     c.navBg ?? c.primary,
    '--c-nav-text':   c.navText ?? c.background,
    '--font-heading': `'${f.heading}', serif`,
    '--font-body':    `'${f.body}', sans-serif`,
    '--font-hw':      String(f.headingWeight ?? 700),
    '--font-bw':      String(f.bodyWeight ?? 400),
    '--font-bs':      bsMap[f.bodySize ?? 'md'],
    '--letter-sp':    lsMap[f.letterSpacing ?? 'normal'],
    '--line-h':       lhMap[f.lineHeight ?? 'relaxed'],
  } as React.CSSProperties
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function brClass(br: CustomThemeConfig['layout']['borderRadius']): string {
  return { none: 'rounded-none', sm: 'rounded', md: 'rounded-md', lg: 'rounded-xl', full: 'rounded-full' }[br] ?? 'rounded-md'
}
function maxWClass(mw: CustomThemeConfig['layout']['maxWidth']): string {
  return { narrow: 'max-w-4xl', normal: 'max-w-7xl', wide: 'max-w-screen-2xl', full: 'w-full px-4' }[mw ?? 'normal'] ?? 'max-w-7xl'
}
function gridColsClass(cols: number): string {
  return ({ 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' } as Record<number, string>)[cols] ?? 'grid-cols-1 sm:grid-cols-3'
}
function imageRatioClass(r: string | undefined): string {
  return ({ square: 'aspect-square', '4/3': 'aspect-[4/3]', '16/9': 'aspect-video', '3/4': 'aspect-[3/4]', dynamic: 'aspect-[4/3]' } as Record<string, string>)[r ?? '4/3'] ?? 'aspect-[4/3]'
}

// ── WhatsApp Icon ─────────────────────────────────────────────────────────────
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// ── Mobile Drawer ─────────────────────────────────────────────────────────────
function MobileDrawer({
  open, onClose, tenant, sc, waUrl, br,
}: {
  open: boolean; onClose: () => void
  tenant: Tenant; sc: SectorConfig; waUrl: string | null; br: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative mr-auto w-72 h-full flex flex-col shadow-2xl"
        style={{ backgroundColor: 'var(--c-nav-bg)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            {tenant.logo_url && (
              <Image src={tenant.logo_url} alt="" width={36} height={36} className={`object-cover ${br}`} />
            )}
            <span className="font-bold text-sm" style={{ color: 'var(--c-nav-text)', fontFamily: 'var(--font-heading)' }}>
              {tenant.name_ar}
            </span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--c-nav-text)' }}>
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* Links */}
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: `/${tenant.slug}`, label: 'الرئيسية' },
            { href: `/${tenant.slug}/projects`, label: sc.portfolioLabel },
            { href: `/${tenant.slug}/contact`, label: 'تواصل معنا' },
          ].map(item => (
            <Link key={item.href} href={item.href} onClick={onClose}
              className="flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-white/10"
              style={{ color: 'var(--c-nav-text)' }}>
              {item.label}
            </Link>
          ))}
        </nav>
        {/* CTA */}
        {waUrl && (
          <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 w-full py-3 font-bold text-sm transition-opacity hover:opacity-90 ${br}`}
              style={{ backgroundColor: '#25d366', color: '#fff' }}>
              <WhatsAppIcon />
              واتساب
            </a>
          </div>
        )}
      </aside>
    </div>
  )
}

// ── Project Card (Grid) ───────────────────────────────────────────────────────
function ProjectCardGrid({
  project, tenant, br, imageRatio, hoverEffect, cardStyle,
}: {
  project: Project; tenant: Tenant
  br: string; imageRatio: string; hoverEffect: string; cardStyle: string
}) {
  const cardSx: React.CSSProperties =
    cardStyle === 'elevated'
      ? { backgroundColor: 'var(--c-card-bg)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }
      : cardStyle === 'bordered'
      ? { backgroundColor: 'var(--c-card-bg)', border: '1px solid var(--c-border)' }
      : { backgroundColor: 'var(--c-card-bg)' }

  return (
    <Link href={`/${tenant.slug}/projects/${project.id}`}
      className={`group overflow-hidden block ${br}`}
      style={cardSx}>
      {/* Image */}
      <div className={`relative overflow-hidden ${imageRatio}`}
        style={{ backgroundColor: 'var(--c-secondary)' }}>
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title_ar}
            fill
            className={`object-cover transition-transform duration-700 ${hoverEffect === 'zoom' ? 'group-hover:scale-110' : ''}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-black opacity-10" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-heading)' }}>
              {project.title_ar.charAt(0)}
            </span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-end"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }}>
          <div className="p-4 w-full">
            <p className="text-white font-bold text-sm line-clamp-1">{project.title_ar}</p>
            <div className="flex items-center gap-2 mt-1">
              {project.category && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--c-accent)', color: '#fff' }}>
                  {project.category}
                </span>
              )}
              {project.year && (
                <span className="text-xs text-white/70">{project.year}</span>
              )}
            </div>
          </div>
        </div>

        {/* Featured badge */}
        {project.is_featured && (
          <div className="absolute top-2 right-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--c-accent)', color: '#fff' }}>
              مميز
            </span>
          </div>
        )}
      </div>

      {/* Info below image */}
      <div className="p-4">
        <h3 className="font-bold text-base line-clamp-1 mb-1" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-heading)' }}>
          {project.title_ar}
        </h3>
        <div className="flex items-center gap-3 flex-wrap">
          {project.category && (
            <span className="text-xs font-medium" style={{ color: 'var(--c-accent)' }}>
              {project.category}
            </span>
          )}
          {project.location_ar && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--c-text-light)' }}>
              <MapPin className="w-3 h-3" />{project.location_ar}
            </span>
          )}
          {project.year && (
            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--c-text-light)' }}>
              <Calendar className="w-3 h-3" />{project.year}
            </span>
          )}
        </div>
        {project.description_ar && (
          <p className="text-sm mt-2 line-clamp-2" style={{ color: 'var(--c-text-light)', lineHeight: 'var(--line-h)' }}>
            {project.description_ar}
          </p>
        )}
      </div>
    </Link>
  )
}

// ── Project Card (List) ───────────────────────────────────────────────────────
function ProjectCardList({ project, tenant, br }: { project: Project; tenant: Tenant; br: string }) {
  return (
    <Link href={`/${tenant.slug}/projects/${project.id}`}
      className={`group flex gap-0 overflow-hidden transition-shadow hover:shadow-lg ${br}`}
      style={{ backgroundColor: 'var(--c-card-bg)', border: '1px solid var(--c-border)' }}>
      {/* Thumbnail */}
      <div className="relative w-36 sm:w-52 flex-shrink-0 overflow-hidden" style={{ backgroundColor: 'var(--c-secondary)' }}>
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title_ar}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-black opacity-10" style={{ color: 'var(--c-text)' }}>
              {project.title_ar.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg line-clamp-1" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-heading)' }}>
              {project.title_ar}
            </h3>
            {project.is_featured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                style={{ backgroundColor: 'var(--c-accent)', color: '#fff' }}>
                مميز
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-3 mb-3">
            {project.category && (
              <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ color: 'var(--c-accent)', border: '1px solid var(--c-accent)', backgroundColor: 'transparent' }}>
                {project.category}
              </span>
            )}
            {project.location_ar && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--c-text-light)' }}>
                <MapPin className="w-3 h-3" />{project.location_ar}
              </span>
            )}
            {project.year && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--c-text-light)' }}>
                <Calendar className="w-3 h-3" />{project.year}
              </span>
            )}
          </div>
          {project.description_ar && (
            <p className="text-sm line-clamp-2" style={{ color: 'var(--c-text-light)' }}>
              {project.description_ar}
            </p>
          )}
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-sm font-medium transition-opacity opacity-60 group-hover:opacity-100"
          style={{ color: 'var(--c-accent)' }}>
          عرض التفاصيل <ArrowLeft className="w-4 h-4" />
        </div>
      </div>
    </Link>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DynamicProjectsPage({ tenant, projects, config, sectorConfig }: Props) {
  const sc = sectorConfig ?? getSectorConfig(tenant.sector)
  const [activeCategory, setActiveCategory] = useState('الكل')
  const [search, setSearch] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const br      = brClass(config.layout.borderRadius)
  const maxW    = maxWClass(config.layout.maxWidth)
  const cols    = config.projectsGrid?.columns ?? 3
  const style   = config.projectsGrid?.style ?? 'grid'
  const imgRatio = imageRatioClass(config.projectsGrid?.imageRatio)
  const cardStyle = config.cards?.style ?? 'elevated'
  const hoverEffect = config.projectsGrid?.hoverEffect ?? 'zoom'

  const waPhone = tenant.whatsapp?.replace(/\D/g, '') || tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null

  // Analytics tracking
  useEffect(() => {
    trackEvent(tenant.slug, 'page_view', { page: 'projects' })
  }, [tenant.slug])

  // Sticky nav scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Category filter
  const usedCategories = ['الكل', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean) as string[]))]

  // Search + category filter
  const filtered = projects.filter(p => {
    const matchCat = activeCategory === 'الكل' || p.category === activeCategory
    const matchSearch = !search.trim() || p.title_ar.includes(search) || (p.description_ar ?? '').includes(search)
    return matchCat && matchSearch
  })

  const cssVars = buildCSSVars(config)

  return (
    <div dir="rtl" style={{ ...cssVars, fontFamily: 'var(--font-body)', backgroundColor: 'var(--c-bg)', color: 'var(--c-text)' }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(config.fonts.heading)}:wght@400;600;700;900&family=${encodeURIComponent(config.fonts.body)}:wght@300;400;500;700&display=swap');
      `}</style>

      {/* ── Sticky Nav ── */}
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'var(--c-nav-bg)' : 'var(--c-nav-bg)',
          boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.15)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}
      >
        <div className={`${maxW} mx-auto px-6 h-16 flex items-center justify-between`}>
          {/* Logo + Name */}
          <Link href={`/${tenant.slug}`} className="flex items-center gap-3 group">
            {tenant.logo_url && (
              <Image
                src={tenant.logo_url}
                alt=""
                width={36}
                height={36}
                className={`object-cover transition-transform duration-300 group-hover:scale-105 ${br}`}
              />
            )}
            <span
              className="font-bold text-base hidden sm:block"
              style={{ color: 'var(--c-nav-text)', fontFamily: 'var(--font-heading)', letterSpacing: 'var(--letter-sp)' }}
            >
              {tenant.name_ar}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link href={`/${tenant.slug}`}
              className="transition-opacity opacity-60 hover:opacity-100"
              style={{ color: 'var(--c-nav-text)' }}>
              الرئيسية
            </Link>
            <Link href={`/${tenant.slug}/projects`}
              className="font-bold border-b-2 pb-0.5"
              style={{ color: 'var(--c-nav-text)', borderColor: 'var(--c-accent)' }}>
              {sc.portfolioLabel}
            </Link>
            <Link href={`/${tenant.slug}/contact`}
              className="opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--c-nav-text)' }}>
              تواصل معنا
            </Link>
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent(tenant.slug, 'whatsapp_click', { button: 'nav' })}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-opacity hover:opacity-90 ${br}`}
                style={{ backgroundColor: '#25d366', color: '#fff' }}
              >
                <WhatsAppIcon />
                واتساب
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg transition-colors hover:bg-white/10"
            onClick={() => setDrawerOpen(true)}
            style={{ color: 'var(--c-nav-text)' }}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        tenant={tenant}
        sc={sc}
        waUrl={waUrl}
        br={br}
      />

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden" style={{ backgroundColor: 'var(--c-primary)' }}>
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, var(--c-accent) 0%, transparent 60%), radial-gradient(circle at 80% 50%, var(--c-accent2) 0%, transparent 60%)' }} />
        <div className={`${maxW} mx-auto px-6 py-20 relative`}>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs mb-6 opacity-60" style={{ color: 'var(--c-nav-text)' }}>
            <Link href={`/${tenant.slug}`} className="hover:opacity-80 transition-opacity">{tenant.name_ar}</Link>
            <span>/</span>
            <span>{sc.portfolioLabel}</span>
          </div>

          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--c-accent)' }}>
            {sc.featuredLabel}
          </p>
          <h1
            className="text-4xl md:text-6xl font-black mb-4 leading-tight"
            style={{ color: 'var(--c-nav-text)', fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-hw)' as unknown as number }}
          >
            {sc.portfolioLabel}
          </h1>
          <p className="text-base opacity-60" style={{ color: 'var(--c-nav-text)' }}>
            {projects.length} {sc.portfolioItemLabel} منجز بخبرة واحترافية عالية
          </p>

          {/* Decorative line */}
          <div className="mt-8 w-16 h-1 rounded-full" style={{ backgroundColor: 'var(--c-accent)' }} />
        </div>
      </div>

      {/* ── Filters + Search ── */}
      <div className="sticky top-16 z-40 border-b" style={{ backgroundColor: 'var(--c-bg)', borderColor: 'var(--c-border)' }}>
        <div className={`${maxW} mx-auto px-6 py-4`}>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            {/* Category pills */}
            {usedCategories.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {usedCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 ${br}`}
                    style={
                      activeCategory === cat
                        ? { backgroundColor: 'var(--c-accent)', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }
                        : { backgroundColor: 'var(--c-card-bg)', color: 'var(--c-text-light)', border: '1px solid var(--c-border)' }
                    }
                  >
                    {cat}
                    {cat !== 'الكل' && (
                      <span className="mr-1.5 text-xs opacity-60">
                        ({projects.filter(p => p.category === cat).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Search */}
            <div className="relative flex-shrink-0">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--c-text-light)' }} />
              <input
                type="text"
                placeholder={`ابحث في ${sc.portfolioLabel}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`pr-9 pl-4 py-1.5 text-sm w-52 focus:outline-none focus:ring-2 ${br}`}
                style={{
                  backgroundColor: 'var(--c-card-bg)',
                  color: 'var(--c-text)',
                  border: '1px solid var(--c-border)',
                  // @ts-expect-error css variable
                  '--tw-ring-color': 'var(--c-accent)',
                }}
              />
            </div>
          </div>

          {/* Results count */}
          <p className="text-xs mt-2" style={{ color: 'var(--c-text-light)' }}>
            {filtered.length === projects.length
              ? `عرض جميع الـ ${projects.length} ${sc.portfolioItemLabel}`
              : `${filtered.length} نتيجة من أصل ${projects.length}`
            }
          </p>
        </div>
      </div>

      {/* ── Projects ── */}
      <main className={`${maxW} mx-auto px-6 py-16`}>
        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-6xl mb-4 opacity-20" style={{ color: 'var(--c-text)' }}>🏗</div>
            <p className="text-xl font-bold mb-2" style={{ color: 'var(--c-text)' }}>
              لا توجد نتائج
            </p>
            <p className="text-sm" style={{ color: 'var(--c-text-light)' }}>
              جرب تصنيفاً آخر أو كلمة بحث مختلفة
            </p>
            <button
              onClick={() => { setActiveCategory('الكل'); setSearch('') }}
              className={`mt-6 px-6 py-2.5 text-sm font-bold transition-opacity hover:opacity-90 ${br}`}
              style={{ backgroundColor: 'var(--c-accent)', color: '#fff' }}
            >
              عرض الكل
            </button>
          </div>
        ) : style === 'list' ? (
          <div className="space-y-4">
            {filtered.map(p => (
              <ProjectCardList key={p.id} project={p} tenant={tenant} br={br} />
            ))}
          </div>
        ) : (
          <div className={`grid ${gridColsClass(cols)} gap-6`}>
            {filtered.map(p => (
              <ProjectCardGrid
                key={p.id}
                project={p}
                tenant={tenant}
                br={br}
                imageRatio={imgRatio}
                hoverEffect={hoverEffect}
                cardStyle={cardStyle}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t" style={{ backgroundColor: 'var(--c-primary)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className={`${maxW} mx-auto px-6 py-12`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              {tenant.logo_url && (
                <Image src={tenant.logo_url} alt="" width={40} height={40} className={`object-cover ${br}`} />
              )}
              <div>
                <p className="font-bold" style={{ color: 'var(--c-nav-text)', fontFamily: 'var(--font-heading)' }}>
                  {tenant.name_ar}
                </p>
                {tenant.bio_ar && (
                  <p className="text-xs mt-0.5 opacity-50 max-w-xs line-clamp-1" style={{ color: 'var(--c-nav-text)' }}>
                    {tenant.bio_ar}
                  </p>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link href={`/${tenant.slug}`} className="opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--c-nav-text)' }}>
                الرئيسية
              </Link>
              <Link href={`/${tenant.slug}/projects`} className="opacity-80 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--c-nav-text)' }}>
                {sc.portfolioLabel}
              </Link>
              <Link href={`/${tenant.slug}/contact`} className="opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--c-nav-text)' }}>
                تواصل
              </Link>
            </div>

            {/* CTA */}
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent(tenant.slug, 'whatsapp_click', { button: 'footer' })}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-opacity hover:opacity-90 ${br}`}
                style={{ backgroundColor: '#25d366', color: '#fff' }}
              >
                <WhatsAppIcon />
                تواصل عبر واتساب
              </a>
            )}
          </div>

          <div className="mt-8 pt-6 border-t flex items-center justify-between text-xs opacity-30"
            style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'var(--c-nav-text)' }}>
            <span>© {new Date().getFullYear()} {tenant.name_ar}</span>
            <span>جميع الحقوق محفوظة</span>
          </div>
        </div>
      </footer>

      {/* Social Float */}
      <SocialFloat
        whatsapp={tenant.whatsapp ?? tenant.phone}
        snapchat_url={tenant.snapchat_url}
        tiktok_url={tenant.tiktok_url}
        whatsapp_note={tenant.whatsapp_note}
        tenantSlug={tenant.slug}
      />
    </div>
  )
}
