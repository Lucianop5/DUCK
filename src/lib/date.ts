/** Utilidades de fecha, período y formato para la interfaz en español de Chile. */

export const MONTHS_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

export const MONTHS_SHORT_ES = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
] as const;

export const WEEKDAYS_ES = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"] as const;

export type Period = { year: number; month: number };

export function monthLabel(year: number, month: number): string {
  return `${MONTHS_ES[month - 1]} de ${year}`;
}

export function monthShortLabel(year: number, month: number): string {
  return `${MONTHS_SHORT_ES[month - 1]} ${String(year).slice(2)}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function addMonths(period: Period, delta: number): Period {
  const date = new Date(Date.UTC(period.year, period.month - 1 + delta, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
}

export function lastNMonths(end: Period, count: number): Period[] {
  return Array.from({ length: count }, (_, index) =>
    addMonths(end, index - (count - 1)),
  );
}

export function currentPeriod(timeZone = "America/Santiago"): Period {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  return { year, month };
}

/** Fecha de hoy en la zona del usuario, como AAAA-MM-DD. */
export function todayInTimeZone(timeZone = "America/Santiago"): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** Convierte un Date de Prisma (columna DATE) en AAAA-MM-DD sin corrimiento. */
export function toIsoDate(value: Date | string): string {
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

export function formatDateShort(value: Date | string): string {
  const iso = toIsoDate(value);
  const [, month, day] = iso.split("-").map(Number);
  return `${day} ${MONTHS_SHORT_ES[month - 1]}`;
}

export function formatDateLong(value: Date | string): string {
  const iso = toIsoDate(value);
  const [year, month, day] = iso.split("-").map(Number);
  return `${day} de ${MONTHS_ES[month - 1]} de ${year}`;
}

export function formatCLP(value: number | string): string {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  })
    .format(Number.isFinite(amount) ? amount : 0)
    .replace(/\u00a0/g, " ");
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-CL").format(value);
}

export function formatPercent(value: number, digits = 0): string {
  return `${new Intl.NumberFormat("es-CL", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)} %`;
}

export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function roundOne(value: number): number {
  return Math.round((value + Number.EPSILON) * 10) / 10;
}
