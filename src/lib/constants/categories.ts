/**
 * Categorías que recibe cada usuario al registrarse.
 * Los nombres y colores están en español porque son datos visibles;
 * los identificadores de iconos corresponden a Lucide.
 */
export type DefaultCategory = {
  name: string;
  color: string;
  icon: string;
};

export const DEFAULT_CATEGORIES: readonly DefaultCategory[] = [
  { name: "Alimentación", color: "#F97316", icon: "utensils" },
  { name: "Transporte", color: "#3B82F6", icon: "bus" },
  { name: "Vivienda", color: "#8B5CF6", icon: "house" },
  { name: "Servicios", color: "#06B6D4", icon: "zap" },
  { name: "Ocio", color: "#EC4899", icon: "gamepad-2" },
  { name: "Salud", color: "#EF4444", icon: "heart-pulse" },
  { name: "Educación", color: "#10B981", icon: "graduation-cap" },
  { name: "Compras", color: "#EAB308", icon: "shopping-bag" },
  { name: "Otros", color: "#64748B", icon: "circle" },
] as const;

export const PAYMENT_METHODS = [
  "CASH",
  "DEBIT",
  "CREDIT",
  "TRANSFER",
  "WALLET",
  "OTHER",
] as const;

export type PaymentMethodValue = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethodValue, string> = {
  CASH: "Efectivo",
  DEBIT: "Débito",
  CREDIT: "Crédito",
  TRANSFER: "Transferencia",
  WALLET: "Billetera digital",
  OTHER: "Otro",
};
