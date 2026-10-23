import { handle, ok } from "@/lib/api/http";
import { requireUser } from "@/lib/auth/session";
import { getMonthAnalytics } from "@/lib/services/analytics";
import { analyticsQuerySchema } from "@/lib/validators/analytics";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser();
    const url = new URL(request.url);
    const query = analyticsQuerySchema.parse(Object.fromEntries(url.searchParams));
    return ok(await getMonthAnalytics(user.id, user, query));
  });
}
