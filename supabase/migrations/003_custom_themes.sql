-- =============================================
-- 003_custom_themes.sql
-- جدول القوالب المخصصة التي يرفعها الأدمن
-- =============================================

-- جدول القوالب المخصصة
create table if not exists custom_themes (
  id           uuid primary key default gen_random_uuid(),
  name_ar      text not null,
  name_en      text,
  description_ar text,
  preview_url  text,                   -- رابط صورة المعاينة في Storage
  config       jsonb not null,         -- محتوى theme.json كاملاً
  fonts        jsonb default '[]'::jsonb, -- روابط الخطوط المرفوعة [{name, url}]
  is_active    boolean not null default true,
  plan_required text not null default 'pro'
    check (plan_required in ('basic', 'pro', 'premium')),
  created_by   uuid references auth.users(id),
  created_at   timestamptz default now()
);

-- index للبحث السريع
create index if not exists custom_themes_active_idx on custom_themes(is_active);
create index if not exists custom_themes_plan_idx on custom_themes(plan_required);

-- تفعيل RLS
alter table custom_themes enable row level security;

-- الأدمن يدير كل شيء
create policy "admin_manage_custom_themes"
  on custom_themes for all
  using (is_admin());

-- الزوار يقرأون القوالب النشطة فقط
create policy "public_read_active_custom_themes"
  on custom_themes for select
  using (is_active = true);

-- إضافة عمود custom_theme_id لجدول tenants
alter table tenants
  add column if not exists custom_theme_id uuid references custom_themes(id) on delete set null;
