-- ═══════════════════════════════════════════════════════════════════════
-- Migration 009: نظام التحليلات الكامل
-- analytics_events — تتبع الزوار والنقرات
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS analytics_events (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid        NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

  -- نوع الحدث
  event_type  text        NOT NULL,
  -- page_view | whatsapp_click | phone_click | email_click
  -- maps_click | social_click  | project_view | contact_page_view

  -- بيانات الصفحة
  page        text,                       -- /slug/projects/123
  project_id  uuid REFERENCES projects(id) ON DELETE SET NULL,
  meta        jsonb,                      -- { button: 'snapchat' } أو { project_title: '...' }

  -- بيانات الزائر (مخصصة للخصوصية)
  ip_hash     text,                       -- sha256(ip + tenant_slug).slice(0,16) — لحساب الزوار الفريدين
  referrer    text,                       -- رابط المصدر

  created_at  timestamptz DEFAULT now()
);

-- فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_analytics_tenant_date
  ON analytics_events(tenant_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_type
  ON analytics_events(tenant_id, event_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_project
  ON analytics_events(tenant_id, project_id, created_at DESC);

-- ── RLS ──────────────────────────────────────────────────────────────────

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- الزوار يستطيعون الإدراج (تسجيل الأحداث) بدون تسجيل دخول
CREATE POLICY "public_insert_analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

-- المكتب يقرأ بياناته فقط
CREATE POLICY "tenant_read_analytics"
  ON analytics_events FOR SELECT
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

-- الأدمن يقرأ ويعدل كل شيء
CREATE POLICY "admin_all_analytics"
  ON analytics_events FOR ALL
  USING (is_admin());

COMMENT ON TABLE analytics_events IS 'أحداث التحليلات: مشاهدات، نقرات، زوار';
