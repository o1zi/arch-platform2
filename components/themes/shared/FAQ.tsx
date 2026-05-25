'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface FAQItem {
  q: string
  a: string
}

interface FAQProps {
  items: FAQItem[]
  title?: string
  accentColor?: string
  bgColor?: string
  textColor?: string
  textLight?: string
  variant?: 'default' | 'bordered' | 'minimal' | 'filled'
}

export function FAQ({
  items,
  title = 'الأسئلة الشائعة',
  accentColor = '#3b82f6',
  bgColor = '#ffffff',
  textColor = '#111111',
  textLight = '#666666',
  variant = 'default',
}: FAQProps) {
  const [open, setOpen] = useState<number | null>(null)

  const toggle = (i: number) => setOpen(prev => (prev === i ? null : i))

  return (
    <section className="py-20 px-6" style={{ backgroundColor: bgColor }} dir="rtl">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black mb-12 text-center" style={{ color: textColor }}>{title}</h2>

        <div className="space-y-2">
          {items.map((item, i) => {
            const isOpen = open === i

            if (variant === 'bordered') {
              return (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{
                    border: `1px solid ${isOpen ? accentColor : 'rgba(128,128,128,0.15)'}`,
                  }}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between p-5 text-right transition-colors"
                    style={{ backgroundColor: isOpen ? `${accentColor}08` : 'transparent' }}
                  >
                    <span className="font-semibold text-sm" style={{ color: isOpen ? accentColor : textColor }}>{item.q}</span>
                    {isOpen
                      ? <Minus className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
                      : <Plus className="w-4 h-4 flex-shrink-0" style={{ color: textLight }} />
                    }
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5">
                      <p className="text-sm leading-relaxed" style={{ color: textLight }}>{item.a}</p>
                    </div>
                  )}
                </div>
              )
            }

            if (variant === 'filled') {
              return (
                <div
                  key={i}
                  className="rounded-xl overflow-hidden transition-all"
                  style={{ backgroundColor: isOpen ? `${accentColor}12` : 'rgba(128,128,128,0.06)' }}
                >
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between p-5 text-right"
                  >
                    <span className="font-semibold text-sm" style={{ color: isOpen ? accentColor : textColor }}>{item.q}</span>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                      style={{ backgroundColor: isOpen ? accentColor : 'rgba(128,128,128,0.2)' }}
                    >
                      {isOpen
                        ? <Minus className="w-3 h-3 text-white" />
                        : <Plus className="w-3 h-3" style={{ color: textLight }} />
                      }
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5">
                      <p className="text-sm leading-relaxed" style={{ color: textLight }}>{item.a}</p>
                    </div>
                  )}
                </div>
              )
            }

            if (variant === 'minimal') {
              return (
                <div key={i} className="border-b" style={{ borderColor: 'rgba(128,128,128,0.12)' }}>
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-center justify-between py-5 text-right"
                  >
                    <span className="font-semibold text-sm" style={{ color: textColor }}>{item.q}</span>
                    <span
                      className="text-xl font-light flex-shrink-0 mr-4 transition-transform"
                      style={{ color: accentColor, transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}
                    >+</span>
                  </button>
                  {isOpen && (
                    <div className="pb-5">
                      <p className="text-sm leading-relaxed" style={{ color: textLight }}>{item.a}</p>
                    </div>
                  )}
                </div>
              )
            }

            // default
            return (
              <div key={i} className="border-b" style={{ borderColor: 'rgba(128,128,128,0.12)' }}>
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between py-5 text-right group"
                >
                  <span
                    className="font-semibold text-sm transition-colors"
                    style={{ color: isOpen ? accentColor : textColor }}
                  >{item.q}</span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-4 transition-all"
                    style={{
                      backgroundColor: isOpen ? accentColor : 'transparent',
                      border: `1px solid ${isOpen ? accentColor : 'rgba(128,128,128,0.2)'}`,
                    }}
                  >
                    {isOpen
                      ? <Minus className="w-3 h-3 text-white" />
                      : <Plus className="w-3 h-3" style={{ color: textLight }} />
                    }
                  </div>
                </button>
                {isOpen && (
                  <div className="pb-5 pr-0 pl-12">
                    <p className="text-sm leading-loose" style={{ color: textLight }}>{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// أسئلة افتراضية لكل قطاع
export const SECTOR_FAQ: Record<string, FAQItem[]> = {
  engineering: [
    { q: 'كم يستغرق تصميم مشروع معماري؟', a: 'يعتمد على حجم المشروع. عادةً من 2-4 أسابيع للتصميم المبدئي، وشهر إلى ثلاثة أشهر للمخططات التنفيذية الكاملة.' },
    { q: 'هل تشمل خدماتكم الإشراف على التنفيذ؟', a: 'نعم، نقدم خدمات الإشراف الهندسي الكامل لضمان تطابق التنفيذ مع التصاميم المعتمدة.' },
    { q: 'ما هي التخصصات التي تقدمونها؟', a: 'نتخصص في التصميم المعماري، والتصميم الداخلي، والتخطيط العمراني، وإدارة المشاريع، والاستشارات الهندسية.' },
    { q: 'هل تعملون خارج المدينة؟', a: 'نعم، نقبل مشاريع في جميع مناطق المملكة العربية السعودية مع توفير خدمات الإشراف عن بُعد والميداني.' },
  ],
  contractor: [
    { q: 'هل تقدمون عروض أسعار مجانية؟', a: 'نعم، نقدم عرض سعر مجاني لجميع المشاريع بعد الاطلاع على المتطلبات والمخططات.' },
    { q: 'ما هي مدة تنفيذ مشروع فيلا سكنية؟', a: 'عادةً من 12 إلى 18 شهراً حسب حجم الفيلا ومستوى التشطيبات المطلوبة.' },
    { q: 'هل تضمنون جودة المواد المستخدمة؟', a: 'نعم، نستخدم مواد بناء معتمدة من موردين موثوقين ونقدم ضمان على الأعمال.' },
    { q: 'هل يشمل عقدكم التشطيبات النهائية؟', a: 'نعم، يمكن أن يشمل عقد التنفيذ جميع مراحل البناء من الهيكل حتى التشطيبات النهائية.' },
  ],
  real_estate: [
    { q: 'ما هي عمولة الوساطة العقارية؟', a: 'تتراوح عادةً بين 1.5% إلى 2.5% من قيمة الصفقة، وتُحدد بوضوح قبل بدء التعامل.' },
    { q: 'كم يستغرق بيع العقار؟', a: 'يعتمد على نوع العقار والموقع والسعر. في المتوسط، يتم البيع خلال 30 إلى 90 يوماً.' },
    { q: 'هل تساعدون في التوثيق الرسمي؟', a: 'نعم، نرافقكم في جميع إجراءات التوثيق من صكوك ملكية وعقود بيع حتى إتمام نقل الملكية.' },
    { q: 'هل لديكم عقارات في كل المناطق؟', a: 'لدينا قاعدة بيانات واسعة تشمل معظم مناطق ومدن المملكة.' },
  ],
  interior_design: [
    { q: 'هل تقدمون تصميماً ثلاثي الأبعاد قبل التنفيذ؟', a: 'نعم، نقدم تصميماً ثلاثي الأبعاد واقعياً لجميع المساحات قبل البدء بأي تنفيذ.' },
    { q: 'ما هو الحد الأدنى للميزانية؟', a: 'يختلف حسب المساحة ومستوى التشطيبات. يسعدنا تقديم استشارة مجانية لتحديد الميزانية المناسبة.' },
    { q: 'هل تتولون شراء الأثاث والإكسسوار؟', a: 'نعم، يمكنننا تولي اختيار وشراء جميع عناصر الديكور من أثاث وإضاءة وإكسسوار.' },
    { q: 'كم يستغرق تصميم وتنفيذ شقة كاملة؟', a: 'عادةً من 6 إلى 12 أسبوعاً حسب المساحة وتعقيد التصميم.' },
  ],
  photography: [
    { q: 'كيف يمكنني حجز جلسة تصوير؟', a: 'يمكنك التواصل معنا عبر الواتساب أو الاتصال المباشر وسنرتب لك الموعد المناسب.' },
    { q: 'متى أستلم الصور المعدّلة؟', a: 'عادةً خلال 3 إلى 7 أيام عمل من تاريخ الجلسة حسب عدد الصور المطلوبة.' },
    { q: 'هل تشمل الباقة تعديل الصور؟', a: 'نعم، جميع باقاتنا تشمل تعديلاً احترافياً كاملاً من ريتوش وتلوين.' },
    { q: 'هل لديكم معدات إضاءة احترافية؟', a: 'نعم، لدينا استوديو مجهز بالكامل بإضاءة احترافية، كما نوفر الإضاءة للجلسات الخارجية.' },
  ],
  legal: [
    { q: 'هل تقدمون استشارات قانونية مجانية؟', a: 'نقدم استشارة أولية مجانية لمدة 30 دقيقة لتقييم وضعك القانوني.' },
    { q: 'كيف تُحدَّد أتعاب المحاماة؟', a: 'تُحدَّد الأتعاب حسب طبيعة القضية ومدى تعقيدها، ويتم الاتفاق عليها مسبقاً بشفافية تامة.' },
    { q: 'هل تتعاملون مع القضايا خارج المدينة؟', a: 'نعم، لدينا قدرة على التمثيل أمام المحاكم في مختلف مناطق المملكة.' },
    { q: 'كيف تضمنون سرية معلوماتي؟', a: 'نلتزم بالسرية المهنية الكاملة وجميع بياناتك محمية بموجب اتفاقية سرية صريحة.' },
  ],
  medical: [
    { q: 'كيف يمكنني حجز موعد؟', a: 'يمكنك الحجز عبر الاتصال المباشر أو واتساب أو زيارة العيادة خلال ساعات العمل.' },
    { q: 'هل تقبلون التأمين الطبي؟', a: 'نعم، نتعامل مع أغلب شركات التأمين الطبي المعتمدة في المملكة.' },
    { q: 'ما هي ساعات العمل؟', a: 'من الأحد إلى الخميس من 9 صباحاً حتى 9 مساءً، وأيام الجمعة والسبت من 4 مساءً حتى 9 مساءً.' },
    { q: 'هل تقدمون خدمات طوارئ؟', a: 'نعم، نوفر خط طوارئ للحالات العاجلة على مدار الساعة.' },
  ],
  general: [
    { q: 'كيف يمكنني التواصل مع فريقكم؟', a: 'يمكنك التواصل معنا عبر الهاتف أو البريد الإلكتروني أو واتساب وسنرد خلال 24 ساعة.' },
    { q: 'هل تقدمون خدماتكم خارج المدينة؟', a: 'نعم، نقدم خدماتنا في جميع مناطق المملكة مع إمكانية الخدمة عن بُعد.' },
    { q: 'ما هي المدة المتوقعة لإتمام الخدمة؟', a: 'تعتمد على طبيعة الخدمة وتعقيدها. نوفر جدولاً زمنياً واضحاً قبل بدء أي مشروع.' },
    { q: 'هل تقدمون ضماناً على خدماتكم؟', a: 'نعم، نقدم ضماناً على جميع خدماتنا ونلتزم بمعايير الجودة العالية في كل ما نقدمه.' },
  ],
}
