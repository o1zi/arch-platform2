import { Tenant } from '@/types'
import Link from 'next/link'

export default function ClassicContactPage({ tenant }: { tenant: Tenant }) {
  return (
    <div className="min-h-screen bg-[#f5f0e8]" dir="rtl">
      <div className="border-b-2 border-[#2c1a0e] px-8 py-2 flex items-center justify-between text-[10px] tracking-[0.2em] text-[#2c1a0e]/50 uppercase">
        <span>التواصل</span>
        <Link href={`/${tenant.slug}`} className="hover:text-[#8b6914]">{tenant.name_ar}</Link>
      </div>

      <div className="max-w-2xl mx-auto px-8 py-16">
        {/* letterhead style */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-[#2c1a0e]">تواصل معنا</h1>
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="h-px w-20 bg-[#8b6914]" />
            <div className="w-2 h-2 rotate-45 bg-[#8b6914]" />
            <div className="h-px w-20 bg-[#8b6914]" />
          </div>
        </div>

        <div className="bg-white border border-[#2c1a0e]/10 p-10 space-y-8" style={{ boxShadow: '4px 4px 0 rgba(44,26,14,0.05)' }}>
          {tenant.phone && (
            <div className="flex flex-col items-center text-center pb-8 border-b border-[#2c1a0e]/10">
              <p className="text-[#8b6914] text-xs tracking-[0.2em] uppercase mb-2">الهاتف</p>
              <a href={`tel:${tenant.phone}`} className="text-3xl font-black text-[#2c1a0e] hover:text-[#8b6914] transition-colors" dir="ltr">{tenant.phone}</a>
            </div>
          )}
          {tenant.email && (
            <div className="flex flex-col items-center text-center pb-8 border-b border-[#2c1a0e]/10">
              <p className="text-[#8b6914] text-xs tracking-[0.2em] uppercase mb-2">البريد الإلكتروني</p>
              <a href={`mailto:${tenant.email}`} className="text-lg font-bold text-[#2c1a0e] hover:text-[#8b6914] transition-colors" dir="ltr">{tenant.email}</a>
            </div>
          )}
          {tenant.address_ar && (
            <div className="flex flex-col items-center text-center pb-8 border-b border-[#2c1a0e]/10">
              <p className="text-[#8b6914] text-xs tracking-[0.2em] uppercase mb-2">العنوان</p>
              <p className="text-[#2c1a0e] font-medium">{tenant.address_ar}</p>
            </div>
          )}
          {tenant.google_maps_url && (
            <div className="text-center">
              <a href={tenant.google_maps_url} target="_blank" rel="noopener noreferrer"
                className="inline-block border-2 border-[#2c1a0e] text-[#2c1a0e] px-8 py-2.5 text-sm tracking-widest uppercase hover:bg-[#2c1a0e] hover:text-[#f5f0e8] transition-colors">
                عرض على الخريطة
              </a>
            </div>
          )}
        </div>

        {/* social */}
        {(tenant.instagram_url || tenant.twitter_url || tenant.linkedin_url) && (
          <div className="text-center mt-10 pt-8 border-t border-[#2c1a0e]/10">
            <p className="text-[#8b6914] text-xs tracking-[0.2em] uppercase mb-4">تابعنا</p>
            <div className="flex justify-center gap-6">
              {tenant.instagram_url && <a href={tenant.instagram_url} target="_blank" rel="noopener noreferrer" className="text-[#2c1a0e]/50 hover:text-[#8b6914] text-sm tracking-widest transition-colors">إنستقرام</a>}
              {tenant.twitter_url && <a href={tenant.twitter_url} target="_blank" rel="noopener noreferrer" className="text-[#2c1a0e]/50 hover:text-[#8b6914] text-sm tracking-widest transition-colors">تويتر</a>}
              {tenant.linkedin_url && <a href={tenant.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-[#2c1a0e]/50 hover:text-[#8b6914] text-sm tracking-widest transition-colors">لينكدإن</a>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
