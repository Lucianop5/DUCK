import {
  assertSameOrigin,
  handle,
  noContent,
  ok,
  readJson,
} from "@/lib/api/http";
import { requireUser } from "@/lib/auth/session";
import {
  deleteCategory,
  getCategory,
  updateCategory,
} from "@/lib/services/categories";
import { uuidSchema } from "@/lib/validators/common";
import { categoryUpdateSchema } from "@/lib/validators/category";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  return handle(async () => {
    const user = await requireUser();
    const { id } = await params;
    return ok(await getCategory(user.id, uuidSchema.parse(id)));
  });
}

export async function PATCH(request: Request, { params }: Params) {
  return handle(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    const input = categoryUpdateSchema.parse(await readJson(request));
    return ok(await updateCategory(user.id, uuidSchema.parse(id), input));
  });
}

export async function DELETE(request: Request, { params }: Params) {
  return handle(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const { id } = await params;
    await deleteCategory(user.id, uuidSchema.parse(id));
    return noContent();
  });
}
