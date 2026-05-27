# برومبت لتطبيق UI منصة "وجود" على أي كود Backend آخر

انسخ هذا النص وارسله لأي أداة برمجة عشان تطبق نفس الـ UI على مشروعك الجديد:

---

لدي ملفات UI كاملة من مشروع يسمى "وجود" وأريد تطبيق نفس التصميم على مشروعي الجديد. الملفات موجودة في مجلد `_ui-export`.

**هيكل الملفات:**
- `styles.css` — نظام التصميم الكامل (ألوان، خطوط، مسافات، متغيرات CSS)
- `index.html` — هيكل المشروع (CDN scripts, تحميل الملفات)
- `src/atoms.jsx` — 52 مكون UI مشترك (Btn, Input, Modal, Card, SideNav, Badge, Field, PlanPill, Avatar, EmptyState, Section, Grid...)
- `src/icons.jsx` — 45 أيقونة SVG (home, building, briefcase, settings, eye, user, logout...)
- `src/data.jsx` — البيانات الوهمية والثوابت (SECTORS, PLANS, DEMO_TENANT, DEMO_PROJECTS...)
- `src/app.jsx` — الراوتر وحالة المصادقة
- `src/supabase.jsx` — طبقة الاتصال بالباك اند (Supabase) + دالة toast
- `src/views/landing.jsx` — الصفحة الرئيسية التسويقية
- `src/views/auth.jsx` — صفحة تسجيل الدخول (نموذج بريد + كلمة مرور)
- `src/views/tenant.jsx` — داشبورد المكاتب (11 تبويب)
- `src/views/admin.jsx` — داشبورد الأدمن (6 تبويبات)
- `src/views/publicSite.jsx` — موقع المكتب العام
- `src/views/themeBuilder.jsx` — محرر القوالب
- `src/views/templates/classic.jsx` — قالب كلاسيكي
- `src/views/templates/heritage.jsx` — قالب تراثي
- `src/views/templates/luxury.jsx` — قالب فاخر
- `src/views/templates/minimal.jsx` — قالب بسيط
- `src/views/templates/studio.jsx` — قالب استوديو

---

## المطلوب:

**1. استخدم نفس نظام التصميم بالضبط:**
   - متغيرات CSS في `styles.css` (الألوان، الخطوط، الظلال، النسب...)
   - لا تغير أسماء المتغيرات (`--primary`, `--ink`, `--surface`, `--muted`, `--border`, `--bg`, `--accent`, `--sh-sm`, `--radius-sm`...)
   - استخدم نفس نظام الأيقونات (`Icons.xxx`) الموجودة في `icons.jsx`

**2. استبدل فقط طبقة الباك اند:**
   - `src/supabase.jsx` — احذف كل دوال Supabase واستبدلها بـ API خاص بمشروعك (REST, GraphQL, tRPC, Firebase...)
   - احتفظ بـ:
     - دالة `showToast` (تنبيه منبثق)
     - دوال `map*` (تحويل حقول الـ DB)
     - `Object.assign(window, {...})` لفضح الدوال للـ global scope
   - الدوال المطلوب إعادة كتابتها حسب الباك اند الجديد:
     - `sbSignIn(email, password)` — تسجيل الدخول
     - `sbSignOut()` — تسجيل الخروج
     - `sbGetSession()` — جلب الجلسة الحالية
     - `sbOnAuthChange(cb)` — الاستماع لتغيير الجلسة
     - `sbIsAdmin()` — هل المستخدم أدمن
     - `sbGetMyTenant()` — جلب بيانات المكتب الحالي
     - دوال CRUD للمشاريع، الخدمات، الإحصاءات، التوصيات، الأسئلة الشائعة
     - دوال إدارة المكاتب (للأدمن)
     - `sbUpload(bucket, path, file)` — رفع الملفات
     - `sbGetTenantBySlug(slug)` — جلب مكتب حسب slug (للمواقع العامة)

**3. حافظ على نفس المكونات (Atoms) دون تغيير:**
   - `atoms.jsx` — لا تغير أي مكون، فقط استخدمها كما هي
   - `icons.jsx` — لا تغير شيء
   - `data.jsx` — فقط حدث البيانات الوهمية (`DEMO_*`) إذا احتجت

**4. أعد كتابة الراوتر (`app.jsx`) بنفس الهيكل:**
   - استخدم نفس pushState router
   - استخدم نفس حراس الصفحات (auth guards)
   - استخدم نفس `isAdminEffective` للتحقق من نوع المستخدم
   - المسارات:
     - `/` → landing.jsx
     - `/login` → auth.jsx
     - `/dashboard` → tenant.jsx
     - `/admin` → admin.jsx
     - `/theme-builder` → themeBuilder.jsx
     - `/site/:slug` → publicSite.jsx

**5. لا تغير أي شيء في الصفحات (views):**
   - `landing.jsx`, `auth.jsx`, `tenant.jsx`, `admin.jsx`, `publicSite.jsx`, `themeBuilder.jsx`
   - كل القوالب في `templates/`
   - التغيير الوحيد المسموح: استبدال أي دالة تبدأ بـ `sb*` بالدالة الجديدة المقابلة (إذا تغير اسمها فقط)

**6. حافظ على:**
   - نفس الاتجاه RTL (من اليمين لليسار)
   - نفس الخط العربي (`var(--font-display)`, `var(--font-sans)`)
   - نفس الألوان والمسافات والظلال
   - نفس سلوك loading/empty/error states
   - نظام `sbSignOut()` للخروج يجب أن يمسح `sessionStorage('wujood_admin')` + يسجل خروج

---

## ملاحظات مهمة:
- المشروع يستخدم React 18 + Babel standalone (بدون bundler) — إذا انتقلت لـ Vite/Next.js تحتاج تحول JSX لـ .jsx عادي
- جميع المكونات global عن طريق `window.ComponentName = ComponentName`
- الدوال تتعرض عن طريق `Object.assign(window, {...})`
- الأيقونات تستخدم `React.createElement(Icons.xxx, { size: 16 })`
- الأزرار تستخدم `<Btn kind="primary" size="md">نص</Btn>`
- الـ forms تستخدم `<Field label="..."><Input ... /></Field>`
