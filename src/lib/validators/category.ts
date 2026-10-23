import { z } from "zod";

export const categoryInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(40, "El nombre admite hasta 40 caracteres"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "El color debe ser hexadecimal, por ejemplo #22C55E"),
  icon: z
    .string()
    .trim()
    .min(1, "Elige un icono")
    .max(40, "El icono admite hasta 40 caracteres")
    .default("circle"),
});

export const categoryUpdateSchema = categoryInputSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  "Envia al menos un campo para actualizar",
);

export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>;
