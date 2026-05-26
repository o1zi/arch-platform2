'use client'

import { useState } from 'react'
import { Tenant, CustomTheme } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { CheckCircle2, Palette, Upload, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface Props {
  tenant: Tenant & { custom_theme_id?: string | null }
  availableThemes?: string[]    // kept for compatibility, unused
  customThemes: CustomTheme[]
}

export default function ThemeSelector({ tenant, customThemes }: Props) {
  const supabase = createClient()
  const [activeCustomId, setActiveCustomId] = useState<string | null>(tenant.custom_theme_id ?? null)
  const [saving, setSaving] = useState(false)

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
      toast.success(`تم تفعيل قالب "${ct.name_ar}" بنجاح ✨`)
    }
    setSaving(false)
  }

  return (
    <div className="space-y-8">

      {/* ── القوالب المخصصة ── */}
      {customThemes.length > 0 ? (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Palette className="h-5 w-5 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              القوالب الفاخرة المتاحة
            </h2>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
              {customThemes.length} قالب
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {customThemes.map(ct => {
              const isActive = activeCustomId === ct.id
              const colors = ct.config?.colors
                ? [ct.config.colors.primary, ct.config.colors.accent, ct.config.colors.background]
                : ['#0f172a', '#c9a84c', '#ffffff']

              return (
                <div
                  key={ct.id}
                  onClick={() => !saving && selectCustom(ct)}
                  className={cn(
                    'relative rounded-2xl border-2 overflow-hidden transition-all cursor-pointer group',
                    isActive
                      ? 'border-gray-900 shadow-xl shadow-gray-900/10'
                      : 'border-gray-200 hover:border-gray-400 hover:shadow-lg'
                  )}
                >
                  {/* Preview image or color strip */}
                  {ct.preview_url ? (
                    <div className="h-36 overflow-hidden relative">
                      <Image
                        src={ct.preview_url}
                        alt={ct.name_ar}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {isActive && (
                        <div className="absolute inset-0 bg-black/10" />
                      )}
                    </div>
                  ) : (
                    <div className="h-28 flex relative overflow-hidden">
                      {colors.map((c, i) => (
                        <div key={i} className="flex-1 transition-transform duration-500 group-hover:scale-110" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  )}

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-gray-800">{ct.name_ar}</h3>
                      {isActive && (
                        <Badge className="bg-gray-900 text-white text-[10px] px-2">
                          ✓ الحالي
                        </Badge>
                      )}
                    </div>

                    {ct.description_ar && (
                      <p className="text-xs text-gray-500 line-clamp-2">{ct.description_ar}</p>
                    )}

                    {/* Font info */}
                    {ct.config?.fonts && (
                      <p className="text-[10px] text-gray-400 font-mono" dir="ltr">
                        {ct.config.fonts.heading} / {ct.config.fonts.body}
                      </p>
                    )}

                    {/* Color swatches */}
                    {ct.config?.colors && (
                      <div className="flex gap-1 pt-1">
                        {[ct.config.colors.primary, ct.config.colors.accent, ct.config.colors.background, ct.config.colors.text].map((c, i) => (
                          <div key={i} className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0"
                            style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    )}

                    {!isActive && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full mt-2 text-xs font-medium"
                        disabled={saving}
                      >
                        اختر هذا القالب
                      </Button>
                    )}
                  </div>

                  {/* Active checkmark */}
                  {isActive && (
                    <div className="absolute top-3 left-3">
                      <CheckCircle2 className="h-7 w-7 text-gray-900 bg-white rounded-full shadow-md" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* ── No custom themes yet ── */
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-2xl">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-700 mb-2">لا توجد قوالب متاحة بعد</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-2">
            القوالب الفاخرة يرفعها الأدمن كملفات ZIP. تواصل معنا لتفعيل قالب يناسب مكتبك.
          </p>
          <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <Upload className="h-3 w-3" />
            كل قالب يدعم الصفحة الرئيسية، صفحة المشاريع، وصفحة التواصل
          </p>
        </div>
      )}

      {/* ── Current state indicator ── */}
      {customThemes.length > 0 && !activeCustomId && (
        <div className="rounded-xl p-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 flex items-center gap-2">
          <Sparkles className="h-4 w-4 flex-shrink-0" />
          <span>موقعك يعرض حالياً <strong>القالب الافتراضي الفاخر</strong>. اختر قالباً من القائمة أعلاه لتخصيص مظهر موقعك.</span>
        </div>
      )}
    </div>
  )
}
