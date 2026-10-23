import { requireUser } from "@/lib/auth/session";
import { simulate } from "@/lib/services/analytics";
import { analyticsQuerySchema } from "@/lib/validators/analytics";
import { currentPeriod } from "@/lib/date";
import { PageHeader } from "@/components/layout/page-header";
import { PeriodSwitcher } from "@/components/layout/period-switcher";
import { SimulatorForm } from "@/components/simulator/simulator-form";

export const metadata = { title: "Simulador" };
export default async function SimulatorPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const parsed = analyticsQuerySchema.safeParse(await searchParams);
  const period = { ...currentPeriod(user.timezone), ...(parsed.success ? parsed.data : {}) };
  const initial = await simulate(user.id, user, { ...period, months: 12, basis: "selected_month", extraMonthly: 0, adjustments: [] });
  return <div className="space-y-7"><PageHeader kicker="ESCENARIOS" title="¿Y si cambias un hábito?" description="Prueba el próximo mes o el próximo año sin tocar tus registros." actions={<PeriodSwitcher pathname="/simulator" {...period} />} /><SimulatorForm key={`${period.year}-${period.month}`} initial={initial} {...period} /></div>;
}
