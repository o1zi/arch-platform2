import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'وجود — منصة بناء مواقع المكاتب المهنية',
  description: 'منصة متكاملة لإطلاق موقع احترافي لمكتبك خلال يوم واحد',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
