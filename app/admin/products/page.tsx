import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrCreateDefaultCompetition } from "@/actions/competition";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { AdminProductManager } from "@/components/AdminProductManager";

export default async function AdminProductsPage() {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    redirect("/admin");
  }

  const competition = await getOrCreateDefaultCompetition();
  const products = competition.products || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2 sm:py-6">
      <AdminNav />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6dacd] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xl shrink-0">
            🍫
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2c1810]">
              Alfajores en Competencia ({products.length})
            </h1>
            <p className="text-xs text-[#786556]">
              Configurá las muestras, marcas, variedades e imágenes para la degustación.
            </p>
          </div>
        </div>
      </div>

      <AdminProductManager
        competitionId={competition.id}
        products={products}
      />
    </div>
  );
}
