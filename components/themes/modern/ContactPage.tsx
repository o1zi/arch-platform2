import { Tenant } from '@/types'
import Link from 'next/link'

export default function ModernContactPage({ tenant }: { tenant: Tenant }) {
  const socials = [
    { label: 'إنستقرام', url: tenant.instagram_url },
    { label: 'تويتر', url: tenant.twitter_url },
    { label: 'لينكدإن', url: tenant.linkedin_url },
    { label: 'سناب شات', url: tenant.snapchat_url },
  ].filter(s => s.url)

  return (
    <div className="min-h-screen bg-[#0f0f0f]" dir="rtl">
      <nav className="border-b border-white/5 px-6 h-16 flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white font-bold">{tenant.name_ar}</Link>
        <div className="flex gap-6 text-sm text-white/40">
          <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
          <Link href="/projects" className="hover:text-white transition-colors">المشاريع</Link>
          <span className="text-white">تواصل</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        {/* big heading */}
        <div className="py-24 border-b border-white/5">
          <p className="text-white/20 text-sm tracking-widest uppercase mb-4">تواصل معنا</p>
          <h1 className="text-7xl md:text-9xl font-black text-white leading-none">نحن<br />هنا</h1>
        </div>

        {/* contact items */}
        <div className="divide-y divide-white/5">
          {tenant.phone && (
            <a href={`tel:${tenant.phone}`} className="group flex items-center justify-between py-8 hover:px-4 transition-all duration-300">
              <span className="text-white/30 text-sm">الجوال</span>
              <span className="text-white text-2xl font-bold group-hover:text-white/70 transition-colors" dir="ltr">{tenant.phone}</span>
            </a>
          )}
          {tenant.email && (
            <a href={`mailto:${tenant.email}`} className="group flex items-center justify-between py-8 hover:px-4 transition-all duration-300">
              <span className="text-white/30 text-sm">البريد</span>
              <span className="text-white text-xl font-bold group-hover:text-white/70 transition-colors" dir="ltr">{tenant.email}</span>
            </a>
          )}
          {tenant.address_ar && (
            <div className="flex items-center justify-between py-8">
              <span className="text-white/30 text-sm">العنوان</span>
              <span className="text-white text-lg font-medium">{tenant.address_ar}</span>
            </div>
          )}
          {tenant.google_maps_url && (
            <a href={tenant.google_maps_url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-8 hover:px-4 transition-all duration-300">
              <span className="text-white/30 text-sm">الموقع</span>
              <span className="text-white/60 group-hover:text-white transition-colors text-sm">فتح الخريطة ←</span>
            </a>
          )}
        </div>

        {/* socials */}
        {socials.length > 0 && (
          <div className="py-12 flex gap-6 flex-wrap">
            {socials.map(s => (
              <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                className="text-white/30 hover:text-white transition-colors text-sm border-b border-white/10 hover:border-white pb-1">
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
