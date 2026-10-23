import { ExpenseForm } from "@/components/expenses/expense-form";
import { PageHeader } from "@/components/layout/page-header";
import { requireUser } from "@/lib/auth/session";
import { listCategories } from "@/lib/services/categories";
import { todayInTimeZone } from "@/lib/date";

export const metadata = { title: "Anotar gasto" };
export default async function NewExpensePage() {
  const user = await requireUser();
  const categories = await listCategories(user.id);
  return <div className="space-y-7"><PageHeader kicker="MOVIMIENTO" title="Anota un gasto." description="Una línea más en la cinta. El total se actualiza al guardar." /><ExpenseForm categories={categories.map(({ id, name }) => ({ id, name }))} today={todayInTimeZone(user.timezone)} /></div>;
}
