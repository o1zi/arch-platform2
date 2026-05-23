import { ThemeProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export default function ClassicLayout({ tenant, featuredProjects }: ThemeProps) {
  return (
    <div className="min-h-screen bg-[#f5f0e8]" dir="rtl">

      {/* TOP BAR */}
      <div className="border-b-2 border-[#2c1a0e] px-8 py-2 flex items-center justify-between text-[10px] tracking-[0.2em] text-[#2c1a0e]/50 uppercase">
        <span>{new Date().getFullYear()}</span>
        <span>مكتب هندسي</span>
        {tenant.phone && <span dir="ltr">{tenant.phone}</span>}
      </div>

      {/* MASTHEAD */}
      <header className="border-b-4 border-double border-[#2c1a0e] px-8 py-8 text-center">
        {tenant.logo_url && (
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <Image src={tenant.logo_url} alt="" fill className="object-contain rounded-full" />
          </div>
        )}
        <h1 className="text-5xl md:text-7xl font-black text-[#2c1a0e] tracking-tight leading-none">{tenant.name_ar}</h1>
        {tenant.name_en && <p className="text-[#8b6914] text-base mt-2 tracking-widest uppercase" dir="ltr">{tenant.name_en}</p>}
        {tenant.bio_ar && <p className="text-[#2c1a0e]/60 text-sm mt-4 max-w-xl mx-auto leading-relaxed">{tenant.bio_ar}</p>}

        {/* ornamental rule */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-px flex-1 max-w-24 bg-[#8b6914]" />
          <div className="w-2 h-2 rotate-45 bg-[#8b6914]" />
          <div className="h-px flex-1 max-w-24 bg-[#8b6914]" />
        </div>

        {/* NAV */}
        <nav className="flex justify-center gap-10 mt-5 text-sm text-[#2c1a0e]/70 tracking-widest uppercase">
          {[['./', 'الرئيسية'], ['./projects', 'المشاريع'], ['./contact', 'التواصل']].map(([href, label]) => (
            <Link key={href} href={href} className="hover:text-[#8b6914] border-b border-transparent hover:border-[#8b6914] pb-0.5 transition-colors">{label}</Link>
          ))}
        </nav>
      </header>

      {/* HERO FEATURE */}
      {tenant.cover_url && (
        <div className="relative h-64 md:h-96 overflow-hidden">
          <Image src={tenant.cover_url} alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#2c1a0e]/30" />
        </div>
      )}

      {/* PROJECTS — editorial grid */}
      {featuredProjects.length > 0 && (
        <section className="max-w-5xl mx-auto px-8 py-16">
          <div className="text-center mb-10">
            <p className="text-[#8b6914] text-xs tracking-[0.3em] uppercase mb-1">معرض الأعمال</p>
            <h2 className="text-3xl font-black text-[#2c1a0e]">مشاريع مختارة</h2>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-px w-20 bg-[#2c1a0e]/20" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#8b6914]" />
              <div className="h-px w-20 bg-[#2c1a0e]/20" />
            </div>
          </div>

          {/* first project — featured large */}
          {featuredProjects[0] && (
            <Link href={`/projects/${featuredProjects[0].id}`} className="group block mb-8">
              <div className="relative aspect-[21/9] overflow-hidden border-2 border-[#2c1a0e]/10">
                {featuredProjects[0].cover_image_url
                  ? <Image src={featuredProjects[0].cover_image_url} alt={featuredProjects[0].title_ar} fill className="object-cover group-hover:scale-103 transition-transform duration-700" />
                  : <div className="w-full h-full bg-[#2c1a0e]/5" />
                }
              </div>
              <div className="border-2 border-t-0 border-[#2c1a0e]/10 p-4 bg-white">
                <p className="text-[#8b6914] text-xs tracking-widest uppercase">{featuredProjects[0].category ?? 'مشروع'}</p>
                <h3 className="text-2xl font-black text-[#2c1a0e] mt-1">{featuredProjects[0].title_ar}</h3>
                {featuredProjects[0].year && <p className="text-[#2c1a0e]/40 text-sm mt-1">{featuredProjects[0].year}</p>}
              </div>
            </Link>
          )}

          {/* rest — 3 col */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.slice(1, 4).map(p => (
              <Link key={p.id} href={`/projects/${p.id}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden border border-[#2c1a0e]/10">
                  {p.cover_image_url
                    ? <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover group-hover:scale-103 transition-transform duration-700" />
                    : <div className="w-full h-full bg-[#2c1a0e]/5" />
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
            <Link href="./projects" className="inline-block border-2 border-[#2c1a0e] text-[#2c1a0e] px-10 py-2.5 text-sm tracking-widest uppercase hover:bg-[#2c1a0e] hover:text-[#f5f0e8] transition-colors">
              جميع المشاريع
            </Link>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="border-t-4 border-double border-[#2c1a0e] px-8 py-8 text-center">
        <p className="text-[#2c1a0e]/40 text-xs tracking-widest">
          {tenant.name_ar} &mdash; جميع الحقوق محفوظة {new Date().getFullYear()}
        </p>
        <div className="flex justify-center gap-4 mt-3 text-[#8b6914] text-xs">
          {tenant.phone && <span dir="ltr">{tenant.phone}</span>}
          {tenant.email && <span dir="ltr">{tenant.email}</span>}
        </div>
      </footer>
    </div>
  )
}
