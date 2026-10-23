import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getExpense } from "@/lib/services/expenses";
import { listCategories } from "@/lib/services/categories";
import { ApiError } from "@/lib/api/http";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { DeleteExpense } from "@/components/expenses/delete-expense";
import { PageHeader } from "@/components/layout/page-header";
import { toIsoDate, todayInTimeZone } from "@/lib/date";

export const metadata = { title: "Editar gasto" };
export default async function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const expense = await getExpense(user.id, id).catch((error) => { if (error instanceof ApiError && error.status === 404) notFound(); throw error; });
  const categories = await listCategories(user.id);
  return <div className="space-y-7"><PageHeader kicker="MOVIMIENTO" title="Corrige esta línea." /><ExpenseForm categories={categories.map(({ id, name }) => ({ id, name }))} today={todayInTimeZone(user.timezone)} initial={{ id: expense.id, amount: Number(expense.amount), description: expense.description, date: toIsoDate(expense.date), categoryId: expense.categoryId, paymentMethod: expense.paymentMethod }} /><DeleteExpense id={expense.id} /></div>;
}
