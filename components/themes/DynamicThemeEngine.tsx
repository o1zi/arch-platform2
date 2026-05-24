'use client'

import { ThemeProps, CustomThemeConfig } from '@/types'
import { getSectorConfig } from '@/lib/sectors'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Phone, Mail, MapPin, ArrowUp } from 'lucide-react'
import { resolveIcon } from '@/components/themes/iconMap'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

type Section = 'hero' | 'about' | 'services' | 'projects' | 'features' | 'cta' | 'footer'

interface EngineProps extends ThemeProps {
  config: CustomThemeConfig
}

// مساعد لبناء متغيرات CSS
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

function spacingClass(sp: CustomThemeConfig['layout']['spacing']) {
  return { compact: 'py-12', normal: 'py-20', spacious: 'py-32' }[sp]
}

function gridColsClass(cols: number) {
  return { 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' }[cols] ?? 'grid-cols-1 sm:grid-cols-3'
}

export default function DynamicThemeEngine({ config, tenant, projects, featuredProjects, services: customServices, features: customFeatures, sectorConfig }: EngineProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const sc = sectorConfig ?? getSectorConfig(tenant.sector)

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 60); setShowTop(window.scrollY > 400) }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const bio = tenant.bio_ar ?? sc.heroTagline
  const waPhone = tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null
  const sp = spacingClass(config.layout.spacing)
  const br = borderRadiusClass(config.layout.borderRadius)

  const socials = [
    { url: tenant.instagram_url, label: 'إنستقرام' },
    { url: tenant.twitter_url, label: 'تويتر' },
    { url: tenant.linkedin_url, label: 'لينكدإن' },
    { url: tenant.snapchat_url, label: 'سناب شات' },
  ].filter(s => s.url)

  // ── أقسام الصفحة ────────────────────────────────────────────────────────

  const SectionHero = () => {
    const { style, overlayOpacity, textAlign } = config.hero
    const align = textAlign === 'center' ? 'items-center text-center' : textAlign === 'left' ? 'items-start text-left' : 'items-end text-right'
    const isSplit = style === 'split'
    const isCentered = style === 'centered'

    if (isSplit) {
      return (
        <section className="flex flex-col md:flex-row min-h-[80vh]" style={{ backgroundColor: 'var(--c-primary)' }}>
          <div className="flex-1 flex flex-col justify-center px-8 py-16">
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--c-accent)' }}>مكتب هندسي</p>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-none" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-bg)' }}>
              {tenant.name_ar}
            </h1>
            {!tenant.cover_url && <p className="text-sm leading-loose mb-8 max-w-sm" style={{ color: 'var(--c-text-light)' }}>{bio}</p>}
            <div className="flex gap-3 flex-wrap">
              <Link href={`/${tenant.slug}/projects`} className={`px-8 py-3 font-bold transition-opacity hover:opacity-90 ${br}`} style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }}>
                استعرض {sc.portfolioLabel}
              </Link>
              <Link href={`/${tenant.slug}/contact`} className={`px-8 py-3 font-medium border transition-colors hover:opacity-90 ${br}`} style={{ borderColor: 'var(--c-bg)', color: 'var(--c-bg)' }}>
                تواصل معنا
              </Link>
            </div>
          </div>
          <div className="flex-1 relative min-h-[300px] md:min-h-0">
            {tenant.cover_url ? (
              <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--c-secondary)' }}>
                <span className="text-9xl font-black opacity-20" style={{ color: 'var(--c-bg)' }}>{tenant.name_ar.charAt(0)}</span>
              </div>
            )}
          </div>
        </section>
      )
    }

    if (isCentered) {
      return (
        <section className={`${sp} px-6 flex flex-col items-center text-center relative overflow-hidden`} style={{ backgroundColor: 'var(--c-primary)' }}>
          {tenant.cover_url && (
            <>
              <Image src={tenant.cover_url} alt="" fill className="object-cover" style={{ opacity: overlayOpacity }} />
              <div className="absolute inset-0" style={{ backgroundColor: `color-mix(in srgb, var(--c-primary) ${Math.round((1 - overlayOpacity) * 100)}%, transparent)` }} />
            </>
          )}
          <div className="relative z-10 max-w-3xl">
            {tenant.logo_url && <Image src={tenant.logo_url} alt="" width={80} height={80} className={`mx-auto mb-6 object-cover ${br}`} />}
            <h1 className="text-5xl md:text-7xl font-black mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-bg)' }}>{tenant.name_ar}</h1>
            {!tenant.cover_url && <p className="text-sm leading-loose mb-8" style={{ color: 'var(--c-text-light)' }}>{bio}</p>}
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href={`/${tenant.slug}/projects`} className={`px-8 py-3 font-bold ${br}`} style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }}>استعرض {sc.portfolioLabel}</Link>
              <Link href={`/${tenant.slug}/contact`} className={`px-8 py-3 border font-medium ${br}`} style={{ borderColor: 'var(--c-text-light)', color: 'var(--c-bg)' }}>تواصل معنا</Link>
            </div>
          </div>
        </section>
      )
    }

    if (style === 'minimal') {
      return (
        <section className={`${sp} px-8 max-w-4xl mx-auto`}>
          <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: 'var(--c-accent)', fontFamily: 'var(--font-body)' }}>مكتب هندسي</p>
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-none" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>{tenant.name_ar}</h1>
          {!tenant.cover_url && <p className="text-base leading-loose max-w-xl" style={{ color: 'var(--c-text-light)' }}>{bio}</p>}
          <div className="flex gap-3 mt-8 flex-wrap">
            <Link href={`/${tenant.slug}/projects`} className={`px-8 py-3 font-bold ${br}`} style={{ backgroundColor: 'var(--c-text)', color: 'var(--c-bg)' }}>المشاريع</Link>
            <Link href={`/${tenant.slug}/contact`} className={`px-8 py-3 font-medium border ${br}`} style={{ borderColor: 'var(--c-text-light)', color: 'var(--c-text)' }}>تواصل</Link>
          </div>
        </section>
      )
    }

    // fullscreen (default)
    return (
      <section className={`min-h-screen flex flex-col justify-end pb-20 px-6 pt-24 relative overflow-hidden ${align}`}>
        {tenant.cover_url ? (
          <>
            <Image src={tenant.cover_url} alt="" fill className="object-cover" style={{ opacity: overlayOpacity }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, var(--c-primary) 20%, transparent)` }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ backgroundColor: 'var(--c-primary)' }} />
        )}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--c-accent)' }}>مكتب هندسي</p>
          <h1 className="text-6xl md:text-8xl font-black leading-none mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-bg)' }}>
            {tenant.name_ar}
          </h1>
          {!tenant.cover_url && <p className="text-sm leading-loose max-w-sm mb-8" style={{ color: 'var(--c-text-light)' }}>{bio}</p>}
          <div className="flex gap-4 flex-wrap">
            <Link href={`/${tenant.slug}/projects`} className={`px-8 py-3 font-bold transition-opacity hover:opacity-90 ${br}`} style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }}>
              استعرض {sc.portfolioLabel}
            </Link>
            <Link href={`/${tenant.slug}/contact`} className={`px-8 py-3 font-medium border transition-colors ${br}`} style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'var(--c-bg)' }}>
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const SectionAbout = () => (
    <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-bg)' }}>
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--c-accent)' }}>من نحن</p>
          <h2 className="text-4xl font-black mb-8 leading-tight" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>
            نبني أحلامك<br />بدقة وإبداع
          </h2>
          <p className="leading-loose" style={{ color: 'var(--c-text-light)' }}>{bio}</p>
          {tenant.address_ar && (
            <p className="mt-6 text-sm flex items-start gap-2" style={{ color: 'var(--c-text-light)' }}>
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--c-accent)' }} />
              {tenant.address_ar}
            </p>
          )}
          <Link href={`/${tenant.slug}/contact`} className={`inline-block mt-8 px-8 py-3 font-bold border-2 transition-colors ${br}`}
            style={{ borderColor: 'var(--c-text)', color: 'var(--c-text)' }}>
            تواصل معنا
          </Link>
        </div>
        {tenant.cover_url ? (
          <div className={`relative aspect-[4/3] overflow-hidden ${br}`}>
            <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
          </div>
        ) : (
          <div className={`aspect-[4/3] flex items-center justify-center ${br}`} style={{ backgroundColor: 'var(--c-secondary)' }}>
            <span className="text-8xl font-black opacity-30" style={{ color: 'var(--c-text)' }}>{tenant.name_ar.charAt(0)}</span>
          </div>
        )}
      </div>
    </section>
  )

  const SectionServices = () => {
    const items = customServices?.length > 0
      ? customServices.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.description ?? '' }))
      : [
          { Icon: resolveIcon('Building2'), title: 'تصميم معماري', desc: 'تصميم مبدع وعملي يعكس هوية مكانك' },
          { Icon: resolveIcon('Layers'), title: 'تصميم داخلي', desc: 'فضاءات داخلية أنيقة بتفصيل متقن' },
          { Icon: resolveIcon('Eye'), title: 'إشراف على التنفيذ', desc: 'رقابة دقيقة تضمن أعلى معايير الجودة' },
          { Icon: resolveIcon('Lightbulb'), title: 'استشارات هندسية', desc: 'حلول مبتكرة لكل تحديات مشروعك' },
          { Icon: resolveIcon('MapPin'), title: 'تخطيط عمراني', desc: 'مجمعات ومدن تجمع الجمال والوظيفة' },
          { Icon: resolveIcon('ClipboardList'), title: 'إدارة مشاريع', desc: 'تسليم في الوقت المحدد بأعلى كفاءة' },
        ]

    return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-secondary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--c-accent)' }}>خدماتنا</p>
            <h2 className="text-4xl font-black" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-bg)' }}>ما نقدمه لك</h2>
          </div>
          <div className={`grid ${gridColsClass(config.projectsGrid.columns)} gap-6`}>
            {items.map(({ Icon, title, desc }) => (
              <div key={title} className={`p-6 transition-transform hover:-translate-y-1 ${br}`} style={{ backgroundColor: 'var(--c-primary)' }}>
                <Icon className="w-8 h-8 mb-4" style={{ color: 'var(--c-accent)' }} />
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--c-bg)' }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text-light)' }}>{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href={`/${tenant.slug}/contact`} className={`inline-block px-10 py-3 text-sm font-medium border transition-colors ${br}`}
              style={{ borderColor: 'var(--c-accent)', color: 'var(--c-accent)' }}>
              ابدأ مشروعك معنا ←
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const SectionProjects = () => {
    const cols = config.projectsGrid.columns
    const style = config.projectsGrid.style
    const display = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 6)

    if (!display.length) return (
      <section className={`${sp} px-6 text-center`} style={{ backgroundColor: 'var(--c-bg)' }}>
        <h2 className="text-4xl font-black opacity-20" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>المشاريع قريباً</h2>
      </section>
    )

    return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-bg)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--c-accent)' }}>{sc.featuredLabel}</p>
              <h2 className="text-4xl font-black" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>{sc.portfolioItemLabelPlural} مختارة</h2>
            </div>
            <Link href={`/${tenant.slug}/projects`} className="text-sm transition-colors" style={{ color: 'var(--c-text-light)' }}>
              جميع {sc.portfolioLabel} ←
            </Link>
          </div>
          {style === 'list' ? (
            <div className="space-y-4">
              {display.map(p => (
                <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
                  className={`flex gap-4 overflow-hidden group ${br}`} style={{ backgroundColor: 'var(--c-secondary)' }}>
                  {p.cover_image_url && (
                    <div className="relative w-32 h-24 flex-shrink-0">
                      <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover" />
                    </div>
                  )}
                  <div className="p-4 flex flex-col justify-center">
                    <p className="font-bold" style={{ color: 'var(--c-text)' }}>{p.title_ar}</p>
                    {p.category && <p className="text-xs mt-1" style={{ color: 'var(--c-text-light)' }}>{p.category}</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={`grid ${gridColsClass(cols)} gap-4`}>
              {display.map(p => (
                <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
                  className={`relative aspect-square overflow-hidden group ${br}`} style={{ backgroundColor: 'var(--c-secondary)' }}>
                  {p.cover_image_url ? (
                    <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-black opacity-20" style={{ color: 'var(--c-text)' }}>{p.title_ar.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-end p-4">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform opacity-0 group-hover:opacity-100">
                      <p className="font-bold text-white">{p.title_ar}</p>
                      {p.category && <p className="text-xs text-white/70">{p.category}</p>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

  const SectionFeatures = () => {
    const items = customFeatures?.length > 0
      ? customFeatures.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.description ?? '' }))
      : [
          { Icon: resolveIcon('Award'), title: 'خبرة واسعة', desc: 'سنوات من الإبداع والتميز في مجال الهندسة' },
          { Icon: resolveIcon('Users'), title: 'فريق متخصص', desc: 'مهندسون ومصممون بأعلى المؤهلات' },
          { Icon: resolveIcon('Clock'), title: 'الالتزام بالمواعيد', desc: 'نلتزم بالجدول الزمني المتفق عليه' },
          { Icon: resolveIcon('Shield'), title: 'جودة مضمونة', desc: 'معايير صارمة في كل مرحلة من مراحل التنفيذ' },
          { Icon: resolveIcon('Star'), title: 'تصاميم مبتكرة', desc: 'حلول إبداعية تجمع الجمال والعملية' },
          { Icon: resolveIcon('CheckCircle2'), title: 'متابعة مستمرة', desc: 'دعم كامل قبل وأثناء وبعد التنفيذ' },
        ]

    return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-primary)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: 'var(--c-accent)' }}>لماذا نحن</p>
            <h2 className="text-4xl font-black" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-bg)' }}>ما يميزنا</h2>
          </div>
          <div className={`grid ${gridColsClass(config.projectsGrid.columns)} gap-8`}>
            {items.map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${br}`}
                  style={{ backgroundColor: 'var(--c-secondary)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--c-accent)' }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--c-bg)' }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text-light)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  const SectionCTA = () => (
    <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-bg)' }}>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div>
          <h3 className="text-4xl font-black mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>هل لديك مشروع؟</h3>
          <p style={{ color: 'var(--c-text-light)' }}>دعنا نحوّل فكرتك إلى واقع</p>
        </div>
        <div className="flex gap-4 flex-wrap">
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className={`flex items-center gap-2 px-8 py-3 font-bold text-white ${br}`}
              style={{ backgroundColor: '#25D366' }}>
              <WhatsAppIcon />
              واتساب
            </a>
          )}
          <Link href={`/${tenant.slug}/contact`} className={`px-8 py-3 font-bold transition-opacity hover:opacity-90 ${br}`}
            style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }}>
            ابدأ الآن
          </Link>
        </div>
      </div>
    </section>
  )

  const SectionFooter = () => (
    <footer className={`${sp} px-6 border-t`} style={{ backgroundColor: 'var(--c-primary)', borderColor: 'var(--c-secondary)' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            {tenant.logo_url && <Image src={tenant.logo_url} alt="" width={32} height={32} className={`object-cover ${br}`} />}
            <span className="font-bold" style={{ color: 'var(--c-bg)' }}>{tenant.name_ar}</span>
          </div>
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--c-text-light)' }}>{bio}</p>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase mb-6" style={{ color: 'var(--c-text-light)' }}>روابط سريعة</h4>
          <div className="space-y-3">
            {[['/', 'الرئيسية'], ['/projects', sc.portfolioLabel], ['/contact', 'تواصل معنا']].map(([href, label]) => (
              <Link key={href} href={`/${tenant.slug}${href}`} className="block text-sm transition-colors" style={{ color: 'var(--c-text-light)' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase mb-6" style={{ color: 'var(--c-text-light)' }}>تواصل معنا</h4>
          <div className="space-y-3">
            {tenant.phone && (
              <a href={`tel:${tenant.phone}`} className="flex items-center gap-2 text-sm" style={{ color: 'var(--c-text-light)' }} dir="ltr">
                <Phone className="w-4 h-4" style={{ color: 'var(--c-accent)' }} /> {tenant.phone}
              </a>
            )}
            {tenant.email && (
              <a href={`mailto:${tenant.email}`} className="flex items-center gap-2 text-sm" style={{ color: 'var(--c-text-light)' }}>
                <Mail className="w-4 h-4" style={{ color: 'var(--c-accent)' }} /> {tenant.email}
              </a>
            )}
          </div>
          {socials.length > 0 && (
            <div className="flex gap-4 mt-6">
              {socials.map(s => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                  className="text-xs tracking-widest" style={{ color: 'var(--c-text-light)' }}>
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t flex items-center justify-between" style={{ borderColor: 'var(--c-secondary)' }}>
        <p className="text-xs" style={{ color: 'var(--c-text-light)' }}>
          جميع الحقوق محفوظة {new Date().getFullYear()} © {tenant.name_ar}
        </p>
      </div>
    </footer>
  )

  const sectionComponents: Record<Section, React.FC> = {
    hero: SectionHero,
    about: SectionAbout,
    services: SectionServices,
    projects: SectionProjects,
    features: SectionFeatures,
    cta: SectionCTA,
    footer: SectionFooter,
  }

  return (
    <div dir="rtl" style={{ ...buildCSSVars(config), fontFamily: 'var(--font-body)', backgroundColor: 'var(--c-bg)' }}>
      {/* تحميل الخطوط من Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(config.fonts.heading)}:wght@400;700;900&family=${encodeURIComponent(config.fonts.body)}:wght@300;400;500;700&display=swap');
        :root { color: var(--c-text); }
      `}</style>

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}
        style={{ backgroundColor: scrolled ? `color-mix(in srgb, var(--c-primary) 95%, transparent)` : 'var(--c-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo_url && <Image src={tenant.logo_url} alt="" width={32} height={32} className={`object-cover ${br}`} />}
            <span className="font-bold" style={{ color: 'var(--c-bg)' }}>{tenant.name_ar}</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href={`/${tenant.slug}`} className="transition-opacity hover:opacity-70" style={{ color: 'var(--c-bg)' }}>الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} className="transition-opacity hover:opacity-70" style={{ color: 'var(--c-bg)' }}>{sc.portfolioLabel}</Link>
            <Link href={`/${tenant.slug}/contact`} className={`px-4 py-1.5 font-medium ${br}`}
              style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }}>
              تواصل
            </Link>
          </div>
        </div>
      </nav>

      {/* الأقسام بالترتيب من الـ config */}
      {config.layout.sections.map(sectionKey => {
        const Component = sectionComponents[sectionKey as Section]
        return Component ? <Component key={sectionKey} /> : null
      })}

      {/* زر واتساب عائم */}
      {waUrl && (
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className={`fixed bottom-6 left-6 z-50 w-14 h-14 flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform ${br === 'rounded-none' ? 'rounded-none' : 'rounded-full'}`}
          style={{ backgroundColor: '#25D366' }}>
          <WhatsAppIcon />
        </a>
      )}

      {/* زر للأعلى */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 shadow-lg flex items-center justify-center transition-all duration-300 ${showTop ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${br}`}
        style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }}>
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  )
}
