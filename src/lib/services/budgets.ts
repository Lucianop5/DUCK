import { Prisma } from "@/generated/prisma/client";

import { ApiError } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import { monthRange } from "@/lib/validators/common";
import type { BudgetInput, BudgetQuery } from "@/lib/validators/budget";

const budgetInclude = {
  category: { select: { id: true, name: true, color: true, icon: true } },
} satisfies Prisma.BudgetInclude;

export type BudgetStatus = "ok" | "warning" | "exceeded";

export type BudgetSummary = {
  id: string;
  categoryId: string | null;
  category: { id: string; name: string; color: string; icon: string } | null;
  year: number;
  month: number;
  amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: BudgetStatus;
};

export async function listBudgets(
  userId: string,
  query: BudgetQuery,
): Promise<BudgetSummary[]> {
  const { from, to } = monthRange(query.year, query.month);

  const [budgets, grouped, total] = await prisma.$transaction([
    prisma.budget.findMany({
      where: { userId, year: query.year, month: query.month },
      include: budgetInclude,
      orderBy: [{ categoryId: "asc" }],
    }),
    prisma.expense.groupBy({
      by: ["categoryId"],
      where: { userId, date: { gte: from, lte: to } },
      orderBy: { categoryId: "asc" },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { userId, date: { gte: from, lte: to } },
      _sum: { amount: true },
    }),
  ]);

  const spentByCategory = new Map(
    grouped.map((row) => [row.categoryId, Number(row._sum?.amount ?? 0)]),
  );
  const totalSpent = Number(total._sum.amount ?? 0);

  return budgets.map((budget) => {
    const amount = Number(budget.amount);
    const spent = budget.categoryId
      ? (spentByCategory.get(budget.categoryId) ?? 0)
      : totalSpent;
    const percentage = amount > 0 ? Math.round((spent / amount) * 1000) / 10 : 0;

    return {
      id: budget.id,
      categoryId: budget.categoryId,
      category: budget.category,
      year: budget.year,
      month: budget.month,
      amount,
      spent,
      remaining: Math.round((amount - spent) * 100) / 100,
      percentage,
      status: percentage >= 100 ? "exceeded" : percentage >= 80 ? "warning" : "ok",
    };
  });
}

/**
 * Crea o reemplaza un presupuesto.
 * El presupuesto general usa `categoryId = null`, por lo que el unique de Prisma
 * no basta (NULL nunca colisiona). Se busca primero y se resuelve la carrera con P2002.
 */
export async function upsertBudget(userId: string, input: BudgetInput) {
  const existing = await prisma.budget.findFirst({
    where: {
      userId,
      year: input.year,
      month: input.month,
      categoryId: input.categoryId,
    },
  });

  if (existing) {
    return prisma.budget.update({
      where: { id: existing.id },
      data: { amount: input.amount },
      include: budgetInclude,
    });
  }

  if (input.categoryId) {
    const category = await prisma.category.findFirst({
      where: { id: input.categoryId, userId },
      select: { id: true },
    });
    if (!category) {
      throw new ApiError(404, "CATEGORY_NOT_FOUND", "La categoría no existe.");
    }
  }

  try {
    return await prisma.budget.create({
      data: {
        userId,
        year: input.year,
        month: input.month,
        categoryId: input.categoryId,
        amount: input.amount,
      },
      include: budgetInclude,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      const raced = await prisma.budget.findFirst({
        where: {
          userId,
          year: input.year,
          month: input.month,
          categoryId: input.categoryId,
        },
      });
      if (raced) {
        return prisma.budget.update({
          where: { id: raced.id },
          data: { amount: input.amount },
          include: budgetInclude,
        });
      }
    }
    throw error;
  }
}

export async function getBudget(userId: string, id: string) {
  const budget = await prisma.budget.findFirst({
    where: { id, userId },
    include: budgetInclude,
  });

  if (!budget) {
    throw new ApiError(404, "BUDGET_NOT_FOUND", "El presupuesto no existe.");
  }

  return budget;
}

export async function updateBudget(userId: string, id: string, amount: number) {
  await getBudget(userId, id);

  return prisma.budget.update({
    where: { id },
    data: { amount },
    include: budgetInclude,
  });
}

export async function deleteBudget(userId: string, id: string) {
  const result = await prisma.budget.deleteMany({ where: { id, userId } });

  if (result.count === 0) {
    throw new ApiError(404, "BUDGET_NOT_FOUND", "El presupuesto no existe.");
  }
}
