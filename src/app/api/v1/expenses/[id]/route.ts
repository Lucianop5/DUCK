import {
  assertSameOrigin,
  handle,
  noContent,
  ok,
  readJson,
} from "@/lib/api/http";
import { requireUser } from "@/lib/auth/session";
import {
  deleteExpense,
  getExpense,
  updateExpense,
} from "@/lib/services/expenses";
import { uuidSchema } from "@/lib/validators/common";
import { expenseUpdateSchema } from "@/lib/validators/expense";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  return handle(async () => {
    const user = await requireUser();
    const { id } = await params;
    return ok(await getExpense(user.id, uuidSchema.parse(id)));
  });
}

export async function PATCH(request: Request, { params }: Params) {
  return handle(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const input = expenseUpdateSchema.parse(await readJson(request));
    return ok(await updateExpense(user.id, uuidSchema.parse(id), input));
  });
}

export async function DELETE(request: Request, { params }: Params) {
  return handle(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    await deleteExpense(user.id, uuidSchema.parse(id));
    return noContent();
  });
}
