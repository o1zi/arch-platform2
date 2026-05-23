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

function Ornament() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px flex-1 max-w-16 bg-[#8b6914]/40" />
      <div className="w-2 h-2 rotate-45 bg-[#8b6914]" />
      <div className="h-px flex-1 max-w-16 bg-[#8b6914]/40" />
    </div>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function ClassicLayout({ tenant, projects, featuredProjects, services: customServices, features: customFeatures }: ThemeProps) {
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

  const bio = tenant.bio_ar || DEFAULT_BIO
  const waPhone = tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null

  const socials = [
    { url: tenant.instagram_url, label: 'إنستقرام' },
    { url: tenant.twitter_url, label: 'تويتر' },
    { url: tenant.linkedin_url, label: 'لينكدإن' },
  ].filter(s => s.url)

  return (
    <div className="min-h-screen bg-[#f5f0e8]" dir="rtl">

      {/* TOP BAR */}
      <div className="border-b-2 border-[#2c1a0e] px-8 py-2 flex items-center justify-between text-[10px] tracking-[0.2em] text-[#2c1a0e]/50 uppercase">
        <span>{new Date().getFullYear()}</span>
        <span>مكتب هندسي</span>
        <div className="flex items-center gap-4">
          {tenant.phone && <span dir="ltr">{tenant.phone}</span>}
          {tenant.email && <span>{tenant.email}</span>}
        </div>
      </div>

      {/* MASTHEAD / NAV */}
      <header className={`border-b-4 border-double border-[#2c1a0e] px-8 py-8 text-center sticky top-0 z-50 bg-[#f5f0e8] transition-shadow ${scrolled ? 'shadow-lg' : ''}`}>
        {tenant.logo_url && (
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <Image src={tenant.logo_url} alt="" fill className="object-contain rounded-full" />
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-black text-[#2c1a0e] tracking-tight leading-none">{tenant.name_ar}</h1>
        {tenant.name_en && <p className="text-[#8b6914] text-sm mt-2 tracking-widest uppercase" dir="ltr">{tenant.name_en}</p>}
        <Ornament />
        <nav className="flex justify-center gap-10 text-sm text-[#2c1a0e]/70 tracking-widest uppercase">
          {[['/', 'الرئيسية'], ['/projects', 'المشاريع'], ['/contact', 'التواصل']].map(([href, label]) => (
            <Link key={href} href={`/${tenant.slug}${href}`} className="hover:text-[#8b6914] border-b border-transparent hover:border-[#8b6914] pb-0.5 transition-colors">{label}</Link>
          ))}
        </nav>
      </header>

      {/* HERO / COVER */}
      {tenant.cover_url ? (
        <div className="relative h-72 md:h-[480px] overflow-hidden">
          <Image src={tenant.cover_url} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#2c1a0e]/30" />
          <div className="absolute inset-0 flex items-end justify-center pb-12">
            <p className="text-[#f5f0e8] text-lg max-w-lg text-center leading-relaxed opacity-90">{bio}</p>
          </div>
        </div>
      ) : (
        <div className="bg-[#2c1a0e] py-20 px-8 text-center">
          <p className="text-[#f5f0e8]/70 text-base max-w-xl mx-auto leading-relaxed">{bio}</p>
        </div>
      )}

      {/* ABOUT */}
      <section className="max-w-5xl mx-auto px-8 py-16">
        <div className="text-center mb-10">
          <p className="text-[#8b6914] text-xs tracking-[0.3em] uppercase mb-1">من نحن</p>
          <h2 className="text-3xl font-black text-[#2c1a0e]">قصة مكتبنا</h2>
          <Ornament />
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <p className="text-[#2c1a0e]/70 leading-loose text-base">{bio}</p>
          <div className="grid grid-cols-2 gap-4 text-center">
            {projects.length > 0 && (
              <div className="border-2 border-[#8b6914]/30 p-6">
                <span className="text-4xl font-black text-[#2c1a0e]">{projects.length}</span>
                <p className="text-[#8b6914] text-xs tracking-widest uppercase mt-1">مشروع</p>
              </div>
            )}
            {tenant.address_ar && (
              <div className="border-2 border-[#8b6914]/30 p-6 col-span-2">
                <p className="text-[#2c1a0e]/50 text-xs tracking-widest uppercase mb-1">موقعنا</p>
                <p className="text-[#2c1a0e] text-sm font-medium">{tenant.address_ar}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="bg-white border-t border-b border-[#2c1a0e]/10 py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#8b6914] text-xs tracking-[0.3em] uppercase mb-1">خدماتنا</p>
            <h2 className="text-3xl font-black text-[#2c1a0e]">ما نقدمه</h2>
            <Ornament />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {(customServices && customServices.length > 0
              ? customServices.map(s => ({ Icon: resolveIcon(s.icon), title: s.title, desc: s.description ?? '' }))
              : SERVICES
            ).map(({ Icon, title, desc }) => (
              <div key={title} className="border border-[#8b6914]/20 p-6 text-center hover:border-[#8b6914] transition-colors">
                <div className="w-10 h-10 border border-[#8b6914]/30 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-4 h-4 text-[#8b6914]" />
                </div>
                <h3 className="text-[#2c1a0e] font-bold mb-1">{title}</h3>
                <p className="text-[#2c1a0e]/50 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 ? (
        <section className="max-w-5xl mx-auto px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-[#8b6914] text-xs tracking-[0.3em] uppercase mb-1">معرض الأعمال</p>
            <h2 className="text-3xl font-black text-[#2c1a0e]">مشاريع مختارة</h2>
            <Ornament />
          </div>

          {featuredProjects[0] && (
            <Link href={`/${tenant.slug}/projects/${featuredProjects[0].id}`} className="group block mb-8">
              <div className="relative aspect-[21/9] overflow-hidden border-2 border-[#2c1a0e]/10">
                {featuredProjects[0].cover_image_url
                  ? <Image src={featuredProjects[0].cover_image_url} alt={featuredProjects[0].title_ar} fill className="object-cover group-hover:scale-103 transition-transform duration-700" />
                  : <div className="w-full h-full bg-[#2c1a0e]/5 flex items-center justify-center">
                      <span className="text-[#8b6914]/30 text-4xl font-black">{featuredProjects[0].title_ar.charAt(0)}</span>
                    </div>
                }
                {featuredProjects[0].is_featured && (
                  <div className="absolute top-3 right-3 bg-[#8b6914] text-white text-xs px-2 py-0.5 tracking-widest uppercase">مميز</div>
                )}
              </div>
              <div className="border-2 border-t-0 border-[#2c1a0e]/10 p-4 bg-white">
                <p className="text-[#8b6914] text-xs tracking-widest uppercase">{featuredProjects[0].category ?? 'مشروع'}</p>
                <h3 className="text-2xl font-black text-[#2c1a0e] mt-1">{featuredProjects[0].title_ar}</h3>
                {featuredProjects[0].year && <p className="text-[#2c1a0e]/40 text-sm mt-1">{featuredProjects[0].year}</p>}
              </div>
            </Link>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.slice(1, 4).map(p => (
              <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden border border-[#2c1a0e]/10">
                  {p.cover_image_url
                    ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover group-hover:scale-103 transition-transform duration-700" />
                    : <div className="w-full h-full bg-[#2c1a0e]/5 flex items-center justify-center">
                        <span className="text-[#8b6914]/30 text-2xl font-black">{p.title_ar.charAt(0)}</span>
                      </div>
                  }
                </div>
                <div className="pt-3">
                  {p.category && <p className="text-[#8b6914] text-xs tracking-widest uppercase">{p.category}</p>}
                  <h3 className="font-bold text-[#2c1a0e] mt-0.5">{p.title_ar}</h3>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10 border-t border-[#2c1a0e]/10 pt-8">
            <Link href={`/${tenant.slug}/projects`} className="inline-block border-2 border-[#2c1a0e] text-[#2c1a0e] px-10 py-2.5 text-sm tracking-widest uppercase hover:bg-[#2c1a0e] hover:text-[#f5f0e8] transition-colors">
              {projects.length > 6 ? `جميع المشاريع (${projects.length})` : 'جميع المشاريع'}
            </Link>
          </div>
        </section>
      ) : (
        <section className="max-w-5xl mx-auto px-8 py-16 text-center">
          <p className="text-[#8b6914] text-xs tracking-[0.3em] uppercase mb-2">المشاريع</p>
          <h2 className="text-3xl font-black text-[#2c1a0e]/20 mb-3">قريباً</h2>
          <p className="text-[#2c1a0e]/40 text-sm">سيتم إضافة مشاريعنا قريباً</p>
        </section>
      )}

      {/* WHY US */}
      <section className="bg-[#2c1a0e] py-16 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#8b6914] text-xs tracking-[0.3em] uppercase mb-1">لماذا نحن</p>
            <h2 className="text-3xl font-black text-[#f5f0e8]">ما يميزنا</h2>
            <div className="flex items-center justify-center gap-3 my-6">
              <div className="h-px flex-1 max-w-16 bg-[#8b6914]/40" />
              <div className="w-2 h-2 rotate-45 bg-[#8b6914]" />
              <div className="h-px flex-1 max-w-16 bg-[#8b6914]/40" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(customFeatures && customFeatures.length > 0
              ? customFeatures.map(f => ({ Icon: resolveIcon(f.icon), title: f.title, desc: f.description ?? '' }))
              : WHY_US
            ).map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-4 border border-[#8b6914]/20 hover:border-[#8b6914]/50 transition-colors">
                <Icon className="w-5 h-5 text-[#8b6914] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-[#f5f0e8] font-bold text-sm mb-1">{title}</h3>
                  <p className="text-[#f5f0e8]/50 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f5f0e8] border-t-4 border-double border-[#2c1a0e] py-16 px-8 text-center">
        <p className="text-[#8b6914] text-xs tracking-[0.3em] uppercase mb-3">ابدأ مشروعك</p>
        <h3 className="text-4xl font-black text-[#2c1a0e] mb-6">هل لديك مشروع؟</h3>
        <p className="text-[#2c1a0e]/50 mb-8 max-w-md mx-auto">دعنا نحوّل فكرتك إلى واقع بلمسة من الأناقة والإتقان</p>
        <div className="flex gap-4 justify-center flex-wrap">
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-8 py-3 font-bold tracking-widest uppercase hover:bg-[#20BA5A] transition-colors flex items-center gap-2 text-sm">
              <WhatsAppIcon />
              واتساب
            </a>
          )}
          <Link href={`/${tenant.slug}/contact`} className="bg-[#2c1a0e] text-[#f5f0e8] px-10 py-3 text-sm tracking-widest uppercase hover:bg-[#2c1a0e]/80 transition-colors">
            تواصل معنا
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2c1a0e] py-12 px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
          <div>
            {tenant.logo_url && (
              <div className="w-12 h-12 mb-3 relative">
                <Image src={tenant.logo_url} alt="" fill className="object-contain rounded-full" />
              </div>
            )}
            <h4 className="text-[#f5f0e8] font-bold mb-2">{tenant.name_ar}</h4>
            <p className="text-[#f5f0e8]/40 text-xs leading-relaxed line-clamp-3">{bio}</p>
          </div>
          <div>
            <h4 className="text-[#8b6914] text-xs tracking-widest uppercase mb-4">روابط سريعة</h4>
            <div className="space-y-2">
              {[['/', 'الرئيسية'], ['/projects', 'المشاريع'], ['/contact', 'تواصل معنا']].map(([href, label]) => (
                <Link key={href} href={`/${tenant.slug}${href}`} className="block text-[#f5f0e8]/40 hover:text-[#8b6914] transition-colors text-sm">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[#8b6914] text-xs tracking-widest uppercase mb-4">تواصل معنا</h4>
            <div className="space-y-2">
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="flex items-center gap-2 text-[#f5f0e8]/40 hover:text-[#8b6914] transition-colors text-sm" dir="ltr">
                  <Phone className="w-3.5 h-3.5" />{tenant.phone}
                </a>
              )}
              {tenant.email && (
                <a href={`mailto:${tenant.email}`} className="flex items-center gap-2 text-[#f5f0e8]/40 hover:text-[#8b6914] transition-colors text-sm">
                  <Mail className="w-3.5 h-3.5" />{tenant.email}
                </a>
              )}
            </div>
            {socials.length > 0 && (
              <div className="flex gap-3 mt-4">
                {socials.map(s => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-[#f5f0e8]/30 hover:text-[#8b6914] transition-colors">
{s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-[#8b6914]/20 pt-6 text-center">
          <p className="text-[#f5f0e8]/30 text-xs tracking-widest">
            {tenant.name_ar} &mdash; جميع الحقوق محفوظة {new Date().getFullYear()}
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
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#2c1a0e] text-[#f5f0e8] border border-[#8b6914]/30 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  )
}
