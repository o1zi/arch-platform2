'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Icons } from '@/lib/icons'
import { DEMO_TENANT, DEMO_PROJECTS } from '@/lib/data'
import { ProjectCover } from '@/components/ui/atoms'

const PR = '#0e3b2e'
const ACC = '#b08a3e'
const BG = '#ffffff'
const MUTED = '#6b7a70'
const SOFT = '#eef4f1'
const INK = '#14201a'

const CATS = ['الكل', 'سكني', 'تجاري', 'تعليمي', 'صحي', 'ديني']

export default function ProjectsPage() {
  const params = useParams()
  const domain = (params?.domain as string) || 'demo'
  const [activeCat, setActiveCat] = useState('الكل')

  const tenant = DEMO_TENANT as Record<string, unknown>
  const allProjects = DEMO_PROJECTS as Record<string, unknown>[]

  const filtered = activeCat === 'الكل'
    ? allProjects
    : allProjects.filter(p => (p.category as string) === activeCat)

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: BG, color: INK, fontFamily: 'IBM Plex Sans Arabic, sans-serif' }}>
      {/* ── Header ── */}
      <header style={{
        background: `linear-gradient(170deg, ${PR}, #0a2c20)`,
        padding: '80px 24px 56px',
        textAlign: 'center',
      }}>
        <Link href={`/${domain}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 14, color: 'rgba(255,255,255,0.55)', textDecoration: 'none',
          marginBottom: 20, transition: 'color 0.2s',
        }}>
          {Icons.arrowRight?.({ size: 15 })}
          العودة للرئيسية
        </Link>
        <h1 style={{ fontFamily: 'Reem Kufi, serif', fontSize: 46, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
          المشاريع
        </h1>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          {tenant.short_ar as string || tenant.name_ar as string}
        </p>
      </header>

      {/* ── Filters ── */}
      <section style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'flex', gap: 10, flexWrap: 'wrap',
            justifyContent: 'center', marginBottom: 40,
          }}>
            {CATS.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                style={{
                  padding: '9px 22px', borderRadius: 10, border: '1.5px solid',
                  borderColor: activeCat === cat ? ACC : '#dde5df',
                  background: activeCat === cat ? ACC : 'transparent',
                  color: activeCat === cat ? '#fff' : MUTED,
                  fontWeight: activeCat === cat ? 600 : 400,
                  fontSize: 14, cursor: 'pointer',
                  fontFamily: 'IBM Plex Sans Arabic, sans-serif',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── Projects Grid ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 24,
          }} className="projects-grid">
            {filtered.map((p, i) => (
              <Link key={i} href={`/${domain}/projects/${p.id as string}`} style={{ textDecoration: 'none' }}>
                <div className="wj-card" style={{
                  borderRadius: 16, overflow: 'hidden', background: '#fff',
                  border: '1px solid #e5ece6', transition: 'all 0.3s ease',
                }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(14,59,46,0.1)' }} onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}>
                  <ProjectCover seed={((p.cover_seed as number) || i + 1)} h={220} radius={0} />
                  <div style={{ padding: '20px 18px' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{
                        display: 'inline-block', fontSize: 11, fontWeight: 600,
                        padding: '3px 10px', borderRadius: 6,
                        background: 'rgba(176,138,62,0.1)', color: ACC,
                      }}>
                        {p.category as string}
                      </span>
                      {Boolean(p.year) && (
                        <span style={{
                          display: 'inline-block', fontSize: 11, fontWeight: 500,
                          padding: '3px 10px', borderRadius: 6,
                          background: SOFT, color: MUTED,
                        }}>
                          {p.year as number}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontFamily: 'Reem Kufi, serif', fontSize: 19, fontWeight: 600, color: INK, margin: '0 0 6px' }}>
                      {p.title_ar as string}
                    </h3>
                    <div style={{ fontSize: 13, color: MUTED, display: 'flex', alignItems: 'center', gap: 4, marginBottom: 10 }}>
                      {Icons.map?.({ size: 13 })}
                      {p.location_ar as string}
                    </div>
                    {Boolean(p.tags) && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {(p.tags as string[]).map((tag, ti) => (
                          <span key={ti} style={{
                            display: 'inline-block', fontSize: 11,
                            padding: '2px 9px', borderRadius: 5,
                            background: 'rgba(14,59,46,0.05)', color: PR,
                          }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: MUTED }}>
              <p style={{ fontSize: 18, fontWeight: 500 }}>لا توجد مشاريع في هذا التصنيف</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Footer Mini ── */}
      <footer style={{ background: '#0a2c20', padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
          <Link href={`/${domain}`} style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>الرئيسية</Link>
          <Link href={`/${domain}/projects`} style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>المشاريع</Link>
          <Link href={`/${domain}/contact`} style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>تواصل معنا</Link>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: '12px 0 0' }}>
          &copy; {new Date().getFullYear()} {tenant.name_ar as string}
        </p>
      </footer>

      {/* ── Responsive ── */}
      <style>{`
        @media (max-width: 768px) {
          .projects-grid { grid-template-columns: 1fr !important; }
          header { padding: 60px 16px 40px !important; }
          header h1 { font-size: 32px !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .projects-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  )
}
