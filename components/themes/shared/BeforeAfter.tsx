'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { ArrowLeftRight } from 'lucide-react'

interface BeforeAfterProps {
  beforeUrl: string
  afterUrl: string
  beforeLabel?: string
  afterLabel?: string
  accentColor?: string
}

export function BeforeAfter({
  beforeUrl,
  afterUrl,
  beforeLabel = 'قبل',
  afterLabel = 'بعد',
  accentColor = '#3b82f6',
}: BeforeAfterProps) {
  const [position, setPosition] = useState(50) // percentage
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.min(100, Math.max(0, (x / rect.width) * 100))
    setPosition(pct)
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return
    updatePosition(e.clientX)
  }, [updatePosition])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    updatePosition(e.touches[0].clientX)
  }, [updatePosition])

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-xl cursor-ew-resize select-none"
      style={{ aspectRatio: '16/9', userSelect: 'none' }}
      onMouseDown={() => { dragging.current = true }}
      onMouseMove={onMouseMove}
      onMouseUp={() => { dragging.current = false }}
      onMouseLeave={() => { dragging.current = false }}
      onTouchMove={onTouchMove}
    >
      {/* After (full width) */}
      <Image src={afterUrl} alt={afterLabel} fill className="object-cover" />

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image src={beforeUrl} alt={beforeLabel} fill className="object-cover" />
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5"
        style={{ left: `${position}%`, backgroundColor: '#ffffff', transform: 'translateX(-50%)' }}
      >
        {/* Handle */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-xl"
          style={{ backgroundColor: accentColor }}
        >
          <ArrowLeftRight className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Labels */}
      <div
        className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#ffffff' }}
      >
        {beforeLabel}
      </div>
      <div
        className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded"
        style={{ backgroundColor: accentColor, color: '#ffffff' }}
      >
        {afterLabel}
      </div>
    </div>
  )
}

// قسم مقارنة قبل/بعد متعدد
interface BeforeAfterSectionProps {
  pairs: Array<{
    before: string
    after: string
    title?: string
    beforeLabel?: string
    afterLabel?: string
  }>
  sectionTitle?: string
  accentColor?: string
  bgColor?: string
  textColor?: string
}

export function BeforeAfterSection({
  pairs,
  sectionTitle = 'قبل وبعد',
  accentColor = '#3b82f6',
  bgColor = '#ffffff',
  textColor = '#111111',
}: BeforeAfterSectionProps) {
  if (!pairs.length) return null

  return (
    <section className="py-20 px-6" style={{ backgroundColor: bgColor }} dir="rtl">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-black mb-12 text-center" style={{ color: textColor }}>{sectionTitle}</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {pairs.map((pair, i) => (
            <div key={i}>
              {pair.title && (
                <p className="font-semibold mb-3 text-sm" style={{ color: textColor }}>{pair.title}</p>
              )}
              <BeforeAfter
                beforeUrl={pair.before}
                afterUrl={pair.after}
                beforeLabel={pair.beforeLabel ?? 'قبل'}
                afterLabel={pair.afterLabel ?? 'بعد'}
                accentColor={accentColor}
              />
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-6 opacity-40" style={{ color: textColor }}>اسحب الخط للمقارنة</p>
      </div>
    </section>
  )
}
