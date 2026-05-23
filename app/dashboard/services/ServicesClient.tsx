'use client'

import { useState } from 'react'
import { ContentBlock } from '@/types'
import ContentBlocksManager from '@/components/dashboard/ContentBlocksManager'
import { cn } from '@/lib/utils'

interface Props {
  initialServices: ContentBlock[]
  initialFeatures: ContentBlock[]
}

export default function ServicesClient({ initialServices, initialFeatures }: Props) {
  const [tab, setTab] = useState<'services' | 'features'>('services')

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">الخدمات والمميزات</h1>
        <p className="text-gray-500 mt-1 text-sm">
          خصّص أقسام &quot;ما نقدمه لك&quot; و&quot;ما يميزنا&quot; التي تظهر في صفحة موقعك الرئيسية.
          إذا تركت القسم فارغاً سيظهر المحتوى الافتراضي.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit mb-6">
        <button
          onClick={() => setTab('services')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            tab === 'services' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          )}
        >
          ما نقدمه لك ({initialServices.length}/6)
        </button>
        <button
          onClick={() => setTab('features')}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            tab === 'features' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          )}
        >
          ما يميزنا ({initialFeatures.length}/6)
        </button>
      </div>

      {tab === 'services' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-1">الخدمات</h2>
          <p className="text-gray-400 text-xs mb-5">تظهر في قسم &quot;ما نقدمه لك&quot; — حد أقصى 6 خدمات</p>
          <ContentBlocksManager type="service" initialBlocks={initialServices} />
        </div>
      )}

      {tab === 'features' && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-1">المميزات</h2>
          <p className="text-gray-400 text-xs mb-5">تظهر في قسم &quot;ما يميزنا&quot; — حد أقصى 6 مميزات</p>
          <ContentBlocksManager type="feature" initialBlocks={initialFeatures} />
        </div>
      )}
    </div>
  )
}
