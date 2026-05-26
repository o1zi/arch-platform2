/**
 * analytics-client.ts
 * دوال التتبع من جانب العميل (browser only)
 * صامتة تماماً — لا تكسر الـ UI أبداً
 */

export async function trackEvent(
  tenantSlug: string,
  eventType: string,
  meta?: Record<string, string | number | boolean>,
  projectId?: string,
) {
  if (typeof window === 'undefined') return

  try {
    const body = JSON.stringify({
      tenant_slug: tenantSlug,
      event_type:  eventType,
      page:        window.location.pathname,
      referrer:    document.referrer || null,
      project_id:  projectId || null,
      meta:        meta      || null,
    })

    // sendBeacon أفضل — يعمل حتى عند إغلاق الصفحة
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/analytics/event',
        new Blob([body], { type: 'application/json' }),
      )
    } else {
      fetch('/api/analytics/event', {
        method:    'POST',
        headers:   { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {})
    }
  } catch {
    // تجاهل أي خطأ — التحليلات لا توقف أي شيء
  }
}
