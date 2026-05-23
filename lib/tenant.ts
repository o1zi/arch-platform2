import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { Tenant } from '@/types'

function handleError(e: unknown): null {
  if (e instanceof Error) {
    console.error('Tenant lookup failed:', e.message)
  }
  return null
}

async function _getTenantBySlug(slug: string): Promise<Tenant | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', slug)
      .single()
    if (error) return handleError(error)
    return data
  } catch (e) {
    return handleError(e)
  }
}

async function _getTenantByDomain(domain: string): Promise<Tenant | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('custom_domain', domain)
      .single()
    if (error) return handleError(error)
    return data
  } catch (e) {
    return handleError(e)
  }
}

export const getTenantBySlug = cache(_getTenantBySlug)
export const getTenantByDomain = cache(_getTenantByDomain)

async function _getTenantByIdentifier(identifier: string): Promise<Tenant | null> {
  const bySlug = await _getTenantBySlug(identifier)
  if (bySlug) return bySlug
  return _getTenantByDomain(identifier)
}

export const getTenantByIdentifier = cache(_getTenantByIdentifier)

export async function getTenantFromRequest(headers: Headers): Promise<Tenant | null> {
  const slug = headers.get('x-tenant-slug')
  const domain = headers.get('x-tenant-domain')
  if (slug) return getTenantBySlug(slug)
  if (domain) return getTenantByDomain(domain)
  return null
}
