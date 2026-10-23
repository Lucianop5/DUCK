import { handle, ok } from "@/lib/api/http";
import { requireUser } from "@/lib/auth/session";
import { getSummary } from "@/lib/services/analytics";
import { analyticsQuerySchema } from "@/lib/validators/analytics";

export const dynamic = "force-dynamic";

/**
 * Resumen estable para LifeDashboard.
 * El MVP lo protege con la sesión del usuario; OAuth 2.0 queda documentado.
 */
export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser();
    const url = new URL(request.url);
    const query = analyticsQuerySchema.parse(Object.fromEntries(url.searchParams));
    return ok(await getSummary(user.id, user, query));
  });
}
