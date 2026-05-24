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
  label: string
  portfolioLabel: string
  portfolioItemLabel: string
  portfolioItemLabelPlural: string
  categories: string[]
  extraFields: {
    price?: boolean
    area?: boolean
    status?: boolean
    bedrooms?: boolean
    tags?: boolean
  }
  statusOptions?: string[]
  heroTagline: string
  servicesLabel: string
  featuredLabel: string
  profileLabel: string
}

export const SECTOR_CONFIG: Record<Sector, SectorConfig> = {
  engineering: {
    label: 'مكتب هندسي',
    portfolioLabel: 'المشاريع',
    portfolioItemLabel: 'مشروع',
    portfolioItemLabelPlural: 'مشاريع',
    categories: ['سكني', 'تجاري', 'صناعي', 'ترفيهي', 'حكومي', 'تعليمي', 'صحي'],
    extraFields: { area: true, tags: true },
    heroTagline: 'نصمم المستقبل ونبنيه بأيدينا',
    servicesLabel: 'خدماتنا',
    featuredLabel: 'أبرز مشاريعنا',
    profileLabel: 'معلومات المكتب',
  },

  contractor: {
    label: 'مقاول بناء',
    portfolioLabel: 'الأعمال',
    portfolioItemLabel: 'مشروع',
    portfolioItemLabelPlural: 'مشاريع',
    categories: ['بناء وإنشاء', 'تشطيبات', 'بنية تحتية', 'ترميم', 'صيانة', 'مستودعات'],
    extraFields: { area: true, tags: true },
    heroTagline: 'نبني بجودة تدوم',
    servicesLabel: 'خدماتنا',
    featuredLabel: 'أبرز أعمالنا',
    profileLabel: 'معلومات الشركة',
  },

  real_estate: {
    label: 'مسوق عقاري',
    portfolioLabel: 'العقارات',
    portfolioItemLabel: 'عقار',
    portfolioItemLabelPlural: 'عقارات',
    categories: ['شقق', 'فلل', 'تجاري', 'أراضي', 'مكاتب', 'محلات', 'مستودعات', 'فنادق'],
    extraFields: { price: true, area: true, status: true, bedrooms: true, tags: true },
    statusOptions: ['متاح', 'مباع', 'مؤجر', 'محجوز'],
    heroTagline: 'نجد لك بيت أحلامك',
    servicesLabel: 'خدماتنا',
    featuredLabel: 'عقارات مميزة',
    profileLabel: 'معلومات المكتب العقاري',
  },

  interior_design: {
    label: 'مصمم داخلي',
    portfolioLabel: 'الأعمال',
    portfolioItemLabel: 'تصميم',
    portfolioItemLabelPlural: 'تصاميم',
    categories: ['غرف معيشة', 'مطابخ', 'غرف نوم', 'حمامات', 'مكاتب', 'محلات تجارية', 'فنادق'],
    extraFields: { area: true, tags: true },
    heroTagline: 'نحوّل مساحتك إلى لوحة فنية',
    servicesLabel: 'خدماتنا',
    featuredLabel: 'أبرز تصاميمنا',
    profileLabel: 'معلومات الاستوديو',
  },

  photography: {
    label: 'مصور',
    portfolioLabel: 'معرض الأعمال',
    portfolioItemLabel: 'جلسة',
    portfolioItemLabelPlural: 'جلسات',
    categories: ['زفاف', 'عقيقة', 'منتجات', 'تجاري', 'طبيعة', 'بورتريه', 'معماري', 'رياضي'],
    extraFields: { tags: true },
    heroTagline: 'نجمّد اللحظات الجميلة إلى الأبد',
    servicesLabel: 'الباقات',
    featuredLabel: 'من أحدث أعمالي',
    profileLabel: 'معلومات المصور',
  },

  legal: {
    label: 'مكتب محاماة',
    portfolioLabel: 'القضايا',
    portfolioItemLabel: 'قضية',
    portfolioItemLabelPlural: 'قضايا',
    categories: ['عقود تجارية', 'قضايا عمالية', 'قضايا عائلية', 'ملكية فكرية', 'عقارات', 'جنائي'],
    extraFields: { tags: true },
    heroTagline: 'نحمي حقوقك بخبرة وأمانة',
    servicesLabel: 'التخصصات',
    featuredLabel: 'انتصاراتنا القانونية',
    profileLabel: 'معلومات المكتب',
  },

  medical: {
    label: 'عيادة / مركز طبي',
    portfolioLabel: 'الحالات',
    portfolioItemLabel: 'حالة',
    portfolioItemLabelPlural: 'حالات',
    categories: ['طب عام', 'أسنان', 'عيون', 'جلدية', 'نساء وولادة', 'أطفال', 'تجميل'],
    extraFields: { tags: true },
    heroTagline: 'صحتك أمانة في أيدٍ متخصصة',
    servicesLabel: 'التخصصات',
    featuredLabel: 'نتائجنا',
    profileLabel: 'معلومات العيادة',
  },

  general: {
    label: 'نشاط تجاري',
    portfolioLabel: 'الأعمال',
    portfolioItemLabel: 'عمل',
    portfolioItemLabelPlural: 'أعمال',
    categories: ['خدمات', 'منتجات', 'مشاريع', 'أخرى'],
    extraFields: { price: true, tags: true },
    heroTagline: 'جودة لا تُنافَس في كل ما نقدم',
    servicesLabel: 'خدماتنا',
    featuredLabel: 'أبرز أعمالنا',
    profileLabel: 'معلومات النشاط',
  },
}

export function getSectorConfig(sector: string | null | undefined): SectorConfig {
  return SECTOR_CONFIG[(sector as Sector) ?? 'engineering'] ?? SECTOR_CONFIG.engineering
}

export const ALL_SECTORS = Object.entries(SECTOR_CONFIG).map(([key, cfg]) => ({
  value: key as Sector,
  label: cfg.label,
}))
