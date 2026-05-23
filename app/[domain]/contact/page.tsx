import { notFound } from 'next/navigation'
import { getTenantByIdentifier } from '@/lib/tenant'
import { ThemeContactRenderer } from '@/components/themes/ThemeContactRenderer'

export default async function ContactPage({ params }: { params: { domain: string } }) {
  const tenant = await getTenantByIdentifier(params.domain)
  if (!tenant) notFound()

  return <ThemeContactRenderer tenant={tenant} />
}
