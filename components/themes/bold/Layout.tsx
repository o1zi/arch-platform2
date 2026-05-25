'use client'

import { ThemeProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, ArrowUp, ArrowLeft } from 'lucide-react'
import { resolveIcon } from '@/components/themes/iconMap'
import { getSectorConfig } from '@/lib/sectors'
import MobileMenu from '@/components/themes/shared/MobileMenu'
import { ScrollReveal, StaggerReveal } from '@/components/themes/shared/ScrollReveal'
import { StatsCounter, SECTOR_STATS } from '@/components/themes/shared/StatsCounter'
import { VideoHero } from '@/components/themes/shared/VideoHero'
import { Testimonials, SECTOR_TESTIMONIALS } from '@/components/themes/shared/Testimonials'
import { FAQ, SECTOR_FAQ } from '@/components/themes/shared/FAQ'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

// Bold: أسود + برتقالي/أحمر صارخ — قوة وجرأة
const BOLD_BG = '#0a0a0a'
const BOLD_ACCENT = '#ff4500'

export default function BoldLayout({ tenant, projects, featuredProjects, services: customServices, features: customFeatures, sectorConfig, stats: dbStats, testimonials: dbTestimonials, faqs: dbFaqs }: ThemeProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 60)
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
    <div className="min-h-screen" style={{ backgroundColor: BOLD_BG, color: '#ffffff' }} dir="rtl">

      {/* ACCENT BAR */}
      <div className="h-1.5" style={{ backgroundColor: BOLD_ACCENT }} />

      {/* NAV */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'border-b border-white/10' : ''}`}
        style={{ backgroundColor: scrolled ? `${BOLD_BG}f0` : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo_url ? (
              <Image src={tenant.logo_url} alt="" width={36} height={36} className="object-contain" />
            ) : (
              <div className="text-xl font-black" style={{ color: BOLD_ACCENT }}>{tenant.name_ar.charAt(0)}</div>
            )}
            <span className="font-black text-white uppercase tracking-wider text-sm">{tenant.name_ar}</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-white/50">
            <Link href={`/${tenant.slug}`} className="hover:text-white transition-colors">الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} className="hover:text-white transition-colors">{sc.portfolioLabel}</Link>
            <Link href={`/${tenant.slug}/contact`} className="hover:text-white transition-colors">تواصل</Link>
            <Link href={`/${tenant.slug}/contact`}
              className="px-5 py-2 font-black transition-colors hover:opacity-90"
              style={{ backgroundColor: BOLD_ACCENT, color: '#ffffff' }}>
              ابدأ الآن
            </Link>
          </div>

          <MobileMenu
            tenantName={tenant.name_ar}
            tenantSlug={tenant.slug}
            logoUrl={tenant.logo_url}
            phone={tenant.phone}
            email={tenant.email}
            portfolioLabel={sc.portfolioLabel}
            accentColor={BOLD_ACCENT}
            bgColor="#ffffff"
            textColor="#111111"
            variant="dark"
          />
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden flex flex-col justify-center" style={{ minHeight: '100vh' }}>
        {tenant.video_url ? (
          <VideoHero videoUrl={tenant.video_url} overlayOpacity={0.75} />
        ) : tenant.cover_url ? (
          <>
            <Image src={tenant.cover_url} alt="" fill className="object-cover" />
            <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} />
          </>
        ) : (
          <div className="absolute inset-0"
            style={{ background: `radial-gradient(ellipse at center, #1a0a00 0%, ${BOLD_BG} 70%)` }} />
        )}

        <div className="absolute top-0 right-20 bottom-0 w-0.5 hidden lg:block" style={{ backgroundColor: `${BOLD_ACCENT}20` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
          <ScrollReveal animation="fade-right">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-16" style={{ backgroundColor: BOLD_ACCENT }} />
              <span className="text-xs font-black uppercase tracking-[0.4em]" style={{ color: BOLD_ACCENT }}>{sc.label}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-6xl md:text-9xl font-black leading-none tracking-tight mb-4 uppercase"
              style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
              {tenant.name_ar}
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <h2 className="text-4xl md:text-6xl font-black leading-none mb-8" style={{ color: BOLD_ACCENT }}>
              {sc.heroTagline}
            </h2>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={250}>
            <p className="max-w-xl text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>{bio}</p>
            <div className="flex flex-wrap gap-4">
              <Link href={`/${tenant.slug}/projects`}
                className="group flex items-center gap-3 px-8 py-4 font-black uppercase tracking-wider transition-colors hover:opacity-90"
                style={{ backgroundColor: BOLD_ACCENT, color: '#ffffff' }}>
                {sc.portfolioLabel}
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Link href={`/${tenant.slug}/contact`}
                className="px-8 py-4 font-black uppercase tracking-wider border-2 transition-colors hover:bg-white hover:text-black"
                style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#ffffff' }}>
                تواصل معنا
              </Link>
            </div>
          </ScrollReveal>
        </div>

        {projects.length > 0 && (
          <div className="absolute bottom-8 left-8 hidden lg:block" style={{ color: 'rgba(255,255,255,0.03)' }}>
            <span className="text-[200px] font-black leading-none tabular-nums">{projects.length}+</span>
          </div>
        )}
      </section>

      {/* STATS */}
      <section className="py-16 px-6" style={{ backgroundColor: BOLD_ACCENT }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <StatsCounter stats={stats} accentColor="#000000" textColor="#000000" labelColor="rgba(0,0,0,0.6)" />
          </ScrollReveal>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 px-6" style={{ backgroundColor: '#111111' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <ScrollReveal animation="fade-right">
            <div>
              <div className="text-xs font-black uppercase tracking-[0.4em] mb-6" style={{ color: BOLD_ACCENT }}>من نحن</div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">{sc.aboutTitle}</h2>
              <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>{bio}</p>
              {tenant.address_ar && (
                <p className="text-sm flex items-start gap-2 mb-8" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BOLD_ACCENT }} />{tenant.address_ar}
                </p>
              )}
              <Link href={`/${tenant.slug}/contact`}
                className="inline-flex items-center gap-3 font-black uppercase tracking-wider text-sm border-b-2 pb-1 transition-colors hover:opacity-70"
                style={{ borderColor: BOLD_ACCENT, color: BOLD_ACCENT }}>
                تواصل معنا <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={100}>
            {tenant.cover_url ? (
              <div className="relative aspect-square overflow-hidden">
                <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
                <div className="absolute -bottom-4 -left-4 w-full h-full border-4 -z-10" style={{ borderColor: BOLD_ACCENT }} />
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center relative"
                style={{ backgroundColor: `${BOLD_ACCENT}10`, border: `4px solid ${BOLD_ACCENT}30` }}>
                <span className="text-[120px] font-black" style={{ color: BOLD_ACCENT, opacity: 0.2 }}>{tenant.name_ar.charAt(0)}</span>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 px-6" style={{ backgroundColor: BOLD_BG }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="mb-16">
              <div className="text-xs font-black uppercase tracking-[0.4em] mb-4" style={{ color: BOLD_ACCENT }}>{sc.servicesLabel}</div>
              <h2 className="text-4xl md:text-6xl font-black">ما نقدمه</h2>
            </div>
          </ScrollReveal>

          <div className="space-y-px">
            {(customServices && customServices.length > 0
              ? customServices.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.description ?? '' }))
              : sc.services.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.desc }))
            ).map(({ Icon, title, desc }, i) => (
              <ScrollReveal key={title} animation="fade-right" delay={i * 60}>
                <div className="group flex items-center gap-6 p-6 border-b transition-colors hover:bg-white/5 cursor-default"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <span className="text-3xl font-black tabular-nums flex-shrink-0" style={{ color: BOLD_ACCENT, minWidth: '48px' }}>
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </span>
                  <Icon className="w-6 h-6 flex-shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" style={{ color: BOLD_ACCENT }} />
                  <div className="flex-1">
                    <h3 className="font-black text-lg mb-1">{title}</h3>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all group-hover:-translate-x-2" style={{ color: BOLD_ACCENT }} />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {displayedProjects.length > 0 && (
        <section className="py-24 px-6" style={{ backgroundColor: '#111111' }}>
          <div className="max-w-7xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <div className="text-xs font-black uppercase tracking-[0.4em] mb-4" style={{ color: BOLD_ACCENT }}>الأعمال</div>
                  <h2 className="text-4xl md:text-6xl font-black">{sc.featuredLabel}</h2>
                </div>
                <Link href={`/${tenant.slug}/projects`}
                  className="hidden md:flex items-center gap-2 text-sm font-black uppercase tracking-wider transition-colors hover:opacity-70"
                  style={{ color: BOLD_ACCENT }}>
                  كل الأعمال <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {displayedProjects.map((p, i) => {
                const isLarge = i === 0
                const colSpan = isLarge ? 'md:col-span-8' : 'md:col-span-4'
                return (
                  <ScrollReveal key={p.id} animation="fade-up" delay={i * 80} className={colSpan}>
                    <Link href={`/${tenant.slug}/projects/${p.id}`} className="group block overflow-hidden relative"
                      style={{ aspectRatio: isLarge ? '16/9' : '4/3' }}>
                      {p.cover_image_url ? (
                        <Image src={p.cover_image_url} alt={p.title_ar} fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: `${BOLD_ACCENT}15` }}>
                          <span className="text-6xl font-black" style={{ color: BOLD_ACCENT, opacity: 0.3 }}>{p.title_ar.charAt(0)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ backgroundColor: `${BOLD_ACCENT}80` }} />
                      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="font-black text-white text-sm">{p.title_ar}</h3>
                        {p.category && <p className="text-xs text-white/70 mt-1">{p.category}</p>}
                      </div>
                      <div className="absolute top-4 right-4 text-xs font-black" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {i + 1 < 10 ? `0${i + 1}` : i + 1}
                      </div>
                    </Link>
                  </ScrollReveal>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="py-24 px-6" style={{ backgroundColor: BOLD_BG }}>
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="text-xs font-black uppercase tracking-[0.4em] mb-4" style={{ color: BOLD_ACCENT }}>لماذا نحن</div>
            <h2 className="text-4xl md:text-6xl font-black mb-16">ما يميزنا</h2>
          </ScrollReveal>

          <StaggerReveal
            animation="fade-up"
            stagger={80}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {(customFeatures && customFeatures.length > 0
              ? customFeatures.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.description ?? '' }))
              : sc.features.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.desc }))
            ).map(({ Icon, title, desc }) => (
              <div key={title} className="p-6 border-2 transition-colors hover:border-white/20 cursor-default"
                style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <div className="w-12 h-12 flex items-center justify-center mb-4" style={{ backgroundColor: `${BOLD_ACCENT}15` }}>
                  <Icon className="w-5 h-5" style={{ color: BOLD_ACCENT }} />
                </div>
                <h3 className="font-black text-lg mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{desc}</p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <div style={{ backgroundColor: '#111111' }}>
        <Testimonials
          testimonials={testimonials}
          title="ماذا يقول عملاؤنا"
          accentColor={BOLD_ACCENT}
          bgColor="#111111"
          textColor="#ffffff"
          textLight="rgba(255,255,255,0.5)"
          variant="cards"
        />
      </div>

      {/* FAQ */}
      <FAQ
        items={faqs}
        title="الأسئلة الشائعة"
        accentColor={BOLD_ACCENT}
        bgColor={BOLD_BG}
        textColor="#ffffff"
        textLight="rgba(255,255,255,0.5)"
        variant="minimal"
      />

      {/* CTA */}
      <section className="relative overflow-hidden py-32 px-6" style={{ backgroundColor: BOLD_ACCENT }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg,#000 0,#000 1px,transparent 0,transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <ScrollReveal animation="zoom-in">
            <h2 className="text-5xl md:text-8xl font-black text-black leading-none mb-4 uppercase">{sc.cta}</h2>
            <p className="text-black/70 text-lg mb-12">{sc.ctaDesc}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${tenant.slug}/contact`}
                className="px-12 py-5 font-black bg-black text-white uppercase tracking-wider text-sm transition-colors hover:bg-black/80">
                تواصل معنا الآن
              </Link>
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="px-12 py-5 font-black border-2 border-black text-black uppercase tracking-wider text-sm transition-colors hover:bg-black hover:text-white">
                  واتساب
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6" style={{ backgroundColor: '#050505', borderTop: `2px solid ${BOLD_ACCENT}` }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {tenant.logo_url && <Image src={tenant.logo_url} alt="" width={32} height={32} className="object-contain" />}
            <span className="font-black uppercase tracking-wider">{tenant.name_ar}</span>
          </div>
          <div className="flex items-center gap-8 text-xs font-black uppercase tracking-widest text-white/30">
            <Link href={`/${tenant.slug}`} className="hover:text-white/70 transition-colors">الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} className="hover:text-white/70 transition-colors">{sc.portfolioLabel}</Link>
            <Link href={`/${tenant.slug}/contact`} className="hover:text-white/70 transition-colors">تواصل</Link>
          </div>
          <div className="text-xs text-white/20">
            {tenant.phone && <a href={`tel:${tenant.phone}`} className="hover:text-white/40 transition-colors" dir="ltr"><Phone className="w-3 h-3 inline ml-1" />{tenant.phone}</a>}
            {tenant.email && <a href={`mailto:${tenant.email}`} className="hover:text-white/40 transition-colors mr-4"><Mail className="w-3 h-3 inline ml-1" />{tenant.email}</a>}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 text-center text-xs text-white/10">
          © {new Date().getFullYear()} {tenant.name_ar} — جميع الحقوق محفوظة
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
          className="fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center shadow-lg transition-all hover:scale-110"
          style={{ backgroundColor: BOLD_ACCENT }}
          aria-label="للأعلى"
        >
          <ArrowUp className="w-4 h-4 text-white" />
        </button>
      )}
    </div>
  )
}
