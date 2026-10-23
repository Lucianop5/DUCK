import { zodResolver } from "@hookform/resolvers/zod";
import { describe, expect, it } from "vitest";

import { expenseInputSchema } from "@/lib/validators/expense";

const validExpense = {
  amount: 2500,
  description: "  Café  ",
  date: "2026-10-23",
  categoryId: "3f1d3c1e-8a4d-4c2b-9f6a-1b2c3d4e5f60",
};

const options = {
  fields: {},
  shouldUseNativeValidation: false,
  criteriaMode: "all" as const,
};

describe("compatibilidad de resolvers con React Hook Form y Zod", () => {
  it.each(["async", "sync"] as const)(
    "aplica las transformaciones y valores por defecto en modo %s",
    async (mode) => {
      const resolve = zodResolver(expenseInputSchema, undefined, { mode });
      const result = await resolve(validExpense, undefined, options);

      expect(result.errors).toEqual({});
      expect(result.values).toEqual({
        ...validExpense,
        description: "Café",
        paymentMethod: "CASH",
      });
    },
  );

  it.each(["async", "sync"] as const)(
    "devuelve errores por campo sin lanzar una excepción en modo %s",
    async (mode) => {
      const resolve = zodResolver(expenseInputSchema, undefined, { mode });
      const result = await resolve(
        { ...validExpense, amount: 0, description: "   ", date: "2026-02-30" },
        undefined,
        options,
      );

      expect(result.values).toEqual({});
      expect(result.errors).toMatchObject({
        amount: { message: expect.any(String) },
        description: { message: expect.any(String) },
        date: { message: expect.any(String) },
      });
    },
  );

  it("conserva los valores originales cuando raw está habilitado", async () => {
    const resolve = zodResolver(expenseInputSchema, undefined, { raw: true });
    const result = await resolve(validExpense, undefined, options);

    expect(result.errors).toEqual({});
    expect(result.values).toEqual(validExpense);
  });
});
