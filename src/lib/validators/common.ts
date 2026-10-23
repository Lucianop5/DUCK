import { z } from "zod";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const uuidSchema = z
  .string()
  .regex(UUID_PATTERN, "Identificador inválido");

export const isoDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Usa el formato AAAA-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
  }, "La fecha no existe en el calendario");

/** Monto en CLP con hasta dos decimales. El máximo evita desbordes al serializar. */
export const amountSchema = z
  .number({ error: "El monto debe ser un número" })
  .positive("El monto debe ser mayor que cero")
  .max(9_999_999_999.99, "El monto excede el máximo permitido")
  .refine(
    (value) => Math.abs(value * 100 - Math.round(value * 100)) < 1e-9,
    "El monto admite como máximo dos decimales",
  );

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

export const yearSchema = z.coerce
  .number()
  .int()
  .min(2000, "El año mínimo es 2000")
  .max(2100, "El año máximo es 2100");

export const monthSchema = z.coerce
  .number()
  .int()
  .min(1, "El mes va de 1 a 12")
  .max(12, "El mes va de 1 a 12");

/** Convierte una fecha AAAA-MM-DD en el Date UTC que Prisma guarda en una columna DATE. */
export function toDatabaseDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

/** Primer y último día de un mes, como fechas UTC aptas para comparar columnas DATE. */
export function monthRange(year: number, month: number) {
  return {
    from: new Date(Date.UTC(year, month - 1, 1)),
    to: new Date(Date.UTC(year, month, 0)),
  };
}
