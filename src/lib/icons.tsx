import {
  Baby,
  Banknote,
  BookOpen,
  BriefcaseBusiness,
  Bus,
  Car,
  Circle,
  Coffee,
  CreditCard,
  Dumbbell,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  Music,
  PawPrint,
  Phone,
  Pill,
  Plane,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Ticket,
  Tv,
  Utensils,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  baby: Baby,
  banknote: Banknote,
  "book-open": BookOpen,
  briefcase: BriefcaseBusiness,
  bus: Bus,
  car: Car,
  circle: Circle,
  coffee: Coffee,
  "credit-card": CreditCard,
  dumbbell: Dumbbell,
  fuel: Fuel,
  "gamepad-2": Gamepad2,
  gift: Gift,
  "graduation-cap": GraduationCap,
  "heart-pulse": HeartPulse,
  house: House,
  landmark: Landmark,
  music: Music,
  "paw-print": PawPrint,
  phone: Phone,
  pill: Pill,
  plane: Plane,
  receipt: ReceiptText,
  "shopping-bag": ShoppingBag,
  "shopping-cart": ShoppingCart,
  smartphone: Smartphone,
  sparkles: Sparkles,
  ticket: Ticket,
  tv: Tv,
  utensils: Utensils,
  wifi: Wifi,
  zap: Zap,
};

export const ICON_OPTIONS = Object.keys(ICONS);

export function CategoryIcon({
  name,
  className,
  strokeWidth = 1.8,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = ICONS[name] ?? Circle;
  return <Icon aria-hidden="true" className={className} strokeWidth={strokeWidth} />;
}
