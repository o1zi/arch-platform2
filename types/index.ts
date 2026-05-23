export type Theme = 'modern' | 'classic' | 'bold' | 'minimal' | 'luxury'
export type Plan = 'basic' | 'pro' | 'premium'
export type TenantUserRole = 'owner' | 'editor'

export interface Tenant {
  id: string
  name_ar: string
  name_en: string | null
  slug: string
  custom_domain: string | null
  logo_url: string | null
  cover_url: string | null
  bio_ar: string | null
  bio_en: string | null
  phone: string | null
  email: string | null
  address_ar: string | null
  address_en: string | null
  google_maps_url: string | null
  instagram_url: string | null
  twitter_url: string | null
  linkedin_url: string | null
  snapchat_url: string | null
  theme: Theme
  is_active: boolean
  plan: Plan
  subscription_start: string | null
  subscription_end: string | null
  created_at: string
  updated_at: string
}

export interface TenantUser {
  id: string
  tenant_id: string
  user_id: string
  role: TenantUserRole
  created_at: string
}

export interface Project {
  id: string
  tenant_id: string
  title_ar: string
  title_en: string | null
  description_ar: string | null
  description_en: string | null
  category: string | null
  location_ar: string | null
  year: number | null
  cover_image_url: string | null
  sort_order: number
  is_featured: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
  images?: ProjectImage[]
}

export interface ProjectImage {
  id: string
  project_id: string
  tenant_id: string
  url: string
  sort_order: number
  created_at: string
}

export interface AdminUser {
  id: string
  user_id: string
  created_at: string
}

export interface SubscriptionLog {
  id: string
  tenant_id: string
  action: 'activated' | 'renewed' | 'suspended' | 'cancelled'
  plan: Plan | null
  amount: number | null
  notes: string | null
  performed_by: string | null
  created_at: string
}

export interface ThemeProps {
  tenant: Tenant
  projects: Project[]
  featuredProjects: Project[]
}

export const PLAN_LIMITS = {
  basic: {
    projects: 10,
    storage_mb: 500,
    themes: ['modern'] as Theme[],
    custom_domain: false,
    price_sar: 1200,
  },
  pro: {
    projects: 30,
    storage_mb: 2048,
    themes: ['modern', 'classic', 'bold', 'minimal', 'luxury'] as Theme[],
    custom_domain: false,
    price_sar: 2000,
  },
  premium: {
    projects: Infinity,
    storage_mb: 10240,
    themes: ['modern', 'classic', 'bold', 'minimal', 'luxury'] as Theme[],
    custom_domain: true,
    price_sar: 3500,
  },
} as const
