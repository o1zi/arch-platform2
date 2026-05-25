import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TenantFAQ } from '@/types'
import FAQManager from './FAQManager'

export default async function FAQPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tenantUser } = await supabase
    .from('tenant_users')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()

  if (!tenantUser) redirect('/login')

  const { data: faqs } = await supabase
    .from('tenant_faqs')
    .select('*')
    .eq('tenant_id', tenantUser.tenant_id)
    .order('sort_order', { ascending: true })

  return (
    <FAQManager
      tenantId={tenantUser.tenant_id}
      initialFAQs={(faqs ?? []) as TenantFAQ[]}
    />
  )
}
