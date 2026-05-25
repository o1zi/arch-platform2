# دليل برمجة قالب جديد

> اقرأ هذا الملف كاملاً قبل كتابة سطر واحد من القالب الجديد.

---

## ١. بنية الملفات المطلوبة

كل قالب يتكون من **٣ ملفات** داخل مجلد باسم القالب:

```
components/themes/{theme-name}/
├── Layout.tsx        ← الصفحة الرئيسية (Homepage)
├── ProjectsPage.tsx  ← صفحة كل المشاريع
└── ContactPage.tsx   ← صفحة التواصل
```

بعد إنشاء الملفات، سجّل القالب في **٣ أماكن**:

```typescript
// 1. components/themes/ThemeRenderer.tsx
import NewLayout from './new-theme/Layout'
const builtInThemes = { ..., 'new-theme': NewLayout }

// 2. components/themes/ThemeProjectsRenderer.tsx
import NewProjects from './new-theme/ProjectsPage'
const renderers = { ..., 'new-theme': NewProjects }

// 3. components/themes/ThemeContactRenderer.tsx
import NewContact from './new-theme/ContactPage'
const renderers = { ..., 'new-theme': NewContact }
```

ثم أضف القالب إلى:
- `types/index.ts` → `Theme` type
- `types/index.ts` → `PLAN_LIMITS` (أي خطة تتضمنه)

---

## ٢. Layout.tsx — الصفحة الرئيسية

### هيكل المكوّن الأساسي

```typescript
'use client'

import { ThemeProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MapPin, Phone, Mail, ArrowUp } from 'lucide-react'
import { getSectorConfig } from '@/lib/sectors'
import MobileMenu from '@/components/themes/shared/MobileMenu'
import { ScrollReveal, StaggerReveal } from '@/components/themes/shared/ScrollReveal'
import { StatsCounter, SECTOR_STATS } from '@/components/themes/shared/StatsCounter'
import { VideoHero } from '@/components/themes/shared/VideoHero'
import { Testimonials, SECTOR_TESTIMONIALS } from '@/components/themes/shared/Testimonials'
import { FAQ, SECTOR_FAQ } from '@/components/themes/shared/FAQ'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

// ألوان القالب — ثابتة
const PRIMARY = '#...'
const ACCENT  = '#...'

export default function NewLayout({
  tenant,
  projects,
  featuredProjects,
  services: customServices,
  features: customFeatures,
  sectorConfig,
  stats: dbStats,
  testimonials: dbTestimonials,
  faqs: dbFaqs,
}: ThemeProps) {
  const [scrolled, setScrolled] = useState(false)
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 60)
      setShowTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const sc = sectorConfig ?? getSectorConfig(tenant.sector)
  const bio = tenant.bio_ar || sc.heroTagline
  const waPhone = tenant.whatsapp?.replace(/\D/g, '') || tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null
  const sectorKey = tenant.sector ?? 'engineering'

  // ══ بيانات الأقسام: DB أولاً → افتراضيات القطاع ══
  const stats = (dbStats && dbStats.length > 0)
    ? dbStats.map(s => ({ value: s.value, suffix: s.suffix ?? undefined, prefix: s.prefix ?? undefined, label: s.label }))
    : SECTOR_STATS[sectorKey] ?? SECTOR_STATS.engineering

  const testimonials = (dbTestimonials && dbTestimonials.length > 0)
    ? dbTestimonials.map(t => ({ name: t.name, role: t.role ?? '', text: t.content, rating: t.rating }))
    : SECTOR_TESTIMONIALS[sectorKey] ?? SECTOR_TESTIMONIALS.engineering

  const faqs = (dbFaqs && dbFaqs.length > 0)
    ? dbFaqs.map(f => ({ q: f.question, a: f.answer }))
    : SECTOR_FAQ[sectorKey] ?? SECTOR_FAQ.engineering

  // ══ الخدمات والمميزات: DB أولاً → سكتور كونفيغ ══
  const services = customServices.length > 0 ? customServices : sc.services.map((s, i) => ({
    id: String(i), tenant_id: tenant.id, type: 'service' as const,
    title: s.title, description: s.description ?? null,
    icon: s.icon ?? null, sort_order: i, is_active: true, created_at: '',
  }))

  const features = customFeatures.length > 0 ? customFeatures : sc.features.map((f, i) => ({
    id: String(i), tenant_id: tenant.id, type: 'feature' as const,
    title: f.title, description: f.description ?? null,
    icon: f.icon ?? null, sort_order: i, is_active: true, created_at: '',
  }))

  const displayedProjects = featuredProjects.length > 0 ? featuredProjects.slice(0, 6) : projects.slice(0, 6)

  const socials = [
    { url: tenant.instagram_url, label: 'إنستقرام' },
    { url: tenant.twitter_url,   label: 'تويتر' },
    { url: tenant.linkedin_url,  label: 'لينكدإن' },
    { url: tenant.snapchat_url,  label: 'سناب' },
    { url: tenant.tiktok_url,    label: 'تيك توك' },
  ].filter(s => s.url)

  return (
    <div className="min-h-screen" style={{ backgroundColor: PRIMARY }} dir="rtl">

      {/* ══ NAV ══ */}
      {/* ... nav code ... */}

      {/* ══ MobileMenu ══ */}
      <MobileMenu
        tenantName={tenant.name_ar}
        tenantSlug={tenant.slug}
        logoUrl={tenant.logo_url}
        phone={tenant.phone}
        email={tenant.email}
        portfolioLabel={sc.portfolioLabel}
        accentColor={ACCENT}
        bgColor={PRIMARY}
        textColor="#ffffff"
        variant="dark"
      />

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex items-center">
        {/* لو كان للمكتب فيديو → VideoHero */}
        {tenant.video_url && (
          <VideoHero videoUrl={tenant.video_url} overlayOpacity={0.6} className="absolute inset-0" />
        )}
        {/* ... hero content ... */}
      </section>

      {/* ══ STATS ══ */}
      <section className="py-20 px-6">
        <StatsCounter
          stats={stats}
          accentColor={ACCENT}
          labelColor="rgba(255,255,255,0.5)"
        />
      </section>

      {/* ══ SERVICES ══ */}
      <section className="py-20 px-6">
        <StaggerReveal animation="fade-up" stagger={100}>
          {services.map(s => (
            <div key={s.id}>/* ... card ... */</div>
          ))}
        </StaggerReveal>
      </section>

      {/* ══ PROJECTS ══ */}
      <section className="py-20 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedProjects.map(p => (
            <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}>
              {/* ... card ... */}
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href={`/${tenant.slug}/projects`}>عرض كل {sc.portfolioLabel}</Link>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <Testimonials
        items={testimonials}
        variant="cards"   // 'cards' | 'carousel' | 'minimal' | 'quote'
        accentColor={ACCENT}
        bgColor={PRIMARY}
        textColor="#ffffff"
      />

      {/* ══ FAQ ══ */}
      <FAQ
        items={faqs}
        variant="default"  // 'default' | 'bordered' | 'filled' | 'minimal'
        accentColor={ACCENT}
        bgColor={PRIMARY}
        textColor="#ffffff"
      />

      {/* ══ FOOTER ══ */}
      <footer>
        {/* ... footer content ... */}
        {/* روابط السوشيال بـ text labels فقط (لا icon components) */}
        {socials.map(s => (
          <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer">{s.label}</a>
        ))}
      </footer>

      {/* ══ SocialFloat (TikTok + Snapchat + WhatsApp) ══ */}
      <SocialFloat
        whatsapp={waPhone}
        snapchat_url={tenant.snapchat_url}
        tiktok_url={tenant.tiktok_url}
        whatsapp_note={tenant.whatsapp_note}
      />

      {/* ══ Back to Top ══ */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-50 w-10 h-10 ..."
          aria-label="للأعلى"
        >
          ↑
        </button>
      )}
    </div>
  )
}
```

---

## ٣. ProjectsPage.tsx

```typescript
'use client'

import { Tenant, Project } from '@/types'
import { SectorConfig, getSectorConfig } from '@/lib/sectors'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BedDouble, Bath, Maximize2, Menu, X } from 'lucide-react'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

export default function NewProjectsPage({
  tenant, projects, sectorConfig,
}: { tenant: Tenant; projects: Project[]; sectorConfig?: SectorConfig }) {
  const sc = sectorConfig ?? getSectorConfig(tenant.sector)
  const categories = ['الكل', ...Array.from(new Set(projects.map(p => p.category).filter(Boolean))) as string[]]
  const [active, setActive] = useState('الكل')
  const [menuOpen, setMenuOpen] = useState(false)
  const filtered = active === 'الكل' ? projects : projects.filter(p => p.category === active)
  const waPhone = tenant.whatsapp?.replace(/\D/g, '') || tenant.phone?.replace(/\D/g, '')

  return (
    <div className="min-h-screen" dir="rtl">

      {/* NAV مع hamburger */}
      <nav className="...">
        <Link href={`/${tenant.slug}`}>{tenant.name_ar}</Link>
        <div className="hidden md:flex gap-6 ...">
          <Link href={`/${tenant.slug}`}>الرئيسية</Link>
          <span>{sc.portfolioLabel}</span>
          <Link href={`/${tenant.slug}/contact`}>تواصل</Link>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(true)}><Menu /></button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="absolute top-0 right-0 bottom-0 w-72 ...">
            <button onClick={() => setMenuOpen(false)}><X /></button>
            <nav>
              <Link href={`/${tenant.slug}`} onClick={() => setMenuOpen(false)}>الرئيسية</Link>
              <Link href={`/${tenant.slug}/projects`} onClick={() => setMenuOpen(false)}>{sc.portfolioLabel}</Link>
              <Link href={`/${tenant.slug}/contact`} onClick={() => setMenuOpen(false)}>تواصل</Link>
            </nav>
          </div>
        </div>
      )}

      {/* filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActive(cat)}
            className={active === cat ? 'active-style' : 'inactive-style'}>
            {cat}
          </button>
        ))}
      </div>

      {/* projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Link key={p.id} href={`/${tenant.slug}/projects/${p.id}`}>
            {p.cover_image_url && (
              <div className="relative aspect-[4/3]">
                <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover" />
              </div>
            )}
            <p>{p.title_ar}</p>

            {/* حقول العقارات (real_estate sector) */}
            {sc.extraFields.price && p.price && <span>{p.price}</span>}
            {sc.extraFields.area && p.area && <span><Maximize2 />{p.area}</span>}
            {sc.extraFields.bedrooms && p.bedrooms && <span><BedDouble />{p.bedrooms}</span>}
            {sc.extraFields.bedrooms && p.bathrooms && <span><Bath />{p.bathrooms}</span>}
          </Link>
        ))}
      </div>

      {/* SocialFloat */}
      <SocialFloat
        whatsapp={waPhone}
        snapchat_url={tenant.snapchat_url}
        tiktok_url={tenant.tiktok_url}
        whatsapp_note={tenant.whatsapp_note}
      />
    </div>
  )
}
```

---

## ٤. ContactPage.tsx

```typescript
'use client'

import { Tenant } from '@/types'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { SocialFloat } from '@/components/themes/shared/SocialFloat'

export default function NewContactPage({ tenant }: { tenant: Tenant }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const waPhone = tenant.whatsapp?.replace(/\D/g, '') || tenant.phone?.replace(/\D/g, '')
  const waUrl = waPhone ? `https://wa.me/${waPhone}` : null

  const socials = [
    { label: 'إنستقرام', url: tenant.instagram_url },
    { label: 'تويتر',    url: tenant.twitter_url },
    { label: 'لينكدإن',  url: tenant.linkedin_url },
    { label: 'سناب شات', url: tenant.snapchat_url },
    { label: 'تيك توك',  url: tenant.tiktok_url },
  ].filter(s => s.url)

  return (
    <div className="min-h-screen" dir="rtl">
      {/* NAV + Mobile drawer */}

      {/* معلومات التواصل */}
      {tenant.phone && <a href={`tel:${tenant.phone}`}>{tenant.phone}</a>}
      {tenant.email && <a href={`mailto:${tenant.email}`}>{tenant.email}</a>}
      {tenant.address_ar && <p>{tenant.address_ar}</p>}
      {tenant.google_maps_url && <a href={tenant.google_maps_url} target="_blank" rel="noopener noreferrer">افتح الخريطة</a>}
      {waUrl && <a href={waUrl} target="_blank" rel="noopener noreferrer">تواصل عبر واتساب</a>}

      {/* السوشيال */}
      {socials.map(s => (
        <a key={s.label} href={s.url!} target="_blank" rel="noopener noreferrer">{s.label}</a>
      ))}

      {/* SocialFloat (أزرار عائمة) */}
      <SocialFloat
        whatsapp={waPhone}
        snapchat_url={tenant.snapchat_url}
        tiktok_url={tenant.tiktok_url}
        whatsapp_note={tenant.whatsapp_note}
      />
    </div>
  )
}
```

---

## ٥. قواعد ESLint الصارمة

> المشروع يستخدم ESLint صارم جداً — هذه أخطاء شائعة:

| ❌ خطأ | ✅ صحيح |
|--------|---------|
| `const _unused = ...` | احذف المتغير كلياً |
| `import { Instagram }` من lucide-react | استخدم text labels بدلاً من Icon |
| متغير معرّف لكن غير مستخدم | احذفه أو استخدمه فعلاً |
| `any` type | اكتب الـ type الصحيح |

**ملاحظة مهمة:** `Instagram`, `Twitter`, `Linkedin` ليست موجودة في نسخة lucide-react المثبتة. استخدم نصوصاً بدلها:
```typescript
// ❌ لا تعمل
import { Instagram } from 'lucide-react'

// ✅ يعمل
<a href={tenant.instagram_url}>إنستقرام</a>
```

---

## ٦. Shared Components المتاحة

```typescript
// المكوّنات الجاهزة في components/themes/shared/

MobileMenu          // قائمة جوال منزلقة
Lightbox            // عارض صور fullscreen
useLightbox()       // hook للـ Lightbox
ScrollReveal        // تأثير fade-in عند الـ scroll
StaggerReveal       // تأثير متتالي لعدة عناصر
StatsCounter        // عداد أرقام متحرك
SECTOR_STATS        // بيانات افتراضية للإحصائيات
VideoHero           // فيديو خلفية (YouTube/Vimeo/mp4)
VideoSection        // قسم فيديو standalone
Testimonials        // شهادات العملاء (4 variants)
SECTOR_TESTIMONIALS // شهادات افتراضية
FAQ                 // أسئلة شائعة (4 variants)
SECTOR_FAQ          // FAQs افتراضية
SocialFloat         // أزرار TikTok + Snapchat + WhatsApp عائمة
BeforeAfter         // مقارنة صور before/after
```

### استخدام الأقسام الديناميكية (DB أولاً → افتراضيات)

```typescript
// هذا النمط إلزامي في كل قالب جديد:

const stats = (dbStats && dbStats.length > 0)
  ? dbStats.map(s => ({ value: s.value, suffix: s.suffix ?? undefined, prefix: s.prefix ?? undefined, label: s.label }))
  : SECTOR_STATS[sectorKey] ?? SECTOR_STATS.engineering

const testimonials = (dbTestimonials && dbTestimonials.length > 0)
  ? dbTestimonials.map(t => ({ name: t.name, role: t.role ?? '', text: t.content, rating: t.rating }))
  : SECTOR_TESTIMONIALS[sectorKey] ?? SECTOR_TESTIMONIALS.engineering

const faqs = (dbFaqs && dbFaqs.length > 0)
  ? dbFaqs.map(f => ({ q: f.question, a: f.answer }))
  : SECTOR_FAQ[sectorKey] ?? SECTOR_FAQ.engineering
```

---

## ٧. SectorConfig — ما هو متاح

```typescript
// lib/sectors.ts — كل قطاع يحتوي على:
sc.label              // "مكتب هندسي"
sc.portfolioLabel     // "المشاريع" أو "الأعمال" حسب القطاع
sc.portfolioItemLabel // "مشروع"
sc.portfolioItemLabelPlural // "مشاريع"
sc.heroTagline        // نص Hero الافتراضي
sc.services[]         // خدمات افتراضية
sc.features[]         // مميزات افتراضية
sc.categories[]       // تصنيفات المشاريع
sc.extraFields.price     // هل يعرض سعر؟ (real_estate = true)
sc.extraFields.area      // هل يعرض مساحة؟
sc.extraFields.bedrooms  // هل يعرض غرف؟
sc.extraFields.bathrooms // هل يعرض حمامات؟
sc.extraFields.status    // هل يعرض حالة؟
```

---

## ٨. قائمة تحقق قبل الـ Push

```
□ Layout.tsx يعمل ويعرض كل الأقسام
□ ProjectsPage.tsx يعمل مع الـ filter
□ ContactPage.tsx يعرض كل معلومات التواصل
□ SocialFloat موجود في الـ 3 ملفات
□ MobileMenu موجود في Layout.tsx
□ بيانات DB تُستخدم أولاً (stats/testimonials/faqs)
□ لا يوجد متغير غير مستخدم
□ لا يوجد import من Instagram/Twitter/Linkedin
□ القالب مسجّل في ThemeRenderer + ThemeProjectsRenderer + ThemeContactRenderer
□ القالب مضاف في types/index.ts → Theme type
□ npm run build يعمل بدون أخطاء
```

---

## ٩. الأقسام الإلزامية في Layout.tsx

| القسم | إلزامي؟ | ملاحظة |
|-------|---------|--------|
| Nav + MobileMenu | ✅ | مع hamburger للجوال |
| Hero | ✅ | يدعم VideoHero |
| Stats | ✅ | من DB أو افتراضيات |
| About (بيوغرافيا) | ✅ | bio_ar + logo |
| Services | ✅ | من DB أو sc.services |
| Projects (مميزة) | ✅ | featuredProjects أو أول 6 |
| Testimonials | ✅ | من DB أو SECTOR_TESTIMONIALS |
| FAQ | ✅ | من DB أو SECTOR_FAQ |
| Footer | ✅ | مع روابط السوشيال |
| SocialFloat | ✅ | TikTok + Snapchat + WhatsApp |
| Features | اختياري | |
| VideoSection | اختياري | إذا tenant.video_url |
| CTA Section | اختياري | |
