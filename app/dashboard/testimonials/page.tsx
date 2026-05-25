import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TenantTestimonial } from '@/types'
import TestimonialsManager from './TestimonialsManager'

export default async function TestimonialsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tenantUser } = await supabase
    .from('tenant_users')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single()

  if (!tenantUser) redirect('/login')

  const { data: testimonials } = await supabase
    .from('tenant_testimonials')
    .select('*')
    .eq('tenant_id', tenantUser.tenant_id)
    .order('sort_order', { ascending: true })

  return (
    <TestimonialsManager
      tenantId={tenantUser.tenant_id}
      initialTestimonials={(testimonials ?? []) as TenantTestimonial[]}
    />
  )
}
