"use client";

import { useState } from "react";
import type { SimulatorResult } from "@/lib/services/analytics";
import { formatCLP, formatPercent } from "@/lib/date";

export function SimulatorForm({ initial, year, month }: { initial: SimulatorResult; year: number; month: number }) {
  const [result, setResult] = useState(initial);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true); setError("");
    try {
      const response = await fetch("/api/v1/simulator", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ year, month, months: Number(form.get("months")), basis: form.get("basis"), extraMonthly: Number(form.get("extraMonthly")), adjustments: initial.byCategory.map((category) => ({ categoryId: category.categoryId, percent: Number(form.get(category.categoryId)) })) }) });
      const body = await response.json();
      if (!response.ok) { setError(body.error?.message ?? "Revisa los ajustes."); return; }
      setResult(body.data);
    } catch { setError("No pudimos conectar. Intenta de nuevo."); }
    finally { setPending(false); }
  }
  const field = "mt-2 min-h-11 w-full rounded border border-ink/40 bg-field px-3 text-base text-ink";
  return <div className="grid items-start gap-6 xl:grid-cols-[1.1fr_1fr]">
    <form onSubmit={submit} className="paper-sheet space-y-6 p-6"><h2 className="text-2xl font-bold">Prueba un escenario.</h2><p className="text-sm text-ink/75">Los cambios no modifican tus gastos ni presupuestos.</p><label className="block text-sm">Base de cálculo<select name="basis" defaultValue="selected_month" className={field}><option value="selected_month">Gastos del mes seleccionado</option><option value="last_months">Promedio de los tres meses anteriores</option></select></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm">Horizonte<select name="months" defaultValue="12" className={field}><option value="1">Un mes</option><option value="12">Un año (12 meses)</option><option value="24">Dos años (24 meses)</option></select></label><label className="text-sm">Extra mensual en CLP<input name="extraMonthly" type="number" min="0" max="9999999999" step="1" defaultValue="0" className={field} /></label></div>
    <fieldset className="space-y-3"><legend className="mb-3 text-lg font-bold">Ajustes por categoría</legend><p className="text-xs text-ink/75">Un porcentaje negativo reduce el gasto. Rango: −100 % a +500 %.</p>{initial.byCategory.map((category) => <label key={category.categoryId} className="grid grid-cols-[1fr_95px] items-center gap-3 text-sm"><span>{category.name}</span><input aria-label={`Ajuste porcentual de ${category.name}`} name={category.categoryId} type="number" min="-100" max="500" defaultValue="0" className={field} /></label>)}</fieldset>
    {error && <p role="alert" className="text-sm text-stamp">{error}</p>}<button disabled={pending} className="focus-ring w-full rounded bg-stamp px-5 py-3 text-tape disabled:opacity-50">{pending ? "Calculando…" : "Calcular proyección"}</button></form>
    <section aria-live="polite" className="paper-sheet p-6"><h2 className="text-2xl font-bold">Resultado del escenario</h2><p className="mt-2 text-sm">{result.months} {result.months === 1 ? "mes" : "meses"} · {result.label}</p><dl className="mt-6 divide-y divide-ink/30">{[["Sin ajustes", result.totalBase], ["Con ajustes", result.totalProjected], [result.difference <= 0 ? "Reducción proyectada" : "Aumento proyectado", Math.abs(result.difference)]].map(([label, amount]) => <div key={String(label)} className="flex flex-wrap items-baseline justify-between gap-3 py-5"><dt className="text-sm">{label}</dt><dd className="print-number text-2xl text-stamp">{formatCLP(Number(amount))}</dd></div>)}</dl><p className="double-rule pt-4 text-sm">Variación: {formatPercent(result.differencePercentage, 1)}.</p><p className="mt-5 text-xs leading-relaxed text-ink/75">Proyección determinista, no una promesa de ahorro. Cada mes repite la base con tus ajustes y el monto extra. El promedio de tres meses incluye los meses sin registros; si no hay historial, usa el mes seleccionado.</p><ul className="mt-6 divide-y divide-dotted divide-ink/30">{result.byCategory.filter((category) => category.base > 0 || category.projected > 0).map((category) => <li key={category.categoryId} className="flex justify-between gap-3 py-3 text-sm"><span>{category.name}</span><span>{formatCLP(category.base)} → {formatCLP(category.projected)}</span></li>)}</ul></section>
  </div>;
}
