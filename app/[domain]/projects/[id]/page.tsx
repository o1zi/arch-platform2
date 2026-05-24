import { notFound } from 'next/navigation'
import { getTenantByIdentifier } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { Project, ProjectImage } from '@/types'
import { getCustomTheme } from '@/lib/get-custom-theme'
import { getSectorConfig } from '@/lib/sectors'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProjectDetailPage({ params }: { params: { domain: string; id: string } }) {
  const tenant = await getTenantByIdentifier(params.domain)
  if (!tenant) notFound()

  const supabase = await createClient()
  const [{ data: project }, customTheme] = await Promise.all([
    supabase
      .from('projects')
      .select('*, images:project_images(*)')
      .eq('id', params.id)
      .eq('tenant_id', tenant.id)
      .is('deleted_at', null)
      .single(),
    getCustomTheme(tenant.id),
  ])

  if (!project) notFound()
  const p = project as Project & { images: ProjectImage[] }
  const images = (p.images ?? []).sort((a, b) => a.sort_order - b.sort_order)
  const sectorConfig = getSectorConfig(tenant.sector)

  // ألوان القالب المخصص أو افتراضية
  const colors = customTheme?.config?.colors
  const bgColor     = colors?.background ?? '#ffffff'
  const primaryColor = colors?.primary   ?? '#0f0f0f'
  const accentColor = colors?.accent     ?? '#3b82f6'
  const textColor   = colors?.text       ?? '#111111'
  const textLight   = colors?.textLight  ?? '#666666'
  const secondaryBg = colors?.secondary  ?? '#f8f8f8'
  const headingFont = customTheme?.config?.fonts?.heading
  const bodyFont    = customTheme?.config?.fonts?.body

  const cssVars = {
    '--c-primary': primaryColor,
    '--c-accent': accentColor,
    '--c-bg': bgColor,
    '--c-text': textColor,
    '--c-text-light': textLight,
    '--c-secondary': secondaryBg,
  } as React.CSSProperties

  return (
    <div dir="rtl" style={{ ...cssVars, backgroundColor: bgColor, color: textColor, fontFamily: bodyFont ? `'${bodyFont}', sans-serif` : undefined }}>
      {customTheme && headingFont && bodyFont && (
        <style>{`@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(headingFont)}:wght@400;700;900&family=${encodeURIComponent(bodyFont)}:wght@300;400;500;700&display=swap');`}</style>
      )}

      {/* Nav */}
      <nav style={{ backgroundColor: primaryColor }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo_url && (
              <Image src={tenant.logo_url} alt="" width={32} height={32} className="rounded-full object-cover" />
            )}
            <span className="font-bold" style={{ color: bgColor }}>{tenant.name_ar}</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href={`/${tenant.slug}`} style={{ color: bgColor }} className="opacity-70 hover:opacity-100">الرئيسية</Link>
            <Link href={`/${tenant.slug}/projects`} style={{ color: bgColor }} className="opacity-70 hover:opacity-100">المشاريع</Link>
            <Link href={`/${tenant.slug}/contact`}
              className="px-4 py-1.5 font-bold rounded-sm"
              style={{ backgroundColor: accentColor, color: bgColor }}>
              تواصل
            </Link>
          </div>
        </div>
      </nav>

      {/* Cover */}
      {p.cover_image_url && (
        <div className="relative h-64 md:h-96">
          <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: `${primaryColor}60` }} />
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link href={`/${tenant.slug}/projects`}
          className="text-sm mb-8 block flex items-center gap-1 hover:opacity-70 transition-opacity"
          style={{ color: accentColor }}>
          ← العودة لـ{sectorConfig.portfolioLabel}
        </Link>

        {/* Meta */}
        <div className="mb-8">
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
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: secondaryBg, color: textLight }}>
                {p.location_ar}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-black" style={{ fontFamily: headingFont ? `'${headingFont}', serif` : undefined, color: textColor }}>
            {p.title_ar}
          </h1>
          {p.title_en && (
            <h2 className="text-xl mt-1 font-light" dir="ltr" style={{ color: textLight }}>{p.title_en}</h2>
          )}
        </div>

        {/* بطاقة الخصائص — تظهر فقط للعقاري أو من لديه حقول إضافية */}
        {(p.price || p.area || p.bedrooms || p.bathrooms || p.status) && (
          <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-xl"
            style={{ backgroundColor: secondaryBg }}>
            {p.price && (
              <div className="text-center p-2">
                <p className="text-xl font-black" style={{ color: accentColor }}>{p.price}</p>
                <p className="text-xs mt-0.5" style={{ color: textLight }}>السعر</p>
              </div>
            )}
            {p.area && (
              <div className="text-center p-2">
                <p className="text-xl font-black" style={{ color: textColor }}>{p.area}</p>
                <p className="text-xs mt-0.5" style={{ color: textLight }}>المساحة</p>
              </div>
            )}
            {p.bedrooms != null && (
              <div className="text-center p-2">
                <p className="text-xl font-black" style={{ color: textColor }}>{p.bedrooms}</p>
                <p className="text-xs mt-0.5" style={{ color: textLight }}>غرف النوم</p>
              </div>
            )}
            {p.bathrooms != null && (
              <div className="text-center p-2">
                <p className="text-xl font-black" style={{ color: textColor }}>{p.bathrooms}</p>
                <p className="text-xs mt-0.5" style={{ color: textLight }}>دورات المياه</p>
              </div>
            )}
            {p.status && (
              <div className="col-span-full mt-1 flex justify-center">
                <span className="text-sm font-bold px-4 py-1 rounded-full"
                  style={{ backgroundColor: p.status === 'متاح' ? '#dcfce7' : p.status === 'مباع' ? '#fee2e2' : '#fef9c3',
                           color: p.status === 'متاح' ? '#166534' : p.status === 'مباع' ? '#991b1b' : '#854d0e' }}>
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
                style={{ borderColor: secondaryBg, color: textLight }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {p.description_ar && (
          <p className="leading-relaxed text-lg mb-12" style={{ color: textLight }}>{p.description_ar}</p>
        )}

        {/* Gallery */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map(img => (
              <div key={img.id} className="aspect-[4/3] relative overflow-hidden rounded-md"
                style={{ backgroundColor: secondaryBg }}>
                <Image src={img.url} alt="" fill
                  className="object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: secondaryBg }}>
          <p style={{ color: textLight }}>هل أعجبك هذا المشروع؟</p>
          <Link href={`/${tenant.slug}/contact`}
            className="px-8 py-3 font-bold rounded-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: accentColor, color: bgColor }}>
            تواصل معنا
          </Link>
        </div>
      </main>
    </div>
  )
}
