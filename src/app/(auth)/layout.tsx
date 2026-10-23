import Link from "next/link";
import { redirect } from "next/navigation";

import { BrandLockup } from "@/components/brand/brand-mark";
import { TapeDemo } from "@/components/marketing/tape-demo";
import { getSessionUser } from "@/lib/auth/session";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (user) redirect("/dashboard");

  return (
    <main className="landing-world machine-panel grid min-h-dvh lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden flex-col justify-between border-r border-tape/15 p-10 lg:flex xl:p-14">
        <Link href="/" className="focus-ring w-fit" aria-label="Volver a Gastos Hormiga">
          <BrandLockup />
        </Link>

        <div className="max-w-[430px]">
          <p className="print-label text-[10px] text-stamp">LA CUENTA EMPIEZA AQUÍ</p>
          <h1 className="mt-5 text-[clamp(2.4rem,4vw,3.6rem)] leading-[0.95] font-extrabold tracking-[-0.045em]">
            Tu primer gasto
            <br />
            es el que abre
            <br />
            el mes.
          </h1>
          <p className="mt-5 text-[14px] leading-[1.65] text-tape/60">
            Crea la cuenta, elige un presupuesto inicial y deja que la máquina
            empiece a sumar. Sin planillas y sin decimales que no existen.
          </p>
        </div>

        <div className="max-w-[420px]">
          <TapeDemo animate={false} />
          <p className="print-label mt-6 text-[8px] text-tape/35">
            DEMO CON DATOS DE EJEMPLO · MONTOS EN CLP
          </p>
        </div>
      </section>

      <section className="flex min-h-dvh flex-col bg-background text-foreground">
        <div className="flex items-center justify-between gap-4 border-b border-border/70 px-6 py-5 lg:hidden">
          <Link href="/" aria-label="Volver a Gastos Hormiga">
            <BrandLockup tone="ink" className="text-ink" />
          </Link>
          <Link href="/" className="text-[11px] text-muted-foreground underline underline-offset-4">
            Volver
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[460px]">{children}</div>
        </div>
        <p className="print-label px-6 py-5 text-center text-[8px] text-muted-foreground/70">
          HECHO EN CHILE · TUS DATOS SON PRIVADOS
        </p>
      </section>
    </main>
  );
}
