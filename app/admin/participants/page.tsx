import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrCreateDefaultCompetition } from "@/actions/competition";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/AdminNav";
import { AdminParticipantList } from "@/components/AdminParticipantList";
import { Users, UserPlus } from "lucide-react";

export default async function AdminParticipantsPage() {
  const isAuth = await isAdminAuthenticated();

  if (!isAuth) {
    redirect("/admin");
  }

  const competition = await getOrCreateDefaultCompetition();
  const participants = competition.participants || [];
  const totalProducts = competition.products?.length || 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-2 sm:py-6">
      <AdminNav />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e6dacd] pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-xl shrink-0">
            👥
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#2c1810]">
              Participantes ({participants.length})
            </h1>
            <p className="text-xs text-[#786556]">
              Los jugadores se registran automáticamente con su nombre/alias en la portada.
            </p>
          </div>
        </div>
      </div>

      {/* Participant List */}
      <AdminParticipantList
        participants={participants}
        totalProducts={totalProducts}
      />
    </div>
  );
}
