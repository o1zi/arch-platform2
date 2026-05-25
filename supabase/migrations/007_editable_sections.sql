-- ═══════════════════════════════════════════════════════════════════════
-- Migration 007: إضافة أقسام قابلة للتعديل من الداشبورد
-- tenant_stats | tenant_testimonials | tenant_faqs | tiktok_url | video_url
-- ═══════════════════════════════════════════════════════════════════════

-- 1) إضافة حقول جديدة لجدول tenants
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS tiktok_url    text,
  ADD COLUMN IF NOT EXISTS video_url     text,
  ADD COLUMN IF NOT EXISTS whatsapp_note text;   -- نص مساعد (رقم واتساب مختلف عن الهاتف)

-- 2) جدول إحصائيات المكتب
CREATE TABLE IF NOT EXISTS tenant_stats (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  value       integer NOT NULL DEFAULT 0,
  suffix      text,                    -- مثال: '+'  أو ' سنة'
  prefix      text,                    -- مثال: '+' (نادر الاستخدام)
  label       text NOT NULL,           -- مثال: 'مشروع منجز'
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

-- 3) جدول شهادات العملاء
CREATE TABLE IF NOT EXISTS tenant_testimonials (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name        text NOT NULL,
  role        text,
  content     text NOT NULL,
  rating      integer NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  sort_order  integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- 4) جدول الأسئلة الشائعة
CREATE TABLE IF NOT EXISTS tenant_faqs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  question    text NOT NULL,
  answer      text NOT NULL,
  sort_order  integer NOT NULL DEFAULT 0,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- ── RLS ──────────────────────────────────────────────────────────────────

ALTER TABLE tenant_stats         ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_testimonials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_faqs          ENABLE ROW LEVEL SECURITY;

-- Visitors: قراءة فقط
CREATE POLICY "public_read_stats"         ON tenant_stats         FOR SELECT USING (true);
CREATE POLICY "public_read_testimonials"  ON tenant_testimonials  FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_faqs"          ON tenant_faqs          FOR SELECT USING (is_active = true);

-- Tenants: CRUD على بياناتهم فقط
CREATE POLICY "tenant_manage_stats"
  ON tenant_stats FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "tenant_manage_testimonials"
  ON tenant_testimonials FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "tenant_manage_faqs"
  ON tenant_faqs FOR ALL
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

-- Admin: كل شيء
CREATE POLICY "admin_all_stats"
  ON tenant_stats FOR ALL USING (is_admin());

CREATE POLICY "admin_all_testimonials"
  ON tenant_testimonials FOR ALL USING (is_admin());

CREATE POLICY "admin_all_faqs"
  ON tenant_faqs FOR ALL USING (is_admin());

-- ── Indexes ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_stats_tenant         ON tenant_stats(tenant_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_tenant  ON tenant_testimonials(tenant_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_faqs_tenant          ON tenant_faqs(tenant_id, sort_order);

COMMENT ON TABLE tenant_stats        IS 'إحصائيات المكتب القابلة للتعديل (مشاريع منجزة، سنوات خبرة...)';
COMMENT ON TABLE tenant_testimonials IS 'شهادات العملاء القابلة للتعديل';
COMMENT ON TABLE tenant_faqs         IS 'الأسئلة الشائعة القابلة للتعديل';
