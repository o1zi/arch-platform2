export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">جاري التحميل...</p>
      </div>
    </div>
  )
}
