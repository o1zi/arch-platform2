import { createClient } from '@/lib/supabase/server'
import { CustomTheme } from '@/types'

/**
 * جلب القالب المخصص للمكتب إذا كان مفعّلاً
 */
export async function getCustomTheme(tenantId: string): Promise<CustomTheme | null> {
  const supabase = await createClient()

  // أولاً: هل للمكتب custom_theme_id؟
  const { data: tenant } = await supabase
    .from('tenants')
    .select('custom_theme_id')
    .eq('id', tenantId)
    .single()

  if (!tenant?.custom_theme_id) return null

  const { data: theme } = await supabase
    .from('custom_themes')
    .select('*')
    .eq('id', tenant.custom_theme_id)
    .eq('is_active', true)
    .single()

  return (theme as CustomTheme) ?? null
}
