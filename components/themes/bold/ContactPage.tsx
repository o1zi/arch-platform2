import { Tenant } from '@/types'
import Link from 'next/link'

export default function BoldContactPage({ tenant }: { tenant: Tenant }) {
  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      <nav className="border-b-4 border-red-600 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-black text-xl uppercase tracking-tighter">{tenant.name_ar}</Link>
        <div className="flex gap-0">
          <Link href="/" className="px-5 py-2 text-sm font-black uppercase text-white/40 hover:bg-red-600 hover:text-white transition-all">الرئيسية</Link>
          <Link href="/projects" className="px-5 py-2 text-sm font-black uppercase text-white/40 hover:bg-red-600 hover:text-white transition-all">المشاريع</Link>
          <span className="px-5 py-2 text-sm font-black uppercase bg-red-600">تواصل</span>
        </div>
      </nav>

      {/* giant title */}
      <div className="px-6 py-16 border-b border-white/10">
        <h1 className="text-[18vw] font-black leading-none tracking-tighter"
          style={{ WebkitTextStroke: '3px #ef4444', color: 'transparent' }}>
          هيا
        </h1>
        <p className="text-white/30 font-black text-2xl mt-2">تواصل معنا الآن</p>
      </div>

      {/* contact blocks */}
      <div className="border-b border-white/10">
        {tenant.phone && (
          <a href={`tel:${tenant.phone}`} className="group flex items-center justify-between px-6 py-8 border-b border-white/5 hover:bg-red-600 transition-colors">
            <span className="text-white/30 font-black text-sm uppercase tracking-widest group-hover:text-white">الجوال</span>
            <span className="text-4xl md:text-6xl font-black group-hover:text-white" dir="ltr">{tenant.phone}</span>
          </a>
        )}
        {tenant.email && (
          <a href={`mailto:${tenant.email}`} className="group flex items-center justify-between px-6 py-8 border-b border-white/5 hover:bg-white/5 transition-colors">
            <span className="text-white/30 font-black text-sm uppercase tracking-widest">البريد</span>
            <span className="text-2xl md:text-4xl font-black text-white/70 group-hover:text-white" dir="ltr">{tenant.email}</span>
          </a>
        )}
        {tenant.address_ar && (
          <div className="flex items-center justify-between px-6 py-8 border-b border-white/5">
            <span className="text-white/30 font-black text-sm uppercase tracking-widest">العنوان</span>
            <span className="text-xl font-black text-white/60">{tenant.address_ar}</span>
          </div>
        )}
        {tenant.google_maps_url && (
          <a href={tenant.google_maps_url} target="_blank" rel="noopener noreferrer"
            className="group flex items-center justify-between px-6 py-8 hover:bg-red-600 transition-colors">
            <span className="text-white/30 font-black text-sm uppercase tracking-widest group-hover:text-white">الموقع</span>
            <span className="font-black text-white/40 group-hover:text-white text-lg">افتح الخريطة ←</span>
          </a>
        )}
      </div>

      {(tenant.instagram_url || tenant.twitter_url || tenant.linkedin_url) && (
        <div className="px-6 py-8 flex gap-0">
          {tenant.instagram_url && <a href={tenant.instagram_url} target="_blank" rel="noopener noreferrer" className="px-5 py-3 text-xs font-black uppercase tracking-widest text-white/30 border border-white/10 hover:border-red-600 hover:text-white transition-all">إنستقرام</a>}
          {tenant.twitter_url && <a href={tenant.twitter_url} target="_blank" rel="noopener noreferrer" className="px-5 py-3 text-xs font-black uppercase tracking-widest text-white/30 border border-white/10 hover:border-red-600 hover:text-white transition-all border-r-0">تويتر</a>}
          {tenant.linkedin_url && <a href={tenant.linkedin_url} target="_blank" rel="noopener noreferrer" className="px-5 py-3 text-xs font-black uppercase tracking-widest text-white/30 border border-white/10 hover:border-red-600 hover:text-white transition-all border-r-0">لينكدإن</a>}
        </div>
      )}
    </div>
  )
}
