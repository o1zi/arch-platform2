import { Tenant, CustomTheme } from '@/types'
import ModernContact from './modern/ContactPage'
import ClassicContact from './classic/ContactPage'
import BoldContact from './bold/ContactPage'
import MinimalContact from './minimal/ContactPage'
import LuxuryContact from './luxury/ContactPage'
import NebulaContact from './nebula/ContactPage'
import DynamicContactPage from './DynamicContactPage'

interface Props {
  tenant: Tenant
  customTheme?: CustomTheme | null
}

const renderers = {
  modern: ModernContact,
  classic: ClassicContact,
  bold: BoldContact,
  minimal: MinimalContact,
  luxury: LuxuryContact,
  nebula: NebulaContact,
}

export function ThemeContactRenderer({ tenant, customTheme }: Props) {
  // قالب مخصص مرفوع من الأدمن
  if (customTheme?.config) {
    return <DynamicContactPage tenant={tenant} config={customTheme.config} />
  }

  // قالب مدمج
  const Page = renderers[tenant.theme] ?? renderers.modern
  return <Page tenant={tenant} />
}
