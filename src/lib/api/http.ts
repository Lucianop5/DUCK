import { Prisma } from "@/generated/prisma/client";
import { ZodError } from "zod";

/** Error controlado que se traduce a una respuesta HTTP concreta. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function ok<T>(data: T, init?: ResponseInit): Response {
  return Response.json({ data }, init);
}

export function created<T>(data: T): Response {
  return Response.json({ data }, { status: 201 });
}

export function noContent(): Response {
  return new Response(null, { status: 204 });
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "INVALID_JSON", "El cuerpo de la petición debe ser JSON válido.");
  }
}

/**
 * Envuelve un handler para traducir errores a un sobre JSON uniforme.
 * Nunca filtra detalles internos al cliente.
 */
export async function handle(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (error) {
    return errorResponse(error);
  }
}

/** Bloquea peticiones de escritura provenientes de otro origen (CSRF). */
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (!origin) return;

  const host = request.headers.get("host");
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  const originHost = new URL(origin).host;

  if (originHost !== host && origin !== configured) {
    throw new ApiError(403, "CSRF_REJECTED", "El origen de la petición no está permitido.");
  }
}

function errorResponse(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json(
      { error: { code: error.code, message: error.message, details: error.details } },
      { status: error.status },
    );
  }

  if (error instanceof ZodError) {
    return Response.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Revisa los datos enviados.",
          details: error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
          })),
        },
      },
      { status: 422 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return Response.json(
        { error: { code: "DUPLICATE", message: "El registro ya existe." } },
        { status: 409 },
      );
    }
    if (error.code === "P2003") {
      return Response.json(
        {
          error: {
            code: "RELATION_CONFLICT",
            message: "El registro está en uso y no se puede eliminar.",
          },
        },
        { status: 409 },
      );
    }
    if (error.code === "P2025") {
      return Response.json(
        { error: { code: "NOT_FOUND", message: "El registro no existe." } },
        { status: 404 },
      );
    }
  }

  console.error("[api] error no controlado", error);
  return Response.json(
    { error: { code: "INTERNAL_ERROR", message: "Ocurrió un error inesperado." } },
    { status: 500 },
  );
}
