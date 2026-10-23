"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { expenseInputSchema } from "@/lib/validators/expense";
import { PAYMENT_METHOD_LABELS } from "@/lib/constants/categories";

type Category = { id: string; name: string };
type InitialExpense = { id: string; amount: number; description: string; date: string; categoryId: string; paymentMethod: string };

export function ExpenseForm({ categories, today, initial }: { categories: Category[]; today: string; initial?: InitialExpense }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const input = expenseInputSchema.safeParse({ ...Object.fromEntries(fields), amount: Number(fields.get("amount")) });
    if (!input.success) { setError(input.error.issues.map((issue) => issue.message).join(". ")); return; }
    setPending(true);
    setError("");
    try {
      const response = await fetch(initial ? `/api/v1/expenses/${initial.id}` : "/api/v1/expenses", {
        method: initial ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input.data),
      });
      if (!response.ok) {
        const body = await response.json();
        setError(body.error?.message ?? "No pudimos guardar el gasto.");
        return;
      }
      router.push("/expenses");
      router.refresh();
    } catch { setError("No pudimos conectar. Tus datos siguen aquí; intenta de nuevo."); }
    finally { setPending(false); }
  }

  const fieldClass = "mt-2 block min-h-11 w-full rounded border border-ink/40 bg-field px-3 py-2 text-base text-ink focus-visible:outline-2 focus-visible:outline-stamp";
  return <form onSubmit={submit} className="paper-sheet mx-auto max-w-2xl space-y-6 p-6 sm:p-9">
    <label className="block text-sm font-semibold">Monto en CLP<input name="amount" type="number" inputMode="numeric" min="1" step="1" required defaultValue={initial?.amount} className={fieldClass} placeholder="Ej. 2400" /></label>
    <label className="block text-sm font-semibold">Descripción<input name="description" required minLength={2} maxLength={160} defaultValue={initial?.description} className={fieldClass} placeholder="Ej. Café con leche" /></label>
    <div className="grid gap-6 sm:grid-cols-2">
      <label className="block text-sm font-semibold">Fecha<input name="date" type="date" required defaultValue={initial?.date ?? today} className={fieldClass} /></label>
      <label className="block text-sm font-semibold">Categoría<select name="categoryId" required defaultValue={initial?.categoryId ?? ""} className={fieldClass}><option value="" disabled>Elige una categoría</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
    </div>
    <label className="block text-sm font-semibold">Medio de pago<select name="paymentMethod" defaultValue={initial?.paymentMethod ?? "CASH"} className={fieldClass}>{Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
    {error && <p role="alert" className="text-sm text-stamp">{error}</p>}
    <button type="submit" disabled={pending || !categories.length} className="focus-ring min-h-12 w-full rounded bg-stamp px-5 py-3 text-tape disabled:opacity-50">{pending ? "Guardando…" : initial ? "Guardar cambios" : "Anotar gasto"}</button>
  </form>;
}
