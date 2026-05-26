'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics-client'

/**
 * AnalyticsTracker
 * يُضاف لـ [domain]/layout.tsx — يتتبع كل صفحة تلقائياً عند التحميل
 */
export function AnalyticsTracker({ tenantSlug }: { tenantSlug: string }) {
  useEffect(() => {
    trackEvent(tenantSlug, 'page_view')
  }, [tenantSlug])

  return null
}
