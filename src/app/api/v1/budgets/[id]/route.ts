import {
  assertSameOrigin,
  handle,
  noContent,
  ok,
  readJson,
} from "@/lib/api/http";
import { requireUser } from "@/lib/auth/session";
import { deleteBudget, getBudget, updateBudget } from "@/lib/services/budgets";
import { uuidSchema } from "@/lib/validators/common";
import { budgetUpdateSchema } from "@/lib/validators/budget";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  return handle(async () => {
    const user = await requireUser();
    const { id } = await params;
    return ok(await getBudget(user.id, uuidSchema.parse(id)));
  });
}

export async function PATCH(request: Request, { params }: Params) {
  return handle(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const input = budgetUpdateSchema.parse(await readJson(request));
    return ok(await updateBudget(user.id, uuidSchema.parse(id), input.amount));
  });
}

export async function DELETE(request: Request, { params }: Params) {
  return handle(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    await deleteBudget(user.id, uuidSchema.parse(id));
    return noContent();
  });
}
