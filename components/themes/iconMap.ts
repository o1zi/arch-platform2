import {
  Building2, Layers, Eye, Lightbulb, MapPin, ClipboardList,
  Award, Users, Clock, Shield, Star, CheckCircle2,
  HardHat, Globe,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const ICON_MAP: Record<string, LucideIcon> = {
  Building2, Layers, Eye, Lightbulb, MapPin, ClipboardList,
  Award, Users, Clock, Shield, Star, CheckCircle2,
  HardHat, Globe,
}

export function resolveIcon(key: string | null | undefined): LucideIcon {
  if (!key) return Building2
  return ICON_MAP[key] ?? Building2
}
