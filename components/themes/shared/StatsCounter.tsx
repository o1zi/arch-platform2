'use client'

import { useRef, useState, useEffect } from 'react'

interface StatItem {
  value: number
  suffix?: string
  prefix?: string
  label: string
}

interface StatsCounterProps {
  stats: StatItem[]
  accentColor?: string
  textColor?: string
  labelColor?: string
  variant?: 'dark' | 'light' | 'accent'
  className?: string
}

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])

  return count
}

function SingleStat({
  stat,
  accentColor,
  textColor,
  labelColor,
  shouldStart,
}: {
  stat: StatItem
  accentColor: string
  textColor: string
  labelColor: string
  shouldStart: boolean
}) {
  const count = useCountUp(stat.value, 2000, shouldStart)

  return (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-black tabular-nums" style={{ color: accentColor }}>
        {stat.prefix ?? ''}{count.toLocaleString('ar-SA')}{stat.suffix ?? ''}
      </p>
      <p className="mt-2 text-sm font-medium" style={{ color: labelColor }}>{stat.label}</p>
    </div>
  )
}

export function StatsCounter({
  stats,
  accentColor = '#3b82f6',
  textColor = '#111111',
  labelColor = '#666666',
  className = '',
}: StatsCounterProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`grid grid-cols-2 md:grid-cols-4 gap-8 ${className}`}
    >
      {stats.map((stat, i) => (
        <SingleStat
          key={i}
          stat={stat}
          accentColor={accentColor}
          textColor={textColor}
          labelColor={labelColor}
          shouldStart={started}
        />
      ))}
    </div>
  )
}

// بيانات الإحصائيات الافتراضية لكل قطاع
export const SECTOR_STATS: Record<string, StatItem[]> = {
  engineering: [
    { value: 150, suffix: '+', label: 'مشروع منجز' },
    { value: 12, suffix: ' سنة', label: 'خبرة في المجال' },
    { value: 98, suffix: '%', label: 'رضا العملاء' },
    { value: 40, suffix: '+', label: 'عميل راضٍ' },
  ],
  contractor: [
    { value: 200, suffix: '+', label: 'مبنى تم تشييده' },
    { value: 15, suffix: ' سنة', label: 'خبرة في البناء' },
    { value: 50, suffix: '+', label: 'مشروع قيد التنفيذ' },
    { value: 100, suffix: '%', label: 'التزام بالجودة' },
  ],
  real_estate: [
    { value: 500, suffix: '+', label: 'صفقة ناجحة' },
    { value: 1200, suffix: '+', label: 'عقار في قاعدة البيانات' },
    { value: 10, suffix: ' سنة', label: 'خبرة في السوق' },
    { value: 95, suffix: '%', label: 'رضا العملاء' },
  ],
  interior_design: [
    { value: 300, suffix: '+', label: 'مشروع تصميم' },
    { value: 8, suffix: ' سنة', label: 'خبرة في التصميم' },
    { value: 50, suffix: '+', label: 'جائزة تصميم' },
    { value: 99, suffix: '%', label: 'رضا العملاء' },
  ],
  photography: [
    { value: 1000, suffix: '+', label: 'جلسة تصوير' },
    { value: 50000, suffix: '+', label: 'صورة احترافية' },
    { value: 7, suffix: ' سنة', label: 'في عالم التصوير' },
    { value: 98, suffix: '%', label: 'عملاء راضون' },
  ],
  legal: [
    { value: 800, suffix: '+', label: 'قضية مكسوبة' },
    { value: 20, suffix: ' سنة', label: 'خبرة قانونية' },
    { value: 15, suffix: '+', label: 'محامٍ متخصص' },
    { value: 95, suffix: '%', label: 'نسبة النجاح' },
  ],
  medical: [
    { value: 5000, suffix: '+', label: 'مريض تمت رعايته' },
    { value: 15, suffix: ' سنة', label: 'خبرة طبية' },
    { value: 10, suffix: '+', label: 'طبيب متخصص' },
    { value: 98, suffix: '%', label: 'رضا المرضى' },
  ],
  general: [
    { value: 250, suffix: '+', label: 'مشروع منجز' },
    { value: 10, suffix: ' سنة', label: 'خبرة في المجال' },
    { value: 150, suffix: '+', label: 'عميل راضٍ' },
    { value: 97, suffix: '%', label: 'رضا العملاء' },
  ],
}
