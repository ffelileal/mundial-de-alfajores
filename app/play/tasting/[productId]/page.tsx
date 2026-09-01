import { getPlayerSession } from "@/lib/player-auth";
import { getOrCreateDefaultCompetition } from "@/actions/competition";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { TastingEvaluationForm } from "@/components/TastingEvaluationForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface TastingProductPageProps {
  params: Promise<{ productId: string }>;
}

export default async function PlayerTastingProductPage({ params }: TastingProductPageProps) {
  const { productId } = await params;
  const session = await getPlayerSession();

  if (!session?.participantId) {
    redirect("/");
  }

  const competition = await getOrCreateDefaultCompetition();

  if (competition.status === "PREPARATION") {
    redirect("/play");
  }

  if (competition.status === "FINISHED") {
    redirect("/play");
  }

  const participant = await prisma.participant.findUnique({
    where: { id: session.participantId },
    include: {
      evaluations: true,
    },
  });

  if (!participant) {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    where: { competitionId: competition.id },
    orderBy: { orderNumber: "asc" },
  });

  const product = products.find((p) => p.id === productId);

  if (!product) {
    redirect("/play");
  }

  // Check if current product is already evaluated
  const isEvaluated = participant.evaluations.some((e) => e.productId === product.id);

  const evaluatedIds = new Set(participant.evaluations.map((e) => e.productId));
  const unevaluated = products.filter((p) => !evaluatedIds.has(p.id));

  // If already evaluated, jump to first unevaluated or complete
  if (isEvaluated) {
    if (unevaluated.length > 0) {
      redirect(`/play/tasting/${unevaluated[0].id}`);
    } else {
      redirect("/play");
    }
  }

  const currentProductIndex = products.findIndex((p) => p.id === product.id) + 1;
  const nextProduct = unevaluated.find((p) => p.id !== product.id) || null;

  return (
    <div className="py-2 sm:py-6">
      <div className="max-w-xl mx-auto mb-3">
        <Link
          href="/play"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#786556] hover:text-[#54311c] px-2 py-1 rounded-lg hover:bg-[#efe6dc]/50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a mi panel</span>
        </Link>
      </div>

      <TastingEvaluationForm
        competitionId={competition.id}
        participant={{
          id: participant.id,
          name: participant.name,
          avatarEmoji: participant.avatarEmoji,
        }}
        product={{
          id: product.id,
          orderNumber: product.orderNumber,
          name: product.name,
          brand: product.brand,
          flavor: product.flavor,
          image: product.image,
          description: product.description,
        }}
        totalProducts={products.length}
        currentProductIndex={currentProductIndex}
        nextProductId={nextProduct?.id || null}
        blindTasting={competition.blindTasting}
        tasteWeight={competition.tasteWeight}
        packagingWeight={competition.packagingWeight}
      />
    </div>
  );
}
