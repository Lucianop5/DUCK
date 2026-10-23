"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import { currentPeriod, formatCLP } from "@/lib/date";
import { cn } from "@/lib/utils";

const QUICK_BUDGETS = [100000, 200000, 300000] as const;

export function RegisterForm() {
  const router = useRouter();
  const period = useMemo(() => currentPeriod(), []);
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [budget, setBudget] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  function goToBudgetStep(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError("Escribe tu nombre (al menos 2 caracteres).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Escribe un correo válido, por ejemplo tu@correo.cl.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setStep(2);
  }

  async function createAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const budgetAmount = Number(budget);
    if (budget && (!Number.isFinite(budgetAmount) || budgetAmount < 0)) {
      setError("El presupuesto debe ser un monto válido.");
      return;
    }

    setPending(true);
    try {
      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (result.error) {
        setError(
          result.error.message?.toLowerCase().includes("exist")
            ? "Ya existe una cuenta con ese correo. Prueba entrar o usa otro correo."
            : "No pudimos crear la cuenta. Revisa los datos e intenta de nuevo.",
        );
        return;
      }

      if (budgetAmount > 0) {
        const response = await fetch("/api/v1/budgets", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year: period.year,
            month: period.month,
            categoryId: null,
            amount: budgetAmount,
          }),
        });

        if (!response.ok) {
          toast.warning("Tu cuenta está lista, pero el presupuesto inicial no se guardó.");
        }
      }

      toast.success("Cuenta creada. Ahora anota tu primer gasto.");
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
        <span className="print-label text-[9px]">ABRIR CUENTA</span>
        <span className="print-label text-[8px] text-ink/45">PASO 0{step} / 02</span>
      </div>

      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        <span className={cn("h-1.5 flex-1", step >= 1 ? "bg-stamp" : "bg-ink/15")} />
        <span className={cn("h-1.5 flex-1", step >= 2 ? "bg-stamp" : "bg-ink/15")} />
      </div>

      {step === 1 ? (
        <>
          <h1 className="mt-6 text-[34px] leading-[0.98] font-extrabold tracking-[-0.04em]">
            Abre la máquina.
          </h1>
          <p className="mt-3 text-[13px] leading-[1.6] text-ink/65">
            Primero, lo mínimo para que tus gastos tengan dueño. Después eliges un
            presupuesto inicial, si quieres.
          </p>

          <form onSubmit={goToBudgetStep} className="mt-7 space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="name" className="print-label text-[9px] text-ink/70">
                NOMBRE
              </Label>
              <Input
                id="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Cómo quieres que te llame"
                className="h-11 rounded-[3px] border-ink/40 bg-field px-3 text-[14px] text-ink placeholder:text-ink/70 focus-visible:border-stamp focus-visible:ring-stamp/25"
              />
            </div>

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
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="print-label text-[9px] text-ink/70">
                CONTRASEÑA
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="h-11 rounded-[3px] border-ink/40 bg-field px-3 text-[14px] text-ink placeholder:text-ink/70 focus-visible:border-stamp focus-visible:ring-stamp/25"
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
              className="h-12 w-full rounded-[3px] bg-stamp text-tape shadow-[0_4px_0_#7C2419] hover:bg-stamp/90 active:translate-y-0.5 active:shadow-[0_1px_0_#7C2419]"
            >
              <span className="print-label text-[10px]">SEGUIR AL PRESUPUESTO</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Button>
          </form>
        </>
      ) : (
        <>
          <h1 className="mt-6 text-[34px] leading-[0.98] font-extrabold tracking-[-0.04em]">
            Ponle un número
            <br />
            al mes.
          </h1>
          <p className="mt-3 text-[13px] leading-[1.6] text-ink/65">
            Un presupuesto general para {period.month}/{period.year}. Puedes
            cambiarlo o dejarlo para después.
          </p>

          <form onSubmit={createAccount} className="mt-7 space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="budget" className="print-label text-[9px] text-ink/70">
                PRESUPUESTO MENSUAL (OPCIONAL)
              </Label>
              <div className="relative">
                <span className="print-number pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[14px] text-ink/45">
                  $
                </span>
                <Input
                  id="budget"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1000}
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                  placeholder="300000"
                  className="print-number h-12 rounded-[3px] border-ink/40 bg-field pr-3 pl-7 text-[16px] text-ink placeholder:text-ink/70 focus-visible:border-stamp focus-visible:ring-stamp/25"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_BUDGETS.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setBudget(String(amount))}
                    className={cn(
                      "print-label border px-2.5 py-1.5 text-[8px] transition-colors",
                      budget === String(amount)
                        ? "border-stamp bg-stamp text-tape"
                        : "border-ink/30 text-ink/70 hover:border-ink/60 hover:text-ink",
                    )}
                  >
                    {formatCLP(amount)}
                  </button>
                ))}
              </div>
            </div>

            {budget ? (
              <div className="border border-ink/30 bg-ink/[0.03] px-3 py-2.5">
                <p className="print-label text-[8px] text-ink/50">VISTA PREVIA</p>
                <p className="mt-1 text-[12px] text-ink/70">
                  Si gastas más de{" "}
                  <span className="print-number font-semibold text-stamp">
                    {formatCLP(Number(budget) || 0)}
                  </span>
                  , la app te avisa al 80 % y al 100 %.
                </p>
              </div>
            ) : null}

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
              <span className="print-label text-[10px]">
                {budget ? "CREAR CUENTA Y EMPEZAR" : "CREAR CUENTA SIN PRESUPUESTO"}
              </span>
              {pending ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <ArrowRight aria-hidden="true" className="size-4" />
              )}
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError(null);
              }}
              className="focus-ring flex w-full items-center justify-center gap-2 text-[11px] text-ink/55 hover:text-ink"
            >
              <ArrowLeft aria-hidden="true" className="size-3.5" />
              Volver a los datos
            </button>
          </form>
        </>
      )}

      <div className="double-rule mt-7 flex flex-col gap-3 pt-4 text-[12px] text-ink/65 sm:flex-row sm:items-center sm:justify-between">
        <span>¿Ya tienes cuenta?</span>
        <Link href="/login" className="link-print font-semibold text-ink hover:text-stamp">
          Entrar
        </Link>
      </div>
    </div>
  );
}
