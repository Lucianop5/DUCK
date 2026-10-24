"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Calculator,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  ReceiptText,
  Settings,
  Wallet,
} from "lucide-react";

import { BrandLockup } from "@/components/brand/brand-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/expenses", label: "Gastos", icon: ReceiptText },
  { href: "/budgets", label: "Presupuestos", icon: Wallet },
  { href: "/categories", label: "Categorías", icon: FolderOpen },
  { href: "/analytics", label: "Analítica", icon: BarChart3 },
  { href: "/simulator", label: "Simulador", icon: Calculator },
  { href: "/settings", label: "Ajustes", icon: Settings },
] as const;

type ShellUser = {
  name: string;
  email: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegación de la app" className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring group flex items-center gap-3 rounded-[3px] px-3 py-2.5 text-[12.5px] tracking-[0.02em] transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-foreground shadow-[inset_3px_0_0_var(--sidebar-primary)]"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <Icon aria-hidden="true" className="size-4 shrink-0" />
            {item.label}
            {active ? (
              <span
                aria-hidden="true"
                className="ml-auto size-1.5 rounded-full bg-sidebar-primary"
              />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

function UserCard({ user }: { user: ShellUser }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="border-t border-sidebar-border pt-4">
      <div className="flex items-center gap-3 px-2">
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-sidebar-border font-print text-[11px]">
          {initials(user.name) || "D"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[12px] font-semibold">{user.name}</p>
          <p className="truncate text-[10px] text-sidebar-foreground/45">{user.email}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          onClick={handleSignOut}
          disabled={pending}
          className="focus-ring inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-[3px] border border-sidebar-border px-3 text-[10px] tracking-[0.08em] text-sidebar-foreground/60 uppercase transition-colors hover:border-sidebar-foreground/30 hover:text-sidebar-foreground disabled:opacity-50"
        >
          <LogOut aria-hidden="true" className="size-3.5" />
          {pending ? "Saliendo" : "Salir"}
        </button>
      </div>
    </div>
  );
}

export function AppShell({
  user,
  children,
}: {
  user: ShellUser;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-sidebar-border bg-sidebar p-4 text-sidebar-foreground lg:flex">
        <Link href="/dashboard" className="focus-ring px-2 py-2" aria-label="DUCK">
          <BrandLockup />
        </Link>

        <Link
          href="/expenses/new"
          className="focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-[3px] bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_4px_0_#7C2419] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[0_1px_0_#7C2419]"
        >
          <Plus aria-hidden="true" className="size-4" />
          <span className="print-label text-[9px]">NUEVO GASTO</span>
        </Link>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto">
          <div>
            <p className="print-label mb-2 px-3 text-[8px] text-sidebar-foreground/35">
              MÁQUINA
            </p>
            <NavList />
          </div>
          <div className="mt-auto px-3">
            <p className="print-label border-t border-sidebar-border pt-4 text-[8px] leading-[1.9] text-sidebar-foreground/30">
              DUCK
              <br />
              CLP · AMÉRICA/SANTIAGO
            </p>
          </div>
        </div>

        <UserCard user={user} />
      </aside>

      <div className="flex min-h-dvh flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-sidebar-border bg-sidebar px-4 text-sidebar-foreground lg:hidden">
          <div className="flex items-center gap-2">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Abrir menú"
                  className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
                >
                  <Menu aria-hidden="true" className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[290px] border-sidebar-border bg-sidebar p-4 text-sidebar-foreground"
              >
                <SheetHeader className="p-0">
                  <SheetTitle className="sr-only">Menú de DUCK</SheetTitle>
                </SheetHeader>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="focus-ring mb-4 border-b border-sidebar-border pb-4"
                >
                  <BrandLockup />
                </Link>
                <NavList onNavigate={() => setOpen(false)} />
                <div className="mt-auto">
                  <UserCard user={user} />
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" aria-label="DUCK">
              <BrandLockup className="scale-90 origin-left" />
            </Link>
          </div>

          <Link
            href="/expenses/new"
            className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-[3px] bg-sidebar-primary px-3 text-sidebar-primary-foreground"
          >
            <Plus aria-hidden="true" className="size-4" />
            <span className="print-label text-[8px]">GASTO</span>
          </Link>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-9 lg:py-8 xl:px-12">
          <div className="mx-auto w-full max-w-[1280px]">{children}</div>
        </main>

        <footer className="border-t border-border px-4 py-4 text-center lg:px-9">
          <p className="print-label text-[8px] text-muted-foreground/60">
            DUCK · CLP · HECHO EN CHILE
          </p>
        </footer>
      </div>
    </div>
  );
}
