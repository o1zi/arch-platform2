import { Tenant } from '@/types'
import Link from 'next/link'

export default function MinimalContactPage({ tenant }: { tenant: Tenant }) {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <header className="px-10 py-6 flex items-center justify-between border-b border-gray-100">
        <Link href="/" className="text-[11px] text-gray-400 tracking-[0.25em] uppercase hover:text-gray-700 transition-colors">{tenant.name_ar}</Link>
        <nav className="flex gap-8 text-[11px] text-gray-300 tracking-[0.2em] uppercase">
          <Link href="/" className="hover:text-gray-700 transition-colors">رئيسية</Link>
          <Link href="/projects" className="hover:text-gray-700 transition-colors">مشاريع</Link>
          <span className="text-gray-500">تواصل</span>
        </nav>
      </header>

      <div className="px-10 py-24 max-w-xl">
        <p className="text-[11px] text-gray-300 tracking-[0.3em] uppercase mb-6">تواصل معنا</p>
        <h1 className="text-6xl font-extralight text-gray-900 leading-tight mb-20">نسعد<br />بخدمتك</h1>

        <div className="space-y-12">
          {tenant.phone && (
            <div>
              <p className="text-[10px] text-gray-300 tracking-widest uppercase mb-2">الجوال</p>
              <a href={`tel:${tenant.phone}`} className="text-2xl font-light text-gray-700 hover:text-gray-900 transition-colors" dir="ltr">{tenant.phone}</a>
            </div>
          )}
          {tenant.email && (
            <div>
              <p className="text-[10px] text-gray-300 tracking-widest uppercase mb-2">البريد الإلكتروني</p>
              <a href={`mailto:${tenant.email}`} className="text-xl font-light text-gray-700 hover:text-gray-900 transition-colors" dir="ltr">{tenant.email}</a>
            </div>
          )}
          {tenant.address_ar && (
            <div>
              <p className="text-[10px] text-gray-300 tracking-widest uppercase mb-2">العنوان</p>
              <p className="text-lg font-light text-gray-700">{tenant.address_ar}</p>
            </div>
          )}
          {tenant.google_maps_url && (
            <div>
              <a href={tenant.google_maps_url} target="_blank" rel="noopener noreferrer"
                className="text-[11px] text-gray-300 tracking-widest uppercase hover:text-gray-700 transition-colors border-b border-gray-200 pb-0.5">
                عرض على الخريطة
              </a>
            </div>
          )}
        </div>

        {(tenant.instagram_url || tenant.twitter_url || tenant.linkedin_url) && (
          <div className="mt-20 pt-12 border-t border-gray-100">
            <p className="text-[10px] text-gray-300 tracking-widest uppercase mb-4">منصات التواصل</p>
            <div className="flex gap-8">
              {tenant.instagram_url && <a href={tenant.instagram_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-gray-700 tracking-widest uppercase transition-colors">إنستقرام</a>}
              {tenant.twitter_url && <a href={tenant.twitter_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-gray-700 tracking-widest uppercase transition-colors">تويتر</a>}
              {tenant.linkedin_url && <a href={tenant.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-gray-400 hover:text-gray-700 tracking-widest uppercase transition-colors">لينكدإن</a>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
