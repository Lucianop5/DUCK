import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { listExpenses } from "@/lib/services/expenses";
import { listCategories } from "@/lib/services/categories";
import { expenseQuerySchema } from "@/lib/validators/expense";
import { formatCLP, formatDateShort } from "@/lib/date";
import { PageHeader, EmptyTape } from "@/components/layout/page-header";

export const metadata = { title: "Gastos" };
export default async function ExpensesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const user = await requireUser();
  const raw = await searchParams;
  const cleaned = Object.fromEntries(Object.entries(raw).filter(([, value]) => typeof value === "string" && value !== ""));
  const parsed = expenseQuerySchema.safeParse(cleaned);
  const query = parsed.success ? parsed.data : expenseQuerySchema.parse({});
  const [data, categories] = await Promise.all([listExpenses(user.id, query), listCategories(user.id)]);
  const pageHref = (page: number) => {
    const params = new URLSearchParams(Object.entries(cleaned) as [string, string][]);
    params.set("page", String(page));
    return `/expenses?${params.toString()}` as const;
  };
  const fieldClass = "min-h-11 rounded border border-ink/40 bg-field px-3 text-sm text-ink";
  return <div className="space-y-7">
    <PageHeader kicker="MOVIMIENTOS" title="Tu historial." description="Busca, filtra y revisa cada línea de la cinta." actions={<Link href="/expenses/new" className="rounded bg-stamp px-4 py-3 text-sm text-tape">Anotar gasto</Link>} />
    <form className="paper-sheet grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
      <label className="grid gap-2 text-xs">Buscar<input name="q" defaultValue={query.q} placeholder="Descripción del gasto" className={fieldClass} /></label>
      <label className="grid gap-2 text-xs">Categoría<select name="categoryId" defaultValue={query.categoryId ?? ""} className={fieldClass}><option value="">Todas las categorías</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      <label className="grid gap-2 text-xs">Orden<select name="sort" defaultValue={query.sort} className={fieldClass}><option value="date_desc">Más recientes</option><option value="date_asc">Más antiguos</option><option value="amount_desc">Mayor monto</option><option value="amount_asc">Menor monto</option></select></label>
      <label className="grid gap-2 text-xs">Desde<input type="date" name="from" defaultValue={query.from} className={fieldClass} /></label>
      <label className="grid gap-2 text-xs">Hasta<input type="date" name="to" defaultValue={query.to} className={fieldClass} /></label>
      <div className="flex items-end gap-4"><button className="focus-ring min-h-11 rounded bg-machine px-5 text-sm text-tape">Aplicar filtros</button><Link href="/expenses" className="link-print py-3 text-sm">Limpiar</Link></div>
    </form>
    {!parsed.success && <p role="alert" className="text-sm text-destructive">Los filtros no son válidos. Mostramos todos los gastos; revisa las fechas e intenta de nuevo.</p>}
    {data.items.length === 0 ? <EmptyTape title="No hay gastos para mostrar." copy="Prueba otros filtros o anota un gasto para empezar tu historial." /> : <section className="paper-sheet p-5 sm:p-7">
      <div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Historial de gastos</caption><thead className="border-b border-ink/70"><tr>{["Fecha", "Descripción", "Categoría", "Monto", ""].map((title, i) => <th key={i} scope="col" className="px-2 py-3 font-semibold">{title}</th>)}</tr></thead><tbody>{data.items.map((expense) => <tr key={expense.id} className="border-b border-dotted border-ink/30"><td className="whitespace-nowrap px-2 py-4">{formatDateShort(expense.date)}</td><td className="min-w-40 px-2 py-4">{expense.description}</td><td className="px-2 py-4">{expense.category.name}</td><td className="print-number whitespace-nowrap px-2 py-4">{formatCLP(Number(expense.amount))}</td><td className="px-2 py-4"><Link href={`/expenses/${expense.id}/edit`} className="link-print" aria-label={`Editar ${expense.description}`}>Editar</Link></td></tr>)}</tbody></table></div>
      <nav aria-label="Páginas de gastos" className="mt-5 flex items-center justify-between gap-3 text-sm">{query.page > 1 ? <Link href={pageHref(query.page - 1)} className="link-print">Anterior</Link> : <span />}<span>{data.meta.total} gastos · Página {query.page} de {data.meta.totalPages}</span>{query.page < data.meta.totalPages ? <Link href={pageHref(query.page + 1)} className="link-print">Siguiente</Link> : <span />}</nav>
    </section>}
  </div>;
}
