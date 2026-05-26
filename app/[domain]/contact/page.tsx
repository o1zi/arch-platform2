import { notFound } from 'next/navigation'
import { getTenantByIdentifier } from '@/lib/tenant'
import { getCustomTheme } from '@/lib/get-custom-theme'
import { DEFAULT_THEME_CONFIG } from '@/lib/default-theme'
import { CustomTheme } from '@/types'
import DynamicContactPage from '@/components/themes/DynamicContactPage'

export default async function ContactPage({ params }: { params: { domain: string } }) {
  const tenant = await getTenantByIdentifier(params.domain)
  if (!tenant) notFound()

  const customTheme = await getCustomTheme(tenant.id)
  const config = (customTheme as CustomTheme | null)?.config ?? DEFAULT_THEME_CONFIG

  return <DynamicContactPage tenant={tenant} config={config} />
}
