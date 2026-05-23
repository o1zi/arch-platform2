create table tenant_content_blocks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references tenants(id) on delete cascade,
  type text not null check (type in ('service', 'feature')),
  title text not null,
  description text,
  icon text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

create index on tenant_content_blocks(tenant_id, type);

-- RLS
alter table tenant_content_blocks enable row level security;

-- Tenant can read/write their own blocks
create policy "tenant_own_blocks" on tenant_content_blocks
  for all using (
    tenant_id in (
      select tenant_id from tenant_users where user_id = auth.uid()
    )
  );

-- Admin can read everything
create policy "admin_all_blocks" on tenant_content_blocks
  for all using (is_admin());

-- Public can read active blocks for active tenants
create policy "public_read_blocks" on tenant_content_blocks
  for select using (
    is_active = true and
    tenant_id in (select id from tenants where is_active = true)
  );
