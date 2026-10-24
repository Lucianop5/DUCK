import { formatCLP } from "@/lib/date";
import { cn } from "@/lib/utils";

const DEMO_ROWS = [
  { label: "Café con leche", amount: 2400 },
  { label: "Micro 210", amount: 730 },
  { label: "Almuerzo", amount: 6900 },
  { label: "Delivery", amount: 12500 },
  { label: "Almacén", amount: 3250 },
  { label: "Snack", amount: 1200 },
  { label: "Bencina", amount: 8000 },
] as const;

export function TapeDemo({
  className,
  compact = false,
  animate = true,
}: {
  className?: string;
  compact?: boolean;
  animate?: boolean;
}) {
  return (
    <div className={cn("relative mx-auto w-full", className)}>
      <div
        aria-hidden="true"
        className="relative z-10 mx-auto h-4 w-[94%] rounded-b-[6px] bg-machine-deep shadow-[inset_0_4px_9px_rgba(0,0,0,0.6)]"
      >
        <span className="absolute inset-x-6 top-2 h-[3px] rounded-full bg-[#06120F]" />
      </div>

      <div
        className={cn(
          "paper-sheet tape-holes relative mx-auto -mt-1 w-full px-7 pt-7 pb-8 sm:px-9",
          animate && "animate-tape-feed",
        )}
      >
        <div className="flex items-baseline justify-between gap-3 border-b border-ink/70 pb-2">
          <span className="print-label text-[10px]">DUCK</span>
          <span className="print-label text-[10px]">OCT 2026</span>
        </div>
        <p className="print-label mt-2 text-[8px] text-ink/55">
          MOVIMIENTOS · DATOS DE EJEMPLO
        </p>

        <div className={cn("mt-4", compact ? "space-y-1" : "space-y-1.5")}>
          {DEMO_ROWS.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline gap-2 border-b border-dotted border-ink/25 py-1.5 text-[13px] sm:text-sm"
            >
              <span className="max-w-[62%] truncate">{row.label}</span>
              <span
                aria-hidden="true"
                className="min-w-3 flex-1 translate-y-[-3px] border-b border-dotted border-ink/30"
              />
              <span className="print-number shrink-0 text-[13px] sm:text-sm">
                {formatCLP(row.amount)}
              </span>
            </div>
          ))}
        </div>

        <p className="print-label mt-2 text-right text-[8px] text-ink/50">
          + 32 MOVIMIENTOS MÁS
        </p>

        <div className="double-rule mt-3 flex items-end justify-between gap-4 pt-2">
          <span className="print-label text-[9px]">TOTAL DEL MES</span>
          <span className="print-number animate-total-reveal text-[clamp(1.7rem,4vw,2.1rem)] leading-none text-stamp">
            {formatCLP(248730)}
          </span>
        </div>

        <div className="mt-5 border border-ink/80 px-3 pt-2.5 pb-2">
          <div className="flex items-baseline justify-between gap-3">
            <span className="print-label text-[8px]">PRESUPUESTO</span>
            <span className="print-number text-[11px]">{formatCLP(300000)}</span>
          </div>
          <div
            className="mt-2 h-2.5 border border-ink/80 bg-tape-dim p-[1px]"
            role="img"
            aria-label="Presupuesto usado: 82,9 por ciento"
          >
            <span className="block h-full w-[82.9%] bg-stamp" />
          </div>
          <div className="mt-1.5 flex items-baseline justify-between gap-3">
            <span className="print-label text-[8px] text-stamp">82,9 % USADO</span>
            <span className="print-label text-[8px]">QUEDAN {formatCLP(51270)}</span>
          </div>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative z-10 mx-auto -mt-3 h-5 w-[94%] rounded-t-[6px] bg-machine-deep shadow-[0_-4px_10px_rgba(0,0,0,0.35)]"
      />
    </div>
  );
}

export function CategoryKeys({ className }: { className?: string }) {
  const keys = [
    { short: "ALIM", color: "#F97316" },
    { short: "TRAN", color: "#3B82F6" },
    { short: "VIVI", color: "#8B5CF6" },
    { short: "SERV", color: "#06B6D4" },
    { short: "OCIO", color: "#EC4899" },
    { short: "SALUD", color: "#EF4444" },
    { short: "EDU", color: "#10B981" },
    { short: "COMP", color: "#EAB308" },
    { short: "OTROS", color: "#64748B" },
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-2.5", className)}>
      {keys.map((key) => (
        <div
          key={key.short}
          className="keycap flex aspect-square flex-col items-center justify-center gap-2"
        >
          <span
            aria-hidden="true"
            className="size-3 rounded-full"
            style={{ backgroundColor: key.color }}
          />
          <span className="font-print text-[7px] tracking-[0.08em] text-machine">
            {key.short}
          </span>
        </div>
      ))}
    </div>
  );
}
