import type { Metadata } from "next";

import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Crear cuenta",
  description:
    "Crea tu cuenta de DUCK, elige un presupuesto inicial y empieza a anotar.",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
