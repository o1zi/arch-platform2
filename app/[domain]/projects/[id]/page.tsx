import { notFound } from 'next/navigation'
import { getTenantByIdentifier } from '@/lib/tenant'
import { createClient } from '@/lib/supabase/server'
import { Project, ProjectImage } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

export default async function ProjectDetailPage({ params }: { params: { domain: string; id: string } }) {
  const tenant = await getTenantByIdentifier(params.domain)
  if (!tenant) notFound()

  const supabase = await createClient()
  const { data: project } = await supabase
    .from('projects')
    .select('*, images:project_images(*)')
    .eq('id', params.id)
    .eq('tenant_id', tenant.id)
    .is('deleted_at', null)
    .single()

  if (!project) notFound()
  const p = project as Project & { images: ProjectImage[] }
  const images = (p.images ?? []).sort((a, b) => a.sort_order - b.sort_order)

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      {/* Cover */}
      {p.cover_image_url && (
        <div className="relative h-64 md:h-96 bg-gray-100">
          <Image src={p.cover_image_url} alt={p.title_ar} fill className="object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      <main className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/projects" className="text-gray-400 hover:text-gray-700 text-sm mb-6 block">← العودة للمشاريع</Link>

        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-3">
            {p.category && <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full">{p.category}</span>}
            {p.year && <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{p.year}</span>}
            {p.location_ar && <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{p.location_ar}</span>}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{p.title_ar}</h1>
          {p.title_en && <h2 className="text-xl text-gray-400 mt-1 font-light" dir="ltr">{p.title_en}</h2>}
        </div>

        {p.description_ar && (
          <p className="text-gray-600 leading-relaxed text-lg mb-12">{p.description_ar}</p>
        )}

        {/* Gallery */}
        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map(img => (
              <div key={img.id} className="aspect-[4/3] relative rounded-xl overflow-hidden bg-gray-100">
                <Image src={img.url} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
