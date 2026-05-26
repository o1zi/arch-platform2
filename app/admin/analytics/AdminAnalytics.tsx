'use client'

const EVENT_LABELS: Record<string, string> = {
  page_view:         'مشاهدات',
  contact_page_view: 'صفحة التواصل',
  whatsapp_click:    'واتساب',
  phone_click:       'هاتف',
  email_click:       'بريد',
  maps_click:        'خريطة',
  social_click:      'سوشيال',
  project_view:      'مشاريع',
}

const PLAN_COLOR: Record<string, string> = {
  basic:   'bg-gray-100 text-gray-600',
  pro:     'bg-blue-100 text-blue-700',
  premium: 'bg-amber-100 text-amber-700',
}

const PLAN_LABEL: Record<string, string> = {
  basic:   'أساسي',
  pro:     'برو',
  premium: 'بريميم',
}

interface DailyPoint { date: string; label: string; views: number }
interface TenantRow  { id: string; name: string; slug: string; plan: string; active: boolean; views: number; wa: number; unique: number; clicks: number }

interface Props {
  stats: {
    totalEvents30: number; totalEventsToday: number
    totalPageViews30: number; totalWaClicks30: number
    uniqueVisitors: number; totalTenants: number; activeTenants: number
    typeMap: Record<string, number>
    dailyData: DailyPoint[]
    tenantRows: TenantRow[]
    planDist: Record<string, number>
  }
}

function BigStat({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-3xl font-black ${color ?? 'text-gray-900'}`}>{value.toLocaleString('ar-SA')}</p>
    </div>
  )
}

function AdminBarChart({ data }: { data: DailyPoint[] }) {
  const max = Math.max(...data.map(d => d.views), 1)
  return (
    <div className="flex items-end gap-1 h-32">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          <div className="absolute bottom-full mb-1 hidden group-hover:flex z-10 pointer-events-none">
            <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
              {d.label}: {d.views}
            </div>
          </div>
          <div
            className="w-full bg-blue-600 rounded-t-sm hover:bg-blue-500 transition-colors"
            style={{ height: `${Math.max((d.views / max) * 100, 2)}%` }}
          />
          <span className="text-[9px] text-gray-400" style={{ fontSize: '9px' }}>
            {d.label.split(' ')[1] ?? ''}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function AdminAnalytics({ stats }: Props) {
  const totalClicks = Object.entries(stats.typeMap)
    .filter(([t]) => t !== 'page_view')
    .reduce((s, [, v]) => s + v, 0)

  return (
    <div className="p-6 max-w-7xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">تحليلات المنصة</h1>
        <p className="text-sm text-gray-400 mt-1">إحصائيات شاملة لجميع المكاتب · آخر 30 يوم</p>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <BigStat label="إجمالي المكاتب"        value={stats.totalTenants}    />
        <BigStat label="المكاتب النشطة"         value={stats.activeTenants}  color="text-green-600" />
        <BigStat label="مشاهدات اليوم"          value={stats.totalEventsToday} color="text-blue-600" />
        <BigStat label="مشاهدات آخر 30 يوم"     value={stats.totalPageViews30} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <BigStat label="زوار فريدون (30 يوم)"   value={stats.uniqueVisitors}  color="text-purple-600" />
        <BigStat label="نقرات واتساب (30 يوم)"  value={stats.totalWaClicks30} color="text-green-600" />
        <BigStat label="إجمالي الأحداث (30 يوم)" value={stats.totalEvents30}  />
        <BigStat label="نقرات تفاعلية (30 يوم)"  value={totalClicks}          color="text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Daily Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">مشاهدات الصفحات — آخر 14 يوم (كل المكاتب)</h3>
          <AdminBarChart data={stats.dailyData} />
        </div>

        {/* Event Types */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-4">توزيع الأحداث</h3>
          <div className="space-y-2">
            {Object.entries(stats.typeMap).sort((a, b) => b[1] - a[1]).map(([type, count]) => {
              const total = Object.values(stats.typeMap).reduce((s, v) => s + v, 0)
              return (
                <div key={type}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-gray-600">{EVENT_LABELS[type] ?? type}</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full">
                    <div className="h-full bg-blue-500 rounded-full"
                      style={{ width: total ? `${(count / total) * 100}%` : '0%' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Plan Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4">توزيع الباقات</h3>
        <div className="flex gap-6">
          {Object.entries(stats.planDist).map(([plan, count]) => (
            <div key={plan} className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${PLAN_COLOR[plan] ?? 'bg-gray-100 text-gray-600'}`}>
                {PLAN_LABEL[plan] ?? plan}
              </span>
              <span className="text-2xl font-black text-gray-800">{count}</span>
              <span className="text-xs text-gray-400">مكتب</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-700">ترتيب المكاتب حسب الزيارات (30 يوم)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">#</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">المكتب</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">الباقة</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">الحالة</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">مشاهدات</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">زوار فريدون</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">واتساب</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-gray-500">نقرات أخرى</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.tenantRows.map((t, i) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 font-bold">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-400" dir="ltr">{t.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${PLAN_COLOR[t.plan] ?? ''}`}>
                      {PLAN_LABEL[t.plan] ?? t.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`w-2 h-2 rounded-full inline-block mr-1 ${t.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-xs text-gray-500">{t.active ? 'نشط' : 'موقوف'}</span>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-800">{t.views.toLocaleString('ar-SA')}</td>
                  <td className="px-4 py-3 text-gray-600">{t.unique}</td>
                  <td className="px-4 py-3 font-bold text-green-600">{t.wa}</td>
                  <td className="px-4 py-3 text-gray-600">{t.clicks}</td>
                </tr>
              ))}
              {stats.tenantRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                    لا توجد بيانات تحليلات بعد
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
