import { z } from "zod";

import {
  amountSchema,
  monthSchema,
  uuidSchema,
  yearSchema,
} from "@/lib/validators/common";

export const budgetInputSchema = z.object({
  year: yearSchema,
  month: monthSchema,
  categoryId: uuidSchema.nullish().transform((value) => value ?? null),
  amount: amountSchema,
});

export const budgetQuerySchema = z.object({
  year: yearSchema,
  month: monthSchema,
});

export const budgetUpdateSchema = z
  .object({ amount: amountSchema })
  .refine((value) => Object.keys(value).length > 0, "Envia el nuevo monto");

export type BudgetInput = z.infer<typeof budgetInputSchema>;
export type BudgetQuery = z.infer<typeof budgetQuerySchema>;
