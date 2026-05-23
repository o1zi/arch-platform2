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
  { Icon: Award, title: 'خبرة راسخة', desc: 'سنوات من الإبداع والتميز في عالم الهندسة' },
  { Icon: Users, title: 'فريق النخبة', desc: 'مهندسون ومصممون من أرفع المستويات' },
  { Icon: Clock, title: 'دقة التوقيت', desc: 'نلتزم بجداولنا الزمنية بلا تساهل' },
  { Icon: Shield, title: 'جودة لا تُنافَس', desc: 'معايير صارمة في كل تفصيل من تفاصيل التنفيذ' },
  { Icon: Star, title: 'الإبداع أولاً', desc: 'تصاميم استثنائية تتخطى المألوف' },
  { Icon: CheckCircle2, title: 'رعاية مستمرة', desc: 'متابعة شخصية قبل وأثناء وبعد التسليم' },
]

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function GoldLine() {
  return <div className="h-px bg-gradient-to-l from-transparent via-[#c9a84c]/40 to-transparent my-8" />
}

export default function LuxuryLayout({ tenant, projects, featuredProjects }: ThemeProps) {
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
    { url: tenant.instagram_url, label: 'Instagram' },
    { url: tenant.twitter_url, label: 'Twitter' },
    { url: tenant.linkedin_url, label: 'LinkedIn' },
  ].filter(s => s.url)

  return (
    <div className="min-h-screen bg-[#080808]" dir="rtl">

      {/* GOLD TOP LINE */}
      <div className="h-px bg-gradient-to-l from-transparent via-[#c9a84c] to-transparent" />

      {/* TOP BAR */}
      <div className="border-b border-[#c9a84c]/10 px-8 py-2 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6 text-[10px] tracking-[0.25em] text-white/20 uppercase">
          {tenant.phone && (
            <a href={`tel:${tenant.phone}`} className="hover:text-[#c9a84c] transition-colors" dir="ltr">{tenant.phone}</a>
          )}
          {tenant.email && (
            <a href={`mailto:${tenant.email}`} className="hover:text-[#c9a84c] transition-colors hidden md:block">{tenant.email}</a>
          )}
        </div>
        <div className="flex items-center gap-3">
          {socials.map(s => (
            <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[#c9a84c] transition-colors">
{s.label}
            </a>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav className={`sticky top-0 z-50 px-8 py-5 flex items-center justify-between max-w-7xl mx-auto transition-all duration-500 ${scrolled ? 'bg-[#080808]/95 backdrop-blur' : ''}`}>
        <div className="flex items-center gap-3">
          {tenant.logo_url && (
            <Image src={tenant.logo_url} alt="" width={36} height={36} className="rounded-full border border-[#c9a84c]/40 object-cover" />
          )}
          <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">{tenant.name_ar}</span>
        </div>
        <nav className="hidden md:flex gap-8 text-[11px] text-white/30 tracking-[0.25em] uppercase">
          {[['/', 'الرئيسية'], ['/projects', 'المشاريع'], ['/contact', 'تواصل']].map(([href, label]) => (
            <Link key={href} href={`/${tenant.slug}${href}`} className="hover:text-[#c9a84c] transition-colors relative group">
              {label}
              <span className="absolute -bottom-1 right-0 w-0 h-px bg-[#c9a84c] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[95vh] flex flex-col justify-end">
        {tenant.cover_url ? (
          <>
            <Image src={tenant.cover_url} alt="" fill className="object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/40 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#080808]" />
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-8 pb-20 w-full">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[10px] tracking-[0.4em] uppercase">مكتب هندسي</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-light text-white leading-tight mb-6">{tenant.name_ar}</h1>
          {tenant.name_en && <p className="text-[#c9a84c]/50 text-sm tracking-[0.2em] uppercase mb-4" dir="ltr">{tenant.name_en}</p>}

          <p className="text-white/40 font-light text-base max-w-md leading-loose">{bio}</p>

          <div className="mt-12 flex gap-4">
            <Link href={`/${tenant.slug}/projects`}
              className="border border-[#c9a84c] text-[#c9a84c] px-10 py-3 text-xs tracking-[0.25em] uppercase hover:bg-[#c9a84c] hover:text-black transition-all duration-300">
              استعرض الأعمال
            </Link>
            <Link href={`/${tenant.slug}/contact`}
              className="border border-white/15 text-white/50 px-10 py-3 text-xs tracking-[0.25em] uppercase hover:border-white/40 hover:text-white transition-all">
              تواصل معنا
            </Link>
          </div>

          {projects.length > 0 && (
            <div className="mt-16 pt-8 border-t border-[#c9a84c]/10">
              <span className="text-5xl font-light text-[#c9a84c]">{projects.length}</span>
              <span className="text-white/20 text-[10px] tracking-[0.4em] uppercase mr-3">مشروع منجز</span>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <GoldLine />
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-[10px] tracking-[0.4em] uppercase">من نحن</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-8 leading-tight">
              نصنع الجمال<br />بلمسة الاتقان
            </h2>
            <p className="text-white/40 font-light leading-loose">{bio}</p>
            {tenant.address_ar && (
              <p className="mt-6 text-white/20 text-[11px] tracking-widest uppercase flex items-center gap-2">
                <MapPin className="w-3 h-3 text-[#c9a84c]" />{tenant.address_ar}
              </p>
            )}
            <Link href={`/${tenant.slug}/contact`}
              className="inline-block mt-8 border border-[#c9a84c]/50 text-[#c9a84c]/70 px-8 py-2.5 text-[11px] tracking-[0.25em] uppercase hover:bg-[#c9a84c] hover:text-black transition-all duration-500">
              تواصل معنا
            </Link>
          </div>
          {tenant.cover_url ? (
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover opacity-70 hover:opacity-90 transition-opacity duration-700" />
              <div className="absolute inset-0 border border-[#c9a84c]/20 m-4" />
            </div>
          ) : (
            <div className="aspect-[4/3] bg-gradient-to-br from-[#1a1a1a] to-[#080808] flex items-center justify-center border border-[#c9a84c]/10">
              <span className="text-[#c9a84c]/20 text-[8rem] font-light">{tenant.name_ar.charAt(0)}</span>
            </div>
          )}
        </div>
        <GoldLine />
      </section>

      {/* SERVICES */}
      <section className="bg-[#0a0a0a] py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-6 mb-6 justify-center">
              <div className="h-px w-12 bg-gradient-to-l from-[#c9a84c]/30 to-transparent" />
              <span className="text-[#c9a84c] text-[10px] tracking-[0.4em] uppercase">خدماتنا</span>
              <div className="h-px w-12 bg-gradient-to-r from-[#c9a84c]/30 to-transparent" />
            </div>
            <h2 className="text-3xl font-light text-white">ما نقدمه لك</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#c9a84c]/5">
            {SERVICES.map(({ Icon, title, desc }) => (
              <div key={title} className="bg-[#0a0a0a] p-8 group hover:bg-[#111] transition-colors text-center">
                <div className="w-12 h-12 border border-[#c9a84c]/20 flex items-center justify-center mx-auto mb-5 group-hover:border-[#c9a84c]/50 transition-colors">
                  <Icon className="w-5 h-5 text-[#c9a84c]/40 group-hover:text-[#c9a84c] transition-colors" />
                </div>
                <h3 className="text-white/70 group-hover:text-white text-sm mb-2 transition-colors">{title}</h3>
                <p className="text-white/20 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 ? (
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-16">
            <div className="h-px flex-1 bg-gradient-to-l from-[#c9a84c]/20 to-transparent" />
            <div className="text-center">
              <p className="text-[#c9a84c] text-[10px] tracking-[0.4em] uppercase mb-1">معرض الأعمال</p>
              <h2 className="text-3xl font-light text-white">مشاريعنا المختارة</h2>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-[#c9a84c]/20 to-transparent" />
          </div>

          <div className="grid grid-cols-12 gap-3">
            {featuredProjects.slice(0, 6).map((p, i) => {
              const config = [
                'col-span-12 md:col-span-8 aspect-video',
                'col-span-12 md:col-span-4 aspect-[3/4]',
                'col-span-12 md:col-span-4 aspect-square',
                'col-span-12 md:col-span-8 aspect-[16/7]',
                'col-span-12 md:col-span-6 aspect-[4/3]',
                'col-span-12 md:col-span-6 aspect-[4/3]',
              ]
              return (
                <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}
                  className={`group relative overflow-hidden bg-[#1a1a1a] ${config[i] ?? 'col-span-6 aspect-square'}`}>
                  {p.cover_image_url ? (
                    <Image src={p.cover_image_url} alt={p.title_ar} fill
                      className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-[#c9a84c]/20 text-4xl font-light">{p.title_ar.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 inset-x-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase mb-1">{p.category}</p>
                    <h3 className="text-white font-light text-lg">{p.title_ar}</h3>
                    {p.year && <p className="text-white/40 text-xs mt-1">{p.year}</p>}
                  </div>
                  {p.is_featured && (
                    <div className="absolute top-3 right-3 border border-[#c9a84c]/50 text-[#c9a84c] text-[9px] tracking-[0.25em] uppercase px-2 py-0.5">مميز</div>
                  )}
                </Link>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link href={`/${tenant.slug}/projects`} className="inline-block border border-[#c9a84c]/30 text-[#c9a84c]/60 hover:text-[#c9a84c] hover:border-[#c9a84c] px-12 py-3 text-[11px] tracking-[0.3em] uppercase transition-all">
              {projects.length > 6 ? `جميع المشاريع — ${projects.length}` : 'جميع المشاريع'}
            </Link>
          </div>
        </section>
      ) : (
        <section className="py-24 px-8 max-w-7xl mx-auto text-center">
          <p className="text-[#c9a84c]/30 text-[10px] tracking-[0.4em] uppercase mb-4">المشاريع</p>
          <h2 className="text-4xl font-light text-white/10 mb-3">قريباً</h2>
          <p className="text-white/20 text-sm">سيتم إضافة مشاريعنا قريباً</p>
        </section>
      )}

      {/* WHY US */}
      <section className="bg-[#0a0a0a] py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center gap-6 mb-6 justify-center">
              <div className="h-px w-12 bg-gradient-to-l from-[#c9a84c]/30 to-transparent" />
              <span className="text-[#c9a84c] text-[10px] tracking-[0.4em] uppercase">لماذا نحن</span>
              <div className="h-px w-12 bg-gradient-to-r from-[#c9a84c]/30 to-transparent" />
            </div>
            <h2 className="text-3xl font-light text-white">ما يميزنا</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {WHY_US.map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 border border-[#c9a84c]/10 hover:border-[#c9a84c]/30 transition-colors">
                <div className="w-8 h-8 border border-[#c9a84c]/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-3.5 h-3.5 text-[#c9a84c]/60" />
                </div>
                <div>
                  <h3 className="text-white/70 text-sm mb-1">{title}</h3>
                  <p className="text-white/25 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="border border-[#c9a84c]/20 p-12 text-center">
            <div className="flex items-center gap-4 mb-6 justify-center">
              <div className="h-px w-8 bg-[#c9a84c]/40" />
              <span className="text-[#c9a84c] text-[10px] tracking-[0.4em] uppercase">ابدأ مشروعك</span>
              <div className="h-px w-8 bg-[#c9a84c]/40" />
            </div>
            <h3 className="text-4xl font-light text-white mb-4">هل لديك مشروع؟</h3>
            <p className="text-white/30 mb-10 max-w-md mx-auto text-sm leading-loose">دعنا نجعل مشروعك تحفة فنية تجمع بين الجمال والوظيفة</p>
            <div className="flex gap-4 justify-center flex-wrap">
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer"
                  className="bg-[#25D366] text-white px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-[#20BA5A] transition-colors flex items-center gap-2">
                  <WhatsAppIcon />
                  واتساب
                </a>
              )}
              <Link href={`/${tenant.slug}/contact`}
                className="bg-[#c9a84c] text-black px-12 py-3 text-xs tracking-[0.25em] uppercase hover:bg-[#b8973b] transition-all duration-300">
                تواصل معنا
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <div className="h-px bg-gradient-to-l from-transparent via-[#c9a84c]/30 to-transparent" />
      <footer className="bg-[#080808] py-16 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              {tenant.logo_url && (
                <Image src={tenant.logo_url} alt="" width={32} height={32} className="rounded-full border border-[#c9a84c]/30 object-cover" />
              )}
              <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">{tenant.name_ar}</span>
            </div>
            <p className="text-white/20 text-xs leading-relaxed line-clamp-3">{bio}</p>
          </div>
          <div>
            <h4 className="text-[#c9a84c]/50 text-[10px] tracking-[0.3em] uppercase mb-5">روابط سريعة</h4>
            <div className="space-y-3">
              {[['/', 'الرئيسية'], ['/projects', 'المشاريع'], ['/contact', 'تواصل معنا']].map(([href, label]) => (
                <Link key={href} href={`/${tenant.slug}${href}`} className="block text-white/20 hover:text-[#c9a84c] transition-colors text-[11px] tracking-widest uppercase">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[#c9a84c]/50 text-[10px] tracking-[0.3em] uppercase mb-5">تواصل معنا</h4>
            <div className="space-y-3">
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="flex items-center gap-2 text-white/20 hover:text-[#c9a84c] transition-colors text-[11px]" dir="ltr">
                  <Phone className="w-3 h-3" />{tenant.phone}
                </a>
              )}
              {tenant.email && (
                <a href={`mailto:${tenant.email}`} className="flex items-center gap-2 text-white/20 hover:text-[#c9a84c] transition-colors text-[11px]">
                  <Mail className="w-3 h-3" />{tenant.email}
                </a>
              )}
              {tenant.address_ar && (
                <p className="flex items-start gap-2 text-white/15 text-[11px]">
                  <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-[#c9a84c]/30" />{tenant.address_ar}
                </p>
              )}
            </div>
            {socials.length > 0 && (
              <div className="flex gap-4 mt-5">
                {socials.map(s => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-[#c9a84c] transition-colors">
{s.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="h-px bg-[#c9a84c]/10 mb-8" />
        <div className="flex items-center justify-between">
          <span className="text-[#c9a84c]/20 text-[10px] tracking-[0.3em] uppercase">{tenant.name_ar}</span>
          <span className="text-white/10 text-xs">{new Date().getFullYear()}</span>
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="text-white/15 hover:text-[#c9a84c] text-[10px] tracking-widest uppercase transition-colors flex items-center gap-1.5">
              <WhatsAppIcon />
              واتساب
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
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 border border-[#c9a84c]/30 bg-[#080808] text-[#c9a84c] flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-[#c9a84c] hover:text-black ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  )
}
