import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  tone = "tape",
}: {
  className?: string;
  tone?: "tape" | "ink";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-grid size-9 shrink-0 place-items-center rounded-[3px] font-print text-[10px] tracking-[0.04em]",
        tone === "tape"
          ? "bg-stamp text-tape"
          : "bg-ink text-tape",
        className,
      )}
    >
      DUCK
    </span>
  );
}

export function BrandLockup({
  className,
  tone = "tape",
}: {
  className?: string;
  tone?: "tape" | "ink";
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <BrandMark tone={tone} />
      <span className="flex flex-col leading-none">
        <span className="text-[13px] font-extrabold tracking-[0.18em]">
          DUCK
        </span>
        <span className="mt-1 font-print text-[9px] tracking-[0.18em] opacity-65">
          CLP · CHILE
        </span>
      </span>
    </span>
  );
}
