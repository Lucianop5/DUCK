import { headers } from "next/headers";

import { ApiError } from "@/lib/api/http";
import { auth } from "@/lib/auth";

/**
 * Devuelve el usuario de la sesión actual o `null`.
 * Las páginas que redirigen usan esta variante; la API usa `requireUser`.
 */
export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

/**
 * Devuelve el usuario de la sesión actual o lanza 401.
 * Toda consulta de dominio debe filtrar por `user.id`.
 */
export async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED", "Debes iniciar sesión para continuar.");
  }

  return user;
}
