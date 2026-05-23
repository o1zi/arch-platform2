import { createClient } from '@/lib/supabase/server'
import { Tenant } from '@/types'

export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .single()
  return data
}

export async function getTenantByDomain(domain: string): Promise<Tenant | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('tenants')
    .select('*')
    .eq('custom_domain', domain)
    .single()
  return data
}

// Used by [domain] pages — identifier is either a slug or custom domain
export async function getTenantByIdentifier(identifier: string): Promise<Tenant | null> {
  const bySlug = await getTenantBySlug(identifier)
  if (bySlug) return bySlug
  return getTenantByDomain(identifier)
}

export async function getTenantFromRequest(headers: Headers): Promise<Tenant | null> {
  const slug = headers.get('x-tenant-slug')
  const domain = headers.get('x-tenant-domain')
  if (slug) return getTenantBySlug(slug)
  if (domain) return getTenantByDomain(domain)
  return null
}
