export type Theme = 'modern' | 'classic' | 'bold' | 'minimal' | 'luxury'
export type Plan = 'basic' | 'pro' | 'premium'
export type TenantUserRole = 'owner' | 'editor'
export type Sector = 'engineering' | 'contractor' | 'real_estate' | 'interior_design' | 'photography' | 'legal' | 'medical' | 'general'

export interface Tenant {
  id: string
  name_ar: string
  name_en: string | null
  slug: string
  custom_domain: string | null
  logo_url: string | null
  cover_url: string | null
  bio_ar: string | null
  bio_en: string | null
  phone: string | null
  email: string | null
  address_ar: string | null
  address_en: string | null
  google_maps_url: string | null
  instagram_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  snapchat_url: string | null
  theme: Theme
  is_active: boolean
  plan: Plan
  sector: Sector
  whatsapp: string | null
  video_url: string | null
  subscription_start: string | null
  subscription_end: string | null
  created_at: string
  updated_at: string
}

export interface TenantUser {
  id: string
  tenant_id: string
  user_id: string
  role: TenantUserRole
  created_at: string
}

export interface Project {
  id: string
  tenant_id: string
  title_ar: string
  title_en: string | null
  description_ar: string | null
  description_en: string | null
  category: string | null
  location_ar: string | null
  year: number | null
  cover_image_url: string | null
  sort_order: number
  is_featured: boolean
  price: string | null
  area: string | null
  status: string | null
  bedrooms: number | null
  bathrooms: number | null
  tags: string[] | null
  deleted_at: string | null
  created_at: string
  updated_at: string
  images?: ProjectImage[]
}

export interface ProjectImage {
  id: string
  project_id: string
  tenant_id: string
  url: string
  sort_order: number
  created_at: string
}

export interface AdminUser {
  id: string
  user_id: string
  created_at: string
}

export interface SubscriptionLog {
  id: string
  tenant_id: string
  action: 'activated' | 'renewed' | 'suspended' | 'cancelled'
  plan: Plan | null
  amount: number | null
  notes: string | null
  performed_by: string | null
  created_at: string
}

export interface ContentBlock {
  id: string
  tenant_id: string
  type: 'service' | 'feature'
  title: string
  description: string | null
  icon: string | null
  sort_order: number
  is_active: boolean
  created_at: string
}

// ── القوالب المخصصة ──────────────────────────────────────────────────────────

export interface CustomThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  textLight: string
  // ألوان اختيارية موسّعة
  accentSecondary?: string   // لون تأكيد ثانٍ للتدرجات والتفاصيل
  cardBg?: string            // خلفية البطاقات (افتراضي: secondary)
  border?: string            // لون الحدود العامة
  navBg?: string             // خلفية شريط التنقل (افتراضي: primary)
  navText?: string           // لون نصوص التنقل (افتراضي: background)
}

export interface CustomThemeConfig {
  // ── الألوان ──────────────────────────────────────────────────────────────
  colors: CustomThemeColors

  // ── الخطوط ──────────────────────────────────────────────────────────────
  fonts: {
    heading: string
    body: string
    headingWeight?: 400 | 600 | 700 | 800 | 900
    bodyWeight?: 300 | 400 | 500
    bodySize?: 'sm' | 'md' | 'lg'
    letterSpacing?: 'tight' | 'normal' | 'wide' | 'wider'
    lineHeight?: 'tight' | 'normal' | 'relaxed' | 'loose'
    uppercase?: boolean      // العناوين بأحرف كبيرة
  }

  // ── الـ Hero ──────────────────────────────────────────────────────────────
  hero: {
    style: 'fullscreen' | 'split' | 'centered' | 'minimal' | 'split-reverse' | 'cinematic'
    height?: 'half' | 'screen' | 'tall'
    overlayOpacity: number
    overlayStyle?: 'gradient' | 'flat' | 'radial' | 'vignette' | 'diagonal'
    textAlign: 'right' | 'center' | 'left'
    showLogo?: boolean
    ctaPrimaryText?: string   // نص الزر الرئيسي (افتراضي: "استعرض المشاريع")
    ctaSecondaryText?: string // نص الزر الثانوي (افتراضي: "تواصل معنا")
    ctaStyle?: 'solid' | 'outline' | 'ghost' | 'gradient'
    tagOverride?: string      // تعديل نص الـ tag فوق العنوان
    showScrollIndicator?: boolean // سهم "انتقل للأسفل"
  }

  // ── التخطيط العام ─────────────────────────────────────────────────────────
  layout: {
    borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full'
    spacing: 'compact' | 'normal' | 'spacious'
    sections: Array<'hero' | 'about' | 'services' | 'projects' | 'features' | 'cta' | 'footer'>
    maxWidth?: 'narrow' | 'normal' | 'wide' | 'full'
  }

  // ── شريط التنقل ──────────────────────────────────────────────────────────
  navigation?: {
    style?: 'solid' | 'transparent' | 'blur' | 'glass' | 'bordered'
    height?: 'compact' | 'normal' | 'tall'
    position?: 'sticky' | 'fixed' | 'static'
    showBorder?: boolean
    logoSize?: 'sm' | 'md' | 'lg'
    ctaInNav?: boolean        // عرض زر CTA في التنقل
  }

  // ── البطاقات (الخدمات والمميزات) ──────────────────────────────────────────
  cards?: {
    style?: 'flat' | 'elevated' | 'bordered' | 'glass' | 'filled' | 'ghost'
    padding?: 'compact' | 'normal' | 'large'
    iconShape?: 'circle' | 'square' | 'rounded' | 'diamond' | 'none'
    accentBar?: 'none' | 'right' | 'left' | 'top' | 'bottom'
    hoverEffect?: 'lift' | 'glow' | 'border' | 'scale' | 'fill' | 'none'
    showNumber?: boolean      // أرقام تسلسلية على البطاقات
  }

  // ── الأزرار ───────────────────────────────────────────────────────────────
  buttons?: {
    style?: 'solid' | 'outline' | 'ghost' | 'gradient' | 'pill'
    size?: 'sm' | 'md' | 'lg'
    glow?: boolean
    uppercase?: boolean
    hoverScale?: boolean
  }

  // ── شبكة المشاريع ─────────────────────────────────────────────────────────
  projectsGrid: {
    columns: 2 | 3 | 4
    style: 'grid' | 'masonry' | 'list' | 'magazine' | 'filmstrip'
    imageRatio?: 'square' | '4/3' | '16/9' | '3/4' | 'dynamic'
    captionStyle?: 'overlay' | 'below' | 'slide' | 'minimal' | 'floating'
    hoverEffect?: 'zoom' | 'lift' | 'fade' | 'reveal' | 'none'
  }

  // ── إعدادات الأقسام الفردية ───────────────────────────────────────────────
  sections?: {
    aboutLayout?: 'side-by-side' | 'stacked' | 'reversed' | 'card' | 'timeline'
    aboutShowStats?: boolean  // أرقام إحصائية (سنوات الخبرة، المشاريع...)
    servicesStyle?: 'card-grid' | 'icon-list' | 'horizontal-scroll' | 'numbered' | 'minimal'
    featuresStyle?: 'icon-list' | 'card-grid' | 'numbered' | 'minimal' | 'checklist'
    ctaLayout?: 'split' | 'centered' | 'banner' | 'minimal' | 'floating'
    ctaBg?: 'primary' | 'accent' | 'background' | 'gradient'
    footerColumns?: 2 | 3 | 4
    footerStyle?: 'dark' | 'light' | 'accent' | 'minimal'
    footerShowSocial?: boolean
  }

  // ── التأثيرات البصرية (CSS-only, لا JavaScript ثقيل) ─────────────────────
  effects?: {
    sectionFade?: boolean     // fade-in + slide-up عند الـ scroll
    hoverLift?: boolean       // رفع البطاقات عند hover (عام)
    smoothScroll?: boolean    // تمرير سلس
    accentGlow?: boolean      // توهج حول الأزرار والأيقونات
    glassEffect?: boolean     // glassmorphism للـ Nav والبطاقات
    projectZoom?: boolean     // تكبير صور المشاريع عند hover
    buttonScale?: boolean     // تكبير الأزرار عند hover
    animatedUnderline?: boolean // خط متحرك على الروابط
    pulseAccent?: boolean     // نبضة على عناصر accent
  }

  // ── الزخارف والأنماط ──────────────────────────────────────────────────────
  decorations?: {
    sectionDivider?: 'none' | 'line' | 'gradient' | 'dots-row' | 'wave' | 'slash'
    backgroundPattern?: 'none' | 'dots' | 'grid' | 'diagonal' | 'cross'
    patternOpacity?: number   // شفافية النمط 0-1 (افتراضي: 0.04)
    accentLine?: boolean      // خط ملون على جانب العناوين الرئيسية
    sectionBgAlt?: boolean    // تبادل خلفيات الأقسام (bg / secondary)
    cardCornerDot?: boolean   // نقطة لونية في زاوية البطاقة
    sectionLabel?: boolean    // رقم القسم كزخرفة خلفية كبيرة
  }

  // ── التواصل ───────────────────────────────────────────────────────────────
  contactStyle?: {
    layout?: 'grid' | 'list' | 'centered' | 'side-by-side'
    cardStyle?: 'flat' | 'glass' | 'bordered' | 'filled'
    socialStyle?: 'icons' | 'pills' | 'text' | 'outlined'
    showWhatsappFloat?: boolean
    mapStyle?: 'embedded' | 'button' | 'none'
  }

  // ── بصمة القالب (metadata) ────────────────────────────────────────────────
  visualPreset?: {
    themeMood?: string        // وصف حر للمزاج (للأدمن فقط)
    density?: 'minimal' | 'normal' | 'rich'
    contrast?: 'low' | 'normal' | 'high'
  }
}

export interface CustomTheme {
  id: string
  name_ar: string
  name_en: string | null
  description_ar: string | null
  preview_url: string | null
  config: CustomThemeConfig
  fonts: Array<{ name: string; url: string }>
  is_active: boolean
  plan_required: Plan
  visibility: 'public' | 'private'
  created_by: string | null
  created_at: string
}

export interface CustomThemeTenant {
  id: string
  custom_theme_id: string
  tenant_id: string
  assigned_by: string | null
  assigned_at: string
}

export interface ThemeProps {
  tenant: Tenant
  projects: Project[]
  featuredProjects: Project[]
  services: ContentBlock[]
  features: ContentBlock[]
  customTheme?: CustomTheme | null
  sectorConfig?: import('@/lib/sectors').SectorConfig
}

export const PLAN_LIMITS = {
  basic: {
    projects: 10,
    storage_mb: 500,
    themes: ['modern'] as Theme[],
    custom_domain: false,
    price_sar: 1200,
  },
  pro: {
    projects: 30,
    storage_mb: 2048,
    themes: ['modern', 'classic', 'bold', 'minimal', 'luxury'] as Theme[],
    custom_domain: false,
    price_sar: 2000,
  },
  premium: {
    projects: Infinity,
    storage_mb: 10240,
    themes: ['modern', 'classic', 'bold', 'minimal', 'luxury'] as Theme[],
    custom_domain: true,
    price_sar: 3500,
  },
} as const
