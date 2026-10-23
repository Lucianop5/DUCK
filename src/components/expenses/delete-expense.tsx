"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function DeleteExpense({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function remove() {
    setPending(true);
    try {
      const response = await fetch(`/api/v1/expenses/${id}`, { method: "DELETE" });
      if (!response.ok) { setError("No pudimos eliminarlo. Intenta de nuevo."); return; }
      router.push("/expenses"); router.refresh();
    } catch { setError("No hay conexión. Intenta de nuevo."); }
    finally { setPending(false); }
  }
  return <div className="mx-auto max-w-2xl border-t border-border pt-5 text-sm">
    {confirming ? <><p>¿Eliminar este gasto? No podrás recuperarlo.</p><div className="mt-3 flex gap-4"><button type="button" disabled={pending} onClick={remove} className="focus-ring rounded bg-destructive px-4 py-3 text-primary-foreground">{pending ? "Eliminando…" : "Sí, eliminar gasto"}</button><button type="button" disabled={pending} onClick={() => setConfirming(false)} className="link-print">Cancelar</button></div></> : <button type="button" onClick={() => setConfirming(true)} className="link-print text-destructive">Eliminar gasto</button>}
    {error && <p role="alert" className="mt-3 text-destructive">{error}</p>}
  </div>;
}
