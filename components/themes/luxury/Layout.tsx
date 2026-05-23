import { ThemeProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export default function LuxuryLayout({ tenant, featuredProjects }: ThemeProps) {
  return (
    <div className="min-h-screen bg-[#080808]" dir="rtl">

      {/* GOLD TOP LINE */}
      <div className="h-px bg-gradient-to-l from-transparent via-[#c9a84c] to-transparent" />

      {/* NAV */}
      <nav className="px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          {tenant.logo_url && (
            <Image src={tenant.logo_url} alt="" width={36} height={36} className="rounded-full border border-[#c9a84c]/40 object-cover" />
          )}
          <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">{tenant.name_ar}</span>
        </div>
        <nav className="hidden md:flex gap-8 text-[11px] text-white/30 tracking-[0.25em] uppercase">
          {[['/', 'الرئيسية'], ['/projects', 'المشاريع'], ['/contact', 'تواصل']].map(([href, label]) => (
            <Link key={href} href={href} className="hover:text-[#c9a84c] transition-colors relative group">
              {label}
              <span className="absolute -bottom-1 right-0 w-0 h-px bg-[#c9a84c] group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>
      </nav>

      {/* HERO — full cinematic */}
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
          {/* gold ornament */}
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-12 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[10px] tracking-[0.4em] uppercase">مكتب هندسي</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-light text-white leading-tight mb-6">{tenant.name_ar}</h1>

          {tenant.bio_ar && (
            <p className="text-white/40 font-light text-base max-w-md leading-loose">{tenant.bio_ar}</p>
          )}

          <div className="mt-12 flex gap-4">
            <Link href="/projects"
              className="border border-[#c9a84c] text-[#c9a84c] px-10 py-3 text-xs tracking-[0.25em] uppercase hover:bg-[#c9a84c] hover:text-black transition-all duration-300">
              استعرض الأعمال
            </Link>
            <Link href="/contact"
              className="border border-white/15 text-white/50 px-10 py-3 text-xs tracking-[0.25em] uppercase hover:border-white/40 hover:text-white transition-all">
              تواصل معنا
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PROJECTS */}
      {featuredProjects.length > 0 && (
        <section className="py-24 px-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-6 mb-16">
            <div className="h-px flex-1 bg-gradient-to-l from-[#c9a84c]/20 to-transparent" />
            <div className="text-center">
              <p className="text-[#c9a84c] text-[10px] tracking-[0.4em] uppercase mb-1">معرض الأعمال</p>
              <h2 className="text-3xl font-light text-white">مشاريعنا المختارة</h2>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-[#c9a84c]/20 to-transparent" />
          </div>

          {/* staggered grid */}
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
                <Link key={p.id} href={`/projects/${p.id}`}
                  className={`group relative overflow-hidden bg-[#1a1a1a] ${config[i] ?? 'col-span-6 aspect-square'}`}>
                  {p.cover_image_url && (
                    <Image src={p.cover_image_url} alt={p.title_ar} fill
                      className="object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-1000" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 inset-x-0 p-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase mb-1">{p.category}</p>
                    <h3 className="text-white font-light text-lg">{p.title_ar}</h3>
                    {p.year && <p className="text-white/40 text-xs mt-1">{p.year}</p>}
                  </div>
                </Link>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/projects" className="inline-block border border-[#c9a84c]/30 text-[#c9a84c]/60 hover:text-[#c9a84c] hover:border-[#c9a84c] px-12 py-3 text-[11px] tracking-[0.3em] uppercase transition-all">
              جميع المشاريع
            </Link>
          </div>
        </section>
      )}

      {/* GOLD FOOTER */}
      <div className="h-px bg-gradient-to-l from-transparent via-[#c9a84c]/30 to-transparent" />
      <footer className="px-8 py-8 flex items-center justify-between max-w-7xl mx-auto">
        <span className="text-[#c9a84c]/30 text-[10px] tracking-[0.3em] uppercase">{tenant.name_ar}</span>
        <span className="text-white/10 text-xs">{new Date().getFullYear()}</span>
        {tenant.phone && <a href={`tel:${tenant.phone}`} className="text-white/20 text-[10px] hover:text-[#c9a84c] transition-colors" dir="ltr">{tenant.phone}</a>}
      </footer>
    </div>
  )
}
