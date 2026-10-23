import { describe, expect, it } from "vitest";

import { ApiError, assertSameOrigin } from "@/lib/api/http";

function requestWith(headers: Record<string, string>): Request {
  return new Request("http://localhost:3000/api/v1/expenses", {
    method: "POST",
    headers,
  });
}

describe("assertSameOrigin", () => {
  it("permite peticiones sin Origin (clientes no navegador)", () => {
    expect(() => assertSameOrigin(requestWith({ host: "localhost:3000" }))).not.toThrow();
  });

  it("permite el mismo host", () => {
    expect(() =>
      assertSameOrigin(
        requestWith({ host: "localhost:3000", origin: "http://localhost:3000" }),
      ),
    ).not.toThrow();
  });

  it("rechaza un origen ajeno", () => {
    try {
      assertSameOrigin(
        requestWith({ host: "localhost:3000", origin: "https://evil.example" }),
      );
      throw new Error("debió lanzar");
    } catch (error) {
      expect(error).toBeInstanceOf(ApiError);
      expect((error as ApiError).status).toBe(403);
    }
  });
});
