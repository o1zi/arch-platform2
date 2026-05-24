import { CustomThemeConfig } from '@/types'

const HERO_STYLES = ['fullscreen', 'split', 'centered', 'minimal'] as const
const BORDER_RADIUS = ['none', 'sm', 'md', 'lg', 'full'] as const
const SPACING = ['compact', 'normal', 'spacious'] as const
const SECTIONS = ['hero', 'about', 'services', 'projects', 'features', 'cta', 'footer'] as const
const GRID_STYLES = ['grid', 'masonry', 'list'] as const
const TEXT_ALIGNS = ['right', 'center', 'left'] as const

function isHexColor(val: unknown): val is string {
  return typeof val === 'string' && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val)
}

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateThemeConfig(raw: unknown): ValidationResult {
  const errors: string[] = []

  if (!raw || typeof raw !== 'object') {
    return { valid: false, errors: ['theme.json يجب أن يكون JSON object'] }
  }

  const c = raw as Record<string, unknown>

  // ── colors ───────────────────────────────────────────────────────────────
  if (!c.colors || typeof c.colors !== 'object') {
    errors.push('حقل colors مطلوب')
  } else {
    const colors = c.colors as Record<string, unknown>
    const required = ['primary', 'secondary', 'accent', 'background', 'text', 'textLight']
    required.forEach(k => {
      if (!isHexColor(colors[k])) {
        errors.push(`colors.${k} يجب أن يكون لون HEX صحيح (مثال: #1a1a2e)`)
      }
    })
  }

  // ── fonts ────────────────────────────────────────────────────────────────
  if (!c.fonts || typeof c.fonts !== 'object') {
    errors.push('حقل fonts مطلوب')
  } else {
    const fonts = c.fonts as Record<string, unknown>
    if (!fonts.heading || typeof fonts.heading !== 'string') errors.push('fonts.heading مطلوب (اسم خط Google Font)')
    if (!fonts.body || typeof fonts.body !== 'string') errors.push('fonts.body مطلوب (اسم خط Google Font)')
  }

  // ── hero ─────────────────────────────────────────────────────────────────
  if (!c.hero || typeof c.hero !== 'object') {
    errors.push('حقل hero مطلوب')
  } else {
    const hero = c.hero as Record<string, unknown>
    if (!HERO_STYLES.includes(hero.style as (typeof HERO_STYLES)[number])) {
      errors.push(`hero.style يجب أن يكون: ${HERO_STYLES.join(' | ')}`)
    }
    if (typeof hero.overlayOpacity !== 'number' || hero.overlayOpacity < 0 || hero.overlayOpacity > 1) {
      errors.push('hero.overlayOpacity يجب أن يكون رقم بين 0 و 1')
    }
    if (!TEXT_ALIGNS.includes(hero.textAlign as (typeof TEXT_ALIGNS)[number])) {
      errors.push(`hero.textAlign يجب أن يكون: ${TEXT_ALIGNS.join(' | ')}`)
    }
  }

  // ── layout ───────────────────────────────────────────────────────────────
  if (!c.layout || typeof c.layout !== 'object') {
    errors.push('حقل layout مطلوب')
  } else {
    const layout = c.layout as Record<string, unknown>
    if (!BORDER_RADIUS.includes(layout.borderRadius as (typeof BORDER_RADIUS)[number])) {
      errors.push(`layout.borderRadius يجب أن يكون: ${BORDER_RADIUS.join(' | ')}`)
    }
    if (!SPACING.includes(layout.spacing as (typeof SPACING)[number])) {
      errors.push(`layout.spacing يجب أن يكون: ${SPACING.join(' | ')}`)
    }
    if (!Array.isArray(layout.sections) || layout.sections.length === 0) {
      errors.push('layout.sections يجب أن يكون array غير فارغ')
    } else {
      const invalid = (layout.sections as unknown[]).filter(s => !SECTIONS.includes(s as (typeof SECTIONS)[number]))
      if (invalid.length > 0) {
        errors.push(`layout.sections يحتوي على قيم غير معروفة: ${invalid.join(', ')}`)
      }
      if (!layout.sections.includes('hero')) {
        errors.push('layout.sections يجب أن يحتوي على "hero"')
      }
    }
  }

  // ── projectsGrid ─────────────────────────────────────────────────────────
  if (!c.projectsGrid || typeof c.projectsGrid !== 'object') {
    errors.push('حقل projectsGrid مطلوب')
  } else {
    const grid = c.projectsGrid as Record<string, unknown>
    if (![2, 3, 4].includes(grid.columns as number)) {
      errors.push('projectsGrid.columns يجب أن يكون 2 أو 3 أو 4')
    }
    if (!GRID_STYLES.includes(grid.style as (typeof GRID_STYLES)[number])) {
      errors.push(`projectsGrid.style يجب أن يكون: ${GRID_STYLES.join(' | ')}`)
    }
  }

  return { valid: errors.length === 0, errors }
}

export function parseThemeConfig(raw: unknown): CustomThemeConfig {
  // استدعِ validateThemeConfig أولاً للتأكد من الصحة
  return raw as CustomThemeConfig
}
