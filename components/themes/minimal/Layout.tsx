'use client'

import { ThemeProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react'
import { resolveIcon } from '@/components/themes/iconMap'
import { getSectorConfig } from '@/lib/sectors'
import MobileMenu from '@/components/themes/shared/MobileMenu'
import { ScrollReveal, StaggerReveal } from '@/components/themes/shared/ScrollReveal'
import { StatsCounter, SECTOR_STATS } from '@/components/themes/shared/StatsCounter'
import { Testimonials, SECTOR_TESTIMONIALS } from '@/components/themes/shared/Testimonials'
import { FAQ, SECTOR_FAQ } from '@/components/themes/shared/FAQ'

// Minimal: أبيض + رمادي فاتح + أسود — نقاء وهدوء
const MIN_BG = '#ffffff'
const MIN_DARK = '#111111'
const MIN_GRAY = '#f5f5f5'
const MIN_LIGHT = '#888888'
const MIN_ACCENT = '#111111'

function WhatsAppFloat({ url }: { url: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
      style={{ backgroundColor: '#25d366' }}>
      <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  )
}

export default function MinimalLayout({ tenant, projects, featuredProjects, services: customServices, features: customFeatures, sectorConfig }: ThemeProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40)
      setShowTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const sc = sectorConfig ?? getSectorConfig(tenant.sector)
  const bio = tenant.bio_ar || sc.heroTagline
  const waPhone = tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null
  const stats = SECTOR_STATS[tenant.sector ?? 'general'] ?? SECTOR_STATS.general
  const testimonials = SECTOR_TESTIMONIALS[tenant.sector ?? 'general'] ?? SECTOR_TESTIMONIALS.general
  const faqs = SECTOR_FAQ[tenant.sector ?? 'general'] ?? SECTOR_FAQ.general
  const displayedProjects = featuredProjects.length > 0 ? featuredProjects.slice(0, 6) : projects.slice(0, 6)

  return (
    <div className="min-h-screen" style={{ backgroundColor: MIN_BG, color: MIN_DARK }} dir="rtl">

      {/* NAV — نظيف جداً */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b' : ''}`}
        style={{ backgroundColor: MIN_BG, borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {tenant.logo_url ? (
              <Image src={tenant.logo_url} alt="" width={32} height={32} className="object-contain" />
            ) : (
              <div className="w-8 h-8 border flex items-center justify-center text-sm font-black"
                style={{ borderColor: MIN_DARK, color: MIN_DARK }}>
                {tenant.name_ar.charAt(0)}
              </div>
            )}
            <span className="font-semibold text-sm tracking-wide" style={{ color: MIN_DARK }}>{tenant.name_ar}</span>
          </div>

          {/* Desktop Nav — خفيف وبسيط */}
          <div className="hidden md:flex items-center gap-10 text-sm" style={{ color: MIN_LIGHT }}>
            <Link href={`/${tenant.slug}`} className="transition-colors hover:text-black">الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} className="transition-colors hover:text-black">{sc.portfolioLabel}</Link>
            <Link href={`/${tenant.slug}/contact`} className="transition-colors hover:text-black">تواصل</Link>
            <Link href={`/${tenant.slug}/contact`}
              className="border px-5 py-2 text-sm transition-colors hover:bg-black hover:text-white hover:border-black"
              style={{ borderColor: MIN_DARK, color: MIN_DARK }}>
              استشارة
            </Link>
          </div>

          <MobileMenu
            tenantName={tenant.name_ar}
            tenantSlug={tenant.slug}
            logoUrl={tenant.logo_url}
            phone={tenant.phone}
            email={tenant.email}
            portfolioLabel={sc.portfolioLabel}
            accentColor={MIN_ACCENT}
            bgColor={MIN_BG}
            textColor={MIN_DARK}
            variant="light"
          />
        </div>
      </nav>

      {/* HERO — هادئ وعميق */}
      <section className="px-8 py-32" style={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <ScrollReveal animation="fade-right">
              <div>
                <p className="text-xs tracking-[0.5em] uppercase mb-8" style={{ color: MIN_LIGHT }}>{sc.label}</p>
                <h1 className="font-black leading-tight mb-6" style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', color: MIN_DARK }}>
                  {tenant.name_ar}
                </h1>
                <p className="text-base leading-relaxed mb-10" style={{ color: MIN_LIGHT, maxWidth: '40ch' }}>{bio}</p>
                <div className="flex flex-wrap gap-4">
                  <Link href={`/${tenant.slug}/projects`}
                    className="px-8 py-3 text-sm font-semibold transition-colors hover:bg-black/80"
                    style={{ backgroundColor: MIN_DARK, color: MIN_BG }}>
                    استعرض {sc.portfolioLabel}
                  </Link>
                  <Link href={`/${tenant.slug}/contact`}
                    className="px-8 py-3 text-sm border transition-colors hover:bg-black hover:text-white hover:border-black"
                    style={{ borderColor: 'rgba(0,0,0,0.2)', color: MIN_DARK }}>
                    تواصل
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" delay={150}>
              {tenant.cover_url ? (
                <div className="relative aspect-square overflow-hidden">
                  <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center"
                  style={{ backgroundColor: MIN_GRAY }}>
                  <span className="text-[120px] font-black leading-none" style={{ color: 'rgba(0,0,0,0.06)' }}>
                    {tenant.name_ar.charAt(0)}
                  </span>
                </div>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* STATS — رقمية نظيفة */}
      <section className="py-16 px-8 border-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade-up">
            <StatsCounter stats={stats} accentColor={MIN_DARK} textColor={MIN_DARK} labelColor={MIN_LIGHT} />
          </ScrollReveal>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-28 px-8" style={{ backgroundColor: MIN_GRAY }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-16">
          <ScrollReveal animation="fade-up" className="md:col-span-1">
            <p className="text-xs tracking-[0.5em] uppercase mb-6" style={{ color: MIN_LIGHT }}>من نحن</p>
            <h2 className="text-2xl font-black leading-tight" style={{ color: MIN_DARK }}>{sc.aboutTitle}</h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100} className="md:col-span-2">
            <p className="text-base leading-loose mb-6" style={{ color: MIN_LIGHT }}>{bio}</p>
            {tenant.address_ar && (
              <p className="text-sm flex items-start gap-2 mb-8" style={{ color: 'rgba(0,0,0,0.35)' }}>
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />{tenant.address_ar}
              </p>
            )}
            <Link href={`/${tenant.slug}/contact`}
              className="inline-block text-sm border-b pb-0.5 transition-opacity hover:opacity-50"
              style={{ borderColor: MIN_DARK, color: MIN_DARK }}>
              تواصل معنا →
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* SERVICES — قائمة بسيطة */}
      <section className="py-28 px-8" style={{ backgroundColor: MIN_BG }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="grid md:grid-cols-3 gap-16 mb-16">
              <div>
                <p className="text-xs tracking-[0.5em] uppercase mb-6" style={{ color: MIN_LIGHT }}>{sc.servicesLabel}</p>
                <h2 className="text-2xl font-black" style={{ color: MIN_DARK }}>ما نقدمه</h2>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: 'rgba(0,0,0,0.06)' }}>
            {(customServices && customServices.length > 0
              ? customServices.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.description ?? '' }))
              : sc.services.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.desc }))
            ).map(({ Icon, title, desc }, i) => (
              <ScrollReveal key={title} animation="fade-up" delay={i * 60}>
                <div className="p-8 hover:bg-gray-50 transition-colors cursor-default" style={{ backgroundColor: MIN_BG }}>
                  <Icon className="w-5 h-5 mb-6" style={{ color: MIN_LIGHT }} />
                  <h3 className="font-semibold text-sm mb-2" style={{ color: MIN_DARK }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: MIN_LIGHT }}>{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      {displayedProjects.length > 0 && (
        <section className="py-28 px-8" style={{ backgroundColor: MIN_GRAY }}>
          <div className="max-w-6xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: MIN_LIGHT }}>أعمالنا</p>
                  <h2 className="text-2xl font-black" style={{ color: MIN_DARK }}>{sc.featuredLabel}</h2>
                </div>
                <Link href={`/${tenant.slug}/projects`}
                  className="text-xs transition-opacity hover:opacity-50" style={{ color: MIN_DARK }}>
                  الكل →
                </Link>
              </div>
            </ScrollReveal>

            <StaggerReveal
              animation="fade-up"
              stagger={80}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayedProjects.map(p => (
                <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`} className="group block">
                  <div className="aspect-[4/3] relative overflow-hidden mb-3">
                    {p.cover_image_url ? (
                      <Image src={p.cover_image_url} alt={p.title_ar} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#e5e5e5' }}>
                        <span className="text-4xl font-black" style={{ color: 'rgba(0,0,0,0.1)' }}>{p.title_ar.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1 group-hover:underline" style={{ color: MIN_DARK }}>{p.title_ar}</h3>
                    {(p.category || p.year) && (
                      <p className="text-xs" style={{ color: MIN_LIGHT }}>
                        {p.category}{p.category && p.year ? ' · ' : ''}{p.year}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="py-28 px-8" style={{ backgroundColor: MIN_BG }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="mb-16">
              <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: MIN_LIGHT }}>لماذا نحن</p>
              <h2 className="text-2xl font-black" style={{ color: MIN_DARK }}>مزايانا</h2>
            </div>
          </ScrollReveal>

          <StaggerReveal
            animation="fade-up"
            stagger={60}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {(customFeatures && customFeatures.length > 0
              ? customFeatures.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.description ?? '' }))
              : sc.features.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.desc }))
            ).map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-5 pb-8 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                <Icon className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: MIN_LIGHT }} />
                <div>
                  <h3 className="font-semibold text-sm mb-1" style={{ color: MIN_DARK }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: MIN_LIGHT }}>{desc}</p>
                </div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials
        testimonials={testimonials}
        title="يقول عملاؤنا"
        accentColor={MIN_DARK}
        bgColor={MIN_GRAY}
        textColor={MIN_DARK}
        textLight={MIN_LIGHT}
        variant="minimal"
      />

      {/* FAQ */}
      <FAQ
        items={faqs}
        title="أسئلة شائعة"
        accentColor={MIN_DARK}
        bgColor={MIN_BG}
        textColor={MIN_DARK}
        textLight={MIN_LIGHT}
        variant="minimal"
      />

      {/* CTA */}
      <section className="py-28 px-8" style={{ backgroundColor: MIN_DARK }}>
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal animation="fade-up">
            <p className="text-xs tracking-[0.5em] uppercase mb-6" style={{ color: 'rgba(255,255,255,0.3)' }}>ابدأ معنا</p>
            <h2 className="font-black mb-4 leading-tight" style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', color: MIN_BG }}>
              {sc.cta}
            </h2>
            <p className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.4)' }}>{sc.ctaDesc}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${tenant.slug}/contact`}
                className="px-10 py-4 text-sm font-semibold transition-colors hover:opacity-90"
                style={{ backgroundColor: MIN_BG, color: MIN_DARK }}>
                تواصل معنا
              </Link>
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="px-10 py-4 text-sm border font-semibold transition-colors hover:bg-white/10"
                  style={{ borderColor: 'rgba(255,255,255,0.2)', color: MIN_BG }}>
                  واتساب
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-8 border-t" style={{ backgroundColor: MIN_BG, borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {tenant.logo_url && <Image src={tenant.logo_url} alt="" width={24} height={24} className="object-contain" />}
            <span className="text-sm font-semibold" style={{ color: MIN_DARK }}>{tenant.name_ar}</span>
          </div>
          <div className="flex items-center gap-8 text-xs" style={{ color: MIN_LIGHT }}>
            <Link href={`/${tenant.slug}`} className="hover:text-black transition-colors">الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} className="hover:text-black transition-colors">{sc.portfolioLabel}</Link>
            <Link href={`/${tenant.slug}/contact`} className="hover:text-black transition-colors">تواصل</Link>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: MIN_LIGHT }}>
            {tenant.phone && <a href={`tel:${tenant.phone}`} className="hover:text-black transition-colors flex items-center gap-1" dir="ltr"><Phone className="w-3 h-3" />{tenant.phone}</a>}
            {tenant.email && <a href={`mailto:${tenant.email}`} className="hover:text-black transition-colors flex items-center gap-1"><Mail className="w-3 h-3" />{tenant.email}</a>}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-4 border-t text-center text-xs" style={{ borderColor: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.2)' }}>
          © {new Date().getFullYear()} {tenant.name_ar}
        </div>
      </footer>

      {waUrl && <WhatsAppFloat url={waUrl} />}

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 border flex items-center justify-center shadow-md transition-all hover:bg-black hover:text-white hover:border-black"
          style={{ backgroundColor: MIN_BG, borderColor: 'rgba(0,0,0,0.15)', color: MIN_DARK }}
          aria-label="للأعلى"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
