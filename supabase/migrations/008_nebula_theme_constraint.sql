-- ═══════════════════════════════════════════════════════════════════════
-- Migration 008: إضافة قالب nebula لـ CHECK constraint جدول tenants
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE tenants
  DROP CONSTRAINT IF EXISTS tenants_theme_check;

ALTER TABLE tenants
  ADD CONSTRAINT tenants_theme_check
    CHECK (theme IN ('modern', 'classic', 'bold', 'minimal', 'luxury', 'nebula'));

COMMENT ON COLUMN tenants.theme IS 'القالب المختار: modern | classic | bold | minimal | luxury | nebula';
