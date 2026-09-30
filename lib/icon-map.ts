import {
  Leaf,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Cpu,
  Landmark,
  HandHeart,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Category (and other) icons are stored in mock/DB data as plain string
 * keys so the data layer never depends on React. Components resolve the
 * actual icon component through this map at render time.
 */
const iconMap: Record<string, LucideIcon> = {
  leaf: Leaf,
  "graduation-cap": GraduationCap,
  "heart-pulse": HeartPulse,
  briefcase: Briefcase,
  cpu: Cpu,
  landmark: Landmark,
  "hand-heart": HandHeart,
  trophy: Trophy,
  users: Users,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] ?? Users;
}
