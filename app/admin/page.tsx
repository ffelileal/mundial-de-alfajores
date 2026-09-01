import { isAdminAuthenticated } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";

export default async function AdminLoginPage() {
  const isAuth = await isAdminAuthenticated();

  if (isAuth) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="min-h-[80vh] flex flex-col justify-between max-w-md mx-auto py-6 px-1">
      <div className="my-auto space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900 text-amber-400 border border-stone-700 font-black text-xs shadow-xs">
          <Lock className="w-3.5 h-3.5" />
          <span>ACCESO ADMINISTRATIVO</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-[#2c1810] tracking-tight">
            Panel de Control 👑
          </h1>
          <p className="text-xs sm:text-sm text-[#786556] max-w-xs mx-auto">
            Ingresá tu contraseña de organizador para gestionar el Mundial.
          </p>
        </div>

        <div className="chocolate-gradient text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/60 relative overflow-hidden">
          <div className="relative z-10">
            <AdminLoginForm />
          </div>
        </div>

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#786556] hover:text-[#54311c] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la portada de jugadores</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
