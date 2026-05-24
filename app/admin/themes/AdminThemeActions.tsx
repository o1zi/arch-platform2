'use client'

import { useState } from 'react'
import { CustomTheme } from '@/types'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Trash2, Power, PowerOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminThemeActions({ theme }: { theme: CustomTheme }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggleActive() {
    setLoading(true)
    const res = await fetch(`/api/admin/themes/${theme.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !theme.is_active }),
    })
    setLoading(false)
    if (res.ok) {
      toast.success(theme.is_active ? 'تم إيقاف القالب' : 'تم تفعيل القالب')
      router.refresh()
    } else {
      toast.error('فشل التعديل')
    }
  }

  async function handleDelete() {
    if (!confirm(`هل أنت متأكد من حذف قالب "${theme.name_ar}"؟\nسيتم إزالته من جميع المكاتب التي تستخدمه.`)) return
    setLoading(true)
    const res = await fetch(`/api/admin/themes/${theme.id}`, { method: 'DELETE' })
    setLoading(false)
    if (res.ok) {
      toast.success('تم حذف القالب')
      router.refresh()
    } else {
      toast.error('فشل الحذف')
    }
  }

  return (
    <div className="flex gap-2 pt-1">
      <Button
        variant="outline"
        size="sm"
        className="flex-1 gap-1.5 text-xs"
        disabled={loading}
        onClick={toggleActive}
      >
        {theme.is_active
          ? <><PowerOff className="h-3 w-3" /> إيقاف</>
          : <><Power className="h-3 w-3" /> تفعيل</>
        }
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
        disabled={loading}
        onClick={handleDelete}
      >
        <Trash2 className="h-3 w-3" />
        حذف
      </Button>
    </div>
  )
}
