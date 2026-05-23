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

const DEFAULT_BIO = 'نحن مكتب هندسي متخصص في تقديم حلول معمارية مبتكرة ومتكاملة، نسعى دائماً لتحقيق أعلى معايير الجودة والإبداع في كل مشروع نتولاه.'

const SERVICES = [
  { Icon: Building2, title: 'تصميم معماري', desc: 'تصميم مبدع وعملي يعكس هوية مكانك' },
  { Icon: Layers, title: 'تصميم داخلي', desc: 'فضاءات داخلية أنيقة بتفصيل متقن' },
  { Icon: Eye, title: 'إشراف على التنفيذ', desc: 'رقابة دقيقة تضمن أعلى معايير الجودة' },
  { Icon: Lightbulb, title: 'استشارات هندسية', desc: 'حلول مبتكرة لكل تحديات مشروعك' },
  { Icon: MapPin, title: 'تخطيط عمراني', desc: 'مجمعات ومدن تجمع الجمال والوظيفة' },
  { Icon: ClipboardList, title: 'إدارة مشاريع', desc: 'تسليم في الوقت المحدد بأعلى كفاءة' },
]

const WHY_US = [
  { Icon: Award, title: 'خبرة واسعة' },
  { Icon: Users, title: 'فريق متخصص' },
  { Icon: Clock, title: 'الالتزام بالمواعيد' },
  { Icon: Shield, title: 'جودة مضمونة' },
  { Icon: Star, title: 'تصاميم مبتكرة' },
  { Icon: CheckCircle2, title: 'متابعة مستمرة' },
]

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function BoldLayout({ tenant, projects, featuredProjects, services: customServices, features: customFeatures }: ThemeProps) {
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

  const bio = tenant.bio_ar || DEFAULT_BIO
  const waPhone = tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null

  const socials = [
    { url: tenant.instagram_url, label: 'Instagram' },
    { url: tenant.twitter_url, label: 'Twitter' },
    { url: tenant.linkedin_url, label: 'LinkedIn' },
  ].filter(s => s.url)

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" dir="rtl">

      {/* TOP BAR */}
      <div className="bg-red-600 px-6 py-2 flex items-center justify-between text-xs font-bold tracking-widest uppercase">
        <div className="flex items-center gap-4">
          {tenant.phone && <a href={`tel:${tenant.phone}`} dir="ltr" className="hover:text-black transition-colors">{tenant.phone}</a>}
          {tenant.email && <span className="hidden md:inline opacity-70">{tenant.email}</span>}
        </div>
        <div className="flex items-center gap-2">
          {socials.map(s => (
            <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">
{s.label}
            </a>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav className={`sticky top-0 z-50 border-b-4 border-red-600 px-6 py-4 flex items-center justify-between bg-black transition-shadow ${scrolled ? 'shadow-2xl shadow-red-600/10' : ''}`}>
        <span className="text-white font-black text-xl uppercase tracking-tighter">{tenant.name_ar}</span>
        <div className="flex gap-0">
          {[['/', 'الرئيسية'], ['/projects', 'المشاريع'], ['/contact', 'تواصل']].map(([href, label]) => (
            <Link key={href} href={`/${tenant.slug}${href}`} className="px-5 py-2 text-sm font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-red-600 transition-all">{label}</Link>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[92vh] flex flex-col justify-center px-6 overflow-hidden">
        {tenant.cover_url && (
          <Image src={tenant.cover_url} alt="" fill className="object-cover opacity-10" />
        )}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="text-[25vw] font-black text-white/[0.02] leading-none select-none whitespace-nowrap">{tenant.name_ar}</span>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-3 h-3 bg-red-600" />
            <span className="text-red-600 text-xs font-black tracking-[0.3em] uppercase">مكتب هندسي</span>
          </div>
          <h1 className="text-[15vw] md:text-[12vw] font-black leading-none mb-6 tracking-tighter"
            style={{ WebkitTextStroke: '2px white', color: 'transparent' }}>
            {tenant.name_ar}
          </h1>
          <div className="w-full h-1 bg-red-600 mb-6" />
          {!tenant.cover_url && (
            <p className="text-white/50 text-lg max-w-lg leading-relaxed">{bio}</p>
          )}
          <div className="mt-10 flex gap-4 flex-wrap">
            <Link href={`/${tenant.slug}/projects`} className="bg-red-600 hover:bg-red-700 text-white font-black text-lg px-10 py-4 uppercase tracking-widest transition-colors">
              المشاريع
            </Link>
            <Link href={`/${tenant.slug}/contact`} className="border-2 border-white/20 hover:border-white text-white font-black text-lg px-10 py-4 uppercase tracking-widest transition-colors">
              تواصل
            </Link>
          </div>
          {projects.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <span className="text-5xl font-black text-red-600">{projects.length}</span>
              <span className="text-white/30 text-sm font-black uppercase tracking-widest mr-3">مشروع منجز</span>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white text-black py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="w-3 h-3 bg-red-600" />
              <span className="text-red-600 text-xs font-black tracking-[0.3em] uppercase">من نحن</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black leading-none mb-8">نبني<br />الأحلام</h2>
            <p className="text-black/60 leading-loose">{bio}</p>
            {tenant.address_ar && (
              <p className="mt-4 text-black/40 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />{tenant.address_ar}
              </p>
            )}
          </div>
          {tenant.cover_url ? (
            <div className="relative aspect-video overflow-hidden">
              <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
              <div className="absolute inset-0 border-4 border-red-600 translate-x-2 translate-y-2 -z-10" />
            </div>
          ) : (
            <div className="aspect-video bg-black flex items-center justify-center">
              <span className="text-red-600 text-[8rem] font-black leading-none">{tenant.name_ar.charAt(0)}</span>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section className="border-t-4 border-red-600 bg-black py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-600" />
                <span className="text-red-600 text-xs font-black tracking-[0.3em] uppercase">خدماتنا</span>
              </div>
              <h2 className="text-4xl font-black uppercase">ما نقدمه</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5">
            {(customServices && customServices.length > 0
              ? customServices.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.description ?? '' }))
              : SERVICES
            ).map(({ Icon, title, desc }) => (
              <div key={title} className="bg-black p-8 group hover:bg-red-600 transition-colors">
                <Icon className="w-8 h-8 text-red-600 group-hover:text-white mb-4" />
                <h3 className="font-black text-white text-lg uppercase mb-1">{title}</h3>
                <p className="text-white/40 group-hover:text-white/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 ? (
        <section className="border-t-4 border-red-600">
          <div className="px-6 py-8 flex items-center justify-between bg-red-600">
            <h2 className="text-3xl font-black uppercase tracking-tighter">أعمالنا</h2>
            <Link href={`/${tenant.slug}/projects`} className="text-white/70 hover:text-white font-black text-sm uppercase tracking-widest transition-colors">
              الكل ←
            </Link>
          </div>
          {featuredProjects.slice(0, 4).map((p, i) => (
            <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`} className="group flex items-stretch border-b border-white/10 hover:border-red-600 transition-colors">
              <div className="w-16 md:w-24 flex-shrink-0 flex items-center justify-center border-l border-white/10 group-hover:border-red-600 transition-colors">
                <span className="text-white/20 font-black text-4xl group-hover:text-red-600 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div className="relative w-40 md:w-64 h-32 md:h-40 flex-shrink-0 overflow-hidden">
                {p.cover_image_url
                  ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  : <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <span className="text-red-600/50 text-3xl font-black">{p.title_ar.charAt(0)}</span>
                    </div>
                }
              </div>
              <div className="flex-1 p-6 flex flex-col justify-center">
                {p.category && <span className="text-red-600 text-xs font-black uppercase tracking-widest mb-1">{p.category}</span>}
                <h3 className="text-2xl md:text-3xl font-black leading-tight group-hover:text-red-500 transition-colors">{p.title_ar}</h3>
                {p.year && <span className="text-white/30 text-sm mt-2">{p.year}</span>}
              </div>
              <div className="flex items-center px-6 text-white/20 group-hover:text-red-600 transition-colors">
                <span className="text-3xl font-black">←</span>
              </div>
            </Link>
          ))}
          {projects.length > 4 && (
            <div className="px-6 py-6 border-t border-white/10">
              <Link href={`/${tenant.slug}/projects`} className="font-black text-sm uppercase tracking-widest text-white/40 hover:text-red-600 transition-colors">
                عرض جميع المشاريع ({projects.length}) ←
              </Link>
            </div>
          )}
        </section>
      ) : (
        <section className="border-t-4 border-red-600 py-20 px-6 text-center">
          <span className="text-red-600/30 text-xs font-black tracking-[0.3em] uppercase">المشاريع</span>
          <h2 className="text-6xl font-black text-white/10 mt-2 mb-3">COMING<br />SOON</h2>
          <p className="text-white/30 text-sm">سيتم إضافة مشاريعنا قريباً</p>
        </section>
      )}

      {/* WHY US */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8">
            <div className="w-3 h-3 bg-red-600" />
            <span className="text-red-600 text-xs font-black tracking-[0.3em] uppercase">لماذا نحن</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(customFeatures && customFeatures.length > 0
              ? customFeatures.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.description ?? '' }))
              : WHY_US.map(w => ({ ...w, desc: '' }))
            ).map(({ Icon, title }, i) => (
              <div key={title} className="border border-white/10 p-6 flex items-center gap-4 hover:border-red-600 transition-colors group">
                <span className="text-white/10 font-black text-3xl group-hover:text-red-600 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <Icon className="w-5 h-5 text-red-600 mb-1" />
                  <h3 className="font-black text-white text-sm uppercase">{title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center border-t-4 border-white/5">
        <h3 className="text-5xl md:text-7xl font-black mb-8">ابدأ مشروعك</h3>
        <div className="flex gap-4 justify-center flex-wrap">
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-black text-xl px-12 py-5 uppercase tracking-widest transition-colors flex items-center gap-3">
              <WhatsAppIcon />
              واتساب
            </a>
          )}
          <Link href={`/${tenant.slug}/contact`} className="inline-block bg-red-600 hover:bg-red-700 text-white font-black text-xl px-16 py-5 uppercase tracking-widest transition-colors">
            تواصل الآن
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t-4 border-red-600 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          <div>
            <h4 className="font-black text-xl uppercase tracking-tighter text-white mb-3">{tenant.name_ar}</h4>
            <p className="text-white/30 text-sm leading-relaxed line-clamp-3">{bio}</p>
          </div>
          <div>
            <h4 className="text-red-600 text-xs font-black tracking-[0.3em] uppercase mb-4">روابط سريعة</h4>
            <div className="space-y-2">
              {[['/', 'الرئيسية'], ['/projects', 'المشاريع'], ['/contact', 'تواصل']].map(([href, label]) => (
                <Link key={href} href={`/${tenant.slug}${href}`} className="block text-white/40 hover:text-red-600 transition-colors text-sm font-black uppercase tracking-widest">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-red-600 text-xs font-black tracking-[0.3em] uppercase mb-4">اتصل بنا</h4>
            <div className="space-y-2">
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="flex items-center gap-2 text-white/40 hover:text-red-600 transition-colors text-sm" dir="ltr">
                  <Phone className="w-4 h-4" />{tenant.phone}
                </a>
              )}
              {tenant.email && (
                <a href={`mailto:${tenant.email}`} className="flex items-center gap-2 text-white/40 hover:text-red-600 transition-colors text-sm">
                  <Mail className="w-4 h-4" />{tenant.email}
                </a>
              )}
            </div>
            {socials.length > 0 && (
              <div className="flex gap-3 mt-4">
                {socials.map(s => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-red-600 transition-colors">
{s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex items-center justify-between">
          <p className="text-white/20 text-xs font-black uppercase tracking-widest">
            &copy; {new Date().getFullYear()} {tenant.name_ar}
          </p>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      {waUrl && (
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110">
          <WhatsAppIcon />
        </a>
      )}

      {/* BACK TO TOP */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-red-600 text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  )
}
