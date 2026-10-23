import { describe, expect, it } from "vitest";

import { expenseInputSchema, expenseQuerySchema } from "@/lib/validators/expense";

const VALID_CATEGORY = "3f1d3c1e-8a4d-4c2b-9f6a-1b2c3d4e5f60";

describe("expenseInputSchema", () => {
  it("acepta un gasto válido en CLP", () => {
    const result = expenseInputSchema.parse({
      amount: 4990,
      description: "Café con leche",
      date: "2026-10-23",
      categoryId: VALID_CATEGORY,
      paymentMethod: "DEBIT",
    });

    expect(result.amount).toBe(4990);
    expect(result.paymentMethod).toBe("DEBIT");
  });

  it("aplica efectivo por defecto", () => {
    const result = expenseInputSchema.parse({
      amount: 1000,
      description: "Micro",
      date: "2026-10-01",
      categoryId: VALID_CATEGORY,
    });

    expect(result.paymentMethod).toBe("CASH");
  });

  it("rechaza montos no positivos", () => {
    const result = expenseInputSchema.safeParse({
      amount: 0,
      description: "Nada",
      date: "2026-10-01",
      categoryId: VALID_CATEGORY,
    });

    expect(result.success).toBe(false);
  });

  it("rechaza más de dos decimales", () => {
    const result = expenseInputSchema.safeParse({
      amount: 10.999,
      description: "Tres decimales",
      date: "2026-10-01",
      categoryId: VALID_CATEGORY,
    });

    expect(result.success).toBe(false);
  });

  it("rechaza fechas inexistentes", () => {
    const result = expenseInputSchema.safeParse({
      amount: 1000,
      description: "Fecha mala",
      date: "2026-02-30",
      categoryId: VALID_CATEGORY,
    });

    expect(result.success).toBe(false);
  });

  it("rechaza una descripción vacía después de recortar espacios", () => {
    const result = expenseInputSchema.safeParse({
      amount: 1000,
      description: "   ",
      date: "2026-10-01",
      categoryId: VALID_CATEGORY,
    });

    expect(result.success).toBe(false);
  });
});

describe("expenseQuerySchema", () => {
  it("convierte la paginación desde la URL", () => {
    const result = expenseQuerySchema.parse({ page: "2", perPage: "50" });
    expect(result.page).toBe(2);
    expect(result.perPage).toBe(50);
    expect(result.sort).toBe("date_desc");
  });

  it("rechaza un rango de fechas invertido", () => {
    const result = expenseQuerySchema.safeParse({
      from: "2026-10-31",
      to: "2026-10-01",
    });

    expect(result.success).toBe(false);
  });

  it("limita el tamaño de página a 100", () => {
    const result = expenseQuerySchema.safeParse({ perPage: "101" });
    expect(result.success).toBe(false);
  });
});
