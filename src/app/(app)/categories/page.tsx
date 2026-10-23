import { requireUser } from "@/lib/auth/session";
import { listCategories } from "@/lib/services/categories";
import { PageHeader } from "@/components/layout/page-header";
import { CategoryCabinet } from "@/components/categories/category-cabinet";

export const metadata = { title: "Categorías" };
export default async function CategoriesPage() {
  const user = await requireUser();
  const categories = await listCategories(user.id);
  return <div className="space-y-7"><PageHeader kicker="GABINETE" title="Cada gasto en su lugar." description="Edita tus categorías. Para eliminar una, primero retira sus gastos y presupuestos asociados." /><CategoryCabinet categories={categories.map((category) => ({ id: category.id, name: category.name, color: category.color, icon: category.icon, count: category._count.expenses }))} /></div>;
}
