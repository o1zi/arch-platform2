'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT, DEMO_PROJECTS, DEMO_SERVICES, DEMO_FEATURES, DEMO_STATS, DEMO_TESTIMONIALS, DEMO_FAQS } from '@/lib/data'
import { ProjectCover } from '@/components/ui/atoms'

const PR = '#0e3b2e'
const ACC = '#b08a3e'
const BG = '#ffffff'
const MUTED = '#6b7a70'
const SOFT = '#eef4f1'
const INK = '#14201a'

const NAV_LINKS = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#projects', label: 'مشاريع' },
  { href: '#contact', label: 'تواصل' },
]

const TPL_LABELS = ['مودرن', 'كلاسيك', 'جريء', 'بسيط', 'فاخر', 'سحابي']
const TPL_COLORS = ['#0e3b2e', '#3d2b1f', '#1a1a2e', '#4a4a4a', '#1a1a1a', '#162447']

function SectionHeader({ tag, title, sub }: { tag: string; title: string; sub?: string }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 48 }}>
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.25em', color: ACC, textTransform: 'uppercase' }}>{tag}</span>
      <h2 style={{ fontFamily: 'Reem Kufi, serif', fontSize: 38, fontWeight: 700, margin: '8px 0', color: INK, lineHeight: 1.3 }}>{title}</h2>
      {sub && <p style={{ fontSize: 16, color: MUTED, maxWidth: 540, margin: '12px auto 0' }}>{sub}</p>}
    </div>
  )
}

export default function PublicSiteHome() {
  const params = useParams()
  const router = useRouter()
  const domain = (params?.domain as string) || 'demo'

  const [scrolled, setScrolled] = useState(false)
  const [faqOpen, setFaqOpen] = useState<string | null>(null)
  const [tplOpen, setTplOpen] = useState(false)
  const [activeTpl, setActiveTpl] = useState(0)

  const tenant = DEMO_TENANT as Record<string, unknown>
  const projects = DEMO_PROJECTS as Record<string, unknown>[]
  const services = DEMO_SERVICES as Record<string, unknown>[]
  const features = DEMO_FEATURES as Record<string, unknown>[]
  const stats = DEMO_STATS as Record<string, unknown>[]
  const testimonials = DEMO_TESTIMONIALS as Record<string, unknown>[]
  const faqs = DEMO_FAQS as Record<string, unknown>[]

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const featured = projects.filter(p => (p as Record<string, unknown>).is_featured).slice(0, 6)

  const socials = [
    ...(tenant.instagram_url ? [{ icon: 'instagram' as const, href: tenant.instagram_url as string }] : []),
    ...(tenant.twitter_url ? [{ icon: 'twitter' as const, href: tenant.twitter_url as string }] : []),
    ...(tenant.linkedin_url ? [{ icon: 'linkedin' as const, href: tenant.linkedin_url as string }] : []),
    ...(tenant.snapchat_url ? [{ icon: 'snapchat' as const, href: tenant.snapchat_url as string }] : []),
  ]

  const navStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    transition: 'all 0.3s ease',
    background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom: scrolled ? '1px solid #e8ede9' : '1px solid transparent',
    padding: '0 24px',
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: BG, color: INK, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      {/* ── Nav ── */}
      <nav style={navStyle}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="#home" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: PR, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Reem Kufi, serif', fontWeight: 700, fontSize: 16 }}>ف</div>
            <span style={{ fontWeight: 600, fontSize: 16, color: scrolled ? INK : '#fff', transition: 'color 0.3s' }}>{(tenant.short_ar || tenant.name_ar) as string}</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {NAV_LINKS.map(l => (
              <a key={l.href} href={l.href} style={{ fontSize: 14, fontWeight: 500, color: scrolled ? INK : 'rgba(255,255,255,0.85)', textDecoration: 'none', transition: 'color 0.2s' }}>{l.label}</a>
            ))}
            {socials.map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{ color: scrolled ? MUTED : 'rgba(255,255,255,0.6)', display: 'flex', transition: 'color 0.2s' }}>
                {Icons[s.icon]?.({ size: 17 })}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="home" style={{
        minHeight: '100vh',
        background: `linear-gradient(170deg, ${PR} 0%, #0a2c20 50%, #0e3b2e 100%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '120px 24px 80px',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.04 }}>
          <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '60%', height: '60%', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.15)' }} />
          <div style={{ position: 'absolute', bottom: '-15%', left: '-8%', width: '50%', height: '50%', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 720 }}>
          <span style={{ display: 'inline-block', fontSize: 13, fontWeight: 600, letterSpacing: '0.3em', color: ACC, marginBottom: 16, background: 'rgba(176,138,62,0.1)', padding: '6px 18px', borderRadius: 20 }}>استشارات هندسية</span>
          <h1 style={{ fontFamily: 'Reem Kufi, serif', fontSize: 64, fontWeight: 700, color: '#fff', margin: '0 0 12px', lineHeight: 1.2 }}>
            {tenant.name_ar as string}
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.65)', marginBottom: 36, lineHeight: 1.8, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            {tenant.bio_ar as string}
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#projects" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', background: ACC, color: '#fff',
              borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none',
              transition: 'all 0.2s ease', boxShadow: '0 4px 20px rgba(176,138,62,0.35)',
            }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(176,138,62,0.45)' }} onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 20px rgba(176,138,62,0.35)' }}>
              {Icons.building?.({ size: 18 })}
              استعرض مشاريعنا
            </a>
            <a href="#contact" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 32px', background: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.35)', color: '#fff',
              borderRadius: 10, fontWeight: 500, fontSize: 15, textDecoration: 'none',
              transition: 'all 0.2s ease',
            }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'transparent' }}>
              {Icons.phone?.({ size: 18 })}
              تواصل معنا
            </a>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', animation: 'wjBounce 2s infinite' }}>
          {Icons.chevronDown?.({ size: 22, className: '' }) as React.ReactElement}
          <style>{`@keyframes wjBounce{0%,100%{opacity:0.3;transform:translate(-50%,0)}50%{opacity:1;transform:translate(-50%,12px)}}`}</style>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section style={{ background: PR, padding: '32px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '16px 12px' }}>
              <div style={{ fontFamily: 'Reem Kufi, serif', fontSize: 36, fontWeight: 700, color: ACC }}>
                {s.value as number}{s.suffix as string}
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>{s.label as string}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" style={{ padding: '100px 24px', background: BG }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeader tag="من نحن" title="قصتنا" sub={tenant.bio_ar as string} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginTop: 48 }}>
            {stats.map((s, i) => (
              <div key={i} className="wj-card" style={{
                background: SOFT, borderRadius: 16, padding: '28px 24px',
                textAlign: 'center', border: '1px solid #dde5df',
                transition: 'transform 0.25s ease',
              }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)' }} onMouseLeave={e => { e.currentTarget.style.transform = '' }}>
                <div style={{ fontFamily: 'Reem Kufi, serif', fontSize: 40, fontWeight: 700, color: PR }}>{s.value as number}</div>
                <div style={{ fontSize: 20, color: ACC, fontWeight: 600, marginBottom: 6 }}>{s.suffix as string}</div>
                <div style={{ fontSize: 14, color: MUTED }}>{s.label as string}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" style={{ padding: '100px 24px', background: SOFT }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeader tag="خدماتنا" title="ما نقدمه لك" sub="حلول هندسية متكاملة تلبي احتياجات مشروعك من الفكرة حتى التسليم" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
            {services.map((s, i) => (
              <div key={i} className="wj-card" style={{
                background: '#fff', borderRadius: 16, padding: '32px 28px',
                border: '1px solid #e5ece6', transition: 'all 0.3s ease',
              }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 30px rgba(14,59,46,0.08)'; e.currentTarget.style.borderColor = ACC }} onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = '#e5ece6' }}>
                <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, background: SOFT,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: PR,
                  }}>
                    {Icons[s.icon as keyof typeof Icons]?.({ size: 22 })}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: 'Reem Kufi, serif', fontSize: 20, fontWeight: 600, margin: '0 0 6px', color: INK }}>{s.title as string}</h3>
                    <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.8, margin: 0 }}>{s.desc as string}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      <section id="projects" style={{ padding: '100px 24px', background: BG }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeader tag="مشاريع" title="مشاريع مميزة" sub="مجموعة مختارة من أبرز المشاريع التي نفذناها" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {featured.map((p, i) => (
              <Link key={i} href={`/${domain}/projects/${p.id as string}`} style={{ textDecoration: 'none' }}>
                <div className="wj-card" style={{
                  borderRadius: 16, overflow: 'hidden', background: '#fff',
                  border: '1px solid #e5ece6', transition: 'all 0.3s ease',
                }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(14,59,46,0.1)' }} onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                  <ProjectCover seed={((p.cover_seed as number) || i + 1)} h={220} radius={0} />
                  <div style={{ padding: '20px 18px' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <span className="wj-badge" style={{
                        display: 'inline-block', fontSize: 11, fontWeight: 600,
                        padding: '3px 10px', borderRadius: 6,
                        background: 'rgba(176,138,62,0.1)', color: ACC,
                      }}>{p.category as string}</span>
                    </div>
                    <h3 style={{ fontFamily: 'Reem Kufi, serif', fontSize: 19, fontWeight: 600, color: INK, margin: '0 0 6px' }}>{p.title_ar as string}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: MUTED }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{Icons.map?.({ size: 13 })} {p.location_ar as string}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link href={`/${domain}/projects`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 36px', background: PR, color: '#fff',
              borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: 'none',
              transition: 'all 0.2s ease',
            }} onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = '' }}>
              جميع المشاريع
              {Icons.arrowLeft?.({ size: 17 })}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '100px 24px', background: PR }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.25em', color: ACC, textTransform: 'uppercase' }}>لماذا نحن</span>
            <h2 style={{ fontFamily: 'Reem Kufi, serif', fontSize: 38, fontWeight: 700, margin: '8px 0', color: '#fff', lineHeight: 1.3 }}>ما يميزنا</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                display: 'flex', gap: 18, alignItems: 'flex-start',
                padding: '28px 24px', borderRadius: 14,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                transition: 'all 0.3s ease',
              }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(176,138,62,0.35)' }} onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'rgba(176,138,62,0.15)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  color: ACC,
                }}>
                  {Icons[f.icon as keyof typeof Icons]?.({ size: 21 })}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'Reem Kufi, serif', fontSize: 19, fontWeight: 600, margin: '0 0 6px', color: '#fff' }}>{f.title as string}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, margin: 0 }}>{f.desc as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding: '100px 24px', background: BG }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeader tag="آراء العملاء" title="ماذا يقول عملاؤنا" sub="آراء حقيقية من عملاء تعاملوا معنا" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {testimonials.map((t, i) => (
              <div key={i} className="wj-card" style={{
                background: SOFT, borderRadius: 16, padding: '32px 24px',
                border: '1px solid #dde5df', position: 'relative',
                transition: 'all 0.3s ease',
              }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(14,59,46,0.06)' }} onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                <div style={{ color: ACC, marginBottom: 12, display: 'flex', gap: 3 }}>
                  {[1, 2, 3, 4, 5].map(s => Icons.star?.({ size: 15 }))}
                </div>
                <p style={{ fontSize: 15, color: INK, lineHeight: 1.9, margin: '0 0 20px' }}>&ldquo;{t.text as string}&rdquo;</p>
                <div style={{ borderTop: '1px solid #dde5df', paddingTop: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: PR, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Reem Kufi, serif', fontWeight: 600, fontSize: 16 }}>
                    {(t.name as string).charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 15, color: INK }}>{t.name as string}</div>
                    <div style={{ fontSize: 13, color: MUTED }}>{t.role as string}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '100px 24px', background: SOFT }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <SectionHeader tag="الأسئلة الشائعة" title="أسئلة متكررة" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 14, border: '1px solid #e5ece6',
                overflow: 'hidden', transition: 'all 0.25s ease',
                boxShadow: faqOpen === (faq.id as string) ? '0 4px 16px rgba(14,59,46,0.06)' : '',
              }}>
                <button
                  onClick={() => setFaqOpen(faqOpen === (faq.id as string) ? null : (faq.id as string))}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '18px 24px', background: 'none', border: 'none',
                    cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif', fontSize: 16,
                    fontWeight: 600, color: INK, textAlign: 'right',
                  }}
                >
                  <span>{faq.q as string}</span>
                  <span style={{
                    transition: 'transform 0.25s ease',
                    transform: faqOpen === (faq.id as string) ? 'rotate(180deg)' : 'rotate(0deg)',
                    color: ACC, display: 'flex',
                  }}>
                    {Icons.chevronDown?.({ size: 18 })}
                  </span>
                </button>
                {faqOpen === (faq.id as string) && (
                  <div style={{ padding: '0 24px 20px', fontSize: 15, color: MUTED, lineHeight: 1.9 }}>
                    {faq.a as string}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" style={{
        padding: '100px 24px', background: `linear-gradient(135deg, ${PR}, #0a2c20)`,
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.25em', color: ACC, textTransform: 'uppercase' }}>ابدأ معنا</span>
          <h2 style={{ fontFamily: 'Reem Kufi, serif', fontSize: 42, fontWeight: 700, color: '#fff', margin: '12px 0 16px', lineHeight: 1.3 }}>
            هل لديك فكرة مشروع؟
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', marginBottom: 36, lineHeight: 1.8 }}>
            تواصل معنا لنحول فكرتك إلى واقع. استشارة أولية مجانية.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`https://wa.me/${(tenant.phone as string)?.replace(/\D/g, '') || '966501234567'}`} target="_blank" rel="noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '15px 34px', background: '#25D366', color: '#fff',
              borderRadius: 10, fontWeight: 600, fontSize: 16, textDecoration: 'none',
              transition: 'all 0.2s ease', boxShadow: '0 6px 24px rgba(37,211,102,0.35)',
            }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }} onMouseLeave={e => { e.currentTarget.style.transform = '' }}>
              {Icons.whatsapp?.({ size: 19 })}
              تواصل واتساب
            </a>
            <a href={`tel:${tenant.phone as string || '+966501234567'}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '15px 34px', background: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.3)', color: '#fff',
              borderRadius: 10, fontWeight: 500, fontSize: 16, textDecoration: 'none',
              transition: 'all 0.2s ease',
            }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'transparent' }}>
              {Icons.phone?.({ size: 19 })}
              {tenant.phone as string}
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        background: '#0a2c20', padding: '70px 24px 32px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.2fr', gap: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: ACC, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Reem Kufi, serif', fontWeight: 700, fontSize: 16 }}>ف</div>
              <span style={{ fontWeight: 600, fontSize: 17, color: '#fff', fontFamily: 'Reem Kufi, serif' }}>{tenant.name_ar as string}</span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.9, margin: 0 }}>
              {tenant.bio_ar as string}
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>روابط سريعة</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['/', 'الرئيسية'], [`/${domain}/projects`, 'مشاريع'], [`/${domain}/contact`, 'تواصل معنا']].map(([href, label]) => (
                <Link key={href as string} href={href as string} style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', textDecoration: 'none', transition: 'color 0.2s' }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 20 }}>تواصل معنا</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Boolean(tenant.phone) && (
                <a href={`tel:${tenant.phone as string}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
                  {Icons.phone?.({ size: 14 })}
                  {tenant.phone as string}
                </a>
              )}
              {Boolean(tenant.email) && (
                <a href={`mailto:${tenant.email as string}`} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}>
                  {Icons.mail?.({ size: 14 })}
                  {tenant.email as string}
                </a>
              )}
              {Boolean(tenant.address_ar) && (
                <p style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0 }}>
                  {Icons.map?.({ size: 14 })}
                  {tenant.address_ar as string}
                </p>
              )}
            </div>
            {socials.length > 0 && (
              <div style={{ display: 'flex', gap: 14, marginTop: 20 }}>
                {socials.map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.35)', display: 'flex', transition: 'color 0.2s' }}>
                    {Icons[s.icon]?.({ size: 18 })}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '40px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
            &copy; {new Date().getFullYear()} {tenant.name_ar as string} — جميع الحقوق محفوظة
          </p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)', margin: 0 }}>مدعوم بالمنصة</p>
        </div>
      </footer>

      {/* ── Floating Template Picker (demo only) ── */}
      {domain === 'demo' && (
        <>
          <button
            onClick={() => setTplOpen(!tplOpen)}
            title="تغيير القالب"
            style={{
              position: 'fixed', bottom: 24, left: 24, zIndex: 200,
              width: 50, height: 50, borderRadius: '50%',
              background: PR, color: '#fff', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 4px 20px rgba(14,59,46,0.35)',
              transition: 'all 0.25s ease',
            }}
          >
            {Icons.grid?.({ size: 20 })}
          </button>
          {tplOpen && (
            <div style={{
              position: 'fixed', bottom: 88, left: 24, zIndex: 200,
              background: '#fff', borderRadius: 16, padding: 16,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)', width: 220,
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: INK, marginBottom: 4, fontFamily: 'Reem Kufi, serif' }}>اختر القالب</div>
              {TPL_LABELS.map((label, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveTpl(i); setTplOpen(false) }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 10, border: 'none',
                    background: activeTpl === i ? SOFT : 'transparent',
                    cursor: 'pointer', fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                    fontSize: 14, color: INK, fontWeight: activeTpl === i ? 600 : 400,
                    transition: 'all 0.2s ease', textAlign: 'right', width: '100%',
                  }}
                >
                  <div style={{
                    width: 14, height: 14, borderRadius: 4,
                    background: TPL_COLORS[i], flexShrink: 0,
                  }} />
                  {label}
                  {activeTpl === i && <span style={{ marginRight: 'auto', color: PR, fontWeight: 600, fontSize: 12 }}>&#10003;</span>}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Responsive Media ── */}
      <style>{`
        @media (max-width: 1024px) {
          section > div { padding: 0 8px !important; }
          h1 { font-size: 48px !important; }
          h2 { font-size: 32px !important; }
        }
        @media (max-width: 768px) {
          h1 { font-size: 36px !important; }
          h2 { font-size: 28px !important; }
          nav a { display: none; }
          section { padding: 60px 16px !important; }
          #home { padding: 100px 16px 60px !important; min-height: auto !important; }
          [style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
          #home [style*="font-size:64px"] { font-size: 36px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          [style*="grid-template-columns: repeat(3,1fr)"] {
            grid-template-columns: repeat(2,1fr) !important;
          }
        }
        @media (min-width: 769px) {
          [style*="grid-template-columns: repeat(4,1fr)"] {
            grid-template-columns: repeat(2,1fr) !important;
          }
        }
        @media (min-width: 1025px) {
          [style*="grid-template-columns: repeat(4,1fr)"] {
            grid-template-columns: repeat(4,1fr) !important;
          }
        }
      `}</style>
    </div>
  )
}
