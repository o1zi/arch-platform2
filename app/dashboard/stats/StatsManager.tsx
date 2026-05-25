'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TenantStat } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, GripVertical, Save } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  tenantId: string
  initialStats: TenantStat[]
}

interface StatForm {
  id?: string
  value: string
  suffix: string
  prefix: string
  label: string
  sort_order: number
  isNew?: boolean
}

export default function StatsManager({ tenantId, initialStats }: Props) {
  const supabase = createClient()
  const [stats, setStats] = useState<StatForm[]>(
    initialStats.map(s => ({
      id: s.id,
      value: String(s.value),
      suffix: s.suffix ?? '',
      prefix: s.prefix ?? '',
      label: s.label,
      sort_order: s.sort_order,
    }))
  )
  const [saving, setSaving] = useState(false)

  const addStat = () => {
    setStats(prev => [
      ...prev,
      {
        value: '0',
        suffix: '+',
        prefix: '',
        label: '',
        sort_order: prev.length,
        isNew: true,
      },
    ])
  }

  const removeStat = async (index: number) => {
    const stat = stats[index]
    if (stat.id) {
      await supabase.from('tenant_stats').delete().eq('id', stat.id)
    }
    setStats(prev => prev.filter((_, i) => i !== index))
  }

  const updateField = (index: number, field: keyof StatForm, value: string | number) => {
    setStats(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const saveAll = async () => {
    setSaving(true)
    try {
      for (let i = 0; i < stats.length; i++) {
        const s = stats[i]
        const payload = {
          tenant_id: tenantId,
          value: parseInt(s.value) || 0,
          suffix: s.suffix || null,
          prefix: s.prefix || null,
          label: s.label,
          sort_order: i,
        }
        if (s.id && !s.isNew) {
          await supabase.from('tenant_stats').update(payload).eq('id', s.id)
        } else {
          const { data } = await supabase.from('tenant_stats').insert(payload).select().single()
          if (data) {
            setStats(prev => prev.map((item, idx) => idx === i ? { ...item, id: data.id, isNew: false } : item))
          }
        }
      }
      toast.success('تم حفظ الإحصائيات بنجاح')
    } catch {
      toast.error('حدث خطأ أثناء الحفظ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">إحصائيات المكتب</h1>
          <p className="text-sm text-gray-500 mt-1">تظهر هذه الأرقام في صفحة موقعك (مشاريع منجزة، سنوات خبرة...)</p>
        </div>
        <Button onClick={saveAll} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ الكل'}
        </Button>
      </div>

      <div className="space-y-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400" />
                  إحصائية {index + 1}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStat(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <Label htmlFor={`label-${index}`}>التسمية *</Label>
                  <Input
                    id={`label-${index}`}
                    value={stat.label}
                    onChange={e => updateField(index, 'label', e.target.value)}
                    placeholder="مثال: مشروع منجز"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`value-${index}`}>الرقم *</Label>
                  <Input
                    id={`value-${index}`}
                    type="number"
                    value={stat.value}
                    onChange={e => updateField(index, 'value', e.target.value)}
                    placeholder="150"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`suffix-${index}`}>لاحقة (بعد الرقم)</Label>
                  <Input
                    id={`suffix-${index}`}
                    value={stat.suffix}
                    onChange={e => updateField(index, 'suffix', e.target.value)}
                    placeholder="مثال: + أو  سنة"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`prefix-${index}`}>سابقة (قبل الرقم)</Label>
                  <Input
                    id={`prefix-${index}`}
                    value={stat.prefix}
                    onChange={e => updateField(index, 'prefix', e.target.value)}
                    placeholder="نادر الاستخدام"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-600">
                معاينة: <span className="font-bold text-gray-900">{stat.prefix}{stat.value}{stat.suffix}</span> — {stat.label || '...'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={addStat}
        className="mt-4 w-full gap-2 border-dashed"
        disabled={stats.length >= 8}
      >
        <Plus className="h-4 w-4" />
        إضافة إحصائية جديدة
      </Button>

      {stats.length >= 8 && (
        <p className="text-sm text-gray-400 text-center mt-2">الحد الأقصى 8 إحصائيات</p>
      )}
    </div>
  )
}
