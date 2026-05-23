'use client'

import { useState } from 'react'
import { Tenant, Theme } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { CheckCircle2, Lock } from 'lucide-react'

const THEMES: { id: Theme; name: string; description: string; colors: string[] }[] = [
  {
    id: 'modern',
    name: 'عصري',
    description: 'تقني، نظيف، احترافي. مثالي للمكاتب الحديثة.',
    colors: ['#ffffff', '#000000', '#3b82f6'],
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

export default function ThemeSelector({ tenant, availableThemes }: { tenant: Tenant; availableThemes: Theme[] }) {
  const supabase = createClient()
  const [current, setCurrent] = useState<Theme>(tenant.theme)
  const [saving, setSaving] = useState(false)

  async function selectTheme(theme: Theme) {
    if (!availableThemes.includes(theme)) return
    if (theme === current) return
    setSaving(true)
    const { error } = await supabase.from('tenants').update({ theme }).eq('id', tenant.id)
    if (error) {
      toast.error('فشل تغيير القالب')
    } else {
      setCurrent(theme)
      toast.success(`تم تفعيل قالب "${THEMES.find(t => t.id === theme)?.name}"`)
    }
    setSaving(false)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {THEMES.map(theme => {
        const available = availableThemes.includes(theme.id)
        const isActive = current === theme.id

        return (
          <div
            key={theme.id}
            className={cn(
              'relative rounded-xl border-2 overflow-hidden transition-all',
              isActive ? 'border-gray-900 shadow-lg' : available ? 'border-gray-200 hover:border-gray-400 cursor-pointer' : 'border-gray-100 opacity-60 cursor-not-allowed'
            )}
            onClick={() => available && !saving && selectTheme(theme.id)}
          >
            {/* Color preview */}
            <div className="h-24 flex">
              {theme.colors.map((c, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: c }} />
              ))}
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{theme.name}</h3>
                {isActive && (
                  <Badge className="bg-gray-900 text-white text-xs">الحالي</Badge>
                )}
                {!available && (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
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
  )
}
