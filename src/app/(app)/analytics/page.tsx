import { requireUser } from "@/lib/auth/session";
import { getMonthAnalytics, getYearOverview } from "@/lib/services/analytics";
import { analyticsQuerySchema } from "@/lib/validators/analytics";
import { PageHeader, PaperPanel, PanelHeader } from "@/components/layout/page-header";
import { PeriodSwitcher } from "@/components/layout/period-switcher";
import { SpendingChart } from "@/components/analytics/spending-charts";
import { formatCLP, formatPercent } from "@/lib/date";

export const metadata = { title: "Analítica" };
export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const parsed = analyticsQuerySchema.safeParse(await searchParams);
  const month = await getMonthAnalytics(user.id, user, parsed.success ? parsed.data : {});
  const year = await getYearOverview(user.id, month.period.year);
  return <div className="space-y-7"><PageHeader kicker="ANÁLISIS" title="El hábito deja huella." description="Tus movimientos por día, por mes y por repetición. Solo datos de tu cuenta." actions={<PeriodSwitcher pathname="/analytics" {...month.period} />} />
    <div className="grid gap-6 xl:grid-cols-2"><PaperPanel className="p-6"><PanelHeader kicker="MES" title="Día a día" note={`${month.label}: ${formatCLP(month.total)} en ${month.count} movimientos.`} /><div className="mt-5"><SpendingChart data={month.daily} label="Gastos diarios del mes seleccionado" /></div><details className="mt-4 text-sm"><summary className="cursor-pointer">Ver datos diarios en tabla</summary><table className="mt-3 w-full text-left"><thead><tr><th scope="col">Fecha</th><th scope="col">Gastado</th></tr></thead><tbody>{month.daily.map((day) => <tr key={day.date}><td className="py-1">{day.label}</td><td>{formatCLP(day.total)}</td></tr>)}</tbody></table></details></PaperPanel>
    <PaperPanel className="p-6"><PanelHeader kicker="AÑO" title={`Los doce meses de ${year.year}`} note={`Total anual: ${formatCLP(year.total)}.`} /><div className="mt-5"><SpendingChart data={year.months} label="Gastos por mes del año seleccionado" /></div><details className="mt-4 text-sm"><summary className="cursor-pointer">Ver datos mensuales en tabla</summary><table className="mt-3 w-full text-left"><thead><tr><th scope="col">Mes</th><th scope="col">Gastado</th></tr></thead><tbody>{year.months.map((point) => <tr key={point.month}><td className="py-1">{point.label}</td><td>{formatCLP(point.total)}</td></tr>)}</tbody></table></details></PaperPanel></div>
    <div className="grid gap-6 lg:grid-cols-2"><PaperPanel className="p-6"><PanelHeader kicker="REPETICIÓN" title="Lo que vuelve a aparecer" note="Agrupado por descripción; ordenado por cantidad de registros." />{!month.frequent.length && <p className="mt-5 text-sm">Todavía no hay movimientos este mes.</p>}<ol className="mt-4 divide-y divide-dotted divide-ink/30">{month.frequent.map((expense) => <li key={expense.description} className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm font-semibold">{expense.description}</p><p className="mt-1 text-xs text-ink/75">{expense.count} registros · Promedio {formatCLP(expense.average)}</p></div><span className="print-number whitespace-nowrap">{formatCLP(expense.total)}</span></li>)}</ol></PaperPanel>
    <PaperPanel className="p-6"><PanelHeader kicker="PAGO" title="Cómo pagas" /><ul className="mt-4 divide-y divide-dotted divide-ink/30">{month.byPaymentMethod.map((method) => <li key={method.method} className="flex justify-between gap-3 py-4 text-sm"><span>{method.label} · {formatPercent(method.percentage, 1)}</span><span className="print-number">{formatCLP(method.total)}</span></li>)}</ul><p className="double-rule mt-6 pt-4 text-sm">Gasto promedio: {formatCLP(month.average)} · Mayor gasto: {formatCLP(month.largest)}</p></PaperPanel></div>
  </div>;
}
