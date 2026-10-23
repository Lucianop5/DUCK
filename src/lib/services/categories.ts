import { Prisma } from "@/generated/prisma/client";

import { ApiError } from "@/lib/api/http";
import { DEFAULT_CATEGORIES } from "@/lib/constants/categories";
import { prisma } from "@/lib/prisma";
import type {
  CategoryInput,
  CategoryUpdateInput,
} from "@/lib/validators/category";

const categoryInclude = {
  _count: { select: { expenses: true } },
} satisfies Prisma.CategoryInclude;

/** Crea las nueve categorías iniciales. Es idempotente. */
export async function createDefaultCategories(userId: string): Promise<number> {
  const result = await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map((category) => ({
      ...category,
      userId,
      isDefault: true,
    })),
    skipDuplicates: true,
  });

  return result.count;
}

export async function listCategories(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { name: "asc" }],
    include: categoryInclude,
  });
}

export async function getCategory(userId: string, id: string) {
  const category = await prisma.category.findFirst({
    where: { id, userId },
    include: categoryInclude,
  });

  if (!category) {
    throw new ApiError(404, "CATEGORY_NOT_FOUND", "La categoría no existe.");
  }

  return category;
}

export async function createCategory(userId: string, input: CategoryInput) {
  try {
    return await prisma.category.create({
      data: { ...input, userId, isDefault: false },
      include: categoryInclude,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, "CATEGORY_NAME_TAKEN", "Ya tienes una categoría con ese nombre.");
    }
    throw error;
  }
}

export async function updateCategory(
  userId: string,
  id: string,
  input: CategoryUpdateInput,
) {
  await getCategory(userId, id);

  try {
    return await prisma.category.update({
      where: { id },
      data: input,
      include: categoryInclude,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new ApiError(409, "CATEGORY_NAME_TAKEN", "Ya tienes una categoría con ese nombre.");
    }
    throw error;
  }
}

export async function deleteCategory(userId: string, id: string) {
  const category = await getCategory(userId, id);

  if (category._count.expenses > 0) {
    throw new ApiError(
      409,
      "CATEGORY_IN_USE",
      "La categoría tiene gastos asociados. Reasígnalos antes de eliminarla.",
    );
  }

  const budgets = await prisma.budget.count({ where: { userId, categoryId: id } });
  if (budgets > 0) {
    throw new ApiError(
      409,
      "CATEGORY_IN_USE",
      "La categoría tiene presupuestos asociados. Elimínalos antes de borrarla.",
    );
  }

  await prisma.category.delete({ where: { id } });
}

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"
  );
}
