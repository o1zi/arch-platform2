export type Sector =
  | 'engineering'
  | 'contractor'
  | 'real_estate'
  | 'interior_design'
  | 'photography'
  | 'legal'
  | 'medical'
  | 'general'

export interface ServiceItem {
  icon: string
  title: string
  desc: string
}

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
  cta: string
  ctaDesc: string
  aboutTitle: string
  services: ServiceItem[]
  features: ServiceItem[]
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
    cta: 'هل لديك مشروع؟',
    ctaDesc: 'دعنا نحوّل فكرتك إلى واقع',
    aboutTitle: 'نبني أحلامك بدقة وإبداع',
    services: [
      { icon: 'Building2', title: 'تصميم معماري', desc: 'تصميم مبدع وعملي يعكس هوية مكانك' },
      { icon: 'Layers', title: 'تصميم داخلي', desc: 'فضاءات داخلية أنيقة بتفصيل متقن' },
      { icon: 'Eye', title: 'إشراف على التنفيذ', desc: 'رقابة دقيقة تضمن أعلى معايير الجودة' },
      { icon: 'Lightbulb', title: 'استشارات هندسية', desc: 'حلول مبتكرة لكل تحديات مشروعك' },
      { icon: 'MapPin', title: 'تخطيط عمراني', desc: 'مجمعات ومدن تجمع الجمال والوظيفة' },
      { icon: 'ClipboardList', title: 'إدارة مشاريع', desc: 'تسليم في الوقت المحدد بأعلى كفاءة' },
    ],
    features: [
      { icon: 'Award', title: 'خبرة واسعة', desc: 'سنوات من الإبداع والتميز في مجال الهندسة' },
      { icon: 'Users', title: 'فريق متخصص', desc: 'مهندسون ومصممون بأعلى المؤهلات' },
      { icon: 'Clock', title: 'الالتزام بالمواعيد', desc: 'نلتزم بالجدول الزمني المتفق عليه دائماً' },
      { icon: 'Shield', title: 'جودة مضمونة', desc: 'معايير صارمة في كل مرحلة من مراحل التنفيذ' },
      { icon: 'Star', title: 'تصاميم مبتكرة', desc: 'حلول إبداعية تجمع الجمال والعملية' },
      { icon: 'CheckCircle2', title: 'متابعة مستمرة', desc: 'دعم كامل قبل وأثناء وبعد التنفيذ' },
    ],
  },

  contractor: {
    label: 'مقاول بناء',
    portfolioLabel: 'الأعمال',
    portfolioItemLabel: 'مشروع',
    portfolioItemLabelPlural: 'مشاريع',
    categories: ['بناء وإنشاء', 'تشطيبات', 'بنية تحتية', 'ترميم', 'صيانة', 'مستودعات'],
    extraFields: { area: true, tags: true },
    heroTagline: 'نبني بجودة تدوم للأجيال',
    servicesLabel: 'خدماتنا',
    featuredLabel: 'أبرز أعمالنا',
    profileLabel: 'معلومات الشركة',
    cta: 'هل لديك مشروع بناء؟',
    ctaDesc: 'نتولى تنفيذه من الصفر حتى التسليم',
    aboutTitle: 'نبني بجودة تدوم للأجيال',
    services: [
      { icon: 'HardHat', title: 'بناء وإنشاء', desc: 'تنفيذ المنشآت بأعلى معايير الجودة والمتانة' },
      { icon: 'Layers', title: 'تشطيبات وديكور', desc: 'تشطيبات فاخرة تضفي جمالاً استثنائياً' },
      { icon: 'Building2', title: 'بنية تحتية', desc: 'أعمال الطرق والمرافق والشبكات' },
      { icon: 'Wrench', title: 'ترميم وصيانة', desc: 'إعادة الحياة للمباني القديمة بكفاءة عالية' },
      { icon: 'ClipboardList', title: 'إدارة مشاريع', desc: 'تنسيق كامل من التصميم حتى التسليم' },
      { icon: 'Key', title: 'تسليم مفتاح', desc: 'تسلّم مشروعك جاهزاً بلا أي متاعب' },
    ],
    features: [
      { icon: 'Award', title: 'خبرة عشرات السنين', desc: 'سجل حافل من المشاريع الناجحة' },
      { icon: 'HardHat', title: 'معدات حديثة', desc: 'نعمل بأحدث المعدات والتقنيات' },
      { icon: 'DollarSign', title: 'التزام بالميزانية', desc: 'لا تكاليف مخفية — شفافية تامة في التسعير' },
      { icon: 'Shield', title: 'جودة المواد', desc: 'نستخدم أفضل مواد البناء المعتمدة' },
      { icon: 'Users', title: 'فريق متخصص', desc: 'عمالة ماهرة تحت إشراف مهندسين معتمدين' },
      { icon: 'CheckCircle2', title: 'ضمان الأعمال', desc: 'نضمن جودة العمل بعد التسليم' },
    ],
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
    cta: 'هل تبحث عن عقار؟',
    ctaDesc: 'نساعدك في إيجاد ما تبحث عنه بأفضل الأسعار',
    aboutTitle: 'نجد لك بيت أحلامك',
    services: [
      { icon: 'Home', title: 'بيع العقارات', desc: 'نسوّق عقارك للمشترين المناسبين بأعلى سعر' },
      { icon: 'Key', title: 'شراء العقارات', desc: 'نجد لك الخيار الأمثل ضمن ميزانيتك' },
      { icon: 'Building2', title: 'تأجير العقارات', desc: 'نربطك بمستأجرين موثوقين بسرعة وأمان' },
      { icon: 'ClipboardList', title: 'إدارة الأملاك', desc: 'ندير عقاراتك بالكامل نيابةً عنك' },
      { icon: 'TrendingUp', title: 'تقييم عقاري', desc: 'تقييم دقيق يعكس القيمة الحقيقية لعقارك' },
      { icon: 'DollarSign', title: 'استشارات استثمارية', desc: 'نرشدك لأفضل الفرص العقارية المربحة' },
    ],
    features: [
      { icon: 'Award', title: 'خبرة في السوق', desc: 'معرفة عميقة بأسعار وتوجهات السوق العقاري' },
      { icon: 'Home', title: 'قاعدة عقارات واسعة', desc: 'مئات الخيارات السكنية والتجارية' },
      { icon: 'Users', title: 'تفاوض احترافي', desc: 'نتفاوض عنك للحصول على أفضل سعر' },
      { icon: 'Shield', title: 'شفافية تامة', desc: 'لا عمولات خفية — كل شيء واضح من البداية' },
      { icon: 'CheckCircle2', title: 'حتى التوثيق', desc: 'متابعة كاملة من العرض حتى توقيع العقد' },
      { icon: 'Star', title: 'خدمة ما بعد البيع', desc: 'نبقى معك حتى بعد إتمام الصفقة' },
    ],
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
    cta: 'هل تريد تجديد مساحتك؟',
    ctaDesc: 'نصمم لك بيئة تعكس ذوقك وشخصيتك',
    aboutTitle: 'نحوّل مساحتك إلى لوحة فنية',
    services: [
      { icon: 'Palette', title: 'تصميم المعيشة', desc: 'غرف معيشة دافئة تجمع الأسرة بأناقة' },
      { icon: 'Layers', title: 'تصميم المطابخ', desc: 'مطابخ عملية وجميلة تلبي كل احتياجاتك' },
      { icon: 'Star', title: 'غرف النوم', desc: 'أجواء هادئة تمنحك راحة نوم مثالية' },
      { icon: 'Building2', title: 'ديكور تجاري', desc: 'مساحات أعمال تعكس احترافية علامتك' },
      { icon: 'Eye', title: 'تصور ثلاثي الأبعاد', desc: 'شاهد تصميمك قبل التنفيذ بواقعية مذهلة' },
      { icon: 'CheckCircle2', title: 'إشراف على التنفيذ', desc: 'نضمن تطابق التنفيذ مع التصميم بدقة تامة' },
    ],
    features: [
      { icon: 'Palette', title: 'إبداع بلا حدود', desc: 'أفكار مبتكرة تتخطى المألوف في كل مشروع' },
      { icon: 'Award', title: 'مواد فاخرة', desc: 'نختار أجود الخامات التي تدوم طويلاً' },
      { icon: 'DollarSign', title: 'احترام الميزانية', desc: 'نوفر لك أجمل النتائج ضمن ميزانيتك' },
      { icon: 'Clock', title: 'تسليم في الوقت', desc: 'نلتزم بالجدول الزمني دون تأخير' },
      { icon: 'Eye', title: 'تصميم ثلاثي الأبعاد', desc: 'معاينة واقعية قبل أي تنفيذ' },
      { icon: 'CheckCircle2', title: 'متابعة حتى النهاية', desc: 'نبقى معك في كل خطوة حتى التسليم' },
    ],
  },

  photography: {
    label: 'مصور',
    portfolioLabel: 'معرض الأعمال',
    portfolioItemLabel: 'جلسة',
    portfolioItemLabelPlural: 'جلسات',
    categories: ['زفاف', 'عقيقة', 'منتجات', 'تجاري', 'طبيعة', 'بورتريه', 'معماري', 'رياضي'],
    extraFields: { tags: true },
    heroTagline: 'نجمّد لحظاتك الجميلة إلى الأبد',
    servicesLabel: 'الباقات',
    featuredLabel: 'من أحدث أعمالي',
    profileLabel: 'معلومات المصور',
    cta: 'هل تريد حجز جلسة تصوير؟',
    ctaDesc: 'نجمّد لحظاتك الجميلة بعدسة احترافية',
    aboutTitle: 'نجمّد لحظاتك الجميلة إلى الأبد',
    services: [
      { icon: 'Camera', title: 'تصوير الزفاف', desc: 'نوثّق يومك الأجمل بكل تفصيلة' },
      { icon: 'Star', title: 'جلسات بورتريه', desc: 'صور احترافية تبرز شخصيتك بأفضل صورة' },
      { icon: 'Building2', title: 'تصوير منتجات', desc: 'صور جذابة ترفع مبيعاتك وتبرز منتجاتك' },
      { icon: 'Globe', title: 'تصوير معماري', desc: 'نبرز جمال مبانيك ومساحاتك بزوايا مدروسة' },
      { icon: 'Layers', title: 'فيديو وريلز', desc: 'محتوى مرئي يجذب الجمهور ويعزز تواجدك' },
      { icon: 'Eye', title: 'تصوير تجاري', desc: 'محتوى احترافي لحملاتك الإعلانية' },
    ],
    features: [
      { icon: 'Camera', title: 'معدات احترافية', desc: 'أحدث كاميرات وعدسات للحصول على أفضل نتيجة' },
      { icon: 'Award', title: 'خبرة واسعة', desc: 'آلاف الجلسات الناجحة وعملاء راضون' },
      { icon: 'Clock', title: 'تسليم سريع', desc: 'تستلم صورك المعدّلة في أقصر وقت' },
      { icon: 'Star', title: 'تعديل احترافي', desc: 'ريتوش وتلوين يمنح صورك طابعاً مميزاً' },
      { icon: 'DollarSign', title: 'أسعار تنافسية', desc: 'باقات مرنة تناسب جميع الميزانيات' },
      { icon: 'CheckCircle2', title: 'أساليب متعددة', desc: 'من الكلاسيكي للعصري — نتكيف مع رؤيتك' },
    ],
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
    cta: 'هل تحتاج استشارة قانونية؟',
    ctaDesc: 'نحمي حقوقك بكل قوة القانون',
    aboutTitle: 'نحمي حقوقك بكل قوة القانون',
    services: [
      { icon: 'Briefcase', title: 'قضايا تجارية', desc: 'نمثلك في النزاعات التجارية بقوة واحترافية' },
      { icon: 'Users', title: 'قانون العمل', desc: 'حماية حقوق أصحاب العمل والموظفين' },
      { icon: 'Home', title: 'قانون الأسرة', desc: 'تسوية قضايا الزواج والطلاق والميراث' },
      { icon: 'FileText', title: 'صياغة العقود', desc: 'عقود محكمة تحمي مصالحك من البداية' },
      { icon: 'Building2', title: 'نزاعات عقارية', desc: 'نسترد حقوقك في الأصول والممتلكات' },
      { icon: 'Shield', title: 'قانون جنائي', desc: 'دفاع قوي يكفل حقوقك القانونية الكاملة' },
    ],
    features: [
      { icon: 'Award', title: 'خبرة قانونية واسعة', desc: 'محامون معتمدون بسجل انتصارات حافل' },
      { icon: 'Shield', title: 'سرية تامة', desc: 'معلوماتك القانونية في أمان تام معنا' },
      { icon: 'Star', title: 'تمثيل قوي', desc: 'نمثلك بقوة ومهنية أمام المحاكم' },
      { icon: 'Lightbulb', title: 'معرفة بالأنظمة', desc: 'نواكب أحدث التشريعات والأنظمة الجديدة' },
      { icon: 'Users', title: 'فريق من المحامين', desc: 'تخصصات متعددة تغطي كل احتياجاتك' },
      { icon: 'Clock', title: 'متابعة القضايا', desc: 'نبقيك على اطلاع بكل مستجد في قضيتك' },
    ],
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
    cta: 'هل تحتاج استشارة طبية؟',
    ctaDesc: 'صحتك بأيدٍ متخصصة وأمينة',
    aboutTitle: 'صحتك أمانة نؤديها بإخلاص',
    services: [
      { icon: 'Stethoscope', title: 'كشف وتشخيص', desc: 'تشخيص دقيق باستخدام أحدث الأجهزة الطبية' },
      { icon: 'ClipboardList', title: 'متابعة مزمنة', desc: 'رعاية مستمرة للحالات المزمنة بعناية فائقة' },
      { icon: 'Star', title: 'إجراءات تجميلية', desc: 'تجميل طبي آمن بنتائج طبيعية ومبهجة' },
      { icon: 'Shield', title: 'رعاية وقائية', desc: 'الوقاية خير من العلاج — نصحبك في رحلتك الصحية' },
      { icon: 'Eye', title: 'تحاليل ومختبر', desc: 'تحاليل دقيقة وفحوصات شاملة في زمن قياسي' },
      { icon: 'Lightbulb', title: 'استشارات طبية', desc: 'إجابات واضحة لكل أسئلتك الصحية' },
    ],
    features: [
      { icon: 'Award', title: 'طاقم طبي متخصص', desc: 'أطباء ذوو خبرة واعتماد دولي' },
      { icon: 'Layers', title: 'أجهزة حديثة', desc: 'أحدث التقنيات الطبية لدقة أعلى في التشخيص' },
      { icon: 'Shield', title: 'بيئة معقمة', desc: 'معايير النظافة والتعقيم الصارمة في كل لحظة' },
      { icon: 'Star', title: 'رعاية شاملة', desc: 'اهتمام كامل بحالتك من الدخول حتى الشفاء' },
      { icon: 'Clock', title: 'حجز سريع', desc: 'لا انتظار طويل — نقدّر وقتك' },
      { icon: 'CheckCircle2', title: 'أسعار مناسبة', desc: 'جودة طبية عالية بأسعار تناسب الجميع' },
    ],
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
    cta: 'هل تحتاج خدماتنا؟',
    ctaDesc: 'نقدم لك أفضل الحلول لنشاطك التجاري',
    aboutTitle: 'جودة لا تُنافَس في كل ما نقدم',
    services: [
      { icon: 'Lightbulb', title: 'استشارات', desc: 'نرشدك بخبرة حقيقية لأفضل القرارات' },
      { icon: 'ClipboardList', title: 'تنفيذ المشاريع', desc: 'ننفذ أفكارك بكفاءة واحترافية عالية' },
      { icon: 'TrendingUp', title: 'تطوير الأعمال', desc: 'نساعدك في تنمية نشاطك وتوسيع قاعدة عملائك' },
      { icon: 'CheckCircle2', title: 'خدمات ما بعد البيع', desc: 'نظل معك بعد الانتهاء لضمان رضاك التام' },
      { icon: 'Users', title: 'شراكات أعمال', desc: 'نبني معك علاقات تجارية مثمرة وطويلة الأمد' },
      { icon: 'Globe', title: 'حلول متكاملة', desc: 'نقدم حلولاً شاملة تناسب جميع احتياجات نشاطك' },
    ],
    features: [
      { icon: 'Award', title: 'خبرة متعددة', desc: 'نخدم قطاعات متنوعة بكفاءة عالية' },
      { icon: 'Star', title: 'جودة عالية', desc: 'معايير صارمة في كل خطوة من خطوات العمل' },
      { icon: 'DollarSign', title: 'أسعار تنافسية', desc: 'قيمة حقيقية مقابل كل ريال تدفعه' },
      { icon: 'Clock', title: 'الالتزام بالمواعيد', desc: 'نسلّم في الوقت المحدد دون استثناء' },
      { icon: 'Lightbulb', title: 'حلول مبتكرة', desc: 'نفكر خارج الصندوق لتقديم نتائج مميزة' },
      { icon: 'CheckCircle2', title: 'دعم مستمر', desc: 'فريقنا في خدمتك على مدار الساعة' },
    ],
  },
}

export function getSectorConfig(sector: string | null | undefined): SectorConfig {
  return SECTOR_CONFIG[(sector as Sector) ?? 'engineering'] ?? SECTOR_CONFIG.engineering
}

export const ALL_SECTORS = Object.entries(SECTOR_CONFIG).map(([key, cfg]) => ({
  value: key as Sector,
  label: cfg.label,
}))
