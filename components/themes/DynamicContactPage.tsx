'use client'

import { Tenant, CustomThemeConfig } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Phone, Mail, MapPin, Menu, X } from 'lucide-react'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'
import { trackEvent } from '@/lib/analytics-client'
import { getSectorConfig } from '@/lib/sectors'

interface Props {
  tenant: Tenant
  config: CustomThemeConfig
}

// ── CSS Variables ─────────────────────────────────────────────────────────────
function buildCSSVars(config: CustomThemeConfig): React.CSSProperties {
  const c = config.colors
  const f = config.fonts
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
  } as React.CSSProperties
}

function brClass(br: CustomThemeConfig['layout']['borderRadius']): string {
  return { none: 'rounded-none', sm: 'rounded', md: 'rounded-md', lg: 'rounded-xl', full: 'rounded-full' }[br] ?? 'rounded-md'
}

// ── WhatsApp Icon ─────────────────────────────────────────────────────────────
function WhatsAppIcon({ size = 5 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-${size} h-${size}`}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

// ── Contact Info Card ─────────────────────────────────────────────────────────
function ContactCard({
  icon, label, value, href, br, onClick,
}: {
  icon: React.ReactNode; label: string; value: string; href?: string; br: string; onClick?: () => void
}) {
  const inner = (
    <div
      className={`flex items-center gap-4 p-5 transition-all duration-200 group ${br}`}
      style={{ backgroundColor: 'var(--c-card-bg)', border: '1px solid var(--c-border)' }}
    >
      <div
        className={`w-12 h-12 flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${br}`}
        style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }}
      >
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--c-text-light)' }}>{label}</p>
        <p className="font-bold truncate" style={{ color: 'var(--c-text)' }}>{value}</p>
      </div>
    </div>
  )

  if (href) {
    return <a href={href} onClick={onClick} className="block hover:opacity-90 transition-opacity">{inner}</a>
  }
  return <div>{inner}</div>
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function DynamicContactPage({ tenant, config }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const br = brClass(config.layout.borderRadius)
  const sc = getSectorConfig(tenant.sector)
  const waPhone = tenant.whatsapp?.replace(/\D/g, '') || tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}${tenant.whatsapp_note ? `?text=${encodeURIComponent(tenant.whatsapp_note)}` : ''}` : null

  const socials = [
    { url: tenant.instagram_url, label: 'إنستقرام', color: '#E1306C' },
    { url: tenant.twitter_url, label: 'تويتر / X', color: '#000' },
    { url: tenant.linkedin_url, label: 'لينكدإن', color: '#0077B5' },
    { url: tenant.snapchat_url, label: 'سناب شات', color: '#FFFC00', textColor: '#000' },
    { url: tenant.tiktok_url, label: 'تيك توك', color: '#000' },
  ].filter(s => s.url)

  useEffect(() => {
    trackEvent(tenant.slug, 'contact_page_view')
  }, [tenant.slug])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
          backgroundColor: 'var(--c-nav-bg)',
          boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.15)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/${tenant.slug}`} className="flex items-center gap-3 group">
            {tenant.logo_url && (
              <Image
                src={tenant.logo_url}
                alt=""
                width={36}
                height={36}
                className={`object-cover transition-transform group-hover:scale-105 ${br}`}
              />
            )}
            <span
              className="font-bold hidden sm:block"
              style={{ color: 'var(--c-nav-text)', fontFamily: 'var(--font-heading)' }}
            >
              {tenant.name_ar}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <Link href={`/${tenant.slug}`} className="opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--c-nav-text)' }}>
              الرئيسية
            </Link>
            <Link href={`/${tenant.slug}/projects`} className="opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: 'var(--c-nav-text)' }}>
              {sc.portfolioLabel}
            </Link>
            <Link href={`/${tenant.slug}/contact`}
              className={`px-4 py-2 font-bold text-xs transition-opacity hover:opacity-90 ${br}`}
              style={{ backgroundColor: 'var(--c-accent)', color: '#fff' }}>
              تواصل معنا
            </Link>
          </div>

          {/* Mobile menu */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setDrawerOpen(true)}
            style={{ color: 'var(--c-nav-text)' }}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex" dir="rtl">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
          <aside className="relative mr-auto w-72 h-full flex flex-col shadow-2xl"
            style={{ backgroundColor: 'var(--c-nav-bg)' }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <span className="font-bold" style={{ color: 'var(--c-nav-text)', fontFamily: 'var(--font-heading)' }}>
                {tenant.name_ar}
              </span>
              <button onClick={() => setDrawerOpen(false)} style={{ color: 'var(--c-nav-text)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {[
                { href: `/${tenant.slug}`, label: 'الرئيسية' },
                { href: `/${tenant.slug}/projects`, label: sc.portfolioLabel },
                { href: `/${tenant.slug}/contact`, label: 'تواصل معنا' },
              ].map(item => (
                <Link key={item.href} href={item.href} onClick={() => setDrawerOpen(false)}
                  className="flex px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--c-nav-text)' }}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden" style={{ backgroundColor: 'var(--c-primary)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, var(--c-accent) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="flex items-center gap-2 text-xs mb-6 opacity-60" style={{ color: 'var(--c-nav-text)' }}>
            <Link href={`/${tenant.slug}`} className="hover:opacity-80">{tenant.name_ar}</Link>
            <span>/</span>
            <span>تواصل معنا</span>
          </div>
          <p className="text-xs font-bold tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--c-accent)' }}>
            Contact Us
          </p>
          <h1
            className="text-4xl md:text-6xl font-black leading-tight mb-4"
            style={{ color: 'var(--c-nav-text)', fontFamily: 'var(--font-heading)' }}
          >
            نسعد بتواصلك
          </h1>
          <p className="text-base opacity-60" style={{ color: 'var(--c-nav-text)' }}>
            فريقنا جاهز للإجابة على كل استفساراتك
          </p>
          <div className="mt-8 w-16 h-1 rounded-full" style={{ backgroundColor: 'var(--c-accent)' }} />
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-5 gap-12">

        {/* ── Contact Info (right 2 cols) ── */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2
              className="text-2xl font-black mb-6"
              style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}
            >
              معلومات التواصل
            </h2>
            <div className="space-y-3">
              {tenant.phone && (
                <ContactCard
                  icon={<Phone className="w-5 h-5" />}
                  label="رقم الجوال"
                  value={tenant.phone}
                  href={`tel:${tenant.phone}`}
                  br={br}
                  onClick={() => trackEvent(tenant.slug, 'phone_click', { source: 'contact_page' })}
                />
              )}
              {tenant.email && (
                <ContactCard
                  icon={<Mail className="w-5 h-5" />}
                  label="البريد الإلكتروني"
                  value={tenant.email}
                  href={`mailto:${tenant.email}`}
                  br={br}
                  onClick={() => trackEvent(tenant.slug, 'email_click', { source: 'contact_page' })}
                />
              )}
              {tenant.address_ar && (
                <ContactCard
                  icon={<MapPin className="w-5 h-5" />}
                  label="العنوان"
                  value={tenant.address_ar}
                  br={br}
                />
              )}
            </div>
          </div>

          {/* WhatsApp CTA */}
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent(tenant.slug, 'whatsapp_click', { source: 'contact_page' })}
              className={`flex items-center justify-center gap-3 py-4 font-bold w-full text-base transition-all hover:opacity-90 hover:shadow-xl hover:shadow-green-500/20 ${br}`}
              style={{ backgroundColor: '#25D366', color: '#ffffff' }}
            >
              <WhatsAppIcon size={5} />
              تواصل عبر واتساب
            </a>
          )}

          {/* Socials */}
          {socials.length > 0 && (
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--c-text-light)' }}>
                تابعنا على
              </p>
              <div className="flex flex-wrap gap-2">
                {socials.map(s => (
                  <a
                    key={s.label}
                    href={s.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent(tenant.slug, 'social_click', { platform: s.label, source: 'contact_page' })}
                    className={`px-4 py-2 text-sm font-bold transition-all hover:opacity-90 hover:scale-105 ${br}`}
                    style={{
                      backgroundColor: s.color,
                      color: s.textColor ?? '#fff',
                    }}
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {tenant.bio_ar && (
            <div className={`p-5 ${br}`} style={{ backgroundColor: 'var(--c-card-bg)', border: '1px solid var(--c-border)' }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--c-accent)' }}>
                عن المكتب
              </p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text-light)' }}>
                {tenant.bio_ar}
              </p>
            </div>
          )}
        </div>

        {/* ── Map + Cover (left 3 cols) ── */}
        <div className="lg:col-span-3 space-y-6">
          {tenant.google_maps_url ? (
            <div className={`overflow-hidden shadow-xl ${br}`} style={{ height: '420px' }}>
              <iframe
                src={tenant.google_maps_url}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                onClick={() => trackEvent(tenant.slug, 'maps_click', { source: 'contact_page' })}
              />
            </div>
          ) : tenant.cover_url ? (
            <div className={`relative overflow-hidden shadow-xl ${br}`} style={{ height: '420px' }}>
              <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.4) 100%)' }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                  {tenant.name_ar}
                </p>
              </div>
            </div>
          ) : (
            <div
              className={`flex items-center justify-center shadow-inner ${br}`}
              style={{ height: '420px', backgroundColor: 'var(--c-card-bg)', border: '1px solid var(--c-border)' }}
            >
              {tenant.logo_url ? (
                <Image src={tenant.logo_url} alt={tenant.name_ar} width={120} height={120} className={`object-cover opacity-30 ${br}`} />
              ) : (
                <span className="text-8xl font-black opacity-10" style={{ color: 'var(--c-text)', fontFamily: 'var(--font-heading)' }}>
                  {tenant.name_ar.charAt(0)}
                </span>
              )}
            </div>
          )}

          {/* Quick contact info strip */}
          {(tenant.phone || tenant.email) && (
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-5 ${br}`}
              style={{ backgroundColor: 'var(--c-primary)' }}>
              <div>
                <p className="text-xs opacity-50 mb-1" style={{ color: 'var(--c-nav-text)' }}>للتواصل المباشر</p>
                {tenant.phone && (
                  <a
                    href={`tel:${tenant.phone}`}
                    dir="ltr"
                    className="font-bold text-lg hover:opacity-80 transition-opacity block"
                    style={{ color: 'var(--c-accent)', fontFamily: 'var(--font-heading)' }}
                    onClick={() => trackEvent(tenant.slug, 'phone_click', { source: 'contact_strip' })}
                  >
                    {tenant.phone}
                  </a>
                )}
              </div>
              {tenant.address_ar && (
                <div>
                  <p className="text-xs opacity-50 mb-1" style={{ color: 'var(--c-nav-text)' }}>الموقع</p>
                  <p className="font-medium text-sm" style={{ color: 'var(--c-nav-text)' }}>{tenant.address_ar}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t" style={{ backgroundColor: 'var(--c-primary)', borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {tenant.logo_url && (
                <Image src={tenant.logo_url} alt="" width={32} height={32} className={`object-cover ${br}`} />
              )}
              <span className="font-bold" style={{ color: 'var(--c-nav-text)', fontFamily: 'var(--font-heading)' }}>
                {tenant.name_ar}
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs opacity-50" style={{ color: 'var(--c-nav-text)' }}>
              <Link href={`/${tenant.slug}`} className="hover:opacity-80 transition-opacity">الرئيسية</Link>
              <Link href={`/${tenant.slug}/projects`} className="hover:opacity-80 transition-opacity">{sc.portfolioLabel}</Link>
              <span>تواصل معنا</span>
            </div>
            <p className="text-xs opacity-30" style={{ color: 'var(--c-nav-text)' }}>
              © {new Date().getFullYear()} {tenant.name_ar}
            </p>
          </div>
        </div>
      </footer>

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
