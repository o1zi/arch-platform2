import { CustomThemeConfig } from '@/types'

/**
 * القالب الافتراضي الفاخر — يُستخدم عندما لا يكون للمكتب قالب مخصص
 * يمكن تخصيصه بالكامل عن طريق رفع ملف theme.json من لوحة الأدمن
 */
export const DEFAULT_THEME_CONFIG: CustomThemeConfig = {
  colors: {
    primary:         '#0f172a',   // أسود داكن
    secondary:       '#1e293b',   // رمادي داكن
    accent:          '#c9a84c',   // ذهبي
    accentSecondary: '#e2c97e',   // ذهبي فاتح
    background:      '#ffffff',   // أبيض
    text:            '#0f172a',   // أسود
    textLight:       '#64748b',   // رمادي
    cardBg:          '#f8fafc',   // رمادي فاتح جداً
    border:          '#e2e8f0',   // رمادي حدود
    navBg:           '#0f172a',   // أسود للناف
    navText:         '#ffffff',   // أبيض للناف
  },
  fonts: {
    heading:       'Playfair Display',
    body:          'Cairo',
    headingWeight: 700,
    bodyWeight:    400,
    bodySize:      'md',
    letterSpacing: 'normal',
    lineHeight:    'relaxed',
  },
  hero: {
    style:          'split',
    height:         'screen',
    overlayOpacity: 0.4,
    overlayStyle:   'gradient',
    textAlign:      'right',
    showLogo:       true,
    ctaPrimaryText:   'استعرض المشاريع',
    ctaSecondaryText: 'تواصل معنا',
    ctaStyle:        'solid',
    showScrollIndicator: true,
  },
  layout: {
    borderRadius: 'md',
    spacing:      'normal',
    maxWidth:     'normal',
    sections:     ['hero', 'about', 'services', 'projects', 'cta', 'footer'],
  },
  navigation: {
    style:    'transparent',
    height:   'normal',
    position: 'sticky',
    showBorder: false,
    logoSize:   'md',
    ctaInNav:   true,
  },
  projectsGrid: {
    columns:    3,
    style:      'grid',
    imageRatio: '4/3',
    hoverEffect: 'zoom',
    captionStyle: 'overlay',
  },
  cards: {
    style:       'elevated',
    padding:     'normal',
    iconShape:   'rounded',
    hoverEffect: 'lift',
  },
  buttons: {
    style:      'solid',
    size:       'md',
    glow:       false,
    uppercase:  false,
    hoverScale: true,
  },
  sections: {
    aboutLayout:    'side-by-side',
    aboutShowStats: true,
    servicesStyle:  'card-grid',
    ctaLayout:      'split',
    ctaBg:          'primary',
    footerColumns:  2,
    footerStyle:    'dark',
    footerShowSocial: true,
  },
  effects: {
    sectionFade:  true,
    hoverLift:    true,
    smoothScroll: true,
    projectZoom:  true,
    buttonScale:  true,
  },
  decorations: {
    sectionDivider:     'none',
    backgroundPattern:  'none',
    patternOpacity:     0.04,
    accentLine:         true,
    sectionBgAlt:       true,
  },
  contactStyle: {
    layout:    'side-by-side',
    cardStyle: 'bordered',
    socialStyle: 'pills',
    showWhatsappFloat: true,
    mapStyle:  'embedded',
  },
}
