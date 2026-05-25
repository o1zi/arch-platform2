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

const ACCENT = '#22c55e'  // modern green accent

function WhatsAppFloat({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
      style={{ backgroundColor: '#25d366' }}
      aria-label="واتساب"
    >
      <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  )
}

export default function ModernLayout({ tenant, projects, featuredProjects, services: customServices, features: customFeatures, sectorConfig }: ThemeProps) {
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
  const waPhone = tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null
  const stats = SECTOR_STATS[tenant.sector ?? 'engineering'] ?? SECTOR_STATS.engineering
  const testimonials = SECTOR_TESTIMONIALS[tenant.sector ?? 'engineering'] ?? SECTOR_TESTIMONIALS.engineering
  const faqs = SECTOR_FAQ[tenant.sector ?? 'engineering'] ?? SECTOR_FAQ.engineering

  const socials = [
    { url: tenant.instagram_url, label: 'إنستقرام' },
    { url: tenant.twitter_url, label: 'تويتر' },
    { url: tenant.linkedin_url, label: 'لينكدإن' },
    { url: tenant.snapchat_url, label: 'سناب' },
  ].filter(s => s.url)

  const displayedProjects = featuredProjects.length > 0 ? featuredProjects.slice(0, 6) : projects.slice(0, 6)

  return (
    <div className="min-h-screen bg-[#0f0f0f]" dir="rtl">

      {/* شريط السوشيال ميديا العلوي */}
      {socials.length > 0 && (
        <div className="bg-[#0a0a0a] border-b border-white/5 px-6 py-2 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-5 text-xs text-white/30">
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="flex items-center gap-1.5 hover:text-white/60 transition-colors" dir="ltr">
                  <Phone className="w-3 h-3" />{tenant.phone}
                </a>
              )}
              {tenant.email && (
                <a href={`mailto:${tenant.email}`} className="flex items-center gap-1.5 hover:text-white/60 transition-colors">
                  <Mail className="w-3 h-3" />{tenant.email}
                </a>
              )}
            </div>
            <div className="flex items-center gap-3">
              {socials.map(s => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                  className="text-white/25 hover:text-white/70 transition-colors text-[10px] tracking-widest">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0f0f0f]/95 backdrop-blur-md border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo_url && (
              <Image src={tenant.logo_url} alt="" width={32} height={32} className="rounded-full object-cover" />
            )}
            <span className="text-white font-black tracking-tight">{tenant.name_ar}</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <Link href={`/${tenant.slug}`} className="hover:text-white transition-colors">الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} className="hover:text-white transition-colors">{sc.portfolioLabel}</Link>
            <Link href={`/${tenant.slug}/contact`} className="hover:text-white transition-colors">تواصل</Link>
            {waUrl && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-full font-bold text-black transition-colors hover:opacity-90"
                style={{ backgroundColor: ACCENT }}>
                ابدأ مشروعك
              </a>
            )}
          </div>

          {/* Mobile Hamburger */}
          <MobileMenu
            tenantName={tenant.name_ar}
            tenantSlug={tenant.slug}
            logoUrl={tenant.logo_url}
            phone={tenant.phone}
            email={tenant.email}
            portfolioLabel={sc.portfolioLabel}
            accentColor={ACCENT}
            bgColor="#ffffff"
            textColor="#111111"
            variant="dark"
          />
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-[95vh] flex flex-col justify-end pb-16 px-6 pt-16 relative overflow-hidden">
        {/* Video أو صورة الغلاف */}
        {tenant.video_url ? (
          <VideoHero videoUrl={tenant.video_url} overlayOpacity={0.65} />
        ) : tenant.cover_url ? (
          <>
            <Image src={tenant.cover_url} alt="" fill className="object-cover opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#0f0f0f] to-black" />
            {/* زخرفة شبكية */}
            <div className="absolute inset-0 opacity-[0.03]"
              style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          </>
        )}

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <ScrollReveal animation="fade-right" delay={0}>
            <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-4">{sc.label}</p>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-none mb-4 tracking-tight">
              {tenant.name_ar}
            </h1>
          </ScrollReveal>
          {tenant.name_en && (
            <ScrollReveal animation="fade-up" delay={150}>
              <p className="text-white/20 text-lg font-light mb-2" dir="ltr">{tenant.name_en}</p>
            </ScrollReveal>
          )}
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-white/50 max-w-xl leading-relaxed mt-4 text-base">{bio}</p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={300}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={`/${tenant.slug}/projects`}
                className="px-8 py-3.5 font-black text-black transition-opacity hover:opacity-90 rounded-full"
                style={{ backgroundColor: ACCENT }}>
                استعرض {sc.portfolioLabel}
              </Link>
              <Link href={`/${tenant.slug}/contact`}
                className="border border-white/20 text-white px-8 py-3.5 font-medium hover:border-white/50 rounded-full transition-colors">
                تواصل معنا
              </Link>
            </div>
          </ScrollReveal>

          {/* عداد سريع في الـ Hero */}
          {projects.length > 0 && (
            <ScrollReveal animation="fade-up" delay={400}>
              <div className="mt-16 flex flex-wrap gap-10">
                <div>
                  <span className="text-4xl font-black text-white">{projects.length}+</span>
                  <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">{sc.portfolioItemLabel}</p>
                </div>
                <div className="w-px bg-white/10" />
                <div>
                  <span className="text-4xl font-black" style={{ color: ACCENT }}>✓</span>
                  <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">جودة مضمونة</p>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20 z-10">
          <span className="text-[10px] tracking-[0.4em] uppercase">scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <StatsCounter stats={stats} accentColor={ACCENT} textColor="#111111" labelColor="#666666" />
          </ScrollReveal>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-[#0f0f0f] py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <ScrollReveal animation="fade-right">
            <div>
              <p className="text-white/20 text-xs tracking-[0.4em] uppercase mb-4">من نحن</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">{sc.aboutTitle}</h2>
              <p className="text-white/50 leading-loose text-sm">{bio}</p>
              {tenant.address_ar && (
                <p className="mt-6 text-white/30 text-sm flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />{tenant.address_ar}
                </p>
              )}
              <Link href={`/${tenant.slug}/contact`}
                className="inline-block mt-8 border border-white/20 text-white px-8 py-3 text-sm font-medium hover:bg-white hover:text-black transition-colors rounded-full">
                تواصل معنا ←
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={100}>
            {tenant.cover_url ? (
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-xl flex items-center justify-center"
                style={{ backgroundColor: ACCENT + '10', border: `1px solid ${ACCENT}20` }}>
                <span className="text-[120px] font-black" style={{ color: ACCENT + '20' }}>{tenant.name_ar.charAt(0)}</span>
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[#111111] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="mb-16">
              <p className="text-white/20 text-xs tracking-[0.4em] uppercase mb-4">{sc.servicesLabel}</p>
              <h2 className="text-4xl md:text-5xl font-black text-white">ما نقدمه لك</h2>
            </div>
          </ScrollReveal>

          <StaggerReveal
            animation="fade-up"
            stagger={80}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5"
            itemClassName=""
          >
            {(customServices && customServices.length > 0
              ? customServices.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.description ?? '' }))
              : sc.services.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.desc }))
            ).map(({ Icon, title, desc }) => (
              <div key={title} className="bg-[#111111] p-8 hover:bg-white/5 transition-colors group cursor-default">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-6 transition-colors"
                  style={{ backgroundColor: ACCENT + '15' }}>
                  <Icon className="w-5 h-5" style={{ color: ACCENT }} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {displayedProjects.length > 0 && (
        <section className="bg-white py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <p className="text-black/30 text-xs tracking-[0.4em] uppercase mb-3">الأعمال</p>
                  <h2 className="text-4xl md:text-5xl font-black text-black">{sc.featuredLabel}</h2>
                </div>
                <Link href={`/${tenant.slug}/projects`} className="text-black/40 hover:text-black text-sm transition-colors flex items-center gap-2">
                  كل {sc.portfolioLabel} ←
                </Link>
              </div>
            </ScrollReveal>

            <StaggerReveal
              animation="fade-up"
              stagger={100}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayedProjects.map(p => (
                <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
                  className="group block overflow-hidden rounded-xl bg-gray-50">
                  <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                    {p.cover_image_url ? (
                      <Image src={p.cover_image_url} alt={p.title_ar} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-black text-gray-200">{p.title_ar.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                      <span className="text-white text-sm font-medium">عرض التفاصيل →</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-black text-sm mb-1">{p.title_ar}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      {p.category && <span>{p.category}</span>}
                      {p.category && p.year && <span>·</span>}
                      {p.year && <span>{p.year}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </StaggerReveal>
          </div>
        </section>
      )}

      {/* FEATURES / WHY US */}
      <section className="bg-[#0f0f0f] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="mb-16">
              <p className="text-white/20 text-xs tracking-[0.4em] uppercase mb-4">لماذا نحن</p>
              <h2 className="text-4xl md:text-5xl font-black text-white">مزايانا التنافسية</h2>
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
              <div key={title} className="p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Icon className="w-5 h-5" style={{ color: ACCENT }} />
                  <h3 className="font-bold text-white">{title}</h3>
                </div>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
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
          accentColor={ACCENT}
          bgColor="#111111"
          textColor="#ffffff"
          textLight="rgba(255,255,255,0.5)"
          variant="carousel"
        />
      </div>

      {/* FAQ */}
      <FAQ
        items={faqs}
        title="الأسئلة الشائعة"
        accentColor={ACCENT}
        bgColor="#0f0f0f"
        textColor="#ffffff"
        textLight="rgba(255,255,255,0.5)"
        variant="default"
      />

      {/* CTA */}
      <section className="py-24 px-6" style={{ backgroundColor: ACCENT }}>
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal animation="fade-up">
            <h2 className="text-4xl md:text-6xl font-black text-black mb-4">{sc.cta}</h2>
            <p className="text-black/70 text-lg mb-10">{sc.ctaDesc}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${tenant.slug}/contact`}
                className="px-10 py-4 bg-black text-white font-black hover:bg-black/80 transition-colors rounded-full">
                تواصل معنا الآن
              </Link>
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="px-10 py-4 bg-white text-black font-black hover:bg-white/90 transition-colors rounded-full flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" style={{ color: '#25d366' }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  واتساب
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-white/5">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {tenant.logo_url && (
                  <Image src={tenant.logo_url} alt="" width={28} height={28} className="rounded-full" />
                )}
                <span className="text-white font-black">{tenant.name_ar}</span>
              </div>
              <p className="text-white/30 text-xs leading-relaxed">{sc.label}</p>
            </div>
            <div>
              <p className="text-white/50 text-xs tracking-widest uppercase mb-4">روابط سريعة</p>
              <ul className="space-y-2 text-sm text-white/30">
                <li><Link href={`/${tenant.slug}`} className="hover:text-white/70 transition-colors">الرئيسية</Link></li>
                <li><Link href={`/${tenant.slug}/projects`} className="hover:text-white/70 transition-colors">{sc.portfolioLabel}</Link></li>
                <li><Link href={`/${tenant.slug}/contact`} className="hover:text-white/70 transition-colors">تواصل</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-white/50 text-xs tracking-widest uppercase mb-4">تواصل معنا</p>
              <ul className="space-y-2 text-xs text-white/30">
                {tenant.phone && (
                  <li dir="ltr"><a href={`tel:${tenant.phone}`} className="hover:text-white/60 transition-colors flex items-center gap-2">
                    <Phone className="w-3 h-3" />{tenant.phone}
                  </a></li>
                )}
                {tenant.email && (
                  <li><a href={`mailto:${tenant.email}`} className="hover:text-white/60 transition-colors flex items-center gap-2">
                    <Mail className="w-3 h-3" />{tenant.email}
                  </a></li>
                )}
                {tenant.address_ar && (
                  <li className="flex items-start gap-2"><MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />{tenant.address_ar}</li>
                )}
              </ul>
              {socials.length > 0 && (
                <div className="flex gap-3 mt-4">
                  {socials.map(s => (
                    <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                      className="text-white/25 hover:text-white/60 transition-colors text-[10px] tracking-widest">
                      {s.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-white/15 text-xs">© {new Date().getFullYear()} {tenant.name_ar} — جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      {waUrl && <WhatsAppFloat url={waUrl} />}

      {/* Back to Top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
          style={{ backgroundColor: ACCENT }}
          aria-label="للأعلى"
        >
          <ArrowUp className="w-4 h-4 text-black" />
        </button>
      )}
    </div>
  )
}
