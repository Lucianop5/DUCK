import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api/http";
import { upsertBudget, listBudgets, deleteBudget } from "@/lib/services/budgets";
import { createDefaultCategories } from "@/lib/services/categories";
import {
  createExpense,
  deleteExpense,
  getExpense,
  listExpenses,
  updateExpense,
} from "@/lib/services/expenses";

const enabled = process.env.RUN_INTEGRATION === "1";
const tag = `it-${Date.now()}`;

const listQuery = { page: 1, perPage: 20, sort: "date_desc" as const };

describe.skipIf(!enabled)("aislamiento entre usuarios", () => {
  let userA: { id: string; email: string };
  let userB: { id: string; email: string };
  let categoryA: { id: string };
  let categoryB: { id: string };
  let expenseA: { id: string };
  let expenseB: { id: string };
  let budgetB: { id: string };

  beforeAll(async () => {
    userA = await prisma.user.create({
      data: { name: "Usuario A", email: `${tag}-a@example.com` },
    });
    userB = await prisma.user.create({
      data: { name: "Usuario B", email: `${tag}-b@example.com` },
    });

    await createDefaultCategories(userA.id);
    await createDefaultCategories(userB.id);

    categoryA = await prisma.category.findFirstOrThrow({
      where: { userId: userA.id },
      orderBy: { name: "asc" },
      select: { id: true },
    });
    categoryB = await prisma.category.findFirstOrThrow({
      where: { userId: userB.id },
      orderBy: { name: "asc" },
      select: { id: true },
    });

    expenseA = await createExpense(userA.id, {
      amount: 1500,
      description: "Gasto de A",
      date: "2026-10-05",
      categoryId: categoryA.id,
      paymentMethod: "CASH",
    });
    expenseB = await createExpense(userB.id, {
      amount: 2500,
      description: "Gasto de B",
      date: "2026-10-06",
      categoryId: categoryB.id,
      paymentMethod: "DEBIT",
    });

    budgetB = await upsertBudget(userB.id, {
      year: 2026,
      month: 10,
      categoryId: null,
      amount: 100000,
    });
  });

  afterAll(async () => {
    const userIds = [userA.id, userB.id];

    // MySQL no garantiza el orden de los borrados en cascada: si elimina
    // `category` antes que `expense`, la FK RESTRICT falla. Se borra en orden.
    await prisma.expense.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.budget.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.category.deleteMany({ where: { userId: { in: userIds } } });
    await prisma.user.deleteMany({ where: { id: { in: userIds } } });
    await prisma.$disconnect();
  });

  it("no permite leer un gasto ajeno", async () => {
    await expect(getExpense(userA.id, expenseB.id)).rejects.toMatchObject({
      status: 404,
    } satisfies Partial<ApiError>);
  });

  it("no lista gastos de otro usuario", async () => {
    const { items } = await listExpenses(userA.id, listQuery);

    expect(items.map((item) => item.id)).toContain(expenseA.id);
    expect(items.map((item) => item.id)).not.toContain(expenseB.id);
  });

  it("no permite actualizar un gasto ajeno", async () => {
    await expect(
      updateExpense(userA.id, expenseB.id, { amount: 1 }),
    ).rejects.toMatchObject({ status: 404 });

    const untouched = await prisma.expense.findUniqueOrThrow({
      where: { id: expenseB.id },
    });
    expect(Number(untouched.amount)).toBe(2500);
  });

  it("no permite eliminar un gasto ajeno", async () => {
    await expect(deleteExpense(userA.id, expenseB.id)).rejects.toMatchObject({
      status: 404,
    });

    expect(
      await prisma.expense.count({ where: { id: expenseB.id } }),
    ).toBe(1);
  });

  it("no permite usar una categoría ajena al crear un gasto", async () => {
    await expect(
      createExpense(userA.id, {
        amount: 900,
        description: "Categoría ajena",
        date: "2026-10-07",
        categoryId: categoryB.id,
        paymentMethod: "CASH",
      }),
    ).rejects.toMatchObject({ status: 404 });
  });

  it("no mezcla presupuestos entre usuarios", async () => {
    const budgetsA = await listBudgets(userA.id, { year: 2026, month: 10 });
    expect(budgetsA).toHaveLength(0);

    const budgetsB = await listBudgets(userB.id, { year: 2026, month: 10 });
    expect(budgetsB.map((budget) => budget.id)).toContain(budgetB.id);
  });

  it("no permite eliminar un presupuesto ajeno", async () => {
    await expect(deleteBudget(userA.id, budgetB.id)).rejects.toMatchObject({
      status: 404,
    });
  });

  it("calcula gastado y estado del presupuesto general", async () => {
    const [budget] = await listBudgets(userB.id, { year: 2026, month: 10 });

    expect(budget.spent).toBe(2500);
    expect(budget.remaining).toBe(97500);
    expect(budget.status).toBe("ok");
  });

  it("impide dos presupuestos generales para el mismo período", async () => {
    const data = {
      userId: userB.id,
      year: 2026,
      month: 11,
      categoryId: null,
      amount: 50000,
    };

    await prisma.budget.create({ data });

    await expect(
      prisma.budget.create({ data: { ...data, amount: 60000 } }),
    ).rejects.toMatchObject({ code: "P2002" });
  });
});
