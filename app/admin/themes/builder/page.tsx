import { createClient } from '@/lib/supabase/server'
import { CustomTheme } from '@/types'
import ThemeBuilderClient from './ThemeBuilderClient'

// صفحة إنشاء قالب جديد
export default async function ThemeBuilderPage({
  searchParams,
}: {
  searchParams: { edit?: string }
}) {
  let existingTheme: CustomTheme | null = null

  if (searchParams.edit) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('custom_themes')
      .select('*')
      .eq('id', searchParams.edit)
      .single()
    existingTheme = data as CustomTheme | null
  }

  return <ThemeBuilderClient existingTheme={existingTheme ?? undefined} />
}
