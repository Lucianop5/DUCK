import { z } from "zod";

import { PAYMENT_METHODS } from "@/lib/constants/categories";
import {
  amountSchema,
  isoDateSchema,
  paginationSchema,
  uuidSchema,
} from "@/lib/validators/common";

export const expenseInputSchema = z.object({
  amount: amountSchema,
  description: z
    .string()
    .trim()
    .min(2, "La descripción debe tener al menos 2 caracteres")
    .max(160, "La descripción admite hasta 160 caracteres"),
  date: isoDateSchema,
  categoryId: uuidSchema,
  paymentMethod: z.enum(PAYMENT_METHODS).default("CASH"),
});

export const expenseUpdateSchema = expenseInputSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "Envia al menos un campo para actualizar",
);

export const expenseSortSchema = z
  .enum(["date_desc", "date_asc", "amount_desc", "amount_asc"])
  .default("date_desc");

export const expenseQuerySchema = paginationSchema
  .extend({
    from: isoDateSchema.optional(),
    to: isoDateSchema.optional(),
    categoryId: uuidSchema.optional(),
    paymentMethod: z.enum(PAYMENT_METHODS).optional(),
    q: z.string().trim().max(80, "La búsqueda admite hasta 80 caracteres").optional(),
    sort: expenseSortSchema,
  })
  .refine(
    (value) => !value.from || !value.to || value.from <= value.to,
    { message: "La fecha inicial no puede ser posterior a la final", path: ["from"] },
  );

export type ExpenseInput = z.infer<typeof expenseInputSchema>;
export type ExpenseUpdateInput = z.infer<typeof expenseUpdateSchema>;
export type ExpenseQuery = z.infer<typeof expenseQuerySchema>;
