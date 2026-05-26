'use client'

import { ThemeProps, CustomThemeConfig } from '@/types'
import { getSectorConfig } from '@/lib/sectors'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { Phone, Mail, MapPin, ArrowUp, ChevronDown, CheckCircle } from 'lucide-react'
import { resolveIcon } from '@/components/themes/iconMap'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'
import { Testimonials, SECTOR_TESTIMONIALS } from '@/components/themes/shared/Testimonials'
import { FAQ, SECTOR_FAQ } from '@/components/themes/shared/FAQ'

// ── WhatsApp SVG ─────────────────────────────────────────────────────────────
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

type SectionKey = 'hero' | 'about' | 'services' | 'projects' | 'features' | 'testimonials' | 'faq' | 'cta' | 'footer'

interface EngineProps extends ThemeProps {
  config: CustomThemeConfig
}

// ── CSS Variables ─────────────────────────────────────────────────────────────
function buildCSSVars(config: CustomThemeConfig): React.CSSProperties {
  const c = config.colors
  const f = config.fonts
  const lsMap = { tight: '-0.02em', normal: '0', wide: '0.05em', wider: '0.1em' }
  const lhMap = { tight: '1.2', normal: '1.5', relaxed: '1.7', loose: '2' }
  const bsMap = { sm: '0.875rem', md: '1rem', lg: '1.125rem' }

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
function brClass(br: CustomThemeConfig['layout']['borderRadius']) {
  return { none: 'rounded-none', sm: 'rounded', md: 'rounded-md', lg: 'rounded-xl', full: 'rounded-full' }[br]
}
function spClass(sp: CustomThemeConfig['layout']['spacing']) {
  return { compact: 'py-12', normal: 'py-20', spacious: 'py-28' }[sp]
}
function maxWClass(mw: CustomThemeConfig['layout']['maxWidth']) {
  return { narrow: 'max-w-4xl', normal: 'max-w-7xl', wide: 'max-w-screen-2xl', full: 'w-full px-4' }[mw ?? 'normal']
}
function gridColsClass(cols: number) {
  return { 2: 'grid-cols-1 sm:grid-cols-2', 3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', 4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' }[cols] ?? 'grid-cols-1 sm:grid-cols-3'
}
function imageRatioClass(r: string | undefined) {
  return { square: 'aspect-square', '4/3': 'aspect-[4/3]', '16/9': 'aspect-video', '3/4': 'aspect-[3/4]', dynamic: 'aspect-[4/3]' }[r ?? 'square']
}

function cardStyleVars(style: string | undefined, glass: boolean): React.CSSProperties {
  if (style === 'glass' || glass) return { backgroundColor: 'var(--c-card-bg)', backdropFilter: 'blur(12px)', border: '1px solid var(--c-border)' }
  if (style === 'elevated')       return { backgroundColor: 'var(--c-card-bg)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }
  if (style === 'bordered')       return { backgroundColor: 'transparent', border: '1px solid var(--c-border)' }
  if (style === 'ghost')          return { backgroundColor: 'transparent' }
  if (style === 'filled')         return { backgroundColor: 'var(--c-primary)' }
  return { backgroundColor: 'var(--c-card-bg)' }
}

function cardHoverClass(effect: string | undefined, globalLift: boolean) {
  const e = effect ?? (globalLift ? 'lift' : 'lift')
  return {
    lift:   'hover:-translate-y-2 transition-transform duration-300 cursor-pointer',
    glow:   'hover:shadow-xl transition-shadow duration-300 cursor-pointer',
    scale:  'hover:scale-105 transition-transform duration-300 cursor-pointer',
    border: 'hover:border-[var(--c-accent)] transition-colors duration-300 cursor-pointer',
    fill:   'hover:bg-[var(--c-accent)] hover:text-[var(--c-bg)] transition-colors duration-300 cursor-pointer',
    none:   '',
  }[e] ?? 'hover:-translate-y-1 transition-transform duration-300'
}

function btnStyleVars(style: string | undefined, glow: boolean, scale: boolean): { className: string; style: React.CSSProperties } {
  const base = `font-bold transition-all duration-200 inline-flex items-center gap-2 ${scale ? 'hover:scale-105' : ''}`
  const glowShadow = glow ? { boxShadow: '0 0 20px var(--c-accent)55' } : {}
  if (style === 'outline')   return { className: `${base} border-2`, style: { borderColor: 'var(--c-accent)', color: 'var(--c-accent)', ...glowShadow } }
  if (style === 'ghost')     return { className: `${base}`, style: { color: 'var(--c-accent)' } }
  if (style === 'gradient')  return { className: `${base} text-white`, style: { background: `linear-gradient(135deg, var(--c-accent), var(--c-accent2))`, ...glowShadow } }
  if (style === 'pill')      return { className: `${base} rounded-full px-8`, style: { backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)', ...glowShadow } }
  return { className: base, style: { backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)', ...glowShadow } }
}

function iconShapeClass(shape: string | undefined, br: string) {
  if (shape === 'circle')  return 'rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0'
  if (shape === 'diamond') return 'w-10 h-10 rotate-45 flex items-center justify-center flex-shrink-0'
  if (shape === 'none')    return 'flex-shrink-0'
  if (shape === 'rounded') return `${br} w-12 h-12 flex items-center justify-center flex-shrink-0`
  return `rounded w-10 h-10 flex items-center justify-center flex-shrink-0` // square
}

function accentBarStyle(pos: string | undefined): React.CSSProperties {
  if (!pos || pos === 'none') return {}
  const size = '3px'
  if (pos === 'right')  return { borderRight:  `${size} solid var(--c-accent)` }
  if (pos === 'left')   return { borderLeft:   `${size} solid var(--c-accent)` }
  if (pos === 'top')    return { borderTop:    `${size} solid var(--c-accent)` }
  if (pos === 'bottom') return { borderBottom: `${size} solid var(--c-accent)` }
  return {}
}

function patternCSS(pattern: string | undefined) {
  if (pattern === 'dots')     return `radial-gradient(circle, var(--c-text) 1px, transparent 1px)`
  if (pattern === 'grid')     return `linear-gradient(var(--c-text) 1px, transparent 1px), linear-gradient(90deg, var(--c-text) 1px, transparent 1px)`
  if (pattern === 'diagonal') return `repeating-linear-gradient(45deg, var(--c-text) 0, var(--c-text) 1px, transparent 0, transparent 50%)`
  if (pattern === 'cross')    return `repeating-linear-gradient(0deg, var(--c-text) 0, var(--c-text) 1px, transparent 0, transparent 24px), repeating-linear-gradient(90deg, var(--c-text) 0, var(--c-text) 1px, transparent 0, transparent 24px)`
  return undefined
}

function overlayGradient(style: string | undefined, opacity: number): React.CSSProperties {
  const a = opacity
  if (style === 'flat')     return { background: `rgba(0,0,0,${a})` }
  if (style === 'radial')   return { background: `radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,${a}) 100%)` }
  if (style === 'vignette') return { background: `radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,${a}) 100%)` }
  if (style === 'diagonal') return { background: `linear-gradient(135deg, rgba(0,0,0,${a}) 0%, transparent 60%)` }
  // gradient (default)
  return { background: `linear-gradient(to top, var(--c-primary) 0%, rgba(0,0,0,${a * 0.6}) 60%, transparent 100%)` }
}

// ── Fade Section Wrapper ──────────────────────────────────────────────────────
function FadeIn({ children, enabled }: { children: React.ReactNode; enabled: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(!enabled)
  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.08 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [enabled])
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: 'opacity 0.65s ease, transform 0.65s ease',
    }}>
      {children}
    </div>
  )
}

// ── Divider ───────────────────────────────────────────────────────────────────
function SectionDivider({ style }: { style: string | undefined }) {
  if (!style || style === 'none') return null
  if (style === 'line')     return <div className="h-px w-full" style={{ backgroundColor: 'var(--c-border)' }} />
  if (style === 'gradient') return <div className="h-px w-full" style={{ background: 'linear-gradient(to right, transparent, var(--c-accent), transparent)' }} />
  if (style === 'dots-row') return <div className="flex justify-center gap-2 py-1">{[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: i===1 ? 'var(--c-accent)' : 'var(--c-border)' }} />)}</div>
  if (style === 'slash')    return <div className="flex justify-center py-1"><div className="w-16 h-0.5 rotate-12 origin-center" style={{ backgroundColor: 'var(--c-accent)' }} /></div>
  if (style === 'wave')     return (
    <svg viewBox="0 0 1200 40" className="w-full h-8" preserveAspectRatio="none">
      <path d="M0,20 C150,40 350,0 600,20 C850,40 1050,0 1200,20 L1200,40 L0,40 Z" fill="var(--c-bg)" />
    </svg>
  )
  return null
}

// ── Accent Line on Heading ────────────────────────────────────────────────────
function AccentTag({ label, show }: { label: string; show: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {show && <div className="w-8 h-0.5" style={{ backgroundColor: 'var(--c-accent)' }} />}
      <p className="text-xs tracking-[0.35em] uppercase" style={{ color: 'var(--c-accent)', fontFamily: 'var(--font-body)' }}>{label}</p>
      {show && <div className="flex-1 h-px max-w-[40px]" style={{ backgroundColor: 'var(--c-accent)', opacity: 0.3 }} />}
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
export default function DynamicThemeEngine({
  config, tenant, projects, featuredProjects,
  services: customServices, features: customFeatures, sectorConfig,
  testimonials: rawTestimonials, faqs: rawFaqs,
}: EngineProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop]   = useState(false)
  const sc  = sectorConfig ?? getSectorConfig(tenant.sector)
  const br  = brClass(config.layout.borderRadius)
  const sp  = spClass(config.layout.spacing)
  const mw  = maxWClass(config.layout.maxWidth)
  const fx  = config.effects ?? {}
  const dec = config.decorations ?? {}
  const nav = config.navigation ?? {}
  const sec = config.sections ?? {}
  const cards = useMemo(() => config.cards ?? {}, [config.cards])
  const btns  = useMemo(() => config.buttons ?? {}, [config.buttons])

  const accentLine = dec.accentLine ?? false
  const fade       = fx.sectionFade ?? false
  const glassCards = fx.glassEffect ?? false
  const divider    = dec.sectionDivider ?? 'none'
  const pattern    = dec.backgroundPattern ?? 'none'
  const patOp      = dec.patternOpacity ?? 0.04

  const bio       = tenant.bio_ar  // النص الكامل — يظهر فقط في قسم "من نحن"
  const heroTagline = sc.heroTagline // شعار قصير للهيرو
  const waNum  = (tenant.whatsapp ?? tenant.phone)?.replace(/\D/g, '')
  const waUrl  = waNum ? `https://wa.me/${waNum}` : null
  const btnS   = btns.style ?? 'solid'
  const btnGlow = btns.glow ?? false
  const btnScale = (btns.hoverScale ?? false) || fx.buttonScale

  useEffect(() => {
    const fn = () => { setScrolled(window.scrollY > 60); setShowTop(window.scrollY > 400) }
    window.addEventListener('scroll', fn, { passive: true })
    if (fx.smoothScroll) document.documentElement.style.scrollBehavior = 'smooth'
    return () => window.removeEventListener('scroll', fn)
  }, [fx.smoothScroll])

  const socials = [
    { url: tenant.instagram_url, label: 'إنستقرام', icon: '📷' },
    { url: tenant.twitter_url,   label: 'تويتر',    icon: '𝕏'  },
    { url: tenant.linkedin_url,  label: 'لينكدإن',  icon: 'in' },
    { url: tenant.snapchat_url,  label: 'سناب',     icon: '👻' },
    { url: tenant.tiktok_url,    label: 'تيك توك',  icon: '♪'  },
  ].filter(s => s.url)

  // ── Global CSS injection ───────────────────────────────────────────────────
  const globalCSS = `
    @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(config.fonts.heading)}:wght@400;600;700;800;900&family=${encodeURIComponent(config.fonts.body)}:wght@300;400;500;700&display=swap');
    * { box-sizing: border-box; }
    ${fx.animatedUnderline ? `a { text-decoration: none; position: relative; }
    a::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:1px; background:var(--c-accent); transition:width .3s ease; }
    a:hover::after { width:100%; }` : ''}
    ${fx.pulseAccent ? `@keyframes pulse-accent { 0%,100%{ box-shadow:0 0 0 0 var(--c-accent)44 } 50%{ box-shadow:0 0 0 8px transparent } }` : ''}
    ${fx.accentGlow  ? `.btn-accent-glow { box-shadow: 0 0 18px var(--c-accent)55; }
    .btn-accent-glow:hover { box-shadow: 0 0 28px var(--c-accent)88; }` : ''}
    ${dec.sectionLabel ? `
    .section-label-bg { position:relative; overflow:hidden; }
    .section-label-bg::before { content:attr(data-label); position:absolute; right:-20px; top:50%; transform:translateY(-50%); font-size:9rem; font-weight:900; opacity:0.03; color:var(--c-text); pointer-events:none; white-space:nowrap; }` : ''}
    ${config.fonts.uppercase ? `.heading-text { text-transform:uppercase; letter-spacing:0.06em; }` : ''}
  `

  // Pattern background style
  const patStyle: React.CSSProperties = pattern !== 'none' ? {
    backgroundImage: patternCSS(pattern),
    backgroundSize: pattern === 'diagonal' ? '8px 8px' : pattern === 'cross' ? '24px 24px' : '24px 24px',
    backgroundPosition: '0 0',
  } : {}

  // Primary button
  const PrimaryBtn = useCallback(({ href, children }: { href: string; children: React.ReactNode }) => {
    const { className: bClass, style: bStyle } = btnStyleVars(btnS, btnGlow, !!btnScale)
    const rounded = btns.style === 'pill' ? 'rounded-full' : br
    const size = btns.size === 'sm' ? 'px-5 py-2 text-sm' : btns.size === 'lg' ? 'px-10 py-4 text-lg' : 'px-8 py-3'
    return (
      <Link href={href} className={`${bClass} ${rounded} ${size} ${btnGlow ? 'btn-accent-glow' : ''} ${btns.uppercase ? 'uppercase tracking-wider text-sm' : ''}`} style={bStyle}>
        {children}
      </Link>
    )
  }, [btnS, btnGlow, btnScale, br, btns])

  const OutlineBtn = useCallback(({ href, children }: { href: string; children: React.ReactNode }) => {
    const rounded = btns.style === 'pill' ? 'rounded-full' : br
    const size = btns.size === 'sm' ? 'px-5 py-2 text-sm' : btns.size === 'lg' ? 'px-10 py-4 text-lg' : 'px-8 py-3'
    return (
      <Link href={href} className={`font-medium border transition-all ${rounded} ${size} hover:opacity-80 ${btnScale ? 'hover:scale-105' : ''}`}
        style={{ borderColor: 'rgba(255,255,255,0.35)', color: 'var(--c-nav-text)' }}>
        {children}
      </Link>
    )
  }, [br, btns, btnScale])

  // ── Nav ────────────────────────────────────────────────────────────────────
  const navH   = nav.height === 'compact' ? 'h-14' : nav.height === 'tall' ? 'h-20' : 'h-16'
  const navPos = nav.position === 'static' ? '' : nav.position === 'fixed' ? 'fixed top-0 left-0 right-0' : 'sticky top-0'

  function navBgStyle(): React.CSSProperties {
    if (nav.style === 'transparent' && !scrolled) return { backgroundColor: 'transparent' }
    if (nav.style === 'blur' || nav.style === 'glass') return {
      backgroundColor: scrolled ? `${config.colors.navBg ?? config.colors.primary}ee` : `${config.colors.navBg ?? config.colors.primary}88`,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
    }
    return { backgroundColor: 'var(--c-nav-bg)' }
  }

  const logoSz = nav.logoSize === 'sm' ? 24 : nav.logoSize === 'lg' ? 44 : 32

  // ── HERO ──────────────────────────────────────────────────────────────────
  const SectionHero = () => {
    const h = config.hero
    const align = h.textAlign === 'center' ? 'items-center text-center' : h.textAlign === 'left' ? 'items-start text-left' : 'items-end text-right'
    const heroH = h.height === 'half' ? 'min-h-[55vh]' : h.height === 'tall' ? 'min-h-[100vh]' : 'min-h-screen'
    const ctaP = h.ctaPrimaryText ?? `استعرض ${sc.portfolioLabel}`
    const ctaS = h.ctaSecondaryText ?? 'تواصل معنا'
    const tag  = h.tagOverride ?? sc.label

    if (h.style === 'split' || h.style === 'split-reverse') {
      const reverse = h.style === 'split-reverse'
      return (
        <section className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} min-h-[80vh]`}
          style={{ backgroundColor: 'var(--c-primary)' }}>
          <div className="flex-1 flex flex-col justify-center px-10 py-20" dir="rtl">
            <AccentTag label={tag} show={accentLine} />
            <h1 className={`text-5xl md:text-7xl leading-none mb-6 heading-text`}
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-hw)' as never, color: 'var(--c-nav-text)' }}>
              {tenant.name_ar}
            </h1>
            {heroTagline && <p className="text-sm leading-loose mb-10 max-w-md opacity-70" style={{ color: 'var(--c-nav-text)', lineHeight: 'var(--line-h)' }}>{heroTagline}</p>}
            <div className="flex gap-3 flex-wrap">
              <PrimaryBtn href={`/${tenant.slug}/projects`}>{ctaP}</PrimaryBtn>
              <OutlineBtn href={`/${tenant.slug}/contact`}>{ctaS}</OutlineBtn>
            </div>
          </div>
          <div className="flex-1 relative min-h-[320px] md:min-h-0">
            {tenant.cover_url
              ? <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
              : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: 'var(--c-secondary)' }}>
                  <span className="text-[10rem] font-black opacity-10" style={{ color: 'var(--c-nav-text)' }}>{tenant.name_ar.charAt(0)}</span>
                </div>
            }
          </div>
        </section>
      )
    }

    if (h.style === 'centered') {
      return (
        <section className={`${heroH} flex flex-col items-center justify-center text-center relative overflow-hidden px-6`}>
          {tenant.cover_url && (
            <>
              <Image src={tenant.cover_url} alt="" fill className="object-cover" />
              <div className="absolute inset-0" style={overlayGradient(h.overlayStyle, h.overlayOpacity)} />
            </>
          )}
          {!tenant.cover_url && <div className="absolute inset-0" style={{ backgroundColor: 'var(--c-primary)' }} />}
          <div className="relative z-10 max-w-3xl" dir="rtl">
            {h.showLogo && tenant.logo_url && <Image src={tenant.logo_url} alt="" width={70} height={70} className={`mx-auto mb-8 object-cover ${br}`} />}
            <AccentTag label={tag} show={accentLine} />
            <h1 className="text-5xl md:text-8xl leading-none mb-6 heading-text"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-hw)' as never, color: 'var(--c-nav-text)' }}>
              {tenant.name_ar}
            </h1>
            {heroTagline && <p className="text-sm mb-10 max-w-lg mx-auto opacity-70" style={{ color: 'var(--c-nav-text)', lineHeight: 'var(--line-h)' }}>{heroTagline}</p>}
            <div className="flex gap-3 justify-center flex-wrap">
              <PrimaryBtn href={`/${tenant.slug}/projects`}>{ctaP}</PrimaryBtn>
              <OutlineBtn href={`/${tenant.slug}/contact`}>{ctaS}</OutlineBtn>
            </div>
          </div>
          {h.showScrollIndicator && (
            <button onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-50 hover:opacity-100 transition-opacity animate-bounce">
              <ChevronDown className="w-8 h-8" style={{ color: 'var(--c-nav-text)' }} />
            </button>
          )}
        </section>
      )
    }

    if (h.style === 'minimal') {
      return (
        <section className={`${sp} px-8`} style={{ backgroundColor: 'var(--c-bg)', ...patStyle }} dir="rtl">
          {pattern !== 'none' && <div className="absolute inset-0 pointer-events-none" style={{ ...patStyle, opacity: patOp }} />}
          <div className={`${mw} mx-auto`}>
            <AccentTag label={tag} show={accentLine} />
            <h1 className="text-6xl md:text-9xl leading-none mb-8 heading-text"
              style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-hw)' as never, color: 'var(--c-text)' }}>
              {tenant.name_ar}
            </h1>
            {heroTagline && <p className="text-base max-w-xl mb-10" style={{ color: 'var(--c-text-light)', lineHeight: 'var(--line-h)' }}>{heroTagline}</p>}
            <div className="flex gap-3 flex-wrap">
              <PrimaryBtn href={`/${tenant.slug}/projects`}>{ctaP}</PrimaryBtn>
              <Link href={`/${tenant.slug}/contact`} className={`px-8 py-3 font-medium border transition-colors ${br} hover:opacity-70`}
                style={{ borderColor: 'var(--c-border)', color: 'var(--c-text)' }}>{ctaS}</Link>
            </div>
          </div>
        </section>
      )
    }

    if (h.style === 'cinematic') {
      return (
        <section className={`${heroH} relative overflow-hidden flex flex-col justify-end pb-24 px-8 ${align}`}>
          {tenant.cover_url
            ? <Image src={tenant.cover_url} alt="" fill className="object-cover scale-105" style={{ filter: 'saturate(1.1)' }} />
            : <div className="absolute inset-0" style={{ backgroundColor: 'var(--c-primary)' }} />
          }
          <div className="absolute inset-0" style={overlayGradient(h.overlayStyle ?? 'vignette', h.overlayOpacity)} />
          <div className="absolute top-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(to bottom, var(--c-primary)60, transparent)' }} />
          <div className="relative z-10 max-w-7xl mx-auto w-full" dir="rtl">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-px" style={{ backgroundColor: 'var(--c-accent)' }} />
              <span className="text-xs tracking-[0.4em] uppercase" style={{ color: 'var(--c-accent)' }}>{tag}</span>
            </div>
            <h1 className="text-7xl md:text-[9rem] leading-none mb-6 heading-text" style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-hw)' as never, color: 'var(--c-nav-text)' }}>
              {tenant.name_ar}
            </h1>
            {heroTagline && <p className="text-base mb-10 max-w-lg opacity-60" style={{ color: 'var(--c-nav-text)', lineHeight: 'var(--line-h)' }}>{heroTagline}</p>}
            <div className="flex gap-4 flex-wrap">
              <PrimaryBtn href={`/${tenant.slug}/projects`}>{ctaP}</PrimaryBtn>
              <OutlineBtn href={`/${tenant.slug}/contact`}>{ctaS}</OutlineBtn>
            </div>
          </div>
          {h.showScrollIndicator && (
            <button onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
              className="absolute bottom-8 right-8 z-10 opacity-40 hover:opacity-100 transition-opacity animate-bounce">
              <ChevronDown className="w-7 h-7" style={{ color: 'var(--c-nav-text)' }} />
            </button>
          )}
        </section>
      )
    }

    // fullscreen (default)
    return (
      <section className={`${heroH} flex flex-col justify-end pb-24 px-8 relative overflow-hidden ${align}`}>
        {tenant.cover_url
          ? <><Image src={tenant.cover_url} alt="" fill className={`object-cover ${fx.projectZoom ? 'scale-100' : ''}`} />
              <div className="absolute inset-0" style={overlayGradient(h.overlayStyle, h.overlayOpacity)} /></>
          : <div className="absolute inset-0" style={{ backgroundColor: 'var(--c-primary)' }} />
        }
        <div className="relative z-10 max-w-7xl mx-auto w-full" dir="rtl">
          <AccentTag label={tag} show={accentLine} />
          <h1 className="text-6xl md:text-8xl leading-none mb-6 heading-text"
            style={{ fontFamily: 'var(--font-heading)', fontWeight: 'var(--font-hw)' as never, color: 'var(--c-nav-text)' }}>
            {tenant.name_ar}
          </h1>
          {heroTagline && <p className="text-sm mb-10 max-w-md opacity-70" style={{ color: 'var(--c-nav-text)', lineHeight: 'var(--line-h)' }}>{heroTagline}</p>}
          <div className="flex gap-4 flex-wrap">
            <PrimaryBtn href={`/${tenant.slug}/projects`}>{ctaP}</PrimaryBtn>
            <OutlineBtn href={`/${tenant.slug}/contact`}>{ctaS}</OutlineBtn>
          </div>
        </div>
      </section>
    )
  }

  // ── ABOUT ─────────────────────────────────────────────────────────────────
  const SectionAbout = () => {
    const layout = sec.aboutLayout ?? 'side-by-side'
    const imgEl = tenant.cover_url
      ? <div className={`relative aspect-[4/3] overflow-hidden ${br}`}><Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" /></div>
      : <div className={`aspect-[4/3] flex items-center justify-center ${br}`} style={{ backgroundColor: 'var(--c-secondary)' }}>
          <span className="text-8xl font-black opacity-20" style={{ color: 'var(--c-text)' }}>{tenant.name_ar.charAt(0)}</span>
        </div>

    const textEl = (
      <div>
        <AccentTag label="من نحن" show={accentLine} />
        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight heading-text"
          style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>
          {sc.aboutTitle}
        </h2>
        <p className="mb-8 text-base" style={{ color: 'var(--c-text-light)', lineHeight: 'var(--line-h)' }}>{bio}</p>
        {tenant.address_ar && (
          <p className="text-sm flex items-start gap-2 mb-8" style={{ color: 'var(--c-text-light)' }}>
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--c-accent)' }} />
            {tenant.address_ar}
          </p>
        )}
        {sec.aboutShowStats && (
          <div className="flex gap-8 mb-8">
            {[['10+', 'سنوات خبرة'], ['150+', 'مشروع منجز'], ['98%', 'رضا العملاء']].map(([n, l]) => (
              <div key={l}>
                <p className="text-3xl font-black" style={{ color: 'var(--c-accent)' }}>{n}</p>
                <p className="text-xs" style={{ color: 'var(--c-text-light)' }}>{l}</p>
              </div>
            ))}
          </div>
        )}
        <PrimaryBtn href={`/${tenant.slug}/contact`}>ابدأ مشروعك</PrimaryBtn>
      </div>
    )

    if (layout === 'stacked') return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-bg)' }} dir="rtl">
        <div className={`${mw} mx-auto space-y-12`}>
          {imgEl}
          {textEl}
        </div>
      </section>
    )

    if (layout === 'card') return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-bg)' }} dir="rtl">
        <div className={`${mw} mx-auto p-8 md:p-12 ${br}`} style={{ ...cardStyleVars(config.cards?.style, glassCards) }}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {textEl}
            {imgEl}
          </div>
        </div>
      </section>
    )

    const reversed = layout === 'reversed'
    return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-bg)' }} dir="rtl">
        <div className={`${mw} mx-auto grid md:grid-cols-2 gap-16 items-center`}>
          {reversed ? <>{imgEl}{textEl}</> : <>{textEl}{imgEl}</>}
        </div>
      </section>
    )
  }

  // ── SERVICES ──────────────────────────────────────────────────────────────
  const SectionServices = () => {
    const style  = sec.servicesStyle ?? 'card-grid'
    const cHover = cardHoverClass(cards.hoverEffect, !!fx.hoverLift)
    const items = customServices?.length > 0
      ? customServices.map(s => ({ Icon: resolveIcon(s.icon ?? 'Star'), title: s.title, desc: s.description ?? '' }))
      : sc.services.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.desc }))

    const CardItem = ({ Icon, title, desc, idx }: { Icon: React.ComponentType<{ className?: string }>, title: string, desc: string, idx: number }) => {
      const cStyle = cardStyleVars(cards.style, glassCards)
      const aBar   = accentBarStyle(cards.accentBar)
      const iShape = iconShapeClass(cards.iconShape, br)
      const pad    = cards.padding === 'compact' ? 'p-4' : cards.padding === 'large' ? 'p-8' : 'p-6'

      return (
        <div className={`${pad} ${br} ${cHover} relative`} style={{ ...cStyle, ...aBar }}>
          {dec.cardCornerDot && <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--c-accent)' }} />}
          {cards.showNumber && <span className="absolute top-4 right-4 text-xs font-black opacity-20" style={{ color: 'var(--c-accent)' }}>{String(idx+1).padStart(2,'0')}</span>}
          {cards.iconShape !== 'none' && (
            <div className={`${iShape} mb-4`} style={{ backgroundColor: 'var(--c-secondary)' }}>
              <Icon className={cards.iconShape === 'diamond' ? '-rotate-45 w-5 h-5' : 'w-5 h-5'} />
            </div>
          )}
          <h3 className="font-bold mb-2 text-base" style={{ color: 'var(--c-text)' }}>{title}</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text-light)', lineHeight: 'var(--line-h)' }}>{desc}</p>
        </div>
      )
    }

    if (style === 'icon-list') return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-secondary)' }} dir="rtl">
        <div className={`${mw} mx-auto`}>
          <AccentTag label={sc.servicesLabel} show={accentLine} />
          <h2 className="text-4xl font-black mb-12 heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>ما نقدمه</h2>
          <div className="space-y-5">
            {items.map(({ Icon, title, desc }) => (
              <div key={title} className={`flex items-start gap-5 p-5 ${br} ${cHover}`} style={cardStyleVars(cards.style, glassCards)}>
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded" style={{ backgroundColor: 'var(--c-primary)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--c-accent)' }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--c-text)' }}>{title}</h3>
                  <p className="text-sm" style={{ color: 'var(--c-text-light)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )

    if (style === 'numbered') return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-secondary)' }} dir="rtl">
        <div className={`${mw} mx-auto`}>
          <AccentTag label={sc.servicesLabel} show={accentLine} />
          <h2 className="text-4xl font-black mb-12 heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>ما نقدمه</h2>
          <div className={`grid ${gridColsClass(config.projectsGrid.columns)} gap-8`}>
            {items.map(({ title, desc }, idx) => (
              <div key={title} className={`${br} ${cHover} p-6`} style={cardStyleVars(cards.style, glassCards)}>
                <p className="text-5xl font-black mb-3 opacity-20" style={{ color: 'var(--c-accent)' }}>{String(idx+1).padStart(2,'0')}</p>
                <h3 className="font-bold mb-2" style={{ color: 'var(--c-text)' }}>{title}</h3>
                <p className="text-sm" style={{ color: 'var(--c-text-light)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )

    if (style === 'minimal') return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-bg)' }} dir="rtl">
        <div className={`${mw} mx-auto`}>
          <AccentTag label={sc.servicesLabel} show={accentLine} />
          <h2 className="text-4xl font-black mb-12 heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>ما نقدمه</h2>
          <div className={`grid ${gridColsClass(config.projectsGrid.columns)} gap-6`}>
            {items.map(({ Icon, title, desc }) => (
              <div key={title} className="pb-6 border-b" style={{ borderColor: 'var(--c-border)' }}>
                <Icon className="w-5 h-5 mb-3" style={{ color: 'var(--c-accent)' }} />
                <h3 className="font-bold mb-1" style={{ color: 'var(--c-text)' }}>{title}</h3>
                <p className="text-sm" style={{ color: 'var(--c-text-light)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )

    // card-grid (default)
    return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-secondary)' }} dir="rtl">
        <div className={`${mw} mx-auto`}>
          <AccentTag label={sc.servicesLabel} show={accentLine} />
          <h2 className="text-4xl font-black mb-12 heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>ما نقدمه لك</h2>
          <div className={`grid ${gridColsClass(config.projectsGrid.columns)} gap-5`}>
            {items.map(({ Icon, title, desc }, idx) => <CardItem key={title} Icon={Icon} title={title} desc={desc} idx={idx} />)}
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

  // ── PROJECTS ──────────────────────────────────────────────────────────────
  const SectionProjects = () => {
    const cols  = config.projectsGrid.columns
    const style = config.projectsGrid.style
    const ratio = imageRatioClass(config.projectsGrid.imageRatio)
    const cap   = config.projectsGrid.captionStyle ?? 'overlay'
    const hov   = config.projectsGrid.hoverEffect ?? 'zoom'
    const display = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 8)

    if (!display.length) return (
      <section className={`${sp} px-6 text-center`} style={{ backgroundColor: 'var(--c-bg)' }}>
        <h2 className="text-4xl font-black opacity-20 heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>
          {sc.portfolioLabel} قريباً
        </h2>
      </section>
    )

    // Caption renderer
    const Caption = ({ p }: { p: typeof display[0] }) => {
      if (cap === 'below') return (
        <div className="p-3">
          <p className="font-bold text-sm" style={{ color: 'var(--c-text)' }}>{p.title_ar}</p>
          {p.category && <p className="text-xs" style={{ color: 'var(--c-text-light)' }}>{p.category}</p>}
        </div>
      )
      if (cap === 'minimal') return (
        <div className="absolute bottom-0 right-0 left-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="font-bold text-xs text-white">{p.title_ar}</p>
        </div>
      )
      if (cap === 'floating') return (
        <div className={`absolute bottom-3 right-3 left-3 p-3 ${br} opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300`}
          style={{ backgroundColor: 'var(--c-bg)', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
          <p className="font-bold text-sm" style={{ color: 'var(--c-text)' }}>{p.title_ar}</p>
          {p.category && <p className="text-xs" style={{ color: 'var(--c-accent)' }}>{p.category}</p>}
        </div>
      )
      if (cap === 'slide') return (
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          style={{ background: 'linear-gradient(to top, var(--c-primary), transparent)' }}>
          <p className="font-bold text-white">{p.title_ar}</p>
          {p.category && <p className="text-xs text-white/70">{p.category}</p>}
        </div>
      )
      // overlay (default)
      return (
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-colors duration-300 flex items-end p-4">
          <div className="translate-y-3 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
            <p className="font-bold text-white">{p.title_ar}</p>
            {p.category && <p className="text-xs text-white/70">{p.category}</p>}
          </div>
        </div>
      )
    }

    const imgHoverClass = {
      zoom:   'group-hover:scale-108 transition-transform duration-700',
      fade:   'group-hover:opacity-80 transition-opacity duration-500',
      reveal: 'group-hover:scale-100 transition-transform duration-500',
      lift:   '',
      none:   '',
    }[hov] ?? 'group-hover:scale-105 transition-transform duration-700'

    const ProjectCard = ({ p }: { p: typeof display[0] }) => (
      <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
        className={`relative overflow-hidden group block ${br} ${cap === 'below' ? '' : ratio} ${hov === 'lift' ? 'hover:-translate-y-2 transition-transform duration-300' : ''}`}
        style={{ backgroundColor: 'var(--c-secondary)' }}>
        <div className={cap !== 'below' ? 'absolute inset-0' : ratio}>
          {p.cover_image_url
            ? <Image src={p.cover_image_url} alt={p.title_ar} fill className={`object-cover ${imgHoverClass}`} />
            : <div className="w-full h-full flex items-center justify-center">
                <span className="text-4xl font-black opacity-10" style={{ color: 'var(--c-text)' }}>{p.title_ar.charAt(0)}</span>
              </div>
          }
        </div>
        <Caption p={p} />
      </Link>
    )

    // Magazine layout: first item spans 2 rows
    if (style === 'magazine') return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-bg)' }} dir="rtl">
        <div className={`${mw} mx-auto`}>
          <div className="flex items-end justify-between mb-12">
            <div>
              <AccentTag label={sc.featuredLabel} show={accentLine} />
              <h2 className="text-4xl font-black heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>{sc.portfolioItemLabelPlural} مختارة</h2>
            </div>
            <Link href={`/${tenant.slug}/projects`} className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--c-text-light)' }}>
              جميع {sc.portfolioLabel} ←
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {display.slice(0, 1).map(p => (
              <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
                className={`relative row-span-2 overflow-hidden group ${br}`}
                style={{ backgroundColor: 'var(--c-secondary)', gridRow: 'span 2' }}>
                <div className="absolute inset-0">
                  {p.cover_image_url
                    ? <Image src={p.cover_image_url} alt={p.title_ar} fill className={`object-cover ${imgHoverClass}`} />
                    : <div className="w-full h-full" style={{ backgroundColor: 'var(--c-secondary)' }} />
                  }
                </div>
                <div className="absolute inset-0 flex items-end p-5" style={{ background: 'linear-gradient(to top, var(--c-primary)cc, transparent)' }}>
                  <div>
                    <p className="font-black text-xl text-white leading-tight">{p.title_ar}</p>
                    {p.category && <p className="text-sm text-white/60">{p.category}</p>}
                  </div>
                </div>
              </Link>
            ))}
            {display.slice(1, 5).map(p => <ProjectCard key={p.id} p={p} />)}
          </div>
        </div>
      </section>
    )

    // List layout
    if (style === 'list') return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-bg)' }} dir="rtl">
        <div className={`${mw} mx-auto`}>
          <div className="flex items-end justify-between mb-12">
            <div>
              <AccentTag label={sc.featuredLabel} show={accentLine} />
              <h2 className="text-4xl font-black heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>{sc.portfolioLabel}</h2>
            </div>
            <Link href={`/${tenant.slug}/projects`} className="text-sm" style={{ color: 'var(--c-text-light)' }}>جميع {sc.portfolioLabel} ←</Link>
          </div>
          <div className="space-y-3">
            {display.map(p => (
              <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
                className={`flex gap-4 overflow-hidden group ${br} ${cardHoverClass('border', false)} border`}
                style={{ backgroundColor: 'var(--c-secondary)', borderColor: 'var(--c-border)' }}>
                <div className="relative w-28 h-24 flex-shrink-0">
                  {p.cover_image_url
                    ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover" />
                    : <div className="w-full h-full" style={{ backgroundColor: 'var(--c-primary)' }} />
                  }
                </div>
                <div className="flex flex-col justify-center py-2">
                  <p className="font-bold" style={{ color: 'var(--c-text)' }}>{p.title_ar}</p>
                  {p.category && <p className="text-xs mt-1" style={{ color: 'var(--c-accent)' }}>{p.category}</p>}
                  {p.year && <p className="text-xs mt-0.5" style={{ color: 'var(--c-text-light)' }}>{p.year}</p>}
                </div>
                <div className="flex items-center pr-4 mr-auto opacity-30 group-hover:opacity-100 transition-opacity">
                  <span style={{ color: 'var(--c-accent)' }}>←</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )

    // Grid / Masonry / Filmstrip
    return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-bg)' }} dir="rtl">
        <div className={`${mw} mx-auto`}>
          <div className="flex items-end justify-between mb-12">
            <div>
              <AccentTag label={sc.featuredLabel} show={accentLine} />
              <h2 className="text-4xl font-black heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>{sc.portfolioItemLabelPlural} مختارة</h2>
            </div>
            <Link href={`/${tenant.slug}/projects`} className="text-sm transition-opacity hover:opacity-70" style={{ color: 'var(--c-text-light)' }}>
              جميع {sc.portfolioLabel} ←
            </Link>
          </div>
          {style === 'filmstrip'
            ? <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory">
                {display.map(p => (
                  <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
                    className={`relative flex-shrink-0 w-72 aspect-[3/4] overflow-hidden group ${br} snap-start`}
                    style={{ backgroundColor: 'var(--c-secondary)' }}>
                    {p.cover_image_url && <Image src={p.cover_image_url} alt={p.title_ar} fill className={`object-cover ${imgHoverClass}`} />}
                    <Caption p={p} />
                  </Link>
                ))}
              </div>
            : <div className={`grid ${gridColsClass(cols)} gap-4`}>
                {display.map(p => <ProjectCard key={p.id} p={p} />)}
              </div>
          }
        </div>
      </section>
    )
  }

  // ── FEATURES ──────────────────────────────────────────────────────────────
  const SectionFeatures = () => {
    const style  = sec.featuresStyle ?? 'icon-list'
    const cHover = cardHoverClass(cards.hoverEffect, !!fx.hoverLift)
    const items = customFeatures?.length > 0
      ? customFeatures.map(f => ({ Icon: resolveIcon(f.icon ?? 'Star'), title: f.title, desc: f.description ?? '' }))
      : sc.features.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.desc }))

    if (style === 'card-grid') return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-primary)' }} dir="rtl">
        <div className={`${mw} mx-auto`}>
          <AccentTag label="لماذا نحن" show={accentLine} />
          <h2 className="text-4xl font-black mb-12 heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-nav-text)' }}>ما يميزنا</h2>
          <div className={`grid ${gridColsClass(config.projectsGrid.columns)} gap-5`}>
            {items.map(({ Icon, title, desc }, idx) => (
              <div key={title} className={`p-6 ${br} ${cHover}`}
                style={{ ...cardStyleVars(cards.style, glassCards), ...accentBarStyle(cards.accentBar) }}>
                {cards.showNumber && <span className="text-3xl font-black opacity-20 mb-2 block" style={{ color: 'var(--c-accent)' }}>{String(idx+1).padStart(2,'0')}</span>}
                <Icon className="w-7 h-7 mb-4" style={{ color: 'var(--c-accent)' }} />
                <h3 className="font-bold mb-2" style={{ color: 'var(--c-nav-text)' }}>{title}</h3>
                <p className="text-sm" style={{ color: 'var(--c-text-light)', lineHeight: 'var(--line-h)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )

    if (style === 'numbered') return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-primary)' }} dir="rtl">
        <div className={`${mw} mx-auto`}>
          <AccentTag label="لماذا نحن" show={accentLine} />
          <h2 className="text-4xl font-black mb-12 heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-nav-text)' }}>ما يميزنا</h2>
          <div className="space-y-6">
            {items.map(({ title, desc }, idx) => (
              <div key={title} className={`flex gap-6 items-start p-5 ${br} ${cHover}`} style={cardStyleVars(cards.style, glassCards)}>
                <span className="text-4xl font-black opacity-30 flex-shrink-0 w-12 text-center" style={{ color: 'var(--c-accent)' }}>{String(idx+1).padStart(2,'0')}</span>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--c-nav-text)' }}>{title}</h3>
                  <p className="text-sm" style={{ color: 'var(--c-text-light)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )

    if (style === 'checklist') return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-primary)' }} dir="rtl">
        <div className={`${mw} mx-auto grid md:grid-cols-2 gap-6`}>
          <div>
            <AccentTag label="لماذا نحن" show={accentLine} />
            <h2 className="text-4xl font-black heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-nav-text)' }}>ما يميزنا</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {items.map(({ title, desc }) => (
              <div key={title} className={`flex gap-3 items-start p-4 ${br}`} style={cardStyleVars(cards.style, glassCards)}>
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--c-accent)' }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--c-nav-text)' }}>{title}</p>
                  <p className="text-xs" style={{ color: 'var(--c-text-light)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )

    if (style === 'minimal') return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-bg)' }} dir="rtl">
        <div className={`${mw} mx-auto`}>
          <AccentTag label="لماذا نحن" show={accentLine} />
          <h2 className="text-4xl font-black mb-12 heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>ما يميزنا</h2>
          <div className={`grid ${gridColsClass(config.projectsGrid.columns)} gap-8`}>
            {items.map(({ Icon, title, desc }) => (
              <div key={title} className="border-b pb-6" style={{ borderColor: 'var(--c-border)' }}>
                <Icon className="w-5 h-5 mb-3" style={{ color: 'var(--c-accent)' }} />
                <h3 className="font-bold mb-1" style={{ color: 'var(--c-text)' }}>{title}</h3>
                <p className="text-sm" style={{ color: 'var(--c-text-light)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )

    // icon-list (default)
    return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-primary)' }} dir="rtl">
        <div className={`${mw} mx-auto`}>
          <AccentTag label="لماذا نحن" show={accentLine} />
          <h2 className="text-4xl font-black mb-12 heading-text" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-nav-text)' }}>ما يميزنا</h2>
          <div className={`grid ${gridColsClass(config.projectsGrid.columns)} gap-8`}>
            {items.map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-4 items-start">
                <div className={`${iconShapeClass(cards.iconShape ?? 'square', br)}`} style={{ backgroundColor: 'var(--c-secondary)' }}>
                  <Icon className="w-5 h-5" style={{ color: 'var(--c-accent)' }} />
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--c-nav-text)' }}>{title}</h3>
                  <p className="text-sm" style={{ color: 'var(--c-text-light)', lineHeight: 'var(--line-h)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // ── TESTIMONIALS ──────────────────────────────────────────────────────────
  const SectionTestimonials = () => {
    const items = rawTestimonials && rawTestimonials.length > 0
      ? rawTestimonials.map(t => ({ name: t.name, role: t.role ?? '', text: t.content, rating: t.rating ?? undefined }))
      : (SECTOR_TESTIMONIALS[tenant.sector ?? 'general'] ?? SECTOR_TESTIMONIALS.general)
    const altBg = dec.sectionBgAlt ? (config.colors.cardBg ?? config.colors.secondary) : config.colors.background
    return (
      <Testimonials
        testimonials={items}
        title="ماذا يقول عملاؤنا"
        accentColor={config.colors.accent}
        bgColor={altBg}
        textColor={config.colors.text}
        textLight={config.colors.textLight}
        variant="carousel"
      />
    )
  }

  // ── FAQ ───────────────────────────────────────────────────────────────────
  const SectionFAQ = () => {
    const items = rawFaqs && rawFaqs.length > 0
      ? rawFaqs.map(f => ({ q: f.question, a: f.answer }))
      : (SECTOR_FAQ[tenant.sector ?? 'general'] ?? SECTOR_FAQ.general)
    const cardStyle = config.cards?.style
    const faqVariant: 'default' | 'bordered' | 'minimal' | 'filled' =
      cardStyle === 'bordered' ? 'bordered' :
      cardStyle === 'glass' || cardStyle === 'filled' ? 'filled' :
      cardStyle === 'flat' ? 'minimal' : 'default'
    return (
      <FAQ
        items={items}
        title="الأسئلة الشائعة"
        accentColor={config.colors.accent}
        bgColor={config.colors.background}
        textColor={config.colors.text}
        textLight={config.colors.textLight}
        variant={faqVariant}
      />
    )
  }

  // ── CTA ───────────────────────────────────────────────────────────────────
  const SectionCTA = () => {
    const layout = sec.ctaLayout ?? 'split'
    const ctaBg  = sec.ctaBg ?? 'background'
    const bgStyle: React.CSSProperties = {
      background: ctaBg === 'gradient'
        ? `linear-gradient(135deg, var(--c-accent), var(--c-accent2))`
        : ctaBg === 'accent'
        ? 'var(--c-accent)'
        : ctaBg === 'primary'
        ? 'var(--c-primary)'
        : 'var(--c-bg)'
    }
    const textClr = ctaBg === 'background' ? 'var(--c-text)' : 'var(--c-bg)'
    const textLightClr = ctaBg === 'background' ? 'var(--c-text-light)' : `${config.colors.background}99`

    const Buttons = () => (
      <div className="flex gap-4 flex-wrap">
        {waUrl && (
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            className={`flex items-center gap-2 px-8 py-3 font-bold text-white ${br} transition-opacity hover:opacity-90`}
            style={{ backgroundColor: '#25D366' }}>
            <WhatsAppIcon />
            واتساب
          </a>
        )}
        <Link href={`/${tenant.slug}/contact`} className={`px-8 py-3 font-bold transition-all hover:opacity-90 ${br} ${btnScale ? 'hover:scale-105' : ''}`}
          style={{ backgroundColor: ctaBg === 'background' ? 'var(--c-accent)' : 'var(--c-bg)', color: ctaBg === 'background' ? 'var(--c-bg)' : 'var(--c-text)' }}>
          ابدأ الآن
        </Link>
      </div>
    )

    if (layout === 'centered') return (
      <section className={`${sp} px-6 text-center`} style={bgStyle} dir="rtl">
        <div className={`${mw} mx-auto`}>
          <AccentTag label={sc.cta} show={accentLine} />
          <h3 className="text-4xl md:text-5xl font-black mb-4 heading-text" style={{ fontFamily: 'var(--font-heading)', color: textClr }}>{sc.cta}</h3>
          <p className="mb-10 max-w-lg mx-auto" style={{ color: textLightClr }}>{sc.ctaDesc}</p>
          <div className="flex justify-center"><Buttons /></div>
        </div>
      </section>
    )

    if (layout === 'banner') return (
      <section className="px-6 py-12" style={{ ...bgStyle, borderTop: `3px solid var(--c-accent)`, borderBottom: `3px solid var(--c-accent)` }} dir="rtl">
        <div className={`${mw} mx-auto flex flex-col sm:flex-row items-center justify-between gap-6`}>
          <div>
            <p className="text-xs tracking-widest uppercase mb-1" style={{ color: 'var(--c-accent)' }}>الآن</p>
            <h3 className="text-3xl font-black heading-text" style={{ color: textClr }}>{sc.cta}</h3>
          </div>
          <Buttons />
        </div>
      </section>
    )

    if (layout === 'minimal') return (
      <section className={`${sp} px-6`} style={{ backgroundColor: 'var(--c-bg)' }} dir="rtl">
        <div className={`${mw} mx-auto border-t pt-12`} style={{ borderColor: 'var(--c-border)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p style={{ color: 'var(--c-text-light)' }}>{sc.ctaDesc}</p>
            <Buttons />
          </div>
        </div>
      </section>
    )

    // split (default)
    return (
      <section className={`${sp} px-6`} style={bgStyle} dir="rtl">
        <div className={`${mw} mx-auto flex flex-col md:flex-row items-center justify-between gap-8`}>
          <div>
            <AccentTag label="ابدأ معنا" show={accentLine} />
            <h3 className="text-4xl font-black mb-2 heading-text" style={{ fontFamily: 'var(--font-heading)', color: textClr }}>{sc.cta}</h3>
            <p style={{ color: textLightClr }}>{sc.ctaDesc}</p>
          </div>
          <Buttons />
        </div>
      </section>
    )
  }

  // ── FOOTER ────────────────────────────────────────────────────────────────
  const SectionFooter = () => {
    const cols  = sec.footerColumns ?? 3
    const style = sec.footerStyle ?? 'dark'
    const bgC   = style === 'light' ? 'var(--c-bg)' : style === 'accent' ? 'var(--c-accent)' : style === 'minimal' ? 'var(--c-bg)' : 'var(--c-primary)'
    const txtC  = style === 'light' || style === 'minimal' ? 'var(--c-text)' : 'var(--c-nav-text)'
    const txtLC = style === 'light' || style === 'minimal' ? 'var(--c-text-light)' : `${config.colors.background}66`
    const bdC   = style === 'minimal' ? 'var(--c-border)' : `${config.colors.navText ?? config.colors.background}15`

    return (
      <footer className={`${sp} px-6 border-t`} style={{ backgroundColor: bgC, borderColor: bdC }} dir="rtl">
        <div className={`${mw} mx-auto grid grid-cols-1 ${cols >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} ${cols === 4 ? 'lg:grid-cols-4' : ''} gap-10`}>
          <div>
            <div className="flex items-center gap-3 mb-4">
              {tenant.logo_url && <Image src={tenant.logo_url} alt="" width={32} height={32} className={`object-cover ${br}`} />}
              <span className="font-bold" style={{ color: txtC }}>{tenant.name_ar}</span>
            </div>
            <p className="text-sm leading-relaxed line-clamp-4" style={{ color: txtLC }}>{bio}</p>
          </div>
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6" style={{ color: txtLC }}>روابط سريعة</h4>
            <div className="space-y-3">
              {[['/', 'الرئيسية'], [`/projects`, sc.portfolioLabel], ['/contact', 'تواصل معنا']].map(([href, label]) => (
                <Link key={href} href={`/${tenant.slug}${href}`} className="block text-sm transition-opacity hover:opacity-70" style={{ color: txtLC }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs tracking-widest uppercase mb-6" style={{ color: txtLC }}>تواصل معنا</h4>
            <div className="space-y-3">
              {tenant.phone && <a href={`tel:${tenant.phone}`} className="flex items-center gap-2 text-sm" style={{ color: txtLC }} dir="ltr"><Phone className="w-4 h-4" style={{ color: 'var(--c-accent)' }} />{tenant.phone}</a>}
              {tenant.email && <a href={`mailto:${tenant.email}`} className="flex items-center gap-2 text-sm" style={{ color: txtLC }}><Mail className="w-4 h-4" style={{ color: 'var(--c-accent)' }} />{tenant.email}</a>}
              {tenant.address_ar && <p className="flex items-start gap-2 text-sm" style={{ color: txtLC }}><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: 'var(--c-accent)' }} />{tenant.address_ar}</p>}
            </div>
            {(sec.footerShowSocial ?? true) && socials.length > 0 && (
              <div className="flex gap-4 mt-6 flex-wrap">
                {socials.map(s => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                    className="text-xs tracking-widest transition-opacity hover:opacity-100 opacity-60" style={{ color: txtC }}>
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className={`${mw} mx-auto mt-10 pt-6 border-t flex items-center justify-between flex-wrap gap-2`} style={{ borderColor: bdC }}>
          <p className="text-xs" style={{ color: txtLC }}>© {new Date().getFullYear()} {tenant.name_ar} — جميع الحقوق محفوظة</p>
          <p className="text-xs opacity-40" style={{ color: txtLC }}>مدعوم بالمنصة</p>
        </div>
      </footer>
    )
  }

  // ── Section map ───────────────────────────────────────────────────────────
  const sectionComponents: Record<SectionKey, React.FC> = {
    hero: SectionHero,
    about: SectionAbout,
    services: SectionServices,
    projects: SectionProjects,
    features: SectionFeatures,
    testimonials: SectionTestimonials,
    faq: SectionFAQ,
    cta: SectionCTA,
    footer: SectionFooter,
  }

  return (
    <div dir="rtl" style={{ ...buildCSSVars(config), fontFamily: 'var(--font-body)', backgroundColor: 'var(--c-bg)', fontSize: 'var(--font-bs)' }}>
      <style>{globalCSS}</style>

      {/* Nav */}
      <nav className={`z-50 transition-all duration-300 ${navPos} ${navH} ${nav.showBorder ? 'border-b' : ''}`}
        style={{ ...navBgStyle(), borderColor: 'var(--c-border)' }}>
        <div className={`${mw} mx-auto px-6 h-full flex items-center justify-between`}>
          <Link href={`/${tenant.slug}`} className="flex items-center gap-3">
            {tenant.logo_url && <Image src={tenant.logo_url} alt="" width={logoSz} height={logoSz} className={`object-cover ${br}`} />}
            <span className="font-bold text-sm" style={{ color: 'var(--c-nav-text)' }}>{tenant.name_ar}</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href={`/${tenant.slug}`} className="transition-opacity hover:opacity-70" style={{ color: 'var(--c-nav-text)', opacity: 0.7 }}>الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} className="transition-opacity hover:opacity-70" style={{ color: 'var(--c-nav-text)', opacity: 0.7 }}>{sc.portfolioLabel}</Link>
            {nav.ctaInNav
              ? <PrimaryBtn href={`/${tenant.slug}/contact`}>تواصل</PrimaryBtn>
              : <Link href={`/${tenant.slug}/contact`} className={`px-4 py-1.5 font-medium ${br}`} style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }}>تواصل</Link>
            }
          </div>
        </div>
      </nav>

      {/* Sections */}
      {config.layout.sections.map((key, i) => {
        const Component = sectionComponents[key as SectionKey]
        if (!Component) return null
        if (key === 'hero') return <Component key={key} />
        return (
          <FadeIn key={key} enabled={fade}>
            {i > 0 && <SectionDivider style={divider} />}
            <Component />
          </FadeIn>
        )
      })}

      {/* Social Float (WhatsApp + Snapchat + TikTok) */}
      {config.contactStyle?.showWhatsappFloat !== false && (
        <SocialFloat
          whatsapp={tenant.whatsapp ?? tenant.phone ?? undefined}
          snapchat_url={tenant.snapchat_url ?? undefined}
          tiktok_url={tenant.tiktok_url ?? undefined}
          tenantSlug={tenant.slug}
        />
      )}

      {/* Back to top */}
      <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 w-11 h-11 shadow-lg flex items-center justify-center transition-all duration-300 ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'} ${br}`}
        style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }}>
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  )
}
