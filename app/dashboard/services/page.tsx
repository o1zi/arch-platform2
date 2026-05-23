import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ContentBlock } from '@/types'
import ServicesClient from './ServicesClient'

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tenantUser } = await supabase
    .from('tenant_users')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()

  if (!tenantUser) redirect('/login')

  const { data: blocks } = await supabase
    .from('tenant_content_blocks')
    .select('*')
    .eq('tenant_id', tenantUser.tenant_id)
    .order('sort_order', { ascending: true })

  const allBlocks = (blocks ?? []) as ContentBlock[]
  const services = allBlocks.filter(b => b.type === 'service')
  const features = allBlocks.filter(b => b.type === 'feature')

  return <ServicesClient initialServices={services} initialFeatures={features} />
}
