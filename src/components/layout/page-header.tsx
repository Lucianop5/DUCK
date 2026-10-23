import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function PaperPanel({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("paper-sheet", className)}>
      {children}
    </section>
  );
}

export function PanelHeader({
  title,
  note,
  action,
  className,
}: {
  kicker: string;
  title: string;
  note?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-ink/60 pb-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <h2 className="mt-1.5 text-[21px] leading-none font-extrabold tracking-[-0.03em]">
          {title}
        </h2>
        {note ? <p className="mt-2 text-[11.5px] leading-[1.5] text-ink/60">{note}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  kicker: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-5 border-b border-rule pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="mt-2 text-[clamp(1.9rem,4vw,2.8rem)] leading-[0.96] font-extrabold tracking-[-0.045em]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-[620px] text-[13px] leading-[1.55] text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export function EmptyTape({
  title,
  copy,
  action,
}: {
  title: string;
  copy: string;
  action?: ReactNode;
}) {
  return (
    <div className="paper-sheet tape-holes px-6 py-8 text-center sm:px-10">
      <h3 className="mt-3 text-[26px] leading-[0.98] font-extrabold tracking-[-0.04em]">
        {title}
      </h3>
      <p className="mx-auto mt-3 max-w-[420px] text-[13px] leading-[1.6] text-ink/65">{copy}</p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
      <div aria-hidden="true" className="mx-auto mt-7 max-w-[420px] space-y-3 opacity-40">
        <span className="block h-px bg-ink/40" />
        <span className="block h-px bg-ink/30" />
        <span className="block h-px bg-ink/20" />
      </div>
    </div>
  );
}
