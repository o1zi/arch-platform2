'use client'

interface DailyPoint { date: string; label: string; views: number; visitors: number }
interface TopProject { title: string; count: number }
interface TopReferrer { source: string; count: number }

interface Stats {
  views30: number; views7: number; viewsToday: number
  uniqueVisitors30: number
  waClicks30: number; phoneClicks30: number; emailClicks30: number
  mapsClicks30: number; socialClicks30: number
  contactPageViews30: number; projectViews30: number
  dailyData: DailyPoint[]
  topProjects: TopProject[]
  topReferrers: TopReferrer[]
  typeMap: Record<string, number>
}

const EVENT_LABELS: Record<string, string> = {
  page_view:          'مشاهدات الصفحات',
  contact_page_view:  'زيارات صفحة التواصل',
  whatsapp_click:     'نقرات واتساب',
  phone_click:        'نقرات الهاتف',
  email_click:        'نقرات البريد',
  maps_click:         'نقرات الخريطة',
  social_click:       'نقرات السوشيال',
  project_view:       'مشاهدات المشاريع',
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color?: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-3xl font-black ${color ?? 'text-gray-900'}`}>{value.toLocaleString('ar-SA')}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  )
}

function BarChart({ data }: { data: DailyPoint[] }) {
  const max = Math.max(...data.map(d => d.views), 1)
  return (
    <div className="flex items-end gap-1 h-36 pt-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
          {/* Tooltip */}
          <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
            <div className="bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
              {d.views} مشاهدة · {d.visitors} زائر
            </div>
          </div>
          <div
            className="w-full bg-gray-900 rounded-t-sm transition-all hover:bg-gray-700"
            style={{ height: `${Math.max((d.views / max) * 100, 2)}%` }}
          />
          <span className="text-[9px] text-gray-400 writing-mode-vertical"
            style={{ fontSize: '9px', transform: 'rotate(-45deg)', transformOrigin: 'center', lineHeight: 1 }}>
            {d.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function AnalyticsDashboard({ tenantName, stats }: { tenantName: string; stats: Stats }) {
  const totalClicks = stats.waClicks30 + stats.phoneClicks30 + stats.emailClicks30 + stats.mapsClicks30 + stats.socialClicks30

  const clicksData = [
    { label: 'واتساب',    value: stats.waClicks30,     color: '#25D366' },
    { label: 'هاتف',      value: stats.phoneClicks30,  color: '#3b82f6' },
    { label: 'بريد',      value: stats.emailClicks30,  color: '#8b5cf6' },
    { label: 'خريطة',     value: stats.mapsClicks30,   color: '#f59e0b' },
    { label: 'سوشيال',    value: stats.socialClicks30, color: '#ec4899' },
  ].filter(c => c.value > 0)

  return (
    <div className="p-6 max-w-6xl" dir="rtl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">التحليلات</h1>
        <p className="text-sm text-gray-400 mt-1">{tenantName} · آخر 30 يوم</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="مشاهدات اليوم"     value={stats.viewsToday}        color="text-gray-900" />
        <StatCard label="مشاهدات آخر 7 أيام" value={stats.views7}            color="text-gray-900" />
        <StatCard label="مشاهدات آخر 30 يوم" value={stats.views30}           color="text-gray-900" />
        <StatCard label="زوار فريدون (30 يوم)" value={stats.uniqueVisitors30} color="text-blue-600" sub="بناءً على الـ IP" />
      </div>

      {/* Interaction Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="نقرات واتساب"           value={stats.waClicks30}         color="text-green-600" />
        <StatCard label="نقرات الهاتف"            value={stats.phoneClicks30}      color="text-blue-600" />
        <StatCard label="زيارات صفحة التواصل"     value={stats.contactPageViews30} color="text-purple-600" />
        <StatCard label="مشاهدات المشاريع"        value={stats.projectViews30}     color="text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Daily Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">مشاهدات آخر 14 يوم</h3>
          <BarChart data={stats.dailyData} />
        </div>

        {/* Clicks Breakdown */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">توزيع النقرات</h3>
          {clicksData.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-8">لا توجد نقرات بعد</p>
          ) : (
            <div className="space-y-3">
              {clicksData.map(c => (
                <div key={c.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{c.label}</span>
                    <span className="font-bold text-gray-800">{c.value}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: totalClicks ? `${(c.value / totalClicks) * 100}%` : '0%',
                        backgroundColor: c.color,
                      }}
                    />
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-400 pt-2 border-t">إجمالي: {totalClicks} نقرة</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Top Projects */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">أكثر المشاريع مشاهدة</h3>
          {stats.topProjects.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">لا توجد بيانات</p>
          ) : (
            <div className="space-y-3">
              {stats.topProjects.map((p, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm text-gray-700 truncate">{p.title}</span>
                  <span className="text-xs font-bold text-gray-500">{p.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Referrers */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-gray-700 mb-4">مصادر الزيارات</h3>
          {stats.topReferrers.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">لا توجد بيانات — معظم الزوار مباشرون</p>
          ) : (
            <div className="space-y-3">
              {stats.topReferrers.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1 text-sm text-gray-700 truncate"
                    dir="ltr">{r.source || 'مباشر'}</div>
                  <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-600 rounded-full"
                      style={{ width: `${(r.count / (stats.topReferrers[0]?.count ?? 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-6 text-left">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Event Type Breakdown */}
      <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-gray-700 mb-4">تفاصيل جميع الأحداث (30 يوم)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(stats.typeMap)
            .sort((a, b) => b[1] - a[1])
            .map(([type, count]) => (
              <div key={type} className="bg-gray-50 rounded-lg p-3">
                <p className="text-[11px] text-gray-500">{EVENT_LABELS[type] ?? type}</p>
                <p className="text-xl font-black text-gray-800 mt-1">{count.toLocaleString('ar-SA')}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
