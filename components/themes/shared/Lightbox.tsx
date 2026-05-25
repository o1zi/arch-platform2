'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface LightboxImage {
  url: string
  alt?: string
}

interface LightboxProps {
  images: LightboxImage[]
  initialIndex?: number
  onClose: () => void
}

export function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
  const [current, setCurrent] = useState(initialIndex)
  const [zoomed, setZoomed] = useState(false)

  const prev = useCallback(() => {
    setCurrent(i => (i - 1 + images.length) % images.length)
    setZoomed(false)
  }, [images.length])

  const next = useCallback(() => {
    setCurrent(i => (i + 1) % images.length)
    setZoomed(false)
  }, [images.length])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') next()
      if (e.key === 'ArrowRight') prev()
    }
    window.addEventListener('keydown', fn)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', fn)
      document.body.style.overflow = ''
    }
  }, [onClose, prev, next])

  // Swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const delta = touchStart - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) {
      if (delta > 0) next()
      else prev()
    }
    setTouchStart(null)
  }

  if (!images.length) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.97)' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* إغلاق بالضغط على الخلفية */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* الصورة الحالية */}
      <div
        className={`relative z-10 transition-transform duration-300 ${zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}`}
        style={{ maxWidth: '90vw', maxHeight: '90vh' }}
        onClick={() => setZoomed(z => !z)}
      >
        <Image
          src={images[current].url}
          alt={images[current].alt ?? ''}
          width={1400}
          height={900}
          className="object-contain rounded"
          style={{ maxHeight: '85vh', width: 'auto', maxWidth: '88vw' }}
          priority
        />
      </div>

      {/* أزرار التنقل */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/20"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            aria-label="السابق"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/20"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            aria-label="التالي"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </>
      )}

      {/* إغلاق */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:bg-white/20"
        style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        aria-label="إغلاق"
      >
        <X className="w-5 h-5" />
      </button>

      {/* عداد الصور */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-white/60 text-sm font-mono">
        {current + 1} / {images.length}
      </div>

      {/* زر التكبير */}
      <button
        onClick={(e) => { e.stopPropagation(); setZoomed(z => !z) }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 text-white/50 text-xs hover:text-white/80 transition-colors"
      >
        <ZoomIn className="w-4 h-4" />
        {zoomed ? 'انقر لإلغاء التكبير' : 'انقر للتكبير'}
      </button>

      {/* شريط المصغرات */}
      {images.length > 1 && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2 max-w-[80vw] overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); setZoomed(false) }}
              className={`relative flex-shrink-0 w-14 h-10 rounded overflow-hidden transition-all ${i === current ? 'ring-2 ring-white opacity-100' : 'opacity-40 hover:opacity-70'}`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Hook لتسهيل الاستخدام
export function useLightbox() {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = useCallback((i: number) => {
    setIndex(i)
    setOpen(true)
  }, [])

  const close = useCallback(() => setOpen(false), [])

  return { open, index, openAt, close }
}
