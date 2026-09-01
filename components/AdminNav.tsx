"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/actions/competition";
import {
  LayoutDashboard,
  Users,
  Trophy,
  Settings,
  BarChart3,
  LogOut,
  Sliders,
} from "lucide-react";
import { clsx } from "clsx";

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/participants", label: "Participantes", icon: Users },
    { href: "/admin/products", label: "Alfajores", icon: Trophy },
    { href: "/admin/results", label: "Resultados", icon: BarChart3 },
    { href: "/admin/settings", label: "Ajustes", icon: Settings },
  ];

  const handleLogout = async () => {
    if (confirm("¿Cerrar sesión de administrador?")) {
      await adminLogout();
      router.push("/admin");
    }
  };

  return (
    <div className="bg-stone-900 text-stone-200 rounded-3xl p-2.5 sm:p-3 border border-stone-800 shadow-md mb-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm">
            👑
          </span>
          <span className="font-black text-xs sm:text-sm text-white hidden sm:inline">
            Panel Admin
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer touch-manipulation active:scale-95",
                  isActive
                    ? "bg-amber-400 text-amber-950 shadow-xs font-black"
                    : "text-stone-300 hover:text-white hover:bg-stone-800"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-red-400 px-2.5 py-1.5 rounded-xl hover:bg-stone-800 transition-colors cursor-pointer touch-manipulation"
          title="Cerrar sesión"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Salir</span>
        </button>
      </div>
    </div>
  );
}
