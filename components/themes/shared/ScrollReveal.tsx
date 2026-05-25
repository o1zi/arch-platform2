'use client'

import { useRef, useState, useEffect, ReactNode } from 'react'

type Animation = 'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'zoom-in' | 'slide-up'

interface ScrollRevealProps {
  children: ReactNode
  animation?: Animation
  delay?: number   // ms
  threshold?: number  // 0-1
  className?: string
}

const TRANSFORMS: Record<Animation, string> = {
  'fade-up':    'translateY(40px)',
  'fade-in':    'translateY(0)',
  'fade-left':  'translateX(40px)',
  'fade-right': 'translateX(-40px)',
  'zoom-in':    'scale(0.9)',
  'slide-up':   'translateY(60px)',
}

export function ScrollReveal({
  children,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.1,
  className = '',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  const hiddenTransform = TRANSFORMS[animation]

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? (animation === 'zoom-in' ? 'scale(1)' : 'translate(0,0)') : hiddenTransform,
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// مكوّن مخصص لتطبيق التأثير على مجموعة من العناصر بتأخير متسلسل
interface StaggerRevealProps {
  children: ReactNode[]
  animation?: Animation
  stagger?: number  // ms بين كل عنصر
  className?: string
  itemClassName?: string
}

export function StaggerReveal({
  children,
  animation = 'fade-up',
  stagger = 100,
  className = '',
  itemClassName = '',
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hiddenTransform = TRANSFORMS[animation]

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div
          key={i}
          className={itemClassName}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? (animation === 'zoom-in' ? 'scale(1)' : 'translate(0,0)') : hiddenTransform,
            transition: `opacity 0.6s ease ${i * stagger}ms, transform 0.6s ease ${i * stagger}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
