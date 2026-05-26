'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Phone, Mail, ChevronLeft } from 'lucide-react'
import { Tenant, Project, ProjectImage, CustomTheme } from '@/types'
import { SectorConfig } from '@/lib/sectors'
import { Lightbox } from '@/components/themes/shared/Lightbox'
import MobileMenu from '@/components/themes/shared/MobileMenu'
import { trackEvent } from '@/lib/analytics-client'

interface Props {
  tenant: Tenant
  project: Project & { images: ProjectImage[] }
  images: ProjectImage[]
  sectorConfig: SectorConfig
  customTheme: CustomTheme | null
  bgColor: string
  primaryColor: string
  accentColor: string
  textColor: string
  textLight: string
  secondaryBg: string
  headingFont: string | null
  bodyFont: string | null
  themeFont: string
  waUrl: string | null
}

export default function ProjectDetailClient({
  tenant,
  project: p,
  images,
  sectorConfig: sc,
  customTheme,
  bgColor,
  primaryColor,
  accentColor,
  textColor,
  textLight,
  secondaryBg,
  headingFont,
  bodyFont,
  themeFont,
  waUrl,
}: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // تتبع مشاهدة المشروع
  useEffect(() => {
    trackEvent(tenant.slug, 'project_view', { project_title: p.title_ar }, p.id)
  }, [tenant.slug, p.id, p.title_ar])

  const lightboxImages = [
    ...(p.cover_image_url ? [{ url: p.cover_image_url, alt: p.title_ar }] : []),
    ...images.map(img => ({ url: img.url, alt: p.title_ar })),
  ]

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx)
    setLightboxOpen(true)
  }

  const cssVars = {
    '--c-primary':    primaryColor,
    '--c-accent':     accentColor,
    '--c-bg':         bgColor,
    '--c-text':       textColor,
    '--c-text-light': textLight,
    '--c-secondary':  secondaryBg,
  } as React.CSSProperties

  return (
    <div
      dir="rtl"
      style={{
        ...cssVars,
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: bodyFont ? `'${bodyFont}', sans-serif` : themeFont,
      }}
    >
      {/* Fonts */}
      {customTheme && headingFont && bodyFont && (
        <style>{`@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(headingFont)}:wght@400;700;900&family=${encodeURIComponent(bodyFont)}:wght@300;400;500;700&display=swap');`}</style>
      )}

      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b" style={{ backgroundColor: primaryColor, borderColor: 'rgba(255,255,255,0.1)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo_url && (
              <Image src={tenant.logo_url} alt="" width={32} height={32} className="rounded-full object-cover" />
            )}
            <Link href={`/${tenant.slug}`} className="font-bold transition-opacity hover:opacity-80" style={{ color: bgColor }}>
              {tenant.name_ar}
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href={`/${tenant.slug}`} style={{ color: bgColor }} className="opacity-60 hover:opacity-100 transition-opacity">الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} style={{ color: bgColor }} className="opacity-60 hover:opacity-100 transition-opacity">{sc.portfolioLabel}</Link>
            <Link href={`/${tenant.slug}/contact`}
              className="px-4 py-1.5 font-bold rounded-sm transition-opacity hover:opacity-90"
              style={{ backgroundColor: accentColor, color: bgColor }}>
              تواصل
            </Link>
          </div>

          <MobileMenu
            tenantName={tenant.name_ar}
            tenantSlug={tenant.slug}
            logoUrl={tenant.logo_url}
            phone={tenant.phone}
            email={tenant.email}
            portfolioLabel={sc.portfolioLabel}
            accentColor={accentColor}
            bgColor={bgColor}
            textColor={textColor}
            variant="dark"
          />
        </div>
      </nav>

      {/* صورة الغلاف */}
      {p.cover_image_url && (
        <div
          className="relative h-64 md:h-[50vh] cursor-pointer group overflow-hidden"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={p.cover_image_url}
            alt={p.title_ar}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
            <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
              انقر للتكبير
            </span>
          </div>
          <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${bgColor}40, transparent)` }} />
        </div>
      )}

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <Link
          href={`/${tenant.slug}/projects`}
          className="flex items-center gap-1 text-sm mb-8 transition-opacity hover:opacity-70"
          style={{ color: accentColor }}
        >
          <ChevronLeft className="w-4 h-4" />
          العودة إلى {sc.portfolioLabel}
        </Link>

        {/* Meta badges */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {p.category && (
              <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: accentColor, color: bgColor }}>
                {p.category}
              </span>
            )}
            {p.year && (
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: secondaryBg, color: textLight }}>
                {p.year}
              </span>
            )}
            {p.location_ar && (
              <span className="text-xs px-3 py-1 rounded-full flex items-center gap-1"
                style={{ backgroundColor: secondaryBg, color: textLight }}>
                <MapPin className="w-3 h-3" />{p.location_ar}
              </span>
            )}
          </div>

          <h1
            className="text-3xl md:text-4xl font-black leading-tight mb-2"
            style={{ color: textColor, fontFamily: headingFont ? `'${headingFont}', serif` : undefined }}
          >
            {p.title_ar}
          </h1>
          {p.title_en && (
            <h2 className="text-xl font-light mt-1" dir="ltr" style={{ color: textLight }}>{p.title_en}</h2>
          )}
        </div>

        {/* بطاقة الخصائص */}
        {(p.price || p.area || p.bedrooms != null || p.bathrooms != null || p.status) && (
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3 p-6 rounded-xl"
            style={{ backgroundColor: secondaryBg }}>
            {p.price && (
              <div className="text-center p-2">
                <p className="text-2xl font-black" style={{ color: accentColor }}>{p.price}</p>
                <p className="text-xs mt-1" style={{ color: textLight }}>السعر</p>
              </div>
            )}
            {p.area && (
              <div className="text-center p-2">
                <p className="text-2xl font-black" style={{ color: textColor }}>{p.area}</p>
                <p className="text-xs mt-1" style={{ color: textLight }}>المساحة</p>
              </div>
            )}
            {p.bedrooms != null && (
              <div className="text-center p-2">
                <p className="text-2xl font-black" style={{ color: textColor }}>{p.bedrooms}</p>
                <p className="text-xs mt-1" style={{ color: textLight }}>غرف النوم</p>
              </div>
            )}
            {p.bathrooms != null && (
              <div className="text-center p-2">
                <p className="text-2xl font-black" style={{ color: textColor }}>{p.bathrooms}</p>
                <p className="text-xs mt-1" style={{ color: textLight }}>دورات المياه</p>
              </div>
            )}
            {p.status && (
              <div className="col-span-full flex justify-center mt-1">
                <span className="text-sm font-bold px-4 py-1.5 rounded-full"
                  style={{
                    backgroundColor: p.status === 'متاح' ? '#dcfce7' : p.status === 'مباع' ? '#fee2e2' : '#fef9c3',
                    color: p.status === 'متاح' ? '#166534' : p.status === 'مباع' ? '#991b1b' : '#854d0e',
                  }}>
                  {p.status}
                </span>
              </div>
            )}
          </div>
        )}

        {/* الوسوم */}
        {p.tags && p.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {p.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full border"
                style={{ borderColor: `${accentColor}25`, color: textLight, backgroundColor: `${accentColor}08` }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* الوصف */}
        {p.description_ar && (
          <p className="leading-loose text-base mb-12" style={{ color: textLight }}>{p.description_ar}</p>
        )}

        {/* معرض الصور */}
        {images.length > 0 && (
          <div className="mb-12">
            <h2 className="text-lg font-black mb-6" style={{ color: textColor }}>معرض الصور</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => openLightbox(p.cover_image_url ? i + 1 : i)}
                  className="aspect-[4/3] relative overflow-hidden rounded-lg group cursor-zoom-in"
                  style={{ backgroundColor: secondaryBg }}
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg" />
                </button>
              ))}
            </div>
            <p className="text-xs mt-3 opacity-40" style={{ color: textColor }}>انقر على أي صورة لعرضها بالحجم الكامل</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderColor: secondaryBg }}>
          <div>
            <p className="font-bold mb-1" style={{ color: textColor }}>هل أعجبك هذا {sc.portfolioItemLabel}؟</p>
            <p className="text-sm" style={{ color: textLight }}>تواصل معنا لنناقش مشروعك</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            {waUrl && (
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 font-bold rounded-sm transition-opacity hover:opacity-90 text-sm"
                style={{ backgroundColor: '#25d366', color: '#ffffff' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                واتساب
              </a>
            )}
            <Link href={`/${tenant.slug}/contact`}
              className="px-6 py-3 font-bold rounded-sm transition-opacity hover:opacity-90 text-sm"
              style={{ backgroundColor: accentColor, color: bgColor }}>
              تواصل معنا
            </Link>
          </div>
        </div>

        {/* معلومات تواصل */}
        {(tenant.phone || tenant.email) && (
          <div className="mt-6 flex flex-wrap gap-4 text-sm" style={{ color: textLight }}>
            {tenant.phone && (
              <a href={`tel:${tenant.phone}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity" dir="ltr">
                <Phone className="w-4 h-4" style={{ color: accentColor }} />{tenant.phone}
              </a>
            )}
            {tenant.email && (
              <a href={`mailto:${tenant.email}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
                <Mail className="w-4 h-4" style={{ color: accentColor }} />{tenant.email}
              </a>
            )}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {lightboxOpen && lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  )
}
