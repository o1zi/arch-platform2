'use client'

import { Tenant } from '@/types'
import Link from 'next/link'
import { useState } from 'react'
import { Phone, Mail, MapPin, Send, ArrowUp, Menu, X } from 'lucide-react'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'
import { ContactPageTracker } from '@/components/themes/shared/ContactPageTracker'

export default function ModernContactPage({ tenant }: { tenant: Tenant }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [menuOpen, setMenuOpen] = useState(false)

  const socials = [
    { label: 'إنستقرام', url: tenant.instagram_url },
    { label: 'تويتر', url: tenant.twitter_url },
    { label: 'لينكدإن', url: tenant.linkedin_url },
    { label: 'سناب شات', url: tenant.snapchat_url },
    { label: 'تيك توك', url: tenant.tiktok_url },
  ].filter(s => s.url)

  const waPhone = tenant.whatsapp?.replace(/\D/g, '') || tenant.phone?.replace(/\D/g, '')
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

  const navLinks = [
    { href: `/${tenant.slug}`, label: 'الرئيسية' },
    { href: `/${tenant.slug}/projects`, label: 'المشاريع' },
    { href: `/${tenant.slug}/contact`, label: 'تواصل', active: true },
  ]

  return (
    <div className="min-h-screen bg-[#0f0f0f]" dir="rtl">
      {/* NAV */}
      <nav className="border-b border-white/5 px-6 h-16 flex items-center justify-between max-w-7xl mx-auto sticky top-0 bg-[#0f0f0f]/95 backdrop-blur z-50">
        <Link href={`/${tenant.slug}`} className="text-white font-bold">{tenant.name_ar}</Link>
        {/* Desktop links */}
        <div className="hidden md:flex gap-6 text-sm text-white/40">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className={l.active ? 'text-white' : 'hover:text-white transition-colors'}>{l.label}</Link>
          ))}
        </div>
        {/* Mobile hamburger */}
        <button className="md:hidden text-white/60 hover:text-white" onClick={() => setMenuOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-72 bg-[#111] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <span className="text-white font-bold">{tenant.name_ar}</span>
              <button onClick={() => setMenuOpen(false)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
                  className={`px-4 py-3 text-sm rounded ${l.active ? 'bg-white text-black font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

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
                  <span className="text-white/30 text-sm">واتساب</span>
                  <span className="text-[#25D366] group-hover:text-[#20BA5A] transition-colors text-sm">تواصل الآن ←</span>
                </a>
              )}
            </div>

            {socials.length > 0 && (
              <div className="pt-8 flex gap-6 flex-wrap">
                {socials.map(s => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                    className="text-white/30 hover:text-white transition-colors text-sm border-b border-white/10 hover:border-white pb-1">
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
                {[
                  { label: 'الاسم *', key: 'name', placeholder: 'اسمك الكريم', required: true, ltr: false },
                  { label: 'رقم الجوال', key: 'phone', placeholder: '05xxxxxxxx', required: false, ltr: true },
                  { label: 'البريد الإلكتروني', key: 'email', placeholder: 'your@email.com', required: false, ltr: true },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-white/30 text-xs tracking-widest uppercase block mb-2">{f.label}</label>
                    <input
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      required={f.required}
                      dir={f.ltr ? 'ltr' : undefined}
                      className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm"
                    />
                  </div>
                ))}
                <div>
                  <label className="text-white/30 text-xs tracking-widest uppercase block mb-2">رسالتك *</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="أخبرنا عن مشروعك..."
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-white/10 focus:border-white/40 py-3 text-white placeholder-white/20 outline-none transition-colors text-sm resize-none"
                  />
                </div>
                {status === 'error' && <p className="text-red-400 text-xs">حدث خطأ، حاول مرة أخرى أو تواصل معنا مباشرة.</p>}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-white text-black py-4 font-bold hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {status === 'sending'
                    ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    : <><Send className="w-4 h-4" />إرسال الرسالة</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <ContactPageTracker tenantSlug={tenant.slug} />
      <SocialFloat
        whatsapp={waPhone}
        snapchat_url={tenant.snapchat_url}
        tiktok_url={tenant.tiktok_url}
        whatsapp_note={tenant.whatsapp_note}
        tenantSlug={tenant.slug}
      />
    </div>
  )
}
