export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { Building2, Palette, Globe, Shield, CheckCircle } from 'lucide-react'

export default function MarketingPage() {
  const features = [
    { icon: Building2, title: 'موقعك في دقائق', desc: 'أنشئ موقعاً احترافياً لمكتبك الهندسي دون أي خبرة تقنية' },
    { icon: Palette, title: '5 قوالب متميزة', desc: 'اختر من بين 5 قوالب مختلفة تماماً تناسب هوية مكتبك' },
    { icon: Globe, title: 'دومين خاص', desc: 'ارتبط بدومينك الخاص أو استخدم الرابط المجاني على منصتنا' },
    { icon: Shield, title: 'آمن وموثوق', desc: 'بياناتك محمية بأعلى معايير الأمان مع نسخ احتياطية تلقائية' },
  ]

  const plans = [
    { name: 'Basic', price: '1,200', period: 'سنوياً', projects: '10 مشاريع', themes: 'قالب واحد', storage: '500MB' },
    { name: 'Pro', price: '2,000', period: 'سنوياً', projects: '30 مشروعاً', themes: 'كل القوالب', storage: '2GB', popular: true },
    { name: 'Premium', price: '3,500', period: 'سنوياً', projects: 'غير محدود', themes: 'كل القوالب + دومين خاص', storage: '10GB' },
  ]

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 to-blue-900 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            منصة المواقع لمكاتب الهندسة
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            أنشئ موقعاً احترافياً لمكتبك الهندسي في دقائق. اعرض مشاريعك، تحكم في محتواك، واحصل على حضور رقمي مميز.
          </p>
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-full font-semibold text-lg inline-block transition-colors"
          >
            ابدأ الآن
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">لماذا منصتنا؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">الباقات</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div key={plan.name} className={`rounded-xl border-2 p-6 relative ${plan.popular ? 'border-blue-500 shadow-xl' : 'border-gray-200'}`}>
                {plan.popular && (
                  <span className="absolute -top-3 right-1/2 translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full">الأكثر طلباً</span>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 text-sm mr-1">ر.س / {plan.period}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  {[plan.projects, plan.themes, plan.storage].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-8">
            للاشتراك تواصل معنا عبر واتساب — لا يوجد دفع إلكتروني
          </p>
        </div>
      </section>

      <footer className="bg-gray-900 text-white/60 text-center py-8 text-sm">
        <p>منصة مواقع مكاتب الهندسة © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
