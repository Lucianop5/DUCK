import { assertSameOrigin, created, handle, ok, readJson } from "@/lib/api/http";
import { requireUser } from "@/lib/auth/session";
import { createCategory, listCategories } from "@/lib/services/categories";
import { categoryInputSchema } from "@/lib/validators/category";

export const dynamic = "force-dynamic";

export async function GET() {
  return handle(async () => {
    const user = await requireUser();
    return ok(await listCategories(user.id));
  });
}

export async function POST(request: Request) {
  return handle(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const input = categoryInputSchema.parse(await readJson(request));
    return created(await createCategory(user.id, input));
  });
}
