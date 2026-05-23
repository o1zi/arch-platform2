
# CLAUDE.md — منصة مواقع مكاتب الهندسة (SaaS)

> هذا الملف هو المرجع الكامل للمشروع. اقرأه بالكامل قبل أي خطوة.
> لا تخترع قرارات غير موجودة هنا. إذا واجهت موقفاً غير مغطى، اسأل أولاً.

-----

## ١. نظرة عامة على المشروع

منصة SaaS تتيح لمكاتب الهندسة إنشاء موقع خاص بهم وإدارته بأنفسهم دون أي تدخل تقني.
كل مكتب يحصل على موقع مستقل برابط/دومين خاص، يختار شكله من 5 قوالب مختلفة كلياً، ويدير محتواه من داشبورد خاص.
المنصة تدار من قِبل Super Admin (المالك) الذي يفعّل الحسابات يدوياً بعد استلام التحويل البنكي عبر واتساب.
لا يوجد نظام دفع إلكتروني — كل شيء يدوي من جهة الأدمن.

-----

## ٢. الـ Stack التقني (محسوم — لا تغيّر)

|الجزء |الأداة |السبب |
|-------------------------|---------------------------|----------------------------------|
|Framework |Next.js 14 (App Router) |Routing متعدد الـ tenants + SSR |
|Database + Auth + Storage|Supabase |RLS مدمج + Storage + Auth جاهز |
|Styling |Tailwind CSS + shadcn/ui |shadcn للداشبورد، Tailwind للقوالب|
|Hosting |Vercel |دعم Wildcard Domains + Middleware |
|Email |Resend |إيميلات تلقائية بسيطة |
|Domain Routing |Vercel + Next.js Middleware|تحديد الـ tenant من الدومين |
|Language |TypeScript |في كل مكان بدون استثناء |

-----

## ٣. هيكل المجلدات

```
/
├── app/
│ ├── (marketing)/ ← الصفحة الترويجية للمنصة نفسها
│ │ └── page.tsx
│ ├── (auth)/ ← تسجيل دخول المكاتب والأدمن
│ │ ├── login/
│ │ └── layout.tsx
│ ├── dashboard/ ← داشبورد المكتب (بعد تسجيل الدخول)
│ │ ├── layout.tsx
│ │ ├── page.tsx ← الرئيسية (إحصائيات بسيطة)
│ │ ├── profile/ ← معلومات المكتب
│ │ ├── projects/ ← إدارة المشاريع
│ │ ├── theme/ ← اختيار القالب
│ │ ├── domain/ ← معلومات الدومين
│ │ └── subscription/ ← حالة الاشتراك
│ ├── admin/ ← داشبورد الأدمن (Super Admin فقط)
│ │ ├── layout.tsx
│ │ ├── page.tsx ← لوحة التحكم الرئيسية
│ │ ├── tenants/ ← إدارة المكاتب
│ │ │ ├── page.tsx ← قائمة كل المكاتب
│ │ │ ├── new/ ← إضافة مكتب جديد
│ │ │ └── [id]/ ← تفاصيل وتعديل مكتب
│ │ └── subscriptions/ ← متابعة الاشتراكات
│ └── [domain]/ ← موقع المكتب العام (يتحدد بالدومين)
│ ├── layout.tsx
│ ├── page.tsx ← الصفحة الرئيسية
│ ├── projects/ ← معرض المشاريع
│ └── contact/ ← التواصل
├── components/
│ ├── ui/ ← shadcn components (لا تعدل عليها)
│ ├── dashboard/ ← مكونات داشبورد المكتب
│ ├── admin/ ← مكونات داشبورد الأدمن
│ └── themes/ ← القوالب الـ 5
│ ├── modern/
│ │ ├── Layout.tsx
│ │ ├── Hero.tsx
│ │ ├── Projects.tsx
│ │ └── Contact.tsx
│ ├── classic/
│ ├── bold/
│ ├── minimal/
│ └── luxury/
├── lib/
│ ├── supabase/
│ │ ├── client.ts ← Supabase client (browser)
│ │ ├── server.ts ← Supabase client (server)
│ │ └── middleware.ts ← Supabase middleware helper
│ ├── tenant.ts ← دوال تحديد الـ tenant من الدومين
│ └── utils.ts
├── middleware.ts ← تحديد الـ tenant من كل request
├── types/
│ └── index.ts ← كل الـ TypeScript types
└── supabase/
└── migrations/ ← ملفات SQL للـ schema
```

-----

## ٤. قاعدة البيانات (Schema كامل)

### جدول: tenants (المكاتب)

```sql
create table tenants (
id uuid primary key default gen_random_uuid(),

-- معلومات الحساب
name_ar text not null, -- اسم المكتب بالعربي
name_en text, -- اسم المكتب بالإنجليزي (اختياري)
slug text unique not null, -- alfarabi (للـ subdomain)
custom_domain text unique, -- alfarabi-eng.com (لو عنده دومين خاص)
-- معلومات المكتب
logo_url text,
cover_url text,
bio_ar text, -- نبذة بالعربي
bio_en text,
phone text,
email text,
address_ar text,
address_en text,
google_maps_url text,
-- السوشيال ميديا
instagram_url text,
twitter_url text,
linkedin_url text,
snapchat_url text,
-- الإعدادات
theme text not null default 'modern'
check (theme in ('modern','classic','bold','minimal','luxury')),
is_active boolean not null default false, -- يفعّله الأدمن يدوياً

-- الاشتراك
plan text not null default 'basic'
check (plan in ('basic','pro','premium')),
subscription_start date,
subscription_end date,

-- نظام
created_at timestamptz default now(),
updated_at timestamptz default now()
);
```

### جدول: tenant_users (ربط المكتب بمستخدم Supabase Auth)

```sql
create table tenant_users (
id uuid primary key default gen_random_uuid(),
tenant_id uuid references tenants(id) on delete cascade,
user_id uuid references auth.users(id) on delete cascade,
role text not null default 'owner'
check (role in ('owner', 'editor')),
created_at timestamptz default now(),
unique(tenant_id, user_id)
);
```

### جدول: projects (المشاريع)

```sql
create table projects (
id uuid primary key default gen_random_uuid(),
tenant_id uuid references tenants(id) on delete cascade,

title_ar text not null,
title_en text,
description_ar text,
description_en text,
category text, -- سكني / تجاري / صناعي / ترفيهي
location_ar text,
year integer,
cover_image_url text,
sort_order integer default 0, -- ترتيب العرض
is_featured boolean default false, -- يظهر في الصفحة الرئيسية

created_at timestamptz default now(),
updated_at timestamptz default now()
);
```

### جدول: project_images (صور المشاريع)

```sql
create table project_images (
id uuid primary key default gen_random_uuid(),
project_id uuid references projects(id) on delete cascade,
tenant_id uuid references tenants(id) on delete cascade,
url text not null,
sort_order integer default 0,
created_at timestamptz default now()
);
```

### جدول: admin_users (حسابات السوبر أدمن)

```sql
create table admin_users (
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id) on delete cascade,
created_at timestamptz default now()
);
```

### جدول: subscription_logs (سجل الاشتراكات)

```sql
create table subscription_logs (
id uuid primary key default gen_random_uuid(),
tenant_id uuid references tenants(id) on delete cascade,
action text not null, -- activated / renewed / suspended / cancelled
plan text,
amount numeric,
notes text, -- ملاحظات الأدمن (رقم التحويل مثلاً)
performed_by uuid references auth.users(id),
created_at timestamptz default now()
);
```

-----

## ٥. Row Level Security (RLS)

تفعيل RLS على كل الجداول بدون استثناء.

### قواعد tenants:

- المكتب يقرأ ويعدل tenant_id الخاص فقط
- الأدمن يقرأ ويعدل كل شيء
- الزوار (بدون تسجيل دخول) يقرأون فقط المكاتب النشطة (is_active = true)

### قواعد projects و project_images:

- المكتب يقرأ ويعدل ويحذف مشاريعه فقط (tenant_id = tenant_id الخاص)
- الزوار يقرأون مشاريع المكاتب النشطة فقط
- الأدمن يقرأ كل شيء

### التحقق من الأدمن:

```sql
-- دالة مساعدة
create or replace function is_admin()
returns boolean as $$
select exists (
select 1 from admin_users
where user_id = auth.uid()
);
$$ language sql security definer;
```

-----

## ٦. نظام الـ Multi-tenant Routing

### كيف يشتغل:

كل request يمر عبر `middleware.ts` → يحدد الـ tenant من الدومين → يضيف `tenant_id` في الـ headers.

```
alfarabi.yourplatform.com → slug = "alfarabi"
alfarabi-eng.com → custom_domain = "alfarabi-eng.com"
yourplatform.com → marketing page أو dashboard
yourplatform.com/admin → admin dashboard
```

### middleware.ts (المنطق الأساسي):

- إذا الـ hostname = `yourplatform.com` أو `www.yourplatform.com` → اتركه يكمل طبيعي
- إذا الـ hostname يحتوي على `.yourplatform.com` → استخرج الـ slug
- أي دومين آخر → ابحث في `custom_domain`
- أضف `x-tenant-slug` أو `x-tenant-domain` في الـ request headers
- صفحات الـ dashboard و admin → تحقق من تسجيل الدخول

### ملف `lib/tenant.ts`:

دوال للاستخدام في الـ server components:

- `getTenantBySlug(slug)` ← يجيب بيانات المكتب من Supabase
- `getTenantByDomain(domain)` ← نفس الشيء لكن بالدومين الخاص
- `getTenantFromRequest(headers)` ← يقرأ الـ header اللي حطه الـ middleware

-----

## ٧. نظام القوالب الـ 5

### المبدأ:

كل قالب = مجلد كامل من الـ components. نفس الـ props لكل القوالب — فقط الشكل يختلف.

### الـ Props المشتركة لكل قالب:

```typescript
interface ThemeProps {
tenant: Tenant; // بيانات المكتب كاملة
projects: Project[]; // المشاريع مع صورها
featuredProjects: Project[]; // المشاريع المميزة للصفحة الرئيسية
}
```

### ThemeRenderer (المكوّن الرئيسي):

```typescript
// components/themes/ThemeRenderer.tsx
const themes = {
modern: ModernLayout,
classic: ClassicLayout,
bold: BoldLayout,
minimal: MinimalLayout,
luxury: LuxuryLayout,
}

export function ThemeRenderer({ tenant, projects }: ThemeProps) {
const Layout = themes[tenant.theme] ?? themes.modern;
return <Layout tenant={tenant} projects={projects} />;
}
```

### تفاصيل كل قالب:

#### Modern (عصري)

- ألوان: أبيض + أسود + لون accent واحد (أزرق أو أخضر)
- خط: حديث geometric
- Layout: Full-width hero، grid للمشاريع، header شفاف يتحول عند الـ scroll
- مزاج: تقني، نظيف، احترافي

#### Classic (كلاسيكي)

- ألوان: كريمي + بني داكن + ذهبي
- خط: Serif للعناوين
- Layout: Centered، sidebar للتنقل، بوردرات ناعمة
- مزاج: راسخ، موثوق، تقليدي راقي

#### Bold (جريء)

- ألوان: أسود + لون واحد صارخ (أحمر أو برتقالي)
- خط: عريض وكبير جداً
- Layout: Full-screen sections، حركة عند الـ scroll، مشاريع بأحجام غير منتظمة
- مزاج: قوي، مبدع، جريء

#### Minimal (بسيط)

- ألوان: أبيض فقط + رمادي فاتح + نص أسود
- خط: خفيف وصغير
- Layout: مساحات بيضاء كبيرة، قائمة بسيطة للمشاريع، لا زخرفة
- مزاج: هادئ، راقي، مركّز

#### Luxury (فاخر)

- ألوان: أسود + ذهبي + رمادي داكن
- خط: Serif أنيق
- Layout: Full-screen، animations بطيئة وناعمة، صور كبيرة
- مزاج: حصري، فاخر، راقي جداً

-----

## ٨. داشبورد المكتب (كل الصفحات)

### الصفحة الرئيسية `/dashboard`

- مرحبا + اسم المكتب
- بطاقات سريعة: عدد المشاريع، القالب الحالي، حالة الاشتراك، تاريخ الانتهاء
- زر “زيارة موقعي” يفتح الموقع في تاب جديد
- تحذير بارز لو الاشتراك ينتهي خلال 30 يوم

### صفحة المعلومات `/dashboard/profile`

حقول التعديل:

- الشعار (رفع صورة — Supabase Storage)
- صورة الغلاف (رفع صورة)
- اسم المكتب (عربي + إنجليزي)
- النبذة التعريفية (عربي + إنجليزي) — textarea
- رقم الجوال
- البريد الإلكتروني
- العنوان (عربي + إنجليزي)
- رابط Google Maps
- روابط السوشيال ميديا (انستقرام، تويتر/X، لينكدإن، سناب)
- زر حفظ واحد للكل

### صفحة المشاريع `/dashboard/projects`

**قائمة المشاريع:**

- جدول يعرض: اسم المشروع، التصنيف، السنة، مميّز؟، إجراءات (تعديل/حذف)
- زر “مشروع جديد”
- Drag & Drop لإعادة الترتيب

**إضافة/تعديل مشروع (Modal أو صفحة):**

- اسم المشروع (عربي + إنجليزي)
- الوصف (عربي + إنجليزي) — textarea
- التصنيف: سكني / تجاري / صناعي / ترفيهي / حكومي / تعليمي
- الموقع (نص حر)
- سنة التنفيذ
- مميّز؟ (toggle — يظهر في الصفحة الرئيسية)
- صورة الغلاف (رفع + معاينة)
- معرض الصور (رفع متعدد + إعادة ترتيب + حذف)
- زر حفظ

**حدود الباقات:**

- basic: 10 مشاريع كحد أقصى
- pro: 30 مشروع
- premium: غير محدود

### صفحة القالب `/dashboard/theme`

- عرض الـ 5 قوالب كـ cards مع:
- صورة preview (screenshot ثابت لكل قالب)
- اسم القالب
- وصف قصير للمزاج
- زر “اختر هذا القالب”
- badge “الحالي” على المختار
- تغيير القالب فوري بدون إعادة تحميل الصفحة
- ملاحظة: اختيار القوالب المتاح حسب الباقة:
- basic: قالب واحد فقط (modern)
- pro + premium: كل الـ 5 قوالب

### صفحة الدومين `/dashboard/domain`

- عرض رابط الـ subdomain الحالي: `slug.yourplatform.com`
- زر نسخ الرابط
- قسم “دومين خاص” (للباقة premium فقط):
- حقل لإدخال الدومين
- تعليمات خطوة بخطوة لإعداد الـ CNAME
- حالة التحقق (pending / verified / error)
- للباقات basic و pro: رسالة “الدومين الخاص متاح في باقة متقدمة”

### صفحة الاشتراك `/dashboard/subscription`

- الباقة الحالية مع مميزاتها
- تاريخ الانتهاء مع عداد الأيام المتبقية
- تاريخ آخر تجديد
- تعليمات التجديد: “للتجديد تواصل معنا على واتساب: [رقم الواتساب]”
- زر واتساب مباشر يفتح محادثة جاهزة بالنص
- سجل الاشتراكات السابقة (جدول)

-----

## ٩. داشبورد الأدمن (كل الصفحات)

### حماية المسار:

- `/admin/*` محمي بـ middleware يتحقق من وجود الـ user في جدول `admin_users`
- إذا لم يكن أدمن → redirect إلى `/login`
- حساب الأدمن يُنشأ يدوياً مباشرة في Supabase

### الصفحة الرئيسية `/admin`

- إحصائيات: إجمالي المكاتب، المكاتب النشطة، الاشتراكات المنتهية، الاشتراكات تنتهي خلال 30 يوم
- قائمة الاشتراكات المنتهية قريباً (تحتاج متابعة)
- آخر المكاتب المضافة

### صفحة المكاتب `/admin/tenants`

**جدول كامل يعرض:**

- اسم المكتب
- الـ slug والدومين
- الباقة
- حالة الاشتراك (نشط / منتهي / موقوف)
- تاريخ الانتهاء
- إجراءات سريعة

**فلترة وبحث:**

- بحث بالاسم أو الـ slug
- فلتر بالحالة (كل / نشط / منتهي / موقوف)
- فلتر بالباقة

### صفحة إضافة مكتب `/admin/tenants/new`

حقول إلزامية:

- اسم المكتب (عربي)
- الـ slug (يُولّد تلقائياً من الاسم، قابل للتعديل)
- البريد الإلكتروني لتسجيل الدخول
- كلمة المرور المؤقتة
- الباقة
- تاريخ بداية الاشتراك
- تاريخ نهاية الاشتراك
- ملاحظة (رقم التحويل، اسم المحوّل)

عند الحفظ:

1. ينشئ user في Supabase Auth
1. ينشئ tenant في جدول tenants
1. يربط في tenant_users
1. يضيف سجل في subscription_logs
1. يرسل إيميل ترحيب للمكتب (Resend)

### صفحة تفاصيل المكتب `/admin/tenants/[id]`

- كل معلومات المكتب (قراءة فقط + زر تعديل)
- إجراءات الاشتراك:
- تفعيل الحساب
- تجديد الاشتراك (يحدد تاريخ جديد + يضيف ملاحظة)
- تغيير الباقة
- إيقاف الحساب مؤقتاً
- حذف المكتب (مع تأكيد)
- سجل كل إجراءات الاشتراك
- إحصائيات: عدد المشاريع، القالب المستخدم

-----

## ١٠. موقع المكتب العام

### كيف يُحدَّد المكتب:

الـ middleware يقرأ الدومين → يضع `x-tenant-id` في الـ headers → الـ layout يجيب بيانات المكتب.

### صفحات موقع المكتب:

**الصفحة الرئيسية `/`:**

- Hero section: اسم المكتب، النبذة، الشعار
- المشاريع المميزة (is_featured = true) — أحدث 6
- معلومات التواصل السريعة

**صفحة المشاريع `/projects`:**

- كل المشاريع مع فلتر بالتصنيف
- كل مشروع: صورة الغلاف، الاسم، التصنيف، السنة، زر “التفاصيل”

**صفحة تفاصيل المشروع `/projects/[id]`:**

- معرض الصور (lightbox)
- كل تفاصيل المشروع

**صفحة التواصل `/contact`:**

- رقم الجوال (قابل للنقر)
- البريد الإلكتروني
- العنوان
- خريطة Google Maps مدمجة
- روابط السوشيال ميديا

### دعم اللغتين:

- المحتوى يُعرض بالعربي إذا توفر، وإلا بالإنجليزي
- اتجاه الصفحة RTL للعربي، LTR للإنجليزي
- لا يوجد زر تبديل لغة في هذه المرحلة — يُعرض العربي دائماً إذا متوفر

-----

## ١١. نظام الصور (Supabase Storage)

### Buckets:

```
tenant-logos/ ← شعارات المكاتب (عامة)
tenant-covers/ ← صور غلاف المكاتب (عامة)
project-covers/ ← صور غلاف المشاريع (عامة)
project-images/ ← معارض صور المشاريع (عامة)
```

### مسار الملفات:

```
tenant-logos/{tenant_id}/logo.{ext}
project-covers/{tenant_id}/{project_id}/cover.{ext}
project-images/{tenant_id}/{project_id}/{image_id}.{ext}
```

### حدود الصور:

- الشعار: حد أقصى 2MB، يُقبل PNG/JPG/SVG/WebP
- صور المشاريع: حد أقصى 10MB لكل صورة
- عدد الصور لكل مشروع: 20 صورة كحد أقصى

### حدود التخزين بالباقة:

- basic: 500MB
- pro: 2GB
- premium: 10GB

-----

## ١٢. نظام الإيميلات (Resend)

### إيميلات تلقائية:

|الحدث |المستلم|المحتوى |
|-------------------|-------|--------------------------------------|
|إنشاء حساب جديد |المكتب |ترحيب + بيانات الدخول + رابط الداشبورد|
|تفعيل الحساب |المكتب |إشعار التفعيل + رابط الموقع |
|تجديد الاشتراك |المكتب |تأكيد التجديد + تاريخ الانتهاء الجديد |
|إيقاف الحساب |المكتب |إشعار الإيقاف + تعليمات التجديد |
|30 يوم قبل الانتهاء|المكتب |تذكير بالتجديد + رابط واتساب |
|7 أيام قبل الانتهاء|المكتب |تذكير عاجل |

-----

## ١٣. الباقات وحدودها

```typescript
const PLAN_LIMITS = {
basic: {
projects: 10,
storage_mb: 500,
themes: ['modern'], // قالب واحد فقط
custom_domain: false,
price_sar: 1200,
},
pro: {
projects: 30,
storage_mb: 2048,
themes: ['modern','classic','bold','minimal','luxury'],
custom_domain: false,
price_sar: 2000,
},
premium: {
projects: Infinity,
storage_mb: 10240,
themes: ['modern','classic','bold','minimal','luxury'],
custom_domain: true,
price_sar: 3500,
},
}
```

-----

## ١٤. حالات الحساب

|الحالة|is_active|subscription_end|ما يحدث |
|------|---------|----------------|--------------------------------------------------------|
|نشط |true |في المستقبل |كل شيء يعمل |
|منتهي |true |في الماضي |الموقع يظهر صفحة “انتهى الاشتراك” + الداشبورد يظهر تحذير|
|موقوف |false |أي قيمة |الموقع لا يظهر (404) + الداشبورد يظهر رسالة إيقاف |

-----

## ١٥. أمان وصلاحيات

|المستخدم |ما يقدر يفعل |
|---------|-------------------------------------------------|
|زائر |يشوف موقع المكاتب النشطة فقط |
|صاحب مكتب|يدير بيانات مكتبه فقط — لا يرى أي بيانات مكتب آخر|
|أدمن |يرى ويعدل كل شيء |

### قواعد إضافية:

- لا يمكن لصاحب المكتب تجاوز حدود باقته (يُمنع في الـ API)
- كل upload للصور يتحقق من `tenant_id` قبل الحفظ
- الـ slug لا يمكن تغييره بعد الإنشاء (يُكسر الروابط)
- الحذف من الداشبورد = soft delete في المشاريع (أضف عمود `deleted_at`)

-----

## ١٦. ترتيب البناء (اتبعه بدقة)

```
المرحلة ١: الأساس
├── إعداد Supabase (schema + RLS + storage buckets)
├── إعداد Next.js + Tailwind + shadcn
├── نظام Auth (تسجيل دخول + حماية المسارات)
└── Middleware الـ tenant routing

المرحلة ٢: داشبورد المكتب
├── صفحة المعلومات (profile)
├── رفع الشعار والغلاف
├── إدارة المشاريع (CRUD كامل)
└── رفع الصور

المرحلة ٣: القوالب
├── ThemeRenderer
├── قالب Modern (كامل)
├── قالب Classic
├── قالب Bold
├── قالب Minimal
└── قالب Luxury

المرحلة ٤: داشبورد الأدمن
├── قائمة المكاتب
├── إضافة مكتب جديد
├── تفعيل / تجديد / إيقاف
└── سجل الاشتراكات

المرحلة ٥: التكميل
├── صفحة القالب في داشبورد المكتب
├── صفحة الدومين
├── إيميلات Resend
└── صفحة "انتهى الاشتراك"
```

-----

## ١٧. متغيرات البيئة المطلوبة

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# الموقع
NEXT_PUBLIC_ROOT_DOMAIN=yourplatform.com

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@yourplatform.com

# واتساب (رقم التواصل للتجديد)
NEXT_PUBLIC_WHATSAPP_NUMBER=966XXXXXXXXX
```

-----

## ١٨. قرارات محسومة (لا تناقشها — نفّذها)

- اللغة الافتراضية: **العربي** (RTL)
- لا يوجد تسجيل ذاتي — الأدمن فقط ينشئ الحسابات
- لا يوجد دفع إلكتروني — كل شيء يدوي
- الـ slug لا يتغير بعد الإنشاء
- كل الـ queries تمر عبر `tenant_id` — لا استثناء
- shadcn للداشبورد فقط — القوالب الخمسة تُبنى بـ Tailwind مباشرة
- TypeScript في كل مكان — لا `any`
- كل صورة تُرفع عبر Supabase Storage — لا روابط خارجية مباشرة

-----

## ١٩. ما لا يُبنى الآن (مراحل مستقبلية)

- نظام دفع إلكتروني
- تبديل لغة للزوار
- تحليلات الزيارات
- نموذج تواصل داخل موقع المكتب
- تطبيق جوال
- API عام

-----

*آخر تحديث: نسخة 1.0 — ابدأ دائماً بالمرحلة ١*