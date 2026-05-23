import { ThemeProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export default function MinimalLayout({ tenant, featuredProjects }: ThemeProps) {
  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* NAV — purely typographic */}
      <header className="px-10 py-6 flex items-center justify-between">
        <span className="text-[11px] text-gray-400 tracking-[0.25em] uppercase">{tenant.name_ar}</span>
        <nav className="flex gap-8 text-[11px] text-gray-300 tracking-[0.2em] uppercase">
          <Link href="/projects" className="hover:text-gray-700 transition-colors">مشاريع</Link>
          <Link href="/contact" className="hover:text-gray-700 transition-colors">تواصل</Link>
        </nav>
      </header>

      {/* HERO — huge light text */}
      <section className="px-10 pt-12 pb-32">
        <h1 className="text-[10vw] font-extralight text-gray-900 leading-[0.95] tracking-tight mb-12">
          {tenant.name_ar}
        </h1>
        {tenant.bio_ar && (
          <p className="text-gray-400 font-light text-base leading-loose max-w-sm">{tenant.bio_ar}</p>
        )}
        {tenant.cover_url && (
          <div className="relative w-full aspect-[21/9] mt-16 overflow-hidden">
            <Image src={tenant.cover_url} alt="" fill className="object-cover" />
          </div>
        )}
      </section>

      {/* PROJECTS — horizontal numbered list */}
      {featuredProjects.length > 0 && (
        <section className="px-10 pb-32 border-t border-gray-100 pt-12">
          <p className="text-[11px] text-gray-300 tracking-[0.3em] uppercase mb-12">مشاريع مختارة</p>
          <div className="space-y-0">
            {featuredProjects.map((p, i) => (
              <Link key={p.id} href={`/projects/${p.id}`}
                className="group flex items-start gap-8 py-6 border-b border-gray-100 hover:border-gray-300 transition-colors">
                <span className="text-[11px] text-gray-200 font-light w-8 pt-1 flex-shrink-0 group-hover:text-gray-400 transition-colors">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 flex items-start justify-between gap-8">
                  <h3 className="text-xl font-light text-gray-700 group-hover:text-gray-900 transition-colors leading-tight">{p.title_ar}</h3>
                  <div className="flex gap-6 text-[11px] text-gray-300 tracking-widest flex-shrink-0 pt-1">
                    {p.year && <span>{p.year}</span>}
                    {p.category && <span>{p.category}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/projects" className="inline-block mt-10 text-[11px] text-gray-300 tracking-[0.2em] uppercase hover:text-gray-700 transition-colors border-b border-transparent hover:border-gray-300 pb-0.5">
            جميع المشاريع
          </Link>
        </section>
      )}

      {/* FOOTER */}
      <footer className="px-10 py-8 flex items-center justify-between">
        <span className="text-[11px] text-gray-200 tracking-widest uppercase">{new Date().getFullYear()}</span>
        {tenant.phone && (
          <a href={`tel:${tenant.phone}`} className="text-[11px] text-gray-300 hover:text-gray-700 transition-colors tracking-widest" dir="ltr">{tenant.phone}</a>
        )}
        <Link href="/contact" className="text-[11px] text-gray-300 hover:text-gray-700 transition-colors tracking-widest uppercase">تواصل معنا</Link>
      </footer>
    </div>
  )
}
