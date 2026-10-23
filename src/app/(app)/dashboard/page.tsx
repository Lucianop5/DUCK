import Link from "next/link";
import { Plus, ArrowRight } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { getMonthAnalytics } from "@/lib/services/analytics";
import { listExpenses } from "@/lib/services/expenses";
import { analyticsQuerySchema } from "@/lib/validators/analytics";
import { monthRange } from "@/lib/validators/common";
import { formatCLP, formatDateShort, formatPercent, toIsoDate } from "@/lib/date";
import { PageHeader, PaperPanel, EmptyTape, PanelHeader } from "@/components/layout/page-header";
import { PeriodSwitcher } from "@/components/layout/period-switcher";
import { CategoryIcon } from "@/lib/icons";

export const metadata = { title: "Tu mes" };

export default async function DashboardPage({ searchParams }: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await requireUser();
  const query = analyticsQuerySchema.parse(await searchParams);
  const data = await getMonthAnalytics(user.id, user, query);
  const range = monthRange(data.period.year, data.period.month);
  const recent = await listExpenses(user.id, {
    page: 1, perPage: 6, sort: "date_desc", from: toIsoDate(range.from), to: toIsoDate(range.to),
  });
  const budget = data.generalBudget;

  return (
    <div className="space-y-7">
      <PageHeader kicker="TU CINTA DEL MES" title={`Hola, ${user.name.split(" ")[0]}.`} description="Lo que anotaste, sumado. Sin estimaciones ni cifras de ejemplo."
        actions={<PeriodSwitcher pathname="/dashboard" {...data.period} />} />

      <PaperPanel className="tape-holes px-6 py-7 sm:px-9">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-ink/60 pb-3">
          <h2 className="text-xl font-bold capitalize">{data.label}</h2>
          <span className="print-label">{data.count} movimientos</span>
        </div>
        <dl className="grid gap-6 py-7 sm:grid-cols-3">
          <div><dt className="print-label text-ink/70">Total gastado</dt><dd className="print-number animate-total-reveal mt-2 text-4xl text-stamp">{formatCLP(data.total)}</dd></div>
          <div><dt className="print-label text-ink/70">Presupuesto</dt><dd className="print-number mt-2 text-3xl">{budget ? formatCLP(budget.amount) : "Sin definir"}</dd></div>
          <div><dt className="print-label text-ink/70">{budget && budget.remaining < 0 ? "Exceso" : "Disponible"}</dt><dd className="print-number mt-2 text-3xl">{budget ? formatCLP(Math.abs(budget.remaining)) : "—"}</dd></div>
        </dl>
        {budget ? <div className="double-rule pt-4">
          <div role="img" aria-label={`${formatPercent(budget.percentage, 1)} del presupuesto utilizado`} className="h-5 border border-ink/60 bg-tape-dim p-0.5">
            <div className="h-full bg-stamp" style={{ width: `${Math.min(100, budget.percentage)}%` }} />
          </div>
          <p className="mt-2 text-sm text-ink/80">{formatPercent(budget.percentage, 1)} usado{budget.status === "exceeded" ? " · Llegaste al límite del presupuesto." : budget.status === "warning" ? " · Ya superaste el 80 %." : ""}</p>
        </div> : <p className="double-rule pt-4 text-sm text-ink/75">Define un presupuesto para ver cuánto te queda del mes.</p>}
      </PaperPanel>

      {data.count === 0 ? <EmptyTape title="La cinta está en blanco." copy="Anota tu primer gasto de este mes. Los totales y las categorías aparecerán aquí."
        action={<Link href="/expenses/new" className="inline-flex items-center gap-2 rounded bg-stamp px-5 py-3 text-tape"><Plus className="size-4" /> Anotar un gasto</Link>} /> :
      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <PaperPanel className="p-5 sm:p-7">
          <PanelHeader kicker="MOVIMIENTOS" title="Lo último que anotaste" />
          <ul className="mt-3 divide-y divide-dotted divide-ink/30">
            {recent.items.map((expense) => <li key={expense.id} className="flex items-center gap-3 py-4">
              <CategoryIcon name={expense.category.icon} className="size-5 shrink-0" />
              <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{expense.description}</p><p className="mt-1 text-xs text-ink/70">{expense.category.name} · {formatDateShort(expense.date)}</p></div>
              <span className="print-number whitespace-nowrap text-sm">{formatCLP(Number(expense.amount))}</span>
            </li>)}
          </ul>
          <Link href="/expenses" className="link-print mt-4 inline-flex items-center gap-2 text-sm">Ver todos los gastos <ArrowRight className="size-4" /></Link>
        </PaperPanel>
        <PaperPanel className="p-5 sm:p-7">
          <PanelHeader kicker="DISTRIBUCIÓN" title="Dónde pesa el mes" />
          <ul className="mt-5 space-y-5">{data.byCategory.map((category) => <li key={category.categoryId}>
            <div className="flex justify-between gap-3 text-sm"><span>{category.name}</span><span className="print-number">{formatCLP(category.total)}</span></div>
            <div className="mt-2 h-2 bg-tape-dim"><div className="h-full bg-machine" style={{ width: `${category.percentage}%` }} /></div>
            <p className="mt-1 text-xs text-ink/70">{category.count} gastos · {formatPercent(category.percentage, 1)}</p>
          </li>)}</ul>
          <div className="double-rule mt-6 pt-4 text-sm text-ink/80">{data.previous.variationPercentage === null ? "Aún no hay gastos del mes anterior para comparar." : `${formatPercent(Math.abs(data.previous.variationPercentage), 1)} ${data.previous.difference >= 0 ? "más" : "menos"} que el mes anterior.`}</div>
        </PaperPanel>
      </div>}
    </div>
  );
}
