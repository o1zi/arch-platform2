'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TenantFAQ } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2, Save } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
  tenantId: string
  initialFAQs: TenantFAQ[]
}

interface FAQForm {
  id?: string
  question: string
  answer: string
  is_active: boolean
  sort_order: number
  isNew?: boolean
}

export default function FAQManager({ tenantId, initialFAQs }: Props) {
  const supabase = createClient()
  const [items, setItems] = useState<FAQForm[]>(
    initialFAQs.map(f => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      is_active: f.is_active,
      sort_order: f.sort_order,
    }))
  )
  const [saving, setSaving] = useState(false)

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        question: '',
        answer: '',
        is_active: true,
        sort_order: prev.length,
        isNew: true,
      },
    ])
  }

  const removeItem = async (index: number) => {
    const item = items[index]
    if (item.id && !item.isNew) {
      await supabase.from('tenant_faqs').delete().eq('id', item.id)
      toast.success('تم الحذف')
    }
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateField = (index: number, field: keyof FAQForm, value: string | boolean) => {
    setItems(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  const saveAll = async () => {
    setSaving(true)
    try {
      for (let i = 0; i < items.length; i++) {
        const f = items[i]
        if (!f.question || !f.answer) continue
        const payload = {
          tenant_id: tenantId,
          question: f.question,
          answer: f.answer,
          is_active: f.is_active,
          sort_order: i,
        }
        if (f.id && !f.isNew) {
          await supabase.from('tenant_faqs').update(payload).eq('id', f.id)
        } else {
          const { data } = await supabase.from('tenant_faqs').insert(payload).select().single()
          if (data) {
            setItems(prev => prev.map((item, idx) => idx === i ? { ...item, id: data.id, isNew: false } : item))
          }
        }
      }
      toast.success('تم حفظ الأسئلة الشائعة بنجاح')
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
          <h1 className="text-2xl font-bold">الأسئلة الشائعة</h1>
          <p className="text-sm text-gray-500 mt-1">أضف الأسئلة التي يكثر طرحها من عملائك</p>
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
                <span>سؤال {index + 1}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.is_active}
                      onCheckedChange={v => updateField(index, 'is_active', v)}
                    />
                    <span className="text-xs text-gray-500">{item.is_active ? 'ظاهر' : 'مخفي'}</span>
                  </div>
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
              <div>
                <Label>السؤال *</Label>
                <Input
                  value={item.question}
                  onChange={e => updateField(index, 'question', e.target.value)}
                  placeholder="ما هي مدة تنفيذ المشاريع؟"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>الإجابة *</Label>
                <Textarea
                  value={item.answer}
                  onChange={e => updateField(index, 'answer', e.target.value)}
                  placeholder="تعتمد مدة التنفيذ على حجم المشروع وتعقيده..."
                  rows={3}
                  className="mt-1"
                />
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
        إضافة سؤال جديد
      </Button>
    </div>
  )
}
