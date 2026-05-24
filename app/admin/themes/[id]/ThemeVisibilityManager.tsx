'use client'

import { useState } from 'react'
import { CustomTheme, Tenant } from '@/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Globe, Lock, UserPlus, X, Search, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Assignment {
  id: string
  tenant_id: string
  assigned_at: string
  tenant: Tenant
}

interface Props {
  theme: CustomTheme
  allTenants: Tenant[]
  assignments: Assignment[]
  assignedTenantIds: string[]
}

const planColors: Record<string, string> = {
  basic: 'bg-gray-100 text-gray-600',
  pro: 'bg-blue-100 text-blue-700',
  premium: 'bg-yellow-100 text-yellow-700',
}

export default function ThemeVisibilityManager({ theme, allTenants, assignments, assignedTenantIds }: Props) {
  const router = useRouter()
  const [visibility, setVisibility] = useState<'public' | 'private'>(theme.visibility ?? 'public')
  const [savingVisibility, setSavingVisibility] = useState(false)
  const [assigned, setAssigned] = useState<string[]>(assignedTenantIds)
  const [loadingTenant, setLoadingTenant] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  // تغيير الرؤية
  async function toggleVisibility(v: 'public' | 'private') {
    if (v === visibility) return
    setSavingVisibility(true)
    const res = await fetch(`/api/admin/themes/${theme.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visibility: v }),
    })
    setSavingVisibility(false)
    if (res.ok) {
      setVisibility(v)
      toast.success(v === 'public' ? 'القالب أصبح عاماً' : 'القالب أصبح خاصاً')
      router.refresh()
    } else {
      toast.error('فشل تغيير الرؤية')
    }
  }

  // تخصيص مشترك
  async function assignTenant(tenantId: string) {
    setLoadingTenant(tenantId)
    const res = await fetch(`/api/admin/themes/${theme.id}/tenants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenant_id: tenantId }),
    })
    setLoadingTenant(null)
    if (res.ok) {
      setAssigned(prev => [...prev, tenantId])
      const t = allTenants.find(t => t.id === tenantId)
      toast.success(`تم تخصيص القالب لـ ${t?.name_ar}`)
      router.refresh()
    } else {
      toast.error('فشل التخصيص')
    }
  }

  // إلغاء تخصيص مشترك
  async function removeTenant(tenantId: string) {
    setLoadingTenant(tenantId)
    const res = await fetch(`/api/admin/themes/${theme.id}/tenants?tenant_id=${tenantId}`, {
      method: 'DELETE',
    })
    setLoadingTenant(null)
    if (res.ok) {
      setAssigned(prev => prev.filter(id => id !== tenantId))
      const t = allTenants.find(t => t.id === tenantId)
      toast.success(`تم إلغاء تخصيص ${t?.name_ar}`)
      router.refresh()
    } else {
      toast.error('فشل الإلغاء')
    }
  }

  const filteredTenants = allTenants.filter(t =>
    t.name_ar.includes(search) || t.slug.includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* ── بطاقة الرؤية ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <h2 className="font-semibold text-gray-800">رؤية القالب</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* عام */}
          <button
            onClick={() => toggleVisibility('public')}
            disabled={savingVisibility}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border-2 text-right transition-all',
              visibility === 'public'
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <Globe className={cn('h-5 w-5 mt-0.5 flex-shrink-0', visibility === 'public' ? 'text-gray-900' : 'text-gray-400')} />
            <div>
              <p className="font-semibold text-sm">عام</p>
              <p className="text-xs text-gray-500 mt-0.5">
                يظهر لكل المكاتب التي تنطبق عليها الباقة المحددة للقالب
              </p>
            </div>
            {visibility === 'public' && <CheckCircle2 className="h-4 w-4 text-gray-900 mr-auto flex-shrink-0" />}
          </button>

          {/* خاص */}
          <button
            onClick={() => toggleVisibility('private')}
            disabled={savingVisibility}
            className={cn(
              'flex items-start gap-3 p-4 rounded-xl border-2 text-right transition-all',
              visibility === 'private'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            )}
          >
            <Lock className={cn('h-5 w-5 mt-0.5 flex-shrink-0', visibility === 'private' ? 'text-blue-600' : 'text-gray-400')} />
            <div>
              <p className="font-semibold text-sm">خاص</p>
              <p className="text-xs text-gray-500 mt-0.5">
                يظهر فقط للمشتركين الذين تخصّصه لهم يدوياً أدناه
              </p>
            </div>
            {visibility === 'private' && <CheckCircle2 className="h-4 w-4 text-blue-600 mr-auto flex-shrink-0" />}
          </button>
        </div>

        {visibility === 'public' && (
          <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
            القالب مرئي الآن لكل المكاتب ذات الباقة <strong>{theme.plan_required}</strong> أو أعلى
          </p>
        )}
        {visibility === 'private' && (
          <p className="text-xs text-blue-600 bg-blue-50 rounded-lg p-3">
            القالب مخفي عن الجميع — يظهر فقط للمكاتب المضافة في القائمة أدناه
          </p>
        )}
      </div>

      {/* ── المشتركون المخصصون ── */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-gray-800">المشتركون المخصصون</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {visibility === 'private'
                ? 'هؤلاء المشتركون فقط يرون القالب'
                : 'هؤلاء يرون القالب بغض النظر عن رؤيته (يصلح للاختبار)'}
            </p>
          </div>
          <Badge variant="secondary">{assigned.length} مشترك</Badge>
        </div>

        {/* المخصصون الحاليون */}
        {assigned.length > 0 ? (
          <div className="space-y-2">
            {assignments
              .filter(a => assigned.includes(a.tenant_id))
              .map(a => (
                <div key={a.tenant_id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                      {a.tenant.name_ar.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{a.tenant.name_ar}</p>
                      <p className="text-xs text-gray-400" dir="ltr">{a.tenant.slug}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${planColors[a.tenant.plan]}`}>
                      {a.tenant.plan}
                    </span>
                  </div>
                  <button
                    onClick={() => removeTenant(a.tenant_id)}
                    disabled={loadingTenant === a.tenant_id}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="إلغاء التخصيص"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">
            لم يتم تخصيص أي مشترك بعد
          </p>
        )}

        {/* إضافة مشترك */}
        <div className="border-t pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">إضافة مشترك</p>
          </div>

          {/* بحث */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث بالاسم أو الـ slug..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-200 rounded-lg py-2 pr-9 pl-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          {/* قائمة المكاتب */}
          <div className="max-h-64 overflow-y-auto space-y-1 border border-gray-100 rounded-lg p-1">
            {filteredTenants.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">لا توجد نتائج</p>
            ) : (
              filteredTenants.map(t => {
                const isAssigned = assigned.includes(t.id)
                const isLoading = loadingTenant === t.id
                return (
                  <div key={t.id}
                    className={cn(
                      'flex items-center justify-between p-2.5 rounded-md',
                      isAssigned ? 'bg-blue-50' : 'hover:bg-gray-50'
                    )}>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                        {t.name_ar.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.name_ar}</p>
                        <p className="text-xs text-gray-400" dir="ltr">{t.slug}</p>
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${planColors[t.plan]}`}>
                        {t.plan}
                      </span>
                      {!t.is_active && (
                        <span className="text-xs text-red-500">موقوف</span>
                      )}
                    </div>
                    {isAssigned ? (
                      <span className="text-xs text-blue-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        مضاف
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs px-3"
                        disabled={isLoading}
                        onClick={() => assignTenant(t.id)}
                      >
                        {isLoading ? '...' : 'تخصيص'}
                      </Button>
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
