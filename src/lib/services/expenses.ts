import { Prisma } from "@/generated/prisma/client";

import { ApiError } from "@/lib/api/http";
import { prisma } from "@/lib/prisma";
import {
  toDatabaseDate,
  type monthRange,
} from "@/lib/validators/common";
import type {
  ExpenseInput,
  ExpenseQuery,
  ExpenseUpdateInput,
} from "@/lib/validators/expense";

const expenseInclude = {
  category: { select: { id: true, name: true, color: true, icon: true } },
} satisfies Prisma.ExpenseInclude;

const ORDER_BY = {
  date_desc: [{ date: "desc" }, { createdAt: "desc" }],
  date_asc: [{ date: "asc" }, { createdAt: "asc" }],
  amount_desc: [{ amount: "desc" }, { createdAt: "desc" }],
  amount_asc: [{ amount: "asc" }, { createdAt: "asc" }],
} satisfies Record<ExpenseQuery["sort"], Prisma.ExpenseOrderByWithRelationInput[]>;

export async function listExpenses(userId: string, query: ExpenseQuery) {
  const where: Prisma.ExpenseWhereInput = { userId };

  if (query.from || query.to) {
    where.date = {
      ...(query.from ? { gte: toDatabaseDate(query.from) } : {}),
      ...(query.to ? { lte: toDatabaseDate(query.to) } : {}),
    };
  }
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.paymentMethod) where.paymentMethod = query.paymentMethod;
  if (query.q) where.description = { contains: query.q };

  const skip = (query.page - 1) * query.perPage;

  const [items, total] = await prisma.$transaction([
    prisma.expense.findMany({
      where,
      include: expenseInclude,
      orderBy: ORDER_BY[query.sort],
      skip,
      take: query.perPage,
    }),
    prisma.expense.count({ where }),
  ]);

  return {
    items,
    meta: {
      page: query.page,
      perPage: query.perPage,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.perPage)),
    },
  };
}

export async function getExpense(userId: string, id: string) {
  const expense = await prisma.expense.findFirst({
    where: { id, userId },
    include: expenseInclude,
  });

  if (!expense) {
    throw new ApiError(404, "EXPENSE_NOT_FOUND", "El gasto no existe.");
  }

  return expense;
}

export async function createExpense(userId: string, input: ExpenseInput) {
  await assertCategoryBelongsToUser(userId, input.categoryId);

  return prisma.expense.create({
    data: {
      userId,
      categoryId: input.categoryId,
      amount: input.amount,
      description: input.description,
      date: toDatabaseDate(input.date),
      paymentMethod: input.paymentMethod,
    },
    include: expenseInclude,
  });
}

export async function updateExpense(
  userId: string,
  id: string,
  input: ExpenseUpdateInput,
) {
  await getExpense(userId, id);

  if (input.categoryId) {
    await assertCategoryBelongsToUser(userId, input.categoryId);
  }

  const data: Prisma.ExpenseUncheckedUpdateManyInput = {};
  if (input.amount !== undefined) data.amount = input.amount;
  if (input.description !== undefined) data.description = input.description;
  if (input.date !== undefined) data.date = toDatabaseDate(input.date);
  if (input.paymentMethod !== undefined) data.paymentMethod = input.paymentMethod;
  if (input.categoryId !== undefined) data.categoryId = input.categoryId;

  await prisma.expense.updateMany({ where: { id, userId }, data });

  return getExpense(userId, id);
}

export async function deleteExpense(userId: string, id: string) {
  const result = await prisma.expense.deleteMany({ where: { id, userId } });

  if (result.count === 0) {
    throw new ApiError(404, "EXPENSE_NOT_FOUND", "El gasto no existe.");
  }
}

/** Suma de gastos del usuario en un rango de fechas. */
export async function sumExpenses(
  userId: string,
  range: ReturnType<typeof monthRange>,
) {
  const result = await prisma.expense.aggregate({
    where: { userId, date: { gte: range.from, lte: range.to } },
    _sum: { amount: true },
    _count: true,
  });

  return {
    total: Number(result._sum.amount ?? 0),
    count: result._count,
  };
}

async function assertCategoryBelongsToUser(userId: string, categoryId: string) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
    select: { id: true },
  });

  if (!category) {
    throw new ApiError(404, "CATEGORY_NOT_FOUND", "La categoría no existe.");
  }
}
