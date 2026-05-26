'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics-client'

/**
 * ContactPageTracker
 * يُضاف لكل ContactPage — يتتبع نقرات الأزرار (هاتف، بريد، خريطة، واتساب)
 * يعمل بـ event delegation بدون تعديل كل زر بشكل منفصل
 */
export function ContactPageTracker({ tenantSlug }: { tenantSlug: string }) {
  useEffect(() => {
    // تتبع زيارة صفحة التواصل بشكل خاص
    trackEvent(tenantSlug, 'contact_page_view')

    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest('a')
      if (!anchor) return

      const href = anchor.getAttribute('href') || ''

      if (href.startsWith('tel:')) {
        trackEvent(tenantSlug, 'phone_click')
      } else if (href.startsWith('mailto:')) {
        trackEvent(tenantSlug, 'email_click')
      } else if (href.includes('wa.me')) {
        trackEvent(tenantSlug, 'whatsapp_click', { button: 'contact_page' })
      } else if (
        href.includes('google.com/maps') ||
        href.includes('maps.app.goo.gl') ||
        href.includes('goo.gl/maps')
      ) {
        trackEvent(tenantSlug, 'maps_click')
      } else if (
        href.includes('instagram.com') ||
        href.includes('twitter.com') ||
        href.includes('x.com') ||
        href.includes('linkedin.com') ||
        href.includes('snapchat.com') ||
        href.includes('tiktok.com')
      ) {
        const label = href.includes('instagram') ? 'instagram'
          : href.includes('twitter') || href.includes('x.com') ? 'twitter'
          : href.includes('linkedin') ? 'linkedin'
          : href.includes('snapchat') ? 'snapchat'
          : 'tiktok'
        trackEvent(tenantSlug, 'social_click', { platform: label })
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [tenantSlug])

  return null
}
