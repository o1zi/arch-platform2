import { notFound } from 'next/navigation'
import { getTenantByIdentifier } from '@/lib/tenant'

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { domain: string }
}) {
  const tenant = await getTenantByIdentifier(params.domain)

  if (!tenant) notFound()

  if (!tenant.is_active) {
    const daysLeft = tenant.subscription_end
      ? Math.ceil((new Date(tenant.subscription_end).getTime() - Date.now()) / 86400000)
      : -1

    if (daysLeft <= 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
          <div className="text-center space-y-4 max-w-sm p-8">
            <h1 className="text-2xl font-bold text-gray-800">انتهى الاشتراك</h1>
            <p className="text-gray-500">هذا الموقع غير متاح حالياً. يرجى التواصل مع مالك المكتب.</p>
          </div>
        </div>
      )
    }

    notFound()
  }

  return <>{children}</>
}
