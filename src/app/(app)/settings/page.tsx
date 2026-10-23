import { requireUser } from "@/lib/auth/session";
import { PageHeader } from "@/components/layout/page-header";
import { ProfileForm } from "@/components/settings/profile-form";

export const metadata = { title: "Ajustes" };
export default async function SettingsPage() {
  const user = await requireUser();
  return <div className="mx-auto max-w-3xl space-y-7"><PageHeader kicker="CUENTA" title="A tu manera." description="Actualiza tu nombre, cambia tu contraseña y elige la apariencia." /><ProfileForm name={user.name} email={user.email} /></div>;
}
