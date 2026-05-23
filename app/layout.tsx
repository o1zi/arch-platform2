import type { Metadata } from 'next'
import { Cairo } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-sans', display: 'swap' })

export const metadata: Metadata = {
  title: 'منصة مواقع مكاتب الهندسة',
  description: 'أنشئ موقعاً احترافياً لمكتبك الهندسي في دقائق',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" className={cairo.variable}>
      <body className="antialiased font-sans">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
