# دليل بناء القوالب الاحترافية — Theme Builder Guide v3.0

> **هذا الدليل هو المرجع الكامل لبناء قوالب خرافية.**  
> كل خيار موثق هنا مُطبَّق فعلياً في محرك القوالب.  
> اقرأ القسم المناسب وابنِ ما تريد.

---

## نظرة عامة على المحرك

القالب = ملف `theme.json` يُعبّأ بالإعدادات البصرية.  
المحرك يقرأ هذا الملف ويبني الموقع كاملاً تلقائياً — بدون كود.

```
theme.json
    ↓
DynamicThemeEngine
    ↓
┌──────────┬──────────────┬──────────────┬────────────┐
│الرئيسية │ المشاريع     │ تفاصيل مشروع │  التواصل   │
└──────────┴──────────────┴──────────────┴────────────┘
```

**الأقسام القابلة للتخصيص في الرئيسية:**
```
hero → about → services → projects → features → cta → footer
(مرتّبة كما تريد، أو احذف ما لا تريده)
```

---

## هيكل ملف theme.json الكامل

```json
{
  "name_ar": "اسم القالب",
  "name_en": "Theme Name",
  "description_ar": "وصف قصير للطابع والمزاج",

  "colors":       { ... },
  "fonts":        { ... },
  "hero":         { ... },
  "layout":       { ... },
  "navigation":   { ... },
  "cards":        { ... },
  "buttons":      { ... },
  "projectsGrid": { ... },
  "sections":     { ... },
  "effects":      { ... },
  "decorations":  { ... },
  "contactStyle": { ... },
  "visualPreset": { ... }
}
```

---

## ١. الألوان — `colors`

```json
"colors": {
  "primary":         "#0f0f0f",
  "secondary":       "#1a1a1a",
  "accent":          "#c9a84c",
  "accentSecondary": "#e8c87a",
  "background":      "#f8f5f0",
  "text":            "#1a1a1a",
  "textLight":       "#888888",
  "cardBg":          "#f0ece6",
  "border":          "#e0d8ce",
  "navBg":           "#0a0a0a",
  "navText":         "#ffffff"
}
```

| الحقل | أين يُستخدم | إلزامي؟ |
|-------|-------------|---------|
| `primary` | Nav، Hero، Footer، خلفية الأقسام الداكنة | ✅ |
| `secondary` | بطاقات الخدمات، أقسام متبادلة | ✅ |
| `accent` | الأزرار، الأيقونات، التسميات المميزة | ✅ |
| `accentSecondary` | التدرجات (gradient buttons/CTA) | ❌ افتراضي: نفس accent |
| `background` | الخلفية الرئيسية والأقسام الفاتحة | ✅ |
| `text` | النص الرئيسي في كل الصفحات | ✅ |
| `textLight` | النصوص الثانوية والأوصاف | ✅ |
| `cardBg` | خلفية بطاقات الخدمات والمميزات | ❌ افتراضي: secondary |
| `border` | الحدود والخطوط الفاصلة | ❌ افتراضي: مشتق من primary |
| `navBg` | خلفية شريط التنقل فقط | ❌ افتراضي: primary |
| `navText` | نصوص التنقل والأزرار عليه | ❌ افتراضي: background |

### قواعد الألوان:
- صيغة HEX فقط: `#rrggbb` أو `#rgb`
- `accent` يجب أن يتباين مع كل من `primary` و `background`
- `primary` داكن + `background` فاتح = أفضل قراءة

### أمثلة لوحات ألوان جاهزة:

```json
// ── الذهب الفاخر
{ "primary":"#0a0a0a", "secondary":"#141414", "accent":"#c9a84c", "accentSecondary":"#e8c87a", "background":"#fafaf8", "text":"#1a1a1a", "textLight":"#888" }

// ── الأزرق المعماري
{ "primary":"#0d1b2a", "secondary":"#1b2a3b", "accent":"#4e8cff", "background":"#f0f4ff", "text":"#0d1b2a", "textLight":"#6b7a99" }

// ── الأحمر الياباني
{ "primary":"#17120e", "secondary":"#231c16", "accent":"#d14d41", "background":"#f8f2ea", "text":"#1f1a15", "textLight":"#80766e" }

// ── الأخضر الطبيعي
{ "primary":"#1a2a1a", "secondary":"#243524", "accent":"#6aaa5c", "background":"#f4f9f2", "text":"#1a2a1a", "textLight":"#6b8060" }

// ── الفضي المعاصر
{ "primary":"#1c1c1e", "secondary":"#2c2c2e", "accent":"#aeaeb2", "background":"#f2f2f7", "text":"#1c1c1e", "textLight":"#8e8e93" }

// ── الوردي العصري
{ "primary":"#1a0a14", "secondary":"#2a1020", "accent":"#e8508a", "accentSecondary":"#f094c0", "background":"#fff8fb", "text":"#1a0a14", "textLight":"#88506a" }
```

---

## ٢. الخطوط — `fonts`

```json
"fonts": {
  "heading": "Playfair Display",
  "body":    "Tajawal",
  "headingWeight": 700,
  "bodyWeight":    400,
  "bodySize":      "md",
  "letterSpacing": "normal",
  "lineHeight":    "relaxed",
  "uppercase":     false
}
```

| الحقل | القيم المتاحة | الافتراضي |
|-------|-------------|-----------|
| `heading` | أي خط من Google Fonts | — |
| `body` | أي خط من Google Fonts | — |
| `headingWeight` | `400` `600` `700` `800` `900` | `700` |
| `bodyWeight` | `300` `400` `500` | `400` |
| `bodySize` | `"sm"` `"md"` `"lg"` | `"md"` |
| `letterSpacing` | `"tight"` `"normal"` `"wide"` `"wider"` | `"normal"` |
| `lineHeight` | `"tight"` `"normal"` `"relaxed"` `"loose"` | `"relaxed"` |
| `uppercase` | `true` `false` | `false` |

### خطوط عربية موصى بها:
```
Tajawal          ← بسيط وعصري — الأكثر انتشاراً
Cairo            ← واضح ومقروء جداً
Almarai          ← احترافي مؤسسي
Noto Kufi Arabic ← كوفي تقليدي أنيق
Amiri            ← فاخر كلاسيكي للعناوين
El Messiri       ← حديث ومميز
IBM Plex Arabic  ← تقني ونظيف
```

### خطوط عناوين إنجليزية موصى بها (للعلامات التجارية):
```
Playfair Display ← فاخر كلاسيكي
Cormorant Garamond ← أناقة طويلة
Montserrat       ← هندسي معاصر
Raleway          ← خفيف وأنيق
Bebas Neue       ← جريء وقوي
DM Serif Display ← مميز وعصري
Cinzel           ← روماني فخم
```

### تركيبات ناجحة:
```json
{ "heading": "Cormorant Garamond", "body": "Tajawal", "headingWeight": 700, "uppercase": false }
{ "heading": "Bebas Neue", "body": "Cairo", "headingWeight": 400, "uppercase": true, "letterSpacing": "wide" }
{ "heading": "Amiri", "body": "Amiri", "headingWeight": 700, "lineHeight": "loose" }
{ "heading": "Montserrat", "body": "Almarai", "headingWeight": 900, "letterSpacing": "tight" }
```

---

## ٣. الـ Hero — `hero`

```json
"hero": {
  "style":              "fullscreen",
  "height":             "screen",
  "overlayOpacity":     0.55,
  "overlayStyle":       "gradient",
  "textAlign":          "right",
  "showLogo":           true,
  "ctaPrimaryText":     "استعرض مشاريعنا",
  "ctaSecondaryText":   "تواصل معنا",
  "ctaStyle":           "solid",
  "tagOverride":        "مكتب هندسي معماري",
  "showScrollIndicator": true
}
```

### `style` — أسلوب الـ Hero (6 أساليب):

| القيمة | الوصف |
|--------|-------|
| `"fullscreen"` | صورة كاملة + تدرج لوني + نص في الأسفل |
| `"cinematic"` | مثل fullscreen لكن بحجم ضخم وتأثير سينمائي |
| `"split"` | نصف نص + نصف صورة (نص يمين) |
| `"split-reverse"` | نصف نص + نصف صورة (صورة يمين) |
| `"centered"` | كل شيء في المنتصف فوق الصورة |
| `"minimal"` | نص فقط بدون صورة خلفية — بسيط وفاخر |

### `height` — ارتفاع الـ Hero:
| القيمة | الارتفاع |
|--------|---------|
| `"half"` | 55% من الشاشة |
| `"screen"` | 100% من الشاشة (افتراضي) |
| `"tall"` | 100vh كامل مع padding إضافي |

### `overlayStyle` — نمط الطبقة الداكنة فوق الصورة:
| القيمة | التأثير |
|--------|---------|
| `"gradient"` | تدرج من الأسفل للأعلى (افتراضي) |
| `"flat"` | طبقة سوداء موحدة |
| `"radial"` | ظلام من الأطراف للمركز |
| `"vignette"` | تأثير vignette كلاسيكي |
| `"diagonal"` | تدرج بزاوية 135 درجة |

### `ctaStyle` — شكل الأزرار في الـ Hero:
```
"solid"    ← زر ملون معتم (افتراضي)
"outline"  ← زر بحد شفاف
"ghost"    ← زر بدون خلفية
"gradient" ← زر بتدرج accent → accentSecondary
```

---

## ٤. التخطيط العام — `layout`

```json
"layout": {
  "borderRadius": "md",
  "spacing":      "normal",
  "maxWidth":     "normal",
  "sections":     ["hero", "about", "services", "projects", "features", "cta", "footer"]
}
```

### `borderRadius` — حواف كل العناصر:
| القيمة | التأثير |
|--------|---------|
| `"none"` | حواف حادة 90° — معماري وقوي |
| `"sm"` | حواف ناعمة جداً 4px |
| `"md"` | حواف متوسطة 8px (الافتراضي) |
| `"lg"` | حواف دائرية 16px |
| `"full"` | دائري تماماً (للأزرار والشعارات) |

### `spacing` — المسافات بين الأقسام:
| القيمة | الـ padding العمودي |
|--------|---------------------|
| `"compact"` | 48px — مكثف |
| `"normal"` | 80px — متوازن |
| `"spacious"` | 112px — فاخر ومتسع |

### `maxWidth` — أقصى عرض للمحتوى:
| القيمة | العرض |
|--------|-------|
| `"narrow"` | 896px — للمحتوى الطويل |
| `"normal"` | 1280px (افتراضي) |
| `"wide"` | 1536px — للتصاميم الكاملة |
| `"full"` | بلا حد — يمتد للحافة |

### `sections` — ترتيب الأقسام وإظهارها:
```json
// الترتيب الكامل
["hero", "about", "services", "projects", "features", "cta", "footer"]

// محرك صور فقط
["hero", "projects", "cta", "footer"]

// تركيز على الخدمات
["hero", "services", "features", "about", "cta", "footer"]

// بسيط جداً
["hero", "projects", "footer"]
```
> ⚠️ `"hero"` دائماً أول وإلزامي

---

## ٥. شريط التنقل — `navigation`

```json
"navigation": {
  "style":      "solid",
  "height":     "normal",
  "position":   "sticky",
  "showBorder": false,
  "logoSize":   "md",
  "ctaInNav":   false
}
```

| الحقل | القيم | الافتراضي |
|-------|-------|-----------|
| `style` | `"solid"` `"transparent"` `"blur"` `"glass"` `"bordered"` | `"solid"` |
| `height` | `"compact"` `"normal"` `"tall"` | `"normal"` |
| `position` | `"sticky"` `"fixed"` `"static"` | `"sticky"` |
| `showBorder` | `true` `false` | `false` |
| `logoSize` | `"sm"` `"md"` `"lg"` | `"md"` |
| `ctaInNav` | `true` `false` | `false` |

### `style` — مظهر الـ Nav:
```
"solid"       ← خلفية معتمة ثابتة (navBg)
"transparent" ← شفاف في الـ Hero يتحول لـ solid عند الـ scroll
"blur"        ← glassmorphism مع blur عند الـ scroll
"glass"       ← glassmorphism دائم
"bordered"    ← solid مع خط سفلي بلون accent
```

---

## ٦. البطاقات — `cards`

```json
"cards": {
  "style":       "elevated",
  "padding":     "normal",
  "iconShape":   "square",
  "accentBar":   "right",
  "hoverEffect": "lift",
  "showNumber":  false
}
```

### `style` — مظهر البطاقات:
| القيمة | الوصف |
|--------|-------|
| `"flat"` | بدون ظل أو حد — بسيط تماماً |
| `"elevated"` | ظل خفيف يعطي عمقاً (افتراضي) |
| `"bordered"` | حد خارجي بلون border |
| `"glass"` | glassmorphism — backdrop-filter blur |
| `"filled"` | خلفية بلون primary |
| `"ghost"` | بدون خلفية — نص فقط |

### `iconShape` — شكل مربع الأيقونة:
```
"circle"  ← دائري
"square"  ← مربع (افتراضي)
"rounded" ← مربع بحواف ناعمة
"diamond" ← معيّن (مدوّر 45°)
"none"    ← بدون مربع — الأيقونة مباشرة
```

### `accentBar` — شريط ملون على البطاقة:
```
"none"   ← بدون شريط (افتراضي)
"right"  ← شريط 3px على اليمين (مناسب للـ RTL)
"left"   ← شريط على اليسار
"top"    ← شريط أعلى البطاقة
"bottom" ← شريط أسفل البطاقة
```

### `hoverEffect` — تأثير الـ Hover:
```
"lift"   ← ارتفاع للأعلى (الأجمل)
"glow"   ← ظل توهج
"scale"  ← تكبير خفيف
"border" ← حد يظهر بلون accent
"fill"   ← يتحول لون accent عند hover
"none"   ← بدون تأثير
```

---

## ٧. الأزرار — `buttons`

```json
"buttons": {
  "style":      "solid",
  "size":       "md",
  "glow":       false,
  "uppercase":  false,
  "hoverScale": false
}
```

### `style` — شكل الأزرار:
```
"solid"    ← معتم بلون accent
"outline"  ← بحد بلون accent
"ghost"    ← بدون خلفية — نص بلون accent فقط
"gradient" ← تدرج accent → accentSecondary
"pill"     ← بيضاوي كامل
```

### `size`:
```
"sm" ← صغير  — px-5 py-2
"md" ← متوسط — px-8 py-3 (افتراضي)
"lg" ← كبير  — px-10 py-4
```

---

## ٨. شبكة المشاريع — `projectsGrid`

```json
"projectsGrid": {
  "columns":      3,
  "style":        "grid",
  "imageRatio":   "4/3",
  "captionStyle": "overlay",
  "hoverEffect":  "zoom"
}
```

### `style` — أسلوب عرض المشاريع (5 أساليب):

| القيمة | الوصف | الأفضل لـ |
|--------|-------|-----------|
| `"grid"` | شبكة منتظمة — الأكثر شيوعاً | كل القطاعات |
| `"masonry"` | ارتفاعات متفاوتة (CSS columns) | التصوير والتصميم |
| `"list"` | قائمة أفقية مع صورة صغيرة | المقاولات والقانون |
| `"magazine"` | أول مشروع ضخم + شبكة جانبية | العقارات والهندسة |
| `"filmstrip"` | أفقي قابل للتمرير | التصوير والتصميم الداخلي |

### `imageRatio` — نسبة أبعاد الصور:
```
"square" ← 1:1 — متوازن
"4/3"    ← أفقي كلاسيكي (افتراضي)
"16/9"   ← سينمائي عريض
"3/4"    ← عمودي — للتصوير والداخلي
"dynamic" ← نسبة 4/3 (محجوز للتطوير)
```

### `captionStyle` — عرض اسم المشروع:
```
"overlay"  ← يظهر عند hover كطبقة شفافة (افتراضي)
"below"    ← أسفل الصورة دائماً مرئي
"slide"    ← يصعد من الأسفل عند hover
"minimal"  ← نص خفيف شبه مخفي عند hover
"floating" ← بطاقة بيضاء تظهر فوق الصورة
```

### `hoverEffect` — تأثير الـ Hover على الصور:
```
"zoom"   ← تكبير خفيف (scale 1.08)
"fade"   ← تعتيم خفيف
"lift"   ← رفع البطاقة بالكامل
"reveal" ← إظهار تدريجي
"none"   ← بدون تأثير
```

---

## ٩. الأقسام الفردية — `sections`

```json
"sections": {
  "aboutLayout":    "side-by-side",
  "aboutShowStats": false,
  "servicesStyle":  "card-grid",
  "featuresStyle":  "icon-list",
  "ctaLayout":      "split",
  "ctaBg":          "background",
  "footerColumns":  3,
  "footerStyle":    "dark",
  "footerShowSocial": true
}
```

### `aboutLayout` — تخطيط قسم "من نحن":
```
"side-by-side" ← نص يمين + صورة يسار (افتراضي)
"reversed"     ← صورة يمين + نص يسار
"stacked"      ← صورة فوق النص
"card"         ← كل الأقسام داخل بطاقة واحدة
```

### `servicesStyle` — عرض الخدمات:
```
"card-grid"        ← بطاقات في شبكة (افتراضي)
"icon-list"        ← قائمة مع أيقونات
"numbered"         ← بطاقات مع أرقام تسلسلية كبيرة
"minimal"          ← قائمة بسيطة بدون بطاقات
```

### `featuresStyle` — عرض المميزات:
```
"icon-list"  ← قائمة مع أيقونة ومربع (افتراضي)
"card-grid"  ← بطاقات في شبكة
"numbered"   ← أرقام كبيرة كتصميم
"checklist"  ← قائمة مع علامات ✓
"minimal"    ← قائمة نص بسيطة
```

### `ctaLayout` — تخطيط قسم الـ CTA:
```
"split"    ← نص يمين + أزرار يسار (افتراضي)
"centered" ← كل شيء في المنتصف
"banner"   ← شريط ضيق مع حدود accent
"minimal"  ← سطر واحد أعلى border-top
```

### `ctaBg` — خلفية قسم الـ CTA:
```
"background" ← نفس خلفية الصفحة (افتراضي)
"primary"    ← خلفية داكنة
"accent"     ← لون accent مشبع
"gradient"   ← تدرج accent → accentSecondary
```

### `footerStyle` — مظهر الـ Footer:
```
"dark"        ← داكن (primary) — الافتراضي
"light"       ← فاتح (background)
"accent"      ← بلون accent
"minimal"     ← فاتح مع border-top فقط
```

---

## ١٠. التأثيرات البصرية — `effects`

> كل هذه التأثيرات مبنية بـ CSS/JavaScript بسيط — لا مكتبات ثقيلة

```json
"effects": {
  "sectionFade":      true,
  "hoverLift":        true,
  "smoothScroll":     true,
  "accentGlow":       false,
  "glassEffect":      false,
  "projectZoom":      true,
  "buttonScale":      false,
  "animatedUnderline": false,
  "pulseAccent":      false
}
```

| التأثير | الوصف | موصى به لـ |
|---------|-------|-----------|
| `sectionFade` | كل قسم يظهر بـ fade-in + slide-up عند الـ scroll | الفخامة والحداثة |
| `hoverLift` | البطاقات ترتفع عند hover (عام للكل) | كل القوالب |
| `smoothScroll` | تمرير سلس `scroll-behavior: smooth` | كل القوالب |
| `accentGlow` | توهج حول أزرار الـ CTA | القوالب الجريئة |
| `glassEffect` | glassmorphism للـ Nav والبطاقات | القوالب الداكنة |
| `projectZoom` | تكبير ناعم لصور المشاريع عند hover | التصوير والعقارات |
| `buttonScale` | الأزرار تكبر قليلاً عند hover | أي قالب جريء |
| `animatedUnderline` | خط ينزلق أسفل الروابط عند hover | القوالب الأنيقة |
| `pulseAccent` | نبضة خفيفة على عناصر CTA | الـ Landing Pages |

---

## ١١. الزخارف والأنماط — `decorations`

```json
"decorations": {
  "sectionDivider":    "gradient",
  "backgroundPattern": "dots",
  "patternOpacity":    0.04,
  "accentLine":        true,
  "sectionBgAlt":      true,
  "cardCornerDot":     false,
  "sectionLabel":      false
}
```

### `sectionDivider` — الفاصل بين الأقسام:
```
"none"      ← بدون فاصل (افتراضي)
"line"      ← خط رفيع بلون border
"gradient"  ← خط بتدرج accent
"dots-row"  ← ثلاث نقاط والوسطى accent
"wave"      ← موجة SVG
"slash"     ← شرطة مائلة بلون accent
```

### `backgroundPattern` — نمط خلفية خفي:
```
"none"     ← بدون نمط (افتراضي)
"dots"     ← نقاط منتظمة
"grid"     ← شبكة خطوط
"diagonal" ← خطوط مائلة
"cross"    ← شبكة + خطوط أفقية
```

### `patternOpacity` — شفافية النمط:
```
0.02  ← خفي جداً (موصى به للنصوص الكثيرة)
0.04  ← الافتراضي — متوازن
0.08  ← ملحوظ قليلاً
0.12  ← واضح
```

### `accentLine` — خط accent بجانب التسمية الصغيرة فوق العناوين:
```json
"accentLine": true  ← ─── خدماتنا ──
"accentLine": false ←     خدماتنا
```

### `sectionBgAlt`:
```json
true  ← الأقسام تتبادل bg و secondary (أعمق بصرياً)
false ← كل قسم يختار لونه (افتراضي)
```

---

## ١٢. التواصل — `contactStyle`

```json
"contactStyle": {
  "layout":            "grid",
  "cardStyle":         "bordered",
  "socialStyle":       "pills",
  "showWhatsappFloat": true,
  "mapStyle":          "embedded"
}
```

| الحقل | القيم | الافتراضي |
|-------|-------|-----------|
| `layout` | `"grid"` `"list"` `"centered"` `"side-by-side"` | `"grid"` |
| `cardStyle` | `"flat"` `"glass"` `"bordered"` `"filled"` | `"bordered"` |
| `socialStyle` | `"icons"` `"pills"` `"text"` `"outlined"` | `"text"` |
| `showWhatsappFloat` | `true` `false` | `true` |
| `mapStyle` | `"embedded"` `"button"` `"none"` | `"embedded"` |

---

## ١٣. بصمة القالب — `visualPreset`

```json
"visualPreset": {
  "themeMood": "luxury_dark",
  "density":   "rich",
  "contrast":  "high"
}
```

هذا القسم وصفي للأدمن فقط — لا يؤثر على الكود. يساعدك في توثيق طابع القالب.

---

## أمثلة قوالب كاملة

---

### مثال ١ — "الأناقة الذهبية" (فاخر داكن)

```json
{
  "name_ar": "الأناقة الذهبية",
  "name_en": "Golden Elegance",
  "description_ar": "قالب فاخر بالأسود والذهب لمكاتب الصف الأول",

  "colors": {
    "primary": "#0a0808", "secondary": "#141010",
    "accent": "#c9a84c", "accentSecondary": "#e8c87a",
    "background": "#f8f4ed", "text": "#1a1510", "textLight": "#8a7a6a",
    "navBg": "#050303", "navText": "#f8f4ed"
  },
  "fonts": {
    "heading": "Cormorant Garamond", "body": "Tajawal",
    "headingWeight": 700, "letterSpacing": "normal", "lineHeight": "relaxed"
  },
  "hero": {
    "style": "cinematic", "height": "screen",
    "overlayOpacity": 0.65, "overlayStyle": "vignette",
    "textAlign": "right", "showScrollIndicator": true,
    "ctaPrimaryText": "اكتشف أعمالنا", "ctaStyle": "solid"
  },
  "layout": {
    "borderRadius": "none", "spacing": "spacious", "maxWidth": "normal",
    "sections": ["hero","about","services","projects","features","cta","footer"]
  },
  "navigation": { "style": "glass", "height": "normal", "position": "sticky" },
  "cards": {
    "style": "elevated", "padding": "large",
    "iconShape": "square", "accentBar": "right",
    "hoverEffect": "lift"
  },
  "buttons": { "style": "solid", "size": "md", "glow": true },
  "projectsGrid": {
    "columns": 3, "style": "magazine",
    "imageRatio": "4/3", "captionStyle": "overlay", "hoverEffect": "zoom"
  },
  "sections": {
    "aboutLayout": "side-by-side", "aboutShowStats": true,
    "servicesStyle": "card-grid", "featuresStyle": "icon-list",
    "ctaLayout": "centered", "ctaBg": "primary",
    "footerColumns": 3, "footerStyle": "dark"
  },
  "effects": {
    "sectionFade": true, "hoverLift": true, "smoothScroll": true,
    "accentGlow": true, "projectZoom": true
  },
  "decorations": {
    "sectionDivider": "gradient", "backgroundPattern": "none",
    "accentLine": true, "sectionBgAlt": false
  },
  "visualPreset": { "themeMood": "luxury_dark", "density": "rich", "contrast": "high" }
}
```

---

### مثال ٢ — "البساطة المطلقة" (Minimal فاخر)

```json
{
  "name_ar": "البساطة المطلقة",
  "name_en": "Pure Minimal",
  "description_ar": "أقل هو أكثر — مساحات بيضاء وتركيز على المحتوى",

  "colors": {
    "primary": "#111111", "secondary": "#f5f5f5",
    "accent": "#111111", "background": "#ffffff",
    "text": "#111111", "textLight": "#999999",
    "navBg": "#ffffff", "navText": "#111111"
  },
  "fonts": {
    "heading": "DM Serif Display", "body": "Almarai",
    "headingWeight": 400, "bodyWeight": 300, "bodySize": "md",
    "letterSpacing": "normal", "lineHeight": "loose"
  },
  "hero": {
    "style": "minimal", "overlayOpacity": 0,
    "textAlign": "right",
    "ctaPrimaryText": "أعمالنا", "ctaSecondaryText": "تواصل",
    "ctaStyle": "outline"
  },
  "layout": {
    "borderRadius": "none", "spacing": "spacious", "maxWidth": "narrow",
    "sections": ["hero", "projects", "about", "cta", "footer"]
  },
  "navigation": { "style": "solid", "height": "compact", "showBorder": true },
  "cards": { "style": "ghost", "padding": "normal", "iconShape": "none", "hoverEffect": "none" },
  "buttons": { "style": "outline", "size": "md", "uppercase": false },
  "projectsGrid": {
    "columns": 3, "style": "grid",
    "imageRatio": "4/3", "captionStyle": "below", "hoverEffect": "fade"
  },
  "sections": {
    "aboutLayout": "stacked",
    "servicesStyle": "minimal", "featuresStyle": "minimal",
    "ctaLayout": "minimal", "ctaBg": "background",
    "footerColumns": 2, "footerStyle": "minimal"
  },
  "effects": {
    "sectionFade": true, "hoverLift": false, "smoothScroll": true,
    "accentGlow": false, "projectZoom": false, "animatedUnderline": true
  },
  "decorations": {
    "sectionDivider": "line", "backgroundPattern": "none",
    "accentLine": false, "sectionBgAlt": false
  }
}
```

---

### مثال ٣ — "طوكيو الليلية" (Pixel Japan — قابل للبناء)

```json
{
  "name_ar": "طوكيو الليلية",
  "name_en": "Tokyo Night",
  "description_ar": "مستوحى من أحياء كيوتو الليلية — دافئ وفاخر وعصري",

  "colors": {
    "primary": "#17120e", "secondary": "#231c16",
    "accent": "#d14d41", "accentSecondary": "#e8806a",
    "background": "#f8f2ea", "text": "#1f1a15", "textLight": "#80766e",
    "navBg": "#100d09", "navText": "#f8f2ea",
    "cardBg": "#f0e8df", "border": "#e0d4c8"
  },
  "fonts": {
    "heading": "Amiri", "body": "Tajawal",
    "headingWeight": 700, "bodyWeight": 400,
    "bodySize": "md", "lineHeight": "relaxed", "letterSpacing": "normal"
  },
  "hero": {
    "style": "fullscreen", "height": "screen",
    "overlayOpacity": 0.62, "overlayStyle": "vignette",
    "textAlign": "right", "showScrollIndicator": true,
    "tagOverride": "فن العمارة الحديثة",
    "ctaPrimaryText": "استعرض الأعمال",
    "ctaSecondaryText": "تواصل معنا",
    "ctaStyle": "solid"
  },
  "layout": {
    "borderRadius": "sm", "spacing": "spacious", "maxWidth": "normal",
    "sections": ["hero","about","services","projects","features","cta","footer"]
  },
  "navigation": { "style": "glass", "height": "normal", "position": "sticky" },
  "cards": {
    "style": "elevated", "padding": "large",
    "iconShape": "square", "accentBar": "right", "hoverEffect": "lift",
    "showNumber": false
  },
  "buttons": { "style": "solid", "size": "md", "glow": false, "hoverScale": true },
  "projectsGrid": {
    "columns": 4, "style": "magazine",
    "imageRatio": "4/3", "captionStyle": "slide", "hoverEffect": "zoom"
  },
  "sections": {
    "aboutLayout": "reversed", "aboutShowStats": true,
    "servicesStyle": "numbered", "featuresStyle": "card-grid",
    "ctaLayout": "centered", "ctaBg": "primary",
    "footerColumns": 3, "footerStyle": "dark", "footerShowSocial": true
  },
  "effects": {
    "sectionFade": true, "hoverLift": true, "smoothScroll": true,
    "accentGlow": false, "glassEffect": false,
    "projectZoom": true, "buttonScale": true, "animatedUnderline": false
  },
  "decorations": {
    "sectionDivider": "dots-row", "backgroundPattern": "dots",
    "patternOpacity": 0.03, "accentLine": true,
    "sectionBgAlt": false, "cardCornerDot": false
  },
  "contactStyle": {
    "layout": "grid", "cardStyle": "bordered",
    "socialStyle": "pills", "showWhatsappFloat": true
  },
  "visualPreset": { "themeMood": "tokyo_warmth", "density": "rich", "contrast": "normal" }
}
```

---

### مثال ٤ — "الجريء الحديث" (Bold Contrast)

```json
{
  "name_ar": "الجريء الحديث",
  "name_en": "Bold Modern",
  "description_ar": "أسود وأبيض مع لكنة حمراء — لمكاتب المقاولات والإنشاء",

  "colors": {
    "primary": "#0a0a0a", "secondary": "#151515",
    "accent": "#e63946", "accentSecondary": "#ff6b6b",
    "background": "#ffffff", "text": "#0a0a0a", "textLight": "#666666",
    "navBg": "#000000", "navText": "#ffffff",
    "cardBg": "#f8f8f8"
  },
  "fonts": {
    "heading": "Bebas Neue", "body": "Cairo",
    "headingWeight": 400, "bodyWeight": 400,
    "bodySize": "md", "letterSpacing": "wide", "lineHeight": "normal",
    "uppercase": true
  },
  "hero": {
    "style": "split", "height": "screen",
    "overlayOpacity": 0.5, "overlayStyle": "flat",
    "textAlign": "right",
    "ctaPrimaryText": "أعمالنا", "ctaStyle": "solid",
    "ctaSecondaryText": "تواصل"
  },
  "layout": {
    "borderRadius": "none", "spacing": "normal", "maxWidth": "wide",
    "sections": ["hero","services","projects","features","about","cta","footer"]
  },
  "navigation": { "style": "solid", "height": "compact", "ctaInNav": true },
  "cards": {
    "style": "bordered", "padding": "normal",
    "iconShape": "square", "accentBar": "top",
    "hoverEffect": "border", "showNumber": true
  },
  "buttons": { "style": "solid", "size": "lg", "uppercase": true, "hoverScale": true },
  "projectsGrid": {
    "columns": 3, "style": "grid",
    "imageRatio": "16/9", "captionStyle": "overlay", "hoverEffect": "lift"
  },
  "sections": {
    "aboutLayout": "side-by-side",
    "servicesStyle": "numbered", "featuresStyle": "checklist",
    "ctaLayout": "banner", "ctaBg": "accent",
    "footerColumns": 3, "footerStyle": "dark"
  },
  "effects": {
    "sectionFade": false, "hoverLift": true, "smoothScroll": true,
    "accentGlow": true, "projectZoom": true, "buttonScale": true
  },
  "decorations": {
    "sectionDivider": "slash", "backgroundPattern": "none",
    "accentLine": true, "sectionBgAlt": true
  }
}
```

---

## كيفية رفع القالب

```
1. أنشئ مجلداً
   └── my-theme/
       ├── theme.json    ← الملف الرئيسي
       └── preview.jpg   ← صورة 1280×720

2. اضغط كـ ZIP

3. الأدمن → القوالب → رفع قالب → اختر الـ ZIP

4. حدد:
   - الخطة المطلوبة (basic / pro / premium)
   - الظهور (عام / خاص لمكتب محدد)

5. يظهر فوراً في قائمة القوالب
```

---

## الأخطاء الشائعة

| الخطأ | السبب | الحل |
|-------|-------|------|
| القالب لا يُحمَّل | `theme.json` غير صالح | تحقق بـ [jsonlint.com](https://jsonlint.com) |
| الخط لا يظهر | خطأ في الاسم | انسخ الاسم بالضبط من [fonts.google.com](https://fonts.google.com) |
| الأزرار بدون توهج | `effects.accentGlow: false` | غيّرها لـ `true` |
| Hero بدون صورة | `tenant.cover_url` فارغ | المكتب لم يرفع صورة غلاف |
| الـ Glass لا يعمل | المتصفح لا يدعم `backdrop-filter` | تجاهل — يظهر في Chrome/Safari |
| `"sections": []` فارغة | القالب لن يعرض شيئاً | أضف `"hero"` على الأقل |
| accentSecondary لا يظهر | `ctaStyle` ليس `"gradient"` أو `ctaBg` ليس `"gradient"` | غيّر أحدهما |

---

## نصائح الاحترافيين

**للقوالب الداكنة:**
- استخدم `navText: "#ffffff"` صريحاً لضمان التباين
- `glassEffect: true` يبدو رائعاً على الخلفيات الداكنة
- `accentGlow: true` يعطي عمقاً بصرياً

**للقوالب الفاتحة:**
- `backgroundPattern: "dots"` مع `patternOpacity: 0.03` يضيف عمقاً خفياً
- `sectionDivider: "gradient"` أجمل من `"line"`
- `cards.style: "elevated"` أفضل من `"bordered"` في الخلفيات الفاتحة

**للقوالب الفاخرة:**
- `hero.style: "cinematic"` + `effects.sectionFade: true` = احترافي جداً
- `projectsGrid.style: "magazine"` للعقارات والهندسة
- `sections.aboutShowStats: true` يضيف مصداقية

**للقوالب البسيطة:**
- `hero.style: "minimal"` + `layout.borderRadius: "none"` = تصميم نظيف
- `effects.*: false` كلها = أسرع في التحميل
- `cards.style: "ghost"` + `hoverEffect: "none"` = بساطة مطلقة

---

*آخر تحديث: مايو 2026 — إصدار 3.0 | يتوافق مع DynamicThemeEngine v3*
