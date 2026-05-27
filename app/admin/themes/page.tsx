'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SectionHeader, Card, Badge, Btn, IconBtn, Select } from '@/components/ui/atoms'
import { PALETTES, HEADING_FONTS, BODY_FONTS, HERO_STYLES, PLANS } from '@/lib/data'

type ThemeItem = {
  id: string
  name: string
  palette: (typeof PALETTES)[number]
  headingFont: string
  bodyFont: string
  heroStyle: string
  planRequired: string
  createdAt: string
  active: boolean
}

const PALETTE_PLAN_MAP: Record<number, string> = {
  0: 'basic',
  1: 'pro',
  2: 'premium',
  3: 'pro',
  4: 'premium',
  5: 'pro',
  6: 'premium',
  7: 'premium',
}

function generateMockThemes(): ThemeItem[] {
  return PALETTES.map((palette, i) => ({
    id: `theme-${i + 1}`,
    name: palette.name,
    palette,
    headingFont: HEADING_FONTS[i % HEADING_FONTS.length],
    bodyFont: BODY_FONTS[i % BODY_FONTS.length],
    heroStyle: HERO_STYLES[i % HERO_STYLES.length],
    planRequired: PALETTE_PLAN_MAP[i] || 'pro',
    createdAt: new Date(Date.now() - (i * 30 * 86400000)).toISOString().split('T')[0],
    active: i !== 1,
  }))
}

export default function AdminThemesPage() {
  const router = useRouter()
  const [themes] = useState<ThemeItem[]>(generateMockThemes())
  const [filterPlan, setFilterPlan] = useState('all')

  const planLabelMap: Record<string, string> = {}
  Object.entries(PLANS).forEach(([k, v]) => { planLabelMap[k] = v.labelAr })

  const filtered = filterPlan === 'all'
    ? themes
    : themes.filter(t => t.planRequired === filterPlan)

  const getStatusBadge = (active: boolean) =>
    active
      ? <Badge tone="green" dot>نشط</Badge>
      : <Badge tone="red" dot>موقوف</Badge>

  return (
    <div className="wj-anim-in" style={{ maxWidth: 1300 }}>
      <SectionHeader
        title="القوالب المخصصة"
        sub={`${filtered.length} قالب`}
        action={
          <Btn kind="primary" icon="plus" onClick={() => router.push('/admin/themes/new')}>
            إنشاء قالب جديد
          </Btn>
        }
      />

      <div style={{
        display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <Select
          value={filterPlan}
          onChange={e => setFilterPlan(e.target.value)}
          style={{ width: 150, height: 40, borderRadius: 'var(--r-md)', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--ink)', fontSize: 13, padding: '0 10px' }}
        >
          <option value="all">كل الباقات</option>
          <option value="basic">أساسية</option>
          <option value="pro">احترافية</option>
          <option value="premium">بريميوم</option>
        </Select>
        <div style={{ flex: 1 }} />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 18,
        }}
      >
        {filtered.map(theme => {
          const isDark = theme.palette.dark || false
          return (
            <Card key={theme.id} pad style={{ padding: 0, overflow: 'hidden' }}>
              <div
                style={{
                  height: 140,
                  background: theme.palette.bg,
                  display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
                  padding: 16, position: 'relative',
                }}
              >
                <div style={{
                  position: 'absolute', top: 12, insetInlineEnd: 12,
                }}>
                  {getStatusBadge(theme.active)}
                </div>

                <div style={{
                  width: '80%', height: 4, borderRadius: 2,
                  background: theme.palette.primary, marginBottom: 6,
                }} />
                <div style={{
                  width: '60%', height: 3, borderRadius: 2,
                  background: theme.palette.accent, marginBottom: 8,
                }} />
                <div style={{
                  width: '90%', height: 2, borderRadius: 1,
                  background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', marginBottom: 6,
                }} />
                <div style={{
                  width: '70%', height: 2, borderRadius: 1,
                  background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', marginBottom: 6,
                }} />
                <div style={{ width: '40%', height: 2, borderRadius: 1, background: theme.palette.primary, opacity: 0.3 }} />
              </div>

              <div style={{ padding: '16px 18px' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                }}>
                  <h3 style={{
                    margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
                    color: 'var(--ink)',
                  }}>
                    {theme.name}
                  </h3>
                  <Badge tone={theme.planRequired === 'premium' ? 'gold' : theme.planRequired === 'pro' ? 'green' : 'default'}>
                    {planLabelMap[theme.planRequired] || theme.planRequired}
                  </Badge>
                </div>

                <div style={{ display: 'flex', gap: 6, marginTop: 12, alignItems: 'center' }}>
                  {[theme.palette.primary, theme.palette.accent, theme.palette.bg, theme.palette.text].map((color, ci) => (
                    <div
                      key={ci}
                      title={color}
                      style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: color,
                        border: '2px solid var(--surface)',
                        boxShadow: '0 0 0 1px var(--border)',
                      }}
                    />
                  ))}
                  <span style={{ marginInlineStart: 6, fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
                    {theme.palette.primary}
                  </span>
                </div>

                <div style={{
                  display: 'flex', gap: 18, marginTop: 14,
                  padding: '10px 0', borderTop: '1px solid var(--border-soft)',
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>الخط الرئيسي</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                      {theme.headingFont}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>الخط الثانوي</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                      {theme.bodyFont}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>نمط الواجهة</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                      {theme.heroStyle}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex', gap: 8, marginTop: 10,
                  paddingTop: 12, borderTop: '1px solid var(--border-soft)',
                }}>
                  <Btn kind="secondary" size="sm" icon="edit"
                    onClick={() => router.push(`/admin/themes/${theme.id}`)}
                  >
                    تعديل
                  </Btn>
                  <Btn kind="ghost" size="sm" icon="eye">
                    معاينة
                  </Btn>
                  <div style={{ flex: 1 }} />
                  <IconBtn icon="trash" title="حذف" size={32}
                    style={{ color: 'var(--danger)' }}
                  />
                </div>
              </div>
            </Card>
          )
        })}

        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>
            لا توجد قوالب مطابقة
          </div>
        )}
      </div>
    </div>
  )
}
