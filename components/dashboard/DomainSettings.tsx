'use client'

import { useState } from 'react'
import { Tenant } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Copy, Globe, Lock } from 'lucide-react'

export default function DomainSettings({ tenant }: { tenant: Tenant }) {
  const supabase = createClient()
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost:3000'
  const isLocalhost = rootDomain.startsWith('localhost')
  const proto = isLocalhost ? 'http' : 'https'
  const siteUrl = tenant.custom_domain
    ? `${proto}://${tenant.custom_domain}`
    : `${proto}://${rootDomain}/${tenant.slug}`

  const [customDomain, setCustomDomain] = useState(tenant.custom_domain ?? '')
  const [saving, setSaving] = useState(false)

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text)
    toast.success('تم النسخ')
  }

  async function saveCustomDomain() {
    if (tenant.plan !== 'premium') return
    setSaving(true)
    const { error } = await supabase
      .from('tenants')
      .update({ custom_domain: customDomain || null })
      .eq('id', tenant.id)
    if (error) toast.error('فشل حفظ الدومين')
    else toast.success('تم حفظ الدومين الخاص')
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Subdomain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4" />
            رابطك على المنصة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-gray-100 rounded-lg px-4 py-3 text-sm font-mono" dir="ltr">
              {siteUrl}
            </code>
            <Button size="sm" variant="outline" onClick={() => copyToClipboard(siteUrl)}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">هذا الرابط دائم ولا يتغير.</p>
        </CardContent>
      </Card>

      <Separator />

      {/* Custom Domain */}
      <Card className={tenant.plan !== 'premium' ? 'opacity-60' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            {tenant.plan === 'premium' ? (
              <Globe className="h-4 w-4" />
            ) : (
              <Lock className="h-4 w-4" />
            )}
            دومين خاص
            {tenant.plan !== 'premium' && (
              <Badge variant="secondary" className="mr-auto text-xs">باقة Premium فقط</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tenant.plan !== 'premium' ? (
            <p className="text-sm text-gray-500">
              يمكنك ربط دومينك الخاص (مثل <code dir="ltr">myoffice.com</code>) مع ترقية الباقة إلى Premium.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <Label>الدومين الخاص</Label>
                <Input
                  value={customDomain}
                  onChange={e => setCustomDomain(e.target.value)}
                  placeholder="myoffice.com"
                  dir="ltr"
                />
              </div>
              <Button onClick={saveCustomDomain} disabled={saving}>
                {saving ? 'جارٍ الحفظ...' : 'حفظ الدومين'}
              </Button>

              {customDomain && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3 mt-4">
                  <p className="font-semibold text-sm text-blue-800">خطوات إعداد الدومين:</p>
                  <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                    <li>
                      اذهب إلى لوحة تحكم مزود الدومين
                    </li>
                    <li>
                      أضف سجل <strong>CNAME</strong> يشير إلى:{' '}
                      <code className="bg-white px-1 rounded" dir="ltr">cname.vercel-dns.com</code>
                    </li>
                    <li>
                      اسم السجل: <code className="bg-white px-1 rounded" dir="ltr">{customDomain}</code>
                    </li>
                    <li>التحقق يستغرق عادةً من 5 دقائق إلى 48 ساعة</li>
                  </ol>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
