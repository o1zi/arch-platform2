-- =============================================
-- 004_theme_visibility.sql
-- نظام الرؤية للقوالب المخصصة (عام / خاص)
-- =============================================

-- إضافة عمود الرؤية لجدول القوالب
alter table custom_themes
  add column if not exists visibility text not null default 'public'
    check (visibility in ('public', 'private'));

-- تأكد أن القوالب الموجودة مسبقاً تحمل القيمة الافتراضية
update custom_themes set visibility = 'public' where visibility is null;

-- جدول ربط القوالب الخاصة بالمشتركين المحددين
create table if not exists custom_theme_tenants (
  id               uuid primary key default gen_random_uuid(),
  custom_theme_id  uuid not null references custom_themes(id) on delete cascade,
  tenant_id        uuid not null references tenants(id) on delete cascade,
  assigned_by      uuid references auth.users(id),
  assigned_at      timestamptz default now(),
  unique(custom_theme_id, tenant_id)
);

create index if not exists ctt_theme_idx  on custom_theme_tenants(custom_theme_id);
create index if not exists ctt_tenant_idx on custom_theme_tenants(tenant_id);

-- RLS
alter table custom_theme_tenants enable row level security;

create policy "admin_manage_theme_tenants"
  on custom_theme_tenants for all
  using (is_admin());

-- المكتب يقرأ التخصيصات الخاصة به فقط
create policy "tenant_read_own_assignments"
  on custom_theme_tenants for select
  using (tenant_id in (
    select tenant_id from tenant_users where user_id = auth.uid()
  ));
