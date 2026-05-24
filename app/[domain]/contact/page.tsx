import { notFound } from 'next/navigation'
import { getTenantByIdentifier } from '@/lib/tenant'
import { ThemeContactRenderer } from '@/components/themes/ThemeContactRenderer'
import { getCustomTheme } from '@/lib/get-custom-theme'

export default async function ContactPage({ params }: { params: { domain: string } }) {
  const tenant = await getTenantByIdentifier(params.domain)
  if (!tenant) notFound()

  const customTheme = await getCustomTheme(tenant.id)

  return <ThemeContactRenderer tenant={tenant} customTheme={customTheme} />
}
