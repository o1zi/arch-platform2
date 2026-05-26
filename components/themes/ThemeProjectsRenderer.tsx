import { Tenant, Project, CustomTheme } from '@/types'
import { SectorConfig, getSectorConfig } from '@/lib/sectors'
import ModernProjects from './modern/ProjectsPage'
import ClassicProjects from './classic/ProjectsPage'
import BoldProjects from './bold/ProjectsPage'
import MinimalProjects from './minimal/ProjectsPage'
import LuxuryProjects from './luxury/ProjectsPage'
import NebulaProjects from './nebula/ProjectsPage'
import DynamicProjectsPage from './DynamicProjectsPage'

interface ThemeProjectsProps {
  tenant: Tenant
  projects: Project[]
  customTheme?: CustomTheme | null
  sectorConfig?: SectorConfig
}

const renderers = {
  modern: ModernProjects,
  classic: ClassicProjects,
  bold: BoldProjects,
  minimal: MinimalProjects,
  luxury: LuxuryProjects,
  nebula: NebulaProjects,
}

export function ThemeProjectsRenderer({ tenant, projects, customTheme, sectorConfig }: ThemeProjectsProps) {
  const resolvedSectorConfig = sectorConfig ?? getSectorConfig(tenant.sector)

  // قالب مخصص مرفوع من الأدمن
  if (customTheme?.config) {
    return <DynamicProjectsPage tenant={tenant} projects={projects} config={customTheme.config} sectorConfig={resolvedSectorConfig} />
  }

  // قالب مدمج
  const Page = renderers[tenant.theme] ?? renderers.modern
  return <Page tenant={tenant} projects={projects} sectorConfig={resolvedSectorConfig} />
}
