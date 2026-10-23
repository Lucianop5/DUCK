import { requireUser } from "@/lib/auth/session";
import { currentPeriod } from "@/lib/date";
import { budgetQuerySchema } from "@/lib/validators/budget";
import { listBudgets } from "@/lib/services/budgets";
import { listCategories } from "@/lib/services/categories";
import { PageHeader } from "@/components/layout/page-header";
import { PeriodSwitcher } from "@/components/layout/period-switcher";
import { BudgetLedger } from "@/components/budgets/budget-ledger";

export const metadata = { title: "Presupuestos" };
export default async function BudgetsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const parsed = budgetQuerySchema.safeParse(await searchParams);
  const period = parsed.success ? parsed.data : currentPeriod(user.timezone);
  const [budgets, categories] = await Promise.all([listBudgets(user.id, period), listCategories(user.id)]);
  return <div className="space-y-7"><PageHeader kicker="LÍMITES" title="Decide antes de sumar." description="Los presupuestos generales y por categoría se controlan por separado; no se suman entre sí." actions={<PeriodSwitcher pathname="/budgets" {...period} />} /><BudgetLedger budgets={budgets} categories={categories.map(({ id, name }) => ({ id, name }))} {...period} /></div>;
}
