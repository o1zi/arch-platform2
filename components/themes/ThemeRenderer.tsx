import { ThemeProps } from '@/types'
import ModernLayout from './modern/Layout'
import ClassicLayout from './classic/Layout'
import BoldLayout from './bold/Layout'
import MinimalLayout from './minimal/Layout'
import LuxuryLayout from './luxury/Layout'

const themes = {
  modern: ModernLayout,
  classic: ClassicLayout,
  bold: BoldLayout,
  minimal: MinimalLayout,
  luxury: LuxuryLayout,
}

export function ThemeRenderer({ tenant, projects, featuredProjects }: ThemeProps) {
  const Layout = themes[tenant.theme] ?? themes.modern
  return <Layout tenant={tenant} projects={projects} featuredProjects={featuredProjects} />
}
