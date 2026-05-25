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
import { VideoHero } from '@/components/themes/shared/VideoHero'
import { Testimonials, SECTOR_TESTIMONIALS } from '@/components/themes/shared/Testimonials'
import { FAQ, SECTOR_FAQ } from '@/components/themes/shared/FAQ'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

// Luxury: أسود عميق + ذهبي راقٍ — حصرية وفخامة
const LUX_BG = '#080808'
const LUX_BG2 = '#0f0f0f'
const LUX_GOLD = '#c9a84c'
const LUX_GOLD_LIGHT = '#e8c97a'
const LUX_CREAM = '#f5f0e8'

function GoldLine() {
  return (
    <div className="flex items-center gap-4 my-8" aria-hidden>
      <div className="h-px flex-1" style={{ background: `linear-gradient(to right, transparent, ${LUX_GOLD}60)` }} />
      <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: LUX_GOLD }} />
      <div className="h-px flex-1" style={{ background: `linear-gradient(to left, transparent, ${LUX_GOLD}60)` }} />
    </div>
  )
}

export default function LuxuryLayout({ tenant, projects, featuredProjects, services: customServices, features: customFeatures, sectorConfig, stats: dbStats, testimonials: dbTestimonials, faqs: dbFaqs }: ThemeProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 80)
      setShowTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const sc = sectorConfig ?? getSectorConfig(tenant.sector)
  const bio = tenant.bio_ar || sc.heroTagline
  const waPhone = tenant.whatsapp?.replace(/\D/g, '') || tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null
  const sectorKey = tenant.sector ?? 'engineering'
  const stats = (dbStats && dbStats.length > 0)
    ? dbStats.map(s => ({ value: s.value, suffix: s.suffix ?? undefined, prefix: s.prefix ?? undefined, label: s.label }))
    : SECTOR_STATS[sectorKey] ?? SECTOR_STATS.engineering
  const testimonials = (dbTestimonials && dbTestimonials.length > 0)
    ? dbTestimonials.map(t => ({ name: t.name, role: t.role ?? '', text: t.content, rating: t.rating }))
    : SECTOR_TESTIMONIALS[sectorKey] ?? SECTOR_TESTIMONIALS.engineering
  const faqs = (dbFaqs && dbFaqs.length > 0)
    ? dbFaqs.map(f => ({ q: f.question, a: f.answer }))
    : SECTOR_FAQ[sectorKey] ?? SECTOR_FAQ.engineering
  const displayedProjects = featuredProjects.length > 0 ? featuredProjects.slice(0, 6) : projects.slice(0, 6)

  return (
    <div className="min-h-screen" style={{ backgroundColor: LUX_BG, color: LUX_CREAM }} dir="rtl">

      {/* شريط ذهبي علوي */}
      <div className="h-px" style={{ background: `linear-gradient(to left, transparent, ${LUX_GOLD}, transparent)` }} />

      {/* معلومات علوية */}
      {(tenant.phone || tenant.email) && (
        <div className="hidden md:block py-2 px-8" style={{ backgroundColor: `${LUX_GOLD}08`, borderBottom: `1px solid ${LUX_GOLD}15` }}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs" style={{ color: `${LUX_CREAM}30` }}>
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="flex items-center gap-1.5 hover:opacity-70 transition-opacity" dir="ltr">
                  <Phone className="w-3 h-3" style={{ color: LUX_GOLD }} />{tenant.phone}
                </a>
              )}
              {tenant.email && (
                <a href={`mailto:${tenant.email}`} className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                  <Mail className="w-3 h-3" style={{ color: LUX_GOLD }} />{tenant.email}
                </a>
              )}
            </div>
            {tenant.address_ar && (
              <div className="flex items-center gap-2 text-xs" style={{ color: `${LUX_CREAM}25` }}>
                <MapPin className="w-3 h-3" style={{ color: LUX_GOLD }} />
                {tenant.address_ar}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className={`sticky top-0 z-50 transition-all duration-700`}
        style={{
          backgroundColor: scrolled ? `${LUX_BG}f5` : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? `1px solid ${LUX_GOLD}15` : '1px solid transparent',
        }}>
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-4">
            {tenant.logo_url ? (
              <Image src={tenant.logo_url} alt="" width={48} height={48} className="object-contain" />
            ) : (
              <div className="w-12 h-12 border flex items-center justify-center text-lg font-black"
                style={{ borderColor: `${LUX_GOLD}40`, color: LUX_GOLD }}>
                {tenant.name_ar.charAt(0)}
              </div>
            )}
            <div>
              <div className="font-black text-sm tracking-widest uppercase" style={{ color: LUX_GOLD_LIGHT }}>{tenant.name_ar}</div>
              {tenant.name_en && <div className="text-[9px] tracking-[0.3em] opacity-30 mt-0.5" dir="ltr" style={{ color: LUX_CREAM }}>{tenant.name_en}</div>}
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-xs tracking-[0.25em] uppercase font-medium"
            style={{ color: `${LUX_CREAM}50` }}>
            <Link href={`/${tenant.slug}`} className="transition-colors hover:opacity-100 hover:text-white"
              style={{ color: `${LUX_CREAM}50` }}>الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} className="transition-colors hover:text-white"
              style={{ color: `${LUX_CREAM}50` }}>{sc.portfolioLabel}</Link>
            <Link href={`/${tenant.slug}/contact`} className="transition-colors hover:text-white"
              style={{ color: `${LUX_CREAM}50` }}>تواصل</Link>
            <Link href={`/${tenant.slug}/contact`}
              className="border px-6 py-2.5 text-xs tracking-widest transition-all hover:bg-amber-500/10"
              style={{ borderColor: `${LUX_GOLD}50`, color: LUX_GOLD }}>
              استشارة حصرية
            </Link>
          </div>

          <MobileMenu
            tenantName={tenant.name_ar}
            tenantSlug={tenant.slug}
            logoUrl={tenant.logo_url}
            phone={tenant.phone}
            email={tenant.email}
            portfolioLabel={sc.portfolioLabel}
            accentColor={LUX_GOLD}
            bgColor={LUX_BG}
            textColor={LUX_CREAM}
            variant="dark"
          />
        </div>
      </nav>

      {/* HERO — Full-screen فاخر */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center"
        style={{ minHeight: '100vh' }}>
        {tenant.video_url ? (
          <VideoHero videoUrl={tenant.video_url} overlayOpacity={0.80} />
        ) : tenant.cover_url ? (
          <>
            <Image src={tenant.cover_url} alt="" fill className="object-cover" />
            <div className="absolute inset-0"
              style={{ background: `linear-gradient(to bottom, ${LUX_BG}60, ${LUX_BG}90)` }} />
          </>
        ) : (
          <>
            <div className="absolute inset-0" style={{ backgroundColor: LUX_BG }} />
            {/* نقاط ذهبية خلفية */}
            <div className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: `radial-gradient(${LUX_GOLD} 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
              }} />
            {/* دائرة مضيئة */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
              style={{ background: `radial-gradient(circle, ${LUX_GOLD} 0%, transparent 70%)` }} />
          </>
        )}

        <div className="relative z-10 max-w-4xl mx-auto px-8 py-32">
          <ScrollReveal animation="fade-up">
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px w-12" style={{ backgroundColor: LUX_GOLD }} />
              <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: LUX_GOLD }}>{sc.label}</span>
              <div className="h-px w-12" style={{ backgroundColor: LUX_GOLD }} />
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="font-black leading-none mb-6 tracking-wide"
              style={{ fontSize: 'clamp(3rem, 8vw, 8rem)', color: LUX_CREAM }}>
              {tenant.name_ar}
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <GoldLine />
            <p className="text-base leading-relaxed max-w-xl mx-auto" style={{ color: `${LUX_CREAM}60` }}>{bio}</p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={250}>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link href={`/${tenant.slug}/projects`}
                className="px-10 py-4 text-sm tracking-widest uppercase font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: LUX_GOLD, color: LUX_BG }}>
                استعرض {sc.portfolioLabel}
              </Link>
              <Link href={`/${tenant.slug}/contact`}
                className="px-10 py-4 text-sm tracking-widest uppercase font-medium border transition-all hover:bg-white/5"
                style={{ borderColor: `${LUX_CREAM}25`, color: LUX_CREAM }}>
                تواصل معنا
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {/* scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          style={{ color: `${LUX_CREAM}20` }}>
          <span className="text-[9px] tracking-[0.4em] uppercase">scroll</span>
          <div className="w-px h-14" style={{ background: `linear-gradient(to bottom, ${LUX_GOLD}40, transparent)` }} />
        </div>
      </section>

      {/* STATS — ذهبية */}
      <section className="py-16 px-8" style={{ backgroundColor: LUX_BG2, borderTop: `1px solid ${LUX_GOLD}15`, borderBottom: `1px solid ${LUX_GOLD}15` }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade-up">
            <StatsCounter stats={stats} accentColor={LUX_GOLD} textColor={LUX_CREAM} labelColor={`${LUX_CREAM}40`} />
          </ScrollReveal>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-28 px-8" style={{ backgroundColor: LUX_BG }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <ScrollReveal animation="fade-right">
            {tenant.cover_url ? (
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
                {/* إطار ذهبي */}
                <div className="absolute inset-0 border"
                  style={{ borderColor: `${LUX_GOLD}20`, margin: '12px' }} />
                <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2"
                  style={{ borderColor: LUX_GOLD }} />
                <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2"
                  style={{ borderColor: LUX_GOLD }} />
              </div>
            ) : (
              <div className="aspect-[3/4] flex items-center justify-center border"
                style={{ borderColor: `${LUX_GOLD}15`, backgroundColor: `${LUX_GOLD}05` }}>
                <span className="text-[120px] font-black" style={{ color: LUX_GOLD, opacity: 0.08 }}>{tenant.name_ar.charAt(0)}</span>
              </div>
            )}
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={100}>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10" style={{ backgroundColor: LUX_GOLD }} />
              <span className="text-xs tracking-[0.4em] uppercase" style={{ color: LUX_GOLD }}>من نحن</span>
            </div>
            <h2 className="font-black mb-8 leading-tight"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', color: LUX_CREAM }}>
              {sc.aboutTitle}
            </h2>
            <GoldLine />
            <p className="leading-loose text-sm mb-8" style={{ color: `${LUX_CREAM}55` }}>{bio}</p>
            {tenant.address_ar && (
              <p className="text-sm flex items-start gap-2 mb-8" style={{ color: `${LUX_CREAM}35` }}>
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: LUX_GOLD }} />{tenant.address_ar}
              </p>
            )}
            <Link href={`/${tenant.slug}/contact`}
              className="inline-block border px-8 py-3 text-xs tracking-widest uppercase font-medium transition-all hover:bg-amber-500/10"
              style={{ borderColor: `${LUX_GOLD}50`, color: LUX_GOLD }}>
              تواصل معنا
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-28 px-8" style={{ backgroundColor: LUX_BG2 }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-10" style={{ backgroundColor: LUX_GOLD }} />
                <span className="text-xs tracking-[0.4em] uppercase" style={{ color: LUX_GOLD }}>{sc.servicesLabel}</span>
                <div className="h-px w-10" style={{ backgroundColor: LUX_GOLD }} />
              </div>
              <h2 className="font-black text-3xl md:text-5xl" style={{ color: LUX_CREAM }}>خدماتنا الحصرية</h2>
              <GoldLine />
            </div>
          </ScrollReveal>

          <StaggerReveal
            animation="fade-up"
            stagger={100}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {(customServices && customServices.length > 0
              ? customServices.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.description ?? '' }))
              : sc.services.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.desc }))
            ).map(({ Icon, title, desc }) => (
              <div key={title}
                className="p-8 border transition-all hover:border-amber-500/30 hover:bg-amber-500/5 cursor-default group"
                style={{ borderColor: `${LUX_GOLD}10`, backgroundColor: `${LUX_GOLD}03` }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 border flex items-center justify-center transition-colors group-hover:border-amber-500/40"
                    style={{ borderColor: `${LUX_GOLD}20` }}>
                    <Icon className="w-4 h-4" style={{ color: LUX_GOLD }} />
                  </div>
                  <div className="h-px flex-1" style={{ backgroundColor: `${LUX_GOLD}10` }} />
                </div>
                <h3 className="font-black text-sm mb-2 tracking-wide" style={{ color: LUX_GOLD_LIGHT }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: `${LUX_CREAM}45` }}>{desc}</p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* FEATURED PROJECTS — فاخر */}
      {displayedProjects.length > 0 && (
        <section className="py-28 px-8" style={{ backgroundColor: LUX_BG }}>
          <div className="max-w-7xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-16">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="h-px w-10" style={{ backgroundColor: LUX_GOLD }} />
                  <span className="text-xs tracking-[0.4em] uppercase" style={{ color: LUX_GOLD }}>الأعمال</span>
                  <div className="h-px w-10" style={{ backgroundColor: LUX_GOLD }} />
                </div>
                <h2 className="font-black text-3xl md:text-5xl" style={{ color: LUX_CREAM }}>{sc.featuredLabel}</h2>
              </div>
            </ScrollReveal>

            <StaggerReveal
              animation="zoom-in"
              stagger={100}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {displayedProjects.map(p => (
                <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`} className="group block relative overflow-hidden">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    {p.cover_image_url ? (
                      <Image src={p.cover_image_url} alt={p.title_ar} fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full" style={{ backgroundColor: `${LUX_GOLD}08` }}>
                        <span className="absolute inset-0 flex items-center justify-center text-6xl font-black"
                          style={{ color: LUX_GOLD, opacity: 0.1 }}>{p.title_ar.charAt(0)}</span>
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(to top, ${LUX_BG}f0 0%, ${LUX_BG}60 50%, transparent 100%)` }} />
                    {/* محتوى عند الـ hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="h-px mb-3" style={{ backgroundColor: `${LUX_GOLD}60` }} />
                      <h3 className="font-black text-sm mb-1 tracking-wide" style={{ color: LUX_GOLD_LIGHT }}>{p.title_ar}</h3>
                      {p.category && <p className="text-xs" style={{ color: `${LUX_CREAM}50` }}>{p.category}</p>}
                    </div>
                  </div>
                  {/* border ذهبي */}
                  <div className="absolute inset-0 border opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ borderColor: `${LUX_GOLD}30`, margin: '6px', pointerEvents: 'none' }} />
                </Link>
              ))}
            </StaggerReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="text-center mt-12">
                <Link href={`/${tenant.slug}/projects`}
                  className="inline-block border px-10 py-4 text-xs tracking-widest uppercase transition-all hover:bg-amber-500/10"
                  style={{ borderColor: `${LUX_GOLD}40`, color: LUX_GOLD }}>
                  جميع {sc.portfolioLabel}
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="py-28 px-8" style={{ backgroundColor: LUX_BG2 }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-10" style={{ backgroundColor: LUX_GOLD }} />
                <span className="text-xs tracking-[0.4em] uppercase" style={{ color: LUX_GOLD }}>لماذا نحن</span>
                <div className="h-px w-10" style={{ backgroundColor: LUX_GOLD }} />
              </div>
              <h2 className="font-black text-3xl md:text-5xl" style={{ color: LUX_CREAM }}>تميّزنا الحصري</h2>
            </div>
          </ScrollReveal>

          <StaggerReveal
            animation="fade-up"
            stagger={80}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(customFeatures && customFeatures.length > 0
              ? customFeatures.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.description ?? '' }))
              : sc.features.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.desc }))
            ).map(({ Icon, title, desc }) => (
              <div key={title}
                className="flex gap-4 p-6 border-r-2"
                style={{ borderColor: LUX_GOLD, borderRightWidth: '1px', borderRightColor: `${LUX_GOLD}40`,
                  borderBottomColor: `${LUX_GOLD}10`, borderBottomWidth: '1px' }}>
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: LUX_GOLD }} />
                <div>
                  <h3 className="font-bold text-sm mb-1 tracking-wide" style={{ color: LUX_GOLD_LIGHT }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: `${LUX_CREAM}45` }}>{desc}</p>
                </div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <div style={{ backgroundColor: LUX_BG }}>
        <Testimonials
          testimonials={testimonials}
          title="شهادات عملائنا"
          accentColor={LUX_GOLD}
          bgColor={LUX_BG}
          textColor={LUX_CREAM}
          textLight={`${LUX_CREAM}55`}
          variant="carousel"
        />
      </div>

      {/* FAQ */}
      <FAQ
        items={faqs}
        title="الأسئلة الشائعة"
        accentColor={LUX_GOLD}
        bgColor={LUX_BG2}
        textColor={LUX_CREAM}
        textLight={`${LUX_CREAM}55`}
        variant="filled"
      />

      {/* CTA */}
      <section className="relative py-32 px-8 overflow-hidden text-center" style={{ backgroundColor: LUX_BG }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `radial-gradient(${LUX_GOLD} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
        <div className="absolute inset-0 opacity-[0.15]"
          style={{ background: `radial-gradient(ellipse at center, ${LUX_GOLD} 0%, transparent 65%)` }} />
        <div className="relative z-10 max-w-3xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-10" style={{ backgroundColor: LUX_GOLD }} />
              <span className="text-xs tracking-[0.4em] uppercase" style={{ color: LUX_GOLD }}>ابدأ معنا</span>
              <div className="h-px w-10" style={{ backgroundColor: LUX_GOLD }} />
            </div>
            <h2 className="font-black mb-6 leading-tight"
              style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', color: LUX_CREAM }}>
              {sc.cta}
            </h2>
            <GoldLine />
            <p className="text-sm mb-12" style={{ color: `${LUX_CREAM}50` }}>{sc.ctaDesc}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${tenant.slug}/contact`}
                className="px-12 py-5 text-xs tracking-widest uppercase font-medium transition-all hover:opacity-90"
                style={{ backgroundColor: LUX_GOLD, color: LUX_BG }}>
                تواصل معنا
              </Link>
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="px-12 py-5 text-xs tracking-widest uppercase font-medium border transition-all hover:bg-amber-500/10"
                  style={{ borderColor: `${LUX_GOLD}40`, color: LUX_GOLD }}>
                  واتساب
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-8" style={{ backgroundColor: '#040404', borderTop: `1px solid ${LUX_GOLD}15` }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 pb-10" style={{ borderBottom: `1px solid ${LUX_GOLD}10` }}>
            <div>
              <div className="flex items-center gap-3 mb-4">
                {tenant.logo_url && <Image src={tenant.logo_url} alt="" width={36} height={36} className="object-contain" />}
                <span className="font-black tracking-widest uppercase text-xs" style={{ color: LUX_GOLD }}>{tenant.name_ar}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: `${LUX_CREAM}25` }}>{sc.label}</p>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: `${LUX_CREAM}30` }}>روابط</p>
              <ul className="space-y-2 text-xs" style={{ color: `${LUX_CREAM}25` }}>
                <li><Link href={`/${tenant.slug}`} className="hover:opacity-70 transition-opacity">الرئيسية</Link></li>
                <li><Link href={`/${tenant.slug}/projects`} className="hover:opacity-70 transition-opacity">{sc.portfolioLabel}</Link></li>
                <li><Link href={`/${tenant.slug}/contact`} className="hover:opacity-70 transition-opacity">تواصل</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: `${LUX_CREAM}30` }}>تواصل</p>
              <ul className="space-y-2 text-xs" style={{ color: `${LUX_CREAM}25` }}>
                {tenant.phone && <li dir="ltr"><a href={`tel:${tenant.phone}`} className="hover:opacity-70 transition-opacity flex items-center gap-2"><Phone className="w-3 h-3" style={{ color: LUX_GOLD }} />{tenant.phone}</a></li>}
                {tenant.email && <li><a href={`mailto:${tenant.email}`} className="hover:opacity-70 transition-opacity flex items-center gap-2"><Mail className="w-3 h-3" style={{ color: LUX_GOLD }} />{tenant.email}</a></li>}
              </ul>
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between">
            <p className="text-xs" style={{ color: `${LUX_CREAM}15` }}>© {new Date().getFullYear()} {tenant.name_ar}</p>
            <div className="h-px w-20" style={{ background: `linear-gradient(to left, transparent, ${LUX_GOLD}30)` }} />
          </div>
        </div>
      </footer>

      <SocialFloat
        whatsapp={waPhone}
        snapchat_url={tenant.snapchat_url}
        tiktok_url={tenant.tiktok_url}
        whatsapp_note={tenant.whatsapp_note}
      />

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 border flex items-center justify-center transition-all hover:bg-amber-500/10"
          style={{ borderColor: `${LUX_GOLD}40`, color: LUX_GOLD }}
          aria-label="للأعلى"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
