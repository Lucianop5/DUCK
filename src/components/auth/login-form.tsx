"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Escribe tu correo y tu contraseña.");
      return;
    }

    setPending(true);
    try {
      const result = await signIn.email({ email: email.trim(), password });
      if (result.error) {
        setError("El correo o la contraseña no coinciden. Intenta de nuevo.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("No pudimos conectar con el servidor. Intenta de nuevo.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="paper-sheet tape-holes p-7 sm:p-9">
      <div className="flex items-baseline justify-between border-b border-ink/60 pb-3">
        <span className="print-label text-[9px]">ACCESO</span>
        <span className="print-label text-[8px] text-ink/45">DUCK-09</span>
      </div>

      <h1 className="mt-6 text-[34px] leading-[0.98] font-extrabold tracking-[-0.04em]">
        Vuelve a tu mes.
      </h1>
      <p className="mt-3 text-[13px] leading-[1.6] text-ink/65">
        Entra para ver el total, tus categorías y lo que queda del presupuesto.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="print-label text-[9px] text-ink/70">
            CORREO
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="tu@correo.cl"
            className="h-11 rounded-[3px] border-ink/40 bg-field px-3 text-[14px] text-ink placeholder:text-ink/70 focus-visible:border-stamp focus-visible:ring-stamp/25"
            aria-invalid={Boolean(error)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="print-label text-[9px] text-ink/70">
            CONTRASEÑA
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Mínimo 8 caracteres"
            className="h-11 rounded-[3px] border-ink/40 bg-field px-3 text-[14px] text-ink placeholder:text-ink/70 focus-visible:border-stamp focus-visible:ring-stamp/25"
            aria-invalid={Boolean(error)}
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="border border-stamp/60 bg-stamp/10 px-3 py-2 text-[12px] leading-[1.5] text-stamp"
          >
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          disabled={pending}
          className="h-12 w-full rounded-[3px] bg-stamp text-tape shadow-[0_4px_0_#7C2419] hover:bg-stamp/90 active:translate-y-0.5 active:shadow-[0_1px_0_#7C2419]"
        >
          <span className="print-label text-[10px]">ENTRAR A MI MES</span>
          {pending ? (
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          ) : (
            <ArrowRight aria-hidden="true" className="size-4" />
          )}
        </Button>
      </form>

      <div className="double-rule mt-7 flex flex-col gap-3 pt-4 text-[12px] text-ink/65 sm:flex-row sm:items-center sm:justify-between">
        <span>¿Todavía no tienes cuenta?</span>
        <Link
          href="/register"
          className="link-print font-semibold text-ink hover:text-stamp"
        >
          Crear una cuenta
        </Link>
      </div>
    </div>
  );
}
