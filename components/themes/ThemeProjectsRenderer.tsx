import { Tenant, Project } from '@/types'
import ModernProjects from './modern/ProjectsPage'
import ClassicProjects from './classic/ProjectsPage'
import BoldProjects from './bold/ProjectsPage'
import MinimalProjects from './minimal/ProjectsPage'
import LuxuryProjects from './luxury/ProjectsPage'

interface ThemeProjectsProps {
  tenant: Tenant
  projects: Project[]
}

const renderers = {
  modern: ModernProjects,
  classic: ClassicProjects,
  bold: BoldProjects,
  minimal: MinimalProjects,
  luxury: LuxuryProjects,
}

export function ThemeProjectsRenderer({ tenant, projects }: ThemeProjectsProps) {
  const Page = renderers[tenant.theme] ?? renderers.modern
  return <Page tenant={tenant} projects={projects} />
}
