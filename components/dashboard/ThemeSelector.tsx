'use client'

import { useState } from 'react'
import { Tenant, Theme, CustomTheme } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { CheckCircle2, Lock, Palette } from 'lucide-react'
import Image from 'next/image'

const BUILT_IN_THEMES: { id: Theme; name: string; description: string; colors: string[] }[] = [
  {
    id: 'modern',
    name: 'عصري',
    description: 'تقني، نظيف، احترافي. مثالي للمكاتب الحديثة.',
    colors: ['#0f0f0f', '#ffffff', '#3b82f6'],
  },
  {
    id: 'classic',
    name: 'كلاسيكي',
    description: 'راسخ، موثوق، تقليدي راقٍ. للمكاتب ذات الخبرة.',
    colors: ['#fdf8f0', '#3d2b1f', '#c9a84c'],
  },
  {
    id: 'bold',
    name: 'جريء',
    description: 'قوي، مبدع، جريء. يترك انطباعاً لا يُنسى.',
    colors: ['#000000', '#ef4444', '#ffffff'],
  },
  {
    id: 'minimal',
    name: 'بسيط',
    description: 'هادئ، راقٍ، مركّز. يبرز المشاريع دون تشتيت.',
    colors: ['#ffffff', '#f8f8f8', '#111111'],
  },
  {
    id: 'luxury',
    name: 'فاخر',
    description: 'حصري، فاخر، راقٍ جداً. للمكاتب المتميزة.',
    colors: ['#0a0a0a', '#c9a84c', '#2a2a2a'],
  },
]

interface Props {
  tenant: Tenant & { custom_theme_id?: string | null }
  availableThemes: Theme[]
  customThemes: CustomTheme[]
}

export default function ThemeSelector({ tenant, availableThemes, customThemes }: Props) {
  const supabase = createClient()

  // الحالة الحالية: قالب مدمج أم مخصص
  const [activeBuiltIn, setActiveBuiltIn] = useState<Theme>(tenant.theme)
  const [activeCustomId, setActiveCustomId] = useState<string | null>(tenant.custom_theme_id ?? null)
  const [saving, setSaving] = useState(false)

  // هل القالب الفعّال حالياً مخصص؟
  const isCustomActive = activeCustomId !== null

  async function selectBuiltIn(theme: Theme) {
    if (!availableThemes.includes(theme)) return
    if (!isCustomActive && theme === activeBuiltIn) return
    setSaving(true)
    const { error } = await supabase
      .from('tenants')
      .update({ theme, custom_theme_id: null })
      .eq('id', tenant.id)
    if (error) {
      toast.error('فشل تغيير القالب')
    } else {
      setActiveBuiltIn(theme)
      setActiveCustomId(null)
      toast.success(`تم تفعيل قالب "${BUILT_IN_THEMES.find(t => t.id === theme)?.name}"`)
    }
    setSaving(false)
  }

  async function selectCustom(ct: CustomTheme) {
    if (activeCustomId === ct.id) return
    setSaving(true)
    const { error } = await supabase
      .from('tenants')
      .update({ custom_theme_id: ct.id })
      .eq('id', tenant.id)
    if (error) {
      toast.error('فشل تغيير القالب')
    } else {
      setActiveCustomId(ct.id)
      toast.success(`تم تفعيل قالب "${ct.name_ar}"`)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-8">

      {/* ── القوالب المدمجة ── */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">القوالب الأساسية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BUILT_IN_THEMES.map(theme => {
            const available = availableThemes.includes(theme.id)
            const isActive = !isCustomActive && activeBuiltIn === theme.id

            return (
              <div
                key={theme.id}
                onClick={() => available && !saving && selectBuiltIn(theme.id)}
                className={cn(
                  'relative rounded-xl border-2 overflow-hidden transition-all',
                  isActive
                    ? 'border-gray-900 shadow-lg'
                    : available
                    ? 'border-gray-200 hover:border-gray-400 cursor-pointer'
                    : 'border-gray-100 opacity-60 cursor-not-allowed'
                )}
              >
                {/* شريط الألوان */}
                <div className="h-24 flex">
                  {theme.colors.map((c, i) => (
                    <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                  ))}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{theme.name}</h3>
                    {isActive && <Badge className="bg-gray-900 text-white text-xs">الحالي</Badge>}
                    {!available && <Lock className="h-4 w-4 text-gray-400" />}
                  </div>
                  <p className="text-sm text-gray-500">{theme.description}</p>
                  {available && !isActive && (
                    <Button size="sm" variant="outline" className="w-full mt-2" disabled={saving}>
                      اختر هذا القالب
                    </Button>
                  )}
                  {!available && (
                    <p className="text-xs text-gray-400">متاح في الباقة المتقدمة</p>
                  )}
                </div>

                {isActive && (
                  <div className="absolute top-2 left-2">
                    <CheckCircle2 className="h-6 w-6 text-gray-900 bg-white rounded-full" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── القوالب المخصصة ── */}
      {customThemes.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Palette className="h-4 w-4" />
            قوالب مخصصة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customThemes.map(ct => {
              const isActive = activeCustomId === ct.id
              const colors = ct.config?.colors
                ? [ct.config.colors.primary, ct.config.colors.accent, ct.config.colors.background]
                : ['#333', '#999', '#fff']

              return (
                <div
                  key={ct.id}
                  onClick={() => !saving && selectCustom(ct)}
                  className={cn(
                    'relative rounded-xl border-2 overflow-hidden transition-all cursor-pointer',
                    isActive
                      ? 'border-gray-900 shadow-lg'
                      : 'border-gray-200 hover:border-gray-400'
                  )}
                >
                  {/* صورة المعاينة أو شريط الألوان */}
                  {ct.preview_url ? (
                    <div className="h-32 overflow-hidden relative">
                      <Image
                        src={ct.preview_url}
                        alt={ct.name_ar}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-24 flex">
                      {colors.map((c, i) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{ct.name_ar}</h3>
                      {isActive && <Badge className="bg-gray-900 text-white text-xs">الحالي</Badge>}
                    </div>
                    {ct.description_ar && (
                      <p className="text-sm text-gray-500 line-clamp-2">{ct.description_ar}</p>
                    )}
                    {/* معلومات الخطوط */}
                    {ct.config?.fonts && (
                      <p className="text-xs text-gray-400" dir="ltr">
                        {ct.config.fonts.heading} / {ct.config.fonts.body}
                      </p>
                    )}
                    {!isActive && (
                      <Button size="sm" variant="outline" className="w-full mt-2" disabled={saving}>
                        اختر هذا القالب
                      </Button>
                    )}
                  </div>

                  {isActive && (
                    <div className="absolute top-2 left-2">
                      <CheckCircle2 className="h-6 w-6 text-gray-900 bg-white rounded-full" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* رسالة لو ما في قوالب مخصصة */}
      {customThemes.length === 0 && (
        <div className="text-center py-8 text-gray-400 border border-dashed border-gray-200 rounded-xl">
          <Palette className="h-8 w-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">لا توجد قوالب مخصصة متاحة حالياً</p>
        </div>
      )}

    </div>
  )
}
