import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BrandLockup, BrandMark } from "@/components/brand/brand-mark";

describe("marca DUCK", () => {
  it.each(["tape", "ink"] as const)("muestra DUCK en el sello %s", (tone) => {
    const html = renderToStaticMarkup(createElement(BrandMark, { tone }));

    expect(html).toContain("DUCK");
    expect(html).not.toContain("GH");
  });

  it("mantiene el nombre y la moneda en la firma de marca", () => {
    const html = renderToStaticMarkup(createElement(BrandLockup));

    expect(html).toContain("DUCK");
    expect(html).toContain("CLP · CHILE");
    expect(html).not.toMatch(/gastos hormiga/i);
  });
});
