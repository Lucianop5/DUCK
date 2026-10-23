import { assertSameOrigin, handle, ok, readJson } from "@/lib/api/http";
import { requireUser } from "@/lib/auth/session";
import { listBudgets, upsertBudget } from "@/lib/services/budgets";
import { budgetInputSchema, budgetQuerySchema } from "@/lib/validators/budget";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser();
    const url = new URL(request.url);
    const query = budgetQuerySchema.parse(Object.fromEntries(url.searchParams));
    return ok(await listBudgets(user.id, query));
  });
}

export async function PUT(request: Request) {
  return handle(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const input = budgetInputSchema.parse(await readJson(request));
    return ok(await upsertBudget(user.id, input));
  });
}
