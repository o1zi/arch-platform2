'use client'

import { ThemeProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MapPin, ArrowUp, ArrowLeft } from 'lucide-react'
import { resolveIcon } from '@/components/themes/iconMap'
import { getSectorConfig } from '@/lib/sectors'
import MobileMenu from '@/components/themes/shared/MobileMenu'
import { ScrollReveal, StaggerReveal } from '@/components/themes/shared/ScrollReveal'
import { StatsCounter, SECTOR_STATS } from '@/components/themes/shared/StatsCounter'
import { VideoHero } from '@/components/themes/shared/VideoHero'
import { Testimonials, SECTOR_TESTIMONIALS } from '@/components/themes/shared/Testimonials'
import { FAQ, SECTOR_FAQ } from '@/components/themes/shared/FAQ'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

const COSMOS_VOID = '#05050f'
const COSMOS_SURFACE = '#0a0a1a'
const COSMOS_ACCENT = '#b388ff'
const COSMOS_ACCENT2 = '#e040fb'
const COSMOS_STAR = '#e8e0f0'

export default function NebulaLayout({ tenant, projects, featuredProjects, services: customServices, features: customFeatures, sectorConfig, stats: dbStats, testimonials: dbTestimonials, faqs: dbFaqs }: ThemeProps) {
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
    <div className="min-h-screen" style={{ backgroundColor: COSMOS_VOID, color: COSMOS_STAR }} dir="rtl">

      {/* ═══════ STARFIELD ═══════ */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(1px 1px at 10% 15%, ${COSMOS_STAR}20, transparent),
            radial-gradient(1px 1px at 25% 35%, ${COSMOS_STAR}25, transparent),
            radial-gradient(1.5px 1.5px at 40% 8%, ${COSMOS_STAR}1a, transparent),
            radial-gradient(1px 1px at 55% 55%, ${COSMOS_STAR}20, transparent),
            radial-gradient(1.5px 1.5px at 70% 20%, ${COSMOS_STAR}1a, transparent),
            radial-gradient(1px 1px at 85% 42%, ${COSMOS_STAR}20, transparent),
            radial-gradient(1px 1px at 15% 65%, ${COSMOS_STAR}18, transparent),
            radial-gradient(1.5px 1.5px at 33% 78%, ${COSMOS_STAR}15, transparent),
            radial-gradient(1px 1px at 60% 72%, ${COSMOS_STAR}20, transparent),
            radial-gradient(1.5px 1.5px at 88% 68%, ${COSMOS_STAR}1a, transparent),
            radial-gradient(1px 1px at 45% 90%, ${COSMOS_STAR}18, transparent),
            radial-gradient(1.5px 1.5px at 12% 88%, ${COSMOS_STAR}15, transparent),
            radial-gradient(1px 1px at 75% 85%, ${COSMOS_STAR}20, transparent),
            radial-gradient(600px 600px at 70% 10%, ${COSMOS_ACCENT}06, transparent),
            radial-gradient(500px 500px at 20% 50%, ${COSMOS_ACCENT2}04, transparent),
            radial-gradient(400px 400px at 80% 90%, ${COSMOS_ACCENT}05, transparent)`
        }} />
      </div>

      <div className="relative z-10">

        {/* ═══════ NAV ═══════ */}
        <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'border-b border-white/5' : ''}`}
          style={{
            backgroundColor: scrolled ? `${COSMOS_VOID}ee` : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
          }}>
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tenant.logo_url ? (
                <div className="relative w-9 h-9 rounded-full overflow-hidden" style={{ boxShadow: `0 0 12px ${COSMOS_ACCENT}40` }}>
                  <Image src={tenant.logo_url} alt="" width={36} height={36} className="object-contain" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: `${COSMOS_ACCENT}20`, boxShadow: `0 0 12px ${COSMOS_ACCENT}30` }}>
                  {tenant.name_ar.charAt(0)}
                </div>
              )}
              <span className="font-bold text-sm tracking-wider" style={{ color: COSMOS_STAR }}>{tenant.name_ar}</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest" style={{ color: `${COSMOS_STAR}40` }}>
              <Link href={`/${tenant.slug}`} className="hover:text-white transition-colors">الرئيسية</Link>
              <Link href={`/${tenant.slug}/projects`} className="hover:text-white transition-colors">{sc.portfolioLabel}</Link>
              <Link href={`/${tenant.slug}/contact`} className="hover:text-white transition-colors">تواصل</Link>
              {waUrl && (
                <Link href={`/${tenant.slug}/contact`}
                  className="px-5 py-2 rounded-full text-xs font-bold transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: `${COSMOS_ACCENT}20`,
                    border: `1px solid ${COSMOS_ACCENT}30`,
                    color: COSMOS_STAR,
                    boxShadow: `0 0 20px ${COSMOS_ACCENT}10`,
                  }}>
                  تواصل الآن
                </Link>
              )}
            </div>

            <MobileMenu
              tenantName={tenant.name_ar}
              tenantSlug={tenant.slug}
              logoUrl={tenant.logo_url}
              phone={tenant.phone}
              email={tenant.email}
              portfolioLabel={sc.portfolioLabel}
              accentColor={COSMOS_ACCENT}
              bgColor={COSMOS_VOID}
              textColor={COSMOS_STAR}
              variant="dark"
            />
          </div>
        </nav>

        {/* ═══════ HERO ═══════ */}
        <section className="relative overflow-hidden flex flex-col justify-center" style={{ minHeight: '100vh' }}>
          {tenant.video_url ? (
            <VideoHero videoUrl={tenant.video_url} overlayOpacity={0.8} />
          ) : tenant.cover_url ? (
            <>
              <Image src={tenant.cover_url} alt="" fill className="object-cover" priority />
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${COSMOS_VOID}80, ${COSMOS_VOID}e0)` }} />
            </>
          ) : (
            <div className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse 80% 60% at 50% 30%, ${COSMOS_ACCENT}08, transparent 70%), radial-gradient(ellipse 60% 70% at 80% 80%, ${COSMOS_ACCENT2}06, transparent 70%), ${COSMOS_VOID}` }} />
          )}

          <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 w-full">
            <ScrollReveal animation="fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-bold tracking-widest"
                style={{ border: `1px solid ${COSMOS_ACCENT}30`, backgroundColor: `${COSMOS_ACCENT}08`, color: COSMOS_ACCENT }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: COSMOS_ACCENT }} />
                {sc.label}
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100}>
              <h1 className="text-5xl md:text-8xl font-black leading-none mb-6"
                style={{
                  background: `linear-gradient(135deg, ${COSMOS_STAR} 0%, ${COSMOS_ACCENT} 50%, ${COSMOS_ACCENT2} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                {tenant.name_ar}
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <p className="max-w-xl text-base md:text-lg leading-relaxed mb-10" style={{ color: `${COSMOS_STAR}50` }}>{bio}</p>
              <div className="flex flex-wrap gap-4">
                <Link href={`/${tenant.slug}/projects`}
                  className="group flex items-center gap-3 px-8 py-4 rounded-full text-sm font-bold tracking-wider transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${COSMOS_ACCENT}, ${COSMOS_ACCENT2})`,
                    color: '#ffffff',
                    boxShadow: `0 0 30px ${COSMOS_ACCENT}30`,
                  }}>
                  {sc.portfolioLabel}
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link href={`/${tenant.slug}/contact`}
                  className="px-8 py-4 rounded-full text-sm font-bold tracking-wider transition-all"
                  style={{ border: `1.5px solid ${COSMOS_ACCENT}30`, color: COSMOS_STAR }}>
                  تواصل معنا
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* floating indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-[10px] font-bold tracking-[0.3em]" style={{ color: `${COSMOS_STAR}20` }}>استكشف</span>
            <div className="w-px h-8" style={{ backgroundColor: `${COSMOS_ACCENT}30` }} />
          </div>
        </section>

        {/* ═══════ STATS ═══════ */}
        <section className="py-16 px-6" style={{ backgroundColor: COSMOS_SURFACE }}>
          <div className="max-w-7xl mx-auto">
            <ScrollReveal animation="fade-up">
              <StatsCounter stats={stats} accentColor={COSMOS_ACCENT} textColor={COSMOS_STAR} labelColor={`${COSMOS_STAR}40`} />
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════ ABOUT ═══════ */}
        <section className="py-24 px-6 relative">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 70% 30%, ${COSMOS_ACCENT}, transparent 50%)`,
          }} />
          <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal animation="fade-right">
              <div>
                <div className="text-xs font-bold tracking-[0.4em] mb-6" style={{ color: COSMOS_ACCENT }}>من نحن</div>
                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">{sc.aboutTitle}</h2>
                <p className="text-base leading-relaxed mb-8" style={{ color: `${COSMOS_STAR}40` }}>{bio}</p>
                {tenant.address_ar && (
                  <p className="text-sm flex items-start gap-2 mb-8" style={{ color: `${COSMOS_STAR}25` }}>
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: COSMOS_ACCENT }} />{tenant.address_ar}
                  </p>
                )}
                <Link href={`/${tenant.slug}/contact`}
                  className="inline-flex items-center gap-3 text-sm font-bold border-b-2 pb-1 transition-all hover:opacity-70"
                  style={{ borderColor: COSMOS_ACCENT, color: COSMOS_ACCENT }}>
                  تواصل معنا <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left" delay={100}>
              {tenant.cover_url ? (
                <div className="relative aspect-square overflow-hidden rounded-3xl"
                  style={{ boxShadow: `0 0 60px ${COSMOS_ACCENT}10` }}>
                  <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${COSMOS_ACCENT}20, transparent 60%)` }} />
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center rounded-3xl relative"
                  style={{ backgroundColor: `${COSMOS_ACCENT}05`, border: `1px solid ${COSMOS_ACCENT}10`, boxShadow: `0 0 60px ${COSMOS_ACCENT}08` }}>
                  <span className="text-[120px] font-black" style={{ color: COSMOS_ACCENT, opacity: 0.1 }}>{tenant.name_ar.charAt(0)}</span>
                </div>
              )}
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════ SERVICES ═══════ */}
        <section className="py-24 px-6" style={{ backgroundColor: COSMOS_SURFACE }}>
          <div className="max-w-7xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="mb-16">
                <div className="text-xs font-bold tracking-[0.4em] mb-4" style={{ color: COSMOS_ACCENT }}>{sc.servicesLabel}</div>
                <h2 className="text-4xl md:text-6xl font-black">ما نقدمه</h2>
              </div>
            </ScrollReveal>

            <StaggerReveal animation="fade-up" stagger={80} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(customServices && customServices.length > 0
                ? customServices.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.description ?? '' }))
                : sc.services.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.desc }))
              ).map(({ Icon, title, desc }) => (
                <div key={title} className="group p-8 rounded-2xl transition-all duration-500 hover:scale-[1.02] cursor-default"
                  style={{
                    backgroundColor: `${COSMOS_ACCENT}03`,
                    border: `1px solid ${COSMOS_ACCENT}08`,
                    boxShadow: `0 4px 30px ${COSMOS_ACCENT}05`,
                  }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all group-hover:shadow-lg"
                    style={{
                      backgroundColor: `${COSMOS_ACCENT}10`,
                      boxShadow: `0 0 20px ${COSMOS_ACCENT}10`,
                    }}>
                    <Icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color: COSMOS_ACCENT }} />
                  </div>
                  <h3 className="font-bold text-lg mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: `${COSMOS_STAR}30` }}>{desc}</p>
                </div>
              ))}
            </StaggerReveal>
          </div>
        </section>

        {/* ═══════ FEATURED PROJECTS ═══════ */}
        {displayedProjects.length > 0 && (
          <section className="py-24 px-6">
            <div className="max-w-7xl mx-auto">
              <ScrollReveal animation="fade-up">
                <div className="flex items-end justify-between mb-16">
                  <div>
                    <div className="text-xs font-bold tracking-[0.4em] mb-4" style={{ color: COSMOS_ACCENT }}>الأعمال</div>
                    <h2 className="text-4xl md:text-6xl font-black">{sc.featuredLabel}</h2>
                  </div>
                  <Link href={`/${tenant.slug}/projects`}
                    className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wider transition-all hover:opacity-70"
                    style={{ color: COSMOS_ACCENT }}>
                    كل الأعمال <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </ScrollReveal>

              <StaggerReveal animation="fade-up" stagger={100} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayedProjects.map((p) => (
                  <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`} className="group block overflow-hidden rounded-2xl relative"
                    style={{ aspectRatio: '4/3', border: `1px solid ${COSMOS_ACCENT}08` }}>
                    {p.cover_image_url ? (
                      <Image src={p.cover_image_url} alt={p.title_ar} fill
                        className="object-cover transition-all duration-700 group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${COSMOS_ACCENT}05` }}>
                        <span className="text-6xl font-black" style={{ color: COSMOS_ACCENT, opacity: 0.2 }}>{p.title_ar.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 opacity-0"
                      style={{ background: `linear-gradient(to top, ${COSMOS_VOID}dd, transparent 50%)` }} />
                    <div className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-100 opacity-0"
                      style={{ boxShadow: `inset 0 0 60px ${COSMOS_ACCENT}15` }} />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="font-bold text-sm mb-1">{p.title_ar}</h3>
                      {p.category && <p className="text-xs" style={{ color: COSMOS_ACCENT }}>{p.category}</p>}
                    </div>
                  </Link>
                ))}
              </StaggerReveal>

              <div className="text-center mt-10 md:hidden">
                <Link href={`/${tenant.slug}/projects`}
                  className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full transition-all"
                  style={{ border: `1px solid ${COSMOS_ACCENT}30`, color: COSMOS_ACCENT }}>
                  عرض كل {sc.portfolioItemLabelPlural} <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ═══════ FEATURES ═══════ */}
        <section className="py-24 px-6" style={{ backgroundColor: COSMOS_SURFACE }}>
          <div className="max-w-7xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="text-xs font-bold tracking-[0.4em] mb-4" style={{ color: COSMOS_ACCENT }}>لماذا نحن</div>
              <h2 className="text-4xl md:text-6xl font-black mb-16">ما يميزنا</h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(customFeatures && customFeatures.length > 0
                ? customFeatures.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.description ?? '' }))
                : sc.features.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.desc }))
              ).map(({ Icon, title, desc }, i) => (
                <ScrollReveal key={title} animation="fade-up" delay={i * 80}>
                  <div className="group p-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] cursor-default"
                    style={{ border: `1px solid ${COSMOS_ACCENT}08`, backgroundColor: `${COSMOS_ACCENT}02` }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all"
                      style={{ backgroundColor: `${COSMOS_ACCENT}10`, boxShadow: `0 0 15px ${COSMOS_ACCENT}08` }}>
                      <Icon className="w-5 h-5" style={{ color: COSMOS_ACCENT }} />
                    </div>
                    <h3 className="font-bold text-sm mb-2">{title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: `${COSMOS_STAR}25` }}>{desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════ TESTIMONIALS ═══════ */}
        <Testimonials
          testimonials={testimonials}
          title="ماذا يقول عملاؤنا"
          accentColor={COSMOS_ACCENT}
          bgColor={COSMOS_VOID}
          textColor={COSMOS_STAR}
          textLight={`${COSMOS_STAR}35`}
          variant="cards"
        />

        {/* ═══════ FAQ ═══════ */}
        <div style={{ backgroundColor: COSMOS_SURFACE }}>
          <FAQ
            items={faqs}
            title="الأسئلة الشائعة"
            accentColor={COSMOS_ACCENT}
            bgColor={COSMOS_SURFACE}
            textColor={COSMOS_STAR}
            textLight={`${COSMOS_STAR}35`}
            variant="minimal"
          />
        </div>

        {/* ═══════ CTA ═══════ */}
        <section className="relative overflow-hidden py-32 px-6">
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse 70% 50% at 50% 50%, ${COSMOS_ACCENT}10, transparent 60%), ${COSMOS_VOID}`
          }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `repeating-linear-gradient(0deg, ${COSMOS_ACCENT}, ${COSMOS_ACCENT} 1px, transparent 1px, transparent 40px)`
          }} />
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <ScrollReveal animation="zoom-in">
              <h2 className="text-4xl md:text-7xl font-black mb-4"
                style={{ background: `linear-gradient(135deg, ${COSMOS_STAR}, ${COSMOS_ACCENT})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {sc.cta}
              </h2>
              <p className="text-lg mb-12" style={{ color: `${COSMOS_STAR}35` }}>{sc.ctaDesc}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href={`/${tenant.slug}/contact`}
                  className="px-12 py-5 rounded-full text-sm font-bold tracking-wider transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${COSMOS_ACCENT}, ${COSMOS_ACCENT2})`,
                    color: '#ffffff',
                    boxShadow: `0 0 40px ${COSMOS_ACCENT}30`,
                  }}>
                  تواصل معنا الآن
                </Link>
                {waUrl && (
                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                    className="px-12 py-5 rounded-full text-sm font-bold tracking-wider transition-all hover:scale-105"
                    style={{ border: `1.5px solid ${COSMOS_ACCENT}30`, color: COSMOS_STAR }}>
                    واتساب
                  </a>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ═══════ FOOTER ═══════ */}
        <footer className="py-16 px-6" style={{ backgroundColor: '#030308' }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {tenant.logo_url && <Image src={tenant.logo_url} alt="" width={28} height={28} className="object-contain" />}
                  <span className="font-bold">{tenant.name_ar}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: `${COSMOS_STAR}25` }}>{bio.slice(0, 120)}</p>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-4" style={{ color: COSMOS_ACCENT }}>روابط سريعة</h4>
                <div className="flex flex-col gap-3 text-sm" style={{ color: `${COSMOS_STAR}25` }}>
                  <Link href={`/${tenant.slug}`} className="hover:text-white transition-colors">الرئيسية</Link>
                  <Link href={`/${tenant.slug}/projects`} className="hover:text-white transition-colors">{sc.portfolioLabel}</Link>
                  <Link href={`/${tenant.slug}/contact`} className="hover:text-white transition-colors">تواصل معنا</Link>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-sm mb-4" style={{ color: COSMOS_ACCENT }}>تواصل</h4>
                <div className="flex flex-col gap-2 text-sm" style={{ color: `${COSMOS_STAR}25` }}>
                  {tenant.phone && <a href={`tel:${tenant.phone}`} className="hover:text-white transition-colors" dir="ltr">{tenant.phone}</a>}
                  {tenant.email && <a href={`mailto:${tenant.email}`} className="hover:text-white transition-colors" dir="ltr">{tenant.email}</a>}
                  {tenant.address_ar && <p>{tenant.address_ar}</p>}
                </div>
              </div>
            </div>
            <div className="pt-8 text-center text-xs" style={{ borderTop: `1px solid ${COSMOS_STAR}05`, color: `${COSMOS_STAR}10` }}>
              {tenant.name_ar} — جميع الحقوق محفوظة
            </div>
          </div>
        </footer>

        {/* ═══════ FLOATING ACTIONS ═══════ */}
        <SocialFloat
          whatsapp={waPhone}
          snapchat_url={tenant.snapchat_url}
          tiktok_url={tenant.tiktok_url}
          whatsapp_note={tenant.whatsapp_note}
        />

        {showTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              backgroundColor: `${COSMOS_ACCENT}20`,
              border: `1px solid ${COSMOS_ACCENT}30`,
              boxShadow: `0 0 20px ${COSMOS_ACCENT}15`,
            }}
            aria-label="للأعلى"
          >
            <ArrowUp className="w-4 h-4" style={{ color: COSMOS_ACCENT }} />
          </button>
        )}
      </div>
    </div>
  )
}
