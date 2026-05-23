import { Tenant } from '@/types'
import ModernContact from './modern/ContactPage'
import ClassicContact from './classic/ContactPage'
import BoldContact from './bold/ContactPage'
import MinimalContact from './minimal/ContactPage'
import LuxuryContact from './luxury/ContactPage'

const renderers = {
  modern: ModernContact,
  classic: ClassicContact,
  bold: BoldContact,
  minimal: MinimalContact,
  luxury: LuxuryContact,
}

export function ThemeContactRenderer({ tenant }: { tenant: Tenant }) {
  const Page = renderers[tenant.theme] ?? renderers.modern
  return <Page tenant={tenant} />
}
