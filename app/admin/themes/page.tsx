import { createClient } from '@/lib/supabase/server'
import { CustomTheme } from '@/types'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Palette } from 'lucide-react'
import AdminThemeActions from './AdminThemeActions'

export default async function AdminThemesPage() {
  const supabase = await createClient()
  const { data: themes } = await supabase
    .from('custom_themes')
    .select('*')
    .order('created_at', { ascending: false })

  const planColors: Record<string, string> = {
    basic: 'bg-gray-100 text-gray-700',
    pro: 'bg-blue-100 text-blue-700',
    premium: 'bg-yellow-100 text-yellow-700',
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">القوالب المخصصة</h1>
          <p className="text-gray-500 mt-1">ارفع قوالب ZIP وأتحها للمكاتب حسب باقاتها</p>
        </div>
        <Link href="/admin/themes/new"
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
          <Plus className="h-4 w-4" />
          رفع قالب جديد
        </Link>
      </div>

      {!themes?.length ? (
        <div className="bg-white border border-gray-200 rounded-xl p-16 text-center">
          <Palette className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">لا توجد قوالب مخصصة بعد</p>
          <p className="text-gray-300 text-sm">ارفع أول قالب ZIP لتبدأ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(themes as CustomTheme[]).map(theme => (
            <div key={theme.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              {/* Preview */}
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {theme.preview_url ? (
                  <Image src={theme.preview_url} alt={theme.name_ar} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Palette className="h-10 w-10 text-gray-300" />
                  </div>
                )}
                {/* Color dots preview */}
                {theme.config?.colors && (
                  <div className="absolute bottom-2 right-2 flex gap-1">
                    {Object.values(theme.config.colors).slice(0, 4).map((color, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-white/50 shadow"
                        style={{ backgroundColor: color as string }} />
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-gray-900">{theme.name_ar}</p>
                    {theme.name_en && <p className="text-xs text-gray-400" dir="ltr">{theme.name_en}</p>}
                  </div>
                  <Badge variant={theme.is_active ? 'default' : 'secondary'} className="shrink-0 text-xs">
                    {theme.is_active ? 'نشط' : 'موقوف'}
                  </Badge>
                </div>

                {theme.description_ar && (
                  <p className="text-xs text-gray-500 line-clamp-2">{theme.description_ar}</p>
                )}

                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${planColors[theme.plan_required]}`}>
                    {theme.plan_required}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(theme.created_at).toLocaleDateString('ar-SA')}
                  </span>
                </div>

                {/* Fonts info */}
                {theme.config?.fonts && (
                  <p className="text-xs text-gray-400" dir="ltr">
                    {theme.config.fonts.heading} / {theme.config.fonts.body}
                  </p>
                )}

                <AdminThemeActions theme={theme} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
