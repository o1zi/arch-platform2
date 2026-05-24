import { Tenant, Project, CustomTheme } from '@/types'
import ModernProjects from './modern/ProjectsPage'
import ClassicProjects from './classic/ProjectsPage'
import BoldProjects from './bold/ProjectsPage'
import MinimalProjects from './minimal/ProjectsPage'
import LuxuryProjects from './luxury/ProjectsPage'
import DynamicProjectsPage from './DynamicProjectsPage'

interface ThemeProjectsProps {
  tenant: Tenant
  projects: Project[]
  customTheme?: CustomTheme | null
}

const renderers = {
  modern: ModernProjects,
  classic: ClassicProjects,
  bold: BoldProjects,
  minimal: MinimalProjects,
  luxury: LuxuryProjects,
}

export function ThemeProjectsRenderer({ tenant, projects, customTheme }: ThemeProjectsProps) {
  // قالب مخصص مرفوع من الأدمن
  if (customTheme?.config) {
    return <DynamicProjectsPage tenant={tenant} projects={projects} config={customTheme.config} />
  }

  // قالب مدمج
  const Page = renderers[tenant.theme] ?? renderers.modern
  return <Page tenant={tenant} projects={projects} />
}
