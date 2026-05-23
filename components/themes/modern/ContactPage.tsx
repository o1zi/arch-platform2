'use client'

import { Tenant } from '@/types'
import Link from 'next/link'
import { useState } from 'react'
import { Phone, Mail, MapPin, Send, ArrowUp } from 'lucide-react'

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function ModernContactPage({ tenant }: { tenant: Tenant }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const socials = [
    { label: 'إنستقرام', url: tenant.instagram_url },
    { label: 'تويتر', url: tenant.twitter_url },
    { label: 'لينكدإن', url: tenant.linkedin_url },
    { label: 'سناب شات', url: tenant.snapchat_url },
  ].filter(s => s.url)

  const waPhone = tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.message) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderName: form.name,
          senderPhone: form.phone,
          senderEmail: form.email,
          message: form.message,
          recipientEmail: tenant.email,
          officeName: tenant.name_ar,
        }),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f]" dir="rtl">
      <nav className="border-b border-white/5 px-6 h-16 flex items-center justify-between max-w-7xl mx-auto sticky top-0 bg-[#0f0f0f]/95 backdrop-blur z-50">
        <Link href={`/${tenant.slug}`} className="text-white font-bold">{tenant.name_ar}</Link>
        <div className="flex gap-6 text-sm text-white/40">
          <Link href={`/${tenant.slug}`} className="hover:text-white transition-colors">الرئيسية</Link>
          <Link href={`/${tenant.slug}/projects`} className="hover:text-white transition-colors">المشاريع</Link>
          <span className="text-white">تواصل</span>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6">
        {/* heading */}
        <div className="py-24 border-b border-white/5">
          <p className="text-white/20 text-sm tracking-widest uppercase mb-4">تواصل معنا</p>
          <h1 className="text-7xl md:text-9xl font-black text-white leading-none">نحن<br />هنا</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-0 border-b border-white/5">
          {/* CONTACT INFO */}
          <div className="py-12 border-l border-white/5 pr-0 pl-12">
            <div className="divide-y divide-white/5">
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`} className="group flex items-center justify-between py-6 hover:px-4 transition-all duration-300">
                  <span className="text-white/30 text-sm flex items-center gap-2"><Phone className="w-4 h-4" />الجوال</span>
                  <span className="text-white text-xl font-bold group-hover:text-white/70 transition-colors" dir="ltr">{tenant.phone}</span>
                </a>
              )}
              {tenant.email && (
                <a href={`mailto:${tenant.email}`} className="group flex items-center justify-between py-6 hover:px-4 transition-all duration-300">
                  <span className="text-white/30 text-sm flex items-center gap-2"><Mail className="w-4 h-4" />البريد</span>
                  <span className="text-white text-lg font-bold group-hover:text-white/70 transition-colors" dir="ltr">{tenant.email}</span>
                </a>
              )}
              {tenant.address_ar && (
                <div className="flex items-center justify-between py-6">
                  <span className="text-white/30 text-sm flex items-center gap-2"><MapPin className="w-4 h-4" />العنوان</span>
                  <span className="text-white text-base font-medium">{tenant.address_ar}</span>
                </div>
              )}
              {tenant.google_maps_url && (
                <a href={tenant.google_maps_url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-6 hover:px-4 transition-all duration-300">
                  <span className="text-white/30 text-sm">الموقع</span>
                  <span className="text-white/60 group-hover:text-white transition-colors text-sm">فتح الخريطة ←</span>
                </a>
              )}
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-6 hover:px-4 transition-all duration-300">
                  <span className="text-white/30 text-sm flex items-center gap-2"><WhatsAppIcon />واتساب</span>
                  <span className="text-[#25D366] group-hover:text-[#20BA5A] transition-colors text-sm">تواصل الآن ←</span>
                </a>
              )}
            </div>

            {socials.length > 0 && (
              <div className="pt-8 flex gap-6 flex-wrap">
                {socials.map(s => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                    className="text-white/30 hover:text-white transition-colors flex items-center gap-1.5 text-sm border-b border-white/10 hover:border-white pb-1">
                    {s.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* CONTACT FORM */}
          <div className="py-12 pl-0 pr-12">
            <p className="text-white/20 text-xs tracking-widest uppercase mb-8">أرسل لنا رسالة</p>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="w-16 h-16 border-2 border-white/20 flex items-center justify-center mb-6">
                  <ArrowUp className="w-6 h-6 text-white rotate-45" />
                </div>
                <h3 className="text-white text-2xl font-bold mb-2">تم الإرسال</h3>
                <p className="text-white/40 text-sm">سنتواصل معك في أقرب وقت ممكن</p>
                <button onClick={() => { setStatus('idle'); setForm({ name: '', phone: '', email: '', message: '' }) }}
                  className="mt-6 text-white/30 text-xs hover:text-white transition-colors border-b border-white/10 hover:border-white pb-0.5">
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-white/30 text-xs tracking-widest uppercase block mb-2">الاسم *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="اسمك الكريم"
                    required
                    className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-white/30 text-xs tracking-widest uppercase block mb-2">رقم الجوال</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="05xxxxxxxx"
                    dir="ltr"
                    className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-white/30 text-xs tracking-widest uppercase block mb-2">البريد الإلكتروني</label>
                  <input
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    type="email"
                    placeholder="your@email.com"
                    dir="ltr"
                    className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-white/30 text-xs tracking-widest uppercase block mb-2">رسالتك *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="أخبرنا عن مشروعك..."
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm resize-none"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-400 text-xs">حدث خطأ، حاول مرة أخرى أو تواصل معنا مباشرة.</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-white text-black py-4 font-bold hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {status === 'sending' ? (
                    <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      إرسال الرسالة
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING WHATSAPP */}
      {waUrl && (
        <a href={waUrl} target="_blank" rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#20BA5A] rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110">
          <WhatsAppIcon />
        </a>
      )}
    </div>
  )
}
