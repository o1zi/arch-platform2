import { ThemeProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export default function BoldLayout({ tenant, featuredProjects }: ThemeProps) {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" dir="rtl">

      {/* NAV — thin red bar */}
      <nav className="border-b-4 border-red-600 px-6 py-4 flex items-center justify-between">
        <span className="text-white font-black text-xl uppercase tracking-tighter">{tenant.name_ar}</span>
        <div className="flex gap-0">
          {[['/', 'الرئيسية'], ['/projects', 'المشاريع'], ['/contact', 'تواصل']].map(([href, label]) => (
            <Link key={href} href={`/${tenant.slug}${href}`} className="px-5 py-2 text-sm font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-red-600 transition-all">{label}</Link>
          ))}
        </div>
      </nav>

      {/* HERO — oversized text */}
      <section className="relative min-h-[92vh] flex flex-col justify-center px-6 overflow-hidden">
        {tenant.cover_url && (
          <Image src={tenant.cover_url} alt="" fill className="object-cover opacity-10" />
        )}
        {/* giant background text */}
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
          {tenant.bio_ar && (
            <p className="text-white/50 text-lg max-w-lg leading-relaxed">{tenant.bio_ar}</p>
          )}
          <div className="mt-10 flex gap-4">
            <Link href={`/${tenant.slug}/projects`} className="bg-red-600 hover:bg-red-700 text-white font-black text-lg px-10 py-4 uppercase tracking-widest transition-colors">
              المشاريع
            </Link>
            <Link href={`/${tenant.slug}/contact`} className="border-2 border-white/20 hover:border-white text-white font-black text-lg px-10 py-4 uppercase tracking-widest transition-colors">
              تواصل
            </Link>
          </div>
        </div>
      </section>

      {/* PROJECTS — full-width strips */}
      {featuredProjects.length > 0 && (
        <section className="border-t-4 border-red-600">
          <div className="px-6 py-8 flex items-center justify-between bg-red-600">
            <h2 className="text-3xl font-black uppercase tracking-tighter">أعمالنا</h2>
            <Link href={`/${tenant.slug}/projects`} className="text-white/70 hover:text-white font-black text-sm uppercase tracking-widest transition-colors">
              الكل ←
            </Link>
          </div>
          {featuredProjects.slice(0, 4).map((p, i) => (
            <Link key={p.id} href={`/projects/${p.id}`} className="group flex items-stretch border-b border-white/10 hover:border-red-600 transition-colors">
              {/* number */}
              <div className="w-16 md:w-24 flex-shrink-0 flex items-center justify-center border-l border-white/10 group-hover:border-red-600 transition-colors">
                <span className="text-white/20 font-black text-4xl group-hover:text-red-600 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              {/* image */}
              <div className="relative w-40 md:w-64 h-32 md:h-40 flex-shrink-0 overflow-hidden">
                {p.cover_image_url
                  ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                  : <div className="w-full h-full bg-white/5" />
                }
              </div>
              {/* info */}
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
        </section>
      )}

      {/* CTA */}
      <section className="px-6 py-20 text-center border-t-4 border-white/5">
        <h3 className="text-5xl md:text-7xl font-black mb-8">ابدأ مشروعك</h3>
        <Link href={`/${tenant.slug}/contact`} className="inline-block bg-red-600 hover:bg-red-700 text-white font-black text-xl px-16 py-5 uppercase tracking-widest transition-colors">
          تواصل الآن
        </Link>
      </section>
    </div>
  )
}
