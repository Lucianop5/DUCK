import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/lib/prisma";
import { createDefaultCategories } from "@/lib/services/categories";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mysql" }),
  appName: "Gastos Hormiga",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    requireEmailVerification: false,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
  user: {
    additionalFields: {
      timezone: { type: "string", input: false, defaultValue: "America/Santiago" },
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Cada cuenta nace con sus nueve categorías. Si el hook falla,
        // `ensureDefaultCategories` las repara en el siguiente acceso.
        after: async (user) => {
          await createDefaultCategories(user.id);
        },
      },
    },
  },
  advanced: {
    database: {
      // Better Auth usa IDs opacos por defecto; se alinean con UUID v4
      // como el resto de las claves del dominio.
      generateId: "uuid",
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
