# ERRORS.md — سجل الأخطاء الكاملة للمشروع

> آخر فحص: 2026-05-25
> الحالة العامة: ✅ جميع الأخطاء تم إصلاحها — البيلد نظيف، ESLint صفر أخطاء.

---

## ~~🔴 أخطاء ESLint~~ — ✅ تم الإصلاح

### 1. `tailwind.config.ts` — السطر 58

```
error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
```

**السبب:** استخدام `require()` بدل `import`
**الكود الحالي:**
```ts
plugins: [require('tailwindcss-animate')],
```
**الإصلاح:**
```ts
import tailwindcssAnimate from 'tailwindcss-animate'
// ...
plugins: [tailwindcssAnimate],
```

---

## ~~🔴 خطأ قاعدة البيانات~~ — ✅ تم الإصلاح — قالب Nebula

**الملف:** `supabase/migrations/001_initial_schema.sql`
**المشكلة:** جدول `tenants` يحتوي على هذا الـ constraint:
```sql
check (theme in ('modern','classic','bold','minimal','luxury'))
```
لكن `nebula` مسجّل كـ Theme صالح في:
- `types/index.ts` → `export type Theme = 'modern' | 'classic' | 'bold' | 'minimal' | 'luxury' | 'nebula'`
- `ThemeRenderer.tsx`, `ThemeProjectsRenderer.tsx`, `ThemeContactRenderer.tsx`
- خطط الباقات في `types/index.ts`

**النتيجة:** أي محاولة لحفظ `theme = 'nebula'` في قاعدة البيانات ستفشل بـ constraint violation.

**الإصلاح:** إضافة migration جديد:
```sql
-- Migration 008: إضافة قالب nebula للـ constraint
ALTER TABLE tenants
  DROP CONSTRAINT IF EXISTS tenants_theme_check,
  ADD CONSTRAINT tenants_theme_check
    CHECK (theme IN ('modern','classic','bold','minimal','luxury','nebula'));
```

---

## ~~🟠 مشاكل منطقية~~ — ✅ تم الإصلاح — DynamicContactPage.tsx

**الملف:** `components/themes/DynamicContactPage.tsx`

### المشكلة 1 — WhatsApp يستخدم `phone` بدل `whatsapp`

**الكود الحالي (السطر ~58):**
```tsx
const waPhone = tenant.phone?.replace(/\D/g, '')
```
**الصواب** (متوافق مع باقي القوالب):
```tsx
const waPhone = tenant.whatsapp?.replace(/\D/g, '') || tenant.phone?.replace(/\D/g, '')
```

### المشكلة 2 — TikTok مفقود من قائمة السوشيال ميديا

**الكود الحالي (السطر ~44-48):**
```tsx
const socials = [
  { url: tenant.instagram_url, label: 'إنستقرام' },
  { url: tenant.twitter_url, label: 'تويتر' },
  { url: tenant.linkedin_url, label: 'لينكدإن' },
  { url: tenant.snapchat_url, label: 'سناب شات' },
].filter(s => s.url)
```
**الإصلاح:** إضافة TikTok:
```tsx
{ url: tenant.tiktok_url, label: 'تيك توك' },
```

### المشكلة 3 — لا يوجد SocialFloat

صفحة التواصل للقوالب المخصصة (DynamicContactPage) لا تحتوي على زر الواتساب/سناب/تيك توك العائم.
**الإصلاح:** إضافة `<SocialFloat>` في نهاية الكمبوننت.

### المشكلة 4 — Google Maps embed URL غير صحيح

**الكود الحالي (السطر 179):**
```tsx
src={tenant.google_maps_url.replace('/maps/', '/maps/embed?')}
```
**المشكلة:** روابط Google Maps تأتي بصيغ مختلفة، هذا الـ replace لن يشتغل مع معظمها.
مثال: `https://maps.app.goo.gl/...` أو `https://www.google.com/maps/place/...`
**الإصلاح الموصى به:** استخدام الرابط كما هو داخل `<iframe>` بعد إضافة `/embed` يدوياً من الداشبورد، أو إضافة تعليمات للمستخدم بنسخ رابط الـ embed مباشرة.

---

## ~~🟠 مشكلة منطقية~~ — ✅ تم الإصلاح — DynamicThemeEngine.tsx

**الملف:** `components/themes/DynamicThemeEngine.tsx` — السطر 234

**المشكلة:** TikTok مفقود من قائمة السوشيال ميديا في القالب الديناميكي:
```tsx
const socials = [
  { url: tenant.instagram_url, label: 'انستقرام', icon: '...' },
  { url: tenant.twitter_url,   label: 'تويتر',    icon: '...' },
  { url: tenant.linkedin_url,  label: 'لينكدإن',  icon: '...' },
  { url: tenant.snapchat_url,  label: 'سناب',     icon: '👻' },
  // ← تيك توك مفقود هنا
]
```

---

## ~~🟡 TODO غير منجز~~ — ✅ تم الإصلاح — إيميل الترحيب

**الملف:** `app/api/admin/tenants/route.ts` — السطر 67

```ts
// TODO: Send welcome email via Resend
```

إيميل الترحيب عند إنشاء مكتب جديد غير مُفعَّل رغم أن CLAUDE.md يحدده كمتطلب أساسي.

---

## ~~🟡 تحذيرات ESLint مُعطَّلة~~ — ✅ تم الإصلاح — img → Image

**الملفات:**
- `app/admin/themes/page.tsx:48` — `eslint-disable-next-line @next/next/no-img-element`
- `components/dashboard/ThemeSelector.tsx:183` — `eslint-disable-next-line @next/next/no-img-element`

**المشكلة:** استخدام `<img>` بدل `<Image>` من next/image في صفحات الداشبورد.
**الإصلاح:** تحويلها لـ `<Image>` مع تحديد `width` و`height` مناسبين.

---

## 🟡 console.error في الكود

**الملف:** `lib/tenant.ts` — السطر 7

```ts
console.error('Tenant lookup failed:', e.message)
```

مقبول في server-side، لكن يُفضَّل توجيه الخطأ لنظام monitoring مستقبلاً.

---

## 📋 ملخص الأولويات

| الحالة | الخطأ | الملف |
|--------|-------|-------|
| ✅ تم | nebula غير مسجل في DB constraint | `migrations/008_nebula_theme_constraint.sql` |
| ✅ تم | ESLint error — require() forbidden | `tailwind.config.ts` |
| ✅ تم | waPhone يستخدم phone بدل whatsapp | `DynamicContactPage.tsx` |
| ✅ تم | TikTok مفقود من السوشيال | `DynamicContactPage.tsx`, `DynamicThemeEngine.tsx` |
| ✅ تم | لا SocialFloat في DynamicContactPage | `DynamicContactPage.tsx` |
| ✅ تم | Google Maps embed URL خاطئ | `DynamicContactPage.tsx` |
| ✅ تم | إيميل الترحيب غير منجز | `app/api/admin/tenants/route.ts` |
| ✅ تم | img بدل Image (eslint-disable) | `admin/themes/page.tsx`, `ThemeSelector.tsx` |

---

## ✅ ما يعمل بشكل صحيح

- البيلد يمر بدون أخطاء (`next build` ✅)
- TypeScript لا يوجد أخطاء (`tsc --noEmit` ✅)
- جميع القوالب الـ 5 + nebula تحتوي على SocialFloat ✅
- جميع صفحات projects وcontact محدّثة بالـ SocialFloat ✅
- waPhone يستخدم tenant.whatsapp أولاً في كل القوالب المدمجة ✅
- جميع مكونات UI المستخدمة موجودة في `/components/ui/` ✅
- Migration 007 يحتوي على جميع الأعمدة الجديدة (tiktok_url, whatsapp_note, video_url) ✅
- RLS مفعّل على جداول tenant_stats, tenant_testimonials, tenant_faqs ✅
