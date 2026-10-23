import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entra a Gastos Hormiga para ver tu mes y tus presupuestos.",
};

export default function LoginPage() {
  return <LoginForm />;
}
