'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CustomThemeConfig, CustomTheme } from '@/types'
import { DEFAULT_THEME_CONFIG } from '@/lib/default-theme'
import { toast } from 'sonner'
import { Save, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import Link from 'next/link'

// ══════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════════════════════

const HEADING_FONTS = [
  // Luxury Serif
  'Playfair Display', 'Cormorant Garamond', 'Cinzel', 'DM Serif Display',
  'Libre Baskerville', 'Lora', 'Source Serif 4', 'Crimson Pro', 'Spectral',
  // Modern Sans
  'Josefin Sans', 'Raleway', 'Montserrat', 'Bebas Neue', 'Poppins',
  'Plus Jakarta Sans', 'Inter', 'Outfit', 'Jost', 'DM Sans',
  'Space Grotesk', 'Syne', 'Barlow', 'Albert Sans', 'Tenor Sans',
  // Arabic
  'Cairo', 'Tajawal', 'Almarai', 'Readex Pro', 'Noto Kufi Arabic', 'IBM Plex Sans Arabic',
]

const BODY_FONTS = [
  // Arabic first
  'Cairo', 'Tajawal', 'Almarai', 'Readex Pro', 'IBM Plex Sans Arabic',
  'Noto Kufi Arabic', 'Noto Naskh Arabic', 'El Messiri',
  // Latin
  'Poppins', 'Inter', 'Plus Jakarta Sans', 'Outfit', 'Raleway',
  'DM Sans', 'Jost', 'Barlow', 'Lora', 'Source Serif 4',
]

const TABS = [
  { id: 'basics',   label: 'الأساسيات', emoji: '⚙️' },
  { id: 'colors',   label: 'الألوان',   emoji: '🎨' },
  { id: 'fonts',    label: 'الخطوط',    emoji: '🔤' },
  { id: 'hero',     label: 'الهيرو',    emoji: '🖼️' },
  { id: 'layout',   label: 'التخطيط',   emoji: '📐' },
  { id: 'nav',      label: 'التنقل',    emoji: '🔗' },
  { id: 'projects', label: 'المشاريع',  emoji: '🏗️' },
  { id: 'cards',    label: 'البطاقات',  emoji: '🃏' },
  { id: 'effects',  label: 'التأثيرات', emoji: '✨' },
  { id: 'contact',  label: 'التواصل',   emoji: '📞' },
  { id: 'identity', label: 'الهوية',    emoji: '🎭' },
]

const PALETTES = [
  {
    name: 'فاخر داكن', emoji: '⬛',
    primary: '#0a0a0a', secondary: '#111111', accent: '#c9a84c', accentSecondary: '#e2c97e',
    background: '#0a0a0a', text: '#f5f5f0', textLight: '#888880',
    cardBg: '#111111', border: '#2a2a2a', navBg: '#000000', navText: '#ffffff',
  },
  {
    name: 'أبيض عصري', emoji: '⬜',
    primary: '#1e293b', secondary: '#334155', accent: '#2563eb', accentSecondary: '#60a5fa',
    background: '#ffffff', text: '#0f172a', textLight: '#64748b',
    cardBg: '#f8fafc', border: '#e2e8f0', navBg: '#1e293b', navText: '#ffffff',
  },
  {
    name: 'جريء أحمر', emoji: '🔴',
    primary: '#0c0c0c', secondary: '#1a1a1a', accent: '#ef4444', accentSecondary: '#f87171',
    background: '#000000', text: '#ffffff', textLight: '#a1a1aa',
    cardBg: '#111111', border: '#27272a', navBg: '#000000', navText: '#ffffff',
  },
  {
    name: 'كريمي كلاسيك', emoji: '🟤',
    primary: '#2c1a0e', secondary: '#3d2b1a', accent: '#8b5e3c', accentSecondary: '#c9a484',
    background: '#fdf8f0', text: '#2c1a0e', textLight: '#7c6655',
    cardBg: '#f5efe3', border: '#e8d5c0', navBg: '#2c1a0e', navText: '#fdf8f0',
  },
  {
    name: 'بحري فاخر', emoji: '🔵',
    primary: '#0f2044', secondary: '#1a3466', accent: '#c9a84c', accentSecondary: '#e2c97e',
    background: '#ffffff', text: '#0f2044', textLight: '#4a6080',
    cardBg: '#f0f4fa', border: '#c5d5e8', navBg: '#0f2044', navText: '#ffffff',
  },
  {
    name: 'أخضر طبيعي', emoji: '🟢',
    primary: '#1a3d2b', secondary: '#254d37', accent: '#7fb069', accentSecondary: '#a3c990',
    background: '#fafaf8', text: '#1a2e1a', textLight: '#4a6e4a',
    cardBg: '#f0f5ee', border: '#c8dfc0', navBg: '#1a3d2b', navText: '#ffffff',
  },
  {
    name: 'بنفسجي ملكي', emoji: '🟣',
    primary: '#1e0a3c', secondary: '#2d1259', accent: '#9b59b6', accentSecondary: '#c39bd3',
    background: '#faf7ff', text: '#1e0a3c', textLight: '#6c4a8a',
    cardBg: '#f3eeff', border: '#d8c5f0', navBg: '#1e0a3c', navText: '#ffffff',
  },
  {
    name: 'رمادي تيتانيوم', emoji: '⚫',
    primary: '#18181b', secondary: '#27272a', accent: '#71717a', accentSecondary: '#a1a1aa',
    background: '#fafafa', text: '#09090b', textLight: '#71717a',
    cardBg: '#f4f4f5', border: '#e4e4e7', navBg: '#18181b', navText: '#fafafa',
  },
  {
    name: 'وردي راقٍ', emoji: '🌸',
    primary: '#1a0a14', secondary: '#2d1428', accent: '#db2777', accentSecondary: '#f472b6',
    background: '#fff1f7', text: '#1a0a14', textLight: '#9d174d',
    cardBg: '#fce7f3', border: '#fbcfe8', navBg: '#1a0a14', navText: '#ffffff',
  },
  {
    name: 'برتقالي جريء', emoji: '🟠',
    primary: '#0f0800', secondary: '#1a1000', accent: '#ea580c', accentSecondary: '#f97316',
    background: '#fff7ed', text: '#0f0800', textLight: '#92400e',
    cardBg: '#fff3e0', border: '#fed7aa', navBg: '#0f0800', navText: '#ffffff',
  },
  {
    name: 'فيروزي مائي', emoji: '🩵',
    primary: '#0a2233', secondary: '#0f3347', accent: '#0891b2', accentSecondary: '#22d3ee',
    background: '#f0fdfe', text: '#0a2233', textLight: '#0e7490',
    cardBg: '#ecfeff', border: '#a5f3fc', navBg: '#0a2233', navText: '#ffffff',
  },
  {
    name: 'بني أرضي', emoji: '🌿',
    primary: '#2d1b0e', secondary: '#3d2a18', accent: '#b45309', accentSecondary: '#d97706',
    background: '#fffbf5', text: '#2d1b0e', textLight: '#78350f',
    cardBg: '#fef3c7', border: '#fde68a', navBg: '#2d1b0e', navText: '#fef3c7',
  },
]

// ══════════════════════════════════════════════════════════════════════════════
// PRESETS — 5 نماذج جاهزة مختلفة كلياً
// ══════════════════════════════════════════════════════════════════════════════

interface Preset {
  id: string
  name: string
  tag: string
  description: string
  mood: string
  badges: string[]
  config: CustomThemeConfig
}

const PRESETS: Preset[] = [
  // ─── 1. الفاخر الداكن ────────────────────────────────────────────────────
  {
    id: 'luxury-dark',
    name: 'الفاخر الداكن',
    tag: 'LUXURY DARK',
    description: 'أسود عميق مع ذهب ملكي — للمكاتب الراقية التي تبيع تميّزاً',
    mood: 'حصري · فاخر · احترافي',
    badges: ['Playfair Display', 'ذهبي', 'هيرو سينمائي', 'بطاقات زجاجية'],
    config: {
      colors: {
        primary: '#050505', secondary: '#0f0f0f', accent: '#c9a84c',
        accentSecondary: '#e2c97e', background: '#0a0a0a', text: '#f5f0e8',
        textLight: '#888070', cardBg: '#111111', border: '#252520',
        navBg: '#000000', navText: '#f5f0e8',
      },
      fonts: { heading: 'Playfair Display', body: 'Cairo', headingWeight: 700, bodyWeight: 300, bodySize: 'md', letterSpacing: 'wide', lineHeight: 'relaxed' },
      hero: { style: 'fullscreen', height: 'screen', overlayOpacity: 0.5, overlayStyle: 'radial', textAlign: 'center', showLogo: true, ctaPrimaryText: 'استعرض الأعمال', ctaSecondaryText: 'تواصل معنا', ctaStyle: 'gradient', showScrollIndicator: true, tagOverride: 'مكتب هندسي متميز' },
      layout: { borderRadius: 'none', spacing: 'spacious', maxWidth: 'wide', sections: ['hero', 'about', 'services', 'projects', 'cta', 'footer'] },
      navigation: { style: 'glass', height: 'normal', position: 'sticky', showBorder: true, logoSize: 'md', ctaInNav: true },
      projectsGrid: { columns: 3, style: 'masonry', imageRatio: '3/4', hoverEffect: 'zoom', captionStyle: 'overlay' },
      cards: { style: 'glass', padding: 'large', iconShape: 'none', hoverEffect: 'glow', accentBar: 'top' },
      buttons: { style: 'gradient', size: 'lg', glow: true, uppercase: true, hoverScale: true },
      sections: { aboutLayout: 'stacked', aboutShowStats: true, servicesStyle: 'card-grid', ctaLayout: 'centered', ctaBg: 'accent', footerColumns: 3, footerStyle: 'dark', footerShowSocial: true },
      effects: { sectionFade: true, hoverLift: true, smoothScroll: true, projectZoom: true, buttonScale: true },
      decorations: { sectionDivider: 'wave', backgroundPattern: 'none', patternOpacity: 0.03, accentLine: true, sectionBgAlt: false, cardCornerDot: true },
      contactStyle: { layout: 'centered', cardStyle: 'glass', socialStyle: 'icons', showWhatsappFloat: true, mapStyle: 'embedded' },
      visualPreset: { themeMood: 'فاخر داكن', density: 'normal', contrast: 'high' },
    },
  },

  // ─── 2. العصري النظيف ────────────────────────────────────────────────────
  {
    id: 'modern-clean',
    name: 'العصري النظيف',
    tag: 'MODERN CLEAN',
    description: 'أبيض ناصع وأزرق جريء — بساطة احترافية تناسب كل العملاء',
    mood: 'نظيف · واضح · عصري',
    badges: ['Raleway', 'أزرق', 'هيرو مقسم', 'بطاقات مرفوعة'],
    config: {
      colors: {
        primary: '#1e293b', secondary: '#334155', accent: '#2563eb',
        accentSecondary: '#60a5fa', background: '#ffffff', text: '#0f172a',
        textLight: '#64748b', cardBg: '#f8fafc', border: '#e2e8f0',
        navBg: '#1e293b', navText: '#ffffff',
      },
      fonts: { heading: 'Raleway', body: 'Tajawal', headingWeight: 700, bodyWeight: 400, bodySize: 'md', letterSpacing: 'normal', lineHeight: 'relaxed' },
      hero: { style: 'split', height: 'tall', overlayOpacity: 0.3, overlayStyle: 'gradient', textAlign: 'right', showLogo: true, ctaPrimaryText: 'مشاريعنا', ctaSecondaryText: 'تواصل', ctaStyle: 'solid', showScrollIndicator: true },
      layout: { borderRadius: 'lg', spacing: 'normal', maxWidth: 'normal', sections: ['hero', 'services', 'projects', 'cta', 'footer'] },
      navigation: { style: 'solid', height: 'normal', position: 'sticky', showBorder: false, logoSize: 'md', ctaInNav: true },
      projectsGrid: { columns: 3, style: 'grid', imageRatio: '4/3', hoverEffect: 'zoom', captionStyle: 'below' },
      cards: { style: 'elevated', padding: 'normal', iconShape: 'rounded', hoverEffect: 'lift', accentBar: 'none' },
      buttons: { style: 'solid', size: 'md', glow: false, uppercase: false, hoverScale: true },
      sections: { aboutLayout: 'side-by-side', aboutShowStats: true, servicesStyle: 'card-grid', ctaLayout: 'split', ctaBg: 'primary', footerColumns: 2, footerStyle: 'dark', footerShowSocial: true },
      effects: { sectionFade: true, hoverLift: true, smoothScroll: true, projectZoom: true, buttonScale: true },
      decorations: { sectionDivider: 'none', backgroundPattern: 'none', patternOpacity: 0.04, accentLine: true, sectionBgAlt: true },
      contactStyle: { layout: 'side-by-side', cardStyle: 'bordered', socialStyle: 'pills', showWhatsappFloat: true, mapStyle: 'embedded' },
      visualPreset: { themeMood: 'عصري نظيف', density: 'normal', contrast: 'normal' },
    },
  },

  // ─── 3. الجريء والقوي ────────────────────────────────────────────────────
  {
    id: 'bold-power',
    name: 'الجريء والقوي',
    tag: 'BOLD POWER',
    description: 'أسود مع أحمر صارخ — لمن يريد أن يُرى ولا يُنسى أبداً',
    mood: 'جريء · صارخ · مبدع',
    badges: ['Bebas Neue', 'أحمر', 'هيرو مركزي', 'بطاقات محددة'],
    config: {
      colors: {
        primary: '#0c0c0c', secondary: '#1a1a1a', accent: '#ef4444',
        accentSecondary: '#f97316', background: '#050505', text: '#f5f5f5',
        textLight: '#a1a1aa', cardBg: '#111111', border: '#27272a',
        navBg: '#000000', navText: '#ffffff',
      },
      fonts: { heading: 'Bebas Neue', body: 'Almarai', headingWeight: 400, bodyWeight: 400, bodySize: 'md', letterSpacing: 'wider', lineHeight: 'normal' },
      hero: { style: 'centered', height: 'screen', overlayOpacity: 0.6, overlayStyle: 'diagonal', textAlign: 'center', showLogo: true, ctaPrimaryText: 'اكتشف أعمالنا', ctaSecondaryText: 'ابدأ معنا', ctaStyle: 'solid', showScrollIndicator: false, tagOverride: '● نصمم المستقبل ●' },
      layout: { borderRadius: 'none', spacing: 'compact', maxWidth: 'wide', sections: ['hero', 'services', 'projects', 'cta', 'footer'] },
      navigation: { style: 'solid', height: 'compact', position: 'sticky', showBorder: true, logoSize: 'sm', ctaInNav: true },
      projectsGrid: { columns: 2, style: 'masonry', imageRatio: 'square', hoverEffect: 'zoom', captionStyle: 'overlay' },
      cards: { style: 'bordered', padding: 'normal', iconShape: 'none', hoverEffect: 'glow', accentBar: 'left' },
      buttons: { style: 'pill', size: 'lg', glow: true, uppercase: true, hoverScale: true },
      sections: { aboutLayout: 'stacked', aboutShowStats: true, servicesStyle: 'numbered', ctaLayout: 'centered', ctaBg: 'accent', footerColumns: 2, footerStyle: 'dark', footerShowSocial: true },
      effects: { sectionFade: false, hoverLift: false, smoothScroll: true, projectZoom: true, buttonScale: true, pulseAccent: true },
      decorations: { sectionDivider: 'slash', backgroundPattern: 'grid', patternOpacity: 0.03, accentLine: false, sectionBgAlt: false, sectionLabel: true },
      contactStyle: { layout: 'grid', cardStyle: 'filled', socialStyle: 'icons', showWhatsappFloat: true, mapStyle: 'button' },
      visualPreset: { themeMood: 'جريء وقوي', density: 'rich', contrast: 'high' },
    },
  },

  // ─── 4. الكلاسيكي الرصين ─────────────────────────────────────────────────
  {
    id: 'classic-dignity',
    name: 'الكلاسيكي الرصين',
    tag: 'CLASSIC',
    description: 'كريمي دافئ وبني أنيق — للمكاتب ذات التاريخ والمكانة العريقة',
    mood: 'راسخ · موثوق · تقليدي راقٍ',
    badges: ['Cormorant Garamond', 'ذهبي دافئ', 'هيرو بسيط', 'بطاقات مسطحة'],
    config: {
      colors: {
        primary: '#2c1a0e', secondary: '#3d2b1a', accent: '#8b5e3c',
        accentSecondary: '#c9a484', background: '#fdf8f0', text: '#2c1a0e',
        textLight: '#7c6655', cardBg: '#f5efe3', border: '#e8d5c0',
        navBg: '#2c1a0e', navText: '#fdf8f0',
      },
      fonts: { heading: 'Cormorant Garamond', body: 'Cairo', headingWeight: 700, bodyWeight: 400, bodySize: 'md', letterSpacing: 'normal', lineHeight: 'loose' },
      hero: { style: 'minimal', height: 'tall', overlayOpacity: 0.1, overlayStyle: 'flat', textAlign: 'right', showLogo: true, ctaPrimaryText: 'معرض المشاريع', ctaSecondaryText: 'تواصل معنا', ctaStyle: 'outline', showScrollIndicator: false },
      layout: { borderRadius: 'sm', spacing: 'spacious', maxWidth: 'narrow', sections: ['hero', 'about', 'services', 'projects', 'cta', 'footer'] },
      navigation: { style: 'bordered', height: 'tall', position: 'sticky', showBorder: true, logoSize: 'lg', ctaInNav: false },
      projectsGrid: { columns: 2, style: 'grid', imageRatio: '4/3', hoverEffect: 'none', captionStyle: 'below' },
      cards: { style: 'flat', padding: 'large', iconShape: 'rounded', hoverEffect: 'none', accentBar: 'right' },
      buttons: { style: 'outline', size: 'md', glow: false, uppercase: false, hoverScale: false },
      sections: { aboutLayout: 'side-by-side', aboutShowStats: false, servicesStyle: 'icon-list', ctaLayout: 'centered', ctaBg: 'primary', footerColumns: 2, footerStyle: 'dark', footerShowSocial: false },
      effects: { sectionFade: false, hoverLift: false, smoothScroll: true, projectZoom: false, buttonScale: false },
      decorations: { sectionDivider: 'dots-row', backgroundPattern: 'none', patternOpacity: 0.04, accentLine: true, sectionBgAlt: true },
      contactStyle: { layout: 'list', cardStyle: 'flat', socialStyle: 'text', showWhatsappFloat: false, mapStyle: 'embedded' },
      visualPreset: { themeMood: 'كلاسيكي رصين', density: 'minimal', contrast: 'low' },
    },
  },

  // ─── 5. البحري الفاخر ────────────────────────────────────────────────────
  {
    id: 'navy-gold',
    name: 'البحري الفاخر',
    tag: 'NAVY GOLD',
    description: 'كحلي داكن مع ذهب ملكي — هيبة الشركات الكبرى وثقة المؤسسات',
    mood: 'مهيب · مؤسسي · ثقة عالية',
    badges: ['Montserrat', 'ذهبي كحلي', 'هيرو معكوس', 'بطاقات زجاجية'],
    config: {
      colors: {
        primary: '#0f2044', secondary: '#1a3466', accent: '#c9a84c',
        accentSecondary: '#e2c97e', background: '#ffffff', text: '#0f2044',
        textLight: '#4a6080', cardBg: '#f0f4fa', border: '#c5d5e8',
        navBg: '#0f2044', navText: '#ffffff',
      },
      fonts: { heading: 'Montserrat', body: 'Readex Pro', headingWeight: 700, bodyWeight: 400, bodySize: 'md', letterSpacing: 'wide', lineHeight: 'relaxed' },
      hero: { style: 'split-reverse', height: 'tall', overlayOpacity: 0.4, overlayStyle: 'gradient', textAlign: 'right', showLogo: true, ctaPrimaryText: 'أعمالنا المميزة', ctaSecondaryText: 'اتصل بنا', ctaStyle: 'gradient', showScrollIndicator: true, tagOverride: 'خبرة تمتد لعقود' },
      layout: { borderRadius: 'md', spacing: 'normal', maxWidth: 'normal', sections: ['hero', 'about', 'services', 'projects', 'cta', 'footer'] },
      navigation: { style: 'solid', height: 'normal', position: 'sticky', showBorder: false, logoSize: 'md', ctaInNav: true },
      projectsGrid: { columns: 3, style: 'grid', imageRatio: '4/3', hoverEffect: 'zoom', captionStyle: 'overlay' },
      cards: { style: 'glass', padding: 'normal', iconShape: 'circle', hoverEffect: 'lift', accentBar: 'bottom' },
      buttons: { style: 'gradient', size: 'md', glow: false, uppercase: false, hoverScale: true },
      sections: { aboutLayout: 'side-by-side', aboutShowStats: true, servicesStyle: 'card-grid', ctaLayout: 'split', ctaBg: 'gradient', footerColumns: 3, footerStyle: 'dark', footerShowSocial: true },
      effects: { sectionFade: true, hoverLift: true, smoothScroll: true, projectZoom: true, buttonScale: false },
      decorations: { sectionDivider: 'none', backgroundPattern: 'dots', patternOpacity: 0.03, accentLine: true, sectionBgAlt: true },
      contactStyle: { layout: 'side-by-side', cardStyle: 'glass', socialStyle: 'pills', showWhatsappFloat: true, mapStyle: 'embedded' },
      visualPreset: { themeMood: 'بحري فاخر', density: 'normal', contrast: 'normal' },
    },
  },
]

// ── Mini Preview for each preset ────────────────────────────────────────────

function PresetMiniPreview({ preset }: { preset: Preset }) {
  const c = preset.config.colors
  const f = preset.config.fonts
  const h = preset.config.hero
  const hFont = `'${f.heading}', serif`
  const bFont = `'${f.body}', sans-serif`
  const acc = c.accent
  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.heading)}:wght@400;700&family=${encodeURIComponent(f.body)}:wght@400&display=swap`

  const btnBg = preset.config.buttons.style === 'gradient'
    ? `linear-gradient(135deg, ${acc}, ${c.accentSecondary ?? acc})`
    : acc
  const btnR = preset.config.layout.borderRadius === 'none' ? '0' : preset.config.buttons.style === 'pill' ? '9999px' : '6px'
  const cardBg = preset.config.cards.style === 'glass'
    ? `${c.cardBg ?? '#fff'}cc`
    : preset.config.cards.style === 'filled'
    ? c.secondary
    : preset.config.cards.style === 'flat'
    ? (c.cardBg ?? c.background)
    : (c.cardBg ?? c.background)
  const cardBorder = preset.config.cards.style === 'bordered'
    ? `1.5px solid ${c.border ?? '#e2e8f0'}`
    : preset.config.cards.style === 'flat'
    ? 'none'
    : preset.config.cards.style === 'glass'
    ? `1px solid ${c.border ?? '#e2e8f0'}60`
    : `1px solid ${c.border ?? '#e2e8f0'}`
  const cardShadow = preset.config.cards.style === 'elevated' ? '0 4px 18px rgba(0,0,0,0.1)' : 'none'
  const heroIsSplit = h.style === 'split' || h.style === 'split-reverse'
  const heroBg = h.style === 'minimal' ? c.background : c.primary

  return (
    <div style={{ width: '100%', aspectRatio: '16/10', overflow: 'hidden', borderRadius: 6, position: 'relative', fontFamily: bFont, userSelect: 'none' }}>
      <style>{`@import url('${fontUrl}');`}</style>
      {/* Nav */}
      <div style={{ height: 14, backgroundColor: c.navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: acc }} />
          <div style={{ width: 22, height: 3, borderRadius: 2, backgroundColor: `${c.navText ?? '#fff'}90` }} />
        </div>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <div style={{ width: 12, height: 2, borderRadius: 2, backgroundColor: `${c.navText ?? '#fff'}50` }} />
          <div style={{ width: 12, height: 2, borderRadius: 2, backgroundColor: `${c.navText ?? '#fff'}50` }} />
          <div style={{ padding: '1px 5px', borderRadius: btnR, background: btnBg, fontSize: 5, color: '#fff', fontFamily: bFont }}>●</div>
        </div>
      </div>
      {/* Hero */}
      {heroIsSplit ? (
        <div style={{ display: 'flex', flexDirection: h.style === 'split-reverse' ? 'row-reverse' : 'row' }}>
          <div style={{ flex: 3, backgroundColor: heroBg, padding: '10px 10px', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 30% 50%, ${acc}18, transparent 70%)` }} />
            <div style={{ position: 'relative', textAlign: h.textAlign === 'center' ? 'center' : 'right' }}>
              {h.tagOverride && <div style={{ fontSize: 5, color: acc, marginBottom: 2, letterSpacing: 1, fontFamily: bFont }}>{h.tagOverride}</div>}
              <div style={{ width: 16, height: 1.5, backgroundColor: acc, marginBottom: 4, marginLeft: h.textAlign === 'center' ? 'auto' : 0, marginRight: h.textAlign !== 'left' ? 0 : 'auto' }} />
              <div style={{ fontSize: 9, fontWeight: f.headingWeight ?? 700, color: c.navText ?? '#fff', fontFamily: hFont, lineHeight: 1.2, marginBottom: 4 }}>مكتب هندسي</div>
              <div style={{ fontSize: 5, color: `${c.navText ?? '#fff'}70`, marginBottom: 6, fontFamily: bFont }}>نصمم مستقبلك</div>
              <div style={{ display: 'inline-block', padding: '2px 7px', borderRadius: btnR, background: btnBg, fontSize: 5, color: '#fff', fontFamily: bFont }}>استعرض</div>
            </div>
          </div>
          <div style={{ flex: 2, backgroundColor: c.secondary, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at center, ${acc}22, transparent 70%)` }} />
            <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: `${acc}30` }} />
          </div>
        </div>
      ) : h.style === 'minimal' ? (
        <div style={{ backgroundColor: c.background, padding: '14px 10px', textAlign: h.textAlign === 'center' ? 'center' : 'right' }}>
          <div style={{ width: 16, height: 1.5, backgroundColor: acc, marginBottom: 5, marginLeft: h.textAlign === 'center' ? 'auto' : 0, marginRight: h.textAlign !== 'left' ? 0 : 'auto' }} />
          <div style={{ fontSize: 10, fontWeight: f.headingWeight ?? 700, color: c.text, fontFamily: hFont, lineHeight: 1.2, marginBottom: 4 }}>مكتب هندسي</div>
          <div style={{ fontSize: 5, color: c.textLight, marginBottom: 7, fontFamily: bFont }}>نصمم مستقبلك بأفضل المعايير</div>
          <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: btnR, border: `1.5px solid ${acc}`, color: acc, fontSize: 5, fontFamily: bFont }}>استعرض المشاريع</div>
        </div>
      ) : (
        <div style={{ backgroundColor: c.primary, padding: '14px 10px', position: 'relative', textAlign: h.textAlign === 'center' ? 'center' : 'right' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: h.overlayStyle === 'radial' ? `radial-gradient(circle at 40% 40%, ${acc}22, transparent 70%)` : `linear-gradient(135deg, ${c.primary}, ${c.secondary ?? c.primary}80)` }} />
          <div style={{ position: 'relative' }}>
            {h.tagOverride && <div style={{ fontSize: 5, color: acc, marginBottom: 3, letterSpacing: 1 }}>{h.tagOverride}</div>}
            <div style={{ width: 16, height: 1.5, backgroundColor: acc, marginBottom: 5, marginLeft: h.textAlign === 'center' ? 'auto' : 0, marginRight: h.textAlign !== 'left' ? 0 : 'auto' }} />
            <div style={{ fontSize: 10, fontWeight: f.headingWeight ?? 700, color: c.navText ?? '#fff', fontFamily: hFont, lineHeight: 1.2, marginBottom: 4 }}>مكتب هندسي</div>
            <div style={{ fontSize: 5, color: `${c.navText ?? '#fff'}70`, marginBottom: 7 }}>نصمم مستقبلك</div>
            <div style={{ display: 'inline-block', padding: '2px 8px', borderRadius: btnR, background: btnBg, fontSize: 5, color: '#fff', fontFamily: bFont }}>استعرض</div>
          </div>
        </div>
      )}
      {/* Cards row */}
      <div style={{ backgroundColor: c.background, padding: '6px 7px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 4 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ borderRadius: 4, padding: 4, background: cardBg, border: cardBorder, boxShadow: cardShadow }}>
            <div style={{ width: 12, height: 8, borderRadius: 2, backgroundColor: `${acc}30`, marginBottom: 3 }} />
            <div style={{ width: '80%', height: 2.5, borderRadius: 1, backgroundColor: c.text, marginBottom: 2, opacity: 0.6 }} />
            <div style={{ width: '55%', height: 2, borderRadius: 1, backgroundColor: c.textLight, opacity: 0.4 }} />
          </div>
        ))}
      </div>
      {/* Footer strip */}
      <div style={{ backgroundColor: c.primary, height: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 1.5, borderRadius: 1, backgroundColor: `${acc}60` }} />
      </div>
    </div>
  )
}

// ── Preset Picker Page ───────────────────────────────────────────────────────

function PresetPicker({ onSelect, onBlank }: { onSelect: (p: Preset) => void; onBlank: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">اختر نموذجاً للبداية</h1>
            <p className="text-sm text-gray-500 mt-0.5">كل نموذج يختلف كلياً عن الآخر — ستتمكن من تعديل كل شيء بعد الاختيار</p>
          </div>
          <button
            onClick={onBlank}
            className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-lg transition-colors"
          >
            ابدأ من صفحة بيضاء ←
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden text-right hover:border-gray-900 hover:shadow-xl transition-all duration-200 flex flex-col"
            >
              {/* Tag bar */}
              <div
                className="px-3 py-1.5 flex items-center justify-between"
                style={{ backgroundColor: preset.config.colors.primary }}
              >
                <span className="text-[9px] font-bold tracking-widest opacity-60" style={{ color: preset.config.colors.navText ?? '#fff' }}>
                  {preset.tag}
                </span>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.config.colors.accent }} />
              </div>

              {/* Mini Preview */}
              <div className="border-b border-gray-100">
                <PresetMiniPreview preset={preset} />
              </div>

              {/* Info */}
              <div className="p-3 flex-1 flex flex-col gap-2">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{preset.name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{preset.description}</p>
                </div>
                <div className="text-[10px] text-gray-400 italic">{preset.mood}</div>
                <div className="flex flex-wrap gap-1 mt-auto pt-1">
                  {preset.badges.map(b => (
                    <span key={b} className="bg-gray-100 text-gray-600 text-[9px] px-1.5 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="px-3 pb-3">
                <div
                  className="w-full text-center text-xs font-bold py-2 rounded-lg transition-all group-hover:opacity-90"
                  style={{ backgroundColor: preset.config.colors.accent, color: '#fff' }}
                >
                  ابدأ بهذا النموذج ←
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ══════════════════════════════════════════════════════════════════════════════

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-5 pb-2 border-b border-gray-100">
      {children}
    </h3>
  )
}

function Row({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-700">{label}</p>
        {hint && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex-shrink-0 w-48">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        'relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none',
        value ? 'bg-gray-900' : 'bg-gray-200'
      )}
    >
      <span className={cn(
        'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
        value ? 'translate-x-5 left-0.5' : 'left-0.5'
      )} />
    </button>
  )
}

function ColorPicker({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <p className="text-sm text-gray-700">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-mono w-16 text-left" dir="ltr">{value}</span>
        <label className="cursor-pointer">
          <div className="w-8 h-8 rounded-lg border-2 border-gray-200 shadow-sm hover:scale-110 transition-transform"
            style={{ backgroundColor: value }} />
          <input type="color" value={value} onChange={e => onChange(e.target.value)} className="sr-only" />
        </label>
      </div>
    </div>
  )
}

function Sel({ value, onChange, options }: {
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <Select value={value} onValueChange={v => v && onChange(v)}>
      <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
      <SelectContent>
        {options.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// LIVE PREVIEW — 3 PAGES
// ══════════════════════════════════════════════════════════════════════════════

function LivePreview({ config, meta }: { config: CustomThemeConfig; meta: { name_ar: string } }) {
  const [page, setPage] = useState<'home' | 'projects' | 'contact'>('home')

  const c   = config.colors
  const f   = config.fonts
  const h   = config.hero
  const n   = config.navigation ?? {}
  const l   = config.layout
  const pg  = config.projectsGrid
  const crd = config.cards ?? {}
  const btn = config.buttons ?? {}
  const sec = config.sections ?? {}
  const dec = config.decorations ?? {}
  const cs  = config.contactStyle ?? {}

  // ── Derived values ────────────────────────────────────────────────────────

  const brMap: Record<string, string> = { none: '0px', sm: '4px', md: '8px', lg: '16px', full: '9999px' }
  const br    = brMap[l.borderRadius] ?? '8px'
  const btnBr = btn.style === 'pill' ? '9999px' : br
  const hFont = `'${f.heading}', serif`
  const bFont = `'${f.body}', sans-serif`
  const spGap = { compact: 4, normal: 8, spacious: 14 }[l.spacing] ?? 8

  // Nav
  const navH: React.CSSProperties = { height: { compact: '36px', normal: '44px', tall: '56px' }[n.height ?? 'normal'] }
  const navBg: React.CSSProperties =
    n.style === 'glass'    ? { backgroundColor: `${c.navBg ?? c.primary}bb`, backdropFilter: 'blur(16px)' } :
    n.style === 'blur'     ? { backgroundColor: `${c.navBg ?? c.primary}99`, backdropFilter: 'blur(10px)' } :
    n.style === 'bordered' ? { backgroundColor: c.navBg ?? c.primary, borderBottom: `1.5px solid ${c.accent}` } :
                             { backgroundColor: c.navBg ?? c.primary }

  // Button
  const btnStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = { borderRadius: btnBr, display: 'inline-block', fontSize: 8, padding: '4px 10px', fontFamily: bFont, fontWeight: btn.uppercase ? 700 : 600, textTransform: btn.uppercase ? 'uppercase' : 'none', letterSpacing: btn.uppercase ? 1 : 0, cursor: 'pointer', boxShadow: btn.glow ? `0 0 12px ${c.accent}80` : 'none', transition: 'all 0.2s' }
    switch (btn.style ?? 'solid') {
      case 'outline':  return { ...base, background: 'transparent', color: c.accent, border: `1.5px solid ${c.accent}` }
      case 'ghost':    return { ...base, background: 'transparent', color: c.navText ?? '#fff', border: `1px solid ${c.navText ?? '#fff'}40` }
      case 'gradient': return { ...base, backgroundImage: `linear-gradient(135deg, ${c.accent}, ${c.accentSecondary ?? c.accent})`, color: '#fff', border: 'none' }
      case 'pill':     return { ...base, backgroundColor: c.accent, color: '#fff', border: 'none', borderRadius: '9999px' }
      default:         return { ...base, backgroundColor: c.accent, color: '#fff', border: 'none' }
    }
  })()

  const btnSecondary: React.CSSProperties = { ...btnStyle, backgroundColor: 'transparent', backgroundImage: 'none', color: c.navText ?? '#fff', border: `1px solid ${c.navText ?? '#fff'}50`, boxShadow: 'none' }

  // Card
  const cardSt: React.CSSProperties = (() => {
    switch (crd.style ?? 'elevated') {
      case 'flat':     return { background: c.cardBg ?? c.background, border: 'none', boxShadow: 'none' }
      case 'bordered': return { background: c.cardBg ?? c.background, border: `2px solid ${c.border ?? '#e2e8f0'}` }
      case 'glass':    return { background: `${c.cardBg ?? '#fff'}cc`, border: `1px solid ${c.border ?? '#e2e8f0'}80`, backdropFilter: 'blur(10px)' }
      case 'filled':   return { background: c.secondary, border: 'none', boxShadow: 'none' }
      case 'ghost':    return { background: 'transparent', border: `1px dashed ${c.border ?? '#e2e8f0'}` }
      default:         return { background: c.cardBg ?? c.background, border: `1px solid ${c.border ?? '#e2e8f0'}`, boxShadow: '0 4px 20px rgba(0,0,0,0.07)' }
    }
  })()

  const cardTextCol  = crd.style === 'filled' ? (c.navText ?? '#fff') : c.text
  const cardSubCol   = crd.style === 'filled' ? `${c.navText ?? '#fff'}80` : c.textLight

  const accentBarSt: React.CSSProperties = crd.accentBar && crd.accentBar !== 'none' ? ({
    right:  { borderRight:  `3px solid ${c.accent}` },
    left:   { borderLeft:   `3px solid ${c.accent}` },
    top:    { borderTop:    `3px solid ${c.accent}` },
    bottom: { borderBottom: `3px solid ${c.accent}` },
  }[crd.accentBar] ?? {}) : {}

  const cardPad = { compact: '8px', normal: '12px', large: '18px' }[crd.padding ?? 'normal']

  // Footer
  const ftBg   = { dark: c.primary, light: c.background, accent: c.accent, minimal: c.background }[sec.footerStyle ?? 'dark'] ?? c.primary
  const ftText = ['light', 'minimal'].includes(sec.footerStyle ?? 'dark') ? c.text : '#fff'

  // CTA
  const ctaBgSt: React.CSSProperties = sec.ctaBg === 'gradient'
    ? { backgroundImage: `linear-gradient(135deg, ${c.primary}, ${c.secondary ?? c.primary})` }
    : { backgroundColor: sec.ctaBg === 'accent' ? c.accent : sec.ctaBg === 'background' ? c.background : c.primary }
  const ctaTextCol = sec.ctaBg === 'background' ? c.text : '#fff'

  // Contact cards
  const conCardSt: React.CSSProperties = (() => {
    switch (cs.cardStyle ?? 'bordered') {
      case 'flat':     return { background: c.cardBg ?? c.background, border: 'none' }
      case 'glass':    return { background: `${c.cardBg ?? '#fff'}cc`, backdropFilter: 'blur(10px)', border: `1px solid ${c.border ?? '#e2e8f0'}60` }
      case 'filled':   return { background: c.primary, color: '#fff' }
      default:         return { background: c.cardBg ?? c.background, border: `2px solid ${c.border ?? '#e2e8f0'}` }
    }
  })()

  const conCardTextCol = cs.cardStyle === 'filled' ? '#fff' : c.text
  const conCardSubCol  = cs.cardStyle === 'filled' ? '#ffffff80' : c.textLight

  const fontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.heading)}:wght@400;700;900&family=${encodeURIComponent(f.body)}:wght@300;400;700&display=swap`

  // ── Nav Bar (shared) ──────────────────────────────────────────────────────

  const NavBar = (
    <div style={{ ...navH, ...navBg, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', position: 'relative', zIndex: 10, flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: n.logoSize === 'lg' ? 22 : n.logoSize === 'sm' ? 14 : 18, height: n.logoSize === 'lg' ? 22 : n.logoSize === 'sm' ? 14 : 18, borderRadius: '50%', backgroundColor: c.accent, flexShrink: 0 }} />
        <span style={{ color: c.navText ?? '#fff', fontFamily: hFont, fontSize: n.logoSize === 'lg' ? 12 : 10, fontWeight: 700 }}>
          {meta.name_ar || 'اسم المكتب'}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {['الرئيسية', 'المشاريع', 'التواصل'].map(lnk => (
          <span key={lnk} style={{ color: c.navText ?? '#fff', fontSize: 8, opacity: 0.7, fontFamily: bFont }}>{lnk}</span>
        ))}
        {n.ctaInNav !== false && (
          <span style={{ ...btnStyle, fontSize: 7, padding: '2px 7px' }}>{h.ctaSecondaryText ?? 'تواصل'}</span>
        )}
      </div>
      {n.showBorder && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: c.accent }} />
      )}
    </div>
  )

  // ── Section accent line ───────────────────────────────────────────────────

  const SectionHead = ({ label, center = false }: { label: string; center?: boolean }) => (
    <div style={{ marginBottom: spGap + 2, textAlign: center ? 'center' : 'right' }}>
      {dec.accentLine !== false && (
        <div style={{ width: 24, height: 2, backgroundColor: c.accent, marginBottom: 5, marginRight: center ? 'auto' : 0, marginLeft: center ? 'auto' : 0 }} />
      )}
      {dec.sectionLabel && (
        <div style={{ fontSize: 28, fontWeight: 900, color: `${c.accent}08`, fontFamily: hFont, lineHeight: 1, marginBottom: -14 }}>●</div>
      )}
      <p style={{ fontSize: 11, fontWeight: f.headingWeight ?? 700, color: c.text, fontFamily: hFont, textTransform: f.uppercase ? 'uppercase' : 'none', letterSpacing: f.uppercase ? 1 : 0 }}>{label}</p>
    </div>
  )

  // ── Hero ─────────────────────────────────────────────────────────────────

  const heroTextAlign = h.textAlign === 'center' ? 'center' : h.textAlign === 'left' ? 'left' : 'right'

  const HeroContent = ({ textCol }: { textCol: string }) => (
    <div style={{ textAlign: heroTextAlign }}>
      {dec.accentLine !== false && (
        <div style={{ width: 32, height: 2, backgroundColor: c.accent, marginBottom: 6, marginRight: heroTextAlign !== 'right' ? 'auto' : 0, marginLeft: heroTextAlign !== 'left' ? 'auto' : 0 }} />
      )}
      {h.tagOverride && (
        <p style={{ fontSize: 8, color: c.accent, fontWeight: 700, marginBottom: 4, fontFamily: bFont, letterSpacing: 2, textTransform: 'uppercase' }}>{h.tagOverride}</p>
      )}
      <h2 style={{ fontSize: 17, fontWeight: f.headingWeight ?? 700, color: textCol, fontFamily: hFont, lineHeight: 1.25, marginBottom: 6, textTransform: f.uppercase ? 'uppercase' : 'none' }}>
        مكتب الهندسة المعمارية
      </h2>
      <p style={{ fontSize: 9, color: `${textCol}80`, marginBottom: 12, fontFamily: bFont, lineHeight: 1.5 }}>
        نصمم مستقبلك بأفضل المعايير العالمية
      </p>
      <div style={{ display: 'flex', gap: 6, justifyContent: heroTextAlign === 'center' ? 'center' : heroTextAlign === 'left' ? 'flex-start' : 'flex-end' }}>
        <span style={btnStyle}>{h.ctaPrimaryText ?? 'استعرض مشاريعنا'}</span>
        <span style={btnSecondary}>{h.ctaSecondaryText ?? 'تواصل معنا'}</span>
      </div>
    </div>
  )

  const renderHero = () => {
    if (h.style === 'split' || h.style === 'split-reverse') {
      const rev = h.style === 'split-reverse'
      return (
        <div style={{ display: 'flex', flexDirection: rev ? 'row-reverse' : 'row' }}>
          <div style={{ flex: 3, padding: '22px 16px', backgroundColor: c.primary, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at ${rev ? '80%' : '20%'} 50%, ${c.accent}12, transparent 70%)` }} />
            <div style={{ position: 'relative' }}><HeroContent textCol={c.navText ?? '#fff'} /></div>
          </div>
          <div style={{ flex: 2, minHeight: 100, backgroundColor: c.secondary, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at center, ${c.accent}25, transparent 70%)` }} />
            <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: `${c.accent}30`, position: 'relative', zIndex: 1 }} />
          </div>
        </div>
      )
    }

    if (h.style === 'minimal') {
      return (
        <div style={{ padding: '24px 16px', backgroundColor: c.background }}>
          <HeroContent textCol={c.text} />
        </div>
      )
    }

    if (h.style === 'centered') {
      return (
        <div style={{ padding: '28px 16px', backgroundColor: c.primary, textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(ellipse at 50% 60%, ${c.accent}18, transparent 70%)` }} />
          <div style={{ position: 'relative' }}><HeroContent textCol={c.navText ?? '#fff'} /></div>
        </div>
      )
    }

    // fullscreen / cinematic
    const overlayGrad =
      h.overlayStyle === 'radial'    ? `radial-gradient(circle at 30% 50%, ${c.accent}18, transparent 60%), linear-gradient(to left, ${c.primary}ee, ${c.primary}88)` :
      h.overlayStyle === 'vignette'  ? `radial-gradient(ellipse at center, transparent 30%, ${c.primary}cc 100%)` :
      h.overlayStyle === 'diagonal'  ? `linear-gradient(135deg, ${c.primary}ee 0%, ${c.primary}55 100%)` :
      h.overlayStyle === 'flat'      ? c.primary :
                                       `linear-gradient(to left, ${c.primary}f0, ${c.primary}80)`
    return (
      <div style={{ padding: '30px 16px', backgroundColor: c.secondary, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: overlayGrad, opacity: h.overlayOpacity + 0.3 }} />
        <div style={{ position: 'relative' }}><HeroContent textCol={c.navText ?? '#fff'} /></div>
      </div>
    )
  }

  // ── Services Cards ────────────────────────────────────────────────────────

  const renderServices = () => {
    const altBg = dec.sectionBgAlt ? (c.cardBg ?? '#f8fafc') : c.background
    return (
      <div style={{ padding: `${spGap + 6}px 12px`, backgroundColor: altBg }}>
        <SectionHead label="خدماتنا" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 5 }}>
          {['التصميم المعماري', 'الإشراف الهندسي', 'الاستشارات'].map((svc, i) => {
            const iShape = crd.iconShape === 'circle' ? '50%' : crd.iconShape === 'square' ? '0' : crd.iconShape === 'none' ? 'none' : br
            return (
              <div key={i} style={{ ...cardSt, ...accentBarSt, padding: cardPad, borderRadius: br, position: 'relative', overflow: 'hidden' }}>
                {crd.showNumber && (
                  <div style={{ position: 'absolute', top: 2, left: 4, fontSize: 20, fontWeight: 900, fontFamily: hFont, color: `${c.accent}10`, lineHeight: 1 }}>0{i + 1}</div>
                )}
                {dec.cardCornerDot && (
                  <div style={{ position: 'absolute', top: 5, left: 5, width: 4, height: 4, borderRadius: '50%', backgroundColor: c.accent }} />
                )}
                {crd.iconShape !== 'none' && (
                  <div style={{ width: 22, height: 22, marginBottom: 6, backgroundColor: `${c.accent}18`, borderRadius: iShape, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: crd.iconShape === 'diamond' ? 'rotate(45deg)' : 'none' }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: c.accent, transform: crd.iconShape === 'diamond' ? 'rotate(-45deg)' : 'none' }} />
                  </div>
                )}
                <p style={{ fontSize: 9, fontWeight: 700, color: cardTextCol, fontFamily: hFont }}>{svc}</p>
                <p style={{ fontSize: 7, color: cardSubCol, marginTop: 2, fontFamily: bFont }}>وصف مختصر للخدمة</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Projects section (home) ───────────────────────────────────────────────

  const renderProjectsSection = () => {
    const gridCols = pg.columns === 4 ? 'repeat(4,1fr)' : pg.columns === 2 ? '1fr 1fr' : 'repeat(3,1fr)'
    const ratio    = { square: '1/1', '4/3': '4/3', '16/9': '16/9', '3/4': '3/4', dynamic: '4/3' }[pg.imageRatio ?? '4/3']
    const isList   = pg.style === 'list'
    const colors   = [c.primary, c.secondary, c.accent, c.accentSecondary ?? c.accent]
    const numCols  = pg.columns === 4 ? 4 : 3

    return (
      <div style={{ padding: `${spGap + 6}px 12px`, backgroundColor: c.background }}>
        <SectionHead label="أبرز مشاريعنا" />
        {isList ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ display: 'flex', borderRadius: br, overflow: 'hidden', border: `1px solid ${c.border ?? '#e2e8f0'}`, backgroundColor: c.cardBg ?? c.background }}>
                <div style={{ width: 50, height: 38, backgroundColor: colors[i % 4], flexShrink: 0 }} />
                <div style={{ padding: '5px 8px', flex: 1 }}>
                  <p style={{ fontSize: 9, fontWeight: 600, color: c.text, fontFamily: hFont }}>مشروع {i + 1}</p>
                  <p style={{ fontSize: 7, color: c.textLight, fontFamily: bFont, marginTop: 1 }}>2024 • سكني</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 4 }}>
            {Array.from({ length: numCols }).map((_, i) => (
              <div key={i} style={{ borderRadius: br, overflow: 'hidden', position: 'relative', aspectRatio: ratio, backgroundColor: colors[i % 4] }}>
                {pg.captionStyle === 'overlay' && (
                  <div style={{ position: 'absolute', bottom: 0, insetInline: 0, padding: '4px 6px', background: 'linear-gradient(to top,rgba(0,0,0,.7),transparent)' }}>
                    <p style={{ fontSize: 7, color: '#fff', fontWeight: 600 }}>مشروع {i + 1}</p>
                  </div>
                )}
                {pg.captionStyle === 'floating' && (
                  <div style={{ position: 'absolute', top: 4, right: 4, background: `${c.cardBg ?? '#fff'}ee`, borderRadius: 4, padding: '2px 5px' }}>
                    <p style={{ fontSize: 7, color: c.text, fontWeight: 600 }}>مشروع {i + 1}</p>
                  </div>
                )}
                {pg.captionStyle === 'slide' && (
                  <div style={{ position: 'absolute', bottom: 0, insetInline: 0, height: '40%', background: `linear-gradient(to top,${c.primary}ee,transparent)`, display: 'flex', alignItems: 'flex-end', padding: '4px 6px' }}>
                    <p style={{ fontSize: 7, color: '#fff', fontWeight: 600 }}>مشروع {i + 1}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {pg.captionStyle === 'below' && (
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 4, marginTop: 4 }}>
            {Array.from({ length: numCols }).map((_, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 8, fontWeight: 600, color: c.text }}>مشروع {i + 1}</p>
                <p style={{ fontSize: 7, color: c.textLight }}>2024</p>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // ── CTA ──────────────────────────────────────────────────────────────────

  const renderCTA = () => {
    if (sec.ctaLayout === 'banner') {
      return (
        <div style={{ ...ctaBgSt, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: ctaTextCol, fontFamily: hFont }}>هل تريد مشروعاً مميزاً؟</p>
          <span style={btnStyle}>ابدأ الآن</span>
        </div>
      )
    }
    if (sec.ctaLayout === 'split') {
      return (
        <div style={{ ...ctaBgSt, display: 'flex' }}>
          <div style={{ flex: 2, padding: '16px 12px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: ctaTextCol, fontFamily: hFont, marginBottom: 4 }}>هل تريد مشروعاً مميزاً؟</p>
            <p style={{ fontSize: 8, color: `${ctaTextCol}70`, marginBottom: 8 }}>تواصل معنا اليوم</p>
            <span style={btnStyle}>ابدأ الآن</span>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${c.accent}15` }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: `${c.accent}35` }} />
          </div>
        </div>
      )
    }
    return (
      <div style={{ ...ctaBgSt, padding: '18px 12px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: ctaTextCol, fontFamily: hFont, marginBottom: 4 }}>هل تريد مشروعاً مميزاً؟</p>
        <p style={{ fontSize: 8, color: `${ctaTextCol}70`, marginBottom: 10 }}>تواصل معنا اليوم</p>
        <span style={btnStyle}>ابدأ الآن</span>
      </div>
    )
  }

  // ── Footer ────────────────────────────────────────────────────────────────

  const renderFooter = () => (
    <div style={{ backgroundColor: ftBg, padding: '10px 14px', borderTop: `1px solid ${c.accent}18` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: ftText, fontFamily: hFont }}>{meta.name_ar || 'المكتب'}</span>
        {sec.footerShowSocial !== false && (
          <div style={{ display: 'flex', gap: 4 }}>
            {['📸', '🐦', '💼'].map((ic, i) => (
              <div key={i} style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: `${ftText}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 7 }}>{ic}</div>
            ))}
          </div>
        )}
      </div>
      <div style={{ height: 1, backgroundColor: `${ftText}12`, marginBottom: 5 }} />
      <p style={{ fontSize: 7, color: `${ftText}45` }}>© 2025 جميع الحقوق محفوظة</p>
    </div>
  )

  // ── Projects PAGE ─────────────────────────────────────────────────────────

  const renderProjectsPage = () => {
    const gridCols = pg.columns === 4 ? 'repeat(4,1fr)' : pg.columns === 2 ? '1fr 1fr' : 'repeat(3,1fr)'
    const ratio    = { square: '1/1', '4/3': '4/3', '16/9': '16/9', '3/4': '3/4', dynamic: '4/3' }[pg.imageRatio ?? '4/3']
    const colors   = [c.primary, c.secondary, c.accent, c.accentSecondary ?? c.accent, c.cardBg ?? '#eee', c.border ?? '#ddd']

    return (
      <>
        <div style={{ padding: '12px 12px', backgroundColor: c.primary, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 20% 60%, ${c.accent}15, transparent 60%)` }} />
          <div style={{ position: 'relative' }}>
            {dec.accentLine !== false && <div style={{ width: 24, height: 2, backgroundColor: c.accent, marginBottom: 5 }} />}
            <p style={{ fontSize: 13, fontWeight: 700, color: c.navText ?? '#fff', fontFamily: hFont }}>معرض المشاريع</p>
            <p style={{ fontSize: 8, color: `${c.navText ?? '#fff'}60`, marginTop: 2, fontFamily: bFont }}>استعرض أعمالنا</p>
          </div>
        </div>
        <div style={{ padding: '10px 12px', backgroundColor: c.background }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 10, flexWrap: 'wrap' }}>
            {['الكل', 'سكني', 'تجاري', 'صناعي'].map((cat, i) => (
              <span key={cat} style={i === 0
                ? { ...btnStyle, fontSize: 8, padding: '3px 9px' }
                : { fontSize: 8, padding: '3px 9px', borderRadius: btnBr, background: c.cardBg ?? '#f5f5f5', color: c.textLight, border: `1px solid ${c.border ?? '#e2e8f0'}` }
              }>{cat}</span>
            ))}
          </div>
          {/* Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 5 }}>
            {Array.from({ length: Math.min(pg.columns * 2, 8) }).map((_, i) => (
              <div key={i} style={{ borderRadius: br, overflow: 'hidden', border: `1px solid ${c.border ?? '#e2e8f0'}` }}>
                <div style={{ aspectRatio: ratio, backgroundColor: colors[i % 6] }} />
                {pg.captionStyle !== 'overlay' && pg.captionStyle !== 'slide' && (
                  <div style={{ padding: '5px 6px', backgroundColor: c.cardBg ?? c.background }}>
                    <p style={{ fontSize: 8, fontWeight: 600, color: c.text, fontFamily: bFont }}>مشروع {i + 1}</p>
                    <p style={{ fontSize: 7, color: c.textLight }}>2024</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </>
    )
  }

  // ── Contact PAGE ──────────────────────────────────────────────────────────

  const renderContactPage = () => {
    const isSBS = cs.layout === 'side-by-side'
    const socialSt = (color: string): React.CSSProperties => ({
      icons:    { backgroundColor: `${color}20`, color, borderRadius: '50%', width: 22, height: 22, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9 },
      pills:    { backgroundColor: color, color: '#fff', borderRadius: '9999px', padding: '3px 9px', fontSize: 8, display: 'inline-flex', alignItems: 'center', gap: 3 },
      outlined: { border: `1.5px solid ${color}`, color, borderRadius: br, padding: '2px 7px', fontSize: 8, display: 'inline-flex', alignItems: 'center' },
      text:     { color, fontSize: 9, textDecoration: 'underline' },
    }[cs.socialStyle ?? 'pills'] ?? {})

    return (
      <>
        <div style={{ padding: '12px 12px', backgroundColor: c.primary, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 80% 50%, ${c.accent}12, transparent 60%)` }} />
          <div style={{ position: 'relative' }}>
            {dec.accentLine !== false && <div style={{ width: 24, height: 2, backgroundColor: c.accent, marginBottom: 5 }} />}
            <p style={{ fontSize: 13, fontWeight: 700, color: c.navText ?? '#fff', fontFamily: hFont }}>تواصل معنا</p>
            <p style={{ fontSize: 8, color: `${c.navText ?? '#fff'}60`, marginTop: 2, fontFamily: bFont }}>نحن هنا لمساعدتك</p>
          </div>
        </div>
        <div style={{ padding: '10px 10px', backgroundColor: c.background, display: isSBS ? 'grid' : 'block', gridTemplateColumns: isSBS ? '1fr 1fr' : undefined, gap: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {[
              { icon: '📞', label: 'الهاتف',   val: '+966 50 000 0000', col: '#22c55e' },
              { icon: '✉️', label: 'البريد',   val: 'info@office.com',  col: '#3b82f6' },
              { icon: '📍', label: 'العنوان', val: 'الرياض، المملكة',   col: '#f59e0b' },
            ].map((item, i) => (
              <div key={i} style={{ ...conCardSt, borderRadius: br, padding: '8px 10px', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: 8, fontWeight: 700, color: conCardTextCol, fontFamily: hFont }}>{item.label}</p>
                  <p style={{ fontSize: 7, color: conCardSubCol, fontFamily: bFont }}>{item.val}</p>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 2 }}>
              {[
                { label: '📸', col: '#e1306c' },
                { label: '🐦', col: '#1da1f2' },
                { label: '💼', col: '#0077b5' },
              ].map(s => (
                <span key={s.label} style={socialSt(s.col)}>{s.label}</span>
              ))}
            </div>
          </div>
          {cs.mapStyle !== 'none' && (
            <div style={{ borderRadius: br, backgroundColor: `${c.secondary}30`, border: `1px solid ${c.border ?? '#e2e8f0'}`, height: isSBS ? '100%' : 55, minHeight: isSBS ? 110 : 55, marginTop: isSBS ? 0 : 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 18 }}>🗺️</span>
                <p style={{ fontSize: 7, color: c.textLight, marginTop: 2 }}>خريطة Google</p>
              </div>
            </div>
          )}
        </div>
      </>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="h-full overflow-y-auto p-3 bg-gray-100">
      <style>{`@import url('${fontUrl}');`}</style>

      {/* Page tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {([['home', '🏠 الرئيسية'], ['projects', '🏗️ المشاريع'], ['contact', '📞 التواصل']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setPage(id)}
            className={cn('px-2.5 py-1 text-[10px] rounded-full transition-colors font-medium', page === id ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200')}
          >{label}</button>
        ))}
      </div>

      <p className="text-[9px] text-gray-400 mb-2">معاينة حية — تتحدث مع كل تغيير</p>

      {/* Browser */}
      <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200" dir="rtl" style={{ fontSize: 0 }}>
        {NavBar}
        {page === 'home' && (
          <>
            {renderHero()}
            {l.sections.includes('services') && renderServices()}
            {l.sections.includes('projects') && renderProjectsSection()}
            {l.sections.includes('cta') && renderCTA()}
            {l.sections.includes('footer') && renderFooter()}
          </>
        )}
        {page === 'projects' && <>{renderProjectsPage()}{renderFooter()}</>}
        {page === 'contact'  && <>{renderContactPage()}{renderFooter()}</>}
      </div>

      {/* Color palette */}
      <div className="mt-3 p-2.5 bg-white rounded-xl border border-gray-200">
        <p className="text-[9px] font-bold text-gray-400 mb-2">لوحة الألوان</p>
        <div className="flex gap-1 flex-wrap">
          {Object.entries(c).map(([key, val]) => (
            <div key={key} className="flex flex-col items-center gap-0.5">
              <div className="w-5 h-5 rounded border border-gray-200" style={{ backgroundColor: val as string }} />
              <span className="text-[6px] text-gray-400 max-w-[20px] truncate">{key.replace('Secondary', '2').replace('Light', 'Lt')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Font + button preview */}
      <div className="mt-2 p-2.5 bg-white rounded-xl border border-gray-200">
        <p className="text-[9px] font-bold text-gray-400 mb-2">الخطوط والأزرار</p>
        <p style={{ fontFamily: hFont, fontSize: 13, fontWeight: f.headingWeight ?? 700, color: c.text, textTransform: f.uppercase ? 'uppercase' : 'none', letterSpacing: f.uppercase ? 1 : 0 }}>
          العنوان — {f.heading}
        </p>
        <p style={{ fontFamily: bFont, fontSize: 10, color: c.textLight, marginTop: 3, letterSpacing: { tight: -0.5, normal: 0, wide: 0.5, wider: 1 }[f.letterSpacing ?? 'normal'] }}>
          النص الأساسي — {f.body}
        </p>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ ...btnStyle, fontSize: 9 }}>زر رئيسي</span>
          <span style={{ fontSize: 9, padding: '4px 10px', border: `1.5px solid ${c.accent}`, color: c.accent, borderRadius: btnBr }}>محدد</span>
          <span style={{ fontSize: 9, padding: '4px 10px', borderRadius: '9999px', backgroundColor: c.accent, color: '#fff' }}>بيضاوي</span>
        </div>
      </div>

      {/* Card preview */}
      <div className="mt-2 p-2.5 bg-white rounded-xl border border-gray-200">
        <p className="text-[9px] font-bold text-gray-400 mb-2">معاينة البطاقة</p>
        <div style={{ ...cardSt, ...accentBarSt, borderRadius: br, padding: cardPad, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          {crd.iconShape !== 'none' && (
            <div style={{ width: 28, height: 28, flexShrink: 0, backgroundColor: `${c.accent}18`, borderRadius: crd.iconShape === 'circle' ? '50%' : crd.iconShape === 'square' ? '0' : br, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c.accent }} />
            </div>
          )}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: cardTextCol, fontFamily: hFont }}>عنوان البطاقة</p>
            <p style={{ fontSize: 8, color: cardSubCol, marginTop: 2, fontFamily: bFont }}>وصف مختصر للعنصر</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// TAB PANELS
// ══════════════════════════════════════════════════════════════════════════════

function BasicsTab({ meta, onChange }: {
  meta: { name_ar: string; name_en: string; description_ar: string; plan_required: string; visibility: string }
  onChange: (k: string, v: string) => void
}) {
  return (
    <div className="space-y-4">
      <SectionTitle>معلومات القالب</SectionTitle>
      <div className="space-y-3">
        <div>
          <Label className="text-sm text-gray-600 mb-1 block">اسم القالب (عربي) *</Label>
          <Input value={meta.name_ar} onChange={e => onChange('name_ar', e.target.value)} placeholder="مثال: قالب فاخر ذهبي" className="h-9" />
        </div>
        <div>
          <Label className="text-sm text-gray-600 mb-1 block">اسم القالب (إنجليزي)</Label>
          <Input value={meta.name_en} onChange={e => onChange('name_en', e.target.value)} placeholder="Luxury Gold Theme" className="h-9" dir="ltr" />
        </div>
        <div>
          <Label className="text-sm text-gray-600 mb-1 block">وصف القالب</Label>
          <textarea value={meta.description_ar} onChange={e => onChange('description_ar', e.target.value)}
            placeholder="وصف مختصر يظهر في قائمة القوالب..."
            className="w-full h-20 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900" />
        </div>
      </div>
      <SectionTitle>إعدادات الوصول</SectionTitle>
      <Row label="الباقة المطلوبة" hint="أقل باقة تستطيع استخدام هذا القالب">
        <Sel value={meta.plan_required} onChange={v => onChange('plan_required', v)} options={[
          { value: 'basic',   label: 'Basic — للجميع' },
          { value: 'pro',     label: 'Pro فأعلى' },
          { value: 'premium', label: 'Premium فقط' },
        ]} />
      </Row>
      <Row label="الظهور">
        <Sel value={meta.visibility} onChange={v => onChange('visibility', v)} options={[
          { value: 'public',  label: 'عام — لكل المكاتب' },
          { value: 'private', label: 'خاص — للمخصصين فقط' },
        ]} />
      </Row>
    </div>
  )
}

function ColorsTab({ config, onChange }: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: keyof typeof config.colors, val: string) {
    onChange({ ...config, colors: { ...config.colors, [key]: val } })
  }
  const c = config.colors
  return (
    <div className="space-y-1">
      <SectionTitle>الألوان الرئيسية</SectionTitle>
      <ColorPicker value={c.primary}                    onChange={v => upd('primary', v)}          label="اللون الرئيسي (Primary)" />
      <ColorPicker value={c.secondary}                  onChange={v => upd('secondary', v)}         label="اللون الثانوي (Secondary)" />
      <ColorPicker value={c.accent}                     onChange={v => upd('accent', v)}            label="لون التمييز (Accent)" />
      <ColorPicker value={c.accentSecondary ?? '#e2c97e'} onChange={v => upd('accentSecondary', v)} label="Accent ثانوي (للتدرجات)" />

      <SectionTitle>الخلفية والنصوص</SectionTitle>
      <ColorPicker value={c.background}              onChange={v => upd('background', v)}  label="خلفية الصفحة" />
      <ColorPicker value={c.text}                    onChange={v => upd('text', v)}         label="النصوص الرئيسية" />
      <ColorPicker value={c.textLight}               onChange={v => upd('textLight', v)}    label="النصوص الثانوية" />
      <ColorPicker value={c.cardBg ?? '#f8fafc'}     onChange={v => upd('cardBg', v)}       label="خلفية البطاقات" />
      <ColorPicker value={c.border ?? '#e2e8f0'}     onChange={v => upd('border', v)}       label="لون الحدود" />

      <SectionTitle>شريط التنقل</SectionTitle>
      <ColorPicker value={c.navBg   ?? c.primary}   onChange={v => upd('navBg', v)}        label="خلفية الـ Nav" />
      <ColorPicker value={c.navText ?? '#ffffff'}    onChange={v => upd('navText', v)}      label="نصوص الـ Nav" />

      <SectionTitle>لوحات جاهزة — اضغط لتطبيق</SectionTitle>
      <div className="grid grid-cols-2 gap-2 pt-1">
        {PALETTES.map(p => (
          <button key={p.name} type="button"
            onClick={() => onChange({
              ...config,
              colors: {
                primary: p.primary, secondary: p.secondary,
                accent: p.accent, accentSecondary: p.accentSecondary,
                background: p.background, text: p.text, textLight: p.textLight,
                cardBg: p.cardBg, border: p.border,
                navBg: p.navBg, navText: p.navText,
              },
            })}
            className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-sm transition-all text-right"
          >
            <div className="flex gap-0.5 flex-shrink-0">
              {[p.primary, p.accent, p.background].map((cl, i) => (
                <div key={i} className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-sm" style={{ backgroundColor: cl }} />
              ))}
            </div>
            <span className="text-xs font-medium text-gray-700 flex-1 min-w-0 truncate">{p.emoji} {p.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function FontsTab({ config, onChange }: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: keyof typeof config.fonts, val: unknown) {
    onChange({ ...config, fonts: { ...config.fonts, [key]: val } })
  }
  const f = config.fonts
  return (
    <div className="space-y-1">
      <SectionTitle>خط العناوين</SectionTitle>
      <Row label="الخط">
        <Select value={f.heading} onValueChange={v => upd('heading', v)}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent className="max-h-60">
            {HEADING_FONTS.map(font => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: `'${font}', serif` }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Row>
      <Row label="السماكة">
        <Sel value={String(f.headingWeight ?? 700)} onChange={v => upd('headingWeight', Number(v))} options={[
          { value: '400', label: 'خفيف جداً (400)' },
          { value: '600', label: 'متوسط (600)' },
          { value: '700', label: 'عريض (700)' },
          { value: '800', label: 'أعرض (800)' },
          { value: '900', label: 'أثقل (900)' },
        ]} />
      </Row>
      <Row label="أحرف كبيرة Uppercase">
        <Toggle value={f.uppercase ?? false} onChange={v => upd('uppercase', v)} />
      </Row>

      <SectionTitle>خط النصوص</SectionTitle>
      <Row label="الخط">
        <Select value={f.body} onValueChange={v => upd('body', v)}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent className="max-h-60">
            {BODY_FONTS.map(font => (
              <SelectItem key={font} value={font}>
                <span style={{ fontFamily: `'${font}', sans-serif` }}>{font}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Row>
      <Row label="السماكة">
        <Sel value={String(f.bodyWeight ?? 400)} onChange={v => upd('bodyWeight', Number(v))} options={[
          { value: '300', label: 'خفيف (300)' },
          { value: '400', label: 'عادي (400)' },
          { value: '500', label: 'متوسط (500)' },
        ]} />
      </Row>
      <Row label="حجم الخط">
        <Sel value={f.bodySize ?? 'md'} onChange={v => upd('bodySize', v)} options={[
          { value: 'sm', label: 'صغير' },
          { value: 'md', label: 'متوسط' },
          { value: 'lg', label: 'كبير' },
        ]} />
      </Row>

      <SectionTitle>ضبط دقيق</SectionTitle>
      <Row label="تباعد الحروف">
        <Sel value={f.letterSpacing ?? 'normal'} onChange={v => upd('letterSpacing', v)} options={[
          { value: 'tight',  label: 'ضيق جداً' },
          { value: 'normal', label: 'عادي' },
          { value: 'wide',   label: 'واسع' },
          { value: 'wider',  label: 'أوسع' },
        ]} />
      </Row>
      <Row label="ارتفاع السطر">
        <Sel value={f.lineHeight ?? 'relaxed'} onChange={v => upd('lineHeight', v)} options={[
          { value: 'tight',   label: 'ضيق' },
          { value: 'normal',  label: 'عادي' },
          { value: 'relaxed', label: 'مريح' },
          { value: 'loose',   label: 'واسع جداً' },
        ]} />
      </Row>
    </div>
  )
}

function HeroTab({ config, onChange }: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: keyof typeof config.hero, val: unknown) {
    onChange({ ...config, hero: { ...config.hero, [key]: val } })
  }
  const h = config.hero
  return (
    <div className="space-y-1">
      <SectionTitle>شكل الهيرو</SectionTitle>
      <Row label="النمط" hint="شكل القسم الرئيسي — يظهر في المعاينة">
        <Sel value={h.style} onChange={v => upd('style', v as typeof h.style)} options={[
          { value: 'fullscreen',    label: 'ملء الشاشة' },
          { value: 'split',        label: 'مقسم (نص + صورة)' },
          { value: 'split-reverse', label: 'مقسم معكوس' },
          { value: 'centered',     label: 'مركزي' },
          { value: 'minimal',      label: 'بسيط — فاتح' },
          { value: 'cinematic',    label: 'سينمائي' },
        ]} />
      </Row>
      <Row label="الارتفاع">
        <Sel value={h.height ?? 'screen'} onChange={v => upd('height', v)} options={[
          { value: 'half',   label: 'نصف الشاشة' },
          { value: 'tall',   label: 'طويل (80%)' },
          { value: 'screen', label: 'شاشة كاملة (100%)' },
        ]} />
      </Row>
      <Row label="محاذاة النص">
        <Sel value={h.textAlign} onChange={v => upd('textAlign', v as 'right' | 'center' | 'left')} options={[
          { value: 'right',  label: 'يمين (للعربي)' },
          { value: 'center', label: 'وسط' },
          { value: 'left',   label: 'يسار' },
        ]} />
      </Row>

      <SectionTitle>الطبقة الشفافة (Overlay)</SectionTitle>
      <Row label="النمط">
        <Sel value={h.overlayStyle ?? 'gradient'} onChange={v => upd('overlayStyle', v)} options={[
          { value: 'gradient', label: 'تدرج جانبي' },
          { value: 'flat',     label: 'مستوي موحد' },
          { value: 'radial',   label: 'دائري' },
          { value: 'vignette', label: 'Vignette حواف' },
          { value: 'diagonal', label: 'قطري مائل' },
        ]} />
      </Row>
      <div className="py-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-gray-700">درجة الشفافية</p>
          <span className="text-xs font-mono text-gray-400">{Math.round(h.overlayOpacity * 100)}%</span>
        </div>
        <input type="range" min={0} max={1} step={0.05} value={h.overlayOpacity}
          onChange={e => upd('overlayOpacity', Number(e.target.value))} className="w-full accent-gray-900" />
      </div>

      <SectionTitle>النص والأزرار</SectionTitle>
      <Row label="نص فوق العنوان (Tag)" hint="نص صغير ملون فوق العنوان الرئيسي">
        <Input value={h.tagOverride ?? ''} onChange={e => upd('tagOverride', e.target.value)}
          placeholder="مثال: مرحباً بك" className="h-8 text-sm" />
      </Row>
      <Row label="شكل الأزرار">
        <Sel value={h.ctaStyle ?? 'solid'} onChange={v => upd('ctaStyle', v as typeof h.ctaStyle)} options={[
          { value: 'solid',    label: 'مملوء' },
          { value: 'outline',  label: 'محدد' },
          { value: 'ghost',    label: 'شفاف' },
          { value: 'gradient', label: 'تدرج' },
        ]} />
      </Row>
      <div className="space-y-2 pt-1">
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">الزر الرئيسي</Label>
          <Input value={h.ctaPrimaryText ?? 'استعرض مشاريعنا'}
            onChange={e => upd('ctaPrimaryText', e.target.value)} className="h-8 text-sm" />
        </div>
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">الزر الثانوي</Label>
          <Input value={h.ctaSecondaryText ?? 'تواصل معنا'}
            onChange={e => upd('ctaSecondaryText', e.target.value)} className="h-8 text-sm" />
        </div>
      </div>

      <SectionTitle>خيارات إضافية</SectionTitle>
      <Row label="إظهار الشعار في الهيرو">
        <Toggle value={h.showLogo ?? true} onChange={v => upd('showLogo', v)} />
      </Row>
      <Row label="سهم التمرير للأسفل">
        <Toggle value={h.showScrollIndicator ?? true} onChange={v => upd('showScrollIndicator', v)} />
      </Row>
    </div>
  )
}

function LayoutTab({ config, onChange }: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: keyof typeof config.layout, val: unknown) {
    onChange({ ...config, layout: { ...config.layout, [key]: val } })
  }
  function updSec(key: string, val: unknown) {
    onChange({ ...config, sections: { ...config.sections, [key]: val } })
  }
  const l = config.layout
  const s = config.sections ?? {}
  const allSections = ['hero', 'about', 'services', 'projects', 'features', 'cta', 'footer'] as const
  const secLabels: Record<string, string> = { hero: '🖼️ الهيرو', about: '👤 عن المكتب', services: '🔧 الخدمات', projects: '🏗️ المشاريع', features: '⭐ المميزات', cta: '📣 دعوة للتواصل', footer: '🔽 التذييل' }

  return (
    <div className="space-y-1">
      <SectionTitle>التخطيط العام</SectionTitle>
      <Row label="انحناء الزوايا">
        <Sel value={l.borderRadius} onChange={v => upd('borderRadius', v as typeof l.borderRadius)} options={[
          { value: 'none', label: 'حادة تماماً' },
          { value: 'sm',   label: 'انحناء خفيف' },
          { value: 'md',   label: 'انحناء متوسط' },
          { value: 'lg',   label: 'انحناء كبير' },
          { value: 'full', label: 'دائري كامل' },
        ]} />
      </Row>
      <Row label="المسافات العمودية">
        <Sel value={l.spacing} onChange={v => upd('spacing', v as typeof l.spacing)} options={[
          { value: 'compact',   label: 'مضغوطة' },
          { value: 'normal',    label: 'عادية' },
          { value: 'spacious',  label: 'واسعة جداً' },
        ]} />
      </Row>
      <Row label="أقصى عرض للمحتوى">
        <Sel value={l.maxWidth ?? 'normal'} onChange={v => upd('maxWidth', v)} options={[
          { value: 'narrow', label: 'ضيق (896px)' },
          { value: 'normal', label: 'عادي (1280px)' },
          { value: 'wide',   label: 'واسع (1536px)' },
          { value: 'full',   label: 'ملء الشاشة' },
        ]} />
      </Row>

      <SectionTitle>أقسام الصفحة الرئيسية</SectionTitle>
      <p className="text-xs text-gray-400 mb-2">فعّل أو عطّل — الترتيب يُحافظ عليه تلقائياً</p>
      <div className="space-y-1.5">
        {allSections.map(sec => {
          const active = l.sections.includes(sec)
          return (
            <div key={sec} className={cn('flex items-center justify-between px-3 py-2 rounded-lg border transition-colors', active ? 'border-gray-300 bg-gray-50' : 'border-gray-100 bg-white opacity-40')}>
              <span className="text-sm text-gray-700">{secLabels[sec]}</span>
              <Toggle value={active} onChange={on => {
                const next = on ? [...l.sections, sec] as typeof l.sections : l.sections.filter(s => s !== sec) as typeof l.sections
                upd('sections', allSections.filter(s => next.includes(s)))
              }} />
            </div>
          )
        })}
      </div>

      <SectionTitle>إعدادات الأقسام</SectionTitle>
      <Row label="تخطيط «عن المكتب»">
        <Sel value={s.aboutLayout ?? 'side-by-side'} onChange={v => updSec('aboutLayout', v)} options={[
          { value: 'side-by-side', label: 'جانب لجانب' },
          { value: 'stacked',      label: 'عمودي' },
          { value: 'reversed',     label: 'معكوس' },
          { value: 'card',         label: 'بطاقة مركزية' },
          { value: 'timeline',     label: 'خط زمني' },
        ]} />
      </Row>
      <Row label="إحصائيات في «عن المكتب»">
        <Toggle value={s.aboutShowStats ?? true} onChange={v => updSec('aboutShowStats', v)} />
      </Row>
      <Row label="نمط الخدمات">
        <Sel value={s.servicesStyle ?? 'card-grid'} onChange={v => updSec('servicesStyle', v)} options={[
          { value: 'card-grid',         label: 'شبكة بطاقات' },
          { value: 'icon-list',         label: 'قائمة بأيقونات' },
          { value: 'horizontal-scroll', label: 'تمرير أفقي' },
          { value: 'numbered',          label: 'مرقم' },
          { value: 'minimal',           label: 'بسيط جداً' },
        ]} />
      </Row>
      <Row label="نمط المميزات">
        <Sel value={s.featuresStyle ?? 'icon-list'} onChange={v => updSec('featuresStyle', v)} options={[
          { value: 'icon-list',  label: 'قائمة بأيقونات' },
          { value: 'card-grid',  label: 'شبكة بطاقات' },
          { value: 'numbered',   label: 'مرقمة' },
          { value: 'checklist',  label: 'قائمة ✓' },
          { value: 'minimal',    label: 'بسيط' },
        ]} />
      </Row>
      <Row label="تخطيط قسم CTA">
        <Sel value={s.ctaLayout ?? 'centered'} onChange={v => updSec('ctaLayout', v)} options={[
          { value: 'centered',  label: 'مركزي' },
          { value: 'split',     label: 'مقسم' },
          { value: 'banner',    label: 'بانر شريطي' },
          { value: 'minimal',   label: 'بسيط' },
          { value: 'floating',  label: 'عائم' },
        ]} />
      </Row>
      <Row label="خلفية قسم CTA">
        <Sel value={s.ctaBg ?? 'primary'} onChange={v => updSec('ctaBg', v)} options={[
          { value: 'primary',    label: 'اللون الرئيسي' },
          { value: 'accent',     label: 'لون Accent' },
          { value: 'background', label: 'خلفية الصفحة' },
          { value: 'gradient',   label: 'تدرج' },
        ]} />
      </Row>
      <Row label="نمط الـ Footer">
        <Sel value={s.footerStyle ?? 'dark'} onChange={v => updSec('footerStyle', v)} options={[
          { value: 'dark',    label: 'داكن' },
          { value: 'light',   label: 'فاتح' },
          { value: 'accent',  label: 'Accent' },
          { value: 'minimal', label: 'بسيط' },
        ]} />
      </Row>
      <Row label="أعمدة الـ Footer">
        <Sel value={String(s.footerColumns ?? 2)} onChange={v => updSec('footerColumns', Number(v) as 2 | 3 | 4)} options={[
          { value: '2', label: 'عمودان' },
          { value: '3', label: '3 أعمدة' },
          { value: '4', label: '4 أعمدة' },
        ]} />
      </Row>
      <Row label="روابط السوشيال في الفوتر">
        <Toggle value={s.footerShowSocial ?? true} onChange={v => updSec('footerShowSocial', v)} />
      </Row>
    </div>
  )
}

function NavTab({ config, onChange }: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: string, val: unknown) {
    onChange({ ...config, navigation: { ...config.navigation, [key]: val } })
  }
  const n = config.navigation ?? {}
  return (
    <div className="space-y-1">
      <SectionTitle>مظهر الـ Nav</SectionTitle>
      <Row label="النمط" hint="يؤثر على خلفية شريط التنقل">
        <Sel value={n.style ?? 'transparent'} onChange={v => upd('style', v)} options={[
          { value: 'solid',       label: 'مصمت دائماً' },
          { value: 'transparent', label: 'شفاف ← يتلوّن' },
          { value: 'blur',        label: 'زجاجي ضبابي' },
          { value: 'glass',       label: 'Glass فاخر' },
          { value: 'bordered',    label: 'محدد بـ Accent' },
        ]} />
      </Row>
      <Row label="الارتفاع">
        <Sel value={n.height ?? 'normal'} onChange={v => upd('height', v)} options={[
          { value: 'compact', label: 'ضيق (36px)' },
          { value: 'normal',  label: 'عادي (44px)' },
          { value: 'tall',    label: 'طويل (56px)' },
        ]} />
      </Row>
      <Row label="السلوك عند التمرير">
        <Sel value={n.position ?? 'sticky'} onChange={v => upd('position', v)} options={[
          { value: 'sticky', label: 'لاصق (Sticky)' },
          { value: 'fixed',  label: 'ثابت (Fixed)' },
          { value: 'static', label: 'ساكن' },
        ]} />
      </Row>
      <Row label="حجم الشعار">
        <Sel value={n.logoSize ?? 'md'} onChange={v => upd('logoSize', v)} options={[
          { value: 'sm', label: 'صغير' },
          { value: 'md', label: 'متوسط' },
          { value: 'lg', label: 'كبير' },
        ]} />
      </Row>
      <SectionTitle>خيارات إضافية</SectionTitle>
      <Row label="خط سفلي"><Toggle value={n.showBorder ?? false} onChange={v => upd('showBorder', v)} /></Row>
      <Row label="زر CTA في التنقل"><Toggle value={n.ctaInNav ?? true} onChange={v => upd('ctaInNav', v)} /></Row>
    </div>
  )
}

function ProjectsTab({ config, onChange }: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: keyof typeof config.projectsGrid, val: unknown) {
    onChange({ ...config, projectsGrid: { ...config.projectsGrid, [key]: val } })
  }
  const pg = config.projectsGrid
  return (
    <div className="space-y-1">
      <SectionTitle>شبكة المشاريع</SectionTitle>
      <div className="py-2">
        <p className="text-sm text-gray-700 mb-2">عدد الأعمدة</p>
        <div className="flex gap-2">
          {[2, 3, 4].map(n => (
            <button key={n} type="button" onClick={() => upd('columns', n as 2 | 3 | 4)}
              className={cn('flex-1 py-3 rounded-lg border-2 text-sm font-bold transition-colors',
                pg.columns === n ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-400')}
            >{n}</button>
          ))}
        </div>
      </div>

      <Row label="شكل الشبكة">
        <Sel value={pg.style} onChange={v => upd('style', v as typeof pg.style)} options={[
          { value: 'grid',      label: 'شبكة منتظمة' },
          { value: 'masonry',   label: 'Masonry متفاوتة' },
          { value: 'list',      label: 'قائمة عمودية' },
          { value: 'magazine',  label: 'مجلة (بطل + صغيرة)' },
          { value: 'filmstrip', label: 'شريط أفقي' },
        ]} />
      </Row>
      <Row label="نسبة الصور">
        <Sel value={pg.imageRatio ?? '4/3'} onChange={v => upd('imageRatio', v)} options={[
          { value: 'square',  label: 'مربع (1:1)' },
          { value: '4/3',     label: 'عرضي (4:3)' },
          { value: '16/9',    label: 'سينمائي (16:9)' },
          { value: '3/4',     label: 'طولي (3:4) — بورتريه' },
          { value: 'dynamic', label: 'تلقائي حسب الصورة' },
        ]} />
      </Row>
      <Row label="عرض النص على الصورة" hint="أين يظهر اسم المشروع">
        <Sel value={pg.captionStyle ?? 'overlay'} onChange={v => upd('captionStyle', v)} options={[
          { value: 'overlay',  label: 'فوق الصورة (تدرج)' },
          { value: 'below',    label: 'تحت الصورة' },
          { value: 'slide',    label: 'ينزلق عند hover' },
          { value: 'minimal',  label: 'بسيط جداً' },
          { value: 'floating', label: 'عائم كـ badge' },
        ]} />
      </Row>
      <Row label="تأثير عند hover">
        <Sel value={pg.hoverEffect ?? 'zoom'} onChange={v => upd('hoverEffect', v)} options={[
          { value: 'zoom',   label: 'تكبير الصورة' },
          { value: 'lift',   label: 'رفع البطاقة' },
          { value: 'fade',   label: 'Fade' },
          { value: 'reveal', label: 'كشف النص' },
          { value: 'none',   label: 'بدون تأثير' },
        ]} />
      </Row>
    </div>
  )
}

function CardsTab({ config, onChange }: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function updCard(key: string, val: unknown) {
    onChange({ ...config, cards: { ...config.cards, [key]: val } })
  }
  function updBtn(key: string, val: unknown) {
    onChange({ ...config, buttons: { ...config.buttons, [key]: val } })
  }
  const crd = config.cards ?? {}
  const btn = config.buttons ?? {}
  return (
    <div className="space-y-1">
      <SectionTitle>البطاقات (الخدمات والمميزات)</SectionTitle>
      <Row label="شكل البطاقة" hint="يظهر في المعاينة اليمنى">
        <Sel value={crd.style ?? 'elevated'} onChange={v => updCard('style', v)} options={[
          { value: 'flat',     label: 'مسطحة — بدون ظل' },
          { value: 'elevated', label: 'مرفوعة — ظل ناعم' },
          { value: 'bordered', label: 'محددة — بوردر' },
          { value: 'glass',    label: 'زجاجية — Glassmorphism' },
          { value: 'filled',   label: 'مملوءة — بلون داكن' },
          { value: 'ghost',    label: 'شفافة — بوردر منقط' },
        ]} />
      </Row>
      <Row label="الحشو الداخلي">
        <Sel value={crd.padding ?? 'normal'} onChange={v => updCard('padding', v)} options={[
          { value: 'compact', label: 'ضيق' },
          { value: 'normal',  label: 'عادي' },
          { value: 'large',   label: 'كبير' },
        ]} />
      </Row>
      <Row label="شريط Accent">
        <Sel value={crd.accentBar ?? 'none'} onChange={v => updCard('accentBar', v as 'none' | 'right' | 'left' | 'top' | 'bottom')} options={[
          { value: 'none',   label: 'بدون' },
          { value: 'right',  label: 'يمين' },
          { value: 'left',   label: 'يسار' },
          { value: 'top',    label: 'أعلى' },
          { value: 'bottom', label: 'أسفل' },
        ]} />
      </Row>
      <Row label="شكل حاوية الأيقونة">
        <Sel value={crd.iconShape ?? 'rounded'} onChange={v => updCard('iconShape', v)} options={[
          { value: 'circle',  label: 'دائرة' },
          { value: 'square',  label: 'مربع' },
          { value: 'rounded', label: 'منحنية' },
          { value: 'diamond', label: 'معين (◆)' },
          { value: 'none',    label: 'بدون حاوية' },
        ]} />
      </Row>
      <Row label="تأثير hover للبطاقة">
        <Sel value={crd.hoverEffect ?? 'lift'} onChange={v => updCard('hoverEffect', v)} options={[
          { value: 'lift',   label: 'رفع ناعم' },
          { value: 'glow',   label: 'توهج' },
          { value: 'border', label: 'حدود Accent' },
          { value: 'scale',  label: 'تكبير' },
          { value: 'fill',   label: 'تعبئة بالـ Accent' },
          { value: 'none',   label: 'بدون تأثير' },
        ]} />
      </Row>
      <Row label="أرقام تسلسلية على البطاقات">
        <Toggle value={crd.showNumber ?? false} onChange={v => updCard('showNumber', v)} />
      </Row>

      <SectionTitle>الأزرار</SectionTitle>
      <Row label="شكل الأزرار">
        <Sel value={btn.style ?? 'solid'} onChange={v => updBtn('style', v)} options={[
          { value: 'solid',    label: 'مملوء' },
          { value: 'outline',  label: 'محدد (بوردر)' },
          { value: 'ghost',    label: 'شفاف' },
          { value: 'gradient', label: 'تدرج لوني' },
          { value: 'pill',     label: 'بيضاوي Pill' },
        ]} />
      </Row>
      <Row label="حجم الأزرار">
        <Sel value={btn.size ?? 'md'} onChange={v => updBtn('size', v)} options={[
          { value: 'sm', label: 'صغير' },
          { value: 'md', label: 'متوسط' },
          { value: 'lg', label: 'كبير' },
        ]} />
      </Row>
      <Row label="توهج Glow حول الزر">
        <Toggle value={btn.glow ?? false} onChange={v => updBtn('glow', v)} />
      </Row>
      <Row label="Uppercase — نص كبير">
        <Toggle value={btn.uppercase ?? false} onChange={v => updBtn('uppercase', v)} />
      </Row>
      <Row label="تكبير عند hover">
        <Toggle value={btn.hoverScale ?? true} onChange={v => updBtn('hoverScale', v)} />
      </Row>
    </div>
  )
}

function EffectsTab({ config, onChange }: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function updEff(key: string, val: boolean) {
    onChange({ ...config, effects: { ...config.effects, [key]: val } })
  }
  function updDec(key: string, val: unknown) {
    onChange({ ...config, decorations: { ...config.decorations, [key]: val } })
  }
  const eff = config.effects ?? {}
  const dec = config.decorations ?? {}
  return (
    <div className="space-y-1">
      <SectionTitle>التأثيرات الحركية</SectionTitle>
      <Row label="Fade عند التمرير" hint="الأقسام تظهر بتأثير ناعم">
        <Toggle value={eff.sectionFade ?? true} onChange={v => updEff('sectionFade', v)} />
      </Row>
      <Row label="رفع البطاقات (Hover Lift)">
        <Toggle value={eff.hoverLift ?? true} onChange={v => updEff('hoverLift', v)} />
      </Row>
      <Row label="تمرير سلس للصفحة">
        <Toggle value={eff.smoothScroll ?? true} onChange={v => updEff('smoothScroll', v)} />
      </Row>
      <Row label="تكبير صور المشاريع">
        <Toggle value={eff.projectZoom ?? true} onChange={v => updEff('projectZoom', v)} />
      </Row>
      <Row label="تكبير الأزرار عند hover">
        <Toggle value={eff.buttonScale ?? true} onChange={v => updEff('buttonScale', v)} />
      </Row>
      <Row label="توهج حول عناصر Accent">
        <Toggle value={eff.accentGlow ?? false} onChange={v => updEff('accentGlow', v)} />
      </Row>
      <Row label="Glass Effect للـ Nav">
        <Toggle value={eff.glassEffect ?? false} onChange={v => updEff('glassEffect', v)} />
      </Row>
      <Row label="خط متحرك تحت الروابط">
        <Toggle value={eff.animatedUnderline ?? false} onChange={v => updEff('animatedUnderline', v)} />
      </Row>
      <Row label="نبضة على عناصر Accent (Pulse)">
        <Toggle value={eff.pulseAccent ?? false} onChange={v => updEff('pulseAccent', v)} />
      </Row>

      <SectionTitle>الزخارف والأنماط</SectionTitle>
      <Row label="خط Accent جانبي للعناوين">
        <Toggle value={dec.accentLine ?? true} onChange={v => updDec('accentLine', v)} />
      </Row>
      <Row label="تبادل خلفيات الأقسام">
        <Toggle value={dec.sectionBgAlt ?? true} onChange={v => updDec('sectionBgAlt', v)} />
      </Row>
      <Row label="نقطة لونية في زاوية البطاقة">
        <Toggle value={dec.cardCornerDot ?? false} onChange={v => updDec('cardCornerDot', v)} />
      </Row>
      <Row label="رقم القسم كزخرفة خلفية">
        <Toggle value={dec.sectionLabel ?? false} onChange={v => updDec('sectionLabel', v)} />
      </Row>

      <Row label="فاصل بين الأقسام">
        <Sel value={dec.sectionDivider ?? 'none'} onChange={v => updDec('sectionDivider', v)} options={[
          { value: 'none',      label: 'بدون' },
          { value: 'line',      label: 'خط مستقيم' },
          { value: 'gradient',  label: 'تدرج' },
          { value: 'dots-row',  label: 'صف نقاط' },
          { value: 'wave',      label: 'موجة' },
          { value: 'slash',     label: 'مائل' },
        ]} />
      </Row>
      <Row label="نمط خلفية الأقسام">
        <Sel value={dec.backgroundPattern ?? 'none'} onChange={v => updDec('backgroundPattern', v)} options={[
          { value: 'none',     label: 'بدون نمط' },
          { value: 'dots',     label: 'نقاط' },
          { value: 'grid',     label: 'شبكة' },
          { value: 'diagonal', label: 'خطوط مائلة' },
          { value: 'cross',    label: 'تقاطع' },
        ]} />
      </Row>
      {dec.backgroundPattern && dec.backgroundPattern !== 'none' && (
        <div className="py-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-700">شفافية النمط</p>
            <span className="text-xs font-mono text-gray-400">{Math.round((dec.patternOpacity ?? 0.04) * 100)}%</span>
          </div>
          <input type="range" min={0.01} max={0.25} step={0.01}
            value={dec.patternOpacity ?? 0.04}
            onChange={e => updDec('patternOpacity', Number(e.target.value))}
            className="w-full accent-gray-900" />
        </div>
      )}
    </div>
  )
}

function ContactTab({ config, onChange }: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: string, val: unknown) {
    onChange({ ...config, contactStyle: { ...config.contactStyle, [key]: val } })
  }
  const cs = config.contactStyle ?? {}
  return (
    <div className="space-y-1">
      <SectionTitle>تخطيط صفحة التواصل</SectionTitle>
      <Row label="تخطيط الصفحة" hint="كيف تُرتَّب معلومات التواصل والخريطة">
        <Sel value={cs.layout ?? 'side-by-side'} onChange={v => upd('layout', v)} options={[
          { value: 'side-by-side', label: 'جانب لجانب' },
          { value: 'grid',         label: 'شبكة' },
          { value: 'list',         label: 'قائمة' },
          { value: 'centered',     label: 'مركزي' },
        ]} />
      </Row>

      <SectionTitle>بطاقات معلومات التواصل</SectionTitle>
      <Row label="شكل البطاقات">
        <Sel value={cs.cardStyle ?? 'bordered'} onChange={v => upd('cardStyle', v)} options={[
          { value: 'flat',     label: 'مسطحة' },
          { value: 'glass',    label: 'زجاجية' },
          { value: 'bordered', label: 'محددة (بوردر)' },
          { value: 'filled',   label: 'مملوءة داكنة' },
        ]} />
      </Row>

      <SectionTitle>روابط السوشيال</SectionTitle>
      <Row label="شكل أزرار السوشيال">
        <Sel value={cs.socialStyle ?? 'pills'} onChange={v => upd('socialStyle', v)} options={[
          { value: 'icons',    label: 'أيقونات دائرية' },
          { value: 'pills',    label: 'أزرار بيضاوية' },
          { value: 'outlined', label: 'محددة (بوردر)' },
          { value: 'text',     label: 'نص عادي' },
        ]} />
      </Row>

      <SectionTitle>الخريطة وواتساب</SectionTitle>
      <Row label="طريقة عرض الخريطة">
        <Sel value={cs.mapStyle ?? 'embedded'} onChange={v => upd('mapStyle', v)} options={[
          { value: 'embedded', label: 'مدمجة في الصفحة' },
          { value: 'button',   label: 'زر يفتح الخريطة' },
          { value: 'none',     label: 'إخفاء الخريطة' },
        ]} />
      </Row>
      <Row label="زر واتساب عائم">
        <Toggle value={cs.showWhatsappFloat ?? true} onChange={v => upd('showWhatsappFloat', v)} />
      </Row>
    </div>
  )
}

function IdentityTab({ config, onChange }: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: string, val: unknown) {
    onChange({ ...config, visualPreset: { ...config.visualPreset, [key]: val } })
  }
  const vp = config.visualPreset ?? {}
  return (
    <div className="space-y-1">
      <SectionTitle>هوية القالب</SectionTitle>
      <div className="space-y-3 pt-1">
        <div>
          <Label className="text-sm text-gray-600 mb-1 block">مزاج القالب (للتوثيق)</Label>
          <Input value={vp.themeMood ?? ''} onChange={e => upd('themeMood', e.target.value)}
            placeholder="مثال: فاخر داكن، عصري محايد، جريء..." className="h-9" />
          <p className="text-[10px] text-gray-400 mt-1">يظهر للأدمن فقط، لا يؤثر على الشكل</p>
        </div>
      </div>

      <SectionTitle>كثافة المحتوى</SectionTitle>
      <Row label="كثافة العناصر" hint="تؤثر على المسافات والأحجام">
        <Sel value={vp.density ?? 'normal'} onChange={v => upd('density', v as 'minimal' | 'normal' | 'rich')} options={[
          { value: 'minimal', label: 'بسيط — مساحات واسعة' },
          { value: 'normal',  label: 'عادي — متوازن' },
          { value: 'rich',    label: 'مكثف — عناصر كثيرة' },
        ]} />
      </Row>
      <Row label="درجة التباين" hint="تؤثر على وضوح النصوص والعناصر">
        <Sel value={vp.contrast ?? 'normal'} onChange={v => upd('contrast', v as 'low' | 'normal' | 'high')} options={[
          { value: 'low',    label: 'منخفض — ناعم ومريح' },
          { value: 'normal', label: 'عادي — متوازن' },
          { value: 'high',   label: 'عالي — صارخ وحاد' },
        ]} />
      </Row>

      <SectionTitle>ملخص الإعدادات الحالية</SectionTitle>
      <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs text-gray-600">
        <div className="flex justify-between"><span>الخط:</span><span className="font-mono">{config.fonts.heading}</span></div>
        <div className="flex justify-between"><span>الهيرو:</span><span>{config.hero.style}</span></div>
        <div className="flex justify-between"><span>الأعمدة:</span><span>{config.projectsGrid.columns}</span></div>
        <div className="flex justify-between"><span>البطاقات:</span><span>{config.cards?.style ?? 'elevated'}</span></div>
        <div className="flex justify-between"><span>الأزرار:</span><span>{config.buttons?.style ?? 'solid'}</span></div>
        <div className="flex justify-between"><span>الانحناء:</span><span>{config.layout.borderRadius}</span></div>
        <div className="flex justify-between"><span>الـ Nav:</span><span>{config.navigation?.style ?? 'transparent'}</span></div>
        <div className="flex justify-between"><span>الأقسام:</span><span>{config.layout.sections.length}</span></div>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN BUILDER
// ══════════════════════════════════════════════════════════════════════════════

export default function ThemeBuilderClient({ existingTheme }: { existingTheme?: CustomTheme }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('colors')
  const [saving, setSaving] = useState(false)

  // stage: 'pick' → show preset gallery | 'build' → show editor
  const [stage, setStage] = useState<'pick' | 'build'>(existingTheme ? 'build' : 'pick')

  const [meta, setMeta] = useState({
    name_ar:      existingTheme?.name_ar ?? '',
    name_en:      existingTheme?.name_en ?? '',
    description_ar: existingTheme?.description_ar ?? '',
    plan_required: existingTheme?.plan_required ?? 'pro',
    visibility:   (existingTheme as (CustomTheme & { visibility?: string }) | undefined)?.visibility ?? 'public',
  })

  const [config, setConfig] = useState<CustomThemeConfig>(
    existingTheme?.config ?? DEFAULT_THEME_CONFIG
  )

  // Called when user picks a preset
  function applyPreset(preset: Preset) {
    setConfig(preset.config)
    setMeta(m => ({
      ...m,
      name_ar: m.name_ar || preset.name,
      description_ar: m.description_ar || preset.description,
    }))
    setStage('build')
    setActiveTab('colors')
  }

  function updateMeta(key: string, val: string) {
    setMeta(m => ({ ...m, [key]: val }))
  }

  async function handleSave() {
    if (!meta.name_ar.trim()) { toast.error('أدخل اسم القالب أولاً'); return }
    setSaving(true)
    const body = existingTheme ? { id: existingTheme.id, ...meta, config } : { ...meta, config }
    const res = await fetch('/api/admin/themes/builder', {
      method: existingTheme ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) { toast.error(data.error ?? 'فشل الحفظ', { duration: 5000 }); return }
    toast.success(existingTheme ? '✅ تم تحديث القالب' : '✅ تم إنشاء القالب')
    router.push('/admin/themes')
  }

  const previewFontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(config.fonts.heading)}:wght@400;700;900&family=${encodeURIComponent(config.fonts.body)}:wght@300;400;700&display=swap`

  // ── Preset picker stage ──────────────────────────────────────────────────
  if (stage === 'pick') {
    return (
      <div className="-m-4 md:-m-6">
        <PresetPicker
          onSelect={applyPreset}
          onBlank={() => setStage('build')}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-100px)] md:h-[calc(100vh-48px)] overflow-hidden -m-4 md:-m-6" dir="rtl">
      <style>{`@import url('${previewFontUrl}');`}</style>

      {/* ── Left: Form ── */}
      <div className="flex flex-col w-full md:w-[55%] border-l border-gray-200 bg-white overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 flex-shrink-0">
          <Link href="/admin/themes" className="text-gray-400 hover:text-gray-700 transition-colors">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Input
            value={meta.name_ar}
            onChange={e => updateMeta('name_ar', e.target.value)}
            placeholder="اسم القالب..."
            className="flex-1 h-8 text-sm font-bold border-0 shadow-none focus-visible:ring-0 px-0"
          />
          {!existingTheme && (
            <button
              onClick={() => setStage('pick')}
              className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 px-2.5 py-1 rounded-lg transition-colors flex-shrink-0 whitespace-nowrap"
              title="العودة لاختيار نموذج آخر"
            >
              🎨 تغيير النموذج
            </button>
          )}
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1.5 flex-shrink-0">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            حفظ
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50 flex-shrink-0 scrollbar-hide">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-3 py-2.5 text-xs whitespace-nowrap transition-colors flex-shrink-0 flex items-center gap-1',
                activeTab === tab.id
                  ? 'text-gray-900 font-bold border-b-2 border-gray-900 -mb-px bg-white'
                  : 'text-gray-400 hover:text-gray-700'
              )}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {activeTab === 'basics'   && <BasicsTab   meta={meta} onChange={updateMeta} />}
          {activeTab === 'colors'   && <ColorsTab   config={config} onChange={setConfig} />}
          {activeTab === 'fonts'    && <FontsTab    config={config} onChange={setConfig} />}
          {activeTab === 'hero'     && <HeroTab     config={config} onChange={setConfig} />}
          {activeTab === 'layout'   && <LayoutTab   config={config} onChange={setConfig} />}
          {activeTab === 'nav'      && <NavTab      config={config} onChange={setConfig} />}
          {activeTab === 'projects' && <ProjectsTab config={config} onChange={setConfig} />}
          {activeTab === 'cards'    && <CardsTab    config={config} onChange={setConfig} />}
          {activeTab === 'effects'  && <EffectsTab  config={config} onChange={setConfig} />}
          {activeTab === 'contact'  && <ContactTab  config={config} onChange={setConfig} />}
          {activeTab === 'identity' && <IdentityTab config={config} onChange={setConfig} />}
        </div>
      </div>

      {/* ── Right: Live Preview ── */}
      <div className="hidden md:block flex-1 overflow-hidden">
        <LivePreview config={config} meta={meta} />
      </div>
    </div>
  )
}
