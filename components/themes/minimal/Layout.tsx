'use client'

import { ThemeProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Building2, Layers, Eye, Lightbulb, MapPin, ClipboardList,
  Award, Users, Clock, Shield, Star, CheckCircle2,
  Phone, Mail, ArrowUp,
} from 'lucide-react'
import { resolveIcon } from '@/components/themes/iconMap'
import { getSectorConfig } from '@/lib/sectors'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function MinimalLayout({ tenant, projects, featuredProjects, services: customServices, features: customFeatures, sectorConfig }: ThemeProps) {
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

  const socials = [
    { url: tenant.instagram_url, label: 'Instagram' },
    { url: tenant.twitter_url, label: 'Twitter' },
    { url: tenant.linkedin_url, label: 'LinkedIn' },
  ].filter(s => s.url)

  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* NAV */}
      <header className={`px-10 py-5 flex items-center justify-between sticky top-0 z-50 bg-white transition-shadow ${scrolled ? 'border-b border-gray-100 shadow-sm' : ''}`}>
        <div className="flex items-center gap-3">
          {tenant.logo_url && (
            <Image src={tenant.logo_url} alt="" width={28} height={28} className="rounded-full object-cover opacity-70" />
          )}
          <span className="text-[11px] text-gray-400 tracking-[0.25em] uppercase">{tenant.name_ar}</span>
        </div>
        <nav className="flex gap-8 text-[11px] text-gray-300 tracking-[0.2em] uppercase">
          <Link href={`/${tenant.slug}/projects`} className="hover:text-gray-700 transition-colors">{sc.portfolioLabel}</Link>
          <Link href={`/${tenant.slug}/contact`} className="hover:text-gray-700 transition-colors">تواصل</Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="px-10 pt-16 pb-24">
        <h1 className="text-[10vw] font-extralight text-gray-900 leading-[0.95] tracking-tight mb-12">
          {tenant.name_ar}
        </h1>
        <p className="text-gray-400 font-light text-base leading-loose max-w-sm">{bio}</p>
        <div className="mt-10 flex gap-6">
          <Link href={`/${tenant.slug}/projects`} className="text-[11px] text-gray-900 tracking-[0.2em] uppercase border-b border-gray-900 pb-0.5 hover:text-gray-400 hover:border-gray-400 transition-colors">
            استعرض {sc.portfolioLabel}
          </Link>
          <Link href={`/${tenant.slug}/contact`} className="text-[11px] text-gray-300 tracking-[0.2em] uppercase border-b border-gray-200 pb-0.5 hover:text-gray-700 transition-colors">
            تواصل معنا
          </Link>
        </div>
        {tenant.cover_url && (
          <div className="relative w-full aspect-[21/9] mt-20 overflow-hidden">
            <Image src={tenant.cover_url} alt="" fill className="object-cover" />
          </div>
        )}
        {projects.length > 0 && (
          <div className="mt-12 flex items-baseline gap-2">
            <span className="text-5xl font-extralight text-gray-900">{projects.length}</span>
            <span className="text-[11px] text-gray-300 tracking-[0.2em] uppercase">{sc.portfolioItemLabel} منجز</span>
          </div>
        )}
      </section>

      {/* ABOUT */}
      {(tenant.bio_ar || tenant.bio_en) && (
        <section className="px-10 py-20 border-t border-gray-100">
          <p className="text-[11px] text-gray-300 tracking-[0.3em] uppercase mb-12">من نحن</p>
          <div className="max-w-2xl">
            <p className="text-gray-600 font-light text-xl leading-loose">{bio}</p>
            {tenant.address_ar && (
              <p className="mt-8 text-gray-300 text-[11px] tracking-widest uppercase flex items-center gap-2">
                <MapPin className="w-3 h-3" />{tenant.address_ar}
              </p>
            )}
          </div>
        </section>
      )}

      {/* SERVICES */}
      <section className="px-10 py-20 border-t border-gray-100 bg-gray-50">
        <p className="text-[11px] text-gray-300 tracking-[0.3em] uppercase mb-12">{sc.servicesLabel}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {(customServices && customServices.length > 0
            ? customServices.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.description ?? '' }))
            : sc.services.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.desc }))
          ).map(({ Icon, title, desc }, i) => (
            <div key={title} className={`py-6 flex gap-6 items-start ${i % 2 === 0 ? 'md:border-l border-gray-200' : ''} border-b border-gray-200`}>
              <Icon className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-gray-700 font-light text-sm mb-1">{title}</h3>
                <p className="text-gray-300 text-[11px] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {projects.length > 0 ? (
        <section className="px-10 py-20 border-t border-gray-100">
          <p className="text-[11px] text-gray-300 tracking-[0.3em] uppercase mb-12">
            {featuredProjects.length > 0 ? sc.featuredLabel : sc.portfolioLabel}
          </p>
          <div className="space-y-0">
            {(featuredProjects.length > 0 ? featuredProjects : projects).map((p, i) => (
              <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
                className="group flex items-start gap-8 py-6 border-b border-gray-100 hover:border-gray-300 transition-colors">
                <span className="text-[11px] text-gray-200 font-light w-8 pt-1 flex-shrink-0 group-hover:text-gray-400 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 flex items-start justify-between gap-8">
                  <div>
                    <h3 className="text-xl font-light text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">{p.title_ar}</h3>
                    {p.cover_image_url && (
                      <div className="relative w-32 h-20 mt-3 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
                        <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-6 text-[11px] text-gray-300 tracking-widest flex-shrink-0 pt-1">
                    {p.year && <span>{p.year}</span>}
                    {p.category && <span>{p.category}</span>}
                    {p.is_featured && <span className="text-gray-400">مميز</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link href={`/${tenant.slug}/projects`} className="inline-block mt-10 text-[11px] text-gray-300 tracking-[0.2em] uppercase hover:text-gray-700 transition-colors border-b border-transparent hover:border-gray-300 pb-0.5">
            {projects.length > 6 ? `جميع ${sc.portfolioLabel} (${projects.length})` : `جميع ${sc.portfolioLabel}`}
          </Link>
        </section>
      ) : (
        <section className="px-10 py-20 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-200 tracking-[0.3em] uppercase mb-4">المشاريع</p>
          <p className="text-gray-200 font-extralight text-4xl">قريباً</p>
        </section>
      )}

      {/* WHY US */}
      <section className="px-10 py-20 border-t border-gray-100">
        <p className="text-[11px] text-gray-300 tracking-[0.3em] uppercase mb-12">لماذا نحن</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {(customFeatures && customFeatures.length > 0
            ? customFeatures.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.description ?? '' }))
            : sc.features.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.desc }))
          ).map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-4">
              <Icon className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-gray-700 font-light text-sm mb-0.5">{title}</h3>
                <p className="text-gray-300 text-[11px] leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-900 py-20 px-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <p className="text-[11px] text-gray-500 tracking-[0.3em] uppercase mb-2">ابدأ مشروعك</p>
            <h3 className="text-3xl font-extralight text-white">{sc.cta}</h3>
          </div>
          <div className="flex gap-4">
            {waUrl && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase hover:bg-[#20BA5A] transition-colors flex items-center gap-2">
                <WhatsAppIcon />
                واتساب
              </a>
            )}
            <Link href={`/${tenant.slug}/contact`} className="border border-white/20 text-white px-8 py-2.5 text-[11px] tracking-[0.2em] uppercase hover:bg-white hover:text-gray-900 transition-colors">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-10 py-12 bg-gray-50 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          <div>
            <span className="text-[11px] text-gray-400 tracking-[0.25em] uppercase block mb-3">{tenant.name_ar}</span>
            <p className="text-gray-300 text-xs leading-relaxed line-clamp-3 font-light">{bio}</p>
          </div>
          <div>
            <span className="text-[10px] text-gray-300 tracking-[0.3em] uppercase block mb-4">روابط</span>
            <div className="space-y-2">
              {[['/', 'الرئيسية'], ['/projects', sc.portfolioLabel], ['/contact', 'تواصل']].map(([href, label]) => (
                <Link key={href} href={`/${tenant.slug}${href}`} className="block text-gray-300 hover:text-gray-700 transition-colors text-[11px] tracking-widest uppercase">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-gray-300 tracking-[0.3em] uppercase block mb-4">تواصل</span>
            <div className="space-y-2">
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="flex items-center gap-2 text-gray-300 hover:text-gray-700 transition-colors text-[11px]" dir="ltr">
                  <Phone className="w-3 h-3" />{tenant.phone}
                </a>
              )}
              {tenant.email && (
                <a href={`mailto:${tenant.email}`} className="flex items-center gap-2 text-gray-300 hover:text-gray-700 transition-colors text-[11px]">
                  <Mail className="w-3 h-3" />{tenant.email}
                </a>
              )}
            </div>
            {socials.length > 0 && (
              <div className="flex gap-3 mt-4">
                {socials.map(s => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-gray-700 transition-colors">
{s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 flex items-center justify-between">
          <span className="text-[11px] text-gray-200 tracking-widest uppercase">&copy; {new Date().getFullYear()} {tenant.name_ar}</span>
          {tenant.phone && (
            <a href={`tel:${tenant.phone}`} className="text-[11px] text-gray-300 hover:text-gray-700 transition-colors tracking-widest" dir="ltr">{tenant.phone}</a>
          )}
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      {waUrl && (
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 w-12 h-12 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110">
          <WhatsAppIcon />
        </a>
      )}

      {/* BACK TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 bg-gray-900 text-white flex items-center justify-center shadow-lg transition-all duration-300 ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  )
}
