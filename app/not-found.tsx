import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6" dir="rtl">
      <div className="text-center">
        <p className="text-white/10 text-[12rem] font-black leading-none select-none">404</p>
        <h1 className="text-4xl font-black text-white -mt-8 mb-4">الصفحة غير موجودة</h1>
        <p className="text-white/40 mb-10 max-w-md mx-auto leading-relaxed">
          الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link href="/" className="inline-block bg-white text-black px-10 py-3 font-bold hover:bg-white/90 transition-colors">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  )
}
