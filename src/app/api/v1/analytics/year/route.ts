import { handle, ok } from "@/lib/api/http";
import { requireUser } from "@/lib/auth/session";
import { getYearOverview } from "@/lib/services/analytics";
import { yearSchema } from "@/lib/validators/common";
import { currentPeriod } from "@/lib/date";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser();
    const url = new URL(request.url);
    const fallback = currentPeriod(user.timezone);
    const year = yearSchema.parse(url.searchParams.get("year") ?? fallback.year);
    return ok(await getYearOverview(user.id, year));
  });
}
