-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- =====================
-- TABLES
-- =====================

create table tenants (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text,
  slug text unique not null,
  custom_domain text unique,
  logo_url text,
  cover_url text,
  bio_ar text,
  bio_en text,
  phone text,
  email text,
  address_ar text,
  address_en text,
  google_maps_url text,
  instagram_url text,
  twitter_url text,
  linkedin_url text,
  snapchat_url text,
  theme text not null default 'modern'
    check (theme in ('modern','classic','bold','minimal','luxury')),
  is_active boolean not null default false,
  plan text not null default 'basic'
    check (plan in ('basic','pro','premium')),
  subscription_start date,
  subscription_end date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table tenant_users (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text not null default 'owner'
    check (role in ('owner', 'editor')),
  created_at timestamptz default now(),
  unique(tenant_id, user_id)
);

create table projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  title_ar text not null,
  title_en text,
  description_ar text,
  description_en text,
  category text,
  location_ar text,
  year integer,
  cover_image_url text,
  sort_order integer default 0,
  is_featured boolean default false,
  deleted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  tenant_id uuid references tenants(id) on delete cascade,
  url text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

create table admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table subscription_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  action text not null
    check (action in ('activated','renewed','suspended','cancelled')),
  plan text,
  amount numeric,
  notes text,
  performed_by uuid references auth.users(id),
  created_at timestamptz default now()
);

-- =====================
-- UPDATED_AT TRIGGER
-- =====================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger tenants_updated_at before update on tenants
  for each row execute function update_updated_at();

create trigger projects_updated_at before update on projects
  for each row execute function update_updated_at();

-- =====================
-- ADMIN HELPER FUNCTION
-- =====================

create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_users
    where user_id = auth.uid()
  );
$$ language sql security definer;

-- =====================
-- ROW LEVEL SECURITY
-- =====================

alter table tenants enable row level security;
alter table tenant_users enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table admin_users enable row level security;
alter table subscription_logs enable row level security;

-- tenants policies
create policy "Public can view active tenants"
  on tenants for select
  using (is_active = true);

create policy "Tenant owner can view own tenant"
  on tenants for select
  using (
    exists (
      select 1 from tenant_users
      where tenant_users.tenant_id = tenants.id
        and tenant_users.user_id = auth.uid()
    )
  );

create policy "Tenant owner can update own tenant"
  on tenants for update
  using (
    exists (
      select 1 from tenant_users
      where tenant_users.tenant_id = tenants.id
        and tenant_users.user_id = auth.uid()
    )
  );

create policy "Admin full access to tenants"
  on tenants for all
  using (is_admin());

-- tenant_users policies
create policy "Tenant users can view own records"
  on tenant_users for select
  using (user_id = auth.uid() or is_admin());

create policy "Admin full access to tenant_users"
  on tenant_users for all
  using (is_admin());

-- projects policies
create policy "Public can view projects of active tenants"
  on projects for select
  using (
    deleted_at is null
    and exists (
      select 1 from tenants
      where tenants.id = projects.tenant_id
        and tenants.is_active = true
    )
  );

create policy "Tenant owner can manage own projects"
  on projects for all
  using (
    exists (
      select 1 from tenant_users
      where tenant_users.tenant_id = projects.tenant_id
        and tenant_users.user_id = auth.uid()
    )
  );

create policy "Admin full access to projects"
  on projects for all
  using (is_admin());

-- project_images policies
create policy "Public can view images of active tenant projects"
  on project_images for select
  using (
    exists (
      select 1 from tenants
      where tenants.id = project_images.tenant_id
        and tenants.is_active = true
    )
  );

create policy "Tenant owner can manage own project images"
  on project_images for all
  using (
    exists (
      select 1 from tenant_users
      where tenant_users.tenant_id = project_images.tenant_id
        and tenant_users.user_id = auth.uid()
    )
  );

create policy "Admin full access to project_images"
  on project_images for all
  using (is_admin());

-- admin_users policies
create policy "Admin can view admin_users"
  on admin_users for select
  using (is_admin() or user_id = auth.uid());

-- subscription_logs policies
create policy "Tenant owner can view own logs"
  on subscription_logs for select
  using (
    exists (
      select 1 from tenant_users
      where tenant_users.tenant_id = subscription_logs.tenant_id
        and tenant_users.user_id = auth.uid()
    )
  );

create policy "Admin full access to subscription_logs"
  on subscription_logs for all
  using (is_admin());

-- =====================
-- STORAGE BUCKETS
-- =====================
-- Run these in Supabase dashboard or via CLI:
-- insert into storage.buckets (id, name, public) values ('tenant-logos', 'tenant-logos', true);
-- insert into storage.buckets (id, name, public) values ('tenant-covers', 'tenant-covers', true);
-- insert into storage.buckets (id, name, public) values ('project-covers', 'project-covers', true);
-- insert into storage.buckets (id, name, public) values ('project-images', 'project-images', true);
