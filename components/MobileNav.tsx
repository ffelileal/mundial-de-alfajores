"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Trophy,
  BarChart3,
  BookOpen,
  LayoutDashboard,
  Users,
  Settings,
} from "lucide-react";
import { clsx } from "clsx";

export function MobileNav() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  const playerNavItems = [
    { href: "/play", label: "Mi Panel", icon: Home },
    { href: "/play", label: "Degustar", icon: Trophy },
    { href: "/play/results", label: "Resultados", icon: BarChart3 },
    { href: "/rules", label: "Reglas", icon: BookOpen },
  ];

  const adminNavItems = [
    { href: "/admin/dashboard", label: "Inicio", icon: LayoutDashboard },
    { href: "/admin/participants", label: "Amigos", icon: Users },
    { href: "/admin/products", label: "Alfajores", icon: Trophy },
    { href: "/admin/results", label: "Ranking", icon: BarChart3 },
    { href: "/admin/settings", label: "Ajustes", icon: Settings },
  ];

  const navItems = isAdminRoute ? adminNavItems : playerNavItems;

  return (
    <nav
      aria-label="Navegación móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#ffffff]/95 backdrop-blur-xl border-t border-[#e6dacd] px-1.5 pt-1.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div
        className={clsx(
          "grid gap-1 max-w-md mx-auto",
          isAdminRoute ? "grid-cols-5" : "grid-cols-4"
        )}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || (item.href !== "/" && item.href !== "/play" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all select-none touch-manipulation active:scale-90",
                isActive
                  ? "text-[#54311c] bg-[#efe6dc] font-black shadow-xs"
                  : "text-[#786556] hover:text-[#54311c]"
              )}
            >
              <Icon
                className={clsx(
                  "w-5 h-5 transition-transform",
                  isActive ? "text-[#54311c] scale-110" : "text-[#786556]"
                )}
              />
              <span className="text-[10px] tracking-tight mt-0.5 font-bold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
