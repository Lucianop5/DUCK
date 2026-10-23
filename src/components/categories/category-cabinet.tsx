"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CategoryIcon, ICON_OPTIONS } from "@/lib/icons";
import { categoryInputSchema } from "@/lib/validators/category";

type Category = { id: string; name: string; color: string; icon: string; count: number };
export function CategoryCabinet({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const editor = useRef<HTMLFormElement>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const parsed = categoryInputSchema.safeParse(Object.fromEntries(new FormData(form)));
    if (!parsed.success) { setMessage(parsed.error.issues[0].message); return; }
    setPending(true); setMessage("");
    try {
      const response = await fetch(editing ? `/api/v1/categories/${editing.id}` : "/api/v1/categories", {
        method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data),
      });
      if (!response.ok) { setMessage((await response.json()).error.message); return; }
      setEditing(null); form.reset(); router.refresh(); setMessage("Categoría guardada.");
    } catch { setMessage("No pudimos conectar. Intenta de nuevo."); }
    finally { setPending(false); }
  }
  async function remove(id: string) {
    setPending(true); setMessage("");
    try {
      const response = await fetch(`/api/v1/categories/${id}`, { method: "DELETE" });
      if (!response.ok) { setMessage((await response.json()).error.message); return; }
      setDeleting(null); if (editing?.id === id) setEditing(null); router.refresh();
    } catch { setMessage("No pudimos conectar. Intenta de nuevo."); }
    finally { setPending(false); }
  }
  const field = "mt-2 min-h-11 w-full rounded border border-ink/40 bg-field px-3 text-base text-ink";
  return <div className="space-y-7">
    <section className="paper-sheet p-4 sm:p-6" aria-label="Gabinete de categorías">
      <div className="grid grid-cols-2 border-t border-l border-ink/50 md:grid-cols-3">{categories.map((category) => <div key={category.id} className="flex min-h-44 flex-col gap-3 border-r border-b border-ink/50 p-4">
        <span className="flex items-center gap-2"><span className="size-3 rounded-full" style={{ background: category.color }} /><CategoryIcon name={category.icon} className="size-5" /></span>
        <h2 className="text-lg font-bold">{category.name}</h2><p className="text-xs text-ink/75">{category.count} gastos asociados</p>
        <div className="mt-auto flex flex-wrap gap-4 text-xs"><button type="button" onClick={() => {
          setEditing(category); setMessage("");
          requestAnimationFrame(() => {
            editor.current?.scrollIntoView({ block: "center", behavior: "instant" });
            editor.current?.querySelector<HTMLInputElement>("input[name=name]")?.focus({ preventScroll: true });
          });
        }} className="link-print">Editar</button>{deleting === category.id ? <><button type="button" disabled={pending} onClick={() => remove(category.id)} className="link-print text-stamp">Confirmar eliminación</button><button type="button" onClick={() => setDeleting(null)} className="link-print">Cancelar</button></> : <button type="button" onClick={() => setDeleting(category.id)} className="link-print text-stamp">Eliminar</button>}</div>
      </div>)}</div>
    </section>
    <form ref={editor} key={editing?.id ?? "new"} onSubmit={submit} className="paper-sheet space-y-5 p-6">
      <h2 className="text-2xl font-bold">{editing ? `Editar ${editing.name}` : "Añadir un compartimento"}</h2>
      <div className="grid gap-5 sm:grid-cols-[1fr_100px_1fr]"><label className="text-sm">Nombre<input name="name" required minLength={2} maxLength={40} defaultValue={editing?.name} className={field} /></label><label className="text-sm">Color<input type="color" name="color" defaultValue={editing?.color ?? "#17352D"} className={field} /></label><label className="text-sm">Icono<select name="icon" defaultValue={editing?.icon ?? "circle"} className={field}>{ICON_OPTIONS.map((icon) => <option key={icon}>{icon}</option>)}</select></label></div>
      <div className="flex gap-4"><button disabled={pending} className="focus-ring rounded bg-stamp px-5 py-3 text-sm text-tape disabled:opacity-50">{pending ? "Guardando…" : "Guardar categoría"}</button>{editing && <button type="button" onClick={() => setEditing(null)} className="link-print text-sm">Cancelar edición</button>}</div>
    </form>
    {message && <p role="status" className="text-sm">{message}</p>}
  </div>;
}
