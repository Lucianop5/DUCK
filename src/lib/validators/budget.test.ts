import { describe, expect, it } from "vitest";

import { monthRange } from "@/lib/validators/common";
import { budgetInputSchema } from "@/lib/validators/budget";

describe("budgetInputSchema", () => {
  it("acepta un presupuesto general sin categoría", () => {
    const result = budgetInputSchema.parse({
      year: 2026,
      month: 10,
      amount: 300000,
    });

    expect(result.categoryId).toBeNull();
  });

  it("normaliza categoryId ausente a null", () => {
    const result = budgetInputSchema.parse({
      year: "2026",
      month: "10",
      categoryId: undefined,
      amount: 50000,
    });

    expect(result.categoryId).toBeNull();
    expect(result.year).toBe(2026);
  });

  it("rechaza meses fuera de rango", () => {
    const result = budgetInputSchema.safeParse({
      year: 2026,
      month: 13,
      amount: 1000,
    });

    expect(result.success).toBe(false);
  });

  it("rechaza montos negativos", () => {
    const result = budgetInputSchema.safeParse({
      year: 2026,
      month: 1,
      amount: -1,
    });

    expect(result.success).toBe(false);
  });
});

describe("monthRange", () => {
  it("cubre el mes completo en UTC", () => {
    const { from, to } = monthRange(2026, 2);

    expect(from.toISOString()).toBe("2026-02-01T00:00:00.000Z");
    expect(to.toISOString()).toBe("2026-02-28T00:00:00.000Z");
  });

  it("considera los años bisiestos", () => {
    const { to } = monthRange(2028, 2);
    expect(to.toISOString()).toBe("2028-02-29T00:00:00.000Z");
  });
});
