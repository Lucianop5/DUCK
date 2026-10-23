"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "next-themes";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  async function updateName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const newName = String(new FormData(event.currentTarget).get("name")).trim();
    if (newName.length < 2 || newName.length > 120) { setMessage("El nombre debe tener entre 2 y 120 caracteres."); return; }
    setPending(true);
    try {
      const result = await authClient.updateUser({ name: newName });
      setMessage(result.error ? "No pudimos actualizar el nombre. Intenta de nuevo." : "Nombre actualizado.");
      if (!result.error) router.refresh();
    } catch { setMessage("No pudimos conectar. Intenta de nuevo."); }
    finally { setPending(false); }
  }
  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const currentPassword = String(data.get("currentPassword"));
    const newPassword = String(data.get("newPassword"));
    if (newPassword !== data.get("confirmation")) { setMessage("Las contraseñas nuevas no coinciden."); return; }
    setPending(true);
    try {
      const result = await authClient.changePassword({ currentPassword, newPassword, revokeOtherSessions: true });
      setMessage(result.error ? "No pudimos cambiar la contraseña. Revisa tu contraseña actual." : "Contraseña actualizada. Las otras sesiones se cerraron.");
      if (!result.error) form.reset();
    } catch { setMessage("No pudimos conectar. Intenta de nuevo."); }
    finally { setPending(false); }
  }
  const field = "mt-2 block min-h-11 w-full rounded border border-ink/40 bg-field px-3 text-base text-ink";
  return <div className="space-y-6">
    <form onSubmit={updateName} className="paper-sheet space-y-5 p-6"><h2 className="text-2xl font-bold">Tu cuenta</h2><p className="text-sm">Correo: {email}</p><label className="block text-sm">Nombre<input name="name" autoComplete="name" minLength={2} maxLength={120} required defaultValue={name} className={field} /></label><button disabled={pending} className="focus-ring rounded bg-stamp px-5 py-3 text-sm text-tape disabled:opacity-50">Guardar nombre</button></form>
    <section className="paper-sheet space-y-5 p-6"><h2 className="text-2xl font-bold">Apariencia y formato</h2><div className="flex flex-wrap gap-3">{[{ value: "light", label: "Claro" }, { value: "dark", label: "Oscuro" }, { value: "system", label: "Usar el sistema" }].map((theme) => <button key={theme.value} type="button" onClick={() => setTheme(theme.value)} className="focus-ring rounded border border-ink/50 px-4 py-3 text-sm">{theme.label}</button>)}</div><p className="text-sm text-ink/75">Pesos chilenos (CLP), sin decimales. Zona horaria: America/Santiago.</p></section>
    <form onSubmit={changePassword} className="paper-sheet space-y-5 p-6"><h2 className="text-2xl font-bold">Cambiar contraseña</h2><label className="block text-sm">Contraseña actual<input name="currentPassword" type="password" autoComplete="current-password" required maxLength={128} className={field} /></label><label className="block text-sm">Contraseña nueva<input name="newPassword" type="password" autoComplete="new-password" required minLength={8} maxLength={128} className={field} /></label><label className="block text-sm">Repite la contraseña nueva<input name="confirmation" type="password" autoComplete="new-password" required minLength={8} maxLength={128} className={field} /></label><p className="text-xs text-ink/75">De 8 a 128 caracteres. Se cerrarán tus otras sesiones.</p><button disabled={pending} className="focus-ring rounded bg-stamp px-5 py-3 text-sm text-tape disabled:opacity-50">Cambiar contraseña</button></form>
    {message && <p role="status" className="text-sm">{message}</p>}
  </div>;
}
