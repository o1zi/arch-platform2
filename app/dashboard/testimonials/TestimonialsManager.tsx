'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TenantTestimonial } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Save, Star } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  tenantId: string
  initialTestimonials: TenantTestimonial[]
}

interface TestimonialForm {
  id?: string
  name: string
  role: string
  content: string
  rating: number
  is_active: boolean
  sort_order: number
  isNew?: boolean
}

export default function TestimonialsManager({ tenantId, initialTestimonials }: Props) {
  const supabase = createClient()
  const [items, setItems] = useState<TestimonialForm[]>(
    initialTestimonials.map(t => ({
      id: t.id,
      name: t.name,
      role: t.role ?? '',
      content: t.content,
      rating: t.rating,
      is_active: t.is_active,
      sort_order: t.sort_order,
    }))
  )
  const [saving, setSaving] = useState(false)

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        name: '',
        role: '',
        content: '',
        rating: 5,
        is_active: true,
        sort_order: prev.length,
        isNew: true,
      },
    ])
  }

  const removeItem = async (index: number) => {
    const item = items[index]
    if (item.id && !item.isNew) {
      await supabase.from('tenant_testimonials').delete().eq('id', item.id)
      toast.success('تم الحذف')
    }
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateField = (index: number, field: keyof TestimonialForm, value: string | number | boolean) => {
    setItems(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const saveAll = async () => {
    setSaving(true)
    try {
      for (let i = 0; i < items.length; i++) {
        const t = items[i]
        if (!t.name || !t.content) continue
        const payload = {
          tenant_id: tenantId,
          name: t.name,
          role: t.role || null,
          content: t.content,
          rating: t.rating,
          is_active: t.is_active,
          sort_order: i,
        }
        if (t.id && !t.isNew) {
          await supabase.from('tenant_testimonials').update(payload).eq('id', t.id)
        } else {
          const { data } = await supabase.from('tenant_testimonials').insert(payload).select().single()
          if (data) {
            setItems(prev => prev.map((item, idx) => idx === i ? { ...item, id: data.id, isNew: false } : item))
          }
        }
      }
      toast.success('تم حفظ آراء العملاء بنجاح')
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
          <h1 className="text-2xl font-bold">آراء العملاء</h1>
          <p className="text-sm text-gray-500 mt-1">شهادات وتقييمات عملائك تظهر في صفحة موقعك</p>
        </div>
        <Button onClick={saveAll} disabled={saving} className="gap-2">
          <Save className="h-4 w-4" />
          {saving ? 'جاري الحفظ...' : 'حفظ الكل'}
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>رأي {index + 1}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateField(index, 'is_active', !item.is_active)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.is_active ? 'bg-gray-900' : 'bg-gray-200'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${item.is_active ? 'translate-x-4' : 'translate-x-1'}`} />
                  </button>
                  <span className="text-xs text-gray-500">{item.is_active ? 'ظاهر' : 'مخفي'}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 px-2"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>اسم العميل *</Label>
                  <Input
                    value={item.name}
                    onChange={e => updateField(index, 'name', e.target.value)}
                    placeholder="محمد العمري"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>المسمى الوظيفي / الشركة</Label>
                  <Input
                    value={item.role}
                    onChange={e => updateField(index, 'role', e.target.value)}
                    placeholder="مدير شركة البناء"
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>نص الرأي *</Label>
                <Textarea
                  value={item.content}
                  onChange={e => updateField(index, 'content', e.target.value)}
                  placeholder="تجربة رائعة مع المكتب، التصميم احترافي والتسليم في الوقت المحدد..."
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>التقييم</Label>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => updateField(index, 'rating', star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-6 w-6 ${star <= item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 mr-2">{item.rating} / 5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        variant="outline"
        onClick={addItem}
        className="mt-4 w-full gap-2 border-dashed"
        disabled={items.length >= 20}
      >
        <Plus className="h-4 w-4" />
        إضافة رأي جديد
      </Button>
    </div>
  )
}
