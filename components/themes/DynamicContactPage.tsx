'use client'

import { Tenant, CustomThemeConfig } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

interface Props {
  tenant: Tenant
  config: CustomThemeConfig
}

function buildCSSVars(config: CustomThemeConfig): React.CSSProperties {
  return {
    '--c-primary':    config.colors.primary,
    '--c-secondary':  config.colors.secondary,
    '--c-accent':     config.colors.accent,
    '--c-bg':         config.colors.background,
    '--c-text':       config.colors.text,
    '--c-text-light': config.colors.textLight,
    '--font-heading': `'${config.fonts.heading}', serif`,
    '--font-body':    `'${config.fonts.body}', sans-serif`,
  } as React.CSSProperties
}

function borderRadiusClass(br: CustomThemeConfig['layout']['borderRadius']) {
  return { none: 'rounded-none', sm: 'rounded-sm', md: 'rounded-md', lg: 'rounded-lg', full: 'rounded-full' }[br]
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export default function DynamicContactPage({ tenant, config }: Props) {
  const br = borderRadiusClass(config.layout.borderRadius)
  const waPhone = tenant.whatsapp?.replace(/\D/g, '') || tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null

  const socials = [
    { url: tenant.instagram_url, label: 'إنستقرام' },
    { url: tenant.twitter_url, label: 'تويتر' },
    { url: tenant.linkedin_url, label: 'لينكدإن' },
    { url: tenant.snapchat_url, label: 'سناب شات' },
    { url: tenant.tiktok_url, label: 'تيك توك' },
  ].filter(s => s.url)

  return (
    <div dir="rtl" style={{ ...buildCSSVars(config), fontFamily: 'var(--font-body)', backgroundColor: 'var(--c-bg)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(config.fonts.heading)}:wght@400;700;900&family=${encodeURIComponent(config.fonts.body)}:wght@300;400;500;700&display=swap');
      `}</style>

      {/* Nav */}
      <nav style={{ backgroundColor: 'var(--c-primary)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo_url && (
              <Image src={tenant.logo_url} alt="" width={32} height={32} className={`object-cover ${br}`} />
            )}
            <span className="font-bold" style={{ color: 'var(--c-bg)' }}>{tenant.name_ar}</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href={`/${tenant.slug}`} style={{ color: 'var(--c-bg)' }} className="opacity-70 hover:opacity-100 transition-opacity">الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} style={{ color: 'var(--c-bg)' }} className="opacity-70 hover:opacity-100 transition-opacity">المشاريع</Link>
            <Link href={`/${tenant.slug}/contact`} className={`px-4 py-1.5 font-bold ${br}`}
              style={{ backgroundColor: 'var(--c-accent)', color: 'var(--c-bg)' }}>
              تواصل
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="py-16 px-6" style={{ backgroundColor: 'var(--c-primary)' }}>
        <div className="max-w-7xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: 'var(--c-accent)' }}>تواصل معنا</p>
          <h1 className="text-5xl font-black" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-bg)' }}>
            نسعد بتواصلك
          </h1>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">

        {/* معلومات التواصل */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-black mb-6" style={{ fontFamily: 'var(--font-heading)', color: 'var(--c-text)' }}>
              معلومات التواصل
            </h2>
            <div className="space-y-5">
              {tenant.phone && (
                <a href={`tel:${tenant.phone}`}
                  className={`flex items-center gap-4 p-4 transition-colors group ${br}`}
                  style={{ backgroundColor: 'var(--c-secondary)' }}>
                  <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${br}`}
                    style={{ backgroundColor: 'var(--c-accent)' }}>
                    <Phone className="w-5 h-5" style={{ color: 'var(--c-bg)' }} />
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--c-text-light)' }}>رقم الجوال</p>
                    <p className="font-bold" dir="ltr" style={{ color: 'var(--c-text)' }}>{tenant.phone}</p>
                  </div>
                </a>
              )}

              {tenant.email && (
                <a href={`mailto:${tenant.email}`}
                  className={`flex items-center gap-4 p-4 transition-colors group ${br}`}
                  style={{ backgroundColor: 'var(--c-secondary)' }}>
                  <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 ${br}`}
                    style={{ backgroundColor: 'var(--c-accent)' }}>
                    <Mail className="w-5 h-5" style={{ color: 'var(--c-bg)' }} />
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--c-text-light)' }}>البريد الإلكتروني</p>
                    <p className="font-bold" dir="ltr" style={{ color: 'var(--c-text)' }}>{tenant.email}</p>
                  </div>
                </a>
              )}

              {tenant.address_ar && (
                <div className={`flex items-start gap-4 p-4 ${br}`}
                  style={{ backgroundColor: 'var(--c-secondary)' }}>
                  <div className={`w-10 h-10 flex items-center justify-center flex-shrink-0 mt-0.5 ${br}`}
                    style={{ backgroundColor: 'var(--c-accent)' }}>
                    <MapPin className="w-5 h-5" style={{ color: 'var(--c-bg)' }} />
                  </div>
                  <div>
                    <p className="text-xs mb-0.5" style={{ color: 'var(--c-text-light)' }}>العنوان</p>
                    <p className="font-bold" style={{ color: 'var(--c-text)' }}>{tenant.address_ar}</p>
                    {tenant.address_en && (
                      <p className="text-sm mt-0.5" dir="ltr" style={{ color: 'var(--c-text-light)' }}>{tenant.address_en}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* واتساب */}
          {waUrl && (
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className={`flex items-center justify-center gap-3 py-4 font-bold w-full transition-opacity hover:opacity-90 ${br}`}
              style={{ backgroundColor: '#25D366', color: '#ffffff' }}>
              <WhatsAppIcon />
              تواصل عبر واتساب
            </a>
          )}

          {/* السوشيال ميديا */}
          {socials.length > 0 && (
            <div>
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: 'var(--c-text-light)' }}>
                تابعنا على
              </p>
              <div className="flex flex-wrap gap-3">
                {socials.map(s => (
                  <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer"
                    className={`px-4 py-2 text-sm font-medium transition-colors ${br}`}
                    style={{ backgroundColor: 'var(--c-secondary)', color: 'var(--c-text)' }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* خريطة + صورة */}
        <div className="space-y-6">
          {tenant.google_maps_url ? (
            <div className={`overflow-hidden aspect-video ${br}`}>
              <iframe
                src={tenant.google_maps_url}
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : tenant.cover_url ? (
            <div className={`relative aspect-video overflow-hidden ${br}`}>
              <Image src={tenant.cover_url} alt={tenant.name_ar} fill className="object-cover" />
            </div>
          ) : (
            <div className={`aspect-video flex items-center justify-center ${br}`}
              style={{ backgroundColor: 'var(--c-secondary)' }}>
              <span className="text-7xl font-black opacity-20" style={{ color: 'var(--c-text)' }}>
                {tenant.name_ar.charAt(0)}
              </span>
            </div>
          )}

          {/* معلومات إضافية */}
          {(tenant.bio_ar || tenant.name_en) && (
            <div className={`p-6 ${br}`} style={{ backgroundColor: 'var(--c-secondary)' }}>
              {tenant.name_en && (
                <p className="font-bold mb-2" dir="ltr" style={{ color: 'var(--c-text)' }}>{tenant.name_en}</p>
              )}
              {tenant.bio_ar && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--c-text-light)' }}>{tenant.bio_ar}</p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer strip */}
      <div className="py-8 px-6 border-t" style={{ backgroundColor: 'var(--c-primary)', borderColor: 'var(--c-secondary)' }}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs" style={{ color: 'var(--c-text-light)' }}>
            جميع الحقوق محفوظة {new Date().getFullYear()} © {tenant.name_ar}
          </p>
        </div>
      </div>

      <SocialFloat
        whatsapp={waPhone}
        snapchat_url={tenant.snapchat_url}
        tiktok_url={tenant.tiktok_url}
        whatsapp_note={tenant.whatsapp_note}
      />
    </div>
  )
}
