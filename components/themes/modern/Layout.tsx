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
  { Icon: Award, title: 'خبرة واسعة', desc: 'سنوات من الإبداع والتميز في مجال الهندسة' },
  { Icon: Users, title: 'فريق متخصص', desc: 'مهندسون ومصممون بأعلى المؤهلات' },
  { Icon: Clock, title: 'الالتزام بالمواعيد', desc: 'نلتزم بالجدول الزمني المتفق عليه دائماً' },
  { Icon: Shield, title: 'جودة مضمونة', desc: 'معايير صارمة في كل مرحلة من مراحل التنفيذ' },
  { Icon: Star, title: 'تصاميم مبتكرة', desc: 'حلول إبداعية تجمع الجمال والعملية' },
  { Icon: CheckCircle2, title: 'متابعة مستمرة', desc: 'دعم كامل قبل وأثناء وبعد التنفيذ' },
]

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function ModernLayout({ tenant, projects, featuredProjects, services: customServices, features: customFeatures }: ThemeProps) {
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
    { url: tenant.instagram_url, label: 'إنستقرام' },
    { url: tenant.twitter_url, label: 'تويتر' },
    { url: tenant.linkedin_url, label: 'لينكدإن' },
    { url: tenant.snapchat_url, label: 'سناب شات' },
  ].filter(s => s.url)

  const hasTopBar = !!(tenant.phone || tenant.email || socials.length)

  return (
    <div className="min-h-screen bg-[#0f0f0f]" dir="rtl">

      {/* TOP BAR */}
      {hasTopBar && (
        <div className="bg-white/[0.03] border-b border-white/5 px-6 py-2 hidden md:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs text-white/40">
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors" dir="ltr">
                  <Phone className="w-3 h-3" />{tenant.phone}
                </a>
              )}
              {tenant.email && (
                <a href={`mailto:${tenant.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                  <Mail className="w-3 h-3" />{tenant.email}
                </a>
              )}
            </div>
            <div className="flex items-center gap-3">
              {socials.map(s => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors text-[10px] tracking-widest uppercase">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NAV */}
      <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0f0f0f]/95 backdrop-blur border-b border-white/5' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo_url && (
              <Image src={tenant.logo_url} alt="" width={32} height={32} className="rounded-full object-cover" />
            )}
            <span className="text-white font-bold tracking-tight">{tenant.name_ar}</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-white/50">
            <Link href={`/${tenant.slug}`} className="hover:text-white transition-colors">الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} className="hover:text-white transition-colors">المشاريع</Link>
            <Link href={`/${tenant.slug}/contact`} className="bg-white text-black px-4 py-1.5 rounded-full font-medium hover:bg-white/90 transition-colors">تواصل</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="min-h-[90vh] flex flex-col justify-end pb-20 px-6 pt-16 relative overflow-hidden">
        {tenant.cover_url ? (
          <>
            <Image src={tenant.cover_url} alt="" fill className="object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/60 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#0f0f0f] to-black" />
        )}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">مكتب هندسي</p>
              <h1 className="text-6xl md:text-8xl font-black text-white leading-none mb-6">{tenant.name_ar}</h1>
              {tenant.name_en && <p className="text-white/30 text-lg font-light" dir="ltr">{tenant.name_en}</p>}
            </div>
            <p className="text-white/50 max-w-xs leading-relaxed text-sm md:text-right">{bio}</p>
          </div>
          <div className="mt-12 flex gap-4">
            <Link href={`/${tenant.slug}/projects`} className="bg-white text-black px-8 py-3 font-bold hover:bg-white/90 transition-colors">
              استعرض المشاريع
            </Link>
            <Link href={`/${tenant.slug}/contact`} className="border border-white/20 text-white px-8 py-3 font-medium hover:border-white/50 transition-colors">
              تواصل معنا
            </Link>
          </div>
          {projects.length > 0 && (
            <div className="mt-16 pt-8 border-t border-white/10">
              <div>
                <span className="text-4xl font-black text-white">{projects.length}+</span>
                <p className="text-white/30 text-xs mt-1 tracking-widest uppercase">مشروع منجز</p>
              </div>
            </div>
          )}
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/20">
          <span className="text-xs tracking-widest">scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-black/30 text-xs tracking-[0.3em] uppercase mb-4">من نحن</p>
            <h2 className="text-5xl font-black text-black mb-8 leading-tight">نبني أحلامك<br />بدقة وإبداع</h2>
            <p className="text-black/60 leading-loose">{bio}</p>
            {tenant.address_ar && (
              <p className="mt-6 text-black/40 text-sm flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                {tenant.address_ar}
              </p>
            )}
            <Link href={`/${tenant.slug}/contact`} className="inline-block mt-8 border-2 border-black text-black px-8 py-3 font-bold hover:bg-black hover:text-white transition-colors">
              تواصل معنا
            </Link>
          </div>
          {tenant.cover_url ? (
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
            </div>
          ) : (
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-8xl font-black text-gray-300">{tenant.name_ar.charAt(0)}</span>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-[#0f0f0f] py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">خدماتنا</p>
            <h2 className="text-5xl font-black text-white">ما نقدمه لك</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
            {(customServices && customServices.length > 0
              ? customServices.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.description ?? '' }))
              : SERVICES
            ).map(({ Icon, title, desc }) => (
              <div key={title} className="bg-[#0f0f0f] p-8 hover:bg-white/5 transition-colors group">
                <Icon className="w-8 h-8 text-white/20 mb-6 group-hover:text-white transition-colors" />
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 ? (
        <section className="bg-white py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end justify-between mb-16">
              <h2 className="text-5xl font-black text-black">مشاريع<br />مختارة</h2>
              <Link href={`/${tenant.slug}/projects`} className="text-black/40 hover:text-black text-sm transition-colors flex items-center gap-2">
                جميع المشاريع <span>←</span>
              </Link>
            </div>
            <div className="grid grid-cols-12 gap-3">
              {featuredProjects.slice(0, 5).map((p, i) => {
                const sizes = [
                  'col-span-12 md:col-span-7 aspect-[16/9]',
                  'col-span-12 md:col-span-5 aspect-[4/3]',
                  'col-span-12 md:col-span-4 aspect-square',
                  'col-span-12 md:col-span-4 aspect-square',
                  'col-span-12 md:col-span-4 aspect-square',
                ]
                return (
                  <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
                    className={`group relative overflow-hidden bg-gray-100 ${sizes[i] ?? 'col-span-12 md:col-span-4 aspect-square'}`}>
                    {p.cover_image_url ? (
                      <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-300 text-4xl font-black">{p.title_ar.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="absolute bottom-0 inset-x-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-bold text-lg">{p.title_ar}</p>
                      {p.category && <p className="text-white/60 text-sm">{p.category}</p>}
                    </div>
                    {p.is_featured && (
                      <div className="absolute top-3 right-3 bg-white text-black text-xs font-bold px-2 py-0.5">مميز</div>
                    )}
                  </Link>
                )
              })}
            </div>
            {projects.length > 6 && (
              <div className="text-center mt-10">
                <Link href={`/${tenant.slug}/projects`} className="inline-block bg-black text-white px-10 py-3 font-bold hover:bg-black/80 transition-colors">
                  عرض جميع المشاريع ({projects.length})
                </Link>
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="bg-white py-24 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-black/30 text-xs tracking-[0.3em] uppercase mb-4">المشاريع</p>
            <h2 className="text-5xl font-black text-black/10 mb-4">قريباً</h2>
            <p className="text-black/30 text-sm">سيتم إضافة مشاريعنا قريباً — ترقبونا</p>
          </div>
        </section>
      )}

      {/* WHY US */}
      <section className="bg-[#0f0f0f] py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-white/30 text-xs tracking-[0.3em] uppercase mb-4">لماذا نحن</p>
            <h2 className="text-5xl font-black text-white">ما يميزنا</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(customFeatures && customFeatures.length > 0
              ? customFeatures.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.description ?? '' }))
              : WHY_US
            ).map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white/40" />
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-4xl font-black text-black mb-2">هل لديك مشروع؟</h3>
            <p className="text-black/40">دعنا نحوّل فكرتك إلى واقع</p>
          </div>
          <div className="flex gap-4 flex-wrap">
            {waUrl && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-8 py-3 font-bold hover:bg-[#20BA5A] transition-colors flex items-center gap-2">
                <WhatsAppIcon />
                واتساب
              </a>
            )}
            <Link href={`/${tenant.slug}/contact`} className="bg-black text-white px-8 py-3 font-bold hover:bg-black/80 transition-colors">
              ابدأ الآن
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0f0f0f] border-t border-white/5 py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {tenant.logo_url && (
                <Image src={tenant.logo_url} alt="" width={32} height={32} className="rounded-full object-cover" />
              )}
              <span className="text-white font-bold">{tenant.name_ar}</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed line-clamp-3">{bio}</p>
          </div>
          <div>
            <h4 className="text-white/50 text-xs tracking-widest uppercase mb-6">روابط سريعة</h4>
            <div className="space-y-3">
              {[['/', 'الرئيسية'], ['/projects', 'المشاريع'], ['/contact', 'تواصل معنا']].map(([href, label]) => (
                <Link key={href} href={`/${tenant.slug}${href}`} className="block text-white/40 hover:text-white transition-colors text-sm">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white/50 text-xs tracking-widest uppercase mb-6">تواصل معنا</h4>
            <div className="space-y-3">
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm" dir="ltr">
                  <Phone className="w-4 h-4" />{tenant.phone}
                </a>
              )}
              {tenant.email && (
                <a href={`mailto:${tenant.email}`} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm">
                  <Mail className="w-4 h-4" />{tenant.email}
                </a>
              )}
              {tenant.address_ar && (
                <p className="flex items-start gap-2 text-white/30 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />{tenant.address_ar}
                </p>
              )}
            </div>
            {socials.length > 0 && (
              <div className="flex gap-4 mt-6">
                {socials.map(s => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white transition-colors text-xs tracking-widest">
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
          <p className="text-white/20 text-xs">جميع الحقوق محفوظة {new Date().getFullYear()} © {tenant.name_ar}</p>
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="text-white/20 text-xs hover:text-[#25D366] transition-colors flex items-center gap-1.5">
              <WhatsAppIcon />
              تواصل عبر واتساب
            </a>
          )}
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
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  )
}
