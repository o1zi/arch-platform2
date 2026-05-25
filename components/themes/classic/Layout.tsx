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
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

// Classic: كريمي + بني داكن + ذهبي — موثوقية وأصالة
const CREAM = '#faf6f0'
const DARK = '#2c1f10'
const GOLD = '#8b6914'
const GOLD_LIGHT = '#c9a84c'

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-4 my-8" aria-hidden>
      <div className="h-px flex-1 max-w-20" style={{ backgroundColor: `${GOLD}30` }} />
      <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: GOLD }} />
      <div className="w-2.5 h-2.5 rotate-45 border" style={{ borderColor: GOLD }} />
      <div className="w-1.5 h-1.5 rotate-45" style={{ backgroundColor: GOLD }} />
      <div className="h-px flex-1 max-w-20" style={{ backgroundColor: `${GOLD}30` }} />
    </div>
  )
}

function SectionLabel({ text, centered = false }: { text: string; centered?: boolean }) {
  return (
    <div className={`flex items-center gap-3 mb-6 ${centered ? 'justify-center' : ''}`}>
      <div className="w-8 h-px" style={{ backgroundColor: GOLD }} />
      <p className="text-xs font-semibold tracking-[0.35em] uppercase" style={{ color: GOLD }}>{text}</p>
      <div className="w-8 h-px" style={{ backgroundColor: GOLD }} />
    </div>
  )
}

export default function ClassicLayout({ tenant, projects, featuredProjects, services: customServices, features: customFeatures, sectorConfig, stats: dbStats, testimonials: dbTestimonials, faqs: dbFaqs }: ThemeProps) {
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

  const socials = [
    { url: tenant.instagram_url, label: 'إنستقرام' },
    { url: tenant.twitter_url, label: 'تويتر' },
    { url: tenant.linkedin_url, label: 'لينكدإن' },
    { url: tenant.snapchat_url, label: 'سناب شات' },
  ].filter(s => s.url)

  const displayedProjects = featuredProjects.length > 0 ? featuredProjects.slice(0, 6) : projects.slice(0, 6)

  return (
    <div className="min-h-screen" style={{ backgroundColor: CREAM, color: DARK }} dir="rtl">

      {/* شريط ذهبي علوي */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(to left, transparent, ${GOLD_LIGHT}, ${GOLD}, ${GOLD_LIGHT}, transparent)` }} />

      {/* معلومات التواصل */}
      {(tenant.phone || tenant.email) && (
        <div className="hidden md:block py-2 px-6 border-b text-xs" style={{ borderColor: `${GOLD}20`, backgroundColor: `${GOLD}05` }}>
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6" style={{ color: `${DARK}60` }}>
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity" dir="ltr">
                  <Phone className="w-3 h-3" />{tenant.phone}
                </a>
              )}
              {tenant.email && (
                <a href={`mailto:${tenant.email}`} className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                  <Mail className="w-3 h-3" />{tenant.email}
                </a>
              )}
            </div>
            <div className="flex items-center gap-4">
              {socials.map(s => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity" style={{ color: GOLD, fontSize: '10px', letterSpacing: '0.1em' }}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'shadow-md' : ''}`}
        style={{ backgroundColor: CREAM, borderBottom: `1px solid ${GOLD}15` }}>
        <div className="max-w-6xl mx-auto px-6 h-18 py-4 flex items-center justify-between">
          {/* Logo + Name */}
          <div className="flex items-center gap-3">
            {tenant.logo_url ? (
              <Image src={tenant.logo_url} alt="" width={44} height={44} className="object-contain" />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center font-black text-lg" style={{ color: GOLD, border: `1px solid ${GOLD}`, borderRadius: '2px' }}>
                {tenant.name_ar.charAt(0)}
              </div>
            )}
            <div>
              <div className="font-black text-base leading-tight" style={{ color: DARK, fontFamily: 'Georgia, serif' }}>{tenant.name_ar}</div>
              {tenant.name_en && <div className="text-[10px] tracking-widest opacity-40" dir="ltr" style={{ color: DARK }}>{tenant.name_en}</div>}
            </div>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: `${DARK}80` }}>
            <Link href={`/${tenant.slug}`} className="hover:opacity-100 transition-opacity pb-1 border-b-2 border-transparent hover:border-current">الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} className="hover:opacity-100 transition-opacity pb-1 border-b-2 border-transparent hover:border-current">{sc.portfolioLabel}</Link>
            <Link href={`/${tenant.slug}/contact`} className="hover:opacity-100 transition-opacity pb-1 border-b-2 border-transparent hover:border-current">تواصل</Link>
            <Link href={`/${tenant.slug}/contact`}
              className="px-5 py-2 text-sm font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: GOLD, color: CREAM, borderRadius: '2px' }}>
              استشارة مجانية
            </Link>
          </div>

          <MobileMenu
            tenantName={tenant.name_ar}
            tenantSlug={tenant.slug}
            logoUrl={tenant.logo_url}
            phone={tenant.phone}
            email={tenant.email}
            portfolioLabel={sc.portfolioLabel}
            accentColor={GOLD}
            bgColor={CREAM}
            textColor={DARK}
            variant="light"
          />
        </div>
      </nav>

      {/* HERO — Centered, رصين وموثوق */}
      <section className="relative overflow-hidden py-24 px-6" style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', backgroundColor: DARK }}>
        {tenant.cover_url && (
          <>
            <Image src={tenant.cover_url} alt="" fill className="object-cover opacity-10" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${DARK}, ${DARK}cc, ${DARK}80)` }} />
          </>
        )}
        {!tenant.cover_url && (
          <>
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
            />
          </>
        )}

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <ScrollReveal animation="fade-up">
            <SectionLabel text={sc.label} centered />
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight" style={{ color: CREAM, fontFamily: 'Georgia, serif' }}>
              {tenant.name_ar}
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <Ornament />
            <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: `${CREAM}80` }}>{bio}</p>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={200}>
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link href={`/${tenant.slug}/projects`}
                className="px-8 py-3.5 font-semibold transition-colors hover:opacity-90"
                style={{ backgroundColor: GOLD, color: CREAM }}>
                استعرض {sc.portfolioLabel}
              </Link>
              <Link href={`/${tenant.slug}/contact`}
                className="px-8 py-3.5 font-semibold border transition-colors hover:opacity-70"
                style={{ borderColor: `${CREAM}40`, color: CREAM }}>
                تواصل معنا
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6" style={{ backgroundColor: `${GOLD}10`, borderTop: `1px solid ${GOLD}20`, borderBottom: `1px solid ${GOLD}20` }}>
        <div className="max-w-5xl mx-auto">
          <ScrollReveal animation="fade-up">
            <StatsCounter stats={stats} accentColor={GOLD} textColor={DARK} labelColor={`${DARK}60`} />
          </ScrollReveal>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 px-6" style={{ backgroundColor: CREAM }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <ScrollReveal animation="fade-right">
            {tenant.cover_url ? (
              <div className="relative aspect-[4/3] overflow-hidden" style={{ border: `1px solid ${GOLD}25` }}>
                <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
              </div>
            ) : (
              <div className="aspect-[4/3] flex items-center justify-center"
                style={{ backgroundColor: `${GOLD}08`, border: `1px solid ${GOLD}25` }}>
                <div className="text-center">
                  <div className="text-7xl font-black mb-2" style={{ color: GOLD, opacity: 0.3, fontFamily: 'Georgia, serif' }}>{tenant.name_ar.charAt(0)}</div>
                  <p className="text-xs tracking-widest" style={{ color: GOLD }}>منذ التأسيس</p>
                </div>
              </div>
            )}
          </ScrollReveal>

          <ScrollReveal animation="fade-left" delay={100}>
            <SectionLabel text="من نحن" />
            <h2 className="text-3xl md:text-4xl font-black mb-6 leading-tight" style={{ color: DARK, fontFamily: 'Georgia, serif' }}>{sc.aboutTitle}</h2>
            <Ornament />
            <p className="leading-loose text-sm" style={{ color: `${DARK}70` }}>{bio}</p>
            {tenant.address_ar && (
              <p className="mt-6 text-sm flex items-start gap-2" style={{ color: `${DARK}50` }}>
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: GOLD }} />{tenant.address_ar}
              </p>
            )}
            <Link href={`/${tenant.slug}/contact`}
              className="inline-block mt-8 px-8 py-3 text-sm font-semibold transition-colors hover:opacity-90"
              style={{ backgroundColor: DARK, color: CREAM }}>
              تواصل معنا
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-24 px-6" style={{ backgroundColor: `${DARK}06` }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <SectionLabel text={sc.servicesLabel} centered />
              <h2 className="text-3xl md:text-5xl font-black" style={{ color: DARK, fontFamily: 'Georgia, serif' }}>خدماتنا المتخصصة</h2>
              <Ornament />
            </div>
          </ScrollReveal>

          <StaggerReveal
            animation="fade-up"
            stagger={100}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(customServices && customServices.length > 0
              ? customServices.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.description ?? '' }))
              : sc.services.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.desc }))
            ).map(({ Icon, title, desc }) => (
              <div key={title} className="p-6 border transition-shadow hover:shadow-md"
                style={{ borderColor: `${GOLD}20`, backgroundColor: CREAM }}>
                <div className="w-12 h-12 flex items-center justify-center mb-5 border" style={{ borderColor: `${GOLD}30`, color: GOLD }}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base mb-2" style={{ color: DARK, fontFamily: 'Georgia, serif' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: `${DARK}60` }}>{desc}</p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {displayedProjects.length > 0 && (
        <section className="py-24 px-6" style={{ backgroundColor: CREAM }}>
          <div className="max-w-6xl mx-auto">
            <ScrollReveal animation="fade-up">
              <div className="text-center mb-16">
                <SectionLabel text="الأعمال" centered />
                <h2 className="text-3xl md:text-5xl font-black" style={{ color: DARK, fontFamily: 'Georgia, serif' }}>{sc.featuredLabel}</h2>
                <Ornament />
              </div>
            </ScrollReveal>

            <StaggerReveal
              animation="fade-up"
              stagger={100}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {displayedProjects.map(p => (
                <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`} className="group block">
                  <div className="aspect-[4/3] relative overflow-hidden" style={{ border: `1px solid ${GOLD}15` }}>
                    {p.cover_image_url ? (
                      <Image src={p.cover_image_url} alt={p.title_ar} fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${GOLD}08` }}>
                        <span className="text-4xl font-black" style={{ color: GOLD, opacity: 0.3 }}>{p.title_ar.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      style={{ backgroundColor: `${DARK}80` }}>
                      <span className="text-sm font-semibold" style={{ color: CREAM }}>عرض التفاصيل</span>
                    </div>
                  </div>
                  <div className="p-3 border-x border-b" style={{ borderColor: `${GOLD}15` }}>
                    <h3 className="font-bold text-sm" style={{ color: DARK }}>{p.title_ar}</h3>
                    {(p.category || p.year) && (
                      <p className="text-xs mt-1" style={{ color: `${DARK}50` }}>{p.category}{p.category && p.year ? ' · ' : ''}{p.year}</p>
                    )}
                  </div>
                </Link>
              ))}
            </StaggerReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <div className="text-center mt-12">
                <Link href={`/${tenant.slug}/projects`}
                  className="inline-block border px-8 py-3 text-sm font-semibold transition-colors hover:opacity-80"
                  style={{ borderColor: DARK, color: DARK }}>
                  كل {sc.portfolioLabel} →
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="py-24 px-6" style={{ backgroundColor: DARK }}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-16">
              <SectionLabel text="لماذا نحن" centered />
              <h2 className="text-3xl md:text-5xl font-black" style={{ color: CREAM, fontFamily: 'Georgia, serif' }}>مزايانا الراسخة</h2>
              <Ornament />
            </div>
          </ScrollReveal>

          <StaggerReveal
            animation="fade-up"
            stagger={100}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(customFeatures && customFeatures.length > 0
              ? customFeatures.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.description ?? '' }))
              : sc.features.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.desc }))
            ).map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5" style={{ borderRight: `2px solid ${GOLD}`, borderBottom: `1px solid ${GOLD}10` }}>
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: GOLD_LIGHT }} />
                <div>
                  <h3 className="font-bold text-sm mb-1" style={{ color: CREAM }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: `${CREAM}50` }}>{desc}</p>
                </div>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials
        testimonials={testimonials}
        title="شهادات عملائنا الكرام"
        accentColor={GOLD}
        bgColor={CREAM}
        textColor={DARK}
        textLight={`${DARK}65`}
        variant="quote"
      />

      {/* FAQ */}
      <FAQ
        items={faqs}
        title="أسئلة شائعة"
        accentColor={GOLD}
        bgColor={`${GOLD}08`}
        textColor={DARK}
        textLight={`${DARK}60`}
        variant="bordered"
      />

      {/* CTA */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: DARK }}>
        <div className="max-w-3xl mx-auto">
          <ScrollReveal animation="fade-up">
            <SectionLabel text="تواصل معنا" centered />
            <h2 className="text-3xl md:text-5xl font-black mb-4" style={{ color: CREAM, fontFamily: 'Georgia, serif' }}>{sc.cta}</h2>
            <Ornament />
            <p className="text-sm leading-relaxed mb-10" style={{ color: `${CREAM}60` }}>{sc.ctaDesc}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${tenant.slug}/contact`}
                className="px-10 py-4 font-bold transition-opacity hover:opacity-90"
                style={{ backgroundColor: GOLD, color: CREAM }}>
                تواصل معنا
              </Link>
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="px-10 py-4 font-bold border transition-opacity hover:opacity-70 flex items-center gap-2"
                  style={{ borderColor: `${CREAM}30`, color: CREAM }}>
                  واتساب
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6" style={{ backgroundColor: `${DARK}f5`, borderTop: `1px solid ${GOLD}20` }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            {tenant.logo_url && (
              <Image src={tenant.logo_url} alt="" width={48} height={48} className="mx-auto mb-3 object-contain" />
            )}
            <p className="font-black text-base" style={{ color: GOLD_LIGHT, fontFamily: 'Georgia, serif' }}>{tenant.name_ar}</p>
            <p className="text-xs mt-1" style={{ color: `${CREAM}30` }}>{sc.label}</p>
            {socials.length > 0 && (
              <div className="flex justify-center gap-4 mt-4">
                {socials.map(s => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                    className="text-xs hover:opacity-80 transition-opacity"
                    style={{ color: `${CREAM}40`, letterSpacing: '0.05em' }}>{s.label}</a>
                ))}
              </div>
            )}
          </div>
          <div className="h-px mb-6" style={{ background: `linear-gradient(to left, transparent, ${GOLD}30, transparent)` }} />
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs" style={{ color: `${CREAM}20` }}>
            <p>© {new Date().getFullYear()} {tenant.name_ar} — جميع الحقوق محفوظة</p>
            <div className="flex items-center gap-4">
              <Link href={`/${tenant.slug}`} className="hover:opacity-60 transition-opacity">الرئيسية</Link>
              <Link href={`/${tenant.slug}/projects`} className="hover:opacity-60 transition-opacity">{sc.portfolioLabel}</Link>
              <Link href={`/${tenant.slug}/contact`} className="hover:opacity-60 transition-opacity">تواصل</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Social Float Buttons */}
      <SocialFloat
        whatsapp={waPhone}
        snapchat_url={tenant.snapchat_url}
        tiktok_url={tenant.tiktok_url}
        whatsapp_note={tenant.whatsapp_note}
      />

      {/* Back to Top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center shadow-lg transition-all hover:opacity-90"
          style={{ backgroundColor: GOLD, color: CREAM }}
          aria-label="للأعلى"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
