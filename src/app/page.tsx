import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  ChartNoAxesColumn,
  Check,
  LockKeyhole,
  ReceiptText,
  Wallet,
} from "lucide-react";

import { BrandLockup, BrandMark } from "@/components/brand/brand-mark";
import { CategoryKeys, TapeDemo } from "@/components/marketing/tape-demo";
import { formatCLP } from "@/lib/date";

export const metadata = {
  title: "DUCK — Cada gasto pequeño suma",
  description:
    "Anota tus gastos en segundos, ponle presupuesto a tus categorías y mira el mes completo sin planillas. Hecho en Chile, en pesos.",
};

const STEPS = [
  {
    number: "01",
    title: "Anota",
    copy: "Monto, categoría y listo. Sin planillas, sin cuentas cruzadas y sin decimales que no existen en Chile.",
    icon: ReceiptText,
  },
  {
    number: "02",
    title: "Pon el límite",
    copy: "Un presupuesto general y otro por categoría. La app avisa al 80 % y al 100 %, no cuando ya es tarde.",
    icon: Wallet,
  },
  {
    number: "03",
    title: "Mira el mes",
    copy: "El total, las categorías que más pesan y los gastos que se repiten. Después proyecta el año.",
    icon: ChartNoAxesColumn,
  },
] as const;

const CABINET = [
  { name: "Alimentación", amount: 82400, color: "#F97316" },
  { name: "Transporte", amount: 24730, color: "#3B82F6" },
  { name: "Vivienda", amount: 180000, color: "#8B5CF6" },
  { name: "Servicios", amount: 38900, color: "#06B6D4" },
  { name: "Ocio", amount: 41600, color: "#EC4899" },
  { name: "Salud", amount: 14990, color: "#EF4444" },
  { name: "Educación", amount: 22000, color: "#10B981" },
  { name: "Compras", amount: 18600, color: "#EAB308" },
  { name: "Otros", amount: 9350, color: "#64748B" },
] as const;

const MONTH_BARS = [
  { month: "MAY", value: 48 },
  { month: "JUN", value: 62 },
  { month: "JUL", value: 55 },
  { month: "AGO", value: 78 },
  { month: "SEP", value: 66 },
  { month: "OCT", value: 83 },
] as const;

export default function Home() {
  return (
    <main className="landing-world machine-panel relative min-h-dvh overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-tape/20"
      />

      <header className="relative z-20 mx-auto flex h-20 max-w-[1440px] items-center justify-between gap-3 border-b border-tape/15 px-4 sm:px-10 lg:h-24 lg:px-12">
        <Link href="/" aria-label="DUCK, inicio" className="focus-ring">
          <BrandLockup className="max-sm:[&>span:last-child]:hidden" />
        </Link>

        <nav
          aria-label="Navegación principal"
          className="hidden items-center gap-8 text-[12px] tracking-[0.06em] text-tape/75 md:flex"
        >
          <a className="link-print transition-colors hover:text-tape" href="#como-funciona">
            Cómo funciona
          </a>
          <a className="link-print transition-colors hover:text-tape" href="#categorias">
            Categorías
          </a>
          <a className="link-print transition-colors hover:text-tape" href="#analitica">
            Analítica
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="focus-ring hidden text-[12px] tracking-[0.06em] text-tape/80 underline-offset-4 hover:text-tape hover:underline sm:block"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="focus-ring inline-flex h-10 items-center justify-center rounded-[3px] border border-tape/40 px-4 text-[11px] font-semibold tracking-[0.08em] text-tape transition-colors hover:border-tape hover:bg-tape hover:text-machine"
          >
            Crear cuenta
          </Link>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-6 pt-10 pb-20 sm:px-10 lg:min-h-[calc(100dvh-6rem)] lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)_minmax(0,250px)] lg:gap-10 lg:px-12 lg:pt-6 lg:pb-14">
        <div className="order-2 flex flex-col items-start gap-6 lg:order-1">
          <h1 className="text-[clamp(2.9rem,6vw,4.3rem)] leading-[0.94] font-extrabold tracking-[-0.045em] text-tape">
            Cada gasto
            <br />
            pequeño
            <br />
            suma.
          </h1>
          <p className="max-w-[330px] text-[16px] leading-[1.6] text-tape/75">
            Anota en segundos, ponle presupuesto a tus categorías y mira el mes
            completo sin planillas.
          </p>
          <div className="flex flex-col items-start gap-4">
            <Link
              href="/register"
              className="focus-ring group inline-flex h-14 w-full max-w-[310px] items-center justify-between gap-4 rounded-[4px] bg-stamp px-5 text-tape shadow-[0_5px_0_#7C2419] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#7C2419]"
            >
              <span className="print-label text-[10px]">ANOTAR MI PRIMER GASTO</span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/login"
              className="focus-ring link-print text-[12px] tracking-[0.04em] text-tape/75 hover:text-tape"
            >
              Ya tengo cuenta
            </Link>
          </div>
          <p className="print-label text-[9px] leading-[1.8] text-tape/45">
            HECHO EN CHILE · MONTOS EN CLP
            <br />
            DEMO CON DATOS DE EJEMPLO
          </p>
        </div>

        <div className="order-1 w-full max-w-[560px] justify-self-center lg:order-2">
          <TapeDemo />
        </div>

        <aside className="order-3 hidden flex-col gap-5 lg:flex">
          <div className="flex items-center justify-between border-b border-tape/20 pb-3">
            <span className="print-label text-[10px] text-tape/60">CATEGORÍAS</span>
            <span className="print-label text-[9px] text-tape/40">09 TECLAS</span>
          </div>
          <CategoryKeys />
          <p className="max-w-[190px] text-[11px] leading-[1.55] text-tape/50">
            Nueve categorías listas al crear tu cuenta. Tú decides cuáles quedan.
          </p>
          <div className="mt-auto border-t border-tape/15 pt-4">
            <p className="print-label text-[8px] leading-[1.9] text-tape/35">
              MÁQUINA SUMADORA
              <br />
              MODELO DUCK-09 · SANTIAGO
            </p>
          </div>
        </aside>
      </section>

      <section
        id="como-funciona"
        className="relative z-10 border-t border-tape/15 bg-machine-deep/55"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.6fr] lg:items-end">
            <div>
              <h2 className="mt-4 text-[clamp(2rem,4vw,3rem)] leading-[0.98] font-extrabold tracking-[-0.04em] text-tape">
                Tres gestos.
                <br />
                Cero planillas.
              </h2>
            </div>
            <p className="max-w-[560px] text-[15px] leading-[1.65] text-tape/60 lg:justify-self-end">
              La app no te pide que cambies tu vida financiera. Te pide que anotes
              lo que ya gastas y que decidas un límite antes de que el mes decida
              por ti.
            </p>
          </div>

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.number}
                  className="paper-sheet relative flex flex-col gap-5 p-6 pt-7 md:min-h-[270px]"
                  style={{ transform: `rotate(${index === 1 ? 0.4 : index === 2 ? -0.5 : 0}deg)` }}
                >
                  <div className="flex items-start justify-between border-b border-ink/60 pb-3">
                    <span className="print-label text-[9px]">{step.number} / 03</span>
                    <Icon aria-hidden="true" className="size-4 text-stamp" />
                  </div>
                  <div>
                    <h3 className="text-[26px] leading-none font-extrabold tracking-[-0.03em]">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-[13.5px] leading-[1.6] text-ink/70">
                      {step.copy}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="mt-auto h-1.5 w-full border border-ink/50 bg-[repeating-linear-gradient(90deg,var(--stamp)_0_8px,transparent_8px_13px)] opacity-70"
                  />
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <section id="categorias" className="relative z-10 border-t border-tape/15">
        <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-20 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16 lg:px-12 lg:py-24">
          <div>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.1rem)] leading-[0.98] font-extrabold tracking-[-0.04em] text-tape">
              Cada peso tiene
              <br />
              su compartimento.
            </h2>
            <p className="mt-5 max-w-[420px] text-[15px] leading-[1.65] text-tape/60">
              Alimentación, transporte, vivienda, servicios y las demás categorías
              de todos los días conviven en un solo mueble. Ves cuánto pesa cada
              una sin abrir cinco pantallas.
            </p>
            <ul className="mt-7 space-y-3 text-[13px] text-tape/70">
              {[
                "Nueve categorías creadas al registrarte",
                "Puedes editar nombre, color e icono",
                "Presupuesto independiente por categoría",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-stamp" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="paper-sheet p-3 sm:p-4">
            <div className="flex items-center justify-between border-b border-ink/60 px-2 pb-3">
              <span className="print-label text-[9px]">GABINETE · OCT 2026</span>
              <span className="print-label text-[8px] text-ink/50">DATOS DE EJEMPLO</span>
            </div>
            <div className="mt-3 grid grid-cols-3 border-t border-l border-ink/60">
              {CABINET.map((category) => (
                <div
                  key={category.name}
                  className="relative flex min-h-[104px] flex-col justify-between border-r border-b border-ink/60 p-3"
                  style={{ backgroundColor: `${category.color}12` }}
                >
                  <span
                    aria-hidden="true"
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <p className="text-[11px] leading-tight font-semibold">{category.name}</p>
                    <p className="print-number mt-1 text-[12px] text-ink/65">
                      {formatCLP(category.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="double-rule mt-3 flex items-baseline justify-between px-2 pt-2">
              <span className="print-label text-[9px]">TOTAL DEL MES</span>
              <span className="print-number text-[20px] text-stamp">{formatCLP(430570)}</span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="analitica"
        className="relative z-10 border-t border-tape/15 bg-machine-deep/55"
      >
        <div className="mx-auto max-w-[1440px] px-6 py-20 sm:px-10 lg:px-12 lg:py-24">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="mt-4 max-w-[700px] text-[clamp(2rem,4vw,3.1rem)] leading-[0.98] font-extrabold tracking-[-0.04em] text-tape">
                El hábito primero.
                <br />
                La proyección después.
              </h2>
            </div>
            <p className="max-w-[380px] text-[14px] leading-[1.6] text-tape/55">
              La analítica no adivina: muestra lo que anotaste. El simulador toma
              ese comportamiento y te deja probar un escenario antes de vivirlo.
            </p>
          </div>

          <div className="mt-11 grid gap-5 lg:grid-cols-2">
            <article className="paper-sheet p-6 sm:p-7">
              <div className="flex items-start justify-between border-b border-ink/60 pb-3">
                <div>
                  <p className="print-label text-[9px]">ANALÍTICA · ÚLTIMOS 6 MESES</p>
                  <h3 className="mt-2 text-[22px] font-extrabold tracking-[-0.03em]">
                    El mes, en barras
                  </h3>
                </div>
                <ChartNoAxesColumn aria-hidden="true" className="size-5 text-stamp" />
              </div>
              <div className="mt-6 flex h-[190px] items-end gap-3 border-b border-ink/50 pb-2">
                {MONTH_BARS.map((bar) => (
                  <div key={bar.month} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="print-number text-[9px] text-ink/55">{bar.value}%</span>
                    <span
                      aria-hidden="true"
                      className="w-full border border-ink/60 bg-[repeating-linear-gradient(135deg,var(--stamp)_0_3px,transparent_3px_6px)]"
                      style={{ height: `${bar.value}%` }}
                    />
                    <span className="print-label text-[8px]">{bar.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="print-label text-[9px]">PROMEDIO MENSUAL</span>
                <span className="print-number text-[18px]">{formatCLP(265400)}</span>
              </div>
              <p className="print-label mt-4 text-[8px] text-ink/45">DATOS DE EJEMPLO</p>
            </article>

            <article className="paper-sheet p-6 sm:p-7">
              <div className="flex items-start justify-between border-b border-ink/60 pb-3">
                <div>
                  <p className="print-label text-[9px]">SIMULADOR · 12 MESES</p>
                  <h3 className="mt-2 text-[22px] font-extrabold tracking-[-0.03em]">
                    ¿Y si ajustas una categoría?
                  </h3>
                </div>
                <Calculator aria-hidden="true" className="size-5 text-stamp" />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="border border-ink/60 p-3">
                  <p className="print-label text-[8px] text-ink/55">BASE MENSUAL</p>
                  <p className="print-number mt-2 text-[22px]">{formatCLP(248730)}</p>
                </div>
                <div className="border border-ink/60 bg-stamp/10 p-3">
                  <p className="print-label text-[8px] text-stamp">CON AJUSTE</p>
                  <p className="print-number mt-2 text-[22px] text-stamp">{formatCLP(223857)}</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {[
                  { label: "Alimentación", value: "-15 %", width: "72%" },
                  { label: "Ocio", value: "-20 %", width: "54%" },
                  { label: "Transporte", value: "sin cambio", width: "100%" },
                ].map((row) => (
                  <div key={row.label} className="grid grid-cols-[1fr_auto] gap-2">
                    <div>
                      <div className="flex items-baseline justify-between text-[11px]">
                        <span>{row.label}</span>
                        <span className="print-number text-[10px] text-ink/55">{row.value}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 border border-ink/40 bg-tape-dim">
                        <span
                          aria-hidden="true"
                          className="block h-full bg-machine"
                          style={{ width: row.width }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="double-rule mt-5 flex items-baseline justify-between pt-2">
                <span className="print-label text-[9px]">AHORRO ANUAL PROYECTADO</span>
                <span className="print-number text-[18px] text-stamp">{formatCLP(298476)}</span>
              </div>
              <p className="print-label mt-4 text-[8px] text-ink/45">
                DATOS DE EJEMPLO · NO ES UNA PROMESA
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-tape/15">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center px-6 py-20 text-center sm:px-10 lg:py-28">
          <BrandMark className="size-12 text-[16px]" />
          <h2 className="mt-4 max-w-[760px] text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] font-extrabold tracking-[-0.045em] text-tape">
            El mes se arma solo.
            <br />
            Tú solo anotas.
          </h2>
          <p className="mt-5 max-w-[440px] text-[15px] leading-[1.65] text-tape/60">
            Crea tu cuenta, elige tu primer presupuesto y anota lo próximo que
            compres. Sin tarjeta, sin planillas y sin decimales.
          </p>
          <Link
            href="/register"
            className="focus-ring mt-9 inline-flex h-14 items-center justify-center gap-3 rounded-[4px] bg-stamp px-7 text-tape shadow-[0_5px_0_#7C2419] transition-transform hover:-translate-y-0.5 active:translate-y-1 active:shadow-[0_1px_0_#7C2419]"
          >
            <span className="print-label text-[10px]">CREAR MI CUENTA</span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <p className="mt-6 flex items-center gap-2 text-[11px] text-tape/45">
            <LockKeyhole aria-hidden="true" className="size-3.5" />
            Tus datos son privados y solo tuyos.
          </p>
        </div>
      </section>

      <footer className="relative z-10 border-t border-tape/15">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-6 py-8 sm:px-10 md:flex-row md:items-center md:justify-between lg:px-12">
          <div className="flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-[11px] font-bold tracking-[0.16em]">DUCK</p>
              <p className="print-label mt-1 text-[8px] text-tape/40">
                HECHO EN CHILE · MONTOS EN CLP
              </p>
            </div>
          </div>
          <nav aria-label="Enlaces del pie" className="flex flex-wrap gap-5 text-[11px] text-tape/55">
            <a className="link-print hover:text-tape" href="#como-funciona">
              Cómo funciona
            </a>
            <a className="link-print hover:text-tape" href="#categorias">
              Categorías
            </a>
            <Link className="link-print hover:text-tape" href="/login">
              Entrar
            </Link>
            <Link className="link-print hover:text-tape" href="/register">
              Crear cuenta
            </Link>
          </nav>
          <p className="print-label text-[8px] text-tape/35">
            PROYECTO REAL EN DESARROLLO · 2026
          </p>
        </div>
      </footer>
    </main>
  );
}
