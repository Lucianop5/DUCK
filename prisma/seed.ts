import "dotenv/config";

import { PrismaClient } from "../src/generated/prisma/client";
import { DEFAULT_CATEGORIES } from "../src/lib/constants/categories";

const prisma = new PrismaClient();

/**
 * Repara las categorías predeterminadas de los usuarios existentes.
 * Es seguro ejecutarlo varias veces: `skipDuplicates` evita duplicados.
 */
async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true } });

  if (users.length === 0) {
    console.log("No hay usuarios todavía. Las categorías se crean al registrarse.");
    return;
  }

  for (const user of users) {
    const result = await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map((category) => ({
        ...category,
        userId: user.id,
        isDefault: true,
      })),
      skipDuplicates: true,
    });

    console.log(`${user.email}: ${result.count} categorías nuevas`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
