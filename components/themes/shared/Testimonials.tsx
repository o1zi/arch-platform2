'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface Testimonial {
  name: string
  role: string
  text: string
  rating?: number
}

interface TestimonialsProps {
  testimonials: Testimonial[]
  title?: string
  accentColor?: string
  bgColor?: string
  textColor?: string
  textLight?: string
  variant?: 'cards' | 'carousel' | 'minimal' | 'quote'
}

function StarRating({ rating, color }: { rating: number; color: string }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill={i < rating ? color : 'none'} stroke={color} className="w-4 h-4" strokeWidth="1.5">
          <path d="M10 1.5l2.35 4.76 5.27.77-3.81 3.71.9 5.25L10 13.5l-4.71 2.49.9-5.25L2.38 7l5.27-.77z" />
        </svg>
      ))}
    </div>
  )
}

export function Testimonials({
  testimonials,
  title = 'ماذا يقول عملاؤنا',
  accentColor = '#3b82f6',
  bgColor = '#ffffff',
  textColor = '#111111',
  textLight = '#666666',
  variant = 'carousel',
}: TestimonialsProps) {
  const [current, setCurrent] = useState(0)

  if (!testimonials.length) return null

  if (variant === 'cards') {
    return (
      <section className="py-20 px-6" style={{ backgroundColor: bgColor }} dir="rtl">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-black mb-12 text-center" style={{ color: textColor }}>{title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-xl border"
                style={{ borderColor: 'rgba(128,128,128,0.15)', backgroundColor: bgColor }}
              >
                <Quote className="w-8 h-8 mb-4 opacity-20" style={{ color: accentColor }} />
                <p className="text-sm leading-relaxed mb-6" style={{ color: textLight }}>{t.text}</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    style={{ backgroundColor: accentColor, color: bgColor }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: textColor }}>{t.name}</p>
                    <p className="text-xs" style={{ color: textLight }}>{t.role}</p>
                  </div>
                  {t.rating && <div className="mr-auto"><StarRating rating={t.rating} color={accentColor} /></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === 'quote') {
    const t = testimonials[current]
    return (
      <section className="py-20 px-6" style={{ backgroundColor: bgColor }} dir="rtl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-black mb-12" style={{ color: textColor }}>{title}</h2>
          <div className="relative">
            <Quote className="w-16 h-16 mx-auto mb-6 opacity-10" style={{ color: accentColor }} />
            <p className="text-xl leading-relaxed mb-8 italic" style={{ color: textLight }}>&quot;{t.text}&quot;</p>
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                style={{ backgroundColor: accentColor, color: bgColor }}
              >
                {t.name.charAt(0)}
              </div>
              <div className="text-right">
                <p className="font-bold" style={{ color: textColor }}>{t.name}</p>
                <p className="text-sm" style={{ color: textLight }}>{t.role}</p>
              </div>
            </div>
            {t.rating && <div className="flex justify-center mt-4"><StarRating rating={t.rating} color={accentColor} /></div>}
          </div>
          {testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ backgroundColor: i === current ? accentColor : 'rgba(128,128,128,0.3)', transform: i === current ? 'scale(1.4)' : 'scale(1)' }}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

  if (variant === 'minimal') {
    return (
      <section className="py-16 px-6" style={{ backgroundColor: bgColor }} dir="rtl">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-black mb-8" style={{ color: textColor }}>{title}</h2>
          <div className="grid md:grid-cols-2 gap-px" style={{ backgroundColor: 'rgba(128,128,128,0.1)' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="p-8" style={{ backgroundColor: bgColor }}>
                <p className="text-sm leading-relaxed mb-4" style={{ color: textLight }}>&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <span className="text-xs font-medium" style={{ color: textColor }}>{t.name}</span>
                  <span className="text-xs" style={{ color: textLight }}>— {t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // carousel (افتراضي)
  const t = testimonials[current]
  return (
    <section className="py-20 px-6" style={{ backgroundColor: bgColor }} dir="rtl">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black mb-12 text-center" style={{ color: textColor }}>{title}</h2>

        <div className="relative p-8 md:p-12 rounded-2xl" style={{ backgroundColor: `${accentColor}08`, border: `1px solid ${accentColor}20` }}>
          <Quote className="w-10 h-10 mb-6 opacity-20" style={{ color: accentColor }} />
          <p className="text-lg md:text-xl leading-relaxed mb-8" style={{ color: textLight }}>&quot;{t.text}&quot;</p>
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black flex-shrink-0"
              style={{ backgroundColor: accentColor, color: bgColor }}
            >
              {t.name.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-base" style={{ color: textColor }}>{t.name}</p>
              <p className="text-sm" style={{ color: textLight }}>{t.role}</p>
              {t.rating && <div className="mt-1"><StarRating rating={t.rating} color={accentColor} /></div>}
            </div>
            {testimonials.length > 1 && (
              <div className="mr-auto flex items-center gap-2">
                <button
                  onClick={() => setCurrent(i => (i - 1 + testimonials.length) % testimonials.length)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                  style={{ border: `1px solid ${accentColor}40`, color: accentColor }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrent(i => (i + 1) % testimonials.length)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:opacity-80"
                  style={{ border: `1px solid ${accentColor}40`, color: accentColor }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === current ? '24px' : '8px',
                  height: '8px',
                  backgroundColor: i === current ? accentColor : 'rgba(128,128,128,0.3)',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// شهادات افتراضية لكل قطاع
export const SECTOR_TESTIMONIALS: Record<string, Testimonial[]> = {
  engineering: [
    { name: 'محمد العتيبي', role: 'مطوّر عقاري', text: 'تعاملت معهم في مشروع سكني كبير وكانت النتيجة مذهلة. الدقة في التنفيذ والالتزام بالمواعيد لا مثيل لهما.', rating: 5 },
    { name: 'سارة الغامدي', role: 'صاحبة مجمع تجاري', text: 'أفضل مكتب هندسي تعاملت معه. يجمعون بين الإبداع والاحترافية بشكل نادر.', rating: 5 },
    { name: 'فيصل الدوسري', role: 'مستثمر', text: 'أنجزوا مشروع المستودعات الخاصة بي في الوقت المحدد وبجودة تفوق التوقعات.', rating: 4 },
  ],
  contractor: [
    { name: 'خالد المالكي', role: 'صاحب فيلا', text: 'بنوا لي فيلتي من الصفر حتى التسليم بجودة ممتازة وبدون أي متاعب.', rating: 5 },
    { name: 'نورة السبيعي', role: 'مديرة مشاريع', text: 'شركة بناء موثوقة ونظيفة. التزموا بالميزانية ولم يكن هناك أي تكاليف مخفية.', rating: 5 },
    { name: 'سلطان القحطاني', role: 'صاحب مجمع', text: 'أسلوب عمل احترافي وفريق ماهر. سأتعامل معهم في مشاريعي القادمة.', rating: 4 },
  ],
  real_estate: [
    { name: 'عبدالله الحربي', role: 'مشتري شقة', text: 'ساعدوني في إيجاد الشقة المثالية ضمن ميزانيتي في وقت قياسي.', rating: 5 },
    { name: 'ريم العمري', role: 'مستثمرة عقارية', text: 'خبرتهم في السوق لا تُقدّر. أرشدوني لأفضل الفرص الاستثمارية.', rating: 5 },
    { name: 'بدر الزهراني', role: 'صاحب أعمال', text: 'وجدوا لي المكتب التجاري المناسب بسرعة وأسلوب احترافي.', rating: 4 },
  ],
  interior_design: [
    { name: 'لمى الشهري', role: 'صاحبة منزل', text: 'حوّلوا منزلي إلى تحفة فنية! الإبداع والذوق الرفيع في كل زاوية.', rating: 5 },
    { name: 'محمد البلوي', role: 'صاحب مطعم', text: 'صمموا مطعمي بطريقة تجذب الزبائن وتعكس هوية علامتي التجارية.', rating: 5 },
    { name: 'هنا القرني', role: 'صاحبة صالون', text: 'تجربة رائعة من البداية للنهاية. يستمعون لاحتياجاتك ويحولونها لواقع.', rating: 5 },
  ],
  photography: [
    { name: 'منى الحسيني', role: 'عروس', text: 'التقط لنا أجمل لحظات زفافنا بعدسة احترافية لن تُنسى.', rating: 5 },
    { name: 'طارق الزيد', role: 'صاحب علامة تجارية', text: 'صور المنتجات جاءت بشكل رائع ورفع مبيعاتنا بشكل ملحوظ.', rating: 5 },
    { name: 'أسماء العنزي', role: 'مديرة تسويق', text: 'محترف في عمله، يفهم احتياجاتك ويقدم ما هو أفضل منها.', rating: 4 },
  ],
  legal: [
    { name: 'أحمد المطيري', role: 'صاحب شركة', text: 'دافعوا عن حقوقي التجارية بكل قوة واحترافية ونجحوا في استرداد مستحقاتي.', rating: 5 },
    { name: 'سمر الجهني', role: 'موظفة', text: 'تعاملوا مع قضيتي العمالية بسرية تامة واستردوا حقوقي كاملة.', rating: 5 },
    { name: 'وليد الرشيد', role: 'مستثمر', text: 'أفضل مكتب محاماة لحماية مصالح الأعمال. خبرتهم لا تُقدّر.', rating: 5 },
  ],
  medical: [
    { name: 'ندى الفهد', role: 'مريضة', text: 'طواقم طبية رائعة وخدمة إنسانية عالية. أشعر بالأمان في كل زيارة.', rating: 5 },
    { name: 'يوسف الكعبي', role: 'مريض مزمن', text: 'يتابعون حالتي بشكل مستمر والنتائج تحسّنت بشكل ملحوظ.', rating: 5 },
    { name: 'حصة التميمي', role: 'أم', text: 'أفضل رعاية لأطفالي. الأطباء متخصصون وعطوفون جداً.', rating: 5 },
  ],
  general: [
    { name: 'فهد الشمري', role: 'صاحب نشاط تجاري', text: 'قدّموا لي حلولاً مبتكرة رفعت إنتاجية عملي بشكل ملحوظ.', rating: 5 },
    { name: 'ليلى النجدي', role: 'مديرة مشتريات', text: 'خدمة احترافية وجودة لا تُنافَس في كل ما يقدمونه.', rating: 4 },
    { name: 'عمر العصيمي', role: 'رجل أعمال', text: 'شريك موثوق في النجاح. أنصح بالتعامل معهم بشدة.', rating: 5 },
  ],
}
