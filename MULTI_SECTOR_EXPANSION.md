# توسيع المنصة لتشمل قطاعات متعددة

> خطة التنفيذ الكاملة — كيف نحوّل المنصة من "مكاتب هندسية" إلى منصة عامة
> تخدم أي صاحب عمل يحتاج موقعاً احترافياً يعرض فيه أعماله

---

## الفكرة الجوهرية

لا نعيد بناء شيء — البنية الحالية مرنة بالفعل.
نضيف **حقل `sector`** واحد للمستأجر، وملف إعداد مركزي يترجم كل شيء حسب القطاع.
جدول `projects` يبقى كما هو — فقط التسمية والتصنيفات تتغير حسب القطاع.

```
قطاع هندسي   → "مشاريع"    — تصنيف: سكني / تجاري / صناعي
قطاع مقاولات → "أعمالنا"   — تصنيف: بناء / تشطيب / بنية تحتية
قطاع عقاري   → "عقاراتنا"  — تصنيف: شقق / فلل / تجاري / أراضي
قطاع تصميم   → "أعمالنا"   — تصنيف: تصميم داخلي / ديكور / مطابخ
قطاع تصوير   → "معرض أعمالي" — تصنيف: زفاف / تجاري / أطفال / منتجات
```

---

## القطاعات المدعومة

| الـ sector key | الاسم العربي | نوع الأعمال المعروضة | الجمهور المستهدف |
|---------------|-------------|---------------------|-----------------|
| `engineering` | مكتب هندسي | مشاريع | أصحاب المشاريع |
| `contractor` | مقاول بناء | أعمال التشييد | أصحاب المشاريع |
| `real_estate` | مسوق عقاري | عقارات للبيع/الإيجار | مشتري ومستأجرون |
| `interior_design` | مصمم داخلي | تصاميم منفذة | أصحاب المنازل |
| `photography` | مصور | معرض صور | عملاء التصوير |
| `legal` | مكتب محاماة | الخدمات القانونية | موكلون |
| `medical` | عيادة / مركز طبي | التخصصات والخدمات | مرضى |
| `general` | نشاط تجاري عام | خدمات / منتجات | عام |

---

## أولاً: تغييرات قاعدة البيانات

### ملف: `supabase/migrations/005_multi_sector.sql`

```sql
-- =============================================
-- 005_multi_sector.sql
-- إضافة دعم القطاعات المتعددة
-- =============================================

-- 1. إضافة عمود القطاع لجدول المستأجرين
alter table tenants
  add column if not exists sector text not null default 'engineering'
    check (sector in (
      'engineering',
      'contractor',
      'real_estate',
      'interior_design',
      'photography',
      'legal',
      'medical',
      'general'
    ));

-- 2. حقول إضافية خاصة بالعقاري (اختيارية — null لبقية القطاعات)
alter table tenants
  add column if not exists whatsapp text;          -- رقم واتساب مستقل (مهم للعقاري)

-- 3. حقول إضافية للمشاريع/الأعمال
alter table projects
  add column if not exists price text;             -- السعر (للعقاري: "750,000 ريال")
alter table projects
  add column if not exists area text;              -- المساحة (للعقاري والهندسي)
alter table projects
  add column if not exists status text;            -- الحالة (للعقاري: متاح/مباع/مؤجر)
alter table projects
  add column if not exists bedrooms integer;       -- غرف النوم (للعقاري فقط)
alter table projects
  add column if not exists bathrooms integer;      -- دورات المياه (للعقاري فقط)
alter table projects
  add column if not exists tags text[];            -- وسوم حرة لكل القطاعات

-- 4. تحديث القطاع للمكاتب الموجودة مسبقاً
update tenants set sector = 'engineering' where sector is null;

-- 5. تتبع القطاع في سجل القوالب المخصصة (اختياري)
alter table custom_themes
  add column if not exists supported_sectors text[] default array['engineering','contractor','real_estate','interior_design','photography','legal','medical','general'];
```

---

## ثانياً: ملف الإعداد المركزي

### ملف جديد: `lib/sectors.ts`

```typescript
export type Sector =
  | 'engineering'
  | 'contractor'
  | 'real_estate'
  | 'interior_design'
  | 'photography'
  | 'legal'
  | 'medical'
  | 'general'

export interface SectorConfig {
  label: string                    // اسم القطاع للعرض
  portfolioLabel: string           // اسم قسم الأعمال
  portfolioItemLabel: string       // اسم العنصر المفرد
  portfolioItemLabelPlural: string // الجمع
  categories: string[]             // التصنيفات المتاحة
  extraFields: {                   // الحقول الإضافية في فورم الإضافة
    price?: boolean
    area?: boolean
    status?: boolean
    bedrooms?: boolean
    tags?: boolean
  }
  statusOptions?: string[]         // خيارات حقل الحالة (للعقاري مثلاً)
  heroTagline: string              // الشعار الافتراضي في الـ hero
  servicesLabel: string            // اسم قسم الخدمات
  featuredLabel: string            // اسم الأعمال المميزة
}

export const SECTOR_CONFIG: Record<Sector, SectorConfig> = {
  engineering: {
    label: 'مكتب هندسي',
    portfolioLabel: 'مشاريعنا',
    portfolioItemLabel: 'مشروع',
    portfolioItemLabelPlural: 'مشاريع',
    categories: ['سكني', 'تجاري', 'صناعي', 'ترفيهي', 'حكومي', 'تعليمي', 'صحي'],
    extraFields: { area: true, tags: true },
    heroTagline: 'نصمم المستقبل ونبنيه بأيدينا',
    servicesLabel: 'خدماتنا',
    featuredLabel: 'أبرز مشاريعنا',
  },

  contractor: {
    label: 'مقاول بناء',
    portfolioLabel: 'أعمالنا',
    portfolioItemLabel: 'مشروع',
    portfolioItemLabelPlural: 'مشاريع',
    categories: ['بناء وإنشاء', 'تشطيبات', 'بنية تحتية', 'ترميم', 'صيانة', 'مستودعات'],
    extraFields: { area: true, tags: true },
    heroTagline: 'نبني بجودة تدوم',
    servicesLabel: 'خدماتنا',
    featuredLabel: 'أبرز أعمالنا',
  },

  real_estate: {
    label: 'مسوق عقاري',
    portfolioLabel: 'عقاراتنا',
    portfolioItemLabel: 'عقار',
    portfolioItemLabelPlural: 'عقارات',
    categories: ['شقق', 'فلل', 'تجاري', 'أراضي', 'مكاتب', 'محلات', 'مستودعات', 'فنادق'],
    extraFields: { price: true, area: true, status: true, bedrooms: true, tags: true },
    statusOptions: ['متاح', 'مباع', 'مؤجر', 'محجوز'],
    heroTagline: 'نجد لك بيت أحلامك',
    servicesLabel: 'خدماتنا',
    featuredLabel: 'عقارات مميزة',
  },

  interior_design: {
    label: 'مصمم داخلي',
    portfolioLabel: 'أعمالنا',
    portfolioItemLabel: 'تصميم',
    portfolioItemLabelPlural: 'تصاميم',
    categories: ['غرف معيشة', 'مطابخ', 'غرف نوم', 'حمامات', 'مكاتب', 'محلات تجارية', 'فنادق'],
    extraFields: { area: true, tags: true },
    heroTagline: 'نحوّل مساحتك إلى لوحة فنية',
    servicesLabel: 'خدماتنا',
    featuredLabel: 'أبرز تصاميمنا',
  },

  photography: {
    label: 'مصور',
    portfolioLabel: 'معرض أعمالي',
    portfolioItemLabel: 'جلسة',
    portfolioItemLabelPlural: 'جلسات',
    categories: ['زفاف', 'عقيقة', 'منتجات', 'تجاري', 'طبيعة', 'بورتريه', 'معماري', 'رياضي'],
    extraFields: { tags: true },
    heroTagline: 'نجمّد اللحظات الجميلة إلى الأبد',
    servicesLabel: 'باقاتي',
    featuredLabel: 'من أحدث أعمالي',
  },

  legal: {
    label: 'مكتب محاماة',
    portfolioLabel: 'قضايانا',
    portfolioItemLabel: 'قضية',
    portfolioItemLabelPlural: 'قضايا',
    categories: ['عقود تجارية', 'قضايا عمالية', 'قضايا عائلية', 'ملكية فكرية', 'عقارات', 'جنائي'],
    extraFields: { tags: true },
    heroTagline: 'نحمي حقوقك بخبرة وأمانة',
    servicesLabel: 'تخصصاتنا',
    featuredLabel: 'انتصاراتنا القانونية',
  },

  medical: {
    label: 'عيادة / مركز طبي',
    portfolioLabel: 'حالاتنا',
    portfolioItemLabel: 'حالة',
    portfolioItemLabelPlural: 'حالات',
    categories: ['طب عام', 'أسنان', 'عيون', 'جلدية', 'نساء وولادة', 'أطفال', 'تجميل'],
    extraFields: { tags: true },
    heroTagline: 'صحتك أمانة في أيدٍ متخصصة',
    servicesLabel: 'تخصصاتنا',
    featuredLabel: 'نتائجنا',
  },

  general: {
    label: 'نشاط تجاري',
    portfolioLabel: 'أعمالنا',
    portfolioItemLabel: 'عمل',
    portfolioItemLabelPlural: 'أعمال',
    categories: ['خدمات', 'منتجات', 'مشاريع', 'أخرى'],
    extraFields: { price: true, tags: true },
    heroTagline: 'جودة لا تُنافَس في كل ما نقدم',
    servicesLabel: 'خدماتنا',
    featuredLabel: 'أبرز أعمالنا',
  },
}

export function getSectorConfig(sector: Sector | string | null): SectorConfig {
  return SECTOR_CONFIG[(sector as Sector) ?? 'general'] ?? SECTOR_CONFIG.general
}
```

---

## ثالثاً: تحديث الـ Types

### تعديل في: `types/index.ts`

```typescript
// أضف هذا النوع
export type Sector =
  | 'engineering'
  | 'contractor'
  | 'real_estate'
  | 'interior_design'
  | 'photography'
  | 'legal'
  | 'medical'
  | 'general'

// أضف هذه الحقول لـ Tenant
export interface Tenant {
  // ... الحقول الموجودة ...
  sector: Sector           // ← جديد
  whatsapp: string | null  // ← جديد
}

// أضف هذه الحقول لـ Project
export interface Project {
  // ... الحقول الموجودة ...
  price: string | null      // ← جديد (للعقاري)
  area: string | null       // ← جديد
  status: string | null     // ← جديد (للعقاري)
  bedrooms: number | null   // ← جديد (للعقاري)
  bathrooms: number | null  // ← جديد (للعقاري)
  tags: string[] | null     // ← جديد
}
```

---

## رابعاً: تعديلات الداشبورد

### 4-A: صفحة المشاريع `app/dashboard/projects/page.tsx`

```tsx
// استبدل العنوان الثابت بعنوان ديناميكي
import { getSectorConfig } from '@/lib/sectors'

const sectorCfg = getSectorConfig(tenant.sector)

return (
  <div className="space-y-6 max-w-5xl">
    <div>
      {/* كان: <h1>المشاريع</h1> */}
      <h1 className="text-2xl font-bold">{sectorCfg.portfolioLabel}</h1>
      <p className="text-gray-500 mt-1">
        {projects?.length ?? 0} / {limit} {sectorCfg.portfolioItemLabel}
      </p>
    </div>
    <ProjectsManager
      tenant={tenant}
      projects={projects}
      sectorConfig={sectorCfg}   {/* ← مرر الإعداد */}
    />
  </div>
)
```

### 4-B: مكوّن إضافة/تعديل المشروع `ProjectsManager.tsx`

```tsx
// فورم الإضافة يصبح ديناميكياً:

{/* التصنيف — يتغير حسب القطاع */}
<select name="category">
  <option value="">اختر التصنيف</option>
  {sectorConfig.categories.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>

{/* السعر — للعقاري والعام فقط */}
{sectorConfig.extraFields.price && (
  <input name="price" placeholder="مثال: 750,000 ريال" />
)}

{/* المساحة — للهندسي والعقاري والتصميم */}
{sectorConfig.extraFields.area && (
  <input name="area" placeholder="مثال: 250 م²" />
)}

{/* الحالة — للعقاري */}
{sectorConfig.extraFields.status && (
  <select name="status">
    {sectorConfig.statusOptions?.map(s => (
      <option key={s} value={s}>{s}</option>
    ))}
  </select>
)}

{/* غرف النوم — للعقاري */}
{sectorConfig.extraFields.bedrooms && (
  <input type="number" name="bedrooms" placeholder="عدد غرف النوم" />
)}
```

### 4-C: الداشبورد الجانبي `components/dashboard/Sidebar.tsx`

```tsx
import { getSectorConfig } from '@/lib/sectors'

// أضف prop للـ sector وغيّر تسمية "المشاريع"
const sectorCfg = getSectorConfig(tenant.sector)

const navItems = [
  { href: '/dashboard', label: 'الرئيسية', icon: Home },
  { href: '/dashboard/profile', label: 'معلومات المكتب', icon: Building },
  { href: '/dashboard/projects', label: sectorCfg.portfolioLabel, icon: FolderOpen }, // ← ديناميكي
  { href: '/dashboard/theme', label: 'القالب', icon: Palette },
  { href: '/dashboard/domain', label: 'الدومين', icon: Globe },
  { href: '/dashboard/subscription', label: 'الاشتراك', icon: CreditCard },
]
```

---

## خامساً: تعديلات صفحة إنشاء مكتب جديد (الأدمن)

### `app/admin/tenants/new/page.tsx` — أضف حقل القطاع

```tsx
import { SECTOR_CONFIG } from '@/lib/sectors'

{/* أضف هذا الحقل قبل الباقة */}
<div>
  <label>القطاع</label>
  <select name="sector" required>
    {Object.entries(SECTOR_CONFIG).map(([key, cfg]) => (
      <option key={key} value={key}>{cfg.label}</option>
    ))}
  </select>
  <p className="text-xs text-gray-500 mt-1">
    يحدد نوع الأعمال المعروضة والتصنيفات المتاحة — لا يمكن تغييره لاحقاً
  </p>
</div>
```

### API إنشاء المكتب `app/api/admin/tenants/route.ts`

```typescript
// أضف sector لقائمة الحقول المسموحة عند الإنشاء
const allowed = ['name_ar', 'name_en', 'slug', 'plan', 'sector', /* ... */]
```

---

## سادساً: موقع المكتب العام (القوالب)

### تمرير الـ sector config للقوالب

في `app/[domain]/page.tsx`:

```tsx
import { getSectorConfig } from '@/lib/sectors'

const sectorCfg = getSectorConfig(tenant.sector)

return (
  <ThemeRenderer
    tenant={tenant}
    projects={featuredProjects}
    services={services}
    features={features}
    customTheme={customTheme}
    sectorConfig={sectorCfg}  // ← جديد
  />
)
```

### تحديث ThemeProps في `types/index.ts`

```typescript
import { SectorConfig } from '@/lib/sectors'

export interface ThemeProps {
  tenant: Tenant
  projects: Project[]
  featuredProjects: Project[]
  services: ContentBlock[]
  features: ContentBlock[]
  customTheme?: CustomTheme | null
  sectorConfig: SectorConfig  // ← جديد
}
```

### استخدام sectorConfig داخل القوالب

```tsx
// مثال في modern/Hero.tsx
<h1>{tenant.name_ar}</h1>
<p>{tenant.bio_ar ?? sectorConfig.heroTagline}</p>

// مثال في modern/Projects.tsx
<h2>{sectorConfig.portfolioLabel}</h2>
{projects.map(project => (
  <div>
    <h3>{project.title_ar}</h3>
    {/* حقل السعر — يظهر فقط لو موجود */}
    {project.price && (
      <span className="text-primary font-bold">{project.price}</span>
    )}
    {/* حقل الحالة للعقاري */}
    {project.status && (
      <span className="badge">{project.status}</span>
    )}
    {/* غرف النوم للعقاري */}
    {project.bedrooms && (
      <span>{project.bedrooms} غرف</span>
    )}
  </div>
))}
```

---

## سابعاً: نظام القوالب المخصصة مع دعم القطاعات

### في لوحة الأدمن عند رفع قالب جديد

```tsx
{/* إضافة حقل "القطاعات المدعومة" في فورم رفع الـ ZIP */}
<div>
  <label>القطاعات التي يناسبها القالب</label>
  <div className="grid grid-cols-2 gap-2">
    {Object.entries(SECTOR_CONFIG).map(([key, cfg]) => (
      <label key={key} className="flex items-center gap-2">
        <input type="checkbox" name="sectors" value={key} defaultChecked />
        {cfg.label}
      </label>
    ))}
  </div>
</div>
```

### في صفحة اختيار القالب `app/dashboard/theme/page.tsx`

```typescript
// فلتر القوالب المخصصة ليظهر فقط ما يناسب قطاع المكتب
const suitableThemes = availableCustomThemes.filter(theme =>
  !theme.supported_sectors?.length ||
  theme.supported_sectors.includes(tenant.sector)
)
```

---

## ثامناً: حقول خاصة بالعقاري (صفحة العقار)

### في صفحة تفاصيل العقار `app/[domain]/projects/[id]/page.tsx`

```tsx
{tenant.sector === 'real_estate' && (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-xl">
    {project.bedrooms && (
      <div className="text-center">
        <p className="text-2xl font-bold">{project.bedrooms}</p>
        <p className="text-sm text-gray-500">غرف نوم</p>
      </div>
    )}
    {project.bathrooms && (
      <div className="text-center">
        <p className="text-2xl font-bold">{project.bathrooms}</p>
        <p className="text-sm text-gray-500">دورات مياه</p>
      </div>
    )}
    {project.area && (
      <div className="text-center">
        <p className="text-2xl font-bold">{project.area}</p>
        <p className="text-sm text-gray-500">المساحة</p>
      </div>
    )}
    {project.price && (
      <div className="text-center">
        <p className="text-2xl font-bold text-primary">{project.price}</p>
        <p className="text-sm text-gray-500">السعر</p>
      </div>
    )}
  </div>
)}
```

---

## تاسعاً: ترتيب التنفيذ (اتبعه بالضبط)

```
الخطوة 1 — قاعدة البيانات (15 دقيقة)
├── شغّل 005_multi_sector.sql في Supabase Dashboard
└── تحقق أن العمود sector ظهر في جدول tenants

الخطوة 2 — الـ Types والـ Sectors Config (20 دقيقة)
├── أنشئ lib/sectors.ts بالكامل من الكود أعلاه
└── عدّل types/index.ts — أضف Sector type والحقول الجديدة

الخطوة 3 — الداشبورد (30 دقيقة)
├── عدّل app/dashboard/projects/page.tsx
├── عدّل ProjectsManager لإظهار الحقول الديناميكية
├── عدّل Sidebar لتغيير تسمية المشاريع
└── عدّل صفحة profile لإظهار واتساب إن وُجد

الخطوة 4 — لوحة الأدمن (20 دقيقة)
├── أضف حقل القطاع في فورم إنشاء مكتب جديد
├── أضف عمود القطاع في جدول قائمة المكاتب
└── عدّل API إنشاء المستأجر ليقبل sector

الخطوة 5 — القوالب (30 دقيقة)
├── أضف sectorConfig لـ ThemeProps
├── عدّل ThemeRenderer لتمرير sectorConfig
└── عدّل كل قالب ليستخدم sectorConfig.portfolioLabel

الخطوة 6 — صفحة تفاصيل العقار (20 دقيقة)
└── أضف بطاقة الخصائص (غرف/مساحة/سعر) في صفحة [id]

الخطوة 7 — القوالب المخصصة (10 دقيقة)
└── أضف فلتر القطاعات في صفحة اختيار القالب
```

**الإجمالي: ~2.5 ساعة عمل**

---

## عاشراً: ما يبقى كما هو (لا تلمسه)

| العنصر | السبب |
|--------|-------|
| جدول `projects` | الحقول الموجودة عامة، أضفنا فوقها فقط |
| نظام الـ RLS | لا يتأثر بإضافة عمود |
| نظام القوالب (ZIP) | يعمل مع أي قطاع |
| نظام Supabase Storage | المسارات لا تتغير |
| نظام الاشتراكات والباقات | مستقل تماماً عن القطاع |
| الـ middleware | لا يحتاج تعديلاً |
| نظام الدومينات | لا يحتاج تعديلاً |

---

## ملاحظات مهمة

1. **القطاع لا يُغيَّر بعد الإنشاء** — تماماً مثل الـ slug، تغييره يكسر التصنيفات المحفوظة
2. **المكاتب الموجودة** — يُعيَّن لها `sector = 'engineering'` تلقائياً بعد الـ migration
3. **القالب العام يعمل مع كل القطاعات** — لأنه يقرأ `sectorConfig.portfolioLabel` ديناميكياً
4. **الحقول الإضافية** (price, area, bedrooms) — تُخزَّن في نفس جدول `projects`، null لبقية القطاعات التي لا تحتاجها
5. **SEO** — عنوان الصفحة يتغير تلقائياً: "مشاريع مكتب الفارابي" / "عقارات الأمير" / "أعمال تصوير سامي"

---

## مثال: بيانات مكتب بعد التوسع

```json
{
  "name_ar": "الأمين للعقارات",
  "slug": "al-ameen-realty",
  "sector": "real_estate",
  "plan": "pro",
  "theme": "modern",
  "whatsapp": "966501234567"
}
```

```json
{
  "title_ar": "فيلا فاخرة في حي النرجس",
  "category": "فلل",
  "price": "2,800,000 ريال",
  "area": "450 م²",
  "bedrooms": 5,
  "bathrooms": 6,
  "status": "متاح",
  "location_ar": "الرياض — حي النرجس",
  "year": 2024
}
```

---

*آخر تحديث: مايو 2026 — MULTI_SECTOR_EXPANSION.md*
