import { ThemeProps } from '@/types'
import { getSectorConfig } from '@/lib/sectors'
import ModernLayout from './modern/Layout'
import ClassicLayout from './classic/Layout'
import BoldLayout from './bold/Layout'
import MinimalLayout from './minimal/Layout'
import LuxuryLayout from './luxury/Layout'
import DynamicThemeEngine from './DynamicThemeEngine'

const builtInThemes = {
  modern: ModernLayout,
  classic: ClassicLayout,
  bold: BoldLayout,
  minimal: MinimalLayout,
  luxury: LuxuryLayout,
}

export function ThemeRenderer({ tenant, projects, featuredProjects, services, features, customTheme, sectorConfig }: ThemeProps) {
  const resolvedSectorConfig = sectorConfig ?? getSectorConfig(tenant.sector)

  // إذا كان للمكتب قالب مخصص مرفوع من الأدمن → استخدمه
  if (customTheme?.config) {
    return (
      <DynamicThemeEngine
        config={customTheme.config}
        tenant={tenant}
        projects={projects}
        featuredProjects={featuredProjects}
        services={services}
        features={features}
        sectorConfig={resolvedSectorConfig}
      />
    )
  }

  // وإلا استخدم أحد القوالب المدمجة الخمسة
  const Layout = builtInThemes[tenant.theme] ?? builtInThemes.modern
  return (
    <Layout
      tenant={tenant}
      projects={projects}
      featuredProjects={featuredProjects}
      services={services}
      features={features}
      sectorConfig={resolvedSectorConfig}
    />
  )
}
