"use client";

import { logoutPlayer } from "@/actions/player";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function ClearPlayerButton() {
  const router = useRouter();

  const handleExit = async () => {
    if (confirm("¿Querés salir o cambiar de usuario? Tu progreso guardado en el Mundial no se perderá.")) {
      await logoutPlayer();
      router.push("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleExit}
      title="Cambiar de participante"
      className="text-stone-400 hover:text-[#54311c] p-2 rounded-xl hover:bg-[#efe6dc] transition-all cursor-pointer active:scale-90"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
