"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { budgetInputSchema } from "@/lib/validators/budget";
import type { BudgetSummary } from "@/lib/services/budgets";
import { formatCLP, formatPercent } from "@/lib/date";

export function BudgetLedger({ budgets, categories, year, month }: {
  budgets: BudgetSummary[]; categories: { id: string; name: string }[]; year: number; month: number;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const parsed = budgetInputSchema.safeParse({ year, month, categoryId: form.get("categoryId") || null, amount: Number(form.get("amount")) });
    if (!parsed.success) { setMessage(parsed.error.issues[0].message); return; }
    setPending(true); setMessage("");
    try {
      const response = await fetch("/api/v1/budgets", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data) });
      if (!response.ok) { setMessage((await response.json()).error.message); return; }
      router.refresh(); setMessage("Presupuesto guardado.");
    } catch { setMessage("No hay conexión. Intenta de nuevo."); }
    finally { setPending(false); }
  }
  async function remove(id: string) {
    setPending(true);
    try {
      const response = await fetch(`/api/v1/budgets/${id}`, { method: "DELETE" });
      if (!response.ok) { setMessage("No pudimos eliminar el presupuesto."); return; }
      setDeleting(null); router.refresh();
    } catch { setMessage("No hay conexión. Intenta de nuevo."); }
    finally { setPending(false); }
  }
  const field = "mt-2 min-h-11 w-full rounded border border-ink/40 bg-field px-3 text-base text-ink";
  return <div className="space-y-7">
    <section className="paper-sheet divide-y divide-ink/30 px-6" aria-label="Presupuestos del mes">
      {!budgets.length && <p className="py-8 text-sm">Todavía no definiste límites para este mes. Crea el presupuesto general o uno por categoría.</p>}
      {budgets.map((budget) => <div key={budget.id} className="py-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3"><h2 className="text-xl font-bold">{budget.category?.name ?? "Presupuesto general"}</h2><span className="print-number">{formatCLP(budget.spent)} / {formatCLP(budget.amount)}</span></div>
        <div className="relative mt-4 h-6 border border-ink/50 bg-tape-dim" role="img" aria-label={`${formatPercent(budget.percentage, 1)} usado`}><div className="absolute inset-y-0 left-0 bg-machine" style={{ width: `${Math.min(100, budget.percentage)}%` }} /></div>
        <p className="mt-2 text-sm">{formatPercent(budget.percentage, 1)} usado · {budget.remaining < 0 ? `${formatCLP(-budget.remaining)} de exceso` : `${formatCLP(budget.remaining)} disponibles`}</p>
        {budget.status !== "ok" && <p className="mt-2 font-semibold text-stamp">{budget.status === "exceeded" ? "Llegaste al 100 % del presupuesto." : "Atención: ya usaste al menos el 80 %."}</p>}
        <div className="mt-3 flex gap-4 text-xs">{deleting === budget.id ? <><button type="button" disabled={pending} onClick={() => remove(budget.id)} className="link-print text-stamp">Confirmar eliminación</button><button type="button" onClick={() => setDeleting(null)} className="link-print">Cancelar</button></> : <button type="button" onClick={() => setDeleting(budget.id)} className="link-print text-stamp">Eliminar presupuesto</button>}</div>
      </div>)}
    </section>
    <form onSubmit={save} className="paper-sheet space-y-5 p-6"><h2 className="text-2xl font-bold">Define o cambia un límite.</h2><p className="text-sm text-ink/75">Si ya hay un presupuesto para la categoría seleccionada, el nuevo monto lo reemplaza.</p><div className="grid gap-5 sm:grid-cols-2"><label className="text-sm">Alcance<select name="categoryId" className={field}><option value="">General (todos los gastos)</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="text-sm">Límite en CLP<input type="number" inputMode="numeric" name="amount" required min="1" step="1" className={field} /></label></div><button disabled={pending} className="focus-ring rounded bg-stamp px-5 py-3 text-sm text-tape disabled:opacity-50">{pending ? "Guardando…" : "Guardar presupuesto"}</button></form>
    {message && <p role="status" className="text-sm">{message}</p>}
  </div>;
}
