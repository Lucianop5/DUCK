import { assertSameOrigin, created, handle, ok, readJson } from "@/lib/api/http";
import { requireUser } from "@/lib/auth/session";
import { createExpense, listExpenses } from "@/lib/services/expenses";
import { expenseInputSchema, expenseQuerySchema } from "@/lib/validators/expense";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handle(async () => {
    const user = await requireUser();
    const url = new URL(request.url);
    const query = expenseQuerySchema.parse(Object.fromEntries(url.searchParams));
    return ok(await listExpenses(user.id, query));
  });
}

export async function POST(request: Request) {
  return handle(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const input = expenseInputSchema.parse(await readJson(request));
    return created(await createExpense(user.id, input));
  });
}
