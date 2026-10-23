import { assertSameOrigin, handle, ok, readJson } from "@/lib/api/http";
import { requireUser } from "@/lib/auth/session";
import { simulate } from "@/lib/services/analytics";
import { simulatorInputSchema } from "@/lib/validators/analytics";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handle(async () => {
    assertSameOrigin(request);
    const user = await requireUser();
    const input = simulatorInputSchema.parse(await readJson(request));
    return ok(await simulate(user.id, user, input));
  });
}
