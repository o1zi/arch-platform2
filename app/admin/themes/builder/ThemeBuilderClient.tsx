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

// ── Google Fonts ───────────────────────────────────────────────────────────────
const HEADING_FONTS = [
  'Playfair Display', 'Cormorant Garamond', 'Cinzel', 'DM Serif Display',
  'Josefin Sans', 'Raleway', 'Montserrat', 'Bebas Neue', 'Poppins',
  'Plus Jakarta Sans', 'Inter', 'Outfit', 'Cairo', 'Tajawal', 'Almarai',
  'Readex Pro', 'Noto Kufi Arabic', 'IBM Plex Sans Arabic',
]

const BODY_FONTS = [
  'Cairo', 'Tajawal', 'Almarai', 'Readex Pro', 'IBM Plex Sans Arabic',
  'Noto Kufi Arabic', 'Noto Naskh Arabic', 'Poppins', 'Inter',
  'Plus Jakarta Sans', 'Outfit', 'Raleway',
]

// ── Tabs ───────────────────────────────────────────────────────────────────────
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
]

// ── Helper UI ──────────────────────────────────────────────────────────────────
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
      <span
        className={cn(
          'absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200',
          value ? 'translate-x-5 left-0.5' : 'left-0.5'
        )}
      />
    </button>
  )
}

function ColorPicker({
  value, onChange, label,
}: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <p className="text-sm text-gray-700">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-mono w-16 text-left" dir="ltr">{value}</span>
        <label className="cursor-pointer">
          <div
            className="w-8 h-8 rounded-lg border-2 border-gray-200 shadow-sm hover:scale-110 transition-transform"
            style={{ backgroundColor: value }}
          />
          <input
            type="color"
            value={value}
            onChange={e => onChange(e.target.value)}
            className="sr-only"
          />
        </label>
      </div>
    </div>
  )
}

function Sel({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <Select value={value} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className="h-8 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(o => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// ── Live Preview ───────────────────────────────────────────────────────────────
function LivePreview({ config, meta }: { config: CustomThemeConfig; meta: { name_ar: string } }) {
  const c = config.colors
  const f = config.fonts
  const br = { none: '0px', sm: '4px', md: '8px', lg: '16px', full: '9999px' }[config.layout.borderRadius] ?? '8px'

  return (
    <div className="h-full overflow-y-auto p-4 bg-gray-100">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(f.heading)}:wght@400;700;900&family=${encodeURIComponent(f.body)}:wght@300;400;700&display=swap');`}</style>

      <p className="text-xs text-gray-400 mb-3 font-medium">معاينة حية — تتحدث فورياً</p>

      {/* Mini browser chrome */}
      <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200" dir="rtl">

        {/* Nav */}
        <div className="h-10 flex items-center justify-between px-4" style={{ backgroundColor: c.navBg }}>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: c.accent }} />
            <span className="text-xs font-bold" style={{ color: c.navText, fontFamily: `'${f.heading}', serif` }}>
              {meta.name_ar || 'اسم المكتب'}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-[10px] opacity-60" style={{ color: c.navText }}>الرئيسية</span>
            <span className="text-[10px] opacity-60" style={{ color: c.navText }}>المشاريع</span>
            <span
              className="text-[10px] px-2 py-0.5"
              style={{ backgroundColor: c.accent, color: '#fff', borderRadius: br }}
            >تواصل</span>
          </div>
        </div>

        {/* Hero */}
        <div className="relative px-6 py-10" style={{ backgroundColor: c.primary }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `radial-gradient(circle at 20% 50%, ${c.accent} 0%, transparent 60%)` }} />
          <div className="relative">
            <div className="w-16 h-0.5 mb-3" style={{ backgroundColor: c.accent }} />
            <h2
              className="text-xl font-black mb-2 leading-tight"
              style={{ color: c.navText, fontFamily: `'${f.heading}', serif` }}
            >
              مكتب الهندسة المعمارية
            </h2>
            <p className="text-xs opacity-60 mb-4" style={{ color: c.navText }}>
              نصمم مستقبلك بأفضل المعايير العالمية
            </p>
            <div className="flex gap-2">
              <span
                className="text-[10px] px-3 py-1.5 font-bold"
                style={{ backgroundColor: c.accent, color: '#fff', borderRadius: br }}
              >استعرض مشاريعنا</span>
              <span
                className="text-[10px] px-3 py-1.5 font-bold"
                style={{ border: `1px solid ${c.navText}40`, color: c.navText, borderRadius: br }}
              >تواصل معنا</span>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="px-4 py-5" style={{ backgroundColor: c.background }}>
          <p
            className="text-xs font-black mb-3"
            style={{ color: c.text, fontFamily: `'${f.heading}', serif` }}
          >خدماتنا</p>
          <div className="grid grid-cols-3 gap-2">
            {['التصميم المعماري', 'الإشراف الهندسي', 'الاستشارات'].map((svc, i) => (
              <div
                key={i}
                className="p-3 transition-all"
                style={{
                  backgroundColor: c.cardBg,
                  border: `1px solid ${c.border}`,
                  borderRadius: br,
                }}
              >
                <div className="w-6 h-6 mb-2 flex items-center justify-center"
                  style={{ backgroundColor: `${c.accent}20`, borderRadius: br }}>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.accent }} />
                </div>
                <p className="text-[9px] font-bold" style={{ color: c.text }}>{svc}</p>
                <p className="text-[8px] mt-0.5 opacity-60" style={{ color: c.textLight }}>وصف مختصر</p>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="px-4 pb-4" style={{ backgroundColor: c.background }}>
          <p className="text-xs font-black mb-3" style={{ color: c.text, fontFamily: `'${f.heading}', serif` }}>
            أبرز مشاريعنا
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[c.primary, c.secondary, c.accent].map((bg, i) => (
              <div key={i} className="aspect-square overflow-hidden relative" style={{ borderRadius: br }}>
                <div className="w-full h-full" style={{ backgroundColor: bg, opacity: 0.8 }} />
                <div className="absolute bottom-0 inset-x-0 p-1.5"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }}>
                  <p className="text-[8px] text-white font-bold">مشروع {i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 py-6 text-center" style={{ backgroundColor: c.primary }}>
          <p className="text-xs font-black mb-1" style={{ color: c.navText, fontFamily: `'${f.heading}', serif` }}>
            هل تريد مشروعاً مميزاً؟
          </p>
          <p className="text-[9px] opacity-60 mb-3" style={{ color: c.navText }}>تواصل معنا اليوم</p>
          <span
            className="text-[10px] px-4 py-1.5 font-bold"
            style={{ backgroundColor: c.accent, color: '#fff', borderRadius: br }}
          >ابدأ الآن</span>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 flex items-center justify-between"
          style={{ backgroundColor: c.primary, borderTop: `1px solid ${c.accent}20` }}>
          <span className="text-[9px] opacity-40" style={{ color: c.navText }}>
            © 2025 {meta.name_ar || 'المكتب'}
          </span>
          <div className="flex gap-3">
            {[c.accent, c.accentSecondary ?? c.accent, '#25d366'].map((clr, i) => (
              <div key={i} className="w-4 h-4 rounded-full opacity-70" style={{ backgroundColor: clr }} />
            ))}
          </div>
        </div>
      </div>

      {/* Color palette */}
      <div className="mt-4 p-3 bg-white rounded-xl border border-gray-200">
        <p className="text-[10px] font-bold text-gray-400 mb-2">لوحة الألوان</p>
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(c).map(([key, val]) => (
            <div key={key} className="flex flex-col items-center gap-1">
              <div className="w-7 h-7 rounded-lg border border-gray-200" style={{ backgroundColor: val }} />
              <span className="text-[8px] text-gray-400 max-w-[28px] truncate">{key}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Font preview */}
      <div className="mt-3 p-3 bg-white rounded-xl border border-gray-200">
        <p className="text-[10px] font-bold text-gray-400 mb-2">معاينة الخطوط</p>
        <p className="text-sm font-bold" style={{ fontFamily: `'${f.heading}', serif`, color: c.text }}>
          العنوان الرئيسي — {f.heading}
        </p>
        <p className="text-xs mt-1 opacity-70" style={{ fontFamily: `'${f.body}', sans-serif`, color: c.textLight }}>
          هذا نص وصفي يوضح خط النص الأساسي — {f.body}
        </p>
      </div>
    </div>
  )
}

// ── Tab Panels ─────────────────────────────────────────────────────────────────

function BasicsTab({
  meta, onChange,
}: {
  meta: { name_ar: string; name_en: string; description_ar: string; plan_required: string; visibility: string }
  onChange: (k: string, v: string) => void
}) {
  return (
    <div className="space-y-4">
      <SectionTitle>معلومات القالب</SectionTitle>
      <div className="space-y-3">
        <div>
          <Label className="text-sm text-gray-600 mb-1 block">اسم القالب (عربي) *</Label>
          <Input value={meta.name_ar} onChange={e => onChange('name_ar', e.target.value)}
            placeholder="مثال: قالب فاخر ذهبي" className="h-9" />
        </div>
        <div>
          <Label className="text-sm text-gray-600 mb-1 block">اسم القالب (إنجليزي)</Label>
          <Input value={meta.name_en} onChange={e => onChange('name_en', e.target.value)}
            placeholder="Luxury Gold Theme" className="h-9" dir="ltr" />
        </div>
        <div>
          <Label className="text-sm text-gray-600 mb-1 block">وصف القالب</Label>
          <textarea
            value={meta.description_ar}
            onChange={e => onChange('description_ar', e.target.value)}
            placeholder="وصف مختصر يظهر في قائمة القوالب..."
            className="w-full h-20 px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
      </div>

      <SectionTitle>الإعدادات</SectionTitle>
      <Row label="الباقة المطلوبة" hint="أقل باقة يمكنها استخدام هذا القالب">
        <Sel value={meta.plan_required} onChange={v => onChange('plan_required', v)} options={[
          { value: 'basic', label: 'Basic — للجميع' },
          { value: 'pro', label: 'Pro فأعلى' },
          { value: 'premium', label: 'Premium فقط' },
        ]} />
      </Row>
      <Row label="الظهور">
        <Sel value={meta.visibility} onChange={v => onChange('visibility', v)} options={[
          { value: 'public', label: 'عام — لكل المكاتب' },
          { value: 'private', label: 'خاص — للمخصصين فقط' },
        ]} />
      </Row>
    </div>
  )
}

function ColorsTab({
  config, onChange,
}: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: keyof typeof config.colors, val: string) {
    onChange({ ...config, colors: { ...config.colors, [key]: val } })
  }
  const c = config.colors
  return (
    <div className="space-y-1">
      <SectionTitle>الألوان الرئيسية</SectionTitle>
      <ColorPicker value={c.primary}   onChange={v => upd('primary', v)}   label="اللون الرئيسي (Primary)" />
      <ColorPicker value={c.secondary} onChange={v => upd('secondary', v)} label="اللون الثانوي (Secondary)" />
      <ColorPicker value={c.accent}    onChange={v => upd('accent', v)}    label="لون التمييز (Accent)" />
      <ColorPicker value={c.accentSecondary ?? '#e2c97e'} onChange={v => upd('accentSecondary', v)} label="Accent ثانوي" />

      <SectionTitle>الخلفية والنصوص</SectionTitle>
      <ColorPicker value={c.background} onChange={v => upd('background', v)} label="خلفية الصفحة" />
      <ColorPicker value={c.text}       onChange={v => upd('text', v)}       label="لون النصوص الرئيسية" />
      <ColorPicker value={c.textLight}  onChange={v => upd('textLight', v)}  label="لون النصوص الثانوية" />
      <ColorPicker value={c.cardBg ?? '#f8fafc'} onChange={v => upd('cardBg', v)} label="خلفية البطاقات" />
      <ColorPicker value={c.border ?? '#e2e8f0'}  onChange={v => upd('border', v)}  label="لون الحدود" />

      <SectionTitle>شريط التنقل</SectionTitle>
      <ColorPicker value={c.navBg ?? c.primary}   onChange={v => upd('navBg', v)}   label="خلفية الـ Nav" />
      <ColorPicker value={c.navText ?? '#ffffff'}  onChange={v => upd('navText', v)} label="نصوص الـ Nav" />

      {/* Quick Palettes */}
      <SectionTitle>لوحات جاهزة</SectionTitle>
      <div className="grid grid-cols-2 gap-2 pt-1">
        {[
          { name: 'فاخر داكن', primary: '#0a0a0a', accent: '#c9a84c', bg: '#0a0a0a', text: '#f5f5f0', navBg: '#000' },
          { name: 'أبيض عصري', primary: '#ffffff', accent: '#2563eb', bg: '#ffffff', text: '#111827', navBg: '#fff' },
          { name: 'جريء أحمر', primary: '#000000', accent: '#ef4444', bg: '#000000', text: '#ffffff', navBg: '#000' },
          { name: 'كريمي كلاسيك', primary: '#fdf8f0', accent: '#8b5e3c', bg: '#fdf8f0', text: '#2c1a0e', navBg: '#2c1a0e' },
          { name: 'بحري فاخر', primary: '#0f2044', accent: '#c9a84c', bg: '#ffffff', text: '#0f2044', navBg: '#0f2044' },
          { name: 'أخضر طبيعي', primary: '#1a3d2b', accent: '#7fb069', bg: '#fafaf8', text: '#1a2e1a', navBg: '#1a3d2b' },
        ].map(p => (
          <button
            key={p.name}
            onClick={() => onChange({
              ...config,
              colors: {
                ...config.colors,
                primary: p.primary, accent: p.accent, background: p.bg,
                text: p.text, navBg: p.navBg,
                navText: p.primary === p.bg ? config.colors.navText : '#ffffff',
              },
            })}
            className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors text-right"
          >
            <div className="flex gap-1 flex-shrink-0">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.primary }} />
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: p.accent }} />
              <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: p.bg }} />
            </div>
            <span className="text-xs font-medium text-gray-700">{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function FontsTab({
  config, onChange,
}: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: keyof typeof config.fonts, val: unknown) {
    onChange({ ...config, fonts: { ...config.fonts, [key]: val } })
  }
  const f = config.fonts
  return (
    <div className="space-y-1">
      <SectionTitle>خط العناوين</SectionTitle>
      <Row label="الخط">
        <Select value={f.heading} onValueChange={v => upd('heading', v)}>
          <SelectTrigger className="h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
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
          { value: '400', label: 'خفيف (400)' },
          { value: '600', label: 'متوسط (600)' },
          { value: '700', label: 'عريض (700)' },
          { value: '800', label: 'أعرض (800)' },
          { value: '900', label: 'أثقل (900)' },
        ]} />
      </Row>
      <Row label="أحرف كبيرة">
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
      <Row label="الحجم">
        <Sel value={f.bodySize ?? 'md'} onChange={v => upd('bodySize', v)} options={[
          { value: 'sm', label: 'صغير' },
          { value: 'md', label: 'متوسط' },
          { value: 'lg', label: 'كبير' },
        ]} />
      </Row>

      <SectionTitle>ضبط دقيق</SectionTitle>
      <Row label="تباعد الحروف">
        <Sel value={f.letterSpacing ?? 'normal'} onChange={v => upd('letterSpacing', v)} options={[
          { value: 'tight', label: 'ضيق' },
          { value: 'normal', label: 'عادي' },
          { value: 'wide', label: 'واسع' },
          { value: 'wider', label: 'أوسع' },
        ]} />
      </Row>
      <Row label="ارتفاع السطر">
        <Sel value={f.lineHeight ?? 'relaxed'} onChange={v => upd('lineHeight', v)} options={[
          { value: 'tight', label: 'ضيق' },
          { value: 'normal', label: 'عادي' },
          { value: 'relaxed', label: 'مريح' },
          { value: 'loose', label: 'واسع' },
        ]} />
      </Row>
    </div>
  )
}

function HeroTab({
  config, onChange,
}: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: keyof typeof config.hero, val: unknown) {
    onChange({ ...config, hero: { ...config.hero, [key]: val } })
  }
  const h = config.hero
  return (
    <div className="space-y-1">
      <SectionTitle>شكل الهيرو</SectionTitle>
      <Row label="النمط" hint="الشكل العام لقسم الهيرو">
        <Sel value={h.style} onChange={v => upd('style', v)} options={[
          { value: 'fullscreen', label: 'ملء الشاشة' },
          { value: 'split', label: 'مقسم (نص + صورة)' },
          { value: 'split-reverse', label: 'مقسم معكوس' },
          { value: 'centered', label: 'مركزي' },
          { value: 'minimal', label: 'بسيط' },
          { value: 'cinematic', label: 'سينمائي' },
        ]} />
      </Row>
      <Row label="الارتفاع">
        <Sel value={h.height ?? 'screen'} onChange={v => upd('height', v)} options={[
          { value: 'half', label: 'نصف الشاشة' },
          { value: 'tall', label: 'طويل (80%)' },
          { value: 'screen', label: 'شاشة كاملة' },
        ]} />
      </Row>
      <Row label="محاذاة النص">
        <Sel value={h.textAlign} onChange={v => upd('textAlign', v)} options={[
          { value: 'right', label: 'يمين' },
          { value: 'center', label: 'وسط' },
          { value: 'left', label: 'يسار' },
        ]} />
      </Row>

      <SectionTitle>الطبقة الشفافة</SectionTitle>
      <Row label="النمط">
        <Sel value={h.overlayStyle ?? 'gradient'} onChange={v => upd('overlayStyle', v)} options={[
          { value: 'gradient', label: 'تدرج' },
          { value: 'flat', label: 'مستوي' },
          { value: 'radial', label: 'دائري' },
          { value: 'vignette', label: 'Vignette' },
          { value: 'diagonal', label: 'قطري' },
        ]} />
      </Row>
      <div className="py-2">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-gray-700">شفافية الطبقة</p>
          <span className="text-xs text-gray-400 font-mono">{Math.round(h.overlayOpacity * 100)}%</span>
        </div>
        <input
          type="range" min={0} max={1} step={0.05}
          value={h.overlayOpacity}
          onChange={e => upd('overlayOpacity', Number(e.target.value))}
          className="w-full accent-gray-900"
        />
      </div>

      <SectionTitle>أزرار الهيرو</SectionTitle>
      <Row label="شكل الأزرار">
        <Sel value={h.ctaStyle ?? 'solid'} onChange={v => upd('ctaStyle', v)} options={[
          { value: 'solid', label: 'مملوء' },
          { value: 'outline', label: 'محدد' },
          { value: 'ghost', label: 'شفاف' },
          { value: 'gradient', label: 'تدرج' },
        ]} />
      </Row>
      <div className="space-y-2 pt-1">
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">نص الزر الرئيسي</Label>
          <Input value={h.ctaPrimaryText ?? 'استعرض مشاريعنا'}
            onChange={e => upd('ctaPrimaryText', e.target.value)} className="h-8 text-sm" />
        </div>
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">نص الزر الثانوي</Label>
          <Input value={h.ctaSecondaryText ?? 'تواصل معنا'}
            onChange={e => upd('ctaSecondaryText', e.target.value)} className="h-8 text-sm" />
        </div>
      </div>

      <SectionTitle>خيارات إضافية</SectionTitle>
      <Row label="إظهار الشعار"><Toggle value={h.showLogo ?? true} onChange={v => upd('showLogo', v)} /></Row>
      <Row label="سهم التمرير للأسفل"><Toggle value={h.showScrollIndicator ?? true} onChange={v => upd('showScrollIndicator', v)} /></Row>
    </div>
  )
}

function LayoutTab({
  config, onChange,
}: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: keyof typeof config.layout, val: unknown) {
    onChange({ ...config, layout: { ...config.layout, [key]: val } })
  }
  const l = config.layout
  const allSections = ['hero', 'about', 'services', 'projects', 'features', 'cta', 'footer'] as const
  const sectionLabels: Record<string, string> = {
    hero: 'الهيرو', about: 'عن المكتب', services: 'الخدمات',
    projects: 'المشاريع', features: 'المميزات', cta: 'دعوة للتواصل', footer: 'التذييل',
  }

  return (
    <div className="space-y-1">
      <SectionTitle>التخطيط العام</SectionTitle>
      <Row label="انحناء الزوايا">
        <Sel value={l.borderRadius} onChange={v => upd('borderRadius', v)} options={[
          { value: 'none', label: 'حادة (بدون انحناء)' },
          { value: 'sm', label: 'انحناء خفيف' },
          { value: 'md', label: 'انحناء متوسط' },
          { value: 'lg', label: 'انحناء كبير' },
          { value: 'full', label: 'دائري كامل' },
        ]} />
      </Row>
      <Row label="المسافات بين الأقسام">
        <Sel value={l.spacing} onChange={v => upd('spacing', v)} options={[
          { value: 'compact', label: 'ضيقة' },
          { value: 'normal', label: 'عادية' },
          { value: 'spacious', label: 'واسعة' },
        ]} />
      </Row>
      <Row label="أقصى عرض للمحتوى">
        <Sel value={l.maxWidth ?? 'normal'} onChange={v => upd('maxWidth', v)} options={[
          { value: 'narrow', label: 'ضيق (896px)' },
          { value: 'normal', label: 'عادي (1280px)' },
          { value: 'wide', label: 'واسع (1536px)' },
          { value: 'full', label: 'ملء الشاشة' },
        ]} />
      </Row>

      <SectionTitle>أقسام الصفحة الرئيسية</SectionTitle>
      <p className="text-xs text-gray-400 mb-2">فعّل أو عطّل الأقسام — الترتيب ثابت</p>
      <div className="space-y-1.5">
        {allSections.map(sec => {
          const active = l.sections.includes(sec)
          return (
            <div key={sec} className={cn(
              'flex items-center justify-between px-3 py-2 rounded-lg border transition-colors',
              active ? 'border-gray-300 bg-gray-50' : 'border-gray-100 bg-white opacity-50'
            )}>
              <span className="text-sm text-gray-700">{sectionLabels[sec]}</span>
              <Toggle
                value={active}
                onChange={on => {
                  const newSections = on
                    ? [...l.sections, sec] as typeof l.sections
                    : l.sections.filter(s => s !== sec) as typeof l.sections
                  // Keep sections in the correct order
                  const ordered = allSections.filter(s => newSections.includes(s))
                  upd('sections', ordered)
                }}
              />
            </div>
          )
        })}
      </div>

      <SectionTitle>إعدادات الأقسام</SectionTitle>
      <Row label="تخطيط &quot;عن المكتب&quot;">
        <Sel value={config.sections?.aboutLayout ?? 'side-by-side'} onChange={v =>
          onChange({ ...config, sections: { ...config.sections, aboutLayout: v as 'side-by-side' | 'stacked' | 'reversed' | 'card' | 'timeline' } })
        } options={[
          { value: 'side-by-side', label: 'جانب لجانب' },
          { value: 'stacked', label: 'عمودي' },
          { value: 'reversed', label: 'معكوس' },
          { value: 'card', label: 'بطاقة' },
          { value: 'timeline', label: 'خط زمني' },
        ]} />
      </Row>
      <Row label="إحصائيات في &quot;عن المكتب&quot;">
        <Toggle value={config.sections?.aboutShowStats ?? true}
          onChange={v => onChange({ ...config, sections: { ...config.sections, aboutShowStats: v } })} />
      </Row>
      <Row label="تخطيط الخدمات">
        <Sel value={config.sections?.servicesStyle ?? 'card-grid'} onChange={v =>
          onChange({ ...config, sections: { ...config.sections, servicesStyle: v as 'card-grid' | 'icon-list' | 'horizontal-scroll' | 'numbered' | 'minimal' } })
        } options={[
          { value: 'card-grid', label: 'شبكة بطاقات' },
          { value: 'icon-list', label: 'قائمة بأيقونات' },
          { value: 'horizontal-scroll', label: 'تمرير أفقي' },
          { value: 'numbered', label: 'مرقم' },
          { value: 'minimal', label: 'بسيط' },
        ]} />
      </Row>
      <Row label="تخطيط CTA">
        <Sel value={config.sections?.ctaLayout ?? 'split'} onChange={v =>
          onChange({ ...config, sections: { ...config.sections, ctaLayout: v as 'split' | 'centered' | 'banner' | 'minimal' | 'floating' } })
        } options={[
          { value: 'split', label: 'مقسم' },
          { value: 'centered', label: 'مركزي' },
          { value: 'banner', label: 'بانر' },
          { value: 'minimal', label: 'بسيط' },
          { value: 'floating', label: 'عائم' },
        ]} />
      </Row>
      <Row label="نمط الـ Footer">
        <Sel value={config.sections?.footerStyle ?? 'dark'} onChange={v =>
          onChange({ ...config, sections: { ...config.sections, footerStyle: v as 'dark' | 'light' | 'accent' | 'minimal' } })
        } options={[
          { value: 'dark', label: 'داكن' },
          { value: 'light', label: 'فاتح' },
          { value: 'accent', label: 'Accent' },
          { value: 'minimal', label: 'بسيط' },
        ]} />
      </Row>
    </div>
  )
}

function NavTab({
  config, onChange,
}: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: string, val: unknown) {
    onChange({ ...config, navigation: { ...config.navigation, [key]: val } })
  }
  const n = config.navigation ?? {}
  return (
    <div className="space-y-1">
      <SectionTitle>شريط التنقل</SectionTitle>
      <Row label="النمط">
        <Sel value={n.style ?? 'transparent'} onChange={v => upd('style', v)} options={[
          { value: 'solid', label: 'مصمت' },
          { value: 'transparent', label: 'شفاف → يتحول' },
          { value: 'blur', label: 'زجاجي ضبابي' },
          { value: 'glass', label: 'Glass' },
          { value: 'bordered', label: 'محدد' },
        ]} />
      </Row>
      <Row label="الارتفاع">
        <Sel value={n.height ?? 'normal'} onChange={v => upd('height', v)} options={[
          { value: 'compact', label: 'ضيق' },
          { value: 'normal', label: 'عادي' },
          { value: 'tall', label: 'طويل' },
        ]} />
      </Row>
      <Row label="الموضع عند التمرير">
        <Sel value={n.position ?? 'sticky'} onChange={v => upd('position', v)} options={[
          { value: 'sticky', label: 'لاصق (Sticky)' },
          { value: 'fixed', label: 'ثابت (Fixed)' },
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
      <Row label="خط سفلي"><Toggle value={n.showBorder ?? false} onChange={v => upd('showBorder', v)} /></Row>
      <Row label="زر CTA في التنقل"><Toggle value={n.ctaInNav ?? true} onChange={v => upd('ctaInNav', v)} /></Row>
    </div>
  )
}

function ProjectsTab({
  config, onChange,
}: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function upd(key: keyof typeof config.projectsGrid, val: unknown) {
    onChange({ ...config, projectsGrid: { ...config.projectsGrid, [key]: val } })
  }
  const pg = config.projectsGrid
  return (
    <div className="space-y-1">
      <SectionTitle>شبكة المشاريع</SectionTitle>

      {/* Columns visual selector */}
      <div className="py-2">
        <p className="text-sm text-gray-700 mb-2">عدد الأعمدة</p>
        <div className="flex gap-2">
          {[2, 3, 4].map(n => (
            <button
              key={n}
              onClick={() => upd('columns', n)}
              className={cn(
                'flex-1 py-3 rounded-lg border-2 transition-colors text-sm font-bold',
                pg.columns === n
                  ? 'border-gray-900 bg-gray-900 text-white'
                  : 'border-gray-200 text-gray-500 hover:border-gray-400'
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <Row label="شكل الشبكة">
        <Sel value={pg.style} onChange={v => upd('style', v as typeof pg.style)} options={[
          { value: 'grid', label: 'شبكة منتظمة' },
          { value: 'masonry', label: 'Masonry' },
          { value: 'list', label: 'قائمة' },
          { value: 'magazine', label: 'مجلة' },
          { value: 'filmstrip', label: 'شريط أفقي' },
        ]} />
      </Row>
      <Row label="نسبة الصور">
        <Sel value={pg.imageRatio ?? '4/3'} onChange={v => upd('imageRatio', v)} options={[
          { value: 'square', label: 'مربع (1:1)' },
          { value: '4/3', label: 'عرضي (4:3)' },
          { value: '16/9', label: 'سينمائي (16:9)' },
          { value: '3/4', label: 'طولي (3:4)' },
          { value: 'dynamic', label: 'تلقائي' },
        ]} />
      </Row>
      <Row label="نمط النص على البطاقة">
        <Sel value={pg.captionStyle ?? 'overlay'} onChange={v => upd('captionStyle', v)} options={[
          { value: 'overlay', label: 'فوق الصورة' },
          { value: 'below', label: 'تحت الصورة' },
          { value: 'slide', label: 'ينزلق للأعلى' },
          { value: 'minimal', label: 'بسيط' },
          { value: 'floating', label: 'عائم' },
        ]} />
      </Row>
      <Row label="تأثير Hover">
        <Sel value={pg.hoverEffect ?? 'zoom'} onChange={v => upd('hoverEffect', v)} options={[
          { value: 'zoom', label: 'تكبير الصورة' },
          { value: 'lift', label: 'رفع البطاقة' },
          { value: 'fade', label: 'Fade' },
          { value: 'reveal', label: 'كشف النص' },
          { value: 'none', label: 'بدون تأثير' },
        ]} />
      </Row>
    </div>
  )
}

function CardsTab({
  config, onChange,
}: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
  function updCard(key: string, val: unknown) {
    onChange({ ...config, cards: { ...config.cards, [key]: val } })
  }
  function updBtn(key: string, val: unknown) {
    onChange({ ...config, buttons: { ...config.buttons, [key]: val } })
  }
  const cards = config.cards ?? {}
  const btns = config.buttons ?? {}
  return (
    <div className="space-y-1">
      <SectionTitle>البطاقات (الخدمات والمميزات)</SectionTitle>
      <Row label="شكل البطاقة">
        <Sel value={cards.style ?? 'elevated'} onChange={v => updCard('style', v)} options={[
          { value: 'flat', label: 'مستوية' },
          { value: 'elevated', label: 'مرفوعة (ظل)' },
          { value: 'bordered', label: 'محددة' },
          { value: 'glass', label: 'زجاجية' },
          { value: 'filled', label: 'مملوءة' },
          { value: 'ghost', label: 'شفافة' },
        ]} />
      </Row>
      <Row label="الحشو الداخلي">
        <Sel value={cards.padding ?? 'normal'} onChange={v => updCard('padding', v)} options={[
          { value: 'compact', label: 'ضيق' },
          { value: 'normal', label: 'عادي' },
          { value: 'large', label: 'كبير' },
        ]} />
      </Row>
      <Row label="شكل الأيقونة">
        <Sel value={cards.iconShape ?? 'rounded'} onChange={v => updCard('iconShape', v)} options={[
          { value: 'circle', label: 'دائرة' },
          { value: 'square', label: 'مربع' },
          { value: 'rounded', label: 'منحنية' },
          { value: 'diamond', label: 'معين' },
          { value: 'none', label: 'بدون' },
        ]} />
      </Row>
      <Row label="تأثير Hover للبطاقة">
        <Sel value={cards.hoverEffect ?? 'lift'} onChange={v => updCard('hoverEffect', v)} options={[
          { value: 'lift', label: 'رفع' },
          { value: 'glow', label: 'توهج' },
          { value: 'border', label: 'حدود' },
          { value: 'scale', label: 'تكبير' },
          { value: 'fill', label: 'تعبئة' },
          { value: 'none', label: 'بدون' },
        ]} />
      </Row>
      <Row label="أرقام تسلسلية"><Toggle value={cards.showNumber ?? false} onChange={v => updCard('showNumber', v)} /></Row>

      <SectionTitle>الأزرار</SectionTitle>
      <Row label="شكل الأزرار">
        <Sel value={btns.style ?? 'solid'} onChange={v => updBtn('style', v)} options={[
          { value: 'solid', label: 'مملوء' },
          { value: 'outline', label: 'محدد' },
          { value: 'ghost', label: 'شفاف' },
          { value: 'gradient', label: 'تدرج' },
          { value: 'pill', label: 'بيضاوي' },
        ]} />
      </Row>
      <Row label="حجم الأزرار">
        <Sel value={btns.size ?? 'md'} onChange={v => updBtn('size', v)} options={[
          { value: 'sm', label: 'صغير' },
          { value: 'md', label: 'متوسط' },
          { value: 'lg', label: 'كبير' },
        ]} />
      </Row>
      <Row label="توهج حول الزر"><Toggle value={btns.glow ?? false} onChange={v => updBtn('glow', v)} /></Row>
      <Row label="نص كبير (Uppercase)"><Toggle value={btns.uppercase ?? false} onChange={v => updBtn('uppercase', v)} /></Row>
      <Row label="تكبير عند Hover"><Toggle value={btns.hoverScale ?? true} onChange={v => updBtn('hoverScale', v)} /></Row>
    </div>
  )
}

function EffectsTab({
  config, onChange,
}: { config: CustomThemeConfig; onChange: (c: CustomThemeConfig) => void }) {
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
      <Row label="Fade عند التمرير"><Toggle value={eff.sectionFade ?? true} onChange={v => updEff('sectionFade', v)} /></Row>
      <Row label="رفع البطاقات عند Hover"><Toggle value={eff.hoverLift ?? true} onChange={v => updEff('hoverLift', v)} /></Row>
      <Row label="تمرير سلس للصفحة"><Toggle value={eff.smoothScroll ?? true} onChange={v => updEff('smoothScroll', v)} /></Row>
      <Row label="تكبير صور المشاريع"><Toggle value={eff.projectZoom ?? true} onChange={v => updEff('projectZoom', v)} /></Row>
      <Row label="تكبير الأزرار"><Toggle value={eff.buttonScale ?? true} onChange={v => updEff('buttonScale', v)} /></Row>
      <Row label="توهج Accent"><Toggle value={eff.accentGlow ?? false} onChange={v => updEff('accentGlow', v)} /></Row>
      <Row label="Glass Effect للـ Nav"><Toggle value={eff.glassEffect ?? false} onChange={v => updEff('glassEffect', v)} /></Row>
      <Row label="خط متحرك على الروابط"><Toggle value={eff.animatedUnderline ?? false} onChange={v => updEff('animatedUnderline', v)} /></Row>

      <SectionTitle>الزخارف</SectionTitle>
      <Row label="فاصل بين الأقسام">
        <Sel value={dec.sectionDivider ?? 'none'} onChange={v => updDec('sectionDivider', v)} options={[
          { value: 'none', label: 'بدون' },
          { value: 'line', label: 'خط' },
          { value: 'gradient', label: 'تدرج' },
          { value: 'dots-row', label: 'نقاط' },
          { value: 'wave', label: 'موجة' },
          { value: 'slash', label: 'مائل' },
        ]} />
      </Row>
      <Row label="نمط الخلفية">
        <Sel value={dec.backgroundPattern ?? 'none'} onChange={v => updDec('backgroundPattern', v)} options={[
          { value: 'none', label: 'بدون نمط' },
          { value: 'dots', label: 'نقاط' },
          { value: 'grid', label: 'شبكة' },
          { value: 'diagonal', label: 'مائل' },
          { value: 'cross', label: 'تقاطع' },
        ]} />
      </Row>
      {dec.backgroundPattern && dec.backgroundPattern !== 'none' && (
        <div className="py-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-gray-700">شفافية النمط</p>
            <span className="text-xs text-gray-400 font-mono">{Math.round((dec.patternOpacity ?? 0.04) * 100)}%</span>
          </div>
          <input
            type="range" min={0.01} max={0.2} step={0.01}
            value={dec.patternOpacity ?? 0.04}
            onChange={e => updDec('patternOpacity', Number(e.target.value))}
            className="w-full accent-gray-900"
          />
        </div>
      )}
      <Row label="خط ملون جانبي للعناوين"><Toggle value={dec.accentLine ?? true} onChange={v => updDec('accentLine', v)} /></Row>
      <Row label="تبادل خلفيات الأقسام"><Toggle value={dec.sectionBgAlt ?? true} onChange={v => updDec('sectionBgAlt', v)} /></Row>
      <Row label="نقطة في زاوية البطاقة"><Toggle value={dec.cardCornerDot ?? false} onChange={v => updDec('cardCornerDot', v)} /></Row>
    </div>
  )
}

// ── Main Builder ───────────────────────────────────────────────────────────────
export default function ThemeBuilderClient({ existingTheme }: { existingTheme?: CustomTheme }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('colors')
  const [saving, setSaving] = useState(false)

  const [meta, setMeta] = useState({
    name_ar: existingTheme?.name_ar ?? '',
    name_en: existingTheme?.name_en ?? '',
    description_ar: existingTheme?.description_ar ?? '',
    plan_required: existingTheme?.plan_required ?? 'pro',
    visibility: (existingTheme as (CustomTheme & { visibility?: string }) | undefined)?.visibility ?? 'public',
  })

  const [config, setConfig] = useState<CustomThemeConfig>(
    existingTheme?.config ?? DEFAULT_THEME_CONFIG
  )

  function updateMeta(key: string, val: string) {
    setMeta(m => ({ ...m, [key]: val }))
  }

  async function handleSave() {
    if (!meta.name_ar.trim()) { toast.error('أدخل اسم القالب أولاً'); return }
    setSaving(true)

    const body = existingTheme
      ? { id: existingTheme.id, ...meta, config }
      : { ...meta, config }

    const res = await fetch('/api/admin/themes/builder', {
      method: existingTheme ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      toast.error(data.error ?? 'فشل الحفظ', { duration: 5000 })
      return
    }

    toast.success(existingTheme ? '✅ تم تحديث القالب' : '✅ تم إنشاء القالب')
    router.push('/admin/themes')
  }

  const previewFontUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(config.fonts.heading)}:wght@400;700;900&family=${encodeURIComponent(config.fonts.body)}:wght@300;400;700&display=swap`

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
          <Button onClick={handleSave} disabled={saving} size="sm" className="gap-1.5 flex-shrink-0">
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            حفظ
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50 flex-shrink-0 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
        </div>
      </div>

      {/* ── Right: Live Preview ── */}
      <div className="hidden md:block flex-1 overflow-hidden">
        <LivePreview config={config} meta={meta} />
      </div>
    </div>
  )
}
