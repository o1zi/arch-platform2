import { Tenant } from '@/types'
import Link from 'next/link'

export default function LuxuryContactPage({ tenant }: { tenant: Tenant }) {
  return (
    <div className="min-h-screen bg-[#080808]" dir="rtl">
      <div className="h-px bg-gradient-to-l from-transparent via-[#c9a84c] to-transparent" />
      <nav className="px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">{tenant.name_ar}</Link>
        <div className="flex gap-8 text-[11px] text-white/30 tracking-[0.25em] uppercase">
          <Link href="/" className="hover:text-[#c9a84c] transition-colors">رئيسية</Link>
          <Link href="/projects" className="hover:text-[#c9a84c] transition-colors">مشاريع</Link>
          <span className="text-[#c9a84c]">تواصل</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-20">
        {/* ornament + title */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-[#c9a84c]" />
            <span className="text-[#c9a84c] text-[10px] tracking-[0.4em] uppercase">تواصل معنا</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-light text-white leading-tight">يسعدنا<br />سماعك</h1>
        </div>

        {/* contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
          {tenant.phone && (
            <a href={`tel:${tenant.phone}`}
              className="group bg-[#080808] p-8 hover:bg-[#0e0e0e] transition-colors">
              <p className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase mb-4">الجوال</p>
              <p className="text-white/60 group-hover:text-white text-2xl font-light transition-colors" dir="ltr">{tenant.phone}</p>
              <div className="w-0 group-hover:w-full h-px bg-[#c9a84c] mt-4 transition-all duration-500" />
            </a>
          )}
          {tenant.email && (
            <a href={`mailto:${tenant.email}`}
              className="group bg-[#080808] p-8 hover:bg-[#0e0e0e] transition-colors">
              <p className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase mb-4">البريد الإلكتروني</p>
              <p className="text-white/60 group-hover:text-white text-lg font-light transition-colors" dir="ltr">{tenant.email}</p>
              <div className="w-0 group-hover:w-full h-px bg-[#c9a84c] mt-4 transition-all duration-500" />
            </a>
          )}
          {tenant.address_ar && (
            <div className="bg-[#080808] p-8">
              <p className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase mb-4">العنوان</p>
              <p className="text-white/50 text-lg font-light">{tenant.address_ar}</p>
            </div>
          )}
          {tenant.google_maps_url && (
            <a href={tenant.google_maps_url} target="_blank" rel="noopener noreferrer"
              className="group bg-[#080808] p-8 hover:bg-[#0e0e0e] transition-colors flex flex-col justify-between">
              <p className="text-[#c9a84c] text-[10px] tracking-[0.3em] uppercase mb-4">الموقع</p>
              <div className="flex items-center justify-between">
                <span className="text-white/30 group-hover:text-white/60 font-light transition-colors">افتح على الخريطة</span>
                <span className="text-[#c9a84c]/40 group-hover:text-[#c9a84c] text-2xl transition-colors">←</span>
              </div>
            </a>
          )}
        </div>

        {/* social */}
        {(tenant.instagram_url || tenant.twitter_url || tenant.linkedin_url || tenant.snapchat_url) && (
          <div className="mt-16 pt-12 border-t border-white/5">
            <p className="text-[#c9a84c] text-[10px] tracking-[0.4em] uppercase mb-6">منصات التواصل</p>
            <div className="flex gap-8 flex-wrap">
              {[
                { label: 'إنستقرام', url: tenant.instagram_url },
                { label: 'تويتر', url: tenant.twitter_url },
                { label: 'لينكدإن', url: tenant.linkedin_url },
                { label: 'سناب شات', url: tenant.snapchat_url },
              ].filter(s => s.url).map(s => (
                <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                  className="text-white/25 hover:text-[#c9a84c] text-[11px] tracking-widest uppercase transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="h-px bg-gradient-to-l from-transparent via-[#c9a84c]/30 to-transparent" />
    </div>
  )
}
