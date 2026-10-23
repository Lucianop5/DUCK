"use client";

import { useRouter } from "next/navigation";
import type { Route } from "next";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { addMonths, monthLabel } from "@/lib/date";
import { cn } from "@/lib/utils";

export function PeriodSwitcher({
  pathname,
  year,
  month,
  className,
}: {
  pathname: Route;
  year: number;
  month: number;
  className?: string;
}) {
  const router = useRouter();

  function go(delta: number) {
    const period = addMonths({ year, month }, delta);
    router.push(`${pathname}?year=${period.year}&month=${period.month}` as Route);
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 border border-border bg-card px-1 py-1",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Mes anterior"
        className="focus-ring inline-flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ChevronLeft aria-hidden="true" className="size-4" />
      </button>
      <span className="print-label min-w-[130px] px-1 text-center text-[9px]">
        {monthLabel(year, month)}
      </span>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Mes siguiente"
        className="focus-ring inline-flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <ChevronRight aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}
