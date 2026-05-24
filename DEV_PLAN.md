# خطة التطوير الشاملة — منصة SaaS متعددة القطاعات

> **تاريخ الإعداد:** مايو 2026  
> **الحالة:** الإصدار 1.0 يعمل في الإنتاج — هذا الملف يحكم كل قرار تطويري قادم  
> **القاعدة الأولى:** لا تُبنى ميزة لم يطلبها عميل حقيقي أو لم تُحقق إيراداً مباشراً

---

## ١. ما تم بناؤه حتى الآن (الإصدار 1.0)

### البنية التحتية
| المكون | الحالة | الملاحظات |
|--------|--------|-----------|
| Next.js 14 App Router | ✅ يعمل | Multi-tenant routing كامل |
| Supabase (DB + Auth + Storage) | ✅ يعمل | RLS مفعّل على كل الجداول |
| Vercel Hosting | ✅ مرفوع | Wildcard domains جاهزة |
| Middleware (tenant detection) | ✅ يعمل | يحدد المكتب من الدومين أو الـ slug |
| TypeScript (100%) | ✅ | لا `any` في أي مكان |

### قاعدة البيانات — الجداول الموجودة
```
tenants              — المكاتب (slug, sector, theme, plan, is_active...)
tenant_users         — ربط المكتب بحساب Auth
projects             — المشاريع/الأعمال (+ price, area, status, bedrooms, bathrooms, tags)
project_images       — معرض صور كل مشروع
admin_users          — حسابات السوبر أدمن
subscription_logs    — سجل كل إجراءات الاشتراك
custom_themes        — قوالب مخصصة يرفعها الأدمن
content_blocks       — (جاهز للتوسع المستقبلي)
```

### Migrations المطبّقة
```
001_initial_schema.sql   — الجداول الأساسية + RLS
002_content_blocks.sql   — كتل المحتوى
003_custom_themes.sql    — نظام القوالب المخصصة
004_theme_visibility.sql — التحكم في ظهور القوالب لكل مكتب
005_multi_sector.sql     — دعم 8 قطاعات + حقول متقدمة
```

### القوالب الجاهزة (5 قوالب × 3 صفحات)
| القالب | الصفحة الرئيسية | صفحة الأعمال | صفحة التواصل |
|--------|----------------|-------------|-------------|
| Modern | ✅ | ✅ | ✅ |
| Classic | ✅ | ✅ | ✅ |
| Bold | ✅ | ✅ | ✅ |
| Minimal | ✅ | ✅ | ✅ |
| Luxury | ✅ | ✅ | ✅ |

كل قالب يتكيف تلقائياً مع القطاع (8 قطاعات).

### القطاعات المدعومة (8 قطاعات)
```
engineering      — مكاتب هندسية ومعمارية
contractor       — مقاولون وبناء
real_estate      — وسطاء عقاريين وتطوير
interior_design  — تصميم داخلي وديكور
photography      — تصوير احترافي وإنتاج
legal            — محامون ومستشارون قانونيون
medical          — عيادات وأطباء
general          — نشاطات تجارية عامة
```

### داشبورد المكتب — الصفحات الجاهزة
- `/dashboard` — الرئيسية (إحصائيات + حالة الاشتراك)
- `/dashboard/profile` — معلومات المكتب + رفع الشعار والغلاف
- `/dashboard/projects` — إدارة المشاريع (CRUD كامل + رفع صور)
- `/dashboard/theme` — اختيار القالب
- `/dashboard/domain` — معلومات الدومين
- `/dashboard/subscription` — حالة الاشتراك والتجديد
- `/dashboard/services` — (جاهز — خدمات مخصصة)

### داشبورد الأدمن — الصفحات الجاهزة
- `/admin` — لوحة التحكم الرئيسية
- `/admin/tenants` — قائمة كل المكاتب + فلترة + بحث
- `/admin/tenants/new` — إضافة مكتب جديد
- `/admin/tenants/[id]` — تفاصيل المكتب + إدارة الاشتراك
- `/admin/subscriptions` — سجل الاشتراكات
- `/admin/themes` — رفع قوالب مخصصة + التحكم في الظهور

---

## ٢. الأولويات التطويرية — مرتّبة حسب الأهمية

> **مبدأ الترتيب:** ما يُحسّن التحويل (يجلب عملاء) > ما يُحسّن الاحتفاظ (يبقي عملاء) > ما يوفر وقت الأدمن > باقي التحسينات

---

### 🔴 الأولوية الأولى — ما يجب بناؤه قبل أول عميل حقيقي

#### 1.1 صفحة Landing Page للمنصة نفسها
**المسار:** `app/(marketing)/page.tsx`  
**لماذا أولاً:** هذه بوابتك للبيع. إذا أرسلت أحداً لرابط المنصة ووجد صفحة فارغة، انتهى الأمر.

**محتوى الصفحة:**
```
Hero:
  - جملة واحدة تلخص الفائدة: "موقعك الاحترافي في 5 دقائق"
  - CTA مباشر: "ابدأ الآن — تواصل على واتساب"
  - صورة أو فيديو قصير للداشبورد

الفائدة (3 نقاط فقط):
  - بدون تصميم — بدون برمجة — بدون انتظار
  - 5 قوالب احترافية جاهزة
  - تتحكم في موقعك بنفسك في أي وقت

العرض والأسعار (3 بطاقات):
  - أساسي: 1,200 ريال/سنة
  - متقدم: 2,000 ريال/سنة
  - بريميوم: 3,500 ريال/سنة

أمثلة حية (Social Proof):
  - روابط مواقع عملاء حقيقيين (حتى لو أنت صنعتها كعروض)
  - "أكثر من X مكتب يثق بالمنصة"

سؤال وجواب (FAQ):
  - هل يمكنني تغيير القالب لاحقاً؟
  - ماذا يحدث لو انتهى اشتراكي؟
  - هل يمكنني استخدام دوميني الخاص؟

Footer:
  - رابط واتساب للتواصل
  - لينك لتسجيل الدخول
```

**الملفات التي ستُعدّل:**
- `app/(marketing)/page.tsx` — الصفحة الرئيسية كاملة
- `app/(marketing)/layout.tsx` — (إنشاء جديد إذا لم يكن موجوداً)

---

#### 1.2 صفحة "انتهى الاشتراك" للمكاتب المنتهية
**المسار:** `app/[domain]/expired/page.tsx`  
**لماذا:** حسب CLAUDE.md، المكاتب المنتهية يجب أن تُظهر صفحة خاصة لا 404.

**المنطق:**
```typescript
// في app/[domain]/layout.tsx
// إذا tenant.is_active = true لكن subscription_end في الماضي
// → redirect إلى /expired
// إذا tenant.is_active = false
// → notFound() (404)
```

**محتوى الصفحة:**
```
رسالة لطيفة: "هذا الموقع متوقف مؤقتاً"
زر: "تواصل مع المكتب" (رقم الهاتف إذا كان محفوظاً)
لا تكشف أنه منتهي الاشتراك أمام الزوار
```

---

#### 1.3 تشغيل Migration 005 في Supabase
**لماذا:** بدونها، الحقول المتقدمة (price, area, status...) لا تُحفظ.  
**خطوة واحدة:**
1. اذهب إلى [supabase.com](https://supabase.com) → مشروعك → SQL Editor
2. انسخ محتوى `supabase/migrations/005_multi_sector.sql` كاملاً
3. اضغط Run

---

### 🟠 الأولوية الثانية — خلال أول شهر من العملاء

#### 2.1 نموذج التواصل في صفحة Contact لكل مكتب
**المسار:** `app/[domain]/contact/page.tsx`  
**لماذا:** الزوار يريدون التواصل المباشر. رقم الهاتف وحده يكفي في البداية، لكن نموذج بريد إلكتروني يزيد التحويلات.

**التطبيق البسيط:**
```typescript
// Server Action يرسل إيميل عبر Resend
// الحقول: الاسم + رقم الجوال + الرسالة
// يُرسل للبريد الإلكتروني المسجّل في tenant.email
// لا يحتاج قاعدة بيانات — فقط Resend
```

**الأولوية الفعلية:** إذا كان `tenant.email` موجوداً → اعرض النموذج. إلا فاعرض الأرقام فقط.

---

#### 2.2 إيميلات Resend التلقائية
**المسار:** `lib/emails/`  
**الإيميلات المطلوبة (حسب الأولوية):**

| الإيميل | المتلقي | المحفّز | الأهمية |
|---------|---------|---------|---------|
| ترحيب + بيانات دخول | المكتب | إنشاء الحساب | 🔴 ضروري |
| تأكيد التفعيل | المكتب | تفعيل is_active | 🔴 ضروري |
| تذكير 30 يوم | المكتب | cron job | 🟠 مهم |
| تذكير 7 أيام | المكتب | cron job | 🟠 مهم |
| تأكيد التجديد | المكتب | تجديد الاشتراك | 🟡 مفيد |

**كود الإرسال الأساسي:**
```typescript
// lib/emails/send.ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(email: string, tenantName: string, password: string, slug: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: email,
    subject: `مرحباً بك في المنصة — ${tenantName}`,
    html: welcomeTemplate({ tenantName, password, slug })
  })
}
```

---

#### 2.3 إحصائيات الزيارات البسيطة
**لماذا:** العملاء يسألون دائماً "كم زيارة حصل موقعي؟" — هذا السؤال يُبرر الاشتراك.

**الخيار الأبسط:** Vercel Analytics (مجاني مع Vercel).
```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'
// أضف <Analytics /> مرة واحدة
```

**الخيار الأكثر تحكماً:** جدول `page_views` في Supabase.
```sql
create table page_views (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  page text not null,       -- '/', '/projects', '/contact'
  referrer text,
  created_at timestamptz default now()
);
```
ثم Server Action أو API Route يسجّل كل زيارة.

**التوصية:** ابدأ بـ Vercel Analytics (سطر واحد). إذا طلب العملاء تفاصيل أكثر، انتقل للجدول.

---

### 🟡 الأولوية الثالثة — بعد 10 عملاء

#### 3.1 صفحة تفاصيل المشروع بقوالب مخصصة
**الوضع الحالي:** `app/[domain]/projects/[id]/page.tsx` يعرض تصميماً موحداً للكل.  
**المطلوب:** أن تتبع نفس القالب المختار (modern/classic/bold/minimal/luxury).

**التطبيق:**
```typescript
// أنشئ مكوناً لكل قالب:
components/themes/modern/ProjectDetailPage.tsx
components/themes/classic/ProjectDetailPage.tsx
components/themes/bold/ProjectDetailPage.tsx
components/themes/minimal/ProjectDetailPage.tsx
components/themes/luxury/ProjectDetailPage.tsx

// ثم في ThemeRenderer:
export function ThemeProjectDetailRenderer({ tenant, project, images, sectorConfig }) {
  const pages = {
    modern: ModernProjectDetailPage,
    classic: ClassicProjectDetailPage,
    // ...
  }
  const Page = pages[tenant.theme] ?? pages.modern
  return <Page tenant={tenant} project={project} images={images} sectorConfig={sectorConfig} />
}
```

---

#### 3.2 Drag & Drop لترتيب المشاريع
**الوضع الحالي:** `sort_order` موجود في قاعدة البيانات لكن لا يوجد UI للترتيب.  
**المكتبة المقترحة:** `@dnd-kit/sortable` (خفيفة، تدعم touch).

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**الاستخدام في:**
- `components/dashboard/ProjectsManager.tsx` — ترتيب قائمة المشاريع
- `components/dashboard/ProjectForm.tsx` — ترتيب صور المشروع الواحد

---

#### 3.3 تحسين رفع الصور
**المشاكل الحالية المتوقعة:**
1. لا يوجد ضغط للصور قبل الرفع → يستهلك Storage بشكل مبالغ
2. لا يوجد preview قبل الرفع
3. لا يوجد تحقق من نوع الملف وحجمه على مستوى الـ UI

**الحل:**
```typescript
// lib/compress-image.ts
// استخدام browser-image-compression (npm package)
import imageCompression from 'browser-image-compression'

export async function compressForUpload(file: File): Promise<File> {
  return imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  })
}
```

---

#### 3.4 صفحة "اختيار القطاع" في داشبورد المكتب
**الوضع الحالي:** القطاع يُعيّنه الأدمن عند إنشاء الحساب.  
**المقترح:** السماح للمكتب بتغيير قطاعه بنفسه (يعيد تهيئة التصنيفات والخدمات).

**المسار:** `/dashboard/sector` أو ضمه لـ `/dashboard/profile`

```typescript
// عند تغيير القطاع:
// 1. تحديث tenants.sector
// 2. تحذير: "تغيير القطاع سيؤثر على تصنيفات مشاريعك"
// 3. اختياري: إعادة تصنيف المشاريع الموجودة
```

---

### ⚪ الأولوية الرابعة — مستقبلية (بعد 30 عميل أو بناءً على طلب)

#### 4.1 نظام الدومين الخاص (Custom Domain)
**للخطة Premium فقط.**  
**التطبيق:**
1. المكتب يُدخل الدومين في الداشبورد
2. يظهر له: "أضف CNAME يشير إلى `cname.vercel-dns.com`"
3. بعد إضافة الدومين في Vercel Dashboard، يُحدَّث `custom_domain` في قاعدة البيانات
4. الـ middleware يتعرف عليه تلقائياً

**ملاحظة هامة:** هذا يتطلب Vercel Pro ($20/شهر) أو ضبط Wildcard Domains يدوياً. لا تعده للعملاء حتى تكون جاهزاً فعلياً.

---

#### 4.2 لوحة إحصائيات متقدمة للأدمن
```
- إجمالي المشاريع المرفوعة عبر المنصة
- متوسط عدد المشاريع لكل مكتب
- القوالب الأكثر استخداماً
- القطاعات الأكثر تسجيلاً
- مقارنة شهرية للإيرادات
- رسم بياني للنمو
```

---

#### 4.3 نظام الإشعارات الداخلية
**للأدمن:**
- إشعار عند تسجيل مكتب جديد
- إشعار عند انتهاء اشتراك خلال 7 أيام

**التطبيق الأبسط:** جدول `notifications` + polling كل 5 دقائق في الداشبورد.

---

#### 4.4 تعدد المستخدمين لكل مكتب
**الوضع الحالي:** كل مكتب = مستخدم واحد (owner).  
**المطلوب:** إضافة محرر (editor) يمكنه رفع المشاريع فقط.

**قاعدة البيانات:** `tenant_users.role` يدعم بالفعل `'owner' | 'editor'` — فقط تحتاج الـ UI.

---

#### 4.5 تصدير بيانات المكتب
```
- تصدير قائمة المشاريع كـ CSV أو PDF
- تصدير معلومات المكتب
- (للأدمن) تصدير تقرير اشتراكات شهري
```

---

#### 4.6 نموذج طلب عرض سعر (Quote Request)
**لبعض القطاعات** (هندسة، مقاولات، تصميم داخلي):  
زائر الموقع يملأ نموذج → يصل للمكتب عبر البريد الإلكتروني.

```typescript
// الحقول:
// - اسم المشروع
// - نوع المشروع (من تصنيفات القطاع)
// - الميزانية التقريبية
// - الجوال
// - ملاحظات
```

---

## ٣. ديون تقنية يجب معالجتها

### 3.1 Migration 005 — يجب تشغيله فوراً
**الحالة:** كُتب الكود لكن لم يُطبَّق على Supabase بعد.  
**الأثر:** حقول price, area, status, bedrooms, bathrooms, tags لا تُحفظ.  
**الحل:** تشغيل `supabase/migrations/005_multi_sector.sql` في Supabase SQL Editor.

### 3.2 Resend — لم يُضبط بعد
**الحالة:** `RESEND_API_KEY` غير مُعيَّن في Vercel env variables.  
**الأثر:** لا إيميلات ترحيبية ولا تذكيرات انتهاء اشتراك.  
**الحل:**
1. أنشئ حساباً على resend.com (مجاني حتى 3000 إيميل/شهر)
2. أنشئ API key
3. أضفه في Vercel → Settings → Environment Variables
4. أضفه أيضاً في `.env.local` للتطوير المحلي

### 3.3 متغيرات البيئة — مراجعة
**تحقق أن كل هذه موجودة في Vercel:**
```env
NEXT_PUBLIC_SUPABASE_URL          ← ✅ موجود
NEXT_PUBLIC_SUPABASE_ANON_KEY     ← ✅ موجود
SUPABASE_SERVICE_ROLE_KEY         ← تحقق
NEXT_PUBLIC_ROOT_DOMAIN           ← تحقق (yourplatform.com)
RESEND_API_KEY                    ← ربما ناقص
RESEND_FROM_EMAIL                 ← ربما ناقص
NEXT_PUBLIC_WHATSAPP_NUMBER       ← تحقق
```

### 3.4 Error Boundaries
**الوضع الحالي:** لا يوجد `error.tsx` في معظم المسارات.  
**الأثر:** أي خطأ في صفحة عامة يُظهر تصميم Next.js الافتراضي.  
**الحل:** أضف `error.tsx` و `not-found.tsx` في المسارات الرئيسية.

---

## ٤. مخطط التطوير الزمني

### الأسبوع 1 (قبل أول عميل)
```
اليوم 1:  تشغيل migration 005 في Supabase
اليوم 1:  ضبط Resend (أنشئ حساب + API key + env variables)
اليوم 2-3: Landing Page للمنصة (5 أقسام أساسية)
اليوم 4:  صفحة "انتهى الاشتراك"
اليوم 5:  اختبار شامل: أنشئ مكتباً وهمياً وجرّب كل شيء
اليوم 6:  إصلاح أي مشاكل وجدتها
اليوم 7:  إطلاق
```

### الأسبوع 2-4 (مع أول 3 عملاء)
```
- جمع feedback حقيقي من العملاء
- إصلاح أي مشاكل تظهر في الاستخدام الفعلي
- إيميل الترحيب عبر Resend
- Vercel Analytics (سطر واحد)
```

### الشهر 2 (بعد 5 عملاء)
```
- نموذج التواصل في صفحة Contact
- إيميلات التذكير 30/7 أيام
- تحسين رفع الصور (ضغط)
```

### الشهر 3-4 (بعد 15 عميل)
```
- صفحة تفاصيل المشروع بقوالب كل مكتب
- Drag & Drop لترتيب المشاريع
- إحصائيات الزيارات في داشبورد المكتب
```

### الشهر 5-6 (بعد 30 عميل)
```
- Custom Domain للخطة Premium
- لوحة إحصائيات الأدمن
- نظام متعدد المستخدمين لكل مكتب
```

---

## ٥. معايير قبول الميزات الجديدة

قبل البدء في أي ميزة جديدة، اسأل هذه الأسئلة:

**✅ نعم لأيٍّ من هذه:**
- طلبها أكثر من عميل واحد؟
- تمنع إلغاء اشتراك؟
- تجلب عملاء جدد؟
- توفر أكثر من ساعتين أسبوعياً من وقتك؟

**❌ لا لأيٍّ من هذه:**
- "فكرة رائعة" لم يطلبها أحد
- ميزة تأخذ أسبوعاً وتُستخدم مرة في الشهر
- تحسين جمالي بينما يوجد مشكلة وظيفية
- ميزة تكسر التبسيط الذي يُميّز المنصة

---

## ٦. إجراءات الجودة قبل كل إصدار

### قبل كل `git push` للـ production:
```bash
# 1. TypeScript
npx tsc --noEmit

# 2. ESLint (يكتشف مشاكل Vercel Build مسبقاً)
npx eslint . --ext .ts,.tsx

# 3. Build محلي
npm run build

# 4. اختبار يدوي للـ happy path:
#    - إنشاء مكتب جديد من الأدمن
#    - تسجيل الدخول كالمكتب
#    - إضافة مشروع مع صورة
#    - زيارة الموقع العام
#    - التأكد من عرض المشروع
```

### قبل كل تعديل على قاعدة البيانات:
```
- اكتب migration جديد في supabase/migrations/00X_description.sql
- لا تعدل migration سابق
- اختبر على بيئة محلية إذا أمكن
- طبّق على Supabase SQL Editor
```

---

## ٧. هيكل الملفات المتوقع بعد التطوير الكامل

```
app/
├── (marketing)/
│   ├── page.tsx              ← Landing Page ← تحتاج بناء
│   └── layout.tsx            ← ← تحتاج بناء
├── (auth)/
│   └── login/page.tsx        ✅ جاهز
├── dashboard/
│   ├── page.tsx              ✅ جاهز
│   ├── profile/page.tsx      ✅ جاهز
│   ├── projects/page.tsx     ✅ جاهز
│   ├── theme/page.tsx        ✅ جاهز
│   ├── domain/page.tsx       ✅ جاهز
│   ├── subscription/page.tsx ✅ جاهز
│   └── services/page.tsx     ✅ جاهز
├── admin/
│   ├── page.tsx              ✅ جاهز
│   ├── tenants/              ✅ جاهز
│   ├── subscriptions/        ✅ جاهز
│   └── themes/               ✅ جاهز
└── [domain]/
    ├── page.tsx              ✅ جاهز
    ├── projects/
    │   ├── page.tsx          ✅ جاهز
    │   └── [id]/page.tsx     ✅ جاهز (تحسين: قوالب خاصة)
    ├── contact/page.tsx      ✅ جاهز
    └── expired/page.tsx      ← تحتاج بناء

components/themes/
├── ThemeRenderer.tsx         ✅ جاهز
├── ThemeProjectsRenderer.tsx ✅ جاهز
├── ThemeContactRenderer.tsx  ✅ جاهز
├── modern/ (Layout + 3 pages) ✅ جاهز
├── classic/ (Layout + 3 pages) ✅ جاهز
├── bold/ (Layout + 3 pages)  ✅ جاهز
├── minimal/ (Layout + 3 pages) ✅ جاهز
└── luxury/ (Layout + 3 pages) ✅ جاهز
```

---

## ٨. القرارات التقنية الثابتة (لا تناقشها)

| القرار | السبب |
|--------|-------|
| Next.js 14 App Router | Multi-tenant routing + SSR |
| Supabase فقط للـ DB | RLS مدمج — لا backend مخصص |
| Tailwind للقوالب العامة | لا تعتمد على shadcn خارج الداشبورد |
| TypeScript 100% | لا `any` في أي مكان |
| لا دفع إلكتروني الآن | واتساب أسرع وأبسط للمرحلة الأولى |
| لا تسجيل ذاتي | الأدمن يتحكم في كل حساب |
| الـ slug لا يتغير | يُكسر الروابط والـ SEO |
| كل query تمر بـ tenant_id | أمان مطلق — لا تسريب بيانات |

---

## ٩. التحديثات التلقائية لهذا الملف

عدّل هذا الملف في هذه الحالات:
- ✅ عند إكمال ميزة → حوّلها من "تحتاج بناء" إلى ✅ جاهز
- ✅ عند ظهور طلب عميل جديد → أضفه للأولوية المناسبة
- ✅ عند اتخاذ قرار تقني جديد → أضفه لجدول القرارات الثابتة
- ✅ عند تشغيل migration جديد → أضفه للجدول في القسم الأول

---

*آخر تحديث: مايو 2026 — الإصدار 1.0*
