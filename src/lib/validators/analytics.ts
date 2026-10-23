import { z } from "zod";

import {
  monthSchema,
  uuidSchema,
  yearSchema,
} from "@/lib/validators/common";

/** Período opcional: si falta, el servicio usa el mes actual del usuario. */
export const analyticsQuerySchema = z.object({
  year: yearSchema.optional(),
  month: monthSchema.optional(),
});

export const simulatorBasisSchema = z
  .enum(["last_months", "selected_month"])
  .default("last_months");

export const simulatorInputSchema = z.object({
  year: yearSchema.optional(),
  month: monthSchema.optional(),
  months: z.coerce
    .number()
    .int()
    .min(1, "Simula al menos un mes")
    .max(24, "El máximo es 24 meses")
    .default(12),
  basis: simulatorBasisSchema,
  extraMonthly: z
    .number({ error: "El monto extra debe ser un número" })
    .min(0, "El monto extra no puede ser negativo")
    .max(9_999_999_999.99, "El monto extra excede el máximo permitido")
    .default(0),
  adjustments: z
    .array(
      z.object({
        categoryId: uuidSchema,
        percent: z
          .number({ error: "El ajuste debe ser un número" })
          .min(-100, "El ajuste mínimo es -100 %")
          .max(500, "El ajuste máximo es 500 %"),
      }),
    )
    .max(50, "Puedes ajustar hasta 50 categorías")
    .default([]),
});

export type AnalyticsQuery = z.infer<typeof analyticsQuerySchema>;
export type SimulatorInput = z.infer<typeof simulatorInputSchema>;
