import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import {
  getMonthAnalytics,
  getSummary,
  getYearOverview,
  simulate,
} from "@/lib/services/analytics";
import { upsertBudget } from "@/lib/services/budgets";
import { createDefaultCategories } from "@/lib/services/categories";
import { createExpense } from "@/lib/services/expenses";

const enabled = process.env.RUN_INTEGRATION === "1";
const tag = `an-${Date.now()}`;
const user = { timezone: "America/Santiago" };

describe.skipIf(!enabled)("analítica, resumen y simulador", () => {
  let userA: { id: string };
  let userB: { id: string };
  let foodId: string;
  let transportId: string;

  beforeAll(async () => {
    userA = await prisma.user.create({
      data: { name: "Analítica A", email: `${tag}-a@example.com` },
    });
    userB = await prisma.user.create({
      data: { name: "Analítica B", email: `${tag}-b@example.com` },
    });

    await createDefaultCategories(userA.id);
    await createDefaultCategories(userB.id);

    const categories = await prisma.category.findMany({
      where: { userId: userA.id, name: { in: ["Alimentación", "Transporte"] } },
      select: { id: true, name: true },
    });
    foodId = categories.find((category) => category.name === "Alimentación")!.id;
    transportId = categories.find((category) => category.name === "Transporte")!.id;

    await createExpense(userA.id, {
      amount: 1000,
      description: "Café",
      date: "2026-10-01",
      categoryId: foodId,
      paymentMethod: "CASH",
    });
    await createExpense(userA.id, {
      amount: 2000,
      description: "Café",
      date: "2026-10-01",
      categoryId: foodId,
      paymentMethod: "DEBIT",
    });
    await createExpense(userA.id, {
      amount: 4000,
      description: "Micro",
      date: "2026-10-15",
      categoryId: transportId,
      paymentMethod: "DEBIT",
    });
    await createExpense(userA.id, {
      amount: 3000,
      description: "Café",
      date: "2026-09-10",
      categoryId: foodId,
      paymentMethod: "CASH",
    });

    await upsertBudget(userA.id, {
      year: 2026,
      month: 10,
      categoryId: null,
      amount: 10000,
    });
  });

  afterAll(async () => {
    const userIds = [userA.id, userB.id];
    await prisma.expense.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.budget.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.category.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it("agrega el mes por categoría, día y comparación", async () => {
    const analytics = await getMonthAnalytics(userA.id, user, {
      year: 2026,
      month: 10,
    });

    expect(analytics.total).toBe(7000);
    expect(analytics.count).toBe(3);
    expect(analytics.largest).toBe(4000);
    expect(analytics.byCategory.map((row) => row.name)).toEqual([
      "Transporte",
      "Alimentación",
    ]);
    expect(analytics.byCategory[1].total).toBe(3000);
    expect(analytics.byCategory[1].percentage).toBe(42.9);

    expect(analytics.daily[0]).toMatchObject({ day: 1, total: 3000, cumulative: 3000 });
    expect(analytics.daily[14]).toMatchObject({ day: 15, total: 4000, cumulative: 7000 });
    expect(analytics.daily[30].cumulative).toBe(7000);

    expect(analytics.frequent[0]).toMatchObject({
      description: "Café",
      count: 2,
      total: 3000,
      average: 1500,
    });

    expect(analytics.previous.total).toBe(3000);
    expect(analytics.previous.difference).toBe(4000);
    expect(analytics.previous.variationPercentage).toBe(133.3);

    expect(analytics.generalBudget).toMatchObject({
      amount: 10000,
      spent: 7000,
      percentage: 70,
      status: "ok",
    });
  });

  it("entrega un resumen estable para LifeDashboard", async () => {
    const summary = await getSummary(userA.id, user, { year: 2026, month: 10 });

    expect(summary.period).toMatchObject({ year: 2026, month: 10, label: "octubre de 2026" });
    expect(summary.totalSpent).toBe(7000);
    expect(summary.expenseCount).toBe(3);
    expect(summary.averagePerExpense).toBe(2333.33);
    expect(summary.budget).toMatchObject({ amount: 10000, remaining: 3000 });
    expect(summary.categories).toHaveLength(2);
    expect(Number.isNaN(Date.parse(summary.generatedAt))).toBe(false);
  });

  it("agrega el año por mes y categoría", async () => {
    const overview = await getYearOverview(userA.id, 2026);

    expect(overview.total).toBe(10000);
    expect(overview.count).toBe(4);
    expect(overview.months[8]).toMatchObject({ month: 9, total: 3000, count: 1 });
    expect(overview.months[9]).toMatchObject({ month: 10, total: 7000, count: 3 });
    expect(overview.bestMonth?.month).toBe(9);
    expect(overview.worstMonth?.month).toBe(10);
    expect(overview.byCategory.find((row) => row.name === "Alimentación")?.total).toBe(6000);
  });

  it("proyecta con base del mes elegido y ajustes por categoría", async () => {
    const result = await simulate(userA.id, user, {
      year: 2026,
      month: 10,
      months: 12,
      basis: "selected_month",
      extraMonthly: 500,
      adjustments: [{ categoryId: foodId, percent: 50 }],
    });

    expect(result.baseMonthly).toBe(7000);
    expect(result.totalBase).toBe(84000);
    expect(result.totalProjected).toBe(108000);
    expect(result.difference).toBe(24000);
    expect(result.differencePercentage).toBe(28.6);
    expect(result.monthly[0]).toMatchObject({ year: 2026, month: 10, projected: 9000 });
    expect(result.monthly[11]).toMatchObject({ year: 2027, month: 9, projected: 9000 });
    expect(
      result.byCategory.find((row) => row.name === "Alimentación"),
    ).toMatchObject({ base: 3000, adjustmentPercent: 50, projected: 4500 });
  });

  it("no filtra datos de otra cuenta", async () => {
    const analytics = await getMonthAnalytics(userB.id, user, {
      year: 2026,
      month: 10,
    });

    expect(analytics.total).toBe(0);
    expect(analytics.byCategory).toHaveLength(0);
    expect(analytics.previous.total).toBe(0);
    expect(analytics.generalBudget).toBeNull();

    const simulated = await simulate(userB.id, user, {
      year: 2026,
      month: 10,
      months: 1,
      basis: "selected_month",
      extraMonthly: 0,
      adjustments: [],
    });
    expect(simulated.baseMonthly).toBe(0);
    expect(simulated.totalProjected).toBe(0);
  });
});
