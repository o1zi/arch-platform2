# دليل بناء قالب ZIP للمنصة

> أعطِ هذا الملف كاملاً للذكاء الاصطناعي واطلب منه بناء قالب جديد.
> لا تحذف أي قسم — كل التفاصيل مطلوبة للعمل الصحيح.

---

## ما هو القالب؟

القالب هو **ملف ZIP** يحتوي على ملف JSON واحد اسمه `theme.json`.
هذا الملف يتحكم في كل شيء: الألوان، الخطوط، التخطيط، الزخارف، التأثيرات.
المنصة تقرأ هذا الملف وتُطبّق كل إعداداته تلقائياً على **3 صفحات**:
- الصفحة الرئيسية للمكتب
- صفحة المشاريع
- صفحة التواصل

---

## هيكل ملف ZIP

```
theme-name.zip
└── theme.json          ← الملف الوحيد المطلوب
```

لا صور، لا CSS منفصل، لا JavaScript — كل شيء داخل `theme.json`.

---

## هيكل theme.json الكامل

```json
{
  "colors": {
    "primary":         "#0f172a",
    "secondary":       "#1e293b",
    "accent":          "#c9a84c",
    "accentSecondary": "#e2c97e",
    "background":      "#ffffff",
    "text":            "#0f172a",
    "textLight":       "#64748b",
    "cardBg":          "#f8fafc",
    "border":          "#e2e8f0",
    "navBg":           "#0f172a",
    "navText":         "#ffffff"
  },

  "fonts": {
    "heading":       "Playfair Display",
    "body":          "Cairo",
    "headingWeight": 700,
    "bodyWeight":    400,
    "bodySize":      "md",
    "letterSpacing": "normal",
    "lineHeight":    "relaxed",
    "uppercase":     false
  },

  "hero": {
    "style":              "split",
    "height":             "screen",
    "overlayOpacity":     0.4,
    "overlayStyle":       "gradient",
    "textAlign":          "right",
    "showLogo":           true,
    "ctaPrimaryText":     "استعرض مشاريعنا",
    "ctaSecondaryText":   "تواصل معنا",
    "ctaStyle":           "solid",
    "showScrollIndicator": true
  },

  "layout": {
    "borderRadius": "md",
    "spacing":      "normal",
    "maxWidth":     "normal",
    "sections":     ["hero", "about", "services", "projects", "cta", "footer"]
  },

  "navigation": {
    "style":      "transparent",
    "height":     "normal",
    "position":   "sticky",
    "showBorder": false,
    "logoSize":   "md",
    "ctaInNav":   true
  },

  "projectsGrid": {
    "columns":      3,
    "style":        "grid",
    "imageRatio":   "4/3",
    "captionStyle": "overlay",
    "hoverEffect":  "zoom"
  },

  "cards": {
    "style":       "elevated",
    "padding":     "normal",
    "iconShape":   "rounded",
    "hoverEffect": "lift"
  },

  "buttons": {
    "style":      "solid",
    "size":       "md",
    "glow":       false,
    "uppercase":  false,
    "hoverScale": true
  },

  "sections": {
    "aboutLayout":    "side-by-side",
    "aboutShowStats": true,
    "servicesStyle":  "card-grid",
    "ctaLayout":      "split",
    "ctaBg":          "primary",
    "footerColumns":  2,
    "footerStyle":    "dark",
    "footerShowSocial": true
  },

  "effects": {
    "sectionFade":  true,
    "hoverLift":    true,
    "smoothScroll": true,
    "projectZoom":  true,
    "buttonScale":  true
  },

  "decorations": {
    "sectionDivider":    "none",
    "backgroundPattern": "none",
    "patternOpacity":    0.04,
    "accentLine":        true,
    "sectionBgAlt":      true
  },

  "contactStyle": {
    "layout":              "side-by-side",
    "cardStyle":           "bordered",
    "socialStyle":         "pills",
    "showWhatsappFloat":   true,
    "mapStyle":            "embedded"
  }
}
```

---

## شرح كل حقل بالتفصيل

### `colors` — الألوان

| الحقل | الوصف | مثال |
|-------|-------|-------|
| `primary` | اللون الرئيسي — خلفية الـ Nav والـ Hero وبعض الأقسام | `"#0f172a"` |
| `secondary` | خلفية ثانوية — خلفيات خفيفة وبطاقات | `"#1e293b"` |
| `accent` | لون التمييز — الأزرار، الأيقونات، التسليط | `"#c9a84c"` |
| `accentSecondary` | لون تمييز ثانوي — تدرجات وتأثيرات | `"#e2c97e"` |
| `background` | خلفية الصفحة الرئيسية | `"#ffffff"` |
| `text` | لون النصوص الرئيسية | `"#0f172a"` |
| `textLight` | لون النصوص الثانوية والوصف | `"#64748b"` |
| `cardBg` | خلفية البطاقات والعناصر الصغيرة | `"#f8fafc"` |
| `border` | لون الحدود والفواصل | `"#e2e8f0"` |
| `navBg` | خلفية شريط التنقل | `"#0f172a"` |
| `navText` | لون النصوص داخل شريط التنقل | `"#ffffff"` |

> **ملاحظة:** كل الألوان بصيغة HEX (`#RRGGBB`) — لا rgba ولا اسم اللون.

---

### `fonts` — الخطوط

| الحقل | القيم المتاحة | الوصف |
|-------|--------------|-------|
| `heading` | أي خط من Google Fonts | خط العناوين |
| `body` | أي خط من Google Fonts | خط النصوص |
| `headingWeight` | `400` \| `600` \| `700` \| `800` \| `900` | سماكة خط العناوين |
| `bodyWeight` | `300` \| `400` \| `500` | سماكة خط النصوص |
| `bodySize` | `"sm"` \| `"md"` \| `"lg"` | حجم خط النصوص |
| `letterSpacing` | `"tight"` \| `"normal"` \| `"wide"` \| `"wider"` | تباعد الحروف |
| `lineHeight` | `"tight"` \| `"normal"` \| `"relaxed"` \| `"loose"` | ارتفاع السطر |
| `uppercase` | `true` \| `false` | العناوين بأحرف كبيرة |

**خطوط مقترحة للعربية:**
- `"Cairo"` — عصري وسهل القراءة ✅
- `"Tajawal"` — خفيف وأنيق
- `"Almarai"` — واضح ومتوازن
- `"Noto Kufi Arabic"` — كوفي راقٍ

**خطوط مقترحة للعناوين (تعمل مع العربية والإنجليزية):**
- `"Playfair Display"` — كلاسيكي فاخر
- `"Cormorant Garamond"` — أنيق جداً
- `"Cinzel"` — رسمي وفخم
- `"Bebas Neue"` — جريء وعصري

---

### `hero` — قسم الهيرو

| الحقل | القيم المتاحة | الوصف |
|-------|--------------|-------|
| `style` | `"fullscreen"` \| `"split"` \| `"centered"` \| `"minimal"` \| `"split-reverse"` \| `"cinematic"` | شكل الهيرو |
| `height` | `"half"` \| `"screen"` \| `"tall"` | ارتفاع الهيرو |
| `overlayOpacity` | `0` → `1` | شفافية الطبقة فوق الصورة |
| `overlayStyle` | `"gradient"` \| `"flat"` \| `"radial"` \| `"vignette"` \| `"diagonal"` | نوع الطبقة |
| `textAlign` | `"right"` \| `"center"` \| `"left"` | محاذاة النص |
| `showLogo` | `true` \| `false` | إظهار الشعار في الهيرو |
| `ctaPrimaryText` | نص حر | نص الزر الرئيسي |
| `ctaSecondaryText` | نص حر | نص الزر الثانوي |
| `ctaStyle` | `"solid"` \| `"outline"` \| `"ghost"` \| `"gradient"` | شكل الأزرار |
| `showScrollIndicator` | `true` \| `false` | سهم "انتقل للأسفل" |

**أنماط الهيرو:**
- `fullscreen` — صورة تملأ الشاشة كاملة مع نص فوقها
- `split` — النص على اليمين والصورة على اليسار (50/50)
- `split-reverse` — النص على اليسار والصورة على اليمين
- `centered` — نص في المنتصف مع صورة خلفية
- `minimal` — نص فقط بدون صورة
- `cinematic` — صورة بنسبة سينمائية مع تأثير parallax

---

### `layout` — التخطيط العام

| الحقل | القيم المتاحة | الوصف |
|-------|--------------|-------|
| `borderRadius` | `"none"` \| `"sm"` \| `"md"` \| `"lg"` \| `"full"` | انحناء الزوايا لكل العناصر |
| `spacing` | `"compact"` \| `"normal"` \| `"spacious"` | المسافات العمودية بين الأقسام |
| `maxWidth` | `"narrow"` \| `"normal"` \| `"wide"` \| `"full"` | أقصى عرض للمحتوى |
| `sections` | مصفوفة (انظر أدناه) | ترتيب وتفعيل الأقسام |

**ترتيب الأقسام** — الترتيب مهم:
```json
"sections": ["hero", "about", "services", "projects", "features", "cta", "footer"]
```
- `"hero"` — القسم الرئيسي (اسم المكتب + صورة)
- `"about"` — نبذة عن المكتب
- `"services"` — الخدمات
- `"projects"` — المشاريع المميزة
- `"features"` — المميزات / لماذا نحن
- `"cta"` — دعوة للتواصل
- `"footer"` — تذييل الصفحة

لإخفاء قسم، احذفه من المصفوفة.

---

### `navigation` — شريط التنقل

| الحقل | القيم المتاحة | الوصف |
|-------|--------------|-------|
| `style` | `"solid"` \| `"transparent"` \| `"blur"` \| `"glass"` \| `"bordered"` | شكل الشريط |
| `height` | `"compact"` \| `"normal"` \| `"tall"` | ارتفاع الشريط |
| `position` | `"sticky"` \| `"fixed"` \| `"static"` | موضع الشريط عند التمرير |
| `showBorder` | `true` \| `false` | خط سفلي للشريط |
| `logoSize` | `"sm"` \| `"md"` \| `"lg"` | حجم الشعار |
| `ctaInNav` | `true` \| `false` | إظهار زر واتساب في الشريط |

---

### `projectsGrid` — شبكة المشاريع

| الحقل | القيم المتاحة | الوصف |
|-------|--------------|-------|
| `columns` | `2` \| `3` \| `4` | عدد الأعمدة |
| `style` | `"grid"` \| `"masonry"` \| `"list"` \| `"magazine"` \| `"filmstrip"` | شكل الشبكة |
| `imageRatio` | `"square"` \| `"4/3"` \| `"16/9"` \| `"3/4"` \| `"dynamic"` | نسبة الصور |
| `captionStyle` | `"overlay"` \| `"below"` \| `"slide"` \| `"minimal"` \| `"floating"` | أسلوب عرض النص |
| `hoverEffect` | `"zoom"` \| `"lift"` \| `"fade"` \| `"reveal"` \| `"none"` | تأثير hover |

---

### `cards` — البطاقات (الخدمات والمميزات)

| الحقل | القيم المتاحة | الوصف |
|-------|--------------|-------|
| `style` | `"flat"` \| `"elevated"` \| `"bordered"` \| `"glass"` \| `"filled"` \| `"ghost"` | شكل البطاقة |
| `padding` | `"compact"` \| `"normal"` \| `"large"` | الحشو الداخلي |
| `iconShape` | `"circle"` \| `"square"` \| `"rounded"` \| `"diamond"` \| `"none"` | شكل حاوية الأيقونة |
| `hoverEffect` | `"lift"` \| `"glow"` \| `"border"` \| `"scale"` \| `"fill"` \| `"none"` | تأثير hover |
| `showNumber` | `true` \| `false` | أرقام تسلسلية على البطاقات |

---

### `buttons` — الأزرار

| الحقل | القيم المتاحة | الوصف |
|-------|--------------|-------|
| `style` | `"solid"` \| `"outline"` \| `"ghost"` \| `"gradient"` \| `"pill"` | شكل الزر |
| `size` | `"sm"` \| `"md"` \| `"lg"` | الحجم |
| `glow` | `true` \| `false` | توهج حول الزر |
| `uppercase` | `true` \| `false` | النص بأحرف كبيرة |
| `hoverScale` | `true` \| `false` | تكبير عند hover |

---

### `sections` — إعدادات الأقسام الفردية

| الحقل | القيم المتاحة | الوصف |
|-------|--------------|-------|
| `aboutLayout` | `"side-by-side"` \| `"stacked"` \| `"reversed"` \| `"card"` \| `"timeline"` | تخطيط قسم "عن المكتب" |
| `aboutShowStats` | `true` \| `false` | إظهار الإحصائيات (سنوات خبرة، مشاريع...) |
| `servicesStyle` | `"card-grid"` \| `"icon-list"` \| `"horizontal-scroll"` \| `"numbered"` \| `"minimal"` | شكل الخدمات |
| `ctaLayout` | `"split"` \| `"centered"` \| `"banner"` \| `"minimal"` \| `"floating"` | تخطيط قسم CTA |
| `ctaBg` | `"primary"` \| `"accent"` \| `"background"` \| `"gradient"` | خلفية قسم CTA |
| `footerColumns` | `2` \| `3` \| `4` | أعمدة الـ Footer |
| `footerStyle` | `"dark"` \| `"light"` \| `"accent"` \| `"minimal"` | مزاج الـ Footer |
| `footerShowSocial` | `true` \| `false` | إظهار روابط السوشيال في الـ Footer |

---

### `effects` — التأثيرات البصرية

| الحقل | الوصف |
|-------|-------|
| `sectionFade` | الأقسام تظهر بتأثير fade+slide عند الـ scroll |
| `hoverLift` | رفع عام للبطاقات عند hover |
| `smoothScroll` | تمرير سلس للصفحة |
| `projectZoom` | تكبير صور المشاريع عند hover |
| `buttonScale` | تكبير الأزرار عند hover |
| `accentGlow` | توهج حول الأزرار والأيقونات |
| `glassEffect` | glassmorphism للـ Nav والبطاقات |
| `animatedUnderline` | خط متحرك على الروابط |

---

### `decorations` — الزخارف

| الحقل | القيم المتاحة | الوصف |
|-------|--------------|-------|
| `sectionDivider` | `"none"` \| `"line"` \| `"gradient"` \| `"dots-row"` \| `"wave"` \| `"slash"` | فاصل بين الأقسام |
| `backgroundPattern` | `"none"` \| `"dots"` \| `"grid"` \| `"diagonal"` \| `"cross"` | نمط خلفي خفيف |
| `patternOpacity` | `0` → `1` | شفافية النمط (افتراضي: `0.04`) |
| `accentLine` | `true` \| `false` | خط ملون جانبي على العناوين الرئيسية |
| `sectionBgAlt` | `true` \| `false` | تبادل خلفيات الأقسام |
| `cardCornerDot` | `true` \| `false` | نقطة لونية في زاوية البطاقة |

---

### `contactStyle` — صفحة التواصل

| الحقل | القيم المتاحة | الوصف |
|-------|--------------|-------|
| `layout` | `"grid"` \| `"list"` \| `"centered"` \| `"side-by-side"` | تخطيط الصفحة |
| `cardStyle` | `"flat"` \| `"glass"` \| `"bordered"` \| `"filled"` | شكل بطاقات معلومات التواصل |
| `socialStyle` | `"icons"` \| `"pills"` \| `"text"` \| `"outlined"` | شكل أزرار السوشيال |
| `showWhatsappFloat` | `true` \| `false` | زر واتساب عائم في الزاوية |
| `mapStyle` | `"embedded"` \| `"button"` \| `"none"` | طريقة عرض الخريطة |

---

## قوالب جاهزة للإلهام

### قالب فاخر داكن (Luxury Dark)
```json
{
  "colors": {
    "primary": "#0a0a0a", "secondary": "#111111",
    "accent": "#c9a84c", "accentSecondary": "#e2c97e",
    "background": "#0a0a0a", "text": "#f5f5f0",
    "textLight": "#888880", "cardBg": "#111111",
    "border": "#2a2a2a", "navBg": "#000000", "navText": "#ffffff"
  },
  "fonts": { "heading": "Cormorant Garamond", "body": "Cairo",
    "headingWeight": 700, "bodyWeight": 300, "letterSpacing": "wide" },
  "hero": { "style": "fullscreen", "overlayOpacity": 0.6, "overlayStyle": "vignette" }
}
```

### قالب عصري أبيض (Modern White)
```json
{
  "colors": {
    "primary": "#ffffff", "secondary": "#f8f9fa",
    "accent": "#2563eb", "accentSecondary": "#3b82f6",
    "background": "#ffffff", "text": "#111827",
    "textLight": "#6b7280", "cardBg": "#f9fafb",
    "border": "#e5e7eb", "navBg": "#ffffff", "navText": "#111827"
  },
  "fonts": { "heading": "Plus Jakarta Sans", "body": "Cairo",
    "headingWeight": 800, "bodyWeight": 400 },
  "hero": { "style": "split", "overlayOpacity": 0 }
}
```

### قالب جريء (Bold)
```json
{
  "colors": {
    "primary": "#000000", "secondary": "#111111",
    "accent": "#ef4444", "accentSecondary": "#f87171",
    "background": "#000000", "text": "#ffffff",
    "textLight": "#a1a1aa", "cardBg": "#18181b",
    "border": "#27272a", "navBg": "#000000", "navText": "#ffffff"
  },
  "fonts": { "heading": "Bebas Neue", "body": "Cairo",
    "headingWeight": 400, "letterSpacing": "wider", "uppercase": true },
  "hero": { "style": "cinematic", "overlayOpacity": 0.5 },
  "buttons": { "style": "solid", "glow": true, "uppercase": true }
}
```

### قالب كريمي كلاسيكي (Classic Cream)
```json
{
  "colors": {
    "primary": "#fdf8f0", "secondary": "#f5efe3",
    "accent": "#8b5e3c", "accentSecondary": "#c9a484",
    "background": "#fdf8f0", "text": "#2c1a0e",
    "textLight": "#7c6655", "cardBg": "#f5efe3",
    "border": "#e8d5c0", "navBg": "#2c1a0e", "navText": "#fdf8f0"
  },
  "fonts": { "heading": "Playfair Display", "body": "Almarai",
    "headingWeight": 700, "bodyWeight": 400 },
  "hero": { "style": "split", "overlayStyle": "gradient" }
}
```

---

## كيف يرفع الأدمن القالب؟

1. يجهّز `theme.json` بالإعدادات المطلوبة
2. يضغطه كـ ZIP (اسم أي شيء، مثلاً `luxury-dark.zip`)
3. يفتح لوحة الأدمن ← القوالب ← رفع قالب جديد
4. يرفع الـ ZIP ويكتب اسماً ووصفاً للقالب
5. يختار هل القالب عام (لكل المكاتب) أم خاص لمكتب بعينه
6. يختار الباقة المطلوبة: `basic` / `pro` / `premium`

---

## قواعد مهمة

1. **كل الحقول اختيارية ما عدا:** `colors`, `fonts`, `hero`, `layout`, `projectsGrid`
2. **الألوان بـ HEX فقط** — لا rgb, لا rgba, لا أسماء
3. **الخطوط من Google Fonts فقط** — تُحمَّل تلقائياً
4. **ترتيب `layout.sections` يتحكم في ترتيب الأقسام** بالصفحة الرئيسية
5. **JSON صحيح 100%** — أي فاصلة زائدة أو ناقصة تُوقف القالب
6. **اختبر JSON في** [jsonlint.com](https://jsonlint.com) قبل الرفع

---

## مثال: طلب نموذجي للذكاء الاصطناعي

```
اكتب لي ملف theme.json لقالب فاخر بالمواصفات التالية:
- مزاج: فاخر داكن مع لمسات ذهبية
- ألوان: خلفية سوداء، accent ذهبي، نصوص بيضاء
- خط: Cormorant Garamond للعناوين، Cairo للنصوص
- الهيرو: fullscreen مع overlay قوي
- المشاريع: 3 أعمدة، نسبة 4/3، تأثير zoom
- تأثيرات: fade عند scroll، glow على الأزرار
- الـ Nav: شفاف يتحول عند التمرير
- التحقق: JSON صحيح قابل للرفع مباشرة
```

---

*المنصة تستخدم هذا الملف مباشرة — لا حاجة لأي كود إضافي.*
